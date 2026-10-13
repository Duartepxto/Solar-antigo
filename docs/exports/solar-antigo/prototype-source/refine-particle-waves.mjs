import{readFileSync,writeFileSync}from'node:fs';
const file='.orbit-scratch/design-export/DoubleOrbit.tsx';let source=readFileSync(file,'utf8');
const changes=[
['const count=Math.max(9,Math.round((d-100)/8));','const count=Math.max(32,Math.min(90,Math.round((d-100)/2.5)));'],
['const phase=moving&&s.live?(now*.00008)%1:0,','const phase=moving?(now*.00008)%1:0,'],
['wave=Math.sin(u*Math.PI*2+p.angle)*Math.sin(u*Math.PI)*4.8;','wave=Math.sin(u*Math.PI*3.4+p.angle*Math.PI/180-(moving?now*.00045:0))*Math.sin(u*Math.PI)*(18+Math.min(9,d/35));'],
['const scatter=Math.sin(i*19.3+p.angle)*1.3;','const scatter=Math.sin(i*19.3+p.angle)*2.4;'],
['ctx.globalAlpha=(s.selected ? .7 : s.live ? .46 : .13)+Math.sin(i*2.7+(moving?now*.0008:0))*(s.live ? .12 : .03);','ctx.globalAlpha=((s.selected ? .9 : s.live ? .72 : .38)+Math.sin(i*2.7+(moving?now*.0008:0))*.065)*Math.min(1,u*12,(1-u)*12);'],
["const size=i%4===0?1.9:1.2;ctx.fillRect(x-size/2,y-size/2,size,size*.8);","const size=i%4===0?2.8:1.9;ctx.fillRect(x-size/2,y-size/2,size,size*.8);if(i%3===0){ctx.globalAlpha*=.55;ctx.fillRect(x+nx*4.2-size*.3,y+ny*4.2-size*.3,size*.65,size*.5);}"]
];for(const [before,after] of changes){if(!source.includes(before))throw Error('Missing particle edit: '+before);source=source.replace(before,after);}writeFileSync(file,source);console.log('Updated density, visibility and animated wave shape.');
