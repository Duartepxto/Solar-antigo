// The stage beside the column, for a screen that is not a panel (an image
// viewer, ...). A screen claims it while mounted: OrbitShell steps the
// focused bot or You up to the corner, renders the slot the screen portals
// into, and turns its own way back (the back link, a click on the canvas)
// into a close request the screen answers. Where the stage is not free — the
// bare map, a team, something already on it — the screen keeps its overlay.
import { useLayoutEffect, useRef, useState } from "react";

const CLAIM_EVENT = "orbit:stage-claim";
const CLOSE_EVENT = "orbit:stage-close";

function stageFree(): boolean {
  return typeof document !== "undefined" && typeof document.querySelector === "function" && Boolean(document.querySelector("[data-orbit-stage-free]"));
}

/** Claim the stage for as long as the calling screen is mounted. `onStage`
 * is decided once, when it opens; `slot` arrives a frame later. */
export function useOrbitStage(onClose: () => void): { onStage: boolean; slot: HTMLElement | null } {
  const [onStage] = useState(stageFree);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useLayoutEffect(() => {
    if (!onStage) return;
    window.dispatchEvent(new CustomEvent<number>(CLAIM_EVENT, { detail: 1 }));
    let frame = 0;
    const find = () => {
      const el = document.querySelector<HTMLElement>("[data-orbit-stage-slot]");
      if (el) setSlot(el);
      else frame = requestAnimationFrame(find);
    };
    find();
    const close = () => closeRef.current();
    window.addEventListener(CLOSE_EVENT, close);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(CLOSE_EVENT, close);
      window.dispatchEvent(new CustomEvent<number>(CLAIM_EVENT, { detail: -1 }));
    };
  }, [onStage]);
  return { onStage, slot };
}

/** OrbitShell: how many screens hold the stage. */
export function onStageClaim(handler: (delta: number) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<number>).detail);
  window.addEventListener(CLAIM_EVENT, listener);
  return () => window.removeEventListener(CLAIM_EVENT, listener);
}

/** OrbitShell's way back: ask whatever holds the stage to close. */
export function closeStage() {
  window.dispatchEvent(new Event(CLOSE_EVENT));
}
