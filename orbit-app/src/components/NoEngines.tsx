// Shown instead of a chat when nothing on this machine can run a bot.
//
// The alternative — which is what used to happen — is a chat that looks
// completely functional until the first message, then fails with a raw spawn
// error. Every engine unavailable is a setup state, not an error state, so it
// gets a screen that says what to do rather than a bot that can't answer.
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/state/store";
import { EngineSetup, installCommandFor } from "@/components/EngineSetup";
import { GuideCharacter } from "@/orbit/GuideCharacter";
import { splitEngineRail } from "@/lib/engine-rail";
import { t } from "@/lib/i18n";
import { brand } from "../lib/brand";

export function NoEngines() {
  const { state, refreshInstances } = useStore();
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const [rechecking, setRechecking] = useState(false);
  const recheck = async () => {
    setRechecking(true);
    try {
      await refreshInstances();
    } finally {
      setRechecking(false);
    }
  };

  if (remoteClient) {
    return (
      <main className="flex h-full min-w-0 flex-1 items-center justify-center px-6">
        <div className="flex w-[min(460px,100%)] flex-col items-center gap-3 text-center">
          <GuideCharacter mood="thinking" size={110} />
          <h1 className="text-[20px] font-semibold text-ink">{t("noEngines.remoteTitle")}</h1>
          <p className="text-[13.5px] leading-relaxed text-ink/55">{t("noEngines.remoteBody", { app: brand().name })}</p>
          <button onClick={() => void recheck()} disabled={rechecking} className="h-[34px] rounded-full bg-ink px-3.5 text-[13px] font-semibold text-app disabled:opacity-60">
            {rechecking ? t("common.checking") : t("common.checkAgain")}
          </button>
        </div>
      </main>
    );
  }

  // Only things you actually install belong on a "get started" screen. The
  // Boat cloud runner also reports unavailable here, but it's configured with
  // a token in settings rather than installed, so listing it would just be a
  // dead end alongside the real options.
  const engines = state.instances
    .filter((i) => i.install)
    // An engine with a command for this platform is one the user can act on
    // right now; the rest (GUI downloads, POSIX-only installers on Windows)
    // sort below so the actionable path is the obvious one.
    .sort((a, b) => {
      const aCmd = installCommandFor(a.install) ? 0 : 1;
      const bCmd = installCommandFor(b.install) ? 0 : 1;
      return aCmd - bCmd;
    });

  // design: no-engines — the guide, what to do, one card per engine with
  // its install step, then Check again.
  const { subscription, custom } = splitEngineRail(engines);
  return (
    <main className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="m-auto flex w-[min(460px,calc(100%-40px))] flex-col gap-3 py-10">
        <div className="self-center"><GuideCharacter mood="thinking" size={110} /></div>
        <h1 className="text-[20px] font-semibold text-ink">{t("noEngines.title")}</h1>
        <p className="text-[13.5px] leading-[1.55] text-ink/55">{t("noEngines.intro", { app: brand().name })}</p>
        {[...subscription, ...custom].map((instance) => (
          <div key={instance.instanceId} className="flex flex-col gap-1.5 rounded-xl border border-ink/[0.12] px-3.5 py-3">
            <span className="text-[14px] font-medium text-ink">{instance.displayName}</span>
            <EngineSetup instance={instance} intent={instance.access === "custom" ? "inject" : "cloud"} className="mt-0.5 border-0 bg-transparent p-0" />
          </div>
        ))}
        <button onClick={recheck} disabled={rechecking}
          className="flex h-[34px] items-center gap-2 self-start rounded-full bg-ink px-3.5 text-[13px] font-semibold text-app disabled:opacity-60">
          {rechecking && <Loader2 size={14} className="animate-spin" />}
          {rechecking ? t("common.checking") : t("common.checkAgain")}
        </button>
      </div>
    </main>
  );
}
