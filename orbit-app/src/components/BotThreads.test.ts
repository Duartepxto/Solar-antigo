import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { StoreProvider, type Group } from "@/state/store";
import { GroupTaskPicker } from "./TaskPicker";

vi.mock("./DesktopCapabilities", () => ({ useDesktopCapabilities: () => ({}) }));

describe("channel threads", () => {
  it("exposes a channel's history through the All threads picker", () => {
    const group: Group = { id: "team", threadId: "group-current", name: "Launch team", memberIds: [], defaultResponder: { kind: "everyone" }, bulletin: "", unread: false, createdAt: 1, messages: [],
      tasks: [{ threadId: "group-current", title: "Launch plan", createdAt: 3 }, { threadId: "group-old", title: "Previous review", createdAt: 2 }] };
    const picker = renderToStaticMarkup(createElement(StoreProvider, null, createElement(GroupTaskPicker, { group })));
    expect(picker).toContain('aria-label="All threads"');
    expect(picker).not.toContain("Tasks");
  });
});
