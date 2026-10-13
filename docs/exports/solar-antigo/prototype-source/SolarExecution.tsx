import {useState} from 'react';
import {Check,ChevronDown,ChevronUp,X,Loader2,TriangleAlert,RotateCcw,ShieldCheck,BookmarkPlus} from 'lucide-react';
import {executionModel} from './executionModel';
export function SolarExecution({bot,onDismiss,onSave,canSave,staged}:any){
 const [expanded,setExpanded]=useState(false);const model=executionModel(bot.messages,bot.busy,bot.previewState);
 if(!model.steps.length)return null;
 const Icon=model.state==='failed'?TriangleAlert:model.state==='waiting'?ShieldCheck:model.state==='complete'?Check:Loader2;
 return <section className="solar-execution" aria-label="Execução atual" data-state={model.state}>
  <header><span className="solar-execution-status"><Icon size={15} aria-hidden="true" className={['running','thinking'].includes(model.state)?'solar-execution-spin':''}/><span>{model.label}</span></span><span className="solar-execution-count">{model.steps.length} {model.steps.length===1?'passo':'passos'}</span><button type="button" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded} aria-label={expanded?'Recolher passos da execução':'Ver passos da execução'}>{expanded?<ChevronDown size={15}/>:<ChevronUp size={15}/>}</button><button type="button" onClick={onDismiss} aria-label="Dispensar execução"><X size={14}/></button></header>
  {!expanded&&model.latest&&<p className="solar-execution-current" title={model.latest.text}>{model.latest.text}</p>}
  {expanded&&<ol aria-label="Passos da execução" tabIndex={0}>{model.steps.map(step=><li key={step.id} data-state={step.status}>{step.status==='running'?<Loader2 size={13} className="solar-execution-spin"/>:step.status==='failed'?<TriangleAlert size={13}/>:step.status==='recovered'?<RotateCcw size={13}/>:<Check size={13}/>}<div><span>{step.text}</span>{step.status==='recovered'&&<small>Falha recuperada</small>}{step.status==='failed'&&step.output&&<small>{step.output}</small>}</div></li>)}</ol>}
  {expanded&&model.recovered>0&&<p className="solar-execution-foot">{model.recovered} {model.recovered===1?'falha recuperada':'falhas recuperadas'} · histórico preservado</p>}
  {expanded&&staged&&<p className="solar-execution-foot">Habilidade pronta para revisão.</p>}
  {expanded&&canSave&&!model.running&&!model.failed&&!staged&&<button className="solar-execution-save" type="button" onClick={onSave}><BookmarkPlus size={13}/>Guardar como habilidade</button>}
 </section>;
}
