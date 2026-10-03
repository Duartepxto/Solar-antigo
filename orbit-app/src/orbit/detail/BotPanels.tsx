// The zoomed-in bot view's detail panels (design: detVals). Each replaces the
// transcript under the bot's header. Behaviour — busy locks, the Full access
// and local-computer warnings, the switch-to-Ask confirm, the server's own
// reasons — is the existing settings sections'; only the presentation is new.

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppWindow, BarChart3, Blocks, Box, Brain, CalendarClock, Circle, CircleOff, Cloud, Code, Cpu, Feather, HardDrive, History, Laptop, LayoutDashboard, Mic, Monitor, Server, ShieldCheck, ShieldHalf, ShieldQuestion, Smartphone, Sparkles, UserRoundPen, WandSparkles, Zap, type LucideIcon } from "lucide-react";
import { api, currentTaskBot, useStore, type Bot, type InstanceInfo } from "@/state/store";
import { t } from "@/lib/i18n";
import type { LocaleKey } from "@/locales";
import { approvalModeFor, modelSwitchNeedsAsk, type ApprovalMode } from "../../../shared/approval-mode";
import { suggestedModels } from "@/lib/custom-models";
import { configuredModelInstances } from "@/lib/engine-rail";
import { mcpServersForBot, useMcpServers } from "@/lib/mcp-servers";
import { requestNotificationPermission } from "@/lib/notify";
import { botUsage, costCaption, formatTokens, formatUsd, hasFiniteCost } from "@/lib/usage";
import { routineNextLabel } from "@/lib/routine-display";
import { isRoutineProblemRun } from "../../../shared/routines";
import type { HistoryRow } from "@/components/bot-settings/HistorySection";
import { MAUS_COLORS } from "@/lib/mascot";
import { ManagedTeamsSettings } from "@/components/bot-settings/ManagedTeamsSettings";
import { useBotSettingsDerived } from "@/components/bot-settings/useBotSettingsDerived";
import { effortLabel, engineStatus, modelSelectionForPick } from "@/components/ModelPicker";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FullAccessWarning } from "@/components/FullAccessWarning";
import { LocalComputerAutoWarning } from "@/components/LocalComputerAutoWarning";
import { CommandAllowlistDialog } from "@/components/CommandAllowlistDialog";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { VoiceSettings } from "@/components/VoiceSettings";
import {
  Actions, BackToChat, ChipRow, DetailBody, DetailHeader, DOT_ACCENT, DOT_OFF, DOT_ON, DOT_WARN, List, Rows, ScreenTile, Seg, Warning,
} from "./primitives";

/** The panels a bot's systems open. */
export type BotPanelKey =
  | "engine" | "computer" | "browser" | "phone" | "apps" | "approvals" | "skills" | "memory" | "routines" | "voice"
  | "profile" | "overview" | "usage" | "history";

export const PANEL_ICON: Record<BotPanelKey, LucideIcon> = {
  engine: Cpu, computer: Monitor, browser: AppWindow, phone: Smartphone, apps: Blocks, approvals: ShieldCheck,
  skills: Sparkles, memory: Brain, routines: CalendarClock, voice: Mic, profile: UserRoundPen, overview: LayoutDashboard, usage: BarChart3, history: History,
};

export const PANEL_KICKER: Record<BotPanelKey, LocaleKey> = {
  engine: "orbit.sys.engine", computer: "orbit.sys.computer", browser: "orbit.sys.browser", phone: "orbit.sys.phone",
  apps: "orbit.sys.apps", approvals: "orbit.sys.approvals", skills: "orbit.sys.skills", memory: "orbit.sys.memory",
  routines: "orbit.sys.routines", voice: "orbit.sys.voice", profile: "orbit.sys.profile", overview: "orbit.p.overview.kicker", usage: "orbit.sys.botUsage",
  history: "orbit.sys.history",
};

/** A settings request from anywhere in the app lands on the matching panel. */
export function panelForSection(section: string): BotPanelKey {
  switch (section) {
    case "model": return "engine";
    case "access": return "computer";
    case "apps": return "apps";
    case "permissions": return "approvals";
    case "skills": return "skills";
    case "memory": return "memory";
    case "routines": return "routines";
    case "voice": return "voice";
    case "history": return "history";
    case "usage": return "usage";
    case "overview": return "overview";
    default: return "profile";
  }
}

export interface PanelProps {
  bot: Bot;
  onBack: () => void;
  open: (panel: BotPanelKey) => void;
}

function Frame({ bot, panel, title, desc, onBack, children }: { bot: Bot; panel: BotPanelKey; title: React.ReactNode; desc?: React.ReactNode; onBack: () => void; children?: React.ReactNode }) {
  // the guided tour points at these two panels as a whole (design: [data-detail])
  const tour = panel === "apps" ? "apps-panel" : panel === "routines" ? "automations-page" : undefined;
  return (
    <DetailBody tour={tour}>
      <BackToChat onClick={onBack} />
      <DetailHeader icon={PANEL_ICON[panel]} color={MAUS_COLORS[bot.color]} kicker={t(PANEL_KICKER[panel])} title={title} desc={desc} />
      {children}
    </DetailBody>
  );
}

// ---- ENGINE ------------------------------------------------------------

function modelIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (/opus|pro\b|large|o3|reason/.test(l)) return Brain;
  if (/haiku|mini|flash|lite|nano|small/.test(l)) return Feather;
  if (/code|coder|codex/.test(l)) return Code;
  if (/grok|fast|turbo/.test(l)) return Zap;
  if (/local|gguf|qwen3-|llama|gemma/.test(l)) return HardDrive;
  return Sparkles;
}

export function EnginePanel({ bot: profile, onBack }: PanelProps) {
  const { state, dispatch, refreshInstances, refreshModels } = useStore();
  const bot = currentTaskBot(profile);
  const selection = profile.modelSelection;
  const engine = state.instances.find((i) => i.instanceId === selection.instanceId);
  const [pending, setPending] = useState<{ instance: InstanceInfo; model: string; name: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const busy = Boolean(profile.busy);
  const official = engine?.models.options.filter((o) => !o.custom) ?? [];
  const models = engine ? suggestedModels(official.length ? official : engine.models.options, engine.models.default, selection.model, 6) : [];
  const levels = engine?.capabilities?.effortLevels ?? [];
  const label = (id: string) => engine?.models.options.find((o) => o.id === id)?.label ?? id;

  // The same rule as the model picker in Settings: the bot default moves,
  // and the selected idle thread with it; a provider switch that would
  // leave a trusted level on a new engine asks first.
  const pick = (instance: InstanceInfo, model: string) => {
    if (busy || instance.policy) return;
    const next = modelSelectionForPick(selection, instance, model);
    const targets = [currentTaskBot(profile, profile.threadId), profile];
    if (targets.some((target) => modelSwitchNeedsAsk(approvalModeFor(target), state.instances.find((c) => c.instanceId === target.modelSelection.instanceId)?.driverKind, instance.driverKind))) {
      setPending({ instance, model, name: instance.models.options.find((o) => o.id === model)?.label ?? model });
      return;
    }
    dispatch({ type: "setModel", botId: profile.id, threadId: profile.threadId, updateBotDefault: true, selection: next });
  };
  const refresh = () => {
    if (refreshing || !engine) return;
    setRefreshing(true);
    void refreshInstances().then(() => refreshModels(engine.instanceId)).catch(() => {}).finally(() => setRefreshing(false));
  };
  const engines = configuredModelInstances(state.instances);
  return (
    <Frame bot={bot} panel="engine" onBack={onBack}
      title={engine ? `${engine.displayName} · ${label(selection.model)}` : selection.model}
      desc={t("orbit.p.engine.desc")}>
      {models.length > 0 && engine && (
        <Seg label={t("orbit.p.engine.model")} cols={Math.min(3, models.length)} value={selection.model}
          options={models.map((o) => ({ key: o.id, label: o.label, icon: modelIcon(o.label), disabled: busy }))}
          onSelect={(id) => pick(engine, id)}
          note={busy ? t("model.busy") : models.length > 1 ? undefined : t("orbit.p.engine.oneModel", { engine: engine.displayName })}
          noteTone={busy ? "warning" : "muted"} />
      )}
      <ChipRow label={levels.length ? t("orbit.p.engine.effort") : t("orbit.p.engine.effortNone")}
        chips={[undefined, ...levels].map((level) => ({
          label: level ? effortLabel(level) : t("orbit.p.engine.effortDefault"),
          active: selection.effort === level,
          disabled: !levels.length || busy,
          onClick: () => dispatch({ type: "setModel", botId: profile.id, updateBotDefault: true, selection: { ...selection, effort: level } }),
        }))} />
      <Rows rows={[
        { k: t("orbit.p.engine.driver"), v: engine?.driverKind ?? "—" },
        { k: t("orbit.p.engine.coordination"), v: engine?.capabilities?.agentsMcp ? t("orbit.p.engine.supported") : t("orbit.p.engine.chatOnly") },
      ]} />
      <List title={t("orbit.p.engine.switch")} items={[
        ...engines.map((inst) => {
          const inUse = inst.instanceId === selection.instanceId;
          const ready = inst.snapshot.state === "available" && inst.snapshot.authenticated !== false;
          return {
            key: inst.instanceId, name: inst.displayName,
            meta: inUse ? t("orbit.p.engine.inUse") : inst.policy ? inst.policy.reason : engineStatus(inst) || t("orbit.p.engine.ready"),
            dot: inUse ? DOT_ACCENT : ready ? DOT_ON : DOT_WARN,
            disabled: busy || Boolean(inst.policy),
            onClick: inUse ? undefined : () => pick(inst, inst.models.default),
          };
        }),
        { key: "custom", name: t("orbit.p.engine.custom"), meta: t("orbit.p.engine.customMeta"), dot: DOT_OFF, onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "engines" }) },
      ]} />
      <Actions actions={[
        engine && { label: refreshing ? t("orbit.p.engine.refreshing") : t("orbit.p.engine.refresh", { engine: engine.displayName }), onClick: refresh, disabled: refreshing },
        { label: t("orbit.p.engine.settings"), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "engines" }) },
      ]} />
      <ConfirmDialog
        open={pending !== null}
        title={t("model.providerSwitch.title")}
        body={t("model.providerSwitch.botBody", { model: pending?.name ?? "" })}
        tone="neutral"
        confirmLabel={t("model.providerSwitch.confirm")}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending && !profile.busy) {
            dispatch({ type: "setModel", botId: profile.id, threadId: profile.threadId, updateBotDefault: true, resetApprovalToAsk: true,
              selection: modelSelectionForPick(selection, pending.instance, pending.model) });
          }
          setPending(null);
        }}
      />
    </Frame>
  );
}

// ---- COMPUTER ----------------------------------------------------------

type Works = "auto" | "cloud" | "vm" | "local" | "browser" | "off";

export function ComputerPanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const derived = useBotSettingsDerived(bot);
  const { patch, localSelectable, localDisabledReason, browserSelectable, browserDisabledReason, canUseVps } = derived;
  const [localAutoWarning, setLocalAutoWarning] = useState(false);
  const [folderDraft, setFolderDraft] = useState<string | null>(null);
  const works: Works = bot.computer ?? "auto";
  const hasScreen = works === "cloud" || works === "vm" || works === "local";
  const live = Boolean(bot.busy) && hasScreen;
  const choose = (mode: Works) => {
    const next = mode === "auto" ? null : mode;
    if ((next === null && bot.computer === undefined) || next === bot.computer) return;
    if (mode === "local" && derived.approvalMode === "auto") setLocalAutoWarning(true);
    else if (mode === "browser") patch({ computer: mode, browser: true });
    else patch({ computer: next });
  };
  const screen = state.screens[bot.id];
  const task = bot.tasks?.find((tk) => tk.threadId === bot.threadId);
  const openComputer = () => { dispatch({ type: "select", id: bot.id }); dispatch({ type: "toggleComputer", open: true }); };
  const opts: Array<[Works, LocaleKey, LucideIcon]> = [
    ["auto", "orbit.p.computer.auto", WandSparkles], ["cloud", "orbit.p.computer.cloud", Cloud], ["vm", "orbit.p.computer.vm", Box],
    ["local", "orbit.p.computer.local", Laptop], ["browser", "orbit.p.computer.browser", AppWindow], ["off", "orbit.p.computer.off", CircleOff],
  ];
  return (
    <Frame bot={bot} panel="computer" onBack={onBack} title={t(placeTitle(works))} desc={t(`orbit.p.computer.desc.${works}` as LocaleKey)}>
      <Seg tour="seg" label={t("orbit.p.computer.worksOn")} cols={3} value={works}
        options={opts.map(([k, l, ic]) => ({
          key: k, label: t(l), icon: ic,
          disabled: (k === "local" && !localSelectable) || (k === "browser" && !browserSelectable),
          title: k === "local" && !localSelectable ? localDisabledReason ?? undefined : k === "browser" && !browserSelectable ? browserDisabledReason : undefined,
        }))}
        onSelect={(k) => choose(k as Works)}
        note={works === "local" && derived.approvalMode === "auto" ? t("orbit.p.computer.localAuto") : undefined} noteTone="warning" />
      {/* which cloud Auto or Cloud uses, and whether Auto may start the VPS
          itself (upstream's Access section had both) */}
      {(works === "auto" || works === "cloud") && (
        <Seg label={t("orbit.p.computer.cloudBackend")} cols={2} value={bot.cloudBackend ?? "box"}
          options={[
            { key: "box", label: t("orbit.p.computer.boatBackend"), icon: Cloud },
            { key: "vps", label: t("orbit.p.computer.vps"), icon: Server, disabled: !canUseVps, title: canUseVps ? undefined : t("orbit.p.computer.vpsUnsupported") },
          ]}
          onSelect={(k) => patch({ cloudBackend: k as "box" | "vps" })}
          note={works === "auto" ? t("orbit.p.computer.autoCloudNote") : undefined} noteTone="muted" />
      )}
      {works === "auto" && bot.cloudBackend === "vps" && (
        <List title={t("orbit.p.computer.vpsTitle")} items={[{ key: "autostart", name: t("orbit.p.computer.autoStartVps"), meta: t("orbit.p.computer.autoStartVpsDesc"),
          on: Boolean(bot.autoStartVps), onClick: () => patch({ autoStartVps: !bot.autoStartVps }) }]} />
      )}
      {hasScreen && (
        <ScreenTile label={t("orbit.p.computer.openScreen")} live={live} liveText={live ? t("orbit.p.computer.live") : t("orbit.p.computer.asleep")} onOpen={openComputer}>
          {screen && <img src={`data:${screen.mime};base64,${screen.png}`} alt="" className="absolute inset-0 size-full object-cover" />}
        </ScreenTile>
      )}
      <Rows rows={[
        { k: t("orbit.p.computer.folder"), v: bot.cwd ? <span className="font-mono text-[12px]">{bot.cwd}</span> : t("orbit.p.computer.privateFolder") },
        ...(task?.cwd && task.cwd !== bot.cwd ? [{ k: t("orbit.p.computer.pinned"), v: <span className="font-mono text-[12px]">{task.cwd}</span> }] : []),
        { k: t("orbit.p.computer.provider"), v: works === "cloud" || works === "auto" ? (bot.cloudBackend === "vps" ? t("orbit.p.computer.vps") : t("orbit.p.computer.boatBackend")) : t(`orbit.p.computer.provider.${works}` as LocaleKey) },
        { k: t("orbit.p.computer.routines"), v: String(state.routines.filter((r) => r.botId === bot.id && r.enabled).length) },
      ]} />
      <Actions actions={[
        hasScreen && { label: works === "local" ? t("orbit.p.computer.takeControl") : works === "vm" ? t("orbit.p.computer.openVm") : t("orbit.p.computer.openDesktop"), onClick: openComputer },
        // the whole Computer panel (its tabs, files, browser) opens for any mode
        !hasScreen && { label: t("orbit.p.computer.openPanel"), onClick: openComputer },
        window.ogb?.pickFolder && { label: t("orbit.p.computer.chooseFolder"), onClick: () => void window.ogb?.pickFolder?.(bot.cwd).then((cwd) => cwd && api(`/api/bots/${bot.id}`, { method: "PATCH", body: JSON.stringify({ cwd }) }).catch((e) => dispatch({ type: "error", message: e instanceof Error ? e.message : String(e) }))) },
        Boolean(bot.cwd) && { label: t("orbit.p.computer.clearFolder"), onClick: () => { void api(`/api/bots/${bot.id}`, { method: "PATCH", body: JSON.stringify({ cwd: null }) })
          .then(({ bot: saved }) => dispatch({ type: "botPatched", bot: saved }))
          .catch((e) => dispatch({ type: "error", message: e instanceof Error ? e.message : String(e) })); } },
      ]} />
      {!window.ogb?.pickFolder && (
        <form className="flex items-center gap-2" onSubmit={(event) => {
          event.preventDefault();
          const cwd = (folderDraft ?? bot.cwd ?? "").trim() || null;
          void api(`/api/bots/${bot.id}`, { method: "PATCH", body: JSON.stringify({ cwd }) })
            .then(({ bot: saved }) => { dispatch({ type: "botPatched", bot: saved }); setFolderDraft(null); })
            .catch((e) => dispatch({ type: "error", message: e instanceof Error ? e.message : String(e) }));
        }}>
          <input aria-label={t("orbit.p.computer.folder")} placeholder={t("orbit.p.computer.folderPlaceholder")}
            value={folderDraft ?? bot.cwd ?? ""} onChange={(event) => setFolderDraft(event.target.value)}
            className="h-[34px] min-w-0 flex-1 rounded-lg border border-ink/[0.12] bg-ink/[0.05] px-2.5 font-mono text-[12.5px] text-ink outline-none placeholder:text-ink/40 focus:border-ink/30" />
          <button type="submit" disabled={folderDraft === null} className="h-[34px] shrink-0 rounded-full bg-ink px-3.5 text-[12.5px] font-semibold text-app disabled:opacity-40">{t("common.save")}</button>
        </form>
      )}
      <LocalComputerAutoWarning
        open={localAutoWarning}
        onCancel={() => setLocalAutoWarning(false)}
        onConfirm={() => { setLocalAutoWarning(false); dispatch({ type: "updateBot", botId: bot.id, patch: { computer: "local", acknowledgeLocalAuto: true } }); }}
      />
    </Frame>
  );
}

function placeTitle(works: Works): LocaleKey {
  return `orbit.p.computer.title.${works}` as LocaleKey;
}

// ---- BROWSER -----------------------------------------------------------

export function BrowserPanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const browserInstallable = state.config?.browserEngine?.installable === true;
  const derived = useBotSettingsDerived(bot);
  const { patch, desktopBrowser, browserFeature, canUseBrowser, browserEnabled, browserAllowed } = derived;
  const on = browserEnabled && bot.computer !== "off";
  // an engine that can still be installed does not block opting in: the
  // Computer panel offers the install once the bot has a browser
  const blocked = bot.computer === "off" || (!browserEnabled && ((!desktopBrowser && !browserInstallable) || !browserFeature || !canUseBrowser));
  const reason = bot.computer === "off" ? t("orbit.p.browser.computerOff")
    : !desktopBrowser && !browserInstallable ? t("browser.noEngine")
    : !browserFeature ? t("orbit.p.browser.featureOff")
    : !canUseBrowser ? t("orbit.p.browser.engineCant") : "";
  return (
    <Frame bot={bot} panel="browser" onBack={onBack} title={on ? t("orbit.p.browser.titleOn") : t("orbit.p.browser.titleOff")} desc={t("orbit.p.browser.desc")}>
      {on && <ScreenTile label={t("orbit.p.browser.viewport")} live={Boolean(bot.busy)} liveText={bot.busy ? t("orbit.p.browser.browsing") : t("orbit.p.browser.idle")}
        onOpen={() => { dispatch({ type: "select", id: bot.id }); dispatch({ type: "toggleComputer", open: true }); }} />}
      <Rows rows={[
        { k: t("orbit.p.browser.profile"), v: bot.browserProfile ?? t("orbit.p.browser.ownProfile") },
      ]} />
      <List title={t("orbit.p.browser.access")} items={[
        { key: "builtin", name: t("orbit.p.browser.builtin"), label: t("orbit.p.browser.builtinLabel"), meta: reason, on, disabled: blocked && !on, onClick: () => patch({ browser: !browserAllowed }) },
      ]} />
      <Actions actions={[
        { label: t("orbit.p.browser.profiles"), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "experimental" }) },
      ]} />
    </Frame>
  );
}

// ---- PHONE -------------------------------------------------------------

export function PhonePanelDetail({ bot, onBack }: PanelProps) {
  const { dispatch } = useStore();
  return (
    <Frame bot={bot} panel="phone" onBack={onBack} title={t("orbit.p.phone.title")} desc={t("orbit.p.phone.desc")}>
      <Actions actions={[
        { label: t("orbit.p.phone.android"), onClick: () => { dispatch({ type: "select", id: bot.id }); dispatch({ type: "toggleComputer", open: true }); } },
        { label: t("orbit.p.phone.pair"), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "companion" }) },
      ]} />
    </Frame>
  );
}

// ---- APPS & MCP --------------------------------------------------------

export function AppsPanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const derived = useBotSettingsDerived(bot);
  const { patch } = derived;
  const { servers, error, refresh } = useMcpServers();
  const mounted = new Set((servers ? mcpServersForBot(servers, bot.mcpServers) : []).map((s) => s.name));
  const usesAll = bot.mcpServers == null;
  const toggleMcp = (name: string) => {
    if (!servers || bot.busy || error) return;
    const current = usesAll ? servers.filter((s) => s.enabled).map((s) => s.name) : [...(bot.mcpServers ?? [])];
    patch({ mcpServers: current.includes(name) ? current.filter((n) => n !== name) : [...current, name] });
  };
  const webhooks = state.webhooks.filter((w) => w.botId === bot.id);
  return (
    <Frame bot={bot} panel="apps" onBack={onBack}
      title={t("orbit.p.apps.titleMcp", { mcp: mounted.size })}
      desc={t("orbit.p.apps.desc")}>
      <List title={t("orbit.p.apps.mcp")} empty={servers === null ? (error ? t("botAccess.mcpRefreshError") : t("mcp.loading")) : t("botAccess.mcpEmpty")}
        items={(servers ?? []).map((s) => ({
          key: s.name, name: <span className="font-mono text-[12.5px]">{s.name}</span>,
          meta: !s.enabled ? t("botAccess.mcpDisabled") : undefined,
          on: mounted.has(s.name), disabled: !s.enabled || Boolean(bot.busy) || error,
          label: t("botAccess.mcpAllow", { name: s.name }),
          onClick: () => toggleMcp(s.name),
        }))} />
      {bot.busy && <span className="text-[12px] text-ink/60">{t("botAccess.mcpBusy")}</span>}
      {webhooks.length > 0 && (
        <List title={t("orbit.p.apps.webhooks")} items={webhooks.map((w) => ({
          key: w.id, name: w.name, dot: w.enabled ? DOT_ON : DOT_OFF,
          meta: t("orbit.p.apps.deliveries", { count: w.deliveryCount ?? 0 }),
        }))} />
      )}
      <Actions actions={[
        { label: t("orbit.p.apps.browse"), onClick: () => dispatch({ type: "togglePlugins", open: true, surface: "apps" }) },
        { label: t("botAccess.mcpAdd"), onClick: () => dispatch({ type: "togglePlugins", open: true, surface: "mcp" }) },
        !usesAll && servers && servers.length > 0 && { label: t("botAccess.mcpUseAll"), onClick: () => { if (!bot.busy && !error) patch({ mcpServers: null }); }, disabled: Boolean(bot.busy) || error },
        error && { label: t("connectors.action.retry"), onClick: () => void refresh() },
      ]} />
    </Frame>
  );
}

// ---- APPROVALS ---------------------------------------------------------

const LEVEL_ICON: Record<ApprovalMode, LucideIcon> = { ask: ShieldQuestion, edits: ShieldHalf, auto: WandSparkles, full: ShieldCheck, custom: Circle };

export function ApprovalsPanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const derived = useBotSettingsDerived(bot);
  const { patch, engine, canCoordinate, approvalMode, trustedModesAvailable, sectionName, currentChief } = derived;
  const [localAuto, setLocalAuto] = useState(false);
  const [fullTarget, setFullTarget] = useState(false);
  const [allThreads, setAllThreads] = useState(true);
  const [allowlistOpen, setAllowlistOpen] = useState(false);
  const ownerOrAdmin = useOwnerOrAdmin();
  const modes = useMemo(() => {
    const list: ApprovalMode[] = ["ask", "edits", "auto", "full"];
    return approvalMode === "custom" ? [...list, "custom" as const] : list;
  }, [approvalMode]);
  const setMode = (mode: ApprovalMode) => {
    if (bot.busy || mode === approvalMode) return;
    if (mode === "full") {
      if (!trustedModesAvailable) return;
      setAllThreads(true);
      setFullTarget(true);
      return;
    }
    if (mode === "auto" && bot.computer === "local") { setLocalAuto(true); return; }
    patch({ approvalMode: mode });
  };
  const section = bot.section?.trim() || "";
  const chiefOfTeam = state.bots.find((b) => b.chiefOfStaff && (b.section?.trim() || "") === section && b.id !== bot.id);
  const alwaysAllow = bot.alwaysAllow ?? [];
  const note = [
    t(`approvalMode.${approvalMode}.desc` as LocaleKey),
    bot.chiefOfStaff && approvalMode === "full" ? t("orbit.p.approvals.chiefFull", { name: bot.name }) : "",
    !bot.chiefOfStaff && chiefOfTeam && approvalModeFor(chiefOfTeam) === "full" ? t("orbit.p.approvals.delegatedFull", { name: chiefOfTeam.name }) : "",
    bot.busy ? t("approvalMode.busy") : "",
    approvalMode !== "full" && !trustedModesAvailable ? t("orbit.p.approvals.fullDesktop") : "",
  ].filter(Boolean).join(" ");
  return (
    <Frame bot={bot} panel="approvals" onBack={onBack} title={t(`approvalMode.${approvalMode}.label` as LocaleKey)} desc={t("orbit.p.approvals.desc")}>
      <Seg label={t("orbit.p.approvals.level")} cols={modes.length} value={approvalMode}
        options={modes.map((m) => ({ key: m, label: t(`approvalMode.${m}.chip` as LocaleKey), title: t(`approvalMode.${m}.label` as LocaleKey), icon: LEVEL_ICON[m], disabled: Boolean(bot.busy) || (m === "full" && !trustedModesAvailable) }))}
        onSelect={(m) => setMode(m as ApprovalMode)} note={note} />
      <Rows rows={[
        { k: t("orbit.p.approvals.role"), v: bot.system === "orbit" ? t("orbit.agent.scope") : bot.chiefOfStaff ? t("orbit.p.approvals.chiefOf", { team: sectionName }) : `${bot.title || t("orbit.p.approvals.member")} · ${chiefOfTeam ? t("orbit.reportsTo", { name: chiefOfTeam.name }) : t("orbit.reportsToYou")}` },
        { k: t("orbit.p.approvals.always"), v: t("orbit.p.approvals.tools", { count: alwaysAllow.length }) },
        { k: t("orbit.p.approvals.engine"), v: engine?.displayName ?? "—" },
      ]} />
      {alwaysAllow.length > 0 && (
        <ChipRow label={t("orbit.p.approvals.revoke")} chips={alwaysAllow.map((g) => ({ label: `${g}  ×`, onClick: () => patch({ alwaysAllow: alwaysAllow.filter((x) => x !== g) }) }))} />
      )}
      <List title={t("orbit.p.approvals.team")} items={[
        { key: "peers", name: t("orbit.p.approvals.askPeers"), on: Boolean(bot.approvePeerComms), disabled: !bot.approvePeerComms && !canCoordinate, title: !canCoordinate ? t("orbit.p.approvals.cantCoordinate") : undefined, onClick: () => patch({ approvePeerComms: !bot.approvePeerComms }) },
        { key: "chief", name: t("orbit.p.approvals.chiefSwitch", { team: sectionName }), meta: !bot.chiefOfStaff && currentChief ? t("orbit.p.approvals.fromChief", { name: currentChief.name }) : undefined, on: Boolean(bot.chiefOfStaff), disabled: !bot.chiefOfStaff && !canCoordinate, onClick: () => patch({ chiefOfStaff: !bot.chiefOfStaff }) },
      ]} />
      {/* a Chief's additional teams: chosen together, saved explicitly, and
          remounted when the server changes them so a stale pick never saves */}
      {bot.chiefOfStaff && (
        <div data-bot-settings-section="permissions">
          <ManagedTeamsSettings
            key={bot.id + JSON.stringify(bot.managedSections ?? [])}
            name={bot.name} ownTeam={section}
            teams={["", ...(state.sections ?? []), ...[...state.bots, ...state.groups].map((member) => member.section?.trim() || "")]}
            allowed={bot.managedSections ?? []}
            onSave={(managedSections) => patch({ managedSections, acknowledgePeerScope: true })}
          />
        </div>
      )}
      <Actions actions={[
        approvalMode === "full" && trustedModesAvailable && { label: t("orbit.p.approvals.applyAll"), disabled: Boolean(bot.busy), onClick: () => { setAllThreads(true); setFullTarget(true); } },
        ownerOrAdmin === true && { label: t("commandAllowlist.manage"), onClick: () => setAllowlistOpen(true) },
        !canCoordinate && { label: t("orbit.p.approvals.cantCoordinate"), onClick: () => dispatch({ type: "toggleSettings", open: true, section: "model", botId: bot.id }) },
      ]} />
      {allowlistOpen && <CommandAllowlistDialog key={bot.id} botId={bot.id} botName={bot.name} onClose={() => setAllowlistOpen(false)} />}
      <LocalComputerAutoWarning
        open={localAuto}
        onCancel={() => setLocalAuto(false)}
        onConfirm={() => { setLocalAuto(false); dispatch({ type: "updateBot", botId: bot.id, patch: { approvalMode: "auto", acknowledgeLocalAuto: true } }); }}
      />
      <FullAccessWarning
        open={fullTarget}
        allThreads={allThreads}
        onAllThreadsChange={setAllThreads}
        onCancel={() => setFullTarget(false)}
        onConfirm={() => { setFullTarget(false); dispatch({ type: "updateBot", botId: bot.id, patch: { approvalMode: "full", confirmFullAccess: true, applyToAllThreads: allThreads } }); }}
      />
    </Frame>
  );
}

// ---- VOICE -------------------------------------------------------------

export function VoicePanelDetail({ bot, onBack }: PanelProps) {
  const { dispatch } = useStore();
  const { patch } = useBotSettingsDerived(bot);
  return (
    <Frame bot={bot} panel="voice" onBack={onBack} title={bot.voice || t("orbit.p.voice.default")} desc={t("orbit.p.voice.desc")}>
      <List title={t("orbit.p.voice.list")} items={[
        { key: "aloud", name: t("orbit.p.voice.aloud"), on: Boolean(bot.speakReplies), onClick: () => patch({ speakReplies: !bot.speakReplies }) },
        { key: "alerts", name: t("orbit.p.voice.alerts"), meta: bot.notifications ? t("orbit.p.voice.alertsOn") : t("orbit.p.voice.alertsOff"), on: bot.notifications,
          onClick: () => { const next = !bot.notifications; if (next) void requestNotificationPermission(); patch({ notifications: next }); } },
        { key: "notes", name: t("orbit.p.voice.notes"), meta: bot.voiceNotes !== false ? t("orbit.p.voice.notesOn") : t("orbit.p.voice.notesOff"), on: bot.voiceNotes !== false,
          label: t("orbit.p.voice.notesLabel"), onClick: () => patch({ voiceNotes: bot.voiceNotes === false }) },
      ]} />
      <div className="orbit-voice-settings">
        <VoiceSettings bot={bot} onPatch={patch} bare />
      </div>
      <Actions actions={[
        { label: t("orbit.p.voice.call", { name: bot.name }), onClick: () => document.querySelector<HTMLButtonElement>("[data-orbit-call]")?.click() },
        { label: t("orbit.p.voice.keys"), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "connections" }) },
      ]} />
    </Frame>
  );
}

// ---- USAGE -------------------------------------------------------------

export function UsagePanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const usage = botUsage(bot);
  const instance = state.instances.find((i) => i.instanceId === bot.modelSelection.instanceId);
  const priced = hasFiniteCost(usage.costUsd);
  return (
    <Frame bot={bot} panel="usage" onBack={onBack} title={t("orbit.p.usage.turns", { count: usage.turns })}
      desc={usage.turns === 0 ? t("orbit.p.usage.none") : priced ? t("orbit.p.usage.desc", { caption: costCaption(instance?.snapshot.billing) }) : t("orbit.p.usage.unpriced")}>
      <Rows rows={[
        { k: t("orbit.p.usage.turnsRow"), v: String(usage.turns) },
        { k: t("orbit.p.usage.tokens"), v: <span title={`${formatTokens(usage.input)} in · ${formatTokens(usage.output)} out`}>{formatTokens(usage.input + usage.output)}</span> },
        { k: t("orbit.p.usage.cost"), v: priced ? formatUsd(usage.costUsd ?? 0) : "—" },
      ]} />
      <Actions actions={[{ label: t("orbit.p.usage.all"), onClick: () => dispatch({ type: "toggleAppSettings", open: true, section: "usage" }) }]} />
    </Frame>
  );
}

// ---- ROUTINES ----------------------------------------------------------

export function RoutinesPanelDetail({ bot, onBack }: PanelProps) {
  const { state, dispatch } = useStore();
  const routines = state.routines.filter((r) => r.botId === bot.id);
  const runs = state.routineRuns.filter((r) => r.botId === bot.id);
  const failed = runs.filter((r) => isRoutineProblemRun(r) && !r.seenAt);
  const [running, setRunning] = useState<string | null>(null);
  // a routine opens in place with its own controls (upstream's list opened
  // each one); the switch alone is no longer what a tap does
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = routines.find((r) => r.id === openId) ?? null;
  const toggle = useCallback((id: string, enabled: boolean) => dispatch({ type: "updateRoutine", routineId: id, patch: { enabled } }), [dispatch]);
  const active = routines.filter((r) => r.enabled).length;
  const lastRun = (id: string) => runs.filter((r) => r.routineId === id).sort((x, y) => (y.scheduledFor ?? 0) - (x.scheduledFor ?? 0))[0];
  return (
    <Frame bot={bot} panel="routines" onBack={onBack} title={t("orbit.p.routines.title", { count: active })} desc={t("orbit.p.routines.desc")}>
      {failed.length > 0 && <Warning>{t("orbit.p.routines.failed", { count: failed.length })}</Warning>}
      <List title={t("orbit.p.routines.schedule")} empty={state.routinesLoadState === "loading" ? t("orbit.panel.loading") : t("orbit.p.routines.none")}
        items={routines.map((r) => ({ key: r.id, name: r.name, meta: r.enabled ? routineNextLabel(r) : t("orbit.p.routines.off"), on: r.enabled,
          onClick: () => setOpenId(openId === r.id ? null : r.id) }))} />
      {opened && (() => {
        const last = lastRun(opened.id);
        return (
          <div className="flex flex-col gap-2 rounded-[14px] border border-ink/[0.1] bg-ink/[0.04] p-3.5">
            <span className="text-[13.5px] font-semibold text-ink">{opened.name}</span>
            <Rows rows={[
              { k: t("orbit.p.routines.next"), v: opened.enabled ? routineNextLabel(opened) : t("orbit.p.routines.off") },
              { k: t("orbit.p.routines.last"), v: last ? `${t(`routines.status.${last.status}` as LocaleKey)}` : t("orbit.p.routines.never") },
              { k: t("routines.runsWith"), v: t(`approvalMode.${opened.approvalMode ?? approvalModeFor(bot)}.label` as LocaleKey) + (opened.approvalMode ? "" : ` · ${t("orbit.p.routines.botDefault")}`) },
            ]} />
            <Actions actions={[
              { label: opened.enabled ? t("orbit.p.routines.turnOff") : t("orbit.p.routines.turnOn"), onClick: () => toggle(opened.id, !opened.enabled) },
              { label: running === opened.id ? t("orbit.p.routines.starting") : t("orbit.p.routines.runNow"), disabled: running !== null, onClick: () => {
                setRunning(opened.id);
                dispatch({ type: "runRoutine", routineId: opened.id, onSettled: () => setRunning(null) });
              } },
              { label: t("orbit.p.routines.edit"), onClick: () => dispatch({ type: "showRoutines", section: "schedule", botId: bot.id, routineId: opened.id }) },
              { label: t("orbit.p.routines.logs"), onClick: () => dispatch({ type: "showRoutines", section: "logs", botId: bot.id, routineId: opened.id }) },
            ]} />
          </div>
        );
      })()}
      <Actions actions={[
        failed.length > 0 && { label: t("orbit.p.routines.markSeen"), onClick: () => failed.forEach((r) => dispatch({ type: "markRoutineRunSeen", runId: r.id })) },
        { label: t("orbit.p.routines.new"), onClick: () => dispatch({ type: "showRoutines", section: "schedule", botId: bot.id }) },
        { label: t("orbit.p.routines.allLogs"), onClick: () => dispatch({ type: "showRoutines", section: "logs", botId: bot.id }) },
        { label: t("orbit.panel.openCalendar"), onClick: () => dispatch({ type: "showRoutines", view: "calendar", botId: bot.id }) },
      ]} />
    </Frame>
  );
}

// ---- HISTORY -----------------------------------------------------------

export function HistoryPanelDetail({ bot, onBack }: PanelProps) {
  const { dispatch, flushBotPatches } = useStore();
  const [rows, setRows] = useState<HistoryRow[] | null>(null);
  const [revision, setRevision] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const load = useCallback(() => {
    setError(false);
    return flushBotPatches(bot.id)
      .then(() => api(`/api/bots/${bot.id}/history?limit=100`))
      .then((data: { rows: HistoryRow[]; revision: string }) => { setRows(data.rows); setRevision(data.revision); })
      .catch(() => setError(true));
  }, [bot.id, flushBotPatches]);
  useEffect(() => { void load(); }, [load]);
  const rollback = async (id: string) => {
    if (!revision) return;
    try {
      await flushBotPatches(bot.id);
      await api(`/api/bots/${bot.id}/history/rollback`, { method: "POST", body: JSON.stringify({ id, expectedRevision: revision }) });
    } catch (e) {
      dispatch({ type: "error", message: e instanceof Error ? e.message : "Couldn't undo that change." });
    } finally { await load(); }
  };
  return (
    <Frame bot={bot} panel="history" onBack={onBack}
      title={rows && rows.length ? t("orbit.p.history.count", { count: rows.length }) : t("orbit.p.history.title")}
      desc={t("orbit.p.history.desc")}>
      {error && rows === null && <Warning>{t("orbit.p.history.error")}</Warning>}
      <List title={t("orbit.p.history.changes")} empty={rows === null ? t("orbit.panel.loading") : t("orbit.p.history.none")}
        items={(rows ?? []).map((r) => ({
          key: r.id, name: r.summary || r.field, dot: MAUS_COLORS[bot.color],
          meta: new Date(r.at).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) + (r.canRestore && revision ? ` · ${t("orbit.p.history.undo")}` : ""),
          title: r.canRestore ? undefined : r.restoreUnavailableReason,
          onClick: r.canRestore && revision ? () => setTarget(r.id) : undefined,
        }))} />
      <ConfirmDialog
        open={target !== null}
        title={t("orbit.p.history.confirmTitle")}
        body={t("orbit.p.history.confirmBody")}
        confirmLabel={t("orbit.p.history.undo")}
        tone="neutral"
        onCancel={() => setTarget(null)}
        onConfirm={() => { const id = target; setTarget(null); if (id) void rollback(id); }}
      />
    </Frame>
  );
}
