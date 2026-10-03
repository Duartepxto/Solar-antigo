// A line that another bot wrote, in a bot's own conversation.
//
// ask_bot, delegate_bot and start_thread all deliver a peer's words into a
// bot's own conversation as a user-role message: that is the turn the model
// answers, and the server stores it that way. The author rides along on
// Message.peerAsk, and the text opens with a bracketed provenance note for
// the model ("[Message from @Chief, another bot in this Orbit
// workspace — …]"). A renderer keyed on role alone shows that line on the
// person's side of the chat, as if they had said it — which is the bug
// this module exists to prevent. The parse is the client twin of
// server/peer-provenance.ts: the field wins; rows stored before it existed
// still open with the note, so the note is read as the fallback.
//
// coordinate_bots delivers differently: its brief is stored as a bot-role
// line signed with Message.from (the sender), in the recipient's own
// conversation. Keyed on role, that brief reads as the recipient talking
// and runs straight into its answer. A bot-role line signed by a bot other
// than the conversation's own is therefore the sender's line too.
import type { MausColor, Message } from "@/state/store";

export type PeerDelivery = "ask_bot" | "delegate_bot" | "start_thread" | "coordinate_bots";

export interface PeerLine {
  /** The bot that wrote it; absent on rows older than Message.peerAsk. */
  botId?: string;
  name: string;
  /** The colour the line was signed with, for a peer no longer on the roster. */
  color?: MausColor;
  delivery: PeerDelivery;
  /** The words themselves, with the provenance note removed. */
  body: string;
  unattended?: boolean;
}

// The note is one bracketed line with a fixed opening; the wording after
// the workspace clause varies by delivery and is not needed here.
const PROVENANCE_NOTE =
  /^\[(Message from|Delegated by|Thread opened by) @([^,\]]+), another bot in this Orbit workspace[^\]]*\]\s*/;

const DELIVERY: Record<string, PeerDelivery> = {
  "Message from": "ask_bot",
  "Delegated by": "delegate_bot",
  "Thread opened by": "start_thread",
};

/** Who wrote a line, when it was neither the person nor the conversation's
 * own bot (`ownBotId`); null when it was one of them. Without `ownBotId`
 * only user-role lines are read. */
export function peerLine(
  message: Pick<Message, "role" | "text" | "peerAsk"> & Partial<Pick<Message, "kind" | "from">>,
  ownBotId?: string,
): PeerLine | null {
  if (message.role === "bot") {
    const from = message.from;
    if (!ownBotId || message.kind !== "text" || !from || from.botId === ownBotId) return null;
    return { botId: from.botId, name: from.name, color: from.color, delivery: "coordinate_bots", body: message.text ?? "" };
  }
  if (message.role !== "user") return null;
  const text = message.text ?? "";
  const note = PROVENANCE_NOTE.exec(text);
  const name = message.peerAsk?.name ?? note?.[2]?.trim();
  if (!name) return null;
  return {
    botId: message.peerAsk?.botId,
    name,
    delivery: (note && DELIVERY[note[1]]) || "ask_bot",
    body: note ? text.slice(note[0].length) : text,
    ...(message.peerAsk?.unattended ? { unattended: true } : {}),
  };
}
