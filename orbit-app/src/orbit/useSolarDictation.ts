import {useEffect,useRef,useState} from 'react';
import {beginDictation,browserRecognition} from './solar-dictation';

export function useSolarDictation(text:string,onText:(text:string)=>void,recipient?:string) {
  const [listening,setListening]=useState(false),[error,setError]=useState<string|null>(null);
  const session=useRef<{stop:()=>void;dispose:()=>void}|null>(null),latest=useRef({text,onText});
  latest.current={text,onText};
  useEffect(()=>()=>{session.current?.dispose();session.current=null;},[]);
  useEffect(()=>{session.current?.dispose();session.current=null;setListening(false);setError(null);},[recipient]);
  const toggle=()=>{
    if(listening){session.current?.stop();return;}
    session.current?.dispose();session.current=null;setError(null);
    const bridge=window.ogb,base=latest.current.text.trimEnd();
    if(bridge?.platform==='darwin'){
      setListening(true);
      const offText=bridge.onSpeechTranscript(line=>{if(typeof line.text==='string')latest.current.onText([base,line.text].filter(Boolean).join(' '));});
      const offEnd=bridge.onSpeechEnd(({code})=>{setListening(false);if(code)setError(code===1?'not-allowed':'audio-capture');});
      session.current={stop:()=>{void (bridge.speechFinish?.()??bridge.speechStop());},dispose:()=>{offText();offEnd();void bridge.speechStop();}};
      void bridge.speechStart().catch(()=>{setListening(false);setError('audio-capture');});return;
    }
    const Recognition=browserRecognition();if(!Recognition){setError('unsupported');return;}
    setListening(true);
    session.current=beginDictation(Recognition,base,navigator.language.startsWith('pt')?'pt-PT':navigator.language,{text:value=>latest.current.onText(value),error:setError,listening:setListening});
  };
  return {listening,error,toggle,dismiss:()=>setError(null),native:window.ogb?.platform==='darwin',supported:window.ogb?.platform==='darwin'||!!browserRecognition()};
}
