import { describe, expect, it } from 'vitest';
import { MOON_SKINS, PLANET_SKINS, SURFACE_PRESETS, surfaceColor, type SurfaceSkin } from './solar-presets.js';

const skins: SurfaceSkin[] = ['sun', ...PLANET_SKINS, ...MOON_SKINS];
const normals = [
  { x: 0, y: 0, z: 1 },
  { x: .6, y: 0, z: .8 },
  { x: -.4, y: .8, z: Math.sqrt(.2) },
  { x: 0, y: -.6, z: .8 },
];
const channels = (skin: SurfaceSkin, normal = normals[0], index = 0) => {
  const color = surfaceColor(skin, normal, index);
  return [color.r, color.g, color.b];
};
const map = (r: number, g: number, b: number) => {
  const pixels = new Uint8ClampedArray(256 * 128 * 4);
  for (let i = 0; i < pixels.length; i += 4) pixels.set([r, g, b, 255], i);
  return pixels;
};

describe('solar surface presets', () => {
  it('covers all eight real planets and five readable moon personalities', () => {
    expect(PLANET_SKINS).toHaveLength(8);
    expect(MOON_SKINS).toHaveLength(5);
    expect(Object.keys(SURFACE_PRESETS).sort()).toEqual([...skins].sort());
    for (const skin of skins) {
      const preset = SURFACE_PRESETS[skin];
      expect(preset.palette.every(color => /^#[0-9a-f]{6}$/i.test(color))).toBe(true);
      expect(preset.shade).toBeGreaterThanOrEqual(.8);
      expect(preset.shade).toBeLessThan(1);
      expect(preset.depth).toBeGreaterThan(.06);
      expect(preset.depth).toBeLessThan(.11);
      expect(preset.eyes.every(size => size > .05 && size < .12)).toBe(true);
      expect(preset.mouthSpan).toBeGreaterThan(preset.mouth * 6);
      expect(preset.dustCount).toBeGreaterThan(20);
    }
    for (const skin of ['jupiter', 'saturn'] as const) {
      const lens = SURFACE_PRESETS[skin].light;
      expect(parseInt(lens.slice(5, 7), 16)).toBeGreaterThan(parseInt(lens.slice(1, 3), 16));
      expect(SURFACE_PRESETS[skin].shade).toBeGreaterThan(.9);
    }
  });

  it('returns deterministic THREE colors while keeping facet brightness restrained', () => {
    for (const skin of skins) for (const normal of normals) {
      const reference = surfaceColor(skin, normal, 0);
      expect(reference.isColor).toBe(true);
      expect(channels(skin, normal)).toEqual(channels(skin, normal));
      for (let index = 1; index < 32; index++) {
        const color = surfaceColor(skin, normal, index);
        for (const channel of ['r', 'g', 'b'] as const) {
          expect(Number.isFinite(color[channel])).toBe(true);
          expect(color[channel]).toBeGreaterThan(0);
          expect(color[channel] / reference[channel]).toBeGreaterThan(.93);
          expect(color[channel] / reference[channel]).toBeLessThan(1.08);
        }
      }
    }
  });

  it('keeps ice giants and all moon materials visually distinct', () => {
    const signatures = skins.map(skin => normals.map(normal => surfaceColor(skin, normal, 0).getHexString()).join(':'));
    expect(new Set(signatures).size).toBe(skins.length);
    const [neptuneR, , neptuneB] = channels('neptune');
    expect(neptuneB).toBeGreaterThan(neptuneR * 3);
    const brightness = (skin: SurfaceSkin) => channels(skin).reduce((sum, value) => sum + value, 0);
    expect(brightness('uranus')).toBeGreaterThan(brightness('neptune') * 2);
    expect(brightness('moon-ice')).toBeGreaterThan(brightness('moon-volcanic') * 3);
  });

  it('places a warm coherent Great Red Spot within Jupiter’s southern band', () => {
    const normalAt = (longitude: number) => ({ x: Math.cos(longitude) * Math.cos(-.37), y: Math.sin(-.37), z: Math.sin(longitude) * Math.cos(-.37) });
    const [spotR, spotG] = channels('jupiter', normalAt(1.35));
    const [beltR, beltG] = channels('jupiter', normalAt(2.35));
    expect(spotR / spotG).toBeGreaterThan(beltR / beltG * 1.3);
    expect(spotG).toBeLessThan(beltG);
  });

  it('reuses existing Earth and lunar samples, including capitalized map aliases', () => {
    const ocean = map(20, 60, 130), land = map(60, 110, 65);
    const oceanColor = surfaceColor('earth', normals[0], 0, new Map([['earth_daymap', ocean]]));
    const landColor = surfaceColor('earth', normals[0], 0, new Map([['earth_daymap', land]]));
    expect(oceanColor.b).toBeGreaterThan(oceanColor.g);
    expect(landColor.g).toBeGreaterThan(landColor.b);
    expect(surfaceColor('earth', normals[0], 0, new Map([['Earth_daymap', ocean]])).getHex()).toBe(oceanColor.getHex());
    const darkMoon = surfaceColor('moon-silver', normals[0], 0, new Map([['moon', map(45, 45, 45)]]));
    const brightMoon = surfaceColor('moon-silver', normals[0], 0, new Map([['Moon', map(180, 180, 180)]]));
    expect(brightMoon.r).toBeGreaterThan(darkMoon.r);
    expect(surfaceColor('moon', normals[0], 0).getHex()).toBe(surfaceColor('moon-silver', normals[0], 0).getHex());
  });
});
