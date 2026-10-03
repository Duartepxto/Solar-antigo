// Conference call mode — one microphone, several room members.
//
// Capture stays half-duplex for the same reason as one-to-one calls: the
// native recognizer has no acoustic echo cancellation. Bot replies are
// explicitly queued so a fast second member never cuts off the first.
import { t } from "@/lib/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { currentCall, deferCallCleanup, endCall, useOnCall } from "@/lib/call";
import { routeSpokenGroupMessage } from "@/lib/group-call";
import { speaker } from "@/lib/tts";
import { useSpeech } from "@/lib/tts/useSpeech";
import { usePushToTalk } from "@/lib/push-to-talk";
import { useStore, type Bot, type Group, type Message } from "@/state/store";
import { cn } from "@/lib/cn";
import { announceCallPhase, announceYouTalking } from "@/orbit/events";
import { CallTargetButton } from "./CallView";
import { isRoutineApproval, isSkillApproval, pendingApprovals, spokenApprovalPrompt } from "./PendingApproval";

const YES = /^(yes|yeah|yep|yup|sure|ok|okay|go ahead|do it|allow|approve|approved|fine|please do)\b/i;
const NO = /^(no|nope|don'?t|do not|stop|deny|denied|cancel|never|skip it)\b/i;
const CALL_ENDPOINT_MS = 850;

type Phase = "listening" | "sending" | "working" | "speaking";

export function GroupCallButton({ group, members }: { group: Group; members: Bot[] }) {
  if (group.dm) return null;
  return (
    <CallTargetButton
      targetId={group.id}
      targetName={group.name}
      voices={members.map((member) => member.voice)}
      setupBotId={members.find((member) => !member.voice)?.id ?? members[0]?.id}
      requireExplicitVoices
      startLabel={t("orbit.call.group")}
    />
  );
}

export function GroupCallOverlay({ group, members }: { group: Group; members: Bot[] }) {
  const active = useOnCall() === group.id;
  if (!active) return null;
  return <GroupCall group={group} members={members} />;
}

function questionIn(messages: Message[]): Message | undefined {
  return messages.find(
    (message) =>
      message.kind === "options" &&
      message.card?.requestId &&
      !message.card.tool &&
      !message.card.answered &&
      !message.card.dismissed,
  );
}

function GroupCall({ group, members }: { group: Group; members: Bot[] }) {
  const { dispatch } = useStore();
  const speech = useSpeech();
  const initialPhase: Phase = group.working || group.busyBotId ? "working" : "listening";
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [heard, setHeard] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [speakingMemberId, setSpeakingMemberId] = useState<string | null>(null);
  const pushToTalk = usePushToTalk(group.id, phase === "listening", () => {
    setNote("Push to talk couldn't start. Check Microphone and Speech Recognition access.");
  });

  const messages = group.messages;
  const approval = pendingApprovals(messages)[0];
  const question = questionIn(messages);
  const membersRef = useRef(members);
  const busyRef = useRef(Boolean(group.working || group.busyBotId));
  const defaultResponderRef = useRef(group.defaultResponder);
  membersRef.current = members;
  busyRef.current = Boolean(group.working || group.busyBotId);
  defaultResponderRef.current = group.defaultResponder;

  const spokenIds = useRef<Set<string>>(new Set());
  const started = useRef(false);
  if (!started.current) {
    started.current = true;
    for (const message of messages) spokenIds.current.add(message.id);
  }

  const askedApproval = useRef<{
    requestId: string;
    member?: Bot;
    routine: boolean;
    skill: boolean;
    submitted: boolean;
  } | null>(null);
  const askedQuestion = useRef<{ requestId: string; member?: Bot } | null>(null);
  const phaseRef = useRef<Phase>(initialPhase);
  const alive = useRef(true);
  const sayGeneration = useRef(0);
  const queueGeneration = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const queuedJobs = useRef(new Set<number>());
  const nextJobId = useRef(0);
  const listenWhenDrained = useRef(false);
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allowBargeIn = useRef(false);

  const move = useCallback((next: Phase) => {
    phaseRef.current = next;
    if (alive.current) setPhase(next);
  }, []);

  const hush = useCallback(() => {
    void window.ogb?.speechStop();
  }, []);

  const listen = useCallback(() => {
    if (!alive.current || currentCall() !== group.id) return;
    move("listening");
    setSpeakingMemberId(null);
    setHeard("");
    setNote(null);
    void window.ogb?.speechStart({ endpointMs: CALL_ENDPOINT_MS }).catch(() => {
      if (alive.current && currentCall() === group.id) {
        setNote("The microphone couldn't start. Check Microphone and Speech Recognition access.");
      }
    });
  }, [group.id, move]);

  const scheduleListen = useCallback(
    (force = false, delay = 140) => {
      if (listenTimer.current) clearTimeout(listenTimer.current);
      listenTimer.current = setTimeout(() => {
        listenTimer.current = null;
        if (!alive.current || currentCall() !== group.id || queuedJobs.current.size) return;
        if (force || allowBargeIn.current || !busyRef.current) listen();
      }, delay);
    },
    [group.id, listen],
  );

  const say = useCallback(
    async (text: string, member?: Bot) => {
      if (!alive.current || currentCall() !== group.id) return false;
      const mine = ++sayGeneration.current;
      move("speaking");
      setSpeakingMemberId(member?.id ?? null);
      hush();
      await speaker.speak(text, { botId: member?.id, voiceId: member?.voice });
      return alive.current && currentCall() === group.id && sayGeneration.current === mine;
    },
    [group.id, hush, move],
  );

  const enqueueSpeech = useCallback(
    (text: string, member?: Bot, answerAfter = false) => {
      const generation = queueGeneration.current;
      const jobId = ++nextJobId.current;
      queuedJobs.current.add(jobId);
      if (answerAfter) listenWhenDrained.current = true;
      queue.current = queue.current
        .catch(() => {})
        .then(async () => {
          if (generation !== queueGeneration.current) return;
          await say(text, member);
        })
        .finally(() => {
          if (generation !== queueGeneration.current) return;
          queuedJobs.current.delete(jobId);
          if (queuedJobs.current.size) return;
          setSpeakingMemberId(null);
          const force = listenWhenDrained.current;
          listenWhenDrained.current = false;
          scheduleListen(force);
        });
    },
    [say, scheduleListen],
  );

  const interruptSpeech = useCallback(() => {
    const wasBusy = busyRef.current;
    queueGeneration.current += 1;
    queue.current = Promise.resolve();
    queuedJobs.current.clear();
    listenWhenDrained.current = false;
    sayGeneration.current += 1;
    speaker.stop();
    setSpeakingMemberId(null);
    allowBargeIn.current = true;
    if (wasBusy) dispatch({ type: "interruptGroup", groupId: group.id });
    listen();
  }, [dispatch, group.id, listen]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      queueGeneration.current += 1;
      sayGeneration.current += 1;
      if (listenTimer.current) clearTimeout(listenTimer.current);
      deferCallCleanup(group.id, () => alive.current);
    };
  }, [group.id]);

  useEffect(() => {
    const bridge = window.ogb;
    if (!bridge) return;
    const offTranscript = bridge.onSpeechTranscript((line) => {
      if (!alive.current || currentCall() !== group.id || phaseRef.current !== "listening") return;
      if (line.error) {
        setNote("Dictation stopped unexpectedly. Check Microphone and Speech Recognition access.");
        return;
      }
      if (typeof line.text !== "string") return;
      setHeard(line.text);
      if (line.text) announceYouTalking();
      if (line.partial !== false) return;
      const said = line.text.trim();
      if (!said) return listen();

      const openApproval = askedApproval.current;
      if (openApproval) {
        if (openApproval.submitted) {
          move("working");
          hush();
          return;
        }
        if (YES.test(said) || NO.test(said)) {
          const allow = YES.test(said);
          if (allow && openApproval.skill) {
            setHeard("");
            enqueueSpeech(
              "Open the group thread to review the complete skill before enabling it. You can say no now to deny it.",
              openApproval.member,
              true,
            );
            return;
          }
          // Hold this approval in-flight until its server patch arrives so a
          // slow response cannot reopen the microphone and submit it twice.
          openApproval.submitted = true;
          allowBargeIn.current = false;
          move("working");
          hush();
          setHeard("");
          dispatch({
            type: "decideRequest",
            threadId: group.threadId,
            requestId: openApproval.requestId,
            behavior: allow ? "allow" : "deny",
            message: allow ? undefined : "Denied by the user, on a group call.",
            onError: (error: string) => {
              const pending = askedApproval.current;
              if (
                !alive.current ||
                currentCall() !== group.id ||
                pending?.requestId !== openApproval.requestId ||
                !pending.submitted
              ) return;
              pending.submitted = false;
              const detail = error.trim().slice(0, 240);
              const decision = openApproval.routine ? "routine decision" : "approval";
              enqueueSpeech(
                `I couldn't save that ${decision}${detail ? `: ${detail}` : "."} Please try again.`,
                openApproval.member,
                true,
              );
            },
          });
          return;
        }
        enqueueSpeech("Sorry — is that a yes or a no?", openApproval.member, true);
        return;
      }

      const openQuestion = askedQuestion.current;
      if (openQuestion) {
        askedQuestion.current = null;
        allowBargeIn.current = false;
        dispatch({
          type: "decideRequest",
          threadId: group.threadId,
          requestId: openQuestion.requestId,
          behavior: "answer",
          message: said,
        });
        move("working");
        return;
      }

      const routed = routeSpokenGroupMessage(said, membersRef.current);
      if (defaultResponderRef.current.kind === "mentions" && !routed.addressed) {
        listen();
        const names = membersRef.current.map((member) => member.name).join(", ");
        setNote("Say a member's name" + (names ? " — " + names : "") + " — or say everyone.");
        return;
      }

      allowBargeIn.current = false;
      move(busyRef.current ? "working" : "sending");
      dispatch({ type: "sendGroup", groupId: group.id, text: routed.text, threadId: group.threadId });
      scheduleListen(false, 600);
    });
    const offEnd = bridge.onSpeechEnd(({ code, reason }) => {
      if (!alive.current || currentCall() !== group.id) return;
      if (code === 2) {
        setNote("Calls need macOS dictation, which isn't available here yet.");
        return;
      }
      if (code === 1) {
        setNote(
          reason === "helper-build-failed"
            ? "The dictation helper couldn't be built. Install Apple's Command Line Tools and try again."
            : "Dictation needs Microphone + Speech Recognition access in System Settings.",
        );
        return;
      }
      if (phaseRef.current === "listening") listen();
    });
    if ((group.working || group.busyBotId) && !approval && !question) move("working");
    else listen();
    return () => {
      offTranscript();
      offEnd();
      void window.ogb?.speechStop();
    };
    // Live busy/card changes are handled below without restarting native capture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, enqueueSpeech, group.id, group.threadId, hush, listen, move, scheduleListen]);

  useEffect(() => {
    let resumeAfterRoutine = false;
    if (askedApproval.current && approval?.requestId !== askedApproval.current.requestId) {
      resumeAfterRoutine = askedApproval.current.routine && askedApproval.current.submitted;
      askedApproval.current = null;
    }
    if (askedQuestion.current && question?.card?.requestId !== askedQuestion.current.requestId) {
      askedQuestion.current = null;
    }

    if (resumeAfterRoutine && !approval && !question && !group.working && !group.busyBotId) {
      scheduleListen(true);
      return;
    }
    // Keep the voice queue and microphone closed until this exact decision
    // is settled or its request reports an error.
    if (askedApproval.current?.submitted) return;

    if (approval && askedApproval.current?.requestId !== approval.requestId) {
      const member = members.find((candidate) => candidate.id === approval.message.from?.botId);
      askedApproval.current = {
        requestId: approval.requestId,
        member,
        routine: isRoutineApproval(approval),
        skill: isSkillApproval(approval),
        submitted: false,
      };
      spokenIds.current.add(approval.message.id);
      const name = member?.name ?? approval.message.from?.name ?? "A group member";
      const skillPrompt = approval.message.card?.skillRequest?.action === "update"
        ? `${name} wants to update a learned skill. Open the group thread to review the complete skill before replacing the current version. You can say no to deny it.`
        : `${name} wants to enable a new learned skill. Open the group thread to review the complete skill before enabling it. You can say no to deny it.`;
      enqueueSpeech(isSkillApproval(approval) ? skillPrompt : spokenApprovalPrompt(approval, name), member, true);
    }

    if (question?.card?.requestId && askedQuestion.current?.requestId !== question.card.requestId) {
      const member = members.find((candidate) => candidate.id === question.from?.botId);
      askedQuestion.current = { requestId: question.card.requestId, member };
      spokenIds.current.add(question.id);
      const name = member?.name ?? question.from?.name ?? "A group member";
      const detail = question.card.subtitle.trim();
      const choices = question.card.options.length
        ? " The options are " + question.card.options.join(", ") + "."
        : "";
      enqueueSpeech(
        name + " asks: " + detail + (/[.!?]$/.test(detail) ? "" : ".") + choices,
        member,
        true,
      );
    }

    const fresh = messages.filter((message) => !spokenIds.current.has(message.id));
    if (!fresh.length) return;
    for (const message of fresh) spokenIds.current.add(message.id);

    const replies = fresh.filter(
      (message) => message.role === "bot" && message.kind === "text" && message.text?.trim(),
    );
    for (const reply of replies) {
      const member = members.find((candidate) => candidate.id === reply.from?.botId);
      enqueueSpeech(reply.text!, member);
    }
    if (!replies.length) {
      const chip = [...fresh].reverse().find((message) => message.kind === "activity" && message.tool?.spoken);
      if (chip?.tool?.spoken) {
        const member = members.find((candidate) => candidate.id === chip.from?.botId);
        enqueueSpeech(chip.tool.spoken, member);
      }
    }
  }, [approval, enqueueSpeech, group.busyBotId, group.working, members, messages, question, scheduleListen]);

  useEffect(() => {
    const busy = Boolean(group.working || group.busyBotId);
    busyRef.current = busy;
    if (busy) {
      if (
        (phaseRef.current === "listening" || phaseRef.current === "sending") &&
        !askedApproval.current &&
        !askedQuestion.current &&
        !allowBargeIn.current
      ) {
        move("working");
        hush();
      }
      return;
    }
    allowBargeIn.current = false;
    if (
      (phaseRef.current === "working" || phaseRef.current === "sending") &&
      !askedApproval.current &&
      !askedQuestion.current
    ) {
      scheduleListen();
    }
  }, [group.busyBotId, group.working, hush, move, scheduleListen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        endCall(group.id);
      } else if (event.code === "Space" && speaker.isSpeaking()) {
        event.preventDefault();
        interruptSpeech();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [group.id, interruptSpeech]);

  const speakingMember = members.find((member) => member.id === speakingMemberId);
  const workingMember = members.find((member) => member.id === group.busyBotId);
  // each member on the canvas shows its part of the call
  const memberIds = members.map((member) => member.id).join(",");
  useEffect(() => {
    for (const member of members) {
      announceCallPhase(member.id,
        member.id === speakingMember?.id ? "speaking"
          : member.id === workingMember?.id ? "working"
            : phase === "listening" ? "listening" : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberIds, phase, speakingMember?.id, workingMember?.id]);
  useEffect(() => () => { for (const id of memberIds.split(",")) if (id) announceCallPhase(id, null); }, [memberIds]);

  const status =
    phase === "listening"
      ? pushToTalk
        ? t("call.ui.pushToTalk")
        : t("call.ui.listening")
      : phase === "sending"
        ? t("groupCall.ui.bringingTheGroupIn")
        : phase === "speaking"
          ? t("groupCall.ui.isSpeaking", { name: speakingMember?.name ?? t("groupCall.ui.groupMember") })
          : workingMember
            ? t("groupCall.ui.isWorking", { name: workingMember.name })
            : t("call.ui.working");
  const line = phase === "listening" ? heard : phase === "speaking" ? speech.caption : "";
  const hint = phase === "listening"
    ? (pushToTalk ? t("call.ui.releaseToSend") : t("groupCall.ui.sayAName"))
    : workingMember ? t("groupCall.ui.eachInTurn") : "";

  // design: the members on the canvas plus this strip above the composer;
  // the header keeps "On a call · m:ss" and Hang up
  return (
    <div role="status" aria-live="polite" className="mx-1.5 mb-2 flex flex-col gap-1.5 rounded-xl border border-[rgba(56,213,145,.35)] bg-[rgba(56,213,145,.07)] px-3 py-2.5">
      <div className="flex items-center gap-2 text-[12.5px]">
        <span className={cn("size-[7px] shrink-0 rounded-full bg-[#38d591]", phase === "listening" && "animate-pulse")} style={{ boxShadow: "0 0 8px #38d591" }} />
        <span className="min-w-0 truncate font-medium text-[#7fe8bc]">{status}</span>
        {(phase === "working" || phase === "sending") && <Loader2 size={12} className="animate-spin text-[#7fe8bc]" />}
        <span className="flex-1" />
        {speaker.isSpeaking() && (
          <button onClick={interruptSpeech} className="h-[24px] rounded-full border border-ink/[0.16] px-2.5 text-[11.5px] text-ink hover:bg-ink/[0.06]">
            {t("call.ui.interrupt")}
          </button>
        )}
      </div>
      <div className="min-h-[1.45em] text-[13px] leading-[1.45] text-ink/90">
        {line || <span className="text-ink/50">{hint || "\u00a0"}</span>}
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
      <div className="text-[11px] text-ink/40">{t("groupCall.ui.keys")}</div>
    </div>
  );
}
