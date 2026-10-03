import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync } from 'node:fs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const env = { ...process.env, VITE_JARVIS_SOLAR: 'true', VITE_JARVIS_PREVIEW: 'false', SOLAR_APP: '1' };
function run(path,args=[]) { console.log(`Solar build: ${path}`); execFileSync(process.execPath,[path,...args],{cwd:root,env,stdio:'inherit',windowsHide:true}); }
// A code-native Solar icon: the same understated gold sun as the app header.
const size=256,pixels=Buffer.alloc(size*size*4),mask=Buffer.alloc(size*size/8),dib=Buffer.alloc(40);
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const dx=x-128,dy=y-128,r=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),ray=Math.abs(Math.sin(angle*8));
  const sun=Math.abs(r-54)<3||(r>74&&r<94&&ray<.12);const i=((size-1-y)*size+x)*4;
  const inside=Math.hypot(Math.max(Math.abs(dx)-80,0),Math.max(Math.abs(dy)-80,0))<42;
  pixels[i]=sun?155:inside?20:0;pixels[i+1]=sun?194:inside?15:0;pixels[i+2]=sun?233:inside?10:0;pixels[i+3]=inside?255:0;
}
dib.writeUInt32LE(40,0);dib.writeInt32LE(size,4);dib.writeInt32LE(size*2,8);dib.writeUInt16LE(1,12);dib.writeUInt16LE(32,14);dib.writeUInt32LE(pixels.length+mask.length,20);
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(dib.length+pixels.length+mask.length,14);header.writeUInt32LE(22,18);
writeFileSync(join(root,'build','solar.ico'),Buffer.concat([header,dib,pixels,mask]));
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
