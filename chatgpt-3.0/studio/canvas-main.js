import { createParticleRobot, drawRobot, drawGround } from './particle-canvas.js';

const definitions = [
  { name: 'Jarvis', role: 'Coordenação · robô de partículas', color: '#ffc184', x: 0, y: .25, scale: 1 },
  { name: 'Investigador', role: 'Pesquisa · variante azul', color: '#73bbff', x: -2.25, y: -.30, scale: .66 },
  { name: 'Programador', role: 'Desenvolvimento · variante verde', color: '#a4d796', x: 0, y: -1.25, scale: .66 },
  { name: 'Designer', role: 'Design · variante rosa', color: '#e798d8', x: 2.25, y: -.30, scale: .66 },
];
const states = { idle: 'Repouso', thinking: 'Pensar', working: 'Trabalhar', talking: 'Falar', happy: 'Concluir', waiting: 'Aprovação', error: 'Erro' };
const viewport = document.querySelector('#viewport'), canvas = document.createElement('canvas');
canvas.setAttribute('aria-label', 'Robô desenhado com partículas quadradas. Os controlos ao lado permitem escolher a pose e a expressão.');
viewport.prepend(canvas);
const ctx = canvas.getContext('2d');
const robots = definitions.map(d => createParticleRobot(d.color));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let animated = !reduced.matches, selected = 0, state = 'idle', mode = 'single', yaw = -.40, density = .75;
let width = 0, height = 0, zoom = 1, pan = { x: 0, y: 0 }, drag, frameId, lastFrame = -Infinity;
let lastPositions = [], count = 0;
document.querySelector('#motion').checked = animated;
const labels = definitions.map((d, i) => {
  const button = document.createElement('button'); button.className = 'agent-label'; button.type = 'button';
  const title = document.createElement('strong'); title.textContent = d.name;
  const subtitle = document.createElement('small'); subtitle.textContent = 'Pré-visualização'; button.append(title, subtitle);
  button.addEventListener('click', () => select(i)); document.querySelector('#labels').append(button); return button;
});
definitions.forEach((d, i) => {
  const button = document.createElement('button'); button.type = 'button';
  const dot = document.createElement('span'); dot.className = 'dot'; dot.style.background = d.color;
  button.append(dot, document.createTextNode(d.name)); button.addEventListener('click', () => select(i)); document.querySelector('#agents').append(button);
});
Object.entries(states).forEach(([key, label]) => {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.dataset.state = key;
  button.addEventListener('click', () => { state = key; sync(); }); document.querySelector('#states').append(button);
});
function sync() {
  document.querySelector('#agent-name').textContent = definitions[selected].name;
  document.querySelector('#agent-role').textContent = definitions[selected].role;
  document.querySelector('#profile-dot').style.background = definitions[selected].color;
  [...document.querySelector('#agents').children].forEach((b, i) => b.setAttribute('aria-pressed', i === selected));
  document.querySelectorAll('[data-state]').forEach(b => b.setAttribute('aria-pressed', b.dataset.state === state));
  labels.forEach((b, i) => b.setAttribute('aria-pressed', i === selected));
  document.querySelector('#map-view').setAttribute('aria-pressed', mode === 'map');
  document.querySelector('#single-view').setAttribute('aria-pressed', mode === 'single');
}
function select(i) { selected = i; state = 'idle'; sync(); }
function reset() { zoom = 1; pan = { x: 0, y: 0 }; }
function setMode(next) { mode = next; reset(); sync(); }
document.querySelector('#map-view').addEventListener('click', () => setMode('map'));
document.querySelector('#single-view').addEventListener('click', () => setMode('single'));
document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#motion').addEventListener('change', e => { animated = e.target.checked; });
reduced.addEventListener('change', e => { animated = !e.matches; document.querySelector('#motion').checked = animated; });
document.querySelector('#density').addEventListener('input', e => { density = Number(e.target.value) / 100; document.querySelector('#density-value').textContent = `${e.target.value}%`; });
document.querySelectorAll('[data-angle]').forEach(button => button.addEventListener('click', () => {
  setMode('single'); yaw = { front: 0, side: 1.45, back: Math.PI, three: -.40 }[button.dataset.angle];
  document.querySelectorAll('[data-angle]').forEach(b => b.setAttribute('aria-pressed', b === button));
}));
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved ||= Math.hypot(dx, dy) > 5; if (drag.moved) pan = { x: drag.px + dx, y: drag.py + dy }; });
canvas.addEventListener('pointerup', e => {
  if (drag && !drag.moved) { const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = lastPositions.find(p => Math.abs(x - p.x) < p.scale * .70 && y > p.y - p.scale * 1.5 && y < p.y + p.scale * .8); if (hit) select(hit.i);
  } drag = null;
});
canvas.addEventListener('pointercancel', () => { drag = null; });
canvas.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.min(2.3, Math.max(.55, zoom * Math.exp(-e.deltaY * .001))); }, { passive: false });
window.addEventListener('keydown', e => { if (e.key === 'Escape') { setMode('single'); yaw = -.40; } });
const resize = new ResizeObserver(() => {
  const box = viewport.getBoundingClientRect(); width = box.width; height = box.height;
  const dpr = Math.min(devicePixelRatio, 2); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}); resize.observe(viewport);
function render(ms) {
  frameId = requestAnimationFrame(render);
  if (!ctx || document.hidden || ms - lastFrame < (animated ? 1000 / 30 : 1000 / 12)) return;
  lastFrame = ms; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, width, height);
  const base = Math.min(width / (mode === 'map' ? 6.7 : 3.4), (height - 175) / (mode === 'map' ? 4.8 : 3.2), mode === 'map' ? 120 : 190) * zoom;
  const centerX = width * .5 + pan.x, centerY = height * .57 + pan.y;
  lastPositions = definitions.map((d, i) => ({ i, x: centerX + (mode === 'map' ? d.x * base : 0), y: centerY + (mode === 'map' ? d.y * base : 0), scale: base * (mode === 'map' ? d.scale : 1) })).filter(p => mode === 'map' || p.i === selected);
  if (mode === 'map') {
    const center = lastPositions[0];
    lastPositions.slice(1).forEach(p => { ctx.strokeStyle = `rgba(${robots[p.i].accent.join(',')},.14)`; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(center.x, center.y + center.scale * .85); ctx.lineTo(p.x, p.y + p.scale * .85); ctx.stroke(); });
  }
  labels.forEach(label => { label.hidden = true; }); count = 0;
  for (const p of [...lastPositions].sort((a, b) => a.y - b.y)) {
    drawGround(ctx, p.x, p.y + p.scale * .9, p.scale, robots[p.i].accent);
    count += drawRobot(ctx, robots[p.i], p.x, p.y, p.scale, ms / 1000 + p.i * 1.3, { state: p.i === selected ? state : 'idle', animated, yaw, density });
    const label = labels[p.i]; label.hidden = false; label.style.left = `${p.x}px`; label.style.top = `${p.y + p.scale * 1.1}px`;
  }
  document.querySelector('#particle-count').textContent = `${count.toLocaleString('pt-PT')} partículas visíveis`;
}
if (!ctx) { document.querySelector('#failure').hidden = false; document.querySelector('#failure').textContent = 'O navegador não disponibilizou o canvas. Experimenta abrir noutro navegador.'; document.querySelector('#export').disabled = true; }
else { sync(); frameId = requestAnimationFrame(render); }
document.querySelector('#export').addEventListener('click', () => {
  canvas.toBlob(blob => { if (!blob) { document.querySelector('#export-status').textContent = 'Não foi possível guardar a imagem.'; return; }
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'jarvis-particulas.png'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector('#export-status').textContent = 'Imagem PNG guardada com a pose e o enquadramento atuais.';
  }, 'image/png');
});
window.addEventListener('pagehide', () => { cancelAnimationFrame(frameId); resize.disconnect(); }, { once: true });
async function checkConnection() {
  const button = document.querySelector('#refresh'); button.disabled = true;
  try { const response = await fetch('/api/health', { signal: AbortSignal.timeout(5000) }); if (!response.ok) throw new Error(); document.querySelector('#connection').textContent = 'Backend Orbit acessível. Movimentos de pré-visualização.'; document.querySelector('#connection-dot').style.background = '#a4d796'; }
  catch { document.querySelector('#connection').textContent = 'Backend indisponível. O desenho continua disponível.'; document.querySelector('#connection-dot').style.background = '#ffac76'; }
  finally { button.disabled = false; }
}
document.querySelector('#refresh').addEventListener('click', checkConnection); checkConnection();
