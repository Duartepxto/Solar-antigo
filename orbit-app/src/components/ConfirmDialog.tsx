import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { t } from "@/lib/i18n";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/cn";

export type ConfirmTone = "danger" | "neutral";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  /** "danger" for irreversible actions (filled red button, red frame);
   * "neutral" for reversible ones like archiving. */
  tone?: ConfirmTone;
  icon?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  pending?: boolean;
  /** Stable fallback when a context-menu trigger disappears before opening. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** In-app replacement for window.confirm, following the FullAccessWarning
 * pattern: backdrop, focus trap, Escape cancels, Cancel focused by default so
 * a stray Enter never confirms. Portalled to <body> because the sidebar
 * translates below md and would otherwise become the containing block. */
export function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, onCancel, returnFocusRef } = props;
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const cancelAction = useRef(onCancel);
  cancelAction.current = onCancel;
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelAction.current();
        return;
      }
      if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (!controls?.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
        const first = controls[0]!;
        const last = controls[controls.length - 1]!;
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
    return () => {
      window.removeEventListener("keydown", onKey);
      const target = opener?.isConnected && opener !== document.body ? opener : returnFocusRef?.current;
      target?.focus();
    };
  }, [open, returnFocusRef]);

  // Capture the opener above before moving focus on open or pending changes.
  useEffect(() => {
    if (!open) return;
    if (props.pending) dialogRef.current?.focus();
    else cancelRef.current?.focus();
  }, [open, props.pending]);

  if (!open) return null;

  // in the column when there is one, over whatever it holds; the bare map
  // keeps the overlay
  return (
    <ColumnLayer onClose={onCancel} locked={Boolean(props.pending)} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6">
      <ConfirmDialogCard ref={dialogRef} cancelRef={cancelRef} {...props} />
    </ColumnLayer>
  );
}

/** The card alone, without the portal or key handling — exported so it can be
 * rendered to static markup in tests. */
export function ConfirmDialogCard({
  ref,
  cancelRef,
  title,
  body,
  confirmLabel,
  tone = "danger",
  icon,
  onCancel,
  onConfirm,
  pending = false,
}: ConfirmDialogProps & {
  ref?: React.Ref<HTMLDivElement>;
  cancelRef?: React.Ref<HTMLButtonElement>;
}) {
  const danger = tone === "danger";
  return (
    <div
      ref={ref}
      role="alertdialog"
      tabIndex={-1}
      aria-modal="true"
      aria-busy={pending}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-body"
      className={cn(
        "w-full max-w-[420px] rounded-[14px] border bg-panel p-5 shadow-[0_20px_50px_rgba(0,0,0,.55)]",
        danger ? "border-[#ff5667]/40" : "border-ink/[0.1]",
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 shrink-0", danger ? "text-[#ff8a96]" : "text-warning")}>
          {icon ?? <AlertTriangle size={18} />}
        </span>
        <div className="min-w-0">
          <h2 id="confirm-dialog-title" className="text-[15px] font-semibold text-ink">
            {title}
          </h2>
          <p id="confirm-dialog-body" className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
            {body}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-xl px-4 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"
        >
          {t("confirmDialog.ui.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={cn(
            "rounded-xl px-4 py-2 text-[13px] font-medium",
            danger ? "bg-[#ff5667] text-white hover:brightness-110" : "bg-ink text-app hover:brightness-110",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
