import { useEffect, useRef, useState } from "react";
import { MAUS_COLORS } from "@/lib/mascot";
import { orbitShell, type OverlayMessage } from "@/lib/orbit-shell";

type Point = NonNullable<OverlayMessage["point"]>;

const FLIGHT_MS = 750;
const DWELL_MS = 3800;
// Orbit's own colour (the agent is green, like the guide character)
const ACCENT = MAUS_COLORS.green;

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

/** One display's click-through overlay: the thin glowing border while a
 * turn can see this screen, and the guide pointer. The pointer flies on a
 * curved path and turns along it, the way Clicky's cursor does
 * (github.com/farzaa/clicky, MIT: the idea, not its code). */
export function Overlay() {
  const shell = orbitShell();
  const [border, setBorder] = useState(false);
  const [label, setLabel] = useState<{ text: string; x: number; y: number; flip: boolean } | null>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const queue = useRef<Point[]>([]);
  const busy = useRef(false);
  const borderRef = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const idleIfDone = () => {
      if (!busy.current && !queue.current.length && !borderRef.current) void shell?.overlayIdle();
    };

    const fly = (point: Point) => {
      busy.current = true;
      const el = pointerRef.current;
      const ring = ringRef.current;
      if (!el || !ring) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const end = { x: point.x, y: point.y };
      const start = last.current ?? point.from ?? { x: Math.min(w - 40, end.x + 220), y: Math.min(h - 40, end.y + 160) };
      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      // The control point lifts the path into an arc, above the straight line.
      const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const control = { x: mid.x, y: mid.y - Math.min(220, distance * 0.35) };
      setLabel(null);
      el.style.opacity = "1";
      ring.style.opacity = "0";
      const began = performance.now();
      const frame = (now: number) => {
        const raw = Math.min(1, (now - began) / FLIGHT_MS);
        const s = ease(raw);
        const x = (1 - s) ** 2 * start.x + 2 * (1 - s) * s * control.x + s ** 2 * end.x;
        const y = (1 - s) ** 2 * start.y + 2 * (1 - s) * s * control.y + s ** 2 * end.y;
        const dx = 2 * (1 - s) * (control.x - start.x) + 2 * s * (end.x - control.x);
        const dy = 2 * (1 - s) * (control.y - start.y) + 2 * s * (end.y - control.y);
        // The arrow points along its path, settling to its resting tilt.
        const heading = distance > 4 ? Math.atan2(dy, dx) * (180 / Math.PI) + 90 : 0;
        const angle = heading * (1 - raw) + -12 * raw;
        const scale = 1 + Math.sin(raw * Math.PI) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`;
        if (raw < 1) {
          requestAnimationFrame(frame);
          return;
        }
        last.current = end;
        ring.style.transform = `translate(${end.x}px, ${end.y}px)`;
        ring.style.opacity = "1";
        ring.animate([{ transform: `translate(${end.x}px, ${end.y}px) scale(0.4)`, opacity: 1 }, { transform: `translate(${end.x}px, ${end.y}px) scale(1.6)`, opacity: 0 }], { duration: 900, iterations: 2 });
        if (point.label) setLabel({ text: point.label, x: end.x, y: end.y, flip: end.x > w - 260 });
        setTimeout(() => {
          const next = queue.current.shift();
          if (next) {
            fly(next);
            return;
          }
          el.style.opacity = "0";
          setLabel(null);
          busy.current = false;
          last.current = null;
          idleIfDone();
        }, DWELL_MS);
      };
      requestAnimationFrame(frame);
    };

    return shell?.onOverlay((message) => {
      if (typeof message.border === "boolean") {
        borderRef.current = message.border;
        setBorder(message.border);
        if (!message.border) idleIfDone();
      }
      if (message.point) {
        if (busy.current) queue.current.push(message.point);
        else fly(message.point);
      }
    });
  }, [shell]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: border ? 1 : 0,
          boxShadow: `inset 0 0 0 2px ${ACCENT}e6, inset 0 0 22px 2px ${ACCENT}73`,
          animation: border ? "orbit-border-breathe 2.4s ease-in-out infinite" : undefined,
        }}
      />
      <div ref={ringRef} className="absolute left-0 top-0 opacity-0" style={{ width: 0, height: 0 }}>
        <div className="-translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: 44, height: 44, border: `2px solid ${ACCENT}` }} />
      </div>
      <div ref={pointerRef} className="absolute left-0 top-0 opacity-0 transition-opacity duration-200" style={{ transformOrigin: "0 0", willChange: "transform" }}>
        <svg width="26" height="30" viewBox="0 0 26 30" style={{ filter: `drop-shadow(0 0 6px ${ACCENT}) drop-shadow(0 2px 3px rgba(0,0,0,.45))` }}>
          <path d="M1 1 L24 17 L13.5 18.5 L8 28 Z" fill={ACCENT} stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
      {label && (
        <div
          className="absolute whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,.35)] animate-pop-in"
          style={{
            left: label.flip ? undefined : label.x + 26,
            right: label.flip ? window.innerWidth - label.x + 12 : undefined,
            top: label.y + 18,
            background: ACCENT,
          }}
        >
          {label.text}
        </div>
      )}
    </div>
  );
}
