import { agents, states, robotMarkup } from './illustrated-robot.js';

const stage = document.querySelector('#stage');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = 0, state = 'idle', team = false, animated = !reduced.matches, sequenceTimer;
document.querySelector('#motion').checked = animated;

agents.forEach((agent, index) => {
  const button = document.createElement('button'); button.type = 'button';
  const dot = document.createElement('span'); dot.className = 'dot'; dot.style.background = agent.accent;
  button.append(dot, document.createTextNode(agent.name));
  button.addEventListener('click', () => select(index)); document.querySelector('#agents').append(button);
});
Object.entries(states).forEach(([value, label]) => {
  const button = document.createElement('button'); button.type = 'button';
  button.textContent = label; button.dataset.state = value;
  button.addEventListener('click', () => { stopSequence(); state = value; render(); });
  document.querySelector('#states').append(button);
});

function render() {
  stage.classList.toggle('team', team); stage.classList.toggle('is-animated', animated);
  stage.replaceChildren();
  (team ? agents.map((_, i) => i) : [selected]).forEach(index => {
    const wrap = document.createElement('div'); wrap.className = 'character-wrap';
    wrap.innerHTML = robotMarkup(agents[index], index === selected ? state : 'idle');
    if (index === selected && state === 'thinking') {
      const arm = wrap.querySelector('.right-arm').parentElement;
      wrap.querySelector('.robot-character').append(arm);
    }
    if (team) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'team-label';
      button.textContent = agents[index].name; button.setAttribute('aria-pressed', index === selected);
      button.addEventListener('click', () => select(index)); wrap.append(button);
    }
    stage.append(wrap);
  });
  document.querySelector('#agent-name').textContent = agents[selected].name;
  document.querySelector('#agent-role').textContent = `${agents[selected].role} · desenho 2D`;
  document.querySelector('#profile-dot').style.background = agents[selected].accent;
  document.querySelector('#scene-name').textContent = team ? 'Estudo de equipa' : agents[selected].name;
  document.querySelector('#scene-state').textContent = team ? `${agents[selected].name} · ${states[state]}` : states[state];
  [...document.querySelector('#agents').children].forEach((button, i) => button.setAttribute('aria-pressed', i === selected));
  document.querySelectorAll('#states button').forEach(button => button.setAttribute('aria-pressed', button.dataset.state === state));
  document.querySelector('#single-view').setAttribute('aria-pressed', !team);
  document.querySelector('#map-view').setAttribute('aria-pressed', team);
}
function select(index) { stopSequence(); selected = index; state = 'idle'; render(); }
function stopSequence() {
  clearInterval(sequenceTimer); sequenceTimer = undefined;
  document.querySelector('#sequence').textContent = 'Ver sequência';
  document.querySelector('#sequence').setAttribute('aria-pressed', false);
}
document.querySelector('#sequence').addEventListener('click', () => {
  if (sequenceTimer) { stopSequence(); return; }
  const sequence = ['idle', 'thinking', 'working', 'happy', 'talking', 'waiting', 'error'];
  let step = 0; state = sequence[step]; render();
  document.querySelector('#sequence').textContent = 'Parar sequência';
  document.querySelector('#sequence').setAttribute('aria-pressed', true);
  sequenceTimer = setInterval(() => { state = sequence[++step % sequence.length]; render(); }, 3000);
});
document.querySelector('#single-view').addEventListener('click', () => { team = false; render(); });
document.querySelector('#map-view').addEventListener('click', () => { team = true; render(); });
document.querySelector('#motion').addEventListener('change', event => {
  animated = event.target.checked; if (!animated) stopSequence(); stage.classList.toggle('is-animated', animated);
});
reduced.addEventListener('change', event => {
  animated = !event.matches; document.querySelector('#motion').checked = animated;
  if (!animated) stopSequence(); stage.classList.toggle('is-animated', animated);
});
document.addEventListener('visibilitychange', () => {
  stage.classList.toggle('is-animated', animated && !document.hidden); if (document.hidden) stopSequence();
});
window.addEventListener('pagehide', stopSequence);

// Freeze the current drawing's parts for portable SVG/PNG export.
function snapshot() {
  const original = stage.querySelectorAll('.robot-drawing')[team ? selected : 0];
  const clone = original.cloneNode(true);
  const originals = original.querySelectorAll('[data-motion]');
  clone.querySelectorAll('[data-motion]').forEach((part, i) => {
    const style = getComputedStyle(originals[i]);
    part.style.transform = style.transform; part.style.transformOrigin = style.transformOrigin;
    part.style.opacity = style.opacity; part.style.animation = 'none';
  });
  clone.setAttribute('width', '780'); clone.setAttribute('height', '840');
  return new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
}
function download(blob, extension) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = `${agents[selected].name.toLowerCase()}-${state}.${extension}`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
const exportStatus = document.querySelector('#export-status');
document.querySelector('#export-svg').addEventListener('click', () => {
  download(snapshot(), 'svg'); exportStatus.textContent = 'Desenho SVG preparado para transferência.';
});
document.querySelector('#export').addEventListener('click', async event => {
  const button = event.currentTarget; button.disabled = true;
  const url = URL.createObjectURL(snapshot());
  try {
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = 780; canvas.height = 840;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas indisponível');
    ctx.drawImage(image, 0, 0, 780, 840);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Exportação indisponível');
    download(blob, 'png'); exportStatus.textContent = 'Desenho PNG preparado com fundo transparente.';
  } catch { exportStatus.textContent = 'Não foi possível criar o PNG. Experimenta guardar o SVG.'; }
  finally { URL.revokeObjectURL(url); button.disabled = false; }
});
async function connection() {
  const text = document.querySelector('#connection'), button = document.querySelector('#refresh');
  button.disabled = true;
  try {
    const response = await fetch('/api/health', { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Ligação indisponível');
    text.textContent = 'Backend disponível · animações de demonstração';
    document.querySelector('#connection-dot').style.background = '#97bba0';
  } catch {
    text.textContent = 'Backend indisponível · desenho disponível';
    document.querySelector('#connection-dot').style.background = '#edb376';
  } finally { button.disabled = false; }
}
document.querySelector('#refresh').addEventListener('click', connection);
render(); void connection();
