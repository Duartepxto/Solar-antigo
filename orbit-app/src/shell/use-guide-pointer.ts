import { useMemo, useRef } from "react";
import { mapPointToDisplay, PointStream } from "@/lib/orbit-point";
import { orbitShell, type ShellCapture } from "@/lib/orbit-shell";

/** Turns [POINT] tags in a streamed reply into pointer flights on the
 * display the screenshot came from. Only the one screenshot a turn sends is
 * addressable, so `:screenN` other than 1 is ignored. */
export function useGuidePointer() {
  const captureRef = useRef<ShellCapture | null>(null);
  const streamRef = useRef(new PointStream());
  return useMemo(() => ({
    setCapture(capture: ShellCapture | null) {
      captureRef.current = capture;
      streamRef.current.reset();
    },
    reset() {
      captureRef.current = null;
      streamRef.current.reset();
    },
    follow(text: string) {
      const capture = captureRef.current;
      if (!capture) return;
      for (const point of streamRef.current.take(text)) {
        if (point.screen !== undefined && point.screen !== 1) continue;
        const target = mapPointToDisplay(point, capture);
        if (target) void orbitShell()?.point({ ...target, label: point.label });
      }
    },
  }), []);
}
