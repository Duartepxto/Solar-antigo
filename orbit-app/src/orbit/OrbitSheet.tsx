// An Orbit screen that is not a bot's panel: the team library, plugins. On
// the canvas (OrbitShell provides a stage slot while one is open) it takes
// the stage beside the column under a floating header, and the way back is
// the canvas's own (the back link, Esc, a click outside). With no slot — a
// preview, a test — it is the design's sheet: a 760×560 card with a 54px
// header over the map.
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

function stageSlot(): HTMLElement | null {
  return (typeof document === "undefined" || typeof document.querySelector !== "function") ? null : document.querySelector<HTMLElement>("[data-orbit-stage-slot]");
}

export function OrbitSheet({
  title,
  context,
  onClose,
  closeDisabled = false,
  closeLabel,
  leading,
  actions,
  children,
  dialogRef,
  labelId,
  tour,
  wide = false,
  bodyClassName,
}: {
  title: ReactNode;
  context?: ReactNode;
  onClose: () => void;
  /** a running import or save keeps the sheet open */
  closeDisabled?: boolean;
  closeLabel?: string;
  /** before the title, e.g. a back arrow inside a multi-step screen */
  leading?: ReactNode;
  /** header buttons left of close (refresh, an external link) */
  actions?: ReactNode;
  children: ReactNode;
  dialogRef?: RefObject<HTMLDivElement | null>;
  labelId?: string;
  tour?: string;
  /** the calendar needs more room than 760px */
  wide?: boolean;
  bodyClassName?: string;
}) {
  const ownRef = useRef<HTMLDivElement>(null);
  const ref = dialogRef ?? ownRef;
  // the slot renders in the same commit as the screen that opens this: look
  // again once it is in the document
  const [slot, setSlot] = useState<HTMLElement | null>(stageSlot);
  useLayoutEffect(() => { if (!slot) setSlot(stageSlot()); }, [slot]);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, [ref, slot]);

  if (slot) return createPortal(
    <div ref={ref} role="region" aria-labelledby={labelId} tabIndex={-1} data-tour={tour} style={{ outline: "none" }}
      className="flex min-h-0 flex-1 flex-col animate-workspace-in">
      <header className="flex min-h-[52px] shrink-0 items-center gap-3 pb-3 pl-[74px]">
        {leading}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span id={labelId} className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink/80">{title}</span>
          {context && <span className="truncate text-[12.5px] text-ink/50">{context}</span>}
        </div>
        {actions}
      </header>
      <div className={cn("flex min-h-0 flex-1 flex-col", bodyClassName)}>{children}</div>
    </div>,
    slot,
  );

  const sheet = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-7 max-sm:p-3"
      onMouseDown={(event) => event.target === event.currentTarget && !closeDisabled && onClose()}
      data-orbit-sheet
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        data-tour={tour}
        // focused so Escape and Tab start inside; the frame itself shows no ring
        style={{ outline: "none", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}
        className={cn(
          "animate-pop-in flex h-[min(560px,100%)] w-[min(760px,100%)] flex-col overflow-hidden rounded-[14px] border border-ink/[0.14] bg-panel shadow-[0_30px_80px_rgba(0,0,0,.6)] outline-none",
          wide && "h-[min(720px,100%)] w-[min(1080px,100%)]",
        )}
      >
        <header className="flex h-[54px] shrink-0 items-center gap-2.5 border-b border-ink/[0.08] pl-[18px] pr-2.5">
          {leading}
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span id={labelId} className="truncate text-[15px] font-semibold text-ink">{title}</span>
            {context && <span className="truncate text-[11.5px] text-ink/50">{context}</span>}
          </div>
          {actions}
          <button type="button" onClick={onClose} disabled={closeDisabled} aria-label={closeLabel ?? t("common.close")} title={closeLabel ?? t("common.close")}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink/80 hover:bg-ink/[0.08] disabled:opacity-40">
            <X size={15} />
          </button>
        </header>
        <div className={cn("flex min-h-0 flex-1 flex-col", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
  // rendered without a DOM (static markup), the sheet stays in place
  return typeof document === "undefined" ? sheet : createPortal(sheet, document.body);
}
