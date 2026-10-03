// How talk mode's island moves, taken from Coucou (github.com/Louis-CFM/coucou,
// MIT): its SwiftUI springs are turned into CSS `linear()` easings sampled
// from the same spring equation, so a grow here has the same response,
// overshoot and settle time as the Swift app's.
//
//   IslandRootView.swift  openSpring = .spring(response: 0.5, dampingFraction: 0.72)
//                         closeEase  = .timingCurve(0.45, 0, 0.2, 1, duration: 0.34)
//   IslandContentView     entering view: .spring(response: 0.4, dampingFraction: 0.8).delay(0.16)
//                         leaving view:  .easeIn(duration: 0.16)

export interface Motion {
  /** a CSS easing function */
  easing: string;
  durationMs: number;
  delayMs?: number;
}

/** A SwiftUI `.spring(response:dampingFraction:)` from rest to 1: the
 * natural frequency is 2π / response, the damping ratio is the fraction. */
export function springAt(t: number, response: number, damping: number): number {
  const omega = (2 * Math.PI) / response;
  if (damping >= 1) return 1 - Math.exp(-omega * t) * (1 + omega * t);
  const decay = damping * omega;
  const damped = omega * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(-decay * t) * (Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t));
}

/** How long the spring takes to settle within `epsilon` of its target and
 * stay there (its envelope, so a zero crossing never ends it early). */
export function springSettleSeconds(response: number, damping: number, epsilon = 0.001): number {
  const omega = (2 * Math.PI) / response;
  const decay = Math.min(1, damping) * omega;
  // e^(-ζωt)·(1 + ζω/ωd) bounds the error of an underdamped spring
  const damped = damping < 1 ? omega * Math.sqrt(1 - damping * damping) : omega;
  const scale = damping < 1 ? Math.hypot(1, decay / damped) : 1 + omega;
  return Math.log(scale / epsilon) / decay;
}

const round = (value: number, places: number) => Number(value.toFixed(places));

/** The spring as a CSS transition: `linear()` through `samples` points of
 * the curve over its settle time. */
export function springMotion(response: number, damping: number, samples = 40): Motion {
  const seconds = springSettleSeconds(response, damping);
  const points: string[] = [];
  for (let index = 0; index <= samples; index += 1) {
    const progress = index / samples;
    const value = index === samples ? 1 : springAt(progress * seconds, response, damping);
    points.push(String(round(value, 4)));
  }
  return { easing: `linear(${points.join(", ")})`, durationMs: Math.round(seconds * 1000) };
}

export const MOTION = {
  /** growing: hidden → compact → expanded */
  open: springMotion(0.5, 0.72),
  /** shrinking: no overshoot */
  close: { easing: "cubic-bezier(0.45, 0, 0.2, 1)", durationMs: 340 } satisfies Motion,
  /** a view's content coming in, once the island has started to grow */
  contentIn: { ...springMotion(0.4, 0.8), delayMs: 160 },
  contentOut: { easing: "ease-in", durationMs: 160 } satisfies Motion,
} as const;

/** The island's size levels: a move up springs, a move down eases. */
export function islandMotion(fromLevel: number, toLevel: number): Motion {
  return toLevel < fromLevel ? MOTION.close : MOTION.open;
}

/** `transition` for the island's box. */
export function islandTransition(motion: Motion): string {
  return ["width", "height", "border-radius"].map((property) => `${property} ${motion.durationMs}ms ${motion.easing}`).join(", ");
}
