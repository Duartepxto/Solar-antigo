import type { SolarSkin, SolarMoonSkin } from './solar-model';
import type { SolarState, SolarSignal } from './solar-state';
export interface SolarRenderBody { id: string; parentId?: string | null; kind: 'sun' | 'planet' | 'moon'; skin?: SolarSkin | SolarMoonSkin; x: number; y: number; diameter: number; color: string; active: boolean; background?:boolean; grabbed?: boolean; state?: SolarState; tool?:string; activity?: 'code'|'research'|'document'|'notion'|'task'; signal?:SolarSignal; callPhase?: 'listening'|'sending'|'working'|'speaking' }
export interface SolarRenderSettings { interactive: boolean; debris: boolean; glow: number }
export interface SolarWorldEngine {
  update(bodies: SolarRenderBody[], width: number, height: number, paused: boolean, settings?: SolarRenderSettings): void;
  pointAt(point: { x: number; y: number } | null): void;
  transfer(message:{from:string;to:string;at:number;result?:boolean}):void;
  setFrameListener(listener: ((surface: HTMLCanvasElement, particles: HTMLCanvasElement) => void) | null): void;
  dispose(): void;
}
export function createSolarWorld(canvas: HTMLCanvasElement): Promise<SolarWorldEngine>;

