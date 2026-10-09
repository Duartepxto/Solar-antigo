import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { validateSolarWav, solarSpokenText, solarPcmHasSignal, solarSpeechModel, solarSpeechStatus, transcribeSolarVoice } from './solar-speech.ts';

const processFixture = vi.hoisted(() => ({
  calls: [] as { file: string; args: string[]; signal?: AbortSignal; timeout: number }[],
  transcript: 'Olá, Solar. Mantém os acentos.',
  fail: false,
}));
vi.mock('node:child_process', async () => {
  const { writeFileSync: write } = await import('node:fs');
  return {
    execFile: (file: string, args: string[], options: { signal?: AbortSignal; timeout: number }, callback: (error: Error | null, stdout?: string, stderr?: string) => void) => {
      processFixture.calls.push({ file, args, ...options });
      if (processFixture.fail) { callback(new Error('Fixture decoder failed')); return; }
      write(args[args.indexOf('-of') + 1] + '.txt', processFixture.transcript);
      callback(null, '', '');
    },
  };
});

let speechFixtureDirectory = '';
beforeEach(() => {
  speechFixtureDirectory = mkdtempSync(join(tmpdir(), 'solar-speech-unit-'));
  vi.stubEnv('SOLAR_SPEECH_DIR', speechFixtureDirectory);
  processFixture.calls.length = 0;
  processFixture.fail = false;
});
afterEach(() => {
  vi.unstubAllEnvs();
  if (dirname(resolve(speechFixtureDirectory)) === resolve(tmpdir()) && basename(speechFixtureDirectory).startsWith('solar-speech-unit-')) rmSync(speechFixtureDirectory, { recursive: true, force: true });
});

it('ignores pure sound annotations without deleting spoken commands', () => {
  for (const value of ['[MÚSICA DE FUNDO]', '(MÚSICA DE FUNDO)', '[music] [applause]', '[silêncio]', '[music].', '...', '']) expect(solarSpokenText(value)).toBe('');
  for (const value of ['Liga a música de fundo', 'Olá [music]', '[not a known sound label]', 'Escreve música']) expect(solarSpokenText(value)).toBe(value);
});

it('prefers the installed multilingual small model for final text and base for previews', () => {
  expect(solarSpeechStatus()).toMatchObject({ ready: false, model: null, previewModel: null });
  writeFileSync(join(speechFixtureDirectory, 'whisper-cli.exe'), 'fixture');
  writeFileSync(join(speechFixtureDirectory, 'ggml-base.en.bin'), 'English only');
  expect(solarSpeechModel()).toBeNull();
  writeFileSync(join(speechFixtureDirectory, 'ggml-base.bin'), 'multilingual base');
  expect(solarSpeechStatus()).toMatchObject({ ready: true, model: 'base', quality: 'fast', previewModel: 'base', maximumRecordingSeconds: 29 });
  writeFileSync(join(speechFixtureDirectory, 'ggml-small-q5_1.bin'), 'multilingual small');
  expect(solarSpeechModel()?.id).toBe('small-q5_1');
  expect(solarSpeechModel(true)?.id).toBe('base');
  expect(solarSpeechStatus()).toMatchObject({ model: 'small-q5_1', quality: 'accurate' });
});

it('skips constant PCM without invoking the decoder and preserves quiet signal', async () => {
  writeFileSync(join(speechFixtureDirectory, 'whisper-cli.exe'), 'fixture');
  writeFileSync(join(speechFixtureDirectory, 'ggml-base.bin'), 'fixture');
  const silence = wav();
  expect(solarPcmHasSignal(silence)).toBe(false);
  expect(await transcribeSolarVoice(silence.toString('base64'), 'auto')).toMatchObject({ text: '', model: 'base' });
  const dc = wav(); dc.writeInt16LE(2400, 44); dc.writeInt16LE(2400, 46);
  expect(solarPcmHasSignal(dc)).toBe(false);
  expect(processFixture.calls.length).toBe(0);
  const quiet = wav(); quiet.writeInt16LE(-1, 44); quiet.writeInt16LE(1, 46);
  expect(solarPcmHasSignal(quiet)).toBe(true);
});

it('uses local fast previews and accurate final decoding without pinning mixed speech to Portuguese', async () => {
  for (const file of ['whisper-cli.exe', 'ggml-base.bin', 'ggml-small-q5_1.bin']) writeFileSync(join(speechFixtureDirectory, file), 'fixture');
  const audio = wav(); audio.writeInt16LE(-200, 44); audio.writeInt16LE(200, 46);
  const cancelled = new AbortController();
  const preview = await transcribeSolarVoice(audio.toString('base64'), 'auto', cancelled.signal, true);
  expect(preview).toEqual({ text: 'Olá, Solar. Mantém os acentos.', model: 'base', quality: 'fast' });
  const first = processFixture.calls[0];
  expect(first.file).toBe(join(speechFixtureDirectory, 'whisper-cli.exe'));
  expect(first.args[first.args.indexOf('-m') + 1]).toBe(join(speechFixtureDirectory, 'ggml-base.bin'));
  expect(first.args[first.args.indexOf('-l') + 1]).toBe('auto');
  expect(first.args.slice(-5)).toEqual(['-bs', '1', '-bo', '1', '-nf']);
  expect(first.args).toContain('-sns');
  expect(first.signal).toBe(cancelled.signal);
  expect(existsSync(dirname(first.args[first.args.indexOf('-f') + 1]))).toBe(false);
  const final = await transcribeSolarVoice(audio.toString('base64'), 'pt');
  expect(final.model).toBe('small-q5_1');
  const last = processFixture.calls[1];
  expect(last.args[last.args.indexOf('-l') + 1]).toBe('pt');
  expect(last.args.slice(-4)).toEqual(['-bs', '5', '-bo', '5']);
  expect(last.args).not.toContain('-nf');
});

it('cleans up a failed decoder and releases the local recognition slot for retry', async () => {
  for (const file of ['whisper-cli.exe', 'ggml-base.bin']) writeFileSync(join(speechFixtureDirectory, file), 'fixture');
  const audio = wav(); audio.writeInt16LE(-200, 44); audio.writeInt16LE(200, 46);
  processFixture.fail = true;
  await expect(transcribeSolarVoice(audio.toString('base64'), 'en')).rejects.toThrow('Fixture decoder failed');
  expect(existsSync(dirname(processFixture.calls[0].args[processFixture.calls[0].args.indexOf('-f') + 1]))).toBe(false);
  processFixture.fail = false;
  await expect(transcribeSolarVoice(audio.toString('base64'), 'en')).resolves.toMatchObject({ model: 'base' });
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
