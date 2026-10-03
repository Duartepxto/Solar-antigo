import * as THREE from 'three';

// Surface samples, not a solid mesh: every visible mark is a square point.
// Named groups keep the head, arms and expressions independently articulated.
const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function cloud(samples, tint, name, size = .024) {
  const positions = [], colors = [];
  const color = new THREE.Color(tint);
  samples.forEach(([x, y, z], i) => {
    positions.push(x, y, z);
    const intensity = .28 + hash(i + x * 93 + y * 71) * .72;
    colors.push(color.r * intensity, color.g * intensity, color.b * intensity);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size, color: '#ffffff', vertexColors: true, transparent: true, opacity: .86, depthWrite: false, sizeAttenuation: true, toneMapped: false });
  const points = new THREE.Points(geometry, material); points.name = name;
  points.userData.baseSize = size;
  return points;
}

function ellipsoid(count, radii, filter) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - 2 * (i + .5) / count;
    const r = Math.sqrt(1 - y * y), angle = i * 2.39996323;
    const point = [Math.cos(angle) * r * radii[0], y * radii[1], Math.sin(angle) * r * radii[2]];
    if (!filter || filter(point)) result.push(point);
  }
  return result;
}

export function createRobot(hex = '#ffbf80', variant = 'main') {
  const root = new THREE.Group(); root.name = `particle-robot-${variant}`;
  const character = new THREE.Group(); character.name = 'character'; root.add(character);
  const tint = new THREE.Color('#bfcbd3').lerp(new THREE.Color(hex), .25);
  const pieces = [];
  function add(parent, name, samples, color, position = [0, 0, 0], size) {
    const points = cloud(samples, color, name, size);
    points.position.set(...position); parent.add(points); pieces.push(points); return points;
  }
  const body = new THREE.Group(); body.name = 'body'; character.add(body);
  add(body, 'torso', ellipsoid(480, [.35, .39, .24]), tint, [0, .96, 0]);
  add(body, 'collar', ellipsoid(80, [.20, .065, .15]), hex, [0, 1.35, 0], .02);
  const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 1.92, 0); body.add(head);
  // Remove the front oval to make the visor negative space rather than glass.
  const shell = ellipsoid(1900, [.69, .58, .49], ([x, y, z]) => !(z > .21 && (x / .60) ** 2 + ((y + .035) / .42) ** 2 < 1));
  add(head, 'head-shell', shell, tint);
  const edge = [];
  for (let i = 0; i < 160; i++) {
    const a = i / 160 * Math.PI * 2;
    edge.push([Math.cos(a) * .60, Math.sin(a) * .42 - .035, .32 + .10 * Math.abs(Math.sin(a))]);
  }
  add(head, 'visor-edge', edge, hex, [0, 0, 0], .018);
  const eyes = [-1, 1].map((side) => {
    const samples = [];
    for (let y = -.085; y <= .085; y += .023) for (let x = -.025; x <= .025; x += .022) samples.push([x, y, 0]);
    return add(head, `eye-${side}`, samples, '#fff6dd', [side * .22, -.02, .50], .028);
  });
  const mouth = add(head, 'mouth', [[-.035, 0, 0], [0, -.008, 0], [.035, 0, 0]], hex, [0, -.24, .475], .018);
  for (const side of [-1, 1]) {
    const ear = [];
    for (let i = 0; i < 110; i++) {
      const a = i / 110 * Math.PI * 2;
      const r = .15 + (i % 3) * .008;
      ear.push([0, Math.cos(a) * r, Math.sin(a) * r]);
    }
    add(head, `ear-${side}`, ear, hex, [side * .70, -.015, 0], .022);
  }
  const antenna = new THREE.Group(); antenna.name = 'antenna'; head.add(antenna);
  const stem = Array.from({ length: 22 }, (_, i) => [Math.sin(i * .12) * .015, .55 + i * .009, 0]);
  add(antenna, 'antenna-stem', stem, hex, [0, 0, 0], .019);
  for (const side of [-1, 1]) {
    const leaf = add(antenna, `antenna-leaf-${side}`, ellipsoid(80, [.065, .13, .025]), '#9cc48c', [side * .082, .78, 0], .018);
    leaf.rotation.z = side * -.70;
  }
  const arms = [-1, 1].map((side) => {
    const pivot = new THREE.Group(); pivot.name = `arm-${side}`; pivot.position.set(side * .39, 1.12, 0); body.add(pivot);
    add(pivot, 'shoulder', ellipsoid(70, [.095, .095, .095]), hex);
    add(pivot, 'arm', ellipsoid(160, [.09, .22, .095]), tint, [side * .035, -.22, .02]);
    add(pivot, 'hand', ellipsoid(75, [.095, .11, .10]), tint, [side * .05, -.41, .04]);
    return pivot;
  });
  for (const side of [-1, 1]) {
    add(body, `leg-${side}`, ellipsoid(100, [.09, .17, .105]), tint, [side * .17, .48, 0]);
    add(body, `foot-${side}`, ellipsoid(120, [.15, .09, .20]), tint, [side * .18, .29, .06]);
  }
  // A sparse rear module hints at the old backpack without reproducing it.
  add(body, 'back-module', ellipsoid(220, [.23, .26, .12]), hex, [0, .99, -.26], .02);
  const badge = [];
  for (let i = 0; i < 12; i++) badge.push([Math.cos(i / 12 * Math.PI * 2) * .035, Math.sin(i / 12 * Math.PI * 2) * .035, 0]);
  add(body, 'badge', badge, hex, [0, 1.04, .24], .023);
  const tools = new THREE.Group(); tools.name = 'reserved-accessories'; root.add(tools);
  let state = 'idle', pointSize = 1;
  function update(time, animate = true) {
    const t = animate ? time : 0;
    const busy = state === 'working', thinking = state === 'thinking', happy = state === 'happy';
    character.position.y = animate ? Math.sin(t * 1.6) * .025 : 0;
    head.rotation.set(busy ? .12 : 0, thinking ? Math.sin(t * .8) * .18 : 0, thinking ? .11 : happy ? Math.sin(t * 2.5) * .04 : 0);
    antenna.rotation.z = animate ? Math.sin(t * 1.1) * .05 : 0;
    arms.forEach((arm, i) => {
      const side = i ? 1 : -1;
      arm.rotation.x = busy ? -.5 + (animate ? Math.sin(t * 5 + i) * .10 : 0) : state === 'talking' ? -.2 : 0;
      arm.rotation.z = side * (.10 + (happy ? .45 : 0)) + (thinking && i === 1 ? -.7 : 0);
    });
    const blink = animate && t % 4.7 > 4.55;
    eyes.forEach((eye, i) => {
      eye.scale.y = blink ? .12 : happy ? .35 : busy ? .7 : 1;
      eye.rotation.z = state === 'error' ? (i ? -.5 : .5) : 0;
      eye.material.color.set(state === 'error' ? '#ff6778' : '#ffffff');
    });
    mouth.scale.y = state === 'talking' ? 1 + (animate ? Math.abs(Math.sin(t * 9)) * 2 : 0) : 1;
    pieces.forEach((piece, i) => {
      piece.material.size = piece.userData.baseSize * pointSize;
      piece.material.opacity = state === 'waiting' && animate ? .66 + Math.sin(t * 2.7) * .17 : .80 + (animate ? Math.sin(t * 1.7 + i) * .045 : 0);
    });
  }
  function setState(next) { state = next; update(0, false); }
  function setPointSize(next) { pointSize = next; }
  function dispose() { pieces.forEach(p => { p.geometry.dispose(); p.material.dispose(); }); }
  const particleCount = pieces.reduce((n, p) => n + p.geometry.attributes.position.count, 0);
  root.userData.particleCount = particleCount;
  return { root, character, head, arms, eyes, tools, update, setState, setPointSize, dispose, particleCount };
}

export function createParticleWorld() {
  const root = new THREE.Group(); root.name = 'particle-world';
  const ground = [];
  // An irregular patch of points fades into black, never a solid game terrain.
  for (let i = 0; i < 1500; i++) {
    const x = (hash(i + 10) - .5) * 9, z = (hash(i + 5000) - .5) * 6;
    if ((x / 4.5) ** 2 + (z / 3) ** 2 > .82 + hash(i + 77) * .18) continue;
    ground.push([x, -.02 + hash(i + 93) * .018, z]);
  }
  root.add(cloud(ground, '#425466', 'ground-particles', .014));
  const path = [];
  for (let i = 0; i < 180; i++) {
    const x = (i / 179 - .5) * 7;
    path.push([x, .006, Math.sin(x * .7) * .45]);
  }
  root.add(cloud(path, '#aa8058', 'path-particles', .016));
  return { root, dispose() { root.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); }); } };
}
