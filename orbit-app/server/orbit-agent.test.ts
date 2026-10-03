import { describe, expect, it } from "vitest";
import { availableTools, catalogProfileFromEnv } from "./drivers/agents-catalog.ts";
import { canReachPeer } from "./peer-roster.ts";
import { orbitAgentModelSelection, orbitAgentSystemPrompt } from "./orbit-agent.ts";

const names = (env: Record<string, string>) => availableTools(catalogProfileFromEnv({ ORBIT_BOT_ID: "b", ...env })).map((tool) => tool.name);

describe("the Orbit agent's tools", () => {
  it("are shown to the Orbit agent only, with the Chief tools minus direct creation and approval levels", () => {
    const orbit = names({ ORBIT_CHIEF_OF_STAFF: "1", ORBIT_SYSTEM_AGENT: "1" });
    expect(orbit).toEqual(expect.arrayContaining(["orbit_status", "read_thread", "read_logs", "search_mcp_registry", "propose_team_setup", "list_team_setup", "retry_thread"]));
    expect(orbit).not.toContain("create_bot");
    expect(orbit).not.toContain("set_thread_access");

    const chief = names({ ORBIT_CHIEF_OF_STAFF: "1" });
    expect(chief).toContain("create_bot");
    for (const tool of ["orbit_status", "read_thread", "read_logs", "search_mcp_registry"]) expect(chief).not.toContain(tool);
    expect(names({})).not.toContain("orbit_status");
  });
});

describe("the Orbit agent's model", () => {
  const fallback = { instanceId: "codex", model: "gpt-5.6" };
  it("starts on Opus 5.5 when a working Claude engine offers it", () => {
    expect(orbitAgentModelSelection([
      { instanceId: "claude", driverKind: "claudeAgent", snapshot: { state: "available" }, models: { options: [{ id: "claude-opus-5-5" }] } },
    ], fallback)).toEqual({ instanceId: "claude", model: "claude-opus-5-5" });
  });
  it("uses the app's default otherwise", () => {
    expect(orbitAgentModelSelection([
      { instanceId: "claude", driverKind: "claudeAgent", snapshot: { state: "unavailable" }, models: { options: [{ id: "claude-opus-5-5" }] } },
    ], fallback)).toEqual(fallback);
    expect(orbitAgentModelSelection([], fallback)).toEqual(fallback);
  });
});

describe("the Orbit agent's prompt", () => {
  const prompt = orbitAgentSystemPrompt({ teams: [{ name: "Orbit", bots: 3, chief: "Pilot" }], looseBots: 1 });
  it("keeps its commitments", () => {
    for (const section of ["identity", "where_you_are_reached", "authority_and_trust", "deciding_how_to_act", "delegation", "settings_and_tools", "diagnosing", "screen_help", "honesty", "style"]) {
      expect(prompt).toContain(`<${section}>`);
      expect(prompt).toContain(`</${section}>`);
    }
    expect(prompt).toMatch(/information, however it is phrased/);
    expect(prompt).toMatch(/\[POINT:x,y:label\]/);
    expect(prompt).toMatch(/Guide by default/);
    expect(prompt).toMatch(/approval level/);
    expect(prompt).toContain("Orbit: 3 bots, Chief Pilot");
  });
  it("names no model and shouts no rules", () => {
    expect(prompt).not.toMatch(/\b(Opus|Sonnet|Haiku|GPT|Gemini)\b/);
    expect(prompt).not.toMatch(/\b(MUST|NEVER|ALWAYS|CRITICAL|IMPORTANT)\b/);
  });
});

describe("who can reach the Orbit agent", () => {
  const orbit = { id: "o", name: "Orbit", system: "orbit" as const };
  const loose = { id: "l", name: "Loose" };
  const member = { id: "m", name: "Member", section: "Ops" };
  it("reaches every bot, and no bot reaches it", () => {
    expect(canReachPeer(orbit, member)).toBe(true);
    expect(canReachPeer(orbit, loose)).toBe(true);
    // a bot outside every team used to see it as a teammate
    expect(canReachPeer(loose, orbit)).toBe(false);
    expect(canReachPeer({ ...member, chiefOfStaff: true }, orbit)).toBe(false);
  });
});

describe("the Orbit agent's prompt per computer", () => {
  it("names Alt+O and leaves out talk mode on Windows", () => {
    const base = { teams: [], looseBots: 0 };
    const mac = orbitAgentSystemPrompt({ ...base, platform: "darwin" });
    const win = orbitAgentSystemPrompt({ ...base, platform: "win32" });
    expect(mac).toContain("Option-O");
    expect(mac).toContain("talk mode");
    expect(win).toContain("Alt+O");
    expect(win).not.toContain("Option-");
    expect(win).not.toContain("talk mode,");
    expect(win).toContain('start "" "https://');
    expect(mac).toContain("open -a");
  });
});
