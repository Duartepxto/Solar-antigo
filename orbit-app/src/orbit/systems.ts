// The labels that orbit a focused bot, You, or a team. Each one reads its
// value from the store and opens the existing panel that owns that setting
// (spec §4: adapt, don't reinvent).

import { AppWindow, Blocks, Brain, CalendarClock, Cpu, Mic, Monitor, ShieldCheck, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import type { AppState, Bot } from "@/state/store";
import { t } from "@/lib/i18n";
import { effectivePlace, placeLabelKey } from "@/lib/place";
import type { LocaleKey } from "@/locales";
import type { BotPanelKey } from "./detail/BotPanels";
import { routineNextLabel } from "@/lib/routine-display";
import { isRoutineProblemRun } from "../../shared/routines";

export interface OrbitSystem {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  status: string;
  /** amber: something here is waiting on you; red: something failed */
  tone?: "warning" | "danger";
  /** in use this turn: the line to the orb animates in the bot's colour */
  live?: boolean;
  /** this system's panel is the one open */
  selected?: boolean;
  tour?: string;
  run(): void;
}

function modelLabel(bot: Bot, state: AppState) {
  const inst = state.instances.find((i) => i.instanceId === bot.modelSelection.instanceId);
  const model = inst?.models.options.find((o) => o.id === bot.modelSelection.model)?.label ?? bot.modelSelection.model;
  return { model: model || inst?.models.default || "—", engine: inst?.displayName ?? bot.modelSelection.instanceId };
}

/** Facts a bot's systems show that live behind their own routes; fetched
 * while the bot is in view. */
export interface BotFacts {
  skills?: { on: number; total: number; first?: string };
  memory?: { lines: number; maxLines: number; topics: number; level: "ok" | "near" | "over" };
}

export function botSystems(bot: Bot, state: AppState, openPanel: (panel: BotPanelKey) => void, facts: BotFacts, activePanel: BotPanelKey | null): OrbitSystem[] {
  const { model, engine } = modelLabel(bot, state);
  const effort = bot.modelSelection.effort;
  const level = bot.approvalMode ?? (bot.autoApprove ? "auto" : "ask");
  const place = effectivePlace(bot);
  const routines = state.routines.filter((r) => r.botId === bot.id);
  const activeRoutines = routines.filter((r) => r.enabled).length;
  const failedRun = state.routineRuns.some((r) => r.botId === bot.id && isRoutineProblemRun(r) && !r.seenAt);
  const mcp = bot.mcpServers;
  const busy = Boolean(bot.busy);
  const waiting = bot.activity === "waiting-on-you";
  const hasScreen = place === "cloud" || place === "vm" || place === "local";
  const browserOn = bot.browser !== false && place !== "off";
  const sys = (key: BotPanelKey, icon: LucideIcon, label: LocaleKey, value: string, status: string, extra: Partial<OrbitSystem> = {}): OrbitSystem =>
    ({ key, icon, label: t(label), value, status, run: () => openPanel(key), selected: activePanel === key, ...extra });
  const nextRoutine = routines.find((r) => r.enabled);
  return [
    sys("engine", Cpu, "orbit.sys.engine", `${engine} · ${effort ? `${model} · ${effort}` : model}`, busy ? t("orbit.st.streaming") : t("orbit.st.ready"), { tour: "cap-engine", live: busy }),
    sys("computer", Monitor, "orbit.sys.computer", t(placeLabelKey(place)), busy && hasScreen ? t("orbit.st.live") : place === "off" ? t("orbit.st.none") : t("orbit.st.idle"), { tour: "cap-computer", live: busy && hasScreen }),
    sys("browser", AppWindow, "orbit.sys.browser", browserOn ? t("orbit.st.ownProfile") : t("orbit.val.off"), browserOn ? t("orbit.st.logins") : t("orbit.st.unavailable")),
    sys("phone", Smartphone, "orbit.sys.phone", t("orbit.st.phone"), t("orbit.st.pairPhone")),
    sys("apps", Blocks, "orbit.sys.apps", mcp == null ? t("orbit.st.mcpAll") : mcp.length ? t("orbit.val.mcpCount", { count: mcp.length }) : t("orbit.val.off"), t("orbit.st.mcpServers"), { tour: "cap-apps" }),
    sys("approvals", ShieldCheck, "orbit.sys.approvals", t(`approvalMode.${level}.label` as LocaleKey), waiting ? t("orbit.val.waiting") : t("orbit.st.nothingPending"), { tone: waiting ? "warning" : undefined, live: waiting }),
    sys("skills", Sparkles, "orbit.sys.skills", facts.skills ? (facts.skills.total ? t("orbit.st.skillsOn", { on: facts.skills.on, total: facts.skills.total }) : t("orbit.st.noSkills")) : t("orbit.sys.skills"), facts.skills?.first ?? t("orbit.st.reusable")),
    sys("memory", Brain, "orbit.sys.memory", facts.memory ? t("orbit.st.lines", { lines: facts.memory.lines, max: facts.memory.maxLines }) : "MEMORY.md", facts.memory ? t("orbit.st.topics", { count: facts.memory.topics }) : t("orbit.st.notes"), { tone: facts.memory?.level === "over" ? "danger" : facts.memory?.level === "near" ? "warning" : undefined }),
    sys("routines", CalendarClock, "orbit.sys.routines", routines.length ? t("orbit.st.active", { count: activeRoutines }) : t("orbit.st.noRoutines"), failedRun ? t("orbit.st.lastFailed") : nextRoutine ? routineNextLabel(nextRoutine) : t("orbit.st.addOne"), { tour: "cap-routines", tone: failedRun ? "danger" : undefined }),
    sys("voice", Mic, "orbit.sys.voice", bot.voice || t("orbit.p.voice.default"), bot.speakReplies ? t("orbit.val.readAloud") : t("orbit.st.silent")),
  ];
}
