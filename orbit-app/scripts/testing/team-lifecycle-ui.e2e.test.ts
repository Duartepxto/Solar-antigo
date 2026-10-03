import { spawn, type ChildProcess } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { waitForExit } from "../../server/testing/cleanup.ts";
import { runControlOrbit } from "../control-orbit.ts";
import { request } from "../mcp-server.ts";
import { UI_TOOLS_DIR } from "./control-orbit-ui.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const binary = resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const enabled = process.env.ORBIT_UI_E2E === "1" || Boolean(binary);
if (!enabled) console.log("skipping team lifecycle UI e2e: set ORBIT_UI_E2E=1 to install the pinned browser");

(enabled ? it : it.skip)("creates an empty team, moves bots, and manages shared instructions in the renderer", async () => {
  let child: ChildProcess | undefined;
  let fixtureHandle: string | undefined;
  let fixtureLog: string | undefined;
  let succeeded = false;
  try {
    let stdout = "", stderr = "";
    let info: { ui: string; url: string; botId: string; logPath: string };
    child = spawn(process.execPath, ["--experimental-strip-types", join(ROOT, "scripts/control-orbit.ts"), "ui", "launch"], {
      cwd: ROOT, env: process.env, stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout!.on("data", (chunk: Buffer) => { stdout += String(chunk); });
    child.stderr!.on("data", (chunk: Buffer) => { stderr += String(chunk); });
    child.on("error", (error) => { stderr += error.message; });
    await expect.poll(() => {
      if (child!.exitCode !== null || child!.signalCode !== null) throw new Error(`UI launcher exited: ${stderr}`);
      try { info = JSON.parse(stdout); return Boolean(info.ui); } catch { return false; }
    }, { timeout: binary ? 180_000 : 600_000, interval: 250 }).toBe(true);
    fixtureHandle = info!.ui;
    fixtureLog = info!.logPath;
    const ui = (verb: string, ...args: string[]) => runControlOrbit(["ui", verb, "--ui", info.ui, ...args]) as Promise<Record<string, any>>;
    const target = async (name: string, roles: string[]) => {
      let matches: Array<[string, { name: string; role: string }]> = [];
      await expect.poll(async () => {
        const { refs } = await ui("snapshot");
        matches = Object.entries(refs as Record<string, { name: string; role: string }>).filter(([, element]) => element.name === name && roles.includes(element.role));
        return matches.length;
      }, { timeout: 10_000, message: `one ${roles.join("/")} named ${name}` }).toBe(1);
      return `@${matches[0][0]}`;
    };
    const click = async (name: string) => {
      try { return await ui("click", "--ref", await target(name, ["button", "checkbox", "menuitem"])); }
      catch (error) { throw new Error(`Click ${name}: ${error}\n${(await ui("snapshot")).snapshot}`); }
    };
    const type = async (name: string, text: string) => {
      const ref = await target(name, ["textbox"]);
      await ui("click", "--ref", ref);
      // The browser's type action focuses again and collapses selections.
      // Clear through the native input event first, including on rename.
      await ui("eval", "--js", "(() => { const input = document.activeElement; if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) throw new Error('Expected focused input'); input.select(); return true; })()");
      await ui("press", "--keys", "Backspace");
      return ui("type", "--ref", ref, "--text", text);
    };
    const snapshot = async () => (await ui("snapshot")).snapshot as string;
    const api = (path: string, method = "GET", body?: unknown) => request(path, { method,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) }, info.url);
    const control = (...args: string[]) => runControlOrbit([...args, "--url", info.url]);
    const a = (await control("new-bot", "--name", "Researcher", "--section", "Research") as any).bot;
    const b = (await control("new-bot", "--name", "Engineer", "--section", "Engineering") as any).bot;

    // Orbit: ⌘K → Create team; the new team shows on the map as "Delivery team"
    await click("Search or jump · ⌘K");
    await ui("type", "--name", "Search bots, threads, settings and actions", "--text", "Create team");
    await click("Create team");
    await type("Team name", "Delivery");
    await click("Create team");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('button "Delivery team"');
    expect((await api("/api/bots?messages=0")).sections).toContain("Delivery");
    // the team hub: Members → Add bots moves existing bots in
    await click("Delivery team");
    await click("Members");
    await click("Add bots");
    await click("Researcher");
    await click("Engineer");
    // an existing team's dialog manages its members: ticked bots join on Save
    await click("Save");
    await expect.poll(async () => (await api("/api/bots?messages=0")).bots.filter((bot: any) => bot.section === "Delivery").length).toBe(2);
    // Instructions are edited inline in the team hub
    await click("Instructions");
    await type("Delivery shared instructions", "Research first, then build and review.");
    await click("Save shared instructions");
    await expect.poll(async () => (await api("/api/section-context?section=Delivery")).text, { timeout: 10_000 }).toBe("Research first, then build and review.");

    await ui("eval", "--js", "location.reload(); true");
    await expect.poll(snapshot, { timeout: 15_000 }).toContain('button "Delivery team"');
    await click("Delivery team");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('textbox "Delivery shared instructions"');
    // A second fixture client moves the bots out. SSE must keep the empty
    // team visible and make rename/delete available without a reload.
    await api("/api/sidebar-sections", "POST", { name: "", botIds: [a.id, b.id] });
    await click("Members");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("Rename Delivery team");
    await click("Rename Delivery team");
    await type("Team name", "Launch");
    await click("Save name");
    // the renamed team is a new place on the map; its instructions came along
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('button "Launch team"');
    await click("Launch team");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('textbox "Launch shared instructions"');
    expect((await api("/api/section-context?section=Launch")).text).toBe("Research first, then build and review.");
    const screenshot = join(ROOT, ".orbit-scratch", "verify-evidence", "team-lifecycle.png");
    await ui("screenshot", "--out", screenshot);
    await click("Members");
    await click("Delete Launch team");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain('alertdialog "Delete Launch team?"');
    await click("Delete team");
    await expect.poll(async () => (await api("/api/bots?messages=0")).sections.includes("Launch")).toBe(false);
    const consoleResult = await ui("console");
    expect(JSON.stringify(consoleResult)).not.toMatch(/Uncaught|ReferenceError/);
    console.info(JSON.stringify({ fixture: info!, screenshot, emptyTeam: true, multiBotMove: true, reload: true, renameAndDelete: true }));
    succeeded = true;
  } finally {
    if (!succeeded && fixtureHandle && fixtureLog) {
      try {
        const result = await runControlOrbit(["ui", "snapshot", "--ui", fixtureHandle]);
        writeFileSync(`${fixtureLog}.team-lifecycle-failure.json`, JSON.stringify(result, null, 2));
        await runControlOrbit(["ui", "screenshot", "--ui", fixtureHandle, "--out", `${fixtureLog}.team-lifecycle-failure.png`]);
        console.info(JSON.stringify({ failureEvidence: `${fixtureLog}.team-lifecycle-failure.json` }));
      } catch { /* The original failure remains authoritative if the browser stopped. */ }
    }
    await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
  }
}, binary ? 180_000 : 720_000);
