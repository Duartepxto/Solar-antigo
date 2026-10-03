import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { OrbitModel } from './model';
import type { OrbitSystem } from './systems';
import { solarNodes } from './solar-model';
import { solarActivity, solarState } from './solar-state';
import { useSolarPreferences } from './solar-preferences';
import { SolarWorld } from './SolarWorld';
import { SolarPlanet } from './SolarPlanet';
import { SolarConstellation } from './SolarConstellation';
import type { SolarSkin } from './solar-model';

/** Agent identity and its real system controls; the existing panels own all actions. */
export function SolarFocus({ model, id, name, systems, width, height, chatWidth, covered, creating=false, onBackground }: {
  model: OrbitModel; id?:string; name:string; systems:OrbitSystem[]; width:number; height:number; chatWidth:number; covered:boolean; creating?:boolean; onBackground:()=>void;
}) {
  const nodes = useMemo(() => solarNodes(model), [model]);
  const node = nodes.find(candidate => candidate.id === id) ?? nodes[0];
  const [preferences] = useSolarPreferences(), [failed,setFailed] = useState(false);
  const [previewSkin,setPreviewSkin]=useState<SolarSkin>('earth');
  useEffect(()=>{if(!creating)return;const preview=(event:Event)=>setPreviewSkin((event as CustomEvent<SolarSkin>).detail);window.addEventListener('jarvis-solar-preview',preview);return()=>window.removeEventListener('jarvis-solar-preview',preview);},[creating]);
  const compact = width < 760, areaWidth = compact ? width : Math.max(220,width-chatWidth-28);
  const state = solarState(node.bot,model.connected), diameter=compact?74:152;
  const portrait=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const el=portrait.current;if(!el||covered||creating||!preferences.motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const source=Array.from(document.querySelectorAll<HTMLElement>('[data-solar-node]')).find(candidate=>candidate.dataset.solarNode===node.id);
    if(!source)return;
    const rect=source.getBoundingClientRect(),parent=el.getBoundingClientRect();
    const sourceDiameter=parseFloat(source.style.getPropertyValue('--planet-size'))||diameter;
    const x=compact?68:areaWidth*.35,y=compact?88:height*.5+143;
    el.style.transformOrigin=`${x}px ${y}px`;
    const animation=el.animate([{transform:`translate(${rect.left+rect.width/2-parent.left-x}px,${rect.top+rect.height/2-parent.top-y}px) scale(${sourceDiameter/diameter})`},{transform:'translate(0,0) scale(1)'}],{duration:560,easing:'cubic-bezier(.16,1,.3,1)'});
    return ()=>animation.cancel();
  },[node.id,covered,preferences.motion,compact,areaWidth,height,diameter,creating]);
  const bodies = [{id:node.id,kind:creating?'planet' as const:node.kind,skin:creating?previewSkin:node.moonSkin??node.skin,x:compact?68:Math.max(160,areaWidth/2),y:compact?88:height*.5+14,diameter:creating?180:diameter,color:node.color,active:!creating&&!!node.bot?.busy,state:creating?'ready' as const:state,activity:solarActivity(node.bot?.tool)}];
  return <section className="solar-focus" data-compact={compact||undefined} data-covered={covered||undefined}
    style={{width:areaWidth}} aria-label={name} onClick={event=>{if(event.target===event.currentTarget)onBackground();}}>
    {(compact||creating)&&<div ref={portrait} className="solar-focus-portrait" aria-hidden="true">
      {!failed && <SolarWorld bodies={bodies} width={areaWidth} height={height} paused={!preferences.motion||covered} settings={preferences} onFailure={()=>setFailed(true)} />}
      {failed && <span className="solar-focus-fallback"><SolarPlanet kind={node.kind} skin={node.moonSkin??node.skin}/></span>}
    </div>}
    <div className="solar-focus-identity" style={!compact?{top:height*.5+14+(creating?125:104),left:Math.max(160,areaWidth/2)-110,right:'auto',width:220}:undefined}>
      <h1>{name}</h1>
      {(creating||node.kind==='planet')&&<span>{creating?t('jarvis.solar.create.agents'):t(`jarvis.solar.${node.skin??'earth'}`)}</span>}
    </div>
    {!covered && !compact && !creating && <SolarConstellation systems={systems} width={areaWidth} height={height} chatWidth={chatWidth}/>}
    {!covered && compact && <div className="solar-system-controls">
      {systems.map(system=>{const Icon=system.icon;return <button key={system.key} type="button" data-tour={system.tour??`cap-${system.key}`}
        aria-label={system.label} aria-description={[system.value,system.status].filter(Boolean).join(' · ')} aria-pressed={!!system.selected} onClick={system.run}
        data-tone={system.tone}>
        <Icon size={18} strokeWidth={1.5} aria-hidden="true"/>
        <span><strong>{system.label}</strong><small>{system.value}</small><small className="solar-system-status">{system.status}</small></span>
        <ChevronRight size={13} aria-hidden="true"/>
      </button>;})}
    </div>}
  </section>;
}

