import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { Bell, ChevronLeft, X } from "lucide-react";

import { api, useStore, type Bot } from "@/state/store";
import { cn } from "@/lib/cn";
import { useCaptionChrome } from "@/components/DesktopCapabilities";
import { VoiceSettings } from "./VoiceSettings";
import { Switch } from "./SettingsPrimitives";
import { BotFace } from "@/orbit/OrbitFace";
import { BOT_PROFILE_LIMITS } from "../../shared/bot-profile";

type RemoteProfilePatch = Partial<
  Pick<Bot, "name" | "title" | "description" | "voice" | "speakReplies" | "notifications">
>;

export function RemoteAgentSettingsPanel({ bot }: { bot: Bot }) {
  const { dispatch } = useStore();
  // Docked flush under the Windows caption corner: drop the header 16px.
  const { padClass } = useCaptionChrome();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const pendingPatch = useRef<RemoteProfilePatch | null>(null);
  const patchQueue = useRef<Promise<void> | null>(null);

  const close = () => dispatch({ type: "toggleSettings", open: false });
  const patch = (next: RemoteProfilePatch): Promise<void> => {
    pendingPatch.current = { ...pendingPatch.current, ...next };
    if (patchQueue.current) return patchQueue.current;
    setSaving(true);
    setError("");
    const drain = async () => {
      while (pendingPatch.current) {
        const current = pendingPatch.current;
        pendingPatch.current = null;
        setError("");
        try {
          const result: { bot: Bot } = await api(`/api/bots/${bot.id}/profile`, {
            method: "PATCH",
            body: JSON.stringify(current),
          });
          dispatch({ type: "botPatched", bot: result.bot });
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "Could not update this agent.");
        }
      }
    };
    patchQueue.current = drain().finally(() => {
      patchQueue.current = null;
      setSaving(false);
    });
    return patchQueue.current;
  };

  return (
    <aside className="animate-panel-in relative z-20 flex h-full w-[400px] shrink-0 flex-col border-l border-ink/[0.1] bg-panel">
      <div className={cn("flex items-center justify-between px-4 py-3", padClass)}>
        <button
          onClick={close}
          aria-label={t("remoteAgent.ui.collapseRemoteAgentSettings")}
          className="flex size-10 items-center justify-center rounded-md text-ink/55 hover:bg-ink/[0.05] hover:text-ink"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[15px] font-semibold text-ink">{t("remoteAgent.ui.remoteAgentSettings")}</span>
        <button
          onClick={close}
          aria-label={t("remoteAgent.ui.closeRemoteAgentSettings")}
          className="flex size-10 items-center justify-center rounded-md text-ink/55 hover:bg-ink/[0.05] hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="flex flex-col gap-4 pt-4">
          <div className="rounded-xl bg-ink/[0.03] p-4">
            <div className="mb-4 flex items-center gap-3">
              <BotFace bot={bot} size={64} />
            </div>
            <label className="block text-[12px] font-medium text-ink/55">Name
              <input key={bot.id} defaultValue={bot.name} maxLength={BOT_PROFILE_LIMITS.name} onBlur={(event) => { const name = event.currentTarget.value.trim(); if (name && name !== bot.name) void patch({ name }); }} className="mt-1 w-full rounded-lg bg-ink/[0.04] px-3 py-2 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-ink/40" />
            </label>
            <label className="mt-3 block text-[12px] font-medium text-ink/55">Title
              <input key={bot.id} defaultValue={bot.title ?? ""} maxLength={BOT_PROFILE_LIMITS.title} onBlur={(event) => { if (event.currentTarget.value !== (bot.title ?? "")) void patch({ title: event.currentTarget.value }); }} className="mt-1 w-full rounded-lg bg-ink/[0.04] px-3 py-2 text-[14px] text-ink focus:outline-none focus:ring-1 focus:ring-ink/40" />
            </label>
            <label className="mt-3 block text-[12px] font-medium text-ink/55">Description
              <textarea key={bot.id} defaultValue={bot.description ?? ""} maxLength={BOT_PROFILE_LIMITS.description} rows={4} onBlur={(event) => { if (event.currentTarget.value !== (bot.description ?? "")) void patch({ description: event.currentTarget.value }); }} className="mt-1 w-full resize-y rounded-lg bg-ink/[0.04] px-3 py-2 text-[13px] leading-relaxed text-ink focus:outline-none focus:ring-1 focus:ring-ink/40" />
            </label>
          </div>

          <VoiceSettings
            bot={bot}
            workspaceConfigurationLocked
            onPatch={(next) => void patch(next)}
          />

          <div className="flex items-center justify-between gap-4 rounded-xl bg-ink/[0.03] p-4">
            <div className="flex min-w-0 items-start gap-3">
              <Bell size={16} className="mt-0.5 shrink-0 text-ink/55" />
              <div>
                <div className="text-[15px] font-medium text-ink">{t("remoteAgent.ui.notifications")}</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-ink/55">
                  {t("remoteAgentSettingsPanel.ui.enableCompletionAndAttentionNotification")}
                </div>
              </div>
            </div>
            <Switch
              checked={bot.notifications}
              disabled={saving}
              aria-label={t("remoteAgent.ui.agentNotifications")}
              onClick={() => void patch({ notifications: !bot.notifications })}
            />
          </div>

          {error ? <div role="alert" className="text-[12px] text-[#ff8a96]">{error}</div> : null}
        </div>
      </div>
    </aside>
  );
}
