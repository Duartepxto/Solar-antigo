// New channel: pick members and an optional team context, then create.
import { useState } from "react";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { useStore } from "@/state/store";
import { t } from "@/lib/i18n";
import { BotPickerList } from "./BotPickerList";

/** Pick members and an optional Work/Personal/project context, then create. */
export function NewChannelDialog({ onClose, initialSection = "", initialMembers = [] }: { onClose: () => void; initialSection?: string; initialMembers?: string[] }) {
  const { state, dispatch } = useStore();
  const [name, setName] = useState("");
  const [section, setSection] = useState(initialSection);
  const [picked, setPicked] = useState<Set<string>>(() => new Set(initialMembers));
  const bots = state.bots.filter((b) => !b.hidden);
  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const create = () => {
    if (!picked.size) return;
    dispatch({
      type: "createGroup",
      memberIds: [...picked],
      name: name.trim() || undefined,
      section: section.trim() || undefined,
    });
    onClose();
  };
  return (
    <ColumnLayer onClose={onClose} backdrop="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-[340px] rounded-[14px] border border-ink/[0.1] bg-panel p-4 shadow-[0_20px_50px_rgba(0,0,0,.55)]">
        <div className="mb-3 text-[15px] font-semibold text-ink">{t("sidebar.newChannel.title")}</div>
        <input
          autoFocus
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") create();
            if (e.key === "Escape") onClose();
          }}
          placeholder={t("sidebar.newChannel.name")}
          className="mb-3 w-full rounded-lg bg-ink/[0.06] px-3 py-2 text-[14px] text-ink placeholder:text-ink/55 focus:outline-none"
        />
        <input
          value={section}
          maxLength={60}
          onChange={(e) => setSection(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") create();
            if (e.key === "Escape") onClose();
          }}
          placeholder={t("sidebar.newChannel.context")}
          aria-label={t("sidebar.newChannel.contextAria")}
          className="mb-3 w-full rounded-lg bg-ink/[0.06] px-3 py-2 text-[14px] text-ink placeholder:text-ink/55 focus:outline-none"
        />
        <BotPickerList
          bots={bots}
          picked={picked}
          onToggle={toggle}
          emptyHint={t("sidebar.newChannel.emptyHint")}
        />
        <button
          onClick={create}
          disabled={!picked.size}
          className="mt-3 w-full rounded-lg bg-ink py-2 text-[14px] font-medium text-app hover:brightness-110 disabled:opacity-40"
        >
          {picked.size === 0
            ? t("sidebar.newChannel.create")
            : picked.size === 1
              ? t("sidebar.newChannel.createOne")
              : t("sidebar.newChannel.createMany", { count: picked.size })}
        </button>
      </div>
    </ColumnLayer>
  );
}
