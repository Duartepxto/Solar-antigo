import { describe, expect, it } from "vitest";
import { menuSide } from "./menu-side";

describe("menuSide", () => {
  it("opens rightward when the menu fits", () => {
    expect(menuSide({ left: 100, right: 180 }, 340, 1200)).toBe("left");
  });
  it("opens leftward from a chip near the window's right edge", () => {
    expect(menuSide({ left: 1000, right: 1080 }, 340, 1200)).toBe("right");
  });
  it("keeps the left edge when neither side fits", () => {
    expect(menuSide({ left: 20, right: 60 }, 340, 300)).toBe("left");
  });
});
