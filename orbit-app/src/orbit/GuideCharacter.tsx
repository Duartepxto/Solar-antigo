import { useEffect, useRef } from "react";
import type { MausState } from "@/lib/mascot";
import { drawChar, newCharState, type Mood } from "./characters";
import { SolarIdentity } from './SolarIdentity';

/** The guide's colour: onboarding green (design_handoff_orbit README, tokens). */
const GUIDE_RGB: [number, number, number] = [62, 224, 154];

const MOODS: ReadonlySet<string> = new Set(["idle", "focused", "thinking", "pleading", "sending", "surprised", "happy", "talking", "stalled", "sleepy"]);
const NEAREST: Record<string, Mood> = {
  celebrate: "happy", success: "happy", proud: "happy", love: "happy",
  curious: "thinking", listening: "idle", searching: "focused", working: "focused",
  worried: "pleading", error: "stalled", sleeping: "sleepy", speaking: "talking",
};

/** The welcome flow and tours speak in the app's mascot states; the guide
 * draws the nearest particle-character mood. */
export function guideMood(state: MausState | Mood | string): Mood {
  if (MOODS.has(state)) return state as Mood;
  return NEAREST[state] ?? "idle";
}

/** The green guide character on its own canvas: the welcome window, the
 * tour bubble, and the loading and empty states. */
export function GuideCharacter({ mood, pulse = 0, size = 150, className }: {
  mood: MausState | Mood;
  /** bump to play a one-shot reaction (a spin and a hop) */
  pulse?: number;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef<Mood>(guideMood(mood));
  const charRef = useRef(newCharState(GUIDE_RGB, 1.3, performance.now() / 1000));
  useEffect(() => {
    const next = guideMood(mood);
    if (next !== moodRef.current) {
      moodRef.current = next;
      charRef.current.flash = performance.now() / 1000;
    }
  }, [mood]);
  useEffect(() => {
    if (pulse) charRef.current.kick = performance.now() / 1000;
  }, [pulse]);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = 0;
    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      const t = ms / 1000;
      // The map's frame budget: 60 a second just after a reaction, 30 while
      // it only breathes, 10 behind another window, none while hidden.
      if (document.hidden) return;
      const interval = t - charRef.current.kick < 1 ? 1 / 60 : document.hasFocus() ? 1 / 30 : 1 / 10;
      if (last && t - last < interval - 0.004) return;
      const dt = Math.min(0.05, last ? t - last : 0);
      last = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      // The small guide canvases skip the arrival ring (README, Characters).
      drawChar(ctx, charRef.current, moodRef.current, size / 2, size / 2, size * 0.2, 1, t, dt, { big: true, noRing: true, reduced });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size]);
  if (import.meta.env.VITE_JARVIS_SOLAR === 'true') return <span aria-hidden="true" className={className} style={{display:'inline-block',width:size,height:size}}><SolarIdentity id="you" size={size}/></span>;
  return <canvas ref={ref} aria-hidden style={{ width: size, height: size }} className={className} />;
}
