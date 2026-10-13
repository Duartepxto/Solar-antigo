export type ExecutionStep={id:string;text:string;tool:string;status:'passed'|'running'|'failed'|'recovered';at:number;output?:string};
export function executionModel(messages:any[],busy:boolean,phase?:string){
 // A completed digest closes a turn; later activity starts the next one.
 const digest=messages.findLastIndex(m=>m.kind==='digest');
 const laterWork=digest>=0&&messages.slice(digest+1).some(m=>m.kind==='activity'||m.role==='user');
 let start=laterWork?digest+1:0;
 if(!laterWork&&digest>=0){const previous=messages.slice(0,digest).findLastIndex(m=>m.kind==='digest');start=previous+1;}
 const user=messages.slice(start).findLastIndex(m=>m.role==='user');if(user>=0)start+=user;
 const turn=messages.slice(start),activities=turn.filter(m=>m.kind==='activity'&&m.tool);
 const complete=turn.some(m=>m.kind==='digest'),latest=activities.at(-1);
 const steps:ExecutionStep[]=activities.map((m,i)=>{const subsequent=activities.slice(i+1),recovered=m.tool.ok===false&&subsequent.some(v=>v.tool.ok===true);const active=m===latest&&busy&&!complete&&m.tool.ok===undefined&&!['waiting','blocked','offline','sleeping'].includes(phase||'');return {id:m.id,text:m.tool.summary||m.tool.name||'Ferramenta',tool:m.tool.name||'',status:m.tool.ok===false?(recovered?'recovered':'failed'):active?'running':'passed',at:m.at,output:m.tool.output};});
 const failed=steps.filter(s=>s.status==='failed').length,recovered=steps.filter(s=>s.status==='recovered').length,running=steps.some(s=>s.status==='running');
 const state=phase==='blocked'||(complete&&failed>0)?'failed':phase==='waiting'?'waiting':phase==='offline'?'offline':complete?'complete':running?'running':busy?'thinking':'complete';
 const labels={failed:complete?'Terminou com falhas':'Falha na ferramenta',waiting:'Aguarda autorização',offline:'Ligação indisponível',complete:recovered?'Concluído após recuperação':'Concluído',running:'A trabalhar',thinking:'A pensar'};
 return {steps,latest:steps.at(-1),failed,recovered,running,state,label:labels[state]};
}
