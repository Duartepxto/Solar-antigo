// The Orbit agent guides on screen by writing `[POINT:x,y:label]` (or
// `[POINT:x,y:label:screenN]`) in its reply, where x,y are pixels of the
// screenshot it was sent (docs/design/orbit-agent.md, contract 4). The tag
// format and the "fly a cursor to it" idea come from Clicky
// (github.com/farzaa/clicky, MIT); this parser and mapping are Orbit's own.
//
// Pure, so the shell's quick bar and talk character share one tested copy.

export interface PointTag {
  /** screenshot pixels */
  x: number;
  y: number;
  label: string;
  /** 1-based screenshot index when the reply names one (`:screen2`) */
  screen?: number;
}

/** What the shell sent with the turn: the screenshot's pixel size, how many
 * of its pixels make one display point, and the display it shows. */
export interface CaptureGeometry {
  width: number;
  height: number;
  scaleFactor: number;
  bounds: { x: number; y: number; width: number; height: number };
}

// The label runs to the closing bracket; a trailing `:screenN` is split off
// by trying the shortest label first. `[POINT:none]` means "nothing to point
// at" (Clicky's convention) and is stripped like any other tag.
const TAG = /\[POINT:\s*(?:none|(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*:\s*([^\]]*?))?(?:\s*:\s*screen\s*(\d+))?)\s*\]/gi;
// An unfinished tag at the end of a streamed reply: hidden until it closes.
const OPEN_TAIL = /\[(?:P(?:O(?:I(?:N(?:T(?::[^\]]*)?)?)?)?)?)?$/i;

export function parsePointTags(text: string): PointTag[] {
  const points: PointTag[] = [];
  for (const match of text.matchAll(TAG)) {
    if (match[1] === undefined || match[2] === undefined) continue;
    const x = Number(match[1]);
    const y = Number(match[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const screen = match[4] === undefined ? undefined : Number(match[4]);
    points.push({
      x,
      y,
      label: (match[3] ?? "").trim(),
      ...(screen !== undefined && screen > 0 ? { screen } : {}),
    });
  }
  return points;
}

/** The reply as a person reads or hears it: no tags, and no half-streamed
 * tag at the end. */
export function stripPointTags(text: string): string {
  return text
    .replace(TAG, "")
    .replace(OPEN_TAIL, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([.,;:!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Only what a voice should say: tags gone, and the markdown marks that a
 * speech engine would read out loud ("asterisk") dropped. */
export function speakableText(text: string): string {
  return stripPointTags(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__|\*|_)(\S[^*_]*?)\1/g, "$2")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Screenshot pixels → global display points (x / scaleFactor + the
 * display's origin). A point outside the screenshot is refused rather than
 * pinned to an edge: pointing at the wrong thing is worse than not pointing. */
export function mapPointToDisplay(point: Pick<PointTag, "x" | "y">, capture: CaptureGeometry): { x: number; y: number } | null {
  const { width, height, scaleFactor, bounds } = capture;
  if (!(scaleFactor > 0) || !(width > 0) || !(height > 0)) return null;
  if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) return null;
  const x = bounds.x + point.x / scaleFactor;
  const y = bounds.y + point.y / scaleFactor;
  return {
    x: Math.round(Math.min(bounds.x + bounds.width - 1, Math.max(bounds.x, x))),
    y: Math.round(Math.min(bounds.y + bounds.height - 1, Math.max(bounds.y, y))),
  };
}

/** A streamed reply grows; each complete tag is announced once. */
export class PointStream {
  private seen = 0;

  /** The tags completed since the last call, given the whole text so far. */
  take(text: string): PointTag[] {
    const all = parsePointTags(text);
    const fresh = all.slice(this.seen);
    this.seen = all.length;
    return fresh;
  }

  reset(): void {
    this.seen = 0;
  }
}
