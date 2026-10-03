/** The approval levels exposed by the app. Each one is a provider's own
 * permission mode, passed through: Orbit never decides a permission
 * itself (Full access aside, which answers residual prompts because that is
 * what the person granted). The order is the order the selector shows. */
export const APPROVAL_MODES = ["ask", "edits", "auto", "full", "custom"] as const;

export type ApprovalMode = (typeof APPROVAL_MODES)[number];

/** Only providers with an implemented permission mapping may expose a level.
 * `edits` (auto-accept edits) exists where the engine has such a mode:
 * Claude and Grok `acceptEdits`, Antigravity `auto_edit`, Qwen `auto-edit`,
 * Gemini `auto_edit`. Codex's Ask already runs `workspace-write`, so an edits
 * level would change nothing there. */
export function supportsApprovalMode(driverKind: string | undefined, mode: ApprovalMode): boolean {
  if (mode === "custom") return driverKind === "codex";
  if (mode === "edits") return ["claudeAgent", "grokAgent", "antigravityAgent", "qwenAgent", "geminiAgent"].includes(driverKind ?? "");
  if (mode !== "full") return true;
  // The chat-completions family has no provider-side reviewer, so Full is
  // implemented in the harness: createOpenAIChatRuntime answers its own tool
  // gate instead of opening a card. Without this a bot on one of these
  // engines could never stop asking — not by its own level, and not through
  // a Chief's delegated Full access either.
  return ["codex", "claudeAgent", "antigravityAgent", "cursorAgent", "grokAgent", "opencodeGo", "qwenAgent", "geminiAgent",
    "openai-compat", "grok", "minimax", "mistral"].includes(driverKind ?? "");
}

/** A Full/Custom grant belongs to one provider's tool semantics. Other
 * modes carry across only when the destination actually implements them.
 * Adapted from tahodev's provider-switch guard in PR #1120. */
export function modelSwitchNeedsAsk(
  mode: ApprovalMode,
  fromDriver: string | undefined,
  toDriver: string | undefined,
): boolean {
  return !supportsApprovalMode(toDriver, mode) ||
    ((mode === "full" || mode === "custom") && fromDriver !== toDriver);
}

export function hasNativeAutoReview(driverKind: string | undefined): boolean {
  // Qwen Code's `--approval-mode auto` is an LLM classifier that approves
  // safe actions and blocks risky ones — a reviewer, not a rubber stamp.
  return ["codex", "claudeAgent", "cursorAgent", "grokAgent", "qwenAgent"].includes(driverKind ?? "");
}

export function isApprovalMode(value: unknown): value is ApprovalMode {
  return typeof value === "string" && (APPROVAL_MODES as readonly string[]).includes(value);
}

/** Resolve the durable mode without turning the legacy Auto bit into Full
 * access. Records written before approvalMode existed keep their exact old
 * behavior: autoApprove=true is safe Auto; everything else asks. Unknown
 * persisted values also fail closed to that legacy behavior. */
export function approvalModeFor(bot: {
  approvalMode?: unknown;
  autoApprove?: unknown;
  /** Server-only two-phase grant marker. Until Electron confirms it, the
   * stored elevated selection is deliberately executable only as Ask. */
  approvalGrant?: unknown;
  threadId?: string;
}): ApprovalMode {
  const grant = bot.approvalGrant;
  const otherThread = grant && typeof grant === "object" && "threadOnly" in grant && grant.threadOnly === true &&
    "threadId" in grant && typeof grant.threadId === "string" && typeof bot.threadId === "string" && grant.threadId !== bot.threadId;
  if (grant && !otherThread) return "ask";
  if (isApprovalMode(bot.approvalMode)) return bot.approvalMode;
  return bot.autoApprove === true ? "auto" : "ask";
}

/** A private late-grant recovery may revoke an elevated mode even after a
 * turn began. It can only move to the fail-closed Ask mode; ordinary changes
 * remain blocked while the bot is working. */
export function isEmergencyApprovalDowngrade(
  current: ApprovalMode,
  next: ApprovalMode,
): boolean {
  return next === "ask" && (current === "full" || current === "custom");
}

/** The levels one bot may give another bot it creates.
 *
 * Full and Custom are absent on purpose. Both are the person's own grant,
 * delivered through Electron's private channel because the loopback HTTP
 * surface is not an authority boundary against a bot that can run a shell
 * (see handleDesktopTrustedApprovalMessage). A creator handing either one to
 * a bot it makes would route around the confirmation the person gives.
 */
export const GRANTABLE_APPROVAL_MODES = ["ask", "edits", "auto"] as const;
export type GrantableApprovalMode = (typeof GRANTABLE_APPROVAL_MODES)[number];

export function isGrantableApprovalMode(value: unknown): value is GrantableApprovalMode {
  return typeof value === "string" && (GRANTABLE_APPROVAL_MODES as readonly string[]).includes(value);
}

/** How much a level does without asking the person, as an order, so a grant
 * can be capped at what the granter itself holds.
 *
 * `custom` ranks at the bottom with `ask`, below the level it usually sits
 * next to. It is a Codex policy the person wrote, and it can be anything
 * from stricter than Ask to looser than Auto. Reading a permissive grant out
 * of a policy we cannot inspect is the one mistake here that costs
 * something, so a Chief on Custom hands out Ask and the person sets the rest
 * by hand. */
const APPROVAL_RANK: Record<ApprovalMode, number> = { ask: 0, custom: 0, edits: 1, auto: 2, full: 3 };

/** May a bot at `granterMode` create a bot at `mode`?
 *
 * The rule is no privilege escalation: nothing a bot creates may act with
 * less asking than the bot that created it. Without it, a specialist on Ask
 * builds itself an Auto proxy and acts through it, and the person's level
 * stops meaning anything. This is the same direction of travel as
 * delegatedFullAccess, which already lets a Chief's own access flow down to
 * work it hands out — never upward, and never wider than the source. */
export function canGrantApprovalMode(granterMode: ApprovalMode, mode: GrantableApprovalMode): boolean {
  return APPROVAL_RANK[mode] <= APPROVAL_RANK[granterMode];
}
