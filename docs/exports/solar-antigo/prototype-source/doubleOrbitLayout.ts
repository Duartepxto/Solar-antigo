const primaryOrder=['development','engine','voice','memory','usage','workspace'];
export function doubleOrbitLayout(systems:{key:string}[],width:number,height:number){
 const cx=Math.max(160,width/2),cy=height/2+14;
 const preferred=primaryOrder.map(key=>systems.find(s=>s.key===key)).filter(Boolean) as {key:string}[];
 const primary=new Set(preferred.slice(0,5).map(s=>s.key));
 const inner=systems.filter(s=>primary.has(s.key)),outer=systems.filter(s=>!primary.has(s.key));
 const outerX=Math.max(160,Math.min(278,width/2-80)),outerY=Math.max(211,Math.min(300,height/2-106));
 const innerX=Math.max(151,outerX*.71),innerY=Math.max(191,outerY*.72);
 const points=[...inner.map((s,i)=>({key:s.key,ring:0,angle:-102+i*360/inner.length})),...outer.map((s,i)=>({key:s.key,ring:1,angle:-132+i*360/Math.max(1,outer.length)}))].map((p,i)=>{const a=p.angle*Math.PI/180,vary=[.94,1.04,1,.91,1.06][i%5];return {...p,x:Math.max(76,Math.min(width-76,cx+Math.cos(a)*(p.ring?outerX:innerX)*vary)),y:Math.max(82,Math.min(height-98,cy+Math.sin(a)*(p.ring?outerY:innerY)*vary))};});
 return {cx,cy,innerX,innerY,outerX,outerY,points};
}
