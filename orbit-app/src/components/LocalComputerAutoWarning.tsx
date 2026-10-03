import { useEffect, useRef } from "react";
import { t } from "@/lib/i18n";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { AlertTriangle } from "lucide-react";

export const LOCAL_COMPUTER_AUTO_WARNING =
  "Auto mode will let this bot click, type, and run tools on this computer without asking first. Destructive and sensitive actions still stop. Continue only if you are watching.";

export function LocalComputerAutoWarning({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // in the column when there is one; the bare map keeps the overlay
    <ColumnLayer onClose={onCancel} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="local-auto-warning-title"
        aria-describedby="local-auto-warning-body"
        className="w-full max-w-[420px] rounded-[14px] border border-ink/[0.1] bg-panel p-5 shadow-[0_20px_50px_rgba(0,0,0,.55)]"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
          <div>
            <h2 id="local-auto-warning-title" className="text-[15px] font-semibold text-ink">
              {t("localComputerAutoWarning.ui.allowAutoModeOnThisComputer")}
            </h2>
            <p id="local-auto-warning-body" className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
              {LOCAL_COMPUTER_AUTO_WARNING}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"
          >
            {t("localComputerAutoWarning.ui.cancel")}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-ink px-4 py-2 text-[13px] font-medium text-app hover:brightness-110"
          >
            {t("localComputerAutoWarning.ui.ok")}
          </button>
        </div>
      </div>
    </ColumnLayer>
  );
}
