import {cp,mkdir,copyFile,access} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const source=fileURLToPath(new URL('.',import.meta.url));
const root=fileURLToPath(new URL('../../../../orbit-app/',import.meta.url));
const staged=resolve(root,'.orbit-scratch/design-export');
await mkdir(staged,{recursive:true});
await cp(source,staged,{recursive:true});
const previous=resolve(source,'../Solar-before-clean.html');
try{await access(previous);}catch{await copyFile(resolve(source,'../Solar.html'),previous);}
process.chdir(root);
process.env.SOLAR_DESIGN_VARIANT='live';
await import(pathToFileURL(resolve(staged,'build.mjs')).href);
await import(pathToFileURL(resolve(staged,'build-entry.mjs')).href);
