import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { Check, Cloud, Laptop, Loader2, Trash2 } from "lucide-react";
import { Card } from "./SettingsPrimitives";
import { ComputerSharingSettings } from "./ComputerSharingSettings";
import { useStore } from "@/state/store";
import { sharedComputersEnabled } from "@/lib/feature-flags";

type SavedWorkspaces = Awaited<ReturnType<NonNullable<NonNullable<Window["ogb"]>["environments"]>["state"]>>;

/** These are this desktop's connections, not a fleet administration API. */
export function ConnectedWorkspacesSettings() {
  const bridge = window.ogb?.environments;
  // Computer sharing is off unless this workspace's server turned it on. The
  // desktop bridge alone is not enough: never offer access the server refuses.
  const { state } = useStore();
  const sharingOffered = sharedComputersEnabled(state.config) && Boolean(window.ogb?.computerSharing);
  const [saved, setSaved] = useState<SavedWorkspaces | null>(null);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [computerId, setComputerId] = useState<string | null>(() => new URLSearchParams(window.location?.search ?? "").get("share-computer"));
  const pending = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    void bridge?.state().then((state) => { if (generation.current === current) setSaved(state); })
      .catch(() => { if (generation.current === current) setError(t("workspaces.ui.couldNotLoadSavedWorkspacesPlease")); });
    return () => { generation.current++; };
  }, [bridge]);
  useEffect(() => {
    const consume = (id?: string | null) => {
      if (id) setComputerId(id);
      const url = new URL(window.location.href);
      url.searchParams.delete("share-computer");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    };
    consume();
    return bridge?.onOpenSettings?.(consume);
  }, [bridge]);
  const perform = async (action: () => Promise<unknown>) => {
    if (pending.current || !bridge) return;
    pending.current = true; setBusy(true); setError("");
    const current = generation.current;
    try {
      // A successful switch/connect unloads this local renderer. Do not ask
      // for its privileged saved list again after the active origin changes.
      if (await action() === true) return;
      const state = await bridge.state();
      if (generation.current === current) setSaved(state);
    } catch (nextError) {
      if (generation.current === current) setError(String((nextError as Error)?.message ?? nextError)
        .replace(/^Error invoking remote method '[^']*':\s*(?:Error:\s*)?/, ""));
    } finally {
      pending.current = false;
      if (generation.current === current) setBusy(false);
    }
  };
  if (!bridge) return <p className="text-[13px] text-ink/55">{t("workspaces.ui.manageWorkspaceConnectionsInTheDesktop")}</p>;
  const computerWorkspace = saved?.environments.find(entry => entry.id === computerId);
  return <>
    <p className="text-[13px] leading-relaxed text-ink/55">{t("workspaces.ui.oneDesktopAppWhereverYourBots")}</p>
    <Card title={t("workspaces.ui.yourWorkspaces")} subtitle={t("workspaces.ui.savedOnThisComputerYourHosted")}>
      {!saved ? <p role="status" className="text-[13px] text-ink/55">{error ? "Saved workspaces could not be loaded." : "Loading workspaces…"}</p> :
        <ul className="divide-y divide-hairline/40">
          {[{ id: "local", name: "This computer", origin: "" }, ...saved.environments].map((entry) => {
            const active = entry.id === saved.activeId;
            const Icon = entry.id === "local" ? Laptop : Cloud;
            return <li key={entry.id} className="flex items-center gap-3 py-3">
              <Icon size={18} className="shrink-0 text-ink/55" />
              <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-medium text-ink">{entry.name}</div>
                <div className="break-all text-[12px] text-ink/55">{entry.origin || "Local bots and conversations"}</div></div>
              {active ? <span className="flex shrink-0 items-center gap-1 text-[12px] text-ink/55"><Check size={13} />{t("workspaces.ui.current")}</span> :
                <button type="button" disabled={busy} aria-label={`Switch to ${entry.name}`} onClick={() => void perform(async () => { await bridge.switch(entry.id); return true; })}
                  className="rounded-md px-2 py-1.5 text-[12px] text-ink hover:bg-ink/[0.05] disabled:opacity-50">{t("workspaces.ui.switch")}</button>}
              {entry.id !== "local" && sharingOffered && <button type="button" disabled={busy} aria-label={`Computer access for ${entry.name}`} onClick={() => setComputerId(entry.id)} className="rounded-md px-2 py-1.5 text-[12px] text-ink hover:bg-ink/[0.05]">{t("workspaces.ui.computerAccess")}</button>}
              {entry.id !== "local" && <button type="button" disabled={busy} aria-label={`Forget ${entry.name}`} title={`Forget ${entry.name}`}
                onClick={() => void perform(() => bridge.forget(entry.id))} className="rounded-md p-1.5 text-ink/55 hover:bg-ink/[0.05] hover:text-[#ff8a96] disabled:opacity-50"><Trash2 size={14} /></button>}
            </li>;
          })}
        </ul>}
    </Card>
    {sharingOffered && computerWorkspace && <ComputerSharingSettings key={computerWorkspace.id} workspace={computerWorkspace} onClose={() => setComputerId(null)} />}
    <Card title={t("workspaces.ui.connectHostedWorkspace")} subtitle={t("workspaces.ui.alreadyRunningOrbitOnAVps")}>
      <form className="flex flex-col gap-3" onSubmit={(event) => {
        event.preventDefault();
        if (address.trim()) void perform(() => bridge.addFromLink(address.trim(), name.trim()));
      }}>
        <label className="flex flex-col gap-1.5 text-[12px] text-ink/55">Workspace address or pairing link
          <input required value={address} disabled={busy} onChange={(event) => setAddress(event.target.value)}
            placeholder={t("workspaces.ui.httpsBotsYourcompanyCom")} autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
            className="w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[14px] text-ink outline-none focus:border-ink/30" />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] text-ink/55">Name (optional)
          <input value={name} disabled={busy} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder={t("workspaces.ui.myCloudWorkspace")}
            className="w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[14px] text-ink outline-none focus:border-ink/30" />
        </label>
        <p className="text-[12px] leading-relaxed text-ink/55">{t("workspaces.ui.pasteAPairingLinkFromYour")}</p>
        <details className="text-[12px] text-ink/55"><summary className="cursor-pointer">{t("workspaces.ui.needAPairingCode")}</summary>
          <p className="mt-2">{t("workspaces.ui.runThisOnTheServerAnd")}</p>
          <code className="mt-1 block select-all break-words rounded-md bg-ink/[0.04] px-2 py-2 text-ink">npx orbit pair --label "My desktop"</code>
        </details>
        {error && <p role="alert" className="text-[12px] text-[#ff8a96]">{error}</p>}
        <button type="submit" disabled={busy || !address.trim()} className="flex w-fit items-center gap-2 rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-app disabled:opacity-50">
          {busy && <Loader2 size={14} className="animate-spin" />}Connect workspace
        </button>
      </form>
    </Card>
  </>;
}
