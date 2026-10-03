// Recognizing a request to attach to the person's logged-in browser.
//
// cua-driver's `browser_prepare` with `strategy: {kind: "existing_profile"}`
// attaches the page/browser tools to a Chromium browser the person already
// has open, signed in as them. Orbit launches the driver with the launch
// grant that makes this possible (electron/cua-embedded-daemon.mjs), so the
// harness is the only thing between a bot and every site the person is logged
// into: each such call needs the person's explicit yes
// (server/browser-profile-consent.ts).
//
// Pure and dependency-free: the stdio bridge (local-computer-proxy) and the
// engine drivers both import it.

export interface BrowserProfileTarget {
  /** The browser process the bot named, when it named one. */
  pid?: number;
  /** The exact native window the driver anchors the approval to. */
  windowId?: number;
}

function record(value: unknown): Record<string, unknown> | null {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function wholeNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d{1,15}$/.test(value)) return Number(value);
  return undefined;
}

/** The bare tool name, whatever wrapper an engine put round it:
 * `mcp__computer__browser_prepare` (Claude), `computer.browser_prepare` /
 * `computer:browser_prepare` / `computer/browser_prepare` (Codex, ACP titles),
 * `computer_browser_prepare` (pi's allocated name). */
export function isBrowserPrepareTool(tool: unknown): boolean {
  if (typeof tool !== "string") return false;
  const name = tool.trim().toLowerCase();
  return name === "browser_prepare" || /(?:^|__|[.:/\s_])browser_prepare$/.test(name);
}

/** The target of an existing-profile attachment, or null when the arguments
 * ask for anything else (an isolated profile, a plain endpoint check). A
 * strategy the driver would read as existing_profile is always caught: the
 * kind is compared case-insensitively and a JSON-string input is parsed. */
export function existingProfileTarget(input: unknown): BrowserProfileTarget | null {
  const args = record(input);
  if (!args) return null;
  const strategy = record(args.strategy);
  const kind = typeof strategy?.kind === "string" ? strategy.kind.trim().toLowerCase() : "";
  if (kind !== "existing_profile" && kind !== "existing-profile") return null;
  const pid = wholeNumber(args.pid);
  const windowId = wholeNumber(args.window_id ?? args.windowId);
  return { ...(pid !== undefined ? { pid } : {}), ...(windowId !== undefined ? { windowId } : {}) };
}

/** For a tool call as an engine or MCP frame describes it. */
export function existingProfileCall(tool: unknown, input: unknown): BrowserProfileTarget | null {
  return isBrowserPrepareTool(tool) ? existingProfileTarget(input) : null;
}

/** The one key a conversation grant is remembered under: the same browser
 * process and the same window. A browser restart (new pid) or another window
 * asks again. */
export function browserProfileGrantKey(target: BrowserProfileTarget): string {
  return `${target.pid ?? "?"}:${target.windowId ?? "?"}`;
}

const BROWSER_NAMES: [RegExp, string][] = [
  [/brave/i, "Brave"],
  [/microsoft edge|msedge/i, "Edge"],
  [/google chrome|chrome/i, "Chrome"],
  [/chromium/i, "Chromium"],
  [/vivaldi/i, "Vivaldi"],
  [/opera/i, "Opera"],
  [/\barc\b|\/arc\.app\//i, "Arc"],
  [/\bdia\b|\/dia\.app\//i, "Dia"],
  [/comet/i, "Comet"],
];

/** A short name for the browser from its executable path, or null. */
export function browserNameFromCommand(command: string | null | undefined): string | null {
  if (!command) return null;
  for (const [pattern, name] of BROWSER_NAMES) if (pattern.test(command)) return name;
  return null;
}
