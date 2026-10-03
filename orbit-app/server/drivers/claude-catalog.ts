// Claude's model list, from the installed Claude Code CLI itself.
//
// The Claude catalog used to be a hard-coded list ported from t3code's
// shared contracts, so every new model (Opus 5.5, Sonnet 5.5) waited for a
// code change. The CLI already knows what this login can use: its
// stream-json `initialize` handshake answers with the model list, the same
// one its /model menu shows. Codex, Antigravity and Cursor already read
// their catalogs from their CLIs; this does the same for Claude.
//
// Each model's context window comes from the CLI too: `get_context_usage`,
// the request behind /context, reports it for the process's --model. The
// model list leaves it out, and one process cannot switch models reliably
// (set_model applies late), so it is one short process per model, in
// parallel.
//
// None of this sends a prompt or uses tokens. Anything short of a
// clean answer (an older CLI without the list, no login, a timeout) returns
// null, and the caller keeps the static list.
import { homedir } from "node:os";

import type { ModelCatalog } from "../contracts.ts";
import { killCliTree, spawnCli } from "../procs.ts";

export interface ClaudeCliModel {
  value?: unknown;
  resolvedModel?: unknown;
  displayName?: unknown;
}

type Option = ModelCatalog["options"][number];

/** "claude-haiku-4-5-20251001" and "claude-haiku-4-5" are the same model. */
const undated = (id: string) => id.replace(/-\d{8}$/, "");

/**
 * Turn the handshake's list into Orbit's catalog.
 *
 * - Aliases (default, opus, sonnet, haiku) are stored as the model they
 *   resolve to: a bot saved on "sonnet" would otherwise change model the
 *   day the alias moves, and prices, context windows and approval checks
 *   are all keyed on the concrete id.
 * - "default" is the CLI's recommendation, not a model; it is dropped.
 * - New bots default to whatever "sonnet" resolves to, keeping Orbit's
 *   Sonnet default while following new versions.
 * - A known id keeps its static row's extras (the context window) and, for
 *   a dated id, the undated spelling bots already have saved.
 */
export function claudeCatalogFromCli(models: ClaudeCliModel[], known: ModelCatalog): ModelCatalog | null {
  const byUndated = new Map(known.options.map((option) => [undated(option.id), option]));
  const options: Option[] = [];
  const seen = new Set<string>();
  let sonnet: string | undefined;
  for (const model of models) {
    const value = typeof model.value === "string" ? model.value : "";
    const resolved = typeof model.resolvedModel === "string" && model.resolvedModel ? model.resolvedModel : value;
    if (!value || value === "default" || !/^claude-[a-z0-9.-]+$/i.test(resolved)) continue;
    const previous = byUndated.get(undated(resolved));
    const id = previous?.id ?? resolved;
    if (value === "sonnet") sonnet = id;
    if (seen.has(id)) continue;
    seen.add(id);
    const label = typeof model.displayName === "string" && model.displayName.trim()
      ? `Claude ${model.displayName.trim().replace(/^Claude\s+/i, "")}`
      : previous?.label ?? id;
    options.push({ ...previous, id, label });
  }
  if (!options.length) return null;
  const fallback = options.some((option) => option.id === known.default) ? known.default : options[0].id;
  return { default: sonnet ?? fallback, options };
}

/** Ask the installed CLI for its model list. Null when it cannot say. */
export async function readClaudeCliModels(
  cli: string,
  env: Record<string, string | undefined>,
  timeoutMs = 8_000,
): Promise<ClaudeCliModel[] | null> {
  const response = await askClaude(cli, env, [], { subtype: "initialize" }, timeoutMs);
  return Array.isArray(response?.models) ? response.models as ClaudeCliModel[] : null;
}

/** One control request to a fresh `claude -p` process; its response, or null. */
function askClaude(
  cli: string,
  env: Record<string, string | undefined>,
  extraArgs: string[],
  request: Record<string, unknown>,
  timeoutMs: number,
): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    let settled = false;
    let buffer = "";
    // The same isolation a bot's turn gets: the person's own MCP servers,
    // hooks and plugins are not started just to read a list.
    const child = spawnCli(cli, [
      "-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose",
      "--setting-sources", "project", "--strict-mcp-config", ...extraArgs,
    ], { cwd: homedir(), env, stdio: ["pipe", "pipe", "ignore"] });
    const finish = (response: Record<string, unknown> | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { child.stdin?.end(); } catch { /* already closed */ }
      killCliTree(child);
      resolve(response);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    child.on("error", () => finish(null));
    child.on("exit", () => finish(null));
    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      buffer += chunk;
      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        let frame: { type?: string; response?: { subtype?: string; request_id?: string; response?: Record<string, unknown> } };
        try { frame = JSON.parse(line); } catch { continue; }
        if (frame.type !== "control_response" || frame.response?.request_id !== "orbit") continue;
        finish(frame.response.subtype === "success" ? frame.response.response ?? {} : null);
        return;
      }
    });
    child.stdin?.on("error", () => finish(null));
    child.stdin?.write(`${JSON.stringify({ type: "control_request", request_id: "orbit", request })}\n`);
  });
}

/** The context window the CLI gives `model`, in tokens. Null when it cannot say. */
export async function readClaudeContextWindow(
  cli: string,
  env: Record<string, string | undefined>,
  model: string,
  timeoutMs = 8_000,
): Promise<number | null> {
  const response = await askClaude(cli, env, ["--model", model], { subtype: "get_context_usage" }, timeoutMs);
  const max = response?.maxTokens;
  return typeof max === "number" && Number.isFinite(max) && max > 0 ? max : null;
}

/** The catalog with each model's window as the CLI reports it, four at a time. */
export async function withClaudeContextWindows(
  catalog: ModelCatalog,
  cli: string,
  env: Record<string, string | undefined>,
): Promise<ModelCatalog> {
  const options = catalog.options.map((option) => ({ ...option }));
  let next = 0;
  const worker = async () => {
    while (next < options.length) {
      const option = options[next++];
      const window = await readClaudeContextWindow(cli, env, option.id);
      if (window) option.contextWindow = window;
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, options.length) }, worker));
  return { ...catalog, options };
}
