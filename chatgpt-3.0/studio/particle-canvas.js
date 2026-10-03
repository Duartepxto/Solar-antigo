// Canvas 2D only. Surface samples carry a depth value for shading and poses;
// there are no meshes, lights, textures, WebGL contexts or 3D model assets.
const noise = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16));

export function createParticleRobot(color) {
  const accent = rgb(color), shell = mix([226, 231, 237], accent, .20);
  const points = [];
  const add = (part, x, y, z, normal, tint = shell, size = 1) => points.push({ part, x, y, z, normal, tint, size, seed: noise(points.length + 3) });
  function surface(part, center, radii, count, tint, filter) {
    for (let i = 0; i < count; i++) {
      const ny = 1 - 2 * (i + .5) / count, radius = Math.sqrt(1 - ny * ny), angle = i * 2.39996323;
      const nx = Math.cos(angle) * radius, nz = Math.sin(angle) * radius;
      const x = center[0] + nx * radii[0], y = center[1] + ny * radii[1], z = center[2] + nz * radii[2];
      if (!filter || filter(x, y, z)) add(part, x, y, z, [nx, ny, nz], tint);
    }
  }
  surface('head', [0, -.66, 0], [.62, .51, .46], 1700, shell,
    (x, y, z) => !(z > .19 && (x / .54) ** 2 + ((y + .63) / .355) ** 2 < 1));
  for (let i = 0; i < 150; i++) {
    const a = i / 150 * Math.PI * 2;
    add('head', Math.cos(a) * .54, Math.sin(a) * .355 - .63, .29 + .095 * Math.abs(Math.sin(a)), [0, 0, 1], accent, .8);
  }
  surface('body', [0, .10, 0], [.28, .34, .22], 490, shell);
  surface('body', [0, -.20, 0], [.18, .06, .13], 75, accent);
  surface('pack', [0, .08, -.25], [.21, .25, .09], 170, accent);
  for (const side of [-1, 1]) {
    surface(`arm${side}`, [side * .35, .10, .01], [.085, .23, .09], 165, shell);
    surface(`arm${side}`, [side * .36, .33, .025], [.095, .105, .10], 80, shell);
    surface('body', [side * .135, .52, 0], [.075, .15, .085], 95, shell);
    surface('body', [side * .15, .70, .06], [.135, .085, .17], 130, shell);
    for (let i = 0; i < 95; i++) {
      const a = i / 95 * Math.PI * 2;
      add('head', side * .635, Math.cos(a) * .135 - .66, Math.sin(a) * .135, [side, 0, 0], accent, .85);
    }
    for (let row = 0; row < 9; row++) for (let col = 0; col < 3; col++) {
      add(`eye${side}`, side * .20 + (col - 1) * .018, -.72 + row * .018, .47, [0, 0, 1], [255, 247, 224], 1.5);
    }
  }
  for (let i = 0; i < 22; i++) add('head', Math.sin(i * .11) * .014, -1.16 - i * .009, 0, [0, 0, 1], accent, .75);
  for (const side of [-1, 1]) {
    surface('leaf', [side * .085, -1.37, 0], [.085, .10, .025], 75, [139, 182, 132]);
  }
  for (let i = 0; i < 7; i++) add('mouth', (i - 3) * .014, -.43 + Math.abs(i - 3) * -.002, .42, [0, 0, 1], accent, .8);
  return { points, accent };
}

export function drawRobot(ctx, robot, cx, cy, scale, time, { state = 'idle', animated = true, yaw = -.25, density = .75 } = {}) {
  const t = animated ? time : 0, sy = Math.sin(yaw), cyaw = Math.cos(yaw);
  const bob = animated ? Math.sin(t * 1.8) * .013 : 0;
  const headTilt = state === 'thinking' ? .11 : state === 'happy' && animated ? Math.sin(t * 2.7) * .035 : 0;
  const cosTilt = Math.cos(headTilt), sinTilt = Math.sin(headTilt);
  const blink = animated && t % 4.9 > 4.76;
  const transformed = [];
  const densityCut = 1 - density;
  for (const p of robot.points) {
    const face = p.part.startsWith('eye') || p.part === 'mouth';
    if (!face && p.seed < densityCut) continue;
    let { x, y, z } = p;
    if (p.part.startsWith('arm')) {
      const side = p.part === 'arm1' ? 1 : -1;
      const a = state === 'happy' ? -side * .6 : state === 'thinking' && side === 1 ? -.7 : 0;
      const ox = x - side * .34, oy = y + .08;
      x = side * .34 + ox * Math.cos(a) - oy * Math.sin(a); y = -.08 + ox * Math.sin(a) + oy * Math.cos(a);
      if (state === 'working') { z += .14; y -= .08 + (animated ? Math.sin(t * 5 + side) * .035 : 0); }
      if (state === 'talking' && animated) x += Math.sin(t * 3 + side) * .025;
    }
    if (p.part === 'head' || p.part === 'leaf' || face) {
      const hy = y + .66; const hx = x;
      x = hx * cosTilt - hy * sinTilt; y = hx * sinTilt + hy * cosTilt - .66;
    }
    if (p.part.startsWith('eye')) {
      const squash = blink ? .10 : state === 'happy' ? .25 : state === 'working' ? .66 : 1;
      y = -.648 + (y + .648) * squash;
    }
    if (p.part === 'mouth' && state === 'talking') y += animated ? Math.sin(t * 10) * .015 : 0;
    const rx = x * cyaw + z * sy, rz = -x * sy + z * cyaw;
    const front = -p.normal[0] * sy + p.normal[2] * cyaw;
    if (face && cyaw < .12) continue;
    const depth = .075;
    const alpha = face ? 1 : .045 + Math.max(0, front) * .86;
    const shimmer = animated ? .90 + .10 * Math.sin(t * 1.5 + p.seed * 9) : 1;
    transformed.push({ x: cx + rx * scale, y: cy + (y + bob - rz * depth) * scale, z: rz, p, alpha: alpha * shimmer });
  }
  transformed.sort((a, b) => a.z - b.z);
  const unit = Math.max(.9, Math.min(3, scale / 85));
  for (const v of transformed) {
    const p = v.p;
    const face = p.part.startsWith('eye') || p.part === 'mouth';
    const tint = state === 'error' && face ? [255, 102, 120] : p.tint;
    const pulse = state === 'waiting' && animated ? .72 + Math.sin(t * 2.7) * .22 : 1;
    const size = unit * p.size * (.75 + p.seed * .55);
    ctx.fillStyle = `rgba(${tint.join(',')},${(v.alpha * pulse).toFixed(3)})`;
    ctx.fillRect(v.x - size / 2, v.y - size / 2, size, size);
  }
  // Two restrained glows underneath the individual square eye samples.
  if (cyaw > .12 && !blink) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const side of [-1, 1]) {
      const x = cx + (side * .20 * cyaw + .47 * sy) * scale, y = cy + (-.648 + bob - .47 * .075) * scale;
      const halo = ctx.createRadialGradient(x, y, 0, x, y, scale * .08);
      halo.addColorStop(0, `rgba(${robot.accent.join(',')},.08)`); halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo; ctx.fillRect(x - scale * .08, y - scale * .08, scale * .16, scale * .16);
    }
    ctx.restore();
  }
  return transformed.length;
}

export function drawGround(ctx, x, y, scale, tint) {
  for (let i = 0; i < 420; i++) {
    const px = (noise(i + 100) - .5) * 2.9, py = (noise(i + 2000) - .5) * .62;
    const r = (px / 1.45) ** 2 + (py / .31) ** 2;
    if (r > 1) continue;
    const a = (1 - r) * (.08 + noise(i + 900) * .18);
    ctx.fillStyle = `rgba(${tint.join(',')},${a.toFixed(3)})`;
    const size = .65 + noise(i + 71) * .65;
    ctx.fillRect(x + px * scale, y + py * scale, size, size);
  }
}
