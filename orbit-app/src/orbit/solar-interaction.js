// Shared by the GPU field and the recessed eye lenses. The dent is inward only.
export const POINTER_INDENT = .17;
export const POINTER_FALLOFF = 5.5;
export function pointerDent(x, y, z, cursorX, cursorY, strength) {
  if (![x,y,z,cursorX,cursorY,strength].every(Number.isFinite)) return 0;
  const weight=Math.max(0,Math.min(1,strength));
  const front=Math.max(0,Math.min(1,(z-.15)/.65));
  const dx=x-cursorX, dy=y-cursorY;
  return POINTER_INDENT*weight*Math.exp(-(dx*dx+dy*dy)*POINTER_FALLOFF)*front*front*(3-2*front);
}
