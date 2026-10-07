import { expect, it } from 'vitest';
import { validateSolarWav, solarSpokenText } from './solar-speech.ts';

it('ignores pure sound annotations without deleting spoken commands', () => {
  for (const value of ['[MÚSICA DE FUNDO]', '(MÚSICA DE FUNDO)', '[music] [applause]', '[silêncio]', '']) expect(solarSpokenText(value)).toBe('');
  for (const value of ['Liga a música de fundo', 'Olá [music]', '[not a known sound label]', 'Escreve música']) expect(solarSpokenText(value)).toBe(value);
});

function wav() { const data=Buffer.alloc(48);data.write('RIFF',0);data.writeUInt32LE(40,4);data.write('WAVEfmt ',8);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);data.writeUInt16LE(1,22);data.writeUInt32LE(16000,24);data.writeUInt32LE(32000,28);data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(4,40);return data; }
it('accepts bounded mono PCM and rejects malformed, stereo, binary and oversized input',()=>{
  expect(validateSolarWav(wav().toString('base64')).length).toBe(48);
  for(const value of [null,'not audio!',Buffer.from('RIFF').toString('base64'),'a'.repeat(1_400_001)])expect(()=>validateSolarWav(value)).toThrow();
  const stereo=wav();stereo.writeUInt16LE(2,22);expect(()=>validateSolarWav(stereo.toString('base64'))).toThrow('mono');
  const wrongRate=wav();wrongRate.writeUInt32LE(48000,24);expect(()=>validateSolarWav(wrongRate.toString('base64'))).toThrow('16 kHz');
});
it('rejects inconsistent container sizes, byte rates and sample alignment', () => {
  for (const [offset, value] of [[4, 1], [28, 1], [32, 1], [40, 1]] as const) {
    const data = wav();
    if (offset === 32) data.writeUInt16LE(value, offset); else data.writeUInt32LE(value, offset);
    expect(() => validateSolarWav(data.toString('base64'))).toThrow('PCM WAV');
  }
  const tooLong = Buffer.alloc(928046); wav().copy(tooLong, 0, 0, 44);
  tooLong.writeUInt32LE(tooLong.length - 8, 4); tooLong.writeUInt32LE(tooLong.length - 44, 40);
  expect(() => validateSolarWav(tooLong.toString('base64'))).toThrow('29 seconds');
});
