// Opt-in real-model acceptance. No personal chats, skills, browser profiles,
// or provider configuration are loaded. Only the explicitly supplied Codex
// sign-in is copied into the disposable home; cleanup removes that copy.
import { chmodSync, copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import { launchVerificationServer, runControlOrbit } from "./control-orbit.ts";
import { BrowserRuntime } from "../server/browser-runtime.ts";
import { browserSessionId, closeBrowserSession } from "../server/browser-engine.ts";
import { ensureUiBrowser } from "./testing/control-orbit-ui.ts";
import { fixtureApi, mountPreview, parkUntilSignal } from "./testing/preview-fixture.ts";

const cli = process.env.ORBIT_VERIFY_CODEX_CLI;
const auth = process.env.ORBIT_VERIFY_CODEX_AUTH;
const model = process.env.ORBIT_VERIFY_CODEX_MODEL;
if (!cli || !auth || !model) throw new Error("Supply ORBIT_VERIFY_CODEX_CLI, ORBIT_VERIFY_CODEX_AUTH and ORBIT_VERIFY_CODEX_MODEL explicitly. This test uses real model quota.");
const browser = await ensureUiBrowser(process.env, console.error);
const fixture = await launchVerificationServer({}, undefined, undefined,
  { binaryPath: browser.binary, executablePath: browser.chrome ?? "" }, undefined, undefined, ["codex"]);
let preview: Awaited<ReturnType<typeof mountPreview>> | undefined;
try {
  // Turns use the app-owned CODEX_HOME, not the personal config source.
  const codexHome = join(fixture.info.dataDir, "codex-home");
  // The fake provider's initial probe can already have made this directory.
  mkdirSync(codexHome, { recursive: true, mode: 0o700 });
  copyFileSync(auth, join(codexHome, "auth.json"));
  chmodSync(join(codexHome, "auth.json"), 0o600);
  const api = fixtureApi(fixture.info.url);
  await api("PUT", "/api/config", {
    features: { browser: true, showToolCalls: true },
  });
  await api("PATCH", "/api/instances/codex", { cli });
  const { bot } = await api("POST", "/api/bots", {
    name: "Ziggy", description: "A disposable computer-use verification assistant. Only work on the supplied local test page.",
    modelSelection: { instanceId: "codex", model },
  });
  await api("PATCH", `/api/bots/${bot.id}`, { computer: "browser", browser: true });
  preview = await mountPreview(fixture, {
    entry: "/src/main.tsx", route: "/__codex-surface-live.html", title: "Isolated Codex chat-to-action test",
    extraRoutes: [{ path: "/__browser-test-page", handler(_req, res) {
      res.setHeader("content-type", "text/html");
      res.end(readFileSync(new URL("./testing/browser-test-page.html", import.meta.url), "utf8"));
    } }],
  });
  console.log(JSON.stringify({ ...fixture.info, botId: bot.id, threadId: bot.threadId,
    model, previewUrl: preview.previewUrl, testPage: new URL("/__browser-test-page", preview.previewUrl).href }, null, 2));
  if (process.argv.includes("--acceptance")) {
    // Auto applies only to this disposable bot and local synthetic page.
    await api("PATCH", `/api/bots/${bot.id}`, { approvalMode: "auto" });
    const testPage = new URL("/__browser-test-page", preview.previewUrl).href;
    await runControlOrbit(["send", "--url", fixture.info.url, "--bot", bot.id, "--task", bot.threadId,
      "--text", `Use your own browser to open ${testPage}. Enter Solar Acceptance in the name field, click Say hello and verify the resulting greeting. Work only on this local synthetic page. Do not use my desktop, external websites or accounts. Report the observed result.`]);
    // Poll only observations: a long HTTP wait can be reset by Windows
    // proxies. Never replay the submitted model request on a transport error.
    const deadline = Date.now() + 120_000;
    let outcome: unknown;
    let observationFailures = 0;
    while (Date.now() < deadline) {
      let snapshot: { bots: Array<{ id: string; busy?: boolean }> };
      try {
        snapshot = await api("GET", "/api/bots");
        observationFailures = 0;
      } catch (error) {
        if (++observationFailures >= 3) throw error;
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
      }
      const current = snapshot.bots.find((candidate: { id: string }) => candidate.id === bot.id);
      assert(current, "The disposable acceptance bot disappeared");
      if (!current.busy) {
        outcome = await runControlOrbit(["messages", "--url", fixture.info.url, "--bot", bot.id, "--task", bot.threadId, "--limit", "8"]);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    assert(outcome, "Real model did not settle within the acceptance deadline");
    console.log(JSON.stringify({ modelOutcome: outcome }));
    const session = browserSessionId(bot.id, "");
    const env = { HOME: fixture.info.dataDir, USERPROFILE: fixture.info.dataDir, PATH: process.env.PATH,
      AGENT_BROWSER_SESSION: session, AGENT_BROWSER_HEADLESS: "1", AGENT_BROWSER_EXECUTABLE_PATH: browser.chrome ?? "" };
    const runtime = new BrowserRuntime();
    try {
      const result = await runtime.agentRpc(session, { command: browser.binary, args: ["mcp", "--tools", "core"], env },
        "tools/call", { name: "agent_browser_get_text", arguments: { selector: "#result" } }) as { isError?: boolean };
      assert(!result.isError, "Could not independently observe the real model's browser result");
      assert.match(JSON.stringify(result), /Hello, Solar Acceptance/);
      console.log("PASS: an ordinary chat request through the real Codex engine filled and submitted the private browser form; the resulting DOM was independently verified.");
    } finally {
      try { await closeBrowserSession(browser.binary, env); }
      finally { await runtime.closeAll(); }
    }
  } else await parkUntilSignal();
} finally {
  await preview?.close();
  await fixture.close();
}
