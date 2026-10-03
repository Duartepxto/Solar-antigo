import { describe, expect, it } from 'vitest';
import { solarBodyDiameter, zoomSolarCamera } from './solar-camera';

describe('solar camera continuity', () => {
  it.each([.01, .8, 1.2, 100])('keeps the world point under an off-centre pointer fixed, including limits (%s)', factor => {
    const camera = { x: 90, y: -45, scale: .6 }, anchor = { x: -170, y: 120 };
    const next = zoomSolarCamera(camera, factor, anchor);
    const world = { x: (anchor.x-camera.x)/camera.scale, y: (anchor.y-camera.y)/camera.scale };
    expect(world.x*next.scale+next.x).toBeCloseTo(anchor.x);
    expect(world.y*next.scale+next.y).toBeCloseTo(anchor.y);
    expect(next.scale).toBeGreaterThanOrEqual(.12);
    expect(next.scale).toBeLessThanOrEqual(3.2);
  });
  it('keeps scale reversible without changing the layout', () => {
    const initial = { x: 60, y: -20, scale: .7 };
    const next = zoomSolarCamera(zoomSolarCamera(initial, 1.2), 1/1.2);
    expect(next.x).toBeCloseTo(initial.x); expect(next.y).toBeCloseTo(initial.y); expect(next.scale).toBeCloseTo(initial.scale);
    for (const kind of ['sun','planet','moon']) expect(solarBodyDiameter(kind, 1.4)).toBeCloseTo(solarBodyDiameter(kind, .7)*2);
  });
  it('retains a small hierarchy without making the ice moon as large as a planet',()=>{
    const planet=solarBodyDiameter('planet',1),sun=solarBodyDiameter('sun',1),moon=solarBodyDiameter('moon',1),ice=solarBodyDiameter('moon',1,'moon-ice');
    expect(sun/planet).toBeGreaterThan(1);expect(sun/planet).toBeLessThan(1.3);
    expect(moon/planet).toBeGreaterThan(.75);expect(moon).toBeLessThan(planet);
    expect(ice).toBeLessThan(moon);expect(ice/planet).toBeGreaterThanOrEqual(.75);
  });
});


import {transitionSolarCamera} from './solar-camera';
it('does not extrapolate a negative zoom when the first frame predates its start',()=>{
  const source={x:0,y:0,scale:.12},target={x:300,y:14,scale:.81};
  expect(transitionSolarCamera(source,target,-120)).toEqual(source);
  expect(transitionSolarCamera(source,target,800)).toEqual(target);
});
