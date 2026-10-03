import { describe, expect, it } from "vitest";
import { OrbitChangeError, OrbitChangeRequests } from "./orbit-change-requests.ts";

function harness(config: Record<string, unknown> = {}) {
  const messages: Array<{ id: string; card?: any }> = [];
  const servers: string[] = [];
  const service = new OrbitChangeRequests({
    store: {
      messagesFor: () => messages,
      appendMessage: (_thread, message) => { const id = `m${messages.length}`; messages.push({ id, card: message.card }); return { id }; },
      patchMessage: (_thread, id, patch) => { const m = messages.find((candidate) => candidate.id === id); if (m) m.card = patch.card; return m ?? null; },
    },
    config: () => config,
    validatePatch: (patch) => { if ((patch as any).threads?.maxConcurrentPerBot > 20) throw new Error("too many"); },
    checkModel: (selection) => (selection as any)?.instanceId === "claude" ? { selection: { instanceId: "claude", model: String((selection as any).model).trim() } } : { error: "unknown engine" },
    mcpServerNames: () => servers,
  });
  return { service, messages, servers, config };
}

describe("the Orbit agent's settings proposals", () => {
  it("shows before → after, and settles only once the app has applied it", () => {
    const h = harness({ features: { showToolCalls: false } });
    const proposed = h.service.proposeSettings({ botId: "orbit", threadId: "t", reason: "You asked to see what bots run", changes: [{ setting: "show_tool_calls", value: true }] });
    expect(proposed.detail).toContain("Show tool calls in chat: false → true");
    expect(h.messages[0].card.orbitChange.patch).toEqual({ features: { showToolCalls: true } });
    // Apply pressed before the app changed anything: refused
    expect(h.service.resolve({ botId: "orbit", threadId: "t", requestId: proposed.requestId, behavior: "allow" })).toMatchObject({ state: "invalid", status: 409 });
    (h.config.features as any).showToolCalls = true;
    expect(h.service.resolve({ botId: "orbit", threadId: "t", requestId: proposed.requestId, behavior: "allow" })).toMatchObject({ state: "applied" });
    expect(h.service.resolve({ botId: "orbit", threadId: "t", requestId: proposed.requestId, behavior: "allow" })).toMatchObject({ state: "already_settled" });
  });

  it("proposes the person's profile, the new About me in full and a long old one shortened", () => {
    const h = harness({ profile: { name: "Fernando", email: "f@example.com", aboutMe: "x".repeat(400) } });
    const aboutMe = `I'm Fernando. I want to automate most of my life. ${"y".repeat(300)}`;
    const proposed = h.service.proposeSettings({ botId: "orbit", threadId: "t", reason: "You asked me to fill it in", changes: [{ setting: "about_me", value: aboutMe }] });
    expect(proposed.detail).toContain(`→ ${aboutMe}`);
    expect(proposed.detail).toContain(`${"x".repeat(160)}… →`);
    expect(h.messages[0].card.orbitChange.patch).toEqual({ profile: { aboutMe } });
    expect(() => h.service.proposeSettings({ botId: "orbit", threadId: "t", reason: "why", changes: [{ setting: "profile_name", value: "Fernando" }] })).toThrow(/Nothing would change/);
  });

  it("refuses settings off the list, invalid values, no-ops and a missing reason", () => {
    const h = harness({ language: "en" });
    const propose = (changes: unknown, reason: unknown = "why") => () => h.service.proposeSettings({ botId: "o", threadId: "t", changes, reason });
    expect(propose([{ setting: "anthropic_key", value: "sk-x" }])).toThrow(/not a setting Orbit can change/);
    expect(propose([{ setting: "show_tool_calls", value: "yes" }])).toThrow(/true or false/);
    expect(propose([{ setting: "language", value: "en" }])).toThrow(/Nothing would change/);
    expect(propose([{ setting: "parallel_threads_per_bot", value: 99 }])).toThrow(/too many/);
    expect(propose([{ setting: "default_model", value: { instanceId: "nope", model: "x" } }])).toThrow(/unknown engine/);
    expect(propose([{ setting: "language", value: "pt-br" }], "")).toThrow(OrbitChangeError);
  });
});

describe("the Orbit agent's MCP proposals", () => {
  const entry = { id: "app.linear/linear", title: "Linear", slug: "linear", publisher: "linear.app", source: "github" as const, description: "Issues", ways: ["online at https://mcp.linear.app/mcp (you sign in)"] };
  it("opens Explore and settles once the server exists", () => {
    const h = harness();
    const proposed = h.service.proposeMcp({ botId: "o", threadId: "t", reason: "Your triage bot needs Linear", entry });
    expect(h.messages[0].card.options).toEqual(["Review in Explore", "Not now"]);
    expect(h.service.resolve({ botId: "o", threadId: "t", requestId: proposed.requestId, behavior: "allow" })).toMatchObject({ state: "invalid" });
    h.servers.push("linear");
    expect(h.service.resolve({ botId: "o", threadId: "t", requestId: proposed.requestId, behavior: "allow" })).toMatchObject({ state: "applied" });
  });
  it("won't propose what is already installed, and a cancel settles it", () => {
    const h = harness();
    h.servers.push("linear");
    expect(() => h.service.proposeMcp({ botId: "o", threadId: "t", reason: "r", entry })).toThrow(/already installed/);
    h.servers.length = 0;
    const proposed = h.service.proposeMcp({ botId: "o", threadId: "t", reason: "r", entry });
    expect(h.service.resolve({ botId: "o", threadId: "t", requestId: proposed.requestId, behavior: "deny" })).toMatchObject({ state: "denied" });
  });
});

describe("which server settles an MCP card", async () => {
  const { mcpNameFor } = await import("./orbit-change-requests.ts");
  it("is the slug or the slug with a number, never a longer name", () => {
    expect(mcpNameFor("github", "github")).toBe(true);
    expect(mcpNameFor("github", "github-2")).toBe(true);
    expect(mcpNameFor("github", "github-enterprise")).toBe(false);
    expect(mcpNameFor("a.b", "axb")).toBe(false);
  });
});
