import { spawn, type ChildProcess } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { waitForExit } from "../../server/testing/cleanup.ts";
import { runControlOrbit } from "../control-orbit.ts";
import { UI_TOOLS_DIR } from "./control-orbit-ui.ts";
import { fixtureApi } from "./preview-fixture.ts";

// The Orbit team map in the real renderer: every bot, team and You is a real
// control laid over the canvas (keyboard and screen readers reach them);
// moving a bot to another team keeps who it is and what it said; dragging a
// bot on the map is layout only and survives a reload; zoom and Fit work.

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const binary = resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const enabled = process.env.ORBIT_UI_E2E === "1" || Boolean(binary);
if (!enabled) console.info("skipping Orbit map UI e2e: set ORBIT_UI_E2E=1 to install the pinned browser");

type BotRecord = {
  id: string; name: string; title?: string; section?: string; threadId: string;
  modelSelection: { instanceId: string; model: string; effort?: string };
  tasks: Array<{ threadId: string; title: string; modelSelection?: unknown }>;
};

(enabled ? it : it.skip)("keeps bots and conversations whole while the map is navigated, rearranged and reorganised", async () => {
  let child: ChildProcess | undefined;
  let info: { ui: string; url: string; botId: string; logPath: string } | undefined;
  const receipts: Record<string, unknown> = { pointerInput: "synthetic pointer events on the canvas" };
  try {
    let stdout = "", stderr = "";
    child = spawn(process.execPath, ["--experimental-strip-types", join(ROOT, "scripts/control-orbit.ts"), "ui", "launch"], {
      cwd: ROOT, env: process.env, stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout!.on("data", (chunk: Buffer) => { stdout += String(chunk); });
    child.stderr!.on("data", (chunk: Buffer) => { stderr += String(chunk); });
    child.on("error", error => { stderr += error.message; });
    await expect.poll(() => {
      if (child!.exitCode !== null || child!.signalCode !== null) throw new Error(`UI launcher exited: ${stderr}`);
      try { info = JSON.parse(stdout); return Boolean(info?.ui); } catch { return false; }
    }, { timeout: binary ? 180_000 : 600_000, interval: 250 }).toBe(true);
    const fixture = info!;
    const api = fixtureApi(fixture.url);
    const ui = (verb: string, ...args: string[]) => runControlOrbit(["ui", verb, "--ui", fixture.ui, ...args]) as Promise<Record<string, any>>;
    const evaluate = async (js: string) => (await ui("eval", "--js", js)).result;
    const snapshot = async () => (await ui("snapshot")).snapshot as string;
    const focused = () => evaluate("document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim()");
    const title = () => evaluate("document.querySelector('.orbit-root span.pointer-events-none')?.textContent ?? null");
    const click = async (name: string, role?: string) => {
      let matches: Array<[string, { name: string; role: string }]> = [];
      await expect.poll(async () => {
        const refs = (await ui("snapshot")).refs as Record<string, { name: string; role: string }>;
        matches = Object.entries(refs).filter(([, entry]) => (role ? entry.role === role : ["button", "menuitem"].includes(entry.role)) && entry.name === name);
        return matches.length;
      }, { timeout: 10_000, message: `one ${role ?? "button/menuitem"} named ${name}` }).toBe(1);
      await ui("click", "--ref", `@${matches[0][0]}`);
    };
    const control = (...args: string[]) => runControlOrbit([...args, "--url", fixture.url]) as Promise<any>;
    const bots = async (): Promise<BotRecord[]> => (await api("GET", "/api/bots?messages=0")).bots;
    const savedBot = async (id: string) => (await bots()).find(bot => bot.id === id)!;
    const identity = (bot: BotRecord) => ({ id: bot.id, name: bot.name, title: bot.title, threadId: bot.threadId,
      modelSelection: bot.modelSelection, tasks: bot.tasks.map(task => ({ threadId: task.threadId, title: task.title, modelSelection: task.modelSelection })) });
    const messages = async (id: string) => (await control("messages", "--bot", id, "--limit", "10")).messages;
    const hitRect = (hit: string) => evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(`[data-orbit-hit="${hit}"]`)});
      if (!el || el.style.display === 'none') return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), w: Math.round(r.width) };
    })()`) as Promise<{ x: number; y: number; w: number } | null>;
    const settled = async (hit: string) => {
      let last: unknown = null;
      await expect.poll(async () => {
        const now = JSON.stringify(await hitRect(hit));
        const same = now !== "null" && now === last;
        last = now;
        return same;
      }, { timeout: 15_000, interval: 400 }).toBe(true);
      return (await hitRect(hit))!;
    };

    // Seed: two teams with Chiefs, an empty team, shared instructions, and a
    // real conversation to keep intact.
    await api("PATCH", `/api/bots/${fixture.botId}`, { name: "Ada", section: "Engineering", chiefOfStaff: true });
    const ben: BotRecord = (await api("POST", "/api/bots", { name: "Ben", title: "Build and review", section: "Engineering" })).bot;
    const cleo: BotRecord = (await api("POST", "/api/bots", { name: "Cleo", title: "Research coordinator", section: "Research" })).bot;
    await api("PATCH", `/api/bots/${cleo.id}`, { chiefOfStaff: true });
    await api("POST", "/api/bots", { name: "Dana", title: "Find supporting evidence", section: "Research" });
    await api("POST", "/api/sidebar-sections", { name: "Delivery" });
    const briefs: Array<[string, string]> = [["Engineering", "Keep the original engineering brief."], ["Research", "Keep the original research brief."], ["Delivery", "Review before shipping."]];
    for (const [section, text] of briefs) await api("PUT", `/api/section-context?section=${encodeURIComponent(section)}`, { text });
    await control("send", "--bot", ben.id, "--text", "Draft the release checklist.");
    expect(await control("wait", "--bot", ben.id, "--timeout", "30")).toMatchObject({ status: "settled" });
    const transcript = await messages(ben.id);
    const before = await bots();
    await evaluate("localStorage.removeItem('orbit.layout.v1'); location.reload(); true");

    // Every bot, team and You is a real, named control on the map.
    await expect.poll(snapshot, { timeout: 15_000 }).toContain('group "Team map"');
    const map = await snapshot();
    for (const name of ["You", "Ada", "Ben", "Cleo", "Dana", "Engineering team", "Research team", "Delivery team", "New bot in Delivery"]) {
      expect(map).toContain(`button "${name}"`);
    }
    receipts.map = map;

    // Keyboard: Tab reaches Ben, Enter opens his view, Esc goes back.
    await evaluate("document.body.focus(); true");
    for (let step = 0; step < 24 && await focused() !== "Ben"; step++) await ui("press", "--keys", "Tab");
    expect(await focused()).toBe("Ben");
    await ui("press", "--keys", "Enter");
    await expect.poll(title, { timeout: 10_000 }).toBe("Orbit — Ben");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('log "Conversation with Ben"');
    await ui("press", "--keys", "Escape");
    await expect.poll(title, { timeout: 10_000 }).toBe("Orbit — Team map");

    // Move Ben to Delivery from his ⋯ menu: his team changes, nothing else does.
    await click("Ben");
    await click("More");
    await click("Move to team");
    await click("Delivery");
    await expect.poll(async () => (await savedBot(ben.id)).section, { timeout: 10_000 }).toBe("Delivery");
    expect(identity(await savedBot(ben.id))).toEqual(identity(before.find(bot => bot.id === ben.id)!));
    expect(await messages(ben.id)).toEqual(transcript);
    for (const bot of before.filter(bot => bot.id !== ben.id)) expect(identity(await savedBot(bot.id))).toEqual(identity(bot));
    for (const [section, text] of briefs) expect((await api("GET", `/api/section-context?section=${encodeURIComponent(section)}`)).text).toBe(text);
    await click("Team map");

    // Dragging Ben on the canvas saves his place on the map, not his team.
    const start = await settled(`bot:${ben.id}`);
    receipts.dragFrom = start;
    await evaluate(`(async () => {
      const canvas = document.querySelector('canvas[data-orbit-canvas]');
      const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
      const at = (type, x, y, target) => (target ?? canvas).dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, clientX: x, clientY: y }));
      at('pointerdown', ${start.x}, ${start.y});
      for (let step = 1; step <= 8; step++) { at('pointermove', ${start.x} + step * 10, ${start.y} + step * 6, window); await frame(); }
      at('pointerup', ${start.x + 80}, ${start.y + 48}, window);
      return true;
    })()`);
    await expect.poll(() => evaluate(`(() => { const layout = JSON.parse(localStorage.getItem('orbit.layout.v1') ?? '{}'); return Boolean(layout.bots?.[${JSON.stringify(ben.id)}] || Object.keys(layout.teams ?? {}).length); })()`), { timeout: 5_000 }).toBe(true);
    const layout = await evaluate("localStorage.getItem('orbit.layout.v1')");
    receipts.layout = layout;
    expect((await savedBot(ben.id)).section).toBe("Delivery");
    expect(await messages(ben.id)).toEqual(transcript);
    const moved = await settled(`bot:${ben.id}`);
    expect(Math.hypot(moved.x - start.x, moved.y - start.y)).toBeGreaterThan(20);

    // Zoom in makes the map (and each bot's control) bigger; Fit brings it back.
    const beforeZoom = await settled(`bot:${ben.id}`);
    await click("Zoom in");
    const zoomed = await settled(`bot:${ben.id}`);
    expect(zoomed.w).toBeGreaterThan(beforeZoom.w);
    await click("Fit");
    const fitted = await settled(`bot:${ben.id}`);
    expect(Math.abs(fitted.w - beforeZoom.w)).toBeLessThanOrEqual(2);

    // The arrangement survives a reload.
    await evaluate("location.reload(); true");
    await expect.poll(snapshot, { timeout: 15_000 }).toContain('button "Ben"');
    expect(await evaluate("localStorage.getItem('orbit.layout.v1')")).toBe(layout);
    const reloaded = await settled(`bot:${ben.id}`);
    expect(Math.abs(reloaded.x - fitted.x)).toBeLessThanOrEqual(3);
    expect(Math.abs(reloaded.y - fitted.y)).toBeLessThanOrEqual(3);

    const screenshot = `${fixture.logPath}.orbit-map.png`;
    await ui("screenshot", "--out", screenshot);
    const consoleResult = await ui("console");
    expect((consoleResult.messages ?? []).filter((message: { type: string }) => message.type === "error")).toEqual([]);
    Object.assign(receipts, { screenshot, finalBots: (await bots()).map(identity) });
  } finally {
    if (info) {
      if (!receipts.screenshot) {
        try { receipts.failureSnapshot = await runControlOrbit(["ui", "snapshot", "--ui", info.ui]); } catch { /* keep the original failure */ }
      }
      const evidence = `${info.logPath}.orbit-map.json`;
      writeFileSync(evidence, JSON.stringify({ fixture: info, ...receipts }, null, 2));
      console.info(JSON.stringify({ evidence }));
    }
    await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
  }
}, binary ? 240_000 : 720_000);
