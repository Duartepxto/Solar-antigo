// Runs the guided tour on the live interface. One spotlight at a time,
// pointing at a real control, with Next on every step; the tour presses the
// controls itself (the Tools menu, its items, the Computer button), so it
// never waits on the user and the app reacts exactly as it would for them.
// Clicking the pointed-at control counts as Next too. Every advance is
// written to the server's hint list first, so a reload lands on the same
// step.
import { useCallback, useEffect, useRef, useState } from "react";
import { ANCHOR_EFFECTS, currentStep, stepNumber, TOUR_STEPS, withTourFinished, withTourReset, type TourEffect, type TourStep } from "@/lib/guided-tour";
import { t } from "@/lib/i18n";
import type { MausState } from "@/lib/mascot";
import { completionPatch, hintSeenPatch } from "@/lib/onboarding";
import type { LocaleKey } from "@/locales";
import { api, useStore, type ConfigStatus } from "@/state/store";
import { Spotlight } from "./Spotlight";
import { ORBIT_FOCUS_EVENT, orbitNavigate } from "@/orbit/events";

const MASCOT: Record<TourStep["id"], MausState> = {
  "tour.composer": "happy",
  "tour.model": "curious",
  "tour.computer": "working",
  "tour.computer-browser": "curious",
  "tour.apps": "happy",
  "tour.apps-panel": "proud",
  "tour.automations": "happy",
  "tour.automations-page": "drowsy",
  "tour.done": "celebrate",
};

const copy = (id: TourStep["id"]) => t(`onboarding.tour.${id.slice(5)}` as LocaleKey);

function visible(anchor: string): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${anchor}"]`));
  return all.filter((el) => el.getClientRects().length > 0).at(-1) ?? null;
}

function anchorPresent(anchor: string | null): boolean {
  return !anchor || visible(anchor) !== null;
}

/** Press a control the way the user would; false when it is not on screen. */
/** Open what the anchor opens. An Orbit system is a toggle, so one already
 * open (aria-pressed) is left alone rather than pressed shut. */
function press(anchor: string): boolean {
  const el = visible(anchor);
  if (!el) return false;
  if (el.getAttribute("aria-pressed") !== "true") el.click();
  return true;
}

/** Close what an Orbit system opened: press it again only while it is open. */
function release(anchor: string): void {
  const el = visible(anchor);
  if (el?.getAttribute("aria-pressed") === "true") el.click();
}

/** Run the guided tour again from its first step: clear its progress in the
 * workspace record (marking the welcome done for an upgraded user who only
 * passed the old browser gate), then open it. Resolves false when the record
 * could not be saved. */
export async function restartGuidedTour(config: ConfigStatus | null | undefined, dispatch: ReturnType<typeof useStore>["dispatch"]): Promise<boolean> {
  try {
    const next = await api("/api/config", {
      method: "PUT",
      body: JSON.stringify({ onboarding: {
        ...(!config?.onboarding?.completedAt ? completionPatch().onboarding : {}),
        hintsSeen: withTourReset(config?.onboarding),
      } }),
      signal: AbortSignal.timeout(10_000),
    });
    dispatch({ type: "configStatus", config: next });
    dispatch({ type: "toggleTour", open: true });
    return true;
  } catch {
    return false;
  }
}

export function GuidedTour() {
  const { state, dispatch } = useStore();
  const record = state.config?.onboarding;
  const step = currentStep(record);
  const saving = useRef(false);
  const pending = useRef<Promise<unknown>>(Promise.resolve());
  const latestRecord = useRef(record);
  latestRecord.current = record;
  const closed = useRef(false);
  const [dismissed, setDismissed] = useState(false);
  const [failed, setFailed] = useState(false);
  const entered = useRef<string | null>(null);
  const [fallback, setFallback] = useState<string | null>(null);

  useEffect(() => {
    if (!state.tourOpen) return;
    closed.current = false;
    setDismissed(false);
    setFailed(false);
  }, [state.tourOpen]);

  const run = useCallback(
    (effect: TourEffect | undefined) => {
      switch (effect) {
        case "openComputer": {
          // Orbit: the bot's Computer system opens its panel in the column
          if (!press("cap-computer") && !state.computerOpen) dispatch({ type: "toggleComputer", open: true });
          return;
        }
        case "closeComputer": {
          release("cap-computer");
          if (state.computerOpen) dispatch({ type: "toggleComputer", open: false });
          return;
        }
        case "focusBot":
          // Orbit flies to the selected bot; the steps point at its view
          window.dispatchEvent(new CustomEvent(ORBIT_FOCUS_EVENT, { detail: { botId: import.meta.env.VITE_JARVIS_SOLAR === 'true' ? state.bots.find(bot=>!bot.hidden&&bot.system!=='orbit'&&!/^jarvis(?:\s|$)/i.test(bot.name))?.id ?? state.selectedId : state.selectedId } }));
          return;
        case "showMap":
          orbitNavigate({ to: "fit" });
          return;
        case "openApps":
          if (!press("cap-apps")) dispatch({ type: "togglePlugins", open: true });
          return;
        case "closeApps":
          release("cap-apps");
          dispatch({ type: "togglePlugins", open: false });
          return;
        case "openAutomations":
          if (!press("cap-routines")) dispatch({ type: "showRoutines" });
          return;
        case "backToChat":
          release("cap-routines");
          dispatch({ type: "showChat" });
          return;
        default:
          return;
      }
    },
    [dispatch, state.computerOpen, state.selectedId, state.bots],
  );

  const save = useCallback(
    (finish: boolean, id?: TourStep["id"]) => {
      // A skip must follow an in-flight Next, not disappear behind its guard.
      const operation = pending.current.then(async () => {
        const patch = finish
          ? { onboarding: { hintsSeen: withTourFinished(latestRecord.current) } }
          : id ? hintSeenPatch(latestRecord.current, id) : null;
        if (!patch) return;
        const config = await api("/api/config", { method: "PUT", body: JSON.stringify(patch), signal: AbortSignal.timeout(10_000) });
        latestRecord.current = config.onboarding;
        dispatch({ type: "configStatus", config });
      });
      pending.current = operation.catch(() => {});
      return operation;
    },
    [dispatch],
  );

  const advance = useCallback(
    (fromAnchor = false) => {
      if (!step || saving.current || closed.current) return;
      saving.current = true;
      setFailed(false);
      void save(false, step.id).then(() => {
        // Only move the interface after progress was saved. A queued skip
        // owns cleanup and must not have its panels reopened by this request.
        if (!closed.current && !(fromAnchor && step.onExit && ANCHOR_EFFECTS.has(step.onExit))) run(step.onExit);
      }).catch(() => setFailed(true)).finally(() => { saving.current = false; });
    },
    [step, run, save],
  );

  const finish = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    setDismissed(true);
    // leave nothing open behind: the panel, the menu, the Automations page
    if (state.computerOpen) run("closeComputer");
    if (state.pluginsOpen) run("closeApps");
    run("backToChat");
    void save(true).catch(() => {});
    dispatch({ type: "toggleTour", open: false });
  }, [state.computerOpen, state.pluginsOpen, run, save, dispatch]);

  const active = !dismissed && Boolean(record?.completedAt) && !state.welcomeOpen && step !== null;

  // entering a step runs its effect once per step
  useEffect(() => {
    if (!active || !step || entered.current === step.id) return;
    entered.current = step.id;
    run(step.onEnter);
  }, [active, step, run]);

  // a step whose control is not on screen points at its fallback, or skips
  // itself, after the layout has a moment to settle (a menu closing, a
  // page changing, a panel mounting). Its enter effect is pressed once
  // more first: on a cold load the sidebar may not have been there yet.
  useEffect(() => {
    if (!active || !step?.skipIfMissing) return;
    let second: ReturnType<typeof setTimeout> | undefined;
    const decide = () => {
      if (anchorPresent(step.anchor)) return;
      if (step.fallbackAnchor && anchorPresent(step.fallbackAnchor)) setFallback(step.id);
      else advance();
    };
    const first = setTimeout(() => {
      if (anchorPresent(step.anchor)) return;
      run(step.onEnter);
      second = setTimeout(decide, 300);
    }, 400);
    return () => {
      clearTimeout(first);
      if (second) clearTimeout(second);
    };
  }, [active, step, advance, run]);

  // clicking the pointed-at control is as good as Next
  useEffect(() => {
    if (!active || !step?.anchor || step.id === "tour.apps-panel" || step.id === "tour.automations-page" || step.id === "tour.done") return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(`[data-tour="${step.anchor}"]`)) advance(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active, step, advance]);

  if (!active || !step) return null;
  if (window.ogb?.remoteClient?.active === true) return null;

  const { current, total } = stepNumber(step);
  const closing = step.id === "tour.done";
  const anchor = fallback === step.id && step.fallbackAnchor ? step.fallbackAnchor : step.anchor;
  return (
    <Spotlight
      anchor={anchor}
      placement={step.placement}
      mascot={MASCOT[step.id]}
      progress={closing ? undefined : t("onboarding.tour.progress", { current, total })}
      primary={{ label: closing ? t("onboarding.tour.finish") : t("onboarding.tour.next"), onClick: closing ? finish : () => advance() }}
      secondary={closing ? undefined : { label: t("onboarding.tour.skip"), onClick: finish }}
      onDone={finish}
    >
      {copy(step.id)}
      {failed && <p role="alert" className="mt-2 text-[#ff8a96]">{t("onboarding.tour.error")}</p>}
    </Spotlight>
  );
}

export { TOUR_STEPS };
