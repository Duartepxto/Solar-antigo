import {drawChar,newCharState,hexRgb,type CharState,type Mood} from './characters';

export interface SolarParticleBody {id:string;x:number;y:number;radius:number;color:string;colors?:string[];state:string;alpha:number;signal?:{kind:string};signalAge:number}
interface Part {x:number;y:number;px:number;py:number;vx:number;vy:number;in:boolean;w:number;color:string}
interface Stream {from:string;to:string;color:string;parts:Part[];age:number;fired:boolean;remaining:string[];result?:boolean}
/** Actual Orbit character particle passes and stream physics/rendering.
 * Solar-specific: retain the solid body/face, attach streams to aura edges,
 * and keep moon exchanges on their parent route. */
export class SolarOrbitParticles {
  private chars=new Map<string,CharState>();
  private bodies=new Map<string,SolarParticleBody>();
  private streams:Stream[]=[];
  private time=0;
  emit(from:string,to:string,color:string,remaining:string[]=[],result?:boolean) {
    const A=this.bodies.get(from),B=this.bodies.get(to);if(!A||!B)return;
    const heading=Math.atan2(B.y-A.y,B.x-A.x);
    const parts=Array.from({length:48},(_,i)=>{
      const a=heading+(Math.random()-.5)*1.8,sp=2.5+Math.random()*3;
      const launch=heading+(i/47-.5)*2.3,x=A.x+Math.cos(launch)*A.radius*1.16,y=A.y+Math.sin(launch)*A.radius*1.16;
      return {x,y,px:x,py:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,in:false,color:(A.colors?.length?A.colors:[color])[i%(A.colors?.length||1)],w:.85+Math.random()*.4};
    });
    this.streams.push({from,to,color,parts,age:0,fired:false,remaining,result});
    if(this.streams.length>24)this.streams.shift();
    const c=this.chars.get(from);if(c)c.kick=this.time;
  }
  draw(ctx:CanvasRenderingContext2D,bodies:SolarParticleBody[],width:number,height:number,time:number,delta:number,moving:boolean,debris:boolean,onArrival:(id:string)=>void) {
    this.time=time;this.bodies=new Map(bodies.map(b=>[b.id,b]));
    for(const id of this.chars.keys())if(!this.bodies.has(id))this.chars.delete(id);
    for(const b of bodies){
      let c=this.chars.get(b.id);if(!c){c=newCharState(hexRgb(b.color),this.chars.size,time);this.chars.set(b.id,c);}
      if(b.signal?.kind==='receiving'&&b.signalAge<.8)c.flash=time-b.signalAge;
      // Own states: the aura gathers and breathes, without Orbit's letters/bands.
      const mood:Mood='idle';
      c.rgb=hexRgb(b.color);
      const activity=b.state==='working'?1.7:b.state==='thinking'?.9:.55;
      const breath=moving?1+.08*Math.sin(time*activity*2+ c.seed):1;
      const feedback=b.signalAge<.8?.18*(1-b.signalAge/.8):0;
      // State marks live above the shell, independent of the aura preference.
      ctx.save();ctx.globalAlpha=b.alpha;ctx.fillStyle=b.color;ctx.strokeStyle=b.color;
      if(b.state==='sleeping') {
        ctx.textAlign='center';
        for(let i=0;i<3;i++){const u=moving?(time*.28+i/3)%1:(i+1)/4;ctx.globalAlpha=b.alpha*(.9-u*.6);ctx.font='600 '+Math.max(9,b.radius*(.18+u*.09))+'px Inter, sans-serif';ctx.fillText('z',b.x+b.radius*(.55+u*.4),b.y-b.radius*(.55+u*.7));}
      } else if(b.state==='thinking') {
        for(let i=0;i<3;i++){const pulse=moving?.55+.45*Math.sin(time*3-i*1.1):.75;ctx.globalAlpha=b.alpha*(.45+.4*pulse);const r=Math.max(2,b.radius*.045);ctx.fillRect(b.x+b.radius*(.5+i*.18)-r,b.y-b.radius*(1.03+i*.09)-r,r*2,r*2);}
      } else if(b.state==='waiting'||b.state==='blocked') {
        ctx.globalAlpha=b.alpha*(moving?.7+.2*Math.sin(time*2):.8);ctx.font='600 '+Math.max(12,b.radius*.3)+'px Inter, sans-serif';ctx.textAlign='center';ctx.fillText(b.state==='waiting'?'?':'!',b.x+b.radius*.85,b.y-b.radius*.7);
      }
      ctx.restore();
      if(!debris)continue;
      ctx.save();ctx.beginPath();ctx.rect(0,0,width,height);ctx.arc(b.x,b.y,b.radius*.98,0,Math.PI*2,true);ctx.clip('evenodd');
      drawChar(ctx,c,mood,b.x,b.y,b.radius*1.15,b.alpha*(breath+feedback),time,delta,{particlesOnly:true,auraOnly:true,particleOpacity:.36,noRing:true,reduced:!moving,camScale:1});
      ctx.restore();
    }
    const relays:Array<{from:string;to:string;color:string;remaining:string[];result?:boolean}>=[];
    this.streams=this.streams.filter(stream=>{
      const A=this.bodies.get(stream.from),T=this.bodies.get(stream.to);if(!A||!T)return false;
      if(moving)stream.age+=delta;
      const kk=Math.min(1,stream.age*1.8);
      // Original velocity integrator, in bounded 60Hz substeps for consistent
      // behaviour on slower frames. Trails and square heads are copied below.
      const steps=moving?Math.max(1,Math.ceil(delta*60)):0,dt=steps?delta*60/steps:0;
      for(let step=0;step<steps;step++)for(const p of stream.parts){
        if(p.in)continue;
        const heading=Math.atan2(p.y-T.y,p.x-T.x),tx=T.x+Math.cos(heading)*T.radius*1.16,ty=T.y+Math.sin(heading)*T.radius*1.16;
        const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy)||1;
        p.vx=(p.vx+dx/d*1.15*kk*p.w*dt)*Math.pow(.9,dt);p.vy=(p.vy+dy/d*1.15*kk*p.w*dt)*Math.pow(.9,dt);
        p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;
        if(d<12)p.in=true;
      }
      if(!stream.fired&&(stream.parts.filter(p=>p.in).length>=stream.parts.length*.55||stream.age>3.2)){
        stream.fired=true;onArrival(T.id);const c=this.chars.get(T.id);if(c)c.flash=time;
        if(stream.remaining.length)relays.push({from:T.id,to:stream.remaining[0],remaining:stream.remaining.slice(1),color:stream.color,result:stream.result});
      }
      const alpha=Math.max(A.alpha,T.alpha);ctx.lineWidth=1.6;
      for(const color of new Set(stream.parts.map(p=>p.color))){
        ctx.strokeStyle=color;ctx.fillStyle=color;ctx.globalAlpha=.85*alpha;ctx.beginPath();
        for(const p of stream.parts)if(!p.in&&p.color===color){ctx.moveTo(p.px-p.vx*2,p.py-p.vy*2);ctx.lineTo(p.x,p.y);}
        ctx.stroke();ctx.globalAlpha=alpha;ctx.beginPath();
        for(const p of stream.parts)if(!p.in&&p.color===color)ctx.rect(p.x-1.6,p.y-1.6,3.2,3.2);
        ctx.fill();
      }
      ctx.globalAlpha=1;
      return !stream.parts.every(p=>p.in)&&stream.age<=4.5;
    });
    for(const relay of relays)this.emit(relay.from,relay.to,relay.color,relay.remaining,relay.result);
  }
}
