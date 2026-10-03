// World-space endpoints stay on each body's aura as the camera or body moves.
export function solarTransferPoint(from,to,index,progress) {
  const heading=Math.atan2(to.y-from.y,to.x-from.x);
  const seed=Math.sin(index*12.9898+78.233)*43758.5453;
  const variation=seed-Math.floor(seed);
  const p=Math.max(0,Math.min(1,(progress-variation*.13)/(.79+variation*.06)));
  const u=p*p*(3-2*p);
  const launch=heading+(variation-.5)*2.5+(1-u)*.12;
  const arrival=heading+Math.PI+(Math.sin(index*2.39996))*.95-u*.12;
  const ax=from.x+Math.cos(launch)*from.radius*1.17,ay=from.y+Math.sin(launch)*from.radius*1.17;
  const bx=to.x+Math.cos(arrival)*to.radius*1.17,by=to.y+Math.sin(arrival)*to.radius*1.17;
  // A shared flow direction, with separate endpoints and timing. The middle
  // settles into a narrow stream rather than fluttering like loose balls.
  const distance=Math.hypot(to.x-from.x,to.y-from.y),lane=(variation-.5)*7;
  const c1x=from.x+Math.cos(heading)*distance*.32-Math.sin(heading)*lane,c1y=from.y+Math.sin(heading)*distance*.32+Math.cos(heading)*lane;
  const c2x=to.x-Math.cos(heading)*distance*.32-Math.sin(heading)*lane,c2y=to.y-Math.sin(heading)*distance*.32+Math.cos(heading)*lane;
  const v=1-u,x=v*v*v*ax+3*v*v*u*c1x+3*v*u*u*c2x+u*u*u*bx,y=v*v*v*ay+3*v*v*u*c1y+3*v*u*u*c2y+u*u*u*by;
  const dx=3*v*v*(c1x-ax)+6*v*u*(c2x-c1x)+3*u*u*(bx-c2x),dy=3*v*v*(c1y-ay)+6*v*u*(c2y-c1y)+3*u*u*(by-c2y);
  return {x,y,p,angle:Math.atan2(dy,dx)};
}

export function solarTransferRoute(from,to,nodes) {
  const route=[from.id];
  if(from.kind==='moon'&&from.parentId!==to.id){if(!nodes.some(n=>n.id===from.parentId))return [];route.push(from.parentId);}
  if(to.kind==='moon'&&to.parentId!==route[route.length-1]){if(!nodes.some(n=>n.id===to.parentId))return [];route.push(to.parentId);}
  route.push(to.id);
  return route.filter((id,i)=>i===0||id!==route[i-1]);
}
