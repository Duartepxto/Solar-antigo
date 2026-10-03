import {useEffect,useRef,useState} from 'react';
import type {SolarNode} from './solar-model';
import type {SolarSignal,SolarState} from './solar-state';
export interface SolarPreviewState {state:SolarState;signal?:SolarSignal;activity?:'code'|'research'|'document'|'notion'|'task'}
/** Explicit visual rehearsal, available only in the isolated preview; never changes bot data. */
export function useSolarAnimationPreview(nodes:SolarNode[]) {
  const [states,setStates]=useState<Record<string,SolarPreviewState>>({}),latest=useRef(nodes);latest.current=nodes;
  const [playing,setPlaying]=useState(false),[paused,setPaused]=useState(false),[phase,setPhase]=useState('thinking');
  useEffect(()=>{window.dispatchEvent(new CustomEvent('jarvis-solar-preview-state',{detail:states}));},[states]);
  const pausedRef=useRef(false),stepRef=useRef(0);
  const available=nodes.some(node=>node.kind==='planet');
  useEffect(()=>{
    if(import.meta.env.VITE_JARVIS_PREVIEW!=='true')return;
    let timer:ReturnType<typeof setInterval>|undefined;
    const stop=()=>{clearInterval(timer);setStates({});setPlaying(false);setPaused(false);pausedRef.current=false;};
    const togglePause=()=>{pausedRef.current=!pausedRef.current;setPaused(pausedRef.current);};
    const play=()=>{
      clearInterval(timer);const sun=latest.current[0];let earth=latest.current.find(n=>n.skin==='earth')??latest.current.find(n=>n.kind==='planet');if(!sun||!earth)return;
      let sender=sun;
      setPlaying(true);setPaused(false);pausedRef.current=false;stepRef.current=0;
      const run=()=>{if(pausedRef.current||document.hidden)return;const at=Date.now(),cycle=Math.floor(stepRef.current/11),step=stepRef.current++%11;
        const targets=[...latest.current.filter(n=>n.skin==='earth'),...latest.current.filter(n=>n.kind!=='sun'&&n.skin!=='earth')];
        if(step===0){const target=targets[cycle%targets.length]??earth;if(!target)return;earth=target;const superior=latest.current.find(n=>n.id===target.parentId);if(target.kind==='moon'&&!superior)return;sender=target.kind==='moon'?superior!:sun;}
        if(!earth)return;
        const activity=(['code','research','document','task','notion'] as const)[cycle%5];
        setPhase(['thinking','working','sending','receiving','waiting','blocked','settled','sleeping','offline','idle','idle'][step]);
        switch(step){
          case 0:setStates({[sender.id]:{state:'thinking'}});break;
          case 1:setStates({[sender.id]:{state:'working',activity}});break;
          case 2:setStates({[sender.id]:{state:'working',signal:{kind:'sending',at}},[earth.id]:{state:'thinking'}});window.dispatchEvent(new CustomEvent('jarvis-solar-transfer',{detail:{from:sender.id,to:earth.id,at}}));break;
          case 3:setStates({[earth.id]:{state:'working',activity}});break;
          case 4:setStates({[earth.id]:{state:'waiting'}});break;
          case 5:setStates({[earth.id]:{state:'blocked'}});break;
          case 6:setStates({[earth.id]:{state:'ready',signal:{kind:'settled',at}}});window.dispatchEvent(new CustomEvent('jarvis-solar-transfer',{detail:{from:earth.id,to:sender.id,at,result:true}}));break;
          case 7:setStates({[earth.id]:{state:'sleeping'}});break;
          case 8:setStates({[earth.id]:{state:'offline'}});break;
          default:setStates({[sender.id]:{state:'ready'},[earth.id]:{state:'ready'}});break;
        }
      };run();timer=setInterval(run,2400);
    };
    window.addEventListener('jarvis-solar-preview-animation',play);
    window.addEventListener('jarvis-solar-stop-preview',stop);
    window.addEventListener('jarvis-solar-pause-preview',togglePause);
    if(available)play();
    return()=>{clearInterval(timer);window.removeEventListener('jarvis-solar-preview-animation',play);window.removeEventListener('jarvis-solar-stop-preview',stop);window.removeEventListener('jarvis-solar-pause-preview',togglePause);};
  },[available]);
  return {states,playing,paused,phase};
}
