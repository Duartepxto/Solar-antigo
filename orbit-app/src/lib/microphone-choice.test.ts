import { describe, expect, it } from "vitest";
import { microphoneChoice } from "./microphone-choice";

const USB = { uid: "usb", name: "MMIC-SC", isDefault: false };
const JACK = { uid: "BuiltInHeadphoneInputDevice", name: "Microfone externo", isDefault: true };

describe("microphoneChoice", () => {
  it("names the macOS default and selects it when nothing is chosen", () => {
    expect(microphoneChoice([USB, JACK], null)).toEqual({ systemName: "Microfone externo", missing: false, value: "" });
  });

  it("selects a chosen device that is connected", () => {
    expect(microphoneChoice([USB, JACK], "usb")).toEqual({ systemName: "Microfone externo", missing: false, value: "usb" });
  });

  it("marks a chosen device that is unplugged", () => {
    expect(microphoneChoice([JACK], "usb")).toEqual({ systemName: "Microfone externo", missing: true, value: "usb" });
  });

  it("has no default name when macOS reports none", () => {
    expect(microphoneChoice([], null)).toEqual({ systemName: null, missing: false, value: "" });
  });
});
