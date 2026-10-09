import type { GroupThreadUsage } from "../../shared/wire";
import { formatTokens, hasFiniteCost, usageCostLabel } from "@/lib/usage";
import { useUsageCurrency } from '@/lib/usage-currency';
import { t } from "@/lib/i18n";

function breakdown(usage: { input: number; output: number; cachedInput?: number }) {
  const output = t("room.usage.output", { tokens: formatTokens(usage.output) });
  if (!hasFiniteCost(usage.cachedInput)) return `${t("room.usage.inputUnknown", { tokens: formatTokens(usage.input) })} · ${output}`;
  const cached = Math.min(usage.input, Math.max(0, usage.cachedInput));
  return `${t("room.usage.uncached", { tokens: formatTokens(usage.input - cached) })} · ${t("room.usage.cached", { tokens: formatTokens(cached) })} · ${output}`;
}

export function GroupUsageChip({ usage }: { usage?: GroupThreadUsage | null }) {
  useUsageCurrency();
  if (!usage?.turns) return null;
  const title = [
    t("room.usage.total", { details: breakdown(usage) }),
    usage.lastTurn ? t("room.usage.last", { name: usage.lastSpeaker?.name ?? "", details: breakdown(usage.lastTurn) }) : null,
    hasFiniteCost(usage.costUsd) ? t("room.usage.cost", { cost: usageCostLabel(usage) }) : t('usage.costUnknown'),
  ].filter(Boolean).join("\n");
  const short = hasFiniteCost(usage.costUsd) ? usageCostLabel(usage)
    : hasFiniteCost(usage.cachedInput) ? t("room.usage.uncached", { tokens: formatTokens(Math.max(0, usage.input - usage.cachedInput)) })
      : t("room.usage.input", { tokens: formatTokens(usage.input) });
  return <span tabIndex={0} title={title} aria-label={title} data-testid="group-usage-chip"
    className="shrink-0 rounded-full bg-ink/[0.06] px-2.5 py-1 text-[12px] tabular-nums text-ink/55">{short}</span>;
}
