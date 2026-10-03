import type { OrbitSystem } from './systems';
import {focusGeom} from './model';

/** Open instrument constellation. The paths locate tools, never imply agent data flows. */
export function SolarConstellation({systems,width,height,chatWidth}:{systems:OrbitSystem[];width:number;height:number;chatWidth:number}) {
  const geom=focusGeom(width+28+chatWidth,height,systems.length,chatWidth);
  const point=(i:number)=>geom.pos[i];
  return <div className="solar-constellation">
    <svg className="solar-instrument-routes" width={width} height={height} aria-hidden="true">
      {systems.map((system,i)=>{const a={x:geom.fx,y:geom.fy},b=point(i),dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy));return <path key={system.key} data-live={system.live||undefined} data-selected={system.selected||undefined} d={`M${a.x+dx/d*108},${a.y+dy/d*108} L${b.x-dx/d*29},${b.y-dy/d*29}`}/>;})}
    </svg>
    {systems.map((system,i)=>{const p=point(i),Icon=system.icon;return <button key={system.key} type="button" className="solar-instrument" data-instrument={system.key} data-live={system.live||undefined} data-tone={system.tone} aria-pressed={!!system.selected}
      style={{left:p.x,top:p.y}} aria-label={system.label} aria-description={[system.value,system.status].filter(Boolean).join(' · ')} data-tour={system.tour??`cap-${system.key}`} onClick={event=>{event.stopPropagation();system.run();}}>
      <Icon size={15} className="solar-original-system-icon" aria-hidden="true"/>
      <span className="solar-original-system-copy"><span className="solar-original-system-label">{system.label}</span><strong>{system.value}</strong>{system.status&&<small>{system.status}</small>}</span>
    </button>;})}
  </div>;
}
