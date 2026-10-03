// The Orbit agent's proposals (docs/design/orbit-agent.md): a settings change
// or an MCP server, each a card the person applies.
//
// The server never applies these itself. A settings card is applied by the
// app through PATCH /api/config, the Settings screen's own route with its
// validation and the desktop's authority; an MCP card opens the server in
// Plugins → Explore, where the person fills in any key and adds it. The
// server writes the card, and on "allow" settles it only once the change
// is really in place, so a card can never say "applied" for something that
// isn't.
import { isOrbitSettingKey, ORBIT_SETTINGS, orbitSettingsPatch, orbitSettingValue, type OrbitChangeCardData, type OrbitSettingKey } from "../shared/orbit-change.ts";
import { newId } from "./contracts.ts";
import { redactSecretsInText } from "./redact.ts";

const MAX_REASON = 500;

export class OrbitChangeError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "OrbitChangeError";
    this.status = status;
  }
}

interface CardLike {
  title: string;
  subtitle: string;
  options: string[];
  answered?: string;
  held?: string;
  requestId?: string;
  tool?: string;
  orbitChange?: OrbitChangeCardData;
}

export interface OrbitChangeStore {
  messagesFor(threadId: string): Array<{ id: string; card?: CardLike }>;
  appendMessage(threadId: string, message: { role: "bot"; kind: "options"; card: CardLike }): { id: string };
  patchMessage(threadId: string, messageId: string, patch: { card: CardLike }): { id: string } | null;
}

export interface OrbitChangeOptions {
  store: OrbitChangeStore;
  /** The live config, to show before-values and to verify an applied card. */
  config: () => unknown;
  /** Throws when the patch is not a valid settings change (the Settings API's own schema). */
  validatePatch: (patch: Record<string, unknown>) => void;
  /** The model selection as it will be saved (normalized), or why it can't be. */
  checkModel: (selection: unknown) => { selection: unknown } | { error: string };
  /** The MCP servers now configured, by name. */
  mcpServerNames: () => string[];
  now?: () => number;
}

export type ResolveOrbitChangeResult =
  | { claimed: false }
  | { claimed: true; state: "applied" | "denied" | "already_settled"; card: CardLike }
  | { claimed: true; state: "invalid"; error: string; status: number };

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

function reasonText(value: unknown): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new OrbitChangeError("reason is required: say why this change helps");
  if (text.length > MAX_REASON) throw new OrbitChangeError("reason must be 500 characters or fewer");
  return redactSecretsInText(text);
}

const shown = (value: unknown) => value === undefined || value === "" ? "not set" : typeof value === "string" ? value : JSON.stringify(value);
// the old value only needs recognizing; the new one is what they approve, in full
const shownBefore = (value: unknown) => {
  const text = shown(value);
  return text.length > 160 ? `${text.slice(0, 160).trimEnd()}…` : text;
};

export class OrbitChangeRequests {
  private readonly options: OrbitChangeOptions;
  constructor(options: OrbitChangeOptions) { this.options = options; }
  private now() { return (this.options.now ?? Date.now)(); }

  proposeSettings(args: { botId: string; threadId: string; changes: unknown; reason: unknown }) {
    const reason = reasonText(args.reason);
    if (!Array.isArray(args.changes) || !args.changes.length) throw new OrbitChangeError("changes must list at least one setting");
    if (args.changes.length > 6) throw new OrbitChangeError("propose at most six settings at once");
    const config = this.options.config();
    const changes = args.changes.map((raw) => {
      const item = raw as { setting?: unknown; value?: unknown };
      if (!isOrbitSettingKey(item.setting)) {
        throw new OrbitChangeError(`"${String(item.setting)}" is not a setting Orbit can change. It can change: ${Object.keys(ORBIT_SETTINGS).join(", ")}.`);
      }
      const key: OrbitSettingKey = item.setting;
      const spec = ORBIT_SETTINGS[key];
      if (spec.type === "boolean" && typeof item.value !== "boolean") throw new OrbitChangeError(`${key} takes true or false`);
      if (spec.type === "number" && (typeof item.value !== "number" || !Number.isFinite(item.value))) throw new OrbitChangeError(`${key} takes a number`);
      if (spec.type === "string" && (typeof item.value !== "string" || !item.value.trim())) throw new OrbitChangeError(`${key} takes text`);
      let after: unknown = item.value;
      if (spec.type === "model") {
        // store the selection as saving will write it, so the card can
        // later tell that it really was applied
        const checked = this.options.checkModel(item.value);
        if ("error" in checked) throw new OrbitChangeError(`${key}: ${checked.error}`);
        after = checked.selection;
      }
      const before = orbitSettingValue(config, key);
      return { key, label: spec.label, before, after };
    });
    const changing = changes.filter((change) => !same(change.before, change.after));
    if (!changing.length) throw new OrbitChangeError("Nothing would change: every setting already has that value");
    const patch = orbitSettingsPatch(changing);
    try { this.options.validatePatch(patch); } catch (error) {
      throw new OrbitChangeError(error instanceof Error ? error.message : "That isn't a valid settings change");
    }
    const lines = [
      ...changing.map((change) => `${change.label}: ${shownBefore(change.before)} → ${shown(change.after)}`),
      `Why: ${reason}`,
      "Undo: propose the old value again, or change it in Settings.",
    ];
    const title = changing.length === 1 ? `Change "${changing[0]!.label}"?` : `Change ${changing.length} settings?`;
    return this.write(args, title, lines.join("\n"), ["Apply", "Cancel"], "update_settings", {
      kind: "settings", reason, changes: changing, patch,
    });
  }

  proposeMcp(args: {
    botId: string; threadId: string; reason: unknown;
    entry: { id: string; title: string; slug: string; publisher?: string; source: "github" | "community"; description: string; ways: string[] };
  }) {
    const reason = reasonText(args.reason);
    if (this.options.mcpServerNames().includes(args.entry.slug)) throw new OrbitChangeError(`${args.entry.title} is already installed as "${args.entry.slug}"`);
    const lines = [
      `${args.entry.title} — ${redactSecretsInText(args.entry.description).slice(0, 240)}`,
      `Publisher: ${args.entry.publisher ?? "not verified"} · ${args.entry.source === "github" ? "GitHub's curated registry" : "official registry (community, not reviewed)"}`,
      ...args.entry.ways.map((way) => `Runs: ${way}`),
      `Why: ${reason}`,
      "Review it in Explore: you choose how it runs and fill in any key yourself; it's added only when you press Add.",
    ];
    return this.write(args, `Add ${args.entry.title}?`, lines.join("\n"), ["Review in Explore", "Not now"], "add_mcp_server", {
      kind: "mcp", reason,
      mcp: { registryId: args.entry.id, title: args.entry.title, slug: args.entry.slug, publisher: args.entry.publisher, source: args.entry.source },
    });
  }

  private write(
    args: { botId: string; threadId: string }, title: string, subtitle: string, options: string[], tool: string,
    data: Omit<OrbitChangeCardData, "version" | "requestId" | "botId" | "threadId" | "createdAt">,
  ) {
    const requestId = newId();
    const orbitChange: OrbitChangeCardData = { version: 1, requestId, botId: args.botId, threadId: args.threadId, createdAt: this.now(), ...data };
    const message = this.options.store.appendMessage(args.threadId, {
      role: "bot", kind: "options", card: { title, subtitle, options, requestId, tool, orbitChange },
    });
    return { requestId, messageId: message.id, title, detail: subtitle, state: "pending" as const };
  }

  /** Settle a card. "allow" settles only when the change is really in place. */
  resolve(args: { botId: string; threadId: string; requestId: string; behavior: string | undefined }): ResolveOrbitChangeResult {
    const message = this.options.store.messagesFor(args.threadId)
      .find((candidate) => candidate.card?.requestId === args.requestId && candidate.card.orbitChange);
    const card = message?.card;
    const data = card?.orbitChange;
    if (!message || !card || !data) return { claimed: false };
    if (data.botId !== args.botId || data.threadId !== args.threadId) {
      return { claimed: true, state: "invalid", error: "This change belongs to another conversation", status: 403 };
    }
    if (card.answered) return { claimed: true, state: "already_settled", card };
    if (args.behavior !== "allow" && args.behavior !== "deny") {
      return { claimed: true, state: "invalid", error: "Apply or cancel this change", status: 400 };
    }
    if (args.behavior === "deny") {
      const settled = { ...card, answered: "deny", held: undefined };
      this.options.store.patchMessage(args.threadId, message.id, { card: settled });
      return { claimed: true, state: "denied", card: settled };
    }
    const inPlace = data.kind === "settings"
      ? (data.changes ?? []).every((change) => same(orbitSettingValue(this.options.config(), change.key), change.after))
      : Boolean(data.mcp && this.options.mcpServerNames().some((name) => mcpNameFor(data.mcp!.slug, name)));
    if (!inPlace) {
      return {
        claimed: true, state: "invalid", status: 409,
        error: data.kind === "settings" ? "The settings haven't changed yet; apply them from the card first." : "The server hasn't been added yet; add it in Explore first.",
      };
    }
    const settled = { ...card, answered: "allow", held: undefined, orbitChange: { ...data, appliedAt: this.now() } };
    this.options.store.patchMessage(args.threadId, message.id, { card: settled });
    return { claimed: true, state: "applied", card: settled };
  }
}

/** Whether a server name is the one Explore gives this registry slug: the
 * slug itself, or the slug with a number when that name was taken
 * (freeServerName in McpExplore.tsx). "github-enterprise" is not "github". */
export function mcpNameFor(slug: string, name: string): boolean {
  return name === slug || new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-\\d+$`).test(name);
}
