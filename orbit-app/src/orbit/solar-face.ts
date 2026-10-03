/** Keep the readable resting silhouette. Task expressions use small changes,
 * not squints which erase the eyes on pale skins. */
export function solarFaceEyeOpen(state: string, blink: number): number {
  return state === 'sleeping' ? .065 : Math.max(.065, Math.min(1, blink));
}

export function solarFacePose(state: string, time: number, moving: boolean) {
  const wave = moving ? Math.sin(time * 2.4) : 0;
  return {
    focus: state === 'working' ? .16 : state === 'thinking' ? .08 : 0,
    request: state === 'waiting' ? .22 : 0,
    concern: state === 'blocked' ? .18 : 0,
    smile: state === 'sleeping' ? .45 : state === 'blocked' ? .55 : 1,
    speech: state === 'speaking' ? .25 + .22 * wave : 0,
  };
}
