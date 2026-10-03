import { useRef, useState, type PointerEvent } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { OrbitSystem } from './systems';

/** A quarter-turn selector: drag the rail to browse, click a control to open its real panel. */
export function SolarSystemArc({ systems, width, height }: {systems:OrbitSystem[];width:number;height:number}) {
  const [index,setIndex]=useState(0),[dragging,setDragging]=useState(false);
  const gesture=useRef<{x:number;y:number;index:number;moved:boolean}|null>(null),suppress=useRef(false);
  const clamp=(value:number)=>Math.max(0,Math.min(systems.length-1,value));
  const cx=width*.35,cy=height*.53,r=Math.min(202,width*.29);
  const point=(angle:number)=>({x:cx+Math.cos(angle*Math.PI/180)*r,y:cy+Math.sin(angle*Math.PI/180)*r});
  const a=point(-90),b=point(0),current=systems[clamp(index)];
  function start(event:PointerEvent<HTMLDivElement>) {
    if(event.button!==0)return;event.stopPropagation();
    suppress.current=false;gesture.current={x:event.clientX,y:event.clientY,index,moved:false};
  }
  function move(event:PointerEvent<HTMLDivElement>) {
    const g=gesture.current;if(!g)return;const travel=(event.clientX-g.x-event.clientY+g.y)/Math.SQRT2;
    if(Math.abs(travel)>5){if(!g.moved)event.currentTarget.setPointerCapture(event.pointerId);g.moved=true;setDragging(true);setIndex(clamp(g.index+Math.round(travel/52)));}
  }
  function end(cancelled=false) {
    const g=gesture.current;gesture.current=null;setDragging(false);if(!g)return;
    suppress.current=g.moved;if(cancelled)setIndex(g.index);
  }
  return <div className="solar-system-arc" data-dragging={dragging||undefined} onPointerDown={start} onPointerMove={move} onPointerUp={()=>end()} onPointerCancel={()=>end(true)}
    onClick={event=>event.stopPropagation()} onKeyDown={event=>{if(event.key==='ArrowDown'||event.key==='ArrowRight'){event.preventDefault();setIndex(clamp(index+1));}else if(event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();setIndex(clamp(index-1));}else if(event.key==='Home'){event.preventDefault();setIndex(0);}else if(event.key==='End'){event.preventDefault();setIndex(systems.length-1);}else if(event.key==='Escape'&&gesture.current){event.stopPropagation();end(true);}}}>
    <svg width={width} height={height} className="solar-arc-rail" aria-hidden="true">
      <path className="solar-arc-track" d={`M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`}/>
      <path className="solar-arc-hit" d={`M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`}/>
      {Array.from({length:systems.length},(_,i)=>{const p=point(-90+i/Math.max(1,systems.length-1)*90);return <circle key={i} cx={p.x} cy={p.y} r={i===index?2.8:1.3} className={i===index?'solar-arc-tick--active':undefined}/>;})}
    </svg>
    {[-1,0,1].map((offset)=>{const i=index+offset,system=systems[i];if(!system)return null;const p=point(-45+offset*34),Icon=system.icon;return <button key={offset} type="button" className="solar-arc-item" data-current={offset===0||undefined}
      style={{left:p.x,top:p.y}} data-tour={system.tour??`cap-${system.key}`} aria-label={system.label} aria-description={[system.value,system.status].filter(Boolean).join(' · ')} aria-pressed={!!system.selected}
      onClick={event=>{if(suppress.current&&event.detail!==0){suppress.current=false;return;}setIndex(i);system.run();}}>
      <span className="solar-arc-icon"><Icon size={offset===0?21:17} strokeWidth={1.5} aria-hidden="true"/></span>
      <span className="solar-arc-copy"><strong>{system.label}</strong><small>{system.value}</small>{offset===0&&<small>{system.status}</small>}</span>
    </button>;})}
    <div className="solar-arc-navigation" style={{left:cx+r+16,top:cy+45}}>
      <button type="button" disabled={index===0} aria-label={t('jarvis.solar.arc.previous')} onClick={()=>setIndex(clamp(index-1))}><ChevronUp size={15}/></button>
      <span>{systems.length?clamp(index)+1:0} / {systems.length}</span>
      <button type="button" disabled={index>=systems.length-1} aria-label={t('jarvis.solar.arc.next')} onClick={()=>setIndex(clamp(index+1))}><ChevronDown size={15}/></button>
    </div>
    {current&&<span className="solar-arc-hint" style={{left:cx+r+16,top:cy+88}}>{t('jarvis.solar.arc.drag')}</span>}
  </div>;
}
