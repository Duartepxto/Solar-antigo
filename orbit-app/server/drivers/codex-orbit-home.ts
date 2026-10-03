// Orbit's own Codex home. Codex reads everything personal from CODEX_HOME —
// plugins, skills, MCP servers, AGENTS.md, a replacement system prompt
// (model_instructions_file), notify hooks — and its `-c` overrides can add to
// that but not take it away. So a personal Codex bot runs on a home Orbit
// owns: the person's model and provider settings are copied in, their
// conversation history is linked, and nothing else crosses. Its sign-in is
// its own (one device sign-in from Orbit): sharing auth.json would let one
// side's token refresh log the other out.
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { DATA_DIR } from "../config.ts";

/** Top-level keys that choose a model or where it is served — never
 * behaviour, instructions, tools or hooks. */
const KEPT_KEYS = new Set([
  "model", "model_provider", "model_reasoning_effort", "model_reasoning_summary", "model_verbosity",
  "model_context_window", "model_auto_compact_token_limit", "service_tier", "review_model",
]);
/** Tables copied whole: the providers a kept model is served by. */
const KEPT_TABLE = /^\[\[?\s*model_providers(\.|\s*\])/;
/** Session history Codex resumes from, shared so existing threads continue. */
const LINKED = ["sessions", "archived_sessions"];

/** A config.toml reduced to the model and provider settings. Line-based on
 * purpose: every value Orbit keeps is a single line, and anything else —
 * including multi-line arrays and strings — is skipped whole. */
export function modelOnlyCodexConfig(toml: string): string {
  const out: string[] = [];
  let keepTable = false;
  let inTable = false;
  let skipDepth = 0;
  let skipQuote: string | null = null;
  for (const line of toml.split(/\r?\n/)) {
    // finish skipping a multi-line value
    if (skipQuote) { if (line.includes(skipQuote)) skipQuote = null; continue; }
    if (skipDepth > 0) { skipDepth += depth(line); continue; }
    const trimmed = line.trim();
    if (trimmed.startsWith("[")) {
      inTable = true;
      keepTable = KEPT_TABLE.test(trimmed);
      if (keepTable) out.push(line);
      continue;
    }
    const key = /^([A-Za-z0-9_-]+)\s*=/.exec(trimmed)?.[1];
    const keep = inTable ? keepTable : Boolean(key && KEPT_KEYS.has(key));
    if (key && !keep) {
      const value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
      const quote = value.startsWith('"""') ? '"""' : value.startsWith("'''") ? "'''" : null;
      if (quote && !value.slice(3).includes(quote)) skipQuote = quote;
      else skipDepth = depth(value);
      continue;
    }
    if (keep || (!key && (inTable ? keepTable : true) && (trimmed === "" || trimmed.startsWith("#")))) out.push(line);
  }
  const kept = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  // The account's ChatGPT connected apps (codex_apps) are Codex's claude.ai
  // connectors: the person's, not a bot's, as they are for Claude bots.
  // Top-level keys must come before any table, so this table goes last.
  return `# Written by Orbit from your Codex config: model and provider settings only.\n# Plugins, skills, MCP servers, AGENTS.md and instructions stay in your own Codex.\n${kept}\n\n[features]\napps = false\n`;
}

/** Open brackets minus closed ones outside strings (enough for TOML arrays
 * and inline tables spread over lines). */
function depth(text: string): number {
  let n = 0;
  let quote: string | null = null;
  for (const ch of text) {
    if (quote) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "#") break;
    else if (ch === "[" || ch === "{") n++;
    else if (ch === "]" || ch === "}") n--;
  }
  return Math.max(0, n);
}

/** The person's own Codex home, where the settings and history come from. */
export function personalCodexHome(env: Record<string, string | undefined>): string {
  return join(env.HOME || env.USERPROFILE || homedir(), ".codex");
}

/** Make (or refresh) Orbit's Codex home and return its path. Cheap enough
 * to run before every launch, so a model changed in the person's Codex
 * reaches Orbit's next turn. */
export function prepareOrbitCodexHome(env: Record<string, string | undefined>, dir = join(DATA_DIR, "codex-home")): string {
  const source = personalCodexHome(env);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const configs = existsSync(source) ? readdirSync(source).filter((name) => name === "config.toml" || name.endsWith(".config.toml")) : [];
  // with no config of their own, Orbit's still switches the account's apps off
  if (!configs.includes("config.toml")) configs.push("config.toml");
  for (const name of configs) {
    let text = "";
    try { text = readFileSync(join(source, name), "utf8"); } catch { if (name !== "config.toml") continue; }
    const next = modelOnlyCodexConfig(text);
    const target = join(dir, name);
    try { if (readFileSync(target, "utf8") === next) continue; } catch { /* first write */ }
    const temp = `${target}.${process.pid}.tmp`;
    writeFileSync(temp, next, { mode: 0o600 });
    renameSync(temp, target);
  }
  for (const name of LINKED) {
    const link = join(dir, name);
    const origin = join(source, name);
    if (exists(link)) continue;
    // history lives in the person's home; a first-ever Codex user gets it there too
    mkdirSync(origin, { recursive: true });
    try { symlinkSync(origin, link, "dir"); } catch { /* another launch linked it first */ }
  }
  return dir;
}

function exists(path: string): boolean {
  try { lstatSync(path); return true; } catch { return false; }
}
