// Talk mode's island page in a headless Chrome: at rest it is the notch and
// nothing runs; pointing at the top edge without a summon does nothing; ⌥T
// grows it to listen, the heard words open it, the sent question tucks it
// into the notch while Orbit thinks, it comes out to speak the answer, and
// then it shrinks back and asks main to hide the window. The server is a
// scripted stand-in served beside the page (Orbit's agent, /api/events, the
// message route): no server, no app data. No team status is ever asked for.
import { execFile } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, it } from "vitest";
import { closeBrowserSession, resolveAgentBrowserBinary } from "../../server/browser-engine.ts";
import { ensureUiBrowser, sessionEnv, UI_TOOLS_DIR } from "./control-orbit-ui.ts";
import { mountPreview, REPO_ROOT, type MountedPreview } from "./preview-fixture.ts";

const enabled = process.env.ORBIT_UI_E2E === "1" || !!resolveAgentBrowserBinary({ dataDir: UI_TOOLS_DIR, env: process.env });
if (!enabled) console.info("skipping orbit-island e2e: no agent-browser resolves; set ORBIT_UI_E2E=1 to install the pinned tools");
const execFileAsync = promisify(execFile);
const EVIDENCE = join(REPO_ROOT, ".orbit-scratch", "verify-evidence", "orbit-island");

const readBody = (req: IncomingMessage) => new Promise<unknown>((resolve) => {
  let raw = "";
  req.on("data", (chunk) => { raw += chunk; });
  req.on("end", () => { try { resolve(JSON.parse(raw || "null")); } catch { resolve(null); } });
});
const json = (res: ServerResponse, body: unknown) => {
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
};

it.skipIf(!enabled)("talk mode's island listens, tucks in while Orbit thinks, answers, and goes", async () => {
  const { binary, chrome } = await ensureUiBrowser();
  mkdirSync(join(REPO_ROOT, ".orbit-scratch"), { recursive: true });
  mkdirSync(EVIDENCE, { recursive: true });
  const home = mkdtempSync(join(REPO_ROOT, ".orbit-scratch", "island-ui-"));
  mkdirSync(join(home, "tmp"));
  // a socket path must fit in 103 bytes; the checkout's scratch folder is deep
  const sockets = mkdtempSync(join(tmpdir(), "oi-"));
  const env = { ...sessionEnv({ home, session: `oi-${process.pid}`, chrome }), AGENT_BROWSER_SOCKET_DIR: sockets };
  const browser = async (...args: string[]) => {
    const { stdout } = await execFileAsync(binary, [...args, "--json"], { env, timeout: 30_000, killSignal: "SIGKILL", maxBuffer: 4_194_304 })
      .catch((error: { stdout?: string; stderr?: string }) => { throw new Error(`${args[0]} failed: ${error.stdout ?? ""} ${error.stderr ?? ""}`.slice(0, 2000)); });
    const result = JSON.parse(stdout);
    expect(result.success, JSON.stringify(result)).toBe(true);
    return result.data;
  };
  const evalJs = async (js: string) => (await browser("eval", js)).result;
  const waitFor = (js: string) => browser("wait", "--fn", js);
  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // the stand-in server: Orbit's agent, its thread's stream, and every
  // request the page makes
  const bots = [{ id: "orbit", name: "Orbit", color: "green", threadId: "t-orbit", system: "orbit", hidden: true, tasks: [] }];
  const streams = new Set<ServerResponse>();
  const push = (frame: unknown) => { for (const res of streams) res.write(`data: ${JSON.stringify(frame)}\n\n`); };
  const requests: string[] = [];
  const sent: Array<Record<string, unknown>> = [];
  const logged = (handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>) => (req: IncomingMessage, res: ServerResponse) => {
    requests.push(`${req.method} ${req.url}`);
    return handler(req, res);
  };

  let preview: MountedPreview | undefined;
  let browserClosed = false;
  try {
    preview = await mountPreview({ info: { url: "http://127.0.0.1:9" } }, {
      entry: "/scripts/testing/island-preview.tsx", route: "/__island.html", title: "Isolated talk island", logLevel: "warn",
      extraRoutes: [
        // Use the fixture's scripted voice recorder for both Solar and Orbit.
        // Solar's real Windows bridge would request the host microphone.
        { path: "/src/lib/solar-voice.ts", handler: (_req, res) => {
          res.setHeader("content-type", "text/javascript");
          res.end("export const solarSpeechBridge = () => window.ogb;");
        } },
        { path: "/api/events", handler: logged((req, res) => {
          res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
          res.write(": open\n\n");
          streams.add(res);
          req.on("close", () => streams.delete(res));
        }) },
        { path: "/api/bots", handler: logged((_req, res) => json(res, { bots })) },
        { path: "/api/orbit-agent", handler: logged((_req, res) => json(res, { botId: "orbit", threadId: "t-orbit", name: "Orbit" })) },
        { path: "/api/bots/orbit/messages", method: "POST", handler: logged(async (req, res) => {
          const body = await readBody(req) as Record<string, unknown>;
          sent.push(body);
          json(res, { threadId: body.threadId });
        }) },
        // no voice provider here: the Mac's own voice speaks
        { path: "/api/tts/prepare", method: "POST", handler: logged((_req, res) => json(res, { ready: false })) },
        { path: /^\/api\//, handler: logged((_req, res) => { res.statusCode = 404; json(res, { error: "not in this check" }); }) },
      ],
    });
    await browser("open", preview.previewUrl);
    await browser("set", "viewport", "720", "320");
    await waitFor("Boolean(document.querySelector('.orbit-island'))");
    const island = "document.querySelector('.orbit-island')";
    const box = `(() => { const r = ${island}.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })()`;

    // At rest, before any ⌥T: a virtual notch that draws nothing, and
    // nothing runs (no animation frame, no timer)
    await waitFor(`${island}.getBoundingClientRect().width === 184`);
    expect(await evalJs(`getComputedStyle(${island}).opacity`)).toBe("0");
    await browser("wait", "500");
    await evalJs("window.__load.frames = 0; window.__load.timers = 0; true");
    await browser("wait", "2000");
    expect(await evalJs("({ ...window.__load })")).toEqual({ frames: 0, timers: 0 });
    const atRest = [...requests];
    expect(atRest.every((request) => /^GET \/api\/(events|orbit-agent|bots\?messages=0)/.test(request)), atRest.join(", ")).toBe(true);

    // Pointing at the top edge without a summon does nothing: no peek, no
    // click taken, nothing asked of the server
    await evalJs("window.__talk.hover(true)");
    await browser("mouse", "move", "360", "12");
    await browser("wait", "800");
    expect(await evalJs(box)).toEqual([184, 32]);
    expect(await evalJs("window.__island.interactive")).toEqual([]);
    expect(await evalJs("document.querySelector('canvas')")).toBe(null);
    await evalJs("window.__talk.hover(false)");
    await browser("mouse", "move", "360", "300");
    expect(requests).toEqual(atRest);
    await browser("screenshot", join(EVIDENCE, "1-rest.png"));

    // ⌥T over a real notch: the notch plus two 44-pt ears, listening, the
    // face alive
    await evalJs("window.__talk.summon({ id: 1, capture: null, display: { id: '1', bounds: { x: 0, y: 0, width: 1512, height: 982 }, topInset: 32, notch: { width: 185, height: 32 } } })");
    await waitFor(`${island}.getBoundingClientRect().width === 273`);
    expect(await evalJs(box)).toEqual([273, 32]);
    expect(await evalJs("window.__island.talkState.at(-1)")).toBe("listening");
    expect(await evalJs("Boolean(document.querySelector('.orbit-island canvas, .orbit-island .shell-solar-face > .solar-mini-render, .orbit-island .shell-solar-face > .solar-mini-planet'))")).toBe(true);
    const animatedCharacter = await evalJs("Boolean(document.querySelector('.orbit-island canvas'))");
    await evalJs("window.__load.frames = 0; true");
    await browser("wait", "500");
    if (animatedCharacter) expect(await evalJs("window.__load.frames")).toBeGreaterThan(5);
    await browser("screenshot", join(EVIDENCE, "2-listening.png"));

    // what it hears opens it 640 wide
    await evalJs("window.__talk.transcript({ text: 'what is on my screen' })");
    await waitFor(`${island}.getBoundingClientRect().width === 640 && document.body.innerText.includes('what is on my screen')`);
    await browser("wait", "900");
    await browser("screenshot", join(EVIDENCE, "3-heard.png"));

    // the question is sent: back into the notch while Orbit thinks
    await evalJs("window.__talk.end({ code: 0 })");
    await waitFor("window.__island.talkState.at(-1) === 'thinking'");
    await waitFor(`${island}.getBoundingClientRect().width === 185`);
    expect(await evalJs(box)).toEqual([185, 32]);
    for (let waited = 0; !sent.length && waited < 8_000; waited += 100) await pause(100);
    expect(sent).toMatchObject([{ threadId: "t-orbit", surface: "talk", text: "what is on my screen" }]);
    // tucked in, it still takes the click that would stop the turn
    await evalJs("window.__talk.hover(true)");
    await waitFor("window.__island.interactive.at(-1) === true");
    await evalJs("window.__talk.hover(false)");
    await waitFor("window.__island.interactive.at(-1) === false");
    await browser("screenshot", join(EVIDENCE, "4-thinking.png"));

    // the answer comes: out of the notch to speak it
    push({ kind: "message", threadId: "t-orbit", message: { id: "a1", role: "bot", kind: "text", text: "A spreadsheet of this month's costs." } });
    push({ kind: "runtime", event: { type: "turn.completed", threadId: "t-orbit" } });
    await waitFor("window.__island.talkState.at(-1) === 'talking'");
    await waitFor(`${island}.getBoundingClientRect().width === 273`);
    expect(await evalJs("window.__island.spoken")).toEqual(["A spreadsheet of this month's costs."]);
    await browser("screenshot", join(EVIDENCE, "5-answering.png"));

    // done speaking: about 2.5 s later it shrinks into the notch and asks
    // main to hide the window
    await waitFor("window.__island.talkState.at(-1) === 'idle'");
    await waitFor(`${island}.getBoundingClientRect().width === 185`);
    await waitFor("window.__island.dismissed === 1");
    await browser("screenshot", join(EVIDENCE, "6-rest-again.png"));
    // back at rest nothing runs
    await browser("wait", "500");
    await evalJs("window.__load.frames = 0; window.__load.timers = 0; true");
    await browser("wait", "2000");
    expect(await evalJs("({ ...window.__load })")).toEqual({ frames: 0, timers: 0 });

    // no team status was ever asked for: no thread reads, no cards answered
    expect(requests.filter((request) => /\/api\/threads\/|\/respond/.test(request))).toEqual([]);
    // Windows reuses the same voice workflow in a right-centred vertical
    // pill. A completed answer reopens the microphone; hanging up stops it.
    await browser("open", `${preview.previewUrl}?layout=side`);
    await browser("set", "viewport", "340", "460");
    await waitFor("Boolean(window.__talk?.summon)");
    await evalJs("window.__talk.summon({ id: 20, capture: { ok: false, reason: 'paused' }, display: { id: '1', bounds: {}, topInset: 0, notch: null } })");
    await waitFor("window.__island.talkState.at(-1) === 'listening'");
    await browser("wait", "500");
    expect(await evalJs("(() => { const r = document.querySelector('.solar-talk-pill').getBoundingClientRect(); return [Math.round(r.right), Math.round(r.y+r.height/2)]; })()")).toEqual([340, 230]);
    await browser("screenshot", join(EVIDENCE, "7-windows-listening.png"));
    expect(await evalJs("document.querySelector('.solar-talk-pill canvas')")).toBe(null);
    // A notice opens details automatically, but the dock button can still
    // close them without discarding the notice or stopping the microphone.
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("document.querySelector('.solar-voice-panel') === null");
    expect(await evalJs("document.querySelector('.solar-voice-orb').getAttribute('aria-expanded')")).toBe("false");
    expect(await evalJs("window.__island.talkState.at(-1)")).toBe("listening");
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("document.querySelector('.solar-voice-notice') !== null");
    await evalJs("document.querySelector('.solar-voice-notice button').click()");
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await browser("wait", "400");
    expect(await evalJs("(() => { const r=document.querySelector('.solar-talk-pill').getBoundingClientRect(); return [Math.round(r.width),Math.round(r.height)]; })()")).toEqual([56, 220]);
    await browser("mouse", "move", "320", "230");
    await waitFor("window.__island.interactive.at(-1) === true");
    await browser("mouse", "move", "180", "230");
    await waitFor("window.__island.interactive.at(-1) === false");
    // The dock stays at the edge while details open to its left.
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("document.querySelector('.solar-voice-panel') !== null");
    await waitFor("window.__island.interactive.at(-1) === true");
    await browser("wait", "400");
    expect(await evalJs("document.querySelector('.solar-voice-panel').getBoundingClientRect().right < document.querySelector('.solar-voice-rail').getBoundingClientRect().left")).toBe(true);
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("window.__island.interactive.at(-1) === false");
    await browser("wait", "400");
    await browser("screenshot", join(EVIDENCE, "8-solar-compact.png"));
    await evalJs("window.__talk.end({ code: 0 })");
    await waitFor("window.__island.starts === 2 && window.__island.talkState.at(-1) === 'listening'");
    // A new summon resets the previous collapse choice: its notice is
    // visible again until the owner chooses to close details.
    expect(await evalJs("document.querySelector('.solar-voice-orb').getAttribute('aria-expanded')")).toBe("true");
    expect(await evalJs("Boolean(document.querySelector('.solar-voice-notice'))")).toBe(true);
    expect(sent).toHaveLength(1);
    await evalJs("window.__talk.transcript({ text: 'hello from the Windows pill' }); window.__talk.end({ code: 0 })");
    for (let waited = 0; sent.length < 2 && waited < 8_000; waited += 100) await pause(100);
    expect(sent[1]).toMatchObject({ surface: "talk", text: "hello from the Windows pill" });
    expect(await evalJs("getComputedStyle(document.querySelector('.solar-talk-pill')).opacity")).toBe("1");
    expect(await evalJs("document.querySelector('.solar-voice-transcript').textContent")).toBe("hello from the Windows pill");
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("document.querySelector('.solar-voice-panel') === null");
    // Streaming another transcript does not override an explicit collapse.
    await evalJs("window.__talk.transcript({ text: 'hello from the Windows pill, still here' })");
    expect(await evalJs("document.querySelector('.solar-voice-panel')")).toBe(null);
    await evalJs("document.querySelector('.solar-voice-orb').click()");
    await waitFor("document.querySelector('.solar-voice-transcript')?.textContent === 'hello from the Windows pill, still here'");
    await browser("screenshot", join(EVIDENCE, "9-solar-thinking.png"));
    push({ kind: "message", threadId: "t-orbit", message: { id: "a2", role: "bot", kind: "text", text: "Hello, I am ready." } });
    push({ kind: "runtime", event: { type: "turn.completed", threadId: "t-orbit" } });
    await waitFor("window.__island.spoken.includes('Hello, I am ready.')");
    expect(await evalJs("document.querySelector('.solar-voice-transcript').textContent")).toBe("Hello, I am ready.");
    await waitFor("window.__island.starts === 3 && window.__island.talkState.at(-1) === 'listening'");
    await evalJs("document.querySelector('button[aria-label=\"Hang up\"]').click()");
    await waitFor("window.__island.dismissed === 1");
    await browser("wait", "3000");
    expect(await evalJs("({ starts: window.__island.starts, stops: window.__island.stops, dismissed: window.__island.dismissed })")).toMatchObject({ starts: 3, dismissed: 1 });
    expect(await evalJs("window.__island.stops")).toBeGreaterThan(0);
    const logs = await browser("console");
    expect(logs.messages.filter((message: { type: string }) => message.type === "error")).toEqual([]);
  } finally {
    try { browserClosed = await closeBrowserSession(binary, env); }
    finally {
      for (const res of streams) res.end();
      await preview?.close();
      rmSync(home, { recursive: true, force: true });
      rmSync(sockets, { recursive: true, force: true });
    }
  }
  expect(browserClosed).toBe(true);
}, 120_000);
