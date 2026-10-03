import { BookmarkPlus, CheckCircle2, ChevronDown, ChevronUp, ListChecks, Loader2, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { runSummary, type RunStep } from "@/lib/verify-steps";

function StatusIcon({ status }: { status: RunStep["status"] }) {
  const className = "size-4 shrink-0";
  switch (status) {
    case "running":
      return <Loader2 aria-hidden="true" className={cn(className, "animate-spin text-ink")} />;
    case "passed":
      return <CheckCircle2 aria-hidden="true" className={cn(className, "text-success")} />;
    case "failed":
      return <XCircle aria-hidden="true" className={cn(className, "text-[#ff8a96]")} />;
  }
}

const ICON_BUTTON =
  "flex size-7 shrink-0 items-center justify-center rounded-lg text-ink/55 outline-none hover:bg-ink/[0.1] hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/30";

/** A bot's run in the current ask as a checklist — every command it ran,
 * the control-CLI ones tagged verified — with one action: put the run into
 * the composer as a skill request, for the person to annotate and send
 * through the ordinary skill review flow. The card renders whatever steps it
 * is given; whether a run is worth a card (`showRun`) is the caller's call.
 * Collapse is the card's own (a long run starts folded); dismissal is the
 * caller's, since it outlives the card. */
export function VerifyCard({
  steps,
  canSave,
  staged,
  onDismiss,
  onSave,
}: {
  steps: RunStep[];
  /** The run can be saved now: skill authoring is on, the engine has the
   * agents tools, something passed, nothing is still running or busy. */
  canSave: boolean;
  /** A skill from this run is already waiting for review. */
  staged: boolean;
  onDismiss: () => void;
  /** Fills the thread's composer with the run; nothing is sent. */
  onSave: () => void;
}) {
  // a live run grows a step at a time: past a few it folds to one row (the
  // latest step), so it never pushes the conversation up. Your own open or
  // close wins from then on.
  const [choice, setChoice] = useState<boolean | null>(null);
  const collapsed = choice ?? steps.length > 3;
  const list = useRef<HTMLOListElement>(null);
  const latest = steps[steps.length - 1];
  useEffect(() => { if (list.current) list.current.scrollTop = list.current.scrollHeight; }, [steps.length, collapsed]);
  if (steps.length === 0 || !latest) return null;
  const toggleLabel = collapsed ? t("chat.verify.expand") : t("chat.verify.collapse");
  return (
    <section
      aria-label={t("chat.verify.aria")}
      className="pointer-events-auto w-[22rem] max-w-full rounded-[14px] border border-ink/[0.1] bg-panel text-ink shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <ListChecks size={14} className="shrink-0 text-ink" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[13px] font-medium">{t("chat.verify.title")}</span>
          <span role="status" aria-live="polite" aria-atomic="true" className="text-[12px] text-ink/55">
            {runSummary(steps).label}
          </span>
          {collapsed && (
            <span className="flex min-w-0 items-center gap-1.5 pt-0.5">
              <StatusIcon status={latest.status} />
              <span className="shrink-0 text-[12px] font-medium">{latest.label}</span>
              <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink/50" title={latest.command}>{latest.command}</code>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setChoice(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={toggleLabel}
          title={toggleLabel}
          className={ICON_BUTTON}
        >
          {collapsed ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
        </button>
        <button type="button" onClick={onDismiss} aria-label={t("chat.verify.dismiss")} title={t("chat.verify.dismiss")} className={ICON_BUTTON}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      {!collapsed && (
        <>
          <ol
            ref={list}
            tabIndex={0}
            aria-label={t("chat.verify.steps")}
            className="max-h-40 overflow-y-auto border-t border-ink/[0.1] px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            {steps.map((step) => (
              <li key={step.id} className="flex min-w-0 items-center gap-2 py-1">
                <StatusIcon status={step.status} />
                <span className="shrink-0 text-[13px] font-medium">{step.label}</span>
                {step.verified && (
                  <span className="shrink-0 text-[10.5px] uppercase tracking-wide text-success">{t("chat.verify.verifiedTag")}</span>
                )}
                <code className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink/55" title={step.command}>
                  {step.command}
                </code>
              </li>
            ))}
          </ol>
          {staged ? (
            <div className="border-t border-ink/[0.1] px-3 py-2 text-[12px] text-ink/55">{t("chat.verify.staged")}</div>
          ) : canSave && (
            <div className="flex flex-col items-end gap-1 border-t border-ink/[0.1] px-3 py-2">
              <button
                type="button"
                onClick={onSave}
                className="flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-ink/55 outline-none hover:bg-ink/[0.1] hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/30"
              >
                <BookmarkPlus size={13} aria-hidden="true" />
                {t("chat.verify.save")}
              </button>
              <span className="text-[12px] text-ink/55">{t("chat.verify.saveHint")}</span>
            </div>
          )}
        </>
      )}
    </section>
  );
}
