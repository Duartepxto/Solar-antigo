import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useStore } from '@/state/store';
import { buildModel, loadBotOrder, loadLayout, type OrbitModel } from './model';
import { solarNodes, type SolarNode } from './solar-model';
import { SolarPlanet } from './SolarPlanet';
import { registerSolarPortrait, updateSolarPortraitFallback, pointSolarPortrait, leaveSolarPortrait } from './solar-portraits';
import { solarState, solarActivity } from './solar-state';

const IdentityContext = createContext<ReadonlyMap<string, SolarNode> | null>(null);
export function SolarIdentityProvider({ model, children }: { model: OrbitModel; children: ReactNode }) {
  const identities = useMemo(() => new Map(solarNodes(model).map(node => [node.id,node])), [model]);
  return <IdentityContext.Provider value={identities}>{children}</IdentityContext.Provider>;
}

export function SolarIdentity({ id, size, label, className, dim }: { id:string; size:number; label?:string; className?:string; dim?:boolean }) {
  const provided = useContext(IdentityContext), { state } = useStore();
  // Most instances share the shell's mapping. Portals outside the shell derive the same saved order.
  const fallback = useMemo(() => provided ? null : new Map(solarNodes(buildModel(state,loadLayout().hidden,loadBotOrder())).map(node => [node.id,node])), [provided,state.bots,state.groups,state.sections,state.connected]);
  const identity = (provided ?? fallback)?.get(id);
  const kind = id === 'you' ? 'sun' : identity?.kind ?? 'moon';
  const canvas = useRef<HTMLCanvasElement>(null), [ready, setReady] = useState(false);
  const skin = identity?.moonSkin ?? identity?.skin ?? 'moon-silver';
  const activity = solarActivity(identity?.bot?.tool);
  const currentState = solarState(identity?.bot ?? null, state.connected);
  const body = { id, kind, skin, x: 0, y: 0, diameter: 82, color: identity?.color ?? '#ccd4df', active: !!identity?.bot?.busy,
    state: currentState, activity, tool: identity?.bot?.tool ?? undefined };
  const latestBody = useRef(body); latestBody.current = body;
  useEffect(() => {
    setReady(false); let drawn = false;
    return registerSolarPortrait(canvas.current!, latestBody.current, () => { if (!drawn) { drawn = true; setReady(true); } });
  }, [id,kind,skin]);
  useEffect(() => { updateSolarPortraitFallback(latestBody.current); }, [id,currentState,activity,identity?.bot?.tool]);
  return <span className={`solar-identity ${className ?? ''}`} data-solar-identity={id} data-solar-kind={kind}
    style={{width:size,height:size,opacity:dim?.55:undefined,position:'relative'}} {...(label?{role:'img','aria-label':label}:{'aria-hidden':true})}>
    {!ready && <SolarPlanet kind={kind} skin={skin} />}
    <canvas ref={canvas} data-solar-live-identity={id} data-live-ready={ready || undefined} aria-hidden="true"
      style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:ready?1:0}}
      onPointerMove={event => { const rect=event.currentTarget.getBoundingClientRect(); pointSolarPortrait(id,(event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height); }}
      onPointerLeave={leaveSolarPortrait} />
  </span>;
}
