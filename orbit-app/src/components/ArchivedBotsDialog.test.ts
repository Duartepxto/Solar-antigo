import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { Bot } from "@/state/store";
import { botConfirmCopy, currentArchivableBot } from "./ArchivedBotsDialog";
import { ConfirmDialogCard } from "./ConfirmDialog";

const bot = (overrides: Partial<Bot> = {}): Bot => ({
  id: "atlas",
  threadId: "thread-atlas",
  name: "Atlas",
  title: "",
  description: "",
  notifications: true,
  color: "green",
  unread: false,
  modelSelection: { instanceId: "claude", model: "test" },
  messages: [],
  ...overrides,
});

describe("archive / delete confirmation", () => {
  it("rechecks the latest fleet after a confirmation was opened", () => {
    const snapshot = bot();
    const other = bot({ id: "other" });
    const renamed = bot({ name: "New name" });
    expect(currentArchivableBot([renamed, other], snapshot.id)).toBe(renamed);
    expect(currentArchivableBot([bot({ chiefOfStaff: true }), other], snapshot.id)).toBeUndefined();
    expect(currentArchivableBot([bot({ hidden: true }), other], snapshot.id)).toBeUndefined();
    expect(currentArchivableBot([snapshot], snapshot.id)).toBeUndefined();
    expect(currentArchivableBot([other, bot({ id: "third" })], snapshot.id)).toBeUndefined();
  });
  it("archive copy names the bot and says it can be restored", () => {
    const copy = botConfirmCopy("archive", "Juniper");

    expect(copy.title).toContain("Juniper");
    expect(copy.body).toMatch(/restore/i);
    expect(copy.tone).toBe("neutral");
  });

  it("delete copy names the bot and warns about its owned computer", () => {
    const copy = botConfirmCopy("delete", "Willow");

    expect(copy.title).toContain("Willow");
    expect(copy.body).toMatch(/permanently/i);
    expect(copy.body).toMatch(/any computer it owns/i);
    expect(copy.body).toMatch(/files and browser sign-ins/i);
    expect(copy.body).toMatch(/shared team computers remain/i);
    expect(copy.tone).toBe("danger");
  });

  it("renders as an alert dialog with Cancel and the action button", () => {
    const markup = renderToStaticMarkup(createElement(ConfirmDialogCard, {
      open: true,
      ...botConfirmCopy("delete", "Willow"),
      onCancel: vi.fn(),
      onConfirm: vi.fn(),
    }));

    expect(markup).toContain('role="alertdialog"');
    expect(markup).toContain("Delete Willow?");
    expect(markup).toContain(">Cancel</button>");
    expect(markup).toContain(">Delete</button>");
    expect(markup).toContain("bg-[#ff5667]");
  });
});
