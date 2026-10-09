import { afterAll, describe, expect, it, vi } from "vitest";
import type { AppState, Bot, InstanceInfo } from "@/state/store";

vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {} });
const { botEngineDetails, engineReadiness } = await import("./bot-engine");
const { botSystems } = await import("../orbit/systems");
afterAll(() => vi.unstubAllGlobals());

const instances: InstanceInfo[] = [
  { instanceId: "claude", displayName: "Claude", driverKind: "claudeAgent", snapshot: { state: "available", authenticated: false }, models: { default: "opus", options: [{ id: "opus", label: "Opus" }, { id: "local", label: "Local", custom: true }] } },
  { instanceId: "codex", displayName: "Codex", driverKind: "codex", snapshot: { state: "available", authenticated: true }, models: { default: "gpt", options: [{ id: "gpt", label: "GPT" }] } },
];
const profile: Bot = {
  id: "fixture", threadId: "current", name: "Fixture", title: "", description: "", notifications: true, color: "green", unread: false, messages: [],
  modelSelection: { instanceId: "claude", model: "opus" },
  busy: true,
  tasks: [
    { threadId: "current", title: "Current", createdAt: 1, busy: false, activity: "idle", modelSelection: { instanceId: "codex", model: "gpt", effort: "high" } },
    { threadId: "other", title: "Other", createdAt: 2, busy: true, activity: "working", modelSelection: { instanceId: "claude", model: "opus" } },
  ],
};

describe("conversation engine truth", () => {
  it("resolves the selected thread override and follows thread changes without altering defaults", () => {
    expect(botEngineDetails(profile, instances)).toMatchObject({ engine: "Codex", model: "GPT", selection: { instanceId: "codex", effort: "high" }, bot: { busy: false } });
    expect(botEngineDetails({ ...profile, threadId: "other" }, instances)).toMatchObject({ engine: "Claude", model: "Opus", bot: { busy: true } });
    expect(profile.modelSelection).toEqual({ instanceId: "claude", model: "opus" });
  });

  it("falls back to the stored bot route only when the thread has no override", () => {
    expect(botEngineDetails({ ...profile, tasks: [{ threadId: "current", title: "Legacy", createdAt: 1 }] }, instances)).toMatchObject({ engine: "Claude", model: "Opus" });
  });

  it("preserves a missing provider/model ID instead of advertising another available engine", () => {
    const selection = { instanceId: "removed", model: "saved-model" };
    const result = botEngineDetails({ ...profile, tasks: [], modelSelection: selection }, instances);
    expect(result).toMatchObject({ engine: "removed", model: "saved-model", instance: undefined });
    expect(engineReadiness(result.instance, selection)).toEqual({ ready: false, label: "Not available" });
  });

  it("shows the same selected model, effort and idle state on the canvas engine system", () => {
    const state = { instances, routines: [], routineRuns: [] } as unknown as AppState;
    const system = botSystems(profile, state, () => {}, {}, null).find((item) => item.key === "engine");
    expect(system).toMatchObject({ value: "Codex · GPT · high", status: "Ready", live: false });
  });

  it("reports signed-out, unavailable and policy-blocked routes instead of Ready", () => {
    const selection = { instanceId: "claude", model: "opus" };
    expect(engineReadiness(instances[0], selection)).toEqual({ ready: false, label: "Sign-in required" });
    expect(engineReadiness({ ...instances[0]!, snapshot: { state: "unavailable", reason: "Engine missing" } }, selection)).toEqual({ ready: false, label: "Engine missing" });
    expect(engineReadiness({ ...instances[1]!, policy: { organizationName: "Fixture", reason: "Disabled by fixture policy" } }, { instanceId: "codex", model: "gpt" })).toEqual({ ready: false, label: "Disabled by fixture policy" });
  });

  it("does not require cloud authentication for a selected custom local model", () => {
    expect(engineReadiness(instances[0], { instanceId: "claude", model: "local" }).ready).toBe(true);
    expect(engineReadiness({ ...instances[0]!, access: "custom" }, { instanceId: "claude", model: "injected" }).ready).toBe(true);
  });
});
