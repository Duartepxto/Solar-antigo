import { describe, expect, it } from "vitest";
import { mapPointToDisplay, parsePointTags, PointStream, speakableText, stripPointTags } from "./orbit-point";

describe("parsePointTags", () => {
  it("reads x, y and the label", () => {
    expect(parsePointTags("Click Save [POINT:812,440:Save button] then close.")).toEqual([
      { x: 812, y: 440, label: "Save button" },
    ]);
  });

  it("splits a trailing screen index off the label", () => {
    expect(parsePointTags("[POINT:10,20:Wi-Fi menu:screen2]")).toEqual([
      { x: 10, y: 20, label: "Wi-Fi menu", screen: 2 },
    ]);
  });

  it("keeps colons that belong to the label", () => {
    expect(parsePointTags("[POINT:5,6:File: Save As]")).toEqual([{ x: 5, y: 6, label: "File: Save As" }]);
  });

  it("accepts a tag without a label, spaces and decimals", () => {
    expect(parsePointTags("[POINT: 12.5 , 30 ]")).toEqual([{ x: 12.5, y: 30, label: "" }]);
    expect(parsePointTags("[point:1,2:a]")).toEqual([{ x: 1, y: 2, label: "a" }]);
  });

  it("returns several tags in order and ignores none and malformed tags", () => {
    expect(parsePointTags("[POINT:none] [POINT:1,2:a] [POINT:x,y:b] [POINT:3,4:c:screen1]")).toEqual([
      { x: 1, y: 2, label: "a" },
      { x: 3, y: 4, label: "c", screen: 1 },
    ]);
  });
});

describe("stripPointTags", () => {
  it("removes tags and tidies the gap they leave", () => {
    expect(stripPointTags("Open Settings [POINT:1,2:gear] and pick Wi-Fi [POINT:none].")).toBe("Open Settings and pick Wi-Fi.");
  });

  it("hides a tag that is still streaming", () => {
    expect(stripPointTags("Click here [POINT:81")).toBe("Click here");
    expect(stripPointTags("Click here [PO")).toBe("Click here");
  });
});

describe("speakableText", () => {
  it("drops tags and markdown marks", () => {
    expect(speakableText("**Click** `Save` [POINT:1,2:Save]\n- then [Help](https://x.y)")).toBe("Click Save then Help");
  });
});

describe("mapPointToDisplay", () => {
  const retina = { width: 3024, height: 1964, scaleFactor: 2, bounds: { x: 0, y: 0, width: 1512, height: 982 } };

  it("divides by the scale factor", () => {
    expect(mapPointToDisplay({ x: 1512, y: 982 }, retina)).toEqual({ x: 756, y: 491 });
  });

  it("adds the display origin for a second display", () => {
    const right = { width: 2560, height: 1440, scaleFactor: 1, bounds: { x: 1512, y: -200, width: 2560, height: 1440 } };
    expect(mapPointToDisplay({ x: 100, y: 50 }, right)).toEqual({ x: 1612, y: -150 });
  });

  it("handles a downscaled screenshot's fractional factor", () => {
    const fitted = { width: 2400, height: 1559, scaleFactor: 2400 / 1512, bounds: { x: 0, y: 0, width: 1512, height: 982 } };
    expect(mapPointToDisplay({ x: 1200, y: 779.5 }, fitted)).toEqual({ x: 756, y: 491 });
  });

  it("keeps the far edge on the display", () => {
    expect(mapPointToDisplay({ x: 3024, y: 1964 }, retina)).toEqual({ x: 1511, y: 981 });
  });

  it("refuses points outside the screenshot or a bad geometry", () => {
    expect(mapPointToDisplay({ x: -1, y: 5 }, retina)).toBeNull();
    expect(mapPointToDisplay({ x: 5, y: 5000 }, retina)).toBeNull();
    expect(mapPointToDisplay({ x: 5, y: 5 }, { ...retina, scaleFactor: 0 })).toBeNull();
  });
});

describe("PointStream", () => {
  it("announces each completed tag once as the reply grows", () => {
    const stream = new PointStream();
    expect(stream.take("Look [POINT:1,")).toEqual([]);
    expect(stream.take("Look [POINT:1,2:a] and")).toEqual([{ x: 1, y: 2, label: "a" }]);
    expect(stream.take("Look [POINT:1,2:a] and [POINT:3,4:b]")).toEqual([{ x: 3, y: 4, label: "b" }]);
    expect(stream.take("Look [POINT:1,2:a] and [POINT:3,4:b]")).toEqual([]);
  });
});
