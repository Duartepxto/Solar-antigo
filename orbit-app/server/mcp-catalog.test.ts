import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { catalogPublisher, catalogSlug, McpCatalog, normalizeEntry, rankSearch } from "./mcp-catalog.ts";

const stripe = {
  server: {
    name: "com.stripe/mcp",
    title: "Stripe",
    description: "Payments",
    websiteUrl: "https://stripe.com",
    remotes: [{ type: "streamable-http", url: "https://mcp.stripe.com" }],
    _meta: { "io.modelcontextprotocol.registry/publisher-provided": { github: { stargazerCount: 1837, ownerAvatarUrl: "https://avatars.githubusercontent.com/u/856813?v=4", topics: ["payments"] } } },
  },
};

const github = {
  server: {
    name: "io.github.github/github-mcp-server",
    description: "GitHub's official MCP server",
    repository: { url: "https://github.com/github/github-mcp-server" },
    packages: [{
      registryType: "oci", identifier: "ghcr.io/github/github-mcp-server:1.12.2", transport: { type: "stdio" },
      environmentVariables: [{ name: "GITHUB_PERSONAL_ACCESS_TOKEN", isRequired: true, isSecret: true }],
    }],
    remotes: [{ type: "streamable-http", url: "https://api.githubcopilot.com/mcp/", headers: [{ name: "Authorization", isSecret: true, isRequired: true }] }],
  },
};

describe("normalizeEntry", () => {
  it("turns a remote into a URL install with its logo candidates", () => {
    const result = normalizeEntry(stripe, "github")!;
    expect(result.entry).toMatchObject({ id: "com.stripe/mcp", slug: "stripe", title: "Stripe", stars: 1837, source: "github" });
    expect(result.entry.installs).toEqual([{ kind: "remote", transport: "http", url: "https://mcp.stripe.com", headers: [] }]);
    expect(result.entry.icon).toBe("/api/mcp/catalog/icon?id=com.stripe%2Fmcp");
    expect(result.icons).toEqual(["https://avatars.githubusercontent.com/u/856813?v=4", "https://stripe.com/favicon.ico"]);
  });

  it("keeps secret headers and package variables for the person to fill", () => {
    const { entry } = normalizeEntry(github, "github")!;
    expect(entry.installs[0]).toMatchObject({ kind: "remote", headers: [{ name: "Authorization", secret: true, required: true }] });
    expect(entry.installs[1]).toEqual({
      kind: "oci", identifier: "ghcr.io/github/github-mcp-server:1.12.2", command: "docker",
      args: ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server:1.12.2"],
      env: [{ name: "GITHUB_PERSONAL_ACCESS_TOKEN", description: undefined, required: true, secret: true, default: undefined }],
    });
  });

  it("pins npm and pypi packages to the published version", () => {
    const { entry } = normalizeEntry({ server: { name: "x/y", packages: [
      { registryType: "npm", identifier: "@acme/mcp", version: "1.2.3", transport: { type: "stdio" } },
      { registryType: "pypi", identifier: "acme-mcp", version: "0.4", transport: { type: "stdio" } },
    ] } }, "community")!;
    expect(entry.installs.map((install) => install.kind === "remote" ? install.url : [install.command, ...install.args].join(" ")))
      .toEqual(["npx -y @acme/mcp@1.2.3", "uvx acme-mcp==0.4"]);
  });

  it("skips what Orbit cannot run and anything deleted or templated", () => {
    expect(normalizeEntry({ server: { name: "a/b", packages: [{ registryType: "nuget", identifier: "X" }] } }, "github")).toBeUndefined();
    expect(normalizeEntry({ server: { name: "a/b", remotes: [{ type: "streamable-http", url: "https://{tenant}.example.com/mcp" }] } }, "github")).toBeUndefined();
    expect(normalizeEntry({ server: { name: "a/b", remotes: [{ type: "sse", url: "http://insecure.example.com" }] } }, "github")).toBeUndefined();
    expect(normalizeEntry({ ...stripe, _meta: { "io.modelcontextprotocol.registry/official": { status: "deleted" } } }, "community")).toBeUndefined();
  });
});

describe("catalogSlug", () => {
  it("makes valid server names", () => {
    expect(catalogSlug("io.github.getsentry/sentry-mcp")).toBe("sentry");
    expect(catalogSlug("x/y", "Atlassian Rovo MCP Server")).toBe("atlassian-rovo");
    expect(catalogSlug("x/y", "123 Tools")).toBe("mcp-123-tools");
    expect(catalogSlug("x/y", "A".repeat(60))).toMatch(/^[a-z][a-z0-9_-]{0,31}$/);
  });
});

describe("McpCatalog", () => {
  let dir = "";
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

  function catalog(routes: Record<string, () => Response>) {
    dir = mkdtempSync(join(tmpdir(), "mcp-catalog-"));
    const asked: string[] = [];
    const fetcher = async (url: string) => {
      asked.push(url);
      const route = Object.keys(routes).find((prefix) => url.startsWith(prefix));
      return route ? routes[route]() : new Response("", { status: 404 });
    };
    return { catalog: new McpCatalog(dir, fetcher as typeof fetch), asked };
  }

  it("lists the curated registry by stars and serves only logos it listed", async () => {
    const { catalog: c, asked } = catalog({
      "https://api.mcp.github.com/": () => Response.json({ servers: [github, stripe], metadata: {} }),
      "https://avatars.githubusercontent.com/": () => new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "image/png" } }),
    });
    const list = await c.list();
    expect(list.entries.map((entry) => entry.slug)).toEqual(["stripe", "github"]);
    expect((await c.icon("com.stripe/mcp"))?.type).toBe("image/png");
    expect(await c.icon("https://attacker.example/x.png")).toBeNull();
    expect(asked.some((url) => url.includes("attacker"))).toBe(false);
  });

  it("refuses a logo that is not an image", async () => {
    const { catalog: c } = catalog({
      "https://api.mcp.github.com/": () => Response.json({ servers: [stripe], metadata: {} }),
      "https://avatars.githubusercontent.com/": () => new Response("<html>", { headers: { "content-type": "text/html" } }),
      "https://stripe.com/": () => new Response("<script>", { headers: { "content-type": "text/html" } }),
    });
    await c.list();
    expect(await c.icon("com.stripe/mcp")).toBeNull();
  });

  it("labels search hits Community and drops ones already curated", async () => {
    const { catalog: c } = catalog({
      "https://api.mcp.github.com/": () => Response.json({ servers: [stripe], metadata: {} }),
      "https://registry.modelcontextprotocol.io/": () => Response.json({ servers: [stripe, { server: { name: "io.acme/linear-tools", remotes: [{ type: "streamable-http", url: "https://acme.dev/mcp" }] } }] }),
    });
    await c.list();
    const hits = await c.search("linear");
    expect(hits.map((entry) => [entry.id, entry.source])).toEqual([["io.acme/linear-tools", "community"]]);
  });

  it("keeps the last list when the registry is down", async () => {
    let up = true;
    const { catalog: c } = catalog({
      "https://api.mcp.github.com/": () => up ? Response.json({ servers: [stripe], metadata: {} }) : new Response("", { status: 503 }),
    });
    await c.list();
    up = false;
    const again = await c.list(true);
    expect(again.stale).toBe(true);
    expect(again.entries).toHaveLength(1);
  });
});

describe("publisher and ranking", () => {
  it("names who the registry verified", () => {
    expect(catalogPublisher("app.linear/linear")).toBe("linear.app");
    expect(catalogPublisher("io.github.getsentry/sentry-mcp")).toBe("github.com/getsentry");
    expect(catalogPublisher("microsoft/markitdown")).toBeUndefined();
  });

  it("puts the vendor's own server first", () => {
    const entry = (id: string, title: string) => normalizeEntry({ server: { name: id, title, remotes: [{ type: "streamable-http", url: "https://x.dev/mcp" }] } }, "community")!.entry;
    const ranked = rankSearch([entry("ai.smithery/smithery-notion", "Notion"), entry("io.github.a/better-notion", "Better Notion"), entry("com.notion/mcp", "Notion MCP")], "notion");
    expect(ranked.map((e) => e.id)).toEqual(["com.notion/mcp", "ai.smithery/smithery-notion", "io.github.a/better-notion"]);
  });
});
