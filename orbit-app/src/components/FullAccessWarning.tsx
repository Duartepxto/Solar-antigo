import { useEffect, useRef } from "react";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { t } from "@/lib/i18n";
import { ShieldAlert } from "lucide-react";

export const FULL_ACCESS_WARNING =
  "This bot can read, edit, delete files, use the internet, and control its selected computer without asking—even for potentially destructive or sensitive actions. This also applies to scheduled work and tasks delegated by your Chief or other bots. It does not enable Full access on other bots. Some providers may still require approval. Questions and separate Orbit confirmations still wait for you. This does not grant operating-system permissions or access to accounts you have not connected.";

export function FullAccessWarning({
  open,
  onCancel,
  onConfirm,
  scope = "bot",
  allThreads,
  onAllThreadsChange,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  scope?: "bot" | "thread";
  allThreads?: boolean;
  onAllThreadsChange?: (value: boolean) => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // in the column when there is one; the bare map keeps the overlay
    <ColumnLayer onClose={onCancel} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="full-access-warning-title"
        aria-describedby="full-access-warning-body"
        className="w-full max-w-[440px] rounded-[14px] border border-[#ff5667]/40 bg-panel p-5 shadow-[0_20px_50px_rgba(0,0,0,.55)]"
      >
        <div className="flex items-start gap-3">
          <ShieldAlert size={19} className="mt-0.5 shrink-0 text-[#ff8a96]" />
          <div>
            <h2 id="full-access-warning-title" className="text-[15px] font-semibold text-ink">
              {t("fullAccessWarning.ui.enableFullAccess")}
            </h2>
            <p id="full-access-warning-body" className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
              {scope === "thread"
                ? "Enable Full access for this thread only, including work delegated here. It can read, edit and delete files, use the internet, and control its selected computer without asking—even for destructive or sensitive actions. The bot default and other threads keep their approval levels. Provider safety restrictions, questions and separate Orbit confirmations still apply."
                : FULL_ACCESS_WARNING}
            </p>
          </div>
        </div>
        {scope === "bot" && onAllThreadsChange && <label className="mt-4 flex items-start gap-2 text-[13px] text-ink">
          <input type="checkbox" className="mt-0.5 accent-accent" checked={Boolean(allThreads)}
            onChange={event => onAllThreadsChange(event.target.checked)} />
          <span>Apply to all existing and future threads
            <span className="mt-1 block text-ink/55">{t("fullAccess.ui.includesArchivedThreadsOtherBotsKeep")}</span>
          </span>
        </label>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"
          >
            {t("fullAccessWarning.ui.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#ff5667] px-4 py-2 text-[13px] font-medium text-white hover:brightness-110"
          >
            {t("fullAccessWarning.ui.enableFullAccess2")}
          </button>
        </div>
      </div>
    </ColumnLayer>
  );
}
