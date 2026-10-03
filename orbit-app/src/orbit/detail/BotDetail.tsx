import type { Bot } from "@/state/store";
import {
  AppsPanelDetail, ApprovalsPanelDetail, BrowserPanelDetail, ComputerPanelDetail, EnginePanel, HistoryPanelDetail, PhonePanelDetail,
  RoutinesPanelDetail, UsagePanelDetail, VoicePanelDetail, type BotPanelKey,
} from "./BotPanels";
import { MemoryPanel } from "./MemoryPanel";
import { SkillsPanel } from "./SkillsPanel";
import { OverviewPanel, ProfilePanel } from "./ProfilePanels";
import { useEscapeBack } from "../SettingsPanels";

/** One bot panel, keyed so switching panels or bots never carries a draft
 * across. */
export function BotDetail({ bot, panel, onBack, open }: { bot: Bot; panel: BotPanelKey; onBack: () => void; open: (p: BotPanelKey) => void }) {
  useEscapeBack(onBack);
  const props = { bot, onBack, open };
  const key = `${bot.id}:${panel}`;
  return <div data-orbit-panel={panel} className="contents">{body(panel, key, props, bot, onBack)}</div>;
}

function body(panel: BotPanelKey, key: string, props: { bot: Bot; onBack: () => void; open: (p: BotPanelKey) => void }, bot: Bot, onBack: () => void) {
  switch (panel) {
    case "engine": return <EnginePanel key={key} {...props} />;
    case "computer": return <ComputerPanelDetail key={key} {...props} />;
    case "browser": return <BrowserPanelDetail key={key} {...props} />;
    case "phone": return <PhonePanelDetail key={key} {...props} />;
    case "apps": return <AppsPanelDetail key={key} {...props} />;
    case "approvals": return <ApprovalsPanelDetail key={key} {...props} />;
    case "skills": return <SkillsPanel key={key} bot={bot} onBack={onBack} />;
    case "memory": return <MemoryPanel key={key} bot={bot} onBack={onBack} />;
    case "routines": return <RoutinesPanelDetail key={key} {...props} />;
    case "voice": return <VoicePanelDetail key={key} {...props} />;
    case "usage": return <UsagePanelDetail key={key} {...props} />;
    case "history": return <HistoryPanelDetail key={key} {...props} />;
    case "overview": return <OverviewPanel key={key} {...props} />;
    case "profile": return <ProfilePanel key={key} {...props} />;
  }
}
