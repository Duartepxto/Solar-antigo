// Beat 1: who you are (design: WF 'hello'). The name goes to the workspace
// profile (the You hub reads it back). Optional: Continue with an empty
// field, or "Skip for now", moves on without saving. The email the profile
// already holds is kept.
//
// A hosted team workspace asks for nothing: its profile is shared by
// everyone who signs in there. It only says what the workspace is.
import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { api, useStore } from "@/state/store";
import { inputClass, PrimaryButton, QuietButton, staggerIndex, type BeatProps } from "./shared";

export function HelloBeat({ onNext, onSkip, hosted = false }: BeatProps & { hosted?: boolean }) {
  const { state, dispatch } = useStore();
  const [name, setName] = useState(state.config?.profile?.name ?? '');
  const pending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const saveProfile = async () => {
    if (pending.current) return;
    const trimmed = name.trim();
    if (!trimmed) { onNext(); return; }
    pending.current = true;
    setSaving(true);
    setFailed(false);
    // persisted server-side (~/.orbit/config.json); the response is
    // the fresh config status, folded straight into the store
    try {
      const config = await api("/api/config", {
        method: "PUT",
        body: JSON.stringify({ profile: { name: trimmed, email: state.config?.profile?.email ?? "" } }),
        signal: AbortSignal.timeout(10_000),
      });
      dispatch({ type: "configStatus", config });
      onNext();
    } catch {
      setFailed(true);
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };

  if (hosted) {
    return (
      <div className="stagger flex flex-col items-center">
        <p className="animate-rise mt-1.5 text-center text-[14px] leading-relaxed text-ink/55" style={staggerIndex(0)}>
          {t("onboarding.hosted.intro")}
        </p>
        <PrimaryButton onClick={onNext} className="animate-rise mt-5" style={staggerIndex(1)}>
          {t("onboarding.continue")}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="stagger flex flex-col items-center">
      <p className="animate-rise mt-3 text-center text-[14px] leading-[1.6] text-ink/55" style={staggerIndex(0)}>
        {t(import.meta.env.VITE_JARVIS_SOLAR === 'true'?'jarvis.welcome.v3.intro':'onboarding.intro')}
      </p>
      <label className="animate-rise mt-3.5 flex w-full flex-col gap-1.5 text-[12px] leading-normal text-ink/60" style={staggerIndex(1)}>
        {t("onboarding.name")}
        <input
          autoFocus
          type="text"
          aria-label={t('onboarding.name')}
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && void saveProfile()}
          className={inputClass}
        />
      </label>
      {import.meta.env.VITE_JARVIS_SOLAR === "true" && <p className="solar-welcome-helper">{t("jarvis.welcome.v3.nameHint")}</p>}
      {failed && <p role="alert" className="mt-3 text-[13px] text-[#ff8a96]">{t("onboarding.profile.error")}</p>}
      <PrimaryButton onClick={() => void saveProfile()} disabled={saving} className="animate-rise mt-3" style={staggerIndex(2)}>
        {t("onboarding.continue")}
      </PrimaryButton>
      <QuietButton
        onClick={() => {
          onSkip();
        }}
        className="animate-rise mt-3.5"
        style={staggerIndex(3)}
      >
        {t("onboarding.skip")}
      </QuietButton>
    </div>
  );
}
