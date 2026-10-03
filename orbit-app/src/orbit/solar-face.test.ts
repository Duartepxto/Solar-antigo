import { expect, it } from 'vitest';
import { solarFaceEyeOpen } from './solar-face';

it('preserves the normal face during activity and closes eyes only for sleep', () => {
  for (const state of ['ready','working','thinking','waiting','blocked','offline']) {
    expect(solarFaceEyeOpen(state,1)).toBe(1);
    expect(solarFaceEyeOpen(state,.3)).toBe(.3);
  }
  expect(solarFaceEyeOpen('sleeping',1)).toBe(.065);
  expect(solarFaceEyeOpen('sleeping',.3)).toBe(.065);
});
