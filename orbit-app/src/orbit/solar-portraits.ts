import type { SolarRenderBody, SolarRenderSettings, SolarWorldEngine } from './solar-renderer';

const CELL = 128, COLUMNS = 4;
type Target = { canvas: HTMLCanvasElement; body: SolarRenderBody; ready: () => void };
const targets = new Set<Target>();
let engine: SolarWorldEngine | null = null;
let creating = false, generation = 0, signature = '';
let model = new Map<string, SolarRenderBody>();
let preferences: SolarRenderSettings = { interactive: true, debris: true, glow: 1 };
let paused = false;
let cells = new Map<string, { x: number; y: number }>();

/** One scene for all visible portraits. Every copy uses the map's model and
 * live activity, rather than an unrelated mascot or a WebGL context per row. */
export function layoutSolarPortraits(bodies: SolarRenderBody[]) {
  return bodies.map((body, index) => ({ ...body, background: false, grabbed: false,
    x: (index % COLUMNS + .5) * CELL, y: (Math.floor(index / COLUMNS) + .5) * CELL,
    diameter: body.skin === 'saturn' || body.skin === 'uranus' ? 45 : 82,
  }));
}
function update() {
  if (!engine || !targets.size) return;
  const unique = new Map([...targets].map(target => [target.body.id, model.get(target.body.id) ?? target.body]));
  const bodies = layoutSolarPortraits([...unique.values()]);
  const next = JSON.stringify([bodies, preferences, paused]);
  if (next === signature) return;
  signature = next;
  cells = new Map(bodies.map(body => [body.id, { x: body.x - CELL / 2, y: body.y - CELL / 2 }]));
  engine.update(bodies, COLUMNS * CELL, Math.max(CELL, Math.ceil(bodies.length / COLUMNS) * CELL), paused, preferences);
}
async function start() {
  if (engine || creating || !targets.size) return;
  creating = true;
  const token = generation;
  const host = document.createElement('div'), canvas = document.createElement('canvas');
  host.appendChild(canvas);
  try {
    const { createSolarWorld } = await import('./solar-renderer.js');
    const created = await createSolarWorld(canvas);
    if (token !== generation || !targets.size) { created.dispose(); return; }
    engine = created;
    created.setFrameListener((surface, particles) => {
      const ratio = surface.width / (COLUMNS * CELL);
      for (const target of targets) {
        const cell = cells.get(target.body.id), ctx = target.canvas.getContext('2d');
        if (!cell || !ctx || !target.canvas.isConnected) continue;
        const size = Math.max(32, Math.round(target.canvas.clientWidth * Math.min(devicePixelRatio || 1, 2)));
        if (target.canvas.width !== size) target.canvas.width = target.canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(surface, cell.x * ratio, cell.y * ratio, CELL * ratio, CELL * ratio, 0, 0, size, size);
        ctx.drawImage(particles, cell.x * ratio, cell.y * ratio, CELL * ratio, CELL * ratio, 0, 0, size, size);
        target.ready();
      }
    });
    signature = ''; update();
  } catch { /* The component retains the same model's static preview. */ }
  finally { creating = false; if (token !== generation && targets.size) void start(); }
}
export function registerSolarPortrait(canvas: HTMLCanvasElement, body: SolarRenderBody, ready: () => void) {
  const target = { canvas, body, ready }; targets.add(target); signature = ''; update(); void start();
  return () => {
    targets.delete(target); signature = '';
    if (!targets.size) { generation++; engine?.dispose(); engine = null; cells.clear(); }
    else update();
  };
}
export function publishSolarPortraits(bodies: SolarRenderBody[], settings: SolarRenderSettings, motionPaused: boolean) {
  model = new Map(bodies.map(body => [body.id, body])); preferences = settings; paused = motionPaused; update();
}
export function pointSolarPortrait(id: string, x: number, y: number) {
  const cell = cells.get(id); if (cell) engine?.pointAt({ x: cell.x + x * CELL, y: cell.y + y * CELL });
}
export function leaveSolarPortrait() { engine?.pointAt(null); }
