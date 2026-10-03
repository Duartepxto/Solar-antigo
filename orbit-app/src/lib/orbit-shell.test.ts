import { describe, expect, it } from "vitest";
import { acceleratorFromKeyEvent, acceleratorLabel, shellHasVoice, shellPlatform } from "./orbit-shell";

const key = (code: string, mods: Partial<Record<"ctrlKey" | "altKey" | "shiftKey" | "metaKey", boolean>> = {}, value = "") => ({
  key: value, code, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, ...mods,
});

describe("acceleratorFromKeyEvent", () => {
  it("spells the default shortcuts", () => {
    expect(acceleratorFromKeyEvent(key("Space", { ctrlKey: true, altKey: true }, " "))).toBe("Control+Alt+Space");
    expect(acceleratorFromKeyEvent(key("Space", { ctrlKey: true, altKey: true, shiftKey: true }))).toBe("Control+Alt+Shift+Space");
  });

  it("reads the physical key, not the symbol Option types", () => {
    expect(acceleratorFromKeyEvent(key("KeyS", { altKey: true }, "ß"))).toBe("Alt+S");
    expect(acceleratorFromKeyEvent(key("Digit2", { metaKey: true, shiftKey: true }, "@"))).toBe("Shift+Command+2");
    expect(acceleratorFromKeyEvent(key("Slash", { ctrlKey: true }))).toBe("Control+/");
    expect(acceleratorFromKeyEvent(key("F5", { ctrlKey: true }))).toBe("Control+F5");
  });

  it("waits for a key and refuses a shortcut without Control, Option or Command", () => {
    expect(acceleratorFromKeyEvent(key("ControlLeft", { ctrlKey: true }))).toBeNull();
    expect(acceleratorFromKeyEvent(key("KeyA", { shiftKey: true }))).toBeNull();
    expect(acceleratorFromKeyEvent(key("KeyA"))).toBeNull();
  });
});

describe("acceleratorLabel", () => {
  it("shows shortcuts the way macOS menus do", () => {
    expect(acceleratorLabel("Control+Alt+Space")).toBe("⌃⌥ Space");
    expect(acceleratorLabel("Control+Alt+Shift+Space")).toBe("⌃⌥⇧ Space");
    expect(acceleratorLabel("Shift+Command+K")).toBe("⇧⌘K");
    expect(acceleratorLabel("")).toBe("");
  });
});

describe("on Windows", () => {
  it("labels shortcuts the way Windows menus do", () => {
    expect(acceleratorLabel("Alt+O", "win32")).toBe("Alt+O");
    expect(acceleratorLabel("Control+Alt+Space", "win32")).toBe("Ctrl+Alt+Space");
    expect(acceleratorLabel("Control+Shift+Return", "win32")).toBe("Ctrl+Shift+Enter");
    expect(acceleratorLabel("", "win32")).toBe("");
    expect(acceleratorLabel("Alt+O", "darwin")).toBe("⌥O");
  });

  it("refuses the Windows key, which Windows keeps for itself", () => {
    expect(acceleratorFromKeyEvent(key("KeyO", { altKey: true }), "win32")).toBe("Alt+O");
    expect(acceleratorFromKeyEvent(key("KeyK", { ctrlKey: true, shiftKey: true }), "win32")).toBe("Control+Shift+K");
    expect(acceleratorFromKeyEvent(key("KeyK", { metaKey: true }), "win32")).toBeNull();
    expect(acceleratorFromKeyEvent(key("KeyK", { metaKey: true }), "darwin")).toBe("Command+K");
  });

  it("has no voice for talk mode yet", () => {
    expect(shellHasVoice("win32")).toBe(false);
    expect(shellHasVoice("darwin")).toBe(true);
  });

  it("defaults to macOS outside the desktop app", () => {
    expect(shellPlatform()).toBe("darwin");
  });
});
