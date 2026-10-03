import { describe, expect, it } from "vitest";
import { formatStars, freeServerName, installBody } from "./McpExplore";

describe("adding from the registry", () => {
  it("signs in with OAuth when a URL server asks for no headers", () => {
    expect(installBody("linear", { kind: "remote", transport: "http", url: "https://mcp.linear.app/mcp", headers: [] }, {}))
      .toEqual({ name: "linear", type: "http", url: "https://mcp.linear.app/mcp", headers: {}, auth: "oauth" });
  });

  it("sends the key a URL server asked for, and no OAuth", () => {
    const install = { kind: "remote" as const, transport: "http" as const, url: "https://api.githubcopilot.com/mcp/", headers: [{ name: "Authorization", required: true, secret: true }] };
    expect(installBody("github", install, { Authorization: " Bearer abc " }))
      .toEqual({ name: "github", type: "http", url: "https://api.githubcopilot.com/mcp/", headers: { Authorization: "Bearer abc" } });
  });

  it("runs a package with exactly the listed command and only the variables filled", () => {
    const install = { kind: "npm" as const, identifier: "@acme/mcp", command: "npx", args: ["-y", "@acme/mcp@1.0.0"], env: [
      { name: "ACME_KEY", required: true, secret: true },
      { name: "ACME_REGION", required: false, secret: false, default: "eu" },
      { name: "ACME_DEBUG", required: false, secret: false },
    ] };
    expect(installBody("acme", install, { ACME_KEY: "k" }))
      .toEqual({ name: "acme", command: "npx", args: ["-y", "@acme/mcp@1.0.0"], env: { ACME_KEY: "k", ACME_REGION: "eu" } });
  });

  it("never reuses a taken name", () => {
    expect(freeServerName("linear", [])).toBe("linear");
    expect(freeServerName("linear", ["linear", "linear-2"])).toBe("linear-3");
    expect(freeServerName("a".repeat(32), ["a".repeat(32)])).toMatch(/^[a-z][a-z0-9_-]{0,31}$/);
  });

  it("shortens star counts", () => {
    expect([formatStars(866), formatStars(1837), formatStars(62472)]).toEqual(["866", "1.8k", "62k"]);
  });
});
