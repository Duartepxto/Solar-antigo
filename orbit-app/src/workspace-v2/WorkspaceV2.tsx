import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Maximize2, Minus, Pause, Play, Plus, Sprout, X } from "lucide-react";
import { useStore, type Bot } from "@/state/store";
import { t } from "@/lib/i18n";
import { MAUS_COLORS } from "@/lib/mascot";
import { buildModel } from "@/orbit/model";
import { solarNodes } from "@/orbit/solar-model";
import { emptySolarSkins } from "@/orbit/solar-skins";
import { createWorkspaceScene, type WorkspaceSceneAgent, type WorkspaceSceneHandle, type WorkspaceSkin } from "./scene";
import "./workspace-v2.css";

const SKINS: WorkspaceSkin[] = ["solar", "lunar", "ocean", "ember"];
const SKIN_KEY = "solar.workspace-v2.agent-skins.v1";
const MOTION_KEY = "solar.workspace-v2.motion.v1";

function readSkins(): Record<string, WorkspaceSkin> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SKIN_KEY) ?? "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter((entry): entry is [string, WorkspaceSkin] => SKINS.includes(entry[1] as WorkspaceSkin)));
  } catch { return {}; }
}

function readMotion(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try { return localStorage.getItem(MOTION_KEY) !== "off"; } catch { return true; }
}

function activity(bot: Bot): "offline" | "waiting" | "working" | "ready" {
  if (bot.activity === "dead" || bot.activity === "no-signal") return "offline";
  if (bot.activity === "waiting-on-you") return "waiting";
  if (bot.busy || bot.activity === "working") return "working";
  return "ready";
}

export function WorkspaceV2({ onExit, onOpenConversation, windowChrome }: {
  onExit: () => void;
  onOpenConversation: (id: string) => void;
  windowChrome?: string;
}) {
  const { state } = useStore();
  const model = useMemo(() => buildModel(state), [state.bots, state.groups, state.sections, state.connected]);
  // Derive the same hierarchy as Solar. Passing a pure skin map prevents the
  // experimental garden from saving or reassigning the original map's skins.
  const nodes = useMemo(() => solarNodes(model, emptySolarSkins()).filter(node => node.bot), [model]);
  const bots = nodes.flatMap(node => {
    const bot = state.bots.find(candidate => candidate.id === node.bot?.id);
    return bot ? [bot] : [];
  });
  const host = bots.find(bot => nodes.some(node => node.id === bot.id && node.kind === "sun"));
  const teams = model.teams.map(team => ({ ...team, members: team.memberIds.filter(id => id !== host?.id).flatMap(id => {
    const bot = bots.find(candidate => candidate.id === id);
    return bot ? [bot] : [];
  }) })).filter(team => team.members.length);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WorkspaceSceneHandle | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [skins, setSkins] = useState(readSkins);
  const [motion, setMotion] = useState(readMotion);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [sceneStatus, setSceneStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sceneAttempt, setSceneAttempt] = useState(0);
  const [skinSaveError, setSkinSaveError] = useState(false);
  const selected = bots.find(bot => bot.id === selectedId);
  // Live transcripts can update many times a second. Only character identity,
  // activity and appearance belong in the renderer's update transaction.
  const sceneSnapshot = JSON.stringify(bots.map(bot => {
    const identity = model.bots.find(candidate => candidate.id === bot.id) ?? model.orbitAgent;
    const team = model.teams.find(candidate => candidate.key === identity?.teamKey);
    return { id: bot.id, name: bot.name, busy: activity(bot) === "working",
      waiting: activity(bot) === "waiting", color: MAUS_COLORS[bot.color], skin: skins[bot.id] ?? "solar",
      host: bot.id === host?.id, chief: identity?.chief ?? false,
      teamKey: identity?.teamKey ?? "", teamName: team?.loose ? t("workspaceV2.unassigned") : team?.name ?? "" };
  }));
  const sceneAgents = useMemo<WorkspaceSceneAgent[]>(() => JSON.parse(sceneSnapshot), [sceneSnapshot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    const controller = new AbortController();
    setSceneStatus("loading");
    void createWorkspaceScene(canvas, {
      signal: controller.signal,
      onSelect: setSelectedId,
      onReady: () => { if (!disposed) setSceneStatus("ready"); },
      onError: () => { if (!disposed) setSceneStatus("error"); },
    }).then(handle => {
      if (disposed) { handle.dispose(); return; }
      sceneRef.current = handle;
      setSceneStatus("ready");
    }).catch(() => { if (!disposed) setSceneStatus("error"); });
    return () => { disposed = true; controller.abort(); sceneRef.current?.dispose(); sceneRef.current = null; };
  }, [sceneAttempt]);

  useEffect(() => { sceneRef.current?.setAgents(sceneAgents); }, [sceneAgents, sceneStatus]);
  useEffect(() => { sceneRef.current?.focusAgent(selectedId); }, [selectedId, sceneStatus]);
  useEffect(() => { sceneRef.current?.setMotion(motion); }, [motion, sceneStatus]);
  useEffect(() => {
    if (selectedId && !bots.some(bot => bot.id === selectedId)) setSelectedId(null);
  }, [sceneSnapshot, selectedId]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { setReducedMotion(preference.matches); if (preference.matches) setMotion(false); };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  const changeSkin = (skin: WorkspaceSkin) => {
    if (!selected) return;
    const next = { ...skins, [selected.id]: skin };
    setSkins(next);
    try { localStorage.setItem(SKIN_KEY, JSON.stringify(next)); setSkinSaveError(false); }
    catch { setSkinSaveError(true); }
  };
  const toggleMotion = () => {
    const next = !motion;
    setMotion(next);
    try { localStorage.setItem(MOTION_KEY, next ? "on" : "off"); } catch { /* session preference still applies */ }
  };
  const workingCount = bots.filter(bot => activity(bot) === "working").length;
  const waitingCount = bots.filter(bot => activity(bot) === "waiting").length;
  const selectedTeam = selected && teams.find(team => team.members.some(bot => bot.id === selected.id));
  const rosterAgent = (bot: Bot) => <li key={bot.id}><button aria-label={t("workspaceV2.selectAgent", { name: bot.name })} data-agent-id={bot.id} onClick={() => setSelectedId(bot.id)}><span className="workspace-v2-roster-dot" style={{ backgroundColor: MAUS_COLORS[bot.color] }} /><span className="workspace-v2-roster-name"><strong>{bot.name}</strong><small>{bot.title || bot.section || t("workspaceV2.agent")}</small></span><span className="workspace-v2-roster-status" data-status={activity(bot)}>{t(`workspaceV2.status.${activity(bot)}`)}</span></button></li>;
  const workspaceHref = new URL(window.location.href);
  workspaceHref.searchParams.delete("workspace");

  return <main className="workspace-v2" data-window-chrome={windowChrome}>
    <header className="workspace-v2-header">
      <div className="workspace-v2-brand"><Sprout size={25} aria-hidden="true" /><span>{t("workspaceV2.title")}<small>{t("workspaceV2.experimental")}</small></span></div>
      <a href={`${workspaceHref.pathname}${workspaceHref.search}${workspaceHref.hash}`} onClick={event => { event.preventDefault(); onExit(); }} className="workspace-v2-exit"><ArrowLeft size={14} aria-hidden="true" />{t("workspaceV2.return")}</a>
    </header>
    <div className="workspace-v2-body">
      <section className="workspace-v2-stage" aria-label={t("workspaceV2.sceneLabel")} data-scene-status={sceneStatus}>
        <canvas ref={canvasRef} aria-label={t("workspaceV2.sceneDescription")} />
        <div className="workspace-v2-stage-heading"><h1>{t("workspaceV2.worldTitle")}</h1><p>{t("workspaceV2.worldDescription")}</p></div>
        {sceneStatus === "error" && <div className="workspace-v2-scene-message" role="alert"><h2>{t("workspaceV2.sceneErrorTitle")}</h2><p>{t("workspaceV2.sceneError")}</p><button className="workspace-v2-primary" onClick={() => setSceneAttempt(attempt => attempt + 1)}>{t("workspaceV2.retry")}</button></div>}
        {sceneStatus === "loading" && <div className="workspace-v2-scene-loading" role="status">{t("workspaceV2.sceneLoading")}</div>}
        <div className="workspace-v2-stage-footer"><p>{t("workspaceV2.navigationHint")}</p><div className="workspace-v2-tools" aria-label={t("workspaceV2.cameraControls")}>
          <button onClick={() => sceneRef.current?.setZoom(-1)} aria-label={t("workspaceV2.zoomOut")} disabled={sceneStatus !== "ready"}><Minus size={17} /></button>
          <button onClick={() => sceneRef.current?.setZoom(1)} aria-label={t("workspaceV2.zoomIn")} disabled={sceneStatus !== "ready"}><Plus size={17} /></button>
          <button onClick={() => { setSelectedId(null); sceneRef.current?.resetCamera(); }} aria-label={t("workspaceV2.overview")} disabled={sceneStatus !== "ready"}><Maximize2 size={16} /></button>
          <span className="workspace-v2-tool-divider" />
          <button onClick={toggleMotion} aria-label={reducedMotion ? t("workspaceV2.reducedMotion") : motion ? t("workspaceV2.pauseMotion") : t("workspaceV2.resumeMotion")} title={reducedMotion ? t("workspaceV2.reducedMotion") : undefined} disabled={reducedMotion} aria-pressed={motion}>{motion ? <Pause size={16} /> : <Play size={16} />}</button>
        </div></div>
      </section>
      <aside className="workspace-v2-column" aria-label={selected ? t("workspaceV2.agentDetails") : t("workspaceV2.agents")}>
        {!state.connected && bots.length > 0 && <p className="workspace-v2-save-error" role="status">{t("workspaceV2.connectionError")}</p>}
        {selected ? <>
          <div className="workspace-v2-column-title"><h2>{selected.name}</h2><button onClick={() => setSelectedId(null)} aria-label={t("workspaceV2.closeDetails")}><X size={18} /></button></div>
          <p className="workspace-v2-agent-title">{selected.title || selected.section || t("workspaceV2.agent")}</p>
          <p className="workspace-v2-team-context">{selected.id === host?.id ? t("workspaceV2.hostContext") : selectedTeam ? t("workspaceV2.teamContext", { team: selectedTeam.loose ? t("workspaceV2.unassigned") : selectedTeam.name }) : t("workspaceV2.unassigned")}</p>
          <div className="workspace-v2-status" data-status={activity(selected)}><i />{t(`workspaceV2.status.${activity(selected)}`)}</div>
          {selected.description && <p className="workspace-v2-description">{selected.description}</p>}
          <button className="workspace-v2-primary workspace-v2-chat" onClick={() => onOpenConversation(selected.id)}>{t("workspaceV2.openConversation")}<ArrowUpRight size={16} /></button>
          <section className="workspace-v2-appearance"><h3>{t("workspaceV2.appearance")}</h3><p>{t("workspaceV2.appearanceDescription")}</p><div className="workspace-v2-skins">
            {SKINS.map(skin => <button key={skin} data-skin={skin} aria-pressed={(skins[selected.id] ?? "solar") === skin} onClick={() => changeSkin(skin)}><span className="workspace-v2-swatch" /><span>{t(`workspaceV2.skin.${skin}`)}</span>{(skins[selected.id] ?? "solar") === skin && <Check size={14} aria-hidden="true" />}</button>)}
          </div>{skinSaveError && <p className="workspace-v2-save-error" role="status">{t("workspaceV2.skinSaveError")}</p>}</section>
          <p className="workspace-v2-detail-note">{t("workspaceV2.conversationNote")}</p>
        </> : <>
          <div className="workspace-v2-column-title"><h2>{t("workspaceV2.agents")}</h2><span className="workspace-v2-count">{bots.length}</span></div>
          {!state.connected && !state.error && <p className="workspace-v2-description" role="status">{t("workspaceV2.connecting")}</p>}
          {!state.connected && state.error && <p className="workspace-v2-save-error" role="alert">{t("workspaceV2.connectionError")}</p>}
          {state.connected && bots.length === 0 && <div className="workspace-v2-empty"><h3>{t("workspaceV2.emptyTitle")}</h3><p>{t("workspaceV2.emptyDescription")}</p><button className="workspace-v2-primary" onClick={onExit}>{t("workspaceV2.return")}</button></div>}
          {bots.length > 0 && <><p className="workspace-v2-summary">{t("workspaceV2.summary", { working: workingCount, waiting: waitingCount })}</p>
            {host && <section className="workspace-v2-team"><h3>{t("workspaceV2.hostTitle")}</h3><ul className="workspace-v2-roster">{rosterAgent(host)}</ul></section>}
            {teams.map(team => <section className="workspace-v2-team" key={team.key} data-team-key={team.key}><h3>{team.loose ? t("workspaceV2.unassigned") : team.name}<span>{team.members.length}</span></h3><ul className="workspace-v2-roster">{team.members.map(rosterAgent)}</ul></section>)}
            <p className="workspace-v2-detail-note">{t("workspaceV2.selectHint")}</p></>}
        </>}
      </aside>
    </div>
  </main>;
}
