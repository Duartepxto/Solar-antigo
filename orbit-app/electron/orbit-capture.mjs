// One screenshot of the display under the cursor, for a summoned Orbit turn.
//
// desktopCapturer rather than the CUA daemon's capture: it runs in this
// process, so macOS attributes Screen Recording to Orbit itself (the same
// reason screen:frame lives in main.mjs); it names each source's display_id,
// so the picture and the display geometry used to map [POINT] tags back are
// guaranteed to be the same screen; and it works while the CUA daemon is
// stopped, still starting, or refused its own permissions. The daemon stays
// the tool the agent ACTS with; this is only what the agent is shown.
//
// Electron-free: the caller passes desktopCapturer and the display.
//
// Nothing is written to disk: the JPEG goes to the renderer, which uploads
// it as the turn's attachment. Earlier builds kept copies in
// userData/orbit-captures; clearCaptureDir removes that folder.
import fs from "node:fs";

// Claude's high-resolution vision tier (Opus 4.7 and later, including the
// Orbit agent's default Opus 5.5) takes up to 2576 px on the long edge and
// 3.75 MP without resizing, so coordinates it writes are pixels of exactly
// the image we sent. Larger screens are fitted down here, and the effective
// scale (image px per display point) is sent along instead of the display's
// own backing scale factor.
export const CAPTURE_MAX_EDGE = 2576;
export const CAPTURE_MAX_PIXELS = 3_750_000;
const JPEG_QUALITY = 82;

export function fitCaptureSize(display, { maxEdge = CAPTURE_MAX_EDGE, maxPixels = CAPTURE_MAX_PIXELS } = {}) {
  const scale = display.scaleFactor > 0 ? display.scaleFactor : 1;
  const width = Math.max(1, Math.round(display.size.width * scale));
  const height = Math.max(1, Math.round(display.size.height * scale));
  const ratio = Math.min(1, maxEdge / Math.max(width, height), Math.sqrt(maxPixels / (width * height)));
  return { width: Math.max(1, Math.floor(width * ratio)), height: Math.max(1, Math.floor(height * ratio)) };
}

/** Screenshots of the person's screen must not linger: remove the folder
 * older builds saved them in. */
export function clearCaptureDir(dir, io = fs) {
  try {
    io.rmSync(dir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Capture `display`. Resolves { ok: true, image (JPEG bytes), mime, width,
 * height, scaleFactor, displayId, bounds } or { ok: false, reason }
 * where reason is "denied" (macOS gave an empty picture: Screen Recording is
 * off for this app) or "failed".
 */
export async function captureDisplay({ desktopCapturer, display }) {
  const size = fitCaptureSize(display);
  let sources;
  try {
    sources = await desktopCapturer.getSources({ types: ["screen"], thumbnailSize: size });
  } catch (error) {
    // macOS without Screen Recording makes ScreenCaptureKit refuse the whole
    // listing; Electron reports it as "Failed to get sources".
    return { ok: false, reason: /failed to get sources/i.test(String(error?.message ?? error)) ? "denied" : "failed" };
  }
  const source = sources.find((candidate) => String(candidate.display_id) === String(display.id))
    ?? (sources.length === 1 ? sources[0] : null);
  if (!source) return { ok: false, reason: sources.length ? "failed" : "denied" };
  const thumbnail = source.thumbnail;
  if (!thumbnail || thumbnail.isEmpty()) return { ok: false, reason: "denied" };
  const actual = thumbnail.getSize();
  if (!actual.width || !actual.height) return { ok: false, reason: "denied" };
  const image = thumbnail.toJPEG(JPEG_QUALITY);
  return {
    ok: true,
    image,
    mime: "image/jpeg",
    width: actual.width,
    height: actual.height,
    scaleFactor: actual.width / display.bounds.width,
    displayId: String(display.id),
    bounds: { ...display.bounds },
  };
}

/** Runs `fn` one call at a time, in call order: a second capture waits for
 * the first to put Orbit's windows back before it hides them again, so an
 * overlapping capture never sees them half-restored. */
export function serialized(fn) {
  let chain = Promise.resolve();
  return (...args) => {
    const run = chain.then(() => fn(...args));
    chain = run.catch(() => {});
    return run;
  };
}
