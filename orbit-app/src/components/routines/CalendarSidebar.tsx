import { useMemo, useState, type DragEvent } from "react";
import { GripVertical, Search } from "lucide-react";
import { t } from "@/lib/i18n";
import { OrbitFace } from "@/orbit/OrbitFace";
import type { Bot } from "@/state/store";
import { MiniMonth } from "./MiniMonth";

export const BOT_CALENDAR_DRAG_TYPE = "application/x-orbit-bot";

export interface CalendarSidebarProps {
  bots: Bot[];
  anchor: number;
  onSelectDate: (at: number) => void;
}

export function CalendarSidebar({ bots, anchor, onSelectDate }: CalendarSidebarProps) {
  const [query, setQuery] = useState("");
  const filteredBots = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return bots;
    return bots.filter((bot) =>
      `${bot.name} ${bot.title} ${bot.description}`.toLocaleLowerCase().includes(normalized),
    );
  }, [bots, query]);

  const beginBotDrag = (event: DragEvent<HTMLDivElement>, bot: Bot) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(BOT_CALENDAR_DRAG_TYPE, bot.id);
    event.dataTransfer.setData("text/plain", bot.id);
  };

  return (
    <aside
      aria-label={t("calendarSidebar.ui.scheduleSidebar")}
      className="flex h-full w-[236px] shrink-0 flex-col overflow-hidden border-r border-ink/[0.07]"
    >
      <MiniMonth anchor={anchor} onSelect={onSelectDate} />

      <div className="mx-4 border-t border-ink/[0.07]" />

      <section aria-labelledby="calendar-bots-heading" className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <div id="calendar-bots-heading" className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50">
            {t("calendar.bots")}
          </div>
          <span className="font-mono text-[10px] tabular-nums text-ink/40">{bots.length}</span>
        </div>

        <label className="relative mb-2 block">
          <span className="sr-only">{t("calendar.searchBots")}</span>
          <Search
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder={t("calendar.searchBots")}
            className="h-8 w-full rounded-[15px] border border-transparent bg-ink/[0.05] pl-8 pr-3 text-[12px] text-ink outline-none placeholder:text-ink/40 focus:border-ink/20"
          />
        </label>

        <div role="list" aria-label={t("calendarSidebar.ui.botsAvailableToSchedule")} className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-0.5">
          {filteredBots.map((bot) => (
            <div
              key={bot.id}
              draggable
              onDragStart={(event) => beginBotDrag(event, bot)}
              role="listitem"
              className="group flex cursor-grab items-center gap-2 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-ink/[0.05] active:cursor-grabbing"
              aria-label={t("calendar.dragBot", { name: bot.name })}
              title={t("calendar.dragBot", { name: bot.name })}
            >
              <GripVertical
                size={13}
                className="shrink-0 text-ink/25 transition-colors group-hover:text-ink/60"
                aria-hidden="true"
              />
              <OrbitFace id={bot.id} size={24} label={bot.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium text-ink/90">{bot.name}</div>
                {bot.title && <div className="truncate text-[11px] text-ink/45">{bot.title}</div>}
              </div>
            </div>
          ))}

          {filteredBots.length === 0 && (
            <div className="px-3 py-8 text-center text-[12px] leading-relaxed text-ink/50">
              {bots.length === 0 ? t("calendar.noBots") : t("calendar.noBotsMatch")}
            </div>
          )}
        </div>

        <p className="mt-2 px-2 text-[11px] leading-[1.45] text-ink/40">
          {t("calendar.dragHint")}
        </p>
      </section>
    </aside>
  );
}
