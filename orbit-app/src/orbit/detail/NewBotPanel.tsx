// NEW BOT (design: hub 'new', newBotDet). The New bot dialog's rules in the
// column: a blank bot is one card among the roles, a role only pre-fills
// the profile, and who can see the bot is chosen before it exists. A bot
// started from a team's + joins that team.

import { useEffect, useRef, useState } from "react";
import { Bot as BotIcon } from "lucide-react";
import { BOT_ROLES, type BotRole } from "@/lib/bot-roles";
import { TEAM_TEMPLATES, type TeamTemplate } from "@/lib/team-templates";
import { t } from "@/lib/i18n";
import { createTeamFromTemplate, useStore } from "@/state/store";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { visibilityFromForm, type VisibilityMode } from "@/components/bot-settings/VisibilitySection";
import { Actions, DetailBody, DetailHeader, Warning } from "./primitives";
import { useEscapeBack } from "../SettingsPanels";
import { orbitNavigate } from "../events";
import { TeamDialog } from "@/components/TeamDialog";
import { SolarPlanet } from '../SolarPlanet';
import type { SolarSkin } from '../solar-model';

const APP_LABELS: Record<string, string> = {
  gmail: "Gmail", github: "GitHub", discord: "Discord", slack: "Slack", googlecalendar: "Calendar", notion: "Notion", linear: "Linear",
};

export function NewBotPanel({ section, teamName, onCancel }: { section: string | null; teamName?: string; onCancel: () => void }) {
  const { state, dispatch } = useStore();
  useEscapeBack(onCancel);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const creating = state.botCreationPending;
  const solar=import.meta.env.VITE_JARVIS_SOLAR==='true';
  const [catalog,setCatalog]=useState<'agents'|'teams'>('agents');
  const [query,setQuery]=useState('');
  const matches=(...values:string[])=>values.join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audience, setAudience] = useState<VisibilityMode>("everyone");
  const [people, setPeople] = useState("");
  const ownerOrAdmin = useOwnerOrAdmin();
  const choosesVisibility = !window.ogb && ownerOrAdmin === true;

  const create = (role?: BotRole) => {
    if (creating) return;
    setError(null);
    const visibility = choosesVisibility ? visibilityFromForm(audience, people) : null;
    if (visibility && !visibility.ok) { setError(t("botSettings.visibility.needPeople")); return; }
    setPending(role?.id ?? "blank");
    dispatch({
      type: "newBot", role, ...(section ? { section } : {}), ...(visibility?.ok ? { visibility: visibility.visibility } : {}),
      onCreated: (bot) => {
        // this panel is still the one open: meet the bot (design: finishBot)
        if (alive.current) orbitNavigate({ to: "bot", id: bot.id });
      },
      onError: (message: string) => { if (!alive.current) return; setPending(null); setError(message); },
    });
  };

  // a whole team: its members, then its Chief, then the team's own view
  const [teamPending, setTeamPending] = useState<string | null>(null);
  const [emptyTeam, setEmptyTeam] = useState(false);
  const createTeam = async (template: TeamTemplate) => {
    if (creating || teamPending) return;
    // already on the map: open it rather than a second copy
    if (state.bots.some((bot) => !bot.hidden && bot.section === template.team)) { orbitNavigate({ to: "team", key: template.team }); return; }
    setError(null);
    setTeamPending(template.id);
    try {
      const { errors } = await createTeamFromTemplate(template);
      if (!alive.current) return;
      if (errors.length) setError(errors.join(" "));
      else orbitNavigate({ to: "team", key: template.team });
    } catch (cause) {
      if (alive.current) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (alive.current) setTeamPending(null);
    }
  };

  const preview=(id:string)=>{if(import.meta.env.VITE_JARVIS_SOLAR!=='true')return;const skins=['earth','mercury','venus','mars','jupiter','saturn','uranus','neptune'];const index=Math.max(0,BOT_ROLES.findIndex(role=>role.id===id)+1);window.dispatchEvent(new CustomEvent('jarvis-solar-preview',{detail:skins[index%skins.length]}));};
  const card = (id: string, title: string, desc: string, apps: string[], blank: boolean, onClick: () => void) => (
    <button data-solar-role={id} key={id} type="button" onMouseEnter={()=>preview(id)} onFocus={()=>preview(id)} disabled={creating} onClick={onClick} aria-busy={pending === id}
      className="flex flex-col gap-1 rounded-xl border border-ink/[0.16] bg-ink/[0.02] px-[13px] py-[11px] text-left transition-[opacity,background] hover:bg-ink/[0.06] disabled:cursor-default"
      style={{ borderStyle: blank ? "dashed" : "solid", opacity: creating && pending !== id ? 0.4 : 1 }}>
      {import.meta.env.VITE_JARVIS_SOLAR==='true'&&<span className="solar-role-mini"><SolarPlanet kind="planet" skin={(['earth','mercury','venus','mars','jupiter','saturn','uranus','neptune'][Math.max(0,BOT_ROLES.findIndex(role=>role.id===id)+1)%8]) as SolarSkin}/></span>}
      <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
        {blank && <BotIcon size={15} className="shrink-0 text-ink/60" aria-hidden />}
        <span className="min-w-0 flex-1">{title}</span>
        {pending === id && creating && <span className="text-[11.5px] font-medium text-ink/60">{t("orbit.new.creating")}</span>}
      </span>
      <span className="text-[12.5px] leading-[1.45] text-ink/60">{desc}</span>
      {apps.length > 0 && (
        <span className="flex flex-wrap gap-1 pt-0.5">
          {apps.map((a) => <span key={a} className="rounded-[9px] bg-ink/[0.06] px-2 py-px text-[11px] text-ink/60">{APP_LABELS[a] ?? a}</span>)}
        </span>
      )}
    </button>
  );

  return (
    <section aria-label={t("orbit.new.name")} aria-busy={creating} data-orbit-new className="contents">
    <DetailBody>
      <DetailHeader icon={BotIcon} kicker={t("orbit.new.kicker")} title={t("orbit.new.title")}
        desc={teamName ? `${t("orbit.new.desc")} ${t("orbit.new.joins", { team: teamName })}` : t("orbit.new.desc")} />
      {solar&&<div className="solar-create-navigation">
        <div className="solar-create-tabs" role="group" aria-label={t('jarvis.solar.create.category')}>
          <button type="button" aria-pressed={catalog==='agents'} onClick={()=>setCatalog('agents')}>{t('jarvis.solar.create.agents')}</button>
          <button type="button" aria-pressed={catalog==='teams'} onClick={()=>setCatalog('teams')}>{t('orbit.new.teams')}</button>
        </div>
        <input type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label={t('jarvis.solar.create.search')} placeholder={t('jarvis.solar.create.search')}/>
      </div>}
      {choosesVisibility && (
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink/60" data-new-bot-visibility>
          <label className="flex items-center gap-2">
            {t("botSettings.visibility.title")}
            <select value={audience} disabled={creating} onChange={(e) => setAudience(e.target.value as VisibilityMode)}
              className="h-[30px] rounded-lg border border-ink/[0.14] bg-ink/[0.04] px-2 text-[12.5px] text-ink outline-none">
              <option value="everyone">{t("botSettings.visibility.everyone")}</option>
              <option value="admins">{t("botSettings.visibility.admins")}</option>
              <option value="people">{t("botSettings.visibility.people")}</option>
            </select>
          </label>
          {audience === "people" && (
            <input value={people} disabled={creating} onChange={(e) => setPeople(e.target.value)}
              placeholder={t("botSettings.visibility.peoplePlaceholder")} aria-label={t("botSettings.visibility.peopleLabel")}
              className="h-[30px] min-w-0 flex-1 rounded-lg border border-ink/[0.14] bg-ink/[0.04] px-2.5 text-[12.5px] text-ink outline-none" />
          )}
        </div>
      )}
      {error && <Warning>{error}</Warning>}
      <div className="flex flex-col gap-2" hidden={solar&&catalog!=='agents'}>
        {card("blank", t("newBot.blank"), t("newBot.blankDescription"), [], true, () => create())}
        {BOT_ROLES.filter(role=>!solar||matches(role.title,role.description,...role.apps)).map((role) => card(role.id, role.title, role.description, role.apps, false, () => create(role)))}
      </div>
      <div data-solar-team-catalog className="flex flex-col gap-2" role="group" hidden={solar&&catalog!=='teams'} aria-label={t("orbit.new.teams")}>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50">{t("orbit.new.teams")}</span>
        <button type="button" disabled={creating || teamPending !== null} onClick={() => setEmptyTeam(true)}
          className="flex flex-col gap-1 rounded-xl border border-ink/[0.16] bg-ink/[0.02] px-[13px] py-[11px] text-left hover:bg-ink/[0.06] disabled:cursor-default">
          <span className="text-[13.5px] font-semibold text-ink">{t("orbit.new.emptyTeam")}</span>
          <span className="text-[12.5px] leading-[1.45] text-ink/60">{t("orbit.new.emptyTeamDesc")}</span>
        </button>
        {emptyTeam && <TeamDialog onClose={() => setEmptyTeam(false)} />}
        {TEAM_TEMPLATES.filter(template=>!solar||matches(template.title,template.description)).map((template) => (
          <button key={template.id} type="button" disabled={creating || teamPending !== null} onClick={() => void createTeam(template)} aria-busy={teamPending === template.id}
            className="flex flex-col gap-1 rounded-xl border border-ink/[0.16] bg-ink/[0.02] px-[13px] py-[11px] text-left transition-[opacity,background] hover:bg-ink/[0.06] disabled:cursor-default"
            style={{ opacity: teamPending && teamPending !== template.id ? 0.4 : 1 }}>
            <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <span className="min-w-0 flex-1">{template.title}</span>
              {teamPending === template.id
                ? <span className="text-[11.5px] font-medium text-ink/60">{t("orbit.new.creating")}</span>
                : state.bots.some((bot) => !bot.hidden && bot.section === template.team)
                  ? <span className="text-[11.5px] font-medium text-ink/60">{t("orbit.new.teamOpen")}</span>
                  : <span className="text-[11.5px] font-medium text-ink/50">{t("orbit.new.teamSize", { count: template.members.length + 1 })}</span>}
            </span>
            <span className="text-[12.5px] leading-[1.45] text-ink/60">{template.description}</span>
            <span className="flex flex-wrap gap-1 pt-0.5">
              {[template.chief, ...template.members].map((role) => <span key={role.id} className="rounded-[9px] bg-ink/[0.06] px-2 py-px text-[11px] text-ink/60">{role.name}</span>)}
            </span>
          </button>
        ))}
      </div>
      {solar&&query.trim()&&!(catalog==='agents'?BOT_ROLES.some(role=>matches(role.title,role.description,...role.apps)):TEAM_TEMPLATES.some(team=>matches(team.title,team.description)))&&<p role="status" className="solar-create-empty">{t('jarvis.solar.create.noMatches')}</p>}
      <Actions actions={[{ label: t("common.cancel"), onClick: onCancel }]} />
    </DetailBody>
    </section>
  );
}
