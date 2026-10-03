import { describe, expect, it } from "vitest";

import { peerLine } from "./peer-message";

const NOTE = (opening: string, name: string, rest: string) =>
  `[${opening} @${name}, another bot in this Orbit workspace${rest}]`;

describe("peerLine", () => {
  it("is null for the person's own line and for bot lines", () => {
    expect(peerLine({ role: "user", text: "hi" })).toBeNull();
    expect(peerLine({ role: "bot", text: NOTE("Message from", "Chief", " — x") })).toBeNull();
  });

  it("reads the author off the field and strips the note", () => {
    const text = `${NOTE("Message from", "Chief", " — not from your user. @Chief is waiting on your answer, so reply to them.")}\n\nWhich database?`;
    expect(peerLine({ role: "user", text, peerAsk: { botId: "b1", name: "Chief" } })).toEqual({
      botId: "b1",
      name: "Chief",
      delivery: "ask_bot",
      body: "Which database?",
    });
  });

  it("falls back to the note on rows stored before the field existed", () => {
    const text = `${NOTE("Delegated by", "Chief", ". Do the work and reply directly.")}\n\nWrite the summary.\n\n[Reason: followup]`;
    expect(peerLine({ role: "user", text })).toEqual({
      name: "Chief",
      delivery: "delegate_bot",
      body: "Write the summary.\n\n[Reason: followup]",
    });
    expect(peerLine({ role: "user", text: `${NOTE("Thread opened by", "Pam", " — x")}\n\nJob.` })?.delivery).toBe(
      "start_thread",
    );
  });

  it("keeps the field's author when the text has no note, and carries unattended", () => {
    expect(peerLine({ role: "user", text: "plain", peerAsk: { botId: "b1", name: "Scout", unattended: true } })).toEqual({
      botId: "b1",
      name: "Scout",
      delivery: "ask_bot",
      body: "plain",
      unattended: true,
    });
  });

  it("reads a bot-role line signed by another bot as that bot's, in its colour", () => {
    const brief = { role: "bot" as const, kind: "text" as const, text: "@Builder fix the label",
      from: { botId: "p1", name: "Pilot", color: "purple" as const } };
    expect(peerLine(brief, "b1")).toEqual({
      botId: "p1",
      name: "Pilot",
      color: "purple",
      delivery: "coordinate_bots",
      body: "@Builder fix the label",
    });
  });

  it("leaves the conversation's own bot, chips, and callers without an owner alone", () => {
    const own = { role: "bot" as const, kind: "text" as const, text: "Done.", from: { botId: "b1", name: "Builder", color: "blue" as const } };
    expect(peerLine(own, "b1")).toBeNull();
    expect(peerLine({ ...own, kind: "activity" as const, from: { botId: "p1", name: "Pilot", color: "purple" as const } }, "b1")).toBeNull();
    expect(peerLine({ ...own, from: { botId: "p1", name: "Pilot", color: "purple" as const } })).toBeNull();
    expect(peerLine({ role: "bot", kind: "text", text: "unsigned" }, "b1")).toBeNull();
  });
});
