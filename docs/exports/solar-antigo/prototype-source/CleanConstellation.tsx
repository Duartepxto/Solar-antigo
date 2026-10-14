import type {CSSProperties} from 'react';
import type {OrbitSystem} from '../../src/orbit/systems';

export function CleanConstellation({systems,width,height}:{systems:OrbitSystem[];width:number;height:number;chatWidth:number}){
 const cx=Math.max(160,width/2),cy=height/2+14,compact=width<690;
 const rx=Math.min(230,width/2-170),ry=Math.min(230,height*.32);
 const half=Math.ceil(systems.length/2),step=Math.min(70,(height-180)/(half+1));
 const points=systems.map((_,i)=>{
  if(compact){const row=i%half,index=row-half/2,offset=(index<0?index:index+1)*step;return {x:i<half?32:width-32,y:cy+offset};}
  const a=-Math.PI/2+i*Math.PI*2/systems.length;return {x:cx+Math.cos(a)*rx,y:cy+Math.sin(a)*ry};
 });
 return <div className="solar-constellation clean-constellation orbit-direct-constellation" data-compact={compact||undefined}>
  <svg className="solar-instrument-routes" width={width} height={height} aria-hidden="true">{systems.map((system,i)=>{const p=points[i],dx=p.x-cx,dy=p.y-cy,d=Math.hypot(dx,dy);return <path key={system.key} data-selected={system.selected||undefined} d={`M${cx+dx/d*88},${cy+dy/d*88} L${p.x-dx/d*23},${p.y-dy/d*23}`}/>;})}</svg>
  {systems.map((system,i)=>{const p=points[i],Icon=system.icon,side=p.x<cx-20?'left':p.x>cx+20?'right':'center',detail=[system.value,system.status].filter(Boolean).join(' · ');return <button key={system.key} type="button" className="solar-instrument clean-instrument orbit-direct-instrument" data-side={side} data-tone={system.tone} data-live={system.live||undefined} aria-pressed={!!system.selected} aria-label={system.label} aria-description={detail} title={detail} style={{left:p.x,top:p.y,'--i':i} as CSSProperties} onClick={e=>{e.stopPropagation();system.run();}}><span className="solar-instrument-orb solar-liquid"><Icon size={17} strokeWidth={1.5}/></span><span className="solar-original-system-copy"><strong>{system.label}</strong>{detail&&<small>{detail}</small>}</span></button>;})}
 </div>;
}
