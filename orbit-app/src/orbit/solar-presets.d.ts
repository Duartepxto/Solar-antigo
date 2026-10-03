export const PLANET_SKINS: readonly ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
export const MOON_SKINS: readonly ['moon-silver', 'moon-ice', 'moon-volcanic', 'moon-sand', 'moon-crater'];
export type PlanetSkin = typeof PLANET_SKINS[number];
export type MoonSkin = typeof MOON_SKINS[number];
export type SurfaceSkin = 'sun' | PlanetSkin | MoonSkin;

export interface VectorLike { x: number; y: number; z: number }
export interface SurfacePreset {
  readonly palette: readonly string[];
  readonly eyes: readonly [number, number];
  readonly light: string;
  readonly slope: number;
  readonly shade: number;
  readonly depth: number;
  readonly mouth: number;
  readonly smile: number;
  readonly mouthY: number;
  readonly mouthSpan: number;
  readonly glow: number;
  readonly luminous: number;
  readonly dustCount: number;
  readonly dustOpacity: number;
}
/** Structural declaration of the bundled THREE.Color returned by surfaceColor. */
export interface SurfaceColor {
  readonly isColor: true;
  r: number;
  g: number;
  b: number;
  clone(): SurfaceColor;
  lerp(color: SurfaceColor, alpha: number): SurfaceColor;
  multiplyScalar(scalar: number): SurfaceColor;
  getHex(): number;
  getHexString(): string;
}
export const SURFACE_PRESETS: Readonly<Record<SurfaceSkin, SurfacePreset>>;
export function surfaceColor(skin: SurfaceSkin | 'moon', normal: VectorLike, index: number, maps?: Map<string, Uint8ClampedArray>): SurfaceColor;
