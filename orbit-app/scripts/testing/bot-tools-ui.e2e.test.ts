// Full-app regression through the existing disposable browser harness. No
// real provider, OAuth account, MCP package, or user data is used.
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { waitForExit } from "../../server/testing/cleanup.ts";
import { BOT_ROLES, roleProfilePatch } from "../../src/lib/bot-roles.ts";
import { runControlOrbit } from "../control-orbit.ts";
import { UI_TOOLS_DIR } from "./control-orbit-ui.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const binary = resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const forced = process.env.ORBIT_UI_E2E === "1";
const enabled = forced || Boolean(binary);
if (!enabled) console.log("skipping bot tools UI e2e: no agent-browser; set ORBIT_UI_E2E=1 to install the pinned release");
const LAUNCH_TIMEOUT_MS = forced && !binary ? 600_000 : 180_000;

interface FixtureInfo { ui: string; url: string; dataDir: string; logPath: string }
interface SavedBot { id: string; name: string; soul?: string; mcpServers?: string[]; computer?: string; browser?: boolean }

describe("bot setup and tools in the real renderer", () => {
  let child: ChildProcess | undefined;
  let info: FixtureInfo;
  afterAll(async () => {
    await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
  });

  (enabled ? it : it.skip)("creates roles, configures per-bot MCP access, and recovers a rejected preset", async () => {
    let stdout = "";
    let stderr = "";
    child = spawn(process.execPath, ["--experimental-strip-types", join(ROOT, "scripts/control-orbit.ts"), "ui", "launch"], {
      cwd: ROOT, env: process.env, stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout!.on("data", (chunk: Buffer) => { stdout += String(chunk); });
    child.stderr!.on("data", (chunk: Buffer) => { stderr += String(chunk); });
    child.on("error", (error) => { stderr += error.message; });
    await expect.poll(() => {
      if (child!.exitCode !== null || child!.signalCode !== null) throw new Error(`UI launcher exited: ${stderr}`);
      try { info = JSON.parse(stdout); return Boolean(info.ui); } catch { return false; }
    }, { timeout: LAUNCH_TIMEOUT_MS + 120_000, interval: 250 }).toBe(true);
    const ui = (verb: string, ...args: string[]) => runControlOrbit(["ui", verb, "--ui", info.ui, ...args]) as Promise<Record<string, any>>;
    const evaluate = async (js: string) => (await ui("eval", "--js", js)).result;
    const click = (name: string) => ui("click", "--name", name);
    const press = (keys: string) => ui("press", "--keys", keys);
    const bots = async (): Promise<SavedBot[]> => (await fetch(`${info.url}/api/bots`).then((response) => response.json())).bots;
    const snapshot = async () => (await ui("snapshot")).snapshot as string;
    // Orbit: the bot's Apps & MCP system opens its tools panel.
    const openTools = async () => {
      if (!(await evaluate("Boolean(document.querySelector('[data-orbit-panel=apps]'))"))) await click("Apps & MCP");
      await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-panel=apps]'))"), { timeout: 10_000 }).toBe(true);
    };
    const clickRole = async (title: string) => {
      const state = await ui("snapshot", "--interactive");
      const matches = Object.entries(state.refs as Record<string, { role: string; name: string }>)
        .filter(([, entry]) => entry.role === "button" && entry.name.startsWith(`${title} `));
      expect(matches).toHaveLength(1);
      await ui("click", "--ref", `@${matches[0][0]}`);
    };
    // New bot is a panel in the column (design: hub 'new'), not a modal.
    const newBotOpen = () => evaluate("Boolean(document.querySelector('[data-orbit-new]'))");
    const title = () => evaluate("document.querySelector('.orbit-root span.pointer-events-none')?.textContent ?? null");
    const original = await bots();
    const coder = BOT_ROLES.find((role) => role.id === "coder")!;

    // Hold creation in this disposable browser to exercise closing and
    // reopening while the request is pending, not just two clicks.
    await evaluate(`(() => {
      const fetch = window.fetch.bind(window);
      window.botCreateRequests = 0;
      window.fetch = (input, init) => {
        if (String(input) === '/api/bots' && init?.method === 'POST') {
          window.botCreateRequests++;
          return new Promise(resolve => {
            window.releaseBotCreation = () => { window.fetch = fetch; resolve(fetch(input, init)); };
          });
        }
        return fetch(input, init);
      };
      return true;
    })()`);
    await press("Control+n");
    await expect.poll(newBotOpen, { timeout: 10_000 }).toBe(true);
    await clickRole(coder.title);
    await expect.poll(() => evaluate("window.botCreateRequests"), { timeout: 10_000 }).toBe(1);
    await press("Escape");
    expect(await newBotOpen()).toBe(false);
    await press("Control+n");
    await expect.poll(() => evaluate("document.querySelector('[data-orbit-new]')?.getAttribute('aria-busy')"), { timeout: 10_000 }).toBe("true");
    expect(await evaluate("[...document.querySelectorAll('[data-orbit-new] [aria-busy]')].every(b => b.disabled)")).toBe(true);
    await evaluate("[...document.querySelectorAll('[data-orbit-new] button')].find(b => b.textContent.includes('Blank bot')).click()");
    expect(await evaluate("window.botCreateRequests")).toBe(1);
    // Cancel stays usable; a slow server must not trap the user.
    await click("Cancel");
    expect(await newBotOpen()).toBe(false);
    await press("Control+n");
    await evaluate("window.releaseBotCreation(); true");
    await expect.poll(async () => (await bots()).find((bot) => bot.name === coder.name)?.soul, { timeout: 10_000 }).toBe(coder.soul);
    const created = (await bots()).filter((bot) => !original.some((old) => old.id === bot.id));
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject(roleProfilePatch(coder));
    expect(created[0].computer).toBe(original[0].computer);
    expect(created[0].browser).toBe(original[0].browser);
    // The closed panel's callback must not close this newer one.
    await expect.poll(() => evaluate("document.querySelector('[data-orbit-new]')?.getAttribute('aria-busy')"), { timeout: 10_000 }).toBe("false");
    expect(await newBotOpen()).toBe(true);
    await press("Escape");
    await expect.poll(newBotOpen, { timeout: 10_000 }).toBe(false);
    await click(coder.name);
    await expect.poll(title, { timeout: 10_000 }).toBe(`Orbit — ${coder.name}`);

    // Real usage on the new bot, so its header chip and Usage panel have it.
    await runControlOrbit(["send", "--bot", created[0].id, "--text", "Reply briefly for the usage test.", "--url", info.url]);
    expect((await runControlOrbit(["wait", "--bot", created[0].id, "--timeout", "20", "--url", info.url]) as { status: string }).status).toBe("settled");
    await openTools();
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("No MCP servers added yet.");
    // The thread's usage chip opens the bot's Usage panel.
    const usageChip = async () => {
      const state = await ui("snapshot", "--interactive");
      const cost = Object.entries(state.refs as Record<string, { role: string; name: string }>)
        .filter(([, entry]) => entry.role === "button" && entry.name.includes("$0.01"));
      expect(cost).toHaveLength(1);
      await ui("click", "--ref", `@${cost[0][0]}`);
      await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-panel=usage]'))"), { timeout: 10_000 }).toBe(true);
    };
    await usageChip();
    // ⌘K finds a bot setting by name (the old settings search): Overview.
    await click("Search or jump · ⌘K");
    await ui("type", "--name", "Search bots, threads, settings and actions", "--text", "Overview");
    await expect.poll(async () => Object.values((await ui("snapshot", "--interactive")).refs as Record<string, { role: string; name: string }>)
      .some((entry) => entry.role === "button" && entry.name.startsWith("Overview")), { timeout: 10_000 }).toBe(true);
    await press("Enter");
    await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-panel=overview]'))"), { timeout: 10_000 }).toBe(true);
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("Optional ways to customize this bot. You can start chatting now.");
    await ui("screenshot", "--out", `${info.logPath}.settings.png`);
    await openTools();
    await click("Add an MCP server…");
    // The registry loads on mount; Paste config is disabled until it finishes.
    await expect.poll(() => evaluate("[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Paste config')?.disabled"), { timeout: 10_000 }).toBe(false);
    await click("Paste config");
    await expect.poll(() => evaluate("Boolean(document.querySelector('textarea[aria-label=\"Paste config\"]'))"), { timeout: 10_000 }).toBe(true);
    const pasted = await ui("snapshot", "--interactive");
    const textarea = Object.entries(pasted.refs as Record<string, { role: string; name: string }>)
      .find(([, entry]) => entry.role === "textbox" && entry.name === "Paste config");
    expect(textarea).toBeDefined();
    await ui("type", "--ref", `@${textarea![0]}`, "--text", JSON.stringify({ mcpServers: {
      fixture: { command: process.execPath, args: ["-e", "process.exit(0)"] },
    } }));
    await click("Add servers");
    const registry = async () => (await fetch(`${info.url}/api/mcp/servers`).then((response) => response.json())).servers;
    await expect.poll(registry, { timeout: 10_000 }).toMatchObject([{ name: "fixture", enabled: false }]);
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("Turn fixture on");
    await click("Turn fixture on");
    await expect.poll(registry, { timeout: 10_000 }).toMatchObject([{ name: "fixture", enabled: true }]);
    await press("Escape");
    await openTools();
    await expect.poll(() => evaluate("document.querySelector('[aria-label=\"Let this bot use fixture\"]')?.getAttribute('aria-checked')"), { timeout: 10_000 }).toBe("true");
    await click("Let this bot use fixture");
    await expect.poll(async () => (await bots()).find((bot) => bot.id === created[0].id)?.mcpServers, { timeout: 10_000 }).toEqual([]);
    await expect.poll(() => evaluate("document.querySelector('[aria-label=\"Let this bot use fixture\"]')?.getAttribute('aria-checked')"), { timeout: 10_000 }).toBe("false");

    // New bot from inside a bot's panel replaces the view; Esc leaves it.
    await press("Control+n");
    await expect.poll(newBotOpen, { timeout: 10_000 }).toBe(true);
    expect(await evaluate("Boolean(document.querySelector('[data-orbit-panel]'))")).toBe(false);
    await press("Escape");
    await expect.poll(newBotOpen, { timeout: 10_000 }).toBe(false);

    // Only this disposable page intercepts one profile PATCH. POST really
    // persists a bot, so recovery must show that bot instead of orphaning it.
    const beforeFailure = await bots();
    await evaluate(`(() => {
      const fetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const path = input instanceof Request ? input.url : String(input);
        if (init?.method === 'PATCH' && /\\/api\\/bots\\/[^/]+$/.test(path) && typeof init.body === 'string' && JSON.parse(init.body).soul) {
          window.fetch = fetch;
          return Promise.resolve(new Response(JSON.stringify({error:'Fixture preset rejected'}), {status:409, headers:{'content-type':'application/json'}}));
        }
        return fetch(input, init);
      };
      return true;
    })()`);
    const ops = BOT_ROLES.find((role) => role.id === "ops")!;
    await press("Control+n");
    await expect.poll(newBotOpen, { timeout: 10_000 }).toBe(true);
    await clickRole(ops.title);
    await expect.poll(async () => (await bots()).length, { timeout: 10_000 }).toBe(beforeFailure.length + 1);
    // The error shows over any view, and the new bot's profile opens where its
    // standing instructions can be finished.
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("Your bot was created, but its preset could not be fully applied.");
    expect((await bots()).filter((bot) => !beforeFailure.some((old) => old.id === bot.id))).toMatchObject([{ name: ops.name }]);
    await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-panel=profile]'))"), { timeout: 10_000 }).toBe(true);
    expect(await snapshot()).toContain("Standing instructions");
    await press("Escape");
    await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-panel]'))"), { timeout: 10_000 }).toBe(false);
    const logs = await ui("console");
    expect((logs.messages as Array<{ type: string; text: string }>).filter((entry) => entry.type === "error")).toEqual([]);
    await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
    expect(child.exitCode).toBe(0);
    expect(existsSync(info.dataDir)).toBe(false);
    expect(existsSync(info.logPath)).toBe(true);
  }, LAUNCH_TIMEOUT_MS + 300_000);
});
