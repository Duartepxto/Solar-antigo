import { describe, expect, it } from "vitest";
import { claudeCatalogFromCli } from "./claude-catalog.ts";
import { STATIC_CLAUDE_MODELS } from "./claude.ts";

// what Claude Code 2.1.284 answered on this machine, trimmed
const HANDSHAKE = [
  { value: "default", resolvedModel: "claude-opus-5-5", displayName: "Default (recommended)" },
  { value: "opus", resolvedModel: "claude-opus-5-5", displayName: "Opus 5.5" },
  { value: "claude-fable-5-1", resolvedModel: "claude-fable-5-1", displayName: "Fable 5.1" },
  { value: "sonnet", resolvedModel: "claude-sonnet-5-5", displayName: "Sonnet 5.5" },
  { value: "haiku", resolvedModel: "claude-haiku-4-5-20251001", displayName: "Haiku 4.5" },
  { value: "claude-sonnet-5", resolvedModel: "claude-sonnet-5", displayName: "Sonnet 5" },
  { value: "claude-opus-4-8", resolvedModel: "claude-opus-4-8", displayName: "Opus 4.8" },
];

describe("the Claude catalog from the CLI's handshake", () => {
  const catalog = claudeCatalogFromCli(HANDSHAKE, STATIC_CLAUDE_MODELS)!;

  it("lists what the CLI offers, as concrete models, in its order", () => {
    expect(catalog.options.map((option) => [option.id, option.label])).toEqual([
      ["claude-opus-5-5", "Claude Opus 5.5"],
      ["claude-fable-5-1", "Claude Fable 5.1"],
      ["claude-sonnet-5-5", "Claude Sonnet 5.5"],
      ["claude-haiku-4-5", "Claude Haiku 4.5"],
      ["claude-sonnet-5", "Claude Sonnet 5"],
      ["claude-opus-4-8", "Claude Opus 4.8"],
    ]);
  });

  it("keeps what Orbit knows about a model it already listed", () => {
    expect(catalog.options.find((option) => option.id === "claude-opus-5-5")?.contextWindow).toBe(1_000_000);
    // bots saved on the undated id keep matching
    expect(catalog.options.some((option) => option.id === "claude-haiku-4-5-20251001")).toBe(false);
  });

  it("defaults new bots to whatever sonnet now means", () => {
    expect(catalog.default).toBe("claude-sonnet-5-5");
  });

  it("gives up on an empty or foreign list, so the static one stays", () => {
    expect(claudeCatalogFromCli([], STATIC_CLAUDE_MODELS)).toBeNull();
    expect(claudeCatalogFromCli([{ value: "default", resolvedModel: "claude-opus-5-5" }], STATIC_CLAUDE_MODELS)).toBeNull();
    expect(claudeCatalogFromCli([{ value: "gpt", resolvedModel: "gpt-5" }], STATIC_CLAUDE_MODELS)).toBeNull();
  });
});

describe("asking the installed CLI", () => {
  const FAKE_CLI = new URL("../testing/fake-claude-cli.ts", import.meta.url).pathname;

  it("reads the list from the handshake without starting a turn", async () => {
    const { chmodSync } = await import("node:fs");
    const { readClaudeCliModels } = await import("./claude-catalog.ts");
    chmodSync(FAKE_CLI, 0o755);
    const models = await readClaudeCliModels(FAKE_CLI, {
      ...process.env,
      FAKE_CLAUDE_MODELS: JSON.stringify([{ value: "sonnet", resolvedModel: "claude-sonnet-5-5", displayName: "Sonnet 5.5" }]),
    });
    expect(models).toEqual([{ value: "sonnet", resolvedModel: "claude-sonnet-5-5", displayName: "Sonnet 5.5" }]);
  });

  it("answers null for a CLI that is not there", async () => {
    const { readClaudeCliModels } = await import("./claude-catalog.ts");
    expect(await readClaudeCliModels("/nonexistent/claude", process.env, 2_000)).toBeNull();
  });
});

describe("each model's context window", () => {
  const FAKE_CLI = new URL("../testing/fake-claude-cli.ts", import.meta.url).pathname;

  it("comes from the CLI and overrides the fallback", async () => {
    const { chmodSync } = await import("node:fs");
    const { withClaudeContextWindows } = await import("./claude-catalog.ts");
    chmodSync(FAKE_CLI, 0o755);
    const catalog = await withClaudeContextWindows(
      { default: "claude-sonnet-5-5", options: [{ id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5" }, { id: "claude-opus-5-5", label: "Claude Opus 5.5", contextWindow: 1 }] },
      FAKE_CLI, { ...process.env, FAKE_CLAUDE_CONTEXT_WINDOW: "1000000" },
    );
    expect(catalog.options.map((option) => option.contextWindow)).toEqual([1_000_000, 1_000_000]);
  });
});
