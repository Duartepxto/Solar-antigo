// Orbit: a spatial front end for Orbit (design_handoff_orbit/README.md).
// It changes presentation only. The chat column is the existing ChatView /
// GroupView, every system label opens the existing settings surface, and
// every value on the map is read from the store.

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Code2, Plus, Search, SlidersHorizontal, WifiOff, X } from "lucide-react";
import { api, useStore, type Bot } from "@/state/store";
import { MAUS_COLORS } from "@/lib/mascot";
import { t, tCount } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { useCaptionChrome } from "@/components/DesktopCapabilities";
import { ChatView } from "@/components/ChatView";
import { GroupView } from "@/components/GroupView";
import { TeamLibraryPanel } from "@/components/TeamLibraryPanel";
import { attentionJumpAction, crossBotAttentionThreads, type BotAttentionThread, type GroupAttentionThread } from "@/components/SidebarBotActivity";
import { capacityStatus, fetchMemoryOverview } from "@/lib/memory";
import { EMPTY_TEAM_MAP_SNAPSHOT, type TeamMapSnapshot } from "@/lib/team-map";
import { buildModel, focusGeom, loadBotOrder, setPreferredChatWidth, loadLayout, saveBotOrder, saveLayout, type OrbitLayout, type OrbitLink } from "./model";
import { OrbitScene, type OrbitView, type SceneLabels } from "./scene";
import { useSolarPreferences } from './solar-preferences';
import { SolarMap } from './SolarMap';
import { solarNodes } from './solar-model';
import { SolarFocus } from './SolarFocus';
import { SolarDevelopmentWorkspace } from './SolarDevelopmentWorkspace';
import { SolarIdentityProvider } from './SolarIdentity';
import { SolarHeader, SolarComposer } from './SolarChrome';
import { speaker } from "@/lib/tts";
import { modalLayerOpen, onCallPhase, onYouTalking, ORBIT_FOCUS_EVENT, ORBIT_HIDE_EVENT, ORBIT_NAV_EVENT, ORBIT_TOAST_EVENT, onOpenVmWorkspace, orbitNavigate, requestVmWorkspace, type OrbitNavTarget } from "./events";
import { botSystems, type BotFacts, type OrbitSystem } from "./systems";
import { AppSettingsPanel } from "./SettingsPanels";
import { BotDetail } from "./detail/BotDetail";
import { panelForSection, type BotPanelKey } from "./detail/BotPanels";
import { RoutinesPage } from "@/components/RoutinesPage";
import { PluginsPanel } from "@/components/PluginsPanel";
import { LocalVmWorkspace } from "@/components/LocalVmWorkspace";
import { ComputerPanel } from "@/components/ComputerPanel";
import { RemoteDesktopPanel } from "@/components/remote-desktop-panel";
import { InspectorPanel } from "@/components/InspectorPanel";
import { ArtifactCard, OfferPill } from "./ArtifactCard";
import { closeStage, onStageClaim } from "./stage";
import { ART_H, ART_W, loadArtifacts, onPresentRequest, saveArtifacts, useArtifactOffers, type Artifact, type ArtifactOffer } from "./artifacts";
import { ActivePill, BackToMap, LineChooser, MapComposer, MapControls, OrbitCorner, OrbitToast, WaitingPill, type OrbitToastMessage } from "./OrbitChrome";
import { NewBotPanel } from "./detail/NewBotPanel";
import { HubHeader, TEAM_HUB, TeamDeletePanel, TeamHubPanel, TeamMenu, teamHubValue, useTeamComputers, useTeamInstructionsText, YOU_HUB, YouHubPanel, youHubValue, type TeamHubKey, type YouHubKey } from "./detail/HubPanels";
import { RemoteAgentSettingsPanel } from "@/components/RemoteAgentSettingsPanel";
import { NoEngines } from "@/components/NoEngines";
import { usePhoneStatus } from "@/components/SidebarPhoneButton";
import { DesktopWorkspaceSwitcher } from "@/components/DesktopWorkspaceSwitcher";
import { useOrganizationBranding } from "@/lib/use-organization-branding";
import { AboutDialog } from "@/components/AboutDialog";
import { TeamDialog } from "@/components/TeamDialog";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { NewChannelDialog } from "@/components/NewChannelDialog";
import { ArchivedBotsDialog } from "@/components/ArchivedBotsDialog";
import { GuideCharacter } from "./GuideCharacter";
import { brand } from "@/lib/brand";
import { useAppSettingsSections } from "@/components/SettingsModal";
import type { BotPatch } from "@/components/bot-settings/useBotSettingsDerived";

function sceneLabels(): SceneLabels {
  return {
    you: t("orbit.you"),
    clickToTalk: t("orbit.clickToTalk"),
    clickForSettings: t("orbit.clickForSettings"),
    waitingOnYou: t("orbit.waitingOnYou"),
    stalled: t("orbit.runStalled"),
    chief: (name) => t("orbit.teamChief", { name }),
    coordinatedBy: (name) => t("orbit.teamCoordinated", { name }),
    noChief: t("orbit.teamNoChief"),
    channelRule: (count, rule) =>
      t(rule === "lead" ? "orbit.channelLead" : rule === "everyone" ? "orbit.channelEveryone" : "orbit.channelMentions", { count }),
    newBot: t("orbit.newBot"),
    newBotIn: (team) => t("orbit.newBotIn", { team }),
    canTalk: t("orbit.canTalk"),
    conversation: t("orbit.conversation"),
    grant: (chief, team) => t("orbit.link.grant", { chief, team }),
  };
}

const JARVIS_SOLAR = import.meta.env.VITE_JARVIS_SOLAR === 'true';


function typingTarget(el: EventTarget | null) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** The composer takes focus when a thread opens; empty, Esc there loses
 * nothing, so it still backs out to the map. */
function emptyComposer(el: EventTarget | null) {
  return el instanceof HTMLTextAreaElement && el.hasAttribute("data-orbit-composer") && !el.value.trim();
}

export function OrbitShell({ onSearch, paletteOpen = false }: { onSearch: () => void; paletteOpen?: boolean }) {
  const [solarPreferences]=useSolarPreferences();
  const { state, dispatch } = useStore();
  const { dragStyle, noDragStyle } = useCaptionChrome();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbitScene | null>(null);
  const libraryReturnRef = useRef<HTMLButtonElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<OrbitLayout>(loadLayout);
  const [view, setViewState] = useState<OrbitView>({ kind: "map" });
  const [size, setSize] = useState({ w: 1200, h: 700 });
  // bumped while the chat divider is dragged, so the column and ring re-lay out
  const [, setChatWidthRev] = useState(0);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  // a team package link opened from outside the app (the OS hands it over)
  const [installUrl, setInstallUrl] = useState<string | null>(null);
  useEffect(() => {
    if (window.ogb?.remoteClient?.active) return;
    return window.ogb?.onPackageInstall?.((url) => { setInstallUrl(url); setLibraryOpen(true); });
  }, []);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const [newTeamOpen, setNewTeamOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [pill, setPill] = useState<"active" | "waiting" | null>(null);
  const [legend, setLegend] = useState(false);
  const [botPanel, setBotPanel] = useState<BotPanelKey | null>(null);
  const [youPanel, setYouPanel] = useState<YouHubKey>("engines");
  const [teamPanel, setTeamPanel] = useState<TeamHubKey>("instructions");
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  const [facts, setFacts] = useState<BotFacts>({});
  const hiddenKey = (layout.hidden ?? []).join(",");
  const seenRef = useRef<Map<string, number> | null>(null);
  const model = useMemo(() => {
    const seen = (seenRef.current ??= loadBotOrder());
    // The first snapshot is newest-first; oldest bots take the first places.
    const fresh = [...state.bots].reverse().filter((b) => !seen.has(b.id));
    for (const b of fresh) seen.set(b.id, seen.size);
    if (fresh.length) saveBotOrder(seen);
    return buildModel(state, layout.hidden, seen);
  }, [state.bots, state.groups, state.sections, state.connected, hiddenKey]);
  const remoteClient = window.ogb?.remoteClient?.active === true;
  // a remote session that owns or administers the server may still make
  // bots, teams and channels (upstream allowed it; the server checks)
  const ownerOrAdmin = useOwnerOrAdmin();
  const canMake = !remoteClient || ownerOrAdmin === true;

  // ---- scene lifecycle ------------------------------------------------
  const cbRef = useRef({
    onBot: (_id: string) => {},
    onYou: () => {},
    onTeam: (_key: string) => {},
    onChannel: (_id: string) => {},
    onBackground: () => {},
    onLayout: (_l: OrbitLayout) => {},
    onLink: (_from: string, _to: string, _x: number, _y: number) => {},
    onUnlink: (_link: OrbitLink) => {},
    onConversation: (_groupId: string) => {},
    onNewBot: (_section: string | null) => {},
  });
  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(() => {
      const r = stageRef.current?.getBoundingClientRect();
      if (r) setSize({ w: r.width, h: r.height });
    });
    ro.observe(stageRef.current);
    // Solar draws its own map: the Orbit canvas scene (its rAF loop and
    // window listeners) is never built, and every use goes through
    // sceneRef.current?. or a JARVIS_SOLAR guard.
    if (JARVIS_SOLAR || !canvasRef.current) return () => ro.disconnect();
    const scene = new OrbitScene(canvasRef.current, stageRef.current, {
      onBot: (id) => cbRef.current.onBot(id),
      onYou: () => cbRef.current.onYou(),
      onTeam: (key) => cbRef.current.onTeam(key),
      onChannel: (id) => cbRef.current.onChannel(id),
      onBackground: () => cbRef.current.onBackground(),
      onLayout: (l) => cbRef.current.onLayout(l),
      onLink: (from, to, x, y) => cbRef.current.onLink(from, to, x, y),
      onUnlink: (link) => cbRef.current.onUnlink(link),
      onConversation: (id) => cbRef.current.onConversation(id),
      onNewBot: (section) => cbRef.current.onNewBot(section),
    }, sceneLabels());
    sceneRef.current = scene;
    scene.setWorldLayer(worldRef.current);
    return () => { ro.disconnect(); scene.destroy(); sceneRef.current = null; };
  }, []);

  useEffect(() => { sceneRef.current?.setModel(model, layout); }, [model, layout]);
  useEffect(() => { sceneRef.current?.setLabels(sceneLabels()); }, [state.config?.language]);

  // Delegations in flight come from the same endpoint the Team map uses.
  // A new running pair streams a handoff; a finished one streams the result.
  // Solar gets its transfers in real time from the SSE `agent.transfer`
  // frame (store.tsx: a request on send, a result only on a completed reply),
  // so the poll, which only feeds the Orbit canvas, does not run there.
  const runningRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!state.connected || JARVIS_SOLAR) return;
    let alive = true;
    const poll = async () => {
      let snap: TeamMapSnapshot = EMPTY_TEAM_MAP_SNAPSHOT;
      try { snap = await api("/api/team-map"); } catch { return; }
      if (!alive) return;
      const now = new Set(snap.running.map((r) => `${r.sourceBotId}>${r.targetBotId}`));
      const was = runningRef.current;
      if (was) {
        for (const key of now) if (!was.has(key)) {
          const [from, to] = key.split(">");
          sceneRef.current?.emit(from, to, model.bots.find((b) => b.id === from)?.color ?? "#fcfcfc");
        }
        for (const key of was) if (!now.has(key)) {
          const [from, to] = key.split(">");
          sceneRef.current?.emit(to, from, "#38d591", 16);
        }
      }
      runningRef.current = now;
    };
    void poll();
    const iv = window.setInterval(poll, 4000);
    return () => { alive = false; window.clearInterval(iv); };
  }, [state.connected, model.bots]);

  // ---- navigation -----------------------------------------------------
  const setView = useCallback((next: OrbitView) => {
    setPill(null);
    setViewState(next);
  }, []);
  const focusBot = useCallback((id: string) => {
    setView({ kind: "bot", id });
    dispatch({ type: "select", id });
  }, [dispatch, setView]);
  const openChannel = useCallback((id: string) => {
    setView({ kind: "channel", id });
    dispatch({ type: "select", id });
  }, [dispatch, setView]);

  const [toast, setToast] = useState<OrbitToastMessage | null>(null);
  const toastId = useRef(0);
  const say = useCallback((text: string, undo?: () => void) => setToast({ id: ++toastId.current, text, undo }), []);

  // "Can talk" (design: drag from a bot's + onto another). Teammates already
  // reach each other; across teams the backend's rule is a Chief the owner
  // lets work with the other team (managedSections, the Permissions
  // section's own save), so that is what a drawn link grants.
  const coordinate = (botId: string, managedSections: string[]) => {
    const patch: BotPatch = { managedSections, acknowledgePeerScope: true };
    dispatch({ type: "updateBot", botId, patch });
  };
  type TalkPlan = { ok: true; chief: Bot; other: Bot; team: string; before: string[] } | { ok: false; reason: string };
  const planTalk = (a: Bot, b: Bot): TalkPlan => {
    if ((a.section?.trim() || "") === (b.section?.trim() || "")) return { ok: false, reason: t("orbit.link.sameTeam", { a: a.name, b: b.name }) };
    const chief = a.chiefOfStaff ? a : b.chiefOfStaff ? b : null;
    if (!chief) return { ok: false, reason: t("orbit.link.needsChief", { a: a.name, b: b.name }) };
    const other = chief === a ? b : a;
    const team = other.section?.trim();
    if (!team) return { ok: false, reason: t("orbit.link.noTeam", { name: other.name }) };
    const before = chief.managedSections ?? [];
    if (before.includes(team)) return { ok: false, reason: t("orbit.link.already", { a: chief.name, team }) };
    return { ok: true, chief, other, team, before };
  };
  const letTalk = (plan: Extract<TalkPlan, { ok: true }>) => {
    const { chief, other, team, before } = plan;
    coordinate(chief.id, [...before, team]);
    sceneRef.current?.emit(chief.id, other.id, MAUS_COLORS[chief.color], 14);
    window.setTimeout(() => sceneRef.current?.emit(other.id, chief.id, MAUS_COLORS[other.color], 14), 250);
    say(t("orbit.link.added", { a: chief.name, team }), () => coordinate(chief.id, before));
  };
  // A drawn line asks what it means: let the two talk, or open the channel
  // between them (their bot⇄bot conversation, or a new channel with both).
  const [lineChoice, setLineChoice] = useState<{ a: string; b: string; x: number; y: number } | null>(null);
  const conversationOf = (a: string, b: string) =>
    state.groups.find((g) => g.dm && g.memberIds.length === 2 && g.memberIds.includes(a) && g.memberIds.includes(b)) ?? null;
  const unlink = (l: OrbitLink) => {
    const chief = state.bots.find((b) => b.id === l.from);
    if (!chief) return;
    const before = chief.managedSections ?? [];
    coordinate(chief.id, before.filter((s) => s.trim() !== l.section));
    say(t("orbit.link.removed", { a: chief.name, team: l.section }), () => coordinate(chief.id, before));
  };

  // "Open Team map" from older surfaces (the computer panel, leaving the
  // calendar) means Orbit's map.
  useEffect(() => {
    if (state.activeView !== "team-map") return;
    dispatch({ type: "showChat" });
    setView({ kind: "map" });
  }, [state.activeView, dispatch, setView]);

  // toasts raised elsewhere in the chrome (an archive, with its Undo)
  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; undo?: () => void }>).detail;
      if (detail?.text) say(detail.text, detail.undo);
    };
    window.addEventListener(ORBIT_TOAST_EVENT, onToast);
    return () => window.removeEventListener(ORBIT_TOAST_EVENT, onToast);
  }, [say]);

  cbRef.current = {
    onBot: focusBot,
    onYou: () => setView({ kind: "you" }),
    onTeam: (key) => setView({ kind: "team", key }),
    onChannel: openChannel,
    onBackground: () => setView({ kind: "map" }),
    onLayout: (l) => { setLayout(l); saveLayout(l); },
    onLink: (a, b, x, y) => setLineChoice({ a, b, x, y }),
    onUnlink: unlink,
    onConversation: openChannel,
    onNewBot: (section) => setView({ kind: "new", section }),
  };
  // "New bot" from anywhere (⌘N, the palette, an empty state) opens the
  // column; the store flag is spent.
  useEffect(() => {
    if (!state.newBotOpen) return;
    dispatch({ type: "toggleNewBot", open: false });
    setView({ kind: "new", section: null });
  }, [state.newBotOpen, dispatch, setView]);

  // Anything else that selects a conversation — ⌘K, ⌘1–9, a notification,
  // a thread link — flies there (spec §6.8: a notification click opens that
  // exact bot and thread).
  const selectedRef = useRef<string | null>(null);
  const quietFollowUntilRef = useRef(0);
  const readySinceRef = useRef<number | null>(null);
  const selectedThread = state.bots.find((b) => b.id === state.selectedId)?.threadId;
  useEffect(() => {
    // Only a change of selection counts: the first bots/threads snapshot
    // (which picks a default bot) must not zoom the map in on its own.
    if (!state.connected || state.bots.length === 0) return;
    const key = `${state.selectedId}:${selectedThread ?? ""}`;
    const prev = selectedRef.current;
    selectedRef.current = key;
    readySinceRef.current ??= performance.now();
    if (prev === null || prev === key || !state.selectedId) return;
    // The first snapshots settle the default selection and its thread; a
    // team import selects each bot it adds, but the map is where it lands.
    if (performance.now() - readySinceRef.current < 2000 || performance.now() < quietFollowUntilRef.current) return;
    if (state.groups.some((g) => g.id === state.selectedId)) setView({ kind: "channel", id: state.selectedId });
    else if (state.bots.some((b) => b.id === state.selectedId && !b.hidden)) setView({ kind: "bot", id: state.selectedId });
  }, [state.selectedId, selectedThread, state.bots, state.groups, state.connected, setView]);

  // The guided tour asks to be shown a bot (its steps live in the bot view).
  useEffect(() => {
    const onFocus = (event: Event) => {
      const id = (event as CustomEvent<{ botId?: string }>).detail?.botId;
      const target = state.bots.find((b) => b.id === id && !b.hidden) ?? state.bots.find((b) => !b.hidden);
      if (target && !(view.kind === "bot" && view.id === target.id)) focusBot(target.id);
    };
    window.addEventListener(ORBIT_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(ORBIT_FOCUS_EVENT, onFocus);
  }, [state.bots, view, focusBot]);

  // The palette's settings and actions: You, a team, New bot, the library, Fit.
  useEffect(() => {
    const onNav = (event: Event) => {
      const target = (event as CustomEvent<OrbitNavTarget>).detail;
      if (!target) return;
      if (target.to === "you") {
        if (target.panel === "library") setLibraryOpen(true);
        if (target.panel) setYouPanel(target.panel as YouHubKey);
        setView({ kind: "you" });
      } else if (target.to === "bot") {
        const panel = (target.panel ?? null) as BotPanelKey | null;
        if (view.kind === "bot" && view.id === target.id) { if (target.panel !== undefined) setBotPanel(panel); }
        else { if (pendingPanelRef.current === null) pendingPanelRef.current = remoteClient ? null : panel; focusBot(target.id); }
      } else if (target.to === "team") setView({ kind: "team", key: target.key });
      else if (target.to === "new") setView({ kind: "new", section: null });
      else if (target.to === "library") setLibraryOpen(true);
      else if (target.to === "about") setAboutOpen(true);
      else if (target.to === "archived") setArchivedOpen(true);
      else if (target.to === "newTeam") setNewTeamOpen(true);
      else { setView({ kind: "map" }); if (JARVIS_SOLAR) window.dispatchEvent(new Event('jarvis-solar-fit')); else sceneRef.current?.fit(); }
    };
    window.addEventListener(ORBIT_NAV_EVENT, onNav);
    return () => window.removeEventListener(ORBIT_NAV_EVENT, onNav);
  }, [setView, view, focusBot, remoteClient]);

  // A focused bot that disappears (archived, deleted) returns to the map.
  useEffect(() => {
    if (view.kind === "bot" && !model.bots.some((b) => b.id === view.id) && model.orbitAgent?.id !== view.id) setView({ kind: "map" });
    if (view.kind === "team" && !model.teams.some((tm) => tm.key === view.key)) setView({ kind: "map" });
    if (view.kind === "channel" && !state.groups.some((g) => g.id === view.id)) setView({ kind: "map" });
  }, [model, state.groups, view, setView]);

  // A remote client keeps the host's own agent-settings page.
  const [remoteSettings, setRemoteSettings] = useState(false);
  // A panel asked for with the view (⌘K "Memory · Pepper") survives the
  // reset. Declared before the settings request below so, in one commit, the
  // reset runs first and the requested panel wins.
  const pendingPanelRef = useRef<BotPanelKey | null>(null);
  const vmShownRef = useRef(false);
  const sheetShownRef = useRef(false);
  const closeSheetRef = useRef<() => void>(() => {});
  useEffect(() => { setBotPanel(pendingPanelRef.current); pendingPanelRef.current = null; setRemoteSettings(false); setTeamPanel("instructions"); }, [view.kind === "bot" ? view.id : view.kind === "team" ? `team:${view.key}` : view.kind]);
  // Settings live in the column: a request from anywhere (a system label, a
  // chip, a card, the macOS Preferences menu) flies to the bot or to You.
  // A bot-settings request (a chip, a card, an old deep link) becomes the
  // matching detail panel in that bot's view; the store flag is spent.
  useEffect(() => {
    if (!state.settingsOpen) return;
    const target = state.bots.find((b) => b.id === state.selectedId && !b.hidden);
    dispatch({ type: "toggleSettings", open: false });
    if (!target) return;
    const panel = remoteClient ? null : panelForSection(state.botSettingsSection);
    // a view change resets the panel; hand it the one asked for instead
    if (!(view.kind === "bot" && view.id === target.id)) { pendingPanelRef.current = panel; setView({ kind: "bot", id: target.id }); }
    else if (panel) setBotPanel(panel);
  }, [state.settingsOpen, state.selectedId, state.botSettingsSection, state.bots, view, setView, dispatch, remoteClient]);
  const [teamComputers, setTeamComputers] = useTeamComputers(view.kind === "team");
  const [teamInstructions, setTeamInstructions] = useTeamInstructionsText(view.kind === "team" && !remoteClient ? view.key : null);
  // What the systems around a bot show from their own routes.
  const focusId = view.kind === "bot" ? view.id : null;
  useEffect(() => {
    if (!focusId || !state.connected) { setFacts({}); return; }
    let cancelled = false;
    void api(`/api/bots/${focusId}/skills`).then((r: { skills?: Array<{ name: string; enabled: boolean }> }) => {
      if (cancelled) return;
      const list = r.skills ?? [];
      setFacts((f) => ({ ...f, skills: { on: list.filter((x) => x.enabled).length, total: list.length, first: list.find((x) => x.enabled)?.name ?? list[0]?.name } }));
    }).catch(() => {});
    void fetchMemoryOverview(focusId).then((o) => {
      if (cancelled) return;
      setFacts((f) => ({ ...f, memory: { lines: o.index.lines, maxLines: o.index.maxLines, topics: o.topics.length, level: capacityStatus(o.index).level } }));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [focusId, botPanel, state.connected]);
  // "Hide from the map" (bot menu) and "Show on the map" (You hub).
  useEffect(() => {
    const onHide = (event: Event) => {
      const id = (event as CustomEvent<{ botId?: string; show?: boolean }>).detail?.botId;
      const show = (event as CustomEvent<{ show?: boolean }>).detail?.show === true;
      if (!id) return;
      setLayout((l) => {
        const hidden = new Set(l.hidden ?? []);
        if (show) hidden.delete(id); else hidden.add(id);
        const next = { ...l, hidden: [...hidden] };
        saveLayout(next);
        return next;
      });
      if (!show) setView({ kind: "map" });
    };
    window.addEventListener(ORBIT_HIDE_EVENT, onHide);
    return () => window.removeEventListener(ORBIT_HIDE_EVENT, onHide);
  }, [setView]);
  useEffect(() => {
    if (state.appSettingsOpen && view.kind !== "you") setView({ kind: "you" });
  }, [state.appSettingsOpen, view.kind, setView]);
  // Leaving a view closes the panel it had open.
  const lastViewRef = useRef(view);
  useEffect(() => {
    const was = lastViewRef.current;
    lastViewRef.current = view;
    if (was === view) return;
    if (was.kind === "you" && view.kind !== "you" && state.appSettingsOpen) dispatch({ type: "toggleAppSettings", open: false });
  }, [view, state.settingsOpen, state.appSettingsOpen, dispatch]);

  const overlayOpen = state.shortcutsOpen || state.welcomeOpen ||
    aboutOpen || archivedOpen || newTeamOpen || newChannelOpen;

  // Esc backs out one level: pill → view → map. Open dialogs handle their own.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || overlayOpen || botPanel || state.appSettingsOpen || modalLayerOpen()) return;
      if (typingTarget(e.target) && !emptyComposer(e.target) && view.kind !== "map") return;
      if (pill) { setPill(null); return; }
      if (vmShownRef.current) { setVmClose((n) => n + 1); return; }
      if (sheetShownRef.current) { closeSheetRef.current(); return; }
      // the calendar sits inside You: Esc closes what it opened in the column
      // (the calendar handles that key itself), then the calendar, back to You
      if (state.activeView === "routines" && view.kind === "you") {
        if (!document.querySelector("[data-orbit-calendar-column]")?.childElementCount) dispatch({ type: "showChat" });
        return;
      }
      if (view.kind !== "map") setView({ kind: "map" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, pill, view, setView, botPanel, state.appSettingsOpen, state.activeView, dispatch]);

  // ---- systems for the current view ------------------------------------
  const [developmentOpen, setDevelopmentOpen] = useState(false);
  const focusedBot = view.kind === "bot" ? state.bots.find((b) => b.id === view.id) ?? null : null;
  const focusedGroup = view.kind === "channel" ? state.groups.find((g) => g.id === view.id) ?? null : null;
  const focusedTeam = view.kind === "team" ? model.teams.find((tm) => tm.key === view.key) ?? null : null;
  const appSectionList = useAppSettingsSections();
  const phone = usePhoneStatus();
  const appSections = useMemo(() => new Set(appSectionList.map((entry) => entry.id)), [appSectionList.map((entry) => entry.id).join()]);
  const systems: OrbitSystem[] = useMemo(() => {
    if (focusedBot) { const result = botSystems(focusedBot, state, (p) => {
      if (remoteClient) { setRemoteSettings(true); return; }
      setBotPanel((cur) => (cur === p ? null : p));
    }, facts, botPanel);
      if (JARVIS_SOLAR && focusedBot.id === solarNodes(model)[0]?.id) {
        const core = result.filter(system => ['engine','approvals','skills','memory','voice'].includes(system.key));
        if (canMake) core.push({ key: 'workspace', icon: SlidersHorizontal, label: t('orbit.hub.system'), value: t('jarvis.solar.workspace'), status: '', run: () => { setYouPanel('system'); setView({kind:'you'}); } });
        return core;
      }
      if (JARVIS_SOLAR && canMake) result.push({key: "development", icon: Code2, label: t("jarvis.dev.title"), value: t("jarvis.dev.files"), status: t("jarvis.dev.code"), selected: developmentOpen, run: () => { setBotPanel(null); setDevelopmentOpen(true); }});
      return result;
    }
    if (view.kind === "you") return YOU_HUB
      .filter((h) => (h.section ? appSections.has(h.section) : !remoteClient))
      .map((h) => {
        const [value, status] = JARVIS_SOLAR&&h.key==='appearance'?[t(`jarvis.solar.background.${solarPreferences.background}`),t('jarvis.solar.preference.background')]:youHubValue(h.key, state, phone);
        return { key: h.key, icon: h.icon, label: t(h.label as never), value, status, selected: !state.appSettingsOpen && youPanel === h.key,
          run: () => { if (state.appSettingsOpen) dispatch({ type: "toggleAppSettings", open: false }); if (h.key === "library") setLibraryOpen(true); setYouPanel(h.key); } };
      });
    if (focusedTeam) return TEAM_HUB.map((h) => {
      const [value, status] = teamHubValue(h.key, focusedTeam, state, teamComputers.find((c) => c.section === focusedTeam.key), teamInstructions);
      return { key: h.key, icon: h.icon, label: t(h.label as never), value, status, selected: teamPanel === h.key, run: () => setTeamPanel(h.key) };
    });
    return [];
  }, [focusedBot, focusedTeam, view.kind, state, dispatch, focusBot, appSections, facts, botPanel, remoteClient, youPanel, teamPanel, teamComputers, teamInstructions, phone, solarPreferences.background, developmentOpen, canMake, model, setView]);
  const liveIdx = systems.flatMap((sys, i) => (sys.live ? [i] : []));
  const warnIdx = systems.flatMap((sys, i) => (sys.tone === "warning" ? [i] : []));
  // ---- "wants to show you" ---------------------------------------------
  const { offer, settle } = useArtifactOffers(state.bots, state.screens);
  const [artifacts, setArtifacts] = useState<Artifact[]>(loadArtifacts);
  useEffect(() => saveArtifacts(artifacts), [artifacts]);
  // a deleted bot takes its cards with it (once the bot list is in)
  useEffect(() => {
    if (!state.connected || state.bots.length === 0) return;
    setArtifacts((list) => (list.every((a) => state.bots.some((b) => b.id === a.botId)) ? list : list.filter((a) => state.bots.some((b) => b.id === a.botId))));
  }, [state.connected, state.bots]);
  // the card a bot is showing in its own view (prototype: focusShow)
  const [showingId, setShowingId] = useState<string | null>(null);
  const showing = view.kind === "bot" ? artifacts.find((a) => a.id === showingId && a.botId === view.id) : undefined;
  useEffect(() => { if (showingId && !showing) setShowingId(null); }, [showingId, showing]);
  useEffect(() => { sceneRef.current?.setShowing(showing ? { x: showing.x, y: showing.y, w: showing.w, h: showing.h } : null); }, [showing?.id, showing?.x, showing?.y]);
  const cards = artifacts.filter((a) => model.bots.some((b) => b.id === a.botId));
  const cardsKey = cards.map((a) => `${a.id}@${Math.round(a.x)},${Math.round(a.y)}`).join("|");
  useEffect(() => { sceneRef.current?.setCards(cards.map((a) => ({ botId: a.botId, x: a.x, y: a.y, w: a.w, h: a.h }))); }, [cardsKey]);
  const liveOffer = offer && model.bots.some((b) => b.id === offer.botId) && state.connected ? offer : null;
  useLayoutEffect(() => {
    if (JARVIS_SOLAR) return;
    sceneRef.current?.setOffer(liveOffer ? offerRef.current : null, liveOffer?.botId ?? null);
    if (liveOffer) sceneRef.current?.lookAtYou(liveOffer.botId);
  }, [liveOffer?.key]);
  const teamOf = (botId: string) => model.teams.find((tm) => tm.memberIds.includes(botId))?.key;
  const present = (o: ArtifactOffer) => {
    const scene = sceneRef.current;
    if (!scene && !JARVIS_SOLAR) return;
    settle(o.key);
    const id = `${o.botId}:${o.kind}`;
    const existing = artifacts.find((a) => a.id === id);
    const n = artifacts.filter((a) => a.id !== id && teamOf(a.botId) === teamOf(o.botId)).length;
    const pos = existing ?? (JARVIS_SOLAR ? { x: 0, y: 0 } : scene!.artifactSpot(o.botId, n, ART_W, ART_H));
    setArtifacts((list) => [...list.filter((a) => a.id !== id), { ...o, id, x: pos.x, y: pos.y, w: ART_W, h: ART_H }]);
    if (JARVIS_SOLAR) { setDevelopmentOpen(false); focusBot(o.botId); setShowingId(id); return; }
    // in the bot's own view the card takes the stage beside the chat
    if (view.kind === "bot" && view.id === o.botId) { setShowingId(id); return; }
    setShowingId(null);
    if (view.kind !== "map") setView({ kind: "map" });
    scene!.present(o.botId, { x: pos.x + ART_W / 2, y: pos.y + 40 });
    const b = scene!.worldOf(o.botId) ?? pos;
    scene!.frameRect(Math.min(pos.x - 40, b.x - 300), Math.min(pos.y - 40, b.y - 280), Math.max(pos.x + ART_W + 40, b.x + 300), Math.max(pos.y + ART_H + 40, b.y + 280));
  };
  // the chat's "open on the canvas" row
  const presentRef = useRef(present);
  presentRef.current = present;
  useEffect(() => onPresentRequest((o) => presentRef.current(o)), []);
  // a talking bot's mouth follows the voice actually playing
  useEffect(() => {
    sceneRef.current?.setVoiceLevel(() => speaker.level());
    return () => sceneRef.current?.setVoiceLevel(null);
  }, []);
  useEffect(() => onYouTalking(() => sceneRef.current?.youTalk()), []);
  // a call shows on the bot itself: talking, listening, thinking
  useEffect(() => onCallPhase((botId, phase) => {
    sceneRef.current?.setCall(botId, phase === null ? null : phase === "speaking" ? "talking" : phase === "listening" ? "idle" : "thinking");
  }), []);
  const closeCard = (id: string) => {
    setArtifacts((list) => list.filter((a) => a.id !== id));
    if (showingId === id) setShowingId(null);
    if (view.kind === "map") sceneRef.current?.fit();
  };

  // ---- the bot's computer and inspector, in its column --------------------
  // Opened from anywhere (a card's "Open the desktop", a panel): fly to that
  // bot. Leaving it closes them, as leaving a bot closes its panels.
  const panelBot = useRef<string | null>(null);
  useEffect(() => {
    if (!state.computerOpen && !state.inspectorOpen) { panelBot.current = null; return; }
    const id = state.selectedId;
    if (!id || !state.bots.some((b) => b.id === id)) return;
    panelBot.current = id;
    if (!(view.kind === "bot" && view.id === id)) focusBot(id);
  }, [state.computerOpen, state.inspectorOpen, state.selectedId]);
  useEffect(() => {
    if (!panelBot.current || (view.kind === "bot" && view.id === panelBot.current)) return;
    if (state.computerOpen) dispatch({ type: "toggleComputer", open: false });
    if (state.inspectorOpen) dispatch({ type: "toggleInspector", open: false });
  }, [view.kind === "bot" ? view.id : view.kind]);

  // ---- the Local VM workspace, on the bot's stage -------------------------
  // Its VM desktops take the stage beside the column (the bot steps up to the
  // corner, as it does for the calendar); leaving the bot closes it.
  const [vmWorkspace, setVmWorkspace] = useState<string | null>(null);
  // the way back asks the workspace to close, so it hands control back first
  const [vmClose, setVmClose] = useState(0);
  useEffect(() => onOpenVmWorkspace((botId) => {
    dispatch({ type: "toggleComputer", open: false });
    setVmWorkspace(botId);
    if (!(view.kind === "bot" && view.id === botId)) focusBot(botId);
  }));
  useEffect(() => { if (vmWorkspace && !(view.kind === "bot" && view.id === vmWorkspace)) setVmWorkspace(null); }, [view.kind === "bot" ? view.id : view.kind]);
  const vmShown = !remoteClient && vmWorkspace !== null && view.kind === "bot" && view.id === vmWorkspace;
  vmShownRef.current = vmShown;

  // ---- the team library and plugins, on the stage -------------------------
  // Opened from the map they go to You; from a bot they stay with it. They
  // take the stage beside the column (OrbitSheet portals into the slot) and
  // close when the view changes, as the calendar does.
  const sheetOpen = (libraryOpen || state.pluginsOpen) && !remoteClient;
  const sheetView = useRef<string | null>(null);
  const viewKey = view.kind === "bot" ? `bot:${view.id}` : view.kind === "team" ? `team:${view.key}` : view.kind;
  useEffect(() => {
    if (!sheetOpen) { sheetView.current = null; return; }
    if (sheetView.current) return;
    if (view.kind === "you" || view.kind === "bot") sheetView.current = viewKey;
    else { sheetView.current = "you"; setView({ kind: "you" }); }
  }, [sheetOpen]);
  const closeSheet = useCallback(() => {
    if (libraryOpen) { setLibraryOpen(false); setInstallUrl(null); }
    if (state.pluginsOpen) dispatch({ type: "togglePlugins", open: false });
  }, [libraryOpen, state.pluginsOpen, dispatch]);
  useEffect(() => { if (sheetView.current && sheetView.current !== viewKey) closeSheet(); }, [viewKey]);
  const sheetShown = sheetOpen && (view.kind === "you" || view.kind === "bot");
  // other screens that claim the stage (stage.ts): the image viewer, ...
  const [stageClaims, setStageClaims] = useState(0);
  useEffect(() => { setDevelopmentOpen(false); }, [viewKey, focusedBot?.threadId]);
  useEffect(() => onStageClaim((delta) => setStageClaims((n) => Math.max(0, n + delta))), []);
  const claimShown = stageClaims > 0 && (view.kind === "you" || view.kind === "bot");
  useEffect(() => { if (stageClaims > 0) closeStage(); }, [viewKey]);
  sheetShownRef.current = sheetShown;
  closeSheetRef.current = closeSheet;

  // ---- the calendar, on the canvas ----------------------------------------
  // Opening it (from any panel) goes to You with the Calendar panel in the
  // column; the full calendar takes the stage beside it. Leaving that — the
  // canvas, another system, a bot — closes it. No overlay, no Back.
  const calendarOpen = state.activeView === "routines";
  const calendarCovered = calendarOpen && view.kind === "you" && youPanel === "calendar";
  const covered = calendarCovered || vmShown || sheetShown || claimShown;
  // a screen may claim the stage only where one is free
  const stageFree = (view.kind === "you" || view.kind === "bot") && !calendarCovered && !vmShown && !sheetShown && !showing;
  const calendarShown = useRef(false);
  useEffect(() => {
    if (!calendarOpen) return;
    calendarShown.current = false;
    setView({ kind: "you" });
    setYouPanel("calendar");
  }, [calendarOpen, state.routinesFocus.nonce]);
  useEffect(() => {
    if (calendarCovered) { calendarShown.current = true; return; }
    if (calendarOpen && calendarShown.current) { calendarShown.current = false; dispatch({ type: "showChat" }); }
  }, [calendarCovered, calendarOpen]);
  useEffect(() => {
    sceneRef.current?.setCovered(covered || (JARVIS_SOLAR && view.kind === 'map'));
    sceneRef.current?.setSuspended(JARVIS_SOLAR);
  }, [covered, view.kind]);
  const openFromCalendar = (id: string) => {
    if (state.bots.some((b) => b.id === id)) focusBot(id);
    else openChannel(id);
  };

  const orbiting = showing || covered ? 0 : systems.length;
  useEffect(() => { sceneRef.current?.setView(view, orbiting, liveIdx, warnIdx); }, [view, orbiting, liveIdx.join(), warnIdx.join()]);
  const geom = focusGeom(size.w, size.h, systems.length);

  // ---- pills under You -------------------------------------------------
  // A bot's own threads, and channel threads beside them (upstream's sidebar
  // listed both); a channel entry opens the channel on that thread.
  const everything = useMemo(() => crossBotAttentionThreads(state.bots, state.pendingQueued, undefined, state.groups),
    [state.bots, state.pendingQueued, state.groups]);
  const attention = everything.filter((e): e is BotAttentionThread => e.kind === "bot");
  const channelAttention = everything.filter((e): e is GroupAttentionThread => e.kind === "group");
  const waiting = attention.filter((e) => e.task.activity === "waiting-on-you");
  const active = attention.filter((e) => e.task.activity !== "waiting-on-you");
  const channelWaiting = channelAttention.filter((e) => e.task.activity === "waiting-on-you");
  const channelActive = channelAttention.filter((e) => e.task.activity !== "waiting-on-you");
  const jump = (entry: BotAttentionThread) => {
    setPill(null);
    setView({ kind: "bot", id: entry.botId });
    dispatch({ type: "switchTask", botId: entry.botId, threadId: entry.task.threadId });
  };
  const jumpChannel = (entry: GroupAttentionThread) => {
    setPill(null);
    dispatch(attentionJumpAction(entry));
    openChannel(entry.groupId);
  };

  const title = focusedBot ? t("orbit.titleBot", { name: focusedBot.name })
    : focusedGroup ? t("orbit.titleBot", { name: focusedGroup.dm ? focusedGroup.name : `#${focusedGroup.name.replace(/^#/, "")}` })
    : view.kind === "you" ? t("orbit.titleBot", { name: t("orbit.you") })
    : focusedTeam ? t("orbit.titleBot", { name: focusedTeam.loose ? t("orbit.noTeam") : focusedTeam.name })
    : view.kind === "new" ? t("orbit.titleBot", { name: t("orbit.newBot") })
    : t("orbit.title");
  const mac = window.ogb?.platform === "darwin";
  const empty = state.connected && model.bots.length === 0;
  // Nothing on this machine can run a bot. A missing cloud login does not
  // count — that CLI can still host a local model. Wait for the first
  // /api/instances response before deciding: an empty list means "not asked
  // yet", and flashing the setup screen at every launch would be worse.
  const noEngines = state.connected && state.instances.length > 0 && !state.instances.some((i) => i.snapshot.state === "available");
  // First load says "Starting"; losing the harness later keeps the map up
  // under a banner, since nothing is lost.
  const [everConnected, setEverConnected] = useState(false);
  useEffect(() => { if (state.connected) setEverConnected(true); }, [state.connected]);
  const inFocus = view.kind !== "map";

  const chatW = geom.chatW;
  const col = focusedBot ? MAUS_COLORS[focusedBot.color] : undefined;

  return (
    <SolarIdentityProvider model={model}>
    <div className="orbit-root relative flex h-full min-w-0 flex-1 overflow-hidden text-ink" data-jarvis-solar={JARVIS_SOLAR || undefined} data-solar-theme={JARVIS_SOLAR?solarPreferences.background:undefined} data-solar-focus={JARVIS_SOLAR && inFocus || undefined}
      style={{ background: "var(--color-app)", ...(JARVIS_SOLAR ? { "--solar-chat-w": `${chatW}px` } : {}) } as React.CSSProperties}>
      {/* The app fills its window: Electron draws the real window controls
          (the title bar leaves room for them on macOS), a browser tab is
          its own window. The design's framed window is a mockup of that. */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
        style={{ background: "radial-gradient(1200px 800px at 50% 45%, color-mix(in srgb, var(--color-panel) 60%, var(--color-app)), var(--color-app) 70%)" }}>
      {/* Title bar: the same surface as the map, no divider */}
      {/* the desktop app's title bar drags the window (double-click zooms,
          as the system setting says); its controls opt out */}
      {JARVIS_SOLAR ? <SolarHeader onSearch={onSearch} onAdd={() => setView({ kind: 'new', section: null })}
        onTeam={() => setNewTeamOpen(true)} onChannel={() => setNewChannelOpen(true)} canMake={canMake} mac={mac} /> : <div style={window.ogb ? ({ WebkitAppRegion: "drag" } as React.CSSProperties) : dragStyle} className={cn("relative flex h-[38px] shrink-0 items-center gap-2 px-3.5", mac && "pl-[84px]")}>
        {/* the desktop app's workspace (this computer or a server) and the organisation's mark */}
        <DesktopWorkspaceSwitcher chip />
        <OrganizationMark />
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 truncate text-[13px] font-medium text-ink/70">{title}</span>
        {/* making things lives in one visible place, not only the palette */}
        {canMake && (
          <span className="relative ml-auto" style={window.ogb ? ({ WebkitAppRegion: "no-drag" } as React.CSSProperties) : noDragStyle}>
            <button type="button" aria-haspopup="menu" aria-expanded={newMenuOpen} onClick={() => setNewMenuOpen((v) => !v)}
              className="flex h-6 items-center gap-1 rounded-[7px] border border-ink/10 bg-ink/[0.05] px-2 text-[12px] text-ink/70 hover:text-ink">
              <Plus size={12} /> {t("orbit.newMenu")}
            </button>
            {newMenuOpen && <>
              <span className="fixed inset-0 z-30" onClick={() => setNewMenuOpen(false)} />
              <span role="menu" className="absolute right-0 top-full z-40 mt-1 flex w-[190px] flex-col rounded-xl border border-ink/[0.1] bg-panel p-1 shadow-[0_20px_50px_rgba(0,0,0,.55)]">
                {([
                  [t("orbit.newMenu.bot"), () => setView({ kind: "new", section: null })],
                  [t("orbit.newMenu.team"), () => setNewTeamOpen(true)],
                  [t("orbit.newMenu.channel"), () => setNewChannelOpen(true)],
                ] as Array<[string, () => void]>).map(([label, run]) => (
                  <button key={label} type="button" role="menuitem" onClick={() => { setNewMenuOpen(false); run(); }}
                    className="rounded-lg px-3 py-2 text-left text-[13px] text-ink hover:bg-ink/[0.06]">{label}</button>
                ))}
              </span>
            </>}
          </span>
        )}
        <button style={window.ogb ? ({ WebkitAppRegion: "no-drag" } as React.CSSProperties) : noDragStyle} onClick={onSearch}
          className={cn("flex h-6 items-center gap-1.5 rounded-[7px] border border-ink/10 bg-ink/[0.05] px-2 text-[12px] text-ink/70 hover:text-ink", !canMake && "ml-auto")}>
          <Search size={12} /> {t("orbit.search")}
        </button>
      </div>}

      <div ref={stageRef} className="orbit-stage relative min-h-0 flex-1" data-orbit-stage-free={stageFree || undefined}>
        <canvas ref={canvasRef} data-orbit-canvas className="absolute inset-0 size-full touch-none" style={{ cursor: "grab", visibility: JARVIS_SOLAR ? 'hidden' : undefined }} />
        {JARVIS_SOLAR && <div className="solar-map-layer absolute inset-0" style={{opacity:developmentOpen?.06:inFocus&&(size.w<760||view.kind==='new')?0:1,pointerEvents:inFocus?'none':undefined}} inert={inFocus} aria-hidden={inFocus||undefined}>
          <SolarMap active={!covered&&!showing} focusId={inFocus&&size.w>=760&&view.kind!=='new'?(focusedBot?.id??focusedTeam?.chiefId??model.bots.find(b=>/^jarvis(?:\s|$)/i.test(b.name))?.id??model.orbitAgent?.id):undefined} focusWidth={Math.max(220,size.w-chatW-28)} model={model} onBot={focusBot} onSettings={() => setView({ kind: 'you' })} onAdd={() => setView({ kind: 'new', section: null })} />
        </div>}
        {JARVIS_SOLAR && inFocus && <SolarFocus creating={view.kind==='new'} model={model} id={focusedBot?.id??focusedTeam?.chiefId??undefined}
          name={focusedBot?.name??focusedGroup?.name??focusedTeam?.name??(view.kind==='new'?t('orbit.new.name'):'Jarvis')}
          systems={systems} width={size.w} height={size.h} chatWidth={chatW} covered={covered||!!showing} onBackground={()=>setView({kind:'map'})} />}

        {developmentOpen && focusedBot && <SolarDevelopmentWorkspace key={`${focusedBot.id}:${focusedBot.threadId}`} bot={focusedBot} onClose={() => setDevelopmentOpen(false)} />}

        {/* Files the bots put on the canvas, in world units (the scene moves
            the layer with the camera). Solar never shows a card on the map,
            so it mounts only the one on stage: an unseen card would still
            fetch its file and run its page's scripts. */}
        <div ref={worldRef} className={JARVIS_SOLAR ? "pointer-events-none absolute inset-0 z-[12]" : "pointer-events-none absolute left-0 top-0 size-0 origin-top-left"} hidden={JARVIS_SOLAR && !inFocus}>
          {(JARVIS_SOLAR ? cards.filter((a) => a.id === showing?.id) : cards).map((a) => {
            const b = state.bots.find((x) => x.id === a.botId);
            return (
              <ArtifactCard key={a.id} art={a} name={b?.name ?? ""} color={b ? MAUS_COLORS[b.color] : "#fcfcfc"}
                shown={showing?.id === a.id} visible={!JARVIS_SOLAR && view.kind === "map"}
                stageRect={JARVIS_SOLAR ? { left: 24, top: 148, width: Math.max(240, size.w - chatW - 72), height: Math.max(200, size.h - 172) } : undefined}
                onDrag={(dx, dy) => {
                  const k = sceneRef.current?.scale() ?? 1;
                  setArtifacts((list) => list.map((x) => (x.id === a.id ? { ...x, x: x.x + dx / k, y: x.y + dy / k } : x)));
                }}
                onFront={() => {
                  sceneRef.current?.hold();
                  setArtifacts((list) => [...list.filter((x) => x.id !== a.id), ...list.filter((x) => x.id === a.id)]);
                }}
                onTalk={() => focusBot(a.botId)} onClose={() => closeCard(a.id)}
                onReply={(text, from) => {
                  const bot = state.bots.find((x) => x.id === a.botId);
                  if (!bot) return;
                  dispatch({ type: "send", botId: bot.id, threadId: bot.tasks?.some((task) => task.threadId === a.threadId) ? a.threadId : bot.threadId, text });
                  // the map composer's orb, leaving from the card's reply bar
                  sceneRef.current?.launch(from.left + from.width / 2, from.top + from.height / 2, bot.id);
                }}
                // the bot's Computer panel, where its desktop viewer lives
                // (the Orbit Computer panel's own "Open desktop")
                onOpenDesktop={() => { dispatch({ type: "select", id: a.botId }); dispatch({ type: "toggleComputer", open: true }); }} />
            );
          })}
        </div>

        {/* The map for keyboard and screen readers: one real button over each
            thing the canvas draws, in reading order (You, then each team,
            then channels). The scene keeps them in place. */}
        {!inFocus && model.connected && !JARVIS_SOLAR && (
          <div role="group" aria-label={t("orbit.map.aria")}>
            <MapHit hit="you" label={t("orbit.you")} onClick={() => setView({ kind: "you" })} />
            {model.teams.map((tm) => (
              <Fragment key={tm.key || "loose"}>
                {!tm.loose && <MapHit hit={`team:${tm.key}`} label={t("orbit.map.team", { team: tm.name })} onClick={() => setView({ kind: "team", key: tm.key })} />}
                {tm.memberIds.map((id) => {
                  const b = model.bots.find((x) => x.id === id);
                  if (!b) return null;
                  const status = b.waiting ? t("orbit.waitingOnYou") : b.mood === "stalled" ? t("orbit.runStalled") : b.busy ? t("orbit.val.working") : undefined;
                  return <MapHit key={id} hit={`bot:${id}`} label={b.name} description={status} onClick={() => focusBot(id)} />;
                })}
                {!tm.loose && canMake && <MapHit hit={`plus:${tm.key}`} label={t("orbit.newBotIn", { team: tm.name })} onClick={() => setView({ kind: "new", section: tm.key })} />}
              </Fragment>
            ))}
            {model.channels.map((ch) => <MapHit key={ch.id} hit={`channel:${ch.id}`} label={ch.name} onClick={() => openChannel(ch.id)} />)}
          </div>
        )}

        {inFocus && <BackToMap label={calendarCovered || ((sheetShown || claimShown) && view.kind === "you") ? t("orbit.you") : vmShown || sheetShown || claimShown ? focusedBot?.name : undefined}
          onClick={() => (claimShown ? closeStage() : sheetShown ? closeSheet() : calendarCovered ? dispatch({ type: "showChat" }) : vmShown ? setVmClose((n) => n + 1) : setView({ kind: "map" }))} />}

        {/* Pills under You on the map; the waiting pill stays up in a view */}
        {!inFocus && !JARVIS_SOLAR && (waiting.length + active.length + channelWaiting.length + channelActive.length > 0) && (
          <div data-orbit-under-you className="absolute z-10 flex -translate-x-1/2 items-start gap-2">
            {active.length + channelActive.length > 0 && <ActivePill entries={active} channels={channelActive} open={pill === "active"} onToggle={() => setPill(pill === "active" ? null : "active")} onJump={jump} onJumpChannel={jumpChannel} />}
            {waiting.length + channelWaiting.length > 0 && <WaitingPill entries={waiting} channels={channelWaiting} open={pill === "waiting"} onToggle={() => setPill(pill === "waiting" ? null : "waiting")} onOpen={jump} onOpenChannel={jumpChannel} />}
          </div>
        )}
        {inFocus && waiting.length + channelWaiting.length > 0 && (
          <div className="absolute top-3.5 z-[9]" style={{ right: chatW + 44 }}>
            <WaitingPill entries={waiting} channels={channelWaiting} open={pill === "waiting"} onToggle={() => setPill(pill === "waiting" ? null : "waiting")} onOpen={jump} onOpenChannel={jumpChannel} />
          </div>
        )}

        {/* Systems orbiting the focused bot, You, or a team */}
        {(sheetShown || claimShown) && <div data-orbit-stage-slot className="absolute bottom-5 left-6 top-[76px] z-[15] flex flex-col" style={{ right: chatW + 56 }} />}
        {calendarCovered && (
          <div className="absolute bottom-5 left-6 top-[76px] z-[15] flex" style={{ right: chatW + 56 }}>
            <RoutinesPage embedded onOpenRoom={openFromCalendar} />
          </div>
        )}
        {vmShown && (
          <div className="absolute bottom-5 left-6 top-[150px] z-[15] flex" style={{ right: chatW + 56 }}>
            <LocalVmWorkspace primaryBotId={vmWorkspace!} embedded closeRequest={vmClose}
              overlayOpen={paletteOpen || state.settingsOpen || state.appSettingsOpen || state.pluginsOpen || libraryOpen || aboutOpen || archivedOpen || newTeamOpen}
              onClose={() => setVmWorkspace(null)}
              onOpenComputer={(botId) => { setVmWorkspace(null); focusBot(botId); dispatch({ type: "toggleComputer", open: true }); }} />
          </div>
        )}

        {!JARVIS_SOLAR && inFocus && !showing && !covered && systems.map((sys, i) => {
          const p = geom.pos[i];
          if (!p) return null;
          const Icon = sys.icon;
          const tone = sys.tone === "danger" ? "#ff8a96" : sys.tone === "warning" ? "#ffb454" : sys.live && col ? col : undefined;
          return (
            <button key={`${view.kind}:${sys.key}`} data-orbit-sys data-tour={sys.tour ?? `cap-${sys.key}`} onClick={sys.run} aria-pressed={sys.selected}
              aria-label={sys.label} aria-description={[sys.value, sys.status].filter(Boolean).join(" · ")}
              style={{ left: p.x, top: p.y, opacity: 0, transform: "translate(-50%,-50%)", maxWidth: geom.compact ? 124 : 150 }}
              className={cn("absolute z-10 flex items-start gap-2 rounded-[10px] px-[9px] py-1.5 text-left leading-[1.2] hover:bg-ink/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent", sys.selected && "bg-ink/[0.07]")}>
              <Icon size={15} className="mt-0.5 shrink-0" style={{ color: sys.live ? (sys.tone === "warning" ? "#ff9800" : col) : undefined }} aria-hidden />
              <span className="flex min-w-0 flex-col gap-px">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink/45">{sys.label}</span>
                <span className="truncate text-[12.5px] font-medium text-ink">{sys.value}</span>
                {sys.status && (!geom.compact || sys.live) && <span className="truncate text-[11px] text-ink/45" style={{ color: tone }}>{sys.status}</span>}
              </span>
            </button>
          );
        })}

        {/* The right column: the chat (or a system's panel under its header), or a hub */}
        {inFocus && (
          <div className="orbit-column absolute bottom-[18px] right-[28px] top-[18px] z-20 flex flex-col animate-panel-in" style={{ width: chatW }}
            data-orbit-current={focusedBot?.threadId ?? focusedGroup?.threadId}>
            {/* dialogs open here, over the column (ColumnLayer) */}
            <div data-orbit-column-layer className="absolute inset-0 z-30 empty:hidden" />
            <ChatDivider width={chatW} onResize={(w) => { setPreferredChatWidth(w); setChatWidthRev((n) => n + 1); }} />
            {focusedBot ? (
              // the bot's computer and its inspector take the column, as its panels do
              state.computerOpen ? (remoteClient ? <RemoteDesktopPanel key={`computer:${focusedBot.id}`} bot={focusedBot} inColumn />
                : <ComputerPanel key={`computer:${focusedBot.id}`} bot={focusedBot} inColumn onOpenVmWorkspace={requestVmWorkspace} />)
              : state.inspectorOpen && !remoteClient ? <InspectorPanel key={focusedBot.threadId} bot={focusedBot} inColumn />
              : remoteSettings && remoteClient ? <RemoteAgentSettingsPanel bot={focusedBot} />
                : <ChatView key={focusedBot.id} bot={focusedBot}
                    panel={botPanel ? <BotDetail bot={focusedBot} panel={botPanel} onBack={() => setBotPanel(null)} open={setBotPanel} /> : undefined} />
            )
              : focusedGroup ? <GroupView key={focusedGroup.id} group={focusedGroup} />
              : view.kind === "you" ? <>
                  {/* the calendar's event details and editor take the column
                      while it is on the canvas (it portals them here) */}
                  {covered && <div data-orbit-calendar-column className="absolute inset-0 z-10 empty:pointer-events-none" />}
                  <HubHeader name={t("orbit.you")} sub={t("orbit.hub.youSub", { name: state.config?.profile?.name || t("orbit.hub.v.justYou") })} />
                  {state.appSettingsOpen ? <AppSettingsPanel /> : <YouHubPanel panel={youPanel} openLibrary={() => setLibraryOpen(true)} focusBot={focusBot} />}
                  <HiddenBots bots={(layout.hidden ?? []).map((id) => state.bots.find((b) => b.id === id)).filter((b): b is Bot => Boolean(b))} />
                  {!remoteClient && state.bots.some((b) => b.hidden) && (
                    <button type="button" onClick={() => orbitNavigate({ to: "archived" })}
                      className="mx-1.5 mt-2 flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-left hover:bg-ink/[0.05]">
                      <span className="min-w-0 flex-1 text-[13.5px] text-ink/90">{t("orbit.hub.archived")}</span>
                      <span className="text-[12px] text-ink/50">{t("orbit.hub.archivedCount", { count: state.bots.filter((b) => b.hidden).length })}</span>
                    </button>
                  )}
                </>
              : view.kind === "new" ? <>
                  <HubHeader name={t("orbit.new.name")} sub={t("orbit.new.sub")} />
                  <NewBotPanel key={view.section ?? ""} section={view.section} onCancel={() => setView({ kind: "map" })}
                    teamName={view.section ? model.teams.find((tm) => tm.key === view.section)?.name : undefined} />
                </>
              : focusedTeam ? <>
                  <HubHeader name={focusedTeam.loose ? t("orbit.noTeam") : focusedTeam.name} color={focusedTeam.color}
                    menu={!focusedTeam.loose && !remoteClient ? <TeamMenu teamKey={focusedTeam.key} memberCount={focusedTeam.memberIds.length}
                      onRenamed={(_, name) => setView({ kind: "team", key: name })} onDelete={() => setDeletingTeam(focusedTeam.key)} /> : undefined}
                    sub={`${tCount("orbit.val.members", focusedTeam.memberIds.length)} · ${focusedTeam.chiefId ? t("orbit.teamChiefSub", { name: state.bots.find((b) => b.id === focusedTeam.chiefId)?.name ?? "" }) : focusedTeam.coordinatorId ? t("orbit.teamCoordinated", { name: state.bots.find((b) => b.id === focusedTeam.coordinatorId)?.name ?? "" }) : t("orbit.teamNoChief")}`} />
                  {deletingTeam === focusedTeam.key && <TeamDeletePanel team={focusedTeam} onCancel={() => setDeletingTeam(null)}
                    onDeleted={() => { setDeletingTeam(null); setView({ kind: "map" }); }} />}
                  <TeamHubPanel team={focusedTeam} panel={teamPanel} focusBot={focusBot} openChannel={openChannel} computers={teamComputers} onComputers={setTeamComputers} onInstructions={setTeamInstructions}
                    onNewBot={(section) => setView({ kind: "new", section })}
                    onRenamed={(_, name) => setView({ kind: "team", key: name })} />
                </>
              : null}
          </div>
        )}

        {!inFocus && model.orbitAgent && !JARVIS_SOLAR && (
          <OrbitCorner agent={model.orbitAgent} onOpen={() => focusBot(model.orbitAgent!.id)} />
        )}
        {!inFocus && !JARVIS_SOLAR && (
          <MapControls legend={legend} onLegend={() => setLegend((v) => !v)} canNav={model.bots.length > 0}
            onZoomIn={() => sceneRef.current?.zoomBy(1.25)} onZoomOut={() => sceneRef.current?.zoomBy(1 / 1.25)} onFit={() => sceneRef.current?.fit()} />
        )}
        {!inFocus && state.connected && (model.bots.length > 0 || (JARVIS_SOLAR && model.orbitAgent)) && (
          JARVIS_SOLAR ? <SolarComposer model={model} onSent={botId => window.dispatchEvent(new CustomEvent('jarvis-solar-send', { detail: botId }))} />
            : <MapComposer onSent={(botId, rect) => sceneRef.current?.launch(rect.left + 40, rect.top + rect.height / 2, botId)} />
        )}

        {liveOffer && (() => {
          const b = state.bots.find((x) => x.id === liveOffer.botId);
          return b ? (
            <OfferPill key={liveOffer.key} offer={liveOffer} name={b.name} color={MAUS_COLORS[b.color]} pillRef={offerRef} solar={JARVIS_SOLAR}
              onFly={() => JARVIS_SOLAR ? focusBot(b.id) : sceneRef.current?.flyTo(b.id)} onView={() => present(liveOffer)} onLater={() => settle(liveOffer.key)} />
          ) : null;
        })()}

        {lineChoice && (!JARVIS_SOLAR || inFocus) && (() => {
          const a = state.bots.find((x) => x.id === lineChoice.a), b = state.bots.find((x) => x.id === lineChoice.b);
          if (!a || !b) return null;
          const plan = planTalk(a, b);
          const convo = conversationOf(a.id, b.id);
          return (
            <LineChooser a={a} b={b} x={lineChoice.x} y={lineChoice.y} bounds={size} onClose={() => setLineChoice(null)}
              avoid={[a.id, b.id].map((id) => sceneRef.current?.screenOf(id)).filter((p): p is { x: number; y: number } => Boolean(p))}
              talk={plan.ok ? { sub: t("orbit.line.talkSub", { a: plan.chief.name, team: plan.team }), run: () => letTalk(plan) } : { sub: plan.reason }}
              channel={convo
                ? { label: t("orbit.line.open"), sub: t("orbit.line.openSub"), run: () => openChannel(convo.id) }
                : remoteClient ? null
                : { label: t("orbit.line.new"), sub: t("orbit.line.newSub", { a: a.name, b: b.name }), run: () => dispatch({ type: "createGroup", memberIds: [a.id, b.id], ...(a.section?.trim() && a.section.trim() === b.section?.trim() ? { section: a.section.trim() } : {}) }) }} />
          );
        })()}

        {/* Loading, offline, empty and no-engines states, on the canvas */}
        {!state.connected && !everConnected && (JARVIS_SOLAR && !inFocus ? <div className="solar-connection-note solar-glass" role="status">{t('jarvis.solar.connecting')}</div> : <StartingCard />)}
        {/* the app's current error, over whichever view is open (it clears itself) */}
        {state.error && state.connected && (
          <div role="alert" className="absolute left-1/2 top-3.5 z-[11] flex max-w-[min(560px,calc(100%-40px))] -translate-x-1/2 items-start gap-2.5 rounded-[14px] border border-[#ff5667]/40 bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] py-2 pl-3 pr-1.5 shadow-[0_12px_30px_rgba(0,0,0,.4)] animate-pop-in">
            <span className="min-w-0 flex-1 whitespace-pre-wrap text-[13px] leading-[1.45] text-[#ff8a96]">{state.error}</span>
            <button type="button" onClick={() => dispatch({ type: "error", message: null })} aria-label={t("common.close")}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-ink/60 hover:text-ink"><X size={14} /></button>
          </div>
        )}
        {!state.connected && everConnected && (
          <div role="alert" className="absolute left-1/2 top-3.5 z-[11] flex max-w-[calc(100%-40px)] -translate-x-1/2 items-center gap-2.5 rounded-[14px] border border-[#e5484d] bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] py-1.5 pl-3 pr-1.5 shadow-[0_12px_30px_rgba(0,0,0,.4)] animate-pop-in">
            <WifiOff size={16} className="shrink-0 text-[#e5484d]" />
            <span className="text-[13px] leading-[1.4] text-ink/90">{t("orbit.offline", { host: window.location.host })}</span>
            <button type="button" onClick={() => window.location.reload()} className="h-7 shrink-0 rounded-[14px] bg-ink px-3 text-[12px] font-semibold text-app">{t("orbit.retry")}</button>
          </div>
        )}
        {empty && !noEngines && !inFocus && !JARVIS_SOLAR && (
          <EmptyCanvas onCreate={() => setView({ kind: "new", section: null })} onInstall={remoteClient ? undefined : () => setLibraryOpen(true)}
            onEngines={() => { setYouPanel("engines"); setView({ kind: "you" }); }} />
        )}
        {noEngines && JARVIS_SOLAR && !inFocus && <div className="solar-connection-note solar-glass" role="status"><span>{t('jarvis.solar.noEngine')}</span><button type="button" onClick={() => { setYouPanel('engines'); setView({ kind: 'you' }); }}>{t('jarvis.solar.configure')}</button></div>}
        {noEngines && (!JARVIS_SOLAR || inFocus) && (
          <div className="absolute inset-0 z-30 flex" style={{ background: "var(--color-app)" }}>
            <NoEngines />
          </div>
        )}
      </div>
      </div>

      {toast && <OrbitToast key={toast.id} toast={toast} onClose={() => setToast(null)}
        left={inFocus ? `calc(100% - ${Math.round(chatW / 2 + 28)}px)` : "50%"} />}
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      {newTeamOpen && canMake && <TeamDialog onClose={() => setNewTeamOpen(false)} />}
      {newChannelOpen && canMake && <NewChannelDialog onClose={() => setNewChannelOpen(false)} />}
      {archivedOpen && !remoteClient && (
        <ArchivedBotsDialog bots={state.bots.filter((b) => b.hidden)} onClose={() => setArchivedOpen(false)} onRestored={(text) => say(text)} />
      )}
      {!remoteClient && <button type="button" data-orbit-library hidden onClick={() => setLibraryOpen(true)} />}
      {state.pluginsOpen && <PluginsPanel />}
      {libraryOpen && !remoteClient && (
        <TeamLibraryPanel returnFocusRef={libraryReturnRef} initialUrl={installUrl ?? undefined}
          onClose={() => { setLibraryOpen(false); setInstallUrl(null); }}
          onImported={(result) => {
            setLibraryOpen(false);
            setInstallUrl(null);
            quietFollowUntilRef.current = performance.now() + 4000;
            setView({ kind: "map" });
            say(result.members === 1 ? t("sidebar.teamImportedOne") : t("sidebar.teamImportedMany", { count: result.members }));
          }} />
      )}
    </div>
    </SolarIdentityProvider>
  );
}

/** The organisation's logo and name in the title bar, when it has one. */
export function OrganizationMark() {
  const organization = useOrganizationBranding();
  if (!organization?.logo) return null;
  return (
    <span className="flex min-w-0 items-center gap-1.5" title={organization.name}>
      <img src={organization.logo} alt={`${organization.name} logo`} className="size-5 shrink-0 rounded object-contain" />
      <span className="max-w-[140px] truncate text-[12px] font-medium text-ink/60">{organization.name}</span>
    </span>
  );
}

/** First load (design: loading): the guide and what is being brought up.
 * Only the harness connection is real before the first snapshot; the rest
 * waits on it. */
// Solar paints progress in its own gold accent; Orbit keeps its blue.
const STARTING_ACCENT = JARVIS_SOLAR ? "bg-[var(--color-accent)]" : "bg-[#1084fe]";

function StartingCard() {
  const steps: Array<[string, "running" | "waiting"]> = [
    [t("orbit.start.harness", { host: window.location.host }), "running"],
    [t("orbit.start.bots"), "waiting"],
    [t("orbit.start.engines"), "waiting"],
    [t("orbit.start.computers"), "waiting"],
  ];
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-panel)_60%,transparent)]">
      <div role="status" className="flex flex-col items-center gap-3.5 text-center">
        <GuideCharacter mood="searching" size={120} />
        <span className="text-[20px] font-semibold">{t("orbit.start.title", { app: brand().name })}</span>
        <div className="flex w-[310px] flex-col gap-[9px]">
          {steps.map(([label, s]) => (
            <div key={label} className="flex items-center gap-2.5 text-[13px] text-ink/80">
              <span className={cn("size-2 rounded-full", s === "running" ? STARTING_ACCENT : "bg-ink/20")} />
              <span className="flex-1 text-left">{label}</span>
              <span className="text-[11.5px] text-ink/50">{s === "running" ? t("orbit.start.checking") : ""}</span>
            </div>
          ))}
        </div>
        <div className="h-[3px] w-[310px] overflow-hidden rounded-sm bg-ink/[0.08]">
          <div className={cn("h-full w-1/3 animate-pulse", STARTING_ACCENT)} />
        </div>
      </div>
    </div>
  );
}

/** No bots yet (design: empty): make one, install a team, or check the
 * engines, with the engines on this computer listed underneath. */
function EmptyCanvas({ onCreate, onInstall, onEngines }: { onCreate: () => void; onInstall?: () => void; onEngines: () => void }) {
  const { state } = useStore();
  const pill = "h-9 rounded-[18px] px-4 text-[13px]";
  return (
    <div className="absolute left-1/2 top-1/2 z-[5] flex w-[min(430px,calc(100%-40px))] -translate-x-1/2 -translate-y-[40%] flex-col items-center gap-3.5 text-center animate-rise">
      <GuideCharacter mood="happy" size={110} />
      <span className="text-[22px] font-semibold">{t("orbit.empty.title")}</span>
      <span className="text-[14px] leading-[1.55] text-ink/70">{t("orbit.empty.body")}</span>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onCreate} className={cn(pill, "bg-ink font-semibold text-app")}>{t("orbit.empty.create")}</button>
        {onInstall && <button type="button" onClick={onInstall} className={cn(pill, "border border-ink/[0.16] font-medium")}>{t("orbit.empty.install")}</button>}
        <button type="button" onClick={onEngines} className={cn(pill, "border border-ink/[0.16] font-medium")}>{t("orbit.empty.engines")}</button>
      </div>
      {state.instances.length > 0 && (
        <div className="mt-2.5 flex w-full flex-col gap-1.5 text-left">
          <span className="font-mono text-[10px] tracking-[0.1em] text-ink/50">{t("orbit.empty.enginesHere")}</span>
          {state.instances.map((i) => {
            const ready = i.snapshot.state === "available" && i.snapshot.authenticated !== false;
            const signIn = i.snapshot.state === "available" && i.snapshot.authenticated === false;
            return (
              <div key={i.instanceId} className="flex h-10 items-center gap-2.5 rounded-[10px] border border-ink/10 pl-3 pr-1.5">
                <span className={cn("size-[7px] shrink-0 rounded-full", ready ? "bg-[#38d591]" : signIn ? "bg-[#ff9800]" : "bg-ink/20")} />
                <span className="flex-1 truncate text-[13.5px]">{i.displayName}</span>
                <span className="text-[12px] text-ink/50">{ready ? t("orbit.empty.signedIn") : signIn ? t("orbit.empty.notSignedIn") : t("orbit.empty.notInstalled")}</span>
                {signIn && <button type="button" onClick={onEngines} className="h-7 rounded-[14px] bg-ink px-3 text-[12px] font-semibold text-app">{t("orbit.empty.signIn")}</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** One map object as a real control, laid over what the canvas drew. A
 * press is handed to the canvas, so dragging, hover and the + handle work
 * exactly as on the bare map; Tab reaches it and shows a ring, and Enter or
 * Space (a click with no pointer behind it) opens it. */
function MapHit({ hit, label, description, onClick }: { hit: string; label: string; description?: string; onClick: () => void }) {
  const canvas = (el: Element) => el.closest(".orbit-stage")?.querySelector<HTMLCanvasElement>("canvas[data-orbit-canvas]");
  return (
    <button type="button" data-orbit-hit={hit} aria-label={label} aria-description={description}
      onPointerDown={(e) => { canvas(e.currentTarget)?.dispatchEvent(new PointerEvent("pointerdown", e.nativeEvent)); }}
      onWheel={(e) => { canvas(e.currentTarget)?.dispatchEvent(new WheelEvent("wheel", e.nativeEvent)); }}
      onClick={(e) => { if (e.detail === 0) onClick(); }}
      style={{ display: "none" }}
      className="absolute z-[3] cursor-pointer rounded-full bg-transparent outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
  );
}

function HiddenBots({ bots }: { bots: Bot[] }) {
  if (!bots.length) return null;
  return (
    <div className="flex flex-col gap-0.5 px-1.5 pt-2">
      <span className="pb-1.5 font-mono text-[10px] tracking-[0.1em] text-ink/50">{t("orbit.hub.hidden").toUpperCase()}</span>
      {bots.map((bot) => (
        <button key={bot.id} type="button" onClick={() => window.dispatchEvent(new CustomEvent(ORBIT_HIDE_EVENT, { detail: { botId: bot.id, show: true } }))}
          className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-left hover:bg-ink/[0.05]">
          <span className="size-[7px] rounded-full" style={{ background: MAUS_COLORS[bot.color] }} />
          <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink/90">{bot.name}</span>
          <span className="text-[12px] text-ink/50">{t("orbit.hub.showOnMap")}</span>
        </button>
      ))}
    </div>
  );
}

/** The handle on the chat column's left edge. Drag to widen or narrow the
 * chat; double-click for the default width; arrow keys when focused. The
 * width is remembered (setPreferredChatWidth) and clamped by focusGeom. */
function ChatDivider({ width, onResize }: { width: number; onResize: (width: number | null) => void }) {
  const [dragging, setDragging] = useState(false);
  // the running drag's cleanup, so an unmount mid-drag leaves nothing behind
  const stop = useRef<(() => void) | null>(null);
  useEffect(() => () => stop.current?.(), []);
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t("orbit.chatDivider")}
      aria-valuenow={width}
      tabIndex={0}
      title={t("orbit.chatDividerHint")}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        stop.current?.();
        const handle = event.currentTarget;
        const right = handle.parentElement!.getBoundingClientRect().right;
        try { handle.setPointerCapture(event.pointerId); } catch { /* pointer already gone */ }
        setDragging(true);
        // Listen on the window, and end the drag on anything that means the
        // button is no longer down: a release we never heard (outside the
        // window, over the title bar) otherwise left the handle following
        // the mouse on every later hover.
        const move = (e: PointerEvent) => {
          if ((e.buttons & 1) === 0) { end(); return; }
          onResize(right - e.clientX);
        };
        const end = () => {
          setDragging(false);
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", end);
          window.removeEventListener("pointercancel", end);
          window.removeEventListener("blur", end);
          handle.removeEventListener("lostpointercapture", end);
          stop.current = null;
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
        window.addEventListener("blur", end);
        handle.addEventListener("lostpointercapture", end);
        stop.current = end;
      }}
      onDoubleClick={() => onResize(null)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); onResize(width + 32); }
        else if (event.key === "ArrowRight") { event.preventDefault(); onResize(width - 32); }
      }}
      className="group absolute -left-[14px] bottom-0 top-0 z-40 flex w-[10px] cursor-col-resize items-center justify-center outline-none"
    >
      <span className={cn("h-10 w-[3px] rounded-full transition-colors",
        dragging ? "bg-ink/45" : "bg-ink/10 group-hover:bg-ink/30 group-focus-visible:bg-ink/45")} />
    </div>
  );
}
