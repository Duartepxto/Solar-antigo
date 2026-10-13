import {useEffect,useLayoutEffect,useMemo,useRef,type CSSProperties} from 'react';
import type {OrbitSystem} from '../../src/orbit/systems';
import {doubleOrbitLayout} from './doubleOrbitLayout';
import {menuWave} from './menuWave';
import {useSolarPreferences} from '../../src/orbit/solar-preferences';
export function DoubleOrbit({systems,width,height}:{systems:OrbitSystem[];width:number;height:number;chatWidth:number}){
 const layout=useMemo(()=>doubleOrbitLayout(systems,width,height),[systems,width,height]);
 const [preferences]=useSolarPreferences();
 const canvas=useRef<HTMLCanvasElement>(null);

 const exclusions=useRef<{left:number;right:number;top:number;bottom:number}[]>([]);
 useLayoutEffect(()=>{
  const surface=canvas.current,nav=surface?.parentElement;if(!surface||!nav)return;
  let measuring=0,cancelled=false;
  const labels=[...nav.querySelectorAll<HTMLElement>('.solar-double-copy'),...nav.closest('.solar-focus')?.querySelectorAll<HTMLElement>('.solar-focus-identity')||[]];
  const measure=()=>{measuring=0;if(cancelled)return;const host=surface.getBoundingClientRect();if(!host.width||!host.height)return;
   exclusions.current=labels.map(label=>{const r=label.getBoundingClientRect();return {left:(r.left-host.left)*width/host.width-5,right:(r.right-host.left)*width/host.width+5,top:(r.top-host.top)*height/host.height-4,bottom:(r.bottom-host.top)*height/host.height+4};});
   surface.dispatchEvent(new Event('solar-menu-layout'));
  };
  const schedule=()=>{cancelAnimationFrame(measuring);measuring=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(schedule);labels.forEach(label=>observer.observe(label));observer.observe(nav);
  nav.addEventListener('animationend',schedule);document.fonts.ready.then(()=>{if(!cancelled)schedule();});measure();
  return()=>{cancelled=true;cancelAnimationFrame(measuring);observer.disconnect();nav.removeEventListener('animationend',schedule);};
 },[layout,width,height]);
 useEffect(()=>{
  const surface=canvas.current,ctx=surface?.getContext('2d');if(!surface||!ctx)return;
  const ratio=Math.min(devicePixelRatio||1,2);surface.width=Math.max(1,Math.round(width*ratio));surface.height=Math.max(1,Math.round(height*ratio));ctx.setTransform(ratio,0,0,ratio,0,0);
  let frame=0,last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const routes=layout.points.map(p=>{const system=systems.find(v=>v.key===p.key)!,dx=p.x-layout.cx,dy=p.y-layout.cy,d=Math.max(1,Math.hypot(dx,dy));return {p,system,ux:dx/d,uy:dy/d,length:Math.max(1,d-124),count:Math.max(32,Math.min(90,Math.round((d-100)/2.5)))};});
  const paint=(now:number)=>{
   frame=0;if(document.hidden)return;if(now-last<32){frame=requestAnimationFrame(paint);return;}last=now;ctx.clearRect(0,0,width,height);
   const moving=preferences.motion&&!reduced.matches&&document.documentElement.dataset.reducedMotion!=='true';
   for(const {p,system:s,ux,uy,length,count} of routes){const nx=-uy,ny=ux;ctx.fillStyle=s.tone==='danger'?'#eba59b':s.selected||s.live?'#e9cb92':'#bac5d1';
    for(let i=0;i<count;i++){
     const phase=moving?(now*.00008)%1:0,u=(i+.4+phase)/(count+1),distance=97+length*u;
     const wave=menuWave(u,length,moving?now/1000:0),scatter=Math.sin(i*19.3+p.angle)*.45;
     const x=layout.cx+ux*distance+nx*(wave+scatter),y=layout.cy+uy*distance+ny*(wave+scatter);
     if(exclusions.current.some(r=>x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom))continue;
     ctx.globalAlpha=((s.selected ? .9 : s.live ? .72 : .38)+Math.sin(i*2.7+(moving?now*.0008:0))*.045)*Math.min(1,u*12,(1-u)*12);
     const size=i%4===0?2.4:1.9;ctx.fillRect(x-size/2,y-size/2,size,size*.8);
     if(i%3===0){ctx.globalAlpha*=.5;ctx.fillRect(x+nx*1.65-size*.3,y+ny*1.65-size*.3,size*.65,size*.5);}
    }
   }
   ctx.globalAlpha=1;if(moving)frame=requestAnimationFrame(paint);
  };
  const resume=()=>{cancelAnimationFrame(frame);last=0;if(!document.hidden)frame=requestAnimationFrame(paint);};
  const observer=new MutationObserver(resume);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduced-motion']});
  document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);surface.addEventListener('solar-menu-layout',resume);resume();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);surface.removeEventListener('solar-menu-layout',resume);};
 },[layout,systems,width,height,preferences.motion]);
 return <nav className="solar-double-orbit" aria-label="Ferramentas do agente" data-compact={width<600||undefined}>
  <canvas ref={canvas} width={width} height={height} style={{width,height}} aria-hidden="true" className="solar-double-paths"/>
  {layout.points.map((p,i)=>{const s=systems.find(s=>s.key===p.key)!,Icon=s.icon;const detail=[s.value,s.status].filter(Boolean).join(' · ');const caption=s.key==='usage'?s.value:s.live&&s.status?s.status:s.value===s.label?s.status:s.value;return <button type="button" key={s.key} className="solar-double-control" data-instrument={s.key} data-ring={p.ring} data-live={s.live||undefined} data-tone={s.tone} data-tour={s.tour??`cap-${s.key}`} aria-label={s.label} aria-description={detail} aria-pressed={!!s.selected} title={`${s.label} · ${detail}`} style={{left:p.x,top:p.y,'--orbit-delay':`${Math.min(i*25,180)}ms`,'--orbit-start-x':`${(layout.cx-p.x)*.08}px`,'--orbit-start-y':`${(layout.cy-p.y)*.08}px`} as CSSProperties} onClick={e=>{e.stopPropagation();s.run();}}><span className="solar-double-symbol"><Icon size={p.ring?16:19} strokeWidth={1.6} aria-hidden="true"/></span><span className="solar-double-copy"><strong>{s.label}</strong><small>{caption}</small></span><span className="solar-double-feedback" aria-hidden="true"/></button>;})}
 </nav>;
}
