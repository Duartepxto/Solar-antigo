// The shell character's drawing loop (ShellCharacter.tsx), pure so tests
// drive it with a fake clock. Live, it redraws on animation frames within a
// frame budget; not live (or its window hidden), it has drawn one still
// frame and asks for nothing more, so a face merely on screen costs nothing.

import type { Mood } from "@/orbit/characters";

export interface FaceLoopDeps {
  request(cb: (ms: number) => void): number;
  cancel(handle: number): void;
  /** Draw a frame at `t` seconds; `still` is the one frame a paused face keeps. */
  draw(t: number, dt: number, still: boolean): void;
  /** The frame budget (seconds between frames) at `t`. */
  interval(t: number): number;
  /** now, in ms (performance.now) */
  now(): number;
  /** the page is hidden: keep the loop but draw nothing */
  pageHidden?(): boolean;
}

/** Seconds between frames: mini faces 30 fps at most; a big face at 60 while
 * it reacts or is busy, 30 otherwise. */
export function faceFrameInterval(mood: Mood, mini: boolean, sinceKick: number): number {
  if (mini) return 1 / 30;
  const busy = mood !== "idle" && mood !== "sleepy";
  return sinceKick < 1 || busy ? 1 / 60 : 1 / 30;
}

export interface FaceLoop {
  setLive(live: boolean): void;
  setShown(shown: boolean): void;
  /** Something the still shows changed (mood, colour): draw it again. */
  refresh(): void;
  readonly running: boolean;
  dispose(): void;
}

export function createFaceLoop(deps: FaceLoopDeps, { live: startLive = true, shown: startShown = true } = {}): FaceLoop {
  let live = startLive;
  let shown = startShown;
  let raf = 0;
  let last = 0;
  let disposed = false;

  const tick = (ms: number) => {
    raf = 0;
    if (disposed || !live || !shown) return;
    raf = deps.request(tick);
    if (deps.pageHidden?.()) return;
    const t = ms / 1000;
    if (last && t - last < deps.interval(t) - 0.004) return;
    const dt = Math.min(0.05, last ? t - last : 0);
    last = t;
    deps.draw(t, dt, false);
  };
  const run = () => {
    if (disposed || !live || !shown || raf) return;
    // no catch-up burst after a rest
    last = 0;
    raf = deps.request(tick);
  };
  const halt = () => {
    if (raf) deps.cancel(raf);
    raf = 0;
  };
  const still = () => {
    if (!disposed) deps.draw(deps.now() / 1000, 0, true);
  };

  if (live && shown) run();
  else still();

  return {
    setLive(next) {
      if (next === live) return;
      live = next;
      if (live) run();
      else {
        halt();
        still();
      }
    },
    setShown(next) {
      if (next === shown) return;
      shown = next;
      if (shown) run();
      else halt();
    },
    refresh() {
      if (!live || !shown) still();
    },
    get running() {
      return raf !== 0;
    },
    dispose() {
      disposed = true;
      halt();
    },
  };
}
