import { expect, it } from 'vitest';
import { solarFaceEyeOpen, solarFacePose } from './solar-face';

it('preserves the normal face during activity and closes eyes only for sleep', () => {
  for (const state of ['ready','working','thinking','waiting','blocked','offline']) {
    expect(solarFaceEyeOpen(state,1)).toBe(1);
    expect(solarFaceEyeOpen(state,.3)).toBe(.3);
  }
  expect(solarFaceEyeOpen('sleeping',1)).toBe(.065);
  expect(solarFaceEyeOpen('sleeping',.3)).toBe(.065);
});

it('keeps task expressions small and pauses speech motion for reduced motion',()=>{
  expect(solarFacePose('ready',2,true)).toMatchObject({focus:0,request:0,concern:0,smile:1,speech:0});
  expect(solarFacePose('working',2,true).focus).toBeLessThan(.2);
  expect(solarFacePose('thinking',2,true).focus).toBeGreaterThan(0);
  expect(solarFacePose('waiting',2,true).request).toBeGreaterThan(0);
  expect(solarFacePose('sleeping',2,true).smile).toBe(.45);
  expect(solarFacePose('speaking',1,true).speech).not.toBe(solarFacePose('speaking',2,true).speech);
  expect(solarFacePose('speaking',1,false)).toEqual(solarFacePose('speaking',2,false));
});
