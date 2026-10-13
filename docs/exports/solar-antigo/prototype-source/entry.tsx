import { useEffect, useReducer, useState, useCallback, useRef } from 'react';
import {WelcomeFlow} from '../../src/components/onboarding/WelcomeFlow';
import {SpatialSettings} from './SpatialSettings';
import {demoBots,demoEngine,demoConfig,demoReducer,installDemoFetch,cycleTransfer,emitTransfer,newDemoBot} from './demoRuntime';
import { createRoot } from 'react-dom/client';
import { BotEditorStore, initialState, reducer } from '../../src/state/store';
import { OrbitShell } from '../../src/orbit/OrbitShell';
import { DesktopCapabilitiesProvider } from '../../src/components/DesktopCapabilities';
import { ThreadRefsProvider } from '../../src/components/ThreadRefs';
import { applySkin } from '../../src/lib/skins';
import { setLocale } from '../../src/lib/i18n';
import { installLiquidGlass } from '../../src/orbit/liquid-glass';
import { CommandPalette } from '../../src/components/CommandPalette';
import { KeyboardShortcutsModal } from '../../src/components/KeyboardShortcutsModal';
import { WelcomeGate } from '../../src/components/onboarding/WelcomeGate';
import { GuidedTour } from '../../src/components/onboarding/GuidedTour';
import { LOCAL_VIEWER } from '../../src/lib/onboarding';
import '../../src/styles.css';
import '../../src/orbit/solar.css';
import '../../src/orbit/solar-settings.css';
import 'katex/dist/katex.min.css';

// A visual export of the existing Solar, with local demonstration data only.
const now = Date.now();
const bot = (id, name, section = '', chiefOfStaff = false) => ({
  id, name, section, chiefOfStaff, threadId: `demo-${id}`, color: 'orange',
  title: name === 'Jarvis' ? 'O teu assistente' : 'Agente da equipa',
  description: 'Demonstração local do design Solar.', busy: false, unread: false,
  activity: 'idle', notifications: false,
  modelSelection: { instanceId: 'demo', model: 'solar-demo' },
  messages: [{ id: `welcome-${id}`, role: 'assistant', text: name === 'Jarvis' ? 'Olá! Por onde queres começar?' : `Olá, sou ${name}. Como posso ajudar?`, at: now }],
  tasks: [],
});
const live=import.meta.env.VITE_SOLAR_LIVE;
const intro=location.pathname.endsWith('Solar-entrada.html');
const bots = live?demoBots:[bot('jarvis', 'Jarvis'), bot('design', 'Design', 'Design', true), bot('research', 'Pesquisa', 'Design'), bot('build', 'Desenvolvimento', 'Desenvolvimento', true)];
const engine = { id:'demo', instanceId:'demo', driverKind:'codex', displayName:'Solar · demonstração', driverId:'codex', label:'Solar · demonstração', name:'Solar · demonstração',
  snapshot:{ state:'available', version:'demo' }, capabilities:{}, models:{default:'solar-demo',options:[{id:'solar-demo',label:'Modelo de demonstração'}]}, permissionModes:[] };
const config = { onboarding:{version:999,completedAt:new Date().toISOString()},profile:{name:'Tu',email:''},box:{configured:false},vps:{configured:false,sshAlias:''},rooms:{turnTimeoutMinutes:30},localVm:{mode:'shared',maxInstances:1},tts:{configured:false,ready:false,voice:'',provider:'system'},threads:{maxConcurrentPerBot:3},edition:{edition:'oss',features:[]} };
window.fetch = async (input) => {
  const path = String(input instanceof Request ? input.url : input).split('?')[0];
  let value:any = {};
  if(path.endsWith('/team-map')) value={collaborations:[],queued:[],running:[]};
  else if(path.includes('/profile/learned')) value={learned:[],aboutMe:''};
  else if(path.endsWith('/skills')) value={skills:[{name:'Pesquisar',enabled:true},{name:'Ficheiros',enabled:true},{name:'Organizar',enabled:true}]};
  else if(path.endsWith('/memory')) value={botId:'demo',workspacePath:'Demonstração',index:{lines:24,bytes:800,maxLines:200,maxBytes:32000,loadedLines:24,loadedBytes:800,truncated:false,hash:'demo'},topics:[],logs:[]};
  else if(path.endsWith('/memory/file')) value={path:'MEMORY.md',text:'# Solar\n\nEste ficheiro demonstra o design antigo do Solar.',exists:true,hash:'demo'};
  else if(path.includes('/session')) value={kind:'loopback'};
  else if(path.endsWith('/config')) value=config;
  else if(path.includes('/instances') || path.includes('/engines')) value={instances:[engine],drivers:[]};
  else if(path.includes('/routines')) value={routines:[],runs:[]};
  else if(path.includes('/plugins')) value={plugins:[],apps:[],entries:[]};
  else if(path.includes('/tasks')) value={tasks:[]};
  else if(path.includes('/files')) value={files:[],entries:[]};
  else if(path.includes('/threads')) value={threads:[],tasks:[]};
  return new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
};
applySkin('dark'); setLocale('pt-br');
if(live)installDemoFetch();
document.documentElement.setAttribute('data-solar','');
document.body.classList.add('jarvis-solar');
document.title=import.meta.env.VITE_SOLAR_DESIGN_TITLE || 'Solar antigo — design';
if(import.meta.env.VITE_SOLAR_DESIGN_TITLE==='Solar — Design PC'){
  try{document.documentElement.dataset.solarMotion=JSON.parse(localStorage.getItem('jarvis.solar.preferences.v1')||'null')?.motion===false?'off':'on';}catch{document.documentElement.dataset.solarMotion='on';}
  window.addEventListener('jarvis-solar-preferences',event=>{document.documentElement.dataset.solarMotion=(event as CustomEvent).detail.motion===false?'off':'on';});
}
installLiquidGlass();
function Preview(){
  useEffect(()=>{const update=()=>{document.documentElement.dataset.demoHidden=String(document.hidden);};update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
  const [spatialOpen,setSpatialOpen]=useState(false);
  const openSpatial=()=>{document.documentElement.dataset.solarSpatial='true';window.dispatchEvent(new Event('solar:spatial-active'));setSpatialOpen(true);};
  const closeSpatial=()=>{delete document.documentElement.dataset.solarSpatial;window.dispatchEvent(new Event('solar:spatial-active'));setSpatialOpen(false);};
  useEffect(()=>{if(!import.meta.env.VITE_SOLAR_CANVAS)return;const navigate=(event:Event)=>{if((event as CustomEvent).detail?.to==='you'){event.stopImmediatePropagation();openSpatial();}};window.addEventListener('solar:settings-open',openSpatial);window.addEventListener('orbit:navigate',navigate,true);return()=>{window.removeEventListener('solar:settings-open',openSpatial);window.removeEventListener('orbit:navigate',navigate,true);};},[]);
  const [paletteRequest,setPaletteRequest]=useState(0),[paletteOpen,setPaletteOpen]=useState(false);
  const [state, send]=useReducer(live?demoReducer:reducer,{...initialState,bots,sections:['Design','Desenvolvimento'],instances:[live?demoEngine:engine],config:live?demoConfig:config,connected:true,selectedId:'jarvis',routinesLoadState:'loaded'} as any);
  useEffect(()=>{if(!live||intro)return;let step=0;const id=setInterval(()=>{send({type:'demoTick',step} as any);cycleTransfer(step++);},2600);return()=>clearInterval(id);},[]);
  useEffect(()=>{if(!live)return;const listener=(event:Event)=>{const {id,text}= (event as CustomEvent).detail;send({type:'demoReply',id,text} as any);};window.addEventListener('solar:demo-reply',listener);return()=>window.removeEventListener('solar:demo-reply',listener);},[]);
  useEffect(()=>{if(!live)return;try{localStorage.setItem('solar.demo.identities',JSON.stringify(Object.fromEntries(state.bots.map(b=>[b.id,{name:b.name,previewSkin:(b as any).previewSkin||''}]))));}catch{}},[state.bots]);
  const stateRef=useRef(state);stateRef.current=state;
  const dispatch=useCallback((action:any)=>{
    if(live){if(action.type==='newBot'){const next={...newDemoBot(action.role?.name||action.role?.title||'Novo agente',action.section||''),previewSkin:action.previewSkin||''};send({type:'botAdded',bot:next} as any);action.onCreated?.(next);return;}if(action.type==='toggleAppSettings'){window.dispatchEvent(new CustomEvent('solar:demo-settings',{detail:'engine'}));return;}send(action);if(action.type==='send'){const target=action.botId==='jarvis'?'build':'jarvis';emitTransfer(action.botId,target);send({type:'demoPatch',id:target,patch:{busy:true,activity:'working'}} as any);setTimeout(()=>{window.dispatchEvent(new CustomEvent('solar:demo-reply',{detail:{id:action.botId,text:action.botId==='jarvis'?'Recebi a tua tarefa. Deleguei a preparação em Desenvolvimento e pedi a Qualidade para verificar o resultado. Este fluxo está a ser simulado no HTML.':'Recebi a tua mensagem. Vou preparar o trabalho e partilhar o resultado com Jarvis. Este fluxo está a ser simulado no HTML.'}}));send({type:'demoReply',id:target,text:'Recebi o pedido da equipa e preparei a verificação. Resultado demonstrativo.'} as any);emitTransfer(target,action.botId,true);},4200);}return;}
    if(action.type==='send'){
      const current=stateRef.current.bots.find(b=>b.id===action.botId);
      if(!current)return;
      send({type:'messageAdded',threadId:current.threadId,message:{id:crypto.randomUUID(),role:'user',text:action.text,at:Date.now()}} as any);
      send({type:'messageAdded',threadId:current.threadId,message:{id:crypto.randomUUID(),role:'assistant',text:'Esta é uma demonstração do design. A mensagem ficou apenas nesta página; não foi enviada a uma IA.',at:Date.now()}} as any);
    }else send(action);
  },[]);
  if(intro)return <DesktopCapabilitiesProvider><BotEditorStore value={{state,dispatch,flushBotPatches:async()=>null,refreshInstances:async()=>{},refreshModels:async()=>{}}}><WelcomeFlow bot={state.bots.find(b=>b.id==='jarvis')??null} dictation={true} reel={true} replay={true} onDone={()=>{location.href='Solar.html';}}/></BotEditorStore></DesktopCapabilitiesProvider>;
  return <DesktopCapabilitiesProvider><BotEditorStore value={{state,dispatch,flushBotPatches:async()=>null,refreshInstances:async()=>{},refreshModels:async()=>{}}}><ThreadRefsProvider><div className={'solar-prototype-base'+(spatialOpen?' is-suspended':'')} aria-hidden={spatialOpen||undefined} inert={spatialOpen||undefined}><OrbitShell onSearch={()=>setPaletteRequest(n=>n+1)} paletteOpen={paletteOpen}/></div>{spatialOpen&&<SpatialSettings onClose={closeSpatial} onReplay={()=>dispatch({type:'toggleWelcome',open:true})}/>}<CommandPalette onOpenChange={setPaletteOpen} openRequest={paletteRequest}/>{state.shortcutsOpen&&<KeyboardShortcutsModal open onClose={()=>dispatch({type:'toggleShortcuts',open:false})}/>}</ThreadRefsProvider><WelcomeGate viewer={LOCAL_VIEWER}/>{!live&&<GuidedTour/>}</BotEditorStore></DesktopCapabilitiesProvider>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
