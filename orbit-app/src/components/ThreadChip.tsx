// The receipt a bot leaves when it opens a thread — "Opened thread #QA PR
// 245 on Scout" — as the same clickable pill a bot⇄bot comm chip uses.
// Clicking shows that thread; it never redirects work (openThread). Like a
// comm chip it stays visible with Tool calls hidden: it is the only trace,
// where the person is reading, that a new thread now exists.
import { ChevronRight, MessagesSquare } from "lucide-react";
import { openThread, useStore, type Message } from "@/state/store";
import { t } from "@/lib/i18n";
import { BotFace } from "@/orbit/OrbitFace";

export function ThreadChip({ message }: { message: Message }) {
  const { state, dispatch } = useStore();
  const ref = message.threadRef;
  const tool = message.tool;
  if (!ref || !tool) return null;
  const bot = state.bots.find((candidate) => candidate.id === ref.botId);
  return (
    <div className="flex justify-start">
      <button
        type="button"
        data-thread-chip={ref.threadId}
        onClick={() => openThread(dispatch, ref, state)}
        title={t("chat.openThread", { title: ref.title })}
        className="flex items-center gap-2 rounded-full border border-ink/[0.1] bg-panel px-3 py-1.5 text-[13px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"
      >
        {bot ? <BotFace bot={bot} size={16} /> : <MessagesSquare size={13} aria-hidden="true" />}
        <span className="max-w-[480px] truncate">{tool.name}</span>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}
