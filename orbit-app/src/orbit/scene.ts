// The Orbit canvas: an imperative scene driven by requestAnimationFrame.
// React owns the data (OrbitModel) and the HTML chrome; the scene owns the
// camera, the characters' animation state, particle streams and hit tests.

import { clamp, drawChar, drawYou, hexRgb, newCharState, sprite, type CharState, type Mood, type RGB } from "./characters";
import { botHomes, channelPos, CHIEF_R, SLEEP_AFTER_MS, focusGeom, looseSpot, MEMBER_R, teamCentres, teamPlusSpot, YOU, type OrbitConversation, type OrbitLayout, type OrbitLink, type OrbitModel, type Point } from "./model";
import { toolIcon } from "./tool-icons";

export type OrbitView =
  | { kind: "map" }
  | { kind: "bot"; id: string }
  | { kind: "you" }
  | { kind: "team"; key: string }
  | { kind: "channel"; id: string }
  /** the New bot column; the ghost waits where the bot will land */
  | { kind: "new"; section: string | null };

export interface SceneCallbacks {
  onBot(id: string): void;
  onYou(): void;
  onTeam(key: string): void;
  onChannel(id: string): void;
  onBackground(): void;
  onLayout(layout: OrbitLayout): void;
  /** dragged from one bot's + onto another; x/y is the drop point on the stage */
  onLink(from: string, to: string, x: number, y: number): void;
  onUnlink(link: OrbitLink): void;
  /** a line between two bots that have talked: their bot⇄bot channel */
  onConversation(groupId: string): void;
  onNewBot(section: string | null): void;
}

export interface SceneLabels {
  you: string;
  clickToTalk: string;
  clickForSettings: string;
  waitingOnYou: string;
  stalled: string;
  chief(name: string): string;
  coordinatedBy(name: string): string;
  noChief: string;
  channelRule(count: number, rule: "lead" | "everyone" | "mentions"): string;
  newBot: string;
  newBotIn(team: string): string;
  canTalk: string;
  conversation: string;
  /** which grant a pill removes when a pair has one each way */
  grant(chief: string, team: string): string;
}

interface Sim {
  x: number; y: number; R: number;
  c: CharState;
  toolA: number;
  doneAt: number;
  busy: boolean;
  waiting: boolean;
  lastMessageId: string | null;
  lookAt: Point | null;
  /** talking until then: offering or showing a file (prototype: speakUntil) */
  speakUntil?: number;
  /** on a call: the call's phase decides the face */
  call?: Mood;
}

interface Stream {
  /** `to` is a character; `toPt` a world point instead (a card being shown) */
  from: string; to: string; toPt?: Point; color: string;
  parts: Array<{ x: number; y: number; px: number; py: number; vx: number; vy: number; in: boolean; w: number }>;
  t0: number; n: number; fired: boolean;
}

interface Cam { x: number; y: number; s: number; scx: number; scy: number }

type Drag =
  | { kind: "pan"; x0: number; y0: number; cx: number; cy: number; moved: boolean }
  | { kind: "bot"; id: string; team: string | null; x0: number; y0: number; lx: number; ly: number; moved: boolean }
  | { kind: "click"; target: Hit; x0: number; y0: number }
  | { kind: "link"; from: string; x: number; y: number; over: string | null };

type Hit =
  | { kind: "bot"; id: string }
  | { kind: "you" }
  | { kind: "team"; key: string }
  | { kind: "channel"; id: string }
  | { kind: "plus"; key: string }
  | { kind: "unlink"; link: OrbitLink }
  | { kind: "conversation"; groupId: string };

/** A line between two bots: a "can talk" grant, a past conversation, or both. */
interface Line { key: string; link?: OrbitLink; groupId?: string; unread?: boolean; both?: boolean; ax: number; ay: number; bx: number; by: number }
interface HoverLine { key: string; link?: OrbitLink; groupId?: string; mx: number; my: number; w: number }

const YOU_RGB: RGB = [232, 235, 244];
const WAIT_LINE = "rgba(255,152,0,0.6)";

export class OrbitScene {
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private raf = 0;
  private lt = 0;
  private now = 0;
  private model: OrbitModel = { bots: [], teams: [], channels: [], links: [], conversations: [], connected: false };
  private quietSince = new Map<string, number>();
  private layout: OrbitLayout = { teams: {}, bots: {} };
  private homes: Record<string, Point & { chief: boolean }> = {};
  private sims = new Map<string, Sim>();
  /** The Orbit agent's character: not in the world (no place, no hit test),
   * only its corner face and the centre of its ring when opened. */
  private orbitSim: Sim | null = null;
  private you: CharState = newCharState(YOU_RGB, 0.7, 0);
  private youHits: Array<{ t: number; a: number; rgb: RGB }> = [];
  private streams: Stream[] = [];
  private cam: Cam = { x: 0, y: -200, s: 0.6, scx: 600, scy: 350 };
  private goal: (Cam & { user?: boolean }) | null = null;
  private view: OrbitView = { kind: "map" };
  private systems = 0;
  private liveSystems = new Set<number>();
  private warnSystems = new Set<number>();
  private orbs: Array<{ x0: number; y0: number; to: string; color: string; t0: number }> = [];
  /** "wants to show you": the file offer pill, placed beside its bot */
  private offer: { el: HTMLElement; botId: string } | null = null;
  private offerPos: { botId: string; x: number; y: number; idx: number; ring: boolean } | null = null;
  /** the card shown full size in a bot's view (world rect), if any */
  private showing: { x: number; y: number; w: number; h: number } | null = null;
  private wk: { tx: number; ty: number; k: number } | null = null;
  /** every card on the canvas: fitting the map keeps them in view */
  private cards: Array<{ botId: string; x: number; y: number; w: number; h: number }> = [];
  private covered = false;
  private suspended = false;
  /** artifact cards live in world units inside this layer */
  private worldEl: HTMLElement | null = null;
  private fT = 0;
  private youBig = 0;
  private revealKey: string | null = null;
  private revealT0 = 0;
  private revealDone = false;
  private hover: Hit | null = null;
  private drag: Drag | null = null;
  private pointer: Point | null = null;
  private labelRects: Record<string, [number, number, number, number]> = {};
  private channelRects: Record<string, [number, number, number, number]> = {};
  private plusRects: Record<string, [number, number, number, number]> = {};
  private botRects: Record<string, [number, number, number, number]> = {};
  private youRect: [number, number, number, number] | null = null;
  private camMoving = false;
  /** the + on a hovered bot: drag from it onto another bot to connect them */
  private handle: { id: string; x: number; y: number } | null = null;
  private lineGeom: Line[] = [];
  private hoverLine: HoverLine | null = null;
  private ink = "252,252,252";
  private line = "255,255,255";
  private quality = 1;
  private qLevel = 0;
  /** Last pointer, wheel or view change: the map redraws at full rate for a
   * moment after, so it answers at once. */
  private lastActive = -9;
  /** characters for faces of bots that are not on the map */
  private offMap = new Map<string, CharState>();
  /** bots on a call: a speaking face draws at the full frame rate */
  private onCall = 0;
  /** how loud the voice playing now is (0..1), for a talking mouth */
  private voiceLevel: (() => number | undefined) | null = null;
  /** You talking on a call: while your words come in */
  private youTalkUntil = -9;
  private lastDraw = -9;
  private draws = 0;
  private ema = 0;
  private qT = 0;
  private frame = 0;
  private reduced = false;
  private ro: ResizeObserver;
  private disposers: Array<() => void> = [];
  private initialFit = true;

  constructor(private canvas: HTMLCanvasElement, private stage: HTMLElement, private cb: SceneCallbacks, private labels: SceneLabels) {
    this.ctx = canvas.getContext("2d")!;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    this.reduced = mq?.matches ?? false;
    const onMq = (e: MediaQueryListEvent) => { this.reduced = e.matches; };
    mq?.addEventListener?.("change", onMq);
    this.disposers.push(() => mq?.removeEventListener?.("change", onMq));
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(stage);
    this.resize();
    this.readTheme();
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      this.disposers.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };
    on(canvas, "wheel", (e) => this.onWheel(e), { passive: false });
    on(canvas, "pointerdown", (e) => this.onDown(e));
    on(window, "pointermove", (e) => this.onMove(e));
    on(window, "pointerup", (e) => this.onUp(e));
    on(window, "blur", () => { this.drag = null; });
    on(canvas, "pointerleave", () => { this.pointer = null; this.hover = null; });
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.disposers.forEach((d) => d());
  }

  setLabels(labels: SceneLabels) { this.labels = labels; }

  readTheme() {
    const css = getComputedStyle(this.stage);
    const ink = css.getPropertyValue("--color-ink").trim();
    if (/^#[0-9a-f]{6}/i.test(ink)) {
      this.ink = hexRgb(ink).join(",");
      // Light skins draw dark lines; dark skins draw light ones.
      this.line = this.ink;
    }
  }

  setModel(model: OrbitModel, layout: OrbitLayout) {
    this.lastActive = this.now;
    this.model = model;
    this.quietSince = new Map([...model.bots, ...(model.orbitAgent ? [model.orbitAgent] : [])]
      .flatMap((b) => b.quietSince ? [[b.id, b.quietSince] as const] : []));
    this.layout = layout;
    this.homes = botHomes(model, layout);
    const t = this.now || performance.now() / 1000;
    const seen = new Set<string>();
    const chiefOfTeam = new Map(model.teams.map((tm) => [tm.key, tm.chiefId]));
    model.bots.forEach((bot, i) => {
      seen.add(bot.id);
      const h = this.homes[bot.id] ?? { x: 0, y: 0, chief: false };
      let s = this.sims.get(bot.id);
      if (!s) {
        s = { x: h.x, y: h.y, R: h.chief ? CHIEF_R : MEMBER_R, c: newCharState(hexRgb(bot.color), i * 1.7 + 0.3, t), toolA: Math.random() * 6, doneAt: -9, busy: bot.busy, waiting: bot.waiting, lastMessageId: bot.lastMessageId, lookAt: null };
        this.sims.set(bot.id, s);
        return;
      }
      s.c.rgb = hexRgb(bot.color);
      const chief = chiefOfTeam.get(bot.teamKey);
      const boss = chief && chief !== bot.id ? chief : "you";
      if (!s.busy && bot.busy) this.emit(boss, bot.id, boss === "you" ? "#fcfcfc" : this.colorOf(boss), 16);
      if (s.busy && !bot.busy) {
        s.doneAt = t;
        this.emit(bot.id, boss, "#38d591", 16);
      }
      if (!s.waiting && bot.waiting) this.emit(bot.id, "you", "#ff9800", 14);
      if (s.lastMessageId !== bot.lastMessageId && s.lastMessageId !== null) s.c.flash = t;
      s.busy = bot.busy;
      s.waiting = bot.waiting;
      s.lastMessageId = bot.lastMessageId;
    });
    for (const id of this.sims.keys()) if (!seen.has(id)) this.sims.delete(id);
    const agent = model.orbitAgent;
    if (!agent) this.orbitSim = null;
    else if (!this.orbitSim) {
      this.orbitSim = { x: 0, y: 0, R: CHIEF_R, c: newCharState(hexRgb(agent.color), 0.9, t), toolA: 0, doneAt: -9, busy: agent.busy, waiting: agent.waiting, lastMessageId: agent.lastMessageId, lookAt: null };
    } else {
      const s = this.orbitSim;
      s.c.rgb = hexRgb(agent.color);
      if (s.busy && !agent.busy) s.doneAt = t;
      if (s.lastMessageId !== agent.lastMessageId && s.lastMessageId !== null) s.c.flash = t;
      s.busy = agent.busy;
      s.waiting = agent.waiting;
      s.lastMessageId = agent.lastMessageId;
    }
    if (this.initialFit && model.bots.length) {
      this.initialFit = false;
      this.goal = null;
      this.snapTo(this.fitGoal());
    }
  }

  setView(view: OrbitView, systems: number, live: number[] = [], warn: number[] = []) {
    this.lastActive = this.now;
    const was = this.view;
    this.view = view;
    // the ring comes back (a screen that covered the stage closed): its
    // labels mount hidden and wait for the reveal, so play it again
    if (systems !== this.systems) this.revealKey = null;
    this.systems = systems;
    this.liveSystems = new Set(live);
    this.warnSystems = new Set(warn);
    if (view.kind === "map" && was.kind !== "map" && !this.goal?.user) this.goal = null;
  }

  /** A particle stream between two characters ("you" or a bot id). */
  emit(from: string, to: string, color: string, n = 24) {
    const A = this.pos(from), B = this.pos(to);
    if (!A || !B || this.reduced) {
      if (B) this.arrive(from, to, color);
      return;
    }
    const s = this.sims.get(from);
    if (s) { s.c.kick = this.now; s.lookAt = B; }
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const parts = Array.from({ length: n }, () => {
      const a = Math.atan2(uy, ux) + (Math.random() - 0.5) * 1.8, sp = 2.5 + Math.random() * 3;
      return { x: A.x + ux * 10, y: A.y + uy * 10, px: A.x, py: A.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, in: false, w: 0.85 + Math.random() * 0.4 };
    });
    this.streams.push({ from, to, color, parts, t0: this.now, n: 0, fired: false });
  }

  zoomBy(k: number) { this.zoomAt(this.W / 2, this.H / 2, k); }

  /** A sent message: a small light orb arcs from a point on screen (the
   * composer) to the bot, and flashes it on arrival (README §3, Sending). */
  launch(clientX: number, clientY: number, to: string, color = "#fcfcfc") {
    const r = this.canvas.getBoundingClientRect();
    if (this.reduced) { const s = this.sims.get(to); if (s) s.c.flash = this.now; return; }
    this.orbs.push({ x0: clientX - r.left, y0: clientY - r.top, to, color, t0: this.now });
  }

  fit() {
    this.goal = null;
    this.cb.onBackground();
  }

  /** Where a bot is on screen right now (for pills that point at it). */
  screenOf(id: string): Point | null {
    const p = this.pos(id);
    if (!p) return null;
    const [x, y] = this.S(p.x, p.y);
    return { x, y };
  }

  /** The offer pill to keep beside its bot on the map (null: none). */
  setOffer(el: HTMLElement | null, botId: string | null) {
    this.offer = el && botId ? { el, botId } : null;
    if (!this.offer) this.offerPos = null;
  }

  /** The layer artifact cards sit in, positioned in world units. */
  setWorldLayer(el: HTMLElement | null) { this.worldEl = el; }

  /** In a bot's view, the card it is showing takes the stage left of the
   * chat and the bot moves up to the corner (prototype: focusShow). */
  setShowing(rect: { x: number; y: number; w: number; h: number } | null) { this.showing = rect; }

  /** Keep the camera where it is (a card being dragged would otherwise
   * move the fit it is part of). */
  hold() { if (!this.goal) this.goal = { ...this.cam, user: true }; }

  /** A screen (the calendar) takes the stage beside the column: the focused
   * character steps up to the corner, as it does for a card it shows. */
  setCovered(covered: boolean) { this.covered = covered; }
  setSuspended(suspended: boolean) { this.suspended = suspended; }

  /** The cards on the canvas, so Fit frames them with the bots. */
  setCards(rects: Array<{ botId: string; x: number; y: number; w: number; h: number }>) { this.cards = rects; }

  /** The pill's body: glide to its bot on the map. */
  flyTo(botId: string) {
    const s = this.sims.get(botId);
    if (!s || this.view.kind !== "map") return;
    this.goal = { x: s.x, y: s.y, s: Math.max(this.cam.s, 0.75), scx: this.W / 2, scy: this.H / 2 - 20, user: true };
  }

  /** Frame a world rectangle (a new card and its team). */
  frameRect(x0: number, y0: number, x1: number, y1: number) {
    const top = 56, bottom = this.H - 84, aw = this.W - 60, ah = bottom - top;
    this.goal = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, s: clamp(Math.min(aw / (x1 - x0), ah / (y1 - y0)), 0.12, 1.4), scx: this.W / 2, scy: top + ah / 2, user: true };
  }

  /** Current camera scale, for dragging a card in world units. */
  scale(): number { return this.cam.s; }

  /** A card was put on the canvas: particles fly from the bot to it and the
   * bot turns to look (prototype: present). */
  present(botId: string, to: Point) {
    const s = this.sims.get(botId);
    if (!s) return;
    s.c.kick = this.now;
    s.speakUntil = this.now + 2.2;
    s.lookAt = to;
    if (this.reduced) return;
    const parts = Array.from({ length: 26 }, () => {
      const a = Math.random() * 6.28, sp = 2 + Math.random() * 3;
      return { x: s.x, y: s.y, px: s.x, py: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, in: false, w: 0.9 + Math.random() * 0.4 };
    });
    this.streams.push({ from: botId, to: botId, toPt: to, color: this.colorOf(botId), parts, t0: this.now, n: 0, fired: false });
  }

  /** A bot with something to show turns to You (prototype: offerShow). */
  lookAtYou(botId: string) {
    const s = this.sims.get(botId);
    if (s) { s.c.kick = this.now; s.speakUntil = this.now + 1.4; s.lookAt = { ...YOU }; }
  }

  /** A call's phase shows on the bot itself (null: the call ended). */
  setCall(botId: string, mood: Mood | null) {
    const s = this.sims.get(botId);
    if (!s) return;
    s.call = mood ?? undefined;
    this.onCall = [...this.sims.values()].filter((x) => x.call).length;
    // on the line it faces You; hanging up lets its gaze wander again
    s.lookAt = mood ? { ...YOU } : null;
    this.lastActive = this.now;
  }

  /** The level of the voice playing, read each frame by a talking bot. */
  setVoiceLevel(level: (() => number | undefined) | null) { this.voiceLevel = level; }

  /** Your words are coming in on a call: You talks for a moment. */
  youTalk() { this.youTalkUntil = this.now + 0.45; this.lastActive = this.now; }

  /** A bot's place on the canvas (world units). */
  worldOf(id: string): Point | null { return this.pos(id); }

  /** Where a card for this bot goes (prototype: each team's art spot): off
   * the team's far side from You, the n-th card stacked past the others. */
  artifactSpot(botId: string, n: number, w: number, h: number): Point {
    const team = this.model.teams.find((tm) => tm.memberIds.includes(botId) && !tm.loose);
    const members = (team?.memberIds ?? [botId]).map((id) => this.sims.get(id)).filter((m): m is Sim => Boolean(m));
    const cx = members.length ? members.reduce((a, m) => a + m.x, 0) / members.length : YOU.x;
    const cy = members.length ? members.reduce((a, m) => a + m.y, 0) / members.length : YOU.y;
    const spread = Math.max(120, ...members.map((m) => Math.hypot(m.x - cx, m.y - cy) + m.R));
    const dx = cx - YOU.x, dy = cy - YOU.y;
    if (Math.abs(dx) >= Math.abs(dy) * 0.8) {
      const x = dx >= 0 ? cx + spread + 80 : cx - spread - 80 - w;
      return { x: x + n * 36, y: cy - 240 + n * (h + 70) };
    }
    const y = dy >= 0 ? cy + spread + 80 : cy - spread - 80 - h;
    return { x: cx - w / 2 + n * (w + 60), y };
  }

  // ---- geometry -------------------------------------------------------

  private nameOf(id: string) {
    return this.model.bots.find((b) => b.id === id)?.name ?? "";
  }

  private colorOf(id: string) {
    return this.model.bots.find((b) => b.id === id)?.color ?? "#fcfcfc";
  }

  private pos(id: string): Point | null {
    if (id === "you") return YOU;
    return this.sims.get(id) ?? null;
  }

  private S(x: number, y: number): [number, number] {
    const c = this.cam;
    return [(x - c.x) * c.s + c.scx, (y - c.y) * c.s + c.scy];
  }

  private resize() {
    const r = this.stage.getBoundingClientRect();
    if (r.width < 50) return;
    this.dpr = Math.min([2, 1.5, 1][this.qLevel], window.devicePixelRatio || 1);
    this.W = r.width;
    this.H = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private fitGoal(): Cam {
    let x0 = YOU.x - 360, x1 = YOU.x + 360, y0 = YOU.y - 260, y1 = YOU.y + 260;
    for (const p of Object.values(this.homes)) {
      x0 = Math.min(x0, p.x - 170); x1 = Math.max(x1, p.x + 170);
      y0 = Math.min(y0, p.y - 150); y1 = Math.max(y1, p.y + 150);
    }
    for (const c of this.cards) {
      x0 = Math.min(x0, c.x - 40); x1 = Math.max(x1, c.x + c.w + 40);
      y0 = Math.min(y0, c.y - 40); y1 = Math.max(y1, c.y + c.h + 40);
    }
    const top = 56, bottom = this.H - 84, aw = this.W - 60, ah = bottom - top;
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, s: clamp(Math.min(aw / (x1 - x0), ah / (y1 - y0)), 0.12, 1.4), scx: this.W / 2, scy: top + ah / 2 };
  }

  private snapTo(c: Cam) { this.cam = { ...c }; }

  private camTarget(): Cam {
    const v = this.view;
    const g = focusGeom(this.W, this.H, this.systems);
    // the Orbit agent has no place on the map: opening it leaves the camera
    // where it is, and its character is drawn at the ring's centre instead
    if (v.kind === "bot" && this.orbitSim && v.id === this.model.orbitAgent?.id) return { ...this.cam };
    if (v.kind === "bot") {
      const s = this.sims.get(v.id);
      if (s && (this.showing || this.covered)) return { x: s.x, y: s.y, s: 22 / s.R, scx: 52, scy: 102 };
      if (s) return { x: s.x, y: s.y, s: Math.min(60, this.H * 0.1) / s.R, scx: g.fx, scy: g.fy };
    }
    if (v.kind === "you" && this.covered) return { x: YOU.x, y: YOU.y, s: 0.78, scx: 52, scy: 100 };
    if (v.kind === "you") return { x: YOU.x, y: YOU.y, s: 2.2, scx: g.fx, scy: g.fy };
    if (v.kind === "team") {
      const c = teamCentres(this.model.teams, this.layout)[v.key];
      if (c) return { x: c.x, y: c.y, s: Math.min((g.fx * 2) / 760, this.H / 720), scx: g.fx, scy: g.fy };
    }
    if (v.kind === "channel") {
      const ch = this.model.channels.find((c) => c.id === v.id);
      if (ch) {
        const p = channelPos(ch, this.homes);
        return { x: p.x, y: p.y + 60, s: Math.min((g.fx * 2) / 1150, this.H / 760), scx: g.fx, scy: g.fy };
      }
      // a bot⇄bot conversation: frame the pair
      const c = this.model.conversations.find((x) => x.groupId === v.id);
      const A = c && this.sims.get(c.a), B = c && this.sims.get(c.b);
      if (A && B) {
        const span = Math.max(260, Math.hypot(A.x - B.x, A.y - B.y) + 260);
        return { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, s: Math.min((g.fx * 2) / span, this.H / 640, 1.4), scx: g.fx, scy: g.fy };
      }
    }
    if (v.kind === "new") {
      const sp = this.newSpot(v.section);
      return { x: (YOU.x + sp.x) / 2, y: (YOU.y + sp.y) / 2 - 20, s: Math.min(1.15, (g.fx * 2) / 760, this.H / 640), scx: g.fx, scy: g.fy };
    }
    return this.goal ?? this.fitGoal();
  }

  /** Where a bot made now would land: its team's + slot, or the next free
   * spot around You. */
  private newSpot(section: string | null): Point {
    const team = section != null ? this.model.teams.find((tm) => tm.key === section && !tm.loose) : null;
    if (team) {
      const c = teamCentres(this.model.teams, this.layout)[team.key];
      if (c) return teamPlusSpot(team, c, this.homes);
    }
    return looseSpot(this.model.teams.find((tm) => tm.loose)?.memberIds.length ?? 0);
  }

  private zoomAt(mx: number, my: number, k: number) {
    if (this.view.kind !== "map") return;
    if (!this.goal) this.goal = { ...this.cam, user: true };
    const g = this.goal;
    const ns = clamp(g.s * k, 0.12, 3.2);
    const wx = (mx - g.scx) / g.s + g.x, wy = (my - g.scy) / g.s + g.y;
    g.x = wx - (mx - g.scx) / ns;
    g.y = wy - (my - g.scy) / ns;
    g.s = ns;
    g.user = true;
  }

  // ---- input ----------------------------------------------------------

  private local(e: PointerEvent | WheelEvent): Point {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private hitTest(p: Point): Hit | null {
    const cs = this.cam.s;
    let best: { id: string; d: number } | null = null;
    for (const [id, s] of this.sims) {
      const [x, y] = this.S(s.x, s.y);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < Math.max(14, s.R * cs * 1.3) && (!best || d < best.d)) best = { id, d };
    }
    if (best) return { kind: "bot", id: best.id };
    const [yx, yy] = this.S(YOU.x, YOU.y);
    const yr = this.youRadius();
    if (Math.hypot(p.x - yx, p.y - yy) < Math.max(16, yr * 1.4)) return { kind: "you" };
    for (const [key, r] of Object.entries(this.labelRects)) if (p.x >= r[0] && p.x <= r[2] && p.y >= r[1] && p.y <= r[3]) return { kind: "team", key };
    for (const [id, r] of Object.entries(this.channelRects)) if (p.x >= r[0] && p.x <= r[2] && p.y >= r[1] && p.y <= r[3]) return { kind: "channel", id };
    for (const [key, r] of Object.entries(this.plusRects)) if (p.x >= r[0] && p.x <= r[2] && p.y >= r[1] && p.y <= r[3]) return { kind: "plus", key };
    const hl = this.hoverLine;
    if (hl && this.onPill(p, hl)) {
      // the × at the pill's right end removes a grant; the rest opens the conversation
      if (hl.link && (!hl.groupId || p.x > hl.mx + hl.w / 2 - 24)) return { kind: "unlink", link: hl.link };
      if (hl.groupId) return { kind: "conversation", groupId: hl.groupId };
    }
    return null;
  }

  private onPill(p: Point, hl: HoverLine) {
    return Math.abs(p.x - hl.mx) < hl.w / 2 + 2 && Math.abs(p.y - hl.my) < 13;
  }

  private lineNear(p: Point): HoverLine | null {
    const hl = this.hoverLine;
    if (hl && this.onPill(p, hl)) return hl;
    for (const g of this.lineGeom) {
      const vx = g.bx - g.ax, vy = g.by - g.ay, l2 = vx * vx + vy * vy || 1;
      const u = clamp(((p.x - g.ax) * vx + (p.y - g.ay) * vy) / l2, 0, 1);
      if (Math.hypot(p.x - (g.ax + vx * u), p.y - (g.ay + vy * u)) < 8) {
        return { key: g.key, link: g.link, groupId: g.groupId, mx: (g.ax + g.bx) / 2, my: (g.ay + g.by) / 2, w: hl?.key === g.key ? hl.w : 80 };
      }
    }
    return null;
  }

  private onWheel(e: WheelEvent) {
    this.lastActive = this.now;
    e.preventDefault();
    const p = this.local(e);
    this.zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
  }

  private onDown(e: PointerEvent) {
    this.lastActive = this.now;
    if (e.button !== 0) return;
    const p = this.local(e);
    const h = this.handle;
    if (this.view.kind === "map" && h && Math.hypot(p.x - h.x, p.y - h.y) < 12) {
      this.drag = { kind: "link", from: h.id, x: p.x, y: p.y, over: null };
      this.hoverLine = null;
      return;
    }
    const hit = this.view.kind === "map" ? this.hitTest(p) : null;
    if (hit?.kind === "bot" && e.shiftKey) {
      this.drag = { kind: "link", from: hit.id, x: p.x, y: p.y, over: null };
      this.hoverLine = null;
    } else if (hit?.kind === "bot") {
      const team = this.model.teams.find((t) => t.chiefId === hit.id)?.key ?? null;
      this.drag = { kind: "bot", id: hit.id, team, x0: p.x, y0: p.y, lx: p.x, ly: p.y, moved: false };
    } else if (hit) {
      this.drag = { kind: "click", target: hit, x0: p.x, y0: p.y };
    } else if (this.view.kind === "map") {
      this.drag = { kind: "pan", x0: p.x, y0: p.y, cx: this.cam.x, cy: this.cam.y, moved: false };
    } else {
      this.drag = { kind: "pan", x0: p.x, y0: p.y, cx: this.cam.x, cy: this.cam.y, moved: false };
    }
  }

  private onMove(e: PointerEvent) {
    this.lastActive = this.now;
    const p = this.local(e);
    const inside = p.x >= 0 && p.y >= 0 && p.x <= this.W && p.y <= this.H;
    this.pointer = inside ? p : null;
    const d = this.drag;
    if (d?.kind === "pan") {
      if (this.view.kind !== "map") return;
      if (Math.hypot(p.x - d.x0, p.y - d.y0) > 4) d.moved = true;
      if (d.moved) {
        if (!this.goal) this.goal = { ...this.cam, user: true };
        this.goal.x = d.cx - (p.x - d.x0) / this.cam.s;
        this.goal.y = d.cy - (p.y - d.y0) / this.cam.s;
        this.goal.user = true;
        this.cam.x = this.goal.x;
        this.cam.y = this.goal.y;
      }
      this.canvas.style.cursor = "grabbing";
      return;
    }
    if (d?.kind === "link") {
      d.x = p.x; d.y = p.y;
      const over = this.hitTest(p);
      d.over = over?.kind === "bot" && over.id !== d.from ? over.id : null;
      this.canvas.style.cursor = "crosshair";
      return;
    }
    if (d?.kind === "bot") {
      if (Math.hypot(p.x - d.x0, p.y - d.y0) > 4) d.moved = true;
      if (d.moved) {
        const dx = (p.x - d.lx) / this.cam.s, dy = (p.y - d.ly) / this.cam.s;
        d.lx = p.x; d.ly = p.y;
        if (d.team !== null) {
          const o = this.layout.teams[d.team] ?? { dx: 0, dy: 0 };
          this.layout.teams[d.team] = { dx: o.dx + dx, dy: o.dy + dy };
        } else {
          const o = this.layout.bots[d.id] ?? { dx: 0, dy: 0 };
          this.layout.bots[d.id] = { dx: o.dx + dx, dy: o.dy + dy };
        }
        this.homes = botHomes(this.model, this.layout);
        this.canvas.style.cursor = "grabbing";
      }
      return;
    }
    if (!inside) return;
    const onMap = this.view.kind === "map";
    this.hoverLine = onMap ? this.lineNear(p) : null;
    const onHandle = onMap && this.handle && Math.hypot(p.x - this.handle.x, p.y - this.handle.y) < 12;
    this.hover = onHandle ? { kind: "bot", id: this.handle!.id } : onMap ? this.hitTest(p) : null;
    this.canvas.style.cursor = onHandle ? "crosshair" : this.hover ? "pointer" : onMap ? "grab" : "default";
  }

  private onUp(e: PointerEvent) {
    const d = this.drag;
    this.drag = null;
    if (!d) return;
    const p = this.local(e);
    if (d.kind === "link") {
      if (d.over) this.cb.onLink(d.from, d.over, p.x, p.y);
    } else if (d.kind === "bot") {
      if (d.moved) this.cb.onLayout({ ...this.layout, teams: { ...this.layout.teams }, bots: { ...this.layout.bots } });
      else this.cb.onBot(d.id);
    } else if (d.kind === "click") {
      if (Math.hypot(p.x - d.x0, p.y - d.y0) > 6) return;
      const h = d.target;
      if (h.kind === "you") this.cb.onYou();
      else if (h.kind === "team") this.cb.onTeam(h.key);
      else if (h.kind === "channel") this.cb.onChannel(h.id);
      else if (h.kind === "plus") this.cb.onNewBot(h.key);
      else if (h.kind === "unlink") this.cb.onUnlink(h.link);
      else if (h.kind === "conversation") this.cb.onConversation(h.groupId);
    } else if (!d.moved) {
      this.cb.onBackground();
    }
    this.canvas.style.cursor = this.hover ? "pointer" : this.view.kind === "map" ? "grab" : "default";
  }

  // ---- frame ----------------------------------------------------------

  private youRadius() {
    const cs = this.cam.s;
    const yr0 = Math.max(7, 20 * clamp(cs / 0.6, 0.3, 1.6));
    return yr0 + (Math.min(54, this.H * 0.08) - yr0) * this.youBig;
  }

  private simOf(id: string): Sim | undefined {
    return this.sims.get(id) ?? (this.orbitSim && id === this.model.orbitAgent?.id ? this.orbitSim : undefined);
  }

  private moodOf(id: string, base: Mood, t: number): Mood {
    if (base === "stalled" || base === "pleading" || base === "sleepy") return base;
    const s = this.simOf(id);
    if (!s) return base;
    if (t - s.c.kick < 0.9) return "sending";
    if (t - s.c.flash < 0.8) return "surprised";
    if (t - s.doneAt < 1.6) return "happy";
    if (s.speakUntil && t < s.speakUntil) return "talking";
    if (s.call) return s.call;
    // dozes off after a long quiet spell, the way the prototype's bots do
    const quiet = this.quietSince.get(id);
    if (base === "idle" && quiet && Date.now() - quiet > SLEEP_AFTER_MS) return "sleepy";
    return base;
  }

  private adaptQuality(t: number, dt: number) {
    this.ema = this.ema ? this.ema * 0.95 + dt * 0.05 : dt;
    if (!this.qT) this.qT = t;
    if (t - this.qT < 2) return;
    this.qT = t;
    const lvl = this.qLevel;
    if (this.ema > 1 / 45 && lvl < 2) this.qLevel++;
    else if (this.ema < 1 / 57 && lvl > 0) this.qLevel--;
    else return;
    this.quality = [1, 0.75, 0.55][this.qLevel];
    this.resize();
  }

  private tick = (ms: number) => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.W) return;
    const t = ms / 1000, dt = Math.min(0.05, t - (this.lt || t));
    this.lt = t;
    this.now = t;
    this.frame++;
    if (document.hidden || this.suspended) return;
    this.adaptQuality(t, dt);
    if (this.frame % 120 === 0) this.readTheme();

    const ct = this.camTarget(), snap = this.reduced || this.drag?.kind === "pan";
    // still flying somewhere: map controls wait until the picture holds still
    this.camMoving = !snap && (Math.abs(ct.s - this.cam.s) / this.cam.s > 0.004 || Math.hypot(ct.x - this.cam.x, ct.y - this.cam.y) * this.cam.s > 1.5);
    const k = snap ? 1 : 0.08;
    this.cam.x += (ct.x - this.cam.x) * k;
    this.cam.y += (ct.y - this.cam.y) * k;
    this.cam.s += (ct.s - this.cam.s) * k;
    this.cam.scx += (ct.scx - this.cam.scx) * (snap ? 1 : 0.12);
    this.cam.scy += (ct.scy - this.cam.scy) * (snap ? 1 : 0.12);
    const focused = this.view.kind !== "map";
    this.fT += ((focused ? 1 : 0) - this.fT) * (this.reduced ? 1 : 0.08);
    this.youBig += ((this.view.kind === "you" && !this.covered ? 1 : 0) - this.youBig) * (this.reduced ? 1 : 0.1);
    this.moveBots(t);
    // Drawing is the cost; motion above is cheap and keeps running. While
    // something moves — the camera, a drag, particles, a reveal, a view
    // easing in, the pointer — the map draws at up to 60 frames a second
    // (a 120 Hz screen gains nothing here). A calm map breathes at 30, and
    // at 10 while the window is in the background.
    const active = this.camMoving || Boolean(this.drag) || this.streams.length > 0 || this.orbs.length > 0 ||
      // the systems ring reveals over the first ~1.5 s of a view
      this.youHits.length > 0 || (this.revealKey !== null && t - this.revealT0 < 2) || t - this.lastActive < 1.5 ||
      this.onCall > 0 ||
      Math.abs((focused ? 1 : 0) - this.fT) > 0.01;
    const interval = active ? 1 / 60 : document.hasFocus() ? 1 / 30 : 1 / 10;
    if (t - this.lastDraw < interval - 0.004) return;
    this.lastDraw = t;
    this.draw(t, Math.min(0.05, dt));
    if (++this.draws % 3 === 0) this.drawFaces(t);
  };

  private moveBots(t: number) {
    const focusId = this.view.kind === "bot" ? this.view.id : null;
    for (const [id, s] of this.sims) {
      const h = this.homes[id];
      if (!h) continue;
      s.R += ((h.chief ? CHIEF_R : MEMBER_R) - s.R) * 0.08;
      const bob = this.reduced ? 0 : 1;
      const tx = h.x + Math.sin(t * 0.45 + s.c.seed) * 6 * bob;
      const ty = h.y + Math.cos(t * 0.37 + s.c.seed) * 5 * bob + (s.waiting ? Math.sin(t * 6) * 2 * bob : 0);
      const dragging = this.drag?.kind === "bot" && this.drag.moved;
      const stiff = dragging ? 0.35 : 0.05;
      s.c.vx += ((tx - s.x) * stiff - s.c.vx) * (dragging ? 0.6 : 0.15);
      s.c.vy += ((ty - s.y) * stiff - s.c.vy) * (dragging ? 0.6 : 0.15);
      s.x += s.c.vx;
      s.y += s.c.vy;
      s.toolA += 0.35 / 60;
      let gx = 0, gy = 0;
      if ((this.hover?.kind === "bot" && this.hover.id === id) || focusId === id) gy = 0.2;
      if (s.lookAt && t - s.c.kick < 1.2) {
        const dx = s.lookAt.x - s.x, dy = s.lookAt.y - s.y, L = Math.hypot(dx, dy) || 1;
        gx = dx / L; gy = dy / L;
      } else if (s.waiting || s.call) {
        // waiting on You, or on a call with You: it faces You
        const dx = YOU.x - s.x, dy = YOU.y - s.y, L = Math.hypot(dx, dy) || 1;
        gx = dx / L; gy = dy / L;
      }
      s.c.gx += (gx - s.c.gx) * 0.12;
      s.c.gy += (gy - s.c.gy) * 0.12;
    }
    // You watches the cursor anywhere in the window, and centres on itself.
    let gx = 0, gy = 0;
    if (this.pointer) {
      const [yx, yy] = this.S(YOU.x, YOU.y);
      const dx = this.pointer.x - yx, dy = this.pointer.y - yy, L = Math.hypot(dx, dy);
      if (L > this.youRadius()) { gx = dx / L; gy = dy / L; }
    } else {
      const w = [...this.sims.values()].find((s) => s.waiting);
      if (w) { const dx = w.x - YOU.x, dy = w.y - YOU.y, L = Math.hypot(dx, dy) || 1; gx = dx / L; gy = dy / L; }
    }
    this.you.gx += (gx - this.you.gx) * 0.12;
    this.you.gy += (gy - this.you.gy) * 0.12;
  }

  private arrive(from: string, to: string, color: string) {
    const t = this.now;
    const s = this.sims.get(to);
    if (s) s.c.flash = t;
    if (to === "you") {
      const src = this.pos(from);
      this.you.flash = t;
      if (src) this.youHits.push({ t, a: Math.atan2(src.y - YOU.y, src.x - YOU.x), rgb: /^#[0-9a-f]{6}/i.test(color) ? hexRgb(color) : [252, 252, 252] });
    }
  }

  private draw(t: number, dt: number) {
    const { ctx, W, H } = this;
    const cs = this.cam.s, fT = this.fT, ink = this.ink;
    const envA = 1 - fT; // the rest of the map fades out fully in a focus view (no ghosts behind the column)
    const view = this.view;
    const focusId = view.kind === "bot" ? view.id : null;
    const hubTeam = view.kind === "team" ? view.key : null;
    const hubChannel = view.kind === "channel" ? this.model.channels.find((c) => c.id === view.id) ?? null : null;
    const hubConvo = view.kind === "channel" ? this.model.conversations.find((c) => c.groupId === view.id) ?? null : null;
    ctx.clearRect(0, 0, W, H);

    // dot grid, hidden when a cell would be under 14px
    if (80 * cs >= 14) {
      const gs = 80 * cs;
      const ox = ((this.cam.scx - this.cam.x * cs) % gs + gs) % gs;
      const oy = ((this.cam.scy - this.cam.y * cs) % gs + gs) % gs;
      ctx.fillStyle = `rgba(${this.line},0.05)`;
      ctx.beginPath();
      for (let x = ox; x < W; x += gs) for (let y = oy; y < H; y += gs) ctx.rect(x, y, 1.2, 1.2);
      ctx.fill();
    }

    const byId = new Map(this.model.bots.map((b) => [b.id, b]));
    const centres = teamCentres(this.model.teams, this.layout);
    this.labelRects = {};

    // team glows and labels
    for (const tm of this.model.teams) {
      if (tm.loose) continue;
      const vis = tm.memberIds.map((id) => this.sims.get(id)).filter(Boolean) as Sim[];
      const rgb = hexRgb(tm.color);
      const A = hubTeam ? (hubTeam === tm.key ? 1 : envA) : envA;
      let gx0 = centres[tm.key].x, gy0 = centres[tm.key].y, spread = 150;
      if (vis.length) {
        gx0 = vis.reduce((a, s) => a + s.x, 0) / vis.length;
        gy0 = vis.reduce((a, s) => a + s.y, 0) / vis.length;
        spread = Math.max(150, ...vis.map((s) => Math.hypot(s.x - gx0, s.y - gy0)));
      }
      const [gxs, gys] = this.S(gx0, gy0);
      const rr = Math.min(560, spread + 120) * cs;
      sprite(ctx, "t" + tm.color, rgb, gxs, gys, rr, 0.08 * A * Math.sqrt(Math.min(1, 270 / (spread + 120))));
      for (const s of vis) {
        const [mx, my] = this.S(s.x, s.y);
        sprite(ctx, "t" + tm.color, rgb, mx, my, 125 * cs, 0.05 * A);
      }
      if (fT < 0.4) {
        const c0 = centres[tm.key], [x, y] = this.S(c0.x, c0.y);
        const a0 = Math.atan2(YOU.y - c0.y, YOU.x - c0.x);
        const la = Math.sin(a0 - 1.0) < Math.sin(a0 + 1.0) ? a0 - 1.0 : a0 + 1.0;
        // the design's distance, stepped out only while it would sit on a
        // member (its bubble, or the name under it)
        let ld = (tm.chiefId ? 100 : 80) * cs + 14;
        const onMember = (d: number) => vis.some((m) => {
          const [mx, my] = this.S(m.x, m.y);
          const px = x + Math.cos(la) * d, py = y + Math.sin(la) * d;
          return Math.abs(px - mx) < (m.R + 60) * cs && py - my > -(m.R + 16) * cs && py - my < (m.R + 44) * cs;
        });
        for (let step = 0; step < 24 && onMember(ld); step++) ld += 14 * cs;
        const lx = x + Math.cos(la) * ld, ly = y + Math.sin(la) * ld, fsz = clamp((11 * cs) / 0.65, 9, 16);
        const sub = tm.chiefId ? this.labels.chief(byId.get(tm.chiefId)?.name ?? "")
          : tm.coordinatorId ? this.labels.coordinatedBy(byId.get(tm.coordinatorId)?.name ?? "")
          : this.labels.noChief;
        const title = tm.name.toUpperCase();
        ctx.font = `500 ${fsz}px 'JetBrains Mono', ui-monospace, monospace`;
        const w1 = ctx.measureText(title).width;
        ctx.font = `400 ${fsz}px Inter, sans-serif`;
        const lw = Math.max(w1, ctx.measureText(sub).width) + 8;
        const align: CanvasTextAlign = Math.cos(la) > 0.2 ? "left" : Math.cos(la) < -0.2 ? "right" : "center";
        this.labelRects[tm.key] = align === "left" ? [lx - 4, ly - fsz - 4, lx + lw, ly + fsz * 1.6 + 4]
          : align === "right" ? [lx - lw, ly - fsz - 4, lx + 4, ly + fsz * 1.6 + 4]
          : [lx - lw / 2, ly - fsz - 4, lx + lw / 2, ly + fsz * 1.6 + 4];
        const hot = this.hover?.kind === "team" && this.hover.key === tm.key;
        ctx.globalAlpha = (1 - fT * 2) * (hot ? 1 : 0.92);
        ctx.textAlign = align;
        ctx.font = `500 ${fsz}px 'JetBrains Mono', ui-monospace, monospace`;
        ctx.fillStyle = tm.color;
        ctx.fillText(title, lx, ly);
        ctx.font = `400 ${fsz}px Inter, sans-serif`;
        ctx.fillStyle = `rgba(${ink},${hot ? 0.8 : 0.5})`;
        ctx.fillText(sub, lx, ly + fsz * 1.4);
        ctx.globalAlpha = 1;
      }
    }

    // reporting lines: You → Chief, Chief → member, member → You
    const you = this.S(YOU.x, YOU.y);
    const yr = this.youRadius();
    const edge = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
      if (L < r0 + r1) return;
      ctx.beginPath();
      ctx.moveTo(x0 + (dx / L) * r0, y0 + (dy / L) * r0);
      ctx.lineTo(x1 - (dx / L) * r1, y1 - (dy / L) * r1);
      ctx.stroke();
    };
    ctx.lineWidth = 1.2;
    for (const tm of this.model.teams) {
      const lead = tm.chiefId ?? tm.coordinatorId;
      const A = hubTeam === tm.key ? 1 : envA;
      ctx.globalAlpha = A;
      if (tm.chiefId) {
        const c = this.sims.get(tm.chiefId);
        if (c) {
          const [x, y] = this.S(c.x, c.y);
          ctx.strokeStyle = c.waiting ? WAIT_LINE : `rgba(${ink},0.14)`;
          edge(you[0], you[1], yr * 1.3, x, y, c.R * cs * 1.2);
        }
      }
      for (const id of tm.memberIds) {
        if (id === tm.chiefId) continue;
        const s = this.sims.get(id);
        if (!s) continue;
        const [x, y] = this.S(s.x, s.y);
        const leadSim = lead ? this.sims.get(lead) : null;
        if (leadSim) {
          const [cx, cy] = this.S(leadSim.x, leadSim.y);
          ctx.strokeStyle = `rgba(${ink},0.07)`;
          edge(cx, cy, leadSim.R * cs * 1.2, x, y, s.R * cs * 1.2);
          if (s.waiting) { ctx.strokeStyle = WAIT_LINE; edge(you[0], you[1], yr * 1.3, x, y, s.R * cs * 1.2); }
        } else {
          ctx.strokeStyle = s.waiting ? WAIT_LINE : tm.loose ? `rgba(${ink},0.12)` : "rgba(255,190,120,0.14)";
          edge(you[0], you[1], yr * 1.3, x, y, s.R * cs * 1.2);
        }
      }
    }
    ctx.globalAlpha = 1;

    // You
    const youA = (view.kind === "you" ? 1 : envA) + (1 - envA) * this.youBig;
    const tints: Array<{ a: number; rgb: RGB; w: number }> = [];
    for (const tm of this.model.teams) {
      const vis = tm.memberIds.map((id) => this.sims.get(id)).filter(Boolean) as Sim[];
      if (!vis.length) continue;
      if (tm.loose) {
        for (const s of vis) tints.push({ a: Math.atan2(s.y - YOU.y, s.x - YOU.x), rgb: s.c.rgb, w: 0.08 });
      } else {
        const mx = vis.reduce((a, s) => a + s.x, 0) / vis.length, my = vis.reduce((a, s) => a + s.y, 0) / vis.length;
        tints.push({ a: Math.atan2(my - YOU.y, mx - YOU.x), rgb: hexRgb(tm.color), w: Math.min(0.24, 0.08 + vis.length * 0.03) });
      }
    }
    this.youHits = this.youHits.filter((h) => t - h.t < 1.2);
    for (const h of this.youHits) tints.push({ a: h.a, rgb: h.rgb, w: 0.5 * (1 - (t - h.t) / 1.2) });
    const youTalking = t < this.youTalkUntil;
    const yOut = drawYou(ctx, this.you, you[0], you[1], yr, youA, t, dt, tints, { quality: this.quality, reduced: this.reduced, ink, big: this.youBig > 0.5,
      ...(youTalking ? { mood: "talking" as Mood, voice: 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) } : {}) }) * 1.25;
    const yh = Math.round(yr * 1.4);
    this.youRect = [Math.round(you[0]) - yh, Math.round(you[1]) - yh, Math.round(you[0]) + yh, Math.round(you[1]) + yh];
    const yfs = clamp((12 * cs) / 0.65, 10, 17);
    // with the calendar up, You is the face of its header line: no label
    if (cs > 0.3 && this.youBig < 0.5 && !this.covered) {
      ctx.globalAlpha = youA;
      ctx.font = `600 ${yfs}px Inter, sans-serif`;
      ctx.fillStyle = `rgb(${ink})`;
      ctx.textAlign = "center";
      ctx.fillText(this.labels.you, you[0], you[1] + yOut + yfs + 2);
    }
    if (this.hover?.kind === "you" && this.youBig < 0.5) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = `rgba(${ink},0.6)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(you[0], you[1], yOut + 4, 0, 7);
      ctx.stroke();
      ctx.font = `400 ${yfs * 0.9}px Inter, sans-serif`;
      ctx.fillStyle = `rgba(${ink},0.6)`;
      ctx.fillText(this.labels.clickForSettings, you[0], you[1] + yOut + yfs * 2.15 + 2);
    }
    ctx.globalAlpha = 1;
    // The pills under You follow it around the map.
    const under = this.stage.querySelector<HTMLElement>("[data-orbit-under-you]");
    if (under) {
      under.style.left = `${clamp(you[0], 170, W - 170)}px`;
      under.style.top = `${clamp(you[1] + yOut + yfs * 2.6 + 12, 60, H - 60)}px`;
      under.style.opacity = String(clamp(1 - fT * 2.5, 0, 1));
      under.style.pointerEvents = fT > 0.3 ? "none" : "auto";
    }

    // particle streams
    this.streams = this.streams.filter((b) => {
      const T = b.toPt ?? this.pos(b.to);
      if (!T) return false;
      const age = t - b.t0, kk = Math.min(1, age * 1.8);
      for (const p of b.parts) {
        if (p.in) continue;
        const dx = T.x - p.x, dy = T.y - p.y, d = Math.hypot(dx, dy) || 1;
        p.vx = (p.vx + (dx / d) * 1.15 * kk * p.w) * 0.9;
        p.vy = (p.vy + (dy / d) * 1.15 * kk * p.w) * 0.9;
        p.px = p.x; p.py = p.y;
        p.x += p.vx; p.y += p.vy;
        if (d < 12) { p.in = true; b.n++; }
      }
      if (!b.fired && (b.n >= b.parts.length * 0.55 || age > 3.2)) { b.fired = true; if (!b.toPt) this.arrive(b.from, b.to, b.color); }
      const pa = focusId && b.from !== focusId && b.to !== focusId ? envA : 1;
      const c0x = this.cam.scx - this.cam.x * cs, c0y = this.cam.scy - this.cam.y * cs;
      ctx.strokeStyle = b.color;
      ctx.fillStyle = b.color;
      ctx.lineWidth = 1.6 * clamp(cs, 0.7, 1.6);
      ctx.globalAlpha = 0.85 * pa;
      ctx.beginPath();
      for (const p of b.parts) {
        if (p.in) continue;
        ctx.moveTo((p.px - p.vx * 2) * cs + c0x, (p.py - p.vy * 2) * cs + c0y);
        ctx.lineTo(p.x * cs + c0x, p.y * cs + c0y);
      }
      ctx.stroke();
      const hr = 1.6 * clamp(cs, 0.8, 1.5);
      ctx.globalAlpha = pa;
      ctx.beginPath();
      for (const p of b.parts) if (!p.in) ctx.rect(p.x * cs + c0x - hr, p.y * cs + c0y - hr, hr * 2, hr * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return !(b.parts.every((p) => p.in) || age > 4.5);
    });

    // systems orbit: lines grow out from the orb, then labels fade in
    const rk = focused(view) ? JSON.stringify(view) : null;
    if (rk !== this.revealKey) { this.revealKey = rk; this.revealT0 = t; this.revealDone = false; }
    const revE = (i: number) => {
      if (this.reduced) return 1;
      const u = clamp((t - this.revealT0 - 0.3 - i * 0.04) / 0.38, 0, 1);
      return 1 - Math.pow(1 - u, 3);
    };
    if (rk && this.systems > 0 && fT > 0.05) {
      const g = focusGeom(W, H, this.systems);
      let ox: number, oy: number, r0: number;
      let col = `rgba(${ink},0.35)`;
      if (focusId) {
        const s = this.sims.get(focusId);
        const agent = this.model.orbitAgent;
        if (!s && agent && focusId === agent.id) {
          // the Orbit agent stands at the ring's centre, not somewhere on the map
          ox = g.fx; oy = g.fy; r0 = Math.min(60, H * 0.1) * 1.3 + 18; col = agent.color;
        } else if (!s) { ox = W / 2; oy = H / 2; r0 = 40; } else { [ox, oy] = this.S(s.x, s.y); r0 = s.R * cs * 1.3 + 18; col = byId.get(focusId)?.color ?? col; }
      } else if (view.kind === "you") { [ox, oy] = you; r0 = yOut + 12; }
      else if (view.kind === "team" && centres[view.key]) {
        [ox, oy] = this.S(centres[view.key].x, centres[view.key].y);
        // spokes start outside the team's own bots, not between them
        const team = this.model.teams.find((tm) => tm.key === view.key);
        const reach = (team?.memberIds ?? []).reduce((far, id) => {
          const sim = this.sims.get(id);
          if (!sim) return far;
          const [mx, my] = this.S(sim.x, sim.y);
          return Math.max(far, Math.hypot(mx - ox, my - oy) + sim.R * cs * 1.3);
        }, 0);
        r0 = Math.max(40, reach + 28);
      }
      else { ox = g.fx; oy = g.fy; r0 = 40; }
      const active = this.liveSystems;
      g.pos.forEach((p, i) => {
        const e = revE(i);
        if (e <= 0) return;
        const dx = p.x - ox, dy = p.y - oy, L = Math.hypot(dx, dy) || 1;
        // stop at the edge of the label's box, not inside its text
        const hw = (g.compact ? 124 : 150) / 2 + 6, hh = 26;
        const back = Math.min(dx === 0 ? Infinity : hw / Math.abs(dx), dy === 0 ? Infinity : hh / Math.abs(dy), 1);
        const x0 = ox + (dx / L) * r0, y0 = oy + (dy / L) * r0, x1 = p.x - dx * back, y1 = p.y - dy * back;
        // no spoke when the label sits inside where spokes start
        if (Math.hypot(x1 - ox, y1 - oy) <= r0) return;
        const xe = x0 + (x1 - x0) * e, ye = y0 + (y1 - y0) * e;
        const on = active.has(i);
        const cc = this.warnSystems.has(i) ? "#ff9800" : col;
        ctx.globalAlpha = fT;
        ctx.strokeStyle = on ? cc : `rgba(${ink},${focusId ? 0.1 : 0.12})`;
        ctx.lineWidth = on ? 1.4 : 1;
        ctx.setLineDash(on && e >= 1 ? [3, 6] : []);
        ctx.lineDashOffset = -t * 30;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe, ye); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = on ? cc : `rgba(${ink},0.35)`;
        ctx.beginPath(); ctx.arc(xe, ye, on ? 2.2 : 1.6, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    if (rk && !this.revealDone) {
      const els = this.stage.querySelectorAll<HTMLElement>("[data-orbit-sys]");
      let all = els.length > 0;
      els.forEach((el, i) => {
        const e = revE(i);
        if (e < 1) all = false;
        el.style.opacity = String(clamp((e - 0.55) / 0.45, 0, 1));
        el.style.transform = e < 1 ? `translate(-50%,-50%) translateY(${((1 - e) * 8).toFixed(1)}px)` : "translate(-50%,-50%)";
      });
      if (all) this.revealDone = true;
    }

    // channels ("rooms")
    this.channelRects = {};
    for (const ch of this.model.channels) {
      const p = channelPos(ch, this.homes);
      const [rx, ry] = this.S(p.x, p.y);
      const rr = 40 * clamp(cs / 0.65, 0.45, 1.8);
      const isR = hubChannel?.id === ch.id;
      const ra = isR ? 1 : envA;
      const rgb = hexRgb(ch.color);
      ctx.save();
      ctx.globalAlpha = 0.4 * ra;
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([1.5, 5]);
      ctx.lineDashOffset = -t * 12;
      for (const m of ch.memberIds) {
        const s = this.sims.get(m);
        if (!s) continue;
        const [bx, by] = this.S(s.x, s.y);
        edge(rx, ry, rr, bx, by, s.R * cs * 1.2);
      }
      ctx.restore();
      sprite(ctx, "room" + ch.color, rgb, rx, ry, rr * 2.4, (isR ? 0.2 : 0.12) * ra);
      const hot = this.hover?.kind === "channel" && this.hover.id === ch.id;
      ctx.globalAlpha = 0.8 * ra;
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = isR || hot ? 2 : 1.3;
      ctx.beginPath(); ctx.arc(rx, ry, rr, 0, 7); ctx.stroke();
      ctx.fillStyle = ch.color;
      ctx.textAlign = "center";
      ctx.font = `600 ${Math.max(10, rr * 0.8) | 0}px Inter, sans-serif`;
      ctx.fillText("#", rx, ry + rr * 0.28);
      if (ch.unread) { ctx.fillStyle = "#1084fe"; ctx.beginPath(); ctx.arc(rx + rr * 0.72, ry - rr * 0.72, Math.max(3, rr * 0.12), 0, 7); ctx.fill(); ctx.fillStyle = ch.color; }
      const fz = clamp((12 * cs) / 0.65, 10, 16);
      ctx.font = `600 ${fz}px Inter, sans-serif`;
      ctx.fillText(ch.name, rx, ry + rr + fz + 4);
      ctx.font = `400 ${fz * 0.9}px Inter, sans-serif`;
      ctx.fillStyle = `rgba(${ink},0.55)`;
      ctx.fillText(this.labels.channelRule(ch.memberIds.length, ch.rule), rx, ry + rr + fz * 2.3 + 4);
      ctx.globalAlpha = 1;
      this.channelRects[ch.id] = [rx - rr, ry - rr, rx + rr, ry + rr + 40];
    }

    // Each card on the canvas keeps a dotted tether to the bot showing it,
    // from the bot to the nearest point of the card.
    if (view.kind === "map") {
      for (const card of this.cards) {
        const b = this.sims.get(card.botId);
        if (!b) continue;
        const [bx, by] = this.S(b.x, b.y);
        const [ax, ay] = this.S(clamp(b.x, card.x, card.x + card.w), clamp(b.y, card.y, card.y + card.h));
        ctx.save();
        ctx.strokeStyle = this.colorOf(card.botId); ctx.globalAlpha = 0.45 * envA; ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 6]); ctx.lineDashOffset = -t * 20;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke();
        ctx.restore();
      }
    }

    // Lines between bots: "can talk" grants (a Chief the owner let work with
    // another team) dashed in both colours, and pairs that have talked (their
    // bot⇄bot channel) as a faint solid line. One pair, one line.
    this.lineGeom = [];
    const pair = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
    const convoOf = new Map<string, OrbitConversation>(this.model.conversations.map((c) => [pair(c.a, c.b), c]));
    const drawn = new Set<string>();
    const perPair = new Map<string, number>();
    for (const link of this.model.links) perPair.set(pair(link.from, link.to), (perPair.get(pair(link.from, link.to)) ?? 0) + 1);
    const seenPair = new Map<string, number>();
    for (const link of this.model.links) {
      const A1 = this.sims.get(link.from), B1 = this.sims.get(link.to);
      if (!A1 || !B1) continue;
      let [ax, ay] = this.S(A1.x, A1.y), [bx, by] = this.S(B1.x, B1.y);
      // Two grants on one pair (each Chief works with the other's team) run
      // side by side, so each can be hovered and removed on its own.
      const pk = pair(link.from, link.to), nth = seenPair.get(pk) ?? 0;
      seenPair.set(pk, nth + 1);
      if ((perPair.get(pk) ?? 1) > 1) {
        const L = Math.hypot(bx - ax, by - ay) || 1, off = (nth === 0 ? -1 : 1) * 3.5 * (link.from < link.to ? 1 : -1);
        const nx = (-(by - ay) / L) * off, ny = ((bx - ax) / L) * off;
        ax += nx; ay += ny; bx += nx; by += ny;
      }
      const gr = ctx.createLinearGradient(ax, ay, bx, by);
      gr.addColorStop(0, this.colorOf(link.from));
      gr.addColorStop(1, this.colorOf(link.to));
      ctx.globalAlpha = 0.6 * envA;
      ctx.strokeStyle = gr;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -t * 18;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.setLineDash([]);
      const k = pair(link.from, link.to), convo = convoOf.get(k);
      drawn.add(k);
      this.lineGeom.push({ key: `l:${link.from}:${link.section}`, link, groupId: convo?.groupId, unread: convo?.unread, both: (perPair.get(pk) ?? 1) > 1, ax, ay, bx, by });
    }
    for (const c of this.model.conversations) {
      const k = pair(c.a, c.b);
      if (drawn.has(k)) continue;
      const A1 = this.sims.get(c.a), B1 = this.sims.get(c.b);
      if (!A1 || !B1) continue;
      const [ax, ay] = this.S(A1.x, A1.y), [bx, by] = this.S(B1.x, B1.y);
      const hot = this.hoverLine?.key === `c:${c.groupId}`;
      ctx.globalAlpha = (hot ? 0.4 : 0.14) * envA;
      ctx.strokeStyle = `rgb(${this.line})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      this.lineGeom.push({ key: `c:${c.groupId}`, groupId: c.groupId, unread: c.unread, ax, ay, bx, by });
    }
    for (const g of this.lineGeom) {
      const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
      if (g.unread) {
        ctx.globalAlpha = envA;
        ctx.fillStyle = "#1084fe";
        ctx.beginPath(); ctx.arc(mx, my, 3, 0, 7); ctx.fill();
      }
      const hl = this.hoverLine;
      if (view.kind !== "map" || hl?.key !== g.key) continue;
      const label = g.link ? `${g.both ? this.labels.grant(this.nameOf(g.link.from), g.link.section) : this.labels.canTalk}   ×` : this.labels.conversation;
      ctx.font = "500 11px Inter, sans-serif";
      const w = Math.ceil(ctx.measureText(label).width) + 24;
      hl.mx = mx; hl.my = my; hl.w = w;
      ctx.globalAlpha = envA;
      ctx.fillStyle = "rgba(18,18,20,0.92)";
      ctx.strokeStyle = `rgba(${this.line},0.18)`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(mx - w / 2, my - 11, w, 22, 11); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `rgba(${ink},0.85)`;
      ctx.textAlign = "center";
      ctx.fillText(label, mx, my + 4);
    }
    ctx.globalAlpha = 1;
    const ld = this.drag?.kind === "link" ? this.drag : null;
    if (ld) {
      const A1 = this.sims.get(ld.from);
      if (A1) {
        const [ax, ay] = this.S(A1.x, A1.y);
        ctx.strokeStyle = this.colorOf(ld.from);
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -t * 30;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ld.x, ld.y); ctx.stroke();
        ctx.setLineDash([]);
        const B1 = ld.over ? this.sims.get(ld.over) : null;
        if (B1) {
          const [bx, by] = this.S(B1.x, B1.y);
          ctx.strokeStyle = this.colorOf(ld.over!);
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(bx, by, B1.R * cs * 1.45, 0, 7); ctx.stroke();
        }
      }
    }

    // "+ new bot" slot beside each team, on the map only
    this.plusRects = {};
    if (view.kind === "map" && fT < 0.4) {
      for (const tm of this.model.teams) {
        if (tm.loose || !centres[tm.key]) continue;
        const w = teamPlusSpot(tm, centres[tm.key], this.homes);
        const [px, py] = this.S(w.x, w.y);
        const pr = Math.max(8, 11 * clamp(cs / 0.65, 0.6, 1.5));
        const hov = this.hover?.kind === "plus" && this.hover.key === tm.key;
        ctx.globalAlpha = (hov ? 1 : 0.55) * (1 - fT * 2.5);
        ctx.strokeStyle = tm.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.arc(px, py, pr, 0, 7); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(px - pr * 0.45, py); ctx.lineTo(px + pr * 0.45, py);
        ctx.moveTo(px, py - pr * 0.45); ctx.lineTo(px, py + pr * 0.45);
        ctx.stroke();
        if (hov) {
          ctx.fillStyle = tm.color;
          ctx.font = "500 11px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(this.labels.newBotIn(tm.name), px, py + pr + 14);
        }
        ctx.globalAlpha = 1;
        this.plusRects[tm.key] = [px - pr - 4, py - pr - 4, px + pr + 4, py + pr + 4];
      }
    }

    // New bot: a dashed ghost where the bot will land
    if (view.kind === "new") {
      const g = this.newSpot(view.section), [gx, gy] = this.S(g.x, g.y), r2 = MEMBER_R * cs;
      const color = view.section != null ? this.model.teams.find((tm) => tm.key === view.section)?.color ?? `rgb(${ink})` : `rgb(${ink})`;
      ctx.globalAlpha = 0.85 * fT;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 5]);
      ctx.lineDashOffset = -t * 16;
      ctx.beginPath(); ctx.arc(gx, gy, r2, 0, 7); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.font = `600 ${clamp((12 * cs) / 0.65, 10, 17)}px Inter, sans-serif`;
      ctx.fillText(this.labels.newBot, gx, gy + r2 + 18);
      ctx.globalAlpha = 1;
    }

    // the Orbit agent, opened: it has no place on the map, so its
    // character stands at the centre of its ring
    const orbitAgent = this.model.orbitAgent;
    if (orbitAgent && this.orbitSim && focusId === orbitAgent.id && !this.covered && !this.showing) {
      const g = focusGeom(W, H, this.systems);
      drawChar(ctx, this.orbitSim.c, this.moodOf(orbitAgent.id, orbitAgent.mood, t), g.fx, g.fy, Math.min(60, H * 0.1), fT, t, dt,
        { big: true, quality: this.quality, camScale: 1, ink, reduced: this.reduced });
    }

    // bots
    this.botRects = {};
    const showNames = cs > 0.38;
    let handleSet = false;
    for (const bot of this.model.bots) {
      const s = this.sims.get(bot.id);
      if (!s) continue;
      const [x, y] = this.S(s.x, s.y);
      if (x < -300 || y < -300 || x > W + 300 || y > H + 300) continue;
      const isF = focusId === bot.id;
      const inHub = (hubTeam !== null && bot.teamKey === hubTeam) || (hubChannel?.memberIds.includes(bot.id) ?? false) || (hubConvo !== null && (hubConvo.a === bot.id || hubConvo.b === bot.id));
      const A = focusId ? (isF ? 1 : envA) : view.kind === "map" ? 1 : inHub ? 1 : envA;
      const mood = this.moodOf(bot.id, bot.mood, t);
      // in the corner under a screen (the calendar, a shown file, the VM
      // workspace, plugins) the bot is only the header's face: no ring
      if (isF && fT > 0.3 && !this.covered && !this.showing) {
        const rr = s.R * cs * 1.28 + 10;
        if (bot.approval === "full") sprite(ctx, "g-full", [178, 150, 255], x, y, rr * 1.9, 0.2 * fT);
        ctx.globalAlpha = fT;
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = mood === "pleading" ? "rgba(255,152,0,0.9)" : `rgba(${ink},0.4)`;
        if (bot.approval === "ask" || bot.approval === "custom") { ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.stroke(); }
        else if (bot.approval === "edits") { ctx.beginPath(); ctx.arc(x, y, rr, -1.1, Math.PI * 2 - 2.0); ctx.stroke(); }
        else if (bot.approval === "auto") { ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
        ctx.globalAlpha = 1;
      }
      if (bot.tool && bot.busy) {
        const tr = s.R * cs * 1.75 + 8, tx = x + Math.cos(s.toolA) * tr, ty = y + Math.sin(s.toolA) * tr, cr = clamp((11 * cs) / 0.65, 7, 18);
        ctx.globalAlpha = A * 0.7;
        ctx.strokeStyle = bot.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(s.toolA) * s.R * cs * 1.1, y + Math.sin(s.toolA) * s.R * cs * 1.1);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = A;
        ctx.fillStyle = "#121215";
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(tx - cr, ty - cr, cr * 2, cr * 2, cr * 0.45); ctx.fill(); ctx.stroke();
        const img = toolIcon(bot.tool, `rgb(${ink})`);
        if (img?.complete && img.naturalWidth) ctx.drawImage(img, tx - cr * 0.58, ty - cr * 0.58, cr * 1.16, cr * 1.16);
        ctx.globalAlpha = 1;
      }
      const R = drawChar(ctx, s.c, mood, x, y, s.R * cs, A, t, dt, { big: isF, quality: this.quality, camScale: cs, ink, reduced: this.reduced,
        voice: mood === "talking" && s.call ? this.voiceLevel?.() : undefined });
      // the control sits on the bot's resting place, not its bob, so it
      // holds still under a pointer (and for tools that wait for stillness)
      const home = this.homes[bot.id];
      const [hx0, hy0] = home ? this.S(home.x, home.y) : [x, y];
      const hr = Math.round(R * 1.3 + 8 * cs);
      this.botRects[bot.id] = [Math.round(hx0) - hr, Math.round(hy0) - hr, Math.round(hx0) + hr, Math.round(hy0) + hr];
      if (s.R > (CHIEF_R + MEMBER_R) / 2) drawCrown(ctx, x, y - R * 1.25, isF ? 18 : clamp((12 * cs) / 0.6, 7, 18), `rgba(${ink},${0.85 * A})`);
      const hovered = this.hover?.kind === "bot" && this.hover.id === bot.id;
      if (hovered && !isF) {
        ctx.globalAlpha = A;
        ctx.strokeStyle = `rgba(${ink},0.6)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, y, R * 1.3 + 4, 0, 7); ctx.stroke();
      }
      if (hovered && view.kind === "map" && !this.drag) {
        const hx = x + R * 1.3 + 6, hy = y - R * 0.9;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#18181c";
        ctx.strokeStyle = bot.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(hx, hy, 9, 0, 7); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = `rgb(${ink})`;
        ctx.beginPath(); ctx.moveTo(hx - 4, hy); ctx.lineTo(hx + 4, hy); ctx.moveTo(hx, hy - 4); ctx.lineTo(hx, hy + 4); ctx.stroke();
        this.handle = { id: bot.id, x: hx, y: hy };
        handleSet = true;
      }
      if (!isF && (showNames || hovered || mood === "pleading")) {
        const fsz = clamp((12 * cs) / 0.65, 10, 18);
        ctx.globalAlpha = A;
        ctx.textAlign = "center";
        ctx.font = `600 ${fsz}px Inter, sans-serif`;
        ctx.fillStyle = bot.color;
        ctx.fillText(bot.name, x, y + R * 1.25 + fsz + 2);
        if (bot.pinned) {
          // a small pushpin before the name: pinned bots lead ⌘1-9 and the palette
          const px = x - ctx.measureText(bot.name).width / 2 - fsz * 0.75, py = y + R * 1.25 + fsz * 0.62 + 2;
          ctx.beginPath(); ctx.arc(px, py - fsz * 0.18, fsz * 0.2, 0, 7); ctx.fill();
          ctx.lineWidth = Math.max(1, fsz * 0.1); ctx.strokeStyle = bot.color;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + fsz * 0.34); ctx.stroke();
        }
        if (bot.unread) { ctx.fillStyle = "#1084fe"; ctx.beginPath(); ctx.arc(x + R * 0.95, y - R * 0.8, Math.max(3, R * 0.14), 0, 7); ctx.fill(); }
        const cap = mood === "stalled" ? this.labels.stalled : mood === "pleading" ? this.labels.waitingOnYou : hovered ? (bot.tool ? bot.tool : this.labels.clickToTalk) : "";
        if (cap) {
          ctx.font = `400 ${fsz * 0.9}px Inter, sans-serif`;
          ctx.fillStyle = mood === "stalled" ? "#ff8a96" : mood === "pleading" ? "#ffb454" : `rgba(${ink},0.6)`;
          ctx.fillText(cap, x, y + R * 1.25 + fsz * 2.25 + 2);
        }
      }
      ctx.globalAlpha = 1;
    }
    if (!handleSet && this.drag?.kind !== "link") this.handle = null;

    this.placeHits();
    this.placeWorld();
    this.placeOffer(ctx, t);

    // sent-message orbs: an eased arc with a short trail, then a flash
    this.orbs = this.orbs.filter((o) => {
      const target = this.sims.get(o.to);
      if (!target) return false;
      const u = Math.min(1, (t - o.t0) / 1.0), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const [bx, by] = this.S(target.x, target.y);
      const bend = Math.min(160, Math.hypot(bx - o.x0, by - o.y0) * 0.35);
      const P = (uu: number): [number, number] => {
        const mx = (o.x0 + bx) / 2, my = (o.y0 + by) / 2 - bend, v = 1 - uu;
        return [v * v * o.x0 + 2 * v * uu * mx + uu * uu * bx, v * v * o.y0 + 2 * v * uu * my + uu * uu * by];
      };
      for (let i = 12; i >= 0; i--) {
        const [x, y] = P(Math.max(0, e - i * 0.018));
        ctx.globalAlpha = (1 - i / 13) * 0.8;
        ctx.fillStyle = o.color;
        ctx.beginPath();
        ctx.arc(x, y, i ? 2.4 * (1 - i / 14) + 0.8 : 4.5, 0, 7);
        ctx.fill();
      }
      const [hx, hy] = P(e);
      ctx.globalAlpha = 1;
      sprite(ctx, "g-white", [252, 252, 252], hx, hy, 18, 0.5);
      if (u >= 1) { target.c.flash = t; return false; }
      return true;
    });
    ctx.globalAlpha = 1
  }

  /** The map's accessible layer: every <… data-orbit-hit="bot:id | you |
   * team:key | channel:id | plus:key"> in the stage is laid over what the
   * canvas drew for it, so keyboard and screen-reader users reach the same
   * things a pointer does. The buttons let pointer events through to the
   * canvas, which keeps dragging and hover as they are. */
  private placeHits() {
    const els = this.stage.querySelectorAll<HTMLElement>("[data-orbit-hit]");
    els.forEach((el) => {
      const key = el.dataset.orbitHit!;
      const sep = key.indexOf(":");
      const kind = sep < 0 ? key : key.slice(0, sep), id = sep < 0 ? "" : key.slice(sep + 1);
      const r = kind === "you" ? this.youRect
        : kind === "bot" ? this.botRects[id]
        : kind === "team" ? this.labelRects[id]
        : kind === "channel" ? this.channelRects[id]
        : kind === "plus" ? this.plusRects[id]
        : undefined;
      if (!r || this.view.kind !== "map" || this.fT > 0.02 || this.camMoving) { el.style.display = "none"; return; }
      el.style.display = "block";
      el.style.left = `${r[0]}px`;
      el.style.top = `${r[1]}px`;
      el.style.width = `${Math.max(12, r[2] - r[0])}px`;
      el.style.height = `${Math.max(12, r[3] - r[1])}px`;
    });
  }

  /** The artifact layer follows the camera: world units map to the stage. */
  private placeWorld() {
    const wl = this.worldEl;
    if (!wl) return;
    const c = this.cam, fa = this.view.kind === "bot" ? this.showing : null;
    if (fa) {
      // fit the shown card into the stage between the bot and the chat
      const chatW = focusGeom(this.W, this.H, 0).chatW;
      const L0 = 24, T0 = 150, R0 = this.W - chatW - 56, B0 = this.H - 20;
      const k = Math.min((R0 - L0) / fa.w, (B0 - T0) / fa.h);
      const tx = L0 + ((R0 - L0) - fa.w * k) / 2 - fa.x * k, ty = T0 + ((B0 - T0) - fa.h * k) / 2 - fa.y * k;
      const w0 = this.wk ?? { tx, ty, k };
      const e = this.reduced ? 1 : 0.18;
      w0.tx += (tx - w0.tx) * e; w0.ty += (ty - w0.ty) * e; w0.k += (k - w0.k) * e;
      this.wk = w0;
      wl.style.transform = `translate(${w0.tx}px, ${w0.ty}px) scale(${w0.k})`;
      wl.style.opacity = "1";
    } else {
      this.wk = { tx: c.scx - c.x * c.s, ty: c.scy - c.y * c.s, k: c.s };
      wl.style.transform = `translate(${this.wk.tx}px, ${this.wk.ty}px) scale(${c.s})`;
      wl.style.opacity = this.view.kind === "map" ? "1" : "0";
    }
  }

  /** The offer pill (prototype: offer placement): the candidate spot around
   * its bot that covers the least — other bots, team labels, You, the
   * composer — kept steady unless another spot is much clearer, with an
   * arrow on the pill's edge pointing back at the bot. */
  private placeOffer(ctx: CanvasRenderingContext2D, t: number) {
    const column = this.stage.querySelector<HTMLElement>(".orbit-column");
    const of = this.offer;
    const s = of && this.sims.get(of.botId);
    // docked in a view: the pill sits above the composer (or under a hub's
    // panel) and the column keeps room for it
    const v = this.view.kind;
    const ringOn = !!s && ((v === "bot" && !this.showing && !this.covered) || (v === "you" && !this.covered) || v === "team");
    if (!of || !s) { column?.style.removeProperty("--orbit-offer-pad"); return; }
    if (v !== "map" && !ringOn) { of.el.style.visibility = "hidden"; column?.style.removeProperty("--orbit-offer-pad"); return; }
    of.el.style.visibility = "visible";
    const cs = this.cam.s, W = this.W, H = this.H;
    const [bx, by] = this.S(s.x, s.y), R = s.R * cs;
    const bw = of.el.offsetWidth || 240, bh = of.el.offsetHeight || 32, hw = bw / 2, hh = bh / 2;
    const arrow = of.el.querySelector<HTMLElement>("[data-arrow]");
    if (ringOn) {
      const chatW = focusGeom(W, H, 0).chatW, stR = this.stage.getBoundingClientRect();
      const dock = column?.querySelector<HTMLElement>("[data-orbit-dock]");
      const colR = column?.getBoundingClientRect();
      const dockY = dock ? dock.getBoundingClientRect().top - stR.top - 8 - hh : colR ? colR.bottom - stR.top - 8 - hh : H - 60 - hh;
      const cx = W - 28 - chatW / 2, cy = Math.max(60 + hh, dockY);
      this.offerPos = { botId: of.botId, x: cx, y: cy, idx: -1, ring: true };
      if (arrow) arrow.style.display = "none";
      of.el.style.transform = `translate(${cx - hw}px, ${cy - hh}px)`;
      column?.style.setProperty("--orbit-offer-pad", `${Math.round(bh + 16)}px`);
      return;
    }
    column?.style.removeProperty("--orbit-offer-pad");
    if (arrow) arrow.style.display = "";
    const L0 = 14, T0 = 14, R0 = W - 14, B0 = H - 86;
    const chief = this.model.teams.some((tm) => tm.chiefId === of.botId);
    const gapY = R * (chief ? 1.75 : 1.45) + 22, gapX = R * 1.5 + 24;
    const upY = by - gapY - hh, dnY = by + R * 1.3 + 40 + hh;
    const cands = [[bx, upY], [bx + hw + 16, upY], [bx - hw - 16, upY], [bx, dnY], [bx + hw + 16, dnY], [bx - hw - 16, dnY], [bx + gapX + hw, by], [bx - gapX - hw, by]]
      .map((c) => [clamp(c[0]!, L0 + hw, R0 - hw), clamp(c[1]!, T0 + hh, B0 - hh)] as [number, number]);
    const blockers: Array<[number, number, number, number, number?]> = [];
    for (const o of this.sims.values()) {
      const [ox, oy] = this.S(o.x, o.y), orr = o.R * cs * 1.35;
      blockers.push([ox - Math.max(orr, 34), oy - orr, ox + Math.max(orr, 34), oy + orr + 34]);
    }
    for (const r of Object.values(this.labelRects)) blockers.push(r);
    for (const r of Object.values(this.channelRects)) blockers.push([...r, 4]);
    if (this.youRect) blockers.push([this.youRect[0], this.youRect[1], this.youRect[2], this.youRect[3] + 44]);
    // the pills under You weigh the most: covering them hides who is waiting
    const stR = this.stage.getBoundingClientRect();
    for (const el of this.stage.querySelectorAll<HTMLElement>("[data-orbit-under-you]")) {
      const q = el.getBoundingClientRect();
      if (q.width) blockers.push([q.left - stR.left - 8, q.top - stR.top - 8, q.right - stR.left + 8, q.bottom - stR.top + 8, 12]);
    }
    const overlap = (x: number, y: number) => {
      let sum = 0;
      for (const bk of blockers) {
        const w = Math.min(x + hw, bk[2]) - Math.max(x - hw, bk[0]), h = Math.min(y + hh, bk[3]) - Math.max(y - hh, bk[1]);
        if (w > 0 && h > 0) sum += w * h * (bk[4] ?? 1);
      }
      return sum;
    };
    const scores = cands.map((c, i) => overlap(c[0], c[1]) + i * 2 + Math.hypot(c[0] - bx, c[1] - by) * 0.05);
    let bi = 0;
    scores.forEach((v, i) => { if (v < scores[bi]!) bi = i; });
    const keep = this.offerPos && this.offerPos.botId === of.botId && !this.offerPos.ring ? this.offerPos.idx : -1;
    const idx = keep >= 0 && !(scores[bi]! < scores[keep]! - Math.max(800, scores[keep]! * 0.3)) ? keep : bi;
    let [cx, cy] = cands[idx]!;
    if (this.offerPos && this.offerPos.botId === of.botId) { cx = this.offerPos.x + (cx - this.offerPos.x) * 0.2; cy = this.offerPos.y + (cy - this.offerPos.y) * 0.2; }
    this.offerPos = { botId: of.botId, x: cx, y: cy, idx, ring: false };
    const a = Math.atan2(by - cy, bx - cx), ca = Math.abs(Math.cos(a)) || 1e-6, sa = Math.abs(Math.sin(a)) || 1e-6;
    const edge = Math.min(hw / ca, hh / sa) + 11;
    const ax = Math.cos(a) * edge, ay = Math.sin(a) * edge;
    if (arrow) arrow.style.transform = `translate(${ax}px, ${ay}px) rotate(${a + Math.PI / 2}rad)`;
    of.el.style.transform = `translate(${cx - hw}px, ${cy - hh}px)`;
    // far from its bot, a dotted line runs from the arrow's tip to it
    const tipX = cx + ax + Math.cos(a) * 8, tipY = cy + ay + Math.sin(a) * 8, gap = Math.hypot(bx - tipX, by - tipY) - R * 1.3;
    if (gap > 24) {
      const ex = bx - Math.cos(a) * R * 1.35, ey = by - Math.sin(a) * R * 1.35;
      ctx.save(); ctx.globalAlpha = 0.55; ctx.strokeStyle = this.colorOf(of.botId); ctx.lineWidth = 1.3; ctx.setLineDash([2, 5]); ctx.lineDashOffset = -t * 24;
      ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
    }
  }

  /** Mini faces in the HTML chrome: <canvas data-orbit-face="botId|you">. */
  private drawFaces(t: number) {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const byId = new Map([...this.model.bots, ...(this.model.orbitAgent ? [this.model.orbitAgent] : [])].map((b) => [b.id, b]));
    document.querySelectorAll<HTMLCanvasElement>("canvas[data-orbit-face]").forEach((cv) => {
      const id = cv.dataset.orbitFace!;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w) return;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext("2d")!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      if (id === "you") { drawChar(c, this.you, "idle", w / 2, h / 2, Math.min(w, h) * 0.34, 1, t, 0, { mini: true }); return; }
      const s = this.simOf(id), b = byId.get(id);
      if (!s || !b) {
        // a bot that is not on the map (archived, on another computer, a
        // draft, a deleted sender): the same character in its colour, at rest
        const color = cv.dataset.orbitColor;
        if (!color) return;
        let face = this.offMap.get(id);
        if (!face) { face = newCharState(hexRgb(color), this.offMap.size * 1.3 + 0.7, t); this.offMap.set(id, face); }
        face.rgb = hexRgb(color);
        drawChar(c, face, "idle", w / 2, h / 2, Math.min(w, h) * 0.34, cv.dataset.orbitDim ? 0.55 : 1, t, 0, { mini: true });
        return;
      }
      drawChar(c, s.c, this.moodOf(id, b.mood, t), w / 2, h / 2, Math.min(w, h) * 0.34, 1, t, 0, { mini: true });
    });
  }
}

function focused(view: OrbitView) {
  return view.kind === "bot" || view.kind === "you" || view.kind === "team";
}


function drawCrown(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const w = size, h = size * 0.72, top = y - h;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.1);
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x - w / 2, top + h * 0.25);
  ctx.lineTo(x - w * 0.22, top + h * 0.6);
  ctx.lineTo(x, top);
  ctx.lineTo(x + w * 0.22, top + h * 0.6);
  ctx.lineTo(x + w / 2, top + h * 0.25);
  ctx.lineTo(x + w / 2, y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
