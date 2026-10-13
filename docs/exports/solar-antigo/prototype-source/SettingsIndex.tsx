import {useEffect,useRef,useState} from 'react';
import {useStore} from '../../src/state/store';
import {Search,Palette,BrainCircuit,KeyRound,MonitorSmartphone,Users,CalendarClock,HardDrive,Activity,Blocks,ArrowUpRight} from 'lucide-react';
const groups=[
 {name:'O teu Solar',items:[{key:'general',name:'Preferências gerais',detail:'Idioma, atalhos e preferências',Icon:Blocks},{key:'appearance',name:'Aspeto e movimento',detail:'Fundo, cores e animações',Icon:Palette},{key:'people',name:'Perfil e pessoas',detail:'O teu espaço e quem tem acesso',Icon:Users}]},
 {name:'IA e ferramentas',items:[{key:'engines',name:'Motores de IA',detail:'Contas e modelos dos teus agentes',Icon:BrainCircuit},{key:'connections',name:'Chaves e ligações',detail:'Serviços que os agentes podem usar',Icon:KeyRound},{key:'apps',name:'Aplicações e integrações',detail:'Ferramentas dos teus agentes',Icon:Blocks}]},
 {name:'Dispositivos e trabalho',items:[{key:'remote',name:'Computador e telemóvel',detail:'Liga os teus dispositivos',Icon:MonitorSmartphone},{key:'calendar',name:'Rotinas',detail:'Trabalho programado e calendário',Icon:CalendarClock},{key:'usage',name:'Utilização',detail:'Atividade e custos',Icon:Activity},{key:'workspaces',name:'Cópias de segurança',detail:'Guardar e recuperar o teu espaço',Icon:HardDrive}]},
];
export function SolarSettingsIndex({onOpen}:{onOpen:(key:any)=>void}){
 const {dispatch}=useStore();
 const [query,setQuery]=useState('');
 const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{const shortcut=(event:KeyboardEvent)=>{const target=event.target as HTMLElement;if(event.key==='/'&&!event.metaKey&&!event.ctrlKey&&!target.isContentEditable&&!/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)){event.preventDefault();input.current?.focus();}};window.addEventListener('keydown',shortcut);return()=>window.removeEventListener('keydown',shortcut);},[]);
 const filtered=groups.map(g=>({...g,items:g.items.filter(i=>(i.name+' '+i.detail).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()))})).filter(g=>g.items.length);
 return <div className="solar-refined-settings" data-detail>
   <label className="solar-refined-search"><Search size={16} aria-hidden/><input ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Encontrar uma definição…" aria-label="Pesquisar definições"/><kbd>/</kbd></label>
   <div className="solar-refined-groups">{filtered.map(g=><section key={g.name}><h2>{g.name}</h2>{g.items.map(({key,name,detail,Icon})=><button key={key} type="button" onClick={()=>key==='general'?dispatch({type:'toggleAppSettings',open:true,section:'general'}):onOpen(key)}><span className="solar-refined-setting-icon"><Icon size={18} strokeWidth={1.6}/></span><span><strong>{name}</strong><small>{detail}</small></span><ArrowUpRight size={15} className="solar-refined-arrow"/></button>)}</section>)}{!filtered.length&&<p className="solar-refined-empty">Não encontrámos essa definição. Experimenta outro termo.</p>}</div>
   {!query&&<button type="button" className="solar-refined-replay" onClick={()=>dispatch({type:'toggleWelcome',open:true})}>Rever a apresentação do Solar<ArrowUpRight size={14}/></button>}
 </div>;
}
