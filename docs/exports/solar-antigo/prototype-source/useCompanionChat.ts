import {useEffect,useRef,useState} from 'react';
import type {CompanionPhase} from './companionModel';
export type CompanionLine={id:string;role:'user'|'bot';text:string;at:number;exampleMetrics?:boolean};
type Request={agent:string;text:string;generation:number};
/** Local preview only. Queued requests survive an offline scene and view changes. */
export function useCompanionChat(phase:CompanionPhase,choose:(phase:CompanionPhase)=>void){
 const [messages,setMessages]=useState<Record<string,CompanionLine[]>>({}),[pending,setPending]=useState<Record<string,number>>({});
 const generations=useRef<Record<string,number>>({}),outbox=useRef<Request[]>([]),timers=useRef<ReturnType<typeof setTimeout>[]>([]),latest=useRef({phase,choose});latest.current={phase,choose};
 const append=(agent:string,line:CompanionLine)=>setMessages(a=>({...a,[agent]:[...(a[agent]||[]),line].slice(-32)}));
 const respond=(request:Request)=>{timers.current.push(setTimeout(()=>{if((generations.current[request.agent]||0)!==request.generation)return;if(latest.current.phase==='offline'){outbox.current.push(request);return;}append(request.agent,{id:crypto.randomUUID(),role:'bot',text:'Recebi a tarefa. Vou preparar o trabalho com a equipa e mostrar-te os resultados aqui. Este fluxo é uma simulação local.',at:Date.now(),exampleMetrics:true});setPending(a=>({...a,[request.agent]:Math.max(0,(a[request.agent]||0)-1)}));latest.current.choose('complete');},2800));};
 useEffect(()=>{if(phase==='offline'||!outbox.current.length)return;const requests=outbox.current.splice(0);requests.forEach(respond);},[phase]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const send=(agent:string,text:string)=>{if(!text.trim())return;append(agent,{id:crypto.randomUUID(),role:'user',text:text.trim(),at:Date.now()});setPending(a=>({...a,[agent]:(a[agent]||0)+1}));const request={agent,text,generation:generations.current[agent]||0};if(latest.current.phase==='offline')outbox.current.push(request);else{latest.current.choose('thinking');respond(request);}};
 const stop=(agent:string)=>{generations.current[agent]=(generations.current[agent]||0)+1;outbox.current=outbox.current.filter(r=>r.agent!==agent);setPending(a=>({...a,[agent]:0}));append(agent,{id:crypto.randomUUID(),role:'bot',text:'Interrompeste a preparação. A tua mensagem continua visível nesta conversa.',at:Date.now()});latest.current.choose('ready');};
 return {messages,pending,send,stop};
}
