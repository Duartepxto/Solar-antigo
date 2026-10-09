import { execFile } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';
import { closeBrowserSession } from '../../server/browser-engine.ts';
import { ensureUiBrowser, sessionEnv } from './control-orbit-ui.ts';
import { mountPreview, REPO_ROOT } from './preview-fixture.ts';
import { removeTempDir } from '../../server/testing/cleanup.ts';

it.skipIf(process.env.ORBIT_UI_E2E !== '1')('colors switch parts without painting setting rows, labels, metadata or status dots', async () => {
  const { binary, chrome } = await ensureUiBrowser();
  const home = mkdtempSync(join(tmpdir(), 'solar-controls-')); mkdirSync(join(home, 'tmp'));
  const env = { ...sessionEnv({ home, session: `controls-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: home };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 60000, windowsHide: true, maxBuffer: 4194304 });
    const result = JSON.parse(stdout); expect(result.success, stdout).toBe(true); return result.data;
  };
  const preview = await mountPreview({ info: { url: 'http://127.0.0.1:1' } }, {
    entry: '/scripts/testing/solar-settings-controls-preview.tsx', route: '/__solar-controls.html', title: 'Solar control fixture', logLevel: 'error',
  });
  try {
    await browser('open', preview.previewUrl);
    await browser('wait', '--fn', "document.querySelectorAll('[role=switch]').length === 6");
    await browser('eval', 'document.activeElement?.blur()');
    for (const [width, height, name] of [[1000, 1000, 'desktop'], [390, 1100, 'mobile']] as const) {
      await browser('set', 'viewport', String(width), String(height));
      await browser('wait', '300');
      const result = (await browser('eval', `(() => {
        const bg = el => getComputedStyle(el).backgroundColor;
        const rows = [...document.querySelectorAll('[role=switch]:not([data-slot])')];
        const enabled = rows.filter(row => row.getAttribute('aria-checked') === 'true');
        const compact = document.querySelector('[aria-label="Compact toggle"]');
        return {
          rowsClear: rows.every(row => bg(row) === 'rgba(0, 0, 0, 0)'),
          contentClear: rows.every(row => [...row.children].filter(el => !el.dataset.slot && !el.hasAttribute('style')).every(el => bg(el) === 'rgba(0, 0, 0, 0)')),
          dotsGreen: enabled.every(row => bg(row.firstElementChild) === 'rgb(56, 213, 145)'),
          sameTrack: enabled.every(row => bg(row.querySelector('[data-slot=switch-track]')) === bg(compact)),
          sameThumb: enabled.every(row => bg(row.querySelector('[data-slot=switch-thumb]')) === bg(compact.firstElementChild)),
          noOverflow: document.documentElement.scrollWidth <= innerWidth,
          tracksFit: rows.every(row => {const r=row.getBoundingClientRect(),s=row.querySelector('[data-slot=switch-track]').getBoundingClientRect();return s.right <= r.right && s.left >= r.left && s.bottom <= r.bottom;}),
        };
      })()`)).result;
      expect(result).toEqual({ rowsClear: true, contentClear: true, dotsGreen: true, sameTrack: true, sameThumb: true, noOverflow: true, tracksFit: true });
      const evidence = join(REPO_ROOT, '.orbit-scratch', 'verify-evidence', 'solar-settings-controls'); mkdirSync(evidence, { recursive: true });
      await browser('screenshot', join(evidence, `${name}.png`));
    }
    await browser('find', 'role', 'switch', 'click', '--name', 'Memory upkeep', '--exact');
    await browser('wait', '--fn', "document.querySelector('[role=switch]:not([data-slot])').getAttribute('aria-checked') === 'false'");
    await browser('press', 'Space');
    await browser('wait', '--fn', "document.querySelector('[role=switch]:not([data-slot])').getAttribute('aria-checked') === 'true'");
    await browser('find', 'role', 'switch', 'click', '--name', 'Compact toggle', '--exact');
    expect((await browser('eval', "document.querySelector('[aria-label=\"Compact toggle\"]').getAttribute('aria-checked')")).result).toBe('false');
    expect((await browser('errors')).errors).toEqual([]);
  } finally {
    await closeBrowserSession(binary, env);
    await preview.close();
    await removeTempDir(home);
  }
}, 120000);
