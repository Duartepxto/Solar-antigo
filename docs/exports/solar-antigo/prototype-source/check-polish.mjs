import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),viteRequire=createRequire(require.resolve('vite'));
const {transform}=viteRequire('esbuild');
const compiled=await transform(await readFile(new URL('./menuWave.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});
const {menuWave}=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64'));
for(const length of [40,60,100,180,280])for(const time of [0,3,10,21]){
 assert.equal(Math.abs(menuWave(0,length,time)),0);assert.equal(Math.abs(menuWave(1,length,time)),0);
 let previous=0;for(let x=0;x<=length;x++){const y=menuWave(x/length,length,time);assert.ok(Number.isFinite(y));assert.ok(Math.abs(y)<=10.5);if(x)assert.ok(Math.abs(y-previous)<1.1,'smooth path without sharp kinks');previous=y;}
 assert.ok(Math.abs(menuWave(.001,length,time))<.01,'calm start');assert.ok(Math.abs(menuWave(.999,length,time))<.01,'calm arrival');
}
console.log('PASS: bounded, smooth waves with calm endpoints on short and long routes.');
