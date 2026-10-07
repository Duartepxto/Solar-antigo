// "Wants to show you" on the canvas (Orbit prototype: the offer pill and the
// artifact card). The pill follows its bot around the map, its arrow pointing
// back at it (the scene places it every frame); View puts the file on the
// canvas as a card in world units, beside the bot's team.
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { ArrowUp, FileCode2, FileText, Image as ImageIcon, Monitor, Navigation2, X } from "lucide-react";

import { transitionComputerControlLease } from "@/lib/computer-control";
import { t } from "@/lib/i18n";
import { api, useStore } from "@/state/store";
import { OrbitFace } from "./OrbitFace";
import { artifactUrl, offersIn, requestPresent, type Artifact, type ArtifactKind, type ArtifactOffer } from "./artifacts";
import type { Bot, Message } from "@/state/store";

const KIND_ICON = { html: FileCode2, pdf: FileText, image: ImageIcon, screen: Monitor } satisfies Record<ArtifactKind, unknown>;
// the kind's badge ("IMAGE", "LIVE SCREEN"…), translated with the rest of the line
const kindLabel = (kind: ArtifactKind) => t(`orbit.offer.kind.${kind}`);

/** The pill beside a bot with a file to show. */
export function OfferPill({ offer, name, color, pillRef, onFly, onView, onLater, solar = false }: {
  offer: ArtifactOffer; name: string; color: string; pillRef: RefObject<HTMLDivElement | null>;
  onFly: () => void; onView: () => void; onLater: () => void;
  solar?: boolean;
}) {
  const Icon = KIND_ICON[offer.kind];
  return (
    <div ref={pillRef} data-orbit-offer className={solar ? "absolute bottom-24 left-6 z-[21]" : "absolute left-0 top-0 z-[21] will-change-transform"} style={{ visibility: solar ? "visible" : "hidden" }}>
      <div data-arrow className="pointer-events-none absolute left-1/2 top-1/2 size-0">
        <Navigation2 size={16} aria-hidden className="absolute -left-2 -top-2" fill={color} stroke={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </div>
      <div role="button" tabIndex={0} onClick={onFly} onKeyDown={(e) => e.key === "Enter" && e.target === e.currentTarget && onFly()}
        title={t("orbit.offer.go", { name })} aria-label={t("orbit.offer.aria", { name, file: offer.file })}
        className="flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-[15px] bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] p-[3px]"
        style={{ border: `1px solid ${color}66`, boxShadow: "0 10px 28px rgba(0,0,0,.55), 0 0 0 3px rgba(0,0,0,.25)" }}>
        <OrbitFace id={offer.botId} size={24} />
        <span className="flex items-center gap-1.5 text-[12px] text-ink/70">
          <b className="font-semibold" style={{ color }}>{name}</b>
          <Icon size={12} className="text-ink/60" aria-hidden />
          <span className="font-medium text-ink/90">{offer.file}</span>
        </span>
        <button type="button" onClick={(e) => { e.stopPropagation(); onView(); }}
          className="h-[22px] rounded-[11px] bg-ink px-2.5 text-[11.5px] font-semibold text-app">{t("orbit.offer.view")}</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onLater(); }} title={t("orbit.offer.later")} aria-label={t("orbit.offer.later")}
          className="flex size-[22px] items-center justify-center rounded-[11px] hover:bg-ink/[0.08]">
          <X size={11} className="text-ink/60" />
        </button>
      </div>
    </div>
  );
}

/** A file a bot put on the canvas: its header (who is showing what) and the
 * file itself. Dragged by the header on the map; in the bot's view it fills
 * the stage beside the chat. */
export function ArtifactCard({ art, name, color, shown, visible, onDrag, onTalk, onClose, onFront, onReply, onOpenDesktop, stageRect }: {
  art: Artifact; name: string; color: string;
  /** full size in the bot's view (not draggable, no Talk button) */
  shown: boolean;
  visible: boolean;
  stageRect?: CSSProperties;
  onDrag: (dx: number, dy: number) => void;
  onTalk: () => void;
  onClose: () => void;
  onFront: () => void;
  /** the bar under the card: a message to the bot, about what it shows;
   * `from` is where it leaves (the orb flies from there) */
  onReply: (text: string, from: DOMRect) => void;
  /** a live screen you hold: drive it in the bot's desktop viewer */
  onOpenDesktop: () => void;
}) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  const down = (e: ReactPointerEvent) => {
    if (shown || (e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* the pointer already ended */ }
    drag.current = { x: e.clientX, y: e.clientY };
    onFront();
  };
  const move = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    onDrag(e.clientX - d.x, e.clientY - d.y);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const op = shown || visible ? 1 : 0;
  // "{name} is showing you", with the name in the bot's colour
  const showing = t("orbit.offer.showing", { name: "\u0001" }).split("\u0001");
  return (
    <div data-art={art.key} className="absolute flex flex-col gap-3 transition-opacity duration-300"
      style={{ left: art.x, top: art.y, width: art.w, height: art.h, ...stageRect, opacity: op, pointerEvents: op ? "auto" : "none" }}>
      <div onPointerDown={down} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
        className="flex h-[34px] select-none items-center gap-2.5" style={{ cursor: shown ? "default" : "grab" }}>
        <OrbitFace id={art.botId} size={34} />
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-2">
          <span className="text-[15px] text-ink/70">
            {showing[0]}<b className="font-semibold" style={{ color }}>{name}</b>{showing[1]}
          </span>
          <span className="text-[16px] font-semibold text-ink">{art.file}</span>
          <span className="rounded-[9px] border border-ink/[0.14] px-[7px] py-px font-mono text-[11px] text-ink/50">{kindLabel(art.kind)}</span>
        </div>
        {!shown && (
          <button type="button" onClick={onTalk}
            className="h-[30px] rounded-[15px] border border-ink/[0.14] px-3 text-[13px] font-medium text-ink hover:bg-ink/[0.06]">
            {t("orbit.offer.talk", { name })}
          </button>
        )}
        <button type="button" onClick={onClose} title={t("common.close")} aria-label={t("common.close")}
          className="flex size-[30px] items-center justify-center rounded-[15px] hover:bg-ink/[0.08]">
          <X size={15} className="text-ink/80" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-ink/[0.12] bg-[#0c0c0e] shadow-[0_30px_70px_rgba(0,0,0,.55)]">
        {art.kind === "screen" ? <LiveScreen art={art} name={name} color={color} onOpenDesktop={onOpenDesktop} /> : <ArtifactBody art={art} />}
      </div>
      <ReplyBar name={name} onSend={onReply} />
    </div>
  );
}

/** "Reply to {name}" under every card (prototype: the card's composer). */
function ReplyBar({ name, onSend }: { name: string; onSend: (text: string, from: DOMRect) => void }) {
  const [draft, setDraft] = useState("");
  const barRef = useRef<HTMLDivElement>(null);
  const send = () => {
    const text = draft.trim();
    if (!text || !barRef.current) return;
    onSend(text, barRef.current.getBoundingClientRect());
    setDraft("");
  };
  return (
    <div ref={barRef} className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-[23px] bg-[color-mix(in_srgb,var(--color-field,#2f2f2f)_85%,transparent)] py-0 pl-4 pr-1.5">
      <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) send(); }}
        placeholder={t("orbit.offer.reply", { name })} aria-label={t("orbit.offer.reply", { name })}
        className="min-w-0 flex-1 border-0 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink/45" />
      <button type="button" onClick={send} disabled={!draft.trim()} aria-label={t("orbit.offer.send")}
        className="flex size-[34px] items-center justify-center rounded-[17px] bg-ink text-app disabled:opacity-40">
        <ArrowUp size={16} />
      </button>
    </div>
  );
}

/** The bot's computer as it works: the frames it streams, and the hand-over.
 * Take control pauses the bot (the same lease as its Computer panel); while
 * you hold it, its desktop viewer is one click away. */
function LiveScreen({ art, name, color, onOpenDesktop }: { art: Artifact; name: string; color: string; onOpenDesktop: () => void }) {
  const { state, dispatch } = useStore();
  const frame = state.screens[art.botId];
  const bot = state.bots.find((b) => b.id === art.botId);
  const control = state.computerControl[art.botId] ?? { held: false, helpReason: null };
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const live = Boolean(bot?.busy && frame && !control.held);
  // Orbit lost its server: the picture is the last one, and says so
  const offline = !state.connected;
  // who is driving: SSE keeps it fresh; a card on the canvas after a reload
  // asks once, as the Computer panel does
  useEffect(() => {
    const ctl = new AbortController();
    api(`/api/bots/${art.botId}/computer/control`, { signal: ctl.signal })
      .then((snap) => dispatch({ type: "computerControl", botId: art.botId, held: snap.held === true, helpReason: typeof snap.helpReason === "string" ? snap.helpReason : null }))
      .catch(() => {});
    return () => ctl.abort();
  }, [art.botId, dispatch]);
  const toggle = async () => {
    setPending(true);
    setError("");
    try {
      await transitionComputerControlLease({
        action: control.held ? "release" : "take",
        syncNativeBrowser: true,
        requestControl: async (action) => {
          const snap = await api(`/api/bots/${art.botId}/computer/control`, { method: "POST", body: JSON.stringify({ action }) });
          const next = { held: snap.held === true, helpReason: typeof snap.helpReason === "string" ? snap.helpReason : null };
          dispatch({ type: "computerControl", botId: art.botId, ...next });
          return next;
        },
        // the engine owns its browser: there is no native surface to pause
        setNativeBrowserControl: async () => true,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="relative size-full overflow-hidden bg-[linear-gradient(160deg,#1b2233_0,#0e1118_70%)]">
      {frame
        ? <img src={`data:${frame.mime};base64,${frame.png}`} alt={t("computer.screenOf", { name })} className="absolute inset-0 size-full object-contain" draggable={false} />
        : <div className="absolute inset-0 flex items-center justify-center text-[13px] text-ink/55">{t("orbit.offer.screenWaiting")}</div>}
      <div className="absolute inset-x-0 top-0 flex h-6 items-center gap-3.5 bg-black/40 px-3 text-[11.5px] text-ink/70">
        <b className="font-semibold text-ink">{art.file}</b>
        <span className="flex-1" />
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full" style={{ background: offline ? "#ff9800" : live ? "#38d591" : "rgba(252,252,252,.4)" }} />
          {offline ? t("orbit.offer.reconnecting") : live ? t("orbit.offer.live") : t("orbit.offer.paused")}
        </span>
      </div>
      <button type="button" onClick={() => void toggle()} disabled={pending}
        className="absolute right-3.5 top-[34px] z-[2] h-7 rounded-[14px] bg-ink px-3 text-[12px] font-semibold text-app disabled:opacity-60">
        {control.held ? t("orbit.offer.handBack") : t("computer.takeControl")}
      </button>
      {offline && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center gap-2 bg-black/50 text-[13px] text-white animate-rise">
          <span className="size-[7px] rounded-full bg-[#ff9800]" />{t("orbit.offer.reconnecting")}
        </div>
      )}
      {!offline && (control.held || error) && (
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2.5 bg-black/50 px-6 text-center text-[13px] text-white animate-rise">
          {error ? <span role="alert" className="text-[#ff8a96]">{error}</span> : <>
            <span className="flex items-center gap-2"><span className="size-[7px] rounded-full" style={{ background: "#38d591" }} />{t("orbit.offer.held", { name })}</span>
            <button type="button" onClick={onOpenDesktop}
              className="h-[30px] rounded-[15px] border border-white/25 px-3 text-[12.5px] font-medium hover:bg-white/10" style={{ borderColor: `${color}88` }}>
              {t("orbit.offer.openDesktop")}
            </button>
          </>}
        </div>
      )}
    </div>
  );
}

/** The file: fetched through the message it was shared in, then shown in a
 * sandboxed frame (HTML, PDF) or as an image. */
function ArtifactBody({ art }: { art: Artifact }) {
  const [src, setSrc] = useState<{ url: string; html?: string } | { error: string } | null>(null);
  useEffect(() => {
    const ctl = new AbortController();
    let url: string | null = null;
    setSrc(null);
    artifactUrl(art, ctl.signal)
      .then(async (u) => {
        url = u;
        // An opaque sandbox cannot reliably navigate a parent-origin blob
        // on every embedded browser. HTML remains in the same sandbox, but
        // its actual shared bytes are supplied through srcdoc instead.
        const html = art.kind === "html" ? await fetch(u, { signal: ctl.signal }).then(r => r.text()) : undefined;
        if (!ctl.signal.aborted) setSrc({ url: u, html });
      })
      .catch((error: unknown) => { if (!ctl.signal.aborted) setSrc({ error: error instanceof Error ? error.message : String(error) }); });
    return () => { ctl.abort(); if (url) URL.revokeObjectURL(url); };
  }, [art.threadId, art.messageId, art.href]);
  if (!src) return <div className="flex h-full items-center justify-center text-[13px] text-ink/50">{t("orbit.offer.loading")}</div>;
  if ("error" in src) return <div role="alert" className="flex h-full items-center justify-center px-6 text-center text-[13px] text-ink/60">{t("orbit.offer.failed", { error: src.error })}</div>;
  if (art.kind === "image") return <img src={src.url} alt={art.file} className="size-full object-contain" draggable={false} />;
  // no allow-same-origin: the page runs in its own opaque origin, away from Orbit's API
  return (
    <iframe src={src.html === undefined ? src.url : undefined} srcDoc={src.html} title={art.file} className="block size-full border-0 bg-white"
      {...(art.kind === "html" ? { sandbox: "allow-scripts allow-popups" } : {})} />
  );
}

/** Under a bot message that links a file the canvas can show: a row that
 * puts it there (prototype: the chat's file message, "open on the canvas"). */
export function CanvasFileRows({ bot, message, color }: { bot: Pick<Bot, "id" | "threadId">; message: Pick<Message, "id" | "role" | "kind" | "text">; color: string }) {
  const offers = offersIn(bot, message);
  if (!offers.length) return null;
  return (
    <div className="mt-2 flex flex-col items-start gap-1.5">
      {offers.map((offer) => {
        const Icon = KIND_ICON[offer.kind];
        return (
          <button key={offer.key} type="button" onClick={() => requestPresent(offer)}
            className="flex items-center gap-2.5 rounded-xl border border-ink/[0.12] py-2 pl-2.5 pr-3 text-left hover:bg-ink/[0.05]">
            <Icon size={18} style={{ color }} aria-hidden />
            <span className="flex flex-col gap-px">
              <span className="text-[13.5px] font-medium text-ink">{offer.file}</span>
              <span className="text-[11.5px] text-ink/50">{t("orbit.offer.openOnCanvas", { kind: kindLabel(offer.kind) })}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
