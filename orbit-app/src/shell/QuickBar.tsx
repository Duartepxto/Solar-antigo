import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";
import { t } from "@/lib/i18n";
import { orbitShell, shellHasVoice, type ShellCapture } from "@/lib/orbit-shell";
import { stripPointTags } from "@/lib/orbit-point";
import { SolarPlanet } from "@/orbit/SolarPlanet";
import { ShellCharacter } from "./ShellCharacter";
import { interruptOrbit, ReplyFollower, resolveOrbitTarget, sendToOrbit, type OrbitTarget, type ReplyUpdate } from "./orbit-client";
import { useGuidePointer } from "./use-guide-pointer";

type Phase = "idle" | "sending" | "streaming" | "done";

const SOLAR = import.meta.env.VITE_JARVIS_SOLAR === "true";
// The shell page is shared with Orbit builds (orbit-shell.html keeps a neutral
// title); Solar names its floating windows here. main.tsx imports this module
// for every surface (quick, talk, overlay).
if (SOLAR && typeof document !== "undefined") document.title = "Solar";

/** The quick bar: the map's composer, floating over whatever app is in
 * front, with the reply streaming under it. */
export function QuickBar() {
  const shell = orbitShell();
  const [target, setTarget] = useState<OrbitTarget | null>(null);
  const [targetError, setTargetError] = useState(false);
  const [draft, setDraft] = useState("");
  const [screenPaused, setScreenPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [reply, setReply] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [error, setError] = useState<{ text: string; settings?: "screen" } | null>(null);
  const [pulse, setPulse] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<ReplyFollower | null>(null);
  const guide = useGuidePointer();
  const voice = shellHasVoice();

  const loadTarget = useCallback(() => {
    resolveOrbitTarget().then((next) => { setTarget(next); setTargetError(false); }, () => setTargetError(true));
  }, []);

  useEffect(() => {
    followerRef.current = new ReplyFollower();
    loadTarget();
    return () => followerRef.current?.close();
  }, [loadTarget]);

  useEffect(() => shell?.onQuickShown((info) => {
    setScreenPaused(info.screenPaused);
    loadTarget();
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }), [shell, loadTarget]);

  useEffect(() => shell?.onState((state) => {
    setScreenPaused(state.screenPaused);
  }), [shell]);

  // The window follows its content: one row, or the row and the reply.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !shell) return;
    const report = () => void shell.quickResize(Math.ceil(root.getBoundingClientRect().height));
    report();
    const observer = new ResizeObserver(report);
    observer.observe(root);
    return () => observer.disconnect();
  }, [shell]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        void shell?.quickHide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shell]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !target || phase === "sending") return;
    setError(null);
    setPhase("sending");
    setReply("");
    guide.reset();
    // Orbit sees the screen it was asked over, the way other assistants do:
    // no toggle. Paused or not allowed, the question still goes, without it.
    let capture: ShellCapture | null = null;
    if (shell && !screenPaused) {
      const result = await shell.capture();
      if (result.ok) capture = result;
      else if (result.reason === "denied") setError({ text: t("orbitShell.screen.deniedSent"), settings: "screen" });
    }
    const follower = followerRef.current;
    const onUpdate = (update: ReplyUpdate) => {
      setReply(update.text);
      guide.follow(update.text);
      if (update.done) {
        setPhase("done");
        setPulse((n) => n + 1);
        if (capture) void shell?.screenHeld(capture.displayId, false);
        if (update.timedOut) setError({ text: t("orbitShell.turnTimedOut", { name: target.name }) });
      } else setPhase("streaming");
    };
    try {
      follower?.follow(target.threadId, onUpdate);
      guide.setCapture(capture);
      if (capture) void shell?.screenHeld(capture.displayId, true);
      const sent = await sendToOrbit({ target, text, surface: "quick", capture });
      setThreadId(sent.threadId);
      setDraft("");
      // A retried send can land in the thread it was first sent to.
      if (sent.threadId !== target.threadId) follower?.follow(sent.threadId, onUpdate);
      follower?.accept();
    } catch (cause) {
      follower?.stop();
      if (capture) void shell?.screenHeld(capture.displayId, false);
      setPhase("idle");
      setError({ text: t("orbitShell.quick.sendFailed", { error: cause instanceof Error ? cause.message : String(cause) }) });
    }
  };

  const stop = () => {
    if (!target) return;
    void interruptOrbit(target, threadId ?? target.threadId).catch(() => {});
    followerRef.current?.stop();
    guide.reset();
    void shell?.screenHeld(null, false);
    setPhase("done");
  };

  // talk instead of typing: the bar goes, the talk character comes
  const talkInstead = () => {
    void shell?.quickHide().then(() => shell.talkSummon());
  };

  const openInOrbit = () => {
    if (!target) return;
    void shell?.openThread({ botId: target.botId, threadId: threadId ?? target.threadId });
  };

  const running = phase === "sending" || phase === "streaming";
  const shown = stripPointTags(reply);
  const name = target?.name ?? (SOLAR ? "Jarvis" : "Orbit");
  // Solar: the assistant is the system's sun, named in Solar's gold.
  const color = SOLAR ? "#eac185" : target?.color ?? "#009957";

  const bar = (
    <div className="flex h-[52px] shrink-0 items-center gap-2 rounded-[26px] bg-composer px-1.5 shadow-[0_12px_40px_rgba(0,0,0,.45)]">
      <div className="flex h-[40px] items-center gap-1.5 whitespace-nowrap rounded-[20px] bg-black/25 pl-1 pr-3 text-[13px] font-medium">
        {SOLAR
          ? <span className="shell-solar-face" data-busy={running || undefined} style={{ width: 32, height: 32 }}><SolarPlanet kind="sun" /></span>
          : <ShellCharacter color={color} mood={running ? "thinking" : "idle"} size={32} mini pulse={pulse} />}
        <span style={{ color }}>{name}</span>
      </div>
      <input
        ref={inputRef}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            void send();
          }
        }}
        placeholder={t("orbit.composer.placeholder", { name })}
        aria-label={t("composer.placeholder.bot", { name })}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/50"
      />
      {/* talk needs a voice engine: none on Windows yet */}
      {!running && shell && voice && (
        <button type="button" onClick={talkInstead} aria-label={t("orbitShell.quick.talk")} title={t("orbitShell.quick.talk")}
          className="flex size-[40px] items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.08] hover:text-ink">
          <Mic size={17} />
        </button>
      )}
      {running ? (
        <button type="button" onClick={stop} aria-label={t("orbitShell.quick.stop")}
          className="flex size-[40px] items-center justify-center rounded-full bg-ink">
          <Square size={13} className="fill-app text-app" />
        </button>
      ) : (
        <button type="button" onClick={() => void send()} disabled={!draft.trim() || !target} aria-label={t("chat.send")}
          className="flex size-[40px] items-center justify-center rounded-full bg-ink disabled:opacity-50">
          <ArrowUp size={16} className="text-app" />
        </button>
      )}
    </div>
  );

  // Anchored at the bottom of the screen: the reply grows upward above the bar.
  return (
    <div ref={rootRef} className={`flex flex-col justify-end gap-2 px-1 pb-1 text-ink${SOLAR ? " solar-quick" : ""}`}>
      {(phase !== "idle" || shown || error || (targetError && !target)) && (
        <div className="flex min-h-0 flex-col rounded-[18px] bg-composer shadow-[0_12px_40px_rgba(0,0,0,.45)]">
          {targetError && !target && <div className="px-4 pt-3 text-[12.5px] text-ink/60">{t("orbitShell.quick.noAgent")}</div>}
          {error && (
            <div className="flex items-center gap-3 px-4 pt-3 text-[12.5px] text-ink/60">
              <span className="min-w-0 flex-1">{error.text}</span>
              {error.settings && (
                <button type="button" onClick={() => void window.ogb?.permOpenSettings?.(error.settings!)}
                  className="shrink-0 rounded-lg bg-ink/[0.08] px-2.5 py-1 text-[12px] text-ink hover:bg-ink/[0.12]">
                  {t("orbitShell.openSystemSettings")}
                </button>
              )}
            </div>
          )}
          {(phase !== "idle" || shown) && <>
            <div className="max-h-[360px] overflow-y-auto px-4 py-3 text-[14px] leading-[1.55] text-ink/90 whitespace-pre-wrap chat-text">
              {shown || <span className="text-ink/50">{t(phase === "done" ? "orbitShell.quick.noReply" : "orbitShell.quick.working", { name })}</span>}
            </div>
            <div className="flex h-[36px] items-center justify-end px-2 pb-1">
              <button type="button" onClick={openInOrbit}
                className="rounded-lg px-2.5 py-1 text-[12.5px] font-medium text-ink/70 hover:bg-ink/[0.06] hover:text-ink">
                {t("orbitShell.quick.openInOrbit")}
              </button>
            </div>
          </>}
        </div>
      )}
      {bar}
    </div>
  );
}
