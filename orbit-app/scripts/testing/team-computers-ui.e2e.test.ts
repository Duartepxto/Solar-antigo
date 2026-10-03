import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { waitForExit } from "../../server/testing/cleanup.ts";
import { runControlOrbit } from "../control-orbit.ts";
import { UI_TOOLS_DIR } from "./control-orbit-ui.ts";
import { fixtureApi } from "./preview-fixture.ts";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const binary = resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const enabled = process.env.ORBIT_UI_E2E === "1" || Boolean(binary);
if (!enabled) console.info("skipping team computers UI e2e: set ORBIT_UI_E2E=1 to install the pinned browser");

type Info = { ui: string; url: string; botId: string; dataDir: string; logPath: string; boatFixtureApi: string };
type Computer = { id: string; name: string; section: string | null; state: string; problem?: string; held?: boolean };

(enabled ? it : it.skip)("creates and assigns a shared computer only after explicit UI actions", async () => {
  let child: ChildProcess | undefined;
  let info: Info | undefined;
  const evidence: Record<string, unknown> = { input: "real accessible clicks/keys; computer drag uses synthetic PointerEvents and native select changes use DOM events" };
  try {
    let stdout = "", stderr = "";
    child = spawn(process.execPath, ["--experimental-strip-types", join(ROOT, "scripts/testing/team-computers-preview.ts")], {
      cwd: ROOT, env: process.env, stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout!.on("data", (chunk: Buffer) => { stdout += String(chunk); });
    child.stderr!.on("data", (chunk: Buffer) => { stderr += String(chunk); });
    child.on("error", error => { stderr += error.message; });
    await expect.poll(() => {
      if (child!.exitCode !== null || child!.signalCode !== null) throw new Error(`Computer UI fixture exited: ${stderr}`);
      try { info = JSON.parse(stdout); return Boolean(info?.ui); } catch { return false; }
    }, { timeout: binary ? 180_000 : 600_000, interval: 250 }).toBe(true);
    const fixture = info!;
    const api = fixtureApi(fixture.url);
    const provider = fixtureApi(fixture.boatFixtureApi);
    const ui = (verb: string, ...args: string[]) => runControlOrbit(["ui", verb, "--ui", fixture.ui, ...args]) as Promise<Record<string, any>>;
    const evaluate = async (js: string) => (await ui("eval", "--js", js)).result;
    const snapshot = async () => (await ui("snapshot")).snapshot as string;
    const ref = async (name: string, role?: string) => {
      let match: [string, unknown] | undefined;
      await expect.poll(async () => {
        const refs = (await ui("snapshot")).refs as Record<string, { name: string; role: string }>;
        const matches = Object.entries(refs).filter(([, entry]) => entry.name === name && (role ? entry.role === role : ["button", "menuitem"].includes(entry.role)));
        match = matches[0]; return matches.length;
      }, { timeout: 10_000, message: `${role} ${name}` }).toBe(1);
      return `@${match![0]}`;
    };
    const click = async (name: string, role?: string) => ui("click", "--ref", await ref(name, role));
    const computers = async (): Promise<Computer[]> => (await api("GET", "/api/team-computers")).computers;
    const record = async (id: string) => (await computers()).find(computer => computer.id === id);
    const receipts = () => provider("GET", "/__fixture");
    const focused = () => evaluate("document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim()");
    // Orbit: a team's hub → Team computer → Manage team computers opens the
    // shared computers panel (create, assign, open, sleep).
    const openComputers = async (team: string) => {
      const back = await evaluate("Boolean(document.querySelector('button[aria-keyshortcuts=\"Escape\"]'))");
      if (back) await click("Team map");
      await expect.poll(snapshot, { timeout: 10_000 }).toContain(`button "${team} team"`);
      await click(`${team} team`);
      await click("Team computer");
      await click("Manage team computers");
      await expect.poll(snapshot).toContain('complementary "Team computers"');
    };
    await api("PATCH", `/api/bots/${fixture.botId}`, { name: "Ada", section: "Engineering", computer: "off" });
    await api("POST", "/api/sidebar-sections", { name: "Research" });
    await api("POST", "/api/bots", { name: "Ben", section: "Research", modelSelection: { instanceId: "claude", model: "claude-sonnet-5" } });
    const before = (await api("GET", "/api/bots?messages=10")).bots;
    await evaluate("location.reload(); true");
    await openComputers("Engineering");
    expect((await receipts()).calls.every((call: { method: string }) => call.method === "GET")).toBe(true);
    await click("New Boat computer");
    await expect.poll(() => evaluate("document.activeElement?.id")).toBe("canvas-computer-name");
    expect(await snapshot()).toContain("Your Boat plan and usage charges apply");
    expect(await evaluate("[...document.querySelectorAll('button')].find(button => button.textContent.trim() === 'Create Boat')?.disabled")).toBe(true);
    await ui("type", "--ref", await ref("New Boat computer", "textbox"), "--text", "Engineering desktop");
    expect((await receipts()).calls.every((call: { method: string }) => call.method === "GET")).toBe(true);
    await click("Create Boat");
    await expect.poll(async () => (await computers()).length, { timeout: 30_000 }).toBe(1);
    const machine = (await computers())[0];
    await expect.poll(async () => (await record(machine.id))?.state).toBe("idle");
    expect(machine.section).toBeNull();
    await expect.poll(snapshot).toContain("Engineering desktop");
    expect((await receipts()).calls.filter((call: { method: string; path: string }) => call.method === "POST" && call.path === "/boxes")).toHaveLength(1);

    // Assignment goes through the panel's own team menu, always confirmed.
    const selectTeam = async (value: string) => {
      await expect.poll(() => evaluate(`document.getElementById('computer-team-${machine.id}')?.disabled`)).toBe(false);
      await expect.poll(() => evaluate(`[...document.getElementById('computer-team-${machine.id}').options].some(option => option.value === ${JSON.stringify(value)})`)).toBe(true);
      await evaluate(`(() => { const select = document.getElementById('computer-team-${machine.id}');
        select.focus(); select.value = ${JSON.stringify(value)}; select.dispatchEvent(new Event('change', { bubbles: true })); return select.value; })()`);
    };
    await selectTeam("team:Engineering");
    await expect.poll(snapshot).toContain('alertdialog "Assign Engineering desktop to Engineering?"');
    await expect.poll(focused).toBe("Cancel");
    expect((await record(machine.id))?.section).toBeNull();
    await ui("press", "--keys", "Escape");
    expect((await record(machine.id))?.section).toBeNull();
    await selectTeam("team:Engineering");
    await expect.poll(focused).toBe("Cancel");
    await ui("press", "--keys", "Tab");
    expect(await focused()).toBe("Assign computer");
    await ui("press", "--keys", "Enter");
    await expect.poll(async () => (await record(machine.id))?.section).toBe("Engineering");
    await selectTeam("unassigned");
    await expect.poll(snapshot).toContain('alertdialog "Unassign Engineering desktop?"');
    await click("Unassign computer");
    await expect.poll(async () => (await record(machine.id))?.section).toBeNull();
    await selectTeam("team:Research");
    await expect.poll(snapshot).toContain('alertdialog "Assign Engineering desktop to Research?"');
    await click("Assign computer");
    await expect.poll(async () => (await record(machine.id))?.section).toBe("Research");
    expect((await api("GET", "/api/bots?messages=10")).bots).toEqual(before);
    expect(JSON.parse(readFileSync(join(fixture.dataDir, "team-computers.json"), "utf8")).computers)
      .toContainEqual(expect.objectContaining({ id: machine.id, section: "Research", name: machine.name }));
    await click("Close computers");
    await expect.poll(snapshot, { timeout: 10_000 }).not.toContain('complementary "Team computers"');
    // Ben's own computer system reads the team default it now inherits.
    await click("Team map");
    await click("Ben");
    await click("Computer");
    await click("Open the computer panel");
    await expect.poll(snapshot, { timeout: 10_000 }).toContain("Ben's screen");
    await expect.poll(snapshot, { timeout: 20_000, interval: 250 }).toContain("Team default");
    expect(await snapshot()).toContain("Engineering desktop");
    expect(await snapshot()).not.toContain("Choose Cloud");
    expect((await receipts()).calls.filter((call: { method: string; path: string }) => call.method === "POST" && call.path === "/boxes")).toHaveLength(1);
    await evaluate("location.reload(); true");
    await openComputers("Research");
    await expect.poll(snapshot).toContain("Engineering desktop");
    await click("Open desktop");
    await expect.poll(snapshot).toContain("Open secure desktop");
    expect((await record(machine.id))?.held).toBe(true);
    const secureLink = await evaluate("[...document.querySelectorAll('a')].find(link => link.textContent.includes('Open secure desktop'))?.href");
    expect(secureLink).toMatch(/^https:\/\/desktop\.invalid\/bx_/);
    await click("Return to bots");
    await expect.poll(async () => (await record(machine.id))?.held === true).toBe(false);
    await click("Sleep");
    await expect.poll(async () => (await record(machine.id))?.state).toBe("archived");
    await provider("POST", "/__fixture", { refuseCreate: true });
    await click("New Boat computer");
    await ui("type", "--ref", await ref("New Boat computer", "textbox"), "--text", "Retry desktop");
    await click("Create Boat");
    await expect.poll(snapshot, { timeout: 20_000 }).toContain("Fixture account is rate-limited");
    const retry = (await computers()).find(computer => computer.name === "Retry desktop")!;
    expect(retry).toBeDefined();
    expect(retry.section).toBeNull();
    await provider("POST", "/__fixture", { refuseCreate: false });
    // Reusing the still-open creation form retries the durable request ID.
    await click("Create Boat");
    await expect.poll(async () => (await record(retry.id))?.state, { timeout: 30_000 }).toBe("idle");
    expect(await computers()).toHaveLength(2);
    const providerResult = await receipts();
    expect(providerResult.boats).toHaveLength(2);
    expect(providerResult.calls.some((call: { method: string }) => call.method === "DELETE")).toBe(false);
    Object.assign(evidence, { computers: await computers(), provider: providerResult, finalSnapshot: await snapshot() });
    await ui("screenshot", "--out", `${fixture.logPath}.team-computers.png`);
  } finally {
    try {
      if (info) {
        try { evidence.finalUi = await runControlOrbit(["ui", "snapshot", "--ui", info.ui]); } catch { /* keep original failure */ }
        const path = `${info.logPath}.team-computers.json`;
        writeFileSync(path, JSON.stringify({ fixture: info, ...evidence }, null, 2), { mode: 0o600 });
        console.info(JSON.stringify({ evidence: path }));
      }
    } finally {
      await waitForExit(child, { signal: "SIGINT", graceMs: 30_000 });
      if (info) expect(existsSync(info.dataDir)).toBe(false);
    }
  }
}, binary ? 300_000 : 720_000);
