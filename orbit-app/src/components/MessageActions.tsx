import { useState, type ReactNode } from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

/** Class shared by every control that lives inside the tray: the tray decides
 * when the row is visible, so the buttons themselves never fade. */
export const messageActionClass =
  "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] text-ink/70 hover:bg-ink/[0.08] hover:text-ink disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink/55";

/** One "…" handle beside a bubble. Hovering or focusing it slides the row of
 * message controls out sideways — away from the bubble — so an idle message
 * shows a single quiet dot cluster instead of a heap of icons.
 *
 * Click toggles the tray open for touch and keyboard, and `forceOpen` keeps
 * it out while a control needs to stay reachable (a message being read
 * aloud, raw markdown showing). Children render in reading order; the tray
 * mirrors them on the user side so the first control stays nearest the
 * bubble on both sides. */
export function MessageActions({
  side,
  forceOpen = false,
  className,
  children,
}: {
  side: "user" | "bot";
  forceOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const open = pinnedOpen || forceOpen;
  const mirrored = side === "user";
  return (
    <div
      className={cn("group/actions relative flex items-center self-end pb-0.5", mirrored && "flex-row-reverse", className)}
      data-testid="message-actions"
      data-message-side={side}
      data-open={open ? "true" : undefined}
    >
      <button
        type="button"
        onClick={() => setPinnedOpen((v) => !v)}
        aria-label={t("chat.messageActions")}
        title={t("chat.messageActions")}
        aria-expanded={open}
        className={cn(
          "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] text-ink/70 transition-opacity duration-150 hover:bg-ink/[0.08] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 group-hover:delay-0 group-focus-within:opacity-100 touch:opacity-70",
          // the handle lingers 400ms after the pointer leaves the message
          open ? "bg-ink/[0.08] text-ink opacity-100 touch:opacity-100" : "opacity-0 delay-[400ms]",
        )}
      >
        <Ellipsis size={14} aria-hidden="true" />
      </button>
      {/* The buttons open above the handle, over the bubble's edge, not in
          the bubble's row: a long message leaves the row too narrow for
          them (they were clipped). They reach toward the bubble. */}
      <div
        className={cn(
          "absolute bottom-full z-20 w-max pb-1 transition-opacity duration-150",
          mirrored ? "left-0" : "right-0",
          open ? "visible opacity-100" : "invisible opacity-0 group-hover/actions:visible group-hover/actions:opacity-100 group-focus-within/actions:visible group-focus-within/actions:opacity-100",
        )}
      >
        <div className={cn(
          "flex items-center gap-0.5 rounded-[9px] border border-ink/[0.1] bg-panel p-0.5 shadow-[0_8px_24px_rgba(0,0,0,.45)]",
          !mirrored && "flex-row-reverse",
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}
