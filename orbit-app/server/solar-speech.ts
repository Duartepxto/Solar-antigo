import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
let active = false;
export function solarSpeechDirectory() { return process.env.SOLAR_SPEECH_DIR || resolve('dist-native/solar-speech'); }
export function solarSpeechReady() { const root = solarSpeechDirectory(); return existsSync(join(root,'whisper-cli.exe')) && existsSync(join(root,'ggml-base.bin')); }
export function validateSolarWav(audio: unknown): Buffer {
  if (typeof audio !== 'string' || audio.length > 1_400_000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(audio)) throw Object.assign(new Error('Invalid voice recording'), { status: 400 });
  const bytes = Buffer.from(audio,'base64');
  if (bytes.length < 44 || bytes.length > 1_000_044 || bytes.toString('ascii',0,4) !== 'RIFF' || bytes.toString('ascii',8,12) !== 'WAVE' || bytes.toString('ascii',12,16) !== 'fmt ' || bytes.readUInt32LE(16) !== 16 || bytes.readUInt16LE(20) !== 1 || bytes.readUInt16LE(22) !== 1 || bytes.readUInt32LE(24) !== 16000 || bytes.readUInt16LE(34) !== 16 || bytes.toString('ascii',36,40) !== 'data' || bytes.readUInt32LE(40) !== bytes.length-44) throw Object.assign(new Error('Expected mono 16 kHz PCM WAV'), { status: 400 });
  return bytes;
}
export async function transcribeSolarVoice(audio: unknown, language: unknown) {
  const bytes = validateSolarWav(audio);
  if (!solarSpeechReady()) throw Object.assign(new Error('Local speech recognition is not installed'), { status: 503 });
  if (active) throw Object.assign(new Error('Voice recognition is busy; try again'), { status: 429 });
  const lang = typeof language === 'string' && /^[a-z]{2}$/.test(language) ? language : 'auto';
  const directory = mkdtempSync(join(tmpdir(),'solar-voice-'));
  active = true;
  try {
    const path = join(directory,'recording.wav'), output = join(directory,'transcript'); writeFileSync(path,bytes);
    const root = solarSpeechDirectory();
    await run(join(root,'whisper-cli.exe'), ['-m',join(root,'ggml-base.bin'),'-f',path,'-l',lang,'-otxt','-of',output,'-nt','-np','-t','4'], { timeout: 90_000, maxBuffer: 500_000, windowsHide: true });
    return { text: readFileSync(output+'.txt','utf8').trim() };
  } finally {
    active = false;
    if(dirname(resolve(directory)) === resolve(tmpdir()) && directory.startsWith(join(tmpdir(),'solar-voice-'))) rmSync(directory,{recursive:true,force:true});
  }
}
