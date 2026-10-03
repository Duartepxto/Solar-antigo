// Attaching to the person's logged-in browser: what counts as such a call,
// that no approval mode answers it, the host computer gate's check, and the
// harness-owned card's lifecycle. Nothing here starts a driver.
import { describe, expect, it, vi } from "vitest";

import { APPROVAL_MODES } from "../shared/approval-mode.ts";
import { autoVerdict, approvalHeldNote } from "./auto-approve.ts";
import {
  BROWSER_PROFILE_REQUEST_PREFIX,
  BrowserProfileConsent,
  browserProfileCard,
  type BrowserProfileBus,
} from "./browser-profile-consent.ts";
import {
  browserNameFromCommand,
  existingProfileCall,
  existingProfileTarget,
  isBrowserPrepareTool,
} from "./browser-profile-target.ts";
import { createControlClient } from "./control-client.ts";
import { browserProfileConsentCheck } from "./local-computer-consent.ts";
import { createMcpBridgeInterceptor } from "./mcp-bridge.ts";

const EXISTING = { pid: 812, window_id: 44, strategy: { kind: "existing_profile" } };

describe("recognizing a logged-in-browser attachment", () => {
  it.each([
    "browser_prepare",
    "mcp__computer__browser_prepare",
    "computer.browser_prepare",
    "computer:browser_prepare",
    "computer: browser_prepare",
    "computer/browser_prepare",
    "computer_browser_prepare",
  ])("knows %s as browser_prepare", (tool) => {
    expect(isBrowserPrepareTool(tool)).toBe(true);
    expect(existingProfileCall(tool, EXISTING)).toEqual({ pid: 812, windowId: 44 });
  });

  it("ignores other tools and other strategies", () => {
    expect(isBrowserPrepareTool("browser_prepare_extra")).toBe(false);
    expect(existingProfileCall("click", EXISTING)).toBeNull();
    expect(existingProfileCall("browser_prepare", { pid: 1, allow_launch: true, profile: { mode: "isolated_new" } })).toBeNull();
    expect(existingProfileCall("browser_prepare", { pid: 1 })).toBeNull();
    expect(existingProfileCall("browser_prepare", null)).toBeNull();
  });

  it("errs toward asking: JSON-string input, other spellings, missing anchors", () => {
    expect(existingProfileTarget(JSON.stringify(EXISTING))).toEqual({ pid: 812, windowId: 44 });
    expect(existingProfileTarget({ strategy: { kind: "Existing_Profile" } })).toEqual({});
    expect(existingProfileTarget({ strategy: JSON.stringify({ kind: "existing-profile" }), pid: "9" })).toEqual({ pid: 9 });
  });

  it("names common browsers from their executable", () => {
    expect(browserNameFromCommand("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser")).toBe("Brave");
    expect(browserNameFromCommand("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")).toBe("Chrome");
    expect(browserNameFromCommand("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge")).toBe("Edge");
    expect(browserNameFromCommand("/Applications/Chromium.app/Contents/MacOS/Chromium")).toBe("Chromium");
    expect(browserNameFromCommand("/usr/bin/vim")).toBeNull();
  });
});

describe("no approval mode answers it", () => {
  it.each(APPROVAL_MODES)("%s leaves it for the person, even with a saved command", (mode) => {
    const verdict = autoVerdict(mode, "mcp__computer__browser_prepare", { browserProfile: true, commandAllowed: true });
    expect(verdict).toEqual({ approve: null, source: "browser-profile" });
    expect(approvalHeldNote({ source: verdict.source, permission: true })).toBe("approval.held.browserProfile");
  });

  it("leaves other computer calls exactly as they were", () => {
    expect(autoVerdict("full", "mcp__computer__browser_prepare").approve).toBe("approved mcp__computer__browser_prepare (full access)");
    expect(autoVerdict("full", "mcp__computer__click", { browserProfile: false }).source).toBe("full-access");
    expect(autoVerdict("auto", "mcp__computer__click").source).toBe("native-approval");
    expect(autoVerdict("ask", "mcp__computer__click").source).toBe("no-grant");
  });
});

function fakeBus() {
  const cards: { threadId: string; botId: string; id: string; card: any; settled?: { behavior: string; source: string } }[] = [];
  const announced: string[] = [];
  const bus: BrowserProfileBus = {
    appendCard(threadId, botId, card) {
      const id = `m${cards.length + 1}`;
      cards.push({ threadId, botId, id, card });
      return { id };
    },
    settleCard(threadId, messageId, behavior, source) {
      const entry = cards.find((candidate) => candidate.id === messageId && candidate.threadId === threadId);
      if (entry) entry.settled = { behavior, source };
    },
    announce(_threadId, botId) {
      announced.push(botId);
    },
  };
  return { bus, cards, announced };
}

const CARD = { browser: "Brave", botName: "Scout", pid: 812, windowId: 44 };
const TARGET = { pid: 812, windowId: 44 };

describe("the harness-owned card", () => {
  it("says plainly what allowing means and offers nothing to remember", () => {
    const card = browserProfileCard(CARD);
    expect(card.title).toBe("Use your logged-in Brave?");
    expect(card.subtitle).toBe(
      "Scout wants to control the Brave window you have open, signed in as you: it can act on any site you're logged into. Allow for this conversation?",
    );
    expect(card).not.toHaveProperty("allowSession");
    expect(card).not.toHaveProperty("allowKey");
  });

  it("waits for the person, grants this conversation only, and reuses one open card", async () => {
    const { bus, cards, announced } = fakeBus();
    const consent = new BrowserProfileConsent(bus);
    const first = consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD, waitMs: 5_000 });
    const second = consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD, waitMs: 5_000 });
    expect(cards).toHaveLength(1);
    expect(announced).toEqual(["b1"]);
    const { requestId } = cards[0]!.card;
    expect(requestId.startsWith(BROWSER_PROFILE_REQUEST_PREFIX)).toBe(true);
    expect(cards[0]!.card).toMatchObject({ tool: "browser_prepare", approvalScope: "local-computer", heldCode: "approval.held.browserProfile" });
    // Another conversation cannot answer it.
    expect(consent.resolve("t2", requestId, "allow")).toBe(false);
    expect(consent.resolve("t1", requestId, "allow")).toBe(true);
    await expect(first).resolves.toBe("allow");
    await expect(second).resolves.toBe("allow");
    expect(cards[0]!.settled).toEqual({ behavior: "allow", source: "user" });
    expect(consent.hasGrant("b1", "t1", TARGET)).toBe(true);
    // Never broader than one conversation, bot, browser launch or window.
    expect(consent.hasGrant("b1", "t2", TARGET)).toBe(false);
    expect(consent.hasGrant("b2", "t1", TARGET)).toBe(false);
    expect(consent.hasGrant("b1", "t1", { pid: 900, windowId: 44 })).toBe(false);
    expect(consent.hasGrant("b1", "t1", { pid: 812, windowId: 45 })).toBe(false);
    // Granted: the next call passes without a card.
    await expect(consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD })).resolves.toBe("allow");
    expect(cards).toHaveLength(1);
    consent.forgetThread("t1");
    expect(consent.hasGrant("b1", "t1", TARGET)).toBe(false);
  });

  it("treats anything but an explicit allow as no", async () => {
    const { bus, cards } = fakeBus();
    const consent = new BrowserProfileConsent(bus);
    const asked = consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD, waitMs: 5_000 });
    expect(consent.resolve("t1", cards[0]!.card.requestId, "answer")).toBe(true);
    await expect(asked).resolves.toBe("deny");
    expect(consent.hasGrant("b1", "t1", TARGET)).toBe(false);
  });

  it("tells the gate it is still waiting, and a later allow still counts", async () => {
    const { bus, cards } = fakeBus();
    const consent = new BrowserProfileConsent(bus);
    await expect(consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD, waitMs: 20 })).resolves.toBe("pending");
    expect(cards[0]!.settled).toBeUndefined();
    consent.resolve("t1", cards[0]!.card.requestId, "allow");
    expect(consent.hasGrant("b1", "t1", TARGET)).toBe(true);
  });

  it("closes open cards when the turn stops, the bot goes, or nobody answers", async () => {
    const { bus, cards } = fakeBus();
    const consent = new BrowserProfileConsent(bus, { cardTtlMs: 30 });
    const stopped = consent.request({ botId: "b1", threadId: "t1", target: TARGET, card: CARD, waitMs: 5_000 });
    consent.cancelThread("t1");
    await expect(stopped).resolves.toBe("closed");
    const removed = consent.request({ botId: "b2", threadId: "t2", target: TARGET, card: CARD, waitMs: 5_000 });
    consent.forgetBot("b2");
    await expect(removed).resolves.toBe("closed");
    const ignored = consent.request({ botId: "b3", threadId: "t3", target: TARGET, card: CARD, waitMs: 5_000 });
    await expect(ignored).resolves.toBe("closed");
    expect(cards.map((card) => card.settled)).toEqual([
      { behavior: "deny", source: "system" },
      { behavior: "deny", source: "system" },
      { behavior: "deny", source: "system" },
    ]);
    expect(consent.owns(cards[2]!.card.requestId)).toBe(false);
  });
});

describe("the host computer gate", () => {
  const call = (name: string, args: unknown, id = 1) => JSON.stringify({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } });

  it("holds an existing-profile call until the harness says the person allowed it", async () => {
    const forwarded: string[] = [];
    const answered: string[] = [];
    const requestBrowserProfile = vi.fn()
      .mockResolvedValueOnce({ allowed: false, message: "The person said no." })
      .mockResolvedValueOnce({ allowed: true });
    const intercept = createMcpBridgeInterceptor({
      answer: (line) => answered.push(line),
      forward: (line) => forwarded.push(line),
      gate: { isHeld: async () => false },
      consent: browserProfileConsentCheck({ requestBrowserProfile }),
    });
    await intercept(call("browser_prepare", EXISTING, 1));
    expect(forwarded).toEqual([]);
    expect(JSON.parse(answered[0]!)).toEqual({
      jsonrpc: "2.0", id: 1, result: { content: [{ type: "text", text: "The person said no." }], isError: true },
    });
    await intercept(call("browser_prepare", EXISTING, 2));
    expect(requestBrowserProfile).toHaveBeenLastCalledWith({ pid: 812, windowId: 44 });
    expect(JSON.parse(forwarded[0]!).id).toBe(2);
  });

  it("never asks about other calls, and a held computer still refuses first", async () => {
    const forwarded: string[] = [];
    const answered: string[] = [];
    const requestBrowserProfile = vi.fn();
    let held = false;
    const intercept = createMcpBridgeInterceptor({
      answer: (line) => answered.push(line),
      forward: (line) => forwarded.push(line),
      gate: { isHeld: async () => held },
      consent: browserProfileConsentCheck({ requestBrowserProfile }),
    });
    await intercept(call("click", { x: 1, y: 2 }, 1));
    await intercept(call("browser_prepare", { allow_launch: true, profile: { mode: "isolated_new" } }, 2));
    await intercept(JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/list" }));
    expect(forwarded).toHaveLength(3);
    held = true;
    await intercept(call("browser_prepare", EXISTING, 4));
    expect(requestBrowserProfile).not.toHaveBeenCalled();
    expect(answered).toHaveLength(1);
  });

  it("fails closed when the check itself breaks", async () => {
    const answered: string[] = [];
    const intercept = createMcpBridgeInterceptor({
      answer: (line) => answered.push(line),
      forward: () => { throw new Error("must not forward"); },
      consent: browserProfileConsentCheck({ requestBrowserProfile: async () => { throw new Error("boom"); } }),
    });
    await intercept(call("browser_prepare", EXISTING));
    expect(JSON.parse(answered[0]!).result.isError).toBe(true);
  });
});

describe("control client: asking the harness", () => {
  const url = "http://127.0.0.1:1/api/internal/computer-control?botId=b1";

  it("posts to the browser-profile endpoint with the turn's bearer", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ allowed: true }), { status: 200 }));
    const client = createControlClient({ url, token: "tok", fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(client.requestBrowserProfile({ pid: 3, windowId: 4 })).resolves.toEqual({ allowed: true });
    const [target, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(target).toBe("http://127.0.0.1:1/api/internal/computer-control/browser-profile?botId=b1");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer tok");
    expect(JSON.parse(String(init.body))).toEqual({ pid: 3, windowId: 4 });
  });

  it.each([
    ["an error status", () => new Response("{}", { status: 401 })],
    ["a malformed answer", () => new Response(JSON.stringify({ allowed: "yes" }), { status: 200 })],
    ["a network failure", () => { throw new Error("down"); }],
  ])("refuses on %s", async (_name, reply) => {
    const client = createControlClient({ url, token: "tok", fetchImpl: (async () => reply()) as unknown as typeof fetch });
    const answer = await client.requestBrowserProfile({});
    expect(answer.allowed).toBe(false);
    expect(answer.message).toMatch(/nothing was attached/);
  });

  it("refuses when unconfigured and passes the harness's own reason through", async () => {
    await expect(createControlClient({ url: "", token: "" }).requestBrowserProfile({})).resolves.toMatchObject({ allowed: false });
    const client = createControlClient({
      url, token: "tok",
      fetchImpl: (async () => new Response(JSON.stringify({ allowed: false, message: "Waiting for the person." }), { status: 200 })) as unknown as typeof fetch,
    });
    await expect(client.requestBrowserProfile({})).resolves.toEqual({ allowed: false, message: "Waiting for the person." });
  });
});
