// MEMORY (design: memDet). The same routes and rules as the Memory settings
// section — see docs/memory.md: the gauge names what loadMemory cuts, a save
// never overwrites what the bot wrote while you typed, and every change in
// the journal can be undone.

import { useEffect, useState } from "react";
import { t, tCount } from "@/lib/i18n";
import {
  MEMORY_INDEX, capacityStatus, deleteMemoryDoc, fetchMemoryDoc, fetchMemoryJournal, fetchMemoryOverview, fileManagerLabel, formatBytes,
  journalSource, journalSummary, openMemoryLocation, relativeTime, revertMemoryChange, saveMemoryDoc, topicFileName,
  fetchUpkeepStatus, noticedCount, tidyMemoryNow, tidySummary, topicTemplate,
  type MemoryJournalRow, type MemoryOverview, type UpkeepStatus,
} from "@/lib/memory";
import { shortPath } from "@/lib/short-path";
import { MAUS_COLORS } from "@/lib/mascot";
import { useStore, type Bot } from "@/state/store";
import { useDesktopCapabilities } from "@/components/DesktopCapabilities";
import { Actions, BackToChat, DetailBody, DetailHeader, Gauge, List, Loading, MONO_LABEL, SMALL_BUTTON, SMALL_PRIMARY, Tabs, Warning } from "./primitives";
import { PANEL_ICON } from "./BotPanels";
import { AgentTransferControls } from './AgentTransferControls';

type Tab = "file" | "topics" | "logs" | "changes";

interface Editing { path: string; text: string; hash: string; dirty: boolean; readOnly: boolean }
interface Conflict { current: string; currentHash: string }

const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** MEMORY.md as entries: one per non-heading line, bullets unwrapped. */
function entriesOf(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.replace(/^[-*+]\s+/, ""));
}

export function MemoryPanel({ bot, onBack }: { bot: Bot; onBack: () => void }) {
  const { capabilities } = useDesktopCapabilities();
  const remote = window.ogb?.remoteClient?.active === true;
  const [overview, setOverview] = useState<MemoryOverview | null>(null);
  const [journal, setJournal] = useState<MemoryJournalRow[] | null>(null);
  const [index, setIndex] = useState<{ text: string; hash: string } | null>(null);
  const [tab, setTab] = useState<Tab>("file");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [kept, setKept] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reverting, setReverting] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [upkeep, setUpkeep] = useState<UpkeepStatus | null>(null);
  const [tidying, setTidying] = useState(false);
  const { dispatch } = useStore();

  const reload = async () => {
    const [o, j, doc, u] = await Promise.all([fetchMemoryOverview(bot.id), fetchMemoryJournal(bot.id), fetchMemoryDoc(bot.id, MEMORY_INDEX), fetchUpkeepStatus(bot.id).catch(() => null)]);
    setOverview(o);
    setJournal(j);
    setUpkeep(u);
    setIndex({ text: doc.text, hash: doc.hash });
  };
  useEffect(() => {
    let cancelled = false;
    reload().catch((e) => { if (!cancelled) setError(errorText(e)); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot.id]);

  const open = async (path: string, dirtyText?: string) => {
    setError(null);
    setConflict(null);
    setKept(null);
    try {
      const doc = await fetchMemoryDoc(bot.id, path);
      setEditing({ path: doc.path, hash: doc.hash, readOnly: path.startsWith("memory/log/"), text: dirtyText ?? doc.text, dirty: dirtyText !== undefined });
    } catch (e) { setError(errorText(e)); }
  };

  const save = async (expectedHash: string | undefined) => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const result = await saveMemoryDoc(bot.id, editing.path, editing.text, expectedHash);
      if (!result.ok) { setConflict({ current: result.current, currentHash: result.currentHash }); return; }
      setConflict(null);
      setKept(null);
      setOverview(result.overview);
      if (editing.path === MEMORY_INDEX) setIndex({ text: result.doc.text, hash: result.doc.hash });
      setEditing(null);
      setJournal(await fetchMemoryJournal(bot.id));
    } catch (e) { setError(errorText(e)); } finally { setSaving(false); }
  };

  const revert = async (row: MemoryJournalRow) => {
    setReverting(row.id);
    setError(null);
    try {
      const result = await revertMemoryChange(bot.id, row.id);
      setOverview(result.overview);
      setJournal(await fetchMemoryJournal(bot.id));
      if (row.path === MEMORY_INDEX) setIndex({ text: result.text, hash: result.hash });
      setNotice(t("orbit.p.memory.reverted", { path: row.path }));
    } catch (e) { setError(errorText(e)); } finally { setReverting(null); }
  };

  const removeTopic = async (path: string, name: string) => {
    if (!window.confirm(t("orbit.p.memory.deleteConfirm", { name }))) return;
    try {
      const { overview: next } = await deleteMemoryDoc(bot.id, path);
      setOverview(next);
      setJournal(await fetchMemoryJournal(bot.id));
    } catch (e) { setError(errorText(e)); }
  };

  // upkeep is on unless the bot's switch is off
  const upkeepOn = bot.memoryUpkeep !== false;
  const toggleUpkeep = () => {
    dispatch({ type: "updateBot", botId: bot.id, patch: { memoryUpkeep: !upkeepOn } });
    setUpkeep((current) => (current ? { ...current, enabled: !upkeepOn } : current));
  };
  const tidyNow = async () => {
    setTidying(true);
    setError(null);
    setNotice(null);
    try {
      const { report, overview: next } = await tidyMemoryNow(bot.id);
      setOverview(next);
      const [j, doc, u] = await Promise.all([fetchMemoryJournal(bot.id), fetchMemoryDoc(bot.id, MEMORY_INDEX), fetchUpkeepStatus(bot.id)]);
      setJournal(j);
      setIndex({ text: doc.text, hash: doc.hash });
      setUpkeep(u);
      if (editing && !editing.dirty) await open(editing.path);
      setNotice(`${tidySummary(report)}.${report.note ? ` ${report.note}` : ""}`);
    } catch (e) { setError(errorText(e)); } finally { setTidying(false); }
  };
  const noticed = noticedCount(upkeep?.lastCapture);

  const status = overview ? capacityStatus(overview.index) : null;
  const pct = status ? Math.max(status.lineShare, status.byteShare) * 100 : 0;
  const gaugeColor = status?.level === "over" ? "#ff5667" : status?.level === "near" ? "#ff9800" : MAUS_COLORS[bot.color];
  const gaugeText = status?.level === "over" ? "#ff8a96" : status?.level === "near" ? "#ffb454" : undefined;
  const entries = index ? entriesOf(index.text) : [];

  return (
    <DetailBody>
      <BackToChat onClick={onBack} />
      <DetailHeader icon={PANEL_ICON.memory} color={MAUS_COLORS[bot.color]} kicker={t("orbit.sys.memory")} title={t("orbit.p.memory.title")} desc={t("orbit.p.memory.desc")} />
      <AgentTransferControls bot={bot} onImported={() => { void reload().catch(e => setError(errorText(e))); }} />
      {error && <Warning>{error}</Warning>}
      {notice && <span role="status" className="text-[12.5px] text-ink/70">{notice}</span>}
      {!overview ? <Loading /> : (
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Gauge pct={pct} color={gaugeColor} labelColor={gaugeText} label={status?.sentence} />
            {status?.warning && <span className="text-[12px] leading-[1.45] text-[#ff8a96]">{status.warning}</span>}
          </div>
          {!remote && (
            <div className="flex flex-col gap-1.5">
              <List title={t("orbit.p.memory.upkeep")} items={[{ key: "upkeep", name: t("orbit.p.memory.upkeepSwitch"), on: upkeepOn, onClick: toggleUpkeep }]} />
              <span className="text-[12px] leading-[1.5] text-ink/55">{t("orbit.p.memory.upkeepDesc")}</span>
              {upkeepOn && upkeep && !upkeep.modelSteps && <span className="text-[12px] leading-[1.5] text-ink/55">{t("orbit.p.memory.upkeepNoModel")}</span>}
              {upkeepOn && (
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button type="button" className={SMALL_BUTTON} disabled={tidying} onClick={() => void tidyNow()}>{tidying ? t("orbit.p.memory.tidying") : t("orbit.p.memory.tidyNow")}</button>
                  <span className="text-[12px] text-ink/55">
                    {upkeep?.lastTidy ? t("orbit.p.memory.lastTidy", { when: relativeTime(upkeep.lastTidy.at), summary: tidySummary(upkeep.lastTidy).toLowerCase() }) : t("orbit.p.memory.notTidied")}
                    {upkeep?.lastCapture && noticed ? ` ${tCount("orbit.p.memory.lastNoticed", noticed, { when: relativeTime(upkeep.lastCapture.at) })}` : ""}
                  </span>
                </div>
              )}
            </div>
          )}
          <Tabs value={tab} onSelect={(k) => { setTab(k as Tab); setEditing(null); }} tabs={[
            { key: "file", label: "MEMORY.md" },
            { key: "topics", label: t("orbit.p.memory.topics", { count: overview.topics.length }) },
            { key: "logs", label: t("orbit.p.memory.logs") },
            { key: "changes", label: t("orbit.p.memory.changes") },
          ]} />

          {editing ? (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11.5px] text-ink/60">{editing.path}</span>
              {conflict && (
                <div role="alert" className="flex flex-col gap-2 rounded-[10px] border border-[rgba(255,152,0,.4)] bg-[rgba(255,152,0,.08)] px-3 py-2.5">
                  <span className="text-[12.5px] leading-[1.45] text-[#ffb454]">{t("orbit.p.memory.conflict", { name: bot.name })}</span>
                  <div className="flex gap-1.5">
                    <button type="button" className={SMALL_BUTTON} onClick={() => { setKept(editing.text); setEditing({ ...editing, text: conflict.current, hash: conflict.currentHash, dirty: false }); setConflict(null); }}>{t("orbit.p.memory.reload")}</button>
                    <button type="button" className={SMALL_BUTTON} disabled={saving} onClick={() => void save(conflict.currentHash)}>{t("orbit.p.memory.overwrite")}</button>
                  </div>
                </div>
              )}
              <textarea value={editing.text} readOnly={editing.readOnly} spellCheck={false}
                aria-label={editing.path === MEMORY_INDEX ? t("orbit.p.memory.aria") : editing.path}
                placeholder={editing.path === MEMORY_INDEX ? t("orbit.p.memory.placeholder") : t("orbit.p.memory.topicPlaceholder")}
                onChange={(e) => setEditing({ ...editing, text: e.target.value, dirty: true })}
                className="min-h-[190px] resize-y rounded-[10px] border border-ink/[0.16] bg-ink/[0.03] px-3 py-2.5 font-mono text-[12px] leading-[1.6] text-ink outline-none" />
              {kept !== null && (
                <div className="flex flex-col gap-1">
                  <span className={MONO_LABEL}>{t("orbit.p.memory.kept")}</span>
                  <div className="whitespace-pre-wrap rounded-lg bg-ink/[0.04] px-2.5 py-2 font-mono text-[11.5px] leading-[1.55] text-ink/60">{kept}</div>
                </div>
              )}
              {editing.readOnly ? (
                <span className="text-[12px] text-ink/60">{t("orbit.p.memory.logReadOnly")}</span>
              ) : (
                <div className="flex justify-end gap-1.5">
                  <button type="button" className={SMALL_BUTTON} disabled={saving} onClick={() => { setEditing(null); setConflict(null); setKept(null); }}>{t("common.cancel")}</button>
                  <button type="button" className={SMALL_PRIMARY} disabled={saving || !editing.dirty} onClick={() => void save(editing.hash)}>{saving ? t("orbit.p.memory.saving") : t("orbit.p.memory.save")}</button>
                </div>
              )}
            </div>
          ) : tab === "file" ? (
            <div className="flex flex-col">
              {entries.map((line, i) => (
                <div key={i} className="flex flex-col gap-0.5 border-b border-ink/[0.07] py-2">
                  <span className="text-[13px] leading-[1.45]" style={{ color: overview.index.truncated && i >= overview.index.loadedLines ? "#ff8a96" : undefined }}>{line}</span>
                </div>
              ))}
              {entries.length === 0 && <span className="py-1.5 text-[13px] leading-[1.5] text-ink/60">{t("orbit.p.memory.empty")}</span>}
              <div className="flex gap-1.5 pt-2.5">
                <button type="button" className={SMALL_BUTTON} onClick={() => void open(MEMORY_INDEX)}>{t("orbit.p.memory.edit")}</button>
              </div>
            </div>
          ) : tab === "topics" ? (
            <Rows2
              rows={overview.topics.map((f) => ({ key: f.path, title: f.name, meta: `${formatBytes(f.bytes)} · ${relativeTime(f.modifiedAt)}`, btn: t("orbit.p.memory.open"), go: () => void open(f.path), extra: () => void removeTopic(f.path, f.name) }))}
              empty={t("orbit.p.memory.noTopics")}
              footer={(
                <div className="flex gap-1.5 pt-2.5">
                  <input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder={t("orbit.p.memory.newTopic")} aria-label={t("orbit.p.memory.newTopic")}
                    onKeyDown={(e) => { if (e.key === "Enter") { const name = topicFileName(newTopic); if (name) { setNewTopic(""); void open(`memory/${name}`, topicTemplate(name)); } else setError(t("orbit.p.memory.topicName")); } }}
                    className="h-7 min-w-0 flex-1 rounded-[9px] border border-ink/[0.16] bg-ink/[0.04] px-2.5 text-[12.5px] text-ink outline-none" />
                  <button type="button" className={SMALL_BUTTON} onClick={() => { const name = topicFileName(newTopic); if (name) { setNewTopic(""); void open(`memory/${name}`, topicTemplate(name)); } else setError(t("orbit.p.memory.topicName")); }}>{t("orbit.p.memory.addTopic")}</button>
                </div>
              )} />
          ) : tab === "logs" ? (
            <Rows2
              rows={overview.logs.map((f) => ({ key: f.path, title: f.name.replace(/\.md$/, ""), meta: `${formatBytes(f.bytes)} · ${relativeTime(f.modifiedAt)}`, btn: t("orbit.p.memory.read"), go: () => void open(f.path) }))}
              empty={t("orbit.p.memory.noLogs")} />
          ) : (
            <Rows2
              rows={(journal ?? []).map((row) => ({
                key: row.id, title: journalSummary(row, bot.name),
                meta: [relativeTime(row.at), journalSource(row)].filter(Boolean).join(" · "),
                sub: row.diff ? row.diff.split("\n").slice(0, 4).join("\n") : undefined,
                btn: row.canRevert ? (reverting === row.id ? t("orbit.p.memory.undoing") : t("orbit.p.memory.undo")) : undefined,
                note: row.canRevert ? undefined : row.revertUnavailableReason,
                go: row.canRevert ? () => void revert(row) : undefined,
              }))}
              empty={journal === null ? t("orbit.panel.loading") : t("orbit.p.memory.noChanges")} />
          )}

          {!remote && (
            <div className="flex flex-col gap-1.5">
              <span className="truncate font-mono text-[11.5px] text-ink/50" title={overview.workspacePath}>{shortPath(overview.workspacePath, capabilities.host.homeDir)}</span>
              <Actions actions={[
                { label: t("orbit.p.memory.obsidian"), onClick: () => void openMemoryLocation(bot.id, "obsidian").catch((e) => setError(errorText(e))) },
                { label: fileManagerLabel(capabilities.host.platform), onClick: () => void openMemoryLocation(bot.id, "folder").catch((e) => setError(errorText(e))) },
              ]} />
            </div>
          )}
        </div>
      )}
    </DetailBody>
  );
}

function Rows2({ rows, empty, footer }: {
  rows: Array<{ key: string; title: string; meta?: string; sub?: string; btn?: string; note?: string; go?: () => void; extra?: () => void }>;
  empty: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {rows.map((r) => (
        <div key={r.key} className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[13px] leading-[1.45] text-ink/90">{r.title}</span>
            {r.meta && <span className="text-[11px] text-ink/50">{r.meta}</span>}
            {r.sub && <span className="whitespace-pre-wrap font-mono text-[11.5px] leading-[1.5] text-ink/60">{r.sub}</span>}
          </div>
          {r.btn && r.go && <button type="button" className={SMALL_BUTTON} onClick={r.go}>{r.btn}</button>}
          {r.extra && <button type="button" className={SMALL_BUTTON} onClick={r.extra} aria-label={t("orbit.p.memory.delete")}>×</button>}
          {r.note && <span className="max-w-[120px] text-right text-[11px] leading-[1.4] text-ink/50">{r.note}</span>}
        </div>
      ))}
      {rows.length === 0 && <span className="py-1.5 text-[13px] leading-[1.5] text-ink/60">{empty}</span>}
      {footer}
    </div>
  );
}
