import { createServer, type Server } from 'node:http';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { createProxyHandler } from '../src/proxy.ts';
import { solarSameOrigin } from '../src/solar-browser.ts';
let harness:Server, phone:Server, base:string;
beforeAll(async()=>{
  harness=createServer((_req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({bots:[{id:'one',name:'Jarvis'}]}));});
  await new Promise<void>(resolve=>harness.listen(0,'127.0.0.1',resolve));
  const port=(harness.address() as {port:number}).port;
  const handler=createProxyHandler({harnessPort:port,solarBrowser:true,authenticate:token=>token==='fixture-device'?{id:'test',cloudDesktopAccess:false}:null,redeem:credential=>credential==='fixture-pair'?{token:'fixture-device',device:{id:'test'}}:{error:'invalid pairing'},serverName:()=> 'Solar'});
  phone=createServer(handler);await new Promise<void>(resolve=>phone.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+(phone.address() as {port:number}).port;
});
afterAll(async()=>{await Promise.all([phone,harness].filter(Boolean).map(server=>new Promise<void>(resolve=>{server.closeAllConnections();server.close(()=>resolve());})));});
it('serves Solar application code with no credentials or workspace data',async()=>{
  const page=await fetch(base+'/solar');expect(page.status).toBe(200);expect(await page.text()).toContain('<title>Solar</title>');expect(page.headers.get('referrer-policy')).toBe('no-referrer');expect(page.headers.get('cache-control')).toBe('no-store');
  expect((await fetch(base+'/solar/app.js')).status).toBe(200);
});
it('pairs only explicitly, retains bearer authentication and rejects other origins/admin routes',async()=>{
  expect((await fetch(base+'/api/bots',{headers:{Origin:base}})).status).toBe(401);
  const paired=await fetch(base+'/api/pair',{method:'POST',headers:{Origin:base,'content-type':'application/json'},body:JSON.stringify({credential:'fixture-pair',deviceName:'Android'})});expect(paired.status).toBe(201);expect((await paired.json() as {token:string}).token).toBe('fixture-device');
  expect((await fetch(base+'/api/bots',{headers:{Origin:base,Authorization:'Bearer fixture-device'}})).status).toBe(200);
  expect((await fetch(base+'/api/bots',{headers:{Origin:'https://attacker.example',Authorization:'Bearer fixture-device'}})).status).toBe(403);
  expect((await fetch(base+'/api/config',{method:'PUT',headers:{Origin:base,Authorization:'Bearer fixture-device','content-type':'application/json'},body:'{}'})).status).toBe(403);
});
it('only accepts an exact same origin',()=>{expect(solarSameOrigin(base,new URL(base).host)).toBe(true);expect(solarSameOrigin(base+'/path',new URL(base).host)).toBe(false);expect(solarSameOrigin('null',new URL(base).host)).toBe(false);});
