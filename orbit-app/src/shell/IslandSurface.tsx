import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, FileText, Image as ImageIcon, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { t } from "@/lib/i18n";
import { orbitShell } from "@/lib/orbit-shell";
import { speakableText, stripPointTags } from "@/lib/orbit-point";
import { speaker } from "@/lib/tts";
import { offersIn, type ArtifactOffer } from "@/orbit/artifacts";
import { solarActivity } from "@/orbit/solar-state";
import { loadSolarSkins } from "@/orbit/solar-skins";
import { SolarPlanet } from "@/orbit/SolarPlanet";
import { useSolarDictation } from "@/orbit/useSolarDictation";
import { ReplyFollower, sendToOrbit, type OrbitTarget, type ReplyUpdate } from "./orbit-client";
import "@/orbit/solar-island.css";
import "./island-surface.css";

// The same switch as the in-app island, so "read aloud" is one choice.
const SPEAK_KEY = "jarvis.solar.island.speak";
const readSpeak = () => { try { return localStorage.getItem(SPEAK_KEY) !== "0"; } catch { return true; } };
// While the island is on screen the team is looked at this often.
const POLL_MS = 3_000;
const MESSAGES_PER_BOT = 40;

type WireMessage = { id: string; role?: string; kind?: string; text?: string; at?: number; tool?: { name?: string; ok?: boolean } };
export type IslandBot = {
  id: string; name: string; threadId: string; hidden?: boolean; system?: string;
  busy?: boolean; activity?: string; voice?: string; messages?: WireMessage[];
};

/** The Sun, found as the map finds it (solarNodes): a visible bot named
 * Jarvis, else the built-in assistant. */
export function islandSun(bots: readonly IslandBot[]): IslandBot | null {
  const visible = bots.filter((bot) => !bot.hidden && bot.system !== "orbit");
  return visible.find((bot) => /^jarvis(?:\s|$)/i.test(bot.name)) ?? bots.find((bot) => bot.system === "orbit") ?? null;
}

/** What a busy bot is running now, as the map reads it (model.runningTool). */
function runningTool(bot: IslandBot): string | null {
  const messages = bot.messages ?? [];
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]!;
    if (message.role === "user") return null;
    if (message.kind === "activity" && message.tool) return message.tool.ok === undefined ? message.tool.name ?? null : null;
  }
  return null;
}

function Face({ id, kind, size }: { id: string; kind: "sun" | "planet"; size: number }) {
  const skins = loadSolarSkins();
  return <span className="shell-solar-face solar-island-sun" style={{ width: size, height: size }}>
    {kind === "sun" ? <SolarPlanet kind="sun" /> : <SolarPlanet kind={skins.moons[id] ? "moon" : "planet"} skin={skins.moons[id] ?? skins.planets[id] ?? "earth"} />}
  </span>;
}

/**
 * Jarvis's island outside the app (Alt+J, Solar): the pill in the top-right
 * corner with the Sun and a live line, opening into the panel the app's own
 * island had: talk to Jarvis, who is working, the pages agents shared.
 * Store-less: it reads the team over `/api/bots` and follows Jarvis's reply
 * the way the quick bar does.
 */
export function IslandSurface() {
  const shell = orbitShell();
  const [bots, setBots] = useState<IslandBot[]>([]);
  const [connected, setConnected] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [speak, setSpeak] = useState(readSpeak);
  const [asked, setAsked] = useState<{ id: number; question: string } | null>(null);
  const [reply, setReply] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "streaming" | "done">("idle");
  const [failed, setFailed] = useState<string | null>(null);
  const followerRef = useRef<ReplyFollower | null>(null);
  const spoken = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);

  const sun = useMemo(() => islandSun(bots), [bots]);
  const voice = useSolarDictation(draft, setDraft, sun?.id);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/bots?messages=${MESSAGES_PER_BOT}`);
      if (!res.ok) throw new Error(String(res.status));
      const body = await res.json() as { bots?: IslandBot[] };
      setBots(Array.isArray(body.bots) ? body.bots : []);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    followerRef.current = new ReplyFollower();
    return () => followerRef.current?.close();
  }, []);

  useEffect(() => shell?.onVisibility((next) => setVisible(next)), [shell]);
  // looked at only while on screen
  useEffect(() => {
    if (!visible) return;
    void refresh();
    const timer = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(timer);
  }, [visible, refresh]);
  // gone: back to the pill, and the microphone is let go
  useEffect(() => {
    if (visible) return;
    setOpen(false);
    voice.cancel();
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Alt+J: the pill comes, then opens into the panel
  useEffect(() => shell?.onIslandShown?.(() => {
    setOpen(false);
    void refresh();
    setTimeout(() => setOpen(true), 90);
  }), [shell, refresh]);
  // the window follows: the pill's size, or the panel's, in the corner
  useEffect(() => { void shell?.islandOpen?.(open); }, [shell, open]);
  useEffect(() => { if (open) requestAnimationFrame(() => input.current?.focus()); }, [open]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (voice.listening) voice.cancel();
      void shell?.islandHide?.();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [shell, voice]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const send = async (text: string, spokenAloud: boolean) => {
    const message = text.trim();
    if (!sun || !message || phase === "sending") return;
    const target: OrbitTarget = { botId: sun.id, threadId: sun.threadId, name: sun.name, color: "#eac185", voice: sun.voice, dedicated: true };
    const id = Date.now();
    setAsked({ id, question: message });
    setReply("");
    setFailed(null);
    setPhase("sending");
    setDraft("");
    const follower = followerRef.current;
    const onUpdate = (update: ReplyUpdate) => {
      setReply(update.text);
      setPhase(update.done ? "done" : "streaming");
    };
    try {
      follower?.follow(target.threadId, onUpdate);
      // spoken: Jarvis keeps it short (the built-in assistant reads `surface`)
      const sent = await sendToOrbit({ target, text: message, surface: spokenAloud ? "talk" : "quick" });
      if (sent.threadId !== target.threadId) follower?.follow(sent.threadId, onUpdate);
      follower?.accept();
    } catch (cause) {
      follower?.stop();
      setPhase("idle");
      setFailed(t("orbitShell.quick.sendFailed", { error: cause instanceof Error ? cause.message : String(cause) }));
    }
  };

  // Talking ends the moment the person stops: what was heard goes to Jarvis.
  const wasListening = useRef(false);
  useEffect(() => {
    if (wasListening.current && !voice.listening && draft.trim()) void send(draft, true);
    wasListening.current = voice.listening;
  }, [voice.listening]); // eslint-disable-line react-hooks/exhaustive-deps

  // the settled answer, read aloud once in Jarvis's own voice
  const shown = stripPointTags(reply);
  useEffect(() => {
    if (!speak || !sun || !asked || phase !== "done" || !reply.trim() || spoken.current === asked.id) return;
    spoken.current = asked.id;
    void speaker.speak(speakableText(reply), { botId: sun.id, voiceId: sun.voice });
  }, [speak, sun, asked, phase, reply]);

  const team = useMemo(() => bots.filter((bot) => !bot.hidden && bot.system !== "orbit"), [bots]);
  const busy = useMemo(() => team
    .filter((bot) => bot.busy || bot.activity === "working" || bot.activity === "waiting-on-you")
    .map((bot) => ({ bot, waiting: bot.activity === "waiting-on-you", tool: runningTool(bot) })), [team]);
  const pages = useMemo(() => {
    const found: Array<ArtifactOffer & { at: number; name: string }> = [];
    for (const bot of bots) {
      for (const message of (bot.messages ?? []).slice(-MESSAGES_PER_BOT)) {
        for (const offer of offersIn(bot, { id: message.id, role: message.role as "bot", kind: message.kind as "text", text: message.text })) {
          if (offer.kind !== "screen") found.push({ ...offer, at: message.at ?? 0, name: bot.name });
        }
      }
    }
    return found.sort((a, b) => b.at - a.at).slice(0, 4);
  }, [bots]);
  const freshPage = pages[0] && Date.now() - pages[0].at < 5 * 60_000;

  const replying = phase === "sending" || phase === "streaming";
  const activity = (entry: typeof busy[number]) => entry.waiting ? t("jarvis.island.needsYou") : t(`jarvis.island.activity.${solarActivity(entry.tool)}`);
  const status = voice.listening ? t("jarvis.island.listening")
    : replying ? t("jarvis.island.replying")
    : busy.length === 1 ? `${busy[0]!.bot.name} · ${activity(busy[0]!)}`
    : busy.length > 1 ? t("jarvis.island.working", { count: busy.length })
    : freshPage ? t("jarvis.island.newPage") : "Jarvis";
  const tone = voice.listening ? "listening" : replying ? "replying" : busy.some((entry) => entry.waiting) ? "waiting" : busy.length ? "working" : "idle";
  const toggleSpeak = () => {
    const next = !speak;
    setSpeak(next);
    try { localStorage.setItem(SPEAK_KEY, next ? "1" : "0"); } catch { /* per session */ }
    if (!next) speaker.stop();
  };
  const openPage = (page: ArtifactOffer) => {
    setOpen(false);
    void shell?.openPage?.({ key: page.key, botId: page.botId, threadId: page.threadId, messageId: page.messageId, href: page.href, file: page.file, kind: page.kind });
  };
  const openBot = (bot: IslandBot) => {
    setOpen(false);
    void shell?.openThread({ botId: bot.id, threadId: bot.threadId });
  };

  return <div className="shell-island">
    <div ref={root} className="solar-island" data-open={open || undefined} data-tone={tone}>
      <button type="button" className="solar-island-pill shell-island-glass" aria-expanded={open} aria-haspopup="dialog" aria-label={t("jarvis.island.open")} title={`${t("jarvis.island.open")} · Alt+J`} onClick={() => setOpen((value) => !value)}>
        <Face id={sun?.id ?? "jarvis-home"} kind="sun" size={28} />
        {tone === "listening" ? <span className="solar-island-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span> : tone !== "idle" && <span className="solar-island-dot" aria-hidden="true" />}
        <span className="solar-island-status" key={status}>{status}</span>
      </button>
      {open && <div className="solar-island-panel solar-menu shell-island-glass" role="dialog" aria-label={t("jarvis.island.open")}>
        <header className="solar-island-head">
          <Face id={sun?.id ?? "jarvis-home"} kind="sun" size={46} />
          <span><strong>Jarvis</strong><small>{busy.length ? t("jarvis.island.working", { count: busy.length }) : t("jarvis.island.quiet")}</small></span>
          <button type="button" className="solar-island-icon" aria-pressed={speak} onClick={toggleSpeak} title={t("jarvis.island.speakReplies")} aria-label={t("jarvis.island.speakReplies")}>{speak ? <Volume2 size={15} /> : <VolumeX size={15} />}</button>
        </header>

        <section className="solar-island-voice">
          {(asked || voice.listening) && <div className="solar-island-transcript">
            {asked && <p className="solar-island-you">{asked.question}</p>}
            {voice.listening && <p className="solar-island-you solar-island-live">{draft || t("jarvis.island.listening")}</p>}
            {shown ? <p className="solar-island-answer">{shown.length > 420 ? shown.slice(0, 420) + "…" : shown}</p>
              : replying && <p className="solar-island-answer solar-island-thinking">{t("jarvis.island.replying")}</p>}
          </div>}
          <form className="solar-island-ask" onSubmit={(event) => { event.preventDefault(); void send(draft, false); }}>
            <button type="button" className="solar-island-mic" data-listening={voice.listening || undefined} onClick={voice.toggle} disabled={!sun} aria-pressed={voice.listening}
              aria-label={voice.listening ? t("jarvis.island.stopAndSend") : t("jarvis.island.talk")} title={voice.listening ? t("jarvis.island.stopAndSend") : t("jarvis.island.talk")}>
              {voice.listening ? <Square size={13} /> : <Mic size={17} />}
            </button>
            <input ref={input} value={draft} onChange={(event) => setDraft(event.target.value)} readOnly={voice.listening} placeholder={t("jarvis.island.placeholder")} aria-label={t("jarvis.island.placeholder")} />
            <button type="submit" className="solar-island-send" disabled={!draft.trim() || !sun || !connected || voice.listening || phase === "sending"} aria-label={t("jarvis.solar.send")}><ArrowUp size={14} /></button>
          </form>
          {voice.error && <p className="solar-island-error" role="alert">{t(`jarvis.solar.voice.${voice.error === "unsupported" ? "unavailable" : ["not-allowed", "service-not-allowed"].includes(voice.error) ? "permission" : voice.error === "no-speech" ? "noSpeech" : "error"}`)}</p>}
          {failed && <p className="solar-island-error" role="alert">{failed}</p>}
          {!sun && connected && <p className="solar-island-error">{t("orbitShell.quick.noAgent")}</p>}
        </section>

        <section className="solar-island-section">
          <h3>{t("jarvis.island.activity")}</h3>
          {busy.length ? busy.slice(0, 5).map((entry) => <button key={entry.bot.id} type="button" className="solar-island-row" onClick={() => openBot(entry.bot)}>
            <Face id={entry.bot.id} kind="planet" size={22} /><span>{entry.bot.name}</span><small data-waiting={entry.waiting || undefined}>{activity(entry)}</small>
          </button>) : <p className="solar-island-empty">{t("jarvis.island.quiet")}</p>}
        </section>

        <section className="solar-island-section">
          <h3>{t("jarvis.island.pages")}</h3>
          {pages.length ? pages.map((page) => <button key={page.key} type="button" className="solar-island-row" onClick={() => openPage(page)}>
            {page.kind === "image" ? <ImageIcon size={15} /> : <FileText size={15} />}<span>{page.file.split("/").at(-1)}</span><small>{page.name}</small>
          </button>) : <p className="solar-island-empty">{t("jarvis.island.noPages")}</p>}
        </section>
      </div>}
    </div>
  </div>;
}
