import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MessageActions } from "./MessageActions";

type Props = Parameters<typeof MessageActions>[0];

const render = (props: Partial<Omit<Props, "children">> = {}) =>
  renderToStaticMarkup(
    createElement(MessageActions, {
      side: "bot",
      ...props,
      children: [
        createElement("button", { type: "button", key: "copy" }, "copy"),
        createElement("button", { type: "button", key: "reply" }, "reply"),
      ],
    }),
  );

describe("MessageActions", () => {
  it("shows one collapsed handle with the controls tucked into a zero-width tray", () => {
    const html = render();
    expect(html).toContain('aria-label="Message actions"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("invisible opacity-0");
    expect(html).toContain("group-hover/actions:visible");
    expect(html).toContain(">copy<");
    expect(html).toContain(">reply<");
    expect(html).not.toContain('data-open="true"');
  });

  it("stays open while a control must remain reachable", () => {
    const html = render({ forceOpen: true });
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('data-open="true"');
    expect(html).toContain("visible opacity-100");
    expect(html).not.toContain("grid-cols-[0fr]");
  });

  it("opens the tray above the handle, over the bubble, so a long message cannot clip it", () => {
    const user = render({ side: "user" });
    const bot = render({ side: "bot" });
    expect(user).toContain("absolute bottom-full");
    // the user's handle sits left of the bubble: the tray reaches right, over it
    expect(user).toContain("left-0");
    expect(bot).toContain("right-0");
  });
});
