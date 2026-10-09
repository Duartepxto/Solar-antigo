// PROFILE and OVERVIEW (design: profile / overview dets). Name, role and
// colour write the bot record as the Identity section does; the standing
// instructions keep SoulField's apply-or-discard flow against SOUL.md.

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { api, useStore, type Bot } from "@/state/store";
import { MAUS_COLORS, MAUS_COLOR_NAMES } from "@/lib/mascot";
import type { BotOverview } from "@/lib/bot-overview-types";
import type { LocaleKey } from "@/locales";
import { effectivePlace, placeLabelKey } from "@/lib/place";
import { approvalModeFor } from "../../../shared/approval-mode";
import { botEngineDetails } from "@/lib/bot-engine";
import { BOT_PROFILE_LIMITS } from "../../../shared/bot-profile";
import { useBotSettingsDerived } from "@/components/bot-settings/useBotSettingsDerived";
import { SoulField } from "@/components/SoulField";
import { SlackSection } from "@/components/bot-settings/SlackSection";
import { VisibilitySection } from "@/components/bot-settings/VisibilitySection";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { useSlackManagementUrl } from "@/components/bot-settings/useSlackManagement";
import type { PromptPreviewData } from "@/components/bot-settings/PromptPreview";
import { Actions, BackToChat, DetailBody, DetailHeader, DOT_OFF, Field, List, Loading, MONO_LABEL, Rows, Warning } from "./primitives";
import { PANEL_ICON, type BotPanelKey } from "./BotPanels";

export function ProfilePanel({ bot, onBack, open }: { bot: Bot; onBack: () => void; open: (p: BotPanelKey) => void }) {
  const { patch } = useBotSettingsDerived(bot);
  const slackUrl = useSlackManagementUrl(bot.id);
  const ownerOrAdmin = useOwnerOrAdmin();
  return (
    <DetailBody>
      <BackToChat onClick={onBack} />
      <DetailHeader icon={PANEL_ICON.profile} color={MAUS_COLORS[bot.color]} kicker={t("orbit.sys.profile")} title={bot.name} desc={t("orbit.p.profile.desc")} />
      <div className="flex flex-col gap-2.5">
        <Field label={t("orbit.p.profile.name")} value={bot.name} placeholder={t("orbit.p.profile.name")} onChange={(v) => v.length <= BOT_PROFILE_LIMITS.name && patch({ name: v })} />
        <Field label={t("orbit.p.profile.role")} value={bot.title} placeholder={t("orbit.p.profile.rolePlaceholder")} onChange={(v) => v.length <= BOT_PROFILE_LIMITS.title && patch({ title: v })} />
        <label className="flex flex-col gap-[5px] text-[11.5px] text-ink/60">
          {t("orbit.p.profile.blurb")}
          <textarea value={bot.description} maxLength={BOT_PROFILE_LIMITS.description} placeholder={t("orbit.p.profile.blurbPlaceholder")}
            onChange={(e) => patch({ description: e.target.value })}
            className="min-h-[60px] resize-y rounded-lg border border-ink/[0.12] bg-ink/[0.05] px-2.5 py-2 text-[13.5px] leading-[1.5] text-ink outline-none" />
        </label>
      </div>
      <div className="orbit-soul flex flex-col gap-1.5">
        <span className={MONO_LABEL}>{t("orbit.p.profile.soul")}</span>
        <SoulField bot={bot} onPatch={patch} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={MONO_LABEL}>{t("orbit.p.profile.colour")}</span>
        <div className="flex flex-wrap gap-2">
          {[bot.color, ...MAUS_COLOR_NAMES.filter((c) => c !== bot.color)].map((c) => (
            <button key={c} type="button" title={c} aria-label={c} aria-pressed={c === bot.color} onClick={() => patch({ color: c })}
              className="size-[26px] rounded-full border-2" style={{ background: MAUS_COLORS[c], borderColor: c === bot.color ? "var(--color-ink)" : "transparent" }} />
          ))}
        </div>
      </div>
      {/* who can see it: an admin, in a browser (never the desktop app) */}
      {!window.ogb && ownerOrAdmin === true && (
        <div data-bot-settings-section="visibility" className="flex flex-col gap-1.5">
          <span className={MONO_LABEL}>{t("botSettings.visibility.title")}</span>
          <VisibilitySection bot={bot} />
        </div>
      )}
      {/* hosted organisations manage the bot's own Slack app in Admin */}
      {slackUrl && (
        <div data-bot-settings-section="slack" className="flex flex-col gap-1.5">
          <span className={MONO_LABEL}>{t("orbit.p.profile.slack")}</span>
          <SlackSection managementUrl={slackUrl} />
        </div>
      )}
      <Actions actions={[
        { label: t("orbit.p.profile.overview"), onClick: () => open("overview") },
        { label: t("orbit.menu.history"), onClick: () => open("history") },
      ]} />
    </DetailBody>
  );
}

export function OverviewPanel({ bot: profile, onBack, open }: { bot: Bot; onBack: () => void; open: (p: BotPanelKey) => void }) {
  const { state, flushBotPatches, dispatch } = useStore();
  // this conversation's settings, the ones its header chips show and change
  const { bot, engine, model } = botEngineDetails(profile, state.instances);
  // any bot whose engine can coordinate may set itself up, as upstream offered
  const { canCoordinate } = useBotSettingsDerived(bot);
  const [overview, setOverview] = useState<BotOverview | null>(null);
  const [prompt, setPrompt] = useState<PromptPreviewData | null>(null);
  const [error, setError] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void flushBotPatches(bot.id).then(() => Promise.all([
      api(`/api/bots/${bot.id}/overview?threadId=${encodeURIComponent(bot.threadId)}`).then((d: BotOverview) => { if (!cancelled) setOverview(d); }),
      api(`/api/bots/${bot.id}/system-prompt`).then((d: PromptPreviewData) => { if (!cancelled) setPrompt(d); }),
    ])).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [bot.id, bot.threadId, bot.approvalMode, bot.autoApprove, bot.modelSelection.instanceId, flushBotPatches]);
  const level = approvalModeFor(bot);
  const skillsNote = overview?.does.length ?? 0;
  return (
    <DetailBody>
      <BackToChat onClick={onBack} />
      <DetailHeader icon={PANEL_ICON.overview} color={MAUS_COLORS[bot.color]} kicker={t("orbit.p.overview.kicker")} title={bot.name}
        desc={[bot.title, bot.section?.trim()].filter(Boolean).join(" · ") || undefined} />
      {error && overview && <span className="text-[12px] text-[#ffb454]">{t("orbit.p.overview.stale")}</span>}
      {error && !overview && <Warning>{t("orbit.p.overview.error")}</Warning>}
      <Rows rows={[
        { k: t("orbit.p.overview.status"), v: bot.activity === "waiting-on-you" ? t("orbit.val.waiting") : bot.busy ? t("orbit.val.working") : t("orbit.val.idle") },
        { k: t("orbit.p.overview.model"), v: `${engine} · ${model}` },
        { k: t("orbit.p.overview.works"), v: t(placeLabelKey(effectivePlace(bot))) },
        { k: t("orbit.p.overview.approvals"), v: t(`approvalMode.${level}.label` as LocaleKey) },
        { k: t("orbit.p.overview.does"), v: t("orbit.p.overview.doesCount", { count: skillsNote }) },
      ]} />
      {!overview && !error ? <Loading /> : overview && (
        <>
          {overview.does.length > 0 && <List title={t("orbit.p.overview.doesList")} items={overview.does.map((x, i) => ({ key: `d${i}`, name: x }))} />}
          {overview.reaches.length > 0 && <List title={t("orbit.p.overview.reaches")} items={overview.reaches.map((x, i) => ({ key: `r${i}`, name: x }))} />}
          <List title={t("orbit.p.overview.wont")} empty={t("orbit.p.overview.wontNone")}
            items={overview.wont.map((x, i) => ({ key: `w${i}`, name: x, dot: DOT_OFF, onClick: () => open("approvals") }))} />
          {overview.setup && overview.setup.some((s) => !s.done) && <span className="text-[12.5px] leading-[1.5] text-ink/60">{t("botSetup.optional")}</span>}
          {overview.setup && overview.setup.some((s) => !s.done) && (
            <List title={t("orbit.p.overview.setup")} items={overview.setup.map((s) => ({
              key: s.id, name: s.label, on: s.done,
              onClick: s.section ? () => open(s.section === "identity" || s.section === "soul" ? "profile" : s.section === "access" ? "computer" : "routines") : undefined,
            }))} />
          )}
          {overview.recent.length > 0 && <Rows rows={overview.recent.slice(0, 5).map((r) => ({ k: new Date(r.at).toLocaleDateString(), v: r.summary }))} />}
        </>
      )}
      {showPrompt && prompt && (
        <div className="flex flex-col gap-2">
          <span className={MONO_LABEL}>{t("orbit.p.overview.prompt", { tokens: prompt.approxTokens })}</span>
          {prompt.sections.map((s) => (
            <details key={s.id} className="rounded-[10px] border border-ink/[0.12] px-3 py-2 text-[12.5px] text-ink/60">
              <summary className="cursor-pointer font-medium text-ink/80">{s.label}</summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[11.5px] leading-[1.5]">{s.text}</pre>
            </details>
          ))}
          <span className="text-[11.5px] text-ink/50">{prompt.note}</span>
        </div>
      )}
      <Actions actions={[
        prompt && { label: showPrompt ? t("orbit.p.overview.hidePrompt") : t("orbit.p.overview.showPrompt"), onClick: () => setShowPrompt((v) => !v) },
        { label: t("orbit.p.overview.edit"), onClick: () => open("profile") },
        overview?.setup && canCoordinate && !bot.busy && { label: t("orbit.p.overview.setupCmd"), onClick: () => dispatch({ type: "send", botId: bot.id, text: "/setup", threadId: bot.threadId }) },
      ]} />
    </DetailBody>
  );
}
