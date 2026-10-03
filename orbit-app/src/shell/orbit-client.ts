// How the shell's surfaces talk to the Orbit agent: the same routes the app
// uses (docs/design/orbit-agent.md, contracts 1–3), plus `surface` and, with
// a screenshot, `screen` on the message body.
import { composeMessage, imageAttachmentFromFile } from "@/lib/composer-attachments";
import { liveEventsUrl } from "@/lib/live-events";
import { MAUS_COLORS } from "@/lib/mascot";
import type { ShellCapture } from "@/lib/orbit-shell";

export interface OrbitTarget {
  botId: string;
  threadId: string;
  name: string;
  color: string;
  voice?: string;
  /** false while the dedicated agent is not on this server yet */
  dedicated: boolean;
}

type WireBot = { id: string; name: string; threadId: string; color?: string; voice?: string; chiefOfStaff?: boolean; hidden?: boolean };

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { headers: { "content-type": "application/json" }, ...init });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(body.error ?? `${res.status} ${res.statusText}`), { status: res.status });
  return body as T;
}

function colorOf(bot: WireBot | undefined): string {
  const named = bot?.color ? (MAUS_COLORS as Record<string, string>)[bot.color] : undefined;
  return named ?? bot?.color ?? MAUS_COLORS.blue;
}

/**
 * The singleton Orbit agent (`GET /api/orbit-agent`). A 404 only means the
 * server is still creating it, so wait and ask again; nothing else stands
 * in for it, since the person's words must never reach a different bot.
 */
export async function resolveOrbitTarget(): Promise<OrbitTarget> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const agent = await json<{ botId: string; threadId: string; name: string }>("/api/orbit-agent");
      const { bots } = await json<{ bots: WireBot[] }>("/api/bots?messages=0");
      const bot = bots.find((candidate) => candidate.id === agent.botId);
      return { botId: agent.botId, threadId: agent.threadId, name: agent.name, color: colorOf(bot), voice: bot?.voice, dedicated: true };
    } catch (error) {
      if ((error as { status?: number }).status !== 404 || attempt >= 10) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }
}

export interface SendInput {
  target: OrbitTarget;
  text: string;
  surface: "quick" | "talk";
  capture?: ShellCapture | null;
}

/** Upload the screenshot, then send. Resolves the thread the reply lands in. */
export async function sendToOrbit({ target, text, surface, capture }: SendInput): Promise<{ threadId: string }> {
  const attachments = [];
  if (capture) {
    const file = new File([capture.image as Uint8Array<ArrayBuffer>], "screen.jpg", { type: capture.mime });
    const image = await imageAttachmentFromFile(file);
    if (image) attachments.push(image);
  }
  const body: Record<string, unknown> = {
    text: composeMessage(text, attachments),
    threadId: target.threadId,
    sendId: crypto.randomUUID(),
    surface,
  };
  if (capture && attachments.length) {
    body.screen = { width: capture.width, height: capture.height, scaleFactor: capture.scaleFactor, displayId: capture.displayId };
  }
  const receipt = await json<{ threadId?: string }>(`/api/bots/${encodeURIComponent(target.botId)}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return { threadId: typeof receipt.threadId === "string" ? receipt.threadId : target.threadId };
}

export function interruptOrbit(target: Pick<OrbitTarget, "botId">, threadId: string): Promise<unknown> {
  return json(`/api/bots/${encodeURIComponent(target.botId)}/interrupt`, {
    method: "POST",
    body: JSON.stringify({ threadId }),
  });
}

export interface ReplyUpdate {
  /** everything the agent has said this turn so far, tags included */
  text: string;
  done: boolean;
  /** done because the turn outlived TURN_CEILING_MS without ending */
  timedOut?: boolean;
}

/** A turn that has not ended after this long is let go: the surface
 * releases the screen and rests, and the reply stays in the thread. */
export const TURN_CEILING_MS = 3 * 60_000;

type ThreadMessage = { id?: string; role?: string; kind?: string; text?: string };

/** Where a followed turn stands after the live stream was lost: still
 * running, or finished with these bot replies since the last question. */
export async function fetchTurnState(threadId: string): Promise<{ busy: boolean; replies: ThreadMessage[] } | null> {
  try {
    const { bots } = await json<{ bots: Array<{ tasks?: Array<{ threadId?: string; busy?: boolean }> }> }>("/api/bots?messages=0");
    const task = bots.flatMap((bot) => bot.tasks ?? []).find((candidate) => candidate.threadId === threadId);
    if (!task) return null;
    if (task.busy) return { busy: true, replies: [] };
    const { messages } = await json<{ messages?: ThreadMessage[] }>(`/api/threads/${encodeURIComponent(threadId)}/messages?limit=20`);
    return { busy: false, replies: trailingReplies(messages ?? []) };
  } catch {
    return null;
  }
}

/** The bot's text bubbles after the newest message that is not the bot's. */
export function trailingReplies(messages: ThreadMessage[]): ThreadMessage[] {
  const replies: ThreadMessage[] = [];
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]!;
    if (message.role !== "bot") break;
    if (message.kind === "text" && typeof message.text === "string") replies.unshift(message);
  }
  return replies;
}

type Frame = {
  kind?: string;
  threadId?: string;
  message?: { role?: string; kind?: string; text?: string; id?: string };
  event?: { type?: string; threadId?: string; streamKind?: string; delta?: string };
};

/**
 * Follows one thread's reply on `/api/events`: streamed tokens while the
 * turn runs, each settled bubble as it lands, and the end of the turn.
 * One EventSource per surface, opened before the first send so no token
 * is missed.
 */
export class ReplyFollower {
  private source: EventSource | null = null;
  private threadId: string | null = null;
  private settled: string[] = [];
  private live = "";
  private seen = new Set<string>();
  private listener: ((update: ReplyUpdate) => void) | null = null;
  private retry: ReturnType<typeof setTimeout> | null = null;
  private closed = false;
  private finishing: ReturnType<typeof setTimeout> | null = null;
  private ceiling: ReturnType<typeof setTimeout> | null = null;
  private lostStream = false;
  /** the server took this turn's message, so its end is worth asking about */
  private accepted = false;

  constructor(private readonly ceilingMs = TURN_CEILING_MS) {
    this.open();
  }

  private open() {
    if (this.closed) return;
    const source = new EventSource(liveEventsUrl({ screens: false }));
    this.source = source;
    source.onmessage = (event) => {
      let frame: Frame;
      try {
        frame = JSON.parse(event.data) as Frame;
      } catch {
        return;
      }
      this.handle(frame);
    };
    source.onopen = () => {
      // Events sent while the stream was down are gone: ask where the turn
      // stands instead of waiting on a turn.completed that already passed.
      if (this.lostStream) void this.recover();
      this.lostStream = false;
    };
    source.onerror = () => {
      this.lostStream = true;
      // The browser retries on its own; a closed source needs us.
      if (source.readyState === EventSource.CLOSED) {
        this.source = null;
        this.retry = setTimeout(() => this.open(), 1500);
      }
    };
  }

  /** Start following `threadId`; earlier text is forgotten. */
  follow(threadId: string, listener: (update: ReplyUpdate) => void) {
    const sameTurn = this.threadId !== null && this.listener === listener;
    this.clearFinishing();
    this.threadId = threadId;
    this.settled = [];
    this.live = "";
    this.seen.clear();
    this.listener = listener;
    if (!sameTurn) this.accepted = false;
    // Re-following the same turn (its thread moved) keeps its deadline.
    if (!sameTurn || !this.ceiling) {
      this.clearCeiling();
      this.ceiling = setTimeout(() => {
        this.ceiling = null;
        this.emit(true, true);
      }, this.ceilingMs);
    }
  }

  private clearFinishing() {
    if (this.finishing) clearTimeout(this.finishing);
    this.finishing = null;
  }

  private clearCeiling() {
    if (this.ceiling) clearTimeout(this.ceiling);
    this.ceiling = null;
  }

  stop() {
    this.clearFinishing();
    this.clearCeiling();
    this.threadId = null;
    this.listener = null;
  }

  /** The send went through: until then a thread that is not busy only
   * means the turn has not begun. */
  accept() {
    this.accepted = true;
  }

  /** After a reconnect: settle a turn that ended while we were not
   * listening, with whatever it said. */
  private async recover() {
    const threadId = this.threadId;
    if (!threadId || !this.accepted) return;
    const state = await fetchTurnState(threadId);
    if (!state || state.busy || this.threadId !== threadId || this.finishing) return;
    for (const message of state.replies) {
      if (message.id && this.seen.has(message.id)) continue;
      if (message.id) this.seen.add(message.id);
      if (typeof message.text === "string") this.settled.push(message.text);
    }
    this.live = "";
    this.emit(true);
  }

  close() {
    this.closed = true;
    this.stop();
    if (this.retry) clearTimeout(this.retry);
    this.source?.close();
    this.source = null;
  }

  private emit(done: boolean, timedOut = false) {
    const text = [...this.settled, this.live].filter(Boolean).join("\n\n");
    this.listener?.(timedOut ? { text, done, timedOut } : { text, done });
    if (done) this.stop();
  }

  private handle(frame: Frame) {
    if (!this.threadId) return;
    if (frame.kind === "runtime" && frame.event?.threadId === this.threadId) {
      const event = frame.event;
      if (event.type === "content.delta" && event.streamKind === "assistant_text" && typeof event.delta === "string") {
        this.live += event.delta;
        this.emit(false);
      } else if (event.type === "turn.completed" && !this.finishing) {
        // The settled bubble can trail the runtime event by a moment.
        this.finishing = setTimeout(() => {
          this.finishing = null;
          this.emit(true);
        }, 400);
      }
      return;
    }
    if (frame.kind === "message" && frame.threadId === this.threadId) {
      const message = frame.message;
      if (message?.role !== "bot" || message.kind !== "text" || typeof message.text !== "string") return;
      if (message.id && this.seen.has(message.id)) return;
      if (message.id) this.seen.add(message.id);
      // A settled bubble replaces the stream it came from.
      this.settled.push(message.text);
      this.live = "";
      this.emit(false);
    }
  }
}
