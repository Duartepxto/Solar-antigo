import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

describe("KeyboardShortcutsModal", () => {
  it("uses a labeled native dialog with search and dismiss controls", () => {
    const html = renderToStaticMarkup(createElement(KeyboardShortcutsModal, { open: true, onClose: vi.fn() }));
    expect(html).toContain('<dialog aria-labelledby="shortcuts-dialog-title"');
    expect(html).toContain('aria-label="Search shortcuts"');
    expect(html).toContain('aria-label="Close keyboard shortcuts"');
    // design: the title row carries the one dismiss control (and Esc)
    expect(html).toContain("Keyboard shortcuts");
    expect(html).not.toContain("Double-click");
    expect(html).not.toContain("from anywhere");
  });

  it("does not render when closed", () => {
    expect(renderToStaticMarkup(createElement(KeyboardShortcutsModal, { open: false, onClose: vi.fn() }))).toBe("");
  });
});
