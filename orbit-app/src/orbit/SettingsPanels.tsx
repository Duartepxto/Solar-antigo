// The You hub's detail panel: one app-settings section in the column beside
// You (design: hubDet). The section bodies are the app's own.

import { modalLayerOpen } from "./events";
import { useEffect, useRef } from "react";
import { Monitor } from "lucide-react";
import { useStore, type AppSettingsSection } from "@/state/store";
import { t } from "@/lib/i18n";
import { AppSettingsSectionContent, appSettingsSectionMeta, resolveAppSettingsSection } from "@/components/SettingsModal";
import { BackToChat, DetailBody, DetailHeader } from "./detail/primitives";

/** Esc backs out of a panel, unless a dialog opened from inside it owns Esc. */
export function useEscapeBack(onBack: () => void) {
  const ref = useRef(onBack);
  ref.current = onBack;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (modalLayerOpen()) return;
      event.preventDefault();
      ref.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function AppSettingsPanel() {
  const { state, dispatch } = useStore();
  const section: AppSettingsSection = resolveAppSettingsSection(state.appSettingsSection);
  const meta = appSettingsSectionMeta(section);
  const back = () => dispatch({ type: "toggleAppSettings", open: false });
  useEscapeBack(back);
  return (
    <DetailBody>
      <BackToChat onClick={back} label={t("orbit.panel.backToYou")} />
      <DetailHeader icon={meta?.icon ?? Monitor} kicker={t("orbit.you").toUpperCase()} title={meta ? t(meta.labelKey) : t("settings.title")} />
      <div className="orbit-settings flex flex-col gap-4">
        <AppSettingsSectionContent section={section} />
      </div>
    </DetailBody>
  );
}
