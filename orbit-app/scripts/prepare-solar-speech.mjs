import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'dist-native', 'solar-speech');
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
await download('https://huggingface.co/ggerganov/whisper.cpp/resolve/5359861c739e955e79d9a303bcbc70fb988958b1/ggml-base.bin', join(target,'ggml-base.bin'), '60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe');
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
writeFileSync(join(target,'manifest.json'), JSON.stringify({ runtime:'whisper.cpp', version:'v1.9.0', model:'base multilingual', modelSha256:'60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe' },null,2));
console.log('Local multilingual speech prepared.');
