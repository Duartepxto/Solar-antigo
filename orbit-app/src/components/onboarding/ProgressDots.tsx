// Step dots for the welcome flow (design: WF footer): a row of 6px dots, the
// current one widened to an 18px accent pill. With `onSelect` the dots
// become tabs (jump to a step); without it they are decoration and hidden
// from assistive tech.
import { cn } from "@/lib/cn";

const ACTIVE = 18;
const DOT = 6;
const GAP = 5;

export function ProgressDots({
  items,
  index,
  onSelect,
  label,
}: {
  items: Array<{ id: string; label?: string }>;
  index: number;
  onSelect?: (index: number) => void;
  label?: string;
}) {
  const interactive = Boolean(onSelect);
  return (
    <div
      className="flex items-center"
      style={{ gap: GAP }}
      role={interactive ? "tablist" : undefined}
      aria-label={interactive ? label : undefined}
      aria-hidden={interactive ? undefined : true}
    >
      {items.map((item, i) => {
        const dot = (
          <span
            className={cn("block h-1.5 rounded-[3px] transition-[width] duration-[250ms]", i === index ? "bg-[#3ee09a]" : "bg-ink/25")}
            style={{ width: i === index ? ACTIVE : DOT }}
          />
        );
        return interactive ? (
          <button key={item.id} type="button" role="tab" aria-selected={i === index} aria-label={item.label ?? item.id}
            onClick={() => onSelect?.(i)} className="flex h-3.5 items-center rounded-full">
            {dot}
          </button>
        ) : (
          <span key={item.id}>{dot}</span>
        );
      })}
    </div>
  );
}
