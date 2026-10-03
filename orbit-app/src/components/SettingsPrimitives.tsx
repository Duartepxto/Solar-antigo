import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

export function Switch({
  checked,
  className,
  ...props
}: Omit<ComponentProps<"button">, "children" | "role" | "aria-checked"> & { checked: boolean }) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
        checked ? "bg-ink" : "bg-ink/[0.05]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-[left] motion-reduce:transition-none",
          checked ? "left-[21px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  // An Orbit panel section, not a box: the column is the surface; a mono
  // label and a quiet line of context head what follows.
  return (
    <section className="flex flex-col py-1">
      {title && <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50">{title}</div>}
      {subtitle && <div className={title ? "mt-1.5 text-[12.5px] leading-[1.5] text-ink/60" : "text-[12.5px] leading-[1.5] text-ink/60"}>{subtitle}</div>}
      {children && <div className={title || subtitle ? "mt-3" : undefined}>{children}</div>}
    </section>
  );
}

/** Simple preferences share an aligned row; forms with several fields keep a Card. */
export function SettingRow({
  title,
  subtitle,
  children,
  message,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  message?: React.ReactNode;
}) {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} className="setting-row border-t border-ink/[0.07] py-3.5 first:border-t-0">
      <div className="grid min-w-0 grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
        <div className="min-w-0">
          <div id={titleId} className="text-[13.5px] font-medium text-ink/90">{title}</div>
          {subtitle && <div className="mt-1 text-[12px] leading-[1.5] text-ink/50">{subtitle}</div>}
        </div>
        <div className="min-w-0 sm:max-w-[240px]">{children}</div>
      </div>
      {message && <div className="mt-2 text-[12px]">{message}</div>}
    </div>
  );
}

/** A command the user is meant to run, with one-click copy. */
export function CommandLine({ command, copyLabel = "Copy command" }: { command: string; copyLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard permission can be denied; leave the button unchanged */
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-ink/[0.04] px-3 py-2">
      <code className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap font-mono text-[12px] text-ink">
        {command}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copyLabel}
        className="ui-icon-button shrink-0"
      >
        {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
      </button>
    </div>
  );
}
