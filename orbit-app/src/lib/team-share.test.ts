import { describe, expect, it } from "vitest";

import {
  describePart,
  describeSkip,
  shareRequestBody,
} from "./team-share";
import { parsePackageDocument } from "../../shared/package-format";

const document = parsePackageDocument({
  format: "orbit.package", version: 2,
  package: {
    id: "desk", release: "1.0.0", name: "Desk", tagline: "A desk.", summary: "A desk team.", category: "Sales",
    author: { name: "Mira" }, license: "MIT", outcomes: ["Answers."], setupMinutes: 2, requirements: { apps: [], capabilities: [] },
    team: { name: "Desk" },
    agents: [{ key: "scout", name: "Scout", appearance: { color: "cyan" } }],
    connections: [{ key: "crm", label: "CRM", reason: "Accounts.", mcp: { transport: "http", url: "https://example.com/mcp", valueNames: [] } }],
  },
});

describe("share team request", () => {
  it("builds the v2 export body without empty text", () => {
    expect(shareRequestBody({ team: "Sales desk", name: " Sales ", tagline: "  ", skills: "all", includeMemory: true, dryRun: true }))
      .toEqual({ format: "package", version: 2, team: "Sales desk", name: "Sales", tagline: undefined, summary: undefined, release: undefined,
        notes: undefined, skills: "all", includeMemory: true, dryRun: true });
    expect(shareRequestBody({ team: "", skills: ["a"], includeMemory: false }))
      .toMatchObject({ team: "", skills: ["a"], includeMemory: false });
  });
});

describe("part names", () => {
  it("turns part paths into words and never shows a value", () => {
    expect(describePart("agents[scout].soul", document)).toBe("Scout · standing instructions");
    expect(describePart('agents[scout].seed.memory["memory/pricing.md"]', document)).toBe("Scout · starter notes · memory/pricing.md");
    expect(describePart("connections[crm].mcp.url", document)).toBe("CRM · address");
    expect(describePart("team.brief", document)).toBe("shared instructions");
    expect(describePart("package.summary", document)).toBe("summary");
    expect(describeSkip({ part: "connections[local]", reason: "stdio_server" }, document)).toBe("local · connection — runs a command on this computer, so it is not shared");
    expect(describeSkip({ part: "agents[scout].appearance.avatar", reason: "something_new" }, document)).toBe("Scout · picture — something_new");
  });
});
