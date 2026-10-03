// Orbit's view model: everything the canvas draws, derived from the store.
// Nothing here invents data — bots, sections, Chiefs, channels, activity and
// approval levels all come from AppState (spec §1).

import type { AppState, Bot, Group } from "@/state/store";
import { MAUS_COLORS } from "@/lib/mascot";
import { buildTeamMapSections } from "@/lib/team-map";
import type { ApprovalMode } from "../../shared/approval-mode";
import type { Mood } from "./characters";

export interface OrbitBot {
  id: string;
  name: string;
  color: string;
  teamKey: string;
  chief: boolean;
  /** mood derived from the bot's own state; the scene layers short
   * transient moods (sending, surprised, happy) on top */
  mood: Mood;
  busy: boolean;
  waiting: boolean;
  unread: boolean;
  /** pinned by the person: a pin before its name on the map */
  pinned: boolean;
  /** the tool the running turn is using, if the transcript shows one */
  tool: string | null;
  approval: ApprovalMode;
  /** the bot's latest message id, so the scene can notice arrivals */
  lastMessageId: string | null;
  lastMessageRole?: string | null;
  /** when an idle bot with nothing unread last did anything (epoch ms);
   * after SLEEP_AFTER_MS of that the scene draws it asleep */
  quietSince: number | null;
}

/** How long an idle bot stays awake before it dozes off, as the prototype's
 * characters do. Anything new wakes it: a turn, a message, an unread reply. */
export const SLEEP_AFTER_MS = 30 * 60 * 1000;

/** The newest thing this bot did: any of its threads, or its last message. */
export function lastActiveAt(bot: Pick<Bot, "messages" | "tasks">): number {
  let at = bot.messages[bot.messages.length - 1]?.at ?? 0;
  for (const task of bot.tasks ?? []) at = Math.max(at, task.updatedAt ?? task.createdAt ?? 0);
  return at;
}

export interface OrbitTeam {
  key: string;
  name: string;
  color: string;
  chiefId: string | null;
  /** a Chief from another team that manages this one */
  coordinatorId: string | null;
  memberIds: string[];
  /** bots with no section: drawn loose around You, no glow or label */
  loose: boolean;
}

export interface OrbitChannel {
  id: string;
  name: string;
  color: string;
  memberIds: string[];
  rule: "lead" | "everyone" | "mentions";
  leadId: string | null;
  unread: boolean;
}

/** "Can talk": a Chief the owner let work with another team (its
 * managedSections), drawn from the Chief to that team's lead. */
export interface OrbitLink {
  from: string;
  to: string;
  section: string;
}

/** Two bots that have talked: the auto-created bot⇄bot channel their
 * ask/delegate exchanges are mirrored into. Clicking the line opens it. */
export interface OrbitConversation {
  a: string;
  b: string;
  groupId: string;
  unread: boolean;
}

export interface OrbitModel {
  bots: OrbitBot[];
  /** The built-in Orbit agent: in the map's corner, not among the teams, so
   * nothing on the map reads as reporting to it (docs/design/orbit-agent.md). */
  orbitAgent?: OrbitBot | null;
  teams: OrbitTeam[];
  channels: OrbitChannel[];
  links: OrbitLink[];
  conversations: OrbitConversation[];
  connected: boolean;
}

export interface Point { x: number; y: number }
export interface Offset { dx: number; dy: number }
export interface OrbitLayout {
  teams: Record<string, Offset>;
  bots: Record<string, Offset>;
  /** "Hidden from the map": a view preference, separate from archiving */
  hidden?: string[];
}

export const YOU: Point = { x: 0, y: 0 };
export const CHIEF_R = 34;
export const MEMBER_R = 23;

export function botHex(bot: Pick<Bot, "color">): string {
  return MAUS_COLORS[bot.color] ?? MAUS_COLORS.blue;
}

/** The running tool, read from the newest activity row of a busy turn. */
export function runningTool(bot: Bot): string | null {
  if (!bot.busy) return null;
  for (let i = bot.messages.length - 1; i >= 0; i--) {
    const m = bot.messages[i];
    if (m.role === "user") return null;
    if (m.kind === "activity" && m.tool) return m.tool.ok === undefined ? m.tool.name : null;
  }
  return null;
}

export function moodFor(bot: Bot, connected: boolean): Mood {
  if (!connected) return "sleepy";
  if (bot.activity === "dead" || bot.activity === "no-signal") return "stalled";
  if (bot.activity === "waiting-on-you") return "pleading";
  if (bot.busy || bot.activity === "working") return runningTool(bot) ? "focused" : "thinking";
  return "idle";
}

function channelRule(group: Group): OrbitChannel["rule"] {
  const r = group.defaultResponder;
  return r.kind === "member" ? "lead" : r.kind;
}

/** `order` ranks bots by when this map first saw them, so a new bot (the
 * store puts it first) joins the end and teams keep their places. */
export function buildModel(state: Pick<AppState, "bots" | "groups" | "sections" | "connected">, hidden: readonly string[] = [], order?: ReadonlyMap<string, number>): OrbitModel {
  const off = new Set(hidden);
  const rank = (id: string) => order?.get(id) ?? Number.MAX_SAFE_INTEGER;
  const agent = state.bots.find((b) => b.system === "orbit") ?? null;
  const visible = state.bots.filter((b) => !b.hidden && !off.has(b.id) && b.system !== "orbit").sort((a, b) => rank(a.id) - rank(b.id));
  const sections = buildTeamMapSections(visible, state.sections ?? []);
  const byId = new Map(visible.map((b) => [b.id, b]));
  const teams: OrbitTeam[] = sections.map((section) => {
    const chief = section.chiefs[0] ?? null;
    // Extra Chiefs in one section stay members on the map; the first leads.
    const members = [...section.chiefs.slice(1), ...section.members];
    const coordinator = chief
      ? null
      : visible.find((b) => b.chiefOfStaff && b.section?.trim() !== section.key && b.managedSections?.includes(section.key)) ?? null;
    const lead = chief ?? members[0];
    return {
      key: section.key,
      name: section.name,
      color: lead ? botHex(lead) : "#9aa0aa",
      chiefId: chief?.id ?? null,
      coordinatorId: coordinator?.id ?? null,
      memberIds: [...(chief ? [chief.id] : []), ...members.map((m) => m.id)],
      loose: section.key === "",
    };
  });
  const chiefIds = new Set(teams.map((t) => t.chiefId).filter(Boolean) as string[]);
  const toOrbitBot = (bot: Bot): OrbitBot => {
    const last = bot.messages[bot.messages.length - 1];
    return {
      id: bot.id,
      name: bot.name,
      color: botHex(bot),
      teamKey: bot.section?.trim() || "",
      chief: chiefIds.has(bot.id),
      mood: moodFor(bot, state.connected),
      busy: Boolean(bot.busy || bot.activity === "working"),
      waiting: bot.activity === "waiting-on-you",
      unread: bot.unread,
      pinned: Boolean(bot.pinned),
      tool: runningTool(bot),
      approval: bot.approvalMode ?? (bot.autoApprove ? "auto" : "ask"),
      lastMessageId: last?.id ?? null,
      lastMessageRole: last?.role ?? null,
      quietSince: moodFor(bot, state.connected) === "idle" && !bot.unread ? lastActiveAt(bot) || null : null,
    };
  };
  const bots: OrbitBot[] = visible.map(toOrbitBot);
  const orbitAgent = agent ? toOrbitBot(agent) : null;
  const channels: OrbitChannel[] = state.groups
    .filter((g) => !g.dm)
    .map((g) => {
      const memberIds = g.memberIds.filter((id) => byId.has(id));
      const lead = g.defaultResponder.kind === "member" ? g.defaultResponder.botId : null;
      return {
        id: g.id,
        name: g.name.startsWith("#") ? g.name : `#${g.name}`,
        color: botHex(byId.get(lead ?? memberIds[0] ?? "") ?? { color: "purple" }),
        memberIds,
        rule: channelRule(g),
        leadId: lead,
        unread: g.unread,
      };
    })
    .filter((c) => c.memberIds.length > 0);
  const links: OrbitLink[] = [];
  for (const bot of visible) {
    if (!bot.chiefOfStaff || !Array.isArray(bot.managedSections)) continue;
    const own = bot.section?.trim() || "";
    for (const section of new Set(bot.managedSections.map((s) => s.trim()))) {
      if (!section || section === own) continue;
      const team = teams.find((tm) => tm.key === section);
      const to = team?.chiefId ?? team?.memberIds.find((id) => id !== bot.id);
      if (to) links.push({ from: bot.id, to, section });
    }
  }
  const conversations: OrbitConversation[] = state.groups.flatMap((g) => {
    if (!g.dm) return [];
    const ids = g.memberIds.filter((id) => byId.has(id));
    return ids.length === 2 ? [{ a: ids[0], b: ids[1], groupId: g.id, unread: g.unread }] : [];
  });
  return { bots, orbitAgent, teams, channels, links, conversations, connected: state.connected };
}

/** Team centres around You. A few teams sit on an arc above You; more wrap
 * the whole way round. Deterministic, so the map is stable across reloads. */
export function teamCentres(teams: OrbitTeam[], layout: OrbitLayout): Record<string, Point> {
  const placed = teams.filter((t) => !t.loose);
  const n = placed.length;
  const out: Record<string, Point> = {};
  const radius = n <= 1 ? 440 : Math.max(480, 150 * n / Math.PI + 260);
  placed.forEach((team, i) => {
    const a = n <= 4
      ? -Math.PI / 2 + (n === 1 ? 0 : (i / (n - 1) - 0.5) * (Math.PI * (n === 2 ? 0.55 : 0.8)))
      : -Math.PI / 2 + (i / n) * Math.PI * 2;
    const o = layout.teams[team.key] ?? { dx: 0, dy: 0 };
    out[team.key] = { x: YOU.x + Math.cos(a) * radius + o.dx, y: YOU.y + Math.sin(a) * radius * 0.85 + o.dy };
  });
  return out;
}

// Bots with no team sit either side of You, clear of the pills under it.
const LOOSE_ANGLES = [168, 12, 198, -18, 142, 38, 222, -42, 120, 60];

/** The i-th loose slot around You (also where a new teamless bot lands). */
export function looseSpot(i: number): Point {
  const a = (LOOSE_ANGLES[i % LOOSE_ANGLES.length] * Math.PI) / 180;
  const r = 230 + Math.floor(i / LOOSE_ANGLES.length) * 100;
  return { x: YOU.x + Math.cos(a) * r, y: YOU.y + Math.sin(a) * r };
}

/** Home position of every visible bot. Chiefs sit at their team's centre;
 * teammates fan out on the side away from You. */
export function botHomes(model: OrbitModel, layout: OrbitLayout): Record<string, Point & { chief: boolean }> {
  const centres = teamCentres(model.teams, layout);
  const pos: Record<string, Point & { chief: boolean }> = {};
  const off = (id: string) => layout.bots[id] ?? { dx: 0, dy: 0 };
  for (const team of model.teams) {
    if (team.loose) {
      team.memberIds.forEach((id, i) => {
        const p = looseSpot(i);
        pos[id] = { x: p.x + off(id).dx, y: p.y + off(id).dy, chief: false };
      });
      continue;
    }
    const c = centres[team.key];
    const base = Math.atan2(c.y - YOU.y, c.x - YOU.x);
    const others = team.memberIds.filter((id) => id !== team.chiefId);
    if (team.chiefId) pos[team.chiefId] = { x: c.x + off(team.chiefId).dx, y: c.y + off(team.chiefId).dy, chief: true };
    const perRing = 6;
    others.forEach((id, i) => {
      const ring = Math.floor(i / perRing);
      const inRing = Math.min(perRing, others.length - ring * perRing);
      const k = i % perRing;
      const rad = (team.chiefId ? 170 : 140) + ring * 90;
      const spread = (team.chiefId ? 1.0 : 1.15) * (1 - ring * 0.25);
      const a = base + (k - (inRing - 1) / 2) * spread * (inRing > 3 ? 0.8 : 1);
      pos[id] = { x: c.x + Math.cos(a) * rad + off(id).dx, y: c.y + Math.sin(a) * rad + off(id).dy, chief: false };
    });
  }
  return pos;
}

/** Where a team's "+ new bot" slot sits: the widest free direction around
 * its centre, clear of You, its label and its members (design: plusRects). */
export function teamPlusSpot(team: OrbitTeam, centre: Point, homes: Record<string, Point & { chief: boolean }>): Point {
  const a0 = Math.atan2(YOU.y - centre.y, YOU.x - centre.x);
  const la = Math.sin(a0 - 1.0) < Math.sin(a0 + 1.0) ? a0 - 1.0 : a0 + 1.0;
  const used = [a0 - 0.7, a0, a0 + 0.7, la, ...team.memberIds.filter((id) => homes[id] && !homes[id].chief).map((id) => Math.atan2(homes[id].y - centre.y, homes[id].x - centre.x))]
    .map((v) => (v + Math.PI * 4) % (Math.PI * 2)).sort((p, q) => p - q);
  let best = -1, a = 0;
  used.forEach((v, i) => {
    const next = i + 1 < used.length ? used[i + 1] : used[0] + Math.PI * 2;
    if (next - v > best) { best = next - v; a = v + (next - v) / 2; }
  });
  // the design's distance, stepped out only while it would sit on a member
  // or the name under it
  const members = team.memberIds.map((id) => homes[id]).filter(Boolean);
  const clash = (r: number) => members.some((m) => {
    const px = centre.x + Math.cos(a) * r, py = centre.y + Math.sin(a) * r;
    return Math.abs(px - m.x) < 70 && py - m.y > -60 && py - m.y < 85;
  });
  let r = 150;
  for (let step = 0; step < 12 && clash(r); step++) r += 20;
  return { x: centre.x + Math.cos(a) * r, y: centre.y + Math.sin(a) * r };
}

/** A channel sits between its members, pulled a little toward You. */
export function channelPos(channel: OrbitChannel, homes: Record<string, Point>): Point {
  const pts = channel.memberIds.map((id) => homes[id]).filter(Boolean);
  if (!pts.length) return { ...YOU };
  const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  // pulled toward You until it clears every bot: from the members' middle it
  // could land right on a Chief sitting between them and You
  const clear = CHIEF_R + 52;
  let pull = 0.38;
  const at = (k: number) => ({ x: cx + (YOU.x - cx) * k, y: cy + (YOU.y - cy) * k });
  for (let step = 0; step < 10; step++) {
    const p = at(pull);
    if (!Object.values(homes).some((h) => Math.hypot(h.x - p.x, h.y - p.y) < clear)) break;
    pull = Math.min(0.9, pull + 0.07);
  }
  return at(pull);
}

const CHAT_WIDTH_KEY = "orbit.chatWidth.v1";
/** The narrowest the ring side may get while the chat is widened. */
export const MIN_RING_SIDE = 360;
let preferredChatWidth: number | null = (() => {
  try {
    const saved = Number(localStorage.getItem(CHAT_WIDTH_KEY));
    return Number.isFinite(saved) && saved >= 300 ? saved : null;
  } catch { return null; }
})();

/** The chat column's width in a bot or hub view: the width the person
 * dragged it to, else 40% of the window up to 440px. Always at least 300px,
 * and never so wide that the ring side drops under MIN_RING_SIDE. */
export function chatColumnWidth(W: number): number {
  const fallback = Math.max(300, Math.min(440, W * 0.4));
  const wanted = preferredChatWidth ?? fallback;
  return Math.round(Math.max(300, Math.min(wanted, W - 28 - MIN_RING_SIDE)));
}

/** Remember a dragged width; null returns to the default. */
export function setPreferredChatWidth(width: number | null): void {
  preferredChatWidth = width === null ? null : Math.max(300, Math.round(width));
  try {
    if (preferredChatWidth === null) localStorage.removeItem(CHAT_WIDTH_KEY);
    else localStorage.setItem(CHAT_WIDTH_KEY, String(preferredChatWidth));
  } catch { /* private window: this session only */ }
}

/** Where the system labels sit around a focused bot or hub: an ellipse to
 * the left of the chat column, starting at the top, clockwise. */
export function focusGeom(W: number, H: number, count: number, chatWidth = chatColumnWidth(W)) {
  const chatW = chatWidth;
  const left = W - 28 - chatW;
  const fx = Math.max(160, left / 2), fy = H / 2 + 14;
  const rx = Math.max(110, Math.min(left / 2 - 70, 300));
  const ry = Math.max(120, Math.min(H / 2 - 62, 250));
  const pos: Point[] = [];
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + i * ((Math.PI * 2) / Math.max(1, count));
    pos.push({ x: fx + Math.cos(a) * rx, y: Math.max(78, Math.min(H - 34, fy + Math.sin(a) * ry)) });
  }
  return { chatW, fx, fy, pos, compact: rx < 260 };
}

const LAYOUT_KEY = "orbit.layout.v1";
const ORDER_KEY = "orbit.order.v1";

/** The order this map first saw each bot in, kept across reloads (the
 * server lists the newest bot first, which would reshuffle the teams). */
export function loadBotOrder(): Map<string, number> {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "null");
    if (Array.isArray(raw)) return new Map(raw.filter((id): id is string => typeof id === "string").map((id, i) => [id, i]));
  } catch { /* storage unavailable */ }
  return new Map();
}

export function saveBotOrder(order: ReadonlyMap<string, number>) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify([...order.keys()])); } catch { /* storage unavailable */ }
}

export function loadLayout(): OrbitLayout {
  try {
    const raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "null");
    if (raw && typeof raw === "object") return { teams: raw.teams ?? {}, bots: raw.bots ?? {}, hidden: Array.isArray(raw.hidden) ? raw.hidden : [] };
  } catch { /* storage unavailable */ }
  return { teams: {}, bots: {}, hidden: [] };
}

export function saveLayout(layout: OrbitLayout) {
  try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch { /* storage unavailable */ }
}
