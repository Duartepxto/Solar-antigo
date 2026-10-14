export type AgendaEvent={id:string;date:string;time:string;duration:number;name:string;agentId:string;repeat:'none'|'daily'|'weekly';kind?:'event'|'task';projectId?:string;completedDates?:string[];notes?:string};
export type AgendaProject={id:string;name:string;color:string};
export function localDay(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function shiftDay(day:string,n:number){const d=new Date(day+'T12:00');d.setDate(d.getDate()+n);return localDay(d);}
export function monthCells(day:string){const d=new Date(day+'T12:00');d.setDate(1);const start=shiftDay(localDay(d),-((d.getDay()+6)%7));return Array.from({length:42},(_,i)=>shiftDay(start,i));}
export function occurs(event:AgendaEvent,day:string){if(day<event.date)return false;if(event.repeat==='daily')return true;if(event.repeat==='weekly')return new Date(day+'T12:00').getDay()===new Date(event.date+'T12:00').getDay();return event.date===day;}
export function agendaStatus(event:AgendaEvent,day:string,now=new Date()){const start=new Date(day+'T'+event.time),end=new Date(start.getTime()+event.duration*60000);return now<start?'scheduled':now>=end?'past':'current';}
export function weekDays(day:string){const d=new Date(day+'T12:00'),start=shiftDay(day,-((d.getDay()+6)%7));return Array.from({length:7},(_,i)=>shiftDay(start,i));}
export function timeMinutes(time:string){const [h,m]=time.split(':').map(Number);return h*60+m;}
export function packEvents(events:AgendaEvent[]){
 const sorted=[...events].sort((a,b)=>timeMinutes(a.time)-timeMinutes(b.time)||b.duration-a.duration);
 const result:{event:AgendaEvent;lane:number;lanes:number}[]=[];
 let cluster:typeof result=[],ends:number[]=[],clusterEnd=-1;
 const flush=()=>{for(const row of cluster)row.lanes=ends.length;result.push(...cluster);cluster=[];ends=[];};
 for(const event of sorted){const start=timeMinutes(event.time),end=start+event.duration;if(start>=clusterEnd&&cluster.length)flush();let lane=ends.findIndex(t=>t<=start);if(lane<0)lane=ends.length;ends[lane]=end;cluster.push({event,lane,lanes:1});clusterEnd=Math.max(clusterEnd,end);}flush();return result;
}
export function seedAgenda():AgendaEvent[]{const day=localDay();return [{id:'morning',date:day,time:'09:00',duration:30,name:'Resumo do dia',agentId:'jarvis',repeat:'daily'},{id:'review',date:day,time:'11:30',duration:60,name:'Revisão da interface',agentId:'design',repeat:'none'},{id:'testing',date:shiftDay(day,1),time:'15:00',duration:45,name:'Testes da aplicação',agentId:'qa',repeat:'none'}];}
