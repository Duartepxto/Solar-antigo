// The detail panel's building blocks, matching the design's panel template
// (the Orbit design, `panelDetail`): kicker + title, a segmented
// option grid, key/value rows, switch lists, chip rows, a live-screen tile,
// fields and pill actions. Panels compose these over real store data.

import type { ReactNode } from "react";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

// Solar keeps this composition and only trades the blue highlight for gold.
const SOLAR = import.meta.env.VITE_JARVIS_SOLAR === "true";
const GOLD_ON = "border-[#ddbd89]/60 bg-[#ddbd89]/[0.1] text-[#f4dcb5] shadow-[0_0_18px_-8px_#ddbd89]";

export const MONO_LABEL = "font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50";

export function DetailBody({ children, tour }: { children: ReactNode; tour?: string }) {
  return (
    <div data-detail data-tour={tour} className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto pb-[calc(8px+var(--orbit-offer-pad,0px))] pr-1.5 pt-[18px] animate-rise">
      {children}
    </div>
  );
}

export function BackToChat({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick}
      className="flex h-[26px] items-center gap-1.5 self-start rounded-[13px] pl-1 pr-2.5 text-[12.5px] font-medium text-ink/60 hover:bg-ink/[0.06]">
      <ChevronLeft size={14} /> {label ?? t("orbit.panel.backToChat")}
    </button>
  );
}

export function DetailHeader({ icon: Icon, color, kicker, title, desc }: { icon: LucideIcon; color?: string; kicker: string; title: ReactNode; desc?: ReactNode }) {
  if (import.meta.env.VITE_JARVIS_SOLAR === 'true') return <>
    <div className="solar-detail-heading"><span className="solar-detail-icon"><Icon size={20} strokeWidth={1.5} aria-hidden="true"/></span><div><h2>{kicker}</h2><span>{title}</span></div></div>
    {desc && <p className="solar-detail-description">{desc}</p>}
  </>;
  return (
    <>
      <div className="flex items-center gap-2.5">
        <Icon size={20} style={{ color }} className="shrink-0" aria-hidden />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className={MONO_LABEL}>{kicker}</span>
          <span className="truncate text-[19px] font-semibold">{title}</span>
        </div>
      </div>
      {desc && <p className="m-0 text-[13.5px] leading-[1.6] text-ink/70 [text-wrap:pretty]">{desc}</p>}
    </>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-[10px] border border-[rgba(255,152,0,.4)] bg-[rgba(255,152,0,.08)] px-3 py-2.5 text-[12.5px] leading-[1.5] text-[#ffb454]">
      {children}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <div className="h-3 w-[72%] rounded-md bg-ink/[0.08]" />
      <div className="h-3 w-[54%] rounded-md bg-ink/[0.08]" />
      <div className="h-3 w-[63%] rounded-md bg-ink/[0.08]" />
      <span className="text-[12px] text-ink/50">{t("orbit.panel.loading")}</span>
    </div>
  );
}

export interface SegOption { key: string; label: string; icon: LucideIcon; title?: string; disabled?: boolean }

export function Seg({ label, cols, options, value, onSelect, note, noteTone, tour }: {
  label: string; cols?: number; options: SegOption[]; value: string | null; onSelect: (key: string) => void;
  note?: ReactNode; noteTone?: "warning" | "muted"; tour?: string;
}) {
  return (
    <div data-tour={tour} className="mt-2 flex flex-col gap-2">
      <span className={MONO_LABEL}>{label}</span>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols ?? Math.min(3, options.length)},minmax(0,1fr))` }}>
        {options.map((o) => {
          const on = o.key === value;
          const Icon = o.icon;
          return (
            <button key={o.key} type="button" title={o.title ?? o.label} disabled={o.disabled} aria-pressed={on}
              onClick={() => onSelect(o.key)}
              className={cn("flex flex-col items-center gap-1.5 rounded-xl border px-1 pb-2 pt-2.5 text-[11.5px] font-medium leading-[1.2] disabled:cursor-not-allowed disabled:opacity-40",
                on ? (SOLAR ? GOLD_ON : "border-ink/[0.22] bg-ink/[0.08] text-ink") : "border-ink/[0.07] text-ink/60 hover:bg-ink/[0.04]")}>
              <Icon size={16} aria-hidden />
              {o.label}
            </button>
          );
        })}
      </div>
      {note && <span className={cn("text-[12.5px] leading-[1.5] [text-wrap:pretty]", noteTone === "warning" ? "text-[#ffb454]" : noteTone === "muted" ? "text-ink/60" : "text-ink/80")}>{note}</span>}
    </div>
  );
}

export function Gauge({ pct, label, color, labelColor }: { pct: number; label: ReactNode; color: string; labelColor?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 overflow-hidden rounded-[3px] bg-ink/[0.08]">
        <div className="h-full transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
      </div>
      <span className="text-[12px]" style={{ color: labelColor }}>{label}</span>
    </div>
  );
}

export function Rows({ rows }: { rows: Array<{ k: ReactNode; v: ReactNode }> }) {
  if (!rows.length) return null;
  return (
    <div className="mt-1 flex flex-col">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between gap-3 border-b border-ink/[0.07] py-[9px] text-[13px]">
          <span className="text-ink/[0.55]">{r.k}</span>
          <span className="min-w-0 text-right text-ink/90">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

export function ChipRow({ label, chips }: { label: string; chips: Array<{ label: ReactNode; active?: boolean; onClick?: () => void; disabled?: boolean; title?: string }> }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={MONO_LABEL}>{label}</span>
      <div className="flex flex-wrap gap-1">
        {chips.map((c, i) => (
          <button key={i} type="button" onClick={c.onClick} disabled={c.disabled} title={c.title} aria-pressed={c.active}
            className={cn("h-[26px] rounded-[13px] border px-2.5 text-[12px] font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50",
              c.active ? (SOLAR ? GOLD_ON : "border-ink/40 bg-ink/10") : "border-ink/[0.12] hover:bg-ink/[0.05]")}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const DOT_ON = "#38d591";
export const DOT_OFF = "color-mix(in srgb, var(--color-ink) 20%, transparent)";
export const DOT_ACCENT = SOLAR ? "#eac185" : "#1084fe";
export const DOT_WARN = "#ff9800";

export interface ListItem {
  key: string;
  name: ReactNode;
  meta?: ReactNode;
  dot?: string;
  /** a switch at the end of the row */
  on?: boolean;
  disabled?: boolean;
  title?: string;
  /** the control's accessible name when the visible row does not say it */
  label?: string;
  onClick?: () => void;
}

export function List({ title, items, empty }: { title: string; items: ListItem[]; empty?: ReactNode }) {
  return (
    // sections breathe (22px above), rows line up with the kicker at the
    // column edge while their hover fill still bleeds a little past it
    <div className="mt-2 flex flex-col gap-0.5">
      <span className={cn(MONO_LABEL, "pb-1.5")}>{title}</span>
      {items.length === 0 && empty && <span className="py-1 text-[13px] text-ink/60">{empty}</span>}
      {items.map((it) => {
        const inner = <>
          <span className="size-[7px] shrink-0 rounded-full" style={{ background: it.dot ?? (it.on === undefined ? DOT_OFF : it.on ? DOT_ON : DOT_OFF) }} />
          <span className="min-w-0 flex-1 text-[13.5px] text-ink/90">{it.name}</span>
          {it.meta && <span className="max-w-[55%] truncate text-[12px] text-ink/50">{it.meta}</span>}
          {it.on !== undefined && (
            <span data-slot="switch-track" aria-hidden className={cn("relative h-[18px] w-[30px] shrink-0 rounded-[9px] transition-colors", it.on ? (SOLAR ? "bg-[#ddbd89]" : "bg-[#1084fe]") : "bg-ink/[0.14]")}>
              <span data-slot="switch-thumb" className="absolute top-[2px] size-[14px] rounded-full bg-white transition-[left]" style={{ left: it.on ? 14 : 2 }} />
            </span>
          )}
        </>;
        // a row with nothing to do is information, not a greyed-out control
        if (!it.onClick && it.on === undefined) {
          return <div key={it.key} title={it.title} className="-mx-1.5 flex items-center gap-2.5 rounded-lg px-1.5 py-2">{inner}</div>;
        }
        return (
          <button key={it.key} type="button" onClick={it.onClick} disabled={it.disabled || !it.onClick} title={it.title} aria-label={it.label}
            role={it.on !== undefined ? "switch" : undefined} aria-checked={it.on}
            className="-mx-1.5 flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-left enabled:hover:bg-ink/[0.05] disabled:cursor-default disabled:opacity-60">
            {inner}
          </button>
        );
      })}
    </div>
  );
}

export function Actions({ actions }: { actions: Array<{ label: ReactNode; onClick: () => void; disabled?: boolean; title?: string } | null | false | undefined> }) {
  const shown = actions.filter(Boolean);
  if (!shown.length) return null;
  // a panel's buttons are one group: 8px apart, set off from the content above
  return (
    <div className="mt-2 flex flex-col gap-2">
      {shown.map((a, i) => a && (
        <button key={i} type="button" onClick={a.onClick} disabled={a.disabled} title={a.title}
          className="h-[34px] shrink-0 rounded-[17px] border border-ink/[0.14] text-[13px] font-medium text-ink hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-40">
          {a.label}
        </button>
      ))}
    </div>
  );
}

export function ScreenTile({ label, live, liveText, onOpen, children }: { label: ReactNode; live: boolean; liveText: ReactNode; onOpen?: () => void; children?: ReactNode }) {
  return (
    <div onClick={onOpen} role={onOpen ? "button" : undefined}
      className={cn("relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[10px] border border-ink/10 font-mono text-[11px] text-ink/[0.45]", onOpen && "cursor-pointer")}
      style={{ background: "repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-ink) 2.5%, transparent) 0 8px, color-mix(in srgb, var(--color-ink) 4.5%, transparent) 8px 16px)" }}>
      {children ?? label}
      <span className="absolute left-2.5 top-2.5 flex h-[22px] items-center gap-1.5 rounded-[11px] bg-black/55 px-2 font-sans text-[11px] text-ink/80">
        <span className="size-1.5 rounded-full" style={{ background: live ? DOT_ON : DOT_OFF }} />
        {liveText}
      </span>
    </div>
  );
}

export function Field({ label, value, placeholder, onChange, onBlur, disabled }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void; onBlur?: () => void; disabled?: boolean }) {
  return (
    <label className="flex flex-col gap-[5px] text-[11.5px] text-ink/60">
      {label}
      <input value={value} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        className="h-[34px] rounded-lg border border-ink/[0.12] bg-ink/[0.05] px-2.5 text-[13.5px] text-ink outline-none focus:border-ink/30" />
    </label>
  );
}

export function Tabs({ tabs, value, onSelect }: { tabs: Array<{ key: string; label: ReactNode }>; value: string; onSelect: (key: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1">
      {tabs.map((tb) => (
        <button key={tb.key} type="button" role="tab" aria-selected={tb.key === value} onClick={() => onSelect(tb.key)}
          className={cn("h-[26px] rounded-[13px] px-2.5 text-[12px] font-medium", tb.key === value ? "bg-ink/[0.12] text-ink" : "text-ink/60 hover:bg-ink/[0.07]")}>
          {tb.label}
        </button>
      ))}
    </div>
  );
}

export const SMALL_BUTTON = "h-7 whitespace-nowrap rounded-[14px] border border-ink/[0.16] px-3 text-[12px] font-medium text-ink hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-40";
export const SMALL_PRIMARY = "h-7 whitespace-nowrap rounded-[14px] bg-ink px-3.5 text-[12px] font-semibold text-app disabled:opacity-40";
