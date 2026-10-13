import {copyFile} from 'node:fs/promises';
// Same renderer; this filename mounts only the approved six-step WelcomeFlow.
await copyFile('../docs/exports/solar-antigo/Solar.html','../docs/exports/solar-antigo/Solar-entrada.html');
console.log('Approved six-step Solar intro exported.');
