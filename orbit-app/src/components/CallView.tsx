import { solarCallDecision } from '@/lib/solar-call-decision';
import { solarSpeechBridge, useSolarSpeechReady } from '@/lib/solar-voice';
// Call mode — the bot on the line.
//
// The loop is deliberately HALF-DUPLEX: the microphone is live only when
// the bot is not speaking. Solar uses local Whisper on Windows and the
// native speech bridge on macOS. Keeping capture closed during playback means
// a mic left open through playback transcribes the bot's own voice back into
// the conversation and the two of them talk forever. Interrupting is a tap
// or Escape instead, which is honest and cannot feed back. (Full-duplex
// barge-in needs AEC on the capture path — a follow-up, not a footnote.)
//
// Turn-taking uses a silence endpointer in the capture bridge. Apple's
// buffer-backed recognizer does not finalize on silence by itself: the helper
// has to end the audio stream, which then produces the final transcript.
//
// The other half of making a call bearable is narration. An agent turn is
// 5-60 seconds of tool calls; silence that long reads as a dropped call. So
// every activity chip the harness narrates (`tool.spoken`) is read aloud as
// it happens, which is why waiting feels like listening to someone work
// rather than listening to nothing.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Loader2, Phone, PhoneOff } from "lucide-react";

import { useStore, visibleMessages, type Bot } from "@/state/store";
import { announceCallPhase, announceYouTalking } from "@/orbit/events";
import { currentCall, deferCallCleanup, endCall, startCall, useOnCall } from "@/lib/call";
import { speaker } from "@/lib/tts";
import { localSystemVoiceActive } from "@/lib/local-voice";
import { useSpeech } from "@/lib/tts/useSpeech";
import { usePushToTalk } from "@/lib/push-to-talk";
import { isRoutineApproval, isSkillApproval, pendingApprovals, spokenApprovalPrompt } from "./PendingApproval";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { useDesktopCapabilities } from "./DesktopCapabilities";
import { callCapabilityHelp } from "@/lib/call-capability";

/** Spoken answers to a permission card. Anything else is read as a reply
 * to the bot, not as consent — an approval must never be granted by a
 * sentence that merely contained the word "sure". */
const SOLAR_CALL = import.meta.env.VITE_JARVIS_SOLAR === 'true';
const YES = /^(yes|yeah|yep|yup|sure|ok|okay|go ahead|do it|allow|approve|approved|fine|please do)\b/i;
const NO = /^(no|nope|don'?t|do not|stop|deny|denied|cancel|never|skip it)\b/i;

type Phase = "listening" | "sending" | "working" | "speaking";
const CALL_ENDPOINT_MS = 850;

export function CallButton({ bot }: { bot: Bot }) {
  return (
    <CallTargetButton
      targetId={bot.id}
      targetName={bot.name}
      voices={[bot.voice]}
      setupBotId={bot.id}
      requireExplicitVoices={false}
    />
  );
}

export function CallTargetButton({
  targetId,
  targetName,
  voices,
  setupBotId,
  requireExplicitVoices,
  onStart,
  startLabel,
}: {
  targetId: string;
  targetName: string;
  voices: Array<string | undefined>;
  /** Agent profile to open when voice setup is missing (rooms choose a member). */
  setupBotId?: string;
  /** Rooms cannot rely on one workspace fallback for multiple speakers. */
  requireExplicitVoices: boolean;
  onStart?: () => void;
  /** the idle button's text; a room says "Start group call" */
  startLabel?: string;
}) {
  const { state, dispatch } = useStore();
  const { capabilities, ready: capabilitiesReady } = useDesktopCapabilities();
  const active = useOnCall() === targetId;
  const solarReady = useSolarSpeechReady();
  const capabilityHelp = solarReady ? null : capabilitiesReady
    ? callCapabilityHelp(capabilities, Boolean(window.ogb?.speechStart))
    : null;
  const supported = (capabilitiesReady || solarReady) && !capabilityHelp;
  const localVoice = localSystemVoiceActive();
  const configured = localVoice || Boolean(state.config?.tts?.configured);
  const everyTargetHasVoice = voices.length > 0 && voices.every((voice) => Boolean(voice));
  const voiceReady =
    localVoice ||
    (configured && (requireExplicitVoices ? everyTargetHasVoice : Boolean(state.config?.tts?.ready || everyTargetHasVoice)));
  const unavailable = !active && (!(capabilitiesReady || solarReady) || !supported || !voiceReady);
  const voiceSetupRequired = capabilitiesReady && supported && !voiceReady;
  const [helpOpen, setHelpOpen] = useState(false);
  // "On a call · m:ss", counted from when this call began here
  const [since, setSince] = useState<number | null>(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) { setSince(null); return; }
    setSince((s) => s ?? Date.now());
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  const elapsed = since ? Math.floor((Date.now() - since) / 1000) : 0;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const helpId = useId();
  const label = active
    ? `Hang up on ${targetName}`
    : !capabilitiesReady
      ? "Checking call availability"
      : !supported
        ? capabilityHelp?.label ?? "Call unavailable"
        : !configured
          ? "Set up a voice in an agent profile to make calls"
          : !voiceReady
            ? "Pick a voice in an agent profile to make calls"
            : `Call ${targetName}`;

  const reason = !capabilitiesReady
    ? "Checking whether this device can make calls."
    : capabilityHelp
      ? capabilityHelp.reason
        : !configured
          ? "Set up ElevenLabs, Fish Audio, Chatterbox, or a built-in Mac voice so the bot can speak during calls."
          : !voiceReady
            ? voices.length > 1
              ? "Give every group member a voice before starting a group call."
              : "Choose a voice before starting a call."
            : "";

  useEffect(() => {
    if (!helpOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setHelpOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setHelpOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [helpOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (active) return endCall(targetId);
          if (unavailable) {
            setHelpOpen((open) => !open);
            return;
          }
          onStart?.();
          startCall(targetId);
        }}
        aria-expanded={unavailable ? helpOpen : undefined}
        aria-controls={unavailable ? helpId : undefined}
        aria-label={label}
        title={label}
        data-orbit-call
        className={cn(
          // Orbit's call bar: a green Call pill, a red Hang up while on a call
          "relative flex h-[26px] items-center gap-1.5 rounded-[13px] px-3 text-[12px] font-medium text-white transition-colors",
          active ? "bg-[#e5484d] hover:brightness-110" : unavailable ? "bg-ink/[0.08] text-ink/60 hover:bg-ink/[0.12]" : SOLAR_CALL ? "bg-[#ddbd89]/[0.14] text-[#f4dcb5] ring-1 ring-inset ring-[#ddbd89]/50 hover:bg-[#ddbd89]/[0.24]" : "bg-[#1f9d5c] hover:brightness-110",
        )}
      >
        {active ? <PhoneOff size={13} /> : <Phone size={13} />}
        {active ? t("orbit.call.hangUp") : startLabel ?? t("orbit.call.call")}
        {unavailable && (
          <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-warning ring-2 ring-app" aria-hidden="true" />
        )}
      </button>
      {active && (
        <span className={cn("pointer-events-none absolute left-full top-1/2 ml-2.5 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap text-[12.5px]", SOLAR_CALL ? "text-[#eac185]" : "text-[#38d591]")}>
          <span className={cn("size-[7px] rounded-full", SOLAR_CALL ? "bg-[#eac185] shadow-[0_0_8px_#eac185]" : "bg-[#38d591] shadow-[0_0_8px_#38d591]")} /> {t("orbit.call.onCallFor", { time: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}` })}
        </span>
      )}

      {unavailable && helpOpen && (
        <div
          id={helpId}
          role="group"
          aria-label={t("call.ui.callUnavailable")}
          className="animate-pop-in absolute left-0 z-30 mt-1.5 w-[280px] rounded-xl border border-ink/[0.1] bg-panel p-3 text-left shadow-2xl"
        >
          <div className="text-[13px] font-medium text-ink">{t("call.ui.callUnavailable")}</div>
          <div className="mt-1 text-[12px] leading-[1.45] text-ink/55">{reason}</div>
          {capabilityHelp?.action === "choose-local-workspace" && (
            <button
              type="button"
              onClick={() => {
                setHelpOpen(false);
                void window.ogb?.workspaces?.menu();
              }}
              className="mt-2.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-medium text-app hover:brightness-110"
            >
              {t("callView.ui.chooseThisComputer")}
            </button>
          )}
          {voiceSetupRequired && (
            <button
              type="button"
              onClick={() => {
                setHelpOpen(false);
                if (setupBotId && setupBotId !== targetId) dispatch({ type: "select", id: setupBotId });
                dispatch({ type: "toggleSettings", open: true, section: "voice" });
              }}
              className="mt-2.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-medium text-app hover:brightness-110"
            >
              {t("callView.ui.openAgentSettings")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function CallOverlay({ bot }: { bot: Bot }) {
  const active = useOnCall() === bot.id;
  if (!active) return null;
  return <Call bot={bot} />;
}

function Call({ bot }: { bot: Bot }) {
  const { dispatch } = useStore();
  const speech = useSpeech();
  const initialPhase: Phase = bot.busy ? "working" : "listening";
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [heard, setHeard] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const pushToTalk = usePushToTalk(bot.id, phase === "listening", () => {
    setNote("Push to talk couldn't start. Check Microphone and Speech Recognition access.");
  });

  const messages = visibleMessages(bot);
  const approval = pendingApprovals(messages)[0];
  const question = messages.find(
    (message) =>
      message.kind === "options" &&
      message.card?.requestId &&
      !message.card.tool &&
      !message.card.answered &&
      !message.card.dismissed,
  );

  // Everything already on screen when the call starts has been read or
  // ignored — a call must not open by reciting the backlog.
  const spokenIds = useRef<Set<string>>(new Set());
  const started = useRef(false);
  if (!started.current) {
    started.current = true;
    for (const m of messages) spokenIds.current.add(m.id);
  }

  // the approval we last asked about aloud, so a card that stays open
  // while the user thinks is not re-read every render
  const askedApproval = useRef<{
    requestId: string;
    routine: boolean;
    skill: boolean;
    submitted: boolean;
  } | null>(null);
  const askedQuestion = useRef<{ requestId: string; messageId: string } | null>(null);
  const phaseRef = useRef<Phase>(initialPhase);
  const alive = useRef(true);
  const sayGeneration = useRef(0);

  /** Change the rendered phase and the synchronous phase used by native
   * callbacks together. React state alone is too late: the helper can exit
   * in the same tick as a final transcript or an intentional mute. */
  const move = useCallback((next: Phase) => {
    phaseRef.current = next;
    if (alive.current) setPhase(next);
  }, []);

  const hush = useCallback(() => {
    void solarSpeechBridge()?.speechStop();
  }, []);

  const listen = useCallback(() => {
    if (!alive.current || currentCall() !== bot.id) return;
    move("listening");
    setHeard("");
    setNote(null);
    void solarSpeechBridge()?.speechStart({ endpointMs: CALL_ENDPOINT_MS }).catch(() => {
      if (alive.current && currentCall() === bot.id) {
        setNote(t('jarvis.call.microphoneError'));
      }
    });
  }, [bot.id, move]);

  /** Speak, with the microphone closed for the duration (see the header
   * comment — an open mic during playback is a feedback loop). */
  const say = useCallback(
    async (text: string) => {
      if (!alive.current || currentCall() !== bot.id) return false;
      const mine = ++sayGeneration.current;
      // Move first. stopSpeech() finishes asynchronously, and its close must
      // never observe an old "listening" phase and reopen the mic.
      move("speaking");
      hush();
      await speaker.speak(text, { botId: bot.id, voiceId: bot.voice });
      return alive.current && currentCall() === bot.id && sayGeneration.current === mine;
    },
    [bot.id, bot.voice, hush, move],
  );

  const sayThenListen = useCallback(
    async (text: string) => {
      const stillMine = await say(text);
      if (stillMine && phaseRef.current === "speaking") listen();
    },
    [listen, say],
  );

  // Navigating away from this bot hangs up. Without ownership checking, the
  // overlay disappeared but `currentCall()` remained set and auto-speak was
  // permanently disabled for a call nobody could see.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      sayGeneration.current += 1;
      // StrictMode immediately remounts effects once in development. A
      // microtask distinguishes that probe from real navigation: the probe
      // has set alive=true again before this runs; a genuine unmount has not.
      deferCallCleanup(bot.id, () => alive.current);
    };
  }, [bot.id]);

  // ── the microphone ───────────────────────────────────────────────────
  useEffect(() => {
    const bridge = solarSpeechBridge();
    if (!bridge) return;
    const offTranscript = bridge.onSpeechTranscript((line) => {
      if (!alive.current || currentCall() !== bot.id || phaseRef.current !== "listening") return;
      if (line.error) {
        setNote(t('jarvis.call.captureError'));
        return;
      }
      if (typeof line.text !== "string") return;
      setHeard(line.text);
      if (line.text) announceYouTalking();
      if (line.partial !== false) return;
      // final result — Apple's recognizer decided the turn ended
      const said = line.text.trim();
      if (!said) return listen();

      const open = askedApproval.current;
      if (open) {
        if (open.submitted) {
          move("working");
          hush();
          return;
        }
        const decision = SOLAR_CALL ? solarCallDecision(said) : YES.test(said) ? 'allow' : NO.test(said) ? 'deny' : null;
        if (decision) {
          const allow = decision === 'allow';
          if (allow && open.skill) {
            setHeard("");
            void sayThenListen("Open this chat to review the complete skill before enabling it. You can say no now to deny it.");
            return;
          }
          // Keep this request claimed until the server's durable card patch
          // arrives. Clearing it here lets a render in that network gap read
          // and submit the same approval again.
          open.submitted = true;
          move("working");
          hush();
          setHeard("");
          dispatch({
            type: "decideRequest",
            threadId: bot.threadId,
            requestId: open.requestId,
            behavior: allow ? "allow" : "deny",
            message: allow ? undefined : "Denied by the user, on a call.",
            onError: (error: string) => {
              const pending = askedApproval.current;
              if (
                !alive.current ||
                currentCall() !== bot.id ||
                pending?.requestId !== open.requestId ||
                !pending.submitted
              ) return;
              pending.submitted = false;
              const detail = error.trim().slice(0, 240);
              const decision = open.routine ? "routine decision" : "approval";
              void sayThenListen(
                `I couldn't save that ${decision}${detail ? `: ${detail}` : "."} Please try again.`,
              );
            },
          });
          return;
        }
        // not a decision — leave the card up and say so rather than
        // guessing consent from an ambiguous sentence
        void sayThenListen("Sorry — is that a yes or a no?");
        return;
      }

      const openQuestion = askedQuestion.current;
      if (openQuestion) {
        askedQuestion.current = null;
        dispatch({ type: "answerCard", botId: bot.id, threadId: bot.threadId, messageId: openQuestion.messageId, answer: said });
        move("working");
        return;
      }

      move("sending");
      dispatch({ type: "send", botId: bot.id, text: said, threadId: bot.threadId });
    });
    const offEnd = bridge.onSpeechEnd(({ code, reason }) => {
      if (!alive.current || currentCall() !== bot.id) return;
      if (code === 2) {
        setNote("Calls need macOS dictation, which isn't available here yet.");
        return;
      }
      if (code === 1 && import.meta.env.VITE_JARVIS_SOLAR === "true" && window.ogb?.platform !== "darwin") { setNote(reason ?? "Microphone capture failed"); return; }
      if (code === 1) {
        setNote(
          reason === "helper-build-failed"
            ? "The dictation helper couldn't be built. Install Apple's Command Line Tools and try again."
            : "Dictation needs Microphone + Speech Recognition access in System Settings.",
        );
        return;
      }
      // the helper exits after every final result; if we are still meant
      // to be listening, that means the user's turn ended — start the next
      if (phaseRef.current === "listening") listen();
    });
    if (bot.busy && !approval && !question) move("working");
    else listen();
    return () => {
      offTranscript();
      offEnd();
      void solarSpeechBridge()?.speechStop();
    };
    // busy/approval are intentionally initial snapshots. Their live changes
    // are handled below without tearing down native event listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot.id, bot.threadId, dispatch, hush, listen, move, sayThenListen]);

  // ── narrate the work, speak the answer, read the approvals ───────────
  useEffect(() => {
    // The request may be resolved from the normal approval UI or by another
    // client while this call is open. Do not keep treating future speech as
    // an answer to a card that no longer exists.
    let resumeAfterRoutine = false;
    if (askedApproval.current && approval?.requestId !== askedApproval.current.requestId) {
      resumeAfterRoutine = askedApproval.current.routine && askedApproval.current.submitted;
      askedApproval.current = null;
    }
    if (askedQuestion.current && question?.card?.requestId !== askedQuestion.current.requestId) {
      askedQuestion.current = null;
    }
    if (!approval && !question && bot.busy && phaseRef.current === "listening") {
      move("working");
      hush();
    }
    if (resumeAfterRoutine && !approval && !question && !bot.busy) {
      listen();
      return;
    }
    // Nothing may reopen capture or narrate new work while the server is
    // durably settling this exact decision.
    if (askedApproval.current?.submitted) return;
    if (approval && askedApproval.current?.requestId !== approval.requestId && phase !== "speaking") {
      askedApproval.current = {
        requestId: approval.requestId,
        routine: isRoutineApproval(approval),
        skill: isSkillApproval(approval),
        submitted: false,
      };
      spokenIds.current.add(approval.message.id);
      const skillPrompt = approval.message.card?.skillRequest?.action === "update"
        ? `${bot.name} wants to update a learned skill. Open this chat to review the complete skill before replacing the current version. You can say no to deny it.`
        : `${bot.name} wants to enable a new learned skill. Open this chat to review the complete skill before enabling it. You can say no to deny it.`;
      void sayThenListen(isSkillApproval(approval) ? skillPrompt : spokenApprovalPrompt(approval, bot.name));
      return;
    }
    if (
      question?.card?.requestId &&
      askedQuestion.current?.requestId !== question.card.requestId &&
      phase !== "speaking"
    ) {
      askedQuestion.current = { requestId: question.card.requestId, messageId: question.id };
      spokenIds.current.add(question.id);
      const detail = question.card.subtitle.trim();
      const choices = question.card.options.length
        ? ` The options are ${question.card.options.join(", ")}.`
        : "";
      void sayThenListen(`${bot.name} asks: ${detail}${/[.!?]$/.test(detail) ? "" : "."}${choices}`);
      return;
    }
    const fresh = messages.filter((m) => !spokenIds.current.has(m.id));
    if (!fresh.length) return;
    // only the newest of each kind matters: a burst of tool chips should
    // not queue thirty seconds of narration behind the actual answer
    const reply = [...fresh].reverse().find((m) => m.role === "bot" && m.kind === "text" && m.text?.trim());
    const chip = [...fresh].reverse().find((m) => m.kind === "activity" && m.tool?.spoken);
    for (const m of fresh) spokenIds.current.add(m.id);

    if (reply?.text) {
      void sayThenListen(reply.text);
    } else if (chip?.tool?.spoken && phase === "working") {
      void say(chip.tool.spoken).then((stillMine) => {
        if (stillMine && phaseRef.current === "speaking") move("working");
      });
    }
  }, [messages, approval, question, phase, bot.busy, bot.name, hush, listen, move, say, sayThenListen]);

  // busy is the harness's word for "a turn is running"
  useEffect(() => {
    if (bot.busy) {
      // An open approval deliberately keeps the mic live for yes/no. Every
      // other busy phase is half-duplex and must close capture.
      if (phaseRef.current !== "speaking" && !askedApproval.current && !askedQuestion.current) {
        move("working");
        hush();
      }
    } else if (
      phaseRef.current === "working" &&
      !askedApproval.current &&
      !askedQuestion.current &&
      !speaker.isSpeaking()
    ) {
      // A failed/cancelled turn may have no reply to trigger the normal
      // speak-then-listen path. Recover the call instead of staying stuck.
      listen();
    }
  }, [bot.busy, hush, listen, move]);

  // Escape hangs up; space interrupts whatever is being said
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        endCall(bot.id);
      } else if (e.code === "Space" && speaker.isSpeaking()) {
        e.preventDefault();
        sayGeneration.current += 1;
        speaker.stop();
        listen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bot.id, listen]);

  // the bot on the canvas is the one on the line
  useEffect(() => { announceCallPhase(bot.id, phase); }, [bot.id, phase]);
  useEffect(() => () => announceCallPhase(bot.id, null), [bot.id]);

  const status =
    phase === "listening"
      ? pushToTalk
        ? t("call.ui.pushToTalk")
        : t("call.ui.listening")
      : phase === "sending"
        ? t("call.ui.oneMoment")
        : phase === "speaking"
          ? bot.name
          : t("call.ui.working");
  const line = phase === "listening" ? heard : speech.caption;

  // design: a call is the bot on the canvas plus this strip above the
  // composer; the header keeps "On a call · m:ss" and Hang up
  return (
    <div role="status" aria-live="polite" className={cn("pointer-events-auto mx-1.5 mb-2 flex flex-col gap-1.5 px-3 py-2.5", SOLAR_CALL ? "border-y border-ink/15" : "rounded-xl border border-[rgba(56,213,145,.35)] bg-[rgba(56,213,145,.07)]")}>
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className={cn("size-[7px] shrink-0 rounded-full bg-[#38d591]", phase === "listening" && "animate-pulse")} style={{ boxShadow: "0 0 8px #38d591" }} />
        <span className="font-medium text-[#7fe8bc]">{SOLAR_CALL && <>{t('jarvis.call.mode')} · </>}{status}</span>
        {(phase === "working" || phase === "sending") && <Loader2 size={12} className="animate-spin text-[#7fe8bc]" />}
        <span className="flex-1" />
        {speaker.isSpeaking() && (
          <button
            onClick={() => {
              sayGeneration.current += 1;
              speaker.stop();
              listen();
            }}
            className="h-[24px] rounded-full border border-ink/[0.16] px-2.5 text-[11.5px] text-ink hover:bg-ink/[0.06]"
          >
            {t("call.ui.interrupt")}
          </button>
        )}
      </div>
      {/* one line, whichever is current: what you're saying, or what it is */}
      <div className="min-h-[1.45em] text-[13px] leading-[1.45] text-ink/90">
        {line || (
          <span className="text-ink/50">
            {phase === "listening" ? (pushToTalk ? t("call.ui.releaseToSend") : t("call.ui.saySomething")) : "\u00a0"}
          </span>
        )}
      </div>
      {note && (
        <div className="flex items-center gap-2 text-[12px] text-[#ffb454]">
          <span className="min-w-0 flex-1">{note}</span>
          <button onClick={listen} className="shrink-0 rounded-full border border-[#ffb454]/40 px-2.5 py-1 text-[11.5px] hover:bg-[#ffb454]/10">
            {t("call.ui.tryMicrophoneAgain")}
          </button>
        </div>
      )}
      {speech.error && <div className="text-[12px] text-[#ff8a96]">{speech.error}</div>}
      <div className="text-[11px] text-ink/40">{t("call.ui.keys")}</div>
    </div>
  );
}
