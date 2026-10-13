/** Same physical wavelength on every route, with straight, calm endpoints. */
export function menuWave(u:number,length:number,seconds:number){
 const t=Math.max(0,Math.min(1,u)),span=Math.max(1,length);
 const ease=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x);};
 const envelope=ease(t*span/24)*ease((1-t)*span/24);
 return Math.sin(t*span/104*Math.PI*2-seconds*.22)*Math.min(10.5,span*.1)*envelope;
}
