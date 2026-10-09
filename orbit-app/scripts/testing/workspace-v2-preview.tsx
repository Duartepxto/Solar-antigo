import { useState } from "react";
import { createRoot } from "react-dom/client";
import { WorkspaceV2 } from "../../src/workspace-v2/WorkspaceV2";
import { BotEditorStore, initialState, type Bot } from "../../src/state/store";
import { setLocale } from "../../src/lib/i18n";
import "../../src/styles.css";
import "../../src/orbit/solar.css";

// Standalone synthetic fixture. No StoreProvider, EventSource or HTTP request:
// its characters cannot read or write the owner's workspace.
const query = new URLSearchParams(window.location.search);
setLocale(query.get("locale") ?? "en");
const bot = (id: string, name: string, title: string, color: Bot["color"], busy = false, waiting = false, section?: string, chiefOfStaff = false): Bot => ({
  id, threadId: `fixture-${id}`, name, title, description: "This agent exists only in the isolated 3D preview fixture.",
  notifications: true, color, unread: false, busy, activity: waiting ? "waiting-on-you" : busy ? "working" : "idle",
  modelSelection: { instanceId: "fixture", model: "fixture" }, messages: [], section, chiefOfStaff,
});
const seeded = [
  bot("fixture-jarvis", "Jarvis", "Team coordinator", "orange"),
  bot("fixture-design", query.has("long") ? "Design and interface research across a very long workspace name" : "Designer", "Design lead", "teal", true, false, "Design", true),
  bot("fixture-research", "Research", "Waiting for your review", "purple", false, true, "Design"),
  bot("fixture-builder", "Builder", "Development lead", "blue", true, false, "Development", true),
  bot("fixture-quality", "Quality", "Testing", "coral", false, false, "Development"),
  bot("fixture-motion", "Motion", "Interaction engineering", "cyan", true, false, "Development"),
];

function Preview() {
  const [result, setResult] = useState<string | null>(null);
  const state = { ...initialState, bots: query.has("empty") || query.has("error") ? [] : seeded,
    connected: !query.has("error") && !query.has("loading"), error: query.has("error") ? "Synthetic connection failure" : null };
  return <BotEditorStore value={{ state, dispatch: () => {}, flushBotPatches: async () => null,
    refreshInstances: async () => {}, refreshModels: async () => {} }}>
    {result ? <div data-fixture-result={result} style={{ padding: 30 }}><p>{result}</p><button onClick={() => setResult(null)}>Return to fixture</button></div>
      : <WorkspaceV2 windowChrome="native" onExit={() => setResult("exit")} onOpenConversation={id => setResult(`conversation:${id}`)} />}
  </BotEditorStore>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
