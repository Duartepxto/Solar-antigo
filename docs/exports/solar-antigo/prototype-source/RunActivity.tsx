import {useState} from 'react';
import {ChevronDown,Check,Loader2,AlertCircle,X,BookmarkPlus} from 'lucide-react';
import {type RunStep} from '../../src/lib/verify-steps';

export function RunActivity({steps,canSave,staged,onDismiss,onSave}:{steps:RunStep[];canSave:boolean;staged:boolean;onDismiss:()=>void;onSave:()=>void}){
 const [expanded,setExpanded]=useState(false);
 if(!steps.length)return null;
 const running=steps.filter(s=>s.status==='running').length,failed=steps.filter(s=>s.status==='failed').length;
 const latest=steps.at(-1)!;
 return <section className="solar-run-activity" aria-label="Atividade da conversa">
  <div className="solar-run-summary"><button type="button" className="solar-run-toggle" aria-expanded={expanded} aria-label={expanded?'Recolher atividade':'Ver detalhes da atividade'} onClick={()=>setExpanded(v=>!v)}>
   {running?<Loader2 size={14} className="solar-run-spinner"/>:failed?<AlertCircle size={14}/>:<Check size={14}/>}
   <span>Atividade <small>· {steps.length} {steps.length===1?'passo':'passos'}</small></span>{failed>0&&<span className="solar-run-errors">{failed} com erro</span>}<ChevronDown size={13} className={expanded?'is-expanded':''}/>
  </button><button className="solar-run-dismiss" type="button" aria-label="Dispensar atividade" onClick={onDismiss}><X size={13}/></button></div>
  {!expanded&&running>0&&<p className="solar-run-latest" title={latest.command}>{latest.command||latest.label}</p>}
  {expanded&&<div className="solar-run-details"><ol tabIndex={0} aria-label="Passos da atividade">{steps.map(step=><li key={step.id} data-status={step.status}>{step.status==='running'?<Loader2 size={13} className="solar-run-spinner"/>:step.status==='failed'?<AlertCircle size={13}/>:<Check size={13}/>}<span>{step.command||step.label}</span><small>{step.status==='running'?'Em curso':step.status==='failed'?'Com erro':'Concluído'}</small></li>)}</ol>{staged?<p>A skill está pronta para revisão.</p>:canSave&&<button type="button" className="solar-run-save" onClick={onSave}><BookmarkPlus size={13}/>Preparar uma skill com estes passos</button>}</div>}
 </section>;
}
