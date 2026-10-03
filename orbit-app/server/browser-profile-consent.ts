// The person's consent before a bot works inside their logged-in browser.
//
// Orbit starts cua-driver with `--grant existing-profile`
// (electron/cua-embedded-daemon.mjs), which lets `browser_prepare` with
// `strategy.kind: "existing_profile"` attach the page tools to a Chromium
// window the person has open, signed in as them: from there a bot can act on
// every site they are logged into. The driver no longer asks, so Orbit does,
// and nothing but the person can say yes:
//
//   - No approval mode answers it: not Ask, Auto, Custom, nor Full access;
//     no "always allow", session allowance, saved command, peer bot or
//     local service. Routine and other unattended runs are refused outright.
//   - One yes covers the rest of that conversation for that browser process
//     and that window — never another conversation, bot, window or browser
//     launch. It lives in memory: a restart asks again. (The driver keeps
//     its own, shorter per-session grant underneath and may ask to be
//     re-approved; then this card comes back.)
//
// Two doors reach this module, and both end at the same card:
//   1. An engine that asks before a tool call (Claude's broker, Codex, ACP)
//      raises request.opened with `browserProfile`; the harness shows the
//      card for that provider request and records the grant when the person
//      allows it (server/index.ts).
//   2. The host computer's stdio gate (server/mcp-bridge.ts) checks every
//      such tools/call before it reaches the driver. With a grant it passes;
//      without one (Full access, an engine that never asked) it asks here,
//      and the harness shows a card this module owns and resolves.

import { execFile } from "node:child_process";
import { HELD_NOTE } from "./auto-approve.ts";
import { newId } from "./contracts.ts";
import { browserNameFromCommand, browserProfileGrantKey, type BrowserProfileTarget } from "./browser-profile-target.ts";
import type { BrowserProfileCardData } from "../shared/wire.ts";

export { browserProfileGrantKey, existingProfileCall, existingProfileTarget, type BrowserProfileTarget } from "./browser-profile-target.ts";

/** What the card shows and the client renders through t(). */
export type { BrowserProfileCardData };

export const BROWSER_PROFILE_REQUEST_PREFIX = "browser-profile-";
/** How long the gate holds one tool call open waiting for the person. Under
 * Codex's 60 s MCP tool timeout; an unanswered card stays open after it. */
export const BROWSER_PROFILE_WAIT_MS = 45_000;
/** An unanswered card closes on its own after this, like a provider's ask. */
export const BROWSER_PROFILE_CARD_TTL_MS = 15 * 60_000;

export function browserProfileCardTitle(browser: string): string {
  return `Use your logged-in ${browser}?`;
}

export function browserProfileCardBody(botName: string, browser: string): string {
  return `${botName} wants to control the ${browser} window you have open, signed in as you: ` +
    "it can act on any site you're logged into. Allow for this conversation?";
}

/** The card fields every browser-profile ask carries, whichever door it came
 * through. No allowSession, allowKey or command rule: nothing may remember it. */
export function browserProfileCard(data: BrowserProfileCardData): {
  title: string;
  subtitle: string;
  options: string[];
  browserProfile: BrowserProfileCardData;
} {
  return {
    title: browserProfileCardTitle(data.browser),
    subtitle: browserProfileCardBody(data.botName, data.browser),
    options: ["Allow", "Deny"],
    browserProfile: data,
  };
}

/** What the bot is told when the person was not there to answer. */
export const BROWSER_PROFILE_UNATTENDED =
  "Attaching to the person's logged-in browser needs their explicit approval, and nobody is here to give it " +
  "(this is a routine or other unattended run). Nothing was attached. Do this part without their logged-in " +
  "browser, or tell them it needs them present.";

export const BROWSER_PROFILE_DENIED =
  "The person said no to controlling their logged-in browser. Nothing was attached. Don't ask again in this " +
  "conversation unless they tell you to; continue another way or ask them what they'd like.";

export const BROWSER_PROFILE_PENDING =
  "Waiting for the person to answer the card asking to use their logged-in browser; nothing was attached yet. " +
  "Tell them you're waiting for that approval, then call browser_prepare again with the same arguments once they've allowed it.";

export const BROWSER_PROFILE_CLOSED =
  "The request to use the person's logged-in browser closed without an answer. Nothing was attached. Ask them " +
  "before trying again.";

export const BROWSER_PROFILE_UNREACHABLE =
  "Orbit could not ask the person to approve using their logged-in browser, so nothing was attached. Don't retry; " +
  "tell them.";

/** Name the browser behind a pid for the card ("Brave"), or null. Bounded
 * and asynchronous; a failure only makes the card say "browser". */
export function browserNameForPid(pid: number | undefined, platform: NodeJS.Platform = process.platform): Promise<string | null> {
  if (pid === undefined || (platform !== "darwin" && platform !== "linux")) return Promise.resolve(null);
  return new Promise((resolve) => {
    execFile("/bin/ps", ["-o", "comm=", "-p", String(pid)], { timeout: 1_000, maxBuffer: 8_192, encoding: "utf8" }, (error, stdout) => {
      resolve(error ? null : browserNameFromCommand(String(stdout).trim()));
    });
  });
}

export type BrowserProfileOutcome ="allow" | "deny" | "pending" | "closed";

export interface BrowserProfileBus {
  /** Put the card in the conversation; returns its message id. */
  appendCard(threadId: string, botId: string, card: ReturnType<typeof browserProfileCard> & {
    requestId: string;
    tool: string;
    approvalScope: "local-computer";
    held: string;
    heldCode: string;
  }): { id: string };
  /** Mark it answered (user) or closed (system), and hand the turn back. */
  settleCard(threadId: string, messageId: string, behavior: "allow" | "deny", source: "user" | "system"): void;
  /** The bot is now waiting on a person: activity + notification. */
  announce(threadId: string, botId: string, title: string, body: string): void;
}

interface PendingCard {
  requestId: string;
  botId: string;
  threadId: string;
  key: string;
  messageId: string;
  timer: ReturnType<typeof setTimeout>;
  settled: Promise<"allow" | "deny" | "closed">;
  resolve: (outcome: "allow" | "deny" | "closed") => void;
}

function conversationKey(botId: string, threadId: string): string {
  return `${botId}\0${threadId}`;
}

export class BrowserProfileConsent {
  /** bot+conversation → grant keys (browser pid : window id). */
  private readonly grants = new Map<string, Set<string>>();
  private readonly pending = new Map<string, PendingCard>();

  private readonly bus: BrowserProfileBus;
  private readonly cardTtlMs: number;

  constructor(bus: BrowserProfileBus, options: { cardTtlMs?: number } = {}) {
    this.bus = bus;
    this.cardTtlMs = options.cardTtlMs ?? BROWSER_PROFILE_CARD_TTL_MS;
  }

  hasGrant(botId: string, threadId: string, target: BrowserProfileTarget): boolean {
    return this.grants.get(conversationKey(botId, threadId))?.has(browserProfileGrantKey(target)) ?? false;
  }

  /** Only a person's Allow on this card calls this (or the provider-request
   * path of the same card). */
  grant(botId: string, threadId: string, target: BrowserProfileTarget): void {
    const key = conversationKey(botId, threadId);
    const set = this.grants.get(key) ?? new Set<string>();
    set.add(browserProfileGrantKey(target));
    this.grants.set(key, set);
  }

  revoke(botId: string, threadId: string, target: BrowserProfileTarget): void {
    const key = conversationKey(botId, threadId);
    const set = this.grants.get(key);
    set?.delete(browserProfileGrantKey(target));
    if (set && !set.size) this.grants.delete(key);
  }

  /** The conversation ended or was reset: its grants and open cards go. */
  forgetThread(threadId: string): void {
    for (const key of this.grants.keys()) if (key.endsWith(`\0${threadId}`)) this.grants.delete(key);
    this.cancelThread(threadId);
  }

  forgetBot(botId: string): void {
    for (const key of this.grants.keys()) if (key.startsWith(`${botId}\0`)) this.grants.delete(key);
    for (const card of this.pending.values()) if (card.botId === botId) this.close(card);
  }

  /** The gate's door: show (or reuse) a card owned here and wait up to
   * `waitMs` for the person. An unanswered card stays open; a later Allow
   * still records the grant, so the bot's next call passes. */
  async request(args: {
    botId: string;
    threadId: string;
    target: BrowserProfileTarget;
    card: BrowserProfileCardData;
    waitMs?: number;
  }): Promise<BrowserProfileOutcome> {
    if (this.hasGrant(args.botId, args.threadId, args.target)) return "allow";
    const key = browserProfileGrantKey(args.target);
    let card = [...this.pending.values()].find((candidate) =>
      candidate.botId === args.botId && candidate.threadId === args.threadId && candidate.key === key);
    if (!card) card = this.open(args, key);
    const waitMs = args.waitMs ?? BROWSER_PROFILE_WAIT_MS;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const outcome = await Promise.race([
      card.settled,
      new Promise<"pending">((resolve) => {
        timer = setTimeout(() => resolve("pending"), waitMs);
        timer.unref?.();
      }),
    ]);
    clearTimeout(timer);
    return outcome;
  }

  private open(args: { botId: string; threadId: string; target: BrowserProfileTarget; card: BrowserProfileCardData }, key: string): PendingCard {
    const requestId = `${BROWSER_PROFILE_REQUEST_PREFIX}${newId()}`;
    const fields = browserProfileCard(args.card);
    // The card has to exist before the entry, so a timeout or an answer can
    // always find it to settle.
    const message = this.bus.appendCard(args.threadId, args.botId, {
      ...fields,
      requestId,
      tool: "browser_prepare",
      approvalScope: "local-computer",
      held: HELD_NOTE["approval.held.browserProfile"],
      heldCode: "approval.held.browserProfile",
    });
    let resolve!: PendingCard["resolve"];
    const settled = new Promise<"allow" | "deny" | "closed">((done) => { resolve = done; });
    const timer = setTimeout(() => {
      const card = this.pending.get(requestId);
      if (card) this.close(card);
    }, this.cardTtlMs);
    timer.unref?.(); // a waiting card must never hold the process open
    const card: PendingCard = { requestId, botId: args.botId, threadId: args.threadId, key, messageId: message.id, timer, settled, resolve };
    this.pending.set(requestId, card);
    this.bus.announce(args.threadId, args.botId, fields.title, fields.subtitle);
    return card;
  }

  private close(card: PendingCard): void {
    if (!this.pending.delete(card.requestId)) return;
    clearTimeout(card.timer);
    this.bus.settleCard(card.threadId, card.messageId, "deny", "system");
    card.resolve("closed");
  }

  /** The respond endpoints call this before any provider adapter. True when
   * the request was one of this module's cards (now settled). Only an explicit
   * "allow" grants; anything else is a no. */
  resolve(threadId: string, requestId: string, behavior: string | undefined): boolean {
    const card = this.pending.get(requestId);
    if (!card || card.threadId !== threadId) return false;
    this.pending.delete(requestId);
    clearTimeout(card.timer);
    const allow = behavior === "allow";
    if (allow) {
      const [pid, windowId] = card.key.split(":");
      this.grant(card.botId, card.threadId, {
        ...(pid !== "?" ? { pid: Number(pid) } : {}),
        ...(windowId !== "?" ? { windowId: Number(windowId) } : {}),
      });
    }
    this.bus.settleCard(card.threadId, card.messageId, allow ? "allow" : "deny", "user");
    card.resolve(allow ? "allow" : "deny");
    return true;
  }

  /** A turn was interrupted: its open cards can never be acted on. */
  cancelThread(threadId: string): void {
    for (const card of this.pending.values()) if (card.threadId === threadId) this.close(card);
  }

  owns(requestId: string): boolean {
    return this.pending.has(requestId);
  }
}
