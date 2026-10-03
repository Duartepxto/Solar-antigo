import {describe,it,expect,vi} from 'vitest';
import {SolarOrbitParticles,type SolarParticleBody} from './SolarOrbitParticles';

const bodies:SolarParticleBody[]=[{id:'moon',x:80,y:150,radius:30,color:'#fcfcfc',state:'ready',alpha:1,signalAge:10},{id:'planet',x:330,y:150,radius:40,color:'#ffb454',state:'ready',alpha:1,signalAge:10},{id:'jarvis',x:610,y:150,radius:45,color:'#ffb454',state:'ready',alpha:1,signalAge:10}];
const context=()=>({beginPath:vi.fn(),moveTo:vi.fn(),lineTo:vi.fn(),stroke:vi.fn(),rect:vi.fn(),fill:vi.fn()}) as unknown as CanvasRenderingContext2D;
describe('original Orbit streams in solar scene',()=>{
  it('sends 48 squares using the sender palette, including results',()=>{
    const effect=new SolarOrbitParticles(),ctx=context(),arrive=vi.fn();
    const coloured=bodies.map(b=>({...b,colors:b.id==='moon'?['#b0d0ee','#e3efff']:['#ffb454']}));
    const fills:string[]=[];Object.defineProperty(ctx,'fillStyle',{set:value=>fills.push(value)});
    effect.draw(ctx,coloured,800,400,0,0,true,false,arrive);effect.emit('moon','planet','#38d591',[],true);
    effect.draw(ctx,coloured,800,400,0,0,false,false,arrive);
    expect(fills).toEqual(['#b0d0ee','#e3efff']);
    expect((ctx.rect as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(48);
  });
  it('arrives at the recipient and removes completed particles',()=>{
    const effect=new SolarOrbitParticles(),ctx=context(),arrive=vi.fn();
    effect.draw(ctx,bodies,800,400,0,0,true,false,arrive);effect.emit('moon','planet','#fff');
    for(let i=1;i<300;i++)effect.draw(ctx,bodies,800,400,i/60,1/60,true,false,arrive);
    expect(arrive.mock.calls).toEqual([['planet']]);
  });
  it('does not advance or deliver while paused',()=>{
    const effect=new SolarOrbitParticles(),ctx=context(),arrive=vi.fn();
    effect.draw(ctx,bodies,800,400,0,0,true,false,arrive);effect.emit('moon','planet','#fff');
    for(let i=0;i<120;i++)effect.draw(ctx,bodies,800,400,0,1/60,false,false,arrive);
    expect(arrive).not.toHaveBeenCalled();
    const heads=(ctx.rect as ReturnType<typeof vi.fn>).mock.calls;
    expect(heads[0].slice(0,2)).toEqual(heads[48].slice(0,2));
  });
  it('finishes the moon-parent leg before relaying to Jarvis',()=>{
    const effect=new SolarOrbitParticles(),ctx=context(),arrive=vi.fn();
    effect.draw(ctx,bodies,800,400,0,0,true,false,arrive);effect.emit('moon','planet','#fff',['jarvis']);
    for(let i=1;i<600;i++)effect.draw(ctx,bodies,800,400,i/60,1/60,true,false,arrive);
    expect(arrive.mock.calls).toEqual([['planet'],['jarvis']]);
  });
});
