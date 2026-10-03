// Attaching to the person's logged-in browser always reaches the person.
// Real server, fake Claude engine, a reachable CUA descriptor (nothing is
// ever started or controlled): a Full access bot's host computer is mounted
// through the gate, then both doors are driven — the engine's own ask on the
// permission broker, and the host gate's check before a tools/call.
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { connect, type Socket } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BROWSER_PROFILE_DENIED, BROWSER_PROFILE_REQUEST_PREFIX } from "./browser-profile-consent.ts";
import { freePortBlock } from "./testing/ports.ts";
import { removeTempDir, waitForExit } from "./testing/cleanup.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
// Auto lands on the person's own desktop only on macOS and Windows.
const describeHost = process.platform === "linux" ? describe.skip : describe;

describeHost("logged-in browser consent (real server, fake engine)", () => {
  let home = "";
  let data = "";
  let dumpFile = "";
  let finishFile = "";
  let output = "";
  let child: ChildProcess | null = null;
  let base = "";
  const sockets: Socket[] = [];
  const BOT_ID = "full-browser-bot";

  const api = async (method: string, path: string, body?: unknown) => {
    const response = await fetch(base + path, {
      method, headers: { "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, body: await response.json() as any };
  };
  async function until<T>(read: () => T | Promise<T>, accept: (value: T) => boolean): Promise<T> {
    const end = Date.now() + 20_000;
    for (;;) {
      const value = await read();
      if (accept(value)) return value;
      if (Date.now() >= end) throw new Error(`Fixture wait expired: ${JSON.stringify(value)}\n${output.slice(-2_000)}`);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  }
  const messages = async (threadId: string): Promise<any[]> => {
    const bots = (await api("GET", "/api/bots?messages=60")).body.bots;
    const bot = bots.find((candidate: any) => candidate.id === BOT_ID);
    return threadId === bot.threadId ? bot.messages : (await api("GET", `/api/threads/${threadId}/messages`)).body.messages ?? [];
  };

  beforeAll(async () => {
    home = mkdtempSync(join(tmpdir(), "orbit-bp-"));
    data = join(home, "data");
    const ui = join(home, "static");
    const stateFile = join(home, "vm.json");
    dumpFile = join(home, "dump.json");
    finishFile = join(home, "finish");
    writeFileSync(stateFile, JSON.stringify({ noContainers: true }));
    mkdirSync(data);
    mkdirSync(join(ui, "assets"), { recursive: true });
    writeFileSync(join(ui, "index.html"), "<title>Browser consent</title>");
    writeFileSync(join(ui, "assets", "test.css"), "body{}");
    mkdirSync(join(home, "user-data"), { recursive: true });
    writeFileSync(join(home, "user-data", "cua-connection.json"), JSON.stringify({
      mode: "embedded", status: "ready", socketPath: join(home, "cua.sock"),
      mcpCommand: "/fixture/cua-driver", mcpArgs: ["mcp"], mcpEnv: {},
    }), { mode: 0o600 });
    writeFileSync(join(data, "config.json"), JSON.stringify({ instances: { claude: {
      driver: "claudeAgent", config: { cli: join(ROOT, "server/testing/fake-claude-cli.ts") },
      environment: { FAKE_CLAUDE_MODE: "slow", FAKE_CLAUDE_DUMP: dumpFile, FAKE_CLAUDE_SLOW_FINISH_GATE: finishFile },
    } } }));
    // Full access is the person's own grant; seeded the way a trusted
    // desktop leaves it on disk.
    writeFileSync(join(data, "bots.json"), JSON.stringify([{
      id: BOT_ID, threadId: "full-browser-thread", name: "Scout", title: "", description: "",
      notifications: true, color: "blue", unread: false,
      modelSelection: { instanceId: "claude", model: "claude-sonnet-4-5" },
      resumeCursors: {}, createdAt: 1, approvalMode: "full", autoApprove: false,
    }]));

    const port = await freePortBlock([0, 1]);
    base = `http://127.0.0.1:${port}`;
    const proc = spawn(process.execPath, ["--import", pathToFileURL(join(ROOT, "server/testing/group-local-vm-hooks.mjs")).href, join(ROOT, "server/index.ts")], {
      cwd: ROOT, env: {
        PATH: dirname(process.execPath), ...(process.env.SystemRoot ? { SystemRoot: process.env.SystemRoot } : {}),
        HOME: home, USERPROFILE: home, ORBIT_DATA_DIR: data,
        APPDATA: join(home, "appdata"), LOCALAPPDATA: join(home, "localappdata"),
        TEMP: home, TMP: home, TMPDIR: home,
        ORBIT_PORT: String(port), ORBIT_WEBHOOK_PORT: String(port + 1), ORBIT_STATIC_DIR: ui, ORBIT_TEST_VM_STATE: stateFile,
        ORBIT_USER_DATA: join(home, "user-data"),
      }, stdio: ["ignore", "pipe", "pipe"],
    });
    child = proc;
    proc.stdout!.on("data", chunk => { output += chunk; });
    proc.stderr!.on("data", chunk => { output += chunk; });
    await until(async () => {
      if (proc.exitCode !== null) throw new Error(`server exited during boot:\n${output}`);
      try { return (await fetch(base + "/api/health")).ok; } catch { return false; }
    }, Boolean);
  });
  afterAll(async () => {
    for (const socket of sockets) socket.destroy();
    if (child) {
      writeFileSync(finishFile, "finish");
      await waitForExit(child, { signal: "SIGTERM" });
    }
    if (home) await removeTempDir(home);
  });

  it("never lets Full access answer it, and one Allow covers only this conversation's window", async () => {
    const bot = (await api("GET", "/api/bots")).body.bots.find((candidate: any) => candidate.id === BOT_ID);
    expect(bot.approvalMode).toBe("full");
    const threadId = bot.threadId;
    expect((await api("POST", `/api/bots/${BOT_ID}/messages`, { text: "Check my inbox in my browser." })).status).toBe(202);
    const sent: any = await until((): any => {
      if (!existsSync(dumpFile)) return null;
      try {
        const dump = JSON.parse(readFileSync(dumpFile, "utf8"));
        return dump.mcpConfig?.mcpServers?.computer?.env?.ORBIT_CONTROL_URL?.includes(BOT_ID) ? dump : null;
      } catch { return null; }
    }, Boolean);
    const computer = sent.mcpConfig.mcpServers.computer;
    expect(computer.args.some((arg: string) => arg.includes("local-computer-proxy"))).toBe(true);
    const gateUrl = new URL(computer.env.ORBIT_CONTROL_URL);
    gateUrl.pathname += "/browser-profile";
    const askGate = (body: unknown) => fetch(gateUrl, {
      method: "POST",
      headers: { authorization: `Bearer ${computer.env.ORBIT_CONTROL_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(response => response.json() as Promise<any>);

    // Door 1: the engine asks on its permission broker, in Full access.
    const brokerPath = sent.mcpConfig.mcpServers.ogb.args[1];
    const conn = connect(brokerPath);
    sockets.push(conn);
    const brokerAnswer = new Promise<any>((resolve) => {
      let buffer = "";
      conn.on("data", (chunk) => {
        buffer += chunk;
        const newline = buffer.indexOf("\n");
        if (newline !== -1) resolve(JSON.parse(buffer.slice(0, newline)));
      });
    });
    await new Promise<void>((resolve, reject) => { conn.on("connect", resolve); conn.on("error", reject); });
    conn.write(JSON.stringify({
      t: "ask", id: "ask-browser", tool: "mcp__computer__browser_prepare",
      input: { pid: 999_999, window_id: 5, strategy: { kind: "existing_profile" } },
    }) + "\n");
    const engineCard: any = await until(async () => (await messages(threadId)).find((m) => m.card?.requestId === "ask-browser")?.card, Boolean);
    expect(engineCard).toMatchObject({
      title: "Use your logged-in browser?",
      subtitle: "Scout wants to control the browser window you have open, signed in as you: it can act on any site you're logged into. Allow for this conversation?",
      browserProfile: { browser: "browser", botName: "Scout", pid: 999_999, windowId: 5 },
      heldCode: "approval.held.browserProfile",
      approvalScope: "local-computer",
    });
    expect(engineCard.answered).toBeUndefined();
    expect(engineCard.allowSession).toBeUndefined();
    expect((await messages(threadId)).some((m) => /full access\)/.test(m.tool?.name ?? ""))).toBe(false);
    // "Always" is not honored for this card.
    expect((await api("POST", `/api/threads/${threadId}/respond`, { requestId: "ask-browser", behavior: "allow", always: true })).status).toBe(200);
    const delivered = await brokerAnswer;
    expect(delivered).toMatchObject({ behavior: "allow" });
    expect(delivered).not.toHaveProperty("always");

    // The gate now finds this conversation's grant for that window…
    await expect(askGate({ pid: 999_999, windowId: 5 })).resolves.toEqual({ allowed: true });

    // Door 2: …but another window needs its own answer, on the gate's own card.
    const pending = askGate({ pid: 999_999, windowId: 6 });
    const gateCard: any = await until(async () => (await messages(threadId)).find((m) =>
      m.card?.requestId?.startsWith(BROWSER_PROFILE_REQUEST_PREFIX) && m.card.browserProfile?.windowId === 6)?.card, Boolean);
    expect(gateCard).toMatchObject({ title: "Use your logged-in browser?", tool: "browser_prepare", heldCode: "approval.held.browserProfile" });
    expect(gateCard.allowSession).toBeUndefined();
    expect((await api("POST", `/api/threads/${threadId}/respond`, { requestId: gateCard.requestId, behavior: "deny" })).body)
      .toMatchObject({ ok: true, outcome: "rejected" });
    await expect(pending).resolves.toEqual({ allowed: false, message: BROWSER_PROFILE_DENIED });
    const settled = (await messages(threadId)).find((m) => m.card?.requestId === gateCard.requestId).card;
    expect(settled).toMatchObject({ answered: "deny" });

    // An allowed gate card grants that window for the conversation.
    const again = askGate({ pid: 999_999, windowId: 7 });
    const allowCard: any = await until(async () => (await messages(threadId)).find((m) =>
      m.card?.browserProfile?.windowId === 7 && !m.card.answered)?.card, Boolean);
    await api("POST", `/api/bots/${BOT_ID}/respond`, { requestId: allowCard.requestId, behavior: "allow" });
    await expect(again).resolves.toEqual({ allowed: true });
    await expect(askGate({ pid: 999_999, windowId: 7 })).resolves.toEqual({ allowed: true });

    writeFileSync(finishFile, "finish");
  });
});
