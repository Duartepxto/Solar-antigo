import {useState} from 'react';
import {Search,ChevronLeft,ChevronRight,SlidersHorizontal,Brain,Blocks,Repeat2,Mic,ShieldCheck,Monitor,Smartphone,BookOpen,Palette,BarChart3,Sparkles} from 'lucide-react';

export function SettingsContextHeader({bot,onBack}:any){return <div className="solar-settings-context"><button type="button" onClick={onBack}><ChevronLeft size={14}/>Voltar aos atalhos</button><h2>Definições de {bot.name}</h2><p>Escolhe o que queres ajustar.</p></div>;}

export const settingsGroups=[
 {id:'agent',name:'Agente',description:'Motor, skills e memória',icon:Brain,items:[
  {panel:'engine',name:'Motor e modelo',description:'Escolhe como o agente pensa',icon:Brain},
  {panel:'skills',name:'Skills',description:'Instruções e capacidades especializadas',icon:Sparkles},
  {panel:'memory',name:'Memória',description:'Contexto guardado e conhecimentos',icon:BookOpen},
 ]},
 {id:'tools',name:'Ferramentas',description:'Aplicações e dispositivos',icon:Blocks,items:[
  {panel:'apps',name:'Aplicações e MCP',description:'Ferramentas disponíveis para este agente',icon:Blocks},
  {panel:'computer',name:'Computador',description:'Ambiente de trabalho e acesso',icon:Monitor},
  {panel:'phone',name:'Telemóvel',description:'Conversa e aprovações noutro dispositivo',icon:Smartphone},
 ]},
 {id:'control',name:'Automação',description:'Rotinas, acesso e utilização',icon:Repeat2,items:[
  {panel:'routines',name:'Rotinas',description:'Trabalho que se repete',icon:Repeat2},
  {panel:'approvals',name:'Permissões e aprovações',description:'O que pode fazer e quando precisa de ti',icon:ShieldCheck},
  {panel:'work',name:'Utilização da equipa',description:'Atividade, tokens e custos',icon:BarChart3},
 ]},
 {id:'preferences',name:'Preferências',description:'Aspeto, voz e movimento',icon:SlidersHorizontal,items:[
  {panel:'appearance',name:'Aspeto e movimento',description:'Nome, skin, fundo e animações',icon:Palette},
  {panel:'voice',name:'Voz',description:'Voz do agente e leitura das respostas',icon:Mic},
 ]},
];
export function SettingsDirectory({group,open,bot}:any){
 const [query,setQuery]=useState('');
 const active=settingsGroups.find(g=>g.id===group)||settingsGroups[0];
 const groups=query.trim()?settingsGroups:[active];
 const matches=groups.map(g=>({...g,items:g.items.filter(item=>(item.name+' '+item.description).toLocaleLowerCase('pt-PT').includes(query.trim().toLocaleLowerCase('pt-PT')))})).filter(g=>g.items.length);
 return <div className="solar-settings-directory">
  <header><h2>Definições de {bot.name}</h2><p>O essencial, organizado por função.</p></header>
  <label className="solar-settings-search"><Search size={15}/><input aria-label="Pesquisar definições" placeholder="Pesquisar definições…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" onClick={()=>setQuery('')}>Limpar</button>}</label>
  <nav aria-label="Grupos de definições" className="solar-settings-tabs">{settingsGroups.map(g=><button key={g.id} type="button" aria-pressed={active.id===g.id&&!query} onClick={()=>{setQuery('');open('settings-'+g.id);}}>{g.name}</button>)}</nav>
  <div className="solar-settings-rows">{matches.length?matches.map(g=><section key={g.id}>{query&&<h3>{g.name}</h3>}{g.items.map(item=>{const Icon=item.icon;return <button type="button" key={item.panel} onClick={()=>open(item.panel)}><Icon size={18} strokeWidth={1.5}/><span><strong>{item.name}</strong><small>{item.description}</small></span><ChevronRight size={15}/></button>;})}</section>):<p className="solar-settings-empty">Sem resultados. Tenta procurar «voz», «motor» ou «memória».</p>}</div>
 </div>;
}
