import { execFile } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createServer, request as proxyRequest } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { promisify } from "node:util";
import { expect, it } from "vitest";
import { launchVerificationServer, runControlOrbit } from "../control-orbit.ts";
import { closeBrowserSession, resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { removeTempDir } from "../../server/testing/cleanup.ts";
import { TOUR_STEPS } from "../../src/lib/guided-tour";
import { WELCOME_VERSION } from "../../src/lib/onboarding";
import { ensureUiBrowser, sessionEnv, UI_TOOLS_DIR } from "./control-orbit-ui.ts";
import { fixtureApi, REPO_ROOT } from "./preview-fixture.ts";

const enabled = process.env.ORBIT_UI_E2E === "1" || !!resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
const execute = promisify(execFile);
const evidence = join(REPO_ROOT, ".orbit-scratch", "verify-evidence", "workspace-v2-app");

// Exercise the production renderer against the owned fake-engine server.
// Avoid a dev-server compile and HMR/SSE navigation race in this app-wide test.
async function productionPreview(fixtureUrl: string) {
  const root = resolve(REPO_ROOT, "dist");
  if (!existsSync(join(root, "index.html"))) throw new Error("Build the Solar renderer before this integration test");
  const mime: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".woff2": "font/woff2" };
  const server = createServer((req, res) => {
    const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
    if (pathname.startsWith("/api/") || pathname.startsWith("/.well-known/")) {
      const target = new URL(req.url ?? "/", fixtureUrl);
      const upstream = proxyRequest(target, { method: req.method, headers: { ...req.headers, host: target.host } }, reply => {
        res.writeHead(reply.statusCode ?? 502, reply.headers); reply.pipe(res);
      });
      upstream.on("error", () => { if (!res.headersSent) res.writeHead(502); res.end(); });
      req.on("aborted", () => upstream.destroy());
      req.pipe(upstream);
      return;
    }
    const file = resolve(root, pathname === "/" ? "index.html" : `.${decodeURIComponent(pathname)}`);
    if (!file.startsWith(root + sep) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.setHeader("content-type", mime[extname(file)] ?? "application/octet-stream");
    res.end(readFileSync(file));
  });
  await new Promise<void>(done => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No integration preview address");
  return { previewUrl: `http://127.0.0.1:${address.port}/`, close: async () => {
    server.closeAllConnections(); await new Promise<void>(done => server.close(() => done()));
  } };
}

it.skipIf(!enabled)("opens the existing bot conversation from the 3D workspace without sending a message", async () => {
  const { binary, chrome } = await ensureUiBrowser();
  const session = await launchVerificationServer();
  const home = mkdtempSync(join(tmpdir(), "workspace-v2-browser-"));
  mkdirSync(join(home, "tmp"));
  const sockets = mkdtempSync(join(tmpdir(), "wv2-"));
  const env = { ...sessionEnv({ home, session: `wv2-app-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: sockets,
    // This fixture loads the complete application, including the original
    // chat UI. A cold Vite transform can exceed the CLI's 25-second default.
    AGENT_BROWSER_DEFAULT_TIMEOUT: "60000" };
  const browser = async (...args: string[]) => {
    const { stdout } = await execute(binary, [...args, "--json"], { env, timeout: 90_000, windowsHide: true, maxBuffer: 4_194_304 })
      .catch((error: { message?: string; code?: string | number; signal?: string; stdout?: string; stderr?: string }) => {
        throw new Error(`${args[0]} failed (${error.code ?? error.signal ?? "unknown"}): ${error.message ?? ""}\n${error.stdout ?? ""}\n${error.stderr ?? ""}`.slice(0, 4000));
      });
    const value = JSON.parse(stdout);
    expect(value.success, stdout).toBe(true);
    return value.data;
  };
  const evalJs = async (js: string) => (await browser("eval", js)).result;
  const waitFor = (js: string) => browser("wait", "--fn", js);
  const api = fixtureApi(session.info.url);
  let preview: Awaited<ReturnType<typeof productionPreview>> | undefined;
  try {
    mkdirSync(evidence, { recursive: true });
    await api("PATCH", "/api/config", { language: "en", onboarding: {
      completedAt: new Date().toISOString(), version: WELCOME_VERSION, reelSeen: true,
      hintsSeen: [...TOUR_STEPS.map(step => step.id), "spot.composer", "spot.model", "spot.approval"],
    } });
    const created = await runControlOrbit(["new-bot", "--name", "Garden conversation", "--section", "Fixture garden", "--url", session.info.url]) as { bot: { id: string } };
    const before = (await api("GET", "/api/bots")).bots.find((bot: { id: string }) => bot.id === created.bot.id);
    expect(before.messages.length).toBeGreaterThan(0);
    const greeting = before.messages.find((message: { role: string; kind: string }) => message.role === "bot" && message.kind === "text");
    expect(greeting).toBeDefined();
    preview = await productionPreview(session.info.url);
    try {
      await browser("open", `${preview.previewUrl}?fixture=keep#garden`);
    } catch (error) {
      // Navigation can report a load timeout while the SSE-backed app has
      // already rendered. Recover only if the real entry is present below.
      if (!(error instanceof Error) || !error.message.includes("Operation timed out")) throw error;
      writeFileSync(join(evidence, "navigation.json"), JSON.stringify({
        error: error.message, snapshot: await browser("snapshot"),
        console: await browser("console"), errors: await browser("errors"),
      }, null, 2));
    }
    await browser("set", "viewport", "1280", "820");
    await waitFor("Boolean(document.querySelector('.workspace-v2-entry'))");
    await evalJs("history.replaceState({ fixtureState: 'preserved' }, '', location.href); true");
    await browser("find", "role", "link", "click", "--name", "Explore the 3D workspace preview");
    await waitFor("new URLSearchParams(location.search).get('workspace') === 'v2' && Boolean(document.querySelector('.workspace-v2'))");
    expect(await evalJs("({ fixture: new URLSearchParams(location.search).get('fixture'), hash: location.hash })")).toEqual({ fixture: "keep", hash: "#garden" });
    expect(await evalJs("history.state.fixtureState")).toBe("preserved");
    // The view is available before the server's first agent snapshot.
    await waitFor(`Boolean(document.querySelector('[data-agent-id="${created.bot.id}"]'))`);
    await browser("find", "role", "button", "click", "--name", "Select Garden conversation");
    await browser("find", "role", "button", "click", "--name", "Open conversation");
    const chat = `document.querySelector('[role="log"][aria-label="Conversation with Garden conversation"]')`;
    await waitFor(`!new URLSearchParams(location.search).has('workspace') && Boolean(${chat}?.textContent.includes(${JSON.stringify(greeting.text)}))`);
    expect(await evalJs(`${chat}.textContent.includes(${JSON.stringify(greeting.text)})`)).toBe(true);
    expect(await evalJs("document.querySelector('.workspace-v2')")).toBe(null);
    expect(await evalJs("({ fixture: new URLSearchParams(location.search).get('fixture'), hash: location.hash })")).toEqual({ fixture: "keep", hash: "#garden" });
    await browser("screenshot", join(evidence, "conversation.png"));

    // Browser history changes the workspace view without refreshing App or
    // creating a new turn. Forward restores the same conversation column.
    await evalJs("history.back(); true");
    await waitFor("new URLSearchParams(location.search).get('workspace') === 'v2' && Boolean(document.querySelector('.workspace-v2'))");
    await browser("screenshot", join(evidence, "history-back.png"));
    await evalJs("history.forward(); true");
    await waitFor("!new URLSearchParams(location.search).has('workspace') && Boolean(document.querySelector('.workspace-v2-entry')) && !document.querySelector('.workspace-v2')");
    await waitFor(`Boolean(${chat}?.textContent.includes(${JSON.stringify(greeting.text)}))`);
    expect(await evalJs(`${chat}.textContent.includes(${JSON.stringify(greeting.text)})`)).toBe(true);
    expect(await evalJs("history.state.fixtureState")).toBe("preserved");
    // Rehydration opens the stream before the bot snapshot arrives. The
    // stored conversation request must survive that gap on a full reload.
    await evalJs("window.__workspaceReloadMarker = true; location.reload(); true");
    await waitFor(`!window.__workspaceReloadMarker && Boolean(${chat}?.textContent.includes(${JSON.stringify(greeting.text)}))`);

    const after = (await api("GET", "/api/bots")).bots.find((bot: { id: string }) => bot.id === created.bot.id);
    expect(after.threadId).toBe(before.threadId);
    expect(after.messages).toEqual(before.messages);
    // Idle persisted bots may omit the transient busy field altogether.
    expect(before.busy).not.toBe(true);
    expect(after.busy).toBe(before.busy);
    writeFileSync(join(evidence, "result.json"), JSON.stringify({
      fixtureUrl: session.info.url, logPath: session.info.logPath, botId: created.bot.id,
      threadId: after.threadId, messageIds: after.messages.map((message: { id: string }) => message.id),
      workspaceHistory: "V2 -> conversation -> V2 -> same conversation", messagesUnchanged: true,
    }, null, 2));
  } finally {
    await closeBrowserSession(binary, env);
    await preview?.close();
    await session.close();
    await removeTempDir(home);
    await removeTempDir(sockets);
  }
}, 240_000);
