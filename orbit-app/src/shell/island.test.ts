import { describe, expect, it } from "vitest";
import { ISLAND, islandRadius, islandSize, lookLevel, overIsland, virtualNotch } from "./island-geometry";
import { islandMotion, MOTION, springAt, springMotion, springSettleSeconds } from "./island-motion";

describe("island sizes come from the notch", () => {
  const notch = { width: 185, height: 32 };

  it("hidden is the notch, compact adds the ears, heard words open it 640 wide", () => {
    expect(islandSize({ kind: "hidden" }, notch)).toEqual(notch);
    expect(islandSize({ kind: "compact" }, notch)).toEqual({ width: 185 + 2 * ISLAND.ear, height: 32 });
    expect(islandSize({ kind: "talk", contentHeight: 30.2 }, notch)).toEqual({ width: 640, height: 32 + 31 });
    expect(islandSize({ kind: "talk", contentHeight: -4 }, notch)).toEqual({ width: 640, height: 32 });
  });

  it("a display without a notch gets Coucou's virtual one, as tall as the menu bar", () => {
    expect(virtualNotch(24)).toEqual({ width: 184, height: 24 });
    expect(virtualNotch(0)).toEqual({ width: 184, height: 32 });
  });

  it("rounds like Coucou and orders its levels", () => {
    expect(islandRadius({ kind: "compact" }, notch)).toBe(14);
    expect(islandRadius({ kind: "compact" }, { width: 184, height: 24 })).toBe(12);
    expect(islandRadius({ kind: "talk", contentHeight: 40 }, notch)).toBe(22);
    expect([lookLevel({ kind: "hidden" }), lookLevel({ kind: "compact" }), lookLevel({ kind: "talk", contentHeight: 1 })]).toEqual([0, 1, 2]);
  });

  it("takes the pointer over the island's rect grown by 6 pt", () => {
    const size = { width: 185, height: 32 };
    const left = (720 - 185) / 2;
    expect(overIsland({ x: left - 6, y: 0 }, size, 720)).toBe(true);
    expect(overIsland({ x: left - 7, y: 0 }, size, 720)).toBe(false);
    expect(overIsland({ x: 360, y: 38 }, size, 720)).toBe(true);
    expect(overIsland({ x: 360, y: 39 }, size, 720)).toBe(false);
  });
});

describe("island motion follows Coucou's springs", () => {
  it("samples the SwiftUI spring and settles", () => {
    expect(springAt(0, 0.5, 0.72)).toBeCloseTo(0, 6);
    // underdamped: it overshoots, a little
    const peak = Math.max(...Array.from({ length: 200 }, (_, i) => springAt(i / 200, 0.5, 0.72)));
    expect(peak).toBeGreaterThan(1.02);
    expect(peak).toBeLessThan(1.06);
    const settle = springSettleSeconds(0.5, 0.72);
    expect(settle).toBeGreaterThan(0.7);
    expect(settle).toBeLessThan(0.9);
    expect(Math.abs(1 - springAt(settle, 0.5, 0.72))).toBeLessThan(0.001);
  });

  it("builds a CSS linear() easing that ends at 1", () => {
    const motion = springMotion(0.5, 0.72, 10);
    expect(motion.easing.startsWith("linear(0, ")).toBe(true);
    expect(motion.easing.endsWith(", 1)")).toBe(true);
    expect(motion.durationMs).toBe(Math.round(springSettleSeconds(0.5, 0.72) * 1000));
    expect(MOTION.contentIn.delayMs).toBe(160);
    expect(MOTION.close).toEqual({ easing: "cubic-bezier(0.45, 0, 0.2, 1)", durationMs: 340 });
  });

  it("grows on the spring and shrinks on the ease", () => {
    expect(islandMotion(0, 1)).toBe(MOTION.open);
    expect(islandMotion(1, 2)).toBe(MOTION.open);
    expect(islandMotion(2, 2)).toBe(MOTION.open);
    expect(islandMotion(2, 1)).toBe(MOTION.close);
    expect(islandMotion(1, 0)).toBe(MOTION.close);
  });
});
