import { execFile } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, it } from "vitest";
import { closeBrowserSession } from "../../server/browser-engine.ts";
import { removeTempDir } from "../../server/testing/cleanup.ts";
import { ensureUiBrowser, sessionEnv } from "./control-orbit-ui.ts";
import { mountPreview, REPO_ROOT } from "./preview-fixture.ts";

it.skipIf(process.env.ORBIT_UI_E2E !== "1")("isolated Solar garden preserves teams, skins, selection and mobile controls", async () => {
  const { binary, chrome } = await ensureUiBrowser();
  const home = mkdtempSync(join(tmpdir(), "solar-garden-"));
  mkdirSync(join(home, "tmp"));
  const env = { ...sessionEnv({ home, session: `garden-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: home };
  const execute = promisify(execFile);
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, "--json"], { env, timeout: 60000, windowsHide: true, maxBuffer: 4194304 });
    const result = JSON.parse(stdout);
    expect(result.success, stdout).toBe(true);
    return result.data;
  };
  const click = (name: string) => browser("find", "role", "button", "click", "--name", name, "--exact");
  const evaluate = async (source: string) => (await browser("eval", source)).result;
  const preview = await mountPreview({ info: { url: "http://127.0.0.1:1" } }, {
    entry: "/scripts/testing/workspace-v2-preview.tsx", route: "/__solar-garden.html", title: "Solar garden isolated fixture", logLevel: "error",
  });
  const evidence = join(REPO_ROOT, ".orbit-scratch", "verify-evidence", "workspace-v2");
  mkdirSync(evidence, { recursive: true });
  const ready = async () => {
    await browser("wait", "--fn", "document.querySelector('[data-scene-status=ready]') !== null");
    // Wait for the camera's authored entrance before capturing the rendered
    // world. The UI's ready status alone is not screenshot evidence of it.
    await browser("wait", "900");
  };
  try {
    await browser("set", "viewport", "1440", "960");
    await browser("open", preview.previewUrl);
    await ready();
    expect(await evaluate("[...document.querySelectorAll('[data-team-key]')].map(team => [team.dataset.teamKey, team.querySelectorAll('[data-agent-id]').length])")).toEqual([["Design", 2], ["Development", 3]]);
    expect(await evaluate("document.querySelectorAll('[data-agent-id]').length")).toBe(6);
    await browser("screenshot", join(evidence, "desktop-garden.png"));
    await click("Select Designer");
    await browser("wait", "--fn", "document.querySelector('.workspace-v2-column h2')?.textContent === 'Designer'");
    expect(await evaluate("document.querySelector('.workspace-v2-team-context')?.textContent")).toBe("Team · Design");
    await click("Ocean");
    expect(await evaluate("JSON.parse(localStorage.getItem('solar.workspace-v2.agent-skins.v1'))['fixture-design']")).toBe("ocean");
    await click("Pause character animations");
    expect(await evaluate("document.querySelector('[aria-label=\"Resume character animations\"]')?.getAttribute('aria-pressed')")).toBe("false");
    await click("Zoom in");
    await browser("wait", "800");
    await browser("screenshot", join(evidence, "desktop-agent.png"));
    await click("Show the whole workspace");
    await browser("wait", "--fn", "document.querySelector('.workspace-v2-column h2')?.textContent === 'Your agents'");
    await click("Select Builder");
    await click("Open conversation");
    expect(await evaluate("document.querySelector('[data-fixture-result]')?.dataset.fixtureResult")).toBe("conversation:fixture-builder");
    await browser("open", preview.previewUrl);
    await ready();
    await click("Select Designer");
    expect(await evaluate("document.querySelector('[data-skin=ocean]')?.getAttribute('aria-pressed')")).toBe("true");
    // Failed storage keeps the current appearance usable and explicitly
    // reports that it cannot survive a reload.
    await evaluate("Storage.prototype.setItem = function() { throw new DOMException('Fixture storage blocked', 'QuotaExceededError'); }");
    await click("Lunar");
    expect(await evaluate("document.querySelector('.workspace-v2-save-error')?.textContent")).toContain("could not be saved");
    expect(await evaluate("document.querySelector('[data-skin=lunar]')?.getAttribute('aria-pressed')")).toBe("true");
    await browser("open", `${preview.previewUrl}?long`);
    await ready();
    await browser("set", "viewport", "390", "844");
    await browser("wait", "500");
    expect(await evaluate("document.documentElement.scrollWidth <= innerWidth")).toBe(true);
    await browser("screenshot", join(evidence, "mobile-garden.png"));
    await click("Select Builder");
    await browser("wait", "500");
    expect(await evaluate("document.documentElement.scrollWidth <= innerWidth")).toBe(true);
    await browser("screenshot", join(evidence, "mobile-agent.png"));
    await browser("press", "Escape");
    expect(await evaluate("document.querySelectorAll('[data-agent-id]').length")).toBe(6);
    await browser("find", "role", "link", "click", "--name", "Return to Solar", "--exact");
    expect(await evaluate("document.querySelector('[data-fixture-result]')?.dataset.fixtureResult")).toBe("exit");
    await browser("open", `${preview.previewUrl}?empty`);
    await ready();
    expect(await evaluate("document.querySelectorAll('[data-agent-id]').length")).toBe(0);
    expect(await evaluate("document.querySelector('.workspace-v2-empty h3')?.textContent")).toBe("Your workspace is ready");
    await browser("open", `${preview.previewUrl}?error`);
    await ready();
    expect(await evaluate("document.querySelectorAll('[data-agent-id]').length")).toBe(0);
    expect(await evaluate("document.querySelector('[role=alert]')?.textContent")).toContain("connection is unavailable");
    expect((await browser("errors")).errors).toEqual([]);
  } finally {
    await closeBrowserSession(binary, env);
    await preview.close();
    await removeTempDir(home);
  }
}, 240000);
