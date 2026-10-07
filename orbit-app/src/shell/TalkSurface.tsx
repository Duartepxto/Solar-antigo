import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { X, Mic, Square, Send } from "lucide-react";
import { solarSpeechBridge } from "@/lib/solar-voice";
import { t } from "@/lib/i18n";
import { orbitShell, type ShellCapture, type ShellCaptureResult } from "@/lib/orbit-shell";
import { speakableText } from "@/lib/orbit-point";
import { speaker } from "@/lib/tts";
import type { Mood } from "@/orbit/characters";
import { SolarPlanet } from "@/orbit/SolarPlanet";
import { ShellCharacter } from "./ShellCharacter";
import { interruptOrbit, ReplyFollower, resolveOrbitTarget, sendToOrbit, type OrbitTarget } from "./orbit-client";
import { useGuidePointer } from "./use-guide-pointer";
import { IslandPointer } from "./island-hover";
import { ISLAND, islandRadius, islandSize, lookLevel, overIsland, virtualNotch, type IslandLook } from "./island-geometry";
import { islandMotion, islandTransition, MOTION } from "./island-motion";

type Phase = "idle" | "listening" | "thinking" | "talking" | "sleepy";

const MOOD: Record<Phase, Mood> = {
  idle: "idle",
  // attentive: eyes on you while you speak
  listening: "focused",
  thinking: "thinking",
  talking: "talking",
  sleepy: "sleepy",
};
// It goes away once it has answered, until it's summoned again (the
// owner's call); a notice it needs you to read stays a little longer.
const GONE_AFTER_MS = 2_500;
// The island shrinks back into the notch before the window goes.
const CLOSE_MS = 320;
const NOTICE_STAYS_MS = 15_000;
// Listening ends on its own after this much quiet once you have said
// something, and after a minute whatever happens. Long enough to stop and
// think mid-explanation without being cut off (1.2 s did).
const TALK_ENDPOINT_MS = 2_200;
// How long a question waits for the screen capture still being taken.
const CAPTURE_WAIT_MS = 3_000;
const LISTEN_MAX_MS = 60_000;
// After "that's all", the recognizer's last word should come quickly.
const FINISH_GRACE_MS = 8_000;
const ORBIT_GREEN = "#009957";
const SOLAR = import.meta.env.VITE_JARVIS_SOLAR === "true";
// the island's sound bars and thinking dot: Orbit's green, Solar's gold
const SIGNAL = SOLAR ? "bg-[#eac185]" : "bg-[#3ee09a]";

interface Notice { text: string; settings?: "screen" | "mic" | "speech" }

/** Speak through the agent's voice (POST /api/tts/speak via the shared
 * speaker); with no voice set up, the Mac's own voice says it instead. */
async function say(text: string, voice: string | undefined): Promise<void> {
  if (!text) return;
  await speaker.speak(text, { voiceId: voice });
  if (!speaker.state.error) return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  await new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

/** Sound bars beside the character: the voice's own level while Orbit
 * speaks, a steady sway while it listens. */
function Bars({ level, active }: { level?: () => number | undefined; active: boolean }) {
  const bars = useRef<Array<HTMLSpanElement | null>>([]);
  useEffect(() => {
    if (!level) return;
    let frame = 0;
    const tick = () => {
      const value = Math.min(1, Math.max(0, level() ?? 0));
      bars.current.forEach((bar, i) => {
        if (!bar) return;
        const shape = [0.55, 0.85, 1, 0.8, 0.5][i] ?? 0.6;
        bar.style.transform = `scaleY(${0.18 + value * shape * 0.82})`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [level]);
  return (
    <span className="flex h-[18px] items-center gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} ref={(node) => { bars.current[i] = node; }}
          className={level ? `block h-full w-[3px] origin-center rounded-full ${SIGNAL} transition-transform duration-75` : `block h-full w-[3px] origin-center rounded-full ${SIGNAL} ${active ? "orbit-island-bar" : "scale-y-[0.2]"}`}
          style={level ? undefined : ({ animationDelay: `${i * 110}ms` } as CSSProperties)} />
      ))}
    </span>
  );
}

/** An expanded view's content: it comes in once the island has started to
 * grow and, when the island closes, fades out while the box shrinks
 * (Coucou's IslandContentView: in 0.16 s late on a spring, out in 0.16 s). */
function Presence({ node, viewKey }: { node: ReactNode; viewKey: string }) {
  const last = useRef<{ node: ReactNode; key: string } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const present = Boolean(node);
  if (node) last.current = { node, key: viewKey };
  useEffect(() => {
    if (present) {
      setLeaving(false);
      return;
    }
    if (!last.current) return;
    setLeaving(true);
    const timer = setTimeout(() => {
      last.current = null;
      setLeaving(false);
    }, MOTION.contentOut.durationMs);
    return () => clearTimeout(timer);
  }, [present]);
  if (node) return <div key={viewKey} className="orbit-island-in">{node}</div>;
  if (!leaving || !last.current) return null;
  return <div key={`${last.current.key}:out`} className="orbit-island-out">{last.current.node}</div>;
}

/** Talk mode: one black island glued to the top edge, like the iPhone's
 * Dynamic Island. ⌥T grows it out of the notch: Orbit's face, sound while it
 * listens and speaks, and a note only when it needs you. Once the question
 * is sent it tucks into the notch while Orbit works and comes out to answer;
 * then it shrinks back and the window goes. It shows nothing else: no team
 * status, no hover peek (the owner's call, 2026-09-30). A click on the
 * talking island ends listening, stops a turn, or quiets it. */
export function TalkSurface() {
  const shell = orbitShell();
  const side = window.ogb?.platform === "win32";
  const calling = useRef(false);
  const [target, setTarget] = useState<OrbitTarget | null>(null);
  const [phase, setPhaseState] = useState<Phase>("idle");
  const [heard, setHeard] = useState("");
  const [answer, setAnswer] = useState("");
  const [notice, setNoticeState] = useState<Notice | null>(null);
  const [pulse, setPulse] = useState(0);
  // the menu bar's height on this display: the island's top hides behind it
  const [topInset, setTopInset] = useState(32);
  // the display's notch, from AppKit; null on a display without one
  const [notch, setNotch] = useState<{ width: number; height: number } | null>(null);
  // talk mode shown: grown out of the notch; false while it opens or shrinks away
  const [open, setOpen] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  const captureRef = useRef<ShellCapture | null>(null);
  const heardRef = useRef("");
  const turnRef = useRef(0);
  const askedRef = useRef(-1);
  // The summon the capture must belong to, and a wait for it.
  const summonIdRef = useRef<number | null>(null);
  const captureReady = useRef<Promise<void>>(Promise.resolve());
  const captureArrived = useRef<() => void>(() => {});
  const threadRef = useRef<string | null>(null);
  const followerRef = useRef<ReplyFollower | null>(null);
  const targetRef = useRef<OrbitTarget | null>(null);
  const restTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The notice on screen, kept in step with every change (not only renders)
  // so the rest timer always knows whether one is showing.
  const noticeRef = useRef<Notice | null>(null);
  const guide = useGuidePointer();

  /** Resting and idle: go away soon, or later while a notice is up. */
  const armRest = useCallback(() => {
    if (restTimer.current) clearTimeout(restTimer.current);
    restTimer.current = null;
    if (phaseRef.current !== "idle" || (side && calling.current)) return;
    restTimer.current = setTimeout(() => {
      restTimer.current = null;
      setOpen(false);
      restTimer.current = setTimeout(() => {
        restTimer.current = null;
        void shell?.talkDismiss();
      }, CLOSE_MS);
    }, noticeRef.current ? NOTICE_STAYS_MS : GONE_AFTER_MS);
  }, [shell, side]);

  const setNotice = useCallback((next: Notice | null) => {
    const had = noticeRef.current;
    noticeRef.current = next;
    setNoticeState(next);
    if (next || had) armRest();
  }, [armRest]);

  const clearListenTimer = useCallback(() => {
    if (listenTimer.current) clearTimeout(listenTimer.current);
    listenTimer.current = null;
  }, []);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
    void shell?.talkState(next);
    if (next !== "listening" && next !== "thinking") clearListenTimer();
    armRest();
  }, [shell, armRest, clearListenTimer]);

  useEffect(() => () => {
    if (restTimer.current) clearTimeout(restTimer.current);
    if (listenTimer.current) clearTimeout(listenTimer.current);
  }, []);

  const releaseScreen = useCallback(() => {
    const capture = captureRef.current;
    captureRef.current = null;
    if (capture) void shell?.screenHeld(capture.displayId, false);
  }, [shell]);

  useEffect(() => () => {
    calling.current = false;
    turnRef.current += 1;
    speaker.stop();
    window.speechSynthesis?.cancel();
    releaseScreen();
  }, [releaseScreen]);

  useEffect(() => {
    const next = new ReplyFollower();
    followerRef.current = next;
    resolveOrbitTarget().then((agent) => { targetRef.current = agent; setTarget(agent); }, () => {});
    return () => {
      next.close();
      if (followerRef.current === next) followerRef.current = null;
    };
  }, [shell]);

  const ask = useCallback(async (text: string) => {
    const turn = turnRef.current;
    const agent = targetRef.current ?? await resolveOrbitTarget().catch(() => null);
    if (!agent) {
      setNotice({ text: t("orbitShell.quick.noAgent") });
      releaseScreen();
      setPhase("idle");
      return;
    }
    targetRef.current = agent;
    setTarget(agent);
    setPhase("thinking");
    // the screen is still being captured when you speak quickly
    await Promise.race([captureReady.current, new Promise((resolve) => setTimeout(resolve, CAPTURE_WAIT_MS))]);
    if (turn !== turnRef.current) return;
    const capture = captureRef.current;
    guide.reset();
    guide.setCapture(capture);
    followerRef.current?.follow(agent.threadId, (update) => {
      if (turn !== turnRef.current) return;
      guide.follow(update.text);
      if (!update.done) return;
      releaseScreen();
      setPulse((n) => n + 1);
      if (update.timedOut) {
        // The turn may still finish in the thread; here it is let go.
        setNotice({ text: t("orbitShell.turnTimedOut", { name: agent.name }) });
        setPhase("idle");
        return;
      }
      const spoken = speakableText(update.text);
      setAnswer(spoken);
      if (!spoken) {
        setPhase("idle");
        return;
      }
      setPhase("talking");
      void say(spoken, agent.voice).then(() => {
        if (turn === turnRef.current && phaseRef.current === "talking") {
          setPhase("idle");
          if (side && calling.current) void shell?.talkSummon();
        }
      });
    });
    try {
      const sent = await sendToOrbit({ target: agent, text, surface: "talk", capture });
      threadRef.current = sent.threadId;
      followerRef.current?.accept();
    } catch (cause) {
      followerRef.current?.stop();
      releaseScreen();
      const message = t("orbitShell.talk.failed", { error: cause instanceof Error ? cause.message : String(cause) });
      setNotice({ text: message });
      setPhase("idle");
    }
  }, [guide, releaseScreen, setNotice, setPhase, shell, side]);

  /** The recognizer is done with this turn: ask what was heard, or say why
   * there is nothing to ask. Once per turn, whatever ends it. */
  const settleListening = useCallback((info: { code: number | null; reason?: string }) => {
    if (phaseRef.current !== "listening" && phaseRef.current !== "thinking") return;
    if (askedRef.current === turnRef.current) return;
    askedRef.current = turnRef.current;
    clearListenTimer();
    const text = heardRef.current.trim();
    // The app window's composer or call has the microphone: never take it.
    if (info.reason === "busy-elsewhere" || (info.reason === "preempted" && (phaseRef.current === "listening" || !text))) {
      releaseScreen();
      setPhase("idle");
      setNotice({ text: t("orbitShell.talk.busyElsewhere") });
      return;
    }
    if (text) {
      void ask(text);
      return;
    }
    releaseScreen();
    setPhase("idle");
    if (info.code === 0) {
      setNotice({ text: t("orbitShell.talk.nothingHeard") });
      // Silence ends a recording, not the Windows call. Restart only after
      // successful recognition; errors and a stuck recognizer need attention.
      if (side && calling.current && info.reason !== "finish-timeout") {
        const turn = turnRef.current;
        listenTimer.current = setTimeout(() => {
          listenTimer.current = null;
          if (calling.current && turn === turnRef.current) void shell?.talkSummon();
        }, 500);
      }
    }
    else if (info.reason === "unsupported-platform") setNotice({ text: t("orbitShell.talk.cantHear") });
    else setNotice(side ? { text: t("jarvis.call.microphoneError") } : { text: t("orbitShell.talk.cantHear"), settings: "mic" });
  }, [ask, clearListenTimer, releaseScreen, setNotice, setPhase, side, shell]);

  // Voice in: the existing speech helper, toggle to talk.
  useEffect(() => {
    const bridge = solarSpeechBridge();
    if (!bridge?.onSpeechTranscript) return;
    const offText = bridge.onSpeechTranscript((line) => {
      if (phaseRef.current !== "listening" && phaseRef.current !== "thinking") return;
      if (typeof line.text === "string") {
        heardRef.current = line.text;
        setHeard(line.text);
      }
    });
    const offEnd = bridge.onSpeechEnd((info) => settleListening(info));
    return () => { offText(); offEnd(); void bridge.speechStop(); };
  }, [settleListening]);

  const finishListening = useCallback(() => {
    if (phaseRef.current !== "listening") return;
    setPhase("thinking");
    const turn = turnRef.current;
    const bridge = solarSpeechBridge();
    if (bridge?.speechFinish) void bridge.speechFinish();
    else void bridge?.speechStop();
    // A recognizer that never sends its last word must not leave the
    // character thinking forever.
    clearListenTimer();
    listenTimer.current = setTimeout(() => {
      listenTimer.current = null;
      if (turn !== turnRef.current || askedRef.current === turn) return;
      void solarSpeechBridge()?.speechStop();
      settleListening({ code: 0, reason: "finish-timeout" });
    }, side ? 95_000 : FINISH_GRACE_MS);
  }, [clearListenTimer, setPhase, settleListening, side]);

  const listen = useCallback(() => {
    setAnswer("");
    heardRef.current = "";
    setHeard("");
    setPhase("listening");
    const turn = turnRef.current;
    clearListenTimer();
    listenTimer.current = setTimeout(() => {
      listenTimer.current = null;
      if (turn === turnRef.current) finishListening();
    }, LISTEN_MAX_MS);
    void solarSpeechBridge()?.speechStart?.({ endpointMs: TALK_ENDPOINT_MS }).catch(() => {
      releaseScreen();
      setPhase("idle");
      setNotice(side ? { text: t("jarvis.call.microphoneError") } : { text: t("orbitShell.talk.cantHear"), settings: "mic" });
    });
  }, [clearListenTimer, finishListening, releaseScreen, setNotice, setPhase, side]);

  /** The screen, taken while the island already listens. */
  const takeCapture = useCallback((capture: ShellCaptureResult) => {
    if (capture.ok) {
      captureRef.current = capture;
      void shell?.screenHeld(capture.displayId, true);
    } else if (capture.reason === "paused") {
      setNotice({ text: t("orbitShell.talk.paused") });
    } else {
      // No screen: say so and offer the fix; the question still goes.
      const text = t(capture.reason === "denied" ? "orbitShell.talk.cantSee" : "orbitShell.screen.failed");
      setNotice({ text, ...(capture.reason === "denied" ? { settings: "screen" as const } : {}) });
    }
    captureArrived.current();
  }, [setNotice, shell]);

  const begin = useCallback((capture: ShellCaptureResult | null) => {
    calling.current = true;
    turnRef.current += 1;
    threadRef.current = null;
    speaker.stop();
    window.speechSynthesis?.cancel();
    guide.reset();
    setNotice(null);
    setPulse((n) => n + 1);
    releaseScreen();
    captureReady.current = new Promise<void>((resolve) => { captureArrived.current = resolve; });
    if (capture) takeCapture(capture);
    listen();
  }, [guide, listen, releaseScreen, setNotice, takeCapture]);

  useEffect(() => shell?.onTalkSummon((info) => {
    summonIdRef.current = info.id ?? null;
    if (typeof info.display.topInset === "number") setTopInset(info.display.topInset);
    setNotch(info.display.notch ?? null);
    // grow out of the notch on the next frame, so the change animates
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    begin(info.capture);
  }), [shell, begin]);
  useEffect(() => shell?.onTalkCapture((message) => {
    // a capture from an earlier summon is not this question's screen
    if (message.id !== summonIdRef.current) return;
    takeCapture(message.capture);
  }), [shell, takeCapture]);
  useEffect(() => shell?.onTalkToggle(() => finishListening()), [shell, finishListening]);

  const stop = () => {
    calling.current = false;
    clearListenTimer();
    turnRef.current += 1;
    const agent = targetRef.current;
    if (phaseRef.current === "thinking" && agent) {
      void interruptOrbit(agent, threadRef.current ?? agent.threadId).catch(() => {});
    }
    followerRef.current?.stop();
    void solarSpeechBridge()?.speechStop();
    speaker.stop();
    window.speechSynthesis?.cancel();
    guide.reset();
    releaseScreen();
    setPhase("idle");
  };

  const onTalkIsland = () => {
    const current = phaseRef.current;
    if (current === "listening") finishListening();
    else if (current === "thinking") stop();
    else if (current === "talking") {
      speaker.stop();
      window.speechSynthesis?.cancel();
      setPhase("idle");
    } else void shell?.talkSummon();
  };

  // What is on screen: out of the notch while it listens, speaks or has a
  // notice; back in the notch while Orbit works on the question.
  const said = side ? (phase === "talking" ? answer : heard.trim()) : phase === "listening" ? heard.trim() : "";
  const out = open && (side || phase !== "thinking" || Boolean(notice));
  const talkExpanded = Boolean(notice || said);
  const [talkContent, setTalkContent] = useState(0);
  const look: IslandLook = useMemo(() => {
    if (!out) return { kind: "hidden" };
    return talkExpanded ? { kind: "talk", contentHeight: talkContent } : { kind: "compact" };
  }, [out, talkExpanded, talkContent]);

  const shape = notch ?? virtualNotch(topInset);
  const size = side ? { width: talkExpanded ? 232 : 48, height: talkExpanded ? 192 : 108 } : islandSize(look, shape);
  const hit = useCallback((point: { x: number; y: number }, next: { width: number; height: number }) => side
    ? point.x >= window.innerWidth - next.width - 22 && point.x <= window.innerWidth - 10
      && Math.abs(point.y - window.innerHeight / 2) <= next.height / 2 + 6
    : overIsland(point, next, window.innerWidth), [side]);
  const radius = islandRadius(look, shape);
  // grow on a spring, shrink on an ease (Coucou's setMode)
  const levelRef = useRef(lookLevel(look));
  const level = lookLevel(look);
  const motion = useMemo(() => islandMotion(levelRef.current, level), [level]);
  useEffect(() => { levelRef.current = level; }, [level]);
  const reduced = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, []);

  // Click-through except the island. Its rect (the size it is going to,
  // grown by 6 pt) is where the page takes the mouse while talk is on. Two
  // sources say when the pointer is in it: main, which watches the pointer
  // while the window is shown, and the mouse moves the window forwards while
  // it ignores the mouse (macOS forwards none over the notch or the menu
  // bar); IslandPointer lets the newest win.
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const pointerRef = useRef<IslandPointer | null>(null);
  pointerRef.current ??= new IslandPointer({ interactive: (take) => void shell?.talkInteractive(take) });
  const islandPointer = pointerRef.current;
  const pointer = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      islandPointer.fromPage(hit(pointer.current, sizeRef.current));
    };
    const onLeave = () => {
      pointer.current = null;
      islandPointer.fromPage(false);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [islandPointer, hit]);
  useEffect(() => shell?.onIslandHover?.((over) => islandPointer.fromMain(over)), [shell, islandPointer]);
  // talk started or ended, or the island changed size under a still pointer
  useEffect(() => {
    islandPointer.setTakes(open);
    const point = pointer.current;
    if (point) islandPointer.retest(hit(point, sizeRef.current));
  }, [islandPointer, open, size.width, size.height, hit]);
  // main hit-tests the same rect: it needs the island's size
  useEffect(() => {
    void shell?.islandLook?.({ width: size.width, height: size.height });
  }, [shell, size.width, size.height]);

  const onIsland = () => {
    if (open) onTalkIsland();
  };

  // Talk's heard words and notices are as tall as they read.
  const talkBody = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = talkBody.current;
    if (!node) {
      setTalkContent(0);
      return;
    }
    const measure = () => setTalkContent(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [out, talkExpanded]);

  const name = target?.name ?? (SOLAR ? "Jarvis" : "Orbit");
  const color = target?.color ?? ORBIT_GREEN;
  const status = !out ? null : phase === "listening" ? <Bars active />
    : phase === "talking" ? <Bars active level={() => speaker.level()} />
    : phase === "thinking" ? <span className={`orbit-island-think size-[9px] rounded-full ${SIGNAL}`} aria-hidden />
    : null;
  const note = notice && (
    <div className="px-4 pb-3 pt-1 text-[12.5px] leading-[1.45] text-white/85" onClick={(event) => event.stopPropagation()}>
      <div>{notice.text}</div>
      <div className="mt-2 flex justify-end gap-1.5">
        {notice.settings && (
          <button type="button" onClick={() => void window.ogb?.permOpenSettings?.(notice.settings!)}
            className="rounded-lg bg-white/[0.12] px-2.5 py-1 text-[12px] text-white hover:bg-white/[0.2]">
            {t("orbitShell.openSystemSettings")}
          </button>
        )}
        <button type="button" onClick={() => setNotice(null)} aria-label={t("common.close")}
          className="rounded-lg px-1.5 text-white/60 hover:text-white"><X size={13} /></button>
      </div>
    </div>
  );
  const heardLine = said && (
    <div className="truncate px-4 pb-2.5 text-[13px] text-white/85 [direction:rtl] text-left"><bdi>{said}</bdi></div>
  );

  // The ears: Orbit's face on the left, its sound on the right, the camera
  // between. Nothing is drawn in the notch, and the face only animates while
  // talk is on. Solar talks to Jarvis, the system's sun: its planet face.
  const faceSize = Math.max(20, shape.height - 4);
  const face = out && (SOLAR
    ? <span className="shell-solar-face" data-busy={phase === "thinking" || undefined} style={{ width: faceSize, height: faceSize }}><SolarPlanet kind="sun" /></span>
    : <ShellCharacter color={color} mood={MOOD[phase]} size={faceSize} mini pulse={pulse} />
  );
  const expandedBody = look.kind === "talk" ? (
    <div ref={talkBody} className="orbit-island-content">{heardLine}{note}</div>
  ) : null;

  const style: CSSProperties = {
    width: size.width,
    height: size.height,
    borderRadius: `0 0 ${radius}px ${radius}px`,
    // a virtual notch isn't there when the island is in
    opacity: out || notch ? 1 : 0,
    transition: reduced ? "none" : `${islandTransition(motion)}, opacity 200ms ease`,
    // the content's own entrance (IslandContentView's spring and delay)
    ["--orbit-in-ms" as string]: `${MOTION.contentIn.durationMs}ms`,
    ["--orbit-in-ease" as string]: MOTION.contentIn.easing,
    ["--orbit-in-delay" as string]: `${MOTION.contentIn.delayMs}ms`,
    ["--orbit-out-ms" as string]: `${MOTION.contentOut.durationMs}ms`,
  };

  if (side) {
    const actionLabel = phase === "listening" ? t("solar.voice.finishSpeaking") : phase === "thinking" || phase === "talking" ? t("call.ui.interrupt") : t("call.ui.tryMicrophoneAgain");
    const phaseLabel = t(`solar.voice.${phase === "sleepy" ? "idle" : phase}`);
    return (
      <div className="flex h-full w-full select-none items-center justify-end pr-4">
        <section aria-label={t("orbitShell.talk.label", { name })} title={phaseLabel} className="solar-talk-pill" data-phase={phase} data-expanded={talkExpanded}
          style={{ width: size.width, height: size.height, opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden" }}>
          <header className="solar-voice-header">
            <span className="solar-voice-brand">{t("solar.voice.brand")}</span>
            <button type="button" className="solar-voice-close" title={t("call.ui.hangUp")} aria-label={t("call.ui.hangUp")} onClick={() => { stop(); setOpen(false); void shell?.talkDismiss(); }}><X size={16} /></button>
          </header>
          <svg className="solar-voice-aperture" width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path className="solar-voice-arcs" d="M17 7a18 18 0 0 0 0 34M31 7a18 18 0 0 1 0 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect className="solar-voice-bar" x="19" y="15" width="3" height="18" rx="1.5" fill="currentColor" />
            <rect className="solar-voice-bar" x="26" y="12" width="3" height="24" rx="1.5" fill="currentColor" />
          </svg>
          <div className="solar-voice-state" role="status"><span />{phaseLabel}</div>
          {talkExpanded && <div className="solar-voice-content">
            {said && <p className="solar-voice-transcript">{said}</p>}
            {notice && <div className="solar-voice-notice"><p>{notice.text}</p><button type="button" aria-label={t("common.close")} onClick={() => setNotice(null)}><X size={14} /></button></div>}
          </div>}
          <div className="solar-voice-controls">
          <button type="button" className="solar-voice-action" title={actionLabel} aria-label={actionLabel} onClick={() => {
            if (phase === "listening") finishListening();
            else if (phase === "thinking" || phase === "talking") { stop(); void shell?.talkSummon(); }
            else void shell?.talkSummon();
          }}>{phase === "thinking" || phase === "talking" ? <Square size={12} /> : phase === "listening" ? <Send size={13} /> : <Mic size={14} />}</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    // items-start: the island is only as tall as what it shows, never the
    // whole window
    <div className="flex h-full w-full select-none items-start justify-center">
      <div role="button" tabIndex={-1} onClick={onIsland}
        aria-label={t("orbitShell.talk.label", { name })}
        // in the notch it is only the camera housing: no shadow under it
        className={`orbit-island relative flex flex-col overflow-hidden bg-black text-white ${out ? "shadow-[0_10px_30px_rgba(0,0,0,.35)]" : ""}`}
        style={style}>
        <div className="flex shrink-0 items-center justify-between" style={{ height: shape.height }}>
          <span className="flex items-center justify-center" style={{ width: ISLAND.ear }}>{face}</span>
          <span className="flex items-center justify-center" style={{ width: ISLAND.ear }}>{status}</span>
        </div>
        {/* content keeps the expanded width while the island grows round it,
            so nothing reflows mid-spring */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: shape.height, width: ISLAND.expandedWidth }}>
          <Presence node={expandedBody} viewKey={look.kind} />
        </div>
      </div>
    </div>
  );
}
