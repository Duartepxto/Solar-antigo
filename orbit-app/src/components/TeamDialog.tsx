import { useEffect, useRef, useState } from "react";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import { X } from "lucide-react";
import { api, useStore, type Bot } from "@/state/store";
import { BotPickerList } from "./BotPickerList";
import { t } from "@/lib/i18n";

/** A team may start empty; choosing bots moves their membership, never copies them.
 * An existing team's dialog edits its members: ticked bots join, unticked ones leave. */
export function TeamDialog({ section, rename = false, onClose, onRenamed }: {
  section?: string;
  rename?: boolean;
  onRenamed?: (oldName: string, newName: string) => void;
  onClose: () => void;
}) {
  const { state, dispatch } = useStore();
  const [name, setName] = useState(section ?? "");
  const managing = Boolean(section) && !rename;
  const initialMembers = useRef(new Set(managing ? state.bots.filter(bot => !bot.hidden && (bot.section?.trim() ?? "") === section).map(bot => bot.id) : []));
  const [picked, setPicked] = useState<Set<string>>(() => new Set(initialMembers.current));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (dialog.current?.querySelector<HTMLElement>("input") ?? dialog.current?.querySelector<HTMLElement>("button"))?.focus();
    return () => { if (opener?.isConnected) opener.focus(); };
  }, []);
  const moving = section !== undefined && !rename;
  const title = rename ? t("team.rename") : managing ? t(initialMembers.current.size ? "team.manageBots" : "team.addBots") : moving ? t("team.moveTo", { name: section || "General" }) : t("team.create");
  // the Orbit agent is never in a team
  const candidates = state.bots.filter((bot) => !bot.hidden && bot.system !== "orbit" && (managing || !moving || (bot.section?.trim() ?? "") !== section));
  const addBotIds = [...picked].filter(id => !initialMembers.current.has(id));
  const removeBotIds = [...initialMembers.current].filter(id => !picked.has(id));
  const unchanged = managing ? !addBotIds.length && !removeBotIds.length : moving && !picked.size;
  const save = async () => {
    if (saving || (!moving && !name.trim()) || unchanged) return;
    if (section === undefined && [...(state.sections ?? []), ...state.bots.map((bot) => bot.section), ...state.groups.map((group) => group.section)].includes(name.trim())) {
      setError(t("team.duplicate"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result: { sections: string[]; bots?: Bot[] } = await api(
        rename || managing ? `/api/sidebar-sections?section=${encodeURIComponent(section!)}` : "/api/sidebar-sections",
        { method: rename ? "PATCH" : managing ? "PUT" : "POST", body: JSON.stringify(rename ? { name: name.trim() } : managing ? { addBotIds, removeBotIds } : { name: name.trim(), botIds: [...picked] }) },
      );
      dispatch({ type: "sections", sections: result.sections });
      for (const bot of result.bots ?? []) dispatch({ type: "botPatched", bot });
      if (rename && section !== undefined) onRenamed?.(section, name.trim());
      onCloseRef.current();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setSaving(false);
    }
  };
  return (
    <ColumnLayer onClose={onClose} locked={saving} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="team-dialog-title"
        className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-[14px] border border-ink/[0.1] bg-panel p-5 text-ink shadow-[0_20px_50px_rgba(0,0,0,.55)]"
        onKeyDown={(event) => {
          if (event.key === "Escape" && !saving) { event.stopPropagation(); onClose(); }
          if (event.key === "Tab") {
            const controls = dialog.current?.querySelectorAll<HTMLElement>("input:enabled, button:enabled");
            if (!controls?.length) return;
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        }}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="team-dialog-title" className="text-[17px] font-semibold">{title}</h2>
          <button aria-label={t("team.closeDialog")} disabled={saving} onClick={onClose} className="rounded-lg p-1.5 text-ink/55 hover:bg-ink/[0.06]"><X size={18} /></button>
        </div>
        {(!moving || rename) && <label className="mb-3 block text-[13px] text-ink/55">{t("team.name")}
          <input value={name} maxLength={60} disabled={saving} onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void save(); }}
            className="mt-1 w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[14px] text-ink" />
        </label>}
        {!rename && <>
          <p className="mb-3 text-[13px] leading-relaxed text-ink/55">
            {managing ? t("team.manageIntro") : moving ? t("team.moveIntro") : t("team.createIntro")} {t("team.moveWarning")}
          </p>
          <fieldset disabled={saving}>
            <legend className="mb-1 text-[12px] font-medium text-ink/55">{t("team.existingBots")}</legend>
            <BotPickerList bots={candidates} picked={picked} emptyHint={t("team.noBots")} onToggle={(id) => setPicked((previous) => {
              const next = new Set(previous);
              if (next.has(id)) next.delete(id); else next.add(id);
              return next;
            })} />
          </fieldset>
        </>}
        {error && <p role="alert" className="mt-3 text-[13px] text-[#ff8a96]">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button disabled={saving} onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06]">{t("common.cancel")}</button>
          <button disabled={saving || (!moving && !name.trim()) || unchanged} onClick={() => void save()}
            className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-app disabled:opacity-40">
            {saving ? t("team.saving") : rename ? t("folder.saveName") : managing ? t("common.save") : moving ? picked.size ? t(picked.size === 1 ? "team.moveOne" : "team.moveMany", { count: picked.size }) : t("team.moveSelected") : t("team.create")}
          </button>
        </div>
      </div>
    </ColumnLayer>
  );
}
