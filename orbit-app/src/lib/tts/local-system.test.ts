import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Speaker } from './index';

class Utterance {
  lang = ''; voice: unknown; onstart?: () => void; onend?: () => void;
  onerror?: (event: {error:string}) => void;
  constructor(public text:string) {}
}
let latest: Utterance;
const portuguese = { voiceURI:'pt-voice', name:'Português', lang:'pt-PT' };
beforeEach(()=>{
  vi.stubEnv('VITE_JARVIS_SOLAR','true');
  vi.stubGlobal('document',{documentElement:{lang:'pt-PT'}});
  vi.stubGlobal('navigator',{language:'en-US'});
  vi.stubGlobal('window',{SpeechSynthesisUtterance:Utterance,speechSynthesis:{cancel:vi.fn(),getVoices:()=>[{voiceURI:'en',name:'English',lang:'en-US'},portuguese],speak:(value:Utterance)=>{latest=value;value.onstart?.();}}});
  vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Local speech must not require a cloud voice provider');}));
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
it('uses an installed Portuguese voice for the interface language without a paid provider',async()=>{
  const speaker=new Speaker(),done=speaker.speak('Olá, o trabalho está pronto.');
  await vi.waitFor(()=>expect(latest?.text).toBe('Olá, o trabalho está pronto.'));
  expect(latest.voice).toBe(portuguese);expect(latest.lang).toBe('pt-PT');
  latest.onend?.();await done;expect(speaker.state.status).toBe('idle');expect(fetch).not.toHaveBeenCalled();
});
it('settles local playback on hang up and exposes voice errors instead of hanging the call',async()=>{
  const speaker=new Speaker(),done=speaker.speak('Olá');
  await vi.waitFor(()=>expect(speaker.state.status).toBe('speaking'));
  speaker.stop();await done;expect(speaker.state.status).toBe('idle');
  const failed=speaker.speak('Tentar novamente');
  await vi.waitFor(()=>expect(speaker.state.status).toBe('speaking'));
  latest.onerror?.({error:'synthesis-failed'});await failed;
  expect(speaker.state.error).toMatch(/device/);
});
