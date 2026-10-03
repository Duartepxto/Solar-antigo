// Archived bots: restore one or all, or delete them for good. Archiving
// keeps everything and is reversible from here; deleting is not. Also the
// rules and copy every archive / delete confirmation shares.
import { useEffect, useRef, useState } from "react";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { Loader2, Trash2, X } from "lucide-react";
import { api, useStore, type Bot } from "@/state/store";
import { t } from "@/lib/i18n";
import { BotFace } from "@/orbit/OrbitFace";
import { ConfirmDialog } from "./ConfirmDialog";

export type BotConfirmKind = "archive" | "delete";

/** A confirmation may span live fleet updates; never authorize from its snapshot. */
export function currentArchivableBot(bots: readonly Bot[], id: string): Bot | undefined {
  const active = bots.filter((candidate) => !candidate.hidden);
  if (active.length <= 1) return undefined;
  return active.find((candidate) => candidate.id === id && !candidate.chiefOfStaff);
}

/** Copy for the archive / delete confirmation dialogs. Archiving keeps
 * everything and is reversible from Archived bots; deleting is not — the
 * server drops every task transcript, the workspace (files + memory), staged
 * skill state, and any private computer the bot owns. Shared team computers
 * remain. */
export function botConfirmCopy(kind: BotConfirmKind, name: string) {
  return kind === "archive"
    ? {
        title: t("sidebar.confirm.archiveTitle", { name }),
        body: t("sidebar.confirm.archiveBody", { name }),
        confirmLabel: t("sidebar.bot.archive"),
        tone: "neutral" as const,
      }
    : {
        title: t("sidebar.confirm.deleteTitle", { name }),
        body: t("sidebar.confirm.deleteBody", { name }),
        confirmLabel: t("common.delete"),
        tone: "danger" as const,
      };
}

export function archivedDeleteAllCopy() {
  return {
    title: t("sidebar.archived.deleteAllTitle"),
    body: t("sidebar.archived.deleteAllBody"),
    confirmLabel: t("sidebar.archived.deleteAll"),
    tone: "danger" as const,
  };
}

export function ArchivedBotRow({
  bot,
  restoring,
  deleting,
  disabled,
  onRestore,
  onDelete,
}: {
  bot: Bot;
  restoring: boolean;
  deleting: boolean;
  disabled: boolean;
  onRestore: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex min-h-[82px] items-center gap-3 border-b border-ink/[0.1] px-1 py-3">
      <BotFace bot={bot} size={42} dim />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-ink">{bot.name}</div>
        <div className="mt-0.5 truncate text-[12.5px] text-ink/55">{bot.title || t("sidebar.archived.botFallback")}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={onRestore}
          disabled={disabled || deleting}
          className="flex min-w-[78px] items-center justify-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 py-2 text-[12.5px] text-ink hover:bg-ink/[0.1] disabled:opacity-40"
        >
          {restoring && <Loader2 size={13} className="animate-spin" />}
          {t("sidebar.archived.restore")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled || deleting}
          aria-label={t("sidebar.archived.deleteAria", { name: bot.name })}
          className="flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] text-[#ff8a96] hover:bg-[#ff5667]/10 disabled:opacity-40"
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {t("common.delete")}
        </button>
      </div>
    </div>
  );
}

export function ArchivedBotsDialog({
  bots,
  onClose,
  onRestored,
}: {
  bots: Bot[];
  onClose: () => void;
  onRestored: (message: string) => void;
}) {
  const { state, dispatch } = useStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [restoringAll, setRestoringAll] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Bot | "all" | null>(null);
  const [error, setError] = useState("");
  const deleting = bots.some((bot) => Boolean(state.deletingBots[bot.id]));
  const locked = restoringAll || Boolean(busyId) || deleting || Boolean(pendingDelete);

  useEffect(() => {
    if (bots.length === 0) onClose();
  }, [bots.length, onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !locked) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locked, onClose]);

  const restore = async (bot: Bot) => {
    setBusyId(bot.id);
    setError("");
    try {
      const response = await api(`/api/bots/${bot.id}`, {
        method: "PATCH",
        body: JSON.stringify({ hidden: false }),
      });
      dispatch({ type: "botPatched", bot: response.bot });
      dispatch({ type: "select", id: bot.id });
      onRestored(t("sidebar.archived.restored", { name: bot.name }));
      if (bots.length === 1) onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusyId(null);
    }
  };

  const restoreAll = async () => {
    setRestoringAll(true);
    setError("");
    try {
      const responses = await Promise.all(
        bots.map((bot) =>
          api(`/api/bots/${bot.id}`, {
            method: "PATCH",
            body: JSON.stringify({ hidden: false }),
          }),
        ),
      );
      for (const response of responses) dispatch({ type: "botPatched", bot: response.bot });
      const first = bots[0];
      if (first) dispatch({ type: "select", id: first.id });
      onRestored(
        bots.length === 1
          ? t("sidebar.archived.restoredOne")
          : t("sidebar.archived.restoredMany", { count: bots.length }),
      );
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setRestoringAll(false);
    }
  };

  return (
    <ColumnLayer onClose={onClose} locked={locked} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px] sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archived-bots-title"
        tabIndex={-1}
        className="animate-pop-in flex max-h-[min(680px,calc(100dvh-2rem))] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)] shadow-black/50 outline-none"
      >
        <header className="flex items-start justify-between gap-4 px-6 pb-4 pt-6 sm:px-8 sm:pt-7">
          <div>
            <h2 id="archived-bots-title" className="text-[22px] font-semibold tracking-[-0.01em] text-ink">{t("sidebar.archived.title")}</h2>
            <p className="mt-1 text-[13px] text-ink/55">{t("sidebar.archived.subtitle")}</p>
          </div>
          <div className="flex items-center gap-1">
            {bots.length > 1 && (
              <button
                onClick={() => void restoreAll()}
                disabled={locked}
                className="flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 py-2 text-[12.5px] text-ink hover:bg-ink/[0.1] disabled:opacity-40"
              >
                {restoringAll && <Loader2 size={13} className="animate-spin" />}
                {t("sidebar.archived.restoreAll")}
              </button>
            )}
            {bots.length > 0 && (
              <button
                type="button"
                onClick={() => setPendingDelete("all")}
                disabled={locked}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] text-[#ff8a96] hover:bg-[#ff5667]/10 disabled:opacity-40"
              >
                <Trash2 size={13} />
                {t("sidebar.archived.deleteAll")}
              </button>
            )}
            <button
              onClick={onClose}
              disabled={locked}
              className="flex size-10 items-center justify-center rounded-lg text-ink/55 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-40"
              aria-label={t("sidebar.archived.close")}
            >
              <X size={21} />
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-7 pt-3 sm:px-8">
          <div className="mb-3 text-[12px] font-medium text-ink/55">{t("sidebar.archived.count", { count: bots.length })}</div>
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {bots.map((bot) => (
              <ArchivedBotRow
                key={bot.id}
                bot={bot}
                restoring={busyId === bot.id}
                deleting={Boolean(state.deletingBots[bot.id])}
                disabled={locked}
                onRestore={() => void restore(bot)}
                onDelete={() => setPendingDelete(bot)}
              />
            ))}
          </div>
          {error && <div role="alert" className="mt-4 rounded-lg bg-[#ff5667]/10 px-3 py-2 text-[12.5px] text-[#ff8a96]">{error}</div>}
        </div>
      </div>
      <ConfirmDialog
        open={pendingDelete !== null}
        {...(pendingDelete === "all"
          ? archivedDeleteAllCopy()
          : botConfirmCopy("delete", pendingDelete?.name ?? ""))}
        icon={<Trash2 size={18} />}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          setPendingDelete(null);
          if (target === "all") {
            for (const bot of bots) dispatch({ type: "deleteBot", botId: bot.id });
            return;
          }
          dispatch({ type: "deleteBot", botId: target.id });
        }}
      />
    </ColumnLayer>
  );
}

