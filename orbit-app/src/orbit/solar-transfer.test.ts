import {describe,it,expect} from 'vitest';
import {solarTransferPoint,solarTransferRoute} from './solar-transfer.js';
describe('aura transfer',()=>{
  const a={x:0,y:0,radius:90},b={x:500,y:120,radius:70};
  it('begins and ends on the aura rather than the body centre',()=>{
    for(let i=0;i<24;i++){
      const start=solarTransferPoint(a,b,i,0),end=solarTransferPoint(a,b,i,1);
      expect(Math.hypot(start.x-a.x,start.y-a.y)).toBeCloseTo(a.radius*1.17);
      expect(Math.hypot(end.x-b.x,end.y-b.y)).toBeCloseTo(b.radius*1.17);
    }
  });
  it('distributes fragments across distinct launch and arrival points',()=>{
    for(const progress of [0,.5,1]){
      const points=Array.from({length:24},(_,i)=>solarTransferPoint(a,b,i,progress));
      expect(new Set(points.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`)).size).toBeGreaterThan(20);
    }
  });
  it('follows translated/scaled bodies without losing aura attachment',()=>{
    const point=solarTransferPoint(a,b,7,.43),k=2.3;
    const moved=solarTransferPoint({x:a.x*k+30,y:a.y*k-10,radius:a.radius*k},{x:b.x*k+30,y:b.y*k-10,radius:b.radius*k},7,0);
    expect(Math.hypot(moved.x-30,moved.y+10)).toBeCloseTo(a.radius*k*1.17);
    expect(Number.isFinite(point.x)&&Number.isFinite(point.y)).toBe(true);
  });
});
describe('hierarchical communications',()=>{
  const sun={id:'jarvis',kind:'sun'},planet={id:'mercury',kind:'planet',parentId:'jarvis'},moon={id:'silver',kind:'moon',parentId:'mercury'};
  const nodes=[sun,planet,moon];
  it('never sends a moon directly to Jarvis or Jarvis directly to a moon',()=>{
    expect(solarTransferRoute(moon,sun,nodes)).toEqual(['silver','mercury','jarvis']);
    expect(solarTransferRoute(sun,moon,nodes)).toEqual(['jarvis','mercury','silver']);
  });
  it('keeps moon exchanges with their own parent direct',()=>{
    expect(solarTransferRoute(moon,planet,nodes)).toEqual(['silver','mercury']);
    expect(solarTransferRoute(planet,moon,nodes)).toEqual(['mercury','silver']);
  });
  it('does not bypass a missing moon parent',()=>expect(solarTransferRoute(moon,sun,[sun,moon])).toEqual([]));
});
