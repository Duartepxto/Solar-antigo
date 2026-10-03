// Settings' microphone picker, the pure part: what its "Same as macOS"
// option names, and whether the saved choice is a device that isn't there
// (unplugged), which dictation then replaces with the macOS default.

export interface MicrophoneInput {
  uid: string;
  name: string;
  isDefault: boolean;
}

export interface MicrophoneChoice {
  /** The macOS default input's name, for "Same as macOS (…)"; null if unknown. */
  systemName: string | null;
  /** The saved device is not among the inputs. */
  missing: boolean;
  /** The select's value: "" stands for "same as macOS". */
  value: string;
}

export function microphoneChoice(inputs: readonly MicrophoneInput[], selected: string | null): MicrophoneChoice {
  return {
    systemName: inputs.find((input) => input.isDefault)?.name ?? null,
    missing: selected !== null && !inputs.some((input) => input.uid === selected),
    value: selected ?? "",
  };
}
