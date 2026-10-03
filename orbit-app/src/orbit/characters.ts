// Particle-orb characters, drawn procedurally on a 2D canvas. The same
// renderer paints every place a bot appears in Orbit: the map, the zoomed-in
// view, pills and list rows. See design_handoff_orbit/README.md, "Characters".

export type Mood =
  | "idle"
  | "focused"
  | "thinking"
  | "pleading"
  | "sending"
  | "surprised"
  | "happy"
  | "talking"
  | "stalled"
  | "sleepy";

export type RGB = [number, number, number];

/** Per-character animation state. Owned by whoever draws the character. */
export interface CharState {
  rot: number;
  seed: number;
  rgb: RGB;
  /** gaze, -1..1 */
  gx: number;
  gy: number;
  blink: number;
  /** time (s) a message last reached this character — spin boost + ring */
  flash: number;
  /** time (s) this character last sent something — squash + happy arcs */
  kick: number;
  vx: number;
  vy: number;
}

export const hexRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const AMBER: RGB = [255, 152, 0];
const RED: RGB = [255, 86, 103];

export function newCharState(rgb: RGB, seed: number, now: number): CharState {
  return { rot: Math.random() * 6, seed, rgb, gx: 0, gy: 0, blink: now + 1 + Math.random() * 3, flash: -9, kick: -9, vx: 0, vy: 0 };
}

/** Fibonacci-distributed points on a unit sphere, plus a random jitter seed. */
function sphere(n: number): Array<[number, number, number, number]> {
  return Array.from({ length: n }, (_, i) => {
    const th = Math.acos(1 - (2 * (i + 0.5)) / n);
    const ph = i * 2.39996;
    return [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph), Math.random()];
  });
}

const LOD = [sphere(56), sphere(100), sphere(180), sphere(420)];
const BAND = Array.from({ length: 44 }, (_, i) => (i / 44) * Math.PI * 2);
const NB = 5;
const BX = new Float32Array(800);
const BY = new Float32Array(800);
const BS = new Float32Array(800);
const BB = new Int8Array(800);

const sprites = new Map<string, HTMLCanvasElement>();

/** A cached radial-gradient sprite: glows, halos and the dark core. */
export function sprite(ctx: CanvasRenderingContext2D, key: string, rgb: RGB | null, x: number, y: number, r: number, alpha: number) {
  if (alpha <= 0.004 || r < 1) return;
  let c = sprites.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    if (!rgb) {
      gr.addColorStop(0, "rgba(10,10,12,0.78)");
      gr.addColorStop(0.7, "rgba(10,10,12,0.45)");
      gr.addColorStop(1, "rgba(10,10,12,0)");
    } else {
      const cc = rgb.join(",");
      gr.addColorStop(0, `rgba(${cc},1)`);
      gr.addColorStop(0.12, `rgba(${cc},1)`);
      gr.addColorStop(1, `rgba(${cc},0)`);
    }
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    sprites.set(key, c);
  }
  const ga = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  ctx.drawImage(c, x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = ga;
}

const SPIN: Partial<Record<Mood, number>> = { focused: 1.5, thinking: 1.1, pleading: 0.2, stalled: 0.05, sleepy: 0.12 };

export interface DrawOpts {
  /** Solar bodies keep their own surface and face; reuse only Orbit particles. */
  particlesOnly?: boolean;
  auraOnly?: boolean;
  particleOpacity?: number;
  big?: boolean;
  /** small DOM canvases: fewest points, no ring, no extras */
  mini?: boolean;
  noRing?: boolean;
  /** a smaller, softer core: for a character floating over another app,
   * where the map's dark backdrop isn't there to blend the full one into,
   * but its white eyes still need something to sit on */
  softCore?: boolean;
  /** 0.55..1 — lowers the level of detail on slow machines */
  quality?: number;
  /** camera scale, for motion smear */
  camScale?: number;
  ink?: string;
  reduced?: boolean;
  /** talking: how open the mouth is (0..1), from the voice actually
   * playing; without it the mouth moves on its own rhythm */
  voice?: number;
  /** drawYou: a mood other than idle (You talking on a call) */
  mood?: Mood;
}

/** Draws one character and returns its rendered radius. */
export function drawChar(ctx: CanvasRenderingContext2D, s: CharState, mood: Mood, x: number, y: number, R: number, A: number, t: number, dt: number, opt: DrawOpts = {}): number {
  const { big, mini } = opt;
  const reduced = opt.reduced === true;
  if (!mini && !reduced) {
    const boost = t >= s.flash && t - s.flash < 0.9 ? 4 * (1 - (t - s.flash) / 0.9) : 0;
    s.rot += ((SPIN[mood] ?? 0.32) + boost) * dt;
  }
  const kick = !reduced && t - s.kick < 0.5 ? 1 - 0.12 * Math.sin(((t - s.kick) / 0.5) * Math.PI) : 1;
  const breath = reduced ? 0 : mood === "sleepy" ? 0.04 * Math.sin(t * 1.2 + s.seed) : 0.025 * Math.sin(t * 1.6 + s.seed);
  const Rr = R * kick * (1 + breath + (mood === "focused" && !reduced ? 0.03 * Math.sin(t * 6 + s.seed) : 0));
  let rgb: RGB = s.rgb;
  if (mood === "pleading") {
    const k = 0.3 + 0.25 * Math.sin(t * 5);
    rgb = rgb.map((v, j) => v + (AMBER[j] - v) * k) as RGB;
  }
  if (mood === "stalled") rgb = rgb.map((v, j) => v + (RED[j] - v) * 0.75) as RGB;
  const hr = Rr * (big ? 2.5 : 1.8);
  ctx.globalAlpha = 1;
  sprite(ctx, "g" + s.rgb.join(","), s.rgb, x, y, hr, (big ? 0.22 : 0.16) * A);
  if (mood === "pleading") sprite(ctx, "g-amber", AMBER, x, y, hr, 0.14 * A * (0.5 + 0.5 * Math.sin(t * 5)));
  if (mood === "stalled") sprite(ctx, "g-red", RED, x, y, hr, 0.16 * A);

  const eq = Rr * (opt.quality ?? 1);
  const pts = mini || eq < 12 ? LOD[0] : eq < 22 ? LOD[1] : eq < 42 ? LOD[2] : LOD[3];
  const ca = Math.cos(s.rot), sa = Math.sin(s.rot), c2 = Math.cos(0.35), s2 = Math.sin(0.35);
  const szk = clamp(Rr / 23, mini ? 0.55 : 0.7, 2.3);
  const cs = opt.camScale ?? 1;
  const smx = mini ? 0 : -s.vx * cs * 2, smy = mini ? 0 : -s.vy * cs * 2;
  const fl = t >= s.flash && t - s.flash < 0.6 ? (1 - (t - s.flash) / 0.6) * 0.35 : 0;
  const jit = mood === "focused" && !reduced, stl = mood === "stalled";
  const cols: string[] = [];
  for (let bi = 0; bi < NB; bi++) {
    const d = (bi + 0.5) / NB;
    cols.push(rgb.map((v) => (v + (255 - v) * d * 0.5) | 0).join(","));
  }
  const pass = (front: boolean) => {
    let n = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const px = p[0] * ca + p[2] * sa, pz = -p[0] * sa + p[2] * ca;
      const yy = p[1] * c2 - pz * s2, zz = p[1] * s2 + pz * c2;
      if (zz > 0 !== front) continue;
      const jr = stl ? (p[3] - 0.5) * 0.28 : (jit ? Math.sin(t * 3 + p[3] * 20) * 0.03 : 0) + fl * p[3];
      const d = (zz + 1) / 2, lag = (1 - d) * 0.8 + p[3] * 0.6, sz = (0.8 + d * 1.2) * szk;
      BX[n] = x + px * Rr * (1 + jr) + smx * lag - sz / 2;
      BY[n] = y + yy * Rr * (1 + jr) + smy * lag - sz / 2;
      BS[n] = sz;
      BB[n] = Math.min(NB - 1, (d * NB) | 0);
      n++;
    }
    for (let bi = 0; bi < NB; bi++) {
      const d = (bi + 0.5) / NB;
      ctx.fillStyle = `rgba(${cols[bi]},${(0.22 + d * 0.78) * (front ? 0.5 : 1) * A * (opt.particleOpacity ?? 1)})`;
      ctx.beginPath();
      let any = false;
      for (let j = 0; j < n; j++) if (BB[j] === bi) { ctx.rect(BX[j], BY[j], BS[j], BS[j]); any = true; }
      if (any) ctx.fill();
    }
  };
  pass(false);
  if(!opt.particlesOnly)sprite(ctx, "core", null, x, y, Rr * (opt.softCore ? 0.72 : 0.95), A * (opt.softCore ? 0.8 : 1));
  pass(true);
  if(opt.auraOnly)return Rr;
  if(!opt.particlesOnly)drawFace(ctx, s, mood, x, y, Rr, A, t, opt.voice);

  const ink = opt.ink ?? "252,252,252";
  if (!mini && (mood === "focused" || mood === "thinking")) {
    ctx.fillStyle = `rgba(${rgb.map((v) => (v + (255 - v) * 0.4) | 0).join(",")},${0.62 * A})`;
    ctx.beginPath();
    for (const a0 of BAND) {
      const a = a0 + (reduced ? 0 : t * (mood === "thinking" ? 1.2 : 2.3));
      const bx = Math.cos(a) * Rr * 1.38, bz = Math.sin(a), by = bz * Rr * 0.3;
      const sz = (0.9 + (bz + 1) * 0.6) * szk * 0.75;
      ctx.rect(x + bx - sz / 2, y + by + Rr * 0.55 - sz / 2, sz, sz);
    }
    ctx.fill();
  }
  if (!mini && !opt.noRing && t >= s.flash && t - s.flash < 0.8) {
    const u = (t - s.flash) / 0.8;
    ctx.globalAlpha = (1 - u) * A;
    ctx.strokeStyle = `rgb(${s.rgb.join(",")})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, Rr * (1.1 + u * 1.4), 0, 7);
    ctx.stroke();
  }
  if (mood === "pleading" || mood === "stalled") {
    const ph = reduced ? 0.4 : (t * 0.9) % 1;
    ctx.globalAlpha = 0.55 * (1 - ph) * A;
    ctx.lineWidth = mini ? 1 : 1.2;
    ctx.strokeStyle = mood === "stalled" ? "#ff5667" : "#ff9800";
    ctx.beginPath();
    ctx.arc(x, y, Rr * (1.15 + ph * (mini ? 0.25 : 0.8)), 0, 7);
    ctx.stroke();
  }
  if (!mini && mood === "sleepy") {
    const u = reduced ? 0.3 : (t * 0.4 + s.seed) % 1;
    ctx.globalAlpha = A * 0.6 * (1 - u);
    ctx.fillStyle = `rgb(${ink})`;
    ctx.font = `600 ${Math.max(8, Rr * 0.35) | 0}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText("z", x + Rr * (0.7 + u * 0.4), y - Rr * (0.7 + u * 0.8));
  }
  if (!mini && mood === "thinking") {
    for (let i = 0; i < 3; i++) {
      const u = reduced ? 0.5 : (t * 1.5 + i * 0.33) % 1;
      ctx.globalAlpha = A * (0.3 + 0.7 * Math.sin(u * Math.PI));
      ctx.fillStyle = `rgb(${ink})`;
      ctx.beginPath();
      ctx.arc(x + Rr * (0.55 + i * 0.28), y - Rr * (1.15 + i * 0.12), Math.max(1.2, Rr * 0.06), 0, 7);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  return Rr;
}

function drawFace(ctx: CanvasRenderingContext2D, s: CharState, mood: Mood, x: number, y: number, R: number, A: number, t: number, voice?: number) {
  const gx = s.gx * R * 0.12, gy = s.gy * R * 0.09, ex = R * 0.3, ey = -R * 0.06 + gy, w = R * 0.15;
  const h = R * 0.24;
  const blinking = mood === "idle" && t > s.blink - 0.13;
  const light = s.rgb.map((v) => (v + (255 - v) * 0.85) | 0);
  const col = `rgba(${light.join(",")},${A})`;
  ctx.save();
  if (R > 9) sprite(ctx, "f" + s.rgb.join(","), s.rgb, x, y + ey, R * 0.6, 0.32 * A);
  ctx.fillStyle = col;
  ctx.strokeStyle = col;
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1.2, R * 0.075);
  const eye = (sx: number, hh: number, ww: number) => {
    ctx.beginPath();
    ctx.ellipse(x + sx + gx, y + ey, ww, Math.max(0.6, hh), 0, 0, 7);
    ctx.fill();
  };
  const arc = (sx: number) => {
    ctx.beginPath();
    ctx.arc(x + sx + gx, y + ey + R * 0.04, w * 1.05, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  };
  const mouth = (kind: "smile" | "big" | "flat" | "o" | "wobble" | "talk" | "frown") => {
    const mx = x + gx * 0.8, my = y + R * 0.3 + gy * 0.6;
    ctx.beginPath();
    if (kind === "smile") ctx.arc(mx, my - R * 0.1, R * 0.16, Math.PI * 0.2, Math.PI * 0.8);
    else if (kind === "big") ctx.arc(mx, my - R * 0.14, R * 0.22, Math.PI * 0.12, Math.PI * 0.88);
    else if (kind === "flat") { ctx.moveTo(mx - R * 0.1, my); ctx.lineTo(mx + R * 0.1, my); }
    else if (kind === "o") ctx.ellipse(mx, my, R * 0.07, R * 0.09, 0, 0, 7);
    else if (kind === "wobble") {
      ctx.moveTo(mx - R * 0.14, my + R * 0.02);
      ctx.quadraticCurveTo(mx - R * 0.07, my - R * 0.05, mx, my + R * 0.01);
      ctx.quadraticCurveTo(mx + R * 0.07, my + R * 0.06, mx + R * 0.14, my - R * 0.01);
    } else if (kind === "talk") ctx.ellipse(mx, my, R * 0.09, R * (0.02 + 0.07 * (voice ?? Math.abs(Math.sin(t * 11)))), 0, 0, 7);
    else ctx.arc(mx, my + R * 0.12, R * 0.14, Math.PI * 1.2, Math.PI * 1.8);
    if (kind === "o" || kind === "talk") ctx.fill();
    else ctx.stroke();
  };
  if (mood === "happy" || mood === "sending") { arc(-ex); arc(ex); mouth(mood === "happy" ? "big" : "smile"); }
  else if (mood === "focused") { eye(-ex, h * 0.55, w); eye(ex, h * 0.55, w); mouth("flat"); }
  else if (mood === "thinking") { eye(-ex, h * 0.8, w * 0.95); eye(ex, h * 0.8, w * 0.95); mouth("o"); }
  else if (mood === "pleading") {
    eye(-ex, h * 1.18, w * 1.2);
    eye(ex, h * 1.18, w * 1.2);
    ctx.fillStyle = `rgba(10,10,12,${0.85 * A})`;
    for (const sx of [-ex, ex]) {
      ctx.beginPath();
      ctx.arc(x + sx + gx + w * 0.35, y + ey - h * 0.35, w * 0.32, 0, 7);
      ctx.fill();
    }
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - ex - w * 1.2 + gx, y + ey - h * 1.55);
    ctx.lineTo(x - ex + w * 0.8 + gx, y + ey - h * 1.95);
    ctx.moveTo(x + ex + w * 1.2 + gx, y + ey - h * 1.55);
    ctx.lineTo(x + ex - w * 0.8 + gx, y + ey - h * 1.95);
    ctx.stroke();
    mouth("wobble");
  } else if (mood === "surprised") { eye(-ex, w * 1.25, w * 1.25); eye(ex, w * 1.25, w * 1.25); mouth("o"); }
  else if (mood === "talking") { eye(-ex, h, w); eye(ex, h, w); mouth("talk"); }
  else if (mood === "stalled") {
    for (const sx of [-ex, ex]) {
      const cx = x + sx, cy = y + ey, k = w * 0.95;
      ctx.beginPath();
      ctx.moveTo(cx - k, cy - k); ctx.lineTo(cx + k, cy + k);
      ctx.moveTo(cx + k, cy - k); ctx.lineTo(cx - k, cy + k);
      ctx.stroke();
    }
    mouth("frown");
  } else if (mood === "sleepy") {
    for (const sx of [-ex, ex]) {
      ctx.beginPath();
      ctx.moveTo(x + sx - w, y + ey + R * 0.02);
      ctx.lineTo(x + sx + w, y + ey + R * 0.02);
      ctx.stroke();
    }
    mouth("flat");
  } else { eye(-ex, blinking ? R * 0.02 : h, w); eye(ex, blinking ? R * 0.02 : h, w); mouth("smile"); }
  ctx.restore();
  if (t > s.blink) s.blink = t + 2.8 + Math.random() * 2.7;
}

/** The You character: a pearl orb whose surface picks up each team's colour
 * on the side facing that team. */
export function drawYou(ctx: CanvasRenderingContext2D, s: CharState, x: number, y: number, R: number, A: number, t: number, dt: number, tints: Array<{ a: number; rgb: RGB; w: number }>, opt: DrawOpts = {}): number {
  const Rr = drawChar(ctx, s, opt.mood ?? "idle", x, y, R, A, t, dt, { ...opt, noRing: false });
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const tn of tints) sprite(ctx, "g" + tn.rgb.join(","), tn.rgb, x + Math.cos(tn.a) * Rr * 0.62, y + Math.sin(tn.a) * Rr * 0.62, Rr * 0.95, tn.w * A);
  ctx.restore();
  return Rr;
}
