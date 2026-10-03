import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ColumnLayer } from "@/orbit/ColumnLayer";

import { t } from "@/lib/i18n";
import {
  describePart,
  describeSkip,
  saveShareFile,
  shareRequestBody,
  type ShareChoices,
  type ShareResponse,
} from "@/lib/team-share";
import { api } from "@/state/store";

/** What the file will hold, counted from the server's own dry run, so the
 * numbers are exactly what Save file writes. Pure, for tests. */
export function ShareTeamContents({ preview, includeMemory, localSkips }: {
  preview: ShareResponse;
  includeMemory: boolean;
  /** Parts the dialog itself left out, already worded. */
  localSkips: string[];
}) {
  const pkg = preview.document.package;
  const counts = preview.summary.counts;
  const leader = pkg.team?.leader ? pkg.agents.find((agent) => agent.key === pkg.team?.leader)?.name : undefined;
  const notes = pkg.agents.reduce((total, agent) => total + Object.keys(agent.seed?.memory ?? {}).length, 0);
  const rows: Array<[string, string]> = [
    [t("teamShare.part.bots"), `${counts.bots} · ${preview.summary.botNames.join(", ")}`],
    [t("teamShare.part.skills"), String(counts.skills)],
    [t("teamShare.part.playbooks"), String(counts.playbooks)],
    [t("teamShare.part.rooms"), String(counts.rooms)],
    [t("teamShare.part.routines"), String(counts.routines)],
    [t("teamShare.part.brief"), pkg.team?.brief ? t("teamShare.yes") : t("teamShare.none")],
    [t("teamShare.part.leader"), leader ?? t("teamShare.none")],
    [t("teamShare.part.connections"), String(counts.connections)],
    [t("teamShare.part.notes"), includeMemory ? String(notes) : t("teamShare.none")],
  ];
  const skipped = [...localSkips, ...preview.skipped.map((skip) => describeSkip(skip, preview.document))];
  return (
    <div>
      <div className="text-[12px] font-medium text-ink/55">{t("teamShare.included")}</div>
      <dl className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 rounded-xl bg-ink/[0.06] px-4 py-3 text-[12.5px]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-ink/55">{label}</dt>
            <dd className="max-w-[260px] truncate text-right text-ink" title={value}>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink/55">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-success" />
        <span>{t("teamShare.never")}</span>
      </p>
      {preview.redacted.length > 0 && (
        <div className="mt-3 rounded-xl border border-ink/[0.1] px-4 py-3 text-[12.5px] text-ink/55">
          <div className="font-medium text-ink">{t("teamShare.redacted")}</div>
          <ul className="mt-1 list-disc pl-5">
            {preview.redacted.map((part) => <li key={part}>{describePart(part, preview.document)}</li>)}
          </ul>
        </div>
      )}
      {skipped.length > 0 && (
        <div className="mt-3 rounded-xl border border-ink/[0.1] px-4 py-3 text-[12.5px] text-ink/55">
          <div className="font-medium text-ink">{t("teamShare.skipped")}</div>
          <ul className="mt-1 list-disc pl-5">
            {skipped.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Share team…: choose what goes in, see exactly what that is, save the
 * file. No confirm step; the person's click on Save file is the decision. */
export function ShareTeamDialog({ team, onClose, overlay = false }: {
  team: string;
  onClose: () => void;
  /** opened from the team library, which covers the column: stay over it */
  overlay?: boolean;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(team || t("teamLibrary.general"));
  const [tagline, setTagline] = useState("");
  const [summary, setSummary] = useState("");
  const [release, setRelease] = useState("");
  const [notes, setNotes] = useState("");
  // Owner decision: a team is shared whole, starter notes included, with a
  // plain line saying so. The person can switch them off here.
  const [includeMemory, setIncludeMemory] = useState(true);
  const [skillChoice, setSkillChoice] = useState<Set<string> | null>(null);
  const [preview, setPreview] = useState<ShareResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ShareResponse | null>(null);
  const [error, setError] = useState("");
  const request = useRef(0);

  const choices = useCallback((dryRun: boolean): ShareChoices => ({
    team,
    name,
    tagline,
    summary,
    release,
    notes,
    skills: skillChoice ? [...skillChoice] : "all",
    includeMemory,
    dryRun,
  }), [team, name, tagline, summary, release, notes, skillChoice, includeMemory]);

  // Live counts: re-run the server's dry run whenever what goes in changes.
  useEffect(() => {
    const id = ++request.current;
    const timer = window.setTimeout(() => {
      api<ShareResponse>("/api/teams/export", { method: "POST", body: JSON.stringify(shareRequestBody({ ...choices(true), release: undefined })) })
        .then((result) => {
          if (id !== request.current) return;
          setPreview(result);
          setError("");
          setRelease((current) => current || result.document.package.release);
        })
        .catch((cause) => {
          if (id === request.current) setError(cause instanceof Error ? cause.message : String(cause));
        });
    }, 250);
    return () => window.clearTimeout(timer);
    // Text fields do not change the counts; only what goes in does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillChoice, includeMemory]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await api<ShareResponse>("/api/teams/export", { method: "POST", body: JSON.stringify(shareRequestBody(choices(false))) });
      saveShareFile(result.filename, result.document);
      setSaved(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    return () => { if (opener?.isConnected) opener.focus(); };
  }, []);

  const available = preview?.choices.skills ?? [];
  const chosen = skillChoice ?? new Set(available);
  const toggleSkill = (skill: string) => {
    const next = new Set(chosen);
    if (next.has(skill)) next.delete(skill);
    else next.add(skill);
    setSkillChoice(next);
  };
  const field = "mt-1 w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13.5px] text-ink disabled:opacity-60";

  // in Orbit's column when there is one; the bare map keeps the overlay
  return (
    <ColumnLayer onClose={onClose} locked={Boolean(saving)} overlay={overlay} backdrop="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="share-team-title" tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-[14px] border border-ink/[0.1] bg-panel text-ink shadow-[0_20px_50px_rgba(0,0,0,.55)] outline-none"
        onKeyDown={(event) => {
          if (event.key === "Escape" && !saving) { event.stopPropagation(); onClose(); }
          if (event.key === "Tab") {
            const controls = dialogRef.current?.querySelectorAll<HTMLElement>("input:enabled, textarea:enabled, button:enabled");
            if (!controls?.length) return;
            const first = controls[0]!, last = controls[controls.length - 1]!;
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        }}>
        <header className="flex items-start justify-between gap-3 px-6 pb-2 pt-5">
          <div>
            <h2 id="share-team-title" className="text-[17px] font-semibold">{t("teamShare.title", { name: team || t("teamLibrary.general") })}</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{t("teamShare.intro")}</p>
          </div>
          <button aria-label={t("teamShare.close")} disabled={saving} onClick={onClose} className="rounded-lg p-1.5 text-ink/55 hover:bg-ink/[0.06]"><X size={18} /></button>
        </header>

        {saved ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-2">
            <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink"><Check size={16} className="text-success" />{t("teamShare.saved", { filename: saved.filename })}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{t("teamShare.savedHint")}</p>
            <div className="mt-4">
              <ShareTeamContents preview={saved} includeMemory={includeMemory} localSkips={[]} />
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-2">
            {preview
              ? <ShareTeamContents preview={preview} includeMemory={includeMemory} localSkips={[]} />
              : !error && <div className="flex items-center gap-2 py-6 text-[13px] text-ink/55"><Loader2 size={15} className="animate-spin" />{t("teamShare.preparing")}</div>}

            <fieldset className="mt-4 space-y-2 text-[13px]" disabled={saving}>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="size-4 accent-accent" checked={includeMemory} onChange={(event) => setIncludeMemory(event.target.checked)} />
                {t("teamShare.includeNotes")}
              </label>
              <p className="pl-6 text-[12px] leading-relaxed text-ink/55">{includeMemory ? t("teamShare.notesIncluded") : t("teamShare.notesExcluded")}</p>
              <div>
                <div className="font-medium">{t("teamShare.includeSkills")}</div>
                {preview && available.length === 0 && <p className="mt-1 text-[12px] text-ink/55">{t("teamShare.noSkills")}</p>}
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {available.map((skill) => (
                    <label key={skill} className="flex items-center gap-1.5 text-[12.5px]">
                      <input type="checkbox" className="size-3.5 accent-accent" checked={chosen.has(skill)} onChange={() => toggleSkill(skill)} />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-[12.5px] text-ink/55">{t("teamShare.name")}
                <input value={name} maxLength={100} disabled={saving} onChange={(event) => setName(event.target.value)} className={field} />
              </label>
              <label className="block text-[12.5px] text-ink/55">{t("teamShare.release")}
                <input value={release} maxLength={20} disabled={saving} placeholder="1.0.0" onChange={(event) => setRelease(event.target.value)} className={field} />
              </label>
            </div>
            <p className="mt-1 text-[11.5px] text-ink/55">{t("teamShare.releaseHint")}</p>
            <label className="mt-3 block text-[12.5px] text-ink/55">{t("teamShare.notes")}
              <textarea value={notes} maxLength={4000} rows={2} disabled={saving} onChange={(event) => setNotes(event.target.value)} className={field} />
            </label>
            <label className="mt-3 block text-[12.5px] text-ink/55">{t("teamShare.tagline")}
              <input value={tagline} maxLength={160} disabled={saving} onChange={(event) => setTagline(event.target.value)} className={field} />
            </label>
            <label className="mt-3 block text-[12.5px] text-ink/55">{t("teamShare.summary")}
              <textarea value={summary} maxLength={2000} rows={2} disabled={saving} onChange={(event) => setSummary(event.target.value)} className={field} />
            </label>
          </div>
        )}

        {error && <p role="alert" className="mx-6 mb-2 rounded-lg bg-[#ff5667]/10 px-3 py-2 text-[12.5px] text-[#ff8a96]">{error}</p>}
        <footer className="flex justify-end gap-2 border-t border-ink/[0.1] px-6 py-3">
          {saved ? (
            <button onClick={onClose} className="rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-app">{t("teamShare.done")}</button>
          ) : (
            <>
              <button disabled={saving} onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-ink/55 hover:bg-ink/[0.06]">{t("common.cancel")}</button>
              <button disabled={saving || !preview || !name.trim()} onClick={() => void save()}
                className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-app disabled:opacity-40">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? t("teamShare.saving") : t("teamShare.save")}
              </button>
            </>
          )}
        </footer>
      </div>
    </ColumnLayer>
  );
}
