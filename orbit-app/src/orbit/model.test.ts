import { describe, expect, it } from "vitest";
import type { Bot } from "@/state/store";
import { buildModel, lastActiveAt, moodFor } from "./model";

const bot = (patch: Partial<Bot> = {}): Bot => ({
  id: "b1", threadId: "t1", name: "Vega", title: "", description: "", notifications: true, color: "green",
  unread: false, messages: [], modelSelection: { instanceId: "codex", model: "gpt" }, ...patch,
} as Bot);

describe("sleep", () => {
  it("knows when a bot last did anything, across its threads", () => {
    const b = bot({
      messages: [{ id: "m", role: "bot", kind: "text", at: 1_000, text: "hi" } as Bot["messages"][number]],
      tasks: [{ threadId: "t1", title: "", createdAt: 500, updatedAt: 5_000 }, { threadId: "t2", title: "", createdAt: 2_000 }] as Bot["tasks"],
    });
    expect(lastActiveAt(b)).toBe(5_000);
  });

  it("lets only an idle bot with nothing unread doze off", () => {
    const quiet = bot({ tasks: [{ threadId: "t1", title: "", createdAt: 1, updatedAt: 42 }] as Bot["tasks"] });
    const state = (b: Bot) => buildModel({ bots: [b], groups: [], sections: [], connected: true }).bots[0];
    expect(state(quiet).quietSince).toBe(42);
    expect(state({ ...quiet, unread: true }).quietSince).toBeNull();
    expect(state({ ...quiet, busy: true }).quietSince).toBeNull();
    expect(state({ ...quiet, activity: "waiting-on-you" } as Bot).quietSince).toBeNull();
  });

  it("sleeps when the computer is gone", () => {
    expect(moodFor(bot(), false)).toBe("sleepy");
  });
});

describe("chat column width", () => {
  it("defaults to 40% up to 440, follows a dragged width, and always leaves the ring room", async () => {
    const { chatColumnWidth, setPreferredChatWidth, MIN_RING_SIDE } = await import("./model");
    setPreferredChatWidth(null);
    expect(chatColumnWidth(1440)).toBe(440);
    expect(chatColumnWidth(900)).toBe(360);
    setPreferredChatWidth(800);
    expect(chatColumnWidth(1440)).toBe(800);
    expect(chatColumnWidth(1000)).toBe(1000 - 28 - MIN_RING_SIDE);
    setPreferredChatWidth(120);
    expect(chatColumnWidth(1440)).toBe(300);
    setPreferredChatWidth(null);
  });
});
