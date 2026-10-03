// What the open thread has spent, with its share of the model's context
// window (warning and danger tones, and a new-thread nudge past 80%). Quiet
// until the first turn settles; click opens the bot's Usage panel.
import { useStore, type Bot } from "@/state/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { contextChip, contextDetail, contextShare, costCaption, formatUsd, hasFiniteCost, lastTurnDetail, usageChip, usageDetail } from "@/lib/usage";

export function ThreadUsageChip({ bot }: { bot: Bot }) {
  const { state, dispatch } = useStore();
  const usage = bot.tasks?.find((t) => t.threadId === bot.threadId)?.usage;
  const text = usage ? usageChip(usage) : "";
  if (!usage || !text) return null;
  const billing = state.instances.find((i) => i.instanceId === bot.modelSelection.instanceId)?.snapshot.billing;
  const share = contextShare(usage);
  const detail = [
    usage.turns === 1 ? t("chat.usage.turnsOne") : t("chat.usage.turnsMany", { count: usage.turns }),
    usageDetail(usage),
    lastTurnDetail(usage),
    contextDetail(usage),
    // the whole thread rides along on every turn, so most of "in" is the
    // model re-reading what it already saw — say so, or the figure reads as
    // a bug (issue #527); past 80% of the window the fix is a new thread
    share?.tone === "danger" ? t("chat.usage.contextNudge") : null,
    hasFiniteCost(usage.costUsd) ? `${formatUsd(usage.costUsd)} ${costCaption(billing)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  // Keep the unit visible in the compact header too.
  const short = text;
  const ctx = contextChip(usage);
  return (
    <button
      onClick={() => dispatch({ type: "toggleSettings", open: true, section: "usage" })}
      className="flex h-6 items-center whitespace-nowrap rounded-full border border-ink/[0.1] px-2.5 text-[12px] tabular-nums text-ink/55 hover:bg-ink/[0.06] hover:text-ink @max-4xl/chathead:px-2"
      title={detail}
      data-testid="usage-chip"
    >
      <span className="@max-4xl/chathead:hidden">{text}</span>
      <span className="hidden @max-4xl/chathead:inline">{short}</span>
      {ctx && <span className={cn("ml-1.5 @max-4xl/chathead:hidden", share?.tone === "danger" ? "text-[#ff8a96]" : share?.tone === "warning" ? "text-warning" : "")} data-testid="usage-context">{ctx}</span>}
    </button>
  );
}
