import * as THREE from './vendor/three.module.js';

export const PLANET_SKINS = Object.freeze(['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
export const MOON_SKINS = Object.freeze(['moon-silver', 'moon-ice', 'moon-volcanic', 'moon-sand', 'moon-crater']);

// Lens colours stay pale and cool enough to read inside the warm gas giants.
// All face measurements use the renderer's unit sphere coordinates.
export const SURFACE_PRESETS = Object.freeze({
  sun: { palette: ['#9f3214', '#cc4d11', '#ed7d1e', '#ffb139', '#ffcf6a'], eyes: [.058, .103], light: '#fff0c5', slope: 0, shade: .90, depth: .087, mouth: .015, smile: .059, mouthY: -.24, mouthSpan: .17, glow: .68, luminous: .36, dustCount: 76, dustOpacity: .83 },
  mercury: { palette: ['#47505c', '#6f7b89', '#98a3ae', '#bec6cb', '#d7dcdd'], eyes: [.066, .081], light: '#dcefff', slope: -.025, shade: .91, depth: .081, mouth: .015, smile: .031, mouthY: -.23, mouthSpan: .15, glow: .15, luminous: .025, dustCount: 34, dustOpacity: .65 },
  venus: { palette: ['#967044', '#bf9a60', '#d8b781', '#e9d0a7', '#f2e0c2'], eyes: [.071, .091], light: '#edf5fb', slope: -.055, shade: .94, depth: .085, mouth: .015, smile: .051, mouthY: -.23, mouthSpan: .16, glow: .22, luminous: .044, dustCount: 38, dustOpacity: .69 },
  earth: { palette: ['#123e70', '#256da1', '#4b9db0', '#69a987', '#b5d6c7'], eyes: [.058, .091], light: '#c4f1f6', slope: -.035, shade: .89, depth: .080, mouth: .014, smile: .038, mouthY: -.23, mouthSpan: .15, glow: .21, luminous: .024, dustCount: 38, dustOpacity: .69 },
  mars: { palette: ['#70382b', '#a6593b', '#cf8658', '#e5ae80', '#efd0a5'], eyes: [.059, .087], light: '#ffeacf', slope: .13, shade: .91, depth: .086, mouth: .014, smile: .037, mouthY: -.23, mouthSpan: .14, glow: .18, luminous: .036, dustCount: 36, dustOpacity: .68 },
  jupiter: { palette: ['#82462e', '#aa6644', '#ca9770', '#ecd9b8', '#f5e7cf'], eyes: [.076, .075], light: '#d8f1ff', slope: -.085, shade: .95, depth: .092, mouth: .016, smile: .033, mouthY: -.23, mouthSpan: .18, glow: .22, luminous: .035, dustCount: 44, dustOpacity: .71 },
  saturn: { palette: ['#806a4e', '#ac916b', '#d0b992', '#ead8b7', '#f2e5cd'], eyes: [.081, .067], light: '#cceeff', slope: -.08, shade: .95, depth: .090, mouth: .016, smile: .035, mouthY: -.22, mouthSpan: .18, glow: .23, luminous: .037, dustCount: 44, dustOpacity: .71 },
  uranus: { palette: ['#4c8e99', '#73b5ba', '#a4d7d3', '#c3e7e0', '#ddf2e9'], eyes: [.067, .094], light: '#effcff', slope: .02, shade: .94, depth: .084, mouth: .015, smile: .044, mouthY: -.23, mouthSpan: .16, glow: .24, luminous: .045, dustCount: 40, dustOpacity: .71 },
  neptune: { palette: ['#09277e', '#114ea8', '#177cc6', '#32a9dd', '#78c9e3'], eyes: [.060, .098], light: '#c9f0ff', slope: .055, shade: .88, depth: .082, mouth: .015, smile: .039, mouthY: -.23, mouthSpan: .15, glow: .26, luminous: .055, dustCount: 42, dustOpacity: .73 },
  'moon-silver': { palette: ['#485363', '#6d7b8c', '#99a6b5', '#bac6d1', '#dce3e8'], eyes: [.070, .094], light: '#e5f4ff', slope: 0, shade: .91, depth: .085, mouth: .020, smile: .049, mouthY: -.21, mouthSpan: .16, glow: .16, luminous: .031, dustCount: 24, dustOpacity: .67 },
  'moon-ice': { palette: ['#305d83', '#5d95b2', '#89bbcf', '#b7d9e4', '#dbeef0'], eyes: [.065, .105], light: '#f1fcff', slope: -.035, shade: .93, depth: .088, mouth: .018, smile: .055, mouthY: -.22, mouthSpan: .15, glow: .23, luminous: .058, dustCount: 28, dustOpacity: .72 },
  'moon-volcanic': { palette: ['#281e25', '#4e2f30', '#7f4737', '#bd6f42', '#ecab66'], eyes: [.073, .077], light: '#ffd7a7', slope: .09, shade: .84, depth: .090, mouth: .019, smile: .033, mouthY: -.22, mouthSpan: .16, glow: .22, luminous: .070, dustCount: 30, dustOpacity: .76 },
  'moon-sand': { palette: ['#735a3c', '#a38a5c', '#c2ad7f', '#dfceaa', '#eee1c0'], eyes: [.074, .087], light: '#e4f2ff', slope: -.065, shade: .94, depth: .088, mouth: .019, smile: .045, mouthY: -.22, mouthSpan: .17, glow: .18, luminous: .040, dustCount: 25, dustOpacity: .69 },
  'moon-crater': { palette: ['#606878', '#929bac', '#b9c2ce', '#d9dce1', '#ebe7dc'], eyes: [.079, .096], light: '#ddf4ff', slope: .035, shade: .95, depth: .091, mouth: .020, smile: .056, mouthY: -.21, mouthSpan: .17, glow: .19, luminous: .040, dustCount: 27, dustOpacity: .70 },
});
for (const preset of Object.values(SURFACE_PRESETS)) {
  Object.freeze(preset.palette);
  Object.freeze(preset.eyes);
  Object.freeze(preset);
}

const paletteColors = new Map(Object.entries(SURFACE_PRESETS).map(([skin, preset]) => [skin, preset.palette.map(value => new THREE.Color(value))]));
const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = (low, high, value) => { const t = clamp((value - low) / (high - low)); return t * t * (3 - 2 * t); };
const hash = value => { const n = Math.sin(value * 12.9898 + 78.233) * 43758.5453; return n - Math.floor(n); };
const flow = (p, scale = 6) => Math.sin(p.x * scale + Math.sin(p.z * scale * .83)) * Math.cos(p.y * scale * .72 - p.z * scale * .43);
const angleDistance = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const emptyMaps = new Map();
const craters = Array.from({ length: 23 }, (_, i) => {
  const y = 1 - 2 * (i + .5) / 23, radius = Math.sqrt(1 - y * y), angle = i * 2.399963 + .41;
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius, radius: .07 + hash(i + 81) * .13 };
});

function paletteColor(skin, value) {
  const palette = paletteColors.get(skin);
  const level = clamp(value, 0, palette.length - 1), band = Math.floor(level);
  return palette[band].clone().lerp(palette[Math.min(band + 1, palette.length - 1)], level - band);
}

function craterField(p, scale = 1) {
  let result = 0;
  for (const crater of craters) {
    const distance = Math.sqrt(Math.max(0, 2 - 2 * (p.x * crater.x + p.y * crater.y + p.z * crater.z)));
    const radius = crater.radius * scale;
    if (distance > radius * 1.35) continue;
    const basin = -.64 * (1 - smooth(radius * .28, radius * .97, distance));
    const lip = .18 * Math.exp(-Math.pow((distance - radius) / (radius * .17), 2));
    result += basin + lip;
  }
  return clamp(result, -.8, .25);
}

function mapSample(maps, name, p) {
  const aliases = { earth_daymap: 'Earth_daymap', saturn: 'Saturn', mars: 'Mars', moon: 'Moon' };
  const data = maps.get(name) ?? maps.get(aliases[name]);
  if (!data || data.length < 256 * 128 * 4) return null;
  const u = (Math.atan2(p.z, -p.x) / (Math.PI * 2) + 1.5) % 1;
  const v = Math.acos(clamp(p.y, -1, 1)) / Math.PI;
  const pixel = (Math.min(127, Math.floor(v * 128)) * 256 + Math.min(255, Math.floor(u * 256))) * 4;
  const r = data[pixel] / 255, g = data[pixel + 1] / 255, b = data[pixel + 2] / 255;
  return { r, g, b, value: r * .2126 + g * .7152 + b * .0722 };
}

// Colour fields follow the volume. Index contributes only a small brightness
// change, so adjacent independent fragments still describe one material.
export function surfaceColor(skin, normal, index, maps = emptyMaps) {
  skin = skin === 'moon' ? 'moon-silver' : skin;
  if (!SURFACE_PRESETS[skin]) skin = 'moon-silver';
  const length = Math.hypot(normal.x, normal.y, normal.z) || 1;
  const p = { x: normal.x / length, y: normal.y / length, z: normal.z / length };
  const latitude = Math.asin(clamp(p.y, -1, 1)), longitude = Math.atan2(p.z, p.x);
  let color;

  if (skin === 'sun') {
    color = paletteColor(skin, 2.65 + flow(p, 7.1) * .87 + Math.sin(p.y * 17 + p.z * 4) * .12);
  } else if (skin === 'mercury') {
    color = paletteColor(skin, 2.8 + flow(p, 8.5) * .32 + craterField(p, .90) * 1.7);
  } else if (skin === 'venus') {
    const marble = Math.sin(p.y * 9 + Math.sin(p.x * 5 + p.z * 3) * 1.8);
    color = paletteColor(skin, 3.05 + marble * .55 + flow(p, 4.4) * .23);
  } else if (skin === 'earth') {
    const sample = mapSample(maps, 'earth_daymap', p);
    const land = sample ? sample.b < sample.g * .94 || sample.r > sample.b * 1.16 : flow(p, 4.1) > .22;
    if (sample && sample.r + sample.g + sample.b > 2.35) {
      color = new THREE.Color('#d3e3e5');
    } else if (land) {
      color = new THREE.Color(sample && sample.g > sample.r * .88 ? '#5b9c77' : '#b2a77d');
      color.multiplyScalar(sample ? .84 + sample.value * .48 : 1);
    } else {
      color = new THREE.Color('#1e609e').lerp(new THREE.Color('#3c94b8'), sample ? clamp((sample.b - sample.r) * 1.4, 0, .58) : .15 + flow(p, 5) * .12);
    }
  } else if (skin === 'mars') {
    const sample = mapSample(maps, 'mars', p);
    color = paletteColor(skin, sample ? 1.35 + sample.value * 3.1 : 2.5 + flow(p, 5.8) * .63 + craterField(p) * .7);
    if (Math.abs(p.y) > .94) color.lerp(new THREE.Color('#e7d7c4'), smooth(.94, 1, Math.abs(p.y)) * .70);
  } else if (skin === 'jupiter') {
    const jet = latitude + Math.sin(longitude * 3 + latitude * 10) * .025 + Math.sin(longitude * 7 - latitude * 6) * .012;
    const northBelt = Math.exp(-Math.pow((jet - .21) / .10, 2));
    const southBelt = Math.exp(-Math.pow((jet + .31) / .12, 2));
    color = paletteColor(skin, 3.35 - northBelt * 1.35 - southBelt * 1.25 + Math.sin(jet * 21) * .24 - Math.abs(p.y) * .28);
    // A coherent ellipse, with a curling inner storm, sits in the southern belt.
    const dx = angleDistance(longitude, 1.35) / .30, dy = (latitude + .37) / .14;
    const storm = Math.hypot(dx, dy);
    const spot = 1 - smooth(.75, 1.15, storm);
    if (spot > 0) color.lerp(paletteColor(skin, 1.05 + Math.sin(storm * 12 + Math.atan2(dy, dx) * 2) * .22), spot * .94);
  } else if (skin === 'saturn') {
    const sample = mapSample(maps, 'saturn', p);
    const jet = latitude + Math.sin(longitude * 2.5 + latitude * 8) * .009;
    color = paletteColor(skin, 3.15 + Math.sin(jet * 17) * .43 + Math.sin(jet * 36) * .16 + (sample ? (sample.value - .5) * .38 : 0));
  } else if (skin === 'uranus') {
    color = paletteColor(skin, 2.75 + Math.sin(latitude * 16) * .16 + flow(p, 3.3) * .12);
  } else if (skin === 'neptune') {
    const wind = latitude + Math.sin(longitude * 3 - latitude * 4) * .055;
    color = paletteColor(skin, 2.15 + Math.sin(wind * 14) * .65 + Math.sin(latitude * 34 + longitude * 5) * .18);
  } else {
    const sample = mapSample(maps, 'moon', p), texture = sample ? sample.value - .5 : flow(p, 7) * .21;
    const crater = craterField(p, skin === 'moon-crater' ? 1.25 : 1);
    if (skin === 'moon-ice') {
      color = paletteColor(skin, 3.0 + flow(p, 4.8) * .46 + texture * .7 + crater * .55);
    } else if (skin === 'moon-volcanic') {
      color = paletteColor(skin, 1.1 + flow(p, 6.2) * .30 + texture * .65 + crater * .55);
      const seam = Math.abs(Math.sin(p.x * 9 + p.z * 5 + Math.sin(p.y * 8) * 1.2));
      color.lerp(paletteColor(skin, 3.1), (1 - smooth(.045, .17, seam)) * .48);
    } else if (skin === 'moon-sand') {
      color = paletteColor(skin, 2.75 + flow(p, 5.2) * .38 + texture * .9 + crater * .82);
    } else if (skin === 'moon-crater') {
      color = paletteColor(skin, 3.35 + flow(p, 6.1) * .14 + texture * .85 + crater * 2.7);
    } else {
      color = paletteColor(skin, 2.5 + texture * 2.55 + crater * .9);
    }
  }

  return color.multiplyScalar(.965 + hash(index + 17) * .07);
}
