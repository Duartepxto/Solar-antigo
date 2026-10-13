import {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowUpRight,AudioLines,BrainCircuit,Check,ChevronLeft,LockKeyhole,MonitorSmartphone,Palette,ScanFace,Sparkles,Workflow,X} from 'lucide-react';
import {SolarWorld} from '../../src/orbit/SolarWorld';
import {SolarPlanet} from '../../src/orbit/SolarPlanet';
import {useSolarPreferences} from '../../src/orbit/solar-preferences';
type Point={x:number;y:number;alpha:number;diameter?:number};
type Field={id:string;label:string;kind:'text'|'choice'|'toggle'|'range'|'action';options?:string[];action?:string};
const domains=[
 {id:'identity',name:'Identidade',hint:'Perfil e idioma',Icon:ScanFace,fields:[{id:'name',label:'O teu nome',kind:'text'},{id:'language',label:'Idioma',kind:'choice',options:['Português','English']},{id:'instruction',label:'Sobre ti',kind:'text'}]},
 {id:'engine',name:'Motor',hint:'Contas e modelos',Icon:BrainCircuit,fields:[{id:'engine',label:'Motor dos agentes',kind:'choice',options:['Codex','Claude Code']},{id:'effort',label:'Profundidade',kind:'choice',options:['Rápido','Equilibrado','Profundo']},{id:'account',label:'Conta de IA',kind:'action',action:'Configurar conta'}]},
 {id:'tools',name:'Capacidades',hint:'Skills e ligações',Icon:Sparkles,fields:[{id:'search',label:'Pesquisar',kind:'toggle'},{id:'files',label:'Ficheiros',kind:'toggle'},{id:'memory',label:'Memória',kind:'text'},{id:'integrations',label:'Aplicações',kind:'action',action:'Adicionar ligação'}]},
 {id:'devices',name:'Dispositivos',hint:'PC e telemóvel',Icon:MonitorSmartphone,fields:[{id:'computer',label:'Computador',kind:'choice',options:['Automático','Este PC','Navegador']},{id:'phone',label:'Telemóvel',kind:'action',action:'Ligar dispositivo'},{id:'notifications',label:'Notificações',kind:'toggle'}]},
 {id:'voice',name:'Voz',hint:'Ouvir e responder',Icon:AudioLines,fields:[{id:'spoken',label:'Respostas por voz',kind:'toggle'},{id:'voice',label:'Voz',kind:'choice',options:['Natural','Calma','Direta']},{id:'dictation',label:'Ditado',kind:'toggle'}]},
 {id:'routines',name:'Rotinas',hint:'Trabalho programado',Icon:Workflow,fields:[{id:'daily',label:'Resumo do dia',kind:'toggle'},{id:'weekly',label:'Revisão semanal',kind:'toggle'},{id:'newRoutine',label:'Nova rotina',kind:'action',action:'Criar rotina'}]},
 {id:'appearance',name:'Aspeto',hint:'Luz e movimento',Icon:Palette,fields:[{id:'background',label:'Fundo',kind:'choice',options:['Preto','Azul profundo','Grafite']},{id:'motion',label:'Movimento',kind:'toggle'},{id:'debris',label:'Partículas',kind:'toggle'},{id:'glow',label:'Luz do sol',kind:'range'}]},
 {id:'protection',name:'Proteção',hint:'Acesso e permissões',Icon:LockKeyhole,fields:[{id:'approvals',label:'Aprovações',kind:'choice',options:['Pedir sempre','Ações sensíveis']},{id:'privacy',label:'Conversas privadas',kind:'toggle'},{id:'people',label:'Pessoas',kind:'action',action:'Gerir acesso'},{id:'backup',label:'Cópia de segurança',kind:'action',action:'Exportar preferências'}]},
] as Array<{id:string;name:string;hint:string;Icon:any;fields:Field[]}>;
function useSpringGraph(target:Record<string,Point>,enabled:boolean){
 const points=useRef<Record<string,Point>>({}),speed=useRef<Record<string,Point>>({});
 const [frame,setFrame]=useState(()=>Object.fromEntries(Object.keys(target).map(id=>[id,{...target.sun,alpha:id==='sun'?1:0}])));
 useEffect(()=>{
   for(const[id,p]of Object.entries(target))if(!points.current[id])points.current[id]={...target.sun,alpha:id==='sun'?1:0};
   if(!enabled){points.current=structuredClone(target);speed.current={};setFrame(target);return;}
   let request=0,last=performance.now(),start=last;
   const tick=(now:number)=>{
     const dt=Math.min(.025,(now-last)/1000);last=now;let unsettled=false;
     for(const[id,dest]of Object.entries(target)){
       const p=points.current[id],v=speed.current[id]??={x:0,y:0,alpha:0};
       for(const axis of ['x','y','alpha','diameter'] as const){const destination=dest[axis]??0;v[axis]??=0;p[axis]??=0;v[axis]+=(260*(destination-p[axis])-31*v[axis])*dt;p[axis]+=v[axis]*dt;if(Math.abs(destination-p[axis])>.08||Math.abs(v[axis])>.12)unsettled=true;}
     }
     if(!unsettled||now-start>950){points.current=structuredClone(target);setFrame(target);return;}
     setFrame(Object.fromEntries(Object.entries(points.current).map(([id,p])=>[id,{...p,alpha:Math.max(0,Math.min(1,p.alpha))}])));
     request=requestAnimationFrame(tick);
   };
   request=requestAnimationFrame(tick);return()=>cancelAnimationFrame(request);
 },[target,enabled]);
 return frame;
}
const curve=(a:Point,b:Point)=>{const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,bend=Math.min(48,len*.16),nx=-dy/len*bend,ny=dx/len*bend;return `M ${a.x} ${a.y} C ${a.x+dx*.34+nx} ${a.y+dy*.34+ny}, ${a.x+dx*.72+nx} ${a.y+dy*.72+ny}, ${b.x} ${b.y}`;};
export function SpatialSettings({onClose,onReplay}:{onClose:()=>void;onReplay:()=>void}){
 const stage=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState({w:innerWidth,h:innerHeight-68});
 const [selected,setSelected]=useState<string|null>(null),[hover,setHover]=useState<string|null>(null),[failed,setFailed]=useState(false);
 const [preferences,updatePreferences]=useSolarPreferences();
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [values,setValues]=useState<Record<string,any>>(()=>{const defaults={name:'Tu',language:'Português',instruction:'',engine:'Codex',effort:'Equilibrado',search:true,files:true,memory:'Respostas claras e úteis.',computer:'Automático',notifications:true,spoken:false,voice:'Natural',dictation:true,daily:true,weekly:false,approvals:'Pedir sempre',privacy:true};try{const saved=JSON.parse(localStorage.getItem('solar.canvas.preferences.v1')||'null');return {...defaults,...Object.fromEntries(Object.entries(defaults).filter(([key,v])=>typeof saved?.[key]===typeof v).map(([key])=>[key,saved[key]]))};}catch{return defaults;}});
 const [notice,setNotice]=useState<string|null>(null),[routine,setRoutine]=useState('');
 const current=domains.find(d=>d.id===selected),motion=preferences.motion&&!reduced;
 useEffect(()=>{try{localStorage.setItem('solar.canvas.preferences.v1',JSON.stringify(values));}catch{}},[values]);
 useLayoutEffect(()=>{const el=stage.current!;const measure=()=>{const r=el.getBoundingClientRect();setSize({w:r.width,h:r.height});};measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>observer.disconnect();},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setReduced(media.matches);media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed);},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();selected?setSelected(null):onClose();}};window.addEventListener('keydown',key,true);return()=>window.removeEventListener('keydown',key,true);},[selected,onClose]);
 useEffect(()=>{setNotice(null);setRoutine('');},[selected]);
 const targets=useMemo(()=>{
   const sun={x:size.w*(selected ? .27 : .50),y:size.h*.50,alpha:1,diameter:selected?158:194};
   const graph:Record<string,Point>={sun};
   domains.forEach((d,i)=>{const angle=(-90+i*45)*Math.PI/180;graph[d.id]=selected?{x:size.w*.50,y:size.h*.50,alpha:d.id===selected?1:0}:{x:sun.x+Math.cos(angle)*Math.min(345,size.w*.28),y:sun.y+Math.sin(angle)*Math.min(240,size.h*.34),alpha:1};});
   for(let i=0;i<4;i++)graph['field'+i]={x:selected?size.w*.78:sun.x,y:selected?size.h*([.18,.39,.61,.82][i]):sun.y,alpha:current&&i<current.fields.length?1:0};
   return graph;
 },[size.w,size.h,selected]);
 const graph=useSpringGraph(targets,motion),sun=graph.sun??targets.sun;
 const diameter=sun.diameter??targets.sun.diameter!;
 const bodies=useMemo(()=>[{id:'solar-settings-sun',kind:'sun' as const,x:sun.x,y:sun.y,diameter,color:'#ffc27a',active:false,state:'ready' as const}], [sun.x,sun.y,diameter]);
 const set=(id:string,value:any)=>{
   if(['motion','debris','glow'].includes(id))updatePreferences({[id]:value});
   else if(id==='background')updatePreferences({background:({'Preto':'black','Azul profundo':'deep-blue','Grafite':'graphite'} as any)[value]});
   else setValues(v=>({...v,[id]:value}));
 };
 const value=(field:Field)=>field.id==='background'?({'black':'Preto','deep-blue':'Azul profundo','graphite':'Grafite'}[preferences.background]):['motion','debris','glow'].includes(field.id)?preferences[field.id as keyof typeof preferences]:values[field.id];
 const action=(id:string)=>{
   if(id==='backup'){const url=URL.createObjectURL(new Blob([JSON.stringify({visualPrototype:true,preferences,values},null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='Solar-preferencias-demo.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Preferências da demonstração exportadas.');}
   else if(id==='newRoutine')setRoutine('Nova rotina');
   else setNotice(({account:'As contas reais serão ligadas na aplicação. Aqui podes experimentar o modelo e a profundidade.',integrations:'As ligações reais serão configuradas na aplicação.',phone:'A ligação ao telemóvel será configurada na aplicação.',people:'Neste protótipo, só tu tens acesso.'} as any)[id]??'Opção de demonstração.');
 };
 return <section className="solar-spatial" data-solar-theme={preferences.background} data-motion={motion?'on':'off'} aria-label="Definições à volta do sol">
   <header className="solar-spatial-header"><button type="button" className="solar-spatial-home" onClick={onClose}><img src="/solar/brand/solar-app-icon.png" alt=""/>Solar</button><h1>Definições</h1><button type="button" aria-label="Voltar ao mapa" onClick={onClose}><X size={17}/><span>esc</span></button></header>
   <div className="solar-spatial-stage" ref={stage}>
     <nav className="solar-spatial-nav">{selected?<button type="button" onClick={()=>setSelected(null)}><ChevronLeft size={15}/>À volta do sol</button>:<button type="button" onClick={onClose}><ArrowLeft size={15}/>Mapa de agentes</button>}</nav>
     {!failed?<SolarWorld bodies={bodies} width={size.w} height={size.h} paused={!motion} settings={preferences} onFailure={()=>setFailed(true)}/>:<div className="solar-spatial-fallback" style={{left:sun.x,top:sun.y}}><SolarPlanet kind="sun"/></div>}
     <svg className="solar-spatial-links" width={size.w} height={size.h} aria-hidden="true">
       <defs><mask id="solar-spatial-route-mask"><rect width={size.w} height={size.h} fill="white"/><circle cx={sun.x} cy={sun.y} r={diameter*.58} fill="black"/>{domains.map(d=>{const p=graph[d.id]??targets[d.id];return p.alpha>.15?<circle key={d.id} cx={p.x} cy={p.y-23} r="16" fill="black"/>:null;})}</mask></defs>
       <g mask="url(#solar-spatial-route-mask)">
       {domains.map(d=>{const p=graph[d.id]??targets[d.id],active=d.id===selected||d.id===hover,path=curve(sun,{...p,y:p.y-23});return <g key={d.id} opacity={p.alpha}><path d={path} className={active?'is-selected':''}/>{motion&&active&&<circle r="2" fill="#eccb8c"><animateMotion dur="2.4s" repeatCount="indefinite" path={path}/></circle>}</g>;})}
       {current?.fields.map((field,i)=>{const p=graph['field'+i]??targets['field'+i],anchor=graph[current.id]??targets[current.id],end={...p,x:p.x-147,y:p.y-20};return <g key={field.id} opacity={p.alpha}><path d={curve({...anchor,y:anchor.y-23},end)} className="solar-spatial-branch"/><circle cx={end.x} cy={end.y} r="2" fill="#a69c88"/></g>;})}
       </g>
     </svg>
     <div className="solar-spatial-sun-label" style={{left:sun.x,top:sun.y+diameter/2+24}}><strong>Solar</strong>{!selected&&<span>O teu espaço, à tua maneira.</span>}</div>
     {domains.map(d=>{const p=graph[d.id]??targets[d.id],Icon=d.Icon;return <button key={d.id} type="button" className="solar-spatial-domain" aria-label={d.name} aria-pressed={selected===d.id} aria-hidden={selected&&selected!==d.id?true:undefined} tabIndex={selected&&selected!==d.id?-1:0} disabled={!!selected&&selected!==d.id} style={{left:p.x,top:p.y,opacity:p.alpha,pointerEvents:p.alpha<.1?'none':undefined}} onMouseEnter={()=>setHover(d.id)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(d.id)} onBlur={()=>setHover(null)} onClick={()=>setSelected(selected===d.id?null:d.id)}><Icon size={22} strokeWidth={1.4}/><strong>{d.name}</strong><span>{d.hint}</span></button>;})}
     {current?.fields.map((field,i)=>{const p=graph['field'+i]??targets['field'+i];return <div key={field.id} className="solar-spatial-field" style={{left:p.x,top:p.y,opacity:p.alpha}}>
       {field.kind==='text'||field.kind==='range'?<label htmlFor={'spatial-'+field.id}>{field.label}</label>:<span className="solar-spatial-caption">{field.label}</span>}
       {field.kind==='text'&&<input id={'spatial-'+field.id} aria-label={field.label} value={value(field)??''} placeholder={field.id==='instruction'?'O que os agentes devem saber…':undefined} onChange={e=>set(field.id,e.target.value)}/>}
       {field.kind==='choice'&&<div role="radiogroup" aria-label={field.label}>{field.options?.map(option=><button key={option} type="button" role="radio" aria-checked={value(field)===option} onClick={()=>set(field.id,option)}>{option}</button>)}</div>}
       {field.kind==='toggle'&&<button type="button" role="switch" aria-checked={!!value(field)} aria-label={field.label} onClick={()=>set(field.id,!value(field))}><span className="solar-spatial-toggle-dot">{value(field)&&<Check size={12}/>}</span>{value(field)?'Ligado':'Desligado'}</button>}
       {field.kind==='range'&&<div className="solar-spatial-range"><input id={'spatial-'+field.id} type="range" aria-label={field.label} min=".6" max="1.4" step=".05" value={value(field)} onChange={e=>set(field.id,Number(e.target.value))}/><output>{Number(value(field)).toFixed(2)}×</output></div>}
       {field.kind==='action'&&<button type="button" className="solar-spatial-action" onClick={()=>action(field.id)}>{field.action}<ArrowUpRight size={14}/></button>}
       {routine&&field.id==='newRoutine'&&<input aria-label="Nome da nova rotina" value={routine} onChange={e=>setRoutine(e.target.value)}/>}
     </div>;})}
     {notice&&<p className="solar-spatial-notice" role="status">{notice}</p>}
     <footer><span>{selected?'Esc volta às áreas de definições.':'Escolhe um ponto para explorar as suas definições.'}</span><button type="button" onClick={onReplay}>Rever apresentação<ArrowUpRight size={12}/></button></footer>
   </div>
 </section>;
}
