import { useLayoutEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { t } from "@/lib/i18n";

import {
  filterShortcutGroups,
  isMacPlatform,
  SHORTCUT_GROUPS,
  shortcutKeysForPlatform,
  type ShortcutItem,
} from "@/lib/keyboard-shortcuts";

/** Props for the KeyboardShortcutsModal component. */
export interface KeyboardShortcutsModalProps {
  /** Whether the dialog is currently visible. */
  open: boolean;
  /** Callback fired when the user requests closing the dialog. */
  onClose: () => void;
}

/**
 * Single shortcut row displaying its description and styled keycaps.
 */
function ShortcutRow({ item, isMac }: { item: ShortcutItem; isMac: boolean }) {
  const keys = shortcutKeysForPlatform(item, isMac);

  return (
    <div className="flex items-center gap-3 border-b border-ink/[0.07] py-2">
      <span className="flex-1 text-[13px] text-ink/80">{item.description}</span>
      <div className="flex shrink-0 items-center gap-1">
        {keys.map((key, index) => (
          <kbd key={index} className="rounded-md bg-ink/[0.08] px-2 py-0.5 font-mono text-[11.5px] font-medium text-ink">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

/**
 * A modal cheat sheet displaying all available keyboard shortcuts categorized
 * into Navigation, Chat & Composer, and Workspace Management.
 */
export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMac = isMacPlatform();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    setQuery("");
    dialog.showModal();
    inputRef.current?.focus();
    // Close before unmount so the browser restores focus to the opener.
    return () => dialog.close();
  }, [open]);

  if (!open) return null;

  const groups = filterShortcutGroups(SHORTCUT_GROUPS, query, isMac);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="shortcuts-dialog-title"
      className="m-auto w-[min(440px,calc(100%-40px))] max-h-[85vh] overflow-hidden rounded-[14px] border border-ink/[0.12] bg-panel p-0 text-ink shadow-[0_30px_70px_rgba(0,0,0,.6)] backdrop:bg-black/50"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      {/* design: keys overlay — a title, a search, and one row per shortcut */}
      <div className="flex max-h-[85vh] flex-col gap-3 px-5 py-[18px]">
        <div className="flex items-center">
          <h2 id="shortcuts-dialog-title" className="flex-1 text-[17px] font-semibold text-ink">{t("shortcuts.title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("shortcuts.close")}
            className="flex size-7 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.07] hover:text-ink">
            <X size={15} />
          </button>
        </div>
        <label className="flex items-center gap-2 rounded-[10px] border border-ink/[0.12] bg-ink/[0.04] px-3 py-1.5">
          <Search size={13} className="shrink-0 text-ink/50" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("shortcuts.search")} aria-label={t("shortcuts.search")}
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink/45 focus:outline-none" />
        </label>
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {groups.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-ink/60">{t("shortcuts.none", { query })}</div>
          ) : (
            groups.map((group) => (
              <div key={group.category} className="pb-2">
                <div className="pt-2 font-mono text-[10px] tracking-[0.1em] text-ink/50">{group.category.toUpperCase()}</div>
                {group.items.map((item) => <ShortcutRow key={item.id} item={item} isMac={isMac} />)}
              </div>
            ))
          )}
        </div>
      </div>
    </dialog>
  );
}
