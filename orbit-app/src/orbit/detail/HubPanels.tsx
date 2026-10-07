// Hub panels (design: hubDet). The You hub summarises each app-settings area
// from real state and keeps the full section one click away ("All …
// settings"); the team hub edits the team's own records.

import { cn } from "@/lib/cn";
import { SolarAppearance } from '../SolarAppearance';
import { useEffect, useMemo, useState } from "react";
import { Blocks, CalendarClock, CalendarDays, Cpu, Crown, FileText, Gauge as GaugeIcon, HardDrive, Hash, KeyRound, Library, Monitor, Palette, ScrollText, SlidersHorizontal, Smartphone, Users, Webhook, type LucideIcon } from "lucide-react";
import { api, deleteTeam, useStore, type AppSettingsSection, type Bot } from "@/state/store";
import { t, tCount } from "@/lib/i18n";
import { brand } from "@/lib/brand";
import { localeChoiceCode, localeChoices } from "@/locales";
import { effectiveLanguage, languageChoice, useLanguageChoice } from "@/lib/language-preference";
import "../solar-settings.css";
import { TeamDialog } from "@/components/TeamDialog";
import { ShareTeamDialog } from "@/components/ShareTeamDialog";
import { NewChannelDialog } from "@/components/NewChannelDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { orbitNavigate } from "../events";
import { MAUS_COLORS } from "@/lib/mascot";
import { SKINS, applySkin, readSkin, type SkinId } from "@/lib/skins";
import { botUsage, formatTokens, formatUsd, hasFiniteCost } from "@/lib/usage";
import { routineNextLabel, routineRunLabel } from "@/lib/routine-display";
import { isRoutineProblemRun } from "../../../shared/routines";
import type { TeamComputer, TeamComputersPayload } from "../../../shared/team-computer";
import { useAppSettingsSections, AppSettingsSectionContent } from "@/components/SettingsModal";
import { engineStatus } from "@/components/ModelPicker";
import { CanvasComputers } from "@/components/CanvasComputers";
import { Actions, DetailBody, DetailHeader, Warning, DOT_ACCENT, DOT_OFF, DOT_ON, DOT_WARN, Gauge, List, MONO_LABEL, Rows, Seg, SMALL_PRIMARY } from "./primitives";
import { OrbitFace } from "../OrbitFace";
import type { OrbitTeam } from "../model";

export type YouHubKey = "engines" | "connections" | "apps" | "remote" | "usage" | "calendar" | "library" | "appearance" | "people" | "workspaces" | "system";
export type TeamHubKey = "instructions" | "tcomputer" | "chief" | "members" | "channels" | "troutines";

export const YOU_HUB: Array<{ key: YouHubKey; label: string; icon: LucideIcon; section?: AppSettingsSection }> = [
  { key: "engines", label: "orbit.hub.engines", icon: Cpu, section: "engines" },
  { key: "connections", label: "orbit.hub.keys", icon: KeyRound, section: "connections" },
  // the app catalog and MCP servers, for every bot (a bot's own Apps system
  // picks which of them it may use)
  { key: "apps", label: "orbit.hub.apps", icon: Blocks },
  { key: "remote", label: "orbit.hub.remote", icon: Smartphone, section: "companion" },
  { key: "usage", label: "orbit.hub.usage", icon: GaugeIcon, section: "usage" },
  { key: "calendar", label: "orbit.hub.calendar", icon: CalendarDays },
  { key: "library", label: "orbit.hub.library", icon: Library },
  { key: "appearance", label: "orbit.hub.appearance", icon: Palette, section: "appearance" },
  { key: "people", label: "orbit.hub.people", icon: Users, section: "people" },
  { key: "workspaces", label: "orbit.hub.workspaces", icon: HardDrive, section: "backups" },
  { key: "system", label: "orbit.hub.system", icon: SlidersHorizontal, section: "general" },
];

export const TEAM_HUB: Array<{ key: TeamHubKey; label: string; icon: LucideIcon }> = [
  { key: "instructions", label: "orbit.sys.instructions", icon: ScrollText },
  { key: "tcomputer", label: "orbit.hub.teamComputer", icon: Monitor },
  { key: "chief", label: "orbit.sys.chief", icon: Crown },
  { key: "members", label: "orbit.sys.members", icon: Users },
  { key: "channels", label: "orbit.sys.channels", icon: Hash },
  { key: "troutines", label: "orbit.sys.routines", icon: CalendarClock },
];

export function HubHeader({ name, color, sub, menu }: { name: string; color?: string; sub: string; menu?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-1.5 pb-1">
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[26px] font-semibold tracking-[-0.01em]" style={{ color }}>{name}</span>
        {menu}
      </span>
      <span className="text-[13px] leading-[1.45] text-ink/60">{sub}</span>
    </div>
  );
}

/** A team's ⋯ menu, beside its name as on a bot: add bots, rename, share,
 * delete. (Upstream's sidebar team menu had all four.) */
export function TeamMenu({ teamKey, memberCount, onRenamed, onDelete }: {
  teamKey: string;
  memberCount: number;
  onRenamed: (oldName: string, newName: string) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<"move" | "rename" | null>(null);
  const [sharing, setSharing] = useState(false);
  const item = (label: string, onClick: () => void, danger = false) => (
    <button type="button" role="menuitem" onClick={() => { setOpen(false); onClick(); }}
      className={cn("rounded-lg px-3 py-2 text-left text-[13px] hover:bg-ink/[0.06]", danger ? "text-[#ff8a96]" : "text-ink")}>{label}</button>
  );
  return (
    <span className="relative">
      <button type="button" aria-label={t("orbit.team.menu")} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className="flex size-7 items-center justify-center rounded-full text-[16px] font-semibold leading-none text-ink/70 hover:bg-ink/[0.07]">⋯</button>
      {open && <>
        <span className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
        <span role="menu" className="absolute left-0 top-full z-40 mt-1 flex w-[200px] flex-col rounded-xl border border-ink/[0.1] bg-panel p-1 shadow-[0_20px_50px_rgba(0,0,0,.55)]">
          {item(t("orbit.hub.p.addBots"), () => setDialog("move"))}
          {item(t("orbit.team.rename"), () => setDialog("rename"))}
          {memberCount > 0 && item(t("team.share"), () => setSharing(true))}
          <span className="my-1 h-px bg-ink/[0.08]" />
          {item(t("orbit.team.delete"), onDelete, true)}
        </span>
      </>}
      {dialog && <TeamDialog section={teamKey} rename={dialog === "rename"} onRenamed={onRenamed} onClose={() => setDialog(null)} />}
      {sharing && <ShareTeamDialog team={teamKey} onClose={() => setSharing(false)} />}
    </span>
  );
}

/** Deleting a team, confirmed in its column. The person chooses what happens
 * to its bots and channels: moved to General with their history, or deleted. */
export function TeamDeletePanel({ team, onCancel, onDeleted }: { team: OrbitTeam; onCancel: () => void; onDeleted: () => void }) {
  const { state } = useStore();
  const bots = state.bots.filter((b) => (b.section?.trim() || "") === team.key);
  const archived = bots.filter((b) => b.hidden).length;
  const groups = state.groups.filter((g) => (g.section?.trim() || "") === team.key);
  const generalHasChief = state.bots.some((b) => b.chiefOfStaff && !(b.section?.trim()));
  const hasMembers = bots.length > 0 || groups.length > 0;
  const [keep, setKeep] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteTeam(team.key, bots, groups.map((g) => g.id), undefined, { keep: keep || !hasMembers, generalHasChief });
      onDeleted();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setBusy(false);
    }
  };
  const parts = [
    bots.length ? tCount("orbit.team.deleteBots", bots.length) + (archived ? ` ${t("orbit.team.deleteArchived", { count: archived })}` : "") : "",
    groups.length ? tCount("orbit.team.deleteChannels", groups.length) : "",
  ].filter(Boolean);
  const choice = (on: boolean, value: boolean, label: string, desc: string) => (
    <button type="button" role="radio" aria-checked={on} onClick={() => setKeep(value)} disabled={busy}
      className={cn("flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left", on ? "bg-ink/[0.08]" : "hover:bg-ink/[0.05]")}>
      <span className={cn("mt-[3px] grid size-3.5 shrink-0 place-items-center rounded-full border", on ? "border-ink" : "border-ink/40")}>
        {on && <span className="size-1.5 rounded-full bg-ink" />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="text-[12px] leading-[1.45] text-ink/55">{desc}</span>
      </span>
    </button>
  );
  return (
    <div role="alertdialog" aria-label={t("orbit.team.deleteTitle", { name: team.name })} className="mx-1.5 flex flex-col gap-3 rounded-[14px] border border-[#ff5667]/40 bg-[#ff5667]/[0.06] p-4">
      <span className="text-[14px] font-semibold text-ink">{t("orbit.team.deleteTitle", { name: team.name })}</span>
      {hasMembers ? (
        <div role="radiogroup" aria-label={t("orbit.team.deleteChoice")} className="flex flex-col gap-1">
          {choice(keep, true, t("orbit.team.deleteKeep"), t("orbit.team.deleteKeepDesc", { things: parts.join(t("orbit.team.and")) }))}
          {choice(!keep, false, t("orbit.team.deleteAll"), t("orbit.team.deleteWith", { things: parts.join(t("orbit.team.and")) }))}
        </div>
      ) : (
        <span className="text-[12.5px] leading-[1.5] text-ink/70">{t("orbit.team.deleteEmpty")}</span>
      )}
      {error && <span className="text-[12px] text-[#ff8a96]">{error}</span>}
      <span className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={busy} className="h-8 rounded-full px-3.5 text-[12.5px] text-ink/70 hover:bg-ink/[0.06] disabled:opacity-40">{t("common.cancel")}</button>
        <button type="button" onClick={() => void run()} disabled={busy} className="h-8 rounded-full bg-[#ff5667] px-3.5 text-[12.5px] font-semibold text-white hover:brightness-110 disabled:opacity-60">
          {busy ? t("orbit.team.deleting") : keep || !hasMembers ? t("orbit.team.deleteConfirm") : t("orbit.team.deleteAllConfirm")}
        </button>
      </span>
    </div>
  );
}

/** The panel's action opens the full settings section inline, where the
 * named task (adding an engine, a key, a budget…) lives. */
const INLINE_SECTIONS = new Set<YouHubKey>(["remote", "people", "workspaces"]);

function MoreSettings({ section, label }: { section: AppSettingsSection; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Actions actions={[{ label: open ? t("orbit.hub.lessSettings") : label, onClick: () => setOpen((v) => !v) }]} />
      {open && <div className="orbit-settings flex flex-col gap-4"><AppSettingsSectionContent section={section} /></div>}
    </div>
  );
}

/** The value and status each You-hub system shows around You. */
export function youHubValue(key: YouHubKey, state: ReturnType<typeof useStore>["state"], phone?: { pairedCount: number; label: string }): [string, string] {
  switch (key) {
    case "engines": {
      const ready = state.instances.filter((i) => i.snapshot.state === "available" && i.snapshot.authenticated !== false).length;
      return [tCount("orbit.hub.v.engines", state.instances.length), t("orbit.hub.v.signedIn", { count: ready })];
    }
    case "connections": {
      const c = state.config;
      const n = [c?.anthropic?.configured, c?.xai?.configured, c?.openaiCompat?.configured, c?.box?.configured, c?.opencodeGo?.configured, c?.tts?.configured].filter(Boolean).length;
      return [t("orbit.hub.v.keys", { count: n }), t("orbit.hub.v.writeOnly")];
    }
    case "apps": return [t("orbit.hub.v.appsExplore"), t("orbit.hub.v.appsAndMcp")];
    case "remote": return phone?.pairedCount ? [tCount("orbit.hub.v.pairedDevices", phone.pairedCount), phone.label] : [t("orbit.hub.v.devices"), phone?.label ?? t("orbit.hub.v.pair")];
    case "usage": {
      const spent = state.bots.reduce((sum, b) => sum + (botUsage(b).costUsd ?? 0), 0);
      const budget = state.config?.budgets?.monthlyUsd;
      return [budget ? t("orbit.hub.v.spendOf", { spent: formatUsd(spent), budget: formatUsd(budget) }) : formatUsd(spent), budget ? t("orbit.hub.v.pct", { pct: Math.round((spent / budget) * 100) }) : t("orbit.hub.v.allTime")];
    }
    case "calendar": {
      const next = state.routines.find((r) => r.enabled);
      return [tCount("orbit.hub.v.routines", state.routines.length), next ? routineNextLabel(next) : t("orbit.hub.v.addFromBot")];
    }
    case "library": return [t("orbit.val.install"), t("orbit.hub.v.fromMarkdown")];
    case "appearance": return [SKINS.find((s) => s.id === readSkin())?.name ?? "Midnight", t("orbit.hub.v.skins", { count: SKINS.length })];
    case "people": return [state.config?.profile?.name || t("orbit.hub.v.justYou"), t("orbit.hub.v.owner")];
    case "workspaces": return [t("orbit.hub.v.workspace"), t("orbit.hub.v.backups")];
    case "system": return [t("orbit.hub.v.system"), languageLabel(effectiveLanguage(languageChoice(), state.config?.language))];
  }
}

export function YouHubPanel({ panel, openLibrary, focusBot }: { panel: YouHubKey; openLibrary: () => void; focusBot: (id: string) => void }) {
  const { state, dispatch } = useStore();
  const meta = YOU_HUB.find((h) => h.key === panel)!;
  const head = (title: string, desc: string) => <DetailHeader icon={meta.icon} kicker={t(meta.label as never)} title={title} desc={desc} />;
  const [skin, setSkin] = useState<SkinId>(readSkin);
  const [calFilter, setCalFilter] = useState<"all" | "problems" | "active">("all");
  // the language this device shows (its own pick, else the server default)
  const language = effectiveLanguage(useLanguageChoice(), state.config?.language);
  const hubSections = new Set(YOU_HUB.map((h) => h.section).filter(Boolean));
  const otherSections = useAppSettingsSections().filter((entry) => !hubSections.has(entry.id));
  const body = (() => {
    switch (panel) {
      case "engines":
        return <>
          {head(t("orbit.hub.p.engines"), t("orbit.hub.p.enginesDesc"))}
          <List title={t("orbit.hub.p.installed")} empty={t("orbit.hub.p.noEngines")} items={state.instances.map((i) => {
            const ready = i.snapshot.state === "available" && i.snapshot.authenticated !== false;
            return { key: i.instanceId, name: i.displayName, meta: engineStatus(i), dot: ready ? DOT_ON : i.snapshot.state === "available" ? DOT_WARN : DOT_OFF,
              onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "engines" }) };
          })} />
        </>;
      case "connections": {
        const c = state.config;
        const row = (key: string, name: string, on: boolean | undefined) => ({ key, name, meta: on ? t("orbit.hub.p.configured") : t("orbit.hub.p.notSet"), dot: on ? DOT_ON : DOT_OFF, onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "connections" }) });
        return <>
          {head(t("orbit.hub.p.keys"), t("orbit.hub.p.keysDesc"))}
          <List title={t("orbit.hub.p.credentials")} items={[
            row("anthropic", "Anthropic", c?.anthropic?.configured), row("openai", "OpenAI-compatible", c?.openaiCompat?.configured), row("xai", "xAI", c?.xai?.configured),
            row("box", "Box", c?.box?.configured), row("vps", "VPS", c?.vps?.configured), row("opencode", "OpenCode Go", c?.opencodeGo?.configured),
            row("tts", t("orbit.hub.p.voices"), c?.tts?.configured),
          ]} />
        </>;
      }
      case "apps":
        return <>
          {head(t("orbit.hub.p.apps"), t("orbit.hub.p.appsDesc"))}
          <Actions actions={[
            { label: t("orbit.hub.p.browseApps"), onClick: () => dispatch({ type: "togglePlugins", open: true, surface: "apps" }) },
            { label: t("orbit.hub.p.mcpServers"), onClick: () => dispatch({ type: "togglePlugins", open: true, surface: "mcp" }) },
          ]} />
        </>;
      case "remote":
        return head(t("orbit.hub.p.remote"), t("orbit.hub.p.remoteDesc"));
      case "usage": {
        const rows = state.bots.map((b) => ({ b, u: botUsage(b) })).filter((x) => x.u.turns > 0).sort((a, b) => (b.u.costUsd ?? 0) - (a.u.costUsd ?? 0) || (b.u.input + b.u.output) - (a.u.input + a.u.output));
        const spent = rows.reduce((s, x) => s + (x.u.costUsd ?? 0), 0);
        const budget = state.config?.budgets?.monthlyUsd;
        const warn = state.config?.budgets?.warnAtPercent;
        return <>
          {head(t("orbit.hub.p.usage"), t("orbit.hub.p.usageDesc"))}
          {budget ? <Gauge pct={(spent / budget) * 100} color={import.meta.env.VITE_JARVIS_SOLAR === "true" ? "var(--color-accent)" : MAUS_COLORS.blue} label={t("orbit.hub.p.budget", { spent: formatUsd(spent), budget: formatUsd(budget), warn: warn ?? 80 })} /> : null}
          <List title={t("orbit.hub.p.byBot")} empty={t("orbit.p.usage.none")} items={rows.map(({ b, u }) => ({
            key: b.id, name: b.name, dot: MAUS_COLORS[b.color], onClick: () => focusBot(b.id),
            meta: `${hasFiniteCost(u.costUsd) ? formatUsd(u.costUsd ?? 0) : "—"} · ${formatTokens(u.input + u.output)} ${t("orbit.hub.p.tokens")}`,
          }))} />
        </>;
      }
      case "calendar": {
        const runs = [...state.routineRuns].sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0)).filter((r) =>
          calFilter === "all" ? true : calFilter === "problems" ? isRoutineProblemRun(r) : r.status === "running" || r.status === "queued").slice(0, 12);
        const calendarUp = state.activeView === "routines";
        const calSection = state.routinesFocus.section ?? "schedule";
        return <>
          {head(t("orbit.hub.p.calendar"), t("orbit.hub.p.calendarDesc"))}
          {/* on the canvas the column drives the calendar: which of its views */}
          {calendarUp && <Seg label={t("calendar.viewLabel")} value={calSection} onSelect={(k) => dispatch({ type: "showRoutines", section: k as "schedule" | "logs" | "webhooks" })} options={[
            { key: "schedule", label: t("calendar.tab.schedule"), icon: CalendarDays }, { key: "logs", label: t("routines.logs"), icon: FileText }, { key: "webhooks", label: t("calendar.tab.webhooks"), icon: Webhook },
          ]} />}
          <Seg label={t("orbit.hub.p.show")} value={calFilter} onSelect={(k) => setCalFilter(k as typeof calFilter)} options={[
            { key: "all", label: t("orbit.hub.p.all"), icon: ScrollText }, { key: "problems", label: t("orbit.hub.p.problems"), icon: CalendarClock }, { key: "active", label: t("orbit.hub.p.active"), icon: Cpu },
          ]} />
          <List title={t("orbit.hub.p.runs")} empty={t("orbit.hub.p.noRuns")} items={runs.map((r) => {
            const bot = state.bots.find((b) => b.id === r.botId);
            return { key: r.id, name: `${r.routineName}${bot ? ` · ${bot.name}` : ""}`, meta: routineRunLabel(r), dot: isRoutineProblemRun(r) ? "#ff5667" : r.status === "running" ? DOT_ACCENT : r.status === "queued" ? DOT_WARN : DOT_ON,
              onClick: () => dispatch({ type: "showRoutines", section: "logs", routineId: r.routineId, botId: r.botId }) };
          })} />
          {calendarUp ? <>
            {/* the calendar is on the canvas: its bots wait here to be dragged onto a time */}
            <div className="flex flex-col gap-1">
              <span className={MONO_LABEL}>{t("calendar.bots")}</span>
              {state.bots.filter((b) => !b.hidden).map((b) => (
                <div key={b.id} draggable title={t("calendar.dragBot", { name: b.name })} aria-label={t("calendar.dragBot", { name: b.name })}
                  onDragStart={(event) => { event.dataTransfer.effectAllowed = "copy"; event.dataTransfer.setData("application/x-orbit-bot", b.id); event.dataTransfer.setData("text/plain", b.id); }}
                  className="flex cursor-grab items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-ink/[0.05] active:cursor-grabbing">
                  <OrbitFace id={b.id} size={24} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink/90">{b.name}</span>
                  <span className="text-[12px] text-ink/40">{t("calendar.drag")}</span>
                </div>
              ))}
            </div>
          </> : <Actions actions={[{ label: t("orbit.hub.p.openCalendar"), onClick: () => dispatch({ type: "showRoutines", view: "calendar" }) }]} />}
        </>;
      }
      case "library":
        return <>
          {head(t("orbit.hub.p.library"), t("orbit.hub.p.libraryDesc"))}
          <Actions actions={[{ label: t("orbit.hub.p.install"), onClick: openLibrary }]} />
        </>;
      case "appearance":
        if(import.meta.env.VITE_JARVIS_SOLAR==='true')return <>{head(t("orbit.hub.p.appearance"),t("jarvis.solar.preference.background"))}<SolarAppearance/></>;
        return <>
          {head(t("orbit.hub.p.appearance"), t("orbit.hub.p.appearanceDesc"))}
          <List title={t("orbit.hub.p.skins")} items={SKINS.map((s) => ({ key: s.id, name: s.name, meta: s.id === skin ? t("orbit.p.engine.inUse") : s.tagline, dot: s.id === skin ? DOT_ACCENT : DOT_OFF, onClick: () => { applySkin(s.id); setSkin(s.id); } }))} />
        </>;
      case "people":
        return head(t("orbit.hub.p.people"), t("orbit.hub.p.peopleDesc"));
      case "workspaces":
        return head(t("orbit.hub.p.workspaces"), t("orbit.hub.p.workspacesDesc"));
      case "system":
        return <>
          {head(t("orbit.hub.p.system"), t("orbit.hub.p.systemDesc"))}
          <Rows rows={[
            { k: t("orbit.hub.p.threadsAtOnce"), v: t("orbit.hub.p.perBot", { count: state.config?.threads?.maxConcurrentPerBot ?? 1 }) },
            { k: t("orbit.hub.p.language"), v: languageLabel(language) },
            { k: t("orbit.hub.p.shortcuts"), v: "⌘K · ⌘N · Esc" },
          ]} />
          <Actions actions={[
            { label: t("orbit.hub.p.shortcutsAll"), onClick: () => dispatch({ type: "toggleShortcuts", open: true }) },
            { label: t("orbit.hub.p.replay"), onClick: () => dispatch({ type: "toggleWelcome", open: true }) },
            { label: t("orbit.pal.about", { app: brand().name }), onClick: () => orbitNavigate({ to: "about" }) },
          ]} />
          {/* every settings section that has no system of its own around You */}
          {otherSections.length > 0 && (
            <List title={t("orbit.hub.p.allSettings")} items={otherSections.map((entry) => ({
              key: entry.id, name: t(entry.labelKey), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: entry.id }),
            }))} />
          )}
        </>;
    }
  })();
  return (
    <DetailBody>
      {body}
      {/* a system that is only a header shows its whole section; the others
          open it with a toggle named for the section, not one action in it */}
      {meta.section && (INLINE_SECTIONS.has(panel)
        ? <div className="orbit-settings flex flex-col gap-4"><AppSettingsSectionContent section={meta.section} /></div>
        : <MoreSettings key={panel} section={meta.section} label={t(`orbit.hub.a.${panel}` as never)} />)}
    </DetailBody>
  );
}

export function teamHubValue(key: TeamHubKey, team: OrbitTeam, state: ReturnType<typeof useStore>["state"], computer?: TeamComputer | null, instructions?: string | null): [string, string] {
  const members = team.memberIds.map((id) => state.bots.find((b) => b.id === id)).filter(Boolean) as Bot[];
  const ids = new Set(team.memberIds);
  const channels = state.groups.filter((g) => !g.dm && g.memberIds.some((id) => ids.has(id)));
  const routines = state.routines.filter((r) => ids.has(r.botId));
  const chief = team.chiefId ? state.bots.find((b) => b.id === team.chiefId) : null;
  switch (key) {
    case "instructions": {
      const lines = instructions?.trim() ? instructions.trim().split("\n").length : 0;
      return instructions == null ? [t("team.instructions"), t("orbit.hub.v.shared")] : lines ? [tCount("orbit.hub.v.lines", lines), t("orbit.hub.v.shared")] : [t("orbit.hub.v.empty"), t("orbit.hub.v.addFacts")];
    }
    case "tcomputer": return [computer?.name ?? t("orbit.hub.v.noComputer"), computer ? computer.state : t("orbit.hub.v.assign")];
    case "chief": return [chief?.name ?? t("orbit.val.chiefNone"), chief ? t(`approvalMode.${chief.approvalMode ?? "ask"}.chip` as never) : t("orbit.reportsToYou")];
    case "members": return [tCount("orbit.val.members", members.length), members.slice(0, 3).map((b) => b.name).join(", ")];
    case "channels": return [tCount("orbit.val.channels", channels.length), channels[0] ? (channels[0].name.startsWith("#") ? channels[0].name : `#${channels[0].name}`) : t("orbit.hub.v.noneYet")];
    case "troutines": return [tCount("orbit.val.routines", routines.length), routines.find((r) => r.enabled) ? routineNextLabel(routines.find((r) => r.enabled)!) : t("orbit.hub.v.noneYet")];
  }
}

export function useTeamComputers(enabled: boolean) {
  const [computers, setComputers] = useState<TeamComputer[]>([]);
  useEffect(() => {
    if (!enabled || window.ogb?.remoteClient?.active) return;
    let cancelled = false;
    void api("/api/team-computers").then((r: TeamComputersPayload) => { if (!cancelled) setComputers(r.computers ?? []); }).catch(() => {});
    return () => { cancelled = true; };
  }, [enabled]);
  return [computers, setComputers] as const;
}

export function TeamHubPanel({ team, panel, focusBot, openChannel, computers, onComputers, onInstructions, onNewBot, onRenamed }: {
  team: OrbitTeam; panel: TeamHubKey; focusBot: (id: string) => void; openChannel: (id: string) => void;
  computers: TeamComputer[]; onComputers: (c: TeamComputer[]) => void; onInstructions: (text: string) => void;
  /** a new bot that joins this team */
  onNewBot: (section: string | null) => void;
  /** the team now goes by another name, so the hub follows it */
  onRenamed: (oldName: string, newName: string) => void;
}) {
  const { state, dispatch } = useStore();
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const [teamDialog, setTeamDialog] = useState<"move" | "rename" | null>(null);
  const [newChannel, setNewChannel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [teamError, setTeamError] = useState("");
  const deleteTeam = async () => {
    setTeamError("");
    try {
      const result: { sections: string[] } = await api(`/api/sidebar-sections?section=${encodeURIComponent(team.key)}`, { method: "DELETE" });
      dispatch({ type: "sections", sections: result.sections });
    } catch (cause) { setTeamError(cause instanceof Error ? cause.message : String(cause)); }
  };
  const meta = TEAM_HUB.find((h) => h.key === panel)!;
  const members = team.memberIds.map((id) => state.bots.find((b) => b.id === id)).filter(Boolean) as Bot[];
  const ids = new Set(team.memberIds);
  const channels = state.groups.filter((g) => !g.dm && g.memberIds.some((id) => ids.has(id)));
  const routines = state.routines.filter((r) => ids.has(r.botId));
  const name = team.loose ? t("orbit.noTeam") : team.name;
  const head = (title: string, desc: string) => <DetailHeader icon={meta.icon} color={team.color} kicker={t(meta.label as never)} title={title} desc={desc} />;
  const [computersOpen, setComputersOpen] = useState(false);
  const computer = computers.find((c) => c.section === team.key) ?? null;
  const body = (() => {
    switch (panel) {
      case "instructions":
        return <>{head(t("orbit.hub.p.instructions", { team: name }), t("orbit.hub.p.instructionsDesc", { team: name }))}<TeamInstructions section={team.key} onSaved={onInstructions} /></>;
      case "tcomputer":
        return <>
          {head(computer?.name ?? t("orbit.hub.v.noComputer"), t("orbit.hub.p.teamComputerDesc"))}
          {computer && <Rows rows={[{ k: t("orbit.hub.p.state"), v: computer.state }, { k: t("orbit.hub.p.usedBy"), v: members.map((b) => b.name).join(", ") }]} />}
          <Actions actions={[{ label: t("orbit.hub.p.manageComputers"), onClick: () => setComputersOpen(true) }]} />
          {/* every named team, so a computer can be assigned (or moved) anywhere */}
          {computersOpen && <CanvasComputers open createRequest={0} drop={null}
            sections={[...new Set([...(state.sections ?? []), ...state.bots.filter((b) => !b.hidden).map((b) => b.section?.trim() || ""), ...state.groups.map((g) => g.section?.trim() || "")])].filter(Boolean).map((key) => ({ key, name: key }))}
            onClose={() => setComputersOpen(false)} onDropHandled={() => {}} onChange={onComputers} />}
        </>;
      case "chief": {
        const chief = team.chiefId ? state.bots.find((b) => b.id === team.chiefId) : null;
        return <>
          {head(chief ? t("orbit.teamChief", { name: chief.name }) : t("orbit.hub.p.noChief"), t("orbit.hub.p.chiefDesc"))}
          <List title={t("orbit.hub.p.makeChief")} items={members.map((b) => ({
            key: b.id, name: b.name, dot: MAUS_COLORS[b.color], meta: b.id === team.chiefId ? t("orbit.hub.p.currentChief") : b.title,
            onClick: b.id === team.chiefId ? undefined : () => dispatch({ type: "updateBot", botId: b.id, patch: { chiefOfStaff: true } }),
          }))} />
          {chief && <Actions actions={[{ label: t("orbit.team.removeChief", { name: chief.name }), onClick: () => dispatch({ type: "updateBot", botId: chief.id, patch: { chiefOfStaff: false } }) }]} />}
        </>;
      }
      case "members":
        return <>
          {head(tCount("orbit.val.members", members.length), t("orbit.hub.p.membersDesc"))}
          <List title={t("orbit.hub.members").toUpperCase()} empty={t("orbit.hub.noMembers")} items={members.map((b) => ({
            key: b.id, name: b.name, dot: MAUS_COLORS[b.color], onClick: () => focusBot(b.id),
            meta: `${b.chiefOfStaff ? t("chat.chiefOfStaff") : b.title || "—"} · ${t(`approvalMode.${b.approvalMode ?? "ask"}.chip` as never)}`,
          }))} />
          {teamError && <Warning>{teamError}</Warning>}
          <Actions actions={[
            !remoteClient && { label: t("orbit.empty.newBot"), onClick: () => onNewBot(team.loose ? null : team.key) },
            !team.loose && { label: t("orbit.hub.p.addBots"), onClick: () => setTeamDialog("move") },
            !team.loose && { label: t("team.renameAria", { name }), onClick: () => setTeamDialog("rename") },
            members.length > 0 && { label: t("team.share"), onClick: () => setSharing(true) },
            // the server deletes only an empty team
            !team.loose && members.length === 0 && { label: t("team.deleteAria", { name }), onClick: () => setConfirmDelete(true) },
          ]} />
          {teamDialog && <TeamDialog section={team.key} rename={teamDialog === "rename"} onRenamed={onRenamed} onClose={() => setTeamDialog(null)} />}
          {sharing && <ShareTeamDialog team={team.key} onClose={() => setSharing(false)} />}
          <ConfirmDialog open={confirmDelete} title={t("team.deleteTitle", { name })} body={t("team.deleteDescription")}
            confirmLabel={t("team.delete")} tone="danger" onCancel={() => setConfirmDelete(false)}
            onConfirm={() => { setConfirmDelete(false); void deleteTeam(); }} />
        </>;
      case "channels":
        return <>
          {head(t("orbit.hub.channels"), t("orbit.hub.p.channelsDesc"))}
          <List title={t("orbit.hub.channels").toUpperCase()} empty={t("orbit.hub.noChannels")} items={channels.map((g) => ({
            key: g.id, name: g.name.startsWith("#") ? g.name : `#${g.name}`, dot: team.color, onClick: () => openChannel(g.id),
            meta: g.defaultResponder.kind === "everyone" ? t("orbit.hub.p.everyone") : g.defaultResponder.kind === "mentions" ? t("orbit.hub.p.mentions") : t("orbit.hub.p.lead"),
          }))} />
          {!remoteClient && <Actions actions={[{ label: t("orbit.hub.p.newChannel"), onClick: () => setNewChannel(true) }]} />}
          {newChannel && <NewChannelDialog initialSection={team.key} initialMembers={members.map((b) => b.id)} onClose={() => setNewChannel(false)} />}
        </>;
      case "troutines":
        return <>
          {head(t("orbit.hub.p.teamRoutines", { team: name }), t("orbit.hub.p.teamRoutinesDesc"))}
          <List title={t("orbit.p.routines.schedule")} empty={t("orbit.p.routines.none")} items={routines.map((r) => ({
            key: r.id, name: r.name, meta: routineNextLabel(r), on: r.enabled, onClick: () => dispatch({ type: "updateRoutine", routineId: r.id, patch: { enabled: !r.enabled } }),
          }))} />
          <Actions actions={[{ label: t("orbit.hub.p.openCalendar"), onClick: () => dispatch({ type: "showRoutines", view: "calendar" }) }]} />
        </>;
    }
  })();
  return <DetailBody>{body}</DetailBody>;
}

interface SectionContext { text: string; updatedAt: number | null; maxBytes: number }

/** Team instructions inline, the same route and 24,000-byte cap as the Team
 * map's editor. */
function TeamInstructions({ section, onSaved }: { section: string; onSaved: (text: string) => void }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState("");
  const [maxBytes, setMaxBytes] = useState(24_000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bytes = useMemo(() => new TextEncoder().encode(text).byteLength, [text]);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void api(`/api/section-context?section=${encodeURIComponent(section)}`).then((r: SectionContext) => {
      if (cancelled) return;
      setText(r.text); setSaved(r.text); setMaxBytes(r.maxBytes);
    }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [section]);
  const save = async () => {
    if (bytes > maxBytes) return;
    setSaving(true);
    setError(null);
    try {
      const r: SectionContext = await api(`/api/section-context?section=${encodeURIComponent(section)}`, { method: "PUT", body: JSON.stringify({ text }) });
      setText(r.text); setSaved(r.text); setMaxBytes(r.maxBytes); onSaved(r.text);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setSaving(false); }
  };
  return (
    <div className="flex flex-col gap-1.5">
      <textarea value={text} disabled={loading} onChange={(e) => setText(e.target.value)} aria-label={t("team.instructionsTitle", { name: section })}
        placeholder={"Goals\n- …\n\nDecisions\n- …\n\nPreferences\n- …"}
        className="min-h-[190px] resize-y rounded-[10px] border border-ink/10 bg-ink/[0.04] px-3 py-2.5 font-mono text-[12.5px] leading-[1.6] text-ink/90 outline-none" />
      <span className="flex justify-between gap-2.5 text-[11.5px] text-ink/50">
        <span>{t("orbit.hub.p.instructionsHint")}</span>
        <span className={bytes > maxBytes ? "whitespace-nowrap text-[#ff8a96]" : "whitespace-nowrap"}>{bytes.toLocaleString()} / {maxBytes.toLocaleString()} {t("orbit.hub.p.bytes")}</span>
      </span>
      {error && <span className="text-[12px] text-[#ff8a96]">{error}</span>}
      {text !== saved && (
        <div className="flex justify-end"><button type="button" className={SMALL_PRIMARY} disabled={saving || bytes > maxBytes} onClick={() => void save()}>{saving ? t("orbit.p.memory.saving") : t("team.instructionsSave")}</button></div>
      )}
    </div>
  );
}

/** The team's shared instructions text, for the value shown around the team
 * (null until loaded, or where the route is unavailable). */
export function useTeamInstructionsText(section: string | null) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    setText(null);
    if (section == null) return;
    let cancelled = false;
    void api(`/api/section-context?section=${encodeURIComponent(section)}`).then((r: SectionContext) => { if (!cancelled) setText(r.text); }).catch(() => {});
    return () => { cancelled = true; };
  }, [section]);
  return [text, setText] as const;
}

/** "Deutsch", not "de": the picker's own label for the saved code. */
function languageLabel(code: string | undefined): string {
  if (!code) return t("orbit.hub.v.systemLanguage");
  const choice = localeChoiceCode(code);
  return localeChoices.find((c) => c.code === choice)?.label ?? code;
}
