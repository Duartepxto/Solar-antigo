import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { serveSolarBrowser } from '../../companion/src/solar-browser.ts';
import { closeBrowserSession } from '../../server/browser-engine.ts';
import { ensureUiBrowser, sessionEnv } from './control-orbit-ui.ts';
import { REPO_ROOT as ROOT } from './preview-fixture.ts';

it.skipIf(process.env.ORBIT_UI_E2E !== '1')('phone preserves new drafts, unchanged messages and logout during a pending refresh', async () => {
  const { binary, chrome } = await ensureUiBrowser();
  mkdirSync(join(ROOT, '.orbit-scratch'), { recursive: true });
  const home = mkdtempSync(join(ROOT, '.orbit-scratch', 'solar-phone-ui-'));
  mkdirSync(join(home, 'tmp'));
  const sockets = mkdtempSync(join(tmpdir(), 'sp-'));
  const env = { ...sessionEnv({ home, session: `sp-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: sockets };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 30000, maxBuffer: 4194304 });
    const result = JSON.parse(stdout); expect(result.success, stdout).toBe(true); return result.data;
  };
  const evaluate = async (js: string) => (await browser('eval', js)).result;
  const wait = (js: string) => browser('wait', '--fn', js);
  const bots = { bots: [{ id: 'fixture', threadId: 'fixture-thread', name: 'Jarvis', messages: [{ id: 'm1', role: 'bot', text: 'Fixture phone ready' }] }] };
  const json = (res: ServerResponse, data: unknown) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(data)); };
  let pendingPost: ServerResponse | undefined, pendingRefresh: ServerResponse | undefined, delayRefresh = false;
  const sent: Array<{ text: string; threadId: string; sendId: string }> = [];
  const pairAttempts: Array<{ credential: string; pairRequestId: string }> = [];
  const server = createServer((req, res) => {
    if (serveSolarBrowser(req, res)) return;
    if (req.url === '/api/pair') {
      let body = ''; req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        pairAttempts.push(JSON.parse(body));
        if (pairAttempts.length === 1) { res.statusCode = 502; json(res, { error: 'Fixture lost pairing response' }); }
        else json(res, { token: 'fixture-phone-token' });
      }); return;
    }
    if (req.headers.authorization !== 'Bearer fixture-phone-token') { res.statusCode = 401; json(res, { error: 'Unauthorized' }); return; }
    if (req.url === '/api/bots') { if (delayRefresh) pendingRefresh = res; else json(res, bots); return; }
    if (req.url === '/api/bots/fixture/messages' && req.method === 'POST') {
      let body = ''; req.on('data', chunk => { body += chunk; });
      req.on('end', () => { sent.push(JSON.parse(body)); pendingPost = res; }); return;
    }
    res.statusCode = 404; res.end();
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as { port: number }).port;
  const until = async (ready: () => boolean) => { for (let i = 0; !ready() && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 50)); expect(ready()).toBe(true); };
  try {
    await browser('open', `http://127.0.0.1:${port}/solar#token=fixture-pair`);
    await browser('set', 'viewport', '390', '844');
    await browser('click', '#connect');
    await wait("document.querySelector('#connect').disabled === false && document.querySelector('#status').textContent.includes('Fixture lost pairing response')");
    await browser('click', '#connect');
    await wait("document.querySelector('#composer').hidden === false");
    expect(pairAttempts).toHaveLength(2);
    expect(pairAttempts[1]).toEqual(pairAttempts[0]);
    expect(pairAttempts[0].pairRequestId).toMatch(/^solar-[0-9a-f]{32}$/);
    await evaluate("document.querySelector('#messages article').dataset.proof = 'retained'");
    await browser('wait', '3000');
    expect(await evaluate("document.querySelector('#messages article').dataset.proof")).toBe('retained');
    await browser('fill', '#draft', 'First message');
    await browser('click', '#send');
    await until(() => Boolean(pendingPost));
    expect(sent[0]).toMatchObject({ text: 'First message', threadId: 'fixture-thread' });
    expect(sent[0].sendId).toMatch(/^solar-[0-9a-f]{32}$/);
    await browser('fill', '#draft', 'A new draft typed while sending');
    json(pendingPost!, { ok: true }); pendingPost = undefined;
    await wait("document.querySelector('#send').disabled === false");
    expect(await evaluate("document.querySelector('#draft').value")).toBe('A new draft typed while sending');
    await browser('click', '#send');
    await until(() => Boolean(pendingPost));
    pendingPost!.statusCode = 502; json(pendingPost!, { error: 'Fixture temporary outage' }); pendingPost = undefined;
    await wait("document.querySelector('#send').disabled === false");
    // The PC may select another thread before the phone retries. Keep the
    // original receipt target instead of starting the same action there.
    bots.bots[0]!.threadId = 'fixture-new-thread';
    await browser('wait', '3000');
    await browser('click', '#send');
    await until(() => Boolean(pendingPost));
    expect(sent[2]).toEqual(sent[1]);
    expect(sent[1].sendId).not.toBe(sent[0].sendId);
    json(pendingPost!, { ok: true }); pendingPost = undefined;
    await wait("document.querySelector('#send').disabled === false");
    const evidence = join(ROOT, '.orbit-scratch', 'verify-evidence', 'solar-phone'); mkdirSync(evidence, { recursive: true });
    await browser('screenshot', join(evidence, 'connected.png'));
    delayRefresh = true;
    await until(() => Boolean(pendingRefresh));
    await browser('click', '#leave');
    json(pendingRefresh!, bots); pendingRefresh = undefined;
    await browser('wait', '500');
    expect(await evaluate("document.querySelector('#composer').hidden")).toBe(true);
    expect(await evaluate("localStorage.getItem('solar.companion.token')")).toBe(null);
  } finally {
    pendingPost?.end(); pendingRefresh?.end();
    await closeBrowserSession(binary, env);
    server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
    rmSync(home, { recursive: true, force: true }); rmSync(sockets, { recursive: true, force: true });
  }
}, 90000);
