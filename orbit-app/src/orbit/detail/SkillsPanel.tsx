// SKILLS (design: skills det). The routes and rules of the Skills settings
// section: enabling a skill that was never reviewed shows its full text
// first, removal asks, and imports land switched off for review.

import { useEffect, useState } from "react";
import { ColumnLayer } from "../ColumnLayer";
import { t } from "@/lib/i18n";
import { api, useStore, type Bot } from "@/state/store";
import { skillAuthoringEnabled } from "@/lib/feature-flags";
import { MAUS_COLORS } from "@/lib/mascot";
import { Actions, BackToChat, DetailBody, DetailHeader, DOT_WARN, List, Loading, SMALL_BUTTON, SMALL_PRIMARY, Warning } from "./primitives";
import { PANEL_ICON } from "./BotPanels";

interface ManagedSkill { name: string; description: string; enabled: boolean; source: string; warnings: string[] }
interface StagedSkill { id: string; name: string; gist: string }

const err = (cause: unknown, fallback: string) => (cause instanceof Error ? cause.message : fallback);

export function SkillsPanel({ bot, onBack }: { bot: Bot; onBack: () => void }) {
  const { state } = useStore();
  const authoring = skillAuthoringEnabled(state.config);
  const [skills, setSkills] = useState<ManagedSkill[] | null>(null);
  const [staged, setStaged] = useState<StagedSkill[]>([]);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  const [review, setReview] = useState<{ skill: ManagedSkill; text: string; enable: boolean } | null>(null);
  const [source, setSource] = useState("");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    try {
      const r = (await api(`/api/bots/${bot.id}/skills`)) as { skills?: ManagedSkill[]; staged?: StagedSkill[] };
      setSkills(r.skills ?? []);
      setStaged(r.staged ?? []);
      setError("");
    } catch (cause) { setError(err(cause, t("orbit.p.skills.loadError"))); setSkills((s) => s ?? []); }
  };
  useEffect(() => { setSkills(null); void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [bot.id]);

  const fetchText = async (skill: ManagedSkill) => {
    const r = (await api(`/api/bots/${bot.id}/skills/${encodeURIComponent(skill.name)}`)) as { text?: string };
    return r.text ?? "";
  };
  const toggle = async (skill: ManagedSkill) => {
    setWorking(skill.name);
    setError("");
    try {
      if (!skill.enabled) {
        // an import was not necessarily reviewed: its full text comes first
        const text = await fetchText(skill);
        if (!text) throw new Error(t("orbit.p.skills.unavailable"));
        setReview({ skill, text, enable: true });
        return;
      }
      await api(`/api/bots/${bot.id}/skills/${encodeURIComponent(skill.name)}`, { method: "PATCH", body: JSON.stringify({ enabled: false }) });
      await refresh();
    } catch (cause) { setError(err(cause, t("orbit.p.skills.updateError"))); } finally { setWorking(""); }
  };
  const enableReviewed = async () => {
    if (!review) return;
    setWorking(review.skill.name);
    try {
      await api(`/api/bots/${bot.id}/skills/${encodeURIComponent(review.skill.name)}`, { method: "PATCH", body: JSON.stringify({ enabled: true }) });
      setReview(null);
      await refresh();
    } catch (cause) { setError(err(cause, t("orbit.p.skills.updateError"))); } finally { setWorking(""); }
  };
  const remove = async (skill: ManagedSkill) => {
    if (!window.confirm(t("orbit.p.skills.removeConfirm", { name: skill.name }))) return;
    setWorking(skill.name);
    try {
      await api(`/api/bots/${bot.id}/skills/${encodeURIComponent(skill.name)}`, { method: "DELETE" });
      setReview(null);
      await refresh();
    } catch (cause) { setError(err(cause, t("orbit.p.skills.removeError"))); } finally { setWorking(""); }
  };
  const importSkill = async () => {
    const trimmed = source.trim();
    if (!trimmed) return;
    setImporting(true);
    setError("");
    setMessage("");
    try {
      const r = (await api(`/api/bots/${bot.id}/skills`, { method: "POST", body: JSON.stringify({ source: trimmed }) })) as { installed?: unknown[] };
      setMessage(t("orbit.p.skills.imported", { count: (r.installed ?? []).length }));
      setSource("");
      await refresh();
    } catch (cause) { setError(err(cause, t("orbit.p.skills.importError"))); } finally { setImporting(false); }
  };

  const on = (skills ?? []).filter((s) => s.enabled).length;
  return (
    <DetailBody>
      <BackToChat onClick={onBack} />
      <DetailHeader icon={PANEL_ICON.skills} color={MAUS_COLORS[bot.color]} kicker={t("orbit.sys.skills")}
        title={skills && skills.length ? t("orbit.p.skills.title", { on, total: skills.length }) : t("orbit.p.skills.none")}
        desc={t(authoring ? "orbit.p.skills.desc" : "orbit.p.skills.descOff")} />
      {error && <Warning>{error}</Warning>}
      {skills === null ? <Loading /> : (
        <List title={bot.section?.trim() ? t("orbit.p.skills.teamList", { team: bot.section.trim().toUpperCase() }) : t("orbit.p.skills.list")}
          empty={t("orbit.p.skills.empty")}
          items={skills.map((s) => ({
            key: s.name, name: s.name, meta: s.warnings[0] ?? s.description, on: s.enabled, disabled: working === s.name,
            onClick: () => void toggle(s),
          }))} />
      )}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.map((s) => (
            <button key={s.name} type="button" className={SMALL_BUTTON}
              onClick={() => void fetchText(s).then((text) => setReview({ skill: s, text, enable: false })).catch((cause) => setError(err(cause, t("orbit.p.skills.loadError"))))}>
              {t("orbit.p.skills.view", { name: s.name })}
            </button>
          ))}
        </div>
      )}
      {staged.length > 0 && (
        <List title={t("orbit.p.skills.staged")} items={staged.map((s) => ({ key: s.id, name: s.name, meta: s.gist, dot: DOT_WARN }))} />
      )}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          <input value={source} onChange={(e) => setSource(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void importSkill(); }}
            placeholder={t("orbit.p.skills.importPlaceholder")} aria-label={t("orbit.p.skills.importPlaceholder")}
            className="h-[34px] min-w-0 flex-1 rounded-[9px] border border-ink/[0.16] bg-ink/[0.04] px-2.5 font-mono text-[12.5px] text-ink outline-none" />
          <button type="button" className={SMALL_BUTTON} disabled={importing || !source.trim()} onClick={() => void importSkill()}>
            {importing ? t("orbit.p.skills.importing") : t("orbit.p.skills.import")}
          </button>
        </div>
        {message && <span role="status" className="text-[12px] text-ink/70">{message}</span>}
      </div>
      <Actions actions={[{ label: t("orbit.p.skills.library"), onClick: () => document.querySelector<HTMLButtonElement>("[data-orbit-library]")?.click() }]} />
      {review && (
        <ColumnLayer onClose={() => setReview(null)} locked={Boolean(working)} backdrop="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-6">
          <div role="dialog" aria-modal="true" aria-label={review.skill.name}
            className="flex max-h-[min(640px,100%)] w-full max-w-[560px] flex-col gap-3 rounded-[14px] border border-ink/[0.12] bg-menu p-5 shadow-[0_30px_70px_rgba(0,0,0,.6)] animate-pop-in">
            <span className="text-[16px] font-semibold">{review.skill.name}</span>
            {review.enable && <span className="text-[12.5px] leading-[1.5] text-ink/70">{t("orbit.p.skills.reviewHint")}</span>}
            <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap rounded-[10px] bg-ink/[0.04] p-3 font-mono text-[11.5px] leading-[1.55] text-ink/80">{review.text}</pre>
            <div className="flex justify-end gap-1.5">
              <button type="button" className={SMALL_BUTTON} disabled={Boolean(working)} onClick={() => void remove(review.skill)}>{t("orbit.p.skills.remove")}</button>
              <button type="button" className={SMALL_BUTTON} disabled={Boolean(working)} onClick={() => setReview(null)}>{t("common.cancel")}</button>
              {review.enable && <button type="button" className={SMALL_PRIMARY} disabled={Boolean(working)} onClick={() => void enableReviewed()}>{t("orbit.p.skills.enable")}</button>}
            </div>
          </div>
        </ColumnLayer>
      )}
    </DetailBody>
  );
}
