/** All activity states share the calm face. Sleeping closes the eyes only;
 * blinking and pointer gaze remain independent of task expressions. */
export function solarFaceEyeOpen(state: string, blink: number): number {
  return state === 'sleeping' ? .065 : Math.max(.065, Math.min(1, blink));
}
