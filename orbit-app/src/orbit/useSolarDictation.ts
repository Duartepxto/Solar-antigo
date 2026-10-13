import { solarSpeechBridge, useSolarSpeechReady } from '@/lib/solar-voice';
import {useEffect,useRef,useState} from 'react';
import {beginDictation,browserRecognition} from './solar-dictation';
import { readDictationLocales } from '../lib/solar-dictation-settings';

export function useSolarDictation(text:string,onText:(text:string)=>void,recipient?:string,onComplete?:(text:string)=>void) {
  const solarReady=useSolarSpeechReady();
  const [listening,setListening]=useState(false),[finishing,setFinishing]=useState(false),[error,setError]=useState<string|null>(null);
  const session=useRef<{stop:()=>void;dispose:()=>void}|null>(null),latest=useRef({text,onText,onComplete});
  const generation=useRef(0);
  latest.current={text,onText,onComplete};
  useEffect(()=>()=>{generation.current++;session.current?.dispose();session.current=null;},[]);
  useEffect(()=>{generation.current++;session.current?.dispose();session.current=null;setListening(false);setFinishing(false);setError(null);},[recipient]);
  const toggle=()=>{
    if(finishing)return;
    if(listening){setFinishing(true);session.current?.stop();return;}
    session.current?.dispose();session.current=null;setError(null);setFinishing(false);
    const token=++generation.current;
    const bridge=solarSpeechBridge(),base=latest.current.text.trimEnd();
    let completedText='',hadError=false;
    const complete=()=>{if(!hadError&&completedText.trim())latest.current.onComplete?.(completedText);};
    if(bridge&&(solarReady||window.ogb?.platform==='darwin')){
      setListening(true);
      const offText=bridge.onSpeechTranscript(line=>{
        if(token!==generation.current)return;
        if(line.error){hadError=true;setError(['not-allowed','busy-elsewhere','no-microphone'].includes(line.error)?line.error:'audio-capture');return;}
        if(line.text?.trim()){
          const value=[base,line.text.trim()].filter(Boolean).join(' ');
          latest.current.onText(value);
          if(!line.partial)completedText=value;
        }
        else if(!line.partial){hadError=true;setError('no-speech');}
      });
      const offEnd=bridge.onSpeechEnd(({code})=>{if(token!==generation.current)return;generation.current++;offText();offEnd();session.current=null;setListening(false);setFinishing(false);if(code){hadError=true;setError(previous=>previous??'audio-capture');}complete();});
      const failed=()=>{if(token===generation.current){generation.current++;session.current?.dispose();session.current=null;setListening(false);setFinishing(false);setError('audio-capture');}};
      session.current={stop:()=>{void (bridge.speechFinish?.()??bridge.speechStop()).catch(failed);},dispose:()=>{offText();offEnd();void bridge.speechStop();}};
      void bridge.speechStart({continuous:true}).catch(failed);return;
    }
    const Recognition=browserRecognition();if(!Recognition){setError('unsupported');return;}
    setListening(true);
    session.current=beginDictation(Recognition,base,readDictationLocales()[0],{text:value=>{if(token===generation.current){completedText=value;latest.current.onText(value);}},error:value=>{if(token===generation.current){hadError=true;setError(value);}},listening:value=>{if(token!==generation.current)return;setListening(value);if(!value){generation.current++;setFinishing(false);complete();}}});
  };
  return {listening,finishing,error,toggle,cancel:()=>{generation.current++;session.current?.dispose();session.current=null;setListening(false);setFinishing(false);},dismiss:()=>setError(null),native:solarReady||window.ogb?.platform==='darwin',supported:solarReady||window.ogb?.platform==='darwin'||!!browserRecognition()};
}
