// App settings → Usage: what every bot has spent, so "which of my bots is
// costing me money" is answerable without a provider dashboard. Figures are
// banked per settled turn on each task (server/store.ts addTaskUsage) and
// summed here; nothing is fetched.
import { useStore } from "@/state/store";
import { BotFace } from "@/orbit/OrbitFace";
import { Card } from "./SettingsPrimitives";
import { t } from "@/lib/i18n";
import { botUsage, cachedUsageNote, formatTokens, hasFiniteCost, headlineTokens, sumUsage, tokensColumnLabel, usageDetail, usageCostLabel, usageCostNote } from "@/lib/usage";
import { useUsageCurrency } from '@/lib/usage-currency';
import { UsageHistory } from "./UsageHistory";

export function UsageSection() {
  useUsageCurrency();
  const { state } = useStore();
  const rows = state.bots
    .filter((b) => !b.hidden)
    .map((bot) => {
      const usage = botUsage(bot);
      const instance = state.instances.find((i) => i.instanceId === bot.modelSelection.instanceId);
      return { bot, usage, billing: instance?.snapshot.billing };
    })
    .filter((r) => r.usage.turns > 0)
    // money first, then volume. Non-finite/missing costs sort last.
    .sort((a, b) => {
      const costOf = (value: number | null | undefined) =>
        hasFiniteCost(value) ? value : Number.NEGATIVE_INFINITY;
      return costOf(b.usage.costUsd) - costOf(a.usage.costUsd) || headlineTokens(b.usage) - headlineTokens(a.usage);
    });
  const total = sumUsage(rows.map((r) => r.usage));
  const cachedNote = cachedUsageNote(total);

  return (
    <>
    <UsageHistory />
    <Card title={t("usage.title")} subtitle={t("usage.subtitle")}>
      {rows.length === 0 ? (
        <div className="text-[13px] text-ink/55">{t("usage.empty")}</div>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-5 border-b border-ink/[0.1] pb-2 text-[11.5px] font-medium uppercase tracking-wide text-ink/55">
            <span>{t("usage.colBot")}</span>
            <span className="text-right">{t("usage.colTurns")}</span>
            <span className="text-right">{tokensColumnLabel(total)}</span>
            <span className="text-right">{t("usage.colCost")}</span>
          </div>
          {rows.map(({ bot, usage }) => (
            <div key={bot.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-5 border-b border-ink/[0.1] py-2 text-[13px]">
              <span className="flex min-w-0 items-center gap-2 text-ink">
                <BotFace bot={bot} size={22} />
                <span className="truncate">{bot.name}</span>
              </span>
              <span className="text-right tabular-nums text-ink/55">{usage.turns}</span>
              <span className="text-right tabular-nums text-ink" title={usageDetail(usage)}>
                {formatTokens(headlineTokens(usage))}
              </span>
              <span className="text-right tabular-nums text-ink" title={usageCostNote(usage)}>{usageCostLabel(usage)}</span>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-5 pt-2.5 text-[13px] font-medium text-ink">
            <span>{t("usage.allBots")}</span>
            <span className="text-right tabular-nums">{total.turns}</span>
            <span className="text-right tabular-nums" title={usageDetail(total)}>{formatTokens(headlineTokens(total))}</span>
            <span className="text-right tabular-nums" title={usageCostNote(total)}>{usageCostLabel(total)}</span>
          </div>
          {cachedNote && (
            <div className="mt-3 text-[12px] leading-relaxed text-ink/55">{cachedNote}</div>
          )}
          {hasFiniteCost(total.costUsd) && (
            <div className="mt-3 text-[12px] leading-relaxed text-ink/55">
              {usageCostNote(total)}
            </div>
          )}
        </div>
      )}
    </Card>
    </>
  );
}
