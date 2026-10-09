import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'dist-native', 'solar-speech');
// Official whisper.cpp model repository, pinned to the same immutable revision
// as the original base model. SHA-256 and bytes come from its Git LFS pointers.
const modelRevision = '5359861c739e955e79d9a303bcbc70fb988958b1';
const models = {
  base: { file: 'ggml-base.bin', label: 'base multilingual', bytes: 147951465, sha256: '60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe' },
  'small-q5_1': { file: 'ggml-small-q5_1.bin', label: 'small multilingual Q5_1', bytes: 190085487, sha256: 'ae85e4a935d7a567bd102fe55afc16bb595bdb618e11b2fc7591bc08120411bb' },
};
const requested = process.argv.slice(2);
if (requested.includes('--list')) { console.log(JSON.stringify({ revision: modelRevision, models }, null, 2)); process.exit(0); }
const modelFlag = requested.indexOf('--model');
const modelName = modelFlag >= 0 ? requested[modelFlag + 1] : 'base';
if (!Object.hasOwn(models, modelName)) throw new Error('Speech model must be base or small-q5_1');
if (requested.some((argument, index) => !(modelFlag >= 0 && (index === modelFlag || index === modelFlag + 1)) && argument !== '--check')) throw new Error('Unknown speech preparation argument');
const primary = models[modelName];
if (requested.includes('--check')) {
  const required = [...new Set(['base', modelName])];
  for (const name of required) {
    const model = models[name];
    const file = join(target, model.file);
    if (!existsSync(file) || createHash('sha256').update(readFileSync(file)).digest('hex') !== model.sha256) throw new Error(`Local speech model missing or checksum mismatch: ${model.file}`);
  }
  console.log(`Verified local speech models: ${required.join(', ')}`);
  process.exit(0);
}
mkdirSync(target, { recursive: true });
async function download(url, path, hash) {
  if (existsSync(path) && (!hash || createHash('sha256').update(readFileSync(path)).digest('hex') === hash)) return;
  console.log(`Preparing local speech: ${url.split('/').at(-1)}`);
  const response = await fetch(url, { signal: AbortSignal.timeout(300_000) });
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const data = Buffer.from(await response.arrayBuffer());
  if (hash && createHash('sha256').update(data).digest('hex') !== hash) throw new Error('Speech download checksum mismatch');
  writeFileSync(path, data);
}
for (const name of new Set(['base', modelName])) {
  const model = models[name];
  await download(`https://huggingface.co/ggerganov/whisper.cpp/resolve/${modelRevision}/${model.file}`, join(target, model.file), model.sha256);
}
const archive = join(target,'whisper-v1.9.0-x64.zip');
await download('https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.0/whisper-bin-x64.zip', archive, '00c4304b6be363a224a4b69829df49009f74131df8c3ce6a5878b89a11cd26ef');
const extracted = join(target,'extracted');
if (!existsSync(join(target,'whisper-cli.exe'))) {
  execFileSync('powershell.exe', ['-NoProfile','-NonInteractive','-Command','Expand-Archive -LiteralPath $env:SOLAR_SPEECH_ARCHIVE -DestinationPath $env:SOLAR_SPEECH_EXTRACTED -Force'], { windowsHide: true, env: { ...process.env, SOLAR_SPEECH_ARCHIVE: archive, SOLAR_SPEECH_EXTRACTED: extracted } });
  function copy(directory) { for (const entry of readdirSync(directory,{withFileTypes:true})) { const path=join(directory,entry.name); if (entry.isDirectory()) copy(path); else if (/\.(exe|dll)$/i.test(entry.name)) copyFileSync(path,join(target,entry.name)); } }
  copy(extracted);
}
if (!existsSync(join(target,'whisper-cli.exe'))) throw new Error('Official archive does not contain whisper-cli.exe');
await download('https://raw.githubusercontent.com/ggml-org/whisper.cpp/v1.9.0/LICENSE',join(target,'LICENSE.txt'));
writeFileSync(join(target,'manifest.json'), JSON.stringify({ runtime:'whisper.cpp', version:'v1.9.0', model:primary.label, modelFile:primary.file, modelSha256:primary.sha256, modelRevision, models:Object.values(models).filter(model => existsSync(join(target,model.file))) },null,2));
console.log('Local multilingual speech prepared.');
