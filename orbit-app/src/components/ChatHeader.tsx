// The chat column's header (design_handoff_orbit/README.md §3, "Chat
// column"): the bot's name in its colour, who it reports to, the engine /
// approval / works-on chips, and the thread chips. Every control dispatches
// the same store actions the app always used.

import { threadRefUrl } from "@/lib/thread-refs";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Archive, BellDot, Bug, ClipboardCopy, Coins, Copy, Crown, Download, EyeOff, Folder, FolderPlus, History, LayoutDashboard, Link2, Pin, Search, Square, Trash2, UserRoundPen, Users } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { WorkingDots } from "./WorkingIndicator";
import { TeamPicker } from "./TeamPicker";
import { BotProjectDialog } from "./BotProjects";
import { ORBIT_HIDE_EVENT, orbitToast } from "@/orbit/events";
import { botConfirmCopy, currentArchivableBot } from "./ArchivedBotsDialog";
import { useStore, type Bot, type BotProject, type Message, type Task } from "@/state/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { MAUS_COLORS } from "@/lib/mascot";
import { BotFace } from '@/orbit/OrbitFace';
import { copyTranscriptToClipboard, downloadMarkdownTranscript, formatTranscriptMarkdown, slugifyTranscriptFilename } from "@/lib/export-transcript";
import { ApprovalGlyph } from "./ApprovalGlyph";
export { ApprovalGlyph };
import { ModelPicker } from "./ModelPicker";
import { ThreadApprovalChip, ThreadPlaceChip } from "./ThreadControls";
import { ThreadUsageChip } from "./ThreadUsageChip";
import { CallButton } from "./CallView";
import { BotActivityPicker, TaskPicker } from "./TaskPicker";
import { useShowThreads } from "@/lib/thread-preferences";
import { orderedThreadList } from "./SidebarThreadRow";

export const CHIP_CLASS = "flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-ink/[0.1] px-2.5 text-[12px] text-ink hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-50";

/** A small popover that closes on outside click and Escape. */
export function useDismissOnOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !ref.current?.contains(e.target)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open, close]);
  return ref;
}

export function MenuItem({ icon, label, onClick, danger, disabled, hint }: { icon: ReactNode; label: string; onClick: () => void; danger?: boolean; disabled?: boolean; hint?: string }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} disabled={disabled} title={hint} aria-description={hint}
      className={cn("flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium enabled:hover:bg-ink/[0.07] disabled:cursor-not-allowed disabled:opacity-45", danger ? "text-[#ff8a96]" : "text-ink")}>
      <span className="flex size-3.5 items-center justify-center text-ink/55">{icon}</span>
      {label}
    </button>
  );
}

export const MENU_CLASS = "absolute z-30 flex flex-col gap-px rounded-xl border border-ink/[0.1] bg-menu p-1.5 shadow-[0_18px_40px_rgba(0,0,0,.5)] animate-pop-in";

function BotMenu({ bot, messages, onFind }: { bot: Bot; messages: Message[]; onFind: () => void }) {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [picker, setPicker] = useState<{ x: number; y: number } | null>(null);
  const [folder, setFolder] = useState<"new" | BotProject | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const anchor = () => { const r = buttonRef.current?.getBoundingClientRect(); return { x: r?.left ?? 0, y: (r?.bottom ?? 0) + 6 }; };
  const { state } = useStore();
  // never the Chief of Staff, never the last active bot (the old rules)
  const archivable = Boolean(currentArchivableBot(state.bots, bot.id));
  // the Orbit agent is part of the app: no team, no Chief, no copies, always there
  const builtIn = bot.system === "orbit";
  const ref = useDismissOnOutside(open, () => setOpen(false));
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const ownerOrAdmin = useOwnerOrAdmin();
  const run = (fn: () => void) => () => { setOpen(false); fn(); };
  const panel = (section: "overview" | "identity" | "usage" | "history") => run(() => dispatch({ type: "toggleSettings", open: true, section, botId: bot.id }));
  const markdown = () => formatTranscriptMarkdown({ title: bot.name, messages, botName: bot.name });
  return (
    <div ref={ref} className="relative">
      <button ref={buttonRef} type="button" onClick={() => setOpen((v) => !v)} aria-label={t("orbit.menu.more")} title={t("orbit.menu.more")} aria-expanded={open}
        className="flex size-7 items-center justify-center rounded-full text-[16px] font-semibold leading-none text-ink/70 hover:bg-ink/[0.07]">⋯</button>
      {picker && (
        <TeamPicker current={bot.section} anchor={picker} onClose={() => setPicker(null)}
          onAssign={(section) => dispatch({ type: "updateBot", botId: bot.id, patch: { section } })} />
      )}
      {folder && <BotProjectDialog bot={bot} project={folder === "new" ? undefined : folder} onClose={() => setFolder(null)} />}
      {open && (
        <div role="menu" className={cn(MENU_CLASS, "left-0 top-9 max-h-[70vh] w-[236px] overflow-y-auto")}>
          <MenuItem icon={<UserRoundPen size={14} />} label={t("orbit.menu.editProfile")} onClick={panel("identity")} />
          <MenuItem icon={<LayoutDashboard size={14} />} label={t("orbit.menu.overview")} onClick={panel("overview")} />
          <MenuItem icon={<Coins size={14} />} label={t("orbit.menu.usage")} onClick={panel("usage")} />
          <MenuItem icon={<History size={14} />} label={t("orbit.menu.history")} onClick={panel("history")} />
          {!remoteClient && <MenuItem icon={<Pin size={14} />} label={bot.pinned ? t("orbit.menu.unpin") : t("orbit.menu.pin")} onClick={run(() => dispatch({ type: "updateBot", botId: bot.id, patch: { pinned: !bot.pinned } }))} />}
          {(!remoteClient || ownerOrAdmin === true) && !builtIn && <MenuItem icon={<Users size={14} />} label={t("sidebar.bot.moveToSection")} onClick={run(() => setPicker(anchor()))} />}
          {/* one Chief per team: the server hands the role over from the current one */}
          {!remoteClient && !builtIn && <MenuItem icon={<Crown size={14} />}
            label={bot.chiefOfStaff ? t("orbit.menu.stopChief") : bot.section?.trim() ? t("orbit.menu.makeChief", { team: bot.section.trim() }) : t("orbit.menu.makeChiefLoose")}
            onClick={run(() => dispatch({ type: "updateBot", botId: bot.id, patch: { chiefOfStaff: !bot.chiefOfStaff } }))} />}
          <MenuItem icon={<BellDot size={14} />} label={t("sidebar.bot.markUnread")} onClick={run(() => dispatch({ type: "markUnread", botId: bot.id }))} />
          {!remoteClient && !builtIn && <MenuItem icon={<Copy size={14} />} label={t("sidebar.bot.duplicate")} onClick={run(() => dispatch({ type: "duplicateBot", botId: bot.id }))} />}
          {!builtIn && <MenuItem icon={<EyeOff size={14} />} label={t("orbit.menu.hide")} onClick={run(() => window.dispatchEvent(new CustomEvent(ORBIT_HIDE_EVENT, { detail: { botId: bot.id } })))} />}
          {!remoteClient && !builtIn && <MenuItem icon={<Archive size={14} />} label={t("orbit.menu.archive")} disabled={!archivable}
            hint={bot.chiefOfStaff ? t("sidebar.bot.archiveBlockedChief") : !archivable ? t("sidebar.bot.archiveBlockedLast") : undefined}
            onClick={run(() => setConfirmArchive(true))} />}
          <div className="my-1 h-px bg-ink/[0.08]" />
          <MenuItem icon={<FolderPlus size={14} />} label={t("folder.new")} onClick={run(() => setFolder("new"))} />
          {(bot.projects ?? []).map((project) => (
            <MenuItem key={project.id} icon={<Folder size={14} />} label={t("orbit.menu.editFolder", { name: project.name })} onClick={run(() => setFolder(project))} />
          ))}
          <div className="my-1 h-px bg-ink/[0.08]" />
          <MenuItem icon={<Search size={14} />} label={t("chat.find")} onClick={run(onFind)} />
          {messages.length > 0 && <>
            <MenuItem icon={<Download size={14} />} label={t("orbit.menu.download")} onClick={run(() => downloadMarkdownTranscript(slugifyTranscriptFilename(bot.name), markdown()))} />
            <MenuItem icon={<ClipboardCopy size={14} />} label={t("orbit.menu.copy")} onClick={run(() => void copyTranscriptToClipboard(markdown()))} />
          </>}
          <MenuItem icon={<Link2 size={14} />} label={t("orbit.menu.copyThreadLink")} onClick={run(() => void navigator.clipboard?.writeText(threadRefUrl({ botId: bot.id, threadId: bot.threadId })))} />
          <MenuItem icon={<ClipboardCopy size={14} />} label={t("sidebar.copyConversationId")} onClick={run(() => void navigator.clipboard?.writeText(bot.threadId))} />
          {!remoteClient && <MenuItem icon={<Bug size={14} />} label={t("chat.inspector")} onClick={run(() => dispatch({ type: "toggleInspector", open: true }))} />}
          {!remoteClient && <>
            <div className="my-1 h-px bg-ink/[0.08]" />
            <MenuItem icon={<Trash2 size={14} />} label={t("orbit.menu.delete")} danger onClick={run(() => setConfirmDelete(true))} />
          </>}
        </div>
      )}
      <ConfirmDialog
        open={confirmArchive}
        {...botConfirmCopy("archive", bot.name)}
        onCancel={() => setConfirmArchive(false)}
        onConfirm={() => {
          setConfirmArchive(false);
          // re-check against live state: the dialog may have outlived its rule
          if (!currentArchivableBot(state.bots, bot.id)) return;
          dispatch({ type: "updateBot", botId: bot.id, patch: { hidden: true } });
          orbitToast(t("orbit.archived", { name: bot.name }), () => dispatch({ type: "updateBot", botId: bot.id, patch: { hidden: false } }));
        }}
      />
      <ConfirmDialog
        open={confirmDelete}
        title={t("orbit.menu.deleteTitle", { name: bot.name })}
        body={t("orbit.menu.deleteBody")}
        confirmLabel={t("orbit.menu.deleteConfirm")}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => { setConfirmDelete(false); dispatch({ type: "deleteBot", botId: bot.id }); }}
      />
    </div>
  );
}

type ThreadTask = Task & { routineRunId?: string };

/** Pinned threads first, then the one open, then by latest message; at most
 * three chips (spec §4, #1635). "N more ▾" is the thread manager itself —
 * search, folders, rename, delete, move and pin — and + starts a thread. */
function ThreadChips({ bot }: { bot: Bot }) {
  const { dispatch } = useStore();
  const showThreads = useShowThreads();
  const tasks = orderedThreadList((bot.tasks ?? []).filter((task: ThreadTask) => !task.routineRunId && !task.archivedAt));
  // the "hide threads" preference: no chips, but work in another thread
  // (an approval, a queued job) must never be stranded
  if (!showThreads) return <BotActivityPicker bot={bot} />;
  if (tasks.length === 0) return null;
  const current = tasks.find((task) => task.threadId === bot.threadId) ?? tasks[0];
  const chips: Task[] = [];
  const add = (task?: Task) => { if (task && !chips.includes(task) && chips.length < 3) chips.push(task); };
  tasks.filter((task) => task.pinned).forEach(add);
  add(current);
  tasks.forEach(add);
  const shown = tasks.filter((task) => chips.includes(task));
  const more = tasks.length - shown.length;
  const go = (task: Task) => dispatch({ type: "switchTask", botId: bot.id, threadId: task.threadId });
  return (
    <div className="relative mt-0.5 flex flex-wrap items-center gap-1">
      {shown.map((task) => {
        const active = task.threadId === bot.threadId;
        return (
          <button key={task.threadId} type="button" data-orbit-thread={task.threadId} onClick={() => go(task)} aria-current={active}
            className={cn("flex h-6 max-w-[170px] items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium",
              active ? "bg-ink/[0.12] text-ink" : "text-ink/60 hover:bg-ink/[0.07] hover:text-ink")}>
            <span className="truncate">{task.title}</span>
            {(task.unread || task.activity === "waiting-on-you") && !active && (
              <span className={cn("size-1.5 shrink-0 rounded-full", task.activity === "waiting-on-you" ? "bg-warning" : "bg-[#ff5667]")} />
            )}
          </button>
        );
      })}
      <TaskPicker bot={bot} align="left" triggerLabel={more > 0 ? `${t("orbit.threads.more", { count: more })} ▾` : `${t("orbit.threads.all")} ▾`} />
      <button type="button" onClick={() => dispatch({ type: "newTask", botId: bot.id })} disabled={bot.busy}
        title={bot.busy ? t("task.newBusy") : t("task.new")} aria-label={t("task.newShort")}
        className="flex size-6 items-center justify-center rounded-full text-[15px] font-medium text-ink/60 hover:bg-ink/[0.08] disabled:opacity-40">
        +
      </button>
    </div>
  );
}

export function ChatHeader({ bot, messages, onFind }: { bot: Bot; messages: Message[]; onFind: () => void }) {
  const { state, dispatch } = useStore();
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const color = MAUS_COLORS[bot.color] ?? MAUS_COLORS.blue;
  const section = bot.section?.trim();
  const chief = section ? state.bots.find((b) => b.chiefOfStaff && b.section?.trim() === section && b.id !== bot.id && !b.hidden) : undefined;
  const sub = [
    bot.chiefOfStaff ? t("chat.chiefOfStaff") : bot.title,
    section,
    bot.system === "orbit" ? t("orbit.agent.scope") : chief && !bot.chiefOfStaff ? t("orbit.reportsTo", { name: chief.name }) : t("orbit.reportsToYou"),
  ].filter(Boolean).join(" · ");
  return (
    <div className="flex flex-col gap-2 px-1.5 pb-3" data-solar-chat-header={import.meta.env.VITE_JARVIS_SOLAR === 'true' || undefined}>
      <div className="relative flex items-center gap-2">
        {import.meta.env.VITE_JARVIS_SOLAR === 'true' && <BotFace bot={bot} size={42}/>}
        <button type="button" onClick={() => dispatch({ type: "toggleSettings", open: true, section: "overview", botId: bot.id })}
          title={t("chat.openProfile")} aria-label={t("chat.openProfileAria", { name: bot.name })}
          className="min-w-0 truncate text-[26px] font-semibold tracking-[-0.01em] hover:opacity-90" style={{ color }}>
          {bot.name}
        </button>
        {bot.chiefOfStaff && <Crown size={16} className="shrink-0 text-ink/70" aria-label={t("chat.chiefOfStaff")} />}
        <BotMenu bot={bot} messages={messages} onFind={onFind} />
        {bot.busy && <WorkingDots className="text-ink/55" />}
        {!bot.busy && bot.waitingForTeammates && <span role="status" className="truncate text-[12px] text-ink/55">{t("chat.teammatesWorking")}</span>}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {/* Call sits in the name row: it had a whole row to itself */}
          <CallButton bot={bot} />
          {(bot.busy || bot.waitingForTeammates) && (
            <button type="button" onClick={() => dispatch({ type: "interrupt", botId: bot.id, threadId: bot.threadId })} title={t("chat.stopTurn")}
              className="flex h-[26px] items-center gap-1.5 rounded-full border border-ink/[0.1] px-2.5 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink">
              <Square size={10} className="fill-current" /> {t("chat.stop")}
            </button>
          )}
        </div>
      </div>
      <span className="text-[13px] leading-[1.45] text-ink/55">{sub}</span>
      <div className="flex flex-wrap gap-1.5">
        {!remoteClient && <span data-tour="model"><ModelPicker key={bot.threadId} bot={bot} threadId={bot.threadId} /></span>}
        <ThreadApprovalChip bot={bot} />
        <ThreadPlaceChip bot={bot} />
      </div>
      {/* the thread chips and this thread's usage share a row */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1"><ThreadChips bot={bot} /></div>
        <div className="shrink-0"><ThreadUsageChip bot={bot} /></div>
      </div>
    </div>
  );
}
