import { cn } from "@/lib/cn";
import type { ApprovalMode } from "../../shared/approval-mode";

/** The ring glyph per approval level, the same shape as the ring the map
 * draws around a focused bot. */
export function ApprovalGlyph({ level }: { level: ApprovalMode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2.5 shrink-0 rounded-full border-[1.5px] border-ink/60",
        level === "edits" && "border-t-transparent",
        level === "auto" && "border-dashed",
        level === "full" && "border-[#b296ff] bg-[#b296ff]/40 shadow-[0_0_8px_rgba(178,150,255,.7)]",
      )}
    />
  );
}

