// A paired phone's approval-level change: PATCH /api/bots/:id/approval.
//
// The desktop changes a bot's approval level two ways. Ask, Edits and Auto
// travel over HTTP (PATCH /api/bots/:id); Full access and Custom travel only
// over Electron's private port (handleDesktopTrustedApprovalMessage), because
// the loopback HTTP surface is not an authority boundary against a bot that
// can run a shell. The phone reaches the harness over HTTP, so this route has
// to earn Full access differently: it is granted only to a request the
// companion sidecar vouched for with the per-launch secret Electron handed it
// on the same private channel (`verifiedPhone`), and only with an explicit
// `confirmFullAccess: true` the phone sends after its confirmation (and Face
// ID / passcode) step. A bot curling the loopback port has neither.
//
// Everything else is the desktop's rule set, unchanged: the same levels per
// provider, no change while the bot or thread is working (except the
// emergency drop to Ask), none while an elevated change is still in flight,
// the "Auto on this computer" acknowledgement. Custom follows Full's rule:
// it hands the bot the policy in ~/.codex/config.toml on the computer (Codex
// only; Orbit has no editor for it, on the desktop either), so moving into or
// out of it needs the paired-phone channel and `confirmCustom: true`.
import {
  approvalModeFor,
  isApprovalMode,
  isEmergencyApprovalDowngrade,
  supportsApprovalMode,
  type ApprovalMode,
} from "../shared/approval-mode.ts";

export interface PhoneApprovalTarget {
  approvalMode?: unknown;
  autoApprove?: unknown;
  approvalGrant?: unknown;
  threadId?: string;
  computer?: string;
  busy?: boolean;
}

export interface PhoneApprovalContext {
  /** the bot's own record (its default for new threads) */
  bot: PhoneApprovalTarget;
  /** the thread the phone has open, when it named one */
  thread?: PhoneApprovalTarget;
  botBusy: boolean;
  threadBusy: boolean;
  /** driver kinds of the bot's and the thread's engines */
  botDriver?: string;
  threadDriver?: string;
  /** the request came through the paired-phone sidecar with its secret */
  verifiedPhone: boolean;
}

export type PhoneApprovalDecision =
  | { ok: true; mode: ApprovalMode; threadId?: string; emergency: boolean }
  | { ok: false; status: 400 | 403 | 409; error: string };

const FIELDS = new Set(["mode", "threadId", "confirmFullAccess", "confirmCustom", "acknowledgeLocalAuto"]);

export function checkPhoneApprovalChange(body: unknown, ctx: PhoneApprovalContext): PhoneApprovalDecision {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, status: 400, error: "body must be a JSON object" };
  }
  const input = body as Record<string, unknown>;
  const unsupported = Object.keys(input).find((key) => !FIELDS.has(key));
  if (unsupported) return { ok: false, status: 400, error: `unsupported approval field: ${unsupported}` };
  if (!isApprovalMode(input.mode)) {
    return { ok: false, status: 400, error: "mode must be ask, edits, auto, full, or custom" };
  }
  for (const flag of ["confirmFullAccess", "confirmCustom", "acknowledgeLocalAuto"] as const) {
    if (input[flag] !== undefined && typeof input[flag] !== "boolean") {
      return { ok: false, status: 400, error: `${flag} must be true or false` };
    }
  }
  if (input.threadId !== undefined && (typeof input.threadId !== "string" || !/^[\w-]{1,128}$/.test(input.threadId))) {
    return { ok: false, status: 400, error: "threadId must be a task id" };
  }
  const mode = input.mode;
  const threadId = typeof input.threadId === "string" ? input.threadId : undefined;
  const botMode = approvalModeFor(ctx.bot);
  const threadMode = ctx.thread ? approvalModeFor(ctx.thread) : botMode;

  const leavingCustom = (botMode === "custom" || threadMode === "custom") && mode !== "custom" && mode !== "ask";
  if (mode === "custom" || leavingCustom) {
    if (!ctx.verifiedPhone) {
      return { ok: false, status: 403, error: "Custom approval from a phone needs the Orbit desktop app running on the computer (this server was started without it)" };
    }
    if (mode === "custom" && input.confirmCustom !== true) {
      return { ok: false, status: 400, error: "Custom approval requires confirming it first (confirmCustom)" };
    }
  }
  if (mode === "full") {
    if (!ctx.verifiedPhone) {
      return { ok: false, status: 403, error: "Full access from a phone needs the Orbit desktop app running on the computer (this server was started without it)" };
    }
    if (input.confirmFullAccess !== true) {
      return { ok: false, status: 400, error: "Full access requires confirming it first (confirmFullAccess)" };
    }
  }
  if (ctx.bot.approvalGrant) {
    return { ok: false, status: 409, error: "wait for the approval-level change to finish before changing this setting" };
  }
  const changesBot = mode !== botMode;
  const changesThread = Boolean(ctx.thread) && mode !== threadMode;
  const emergency = isEmergencyApprovalDowngrade(botMode, mode) || isEmergencyApprovalDowngrade(threadMode, mode);
  if (((changesBot && ctx.botBusy) || (changesThread && ctx.threadBusy)) && !emergency) {
    return { ok: false, status: 409, error: "stop this bot's turn before changing its approval level" };
  }
  if (!supportsApprovalMode(ctx.botDriver, mode) || (ctx.thread && !supportsApprovalMode(ctx.threadDriver, mode))) {
    return {
      ok: false,
      status: 400,
      error: mode === "full" ? "This provider does not support Full access"
        : mode === "custom" ? "Custom approval settings are available only for Codex bots"
        : "This provider does not support that approval level",
    };
  }
  // "Auto on this Mac" hands a bot the person's real session: the phone must
  // show the same warning the desktop does and say it was seen.
  const localAutoNeeded = (target: PhoneApprovalTarget) =>
    target.computer === "local" && approvalModeFor(target) !== "auto";
  if (mode === "auto" && (localAutoNeeded(ctx.bot) || (ctx.thread && localAutoNeeded(ctx.thread))) &&
    input.acknowledgeLocalAuto !== true) {
    return { ok: false, status: 400, error: "Auto mode on this computer requires confirming the warning first (acknowledgeLocalAuto)" };
  }
  return { ok: true, mode, threadId, emergency };
}
