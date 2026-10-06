import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { launchVerificationServer } from '../scripts/control-orbit.ts';

it('persists the welcome agent name, colour and instructions through the real creation endpoint',async()=>{
  const fixture=await launchVerificationServer();
  try{
    const response=await fetch(fixture.info.url+'/api/bots',{method:'POST',headers:{'content-type':'application/json',origin:fixture.info.url},body:JSON.stringify({name:'Welcome Luna',settings:{color:'blue',soul:'Keep my work organised.'}})});
    expect(response.status).toBe(201);
    const {bot}=await response.json() as {bot:{id:string}};
    const stored=JSON.parse(readFileSync(join(fixture.info.dataDir,'bots.json'),'utf8'));
    expect(stored.find((row:{id:string})=>row.id===bot.id)).toMatchObject({name:'Welcome Luna',color:'blue',soul:'Keep my work organised.'});
    const roster=await (await fetch(fixture.info.url+'/api/bots')).json() as {bots:{id:string}[]};
    expect(roster.bots.find((row:{id:string})=>row.id===bot.id)).toMatchObject({name:'Welcome Luna',soul:'Keep my work organised.'});
  }finally{await fixture.close();}
},20_000);
