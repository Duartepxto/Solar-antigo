import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { launchVerificationServer, runControlOrbit } from '../control-orbit.ts';
import { closeBrowserSession } from '../../server/browser-engine.ts';
import { ensureUiBrowser, sessionEnv } from './control-orbit-ui.ts';
import { mountPreview, REPO_ROOT } from './preview-fixture.ts';
import { removeTempDir } from '../../server/testing/cleanup.ts';

it.skipIf(process.env.ORBIT_UI_E2E !== '1')('exports and previews a planet file with an inline confirmation and narrow layout', async () => {
  const session = await launchVerificationServer();
  const { binary, chrome } = await ensureUiBrowser();
  const home = mkdtempSync(join(tmpdir(), 'solar-agent-ui-')); mkdirSync(join(home, 'tmp'));
  const env = { ...sessionEnv({ home, session: `sa-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: home };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 60000, windowsHide: true, maxBuffer: 4194304 });
    const value = JSON.parse(stdout); expect(value.success, stdout).toBe(true); return value.data;
  };
  let preview: Awaited<ReturnType<typeof mountPreview>> | undefined;
  try {
    await runControlOrbit(['new-bot', '--name', 'Planet UI'], { env: { ORBIT_URL: session.info.url } });
    preview = await mountPreview(session, { entry: '/scripts/testing/agent-transfer-preview.tsx', route: '/__agent-transfer.html', title: 'Solar agent transfer fixture', logLevel: 'error' });
    await browser('set', 'viewport', '390', '844'); await browser('open', preview.previewUrl);
    await browser('wait', '--fn', "Array.from(document.querySelectorAll('button')).some(b=>b.textContent.includes('Exportar planeta'))");
    await browser('find', 'role', 'button', 'click', '--name', 'Exportar planeta');
    await browser('wait', '--fn', "document.body.textContent.includes('Planeta guardado')");
    await browser('eval', `(async () => { const bots=await fetch('/api/bots').then(r=>r.json()); const bot=bots.bots.find(b=>b.name==='Planet UI'); const {archive}=await fetch('/api/bots/'+bot.id+'/agent-archive').then(r=>r.json()); const input=document.querySelector('input[type=file]'); const transfer=new DataTransfer(); transfer.items.add(new File([JSON.stringify(archive)],'Planet.solar-agent.json',{type:'application/json'})); input.files=transfer.files; input.dispatchEvent(new Event('change',{bubbles:true})); return true; })()`);
    await browser('wait', '--fn', "document.body.textContent.includes('Atualizar este planeta')");
    expect((await browser('eval', 'document.documentElement.scrollWidth <= window.innerWidth')).result).toBe(true);
    const evidence = join(REPO_ROOT, '.orbit-scratch', 'verify-evidence', 'agent-transfer'); mkdirSync(evidence, { recursive: true });
    await browser('screenshot', join(evidence, 'preview-mobile.png'));
    await browser('find', 'role', 'button', 'click', '--name', 'Atualizar este planeta');
    await browser('wait', '--fn', "document.body.textContent.includes('Planet UI está pronto para continuar')");
    expect((await browser('eval', "document.querySelectorAll('[role=dialog]').length")).result).toBe(0);
    await browser('set', 'viewport', '900', '700'); await browser('screenshot', join(evidence, 'imported-desktop.png'));
  } finally {
    await closeBrowserSession(binary, env); if (preview) await preview.close(); await session.close(); await removeTempDir(home);
  }
}, 120000);
