import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useStore } from '@/state/store';
import { buildModel, loadBotOrder, loadLayout, type OrbitModel } from './model';
import { solarNodes, type SolarNode } from './solar-model';
import { SolarPlanet } from './SolarPlanet';

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
  return <span className={`solar-identity ${className ?? ''}`} data-solar-identity={id} data-solar-kind={kind}
    style={{width:size,height:size,opacity:dim?.55:undefined}} {...(label?{role:'img','aria-label':label}:{'aria-hidden':true})}>
    <SolarPlanet kind={kind} skin={identity?.moonSkin ?? identity?.skin ?? 'moon-silver'} />
  </span>;
}
