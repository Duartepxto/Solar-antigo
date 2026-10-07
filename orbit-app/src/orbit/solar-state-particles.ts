import { toolIcon } from './tool-icons';

/** One body as the particle layer sees it, in canvas pixels. */
export interface SolarParticleBody {
  id: string; x: number; y: number; radius: number; color: string; colors?: string[];
  state: string; alpha: number; signal?: { kind: string } | null; signalAge: number; tool?: string | null;
}
interface Comet { from: string; to: string; color: string; age: number; duration: number; bend: number; fired: boolean; remaining: string[]; result?: boolean }
interface Point { x: number; y: number; front: boolean }

const TAU = Math.PI * 2;
const GOLD = '#ffd9a0', WHITE = '#fff4e2', WAITING = '#f0a35e', BLOCKED = '#ff7a7a';
const BURST_SECONDS = 1.4, HEADS = 3, HEAD_GAP = .1;
const BUSY = new Set(['working', 'thinking']), SETTLED = new Set(['ready', 'sleeping']);

/** Stable 0–1 seed per body, shared with the renderer so the face can follow its own satellite. */
export function particleSeed(id: string): number {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return (Math.abs(hash) % 1000) / 1000;
}
/** Where a working body's satellite is, as an angle on its tilted orbit. */
export function satelliteAngle(id: string, time: number): number { return time * .9 + particleSeed(id) * TAU; }
const ease = (p: number) => 1 - Math.pow(1 - p, 3);

function rgba(hex: string, alpha: number): string {
  const value = hex.replace('#', ''), full = value.length === 3 ? [...value].map(c => c + c).join('') : value.slice(0, 6);
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, alpha))})`;
}

/**
 * Solar's own particle language, drawn on the 2D layer above the bodies:
 * dust on a tilted orbit, a ring while thinking, a glass satellite carrying
 * the tool while working, a gathering at the top when the agent needs you,
 * a soft burst when a turn ends, and comets between agents. Anything on the
 * far side of an orbit is hidden where it would cross the body, so it reads
 * as passing behind the planet.
 */
export class SolarStateParticles {
  private comets: Comet[] = [];
  private bodies = new Map<string, SolarParticleBody>();
  private previous = new Map<string, string>();
  private bursts = new Map<string, number>();
  private time = 0;

  emit(from: string, to: string, color: string, remaining: string[] = [], result?: boolean) {
    const A = this.bodies.get(from), B = this.bodies.get(to);
    if (!A || !B) return;
    const distance = Math.hypot(B.x - A.x, B.y - A.y);
    this.comets.push({ from, to, color, age: 0, duration: Math.max(.8, Math.min(1.8, .55 + distance / 700)), bend: this.comets.length % 2 ? -1 : 1, fired: false, remaining, result });
    if (this.comets.length > 24) this.comets.shift();
  }

  /** Seconds since this body's last turn ended, or Infinity. */
  burstAge(id: string): number { const at = this.bursts.get(id); return at === undefined ? Infinity : this.time - at; }

  draw(ctx: CanvasRenderingContext2D, bodies: SolarParticleBody[], width: number, height: number, time: number, delta: number, moving: boolean, debris: boolean, onArrival: (id: string) => void) {
    this.time = time;
    this.bodies = new Map(bodies.map(body => [body.id, body]));
    for (const id of this.previous.keys()) if (!this.bodies.has(id)) { this.previous.delete(id); this.bursts.delete(id); }
    for (const body of bodies) {
      const before = this.previous.get(body.id);
      if (before && BUSY.has(before) && SETTLED.has(body.state)) this.bursts.set(body.id, time);
      this.previous.set(body.id, body.state);
      if (body.alpha <= .02 || body.x < -body.radius * 3 || body.y < -body.radius * 3 || body.x > width + body.radius * 3 || body.y > height + body.radius * 3) continue;
      ctx.save();
      this.drawBody(ctx, body, time, moving, debris);
      ctx.restore();
    }
    this.drawComets(ctx, delta, moving, onArrival);
    ctx.globalAlpha = 1;
  }

  private drawBody(ctx: CanvasRenderingContext2D, b: SolarParticleBody, time: number, moving: boolean, debris: boolean) {
    const R = b.radius, seed = particleSeed(b.id), tiltRot = -.22 + (seed - .5) * .3;
    const project = (angle: number, radius: number, tilt: number, rot: number): Point => {
      const x0 = Math.cos(angle) * radius, y0 = Math.sin(angle) * radius * tilt, c = Math.cos(rot), s = Math.sin(rot);
      return { x: b.x + x0 * c - y0 * s, y: b.y + x0 * s + y0 * c, front: Math.sin(angle) > 0 };
    };
    // the far half of an orbit disappears behind the body instead of crossing its face
    const hidden = (p: Point) => !p.front && Math.hypot(p.x - b.x, p.y - b.y) < R * .97;
    const square = (p: Point, size: number, color: string, alpha: number) => {
      if (hidden(p) || alpha <= 0) return;
      ctx.globalAlpha = alpha * b.alpha; ctx.fillStyle = color; ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    };
    const glow = (x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.globalAlpha = alpha * b.alpha * .35; ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, size * 2.2, 0, TAU); ctx.fill();
      ctx.globalAlpha = alpha * b.alpha; ctx.beginPath(); ctx.arc(x, y, size, 0, TAU); ctx.fill();
    };
    const fleck = Math.max(1.3, R * .024);
    const state = b.state;
    const calm = state === 'sleeping' || state === 'offline';

    if (debris) {
      const count = Math.max(8, Math.min(16, Math.round(R / 4)));
      for (let i = 0; i < count; i++) {
        const angle = i * TAU / count + time * (calm ? .04 : .1 + .03 * (i % 3)) + seed * TAU;
        const p = project(angle, R * (1.18 + ((i * 37) % 30) / 100), .3, tiltRot);
        square(p, fleck * (1 + (i % 3) * .3), i % 3 ? b.color : WHITE, (p.front ? .55 : .25) * (calm ? .5 : 1) * (BUSY.has(state) ? .6 : 1));
      }
    }

    if (state === 'thinking') {
      const count = R < 30 ? 28 : 48;
      for (let i = 0; i < count; i++) {
        const p = project(i * TAU / count + time * .9, R * (1.32 + (i % 4) * .02), .32, tiltRot);
        const twinkle = moving ? Math.pow(Math.sin(time * 3 + i * 1.7) * .5 + .5, 2) : .6;
        square(p, fleck * 1.1, i % 4 ? GOLD : WHITE, (p.front ? .3 : .12) + (p.front ? .6 : .22) * twinkle);
      }
    }

    if (state === 'working') {
      const angle = satelliteAngle(b.id, time), orbit = R * 1.55;
      for (let k = 9; k >= 1; k--) {
        const p = project(angle - k * .075, orbit, .34, tiltRot);
        if (hidden(p)) continue;
        glow(p.x, p.y, Math.max(.8, fleck * (2.4 - k * .2)), GOLD, (p.front ? .7 : .3) - k * .06);
      }
      const head = project(angle, orbit, .34, tiltRot);
      if (!hidden(head)) this.drawSatellite(ctx, head.x, head.y, Math.max(9, Math.min(15, R * .17)) * (head.front ? 1 : .8), b.tool, (head.front ? 1 : .55) * b.alpha);
    }

    if (state === 'waiting' || state === 'blocked') {
      const color = state === 'waiting' ? WAITING : BLOCKED, beat = moving ? Math.sin(time * 2.6) * .5 + .5 : .6;
      const halo = ctx.createRadialGradient(b.x, b.y, R * .9, b.x, b.y, R * 1.75);
      halo.addColorStop(0, rgba(color, .1 + .14 * beat)); halo.addColorStop(1, rgba(color, 0));
      ctx.globalAlpha = b.alpha; ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(b.x, b.y, R * 1.75, 0, TAU); ctx.fill();
      for (let i = 0; i < 18; i++) {
        const angle = -Math.PI / 2 + (i / 17 - .5) * 1.5 + (moving ? .12 * Math.sin(time * 1.2 + i) : 0);
        const p = project(angle, R * (1.24 + (moving ? .05 * Math.sin(time * 2 + i) : 0)), .95, 0);
        square({ ...p, front: true }, fleck * 1.1, color, .35 + .5 * beat * (i % 2 ? 1 : .7));
      }
      const bob = moving ? Math.sin(time * 3.4) * R * .04 : 0;
      this.drawBadge(ctx, b.x, b.y - R * 1.5 + bob, Math.max(9, Math.min(14, R * .16)), state === 'waiting' ? '!' : '×', color, b.alpha);
    }

    if (state === 'sleeping') {
      // slow bubbles drift up instead of letters
      for (let i = 0; i < 3; i++) {
        const u = moving ? (time * .22 + i / 3) % 1 : (i + 1) / 4;
        ctx.globalAlpha = b.alpha * (1 - u) * .55; ctx.fillStyle = WHITE;
        ctx.beginPath(); ctx.arc(b.x + R * (.62 + u * .3), b.y - R * (.62 + u * .75), Math.max(1.5, R * (.03 + u * .035)), 0, TAU); ctx.fill();
      }
    }

    if (b.signal?.kind === 'receiving' && b.signalAge < .8) {
      const p = b.signalAge / .8;
      ctx.globalAlpha = b.alpha * (1 - p) * .7; ctx.strokeStyle = GOLD; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(b.x, b.y, R * (1.04 + ease(p) * .5), 0, TAU); ctx.stroke();
    }

    const age = this.burstAge(b.id);
    if (age < BURST_SECONDS) {
      const p = Math.min(1, age / BURST_SECONDS), e = ease(p);
      for (let i = 0; i < 24; i++) {
        const angle = i * TAU / 24 + (i % 2) * .08 + seed, distance = R * (1.05 + 1.35 * e * (i % 3 ? 1 : .75));
        ctx.globalAlpha = b.alpha * (1 - p) * .9; ctx.fillStyle = i % 3 ? GOLD : WHITE;
        const size = fleck * 1.4 * (1 - p * .5);
        ctx.fillRect(b.x + Math.cos(angle) * distance - size / 2, b.y + Math.sin(angle) * distance - size / 2, size, size);
      }
      for (const lag of [0, .2]) {
        const q = Math.max(0, (p - lag) / (1 - lag));
        if (q <= 0) continue;
        ctx.globalAlpha = b.alpha * (1 - q) * .75; ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(b.x, b.y, R * (1.02 + .75 * ease(q)), 0, TAU); ctx.stroke();
      }
    }
  }

  /** A small glass orb with the tool's own icon, so the orbit says what the agent is doing. */
  private drawSatellite(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tool: string | null | undefined, alpha: number) {
    ctx.globalAlpha = alpha * .35; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.fill();
    ctx.globalAlpha = alpha;
    const body = ctx.createLinearGradient(x, y - r, x, y + r);
    body.addColorStop(0, 'rgba(46,52,62,.92)'); body.addColorStop(1, 'rgba(16,19,25,.92)');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,236,206,.55)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(x, y, r - 1.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    const icon = toolIcon(tool ?? 'unknown_tool', '#fff1d6');
    if (icon?.complete && icon.naturalWidth) { const s = r * 1.15; ctx.drawImage(icon, x - s / 2, y - s / 2, s, s); }
    else { ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(x, y, r * .28, 0, TAU); ctx.fill(); }
  }

  private drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, mark: string, color: string, alpha: number) {
    ctx.globalAlpha = alpha;
    const fill = ctx.createLinearGradient(x, y - r, x, y + r);
    fill.addColorStop(0, 'rgba(44,40,36,.94)'); fill.addColorStop(1, 'rgba(20,18,17,.94)');
    ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(color, .7); ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = color; ctx.font = `700 ${Math.round(r * 1.15)}px 'Jarvis Manrope', Manrope, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(mark, x, y + r * .05);
  }

  private drawComets(ctx: CanvasRenderingContext2D, delta: number, moving: boolean, onArrival: (id: string) => void) {
    const relays: Comet[] = [];
    this.comets = this.comets.filter(comet => {
      const A = this.bodies.get(comet.from), B = this.bodies.get(comet.to);
      if (!A || !B) return false;
      if (moving) comet.age += delta;
      const dx = B.x - A.x, dy = B.y - A.y, d = Math.max(1, Math.hypot(dx, dy)), ux = dx / d, uy = dy / d;
      const P0 = { x: A.x + ux * A.radius * 1.1, y: A.y + uy * A.radius * 1.1 }, P2 = { x: B.x - ux * B.radius * 1.1, y: B.y - uy * B.radius * 1.1 };
      const P1 = { x: (P0.x + P2.x) / 2 - uy * d * .2 * comet.bend, y: (P0.y + P2.y) / 2 + ux * d * .2 * comet.bend };
      const at = (u: number) => { const v = 1 - u; return { x: v * v * P0.x + 2 * v * u * P1.x + u * u * P2.x, y: v * v * P0.y + 2 * v * u * P1.y + u * u * P2.y }; };
      const alpha = Math.max(A.alpha, B.alpha);
      for (let h = 0; h < HEADS; h++) {
        const u = (comet.age - h * HEAD_GAP) / comet.duration;
        if (u <= 0 || u >= 1.05) continue;
        for (let j = 11; j >= 0; j--) {
          const uj = Math.min(1, u) - j * .016;
          if (uj < 0) continue;
          const p = at(uj), fade = 1 - Math.max(0, u - 1) / .05;
          ctx.globalAlpha = alpha * fade * (j ? .7 - j * .055 : 1) * (h ? .7 : 1);
          ctx.fillStyle = j ? comet.color : WHITE;
          ctx.beginPath(); ctx.arc(p.x, p.y, j ? Math.max(.8, 2.6 - j * .18) : 3.2, 0, TAU); ctx.fill();
        }
      }
      if (!comet.fired && comet.age >= comet.duration) {
        comet.fired = true; onArrival(B.id);
        if (comet.remaining.length) relays.push({ ...comet, from: B.id, to: comet.remaining[0], remaining: comet.remaining.slice(1), age: 0, fired: false });
      }
      return comet.age < comet.duration + HEADS * HEAD_GAP + .1;
    });
    for (const relay of relays) this.emit(relay.from, relay.to, relay.color, relay.remaining, relay.result);
  }
}
