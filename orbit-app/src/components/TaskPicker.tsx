// Separate task contexts for an agent or a channel.
//
// One endless thread per bot means every job contaminates the next, and
// the only clean slate is a second bot. A task is a real boundary — its
// own transcript and its own provider session — so sensitive work, a
// long job and a quick question can sit side by side under one agent.
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Activity, Archive, ArchiveRestore, Check, ChevronDown, ChevronRight, Clock, FolderInput, Link2, Pencil, Pin, PinOff, Plus, Search, Trash2 } from "lucide-react";
import { api, useStore, type Bot, type BotProject, type Group, type Task } from "@/state/store";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { COMPACT_BUBBLE } from "@/lib/compact-chip";
import { formatTaskTokens, headlineTokens, usageDetail } from "@/lib/usage";
import { nextRename } from "@/lib/rename";
import { moveFolder } from "@/lib/folder-order";
import { folderUnreadThreadIds, markFolderRead } from "@/lib/folder-read";
import { BotProjectDialog, FolderActions, FolderIcon, NewThreadButton } from "./BotProjects";
import { useShowThreads } from "@/lib/thread-preferences";
import { attentionJumpAction, attentionOwnerName, AttentionThreadRows, crossBotAttentionThreads, threadsWhenTreeHidden, type AttentionThread } from "./SidebarBotActivity";
import { formatUpdatedAt, isArchived, nextSixPm, orderedThreadList, threadByline, threadRecency, threadUpdatedLabel, tomorrowNineAm, useRelativeNow } from "./SidebarThreadRow";
import { threadRefUrl } from "@/lib/thread-refs";
import { useMenuSide } from "@/lib/menu-side";

/** Click-to-switch used to close this menu immediately, which unmounted the
 * row before a double-click (or right-click) could start a rename. Linger
 * just long enough for the second click to land; rename cancels the close. */
export const TASK_PICKER_DISMISS_MS = 500;


/** Decide what a pointer event on a task row should do. The click that
 * accompanies a dblclick (detail >= 2) must not switch/close — that is
 * what used to eat the advertised rename. */
export function taskPickerPointerIntent(
  type: string,
  detail = 1,
): "select" | "rename" | "ignore" {
  if (type === "dblclick" || type === "contextmenu") return "rename";
  if (type === "click" && detail >= 2) return "ignore";
  if (type === "click") return "select";
  return "ignore";
}

/** Filter the task switcher. Prefix matches float first so a few letters
 * still find the right row in a long list; within a tier the caller's
 * order (newest first) is preserved. */
export function filterTasks<T extends { title: string }>(tasks: readonly T[], query: string): T[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...tasks];
  const prefix: T[] = [];
  const substring: T[] = [];
  for (const task of tasks) {
    const title = task.title.toLowerCase();
    if (title.startsWith(needle)) prefix.push(task);
    else if (title.includes(needle)) substring.push(task);
  }
  return [...prefix, ...substring];
}

/** The picker row's stamp, sharing the sidebar row's contract: relative
 * label in the flow, the exact date one hover away, ISO for machines. */
function TaskUpdatedTime({ task, now }: { task: { updatedAt?: number; createdAt?: number }; now: number }) {
  const stamp = threadRecency(task);
  if (!Number.isFinite(stamp) || stamp <= 0) return null;
  return <time dateTime={new Date(stamp).toISOString()} title={formatUpdatedAt(stamp)}>{threadUpdatedLabel(stamp, now)}</time>;
}

/** Quiet per-task token tally; the hover title explains the cached share. */
function TaskUsage({ usage }: { usage: Task["usage"] }) {
  if (!usage) return null;
  const label = formatTaskTokens(headlineTokens(usage));
  if (!label) return null;
  return (
    <span
      title={usageDetail(usage)}
    >
      {" · "}
      {label}
    </span>
  );
}

type PickerTask = Pick<Task, "threadId" | "title" | "createdAt" | "updatedAt" | "pinned" | "busy" | "activity" | "unread" | "projectId" | "openedBy" | "closedBy" | "archivedAt" | "snoozedUntil" | "waitingForTeammates"> & { usage?: Task["usage"] };

/** The full picker searches both thread titles and their project names.
 * Legacy/orphaned project IDs remain visible under Ungrouped. */
export function groupThreadTasks(tasks: PickerTask[], projects: BotProject[], query: string) {
  const needle = query.trim().toLowerCase();
  return [...projects, { id: "", name: t("folder.none") } as BotProject].map((project) => {
    const members = tasks.filter((task) => project.id ? task.projectId === project.id : !projects.some((item) => item.id === task.projectId));
    return { project, tasks: project.name.toLowerCase().includes(needle) ? members : filterTasks(members, query) };
  }).filter((group) => group.tasks.length > 0);
}

function ConversationTaskPicker({
  threadId,
  tasks,
  busy,
  bot,
  onNew,
  onSwitch,
  onRename,
  onDelete,
  onMove,
  onPin,
  onArchive,
  onSnooze,
  linkFor,
  attention,
  onAttentionJump,
  triggerLabel,
  align = "right",
}: {
  threadId: string;
  tasks: PickerTask[];
  busy: boolean;
  bot?: Bot;
  onNew: () => void;
  onSwitch: (threadId: string) => void;
  onRename: (threadId: string, title: string) => void;
  onDelete: (threadId: string) => void;
  onMove?: (threadId: string, projectId: string | null) => void;
  onPin?: (threadId: string, pinned: boolean) => void;
  /** archive folds a thread away under "Archived (n)"; restore brings it back */
  onArchive?: (threadId: string, archivedAt: number | null) => void;
  /** snooze until a moment (0: until new activity), or null to stop */
  onSnooze?: (threadId: string, until: number | null) => void;
  /** a link that opens this thread (bots; channel threads have none) */
  linkFor?: (threadId: string) => string;
  attention?: AttentionThread[];
  onAttentionJump?: (entry: AttentionThread) => void;
  /** Orbit's thread chips: the trigger reads "N more ▾" / "All ▾" and the
   * menu opens from the left edge of the column */
  triggerLabel?: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // hangs from whichever edge keeps it inside the window (the chat header
  // sits on the right, where a left-hung menu ran off the side)
  const autoSide = useMenuSide(open, ref, 300);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishingRename = useRef(false);
  const now = useRelativeNow();

  const current = tasks.find((t) => t.threadId === threadId);

  const clearDismiss = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  };

  const closeMenu = () => {
    clearDismiss();
    setRenaming(null);
    setQuery("");
    setOpen(false);
  };

  const queueDismiss = () => {
    clearDismiss();
    dismissTimer.current = setTimeout(() => {
      dismissTimer.current = null;
      setRenaming(null);
      setOpen(false);
    }, TASK_PICKER_DISMISS_MS);
  };

  const startRename = (task: PickerTask) => {
    clearDismiss();
    finishingRename.current = false;
    setDraft(task.title);
    setRenaming(task.threadId);
  };

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  useEffect(() => {
    if (!open) {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
      setRenaming(null);
      setQuery("");
      return;
    }
    const onDown = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("[data-thread-overlay]")) return;
      // SAFETY: a mousedown target inside a document is always a DOM Node
      if (!ref.current?.contains(e.target as Node)) {
        if (dismissTimer.current) {
          clearTimeout(dismissTimer.current);
          dismissTimer.current = null;
        }
        setRenaming(null);
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (e.target instanceof Element && e.target.closest("[data-thread-overlay]")) return;
      if (renaming) return;
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
      setRenaming(null);
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, renaming]);

  const commitRename = (threadId: string, save: boolean) => {
    // Escape unmounts the input, which fires blur. Without this guard the
    // blur would save the draft the user just cancelled.
    if (finishingRename.current) return;
    finishingRename.current = true;
    const currentTitle = tasks.find((task) => task.threadId === threadId)?.title ?? "";
    const title = save ? nextRename(currentTitle, draft) : null;
    setRenaming(null);
    if (title) onRename(threadId, title);
  };

  // the picker button stays as-is — a token count next to a truncated title
  // and count would crowd it; the open task's tally rides the hover title
  const u = current?.usage;
  const currentLabel = u ? formatTaskTokens(headlineTokens(u)) : null;
  const switchTitle =
    u && currentLabel
      ? t("task.switchWithUsageDetail", {
          label: currentLabel,
          detail: usageDetail(u),
        })
      : t("task.switch");
  // Archived threads fold under "Archived (n)" unless searched for or open.
  const archivedTasks = onArchive && !query.trim() ? tasks.filter((task) => isArchived(task) && task.threadId !== threadId) : [];
  const listed = archivedTasks.length ? tasks.filter((task) => !archivedTasks.includes(task)) : tasks;
  const grouped = bot ? groupThreadTasks(listed, bot.projects ?? [], query) : null;
  const visible = grouped ? grouped.flatMap((group) => group.tasks) : filterTasks(listed, query);
  // The attention section rides above the tree and obeys the same search:
  // a query narrows it by thread title or bot name rather than hiding it.
  const attentionNeedle = query.trim().toLowerCase();
  const attentionRows = (attention ?? []).filter((entry) =>
    !attentionNeedle || entry.task.title.toLowerCase().includes(attentionNeedle) || attentionOwnerName(entry).toLowerCase().includes(attentionNeedle));
  const looking = query.trim();
  // One result list for keyboard, count, and empty state: an attention row
  // that matches the query is a real result even when no tree thread does.
  const results = [...attentionRows.map((entry) => ({ kind: "attention" as const, entry })), ...visible.map((task) => ({ kind: "task" as const, task }))];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          if (open) closeMenu();
          else setOpen(true);
        }}
        title={switchTitle}
        aria-label={t("task.switch")}
        aria-expanded={open}
        className={triggerLabel !== undefined
          ? "h-6 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium text-ink/60 hover:bg-ink/[0.08]"
          : cn(
            "flex max-w-[220px] items-center gap-1.5 rounded-full border border-ink/[0.1] px-2.5 py-1 text-[12.5px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink",
            COMPACT_BUBBLE,
          )}
      >
        {triggerLabel !== undefined ? triggerLabel : <>
          <span className="truncate @max-4xl/chathead:hidden">{t("task.switch")}</span>
          {/* folded: just the count in the bubble — the title rides the tooltip */}
          <span className="shrink-0 tabular-nums opacity-60 @max-4xl/chathead:opacity-100">{tasks.length}</span>
          <ChevronDown size={12} className="shrink-0 @max-4xl/chathead:hidden" />
        </>}
      </button>

      {open && (
        <div data-orbit-thread-menu className={cn("absolute top-full z-40 mt-1 w-[300px] overflow-hidden rounded-xl border border-ink/[0.1] bg-panel py-1 shadow-[0_20px_50px_rgba(0,0,0,.55)] shadow-black/50", (align === "right" || autoSide === "right") ? "right-0" : "left-0")}>
          <div className="px-2 pb-1 pt-1.5">
            <div className="flex items-center gap-2 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2.5 py-1.5 focus-within:border-ink/30">
              <Search size={13} className="shrink-0 text-ink/55" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (looking) setQuery("");
                    else closeMenu();
                    return;
                  }
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    const first = results[0];
                    if (!first) return;
                    if (first.kind === "attention") onAttentionJump?.(first.entry);
                    else if (first.task.threadId !== threadId) onSwitch(first.task.threadId);
                    closeMenu();
                  }
                }}
                placeholder={t("task.search")}
                aria-label={t("task.search")}
                className="w-full bg-transparent text-[12.5px] text-ink placeholder:text-ink/55 focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto" role="group" aria-label={looking ? t("task.matching", { count: results.length }) : t("task.list")}>
            {attentionRows.length > 0 && <div className="pb-1">
              <div className="flex items-center gap-1.5 px-3 pb-1 pt-1.5 text-[11px] font-medium text-ink/55"><Activity size={12} />{t("attention.title")}</div>
              <AttentionThreadRows entries={attentionRows} onJump={(entry) => { onAttentionJump?.(entry); closeMenu(); }} />
            </div>}
            {results.length === 0 ? (
              <div className="px-3 py-6 text-center text-[13px] text-ink/55">
                {t("task.noMatch", { query: looking })}
              </div>
            ) : visible.map((task, index) => {
              const active = task.threadId === threadId;
              const opener = threadByline(task);
              const heading = grouped?.find((group) => group.tasks[0]?.threadId === task.threadId)?.project;
              return (
                <Fragment key={task.threadId}>
                {bot?.projects?.length && heading ? <div className={cn("group/folder flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] font-medium text-ink/55", index > 0 && "border-t border-ink/[0.1]")}>
                  {heading.id && <FolderIcon emoji={heading.emoji} size={12} />}<span className="min-w-0 flex-1 truncate">{heading.name}</span>
                  {heading.id && <PickerFolderActions bot={bot} project={heading} onEdit={() => setEditingFolder(heading.id)} />}
                </div> : null}
                <div
                  className={cn("group flex items-center gap-2 px-2.5 py-2", active ? "bg-ink/[0.06]" : "hover:bg-ink/[0.06]")}
                >
                  <Check size={13} className={cn("shrink-0", active ? "text-ink" : "opacity-0")} />
                  {renaming === task.threadId ? (
                    <input
                      autoFocus
                      value={draft}
                      maxLength={80}
                      aria-label={t("task.renameAria")}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) => setDraft(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onBlur={() => commitRename(task.threadId, true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                          e.preventDefault();
                          e.stopPropagation();
                          commitRename(task.threadId, true);
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          e.stopPropagation();
                          commitRename(task.threadId, false);
                        }
                      }}
                      className="min-w-0 flex-1 rounded bg-ink/[0.04] px-1.5 py-0.5 text-[13px] text-ink focus:outline-none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        if (taskPickerPointerIntent("click", e.detail) !== "select") return;
                        if (!active) onSwitch(task.threadId);
                        queueDismiss();
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startRename(task);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startRename(task);
                      }}
                      className="min-w-0 flex-1 text-left"
                      title={t("task.renameHint")}
                    >
                      <div className="truncate text-[13px] text-ink">{task.title}</div>
                      <div className="text-[11px] text-ink/55">
                        {task.activity === "waiting-on-you" ? `${t("task.waiting")} · ` : task.waitingForTeammates ? `${t("task.waitingOnTeammate")} · ` : task.busy ? `${t("chat.activity.working")} · ` : task.unread ? `${t("task.unread")} · ` : ""}
                        <TaskUpdatedTime task={task} now={now} />
                        <TaskUsage usage={task.usage} />
                        {opener && ` · ${opener}`}
                      </div>
                    </button>
                  )}
                  {onPin && renaming !== task.threadId && (
                    <button
                      type="button"
                      onClick={() => onPin(task.threadId, task.pinned !== true)}
                      aria-label={task.pinned === true ? t("sidebar.bot.unpin") : t("sidebar.bot.pin")}
                      title={task.pinned === true ? t("sidebar.bot.unpin") : t("sidebar.bot.pin")}
                      className="rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-70"
                    >
                      {task.pinned === true ? <PinOff size={13} /> : <Pin size={13} />}
                    </button>
                  )}
                  {renaming !== task.threadId && (
                    <button
                      type="button"
                      onClick={() => startRename(task)}
                      aria-label={t("task.renameNamed", { title: task.title })}
                      title={t("task.renameTitle")}
                      className="rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-70"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  {bot && onMove && (bot.projects?.length ?? 0) > 0 && <label title={t("folder.move")} className="relative rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-within:opacity-100 group-hover:opacity-100 touch:opacity-70">
                    <FolderInput size={13} />
                    <select aria-label={t("folder.moveNamed", { title: task.title })} value={bot.projects?.some((project) => project.id === task.projectId) ? task.projectId : ""}
                      onFocus={clearDismiss} onChange={(event) => { clearDismiss(); onMove(task.threadId, event.target.value || null); }}
                      className="absolute inset-0 w-full cursor-pointer opacity-0">
                      <option value="">{t("folder.none")}</option>
                      {bot.projects?.map((project) => <option key={project.id} value={project.id}>{project.emoji ? `${project.emoji} ` : ""}{project.name}</option>)}
                    </select>
                  </label>}
                  {onSnooze && renaming !== task.threadId && (
                    <label title={t("task.snooze")} className={cn("relative rounded p-1 hover:bg-ink/[0.06] hover:text-ink focus-within:opacity-100 group-hover:opacity-100 touch:opacity-70",
                      task.snoozedUntil !== undefined && task.snoozedUntil !== null ? "text-ink opacity-100 touch:opacity-100" : "text-ink/55 opacity-0")}>
                      <Clock size={13} />
                      <select aria-label={`${t("task.snooze")} · ${task.title}`} value="" disabled={Boolean(task.busy) || task.activity === "working"}
                        onFocus={clearDismiss}
                        onChange={(event) => {
                          clearDismiss();
                          const choice = event.target.value;
                          onSnooze(task.threadId, choice === "stop" ? null : choice === "tonight" ? nextSixPm() : choice === "tomorrow" ? tomorrowNineAm() : 0);
                        }}
                        className="absolute inset-0 w-full cursor-pointer opacity-0">
                        <option value="" disabled>{t("task.snooze")}</option>
                        <option value="activity">{t("task.snoozeUntilActivity")}</option>
                        <option value="tonight">{t("task.snoozeTonight")}</option>
                        <option value="tomorrow">{t("task.snoozeTomorrow")}</option>
                        {task.snoozedUntil !== undefined && task.snoozedUntil !== null && <option value="stop">{t("task.stopSnoozing")}</option>}
                      </select>
                    </label>
                  )}
                  {linkFor && renaming !== task.threadId && (
                    <button type="button" onClick={() => void navigator.clipboard?.writeText(linkFor(task.threadId))}
                      aria-label={`${t("task.copyLink")} · ${task.title}`} title={t("task.copyLink")}
                      className="rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-70">
                      <Link2 size={13} />
                    </button>
                  )}
                  {onArchive && renaming !== task.threadId && (
                    <button
                      type="button"
                      onClick={() => onArchive(task.threadId, isArchived(task) ? null : Date.now())}
                      aria-label={`${isArchived(task) ? t("task.unarchive") : t("task.archive")} · ${task.title}`}
                      title={isArchived(task) ? t("task.unarchive") : t("task.archive")}
                      className="rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-70"
                    >
                      {isArchived(task) ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(task.threadId)}
                    disabled={Boolean(task.busy) || busy && active}
                    aria-label={t("task.deleteAria")}
                    title={t("task.deleteTitle")}
                    className="rounded p-1 text-ink/55 opacity-0 hover:bg-ink/[0.06] hover:text-[#ff8a96] focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-20 touch:opacity-70 touch:disabled:opacity-20"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                </Fragment>
              );
            })}
            {archivedTasks.length > 0 && <>
              <button type="button" aria-expanded={showArchived} onClick={() => setShowArchived((was) => !was)}
                className="flex w-full items-center gap-1 border-t border-ink/[0.1] px-3 py-1.5 text-left text-[11px] font-medium text-ink/55 hover:text-ink">
                <ChevronRight aria-hidden size={11} className={cn("shrink-0 transition-transform", showArchived && "rotate-90")} />
                {t("task.archivedList", { count: archivedTasks.length })}
              </button>
              {showArchived && archivedTasks.map((task) => (
                <div key={task.threadId} className="group flex items-center gap-2 px-2.5 py-1.5 hover:bg-ink/[0.06]">
                  <span className="size-[13px] shrink-0" />
                  <button type="button" onClick={() => { onSwitch(task.threadId); closeMenu(); }} className="min-w-0 flex-1 truncate text-left text-[13px] text-ink/55">{task.title}</button>
                  <button type="button" onClick={() => onArchive?.(task.threadId, null)} aria-label={`${t("task.unarchive")} · ${task.title}`} title={t("task.unarchive")}
                    className="rounded p-1 text-ink/55 hover:bg-ink/[0.06] hover:text-ink"><ArchiveRestore size={13} /></button>
                </div>
              ))}
            </>}
          </div>
          {bot ? <NewThreadButton bot={bot} onCreated={closeMenu} className="mt-1 w-full rounded-none border-t border-ink/[0.1]" /> : <button
            type="button"
            onClick={() => {
              onNew();
              closeMenu();
            }}
            disabled={busy}
            className="mt-1 flex w-full items-center gap-2 border-t border-ink/[0.1] px-3 py-2 text-left text-[13px] text-ink hover:bg-ink/[0.06] disabled:opacity-40"
          >
            <Plus size={13} className="text-ink/55" /> {t("task.newShort")}
          </button>}
        </div>
      )}
      {bot && editingFolder && bot.projects?.some((project) => project.id === editingFolder) && (
        <BotProjectDialog bot={bot} project={bot.projects.find((project) => project.id === editingFolder)} onClose={() => setEditingFolder(null)} />
      )}
    </div>
  );
}

/** A folder heading's ⋯: settings, mark read, and its place among folders. */
function PickerFolderActions({ bot, project, onEdit }: { bot: Bot; project: BotProject; onEdit: () => void }) {
  const { dispatch } = useStore();
  const [menu, setMenu] = useState<{ left: number; top: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ids = (bot.projects ?? []).map((item) => item.id);
  const index = ids.indexOf(project.id);
  const move = (direction: -1 | 1, onSaved: () => void) => {
    if (saving) return;
    setSaving(true); setError(null); setStatus(t("folder.reordering"));
    dispatch({ type: "reorderProjects", botId: bot.id, projectIds: moveFolder(ids, project.id, direction),
      onSaved: () => { setSaving(false); setStatus(t("folder.reordered")); onSaved(); },
      onError: (message) => { setSaving(false); setStatus(""); setError(message); } });
  };
  const markRead = async (onSaved: () => void) => {
    if (saving) return;
    setSaving(true); setError(null); setStatus(t("folder.markingRead"));
    try {
      await markFolderRead(bot, project.id, api, (updated) => dispatch({ type: "botPatched", bot: updated }));
      setStatus(t("folder.markedRead"));
      onSaved();
    } catch (failure) {
      setStatus("");
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally { setSaving(false); }
  };
  return <>
    {error && <span role="alert" className="truncate text-[11px] font-normal text-[#ff8a96]">{error}</span>}
    <span role="status" className="sr-only">{status}</span>
    <FolderActions project={project} canMoveUp={index > 0} canMoveDown={index >= 0 && index < ids.length - 1}
      canMarkRead={folderUnreadThreadIds(bot, project.id).length > 0} saving={saving} menu={menu} onMenuChange={setMenu}
      onEdit={onEdit} onMove={move} onMarkRead={(onSaved) => { void markRead(onSaved); }} />
  </>;
}

/** The sibling-activity dropdown shown only while the sidebar thread tree is
 * hidden, ordered exactly like the sidebar so both surfaces agree. */
export function BotActivityPicker({ bot }: { bot: Bot }) {
  const { state, dispatch } = useStore();
  const showThreads = useShowThreads();
  if (showThreads) return null;
  const activity = threadsWhenTreeHidden(bot, state.pendingQueued).filter((task) => task.threadId !== bot.threadId);
  // A display preference must not strand a sibling approval or queued job,
  // including on narrow screens where the sidebar is closed. This is an
  // activity switcher only: idle histories and creation remain hidden.
  if (!activity.length) return null;
  return (
    <div className="flex shrink-0 items-center gap-2 px-5 py-2" data-background-activity>
      <select
        aria-label={t("task.otherActivity", { count: activity.length })}
        value=""
        onChange={(event) => dispatch({ type: "switchTask", botId: bot.id, threadId: event.target.value })}
        className="max-w-[180px] shrink-0 truncate rounded-full border border-ink/[0.1] bg-panel px-2.5 py-1 text-[12.5px] text-ink/55"
      >
        <option value="" disabled>{t("task.otherActivity", { count: activity.length })}</option>
        {activity.map((task) => <option key={task.threadId} value={task.threadId}>
          {task.title} · {task.activity === "waiting-on-you" ? t("task.waiting") : task.waitingForTeammates ? t("task.waitingOnTeammate") : task.busy || task.activity === "working" ? t("chat.activity.working") : task.queued ? t("task.queued") : t("task.unread")}
        </option>)}
      </select>
      <span className="truncate text-[12px] text-ink/55">{bot.tasks?.find((task) => task.threadId === bot.threadId)?.title}</span>
    </div>
  );
}

export function TaskPicker({ bot, triggerLabel, align }: { bot: Bot; triggerLabel?: ReactNode; align?: "left" | "right" }) {
  const { state, dispatch } = useStore();
  const showThreads = useShowThreads();
  if (!showThreads) return null;
  return (
    <ConversationTaskPicker
      triggerLabel={triggerLabel}
      align={align}
      threadId={bot.threadId}
      tasks={orderedThreadList((bot.tasks ?? []).filter((task) => !task.routineRunId))}
      busy={false}
      bot={bot}
      attention={crossBotAttentionThreads(state.bots, state.pendingQueued, bot.id, state.groups)}
      onNew={() => dispatch({ type: "newTask", botId: bot.id })}
      onSwitch={(threadId) => dispatch({ type: "switchTask", botId: bot.id, threadId })}
      onRename={(threadId, title) => dispatch({ type: "renameTask", botId: bot.id, threadId, title })}
      onDelete={(threadId) => dispatch({ type: "deleteTask", botId: bot.id, threadId })}
      onMove={(threadId, projectId) => dispatch({ type: "updateTask", botId: bot.id, threadId, patch: { projectId } })}
      onPin={(threadId, pinned) => dispatch({ type: "updateTask", botId: bot.id, threadId, patch: { pinned } })}
      onArchive={(threadId, archivedAt) => dispatch({ type: "updateTask", botId: bot.id, threadId, patch: { archivedAt } })}
      onSnooze={(threadId, snoozedUntil) => dispatch({ type: "updateTask", botId: bot.id, threadId, patch: { snoozedUntil } })}
      linkFor={(threadId) => threadRefUrl({ botId: bot.id, threadId })}
      onAttentionJump={(entry) => dispatch(attentionJumpAction(entry))}
    />
  );
}

/** The same task affordance in a channel. DMs never render it because their
 * transcript is the private bot-to-bot exchange rather than user work. */
export function GroupTaskPicker({ group }: { group: Group }) {
  const { dispatch } = useStore();
  return (
    <ConversationTaskPicker
      threadId={group.threadId}
      tasks={orderedThreadList(group.tasks ?? [])}
      busy={Boolean(group.working || group.busyBotId)}
      onNew={() => dispatch({ type: "newGroupTask", groupId: group.id })}
      onSwitch={(threadId) => dispatch({ type: "switchGroupTask", groupId: group.id, threadId })}
      onRename={(threadId, title) => dispatch({ type: "renameGroupTask", groupId: group.id, threadId, title })}
      onDelete={(threadId) => dispatch({ type: "deleteGroupTask", groupId: group.id, threadId })}
      onPin={(threadId, pinned) => {
        const title = group.tasks?.find((task) => task.threadId === threadId)?.title ?? "";
        dispatch({ type: "pinGroupTask", groupId: group.id, threadId, pinned, title });
      }}
    />
  );
}
