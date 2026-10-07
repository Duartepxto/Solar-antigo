import { expect, it, vi } from 'vitest';
const fixture = vi.hoisted(() => ({ api: vi.fn() }));
vi.mock('@/state/store', () => ({ api: fixture.api }));
import { encodeSolarWav } from './solar-voice';

it('encodes and resamples captured audio to bounded 16 kHz PCM without wrapping amplitudes',()=>{
  const bytes=encodeSolarWav([new Float32Array([2,2,2,-2,-2,-2,0,0,0])],48000),view=new DataView(bytes.buffer);
  expect(view.getUint32(24,true)).toBe(16000);
  expect(view.getUint32(40,true)).toBe(6);
  expect(view.getInt16(44,true)).toBe(32767);
  expect(view.getInt16(46,true)).toBe(-32768);
  expect(view.getInt16(48,true)).toBe(0);
});
it('caps a final microphone buffer at the server’s 29-second limit', () => {
  const bytes = encodeSolarWav([new Float32Array(30 * 16000)], 16000);
  expect(bytes.length).toBe(928044);
  expect(new DataView(bytes.buffer).getUint32(40, true)).toBe(928000);
});

it.each([[['pt-PT'], 'pt'], [['en-US'], 'en'], [['pt-PT', 'en-US'], 'auto']] as const)('uses selected languages %s independently of Windows language', async (locales, expected) => {
  vi.stubEnv('VITE_JARVIS_SOLAR', 'true'); vi.resetModules();
  const stop = vi.fn(), disconnect = vi.fn();
  const processor = { onaudioprocess: null as ((event: any) => void) | null, connect: vi.fn(), disconnect };
  const node = { connect: vi.fn() };
  vi.stubGlobal('window', { ogb: { platform: 'win32' } });
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(locales) });
  vi.stubGlobal('navigator', { language: 'en-US', mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [{ stop }] })) } });
  vi.stubGlobal('AudioContext', class {
    sampleRate = 16000; destination = {};
    resume = async () => {}; close = async () => {};
    createMediaStreamSource = () => node;
    createScriptProcessor = () => processor;
    createGain = () => ({ ...node, gain: { value: 1 } });
  });
  fixture.api.mockResolvedValueOnce({ text: 'Olá, please continue o projeto.' });
  const { solarSpeechBridge } = await import('./solar-voice');
  const bridge = solarSpeechBridge()!, transcript = vi.fn(), off = bridge.onSpeechTranscript(transcript);
  try {
    await bridge.speechStart();
    processor.onaudioprocess!({ inputBuffer: { getChannelData: () => new Float32Array(1600).fill(0.1) } });
    await bridge.speechFinish!();
    const [path, options] = fixture.api.mock.calls.at(-1)!;
    expect(path).toBe('/api/solar-voice/transcribe');
    expect(JSON.parse(options.body).language).toBe(expected);
    expect(transcript).toHaveBeenCalledWith({ text: 'Olá, please continue o projeto.', partial: false });
    expect(stop).toHaveBeenCalled();
  } finally { off(); await bridge.speechStop(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); }
});

async function captureFixture(mode: 'capture' | 'resume' | 'normal' = 'normal') {
  vi.stubEnv('VITE_JARVIS_SOLAR','true'); vi.resetModules(); fixture.api.mockReset();
  let releaseCapture!: (value: any) => void, releaseResume!: () => void;
  const captureGate = new Promise(resolve => { releaseCapture=resolve; });
  const resumeGate = new Promise<void>(resolve => { releaseResume=resolve; });
  const stop=vi.fn(), source=vi.fn(), close=vi.fn(async()=>{});
  const stream={getTracks:()=>[{stop}]};
  const processor={connect:vi.fn(),disconnect:vi.fn(),onaudioprocess:null as ((e:any)=>void)|null};
  vi.stubGlobal('window',{ogb:{platform:'win32'}});
  vi.stubGlobal('localStorage',{getItem:()=>null});
  vi.stubGlobal('navigator',{mediaDevices:{getUserMedia:vi.fn(async()=>mode==='capture'?await captureGate:stream)}});
  vi.stubGlobal('AudioContext',class{
    sampleRate=16000;destination={};close=close;
    resume=async()=>{if(mode==='resume')await resumeGate;};
    createMediaStreamSource=source.mockReturnValue({connect:vi.fn()});
    createScriptProcessor=()=>processor;
    createGain=()=>({gain:{value:1},connect:vi.fn()});
  });
  const {solarSpeechBridge}=await import('./solar-voice'); const bridge=solarSpeechBridge()!;
  const transcript=vi.fn(),end=vi.fn(),off=bridge.onSpeechTranscript(transcript),offEnd=bridge.onSpeechEnd(end);
  return {bridge,transcript,end,stop,source,close,processor,releaseCapture:()=>releaseCapture(stream),releaseResume,
    dispose:async()=>{off();offEnd();await bridge.speechStop();vi.unstubAllGlobals();vi.unstubAllEnvs();}};
}

it.each(['capture','resume'] as const)('releases the microphone when cancelled during pending %s',async phase=>{
  const f=await captureFixture(phase);
  try{
    const start=f.bridge.speechStart();await new Promise(resolve=>setTimeout(resolve,0));
    await f.bridge.speechStop(); f.releaseCapture();f.releaseResume();await start;
    expect(f.stop).toHaveBeenCalled();expect(f.source).not.toHaveBeenCalled();
    expect(f.transcript).not.toHaveBeenCalled();expect(f.end).not.toHaveBeenCalled();
  }finally{await f.dispose();}
});
it('only the latest simultaneous start opens the audio processor',async()=>{
  const f=await captureFixture('capture');
  try{
    const first=f.bridge.speechStart(),second=f.bridge.speechStart();f.releaseCapture();await Promise.all([first,second]);
    expect(f.source).toHaveBeenCalledOnce();
  }finally{await f.dispose();}
});
it.each([['NotAllowedError','not-allowed'],['NotFoundError','no-microphone']] as const)('distinguishes %s from a recognition failure',async(name,reason)=>{
  const f=await captureFixture();
  try{
    const failure=new Error('device failure');failure.name=name;
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(failure);
    await f.bridge.speechStart();
    expect(f.transcript).toHaveBeenCalledWith({error:reason});expect(f.end).toHaveBeenCalledWith({code:1,reason});
  }finally{await f.dispose();}
});
it('reports a failed transcription and releases the microphone',async()=>{
  const f=await captureFixture();
  try{
    fixture.api.mockRejectedValueOnce(new Error('recognition server unavailable'));
    await f.bridge.speechStart();f.processor.onaudioprocess!({inputBuffer:{getChannelData:()=>new Float32Array(1600).fill(.1)}});
    await f.bridge.speechFinish!();
    expect(f.stop).toHaveBeenCalled();expect(f.transcript).toHaveBeenCalledWith({error:'recognition server unavailable'});
  }finally{await f.dispose();}
});
it('does not transcribe silence or emit a late result after cancellation',async()=>{
  const f=await captureFixture();
  try{
    await f.bridge.speechStart();await f.bridge.speechFinish!();expect(fixture.api).not.toHaveBeenCalled();
    expect(f.transcript).toHaveBeenCalledWith({text:'',partial:false});f.transcript.mockClear();
    let complete!: (value:any)=>void;fixture.api.mockImplementationOnce(()=>new Promise(resolve=>{complete=resolve;}));
    await f.bridge.speechStart();f.processor.onaudioprocess!({inputBuffer:{getChannelData:()=>new Float32Array(1600).fill(.1)}});
    const finish=f.bridge.speechFinish!();await f.bridge.speechStop();complete({text:'late words'});await finish;
    expect(f.transcript).not.toHaveBeenCalled();
  }finally{await f.dispose();}
});
