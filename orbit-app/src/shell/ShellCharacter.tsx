import { useEffect, useRef } from "react";
import { drawChar, hexRgb, newCharState, type Mood } from "@/orbit/characters";
import { orbitShell } from "@/lib/orbit-shell";
import { createFaceLoop, faceFrameInterval, type FaceLoop } from "./face-loop";

/** The Orbit agent's particle character on its own canvas, drawn by the
 * map's renderer (src/orbit/characters.ts) so it is the same character the
 * map shows, in the agent's own colour. */
export function ShellCharacter({ color, mood, size, pulse = 0, voiceLevel, mini = false, live = true, className }: {
  color: string;
  mood: Mood;
  size: number;
  /** bump for a one-shot reaction (a spin and a hop) */
  pulse?: number;
  /** while talking: how open the mouth is, 0..1 */
  voiceLevel?: () => number | undefined;
  /** a pill-sized face: fewest points, like the map's small faces */
  mini?: boolean;
  /** animate; when false one still frame is drawn and nothing runs */
  live?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef<Mood>(mood);
  const levelRef = useRef(voiceLevel);
  levelRef.current = voiceLevel;
  const liveRef = useRef(live);
  liveRef.current = live;
  const loopRef = useRef<FaceLoop | null>(null);
  const charRef = useRef(newCharState(hexRgb(color), 2.1, performance.now() / 1000));
  useEffect(() => {
    charRef.current.rgb = hexRgb(color);
    loopRef.current?.refresh();
  }, [color]);
  useEffect(() => {
    if (mood !== moodRef.current) {
      moodRef.current = mood;
      charRef.current.flash = performance.now() / 1000;
      loopRef.current?.refresh();
    }
  }, [mood]);
  useEffect(() => {
    if (pulse) charRef.current.kick = performance.now() / 1000;
  }, [pulse]);
  useEffect(() => {
    loopRef.current?.setLive(live);
  }, [live]);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const draw = (t: number, dt: number, still: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      // a still is the character at rest in its mood: no spin boost, hop or
      // blink caught mid-way
      const state = still ? { ...charRef.current, flash: -9, kick: -9, blink: t + 10 } : charRef.current;
      const voice = moodRef.current === "talking" ? levelRef.current?.() : undefined;
      drawChar(ctx, state, moodRef.current, size / 2, size / 2, size * (mini ? 0.34 : 0.2), 1, t, dt,
        mini ? { mini: true } : { big: true, noRing: true, softCore: true, reduced, voice });
    };
    // A shell panel can be hidden while its page still counts as visible;
    // main says when it is shown or hidden, and the loop only runs between.
    const loop = createFaceLoop({
      request: (cb) => requestAnimationFrame(cb),
      cancel: (handle) => cancelAnimationFrame(handle),
      draw,
      // Floating surfaces are never focused (the talk panel cannot be), so
      // the budget follows what the character is doing instead.
      interval: (t) => faceFrameInterval(moodRef.current, mini, t - charRef.current.kick),
      now: () => performance.now(),
      pageHidden: () => document.hidden,
    }, { live: liveRef.current });
    loopRef.current = loop;
    const offVisibility = orbitShell()?.onVisibility((visible) => loop.setShown(visible));
    return () => {
      offVisibility?.();
      loop.dispose();
      if (loopRef.current === loop) loopRef.current = null;
    };
  }, [size, mini]);
  return <canvas ref={ref} aria-hidden style={{ width: size, height: size }} className={className} />;
}
