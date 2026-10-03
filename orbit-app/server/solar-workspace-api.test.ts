import { afterAll, beforeAll, expect, it } from 'vitest';
import { launchVerificationServer, type VerificationServer } from '../scripts/control-orbit.ts';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let fixture: VerificationServer;
beforeAll(async () => { fixture = await launchVerificationServer(); });
afterAll(async () => { if (fixture) await fixture.close(); });
async function api(method: string, path: string, body?: unknown) {
  const response = await fetch(`${fixture.info.url}${path}`, { method, headers: { 'content-type': 'application/json', origin: fixture.info.url }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { status: response.status, body: await response.json() as any };
}
it('saves real task files, checks conflicts and isolates conversations over HTTP', async () => {
  const bot = (await api('GET','/api/bots')).body.bots[0];
  const base = `/api/bots/${bot.id}/solar-workspace?threadId=${bot.threadId}`;
  expect((await api('GET',base)).status).toBe(200);
  const created = await api('PUT',base+'&file=page.md',{ content:'# Solar', revision:null });
  expect(created.status).toBe(200);
  expect((await api('GET',base+'&file=page.md')).body.content).toBe('# Solar');
  expect((await api('PUT',base+'&file=page.md',{ content:'# Stale', revision:null })).status).toBe(409);
  expect((await api('PUT',base+'&file=page.md',{ content:'# Edited', revision:created.body.revision })).status).toBe(200);
  expect((await api('GET',base+'&file=../outside.md')).status).toBe(400);
  expect((await api('GET',`/api/bots/${bot.id}/solar-workspace?threadId=not-a-task`)).status).toBe(404);
  const next = (await api('POST',`/api/bots/${bot.id}/tasks`,{title:'Other workspace'})).body.task;
  expect((await api('GET',`/api/bots/${bot.id}/solar-workspace?threadId=${next.threadId}&file=page.md`)).status).toBe(404);
  expect((await api('GET',base+'&file=page.md')).body.content).toBe('# Edited');
});
it.skipIf(!existsSync(resolve('dist-native/solar-speech/qa-jfk.wav')))('transcribes public audio through the real isolated voice endpoint',async()=>{
  expect((await api('GET','/api/solar-voice/status')).body.ready).toBe(true);
  // The public WAV includes a LIST metadata chunk. The recorder sends only
  // canonical PCM; normalize the fixture without relaxing the API contract.
  const sample=readFileSync(resolve('dist-native/solar-speech/qa-jfk.wav'));
  let data=Buffer.alloc(0);
  for(let offset=12;offset+8<=sample.length;){
    const length=sample.readUInt32LE(offset+4);
    if(sample.toString('ascii',offset,offset+4)==='data'){data=sample.subarray(offset+8,offset+8+length);break;}
    offset+=8+length+(length%2);
  }
  const canonical=Buffer.concat([sample.subarray(0,36),Buffer.from('data'),Buffer.alloc(4),data]);
  canonical.writeUInt32LE(canonical.length-8,4);
  canonical.writeUInt32LE(data.length,40);
  const audio=canonical.toString('base64');
  const result=await api('POST','/api/solar-voice/transcribe',{audio,language:'en'});
  expect(result.status).toBe(200);
  expect(result.body.text).toMatch(/ask not what your country/i);
  expect((await api('POST','/api/solar-voice/transcribe',{audio:'invalid',language:'en'})).status).toBe(400);
});
