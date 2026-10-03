// The MCP catalog: servers other people publish and keep up, so Orbit does
// not maintain a list of its own. Two sources, one format (the MCP
// registry's v0.1 API):
//
// - GitHub's MCP registry (github.com/mcp): curated, sorted by stars, with
//   the owner's avatar for a logo. This is what Explore shows first.
// - The official MCP registry: everyone who published a server.json. Noisy,
//   so it is only searched, and every hit is labelled Community.
//
// Lists are fetched by this server and cached, never by the renderer, and
// logos are fetched here too, so browsing the catalog tells no third party
// what you looked at. Nothing is installed from here: an entry becomes a
// draft the person reviews in the MCP servers form, or, for a URL server
// that signs in with OAuth, one click that still asks before it connects.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const GITHUB_REGISTRY = "https://api.mcp.github.com/v0.1/servers";
export const OFFICIAL_REGISTRY = "https://registry.modelcontextprotocol.io/v0.1/servers";

export interface CatalogField {
  name: string;
  description?: string;
  required: boolean;
  secret: boolean;
  default?: string;
}

export type CatalogInstall =
  | { kind: "remote"; transport: "http" | "sse"; url: string; headers: CatalogField[] }
  | { kind: "npm" | "pypi" | "oci"; command: string; args: string[]; env: CatalogField[]; identifier: string };

export interface CatalogEntry {
  /** The registry name, e.g. "com.stripe/mcp". */
  id: string;
  /** A valid Orbit server name for it. */
  slug: string;
  title: string;
  description: string;
  website?: string;
  repository?: string;
  stars?: number;
  category: CatalogCategory;
  source: "github" | "community";
  /** Who the registry verified published this: "linear.app" for a
   * reverse-DNS name (proved by DNS or HTTP), "github.com/getsentry" for an
   * io.github name (proved by signing in to GitHub). */
  publisher?: string;
  /** Proxied through this server; absent when there is nothing to try. */
  icon?: string;
  /** Every way this server can run, remote first. */
  installs: CatalogInstall[];
}

export type CatalogCategory = "dev" | "data" | "productivity" | "design" | "web" | "cloud" | "ai" | "other";

type Json = Record<string, unknown>;
const str = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : undefined;
const arr = (value: unknown): Json[] => Array.isArray(value) ? value.filter((item): item is Json => !!item && typeof item === "object") : [];
const obj = (value: unknown): Json => value && typeof value === "object" && !Array.isArray(value) ? value as Json : {};

/** "com.stripe/mcp" → "stripe"; "io.github.getsentry/sentry-mcp" → "sentry". */
export function catalogSlug(name: string, title?: string): string {
  const base = (title ?? name.split("/").pop() ?? name)
    .toLowerCase()
    .replace(/\b(mcp|server|remote|official)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = /^[a-z]/.test(base) ? base : `mcp-${base}`;
  return (slug.replace(/-+$/, "") || "mcp").slice(0, 32).replace(/-+$/, "");
}

const CATEGORY_WORDS: Array<[CatalogCategory, RegExp]> = [
  ["design", /\b(figma|design|canva|miro|webflow|framer|ui|ux|image|draw|diagram)\b/],
  ["data", /\b(database|sql|postgres|mysql|mongo|redis|clickhouse|elastic|analytics|bigquery|snowflake|supabase|neon|vector|chroma|data)\b/],
  ["cloud", /\b(aws|azure|gcp|cloud|kubernetes|k8s|terraform|docker|devops|infra|vercel|netlify|cloudflare|monitoring|observability|sentry|datadog)\b/],
  ["productivity", /\b(notion|linear|jira|asana|todoist|slack|calendar|email|gmail|monday|trello|atlassian|confluence|zapier|docs|notes|crm|hubspot|salesforce)\b/],
  ["web", /\b(search|browser|scrap|crawl|playwright|puppeteer|chrome|web|fetch|serp)\b/],
  ["dev", /\b(git|github|gitlab|code|ide|developer|sdk|api|testing|lint|ci|npm|devtools|debug)\b/],
  ["ai", /\b(ai|llm|agent|model|rag|memory|embedding|prompt)\b/],
];

/** The verified publisher behind a registry name, from its namespace. */
export function catalogPublisher(name: string): string | undefined {
  const namespace = name.split("/")[0] ?? "";
  const github = namespace.match(/^io\.github\.([^.]+)$/i);
  if (github) return `github.com/${github[1]}`;
  const parts = namespace.split(".").filter(Boolean);
  if (parts.length < 2 || !/^[a-z]{2,}$/i.test(parts[0])) return undefined;
  return parts.reverse().join(".").toLowerCase();
}

/** Search hits, best first: the vendor's own server for a name ("notion" →
 * com.notion/mcp), then titles that start with it, then the rest. */
export function rankSearch(entries: CatalogEntry[], query: string): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  const score = (entry: CatalogEntry) => {
    const publisher = entry.publisher?.split("/").pop()?.split(".")[0] ?? "";
    const title = entry.title.toLowerCase();
    if (publisher === q) return 0;
    if (title === q || entry.slug === q) return 1;
    if (title.startsWith(q)) return 2;
    return 3;
  };
  return entries.map((entry, index) => ({ entry, index, rank: score(entry) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ entry }) => entry);
}

export function catalogCategory(text: string): CatalogCategory {
  const lower = text.toLowerCase();
  for (const [category, words] of CATEGORY_WORDS) if (words.test(lower)) return category;
  return "other";
}

function fields(list: unknown): CatalogField[] {
  return arr(list).flatMap((item) => {
    const name = str(item.name);
    if (!name) return [];
    return [{
      name,
      description: str(item.description),
      required: item.isRequired === true,
      secret: item.isSecret === true,
      default: str(item.default) ?? str(item.value)?.replace(/\{[^}]+\}/g, "") ?? undefined,
    }];
  });
}

/** Arguments with fixed values only: anything templated ({token}) is left
 * for the person to fill in the form, never guessed. */
function fixedArgs(list: unknown): string[] {
  return arr(list).flatMap((item) => {
    const value = str(item.value) ?? str(item.default);
    if (value && /\{[^}]+\}/.test(value)) return [];
    if (item.type === "named") {
      const name = str(item.name);
      if (!name) return [];
      return value ? [name, value] : [name];
    }
    return value ? [value] : [];
  });
}

function packageInstall(pkg: Json): CatalogInstall | undefined {
  const identifier = str(pkg.identifier);
  const transport = str(obj(pkg.transport).type);
  if (!identifier || (transport && transport !== "stdio")) return undefined;
  const version = str(pkg.version);
  const env = fields(pkg.environmentVariables);
  const args = fixedArgs(pkg.packageArguments);
  switch (pkg.registryType) {
    case "npm":
      return { kind: "npm", identifier, command: "npx", args: ["-y", version ? `${identifier}@${version}` : identifier, ...args], env };
    case "pypi":
      return { kind: "pypi", identifier, command: "uvx", args: [version ? `${identifier}==${version}` : identifier, ...args], env };
    case "oci": {
      // docker passes each variable through by name from the server's env
      const image = identifier.includes(":") || !version ? identifier : `${identifier}:${version}`;
      return { kind: "oci", identifier, command: "docker", args: ["run", "-i", "--rm", ...env.flatMap((field) => ["-e", field.name]), image, ...args], env };
    }
    default:
      return undefined;
  }
}

function remoteInstall(remote: Json): CatalogInstall | undefined {
  const url = str(remote.url);
  if (!url || !/^https:\/\//i.test(url) || /\{[^}]+\}/.test(url)) return undefined;
  const type = remote.type === "sse" ? "sse" : remote.type === "streamable-http" ? "http" : undefined;
  if (!type) return undefined;
  return { kind: "remote", transport: type, url, headers: fields(remote.headers) };
}

/** The logo candidates for an entry, best first. */
export function iconCandidates(server: Json, github: Json): string[] {
  const out: string[] = [];
  const icons = arr(server.icons).filter((icon) => /^https:\/\//i.test(str(icon.src) ?? ""));
  // a dark app: prefer an icon made for dark backgrounds, then any
  icons.sort((a, b) => Number(b.theme === "dark") - Number(a.theme === "dark"));
  out.push(...icons.map((icon) => icon.src as string));
  const avatar = str(github.preferredImage) ?? str(github.ownerAvatarUrl);
  if (avatar && /^https:\/\//i.test(avatar)) out.push(avatar);
  const repo = str(obj(server.repository).url);
  const owner = repo?.match(/^https:\/\/github\.com\/([^/]+)/i)?.[1];
  if (owner) out.push(`https://github.com/${owner}.png?size=128`);
  const website = str(server.websiteUrl);
  try { if (website) out.push(new URL("/favicon.ico", website).toString()); } catch { /* not a URL */ }
  return [...new Set(out)];
}

export function normalizeEntry(item: Json, source: CatalogEntry["source"]): { entry: CatalogEntry; icons: string[] } | undefined {
  const server = obj(item.server);
  const name = str(server.name);
  if (!name) return undefined;
  const meta = obj(server._meta);
  const github = obj(obj(meta["io.modelcontextprotocol.registry/publisher-provided"]).github);
  const official = obj(obj(item._meta)["io.modelcontextprotocol.registry/official"]);
  if (official.status && official.status !== "active") return undefined;
  const installs = [
    ...arr(server.remotes).map(remoteInstall),
    ...arr(server.packages).map(packageInstall),
  ].filter((install): install is CatalogInstall => !!install);
  if (!installs.length) return undefined;
  const title = str(server.title) ?? str(github.displayName) ?? name.split("/").pop()!;
  const description = str(server.description) ?? "";
  const topics = Array.isArray(github.topics) ? github.topics.filter((topic): topic is string => typeof topic === "string") : [];
  const icons = iconCandidates(server, github);
  const id = name;
  return {
    entry: {
      id,
      slug: catalogSlug(name, title),
      title,
      description,
      website: str(server.websiteUrl),
      repository: str(obj(server.repository).url),
      stars: typeof github.stargazerCount === "number" ? github.stargazerCount : undefined,
      category: catalogCategory(`${title} ${description} ${topics.join(" ")}`),
      source,
      publisher: catalogPublisher(name),
      icon: icons.length ? `/api/mcp/catalog/icon?id=${encodeURIComponent(id)}` : undefined,
      installs,
    },
    icons,
  };
}

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

const LIST_TTL_MS = 24 * 60 * 60 * 1000;
const SEARCH_TTL_MS = 60 * 60 * 1000;
const MAX_PAGES = 10;
const MAX_ICON_BYTES = 512 * 1024;

export interface CatalogResult {
  entries: CatalogEntry[];
  fetchedAt: number;
  /** True when the registry could not be reached and this is the last copy. */
  stale?: boolean;
}

export class McpCatalog {
  private featured?: { entries: CatalogEntry[]; fetchedAt: number };
  private loading?: Promise<CatalogResult>;
  private searches = new Map<string, { entries: CatalogEntry[]; at: number }>();
  private icons = new Map<string, string[]>();
  private iconBytes = new Map<string, { body: Buffer; type: string } | null>();

  private readonly cacheDir: string;
  private readonly fetcher: Fetcher;

  constructor(cacheDir: string, fetcher: Fetcher = fetch) {
    this.cacheDir = cacheDir;
    this.fetcher = fetcher;
  }

  private remember(results: Array<{ entry: CatalogEntry; icons: string[] }>): CatalogEntry[] {
    for (const { entry, icons } of results) this.icons.set(entry.id, icons);
    return results.map((result) => result.entry);
  }

  private async page(base: string, params: Record<string, string>): Promise<{ items: Json[]; next?: string }> {
    const url = new URL(base);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    const response = await this.fetcher(url.toString(), { headers: { accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`The MCP registry answered ${response.status}.`);
    const body = obj(await response.json());
    return { items: arr(body.servers), next: str(obj(body.metadata).nextCursor) };
  }

  private cacheFile() { return join(this.cacheDir, "mcp-catalog.json"); }

  /** GitHub's curated list, most starred first. Cached a day, on disk too,
   * so a restart or a dropped connection still has something to show. */
  async list(force = false): Promise<CatalogResult> {
    if (!force && this.featured && Date.now() - this.featured.fetchedAt < LIST_TTL_MS) return this.featured;
    if (!force && !this.featured) {
      try {
        const saved = JSON.parse(await readFile(this.cacheFile(), "utf8")) as { entries: CatalogEntry[]; icons: Record<string, string[]>; fetchedAt: number };
        if (Array.isArray(saved.entries) && typeof saved.fetchedAt === "number") {
          this.featured = { entries: saved.entries, fetchedAt: saved.fetchedAt };
          for (const [id, list] of Object.entries(saved.icons ?? {})) this.icons.set(id, list);
          if (Date.now() - saved.fetchedAt < LIST_TTL_MS) return this.featured;
        }
      } catch { /* no cache yet */ }
    }
    this.loading ??= this.refresh().finally(() => { this.loading = undefined; });
    return this.loading;
  }

  private async refresh(): Promise<CatalogResult> {
    try {
      const results: Array<{ entry: CatalogEntry; icons: string[] }> = [];
      let cursor: string | undefined;
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const { items, next } = await this.page(GITHUB_REGISTRY, { limit: "100", ...(cursor ? { cursor } : {}) });
        for (const item of items) {
          const normalized = normalizeEntry(item, "github");
          if (normalized) results.push(normalized);
        }
        if (!next || !items.length) break;
        cursor = next;
      }
      const seen = new Set<string>();
      const unique = results.filter(({ entry }) => !seen.has(entry.id) && seen.add(entry.id));
      unique.sort((a, b) => (b.entry.stars ?? 0) - (a.entry.stars ?? 0));
      const entries = this.remember(unique);
      this.featured = { entries, fetchedAt: Date.now() };
      await mkdir(this.cacheDir, { recursive: true });
      await writeFile(this.cacheFile(), JSON.stringify({
        entries, fetchedAt: this.featured.fetchedAt,
        icons: Object.fromEntries(unique.map(({ entry, icons }) => [entry.id, icons])),
      }));
      return this.featured;
    } catch (error) {
      if (this.featured) return { ...this.featured, stale: true };
      throw error;
    }
  }

  /** Everyone's servers matching `query`, from the official registry,
   * the vendor's own first, minus what the curated list already has. */
  async search(query: string): Promise<CatalogEntry[]> {
    const key = query.trim().toLowerCase().slice(0, 80);
    if (!key) return [];
    const cached = this.searches.get(key);
    if (cached && Date.now() - cached.at < SEARCH_TTL_MS) return cached.entries;
    const { items } = await this.page(OFFICIAL_REGISTRY, { search: key, version: "latest", limit: "100" });
    const entries = rankSearch(this.official(items), key);
    this.searches.set(key, { entries, at: Date.now() });
    if (this.searches.size > 200) this.searches.delete(this.searches.keys().next().value!);
    return entries;
  }

  /** The whole official registry, a page at a time, in its own order. */
  async browse(cursor?: string): Promise<{ entries: CatalogEntry[]; next?: string }> {
    const { items, next } = await this.page(OFFICIAL_REGISTRY, { version: "latest", limit: "100", ...(cursor ? { cursor } : {}) });
    return { entries: this.official(items), next };
  }

  private official(items: Json[]): CatalogEntry[] {
    const curated = new Set(this.featured?.entries.map((entry) => entry.id));
    return this.remember(items
      .map((item) => normalizeEntry(item, "community"))
      .filter((result): result is { entry: CatalogEntry; icons: string[] } => !!result && !curated.has(result.entry.id)));
  }

  /** One entry by its registry id: the curated list, earlier searches, then
   * a search for its name. Null when no registry has it. */
  async entry(id: string): Promise<CatalogEntry | null> {
    const featured = await this.list().catch(() => null);
    const known = featured?.entries.find((entry) => entry.id === id)
      ?? [...this.searches.values()].flatMap((search) => search.entries).find((entry) => entry.id === id);
    if (known) return known;
    const name = id.split("/").pop() ?? id;
    return (await this.search(name).catch(() => [])).find((entry) => entry.id === id) ?? null;
  }

  /** A logo for an entry this catalog listed. Only URLs the registry gave
   * for that entry are ever fetched, so this cannot be pointed elsewhere. */
  async icon(id: string): Promise<{ body: Buffer; type: string } | null> {
    if (this.iconBytes.has(id)) return this.iconBytes.get(id)!;
    const candidates = this.icons.get(id);
    if (!candidates) return null;
    const file = join(this.cacheDir, "mcp-icons", createHash("sha256").update(id).digest("hex").slice(0, 32));
    try {
      const [type, body] = await Promise.all([readFile(`${file}.type`, "utf8"), readFile(file)]);
      const hit = { body, type };
      this.iconBytes.set(id, hit);
      return hit;
    } catch { /* not cached */ }
    for (const url of candidates) {
      try {
        const response = await this.fetcher(url, { signal: AbortSignal.timeout(8_000), redirect: "follow" });
        const type = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
        if (!response.ok || !/^image\/(png|jpeg|gif|webp|svg\+xml|x-icon|vnd\.microsoft\.icon)$/.test(type)) continue;
        const body = Buffer.from(await response.arrayBuffer());
        if (!body.length || body.length > MAX_ICON_BYTES) continue;
        const hit = { body, type };
        this.iconBytes.set(id, hit);
        await mkdir(join(this.cacheDir, "mcp-icons"), { recursive: true });
        await Promise.all([writeFile(file, body), writeFile(`${file}.type`, type)]);
        return hit;
      } catch { /* next candidate */ }
    }
    this.iconBytes.set(id, null);
    return null;
  }
}
