/** Local, procedural 3D workspace. No network assets or agent-side mutations. */
export type WorkspaceSkin = 'solar' | 'lunar' | 'ocean' | 'ember';

export interface WorkspaceSceneAgent {
  id: string;
  name: string;
  busy: boolean;
  waiting: boolean;
  color?: string;
  skin?: WorkspaceSkin;
  teamKey?: string;
  teamName?: string;
  chief?: boolean;
  host?: boolean;
}

export interface WorkspaceSceneHandle {
  setAgents(agents: WorkspaceSceneAgent[]): void;
  setSkin(id: string, skin: WorkspaceSkin): void;
  focusAgent(id: string | null): void;
  setActivity(id: string, activity: { busy?: boolean; waiting?: boolean }): void;
  setZoom(delta: number): void;
  resetCamera(): void;
  setMotion(enabled: boolean): void;
  resize(): void;
  dispose(): void;
}

interface SceneOptions {
  signal?: AbortSignal;
  onSelect(id: string | null): void;
  onReady?(): void;
  onError?(error: Error): void;
}

// The existing vendored Three.js is JS without declarations. Keep that untyped
// boundary inside this renderer; the React integration uses the typed API above.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SceneObject = any;

const PALETTES: Record<WorkspaceSkin, { coat: string; trim: string; glow: string }> = {
  solar: { coat: '#b88b45', trim: '#f2d8a0', glow: '#edbe6b' },
  lunar: { coat: '#77829b', trim: '#e2ddec', glow: '#b8bfea' },
  ocean: { coat: '#277b84', trim: '#a5dfd8', glow: '#72cecc' },
  ember: { coat: '#a74e3b', trim: '#ffc8a2', glow: '#efa575' },
};

interface Character {
  agent: WorkspaceSceneAgent;
  root: SceneObject;
  body: SceneObject;
  head: SceneObject;
  eyes: SceneObject[];
  arms: SceneObject[];
  clothes: SceneObject[];
  trim: SceneObject[];
  ring: SceneObject;
  light: SceneObject;
  screen: SceneObject;
  status: SceneObject;
  accessory: SceneObject;
  label: SceneObject;
  phase: number;
}

export async function createWorkspaceScene(
  canvas: HTMLCanvasElement,
  options: SceneOptions,
): Promise<WorkspaceSceneHandle> {
  // @ts-expect-error The repository's offline Three.js vendor has no .d.ts.
  const THREE = await import('../orbit/vendor/three.module.js');
  if (options.signal?.aborted) throw new DOMException('Scene creation cancelled', 'AbortError');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#101216');
  scene.fog = new THREE.Fog('#101216', 30, 65);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 250);
  const resources = new Set<SceneObject>();
  const sharedResources = new Set<SceneObject>();
  const characters = new Map<string, Character>();
  let displayOrder: string[] = [];
  let layoutSignature = '';
  const garden = new THREE.Group();
  scene.add(garden);
  const gardenSignals: { nodes: SceneObject[]; ids: string[] }[] = [];
  const stations = new THREE.Group();
  scene.add(stations);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const target = new THREE.Vector3(0, 0.9, 0);
  const targetGoal = target.clone();
  let azimuth = 0.35;
  let elevation = 0.66;
  let distance = 22;
  let distanceGoal = distance;
  let overviewDistance = distance;
  let selectedId: string | null = null;
  let hoveredId: string | null = null;
  let motion = true;
  let disposed = false;
  let contextLost = false;
  let raf = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let drag: { id: number; x: number; y: number; startX: number; startY: number; moved: boolean } | null = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const previousTouchAction = canvas.style.touchAction;
  const previousCursor = canvas.style.cursor;
  canvas.style.touchAction = 'none';

  function material(color: string, extra: Record<string, unknown> = {}) {
    const result = new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0.08, ...extra });
    resources.add(result);
    return result;
  }

  function mesh(parent: SceneObject, geometry: SceneObject, paint: SceneObject, x = 0, y = 0, z = 0) {
    resources.add(geometry);
    const result = new THREE.Mesh(geometry, paint);
    result.position.set(x, y, z);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  }

  function box(parent: SceneObject, size: number[], paint: SceneObject, x = 0, y = 0, z = 0) {
    return mesh(parent, new THREE.BoxGeometry(...size), paint, x, y, z);
  }

  function sphere(parent: SceneObject, radius: number, paint: SceneObject, x = 0, y = 0, z = 0, scale?: number[]) {
    const result = mesh(parent, new THREE.SphereGeometry(radius, 24, 16), paint, x, y, z);
    if (scale) result.scale.set(...scale);
    return result;
  }

  function cylinder(parent: SceneObject, top: number, bottom: number, height: number, paint: SceneObject, x = 0, y = 0, z = 0) {
    return mesh(parent, new THREE.CylinderGeometry(top, bottom, height, 48), paint, x, y, z);
  }

  function ring(parent: SceneObject, radius: number, tube: number, paint: SceneObject, y: number) {
    const result = mesh(parent, new THREE.TorusGeometry(radius, tube, 8, 96), paint, 0, y, 0);
    result.rotation.x = Math.PI / 2;
    return result;
  }

  // A living Solar garden: the host is the sun; each real team grows its own
  // island around it. Low planting and an open sky keep the characters visible.
  scene.add(new THREE.HemisphereLight('#e2eadf', '#3c4940', 2.0));
  const sun = new THREE.DirectionalLight('#ffdfac', 3.5);
  sun.position.set(-9, 15, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 60 });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.045;
  sun.shadow.radius = 3;
  scene.add(sun);
  const rimLight = new THREE.DirectionalLight('#b6d2c5', 2.4);
  rimLight.position.set(5, 9, -10);
  scene.add(rimLight);
  const graphite = material('#303936', { roughness: 0.84 });
  const dark = material('#1b2422', { roughness: 0.87 });
  const gold = material('#c8a36a', { metalness: 0.52, roughness: 0.35 });
  const seam = material('#e3bd7d', { emissive: '#c89856', emissiveIntensity: 0.35 });
  const lawn = material('#40584b', { roughness: 0.98 });
  const stone = material('#858c79', { roughness: 0.92 });
  const leafPaint = material('#57785a', { roughness: 1 });
  const flowerPaint = material('#e9cba1', { roughness: 0.7 });
  const world = new THREE.Group();
  scene.add(world);
  const ground = new THREE.Group();
  world.add(ground);
  cylinder(ground, 12, 12.15, 0.42, dark, 0, -0.38);
  cylinder(ground, 12, 12, 0.12, lawn, 0, -0.11);
  ring(ground, 11.96, 0.035, gold, -0.046);
  const central = cylinder(world, 2.05, 2.12, 0.16, graphite, 0, 0.015);
  central.receiveShadow = true;
  ring(world, 2.02, 0.025, seam, 0.105);
  // Water is a small material detail, never a large object hiding an agent.
  const pond = cylinder(world, 0.97, 1.08, 0.17, stone, 2.8, 0.02, 0.35);
  pond.scale.z = 0.76;
  const water = cylinder(world, 0.9, 0.9, 0.024, material('#4e8c87', { roughness: 0.15, metalness: 0.32, emissive: '#1a4441', emissiveIntensity: 0.15 }), 2.8, 0.12, 0.35);
  water.scale.z = 0.76;
  for (let i = 0; i < 3; i++) {
    const ripple = ring(world, 0.22 + i * 0.19, 0.009, material('#9fb7a1', { transparent: true, opacity: 0.4 }), 0.138);
    ripple.position.x = 2.8;
    ripple.position.z = 0.35;
    ripple.scale.z = 0.76;
  }
  // One instanced tuft geometry keeps the large garden inexpensive to draw.
  const grassGeometry = new THREE.ConeGeometry(0.018, 0.19, 3);
  resources.add(grassGeometry);
  const grass = new THREE.InstancedMesh(grassGeometry, leafPaint, 700);
  resources.add(grass);
  const grassDummy = new THREE.Object3D();
  for (let i = 0; i < 700; i++) {
    const angle = i * 2.399963;
    const radius = 3.7 + Math.sqrt(i / 700) * 7.95;
    grassDummy.position.set(Math.cos(angle) * radius, 0.027, Math.sin(angle) * radius);
    grassDummy.rotation.set(Math.sin(i * 0.7) * 0.22, angle, Math.cos(i) * 0.22);
    grassDummy.scale.setScalar(0.7 + (i % 7) * 0.065);
    grassDummy.updateMatrix();
    grass.setMatrixAt(i, grassDummy.matrix);
  }
  grass.instanceMatrix.needsUpdate = true;
  ground.add(grass);

  function shrub(parent: SceneObject, x: number, z: number, scale = 1) {
    const shrubRoot = new THREE.Group();
    shrubRoot.position.set(x, 0.02, z);
    shrubRoot.scale.setScalar(scale);
    for (let i = 0; i < 3; i++) {
      sphere(shrubRoot, 0.33, leafPaint, (i - 1) * 0.21, 0.18 + (i === 1 ? 0.12 : 0), 0, [1, 0.8, 0.95]);
    }
    for (let i = 0; i < 4; i++) sphere(shrubRoot, 0.047, flowerPaint, Math.sin(i * 2.5) * 0.33, 0.32 + (i % 2) * 0.1, Math.cos(i * 2.5) * 0.18);
    parent.add(shrubRoot);
  }

  function tree(parent: SceneObject, x: number, z: number, scale = 1) {
    const treeRoot = new THREE.Group();
    treeRoot.position.set(x, 0, z);
    treeRoot.scale.setScalar(scale);
    const trunk = material('#6b5b43', { roughness: 0.95 });
    cylinder(treeRoot, 0.07, 0.16, 1.65, trunk, 0, 0.8);
    const branch = cylinder(treeRoot, 0.045, 0.06, 0.72, trunk, -0.2, 1.3);
    branch.rotation.z = -0.65;
    sphere(treeRoot, 0.73, leafPaint, -0.25, 1.95, 0, [1.2, 0.85, 1]);
    sphere(treeRoot, 0.65, leafPaint, 0.4, 2.25, 0.1, [1.1, 1.0, 0.8]);
    sphere(treeRoot, 0.56, material('#729365', { roughness: 1 }), 0.04, 2.65, -0.12, [1.15, 0.85, 1]);
    cylinder(treeRoot, 0.72, 0.8, 0.08, graphite, 0, 0.005);
    parent.add(treeRoot);
  }
  tree(ground, -8.7, -6.3, 1.08);
  tree(ground, 8.2, -6.6, 0.92);
  tree(ground, 1.7, -10.6, 0.82);
  shrub(ground, -9.8, 3.5, 1.15);
  shrub(ground, 8.3, 6.4, 0.9);
  shrub(ground, -5.8, 9.1, 0.75);
  // Room resources can be shared safely by team islands and characters.
  for (const resource of resources) sharedResources.add(resource);

  function nameLabel(name: string) {
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 96;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      ctx.font = '600 29px "Jarvis Manrope", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f3e6d0';
      ctx.shadowColor = '#101216';
      ctx.shadowBlur = 8;
      const shortened = Array.from(name).slice(0, 36).join('');
      ctx.fillText(shortened, 256, 48, 490);
    }
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    resources.add(texture);
    const paint = new THREE.SpriteMaterial({ map: texture, depthTest: true, depthWrite: false, transparent: true });
    resources.add(paint);
    const label = new THREE.Sprite(paint);
    label.scale.set(2.6, 0.49, 1);
    label.position.set(0, 0.2, 1.02);
    return label;
  }

  function character(agent: WorkspaceSceneAgent, index: number): Character {
    const root = new THREE.Group();
    root.userData.agentId = agent.id;
    const palette = PALETTES[agent.skin || 'solar'];
    const identity = Array.from(agent.id).reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
    const coat = material(palette.coat, { roughness: 0.88 });
    const trimPaint = material(palette.trim, { roughness: 0.65 });
    const skin = material(['#ecd1ae', '#c9926d', '#b48166', '#eedcc4'][identity % 4], { roughness: 0.62 });
    const hair = material(['#47382d', '#6b4e33', '#3b373b', '#926849'][identity % 4], { roughness: 0.9 });
    const face = material('#282e31', { roughness: 0.5 });
    const glow = material(palette.glow, { emissive: palette.glow, emissiveIntensity: 0.36 });
    cylinder(root, 0.91, 0.95, 0.07, material('#697164', { roughness: 0.94 }), 0, 0.06);
    const selectedRing = ring(root, 0.91, 0.028, glow, 0.105);
    selectedRing.material.transparent = true;
    selectedRing.material.opacity = 0.15;
    const light = new THREE.PointLight(palette.glow, 0, 3.2, 2);
    light.position.set(0, 1.4, 0);
    root.add(light);
    // Tailored clay characters sit on rounded garden puffs. Their open faces,
    // hair, curved brows and smiles remain legible above the laptop silhouette.
    sphere(root, 0.45, material('#82765e', { roughness: 0.97 }), 0, 0.37, -0.13, [1.15, 0.7, 1.05]);
    const puffSeam = ring(root, 0.39, 0.014, trimPaint, 0.47);
    puffSeam.position.z = -0.13;
    const body = new THREE.Group();
    body.position.set(0, 0.14, 0.04);
    root.add(body);
    sphere(body, 0.34, coat, 0, 0.68, -0.035, [1.05, 1.15, 0.84]);
    const clothes: SceneObject[] = [coat];
    const trim: SceneObject[] = [trimPaint, glow];
    const trousers = material('#424c46', { roughness: 0.93 });
    for (const x of [-0.17, 0.17]) {
      sphere(body, 0.13, trousers, x, 0.36, 0.22, [1, 0.75, 1.65]);
      mesh(body, new THREE.CapsuleGeometry(0.095, 0.18, 6, 12), trousers, x, 0.2, 0.4);
      sphere(body, 0.13, material('#d5d2ba', { roughness: 0.7 }), x, 0.08, 0.46, [1, 0.62, 1.5]);
      box(body, [0.17, 0.022, 0.22], trimPaint, x, 0.055, 0.49);
    }
    const head = new THREE.Group();
    head.position.set(0, 1.3, -0.025);
    body.add(head);
    sphere(head, 0.43, skin, 0, 0, 0, [1.03, 1.04, 0.94]);
    for (const side of [-1, 1]) {
      sphere(head, 0.08, skin, side * 0.43, -0.015, 0.02, [0.63, 1, 0.75]);
      sphere(head, 0.045, material('#bf8b72'), side * 0.444, -0.01, 0.065, [0.4, 0.62, 0.45]);
    }
    sphere(head, 0.42, hair, 0, 0.25, -0.05, [1.08, 0.62, 0.96]);
    sphere(head, 0.23, hair, -0.17, 0.28, 0.29, [1.2, 0.47, 0.65]).rotation.z = -0.21;
    sphere(head, 0.19, hair, 0.17, 0.3, 0.26, [1, 0.55, 0.68]);
    const white = material('#f8f1df');
    const eyes: SceneObject[] = [];
    for (const side of [-1, 1]) {
      const eye = new THREE.Group();
      eye.position.set(side * 0.135, 0.025, 0.37);
      sphere(eye, 0.07, white, 0, 0, 0, [0.78, 1.18, 0.4]);
      sphere(eye, 0.039, face, 0.006, -0.002, 0.029, [0.8, 1.17, 0.47]);
      sphere(eye, 0.012, white, -0.007, 0.016, 0.047);
      head.add(eye);
      eyes.push(eye);
      const brow = mesh(head, new THREE.CapsuleGeometry(0.014, 0.084, 4, 8), hair, side * 0.135, 0.147, 0.365);
      brow.rotation.z = Math.PI / 2 + side * 0.1;
      sphere(head, 0.068, material('#d99682', { roughness: 0.9 }), side * 0.24, -0.096, 0.321, [1, 0.43, 0.24]);
    }
    sphere(head, 0.053, skin, 0, -0.04, 0.412, [0.75, 0.78, 0.85]);
    const smile = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.084, -0.135, 0.377), new THREE.Vector3(0, -0.205, 0.407), new THREE.Vector3(0.084, -0.135, 0.377));
    mesh(head, new THREE.TubeGeometry(smile, 16, 0.011, 6, false), material('#755041'));
    const arms: SceneObject[] = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.31, 0.97, 0.015);
      mesh(arm, new THREE.CapsuleGeometry(0.095, 0.18, 6, 12), coat, side * 0.016, -0.15);
      sphere(arm, 0.09, skin, side * 0.015, -0.35, 0.01, [0.85, 1.05, 0.78]);
      arm.rotation.x = -0.92;
      body.add(arm);
      arms.push(arm);
    }
    box(body, [0.028, 0.41, 0.025], trimPaint, 0, 0.68, 0.261);
    for (const side of [-1, 1]) cylinder(body, 0.011, 0.011, 0.16, trimPaint, side * 0.07, 0.89, 0.24);
    sphere(body, 0.045, glow, -0.17, 0.78, 0.231, [1, 1, 0.35]);
    // A real foldable laptop with a thin shell, hinge, key rows and trackpad.
    const laptop = new THREE.Group();
    laptop.position.set(0, 0.8, 0.53);
    box(laptop, [0.8, 0.045, 0.47], material('#b4b8aa', { metalness: 0.55, roughness: 0.38 }));
    const keyboard = material('#4c5552', { roughness: 0.8 });
    for (let row = 0; row < 3; row++) for (let key = 0; key < 8; key++) box(laptop, [0.053, 0.007, 0.038], keyboard, -0.265 + key * 0.076, 0.027, -0.12 + row * 0.055);
    box(laptop, [0.22, 0.008, 0.085], material('#8a9488'), 0, 0.027, 0.12);
    const hinge = cylinder(laptop, 0.023, 0.023, 0.74, gold, 0, 0.02, -0.23);
    hinge.rotation.z = Math.PI / 2;
    const display = new THREE.Group();
    display.position.set(0, 0.02, -0.225);
    display.rotation.x = -0.16;
    box(display, [0.8, 0.48, 0.035], material('#a5afa2', { metalness: 0.5 }), 0, 0.24);
    const screen = box(display, [0.71, 0.39, 0.007], material('#315855', { emissive: '#4b9387', emissiveIntensity: 0.32 }), 0, 0.247, 0.021);
    const codeInk = material('#bdd4b5', { emissive: '#8aac9c', emissiveIntensity: 0.65 });
    for (let row = 0; row < 4; row++) box(display, [0.24 + (row % 2) * 0.17, 0.013, 0.008], codeInk, -0.07 + (row % 2) * 0.05, 0.345 - row * 0.064, 0.029);
    laptop.add(display);
    root.add(laptop);
    const accessory = new THREE.Group();
    head.add(accessory);
    const status = sphere(root, 0.059, material(palette.glow, { emissive: palette.glow, emissiveIntensity: 0.3 }), 0.65, 1.74, 0.05);
    const label = nameLabel(agent.name);
    label.position.set(0, 0.23, 1.01);
    root.add(label);
    const result = { agent: { ...agent }, root, body, head, eyes, arms, clothes, trim, ring: selectedRing, light, screen, status, accessory, label, phase: identity * 0.033 + index * 0.21 };
    decorate(result, agent.skin || 'solar');
    stations.add(root);
    return result;
  }

  function disposeTree(root: SceneObject) {
    const removed = new Set<SceneObject>();
    root.traverse((node: SceneObject) => {
      if (node.geometry) removed.add(node.geometry);
      for (const paint of (Array.isArray(node.material) ? node.material : [node.material])) {
        if (paint) {
          if (paint.map) removed.add(paint.map);
          removed.add(paint);
        }
      }
    });
    for (const item of removed) {
      if (sharedResources.has(item)) continue;
      if (resources.delete(item)) item.dispose();
    }
  }

  function decorate(actor: Character, chosen: WorkspaceSkin) {
    disposeTree(actor.accessory);
    actor.accessory.clear();
    const palette = PALETTES[chosen];
    actor.clothes.forEach(paint => paint.color.set(palette.coat));
    actor.trim[0].color.set(palette.trim);
    actor.trim[1].color.set(palette.glow);
    actor.trim[1].emissive.set(palette.glow);
    actor.light.color.set(palette.glow);
    const accessoryPaint = material(palette.trim, { roughness: 0.75 });
    if (chosen === 'lunar') {
      mesh(actor.accessory, new THREE.TorusGeometry(0.46, 0.035, 8, 32, Math.PI), accessoryPaint, 0, 0.025);
      for (const x of [-0.465, 0.465]) sphere(actor.accessory, 0.11, accessoryPaint, x, -0.012, 0.045, [0.5, 1.1, 0.85]);
      const glasses = material('#4e5570', { roughness: 0.45 });
      for (const x of [-0.137, 0.137]) {
        const rim = mesh(actor.accessory, new THREE.TorusGeometry(0.095, 0.012, 6, 24), glasses, x, 0.025, 0.405);
        rim.scale.y = 0.88;
      }
      box(actor.accessory, [0.088, 0.015, 0.012], glasses, 0, 0.04, 0.423);
    } else if (chosen === 'ocean') {
      sphere(actor.accessory, 0.43, accessoryPaint, 0, 0.22, -0.045, [1.07, 0.58, 1.0]);
      sphere(actor.accessory, 0.28, accessoryPaint, 0, 0.2, 0.36, [1.35, 0.13, 0.8]);
      sphere(actor.accessory, 0.037, material(palette.coat), 0, 0.49, -0.02);
    } else if (chosen === 'ember') {
      const scarf = ring(actor.accessory, 0.235, 0.063, accessoryPaint, -0.39);
      scarf.scale.set(1.2, 1, 1);
      box(actor.accessory, [0.13, 0.34, 0.045], accessoryPaint, 0.14, -0.55, 0.21).rotation.z = -0.18;
      const beanie = sphere(actor.accessory, 0.43, material(palette.coat), 0, 0.26, -0.03, [1.05, 0.66, 1]);
      beanie.rotation.z = 0.1;
      sphere(actor.accessory, 0.1, accessoryPaint, 0.04, 0.57, -0.015);
    } else {
      // A soft hood frames the hair, keeping Solar's signature warm silhouette.
      mesh(actor.accessory, new THREE.TorusGeometry(0.445, 0.048, 10, 40), material(palette.coat), 0, 0.02, -0.12);
    }
    if (actor.agent.host || /^jarvis(?:\s|$)/i.test(actor.agent.name)) {
      const hostPaint = material('#f2c97e', { emissive: '#cd9749', emissiveIntensity: 0.3, metalness: 0.4 });
      mesh(actor.accessory, new THREE.TorusGeometry(0.54, 0.019, 6, 48), hostPaint, 0, 0.04, -0.2);
      for (let i = 0; i < 9; i++) {
        const angle = i / 9 * Math.PI * 2;
        sphere(actor.accessory, 0.028, hostPaint, Math.cos(angle) * 0.575, 0.04 + Math.sin(angle) * 0.575, -0.2);
      }
    } else if (actor.agent.chief) {
      sphere(actor.accessory, 0.035, material('#e8c77e', { metalness: 0.4 }), 0.32, 0.32, 0.24);
    }
    actor.agent.skin = chosen;
  }

  function layout(resetOverview = true) {
    const actors = displayOrder.map(id => characters.get(id)).filter((actor): actor is Character => Boolean(actor));
    const host = actors.find(actor => actor.agent.host) ?? actors.find(actor => /^jarvis(?:\s|$)/i.test(actor.agent.name));
    const grouped = new Map<string, Character[]>();
    for (const actor of actors) {
      if (actor === host) continue;
      const key = actor.agent.teamKey?.trim() || `loose:${actor.agent.id}`;
      grouped.set(key, [...(grouped.get(key) || []), actor]);
    }
    const groups = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, members]) => {
      const ordered = members.sort((a, b) => Number(Boolean(b.agent.chief)) - Number(Boolean(a.agent.chief)) || a.agent.id.localeCompare(b.agent.id));
      let remaining = Math.max(0, members.length - 1);
      let rings = 0;
      while (remaining > 0) { rings++; remaining -= 6 * rings; }
      return { key, members: ordered, radius: Math.max(2.25, 1.6 + rings * 2.25) };
    });
    const maxRadius = Math.max(2.25, ...groups.map(group => group.radius));
    const orbitRadius = Math.max(5.8, maxRadius + 2.6, groups.reduce((sum, group) => sum + group.radius * 2 + 1.2, 0) / (Math.PI * 2));
    const worldRadius = Math.max(10, orbitRadius + maxRadius + 1.4);
    ground.scale.set(worldRadius / 12, 1, worldRadius / 12);
    scene.fog.near = worldRadius * 2.5;
    scene.fog.far = worldRadius * 6;
    camera.far = Math.max(250, worldRadius * 10);
    camera.updateProjectionMatrix();
    sun.shadow.camera.left = sun.shadow.camera.bottom = -worldRadius;
    sun.shadow.camera.right = sun.shadow.camera.top = worldRadius;
    sun.shadow.camera.updateProjectionMatrix();
    if (host) {
      host.root.position.set(0, 0.12, 0);
      host.root.rotation.y = 0.05;
      host.root.scale.setScalar(1.18);
    }
    if (resetOverview) {
      disposeTree(garden);
      garden.clear();
      gardenSignals.length = 0;
    }
    groups.forEach((group, index) => {
      const angle = -Math.PI * 0.72 + index / Math.max(1, groups.length) * Math.PI * 2;
      const cx = Math.cos(angle) * orbitRadius;
      const cz = Math.sin(angle) * orbitRadius;
      group.members.forEach((actor, memberIndex) => {
        let x = 0;
        let z = 0.2;
        if (memberIndex > 0) {
          let ringIndex = 1;
          let slot = memberIndex - 1;
          while (slot >= ringIndex * 6) { slot -= ringIndex * 6; ringIndex++; }
          const total = Math.min(ringIndex * 6, group.members.length - 1 - 3 * ringIndex * (ringIndex - 1));
          const memberAngle = -Math.PI * 0.55 + slot / Math.max(1, total) * Math.PI * 2;
          x = Math.cos(memberAngle) * ringIndex * 2.25;
          z = Math.sin(memberAngle) * ringIndex * 2.25;
        }
        actor.root.position.set(cx + x, 0.08, cz + z);
        actor.root.rotation.y = 0.13 - x * 0.032;
        actor.root.scale.setScalar(actor.agent.chief ? 1.04 : 1);
      });
      if (!resetOverview) return;
      const island = new THREE.Group();
      island.position.set(cx, 0, cz);
      cylinder(island, group.radius, group.radius + 0.08, 0.105, material('#5a705a', { roughness: 0.99 }), 0, 0.017);
      const edge = ring(island, group.radius, 0.045, stone, 0.065);
      edge.scale.z = 1.0;
      for (let j = 0; j < 3; j++) {
        const edgeAngle = -Math.PI * 0.96 + j * 0.75;
        shrub(island, Math.cos(edgeAngle) * (group.radius - 0.1), Math.sin(edgeAngle) * (group.radius - 0.1), 0.68);
      }
      // Low warm bollards mark a team garden without enclosing it in walls.
      for (const side of [-1, 1]) {
        const lx = side * (group.radius - 0.25);
        cylinder(island, 0.045, 0.055, 0.44, gold, lx, 0.28, 0.35);
        sphere(island, 0.075, seam, lx, 0.54, 0.35, [1, 0.75, 1]);
      }
      const teamName = group.members.find(actor => actor.agent.teamName)?.agent.teamName;
      if (teamName) {
        const label = nameLabel(teamName);
        label.scale.set(3.5, 0.65, 1);
        label.position.set(0, 0.25, group.radius + 0.7);
        island.add(label);
      }
      garden.add(island);
      const pathLength = Math.max(0, orbitRadius - group.radius - 2.15);
      const pathSteps = Math.max(3, Math.floor(pathLength / 0.43));
      for (let step = 0; step < pathSteps; step++) {
        const along = 2.15 + (step + 0.5) / pathSteps * pathLength;
        const paver = sphere(garden, 0.21, stone, Math.cos(angle) * along, -0.015, Math.sin(angle) * along, [1.15, 0.18, 0.86]);
        paver.rotation.y = angle + step * 0.17;
      }
      const signalPaint = material(group.members[0].agent.color || '#d6b87e', { emissive: group.members[0].agent.color || '#d6b87e', emissiveIntensity: 0.3, transparent: true, opacity: 0.55 });
      const nodes: SceneObject[] = [];
      for (let point = 0; point < 14; point++) {
        const along = 1.85 + point / 13 * Math.max(0.2, orbitRadius - 1.85);
        nodes.push(sphere(garden, 0.024, signalPaint, Math.cos(angle) * along, 0.22, Math.sin(angle) * along));
      }
      gardenSignals.push({ nodes, ids: group.members.map(actor => actor.agent.id) });
    });
    overviewDistance = Math.max(25, worldRadius * 2.55);
    if (!selectedId && resetOverview) {
      distanceGoal = overviewDistance;
      targetGoal.set(0, 0.7, 0);
    }
  }

  function render() {
    if (disposed || contextLost || document.hidden) return;
    // Fit the diorama across the narrower horizontal field of view on phones.
    const framedDistance = distance * Math.max(1, 1.15 / camera.aspect);
    camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * framedDistance,
      target.y + Math.sin(elevation) * framedDistance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * framedDistance,
    );
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    raf = 0;
    if (disposed || contextLost || document.hidden) return;
    const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05);
    lastFrame = now;
    const animated = motion && !reducedMotion.matches;
    if (animated) elapsed += dt;
    const lerp = reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 7);
    target.lerp(targetGoal, lerp);
    distance += (distanceGoal - distance) * lerp;
    characters.forEach(actor => {
      const t = elapsed + actor.phase;
      const selected = actor.agent.id === selectedId;
      const hovered = actor.agent.id === hoveredId;
      actor.body.position.y = 0.14 + (animated ? Math.sin(t * 1.8) * 0.018 : 0);
      actor.body.rotation.z = animated && !actor.agent.busy ? Math.sin(t * 1.1) * 0.035 : 0;
      actor.head.rotation.y += ((hovered ? pointer.x * 0.22 : Math.sin(t * 0.7) * 0.07) * Number(animated) - actor.head.rotation.y) * 0.12;
      actor.head.rotation.x = !selected && actor.agent.busy ? 0.2 + (animated ? Math.sin(t * 3) * 0.025 : 0) : -0.035;
      const blink = animated && t % 5.2 > 5.05 ? 0.15 : 1;
      actor.eyes.forEach(eye => { eye.scale.y = blink; });
      actor.arms.forEach((arm, i) => {
        arm.rotation.x = selected && i === 1 ? -0.1 : -0.92 + (animated && actor.agent.busy ? Math.sin(t * 9 + i * 1.9) * 0.075 : 0);
        arm.rotation.z = selected && i === 1 ? -2.15 + (animated ? Math.sin(t * 3) * 0.12 : 0) : 0;
      });
      actor.ring.material.opacity = selected ? 1 : hovered ? 0.7 : 0.23;
      actor.light.intensity = selected ? 3.5 : 0;
      actor.screen.material.emissiveIntensity = actor.agent.busy ? 0.85 + (animated ? Math.sin(t * 3) * 0.12 : 0) : 0.38;
      actor.status.material.color.set(actor.agent.waiting ? '#eab66a' : actor.agent.busy ? '#9cd6c3' : PALETTES[actor.agent.skin || 'solar'].glow);
      actor.status.position.y = 1.74 + (animated && actor.agent.waiting ? Math.sin(t * 2.5) * 0.045 : 0);
    });
    gardenSignals.forEach(signal => {
      const active = signal.ids.some(id => characters.get(id)?.agent.busy);
      signal.nodes.forEach((node, index) => {
        node.scale.setScalar(active && animated ? 1 + Math.max(0, Math.sin(elapsed * 3 - index * 0.55)) * 1.8 : 1);
      });
      if (signal.nodes[0]) signal.nodes[0].material.opacity = active ? 0.85 : 0.42;
    });
    render();
    const settling = target.distanceTo(targetGoal) > 0.001 || Math.abs(distanceGoal - distance) > 0.001;
    if (animated || settling) raf = requestAnimationFrame(frame);
  }

  function requestFrame() {
    if (!raf && !disposed && !contextLost && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function hit(event: PointerEvent): string | null {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / Math.max(rect.width, 1) * 2 - 1, -(event.clientY - rect.top) / Math.max(rect.height, 1) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(stations.children, true);
    for (const intersection of intersections) {
      // Name sprites are rendered above the floor; they are valid hit targets.
      let object = intersection.object;
      while (object) {
        if (object.userData.agentId) return object.userData.agentId as string;
        object = object.parent;
      }
    }
    return null;
  }

  function onPointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (drag && drag.id === event.pointerId) {
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6) drag.moved = true;
      if (drag.moved) {
        azimuth = Math.max(-1.05, Math.min(1.05, azimuth - (event.clientX - drag.x) * 0.005));
        elevation = Math.max(0.32, Math.min(1.15, elevation + (event.clientY - drag.y) * 0.004));
        canvas.style.cursor = 'grabbing';
      }
      drag.x = event.clientX;
      drag.y = event.clientY;
    } else {
      hoveredId = hit(event);
      canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    }
    requestFrame();
  }

  function onPointerUp(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    const clicked = !drag.moved;
    drag = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    if (clicked) options.onSelect(hit(event));
  }

  function onPointerCancel() { drag = null; canvas.style.cursor = 'grab'; }
  function onPointerLeave() { hoveredId = null; requestFrame(); }
  function onWheel(event: WheelEvent) {
    event.preventDefault();
    distanceGoal = Math.max(7, Math.min(overviewDistance * 1.7, distanceGoal * Math.exp(event.deltaY * 0.001)));
    requestFrame();
  }
  function onVisibility() {
    lastFrame = 0;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else requestFrame();
  }
  function onMotionChange() { requestFrame(); }
  function onContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    options.onError?.(new Error('WebGL context lost'));
  }
  function onContextRestored() {
    contextLost = false;
    requestFrame();
    options.onReady?.();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotionChange);

  function resize() {
    if (disposed) return;
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestFrame();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  render();
  options.onReady?.();

  return {
    setAgents(agents) {
      if (disposed) return;
      const nextLayoutSignature = JSON.stringify(agents.map(agent => [agent.id, agent.teamKey, agent.teamName, agent.chief, agent.host, agent.color]));
      const changedLayout = nextLayoutSignature !== layoutSignature;
      layoutSignature = nextLayoutSignature;
      displayOrder = agents.map(agent => agent.id);
      const ids = new Set(agents.map(agent => agent.id));
      for (const [id, actor] of characters) {
        if (!ids.has(id)) { stations.remove(actor.root); disposeTree(actor.root); characters.delete(id); }
      }
      agents.forEach((agent, index) => {
        const actor = characters.get(agent.id);
        if (!actor) characters.set(agent.id, character(agent, index));
        else {
          if (agent.name !== actor.agent.name) {
            actor.root.remove(actor.label);
            disposeTree(actor.label);
            actor.label = nameLabel(agent.name);
            actor.root.add(actor.label);
          }
          const needsDecoration = Boolean(agent.skin && agent.skin !== actor.agent.skin) || agent.chief !== actor.agent.chief || agent.host !== actor.agent.host;
          actor.agent = { ...agent, skin: agent.skin || actor.agent.skin };
          if (needsDecoration) decorate(actor, actor.agent.skin || 'solar');
        }
      });
      if (selectedId && !characters.has(selectedId)) selectedId = null;
      layout(changedLayout);
      const focused = selectedId ? characters.get(selectedId) : undefined;
      if (changedLayout && focused) targetGoal.copy(focused.root.position).add(new THREE.Vector3(0, 0.9, 0));
      requestFrame();
    },
    setSkin(id, skin) {
      const actor = characters.get(id);
      if (actor && !disposed) { decorate(actor, skin); requestFrame(); }
    },
    focusAgent(id) {
      selectedId = id && characters.has(id) ? id : null;
      const actor = selectedId ? characters.get(selectedId) : undefined;
      if (actor) {
        targetGoal.copy(actor.root.position).add(new THREE.Vector3(0, 0.9, 0));
        distanceGoal = 10;
      } else layout();
      requestFrame();
    },
    setActivity(id, activity) {
      const actor = characters.get(id);
      if (actor) { Object.assign(actor.agent, activity); requestFrame(); }
    },
    setZoom(delta) {
      if (!Number.isFinite(delta)) return;
      distanceGoal = Math.max(7, Math.min(overviewDistance * 1.7, distanceGoal * Math.pow(0.88, delta)));
      requestFrame();
    },
    resetCamera() {
      selectedId = null;
      azimuth = 0.35;
      elevation = 0.66;
      layout();
      requestFrame();
    },
    setMotion(enabled) { motion = enabled; requestFrame(); },
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onMotionChange);
      if (drag && canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id);
      canvas.style.touchAction = previousTouchAction;
      canvas.style.cursor = previousCursor;
      for (const resource of resources) resource.dispose();
      resources.clear();
      characters.clear();
      scene.clear();
      sun.shadow.dispose();
      renderer.dispose();
    },
  };
}
