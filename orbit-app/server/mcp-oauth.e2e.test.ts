import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { removeTempDir, waitForExit } from "./testing/cleanup.ts";
import { freePortBlock } from "./testing/ports.ts";

// A remote MCP server that signs in with OAuth, end to end through the real
// Orbit server: add it, sign in (the browser's round trip is followed by
// hand), see it signed in, test it with its bearer, and find that bearer in
// the MCP config a bot's engine is started with.
const ROOT = fileURLToPath(new URL("..", import.meta.url));

let fake: Server;
let fakeOrigin = "";
let child: ChildProcess;
let base = "";
let home = "";
let dumpFile = "";
const codes = new Map<string, string>();
let issued = 0;

async function body(req: import("node:http").IncomingMessage): Promise<string> {
  let data = "";
  for await (const chunk of req) data += chunk;
  return data;
}

beforeAll(async () => {
  fake = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", fakeOrigin);
    const text = await body(req);
    const json = (status: number, value: unknown) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(value)); };
    if (url.pathname === "/mcp") {
      if (!req.headers.authorization?.startsWith("Bearer at-")) {
        res.writeHead(401, { "www-authenticate": `Bearer resource_metadata="${fakeOrigin}/.well-known/oauth-protected-resource/mcp"` });
        return res.end();
      }
      const message = JSON.parse(text || "{}");
      if (message.id === undefined) { res.writeHead(202); return res.end(); }
      if (message.method === "initialize") return json(200, { jsonrpc: "2.0", id: message.id, result: { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "fixture", version: "1" } } });
      if (message.method === "tools/list") return json(200, { jsonrpc: "2.0", id: message.id, result: { tools: [{ name: "list_issues", description: "Fixture issues", inputSchema: { type: "object" } }] } });
      return json(200, { jsonrpc: "2.0", id: message.id, error: { code: -32601, message: "unknown" } });
    }
    if (url.pathname === "/.well-known/oauth-protected-resource/mcp") return json(200, { resource: `${fakeOrigin}/mcp`, authorization_servers: [fakeOrigin] });
    if (url.pathname === "/.well-known/oauth-authorization-server") {
      return json(200, { issuer: fakeOrigin, authorization_endpoint: `${fakeOrigin}/authorize`, token_endpoint: `${fakeOrigin}/token`, registration_endpoint: `${fakeOrigin}/register`, code_challenge_methods_supported: ["S256"] });
    }
    if (url.pathname === "/register") return json(201, { client_id: "orbit-fixture-client" });
    if (url.pathname === "/authorize") {
      const code = `code-${codes.size + 1}`;
      codes.set(code, url.searchParams.get("code_challenge")!);
      const back = new URL(url.searchParams.get("redirect_uri")!);
      back.searchParams.set("code", code);
      back.searchParams.set("state", url.searchParams.get("state")!);
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }
    if (url.pathname === "/token") {
      const form = new URLSearchParams(text);
      const challenge = codes.get(form.get("code") ?? "");
      if (!challenge || createHash("sha256").update(form.get("code_verifier") ?? "").digest("base64url") !== challenge) return json(400, { error: "invalid_grant" });
      issued += 1;
      return json(200, { access_token: `at-${issued}`, refresh_token: `rt-${issued}`, expires_in: 3600 });
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise<void>((resolve) => fake.listen(0, "127.0.0.1", resolve));
  fakeOrigin = `http://127.0.0.1:${(fake.address() as AddressInfo).port}`;

  home = mkdtempSync(join(tmpdir(), "orbit-mcp-oauth-e2e-"));
  const data = join(home, ".orbit");
  dumpFile = join(home, "claude-dump.json");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(data, { recursive: true });
  writeFileSync(join(data, "config.json"), JSON.stringify({
    instances: { claude: { driver: "claudeAgent", config: { cli: join(ROOT, "server/testing/fake-claude-cli.ts") }, environment: { FAKE_CLAUDE_DUMP: dumpFile } } },
    mcpServers: { tracker: { type: "http", url: `${fakeOrigin}/mcp`, auth: "oauth", enabled: true } },
  }));
  const port = await freePortBlock([0, 1]);
  base = `http://127.0.0.1:${port}`;
  let stderr = "";
  child = spawn(process.execPath, ["--experimental-strip-types", join(ROOT, "server/index.ts")], {
    cwd: ROOT,
    env: {
      PATH: `${dirname(process.execPath)}:/usr/bin:/bin`, HOME: home, ORBIT_DATA_DIR: data, TMPDIR: home,
      ORBIT_PORT: String(port), ORBIT_WEBHOOK_PORT: String(port + 1),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout!.on("data", () => {});
  child.stderr!.on("data", (c) => { stderr += c; });
  for (let i = 0; i < 300; i++) {
    if (child.exitCode !== null) throw new Error(stderr);
    try { if ((await fetch(`${base}/api/health`)).ok) break; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 100));
  }
}, 60_000);

afterAll(async () => {
  await waitForExit(child, { signal: "SIGTERM" });
  await new Promise<void>((resolve) => fake.close(() => resolve()));
  if (home) await removeTempDir(home);
});

const api = async (method: string, path: string, value?: unknown): Promise<{ status: number; body: any }> => {
  const response = await fetch(`${base}${path}`, { method, headers: { "content-type": "application/json" }, ...(value === undefined ? {} : { body: JSON.stringify(value) }) });
  return { status: response.status, body: await response.json() };
};

describe("MCP OAuth through the Orbit server", () => {
  it("signs in, tests, and hands the engine a bearer", async () => {
    let listing = await api("GET", "/api/mcp/servers");
    expect(listing.body.servers).toEqual([expect.objectContaining({ name: "tracker", auth: "oauth", signedIn: false })]);
    expect(listing.body.oauthRedirectUri).toBe(`${base}/api/mcp/oauth/callback`);
    // not signed in: the test says so instead of failing on a 401
    expect((await api("POST", "/api/mcp/servers/tracker/test")).body).toMatchObject({ ok: false, error: "Sign in to this server first." });

    const start = await api("POST", "/api/mcp/servers/tracker/sign-in");
    expect(start.status).toBe(200);
    const authorize = new URL(start.body.url);
    expect(authorize.origin).toBe(fakeOrigin);
    expect(authorize.searchParams.get("redirect_uri")).toBe(`${base}/api/mcp/oauth/callback`);

    // the browser: the service sends it back to Orbit's own loopback callback
    const back = (await fetch(authorize, { redirect: "manual" })).headers.get("location")!;
    const done = await fetch(back);
    expect(done.status).toBe(200);
    expect(await done.text()).toContain("Connected tracker");
    // the page cannot be replayed
    expect((await fetch(back)).status).toBe(400);

    listing = await api("GET", "/api/mcp/servers");
    expect(listing.body.servers[0]).toMatchObject({ signedIn: true });
    expect(JSON.stringify(listing.body)).not.toContain("at-1");
    const tested = await api("POST", "/api/mcp/servers/tracker/test");
    expect(tested.body).toMatchObject({ ok: true, tools: [expect.objectContaining({ name: "list_issues" })] });

    // a turn mounts the server with the current bearer
    const { body: created } = await api("POST", "/api/bots", { name: "Tracker bot" });
    await api("POST", `/api/bots/${created.bot.id}/messages`, { text: "Hello" });
    for (let i = 0; i < 200 && !existsSync(dumpFile); i++) await new Promise((r) => setTimeout(r, 100));
    const dump = JSON.parse(readFileSync(dumpFile, "utf8"));
    const servers = dump.mcpConfig?.mcpServers ?? {};
    const tracker = Object.entries(servers).find(([name]) => name.includes("tracker"))?.[1] as { url?: string; headers?: Record<string, string> } | undefined;
    expect(tracker).toMatchObject({ url: `${fakeOrigin}/mcp`, headers: { Authorization: "Bearer at-1" } });

    // signing out forgets the grant and the next turn leaves the server out
    await api("POST", "/api/mcp/servers/tracker/sign-out");
    expect((await api("GET", "/api/mcp/servers")).body.servers[0]).toMatchObject({ signedIn: false });
  }, 60_000);
});
