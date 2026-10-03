// Settings → General, macOS desktop only: which microphone Orbit's voice
// input records from (dictation, calls, talking to Orbit), instead of
// whatever macOS uses as its input, with the chosen microphone's live level
// under it while this row is on screen. The choice belongs to this
// computer's app (electron/speech-input-prefs.mjs), not the server.
import { useCallback, useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { microphoneChoice, type MicrophoneInput } from "@/lib/microphone-choice";
import { SettingRow } from "./SettingsPrimitives";

export function MicrophoneRow() {
  const bridge = typeof window === "undefined" ? undefined : window.ogb?.speechInput;
  const [inputs, setInputs] = useState<MicrophoneInput[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [noAccess, setNoAccess] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!bridge) return;
    void bridge.list().then(
      (next) => {
        setInputs(next.inputs);
        setSelected(next.selected);
      },
      () => setInputs((current) => current ?? []),
    );
  }, [bridge]);

  // The list again whenever a microphone is plugged in or out, or Orbit
  // comes back to the front.
  useEffect(() => {
    if (!bridge) return;
    refresh();
    const media = navigator.mediaDevices;
    media?.addEventListener?.("devicechange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      media?.removeEventListener?.("devicechange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [bridge, refresh]);

  // The level of the chosen microphone, restarted when the choice changes.
  const ready = inputs !== null;
  useEffect(() => {
    if (!bridge || !ready) return;
    let live = true;
    setLevel(null);
    setNoAccess(false);
    const off = bridge.onMeter((info) => {
      if (!live) return;
      if ("level" in info) setLevel(info.level);
      else {
        setLevel(null);
        if (info.reason === "mic-denied") setNoAccess(true);
      }
    });
    void bridge.meterStart().then((result) => {
      if (live && !result.ok && result.reason === "mic-not-allowed") setNoAccess(true);
    }, () => {});
    return () => {
      live = false;
      off();
      void bridge.meterStop().catch(() => {});
    };
  }, [bridge, ready, selected]);

  if (!bridge || inputs === null || (inputs.length === 0 && selected === null)) return null;
  const choice = microphoneChoice(inputs, selected);

  const choose = (value: string) => {
    setError("");
    void bridge.set(value || null).then(setSelected, () => setError(t("settings.microphone.saveFailed")));
  };

  const message = error
    ? <p role="alert" className="text-[#ff8a96]">{error}</p>
    : choice.missing
      ? <p className="text-ink/55">{t("settings.microphone.missingHint")}</p>
      : noAccess
        ? <p className="text-ink/55">{t("settings.microphone.noAccess")}</p>
        : null;

  return (
    <SettingRow title={t("settings.microphone.title")} subtitle={t("settings.microphone.subtitle")} message={message}>
      <select
        value={choice.value}
        aria-label={t("settings.microphone.aria")}
        onChange={(event) => choose(event.target.value)}
        className="min-h-8 w-full max-w-[240px] rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2.5 py-1.5 text-[13px] text-ink focus:border-focus"
      >
        <option value="">
          {choice.systemName ? t("settings.microphone.system", { name: choice.systemName }) : t("settings.microphone.systemUnknown")}
        </option>
        {inputs.map((input) => (
          <option key={input.uid} value={input.uid}>{input.name}</option>
        ))}
        {choice.missing && <option value={choice.value}>{t("settings.microphone.missing")}</option>}
      </select>
      {level !== null && (
        <div
          role="meter"
          aria-label={t("settings.microphone.level")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level * 100)}
          className="mt-2 h-1 w-full max-w-[240px] overflow-hidden rounded-full bg-ink/[0.08]"
        >
          <div
            className="h-full rounded-full bg-ink/60 transition-[width] duration-100 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.round(level * 100)}%` }}
          />
        </div>
      )}
    </SettingRow>
  );
}
