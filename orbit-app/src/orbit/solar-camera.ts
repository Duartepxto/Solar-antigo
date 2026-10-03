export interface SolarCamera { x: number; y: number; scale: number }

/** Screen offsets use the viewport centre. Zoom preserves the world point at the anchor. */
export function zoomSolarCamera(camera: SolarCamera, factor: number, anchor = { x: 0, y: 0 }): SolarCamera {
  const scale = Math.max(.12, Math.min(3.2, camera.scale * factor));
  const ratio = scale / camera.scale;
  return { scale, x: anchor.x - (anchor.x - camera.x) * ratio, y: anchor.y - (anchor.y - camera.y) * ratio };
}

export function solarBodyDiameter(kind: string, scale: number, skin?:string) {
  return (kind === 'sun' ? 178 : kind === 'planet' ? 144 : skin==='moon-ice'?108:116) * scale;
}

/** A RAF timestamp can precede the call to performance.now() in the first frame. */
export function transitionSolarCamera(source:SolarCamera,target:SolarCamera,elapsed:number):SolarCamera {
  const u=Math.max(0,Math.min(1,elapsed/560)),ease=1-Math.pow(1-u,4);
  return {x:source.x+(target.x-source.x)*ease,y:source.y+(target.y-source.y)*ease,scale:source.scale+(target.scale-source.scale)*ease};
}
