// Shared field styling and a labeled-field wrapper for the bot settings
// dialog's sections — moved out of SettingsPanel so section files can be
// verbatim moves. Plain .ts (no JSX) so createElement is used directly;
// SoulField.tsx imports inputCls from here rather than keeping its own copy.
import { createElement, type ReactNode } from "react";

export const inputCls =
  "w-full rounded-lg border border-ink/[0.1] bg-ink/[0.03] px-3 py-2.5 text-[15px] text-ink placeholder:text-ink/55 focus:outline-none focus:border-ink/[0.1]";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return createElement(
    "label",
    { className: "block" },
    createElement("div", { className: "mb-1.5 text-[13px] text-ink/55" }, label),
    children,
  );
}
