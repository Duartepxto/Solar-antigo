import type { CSSProperties } from 'react';
import type { OrbitSystem } from './systems';
import {focusGeom} from './model';

/**
 * Open instrument constellation. The paths locate tools, never imply agent data flows.
 * The ring is sized from the free area, so it stays compact whether the chat is open or closed.
 */
export function SolarConstellation({systems,width,height,chatWidth}:{systems:OrbitSystem[];width:number;height:number;chatWidth:number}) {
  const geom=focusGeom(width+28+chatWidth,height,systems.length,chatWidth);
  const cx=geom.fx, cy=geom.fy;
  // labels sit outside the ring (mirrored on the left), so leave ~165px beside it
  const rx=Math.max(150,Math.min(235,cx-165,width-cx-175));
  const ry=Math.max(140,Math.min(215,cy-92,height-cy-56));
  const points=systems.map((_,i)=>{const a=-Math.PI/2+i*(Math.PI*2/Math.max(1,systems.length));return {x:cx+Math.cos(a)*rx,y:cy+Math.sin(a)*ry};});
  const route=(i:number)=>{const b=points[i],dx=b.x-cx,dy=b.y-cy,d=Math.max(1,Math.hypot(dx,dy));return {x1:cx+dx/d*92,y1:cy+dy/d*92,x2:b.x-dx/d*24,y2:b.y-dy/d*24};};
  return <div className="solar-constellation">
    <svg className="solar-instrument-routes" width={width} height={height} aria-hidden="true">
      {systems.map((system,i)=>{const r=route(i);return <path key={system.key} data-live={system.live||undefined} data-selected={system.selected||undefined} d={`M${r.x1},${r.y1} L${r.x2},${r.y2}`}/>;})}
      {systems.map((system,i)=>{
        if(!system.selected&&!system.live)return null;
        const r=route(i);
        // a point of light travels from the agent to the open (or busy) tool
        return <circle key={`${system.key}-light`} className="solar-route-light" r={2.6}>
          <animateMotion dur={system.live?'1.1s':'1.7s'} repeatCount="indefinite" path={`M${r.x1},${r.y1} L${r.x2},${r.y2}`}/>
        </circle>;
      })}
    </svg>
    {systems.map((system,i)=>{const p=points[i],Icon=system.icon,left=p.x<cx-4;
      const detail=[system.value,system.status].filter(Boolean).join(' · ');
      return <button key={system.key} type="button" className="solar-instrument" data-instrument={system.key} data-live={system.live||undefined} data-tone={system.tone} data-side={left?'left':'right'} aria-pressed={!!system.selected}
        style={{left:p.x,top:p.y,'--i':i} as CSSProperties} aria-label={system.label} aria-description={detail} data-tour={system.tour??`cap-${system.key}`} onClick={event=>{event.stopPropagation();system.run();}}>
        <span className="solar-instrument-orb solar-liquid"><Icon size={15} strokeWidth={1.6} aria-hidden="true"/></span>
        <span className="solar-original-system-copy"><strong>{system.label}</strong>{detail&&<small>{detail}</small>}</span>
      </button>;})}
  </div>;
}
