import { describe, expect, it } from "vitest";

import { artifactKind, markdownTargets, offersIn, screenOffer } from "./artifacts";
import type { Bot } from "@/state/store";

const bot = { id: "atlas", threadId: "t1" };
const reply = (text: string, extra: Record<string, unknown> = {}) => ({ id: "m1", role: "bot" as const, kind: "text" as const, text, ...extra });

describe("artifact offers", () => {
  it("knows which files a card can show", () => {
    expect(artifactKind("/w/map.HTML")).toBe("html");
    expect(artifactKind("/w/brief.pdf")).toBe("pdf");
    expect(artifactKind("/w/chart.svg?v=2")).toBe("image");
    expect(artifactKind("/w/notes.md")).toBeNull();
  });

  it("reads Markdown link and image targets, angle-bracketed ones too", () => {
    expect(markdownTargets("see [a](/x/a.html) and ![b](</x/my b.png>)")).toEqual(["/x/a.html", "/x/my b.png"]);
  });

  it("offers each local file a bot reply links, once", () => {
    const offers = offersIn(bot, reply("[map](/w/map.html), again [map](/w/map.html), [site](https://example.com/x.html), [notes](/w/notes.md), [brief](file:///w/brief.pdf)"));
    expect(offers.map((o) => [o.file, o.kind, o.href])).toEqual([
      ["map.html", "html", "/w/map.html"],
      ["brief.pdf", "pdf", "file:///w/brief.pdf"],
    ]);
    expect(offers[0]).toMatchObject({ key: "m1:/w/map.html", botId: "atlas", threadId: "t1", messageId: "m1" });
  });

  it("offers nothing from your own messages or non-text rows", () => {
    expect(offersIn(bot, reply("[map](/w/map.html)", { role: "user" }))).toEqual([]);
    expect(offersIn(bot, reply("[map](/w/map.html)", { kind: "tools" }))).toEqual([]);
  });
});

describe("live screen offers", () => {
  const working = (extra: Partial<Bot> = {}) => ({
    id: "atlas", threadId: "t1", busy: true, computer: "cloud",
    messages: [{ id: "ask-1", role: "user", kind: "text", text: "fill in the sheet" }, { id: "m2", role: "bot", kind: "text", text: "on it" }],
    ...extra,
  }) as unknown as Bot;

  it("offers a working bot's screen once per ask, named for its computer", () => {
    expect(screenOffer(working(), { threadId: "t1" })).toMatchObject({ key: "screen:atlas:ask-1", kind: "screen", botId: "atlas", threadId: "t1", href: "", file: "Cloud computer" });
  });

  it("offers nothing without a frame, from an idle bot, or for another thread's frame", () => {
    expect(screenOffer(working(), undefined)).toBeNull();
    expect(screenOffer(working({ busy: false }), { threadId: "t1" })).toBeNull();
    expect(screenOffer(working(), { threadId: "t2" })).toBeNull();
  });

  it("says Computer when the bot picks its computer itself", () => {
    expect(screenOffer(working({ computer: undefined }), {})?.file).toBe("Computer");
  });
});
