// Liquid glass: every glass surface gets an SVG lens sized to its own box.
// The lens only displaces the backdrop near the rim (convex bezel), so the
// map bends at the edges while the centre stays clear. The filter lives on a
// ::before layer behind the content (see solar.css), never on the text.

export const LIQUID_GLASS_SELECTOR = '.solar-glass,.solar-menu,.solar-liquid,.orbit-root[data-jarvis-solar] [data-tour=composer]';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_PIXELS = 1_200_000;
/** Each lens is a filter plus a PNG map; keep only the most recently used ones. */
const MAX_FILTERS = 40;
const filters = new Map<string, string>();
let defs: SVGDefsElement | null = null, created = 0;

/** Chromium (and so Electron) is the only engine that applies url() in backdrop-filter. */
export function supportsLiquidLens(): boolean {
  if (typeof navigator === 'undefined') return false;
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  if (brands?.length) return brands.some(({ brand }) => /Chromium|Chrome|Electron/i.test(brand));
  return /Chrome\/|Electron\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent);
}

/**
 * Displacement map for a rounded rectangle. Red/green hold the x/y offset
 * (128 = none). Inside the bezel the backdrop is sampled further inward,
 * strongest at the rim, like light through a thick convex edge.
 */
export function liquidDisplacement(width: number, height: number, radius: number, bezel: number): ImageData | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const image = context.createImageData(width, height), data = image.data;
  const halfX = width / 2, halfY = height / 2, round = Math.min(radius, halfX, halfY);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4, px = x + .5 - halfX, py = y + .5 - halfY;
      const qx = Math.abs(px) - (halfX - round), qy = Math.abs(py) - (halfY - round);
      const inside = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - round);
      let red = 128, green = 128;
      if (inside >= 0 && inside < bezel) {
        let nx = 0, ny = 0;
        if (qx > 0 && qy > 0) { const length = Math.hypot(qx, qy) || 1; nx = qx / length; ny = qy / length; }
        else if (qx > qy) nx = 1; else ny = 1;
        const t = 1 - inside / bezel, strength = t * t * (3 - 2 * t) * t;
        red = 128 - Math.sign(px) * nx * strength * 127;
        green = 128 - Math.sign(py) * ny * strength * 127;
      }
      data[i] = red; data[i + 1] = green; data[i + 2] = 128; data[i + 3] = 255;
    }
  }
  return image;
}

function lensFilter(width: number, height: number, radius: number, bezel: number, scale: number): string | null {
  const key = `${width}x${height}r${radius}b${bezel}s${scale}`;
  const cached = filters.get(key);
  if (cached) { filters.delete(key); filters.set(key, cached); return cached; }
  if (width * height > MAX_PIXELS) return null;
  const image = liquidDisplacement(width, height, radius, bezel);
  if (!image) return null;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d')?.putImageData(image, 0, 0);
  if (!defs) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.cssText = 'position:fixed;width:0;height:0;pointer-events:none;';
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.append(defs); document.body.append(svg);
  }
  const id = `solar-lens-${created++}`;
  const filter = document.createElementNS(SVG_NS, 'filter');
  for (const [name, value] of Object.entries({ id, x: '0', y: '0', width: `${width}`, height: `${height}`, filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' })) filter.setAttribute(name, value);
  const map = document.createElementNS(SVG_NS, 'feImage');
  for (const [name, value] of Object.entries({ href: canvas.toDataURL(), x: '0', y: '0', width: `${width}`, height: `${height}`, preserveAspectRatio: 'none', result: 'lens' })) map.setAttribute(name, value);
  const displace = document.createElementNS(SVG_NS, 'feDisplacementMap');
  for (const [name, value] of Object.entries({ in: 'SourceGraphic', in2: 'lens', scale: `${scale}`, xChannelSelector: 'R', yChannelSelector: 'G' })) displace.setAttribute(name, value);
  filter.append(map, displace); defs.append(filter);
  filters.set(key, id);
  while (filters.size > MAX_FILTERS) {
    const [oldest, oldId] = filters.entries().next().value as [string, string];
    filters.delete(oldest); defs.querySelector(`#${oldId}`)?.remove();
  }
  return id;
}

function cornerRadius(element: HTMLElement, width: number, height: number): number {
  const value = getComputedStyle(element).borderTopLeftRadius;
  const amount = parseFloat(value) || 0;
  return Math.round(value.endsWith('%') ? Math.min(width, height) * amount / 100 : amount);
}

function applyLens(element: HTMLElement) {
  const width = Math.round(element.offsetWidth), height = Math.round(element.offsetHeight);
  if (!width || !height) return;
  const radius = Math.min(cornerRadius(element, width, height), Math.floor(Math.min(width, height) / 2));
  const bezel = Math.max(6, Math.min(18, Math.round(Math.min(width, height) * .32)));
  const id = lensFilter(width, height, radius, bezel, Math.round(bezel * 1.15));
  if (id) element.style.setProperty('--solar-lens', `url(#${id})`);
  else element.style.removeProperty('--solar-lens');
}

/** Watches the document for glass surfaces; returns a cleanup function. */
export function installLiquidGlass(root: ParentNode = document): () => void {
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return () => {};
  const lens = supportsLiquidLens();
  const seen = new WeakSet<Element>();
  // resizes are batched to one pass per frame, so dragging a window edge stays smooth
  const pending = new Set<HTMLElement>();
  let resizeFrame = 0;
  const flush = () => { resizeFrame = 0; pending.forEach(applyLens); pending.clear(); };
  const resize = lens ? new ResizeObserver(entries => {
    for (const entry of entries) pending.add(entry.target as HTMLElement);
    if (!resizeFrame) resizeFrame = requestAnimationFrame(flush);
  }) : null;
  const adopt = (element: Element) => {
    if (seen.has(element) || !(element instanceof HTMLElement)) return;
    seen.add(element);
    if (resize) { resize.observe(element); applyLens(element); }
  };
  const scan = (node: ParentNode) => {
    if (node instanceof Element && node.matches(LIQUID_GLASS_SELECTOR)) adopt(node);
    node.querySelectorAll?.(LIQUID_GLASS_SELECTOR).forEach(adopt);
  };
  scan(root);
  const mutations = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => { if (node instanceof Element) scan(node); });
      if (record.type === 'attributes' && record.target instanceof Element && record.target.matches(LIQUID_GLASS_SELECTOR)) adopt(record.target);
    }
  });
  mutations.observe(root instanceof Document ? root.body : root as Node, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  // Specular glint follows the pointer across whichever glass it is over.
  let frame = 0, last: PointerEvent | null = null;
  const glint = () => {
    frame = 0; if (!last) return;
    const target = (last.target as Element | null)?.closest?.(LIQUID_GLASS_SELECTOR) as HTMLElement | null;
    if (!target) return;
    const box = target.getBoundingClientRect();
    target.style.setProperty('--gx', `${Math.round(last.clientX - box.left)}px`);
    target.style.setProperty('--gy', `${Math.round(last.clientY - box.top)}px`);
  };
  const move = (event: PointerEvent) => { if (event.pointerType === 'touch') return; last = event; if (!frame) frame = requestAnimationFrame(glint); };
  document.addEventListener('pointermove', move, { passive: true });
  document.documentElement.toggleAttribute('data-solar-lens', lens);
  return () => {
    mutations.disconnect(); resize?.disconnect();
    document.removeEventListener('pointermove', move);
    if (frame) cancelAnimationFrame(frame);
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
  };
}
