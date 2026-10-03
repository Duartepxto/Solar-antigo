import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReplyFollower, trailingReplies, type ReplyUpdate } from "./orbit-client";

class FakeEventSource {
  static CLOSED = 2;
  static last: FakeEventSource | null = null;
  readyState = 1;
  onmessage: ((event: { data: string }) => void) | null = null;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public url: string) {
    FakeEventSource.last = this;
  }
  close() {
    this.readyState = FakeEventSource.CLOSED;
  }
  frame(value: unknown) {
    this.onmessage?.({ data: JSON.stringify(value) });
  }
}

const reply = (id: string, text: string) => ({ id, role: "bot", kind: "text", text });

describe("trailingReplies", () => {
  it("keeps the bot's text bubbles after the newest question", () => {
    expect(trailingReplies([
      reply("1", "old answer"),
      { id: "2", role: "user", kind: "text", text: "question" },
      reply("3", "first"),
      { id: "4", role: "bot", kind: "activity" },
      reply("5", "second"),
    ]).map((message) => message.text)).toEqual(["first", "second"]);
    expect(trailingReplies([{ id: "1", role: "user", kind: "text", text: "q" }])).toEqual([]);
  });
});

describe("ReplyFollower", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("EventSource", FakeEventSource);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("lets a turn go after the ceiling, once", () => {
    const follower = new ReplyFollower(1_000);
    const updates: ReplyUpdate[] = [];
    follower.follow("t1", (update) => updates.push(update));
    FakeEventSource.last!.frame({ kind: "runtime", event: { type: "content.delta", threadId: "t1", streamKind: "assistant_text", delta: "Hel" } });
    vi.advanceTimersByTime(999);
    expect(updates.at(-1)).toEqual({ text: "Hel", done: false });
    vi.advanceTimersByTime(1);
    expect(updates.at(-1)).toEqual({ text: "Hel", done: true, timedOut: true });
    vi.advanceTimersByTime(5_000);
    expect(updates).toHaveLength(2);
    follower.close();
  });

  it("a turn that completes clears its ceiling", () => {
    const follower = new ReplyFollower(1_000);
    const updates: ReplyUpdate[] = [];
    follower.follow("t1", (update) => updates.push(update));
    FakeEventSource.last!.frame({ kind: "runtime", event: { type: "turn.completed", threadId: "t1" } });
    vi.advanceTimersByTime(400);
    expect(updates).toEqual([{ text: "", done: true }]);
    vi.advanceTimersByTime(5_000);
    expect(updates).toHaveLength(1);
    follower.close();
  });

  it("after a reconnect, settles a turn that ended while the stream was down", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      const body = url.startsWith("/api/bots")
        ? { bots: [{ id: "b", tasks: [{ threadId: "t1", busy: false }] }] }
        : { messages: [{ id: "q", role: "user", kind: "text", text: "hi" }, reply("r1", "Hello there")] };
      return new Response(JSON.stringify(body), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const follower = new ReplyFollower(60_000);
    const updates: ReplyUpdate[] = [];
    follower.follow("t1", (update) => updates.push(update));
    const source = FakeEventSource.last!;
    source.onerror?.();
    source.onopen?.();
    for (let i = 0; i < 5; i += 1) await Promise.resolve();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(updates).toEqual([]);

    follower.accept();
    source.onerror?.();
    source.onopen?.();
    await vi.waitFor(() => expect(updates).toEqual([{ text: "Hello there", done: true }]));
    follower.close();
  });
});
