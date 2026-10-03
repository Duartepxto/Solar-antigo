import { useLayoutEffect, useState, type RefObject } from "react";

/** Which edge of its trigger a menu hangs from so it stays inside the window.
 * A chip near the right edge (the chat column's header) opens its menu
 * leftward from its own right edge rather than off the side of the window. */
export function menuSide(anchor: { left: number; right: number }, width: number, viewport: number, gap = 8): "left" | "right" {
  return anchor.left + width > viewport - gap && anchor.right - width >= gap ? "right" : "left";
}

export function useMenuSide(open: boolean, anchor: RefObject<HTMLElement | null>, width: number): "left" | "right" {
  const [side, setSide] = useState<"left" | "right">("left");
  useLayoutEffect(() => {
    if (!open || !anchor.current) return;
    setSide(menuSide(anchor.current.getBoundingClientRect(), width, window.innerWidth));
  }, [open, anchor, width]);
  return side;
}
