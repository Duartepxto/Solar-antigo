import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),viteRequire=createRequire(require.resolve('vite'));
const {transform}=viteRequire('esbuild');
const input=(await readFile(new URL('./demoRuntime.ts',import.meta.url),'utf8')).replace("import {reducer} from '../../src/state/store';","const reducer=(state)=>state;");
const {code}=await transform(input,{loader:'ts',format:'esm'});
const {demoReducer,demoBots}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
let state={bots:structuredClone(demoBots)};
state=demoReducer(state,{type:'demoTick',step:0});
assert.equal(state.bots.find(b=>b.id==='research').busy,true);
assert.equal(state.bots.find(b=>b.id==='design').busy,true);
assert.equal(state.bots.find(b=>b.id==='jarvis').tasks[0].busy,true);
for(let step=1;step<512;step++)state=demoReducer(state,{type:'demoTick',step});
for(const bot of state.bots){assert.ok(bot.messages.length<=48,'bounded transcript');assert.ok(bot.tasks.every(t=>Number.isFinite(t.usage.costUsd)));assert.equal(bot.messages[0].parentId,null);}
const jarvis=state.bots.find(b=>b.id==='jarvis');assert.ok(jarvis.tasks[0].usage.turns>2);assert.ok(jarvis.messages.some(m=>m.kind==='digest'&&m.digest.durationMs>0));
state=demoReducer(state,{type:'newTask',botId:'jarvis'});const next=state.bots.find(b=>b.id==='jarvis');assert.ok(next.tasks.some(t=>t.threadId===next.threadId));
state=demoReducer(state,{type:'send',botId:'jarvis',text:'Verificar a aplicação'});assert.equal(state.bots.find(b=>b.id==='jarvis').busy,true);
state=demoReducer(state,{type:'demoReply',id:'jarvis',text:'Verificação concluída'});const settled=state.bots.find(b=>b.id==='jarvis');assert.equal(settled.busy,false);assert.equal(settled.tasks.find(t=>t.threadId===settled.threadId).busy,false);assert.equal(settled.tasks.at(-1).usage.turns,1);
console.log('PASS: lifecycle, delegation hierarchy, 512 cycles, bounded history, usage, new conversations and replies.');
let scenes={bots:structuredClone(demoBots)};const seen=new Set();for(let step=0;step<16;step++){scenes=demoReducer(scenes,{type:'demoTick',step});seen.add(scenes.bots.find(b=>b.id==='research').previewState);}
for(const kind of ['thinking','working','waiting','blocked','ready','speaking','offline','sleeping'])assert.ok(seen.has(kind),kind);
let approval={bots:structuredClone(demoBots)};for(let step=0;step<=4;step++)approval=demoReducer(approval,{type:'demoTick',step});approval=demoReducer(approval,{type:'demoResolve',id:'research',outcome:'denied'});assert.equal(approval.bots.find(b=>b.id==='research').busy,false);assert.equal(approval.bots.find(b=>b.id==='research').previewDenied,true);
const particlesCode=await transform(await readFile(new URL('./MotionParticles.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});const {SolarStateParticles}=await import('data:text/javascript;base64,'+Buffer.from(particlesCode.code).toString('base64'));let paints=0;const context=new Proxy({}, {get:(_,name)=>name==='globalAlpha'?1:(...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n),String(name));paints++;},set:()=>true});const particles=new SolarStateParticles();for(const state of seen){particles.draw(context,[{id:'a',x:100,y:100,radius:45,color:'#ffc466',state,alpha:1,signalAge:2,tool:'edit_file'},{id:'b',x:320,y:150,radius:30,color:'#cdd1d6',state:'ready',alpha:1,signalAge:2}],500,300,1,.016,true,true,()=>{});}particles.emit('a','b','#ffc466');let arrivals=0;for(let i=0;i<150;i++)particles.draw(context,[{id:'a',x:100,y:100,radius:45,color:'#ffc466',state:'working',alpha:1,signalAge:2,tool:'run_tests'},{id:'b',x:320,y:150,radius:30,color:'#cdd1d6',state:'ready',alpha:1,signalAge:2}],500,300,2+i*.016,.016,true,true,()=>arrivals++);assert.equal(arrivals,1);assert.ok(paints>100);
console.log('PASS: eight visible states, refusal, finite particle geometry and one transfer arrival.');
const line=new SolarStateParticles();let points=[],peakCount=0,departure=0,spread=0;const painter=new Proxy({}, {get:(_,name)=>(...args)=>{if(name==='translate')points.push(args);},set:()=>true});const peers=[{id:'from',x:100,y:100,radius:35,color:'#ffc466',state:'ready',alpha:1,signalAge:2},{id:'to',x:450,y:100,radius:35,color:'#ffc466',state:'ready',alpha:1,signalAge:2}];line.draw(painter,peers,600,300,0,.016,true,false,()=>{});line.emit('from','to','#ffc466');for(let i=0;i<130;i++){points=[];line.draw(painter,peers,600,300,i*.016,.016,true,false,()=>{});peakCount=Math.max(peakCount,points.length);if(points.length>50){const ys=points.map(p=>p[1]);departure=Math.max(departure,Math.abs(ys.reduce((a,b)=>a+b,0)/ys.length-100));spread=Math.max(spread,Math.max(...ys)-Math.min(...ys));}}assert.ok(peakCount>=80,'dense visible transfer');assert.ok(departure<5,'straight central trajectory');assert.ok(spread>12,'individually dispersed fragments');console.log('PASS: dense straight transfer with measurable dispersion.');
