// Small pieces every beat of the welcome flow shares, so the beats read as
// one surface: the same input, the same primary button.
import { createContext, useContext, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import type { MausMotion, MausState } from "@/lib/mascot";

/** What a beat can do to the flow around it. Every beat can move on or be
 * skipped; the guide mascot is shared, so a beat borrows it rather than
 * owning one. */
export interface BeatProps {
  onNext: () => void;
  /** Same destination as onNext; separate so analytics can tell them apart. */
  onSkip: () => void;
  setMascot: (state: MausState) => void;
  /** Fire a one-shot motion on the guide (`success`, `celebrate`, …). */
  bump: (motion: Exclude<MausMotion, "none">) => void;
}

export const inputClass =
  "h-10 w-full rounded-[10px] border border-ink/[0.16] bg-ink/[0.04] px-3 text-[14px] text-ink placeholder:text-ink/55 focus:border-ink/30 focus:outline-none";

/** Index for the `.stagger` utility; each sibling arrives 40ms after the last. */
export function staggerIndex(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}

/** The welcome window's footer. A beat's primary button sits there, at the
 * right (design: the flow's footer), whichever beat is showing; outside the
 * window (a test, a preview) it stays where the beat put it. */
export const WelcomeFooterContext = createContext<HTMLElement | null>(null);

export function PrimaryButton({
  children,
  className,
  style,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const footer = useContext(WelcomeFooterContext);
  const button = (
    <button
      data-primary=""
      {...rest}
      style={footer ? undefined : style}
      className={cn(
        "h-[34px] shrink-0 rounded-full bg-ink px-4 text-[13px] font-semibold text-app transition-[transform,opacity] duration-150 active:scale-[0.98] disabled:opacity-40",
        footer ? "whitespace-nowrap" : cn("w-full", className),
      )}
    >
      {children}
    </button>
  );
  return footer ? createPortal(button, footer) : button;
}

export function QuietButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn("h-7 rounded-[14px] px-2.5 text-[12.5px] font-medium text-ink/55 transition-colors hover:text-ink", className)}
    >
      {children}
    </button>
  );
}

