import { useEffect, useState } from 'react';
import { api } from '@/state/store';
import { dictationEngineLanguage } from '../../shared/solar-dictation-language';
import { readDictationLocales } from './solar-dictation-settings';

type Transcript = { text?: string; partial?: boolean; error?: string };
type End = { code: number | null; reason?: string };
type Bridge = Pick<NonNullable<Window['ogb']>, 'speechStart' | 'speechStop' | 'speechFinish' | 'onSpeechTranscript' | 'onSpeechEnd'>;
const solar = import.meta.env.VITE_JARVIS_SOLAR === 'true';
const transcripts = new Set<(line: Transcript) => void>(), endings = new Set<(info: End) => void>();
let generation = 0;
let release: (() => void) | null = null;
let finish: (() => Promise<void>) | null = null;

export function encodeSolarWav(chunks: Float32Array[], rate: number): Uint8Array {
  const input = new Float32Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0; for (const chunk of chunks) { input.set(chunk, offset); offset += chunk.length; }
  const count = Math.min(29 * 16000, Math.floor(input.length * 16000 / rate)), bytes = new Uint8Array(44 + count * 2), view = new DataView(bytes.buffer);
  const text = (at: number, value: string) => { for (let i=0;i<value.length;i++) bytes[at+i]=value.charCodeAt(i); };
  text(0,'RIFF'); view.setUint32(4,bytes.length-8,true); text(8,'WAVE'); text(12,'fmt '); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,16000,true); view.setUint32(28,32000,true); view.setUint16(32,2,true); view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,count*2,true);
  for(let i=0;i<count;i++) { const from=Math.floor(i*rate/16000),to=Math.max(from+1,Math.floor((i+1)*rate/16000));let sum=0;for(let j=from;j<Math.min(to,input.length);j++)sum+=input[j];const value=Math.max(-1,Math.min(1,sum/Math.max(1,Math.min(to,input.length)-from)));view.setInt16(44+i*2,value*(value<0?32768:32767),true); }
  return bytes;
}
const bridge: Bridge = {
  async speechStop() { generation++; release?.(); release=null; finish=null; },
  async speechFinish() { await finish?.(); },
  onSpeechTranscript(callback) { transcripts.add(callback); return () => { transcripts.delete(callback); }; },
  onSpeechEnd(callback) { endings.add(callback); return () => { endings.delete(callback); }; },
  async speechStart(options) {
    const token = ++generation;
    release?.(); release=null; finish=null;
    const language = dictationEngineLanguage(readDictationLocales());
    let stream: MediaStream | null = null, context: AudioContext | null = null, processor: ScriptProcessorNode | null = null;
    const controller = new AbortController();
    let lease: string | null = null;
    const releaseLease = () => { if (lease) { void window.ogb?.speechReleaseLocal?.(lease); lease = null; } };
    const cleanup = () => { if(processor){processor.onaudioprocess=null;processor.disconnect();}stream?.getTracks().forEach(track=>track.stop());void context?.close().catch(()=>{}); };
    release=()=>{controller.abort();cleanup();releaseLease();};
    const report = (reason: string) => { if(token!==generation)return;cleanup();releaseLease();release=null;finish=null;for(const callback of transcripts)callback({error:reason});for(const callback of endings)callback({code:1,reason}); };
    try {
      if (window.ogb?.speechClaimLocal) {
        lease = await window.ogb.speechClaimLocal();
        if (token !== generation) { releaseLease(); return; }
        if (!lease) { report('busy-elsewhere'); return; }
      }
      stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      if(token!==generation){cleanup();return;}
      context=new AudioContext({sampleRate:16000}); await context.resume();
      if(token!==generation){cleanup();return;}
      const source=context.createMediaStreamSource(stream); processor=context.createScriptProcessor(1024,1,1); const silence=context.createGain();silence.gain.value=0;source.connect(processor);processor.connect(silence);silence.connect(context.destination);
      const chunks:Float32Array[]=[],started=performance.now();let spoke=false,lastVoice=started,finishing=false;
      const endpoint=Math.max(400,Math.min(3000,options?.endpointMs??850));
      finish=async()=>{
        if(finishing||token!==generation)return;finishing=true;cleanup();
        try {
          let text='';
          if(spoke){const bytes=encodeSolarWav(chunks,context!.sampleRate);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));const result=await api<{text:string}>('/api/solar-voice/transcribe',{method:'POST',body:JSON.stringify({audio:btoa(binary),language}),signal:controller.signal});text=result.text;}
          if(token!==generation)return;releaseLease();release=null;finish=null;for(const callback of transcripts)callback({text,partial:false});if(token===generation)for(const callback of endings)callback({code:0,reason:'completed'});
        }catch(e){if(!controller.signal.aborted)report(e instanceof Error?e.message:String(e));}
      };
      processor.onaudioprocess=event=>{
        if(finishing||token!==generation)return;
        const samples=event.inputBuffer.getChannelData(0);chunks.push(new Float32Array(samples));let power=0;for(const sample of samples)power+=sample*sample;const now=performance.now();
        if(Math.sqrt(power/samples.length)>.012){spoke=true;lastVoice=now;}
        if((spoke&&now-lastVoice>endpoint)||now-started>29_000)void finish?.();
      };
    } catch(e) { report(e instanceof Error && ['NotAllowedError', 'SecurityError'].includes(e.name) ? 'not-allowed' : e instanceof Error && e.name === 'NotFoundError' ? 'no-microphone' : e instanceof Error?e.message:String(e)); }
  },
};
export function solarSpeechBridge(): Bridge | undefined { return solar && window.ogb?.platform !== 'darwin' ? bridge : window.ogb; }
export function useSolarSpeechReady(): boolean {
  const [ready,setReady]=useState(false);
  useEffect(()=>{if(!solar)return;let alive=true;void api<{ready:boolean}>('/api/solar-voice/status').then(result=>{if(alive)setReady(result.ready);}).catch(()=>{});return()=>{alive=false;};},[]);
  return ready && !!navigator.mediaDevices?.getUserMedia;
}
