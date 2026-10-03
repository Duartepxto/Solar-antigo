// The reel beat (design: reel): six things a bot can do, one at a time. A
// row of icons shows where you are and lets you jump to any of them; Next
// steps through, and the last one hands on to the next beat.
import { useEffect, useState } from "react";
import { Bot, CalendarClock, Hand, Hash, Plug, SquareTerminal, type LucideIcon } from "lucide-react";
import { withViewTransition } from "../view-transition";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { MausState } from "@/lib/mascot";
import type { LocaleKey } from "@/locales";
import { PrimaryButton, type BeatProps } from "../beats/shared";

const REEL: Array<{ id: string; icon: LucideIcon; mascot: MausState }> = [
  { id: "agents", icon: Bot, mascot: "curious" },
  { id: "hands", icon: Hand, mascot: "working" },
  { id: "apps", icon: Plug, mascot: "searching" },
  { id: "channels", icon: Hash, mascot: "listening" },
  { id: "automations", icon: CalendarClock, mascot: "thinking" },
  { id: "terminal", icon: SquareTerminal, mascot: "happy" },
];

function copyKey(id: string, part: "title" | "body"): LocaleKey {
  return `onboarding.reel.${id}.${part}` as LocaleKey;
}

export function FeatureReel({ onNext, setMascot, bump }: BeatProps) {
  const [index, setIndex] = useState(0);
  const scene = REEL[index] ?? REEL[0];
  const last = index >= REEL.length - 1;
  useEffect(() => { setMascot(scene.mascot); }, [scene.mascot, setMascot]);
  const show = (i: number) => {
    withViewTransition(() => setIndex(i));
    bump("switch");
  };

  return (
    <div className="flex flex-col items-center">
      <div role="tablist" aria-label={t("onboarding.reel.scenes")} className="mt-3.5 flex gap-2">
        {REEL.map((s, i) => {
          const Icon = s.icon;
          const on = i === index;
          return (
            <button key={s.id} type="button" role="tab" aria-selected={on} aria-label={t(copyKey(s.id, "title"))} title={t(copyKey(s.id, "title"))}
              onClick={() => show(i)}
              className={cn("flex size-9 items-center justify-center rounded-full border transition-colors",
                on ? "border-[#3ee09a]/70 bg-[#3ee09a]/10 text-[#3ee09a]" : "border-ink/[0.14] text-ink/60 hover:text-ink")}>
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      <div key={scene.id} className="animate-rise mt-[18px] flex flex-col items-center text-center">
        <h2 className="text-[17px] font-semibold text-ink">{t(copyKey(scene.id, "title"))}</h2>
        <p className="mt-3.5 max-w-[360px] text-pretty text-[14px] leading-[1.6] text-ink/80">{t(copyKey(scene.id, "body"))}</p>
      </div>
      <PrimaryButton onClick={last ? onNext : () => show(index + 1)} className="mt-5">
        {last ? t("onboarding.continue") : t("onboarding.reel.next")}
      </PrimaryButton>
    </div>
  );
}
