import { expect, it } from 'vitest';
import { encodeSolarWav } from './solar-voice';

it('encodes and resamples captured audio to bounded 16 kHz PCM without wrapping amplitudes',()=>{
  const bytes=encodeSolarWav([new Float32Array([2,2,2,-2,-2,-2,0,0,0])],48000),view=new DataView(bytes.buffer);
  expect(view.getUint32(24,true)).toBe(16000);
  expect(view.getUint32(40,true)).toBe(6);
  expect(view.getInt16(44,true)).toBe(32767);
  expect(view.getInt16(46,true)).toBe(-32768);
  expect(view.getInt16(48,true)).toBe(0);
});
