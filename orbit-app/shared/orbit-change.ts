// What the Orbit agent may propose changing (docs/design/orbit-agent.md).
//
// A proposal is a card the person applies: a settings change is applied by
// the app through the ordinary Settings API (the same validation and the
// desktop's own authority as the Settings screen), and an MCP server is
// added in Plugins → Explore, where the person fills in any key themselves.
// Keys, credentials, engines, pairing, backups and anything security-
// related are deliberately not on this list.

export const ORBIT_SETTINGS = {
  show_tool_calls: { label: "Show tool calls in chat", path: ["features", "showToolCalls"], type: "boolean" },
  built_in_browser: { label: "Built-in browser for bots", path: ["features", "browser"], type: "boolean" },
  thread_titles: { label: "AI-written thread titles", path: ["features", "llmThreadTitles"], type: "boolean" },
  language: { label: "App language", path: ["language"], type: "string" },
  parallel_threads_per_bot: { label: "Threads each bot runs at once", path: ["threads", "maxConcurrentPerBot"], type: "number" },
  channel_turn_minutes: { label: "Channel turn time limit (minutes)", path: ["rooms", "turnTimeoutMinutes"], type: "number" },
  monthly_budget_usd: { label: "Monthly budget (USD)", path: ["budgets", "monthlyUsd"], type: "number" },
  budget_warning_percent: { label: "Warn at this share of the budget (%)", path: ["budgets", "warnAtPercent"], type: "number" },
  default_model: { label: "Default model for new bots", path: ["defaultModelSelection"], type: "model" },
  profile_name: { label: "Your name", path: ["profile", "name"], type: "string" },
  about_me: { label: "About me (every bot reads it)", path: ["profile", "aboutMe"], type: "string" },
} as const;

export type OrbitSettingKey = keyof typeof ORBIT_SETTINGS;

export function isOrbitSettingKey(value: unknown): value is OrbitSettingKey {
  return typeof value === "string" && Object.hasOwn(ORBIT_SETTINGS, value);
}

export interface OrbitSettingChange {
  key: OrbitSettingKey;
  label: string;
  before: unknown;
  after: unknown;
}

export interface OrbitChangeCardData {
  version: 1;
  requestId: string;
  /** the Orbit agent and the conversation the card lives in */
  botId: string;
  threadId: string;
  kind: "settings" | "mcp";
  reason: string;
  createdAt: number;
  /** settings: each change, and the config patch the app applies */
  changes?: OrbitSettingChange[];
  patch?: Record<string, unknown>;
  /** mcp: the registry entry to review in Explore */
  mcp?: { registryId: string; title: string; slug: string; publisher?: string; source: "github" | "community" };
  appliedAt?: number;
}

/** A config patch from dotted paths: { features: { showToolCalls: true } }. */
export function orbitSettingsPatch(changes: ReadonlyArray<{ key: OrbitSettingKey; after: unknown }>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const change of changes) {
    const path = ORBIT_SETTINGS[change.key].path as readonly string[];
    let node = patch;
    for (const part of path.slice(0, -1)) {
      node[part] = (node[part] as Record<string, unknown> | undefined) ?? {};
      node = node[part] as Record<string, unknown>;
    }
    node[path[path.length - 1]!] = change.after;
  }
  return patch;
}

/** A setting's current value in a config-shaped object. */
export function orbitSettingValue(config: unknown, key: OrbitSettingKey): unknown {
  let node: unknown = config;
  for (const part of ORBIT_SETTINGS[key].path as readonly string[]) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}
