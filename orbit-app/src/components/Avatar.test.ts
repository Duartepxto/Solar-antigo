import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  BotAvatar,
  MausAvatar,
  type BotAvatarProps,
  type MausAvatarProps,
} from "./Avatar";
import { MASCOT_BODIES } from "../../shared/mascot-bodies";

const render = (props: Partial<MausAvatarProps>) =>
  renderToStaticMarkup(createElement(MausAvatar, { color: "green", animated: false, ...props }));

const renderBot = (bot: Partial<BotAvatarProps["bot"]>) =>
  renderToStaticMarkup(
    createElement(BotAvatar, { bot: { color: "green", ...bot }, animated: false }),
  );

describe("MausAvatar body", () => {
  it("wears the cursor when no body is given", () => {
    expect(render({})).toContain(MASCOT_BODIES.cursor.fit);
  });

  it("wears the body it is given", () => {
    const markup = render({ bodyId: "star" });
    expect(markup).toContain(MASCOT_BODIES.star.fit);
  });

  it("falls back to the cursor for an unknown body", () => {
    // SAFETY: "hexagram" is deliberately not a valid MascotBodyId — this
    // exercises the runtime schema fallback for a value that could arrive
    // from persisted/streamed data, which the type system would otherwise
    // rule out at this call site.
    expect(render({ bodyId: "hexagram" as MausAvatarProps["bodyId"] })).toContain(
      MASCOT_BODIES.cursor.fit,
    );
  });

  it("paints the body with the per-bot gradient, never a flat black fill", () => {
    const markup = render({ bodyId: "circle" });
    expect(markup).not.toContain('fill="#000000"');
    expect(markup).not.toContain("{{GRADIENT}}");
    expect(markup).toContain("url(#");
  });
});

describe("BotAvatar", () => {
  it("draws the bot's mascot in its colour", () => {
    const markup = renderBot({ name: "Ada" });
    expect(markup).toContain("<svg");
    expect(markup).not.toContain("<img");
  });
});
