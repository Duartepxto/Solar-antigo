import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, statSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createMcpOAuthStore, discover, resourceMetadataFromChallenge } from "./mcp-oauth.ts";

// A spec-shaped service on loopback: the MCP endpoint answers 401 with a
// resource_metadata hint, the authorization server registers clients,
// redirects with a code bound to the PKCE challenge, and issues tokens.
interface Fake {
  origin: string;
  registrations: Array<Record<string, unknown>>;
  tokenRequests: URLSearchParams[];
  /** When false the metadata has no registration endpoint. */
  dcr: boolean;
  expiresIn: number;
  close: () => Promise<void>;
}

async function fakeService(): Promise<Fake> {
  const codes = new Map<string, { challenge: string; clientId: string; redirectUri: string }>();
  const fake = { registrations: [], tokenRequests: [], dcr: true, expiresIn: 3600 } as unknown as Fake;
  let issued = 0;
  const server: Server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", fake.origin);
    const body = await new Promise<string>((resolve) => { let data = ""; req.on("data", (c) => { data += c; }); req.on("end", () => resolve(data)); });
    const json = (status: number, value: unknown) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(value)); };
    if (url.pathname === "/mcp") {
      if (req.headers.authorization?.startsWith("Bearer at-")) return json(200, { jsonrpc: "2.0", id: 1, result: {} });
      res.writeHead(401, { "www-authenticate": `Bearer resource_metadata="${fake.origin}/.well-known/oauth-protected-resource/mcp"` });
      return res.end();
    }
    if (url.pathname === "/.well-known/oauth-protected-resource/mcp") {
      return json(200, { resource: `${fake.origin}/mcp`, authorization_servers: [`${fake.origin}/auth`], scopes_supported: ["read", "write"] });
    }
    if (url.pathname === "/.well-known/oauth-authorization-server/auth") {
      return json(200, {
        issuer: `${fake.origin}/auth`,
        authorization_endpoint: `${fake.origin}/auth/authorize`,
        token_endpoint: `${fake.origin}/auth/token`,
        ...(fake.dcr ? { registration_endpoint: `${fake.origin}/auth/register` } : {}),
        code_challenge_methods_supported: ["S256"],
      });
    }
    if (url.pathname === "/auth/register" && req.method === "POST") {
      const registration = JSON.parse(body);
      fake.registrations.push(registration);
      return json(201, { client_id: `client-${fake.registrations.length}`, redirect_uris: registration.redirect_uris });
    }
    if (url.pathname === "/auth/authorize") {
      const code = `code-${codes.size + 1}`;
      codes.set(code, { challenge: url.searchParams.get("code_challenge")!, clientId: url.searchParams.get("client_id")!, redirectUri: url.searchParams.get("redirect_uri")! });
      const back = new URL(url.searchParams.get("redirect_uri")!);
      back.searchParams.set("code", code);
      back.searchParams.set("state", url.searchParams.get("state")!);
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }
    if (url.pathname === "/auth/token" && req.method === "POST") {
      const form = new URLSearchParams(body);
      fake.tokenRequests.push(form);
      if (form.get("grant_type") === "authorization_code") {
        const grant = codes.get(form.get("code") ?? "");
        const verifier = form.get("code_verifier") ?? "";
        const challenge = createHash("sha256").update(verifier).digest("base64url");
        if (!grant || grant.challenge !== challenge || grant.clientId !== form.get("client_id") || grant.redirectUri !== form.get("redirect_uri")) {
          return json(400, { error: "invalid_grant" });
        }
        codes.delete(form.get("code")!);
      } else if (form.get("grant_type") !== "refresh_token" || !form.get("refresh_token")?.startsWith("rt-")) {
        return json(400, { error: "invalid_grant" });
      }
      issued += 1;
      return json(200, { access_token: `at-${issued}`, refresh_token: `rt-${issued}`, token_type: "Bearer", expires_in: fake.expiresIn });
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  fake.origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  fake.close = () => new Promise((resolve) => server.close(() => resolve()));
  return fake;
}

/** What the browser does: follow the authorize URL to the redirect. */
async function browse(authorizeUrl: string): Promise<URL> {
  const response = await fetch(authorizeUrl, { redirect: "manual" });
  return new URL(response.headers.get("location")!);
}

let fake: Fake;
let dir: string;
let clock = 1_000_000;
const REDIRECT = "http://127.0.0.1:65000/api/mcp/oauth/callback";

beforeEach(async () => {
  fake = await fakeService();
  dir = mkdtempSync(join(tmpdir(), "orbit-mcp-oauth-"));
  clock = Date.now();
});
afterEach(async () => {
  await fake.close();
  rmSync(dir, { recursive: true, force: true });
});

const store = () => createMcpOAuthStore({ dataDir: dir, redirectUri: () => REDIRECT, now: () => clock });

describe("MCP OAuth sign-in", () => {
  it("reads the resource-metadata hint from a 401 challenge", () => {
    expect(resourceMetadataFromChallenge('Bearer realm="x", resource_metadata="https://a.example/.well-known/oauth-protected-resource"')).toBe("https://a.example/.well-known/oauth-protected-resource");
    expect(resourceMetadataFromChallenge(null)).toBeUndefined();
  });

  it("discovers the authorization server through the protected resource", async () => {
    const meta = await discover(`${fake.origin}/mcp`);
    expect(meta).toMatchObject({
      authorizationEndpoint: `${fake.origin}/auth/authorize`,
      tokenEndpoint: `${fake.origin}/auth/token`,
      registrationEndpoint: `${fake.origin}/auth/register`,
      resource: `${fake.origin}/mcp`,
      scopes: ["read", "write"],
    });
  });

  it("registers, signs in with PKCE, stores the grant privately, and refreshes it", async () => {
    const oauth = store();
    expect(oauth.signedIn("fixture")).toBe(false);
    const authorize = new URL(await oauth.begin("fixture", `${fake.origin}/mcp`));
    expect(fake.registrations).toEqual([expect.objectContaining({ redirect_uris: [REDIRECT], token_endpoint_auth_method: "none", client_name: "Orbit" })]);
    expect(authorize.searchParams.get("code_challenge_method")).toBe("S256");
    expect(authorize.searchParams.get("resource")).toBe(`${fake.origin}/mcp`);
    expect(authorize.searchParams.get("scope")).toBe("read write");

    const back = await browse(authorize.toString());
    expect(back.origin + back.pathname).toBe(REDIRECT);
    await expect(oauth.complete(back.searchParams.get("state")!, back.searchParams.get("code")!)).resolves.toBe("fixture");
    expect(oauth.signedIn("fixture")).toBe(true);
    // NTFS uses inherited ACLs; Node's Windows mode bits cannot express 0600.
    // Keep the complete sign-in, persistence and refresh scenario on Windows.
    if (process.platform !== "win32") {
      expect(statSync(join(dir, "mcp-oauth.json")).mode & 0o777).toBe(0o600);
    }
    await expect(oauth.accessToken("fixture")).resolves.toBe("at-1");

    // the stored bearer opens the real endpoint
    const ok = await fetch(`${fake.origin}/mcp`, { method: "POST", headers: { authorization: "Bearer at-1" } });
    expect(ok.status).toBe(200);

    // near expiry, one refresh serves concurrent turns
    clock += 3600_000;
    const [a, b] = await Promise.all([oauth.accessToken("fixture"), oauth.accessToken("fixture")]);
    expect(a).toBe("at-2");
    expect(b).toBe("at-2");
    expect(fake.tokenRequests.filter((form) => form.get("grant_type") === "refresh_token")).toHaveLength(1);
    // a new store (a restart) reads the same grant
    await expect(store().accessToken("fixture")).resolves.toBe("at-2");
  });

  it("uses each sign-in state once and rejects a forged one", async () => {
    const oauth = store();
    const back = await browse(await oauth.begin("fixture", `${fake.origin}/mcp`));
    await expect(oauth.complete("forged", back.searchParams.get("code")!)).rejects.toThrow(/expired or was already used/);
    await oauth.complete(back.searchParams.get("state")!, back.searchParams.get("code")!);
    await expect(oauth.complete(back.searchParams.get("state")!, back.searchParams.get("code")!)).rejects.toThrow(/expired or was already used/);
  });

  it("reuses a registered client, and uses a supplied one when the service has no registration", async () => {
    const oauth = store();
    const first = await browse(await oauth.begin("fixture", `${fake.origin}/mcp`));
    await oauth.complete(first.searchParams.get("state")!, first.searchParams.get("code")!);
    await oauth.begin("fixture", `${fake.origin}/mcp`);
    expect(fake.registrations).toHaveLength(1);

    fake.dcr = false;
    await expect(store().begin("other", `${fake.origin}/mcp`)).rejects.toThrow(/needs an OAuth app registered/);
    const url = new URL(await store().begin("other", `${fake.origin}/mcp`, { client: { clientId: "my-app" } }));
    expect(url.searchParams.get("client_id")).toBe("my-app");
  });

  it("forgets a grant on sign-out", async () => {
    const oauth = store();
    const back = await browse(await oauth.begin("fixture", `${fake.origin}/mcp`));
    await oauth.complete(back.searchParams.get("state")!, back.searchParams.get("code")!);
    oauth.signOut("fixture");
    expect(oauth.signedIn("fixture")).toBe(false);
    await expect(oauth.accessToken("fixture")).resolves.toBeNull();
  });

  it("asks Google for offline access and leaves out the resource parameter", async () => {
    const calls: Array<{ url: string; body?: string }> = [];
    const google: typeof fetch = async (input, init) => {
      const url = String(input);
      calls.push({ url, body: typeof init?.body === "string" ? init.body : undefined });
      const json = (value: unknown) => new Response(JSON.stringify(value), { status: 200, headers: { "content-type": "application/json" } });
      if (url === "https://gmailmcp.googleapis.com/mcp/v1") return new Response(null, { status: 401 });
      if (url.startsWith("https://gmailmcp.googleapis.com/.well-known/oauth-protected-resource")) {
        return json({ resource: "https://gmailmcp.googleapis.com/mcp/v1", authorization_servers: ["https://accounts.google.com"], scopes_supported: ["https://www.googleapis.com/auth/gmail.readonly"] });
      }
      if (url === "https://accounts.google.com/.well-known/oauth-authorization-server" || url === "https://accounts.google.com/.well-known/openid-configuration") {
        return json({ authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth", token_endpoint: "https://oauth2.googleapis.com/token", code_challenge_methods_supported: ["S256"] });
      }
      if (url === "https://oauth2.googleapis.com/token") return json({ access_token: "ya29.fixture", refresh_token: "1//fixture", expires_in: 3599 });
      return new Response(null, { status: 404 });
    };
    const oauth = createMcpOAuthStore({ dataDir: dir, redirectUri: () => REDIRECT, fetchImpl: google, now: () => clock });
    const authorize = new URL(await oauth.begin("gmail", "https://gmailmcp.googleapis.com/mcp/v1", { client: { clientId: "123.apps.googleusercontent.com", clientSecret: "GOCSPX-fixture" } }));
    expect(authorize.origin + authorize.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(authorize.searchParams.get("access_type")).toBe("offline");
    expect(authorize.searchParams.get("prompt")).toBe("consent");
    expect(authorize.searchParams.has("resource")).toBe(false);
    expect(authorize.searchParams.get("scope")).toBe("https://www.googleapis.com/auth/gmail.readonly");
    await oauth.complete(authorize.searchParams.get("state")!, "4/fixture-code");
    const exchange = new URLSearchParams(calls.find((call) => call.url === "https://oauth2.googleapis.com/token")!.body);
    expect(exchange.get("client_secret")).toBe("GOCSPX-fixture");
    expect(exchange.has("resource")).toBe(false);
    await expect(oauth.accessToken("gmail")).resolves.toBe("ya29.fixture");
  });
});
