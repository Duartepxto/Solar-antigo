// A dialog in Orbit opens in the right column, not over the canvas: new team,
// new channel, archived bots, about, members, a folder, a skill review. While
// a column is on screen (any view but the bare map) OrbitShell keeps a slot
// over it; the dialog's content takes the column until it closes, and the
// canvas stays where it was. On the bare map, with no column, it keeps its
// overlay.
import { useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

function columnLayerSlot(): HTMLElement | null {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") return null;
  // a sheet over the whole window (OrbitSheet's overlay) covers the column:
  // a dialog opened from it stays over it rather than behind
  if (document.querySelector("[data-orbit-sheet]")) return null;
  return document.querySelector<HTMLElement>("[data-orbit-column-layer]");
}

export function ColumnLayer({ onClose, backdrop, children, locked = false, overlay = false }: {
  onClose: () => void;
  /** the overlay's classes, used on the bare map */
  backdrop: string;
  children: ReactNode;
  /** a save or import in flight: a click outside does not close */
  locked?: boolean;
  /** opened from a screen that covers the column (a sheet): stay over it */
  overlay?: boolean;
}) {
  const [slot, setSlot] = useState<HTMLElement | null>(() => overlay ? null : columnLayerSlot());
  useLayoutEffect(() => { if (!slot && !overlay) setSlot(columnLayerSlot()); }, [slot, overlay]);
  if (slot) return createPortal(<div className="orbit-column-layer absolute inset-0 flex flex-col overflow-y-auto bg-[var(--color-app)] animate-panel-in">{children}</div>, slot);
  // rendered without a document (static markup): the content, as it would read
  if (typeof document === "undefined") return <div className={backdrop}>{children}</div>;
  return createPortal(
    <div className={backdrop} onMouseDown={(event) => event.target === event.currentTarget && !locked && onClose()}>{children}</div>,
    document.body,
  );
}
