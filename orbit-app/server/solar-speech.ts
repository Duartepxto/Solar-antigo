import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
/** Pure Whisper sound annotations must not become assistant commands. */
export function solarSpokenText(value: string): string {
  const text = value.trim();
  const labels = /[[(]\s*(?:(?:background|soft|instrumental)\s+)?(?:music|musica(?:\s+de\s+fundo)?|silence|silencio|applause|aplausos|laughter|risos|noise|ruido)(?:\s+playing)?\s*[\])]/gi;
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return /[\p{L}\p{N}]/u.test(normalized.replace(labels, '')) ? text : '';
}
let active = false;
export function solarSpeechDirectory() { return process.env.SOLAR_SPEECH_DIR || resolve('dist-native/solar-speech'); }
const SPEECH_MODELS = [
  { id: 'small-q5_1', file: 'ggml-small-q5_1.bin', quality: 'accurate', multilingual: true },
  { id: 'base', file: 'ggml-base.bin', quality: 'fast', multilingual: true },
] as const;
/** Preview favours latency; a completed recording favours the installed model's
 * accuracy. English-only models are deliberately excluded from both paths. */
export function solarSpeechModel(preview = false, directory = solarSpeechDirectory()) {
  const candidates = preview ? [...SPEECH_MODELS].reverse() : SPEECH_MODELS;
  return candidates.find(model => existsSync(join(directory, model.file))) ?? null;
}
export function solarSpeechStatus() {
  const directory = solarSpeechDirectory();
  const model = solarSpeechModel(false, directory);
  return { ready: existsSync(join(directory, 'whisper-cli.exe')) && Boolean(model), local: true, model: model?.id ?? null, quality: model?.quality ?? null, previewModel: solarSpeechModel(true, directory)?.id ?? null, maximumRecordingSeconds: 29 };
}
export function solarSpeechReady() { return solarSpeechStatus().ready; }

/** Reject only constant PCM (silence/DC), never gate quiet spoken words. This
 * avoids asking a generative decoder to invent text from an empty preview. */
export function solarPcmHasSignal(bytes: Buffer): boolean {
  let lowest = 32767;
  let highest = -32768;
  for (let offset = 44; offset + 1 < bytes.length; offset += 2) {
    const value = bytes.readInt16LE(offset);
    lowest = Math.min(lowest, value);
    highest = Math.max(highest, value);
    if (highest !== lowest) return true;
  }
  return false;
}
export function validateSolarWav(audio: unknown): Buffer {
  if (typeof audio !== 'string' || audio.length > 1_400_000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(audio)) throw Object.assign(new Error('Invalid voice recording'), { status: 400 });
  const bytes = Buffer.from(audio,'base64');
  if (bytes.length <= 44 || bytes.length > 928_044 || (bytes.length - 44) % 2 !== 0 || bytes.toString('ascii',0,4) !== 'RIFF' || bytes.readUInt32LE(4) !== bytes.length - 8 || bytes.toString('ascii',8,12) !== 'WAVE' || bytes.toString('ascii',12,16) !== 'fmt ' || bytes.readUInt32LE(16) !== 16 || bytes.readUInt16LE(20) !== 1 || bytes.readUInt16LE(22) !== 1 || bytes.readUInt32LE(24) !== 16000 || bytes.readUInt32LE(28) !== 32000 || bytes.readUInt16LE(32) !== 2 || bytes.readUInt16LE(34) !== 16 || bytes.toString('ascii',36,40) !== 'data' || bytes.readUInt32LE(40) !== bytes.length-44) throw Object.assign(new Error('Expected mono 16 kHz PCM WAV, up to 29 seconds'), { status: 400 });
  return bytes;
}
export async function transcribeSolarVoice(audio: unknown, language: unknown, signal?: AbortSignal, preview = false) {
  const bytes = validateSolarWav(audio);
  if (!solarSpeechReady()) throw Object.assign(new Error('Local speech recognition is not installed'), { status: 503 });
  const model = solarSpeechModel(preview)!;
  const metadata = { model: model.id, quality: model.quality };
  if (!solarPcmHasSignal(bytes)) return { text: '', ...metadata };
  if (active) throw Object.assign(new Error('Voice recognition is busy; try again'), { status: 429 });
  const lang = typeof language === 'string' && /^[a-z]{2}$/.test(language) ? language : 'auto';
  const directory = mkdtempSync(join(tmpdir(),'solar-voice-'));
  active = true;
  try {
    const path = join(directory,'recording.wav'), output = join(directory,'transcript'); writeFileSync(path,bytes);
    const root = solarSpeechDirectory();
    // Beam five was already the CLI's default. Keep it for complete phrases;
    // previews use greedy decoding without repeated temperature fallbacks.
    const decoder = preview ? ['-bs', '1', '-bo', '1', '-nf'] : ['-bs', '5', '-bo', '5'];
    await run(join(root,'whisper-cli.exe'), ['-m',join(root,model.file),'-f',path,'-l',lang,'-otxt','-of',output,'-nt','-np','-sns','-t','4',...decoder], { timeout: 90_000, maxBuffer: 500_000, windowsHide: true, signal });
    return { text: solarSpokenText(readFileSync(output+'.txt','utf8')), ...metadata };
  } finally {
    active = false;
    if(dirname(resolve(directory)) === resolve(tmpdir()) && directory.startsWith(join(tmpdir(),'solar-voice-'))) rmSync(directory,{recursive:true,force:true});
  }
}
