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

// A bot's thread menu (the "N more ▾" chip in its chat header) in the real
// renderer: archiving folds a thread under "Archived (n)" and restoring
// brings it back; a folder's ⋯ moves it among the bot's folders and marks
// its threads read. Each is checked against what the server saved.

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const binary = resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const enabled = process.env.ORBIT_UI_E2E === "1" || Boolean(binary);
if (!enabled) console.info("skipping thread menu UI e2e: set ORBIT_UI_E2E=1 to install the pinned browser");

type Task = { threadId: string; title: string; projectId?: string; archivedAt?: number; unread?: boolean };
type BotRecord = { id: string; threadId: string; tasks: Task[]; projects?: Array<{ id: string; name: string }> };

(enabled ? it : it.skip)("archives, restores and organises threads from the bot's thread menu", async () => {
  let child: ChildProcess | undefined;
  let info: { ui: string; url: string; botId: string; logPath: string } | undefined;
  const receipts: Record<string, unknown> = {};
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
    const bot = async (): Promise<BotRecord> => (await api("GET", "/api/bots?messages=0")).bots.find((b: BotRecord) => b.id === fixture.botId);
    const task = async (threadId: string) => (await bot()).tasks.find((t) => t.threadId === threadId)!;
    const openMenu = async () => {
      if (await evaluate("Boolean(document.querySelector('[data-orbit-thread-menu]'))")) return;
      await click("All threads");
      await expect.poll(() => evaluate("Boolean(document.querySelector('[data-orbit-thread-menu]'))"), { timeout: 5_000 }).toBe(true);
    };

    // Seed: two folders, a thread in each, and two loose threads.
    const id = fixture.botId;
    const research = (await api("POST", `/api/bots/${id}/projects`, { name: "Research" })).project;
    const launch = (await api("POST", `/api/bots/${id}/projects`, { name: "Launch" })).project;
    const newThread = async (title: string, projectId?: string) => {
      const created: BotRecord = (await api("POST", `/api/bots/${id}/tasks`, projectId ? { projectId } : {})).bot;
      await api("PATCH", `/api/bots/${id}/tasks/${created.threadId}`, { title });
      return created.threadId;
    };
    const notes = await newThread("Field notes", research.id);
    await newThread("Launch checklist", launch.id);
    const draft = await newThread("Old draft");
    const current = await newThread("Today");
    // A reply that lands in a thread nobody is looking at leaves it unread.
    await control("send", "--bot", id, "--task", notes, "--text", "Summarise the field notes.");
    expect(await control("wait", "--bot", id, "--task", notes, "--timeout", "30")).toMatchObject({ status: "settled" });
    await api("POST", `/api/bots/${id}/tasks/${current}`, {});
    await expect.poll(async () => (await task(notes)).unread, { timeout: 10_000 }).toBe(true);

    await evaluate("location.reload(); true");
    await expect.poll(snapshot, { timeout: 15_000 }).toContain('group "Team map"');
    await evaluate(`document.querySelector('[data-orbit-hit="bot:${id}"]').click(); true`);
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('button "All threads"');

    // Archive a loose thread: it leaves the list for "Archived (1)".
    await openMenu();
    await click("Archive · Old draft");
    await expect.poll(async () => typeof (await task(draft)).archivedAt, { timeout: 10_000 }).toBe("number");
    await expect.poll(snapshot, { timeout: 5_000 }).toContain('button "Archived (1)"');
    expect(await evaluate("[...document.querySelectorAll('[data-orbit-thread-menu] button')].some(b => b.textContent.trim() === 'Old draft')")).toBe(false);

    // Restore it from the disclosure.
    await click("Archived (1)");
    await click("Unarchive · Old draft");
    await expect.poll(async () => (await task(draft)).archivedAt ?? null, { timeout: 10_000 }).toBeNull();
    await expect.poll(snapshot, { timeout: 5_000 }).not.toContain("Archived (1)");

    // Move the Research folder below Launch.
    const before = (await bot()).projects!.map((p) => p.id);
    expect(before).toEqual([research.id, launch.id]);
    await click("Actions for Research folder");
    await click("Move folder down", "menuitem");
    await expect.poll(async () => (await bot()).projects!.map((p) => p.id), { timeout: 10_000 }).toEqual([launch.id, research.id]);

    // Mark the Research folder read: only its unread thread changes.
    await openMenu();
    await click("Actions for Research folder");
    await click("Mark folder as read", "menuitem");
    await expect.poll(async () => (await task(notes)).unread ?? false, { timeout: 10_000 }).toBe(false);
    expect((await bot()).threadId).toBe(current);

    const screenshot = `${fixture.logPath}.thread-menu.png`;
    await ui("screenshot", "--out", screenshot);
    const consoleResult = await ui("console");
    expect((consoleResult.messages ?? []).filter((message: { type: string }) => message.type === "error")).toEqual([]);
    Object.assign(receipts, { screenshot, finalTasks: (await bot()).tasks, projects: (await bot()).projects });
  } finally {
    if (info) {
      if (!receipts.screenshot) {
        try { receipts.failureSnapshot = await runControlOrbit(["ui", "snapshot", "--ui", info.ui]); } catch { /* keep the original failure */ }
      }
      const evidence = `${info.logPath}.thread-menu.json`;
      writeFileSync(evidence, JSON.stringify({ fixture: info, ...receipts }, null, 2));
      console.info(JSON.stringify({ evidence }));
    }
    await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
  }
}, binary ? 240_000 : 720_000);
