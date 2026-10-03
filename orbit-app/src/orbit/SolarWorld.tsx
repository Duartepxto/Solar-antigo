import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SolarRenderBody, SolarRenderSettings, SolarWorldEngine } from './solar-renderer';

export function SolarWorld({ bodies, width, height, paused, settings, onFailure }: {
  bodies: SolarRenderBody[]; width: number; height: number; paused: boolean; settings?: SolarRenderSettings; onFailure: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null), engine = useRef<SolarWorldEngine | null>(null);
  const latest = useRef({ bodies, width, height, paused, settings, onFailure });
  latest.current = { bodies, width, height, paused, settings, onFailure };
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const element = canvas.current!;
    const surface = element.closest<HTMLElement>('.solar-focus') ?? element.closest<HTMLElement>('.orbit-stage') ?? element.parentElement!;
    const failed = () => latest.current.onFailure();
    const point = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const rect = element.getBoundingClientRect();
      engine.current?.pointAt({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const leave = () => engine.current?.pointAt(null);
    const transfer=(event:Event)=>engine.current?.transfer((event as CustomEvent<{from:string;to:string;at:number;result?:boolean}>).detail);
    window.addEventListener('jarvis-solar-transfer',transfer);
    element.addEventListener('solar-render-failed', failed);
    surface.addEventListener('pointermove', point, { passive: true, capture: true });
    surface.addEventListener('pointerleave', leave);
    void import('./solar-renderer.js').then(module => cancelled ? null : module.createSolarWorld(element)).then(world => {
      if (!world) return;
      if (cancelled) { world.dispose(); return; }
      engine.current = world;
      const state = latest.current; world.update(state.bodies, state.width, state.height, state.paused, state.settings);
      setReady(true);
    }).catch(() => { if (!cancelled) latest.current.onFailure(); });
    return () => { cancelled = true; window.removeEventListener('jarvis-solar-transfer',transfer); element.removeEventListener('solar-render-failed', failed); surface.removeEventListener('pointermove', point, true); surface.removeEventListener('pointerleave', leave); engine.current?.dispose(); engine.current = null; };
  }, []);
  useLayoutEffect(() => { engine.current?.update(bodies, width, height, paused, settings); }, [bodies, width, height, paused, settings]);
  return <canvas ref={canvas} className="solar-world-canvas" data-solar-renderer={ready ? 'webgl-3d' : 'loading'} aria-hidden="true" />;
}
