// Talk mode's island sizes, derived from the display's notch (Coucou's
// `islandSize`, IslandWindowController.swift): hidden is the notch, compact
// is the notch plus two ears, and the heard words or a notice open it 640
// wide, as tall as they read. Pure, so the page and its tests share it.

export interface NotchSize { width: number; height: number }

export const ISLAND = Object.freeze({
  /** Orbit's ears: the face on the left, the sound (or the thinking dot)
   * on the right, each 44 pt, which keeps the compact island as thin as the
   * owner tuned it. */
  ear: 44,
  /** IslandConst.expandedWidth */
  expandedWidth: 640,
  /** IslandConst.notchWidth: a display without a notch gets one this wide */
  virtualNotchWidth: 184,
  /** IslandConst.roundedCorner (hidden/compact) and expandedCorner */
  compactCorner: 14,
  expandedCorner: 22,
  /** pollFrame: islandRect.insetBy(dx: -6, dy: -6) */
  hitInset: 6,
});

/** A display without a notch: 184 wide, as tall as its menu bar. */
export function virtualNotch(menuBar: number): NotchSize {
  return { width: ISLAND.virtualNotchWidth, height: menuBar >= 20 ? menuBar : 32 };
}

export type IslandLook =
  | { kind: "hidden" }
  | { kind: "compact" }
  /** talk's heard words or a notice: as tall as what it shows */
  | { kind: "talk"; contentHeight: number };

export function lookLevel(look: IslandLook): number {
  return look.kind === "hidden" ? 0 : look.kind === "compact" ? 1 : 2;
}

export function islandSize(look: IslandLook, notch: NotchSize): NotchSize {
  switch (look.kind) {
    case "hidden":
      return { width: notch.width, height: notch.height };
    case "compact":
      return { width: notch.width + 2 * ISLAND.ear, height: notch.height };
    case "talk":
      return { width: ISLAND.expandedWidth, height: notch.height + Math.max(0, Math.ceil(look.contentHeight)) };
  }
}

export function islandRadius(look: IslandLook, notch: NotchSize): number {
  return lookLevel(look) === 2 ? ISLAND.expandedCorner : Math.min(ISLAND.compactCorner, notch.height / 2);
}

/** Is a point (window coordinates) over the island? Coucou tests the rect
 * of the size the island is going to, grown by 6 pt on every side, so the
 * pointer doesn't flicker it at its edge while it animates. */
export function overIsland(point: { x: number; y: number }, size: NotchSize, windowWidth: number): boolean {
  const left = (windowWidth - size.width) / 2 - ISLAND.hitInset;
  const right = left + size.width + 2 * ISLAND.hitInset;
  return point.x >= left && point.x <= right && point.y >= -ISLAND.hitInset && point.y <= size.height + ISLAND.hitInset;
}
