// Beat: what the app may use. Desktop only, microphone only. Screen
// Recording deliberately has no row: macOS 15+ makes a pre-grant unreliable
// (per-process status caching, helper misattribution, periodic re-prompts),
// so the OS flow triggers on the first real capture in the Computer panel,
// the moment the user has context for the dialog.
import { useEffect, useState } from "react";
import { Check, Mic } from "lucide-react";
import { t } from "@/lib/i18n";
import { PrimaryButton, staggerIndex, type BeatProps } from "./shared";

export function PermissionsBeat({ onNext, setMascot, bump }: BeatProps) {
  const solar = import.meta.env.VITE_JARVIS_SOLAR === 'true' && window.ogb?.platform !== 'darwin';
  const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
  const request=async()=>{if(busy)return;setBusy(true);setFailed(false);try{if(solar){const stream=await navigator.mediaDevices.getUserMedia({audio:true});stream.getTracks().forEach(track=>track.stop());setPerms({mic:'granted'});}else{await window.ogb?.permRequestMic?.();const result=await window.ogb?.permStatus?.();if(result)setPerms(result);}}catch{setFailed(true);setPerms({mic:'denied'});}finally{setBusy(false);}};
  const [perms, setPerms] = useState<{ mic: string } | null>(null);

  useEffect(() => {
    setMascot("listening");
    let alive=true;
    const poll=()=>{if(solar){void navigator.permissions?.query({name:'microphone' as PermissionName}).then(status=>{if(alive)setPerms({mic:status.state});}).catch(()=>{});}else void window.ogb?.permStatus?.().then(result=>{if(alive)setPerms(result);}).catch(()=>{});};
    poll();
    // keep polling — the user may grant in System Settings and come back
    const timer = setInterval(poll, 2000);
    return () => {alive=false;clearInterval(timer);};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const granted = perms?.mic === "granted";
  useEffect(() => {
    if (granted) bump("success");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granted]);

  const denied = perms?.mic === "denied" || perms?.mic === "restricted";

  // design: WF 'permissions' — one plain row between hairlines, a pill action
  return (
    <div className="flex flex-col">
      <p className="animate-rise mt-3 text-pretty text-[14px] leading-[1.6] text-ink/80">{t("onboarding.perms.intro")}</p>
      <div className="animate-rise mt-3 flex items-center gap-3 border-y border-ink/[0.08] py-3" style={staggerIndex(1)}>
        <Mic size={18} className="shrink-0 text-ink/80" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-medium text-ink">{t("onboarding.perms.mic")}</span>
          <span className="text-[12.5px] text-ink/60">{t(solar?'jarvis.welcome.microphone':'onboarding.perms.micDetail')}</span>
        </div>
        {granted ? (
          <Check size={16} className="shrink-0 text-success" aria-label={t("onboarding.engines.ready")} />
        ) : denied && !solar ? (
          <button type="button" onClick={() => window.ogb?.permOpenSettings?.("mic")} className="h-7 shrink-0 rounded-full border border-ink/[0.16] px-3 text-[12.5px] font-medium text-ink transition-colors hover:bg-ink/[0.06]">
            {t("onboarding.perms.openSettings")}
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={()=>void request()} className="h-7 shrink-0 rounded-full border border-ink/[0.16] px-3 text-[12.5px] font-medium text-ink transition-colors hover:bg-ink/[0.06]">
            {t("onboarding.perms.enable")}
          </button>
        )}
      </div>
      {failed&&<p role="alert" className="mt-3 text-[12px] text-ink/80">{t('jarvis.solar.voice.permission')}</p>}
      <PrimaryButton onClick={onNext} className="mt-5">
        {t("onboarding.continue")}
      </PrimaryButton>
    </div>
  );
}
