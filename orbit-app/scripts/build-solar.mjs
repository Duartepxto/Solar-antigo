import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const env = { ...process.env, VITE_JARVIS_SOLAR: 'true', VITE_JARVIS_PREVIEW: 'false', SOLAR_APP: '1' };
function run(path,args=[]) { console.log(`Solar build: ${path}`); execFileSync(process.execPath,[path,...args],{cwd:root,env,stdio:'inherit',windowsHide:true}); }
// Exported from the selected Solar identity; do not regenerate a different mark.
if (!existsSync(join(root,'build','solar.ico'))) throw new Error('Missing Solar icon: build/solar.ico');
run('node_modules/typescript/bin/tsc',['-b']);
run('node_modules/typescript/bin/tsc',['-p','tsconfig.server.build.json']);
run('scripts/bundle-server.mjs');
run('node_modules/typescript/bin/tsc',['-p','tsconfig.companion.build.json']);
run('scripts/bundle-updater.mjs');
run('node_modules/vite/bin/vite.js',['build','--configLoader','native']);
const packaging=['--win','nsis','--x64','--config','electron-builder.solar.yml','--publish','never'];
const runtime=join(root,'dist-native','solar-electron');
if(existsSync(join(runtime,'electron.exe'))) packaging.push(`--config.electronDist=${runtime}`);
try { run('node_modules/electron-builder/cli.js',packaging); }
catch(error) {
  const extracted='release-solar/win-unpacked.tmp';
  if(!existsSync(join(extracted,'electron.exe')))throw error;
  console.log('Using the official Electron distribution already extracted on this Windows machine.');
  run('node_modules/electron-builder/cli.js',[...packaging,`--config.electronDist=${extracted}`]);
}
