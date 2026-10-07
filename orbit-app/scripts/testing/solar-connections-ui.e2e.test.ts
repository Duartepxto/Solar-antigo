import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { closeBrowserSession } from '../../server/browser-engine.ts';
import { ensureUiBrowser, sessionEnv } from './control-orbit-ui.ts';
import { mountPreview, REPO_ROOT } from './preview-fixture.ts';
import { removeTempDir } from '../../server/testing/cleanup.ts';

it.skipIf(process.env.ORBIT_UI_E2E !== '1')('renders moving particle connections while the communication renderer remains active', async () => {
  const { binary, chrome } = await ensureUiBrowser();
  const home = mkdtempSync(join(tmpdir(), 'solar-lines-'));
  mkdirSync(join(home, 'tmp'));
  const env = { ...sessionEnv({ home, session: `sl-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: home };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 60000, windowsHide: true, maxBuffer: 4_194_304 });
    const result = JSON.parse(stdout); expect(result.success, stdout).toBe(true); return result.data;
  };
  const fake = createServer((_req, res) => { res.setHeader('content-type', 'application/json'); res.end('{}'); });
  await new Promise<void>(resolve => fake.listen(0, '127.0.0.1', resolve));
  const port = (fake.address() as { port: number }).port;
  const preview = await mountPreview({ info: { url: `http://127.0.0.1:${port}` } }, {
    entry: '/scripts/testing/solar-connections-preview.tsx', route: '/__solar-connections.html', title: 'Solar connection fixture', logLevel: 'error',
  });
  try {
    await browser('set', 'viewport', '1000', '740');
    await browser('open', preview.previewUrl);
    await browser('wait', '--fn', "document.querySelector('[data-solar-renderer=webgl-3d]') && document.querySelector('[data-solar-links=particles]')?.width > 0");
    expect((await browser('eval', "document.querySelectorAll('.solar-orbits line[stroke-dasharray]').length")).result).toBe(0);
    await browser('eval', "window.solarConnectionBefore = document.querySelector('[data-solar-links=particles]').toDataURL()");
    await browser('wait', '400');
    expect((await browser('eval', "window.solarConnectionBefore !== document.querySelector('[data-solar-links=particles]').toDataURL()")).result).toBe(true);
    for (const result of [false, true]) {
      await browser('eval', "window.solarPacketsBefore = document.querySelector('.solar-orbit-particle-canvas').toDataURL()");
      await browser('eval', `window.dispatchEvent(new CustomEvent('jarvis-solar-transfer',{detail:{from:'${result ? 'momo' : 'jarvis'}',to:'${result ? 'jarvis' : 'momo'}',at:Date.now(),result:${result}}}))`);
      await browser('wait', '500');
      expect((await browser('eval', "window.solarPacketsBefore !== document.querySelector('.solar-orbit-particle-canvas').toDataURL()")).result).toBe(true);
    }
    const evidence = join(REPO_ROOT, '.orbit-scratch', 'verify-evidence', 'solar-connections'); mkdirSync(evidence, { recursive: true });
    await browser('screenshot', join(evidence, 'desktop.png'));
  } catch (failure) {
    console.error('Solar fixture errors:', JSON.stringify(await browser('errors').catch(() => null)));
    throw failure;
  } finally {
    await closeBrowserSession(binary, env);
    await preview.close();
    await new Promise<void>(resolve => fake.close(() => resolve()));
    // The exact disposable profile owned by this fixture.
    await removeTempDir(home);
  }
}, 120000);
