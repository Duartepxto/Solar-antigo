import { describe, expect, it } from 'vitest';
import { POINTER_INDENT, pointerDent } from './solar-interaction.js';

describe('solar pointer deformation', () => {
  it('keeps the front-centre dent inside the planetary envelope', () => {
    const dent=pointerDent(0,0,1,0,0,1);
    expect(dent).toBeCloseTo(POINTER_INDENT);
    expect(1-dent).toBeGreaterThanOrEqual(.83);
  });
  it('never scatters fragments outwards or exceeds the depth limit across the shell', () => {
    for(let xi=-10;xi<=10;xi++) for(let yi=-10;yi<=10;yi++) {
      const x=xi/10,y=yi/10; if(x*x+y*y>1)continue;
      const z=Math.sqrt(1-x*x-y*y);
      for(const strength of [0,.4,1,5]) {
        const dent=pointerDent(x,y,z,.3,-.2,strength);
        expect(dent).toBeGreaterThanOrEqual(0);
        expect(dent).toBeLessThanOrEqual(POINTER_INDENT);
        expect(1-dent).toBeGreaterThanOrEqual(1-POINTER_INDENT);
      }
    }
  });
  it('keeps the reaction local and leaves the back hemisphere undisturbed', () => {
    expect(pointerDent(0,0,1,0,0,1)).toBeGreaterThan(pointerDent(.5,0,.866,0,0,1));
    expect(pointerDent(.5,0,.866,0,0,1)).toBeGreaterThan(pointerDent(.8,0,.6,0,0,1));
    expect(pointerDent(0,0,1,3,3,1)).toBeLessThan(.000001);
    expect(pointerDent(0,0,-1,0,0,1)).toBe(0);
  });
  it('restores the shell when inactive and ignores invalid pointer data', () => {
    expect(pointerDent(0,0,1,0,0,0)).toBe(0);
    expect(pointerDent(0,0,1,NaN,0,1)).toBe(0);
  });
});
