import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { ArrowDown, ArrowUp, CheckCheck, Folder, MoreHorizontal, Pencil, Plus, X } from "lucide-react";
import { useStore, type Bot, type BotProject } from "@/state/store";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

const FOLDER_EMOJI = ["📁", "💼", "🏠", "📬", "💡", "🚀", "🎨", "🧪", "📚", "🌱", "⭐", "🛠️"];

export function FolderIcon({ emoji, size = 13 }: { emoji?: string; size?: number }) {
  return emoji ? <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center leading-none" style={{ width: size, fontSize: size }}>{emoji}</span>
    : <Folder aria-hidden="true" size={size} className="shrink-0" />;
}

export function navigateThreadMenu(event: React.KeyboardEvent<HTMLDivElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
  const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
    : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next]?.focus();
}

export function FolderActions({ project, canMoveUp, canMoveDown, canMarkRead, saving, menu, onMenuChange, onEdit, onMove, onMarkRead }: {
  project: BotProject;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canMarkRead: boolean;
  saving: boolean;
  menu: { left: number; top: number } | null;
  onMenuChange: (menu: { left: number; top: number } | null) => void;
  onEdit: () => void;
  onMove: (direction: -1 | 1, onSaved: () => void) => void;
  onMarkRead: (onSaved: () => void) => void;
}) {
  const actionRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = () => { onMenuChange(null); actionRef.current?.focus(); };
  useEffect(() => {
    if (saving && menu) menuRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
  }, [saving, menu]);
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
    const outside = (event: MouseEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !actionRef.current?.contains(event.target)) onMenuChange(null);
    };
    window.addEventListener("mousedown", outside);
    return () => window.removeEventListener("mousedown", outside);
  }, [menu]);
  const move = (direction: -1 | 1) => onMove(direction, close);
  const position = menu && {
    left: Math.max(8, Math.min(menu.left, window.innerWidth - 228)),
    top: Math.max(8, Math.min(menu.top, window.innerHeight - 180)),
  };
  return <>
    <button ref={actionRef} type="button" aria-label={t("folder.actions", { name: project.name })} title={t("folder.actions", { name: project.name })} aria-haspopup="menu" aria-expanded={Boolean(menu)}
      onClick={(event) => { if (menu) { close(); return; } const rect = event.currentTarget.getBoundingClientRect(); onMenuChange({ left: rect.left, top: rect.bottom + 4 }); }}
      className="flex size-6 shrink-0 items-center justify-center rounded opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover/folder:opacity-100 max-md:opacity-70 touch:opacity-70"><MoreHorizontal size={13} /></button>
    {position && createPortal(<div ref={menuRef} role="menu" aria-label={t("folder.actions", { name: project.name })} aria-busy={saving || undefined} data-thread-overlay style={position}
      className="fixed z-50 w-[220px] rounded-lg border border-ink/[0.1] bg-panel p-1 shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); } else navigateThreadMenu(event); }}>
      <button type="button" role="menuitem" onClick={() => { close(); onEdit(); }} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[12px] text-ink hover:bg-ink/[0.06]"><Pencil size={12} />{t("folder.settings")}</button>
      <button type="button" role="menuitem" disabled={!canMarkRead || saving} onClick={() => onMarkRead(close)} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[12px] text-ink hover:bg-ink/[0.06] disabled:opacity-40"><CheckCheck size={12} />{t("folder.markRead")}</button>
      <button type="button" role="menuitem" disabled={!canMoveUp || saving} onClick={() => move(-1)} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[12px] text-ink hover:bg-ink/[0.06] disabled:opacity-40"><ArrowUp size={12} />{t("folder.moveUp")}</button>
      <button type="button" role="menuitem" disabled={!canMoveDown || saving} onClick={() => move(1)} className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-[12px] text-ink hover:bg-ink/[0.06] disabled:opacity-40"><ArrowDown size={12} />{t("folder.moveDown")}</button>
    </div>, document.body)}
  </>;
}

/** Folders only organize threads. The project-shaped API is retained for
 * compatibility; neither model settings nor working directories live here. */
export function BotProjectDialog({ bot, project, onClose, onCreated }: {
  bot: Bot;
  project?: BotProject;
  onClose: () => void;
  onCreated?: (project: BotProject) => void;
}) {
  const { dispatch } = useStore();
  const [name, setName] = useState(project?.name ?? "");
  const [emoji, setEmoji] = useState(project?.emoji ?? "");
  const [choosingIcon, setChoosingIcon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (saving) dialogRef.current?.focus();
    else if (error) nameRef.current?.focus();
  }, [saving, error]);
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    nameRef.current?.focus();
    return () => {
      if (opener?.isConnected) opener.focus();
      else document.querySelector<HTMLElement>(`[data-sidebar-bot-row="${CSS.escape(bot.id)}"]`)?.focus();
    };
  }, []);
  return (
    <ColumnLayer onClose={onClose} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div ref={dialogRef} data-thread-overlay role="dialog" tabIndex={-1} aria-modal="true" aria-busy={saving || undefined} aria-label={t(project ? "folder.settings" : "folder.create")}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onCloseRef.current(); }
        if (event.key !== "Tab") return;
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled])");
        if (!controls?.length) return;
        const first = controls[0]!;
        const last = controls[controls.length - 1]!;
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}
        className="max-h-[85dvh] w-full max-w-[420px] overflow-y-auto rounded-[14px] border border-ink/[0.1] bg-panel p-5 shadow-[0_20px_50px_rgba(0,0,0,.55)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-ink">{t(project ? "folder.settings" : "folder.create")}</h2>
          <button type="button" onClick={onClose} aria-label={t("folder.close")} className="rounded p-1 text-ink/55 hover:bg-ink/[0.06]"><X size={16} /></button>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || saving) return;
          setSaving(true);
          setError(null);
          const onError = (message: string) => { setSaving(false); setError(message); };
          if (project) {
            dispatch({ type: "updateProject", botId: bot.id, projectId: project.id, patch: { name: name.trim(), emoji: emoji.trim() || null }, onSaved: onClose, onError });
          } else {
            dispatch({ type: "createProject", botId: bot.id, name: name.trim(), emoji: emoji.trim() || null, onError,
              onCreated: (created) => { onCreated?.(created); onClose(); } });
          }
        }}>
          <label className="block text-[12px] text-ink/55">{t("folder.name")}
            <input ref={nameRef} value={name} maxLength={80} disabled={saving} onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] text-ink focus:border-ink/30 focus:outline-none" />
          </label>
          <button ref={iconRef} type="button" disabled={saving} aria-label={t("folder.icon")} aria-expanded={choosingIcon} onClick={() => setChoosingIcon((open) => !open)}
            className="mt-3 flex items-center gap-2 rounded-lg border border-ink/[0.1] px-2.5 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06]"><FolderIcon emoji={emoji} size={18} />{t("folder.icon")}</button>
          {choosingIcon && <div className="mt-2 rounded-lg border border-ink/[0.1] bg-ink/[0.04] p-3"
            onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setChoosingIcon(false); iconRef.current?.focus(); } }}>
            <p className="mb-2 text-[12px] text-ink/55">{t("folder.emojiHint")}</p>
            <div className="flex flex-wrap gap-1">
              <button type="button" disabled={saving} aria-label={t("folder.defaultIcon")} aria-pressed={!emoji} onClick={() => setEmoji("")} className="flex size-8 items-center justify-center rounded hover:bg-ink/[0.06] aria-pressed:bg-ink/[0.06]"><FolderIcon size={18} /></button>
              {FOLDER_EMOJI.map((icon) => <button key={icon} type="button" disabled={saving} aria-label={icon} aria-pressed={emoji === icon} onClick={() => setEmoji(icon)} className="size-8 rounded text-lg hover:bg-ink/[0.06] aria-pressed:bg-ink/[0.06]">{icon}</button>)}
            </div>
            <label className="mt-2 block text-[12px] text-ink/55">{t("folder.emoji")}
              <input value={emoji} disabled={saving} maxLength={64} onChange={(event) => setEmoji(event.target.value)} className="mt-1 w-full rounded border border-ink/[0.1] bg-panel px-2 py-1.5 text-[14px] text-ink focus:outline-none" />
            </label>
          </div>}
          <p className="mt-2 text-[12px] leading-relaxed text-ink/55">{t("folder.detail", { name: bot.name })}</p>
          {error && <p role="alert" className="mt-3 text-[12px] text-[#ff8a96]">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06]">{t("common.cancel")}</button>
            <button type="submit" disabled={!name.trim() || saving} className="rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-app disabled:opacity-40">{t(saving ? "folder.saving" : project ? "folder.save" : "folder.create")}</button>
          </div>
        </form>
        {project && <div className="mt-4 border-t border-ink/[0.1] pt-3">
          {deleting ? <>
            <p className="text-[12px] leading-relaxed text-ink/55">{t("folder.deleteBody")}</p>
            <div className="mt-2 flex items-center gap-3">
              <button type="button" disabled={saving} onClick={() => {
                setSaving(true); setError(null);
                dispatch({ type: "deleteProject", botId: bot.id, projectId: project.id, onDeleted: onClose, onError: (message) => { setSaving(false); setError(message); } });
              }} className="text-[12px] text-[#ff8a96] hover:underline disabled:opacity-40">{t("folder.deleteConfirm")}</button>
              <button type="button" onClick={() => setDeleting(false)} className="text-[12px] text-ink/55 hover:underline">{t("common.cancel")}</button>
            </div>
          </> : <button type="button" disabled={saving} onClick={() => setDeleting(true)} className="text-[12px] text-[#ff8a96] hover:underline disabled:opacity-40">{t("folder.delete")}</button>}
        </div>}
      </div>
    </ColumnLayer>
  );
}

/** One-click new thread in the current folder. Folder creation lives in the sidebar. */
export function NewThreadButton({ bot, className, compact = false, onCreated }: { bot: Bot; className?: string; compact?: boolean; onCreated?: () => void }) {
  const { dispatch } = useStore();
  const projects = bot.projects ?? [];
  const currentProject = projects.find((project) => project.id === bot.tasks?.find((task) => task.threadId === bot.threadId)?.projectId);
  return <button type="button" aria-label={t("task.newShort")} title={currentProject ? t("task.newIn", { name: currentProject.name }) : t("task.newShort")}
    onClick={() => {
      dispatch({ type: "newTask", botId: bot.id, ...(currentProject ? { projectId: currentProject.id } : {}) });
      onCreated?.();
    }}
    className={cn("flex min-w-0 items-center gap-2 rounded-lg px-2.5 text-left text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink", compact ? "py-1 @max-4xl/chathead:h-[30px] @max-4xl/chathead:px-2" : "py-2", className)}>
    <Plus aria-hidden="true" size={12} /><span className={cn("truncate", compact && "@max-4xl/chathead:hidden")}>{t("task.newShort")}</span>
  </button>;
}
