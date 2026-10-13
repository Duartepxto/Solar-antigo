// Beat: what's installed. One list, ready engines first, each row a mark,
// a name, a version and a status pill; an engine that needs work opens its
// setup inline under the row, with the instructions from the driver so
// they are right for this platform. A summary line says the whole story in
// a glance and offers Check again, because the user often installs from a
// terminal and comes back. The guide reacts to the result.
//
// On the packaged desktop, a first row offers organisation sign-in for
// people who use the app at work; a signed-in Company engine then counts as
// ready, so an employee with only company models is not told to set up
// personal engines. Without that bridge the beat is exactly as before.
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { EngineSetup } from "@/components/EngineSetup";
import { engineReady } from "@/components/EngineLibrary";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { engineSummary, organisationSignIn } from "@/lib/onboarding";
import { api, useStore, type InstanceInfo } from "@/state/store";
import { OrganisationRow } from "./OrganisationRow";
import { PrimaryButton, staggerIndex, type BeatProps } from "./shared";

function version(instance: InstanceInfo): string | null {
  return instance.snapshot.version ? instance.snapshot.version.split(" ")[0]! : null;
}

function StatusPill({ ready }: { ready: boolean }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center gap-1.5 text-[12.5px]", ready ? "text-success" : "text-warning")}
    >
      <span className={cn("size-[7px] rounded-full", ready ? "bg-success" : "bg-warning")} aria-hidden="true" />
      {ready ? t("onboarding.engines.ready") : t("onboarding.engines.needsSetup")}
    </span>
  );
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <div className="animate-rise flex min-h-[40px] items-center gap-3 py-2.5" style={staggerIndex(index)} aria-hidden="true">
      <span className="size-[18px] rounded-md bg-ink/[0.06]" />
      <span className="h-3 w-32 rounded bg-ink/[0.06]" />
      <span className="ml-auto h-4 w-14 rounded-full bg-ink/[0.06]" />
    </div>
  );
}

export function EnginesBeat({
  onNext,
  setMascot,
  bump,
  hosted = false,
  onOpenOrganisation,
}: BeatProps & {
  hosted?: boolean;
  /** Settings → Organisation; the flow resumes here when it closes. */
  onOpenOrganisation?: () => void;
}) {
  const { state, dispatch } = useStore();
  const organisation = organisationSignIn(window.ogb, { hosted });
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const latestRequest = useRef(0);
  // EngineSetup updates the shared inventory after sign-in. Keep that source
  // of truth instead of a private snapshot that remains stale until focus.
  const instances = loaded || state.instances.length ? state.instances : null;
  const [checking, setChecking] = useState(false);
  // Every setup block starts closed; a row opens its own on click. The
  // list stays a scannable summary until the user chooses an engine.
  const [open, setOpen] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const request = ++latestRequest.current;
    setChecking(true);
    try {
      const d = await api("/api/instances", { signal: AbortSignal.timeout(10_000) });
      if (request !== latestRequest.current) return;
      dispatch({ type: "instances", instances: d.instances ?? [] });
      setLoaded(true);
      setFailed(false);
    } catch {
      if (request === latestRequest.current) setFailed(true);
    } finally {
      if (request === latestRequest.current) setChecking(false);
    }
  }, [dispatch]);

  useEffect(() => {
    void refresh();
    return () => {
      latestRequest.current++;
    };
  }, [refresh]);

  const summary = engineSummary(instances ?? [], engineReady, { company: Boolean(organisation) });
  const { ready, setup } = summary;
  const allReady = instances !== null && summary.allReady;
  const expanded = open;

  // The guide searches while the harness answers, then looks proud or
  // curious depending on whether there is work left for the user.
  useEffect(() => {
    if (instances === null) {
      setMascot("searching");
      return;
    }
    if (allReady) {
      setMascot("proud");
      bump("success");
    } else {
      setMascot("curious");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instances === null, allReady, setup.length]);

  return (
    <div className="flex min-h-0 flex-col">
      <p className="animate-rise mt-3 text-pretty text-[14px] leading-[1.6] text-ink/80">{t("onboarding.engines.intro")}</p>

      {organisation && (
        <OrganisationRow
          bridge={organisation}
          onOpenSettings={() => (onOpenOrganisation ? onOpenOrganisation() : dispatch({ type: "toggleAppSettings", open: true, section: "organization" }))}
          onConnected={() => void refresh()}
        />
      )}

      {failed && instances !== null && <p role="alert" className="mt-2 text-[13px] text-[#ff8a96]">{t("onboarding.engines.error")}</p>}
      {summary.company > 0 && ready.length + setup.length > 0 && (
        <p className="mt-2 text-[12px] text-ink/55">{t("onboarding.org.personalOptional")}</p>
      )}

      {/* design: engines — plain rows, a status per engine, Set up where it applies */}
      <div className="animate-rise mt-2.5 flex min-h-0 flex-col overflow-y-auto [scrollbar-width:thin]" style={staggerIndex(2)}>
        {instances === null
          ? !failed && [0, 1, 2].map((i) => <SkeletonRow key={i} index={i} />)
          : [...ready, ...setup].map((instance, i) => {
              const ok = engineReady(instance);
              const v = version(instance);
              const open = expanded === instance.instanceId;
              return (
                <div key={instance.instanceId} className="animate-rise border-b border-ink/[0.08]" style={staggerIndex(i)}>
                  <div className="solar-welcome-engine-row flex items-center gap-2.5 py-2.5" title={v ?? undefined}>
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{instance.displayName}</span>
                    <StatusPill ready={ok} />
                    {!ok && (
                      <button type="button" onClick={() => setOpen(open ? null : instance.instanceId)} aria-expanded={open}
                        className="h-[26px] shrink-0 rounded-full border border-ink/[0.16] px-2.5 text-[12px] font-medium text-ink hover:bg-ink/[0.06]">
                        {open ? t("onboarding.engines.hideSetup") : t("onboarding.engines.setUp")}
                      </button>
                    )}
                  </div>
                  {!ok && open && (
                    <EngineSetup
                      instance={instance}
                      intent={instance.access === "custom" ? "inject" : "cloud"}
                      className="mb-3 border-0 bg-ink/[0.03]"
                    />
                  )}
                </div>
              );
            })}
      </div>
      {/* the whole story in one line, and the way back after a terminal trip */}
      <div className="animate-rise mt-2.5 flex items-center justify-between gap-3" style={staggerIndex(3)}>
        <div className={cn("flex items-center gap-2 text-[12.5px]", allReady ? "text-success" : "text-ink/60")} aria-live="polite">
          {instances === null ? (
            <span>{failed ? t("onboarding.engines.error") : t("common.checking")}</span>
          ) : allReady ? (
            <>
              <Check size={14} strokeWidth={2.5} />
              <span>{t("onboarding.engines.allReady")}</span>
            </>
          ) : (
            <span className="tabular-nums">
              {t("onboarding.engines.readyCount", { count: ready.length })}
              <span className="mx-1"> · </span>
              {t("onboarding.engines.setupCount", { count: setup.length })}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={checking}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-50"
        >
          <RefreshCw size={12} className={checking ? "animate-spin" : ""} />
          {checking ? t("common.checking") : t("common.checkAgain")}
        </button>
      </div>

      <PrimaryButton onClick={onNext} className="mt-5">
        {t("onboarding.continue")}
      </PrimaryButton>
    </div>
  );
}
