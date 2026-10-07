// The exit beat edits a seeded agent or creates the first real one. Finish
// waits for the saved record; a failed write keeps the draft available to retry.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { MAUS_COLOR_NAMES, MAUS_COLORS, type MausColor } from "@/lib/mascot";
import { SolarIdentity } from "@/orbit/SolarIdentity";
import { SolarPlanet } from "@/orbit/SolarPlanet";
import { useStore, type Bot } from "@/state/store";
import { saveWelcomeBot } from '@/lib/welcome-bot';
import { inputClass, PrimaryButton, staggerIndex, type BeatProps } from "./shared";

const SOUL_LINE_LIMIT = 200;
const SOLAR = import.meta.env.VITE_JARVIS_SOLAR === "true";

export function MeetYourBotBeat({
  bot,
  onFinish,
  setMascot,
  bump,
}: Pick<BeatProps, "setMascot" | "bump"> & {
  bot: Bot | null;
  onFinish: () => void;
}) {
  const [name, setName] = useState(bot?.name ?? "");
  const [color, setColor] = useState<MausColor>(bot?.color ?? "green");
  const [line, setLine] = useState("");
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const savingRef = useRef(false);
  const { dispatch } = useStore();

  useEffect(() => {
    setMascot("celebrate");
    bump("celebrate");
    const settle = setTimeout(() => setMascot("happy"), 1600);
    return () => clearTimeout(settle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setFailed(false);
    try {
      const saved = await saveWelcomeBot(bot, name, color, line);
      dispatch({ type: 'botAdded', bot: saved, preserveSelection: true });
      onFinish();
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  return (
    <div className="stagger flex flex-col">
      <p className="animate-rise mt-3 text-pretty text-[14px] leading-[1.6] text-ink/80" style={staggerIndex(0)}>
        {t("onboarding.bot.intro")}
      </p>

      <div className="animate-rise mt-3" style={staggerIndex(1)}>
        <div className="min-w-0">
          <label className="block text-[12px] leading-normal text-ink/60" htmlFor="welcome-bot-name">
            {t("onboarding.bot.name")}
          </label>
          <input
            id="welcome-bot-name"
            autoFocus
            type="text"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void save()}
            placeholder={bot?.name}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      {SOLAR ? (
        // Solar draws agents as planets, not coloured mascots: show the body
        // this agent has (or a planet, for one not created yet).
        <div className="animate-rise mt-3 flex items-center gap-3" style={staggerIndex(2)}>
          <span className="flex size-[44px] shrink-0 items-center justify-center">
            {bot ? <SolarIdentity id={bot.id} size={44} /> : <SolarPlanet kind="planet" skin="earth" />}
          </span>
          <span className="text-[12px] leading-normal text-ink/60">{t("jarvis.welcome.bot.planet")}</span>
        </div>
      ) : (
      <div className="animate-rise mt-3" style={staggerIndex(2)}>
        <div className="text-[12px] leading-normal text-ink/60">{t("onboarding.bot.color")}</div>
        <div role="radiogroup" aria-label={t("onboarding.bot.color")} className="mt-1.5 flex flex-wrap gap-2">
          {MAUS_COLOR_NAMES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c === color}
              aria-label={t("onboarding.bot.colorAria", { color: c })}
              onClick={() => {
                setColor(c);
                bump("customize");
              }}
              className={cn(
                "size-[26px] rounded-full border-2 transition-transform duration-150 hover:scale-110 active:scale-95",
                c === color ? "border-ink" : "border-transparent",
              )}
              style={{ backgroundColor: MAUS_COLORS[c] }}
            />
          ))}
        </div>
      </div>
      )}

      <div className="animate-rise mt-3" style={staggerIndex(3)}>
        <label className="block text-[12px] leading-normal text-ink/60" htmlFor="welcome-bot-soul">
          {t("onboarding.bot.soul")}
        </label>
        <input
          id="welcome-bot-soul"
          type="text"
          value={line}
          maxLength={SOUL_LINE_LIMIT}
          onChange={(e) => setLine(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void save()}
          placeholder={t("onboarding.bot.soulPlaceholder")}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      {failed && (
        <div className="animate-rise mt-3 flex items-center gap-2.5 text-[12.5px] leading-[1.45] text-[#ff6b78]" role="alert">
          <span className="flex-1">{t("onboarding.bot.error")}</span>
          <button type="button" onClick={onFinish}
            className="h-7 shrink-0 whitespace-nowrap rounded-full border border-[#ff6b78]/50 px-3 text-[12px] font-medium hover:bg-[#ff6b78]/10">
            {t("onboarding.bot.finishAnyway")}
          </button>
        </div>
      )}

      <PrimaryButton onClick={() => void save()} disabled={saving} className="animate-rise mt-5" style={staggerIndex(4)}>
        {saving ? t("onboarding.bot.saving") : t("onboarding.bot.finish")}
      </PrimaryButton>
    </div>
  );
}
