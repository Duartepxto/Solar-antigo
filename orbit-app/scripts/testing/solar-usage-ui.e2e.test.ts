import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { launchVerificationServer } from '../control-orbit.ts';
import { closeBrowserSession } from '../../server/browser-engine.ts';
import { ensureUiBrowser, sessionEnv } from './control-orbit-ui.ts';
import { mountPreview, REPO_ROOT } from './preview-fixture.ts';
import { removeTempDir } from '../../server/testing/cleanup.ts';

it.skipIf(process.env.ORBIT_UI_E2E !== '1')('shows real EUR usage and refreshes settlement without mislabeling old period data', async () => {
  const session = await launchVerificationServer();
  const { binary, chrome } = await ensureUiBrowser();
  const home = mkdtempSync(join(tmpdir(), 'solar-usage-')); mkdirSync(join(home, 'tmp'));
  const env = { ...sessionEnv({ home, session: `usage-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: home };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 60_000, windowsHide: true, maxBuffer: 4194304 }).catch((cause: any) => { throw new Error(`${cause.message}\n${cause.stdout}\n${cause.stderr}`); });
    const value = JSON.parse(stdout); expect(value.success, stdout).toBe(true); return value.data;
  };
  const evidence = join(REPO_ROOT, '.orbit-scratch', 'verify-evidence', 'solar-usage'); mkdirSync(evidence, { recursive: true });
  let preview: Awaited<ReturnType<typeof mountPreview>> | undefined;
  try {
    preview = await mountPreview(session, { entry: '/scripts/testing/solar-usage-preview.tsx', route: '/__solar-usage.html', title: 'Solar usage fixture', logLevel: 'error' });
    await browser('set', 'viewport', '900', '950'); await browser('open', preview.previewUrl);
    await browser('wait', '--fn', 'document.body.textContent.includes("Garden agent history")');
    const before = (await browser('eval', '({text:document.body.textContent, chip:document.querySelector("[data-testid=usage-chip]")?.title, requests:window.testSolarUsage.requests, exportHref:document.querySelector("a[download]")?.getAttribute("href")})')).result;
    expect(before.text).toContain('~€\u00a02,00*');
    expect(before.text).not.toContain('$');
    expect(before.chip).toContain('1.6M');
    expect(before.chip).toContain('400k');
    expect(before.text).toContain('BCE');
    expect(before.text).toContain('2026-10-08');
    expect(before.text).toContain('*');
    expect(before.text).toContain('1 turno(s) usaram um modelo sem preço conhecido');
    expect(before.exportHref).toContain('currency=EUR');
    expect(before.requests.filter((p: string) => p.includes('/api/usage/currency'))).toHaveLength(1);
    if (process.env.SOLAR_USAGE_SKIP_SCREENSHOTS !== '1') await browser('screenshot', join(evidence, 'desktop.png'), '--full');
    await browser('set', 'viewport', '390', '844');
    const mobile = (await browser('eval', '({viewport:innerWidth,width:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll("button")].map(b=>({text:b.textContent,width:b.getBoundingClientRect().width,right:b.getBoundingClientRect().right}))})')).result;
    expect(mobile.width).toBeLessThanOrEqual(mobile.viewport);
    if (process.env.SOLAR_USAGE_SKIP_SCREENSHOTS !== '1') await browser('screenshot', join(evidence, 'mobile.png'), '--full');
    await browser('find', 'role', 'button', 'click', '--name', 'Settle synthetic turn');
    await browser('wait', '--fn', 'document.querySelector("[data-testid=usage-chip]")?.textContent.includes("3,00")');
    await browser('wait', '--fn', 'window.testSolarUsage.requests.filter(p=>p.includes("/api/usage?")).length>=2');
    await browser('wait', '--fn', '[...document.querySelectorAll("span")].find(el=>el.textContent==="Garden agent history")?.parentElement.textContent.includes("3,00")');
    const settled = (await browser('eval', '({text:document.body.textContent, historyRow:[...document.querySelectorAll("span")].find(el=>el.textContent==="Garden agent history")?.parentElement.textContent, requests:window.testSolarUsage.requests})')).result;
    expect(settled.text).toContain('~€\u00a03,00*');
    expect(settled.historyRow).toContain('~€\u00a03,00*');
    const consoleResult = await browser('console');
    expect((consoleResult.messages ?? []).filter((row: { type?: string }) => row.type === 'error')).toEqual([]);
    await browser('find', 'role', 'button', 'click', '--name', 'Fail next history read');
    await browser('eval', '(() => { const select=document.querySelector("select"); select.value="lastMonth"; select.dispatchEvent(new Event("change",{bubbles:true})); return true; })()');
    await browser('wait', '--fn', 'document.body.textContent.includes("Synthetic history unavailable")');
    const failed = (await browser('eval', '({text:document.body.textContent, selected:document.querySelector("select").value})')).result;
    expect(failed.selected).toBe('lastMonth');
    expect(failed.text).not.toContain('Garden agent history');
    const errors = await browser('errors');
    expect(errors.errors ?? []).toEqual([]);
    const requests = (await browser('eval', 'window.testSolarUsage.requests')).result;
    expect(requests.every((p: string) => p.startsWith('GET '))).toBe(true);
    writeFileSync(join(evidence, 'evidence.json'), JSON.stringify({ before, mobile, settled, failed, consoleResult, errors, requests, fixtureLog: session.info.logPath }, null, 2));
  } catch (error) {
    console.error('Solar usage fixture state:', JSON.stringify(await browser('snapshot').catch(() => null)));
    console.error('Solar usage fixture errors:', JSON.stringify(await browser('errors').catch(() => null)));
    throw error;
  } finally {
    await closeBrowserSession(binary, env); if (preview) await preview.close(); await session.close(); await removeTempDir(home);
  }
}, 180_000);
