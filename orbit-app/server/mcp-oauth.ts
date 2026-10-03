// Sign in to a remote MCP server the way any MCP client does (the MCP
// authorization spec: OAuth 2.1 + PKCE). Orbit is a public client on this
// machine, so nothing is hosted and no secret is baked into a build:
//
//   1. discover   the server's protected-resource metadata (RFC 9728), then
//                 its authorization server's metadata (RFC 8414 / OIDC)
//   2. register   dynamically (RFC 7591) — or use a client id the user
//                 registered with that service, for servers without DCR
//   3. authorize  in the browser with PKCE S256 and a one-time state; the
//                 browser comes back to this server's loopback callback
//   4. exchange   the code for tokens, refresh them before they expire
//
// Tokens live in DATA_DIR/mcp-oauth.json (0600), next to config.json, the
// way Hermes keeps ~/.hermes/mcp-tokens. The renderer never sees them; an
// engine gets a fresh bearer as the server's Authorization header at the
// start of each turn.
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { writeFileAtomic } from "./atomic.ts";

export interface McpOAuthClient {
  clientId: string;
  clientSecret?: string;
}

interface ServerMetadata {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  registrationEndpoint?: string;
  scopes?: string[];
  resource: string;
}

interface StoredGrant {
  serverUrl: string;
  client: McpOAuthClient;
  /** The redirect the client was registered with; a new port re-registers. */
  redirectUri: string;
  tokenEndpoint: string;
  resource: string;
  accessToken: string;
  refreshToken?: string;
  /** Epoch ms; absent when the server gave no lifetime. */
  expiresAt?: number;
  scope?: string;
  noResource?: boolean;
}

interface PendingSignIn {
  name: string;
  serverUrl: string;
  client: McpOAuthClient;
  redirectUri: string;
  tokenEndpoint: string;
  resource: string;
  verifier: string;
  createdAt: number;
  /** omit RFC 8707 resource in token requests (Google) */
  noResource?: boolean;
}

type Fetch = typeof fetch;

const PENDING_TTL_MS = 10 * 60_000;
const REFRESH_SKEW_MS = 60_000;
const MAX_METADATA_BYTES = 256 * 1024;

export class McpOAuthError extends Error {}

/** Google's sign-in (accounts.google.com), which differs in two details. */
function isGoogle(authorizationEndpoint: string): boolean {
  return new URL(authorizationEndpoint).hostname === "accounts.google.com";
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function absolute(value: unknown, base: string): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" || (url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  if (!response.ok) return null;
  const text = await response.text();
  if (text.length > MAX_METADATA_BYTES) return null;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

/** `resource_metadata="…"` from a 401's WWW-Authenticate header. */
export function resourceMetadataFromChallenge(header: string | null): string | undefined {
  const match = header?.match(/resource_metadata="([^"]+)"/i);
  return match?.[1];
}

/** Candidate well-known URLs for a URL with a path: the path-suffixed form
 * first (RFC 8414 §3.1 / RFC 9728 §3.1), then the origin root. */
function wellKnown(url: string, suffix: string): string[] {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/+$/, "");
  const root = `${parsed.origin}/.well-known/${suffix}`;
  return path && path !== "/" ? [`${root}${path}`, root] : [root];
}

export async function discover(serverUrl: string, fetchImpl: Fetch = fetch): Promise<ServerMetadata> {
  const signal = () => AbortSignal.timeout(10_000);
  // An unauthenticated request says where the metadata lives, when the
  // server follows the current spec.
  let hinted: string | undefined;
  try {
    const probe = await fetchImpl(serverUrl, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "Orbit", version: "1" } } }),
      signal: signal(),
    });
    hinted = resourceMetadataFromChallenge(probe.headers.get("www-authenticate"));
    await probe.body?.cancel().catch(() => {});
  } catch {
    // unreachable here is reported by the metadata fetches below
  }

  let resource = serverUrl;
  let issuer: string | undefined;
  let scopes: string[] | undefined;
  for (const candidate of [...(hinted ? [hinted] : []), ...wellKnown(serverUrl, "oauth-protected-resource")]) {
    const meta = await fetchImpl(candidate, { signal: signal() }).then(readJson).catch(() => null);
    const servers = Array.isArray(meta?.authorization_servers) ? meta.authorization_servers : [];
    if (meta && typeof servers[0] === "string") {
      issuer = servers[0];
      if (typeof meta.resource === "string" && meta.resource) resource = meta.resource;
      if (Array.isArray(meta.scopes_supported)) scopes = meta.scopes_supported.filter((s): s is string => typeof s === "string");
      break;
    }
  }
  // Servers from before RFC 9728 was adopted host their own authorization
  // server at the origin.
  issuer ??= new URL(serverUrl).origin;

  for (const candidate of [...wellKnown(issuer, "oauth-authorization-server"), ...wellKnown(issuer, "openid-configuration")]) {
    const meta = await fetchImpl(candidate, { signal: signal() }).then(readJson).catch(() => null);
    const authorizationEndpoint = absolute(meta?.authorization_endpoint, issuer);
    const tokenEndpoint = absolute(meta?.token_endpoint, issuer);
    if (!meta || !authorizationEndpoint || !tokenEndpoint) continue;
    const methods = Array.isArray(meta.code_challenge_methods_supported) ? meta.code_challenge_methods_supported : undefined;
    if (methods && !methods.includes("S256")) throw new McpOAuthError("This server's sign-in does not support PKCE, so Orbit cannot sign in to it safely.");
    // only the resource's own scopes are requested: an authorization
    // server's full list is broader than this server needs
    return { authorizationEndpoint, tokenEndpoint, registrationEndpoint: absolute(meta.registration_endpoint, issuer), scopes, resource };
  }
  throw new McpOAuthError("This server does not offer an OAuth sign-in Orbit can find. If it takes an API key, add it as a header instead.");
}

export async function register(meta: ServerMetadata, redirectUri: string, fetchImpl: Fetch = fetch): Promise<McpOAuthClient> {
  if (!meta.registrationEndpoint) {
    throw new McpOAuthError("This server needs an OAuth app registered with it first. Add its client ID (and secret, if it gave one) to this server, then sign in.");
  }
  const response = await fetchImpl(meta.registrationEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_name: "Orbit",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = await readJson(response);
  if (!body || typeof body.client_id !== "string") throw new McpOAuthError("The server refused to register Orbit as a sign-in client.");
  return { clientId: body.client_id, ...(typeof body.client_secret === "string" ? { clientSecret: body.client_secret } : {}) };
}

function tokenRequestBody(fields: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) if (value !== undefined) params.set(key, value);
  return params.toString();
}

async function tokenRequest(endpoint: string, fields: Record<string, string | undefined>, fetchImpl: Fetch, now: () => number) {
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: tokenRequestBody(fields),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await readJson(response);
  if (!body || typeof body.access_token !== "string") {
    const reason = body && typeof body.error === "string" ? body.error : `HTTP ${response.status}`;
    throw new McpOAuthError(`The server did not issue a token (${reason}).`);
  }
  return {
    accessToken: body.access_token,
    refreshToken: typeof body.refresh_token === "string" ? body.refresh_token : undefined,
    expiresAt: typeof body.expires_in === "number" && body.expires_in > 0 ? now() + body.expires_in * 1000 : undefined,
    scope: typeof body.scope === "string" ? body.scope : undefined,
  };
}

export interface McpOAuthStore {
  /** Is this server signed in (a stored grant exists)? */
  signedIn(name: string): boolean;
  /** Start a browser sign-in; returns the URL to open. */
  begin(name: string, serverUrl: string, options?: { client?: McpOAuthClient }): Promise<string>;
  /** Finish a sign-in from the browser's callback. Returns the server name. */
  complete(state: string, code: string): Promise<string>;
  /** A usable access token, refreshed when close to expiry; null when not signed in. */
  accessToken(name: string): Promise<string | null>;
  signOut(name: string): void;
}

export function createMcpOAuthStore({
  dataDir,
  redirectUri,
  fetchImpl = fetch,
  now = Date.now,
}: {
  dataDir: string;
  /** This server's loopback callback, e.g. http://127.0.0.1:8799/api/mcp/oauth/callback */
  redirectUri: () => string;
  fetchImpl?: Fetch;
  now?: () => number;
}): McpOAuthStore {
  const file = join(dataDir, "mcp-oauth.json");
  const pending = new Map<string, PendingSignIn>();
  const refreshing = new Map<string, Promise<string | null>>();

  const load = (): Record<string, StoredGrant> => {
    if (!existsSync(file)) return {};
    try {
      const value: unknown = JSON.parse(readFileSync(file, "utf8"));
      return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, StoredGrant> : {};
    } catch {
      return {};
    }
  };
  const save = (grants: Record<string, StoredGrant>) => writeFileAtomic(file, JSON.stringify(grants, null, 2), { mode: 0o600 });

  const prune = () => {
    for (const [state, entry] of pending) if (now() - entry.createdAt > PENDING_TTL_MS) pending.delete(state);
  };

  return {
    signedIn: (name) => Boolean(load()[name]?.accessToken),

    async begin(name, serverUrl, options = {}) {
      prune();
      const meta = await discover(serverUrl, fetchImpl);
      const redirect = redirectUri();
      // a client registered for this exact redirect can be reused
      const previous = load()[name];
      const client = options.client
        ?? (previous && previous.serverUrl === serverUrl && previous.redirectUri === redirect ? previous.client : await register(meta, redirect, fetchImpl));
      const verifier = b64url(randomBytes(32));
      const challenge = b64url(createHash("sha256").update(verifier).digest());
      const state = b64url(randomBytes(24));
      pending.set(state, { name, serverUrl, client, redirectUri: redirect, tokenEndpoint: meta.tokenEndpoint, resource: meta.resource, verifier, createdAt: now(), ...(isGoogle(meta.authorizationEndpoint) ? { noResource: true } : {}) });
      const url = new URL(meta.authorizationEndpoint);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("client_id", client.clientId);
      url.searchParams.set("redirect_uri", redirect);
      url.searchParams.set("code_challenge", challenge);
      url.searchParams.set("code_challenge_method", "S256");
      url.searchParams.set("state", state);
      if (isGoogle(meta.authorizationEndpoint)) {
        // Google issues a refresh token only for offline access, and only on
        // a consent screen; it takes the audience from the scopes instead
        url.searchParams.set("access_type", "offline");
        url.searchParams.set("prompt", "consent");
      } else {
        url.searchParams.set("resource", meta.resource);
      }
      if (meta.scopes?.length) url.searchParams.set("scope", meta.scopes.join(" "));
      return url.toString();
    },

    async complete(state, code) {
      prune();
      const entry = pending.get(state);
      // one use only, whether or not the exchange succeeds
      pending.delete(state);
      if (!entry) throw new McpOAuthError("This sign-in link has expired or was already used. Start the sign-in again from Orbit.");
      const tokens = await tokenRequest(entry.tokenEndpoint, {
        grant_type: "authorization_code",
        code,
        redirect_uri: entry.redirectUri,
        client_id: entry.client.clientId,
        client_secret: entry.client.clientSecret,
        code_verifier: entry.verifier,
        resource: entry.noResource ? undefined : entry.resource,
      }, fetchImpl, now);
      const grants = load();
      grants[entry.name] = {
        serverUrl: entry.serverUrl,
        client: entry.client,
        redirectUri: entry.redirectUri,
        tokenEndpoint: entry.tokenEndpoint,
        resource: entry.resource,
        ...(entry.noResource ? { noResource: true } : {}),
        ...tokens,
      };
      save(grants);
      return entry.name;
    },

    async accessToken(name) {
      const grant = load()[name];
      if (!grant?.accessToken) return null;
      if (grant.expiresAt === undefined || grant.expiresAt - REFRESH_SKEW_MS > now()) return grant.accessToken;
      if (!grant.refreshToken) return null;
      // concurrent turns share one refresh: refresh tokens are often single-use
      const inFlight = refreshing.get(name);
      if (inFlight) return inFlight;
      const refresh = (async () => {
        try {
          const tokens = await tokenRequest(grant.tokenEndpoint, {
            grant_type: "refresh_token",
            refresh_token: grant.refreshToken,
            client_id: grant.client.clientId,
            client_secret: grant.client.clientSecret,
            resource: grant.noResource ? undefined : grant.resource,
          }, fetchImpl, now);
          const grants = load();
          if (!grants[name]) return null;
          grants[name] = { ...grants[name]!, ...tokens, refreshToken: tokens.refreshToken ?? grant.refreshToken };
          save(grants);
          return tokens.accessToken;
        } catch {
          return null;
        } finally {
          refreshing.delete(name);
        }
      })();
      refreshing.set(name, refresh);
      return refresh;
    },

    signOut(name) {
      const grants = load();
      if (!grants[name]) return;
      delete grants[name];
      save(grants);
    },
  };
}
