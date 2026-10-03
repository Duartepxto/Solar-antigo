// "Wants to show you" (Orbit prototype: SHOWS / offer / present). A bot that
// links a file it made (an HTML page, a PDF, an image) offers it: a pill on
// the map beside the bot, pointing at it; View puts the file on the canvas
// next to its team as an artifact card. The file is the one the message
// links, fetched through the message-scoped file route, so a card can only
// show what the bot itself shared. A bot working on its computer offers its
// live screen the same way, once per ask.
import { useMemo, useState } from "react";

import { localFilePath } from "@/components/ChatMarkdown";
import { t } from "@/lib/i18n";
import { effectivePlace, placeLabelKey } from "@/lib/place";
import type { Bot, Message } from "@/state/store";

export type ArtifactKind = "html" | "pdf" | "image" | "screen";

export interface ArtifactOffer {
  /** `${messageId}:${href}`: one offer per linked file per message */
  key: string;
  botId: string;
  threadId: string;
  messageId: string;
  /** the link target exactly as the message wrote it (the server matches it);
   * empty for a live screen */
  href: string;
  file: string;
  kind: ArtifactKind;
}

export interface Artifact extends ArtifactOffer {
  /** one card per bot and kind: a newer file replaces it in place */
  id: string;
  /** world coordinates and size of the card on the canvas */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ART_W = 680;
export const ART_H = 480;

const KIND_BY_EXT: Record<string, ArtifactKind> = {
  html: "html", htm: "html", pdf: "pdf",
  png: "image", jpg: "image", jpeg: "image", gif: "image", webp: "image", svg: "image",
};

export function artifactKind(path: string): ArtifactKind | null {
  const ext = path.split(/[?#]/)[0]!.split(".").pop()?.toLowerCase() ?? "";
  return KIND_BY_EXT[ext] ?? null;
}

const fileName = (path: string) => path.split(/[\\/]/).filter(Boolean).pop() ?? path;

/** Markdown link and image destinations, in order. */
export function markdownTargets(text: string): string[] {
  const out: string[] = [];
  for (const match of text.matchAll(/\]\(\s*<([^>]+)>|\]\(\s*([^)\s]+)/g)) out.push(match[1] ?? match[2]!);
  return out;
}

/** The files a bot message shows: local links to a kind the card can show. */
export function offersIn(bot: Pick<Bot, "id" | "threadId">, message: Pick<Message, "id" | "role" | "kind" | "text">): ArtifactOffer[] {
  if (message.role !== "bot" || message.kind !== "text" || !message.text) return [];
  const seen = new Set<string>();
  return markdownTargets(message.text).flatMap((href) => {
    const path = localFilePath(href);
    const kind = path ? artifactKind(path) : null;
    if (!path || !kind || seen.has(href)) return [];
    seen.add(href);
    return [{ key: `${message.id}:${href}`, botId: bot.id, threadId: bot.threadId, messageId: message.id, href, file: fileName(path), kind }];
  });
}

const SEEN_KEY = "orbit.offers.seen.v1";
/** Offers are live: a file shared while Orbit is open (or just before it
 * opened), never the files already in a long history. */
const OPENED_AT = Date.now() - 60_000;

function readSeen(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]")); } catch { return new Set(); }
}
function writeSeen(seen: Set<string>) {
  // the most recent few hundred are enough to never offer a file twice
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-400))); } catch { /* private window */ }
}

/** A bot's live screen, while it works on its computer: offered once per
 * ask (keyed by the message that started the work). */
export function screenOffer(bot: Bot, frame: { threadId?: string } | undefined): ArtifactOffer | null {
  if (!frame || !bot.busy || (frame.threadId && frame.threadId !== bot.threadId)) return null;
  const ask = bot.messages.findLast((m) => m.role === "user");
  if (!ask) return null;
  const place = effectivePlace(bot);
  return { key: `screen:${bot.id}:${ask.id}`, botId: bot.id, threadId: bot.threadId, messageId: ask.id, href: "", file: place === "auto" ? t("orbit.offer.computer") : t(placeLabelKey(place)), kind: "screen" };
}

/** The next file a bot wants to show, one at a time (the prototype shows a
 * single offer), and a way to settle it (viewed or put off). */
export function useArtifactOffers(bots: Bot[], screens: Record<string, { threadId?: string }> = {}): { offer: ArtifactOffer | null; settle: (key: string) => void } {
  const [seen, setSeen] = useState(readSeen);
  const offer = useMemo(() => {
    for (const bot of bots) {
      if (bot.hidden) continue;
      const live = screenOffer(bot, screens[bot.id]);
      if (live && !seen.has(live.key)) return live;
    }
    for (const bot of bots) {
      if (bot.hidden) continue;
      for (let i = bot.messages.length - 1; i >= 0; i--) {
        const message = bot.messages[i]!;
        if (message.at < OPENED_AT) break;
        const next = offersIn(bot, message).find((candidate) => !seen.has(candidate.key));
        if (next) return next;
      }
    }
    return null;
  }, [bots, screens, seen]);
  return {
    offer,
    settle: (key) => setSeen((current) => {
      const next = new Set(current).add(key);
      writeSeen(next);
      return next;
    }),
  };
}

/** The linked file's bytes as an object URL for the card. The server sends
 * pages as plain downloads; the card types them itself so they only ever
 * render inside its sandboxed frame. */
export async function artifactUrl(offer: Pick<ArtifactOffer, "threadId" | "messageId" | "href" | "kind" | "file">, signal?: AbortSignal): Promise<string> {
  const response = await fetch(`/api/threads/${encodeURIComponent(offer.threadId)}/messages/${encodeURIComponent(offer.messageId)}/file`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path: offer.href }),
    signal,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.error === "string" ? body.error : `HTTP ${response.status}`);
  }
  const blob = await response.blob();
  const type = offer.kind === "html" ? "text/html;charset=utf-8" : /\.svg$/i.test(offer.file) ? "image/svg+xml" : blob.type;
  return URL.createObjectURL(type === blob.type ? blob : new Blob([blob], { type }));
}

const CARDS_KEY = "orbit.artifacts.v1";

/** The cards left on the canvas, kept across reloads. */
export function loadArtifacts(): Artifact[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CARDS_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((a): a is Artifact => a && typeof a.id === "string" && typeof a.botId === "string" && typeof a.x === "number" && (a.kind === "screen" || artifactKind(a.file ?? "") === a.kind)) : [];
  } catch { return []; }
}
export function saveArtifacts(list: Artifact[]) {
  try { localStorage.setItem(CARDS_KEY, JSON.stringify(list)); } catch { /* private window */ }
}

const PRESENT_EVENT = "orbit:present";

/** Ask the canvas to show a file (the chat's "open on the canvas" row). */
export function requestPresent(offer: ArtifactOffer) {
  window.dispatchEvent(new CustomEvent<ArtifactOffer>(PRESENT_EVENT, { detail: offer }));
}

/** The canvas side of requestPresent. */
export function onPresentRequest(handler: (offer: ArtifactOffer) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<ArtifactOffer>).detail);
  window.addEventListener(PRESENT_EVENT, listener);
  return () => window.removeEventListener(PRESENT_EVENT, listener);
}
