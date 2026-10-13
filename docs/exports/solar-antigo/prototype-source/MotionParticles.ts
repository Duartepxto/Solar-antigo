// Solar preview motion: scattered surface fragments, readable tool glyphs and
// one dissolving transfer plume. No competitor assets or motion code.
export interface SolarParticleBody{id:string;x:number;y:number;radius:number;color:string;colors?:string[];state:string;alpha:number;signal?:{kind:string}|null;signalAge:number;tool?:string|null}
export function particleSeed(id:string){let n=0;for(const c of id)n=(n*31+c.charCodeAt(0))|0;return Math.abs(n)%1000/1000;}
export function satelliteAngle(id:string,time:number){return time*.72+particleSeed(id)*Math.PI*2;}
const TAU=Math.PI*2;
const noise=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
interface Transfer{from:string;to:string;color:string;colors:string[];age:number;duration:number;remaining:string[];result?:boolean;seed:number}
export class SolarStateParticles{
 private bodies=new Map<string,SolarParticleBody>();private previous=new Map<string,string>();private bursts=new Map<string,number>();private comets:Transfer[]=[];private time=0;
 burstAge(id:string){return this.bursts.has(id)?this.time-this.bursts.get(id)!:Infinity;}
 emit(from:string,to:string,color:string,remaining:string[]=[],result?:boolean){const a=this.bodies.get(from),b=this.bodies.get(to);if(!a||!b)return;this.comets.push({from,to,color:a.color||color,colors:a.colors?.slice(-3)||[a.color||color],remaining,result,age:0,duration:Math.min(1.8,.7+Math.hypot(a.x-b.x,a.y-b.y)/750),seed:particleSeed(from+to)});if(this.comets.length>24)this.comets.shift();}
 draw(ctx:CanvasRenderingContext2D,bodies:SolarParticleBody[],width:number,height:number,time:number,delta:number,moving:boolean,debris:boolean,onArrival:(id:string)=>void){this.time=time;this.bodies=new Map(bodies.map(b=>[b.id,b]));for(const id of this.previous.keys())if(!this.bodies.has(id)){this.previous.delete(id);this.bursts.delete(id);}for(const b of bodies){const before=this.previous.get(b.id);if(['working','thinking','waiting'].includes(before||'')&&b.state==='ready')this.bursts.set(b.id,time);this.previous.set(b.id,b.state);if(b.alpha<.02||b.x< -b.radius*3||b.x>width+b.radius*3||b.y< -b.radius*3||b.y>height+b.radius*3)continue;ctx.save();this.body(ctx,b,time,moving,debris);ctx.restore();}this.transfers(ctx,delta,moving,onArrival);ctx.globalAlpha=1;}
 private fragment(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,angle:number,color:string,alpha:number){ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,alpha));ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.fillRect(-size/2,-size/2,size,size*.75);ctx.restore();}
 private body(ctx:CanvasRenderingContext2D,b:SolarParticleBody,t:number,moving:boolean,debris:boolean){const r=b.radius,seed=particleSeed(b.id)*47,busy=['thinking','working'].includes(b.state),muted=['offline','sleeping'].includes(b.state);const tint=b.state==='blocked'?'#ef8c86':b.state==='waiting'?'#ebbb70':b.color;
  if(debris){const count=Math.min(54,Math.max(24,Math.round(r*.6)));for(let i=0;i<count;i++){const n=seed+i*3.7,speed=.07+noise(n+4)*.12,a=noise(n)*TAU+(moving?t*speed:0),shell=1.12+noise(n+1)*.62+(busy&&moving?Math.sin(t*.8+n)*.055:0),z=Math.sin(a+n),x=b.x+Math.cos(a)*r*shell,y=b.y+Math.sin(a)*r*shell*(.65+noise(n+2)*.28);if(z<0&&Math.hypot(x-b.x,y-b.y)<r*1.02)continue;const twinkle=moving?.65+.35*Math.sin(t*1.1+n):.8;this.fragment(ctx,x,y,Math.max(1.2,r*.025)*(0.6+noise(n+3)*1.4),n+(moving?t*.12:0),b.colors?.[Math.max(0,b.colors.length-1-i%3)]||tint,b.alpha*(muted?.16:.25+(z+1)*.16)*twinkle);}}
  if(b.state==='thinking'){for(let i=0;i<15;i++){const n=seed+i*9.1,a=noise(n)*TAU+(moving?t*.32:0),distance=r*(1.3+noise(n+1)*.5);this.fragment(ctx,b.x+Math.cos(a)*distance,b.y+Math.sin(a)*distance*.82,1.5+noise(n+2)*2.2,n,b.colors?.[b.colors.length-1]||b.color,b.alpha*(.25+(moving?Math.sin(t*2+n)*.5+.5:.5)*.45));}}
  if(b.state==='working'){const a=satelliteAngle(b.id,t),x=b.x+Math.cos(a)*r*1.48,y=b.y+Math.sin(a)*r*.72;const front=Math.sin(a)>0;if(front||Math.hypot(x-b.x,y-b.y)>r*1.03)this.glyph(ctx,x,y,Math.max(17,Math.min(24,r*.3)),b.tool||'delegate_bot','#ffe1a0',b.alpha*(front?1:.45));}
  if(b.state==='waiting'||b.state==='blocked'){const waiting=b.state==='waiting',pulse=moving?.65+.35*Math.sin(t*(waiting?2:3.5)):.8;ctx.globalAlpha=b.alpha*pulse;ctx.strokeStyle=tint;ctx.lineWidth=1.25;ctx.beginPath();ctx.arc(b.x,b.y,r*1.13,-Math.PI*.85,-Math.PI*.15);ctx.stroke();this.glyph(ctx,b.x,b.y-r*1.4,21,waiting?'approval':'error',tint,b.alpha);}
  if(b.state==='offline')this.glyph(ctx,b.x+r*.85,b.y-r*.85,18,'offline','#98a6b8',b.alpha*.8);
  const age=this.burstAge(b.id);if(age<1.7){const p=age/1.7,e=1-Math.pow(1-p,3);for(let i=0;i<36;i++){const n=seed+i*4.4,a=noise(n)*TAU,distance=r*(1.1+e*(.6+noise(n+1)*1.1));this.fragment(ctx,b.x+Math.cos(a)*distance,b.y+Math.sin(a)*distance,Math.max(1.3,r*.03)*(1-p*.5),n+t*.4,b.colors?.[Math.max(0,b.colors.length-1-i%3)]||b.color,b.alpha*(1-p)*.8);}this.glyph(ctx,b.x,b.y-r*1.45,20,'done','#c4ddbc',b.alpha*(1-p));}
 }
 private glyph(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,tool:string,color:string,alpha:number){ctx.save();ctx.globalAlpha=alpha;ctx.translate(x-size/2,y-size/2);ctx.scale(size/24,size/24);ctx.strokeStyle=color;ctx.lineWidth=1.65;ctx.lineCap='round';ctx.lineJoin='round';const path=(points:number[][])=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.stroke();};const circle=(a:number,b:number,r:number)=>{ctx.beginPath();ctx.arc(a,b,r,0,TAU);ctx.stroke();};
  if(/approval/.test(tool)){path([[12,3],[20,6],[19,15],[12,21],[5,15],[4,6],[12,3]]);path([[12,8],[12,12]]);circle(12,16,.6);}
  else if(/error/.test(tool)){path([[12,3],[22,20],[2,20],[12,3]]);path([[12,9],[12,13]]);circle(12,17,.6);}
  else if(/done/.test(tool)){circle(12,12,9);path([[7,12],[10,15],[17,8]]);}
  else if(/offline/.test(tool)){path([[4,4],[20,20]]);path([[3,10],[7,7],[14,7],[21,11]]);path([[7,15],[11,13],[15,15]]);circle(12,20,.7);}
  else if(/edit|patch|code|exec|shell|git|test|development|write_file/.test(tool)){path([[8,6],[2,12],[8,18]]);path([[16,6],[22,12],[16,18]]);}
  else if(/read|file|document/.test(tool)){path([[6,2],[14,2],[20,8],[20,22],[6,22],[6,2]]);path([[14,2],[14,8],[20,8]]);path([[10,13],[16,13]]);path([[10,17],[16,17]]);}
  else if(/web|search|research|browser/.test(tool)){circle(12,12,9);ctx.beginPath();ctx.ellipse(12,12,4,9,0,0,TAU);ctx.stroke();path([[3,12],[21,12]]);}
  else if(/voice|speech|speaking/.test(tool)){ctx.beginPath();ctx.roundRect(9,2,6,12,3);ctx.stroke();path([[5,10],[5,15],[12,19],[19,15],[19,10]]);path([[12,19],[12,22]]);}
  else{circle(8,8,3);circle(18,9,2.5);path([[2,21],[2,17],[8,14],[14,17],[14,21]]);path([[16,15],[22,17],[22,21]]);}
  ctx.restore();
 }
 private transfers(ctx:CanvasRenderingContext2D,delta:number,moving:boolean,onArrival:(id:string)=>void){
  const relays:Transfer[]=[];
  this.comets=this.comets.filter(c=>{
   const a=this.bodies.get(c.from),b=this.bodies.get(c.to);if(!a||!b)return false;
   c.age+=moving?delta:c.duration+.8;
   const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy)),ux=dx/d,uy=dy/d,nx=-uy,ny=ux;
   const x0=a.x+ux*a.radius*.97,y0=a.y+uy*a.radius*.97,x1=b.x-ux*b.radius*.97,y1=b.y-uy*b.radius*.97;
   const count=Math.max(100,Math.min(160,Math.round(d*.32))),launch=.62;
   for(let i=0;i<count;i++){
    const seed=i*7.13+c.seed*113,delay=(i/count)*launch+noise(seed)*.025,flight=c.duration*(.9+noise(seed+3)*.18),u=(c.age-delay)/flight;
    if(u<0||u>1)continue;
    const spread=Math.sin(u*Math.PI)*(.35+.65*u)*(10+noise(seed+4)*23);
    const transverse=(noise(seed+1)*2-1)*spread+(moving?Math.sin(c.age*5+seed)*spread*.12:0);
    const longitudinal=(noise(seed+2)*2-1)*Math.sin(u*Math.PI)*5;
    const x=x0+(x1-x0)*u+nx*transverse+ux*longitudinal,y=y0+(y1-y0)*u+ny*transverse+uy*longitudinal;
    const fade=Math.min(1,u*12,(1-u)*10),alpha=fade*(.62+noise(seed+5)*.38)*Math.max(a.alpha,b.alpha);
    const size=1.8+noise(seed+6)*2.3,color=c.colors[i%c.colors.length]||c.color;
    if(i%4===0){ctx.save();ctx.globalAlpha=alpha*.12;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,size*1.7,0,TAU);ctx.fill();ctx.restore();}
    this.fragment(ctx,x,y,size,seed+c.age*.9,color,alpha);
   }
   if(c.age>=c.duration*1.08+launch+.03){onArrival(b.id);if(c.remaining.length)relays.push({...c,from:b.id,to:c.remaining[0],remaining:c.remaining.slice(1),age:0});return false;}
   return true;
  });
  for(const c of relays)this.emit(c.from,c.to,c.color,c.remaining,c.result);ctx.globalAlpha=1;
 }
}
