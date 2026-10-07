import { solarSpeechBridge, useSolarSpeechReady } from '@/lib/solar-voice';
import {useEffect,useRef,useState} from 'react';
import {beginDictation,browserRecognition} from './solar-dictation';
import { readDictationLocales } from '../lib/solar-dictation-settings';

export function useSolarDictation(text:string,onText:(text:string)=>void,recipient?:string) {
  const solarReady=useSolarSpeechReady();
  const [listening,setListening]=useState(false),[error,setError]=useState<string|null>(null);
  const session=useRef<{stop:()=>void;dispose:()=>void}|null>(null),latest=useRef({text,onText});
  const generation=useRef(0);
  latest.current={text,onText};
  useEffect(()=>()=>{generation.current++;session.current?.dispose();session.current=null;},[]);
  useEffect(()=>{generation.current++;session.current?.dispose();session.current=null;setListening(false);setError(null);},[recipient]);
  const toggle=()=>{
    if(listening){session.current?.stop();return;}
    session.current?.dispose();session.current=null;setError(null);
    const token=++generation.current;
    const bridge=solarSpeechBridge(),base=latest.current.text.trimEnd();
    if(bridge&&(solarReady||window.ogb?.platform==='darwin')){
      setListening(true);
      const offText=bridge.onSpeechTranscript(line=>{
        if(token!==generation.current)return;
        if(line.error){setError(['not-allowed','busy-elsewhere','no-microphone'].includes(line.error)?line.error:'audio-capture');return;}
        if(line.text?.trim())latest.current.onText([base,line.text.trim()].filter(Boolean).join(' '));
        else if(!line.partial)setError('no-speech');
      });
      const offEnd=bridge.onSpeechEnd(({code})=>{if(token!==generation.current)return;setListening(false);if(code)setError(previous=>previous??'audio-capture');});
      const failed=()=>{if(token===generation.current){setListening(false);setError('audio-capture');}};
      session.current={stop:()=>{void (bridge.speechFinish?.()??bridge.speechStop()).catch(failed);},dispose:()=>{offText();offEnd();void bridge.speechStop();}};
      void bridge.speechStart({endpointMs:1800}).catch(failed);return;
    }
    const Recognition=browserRecognition();if(!Recognition){setError('unsupported');return;}
    setListening(true);
    session.current=beginDictation(Recognition,base,readDictationLocales()[0],{text:value=>latest.current.onText(value),error:setError,listening:setListening});
  };
  return {listening,error,toggle,cancel:()=>{generation.current++;session.current?.dispose();session.current=null;setListening(false);},dismiss:()=>setError(null),native:solarReady||window.ogb?.platform==='darwin',supported:solarReady||window.ogb?.platform==='darwin'||!!browserRecognition()};
}
