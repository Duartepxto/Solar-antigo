import{readFileSync,writeFileSync}from'node:fs';
const f='.orbit-scratch/design-export/build.mjs';let s=readFileSync(f,'utf8');
s=s.replace("if(id.endsWith('/ChatView.tsx'))return code.replace(","if(id.endsWith('/ChatView.tsx'))return code.replace('import { VerifyCard } from \\\"./VerifyCard\\\";','import {SolarExecution as VerifyCard} from \\\"../../.orbit-scratch/design-export/SolarExecution\\\";').replace('<VerifyCard','<VerifyCard bot={bot}').replace(");
s=s.replace(".replace('/solar/brand/solar-app-icon.png','/solar/brand/solar-sun.svg')", ".replace(/<div className=\"solar-brand\">[\\s\\S]*?<\\/div>/,'')");
const line=s.split('\n').find(l=>l.includes("if(id.endsWith('/SolarConstellation.tsx'))return code.replace('const points"));
if(!line)throw Error('Constellation transform not found');s=s.replace(line,"  if(id.endsWith('/SolarConstellation.tsx'))return 'export {DoubleOrbit as SolarConstellation} from \\\"../../.orbit-scratch/design-export/DoubleOrbit\\\";';");writeFileSync(f,s);
