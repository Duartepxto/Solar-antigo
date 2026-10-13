// The welcome flow: one card, one guide, a handful of beats. The card is the
// same element for the whole flow and morphs between beats with the View
// Transitions API (the card, the mascot and the title keep their names, so
// the browser moves and resizes them instead of cross-fading two cards).
// The guide mascot is mounted once so its face engine carries over; beats
// borrow it through setMascot/bump rather than rendering their own.
//
// Nothing here can brick the app: every beat is skippable, Escape skips the
// whole tour, and completion is written to the workspace config. A failed
// write still dismisses this visit, but may require retrying on the next launch.
//
// A hosted team workspace gets its own short set (a greeting, then the bot):
// its organisation assigns the models, and nothing there is installed on,
// granted to or paired with this computer.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { GuideCharacter } from "@/orbit/GuideCharacter";
import { useDesktopCapabilities } from "@/components/DesktopCapabilities";
import { setEmailGateDone } from "@/lib/email-gate";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { MausMotion, MausState } from "@/lib/mascot";
import {
  beatsFor,
  completionPatch,
  nextBeat,
  previousBeat,
  type BeatId,
} from "@/lib/onboarding";
import { api, useStore, type Bot } from "@/state/store";
import { EnginesBeat } from "./beats/EnginesBeat";
import { HelloBeat } from "./beats/HelloBeat";
import { MeetYourBotBeat } from "./beats/MeetYourBotBeat";
import { PermissionsBeat } from "./beats/PermissionsBeat";
import { PhoneBeat } from "./beats/PhoneBeat";
import { QuietButton, WelcomeFooterContext } from "./beats/shared";
import { withViewTransition } from "./view-transition";
import { SolarWelcomeFrame } from "./SolarWelcomeFrame";
import { ProgressDots } from "./ProgressDots";
import { FeatureReel } from "./reel/FeatureReel";
import { useSolarSpeechReady } from '@/lib/solar-voice';
import { SolarFeatureReel } from './reel/SolarFeatureReel';

/** The guide's resting face per beat; beats may override it as they learn
 * more (the engines beat looks proud or curious once the harness answers). */
const MASCOT_FOR_BEAT: Record<BeatId, MausState> = {
  hello: "happy",
  reel: "curious",
  engines: "searching",
  permissions: "listening",
  phone: "sending",
  bot: "celebrate",
};

function beatTitle(beat: BeatId): string | null {
  switch (beat) {
    case "hello":
      return t("onboarding.welcome", { app: brand().name });
    case "engines":
      return t("onboarding.engines.title");
    case "permissions":
      return t("onboarding.perms.title");
    case "bot":
      return t("onboarding.bot.title");
    case "reel":
      return t("onboarding.reel.title");
    case "phone":
      return t("onboarding.phone.title");
  }
}

type Motion = Exclude<MausMotion, "none">;

export function WelcomeFlow({
  bot,
  onDone,
  replay = false,
  initialBeat,
  embedded = false,
  reel = true,
  dictation,
  entrance = "arrive",
  hosted = false,
  onOpenOrganisation,
}: {
  /** The seeded bot the exit beat names; null when the roster is empty. */
  bot: Bot | null;
  onDone: () => void;
  /** Replays skip nothing but are tracked separately. */
  replay?: boolean;
  /** Open on a given beat: the preview, and resuming after the engines beat
   * sent the person to Settings → Organisation. */
  initialBeat?: BeatId;
  /** Preview only: fill the parent instead of the viewport. */
  embedded?: boolean;
  /** The feature reel beat; the preview gallery turns it off. */
  reel?: boolean;
  /** Preview only: pretend the microphone can be asked for (or not). */
  dictation?: boolean;
  /** The guide's first motion beat on mount. */
  entrance?: Motion;
  /** A hosted team workspace: the hosted beat set, no email field. */
  hosted?: boolean;
  /** The engines beat's organisation row asks for Settings → Organisation. */
  onOpenOrganisation?: () => void;
}) {
  const { dispatch } = useStore();
  const { capabilities } = useDesktopCapabilities();
  const solarReady = useSolarSpeechReady();
  const beats = beatsFor({ dictation: dictation ?? (solarReady || capabilities.dictation.available), reel, hosted });
  const [beat, setBeat] = useState<BeatId>(() => (initialBeat && beats.includes(initialBeat) ? initialBeat : "hello"));
  const [mascot, setMascot] = useState<MausState>(MASCOT_FOR_BEAT[beat]);
  const [motion, setMotion] = useState<{ kind: Motion; key: number }>({ kind: "blink", key: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [footer, setFooter] = useState<HTMLDivElement | null>(null);
  const finishing = useRef(false);

  const bump = useCallback((kind: Motion) => setMotion((m) => ({ kind, key: m.key + 1 })), []);

  // In the desktop app the window itself is the welcome window: it shrinks
  // to 460 × 560 while the flow is open and grows back when it ends. A
  // browser tab can't resize itself, so there the card stands in for it.
  const [nativeWindow] = useState(() => !embedded && typeof window !== "undefined" && Boolean(window.ogb?.windowControls?.welcome));
  useEffect(() => {
    if (!nativeWindow) return;
    void window.ogb?.windowControls?.welcome?.(true);
    return () => void window.ogb?.windowControls?.welcome?.(false);
  }, [nativeWindow]);

  // The entrance waits one frame. A spin issued in the same commit that
  // mounts the avatar lands before its engine has drawn, and the face never
  // comes back; the mascot gallery never hits this because its motions are
  // always triggered on an avatar that is already on screen.
  useEffect(() => {
    const frame = requestAnimationFrame(() => bump(entrance));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  }, [beat, replay]);

  /** Move to another beat. The View Transitions API snapshots the old card,
   * applies the state change synchronously, then animates named elements to
   * their new place; without it (or under reduced motion) the swap is instant. */
  const go = useCallback(
    (target: BeatId) => {
      withViewTransition(() => {
        setBeat(target);
        setMascot(MASCOT_FOR_BEAT[target]);
      });
      bump("switch");
    },
    [bump],
  );

  const finish = useCallback(
    async (_reason: "completed" | "skipped") => {
      if (finishing.current) return;
      finishing.current = true;
      // one release of the old browser-side gate, so a downgrade stays quiet
      setEmailGateDone("submitted");
      // A slow/offline server must not trap the user behind the welcome card.
      onDone();
      try {
        const config = await api("/api/config", { method: "PUT", body: JSON.stringify(completionPatch()), signal: AbortSignal.timeout(10_000) });
        dispatch({ type: "configStatus", config });
      } catch {
        // offline or a paired client without admin scope: the caller still
        // closes the tour; it comes back next launch, which is the honest state
      }
    },
    [beat, dispatch, onDone, replay],
  );

  const next = nextBeat(beats, beat);
  const previous = previousBeat(beats, beat);
  const advance = useCallback(() => {
    if (next) go(next);
    else void finish("completed");
  }, [next, go, finish]);

  // Escape skips the tour; Tab stays inside the card.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      void finish("skipped");
      return;
    }
    if (event.key !== "Tab" || !cardRef.current) return;
    const focusable = Array.from(
      cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Keyboard focus lands on the beat's first real control: an autofocused
  // input where there is one, else the primary button. Never the card
  // itself, which would draw the focus ring around the whole dialog, and
  // never "Skip tour", which is first in the DOM but last in intent.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || card.contains(document.activeElement)) return;
    const target =
      card.querySelector<HTMLElement>("[autofocus], input, textarea, select") ??
      card.querySelector<HTMLElement>("[data-primary]") ??
      card;
    target.focus({ preventScroll: true });
  }, [beat]);

  const hello = beat === "hello";
  const solar = import.meta.env.VITE_JARVIS_SOLAR === "true";
  const title = solar ? t({
    hello: "jarvis.welcome.v3.hello", reel: "jarvis.welcome.v3.reel",
    engines: "jarvis.welcome.v3.engines", permissions: "jarvis.welcome.v3.permissions",
    phone: "jarvis.welcome.v3.phone", bot: "jarvis.welcome.v3.bot",
  }[beat] as import("@/locales").LocaleKey) : beatTitle(beat);
  const logo = hello ? brand().logo : undefined;
  const beatProps = { onNext: advance, onSkip: advance, setMascot, bump };
  const current = beats.indexOf(beat) + 1;

  if (solar) return <SolarWelcomeFrame cardRef={cardRef} nativeWindow={nativeWindow} embedded={embedded}
    title={title} current={current} total={beats.length} previous={Boolean(previous)}
    onBack={() => { if (previous) go(previous); }} onSkip={() => void finish("skipped")}
    onKeyDown={onKeyDown} setFooter={setFooter}>
        <WelcomeFooterContext.Provider value={footer}>
        <div key={beat} className="solar-welcome-step flex shrink-0 flex-col">
          {beat === "hello" && <HelloBeat {...beatProps} hosted={hosted} />}
          {beat === "reel" && (import.meta.env.VITE_JARVIS_SOLAR === 'true' ? <SolarFeatureReel {...beatProps} /> : <FeatureReel {...beatProps} />)}
          {beat === "engines" && <EnginesBeat {...beatProps} hosted={hosted} onOpenOrganisation={onOpenOrganisation} />}
          {beat === "permissions" && <PermissionsBeat {...beatProps} />}
          {beat === "phone" && <PhoneBeat {...beatProps} />}
          {beat === "bot" && (
            <MeetYourBotBeat
              bot={bot}
              onFinish={() => void finish("completed")}
              setMascot={setMascot}
              bump={bump}
            />
          )}
        </div>
        </WelcomeFooterContext.Provider>
  </SolarWelcomeFrame>;

  return (
    <div
      className={cn(
        // The app becomes a small centred window of its own (design: the
        // onboarding window); the map waits behind until the flow is done.
        "flex items-center justify-center",
        !nativeWindow && "p-[18px]",
        embedded ? "relative h-full w-full" : "fixed inset-0 z-50",
      )}
      style={nativeWindow ? { background: "var(--color-app)" } : { background: "radial-gradient(1100px 700px at 18% 8%, color-mix(in srgb, var(--color-accent) 12%, var(--color-app)) 0, var(--color-app) 62%), var(--color-app)" }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("onboarding.dialog")}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn("welcome-card relative flex flex-col overflow-hidden bg-app outline-none",
          nativeWindow ? "h-full w-full" : "h-[min(560px,100%)] w-full max-w-[460px] rounded-xl border border-ink/[0.09] shadow-[0_30px_80px_rgba(0,0,0,.6)]")}
      >
        {/* Title bar: no title, no divider — just the way out (and, in the
            desktop app, the window's own traffic lights and drag area) */}
        <div className="flex h-[38px] shrink-0 items-center px-3 [-webkit-app-region:drag]">
          <span className="flex-1" />
          <button type="button" onClick={() => void finish("skipped")}
            className="h-[26px] rounded-full [-webkit-app-region:no-drag] px-2.5 text-[12px] font-medium text-ink/55 hover:bg-ink/[0.07] hover:text-ink">
            {t("onboarding.skipTour")}
          </button>
        </div>

        {/* Content is top-aligned; a long step scrolls inside the window */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-2">
        <div className="flex shrink-0 flex-col items-center">
          <div className="welcome-maus flex shrink-0">
            {logo ? (
              <img src={logo} alt="" width={96} height={96} className="my-6 h-24 w-24 object-contain" />
            ) : (
              <GuideCharacter mood={mascot} pulse={motion.key} size={150} />
            )}
          </div>
          {title && (
            <h1 className="welcome-title -mt-2 text-center text-[22px] font-semibold leading-[27px] tracking-[-0.01em] text-ink">
              {title}
            </h1>
          )}
        </div>

        {/* keyed so a beat's rise-in plays once per visit, never on re-render */}
        <WelcomeFooterContext.Provider value={footer}>
        <div key={beat} className="flex shrink-0 flex-col">
          {beat === "hello" && <HelloBeat {...beatProps} hosted={hosted} />}
          {beat === "reel" && (import.meta.env.VITE_JARVIS_SOLAR === 'true' ? <SolarFeatureReel {...beatProps} /> : <FeatureReel {...beatProps} />)}
          {beat === "engines" && <EnginesBeat {...beatProps} hosted={hosted} onOpenOrganisation={onOpenOrganisation} />}
          {beat === "permissions" && <PermissionsBeat {...beatProps} />}
          {beat === "phone" && <PhoneBeat {...beatProps} />}
          {beat === "bot" && (
            <MeetYourBotBeat
              bot={bot}
              onFinish={() => void finish("completed")}
              setMascot={setMascot}
              bump={bump}
            />
          )}
        </div>
        </WelcomeFooterContext.Provider>

        </div>

        {/* Footer, fixed: Back · progress · the beat's primary action */}
        <div className="grid h-[64px] shrink-0 grid-cols-[1fr_auto_1fr] items-center px-[26px]">
          {previous ? (
            <QuietButton onClick={() => go(previous)} className="justify-self-start">{t("onboarding.back")}</QuietButton>
          ) : (
            <span />
          )}
          <ProgressDots items={beats.map((id) => ({ id }))} index={current - 1} />
          <div ref={setFooter} className="flex justify-self-end" />
          <span className="sr-only" aria-live="polite">{t("onboarding.progress", { current, total: beats.length })}</span>
        </div>
      </div>
    </div>
  );
}
