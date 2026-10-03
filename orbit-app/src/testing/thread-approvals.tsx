// The real chat/composer against the disposable approval smoke server.
import { createRoot } from "react-dom/client";
import { ChatView, ErrorRow } from "../components/ChatView";
import { DesktopCapabilitiesProvider } from "../components/DesktopCapabilities";
import { StoreProvider, useStore, type Bot } from "../state/store";
import { ApprovalsPanelDetail } from "../orbit/detail/BotPanels";
import { applySkin } from "../lib/skins";
import "../styles.css";

// the Orbit approvals panel, as the bot's column shows it
function Permissions({ bot }: { bot: Bot }) {
  return <div className="orbit-root mx-auto flex max-w-[420px] flex-col p-4"><ApprovalsPanelDetail bot={bot} onBack={() => {}} open={() => {}} /></div>;
}
function Fixture() {
  const { state } = useStore();
  const bot = state.bots.find(candidate => candidate.id === new URLSearchParams(location.search).get("bot"));
  if (new URLSearchParams(location.search).has("permissions")) return <>
    {state.error && <p role="alert">{state.error}</p>}
    {bot && <Permissions bot={bot} />}
  </>;
  return <div className="flex h-screen flex-col bg-app text-ink">
    {state.error && <p role="alert">{state.error}</p>}
    {!new URLSearchParams(location.search).has("model-switch") && <div className="p-4"><ErrorRow message="This task was blocked by our safety systems." onRetry={() => { throw new Error("Safety errors must not expose Retry"); }} /></div>}
    {bot && <div className="min-h-0 flex-1"><ChatView bot={bot} /></div>}
  </div>;
}
applySkin("midnight");
createRoot(document.getElementById("root")!).render(<DesktopCapabilitiesProvider><StoreProvider><Fixture /></StoreProvider></DesktopCapabilitiesProvider>);
