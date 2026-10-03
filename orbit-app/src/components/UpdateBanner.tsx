// Auto-update pill — top centre over the map (design: upd), driven by the
// preload's updater bridge. Renders nothing in the browser/dev (no bridge)
// and while idle/checking; appears only when actionable: an update to
// download, a download in progress, a restart to apply, or an error.
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { ArrowDownToLine, Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { useUpdaterState } from "@/lib/updater";
import { cn } from "@/lib/cn";
import { brand } from "../lib/brand";

// electron-updater surfaces failures as a whole HTTP dump — status line,
// every response header, stack trace. That is unreadable in a 300px popup,
// so name the two cases that actually happen and clip anything else to its
// first line.
function friendlyError(message?: string): string {
  if (!message) return t("update.ui.somethingWentWrong");
  if (/cannot find .*\.yml|404/i.test(message))
    return t("update.ui.noUpdatePublished");
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|net::/i.test(message))
    return t("update.ui.couldNotReachServer");
  return message.split("\n")[0].slice(0, 140);
}

export function UpdateBanner() {
  const s = useUpdaterState();
  // dismissal is per status+version, so the popup returns for the next
  // update (and when an available one finishes downloading)
  const [dismissed, setDismissed] = useState<string | null>(null);
  // A click has to go renderer → main → broadcast before the real status
  // arrives. Latch the pressed button as busy on the same frame so it greys
  // out immediately; the incoming status clears the latch.
  const [pending, setPending] = useState<"download" | "install" | "check" | null>(null);
  const status = s?.status;
  useEffect(() => setPending(null), [status]);

  if (!s || s.status === "idle" || s.status === "checking") return null;
  const key = `${s.status}:${s.version ?? ""}`;
  if (dismissed === key) return null;
  const updater = window.ogb!.updater!;

  // while busy the card owns the moment: no dismissing, no second click
  const installing = s.status === "installing";
  const preparing = s.status === "preparing";
  const busy = s.status === "downloading" || preparing || installing;
  // Ubuntu system packages can't be swapped under a running app, so the
  // command is copied and a terminal opens; the user finishes there.
  // Nothing restarts, and the card has to stop promising that it will.
  const handoff = s.installMode === "handoff";
  // built from this computer's Orbit checkout rather than downloaded
  const source = s.source === true;

  const title =
    s.status === "available"
      ? source ? t("update.ui.sourceAvailable", { app: brand().name, version: s.version ?? "" }) : t("update.ui.available", { app: brand().name, version: s.version ?? "" })
      : s.status === "downloading"
        ? source ? t("update.ui.buildingUpdate") : t("update.ui.downloading", { version: s.version ?? "update" })
        : preparing
          ? t("update.ui.preparingUpdate")
          : s.status === "downloaded"
            ? t("update.ui.ready", { version: s.version ?? "" })
            : installing
              ? handoff
                ? t("update.ui.openingTerminal")
                : t("update.ui.restartingToUpdate")
              : s.status === "handed-off"
                ? t("update.ui.finishInTerminal")
                : t("update.ui.updateFailed");
  const subtitle =
    s.status === "available"
      ? source ? (s.notes?.split("\n")[0] ?? t("update.ui.newCode")) : t("update.ui.newerVersion")
      : s.status === "downloading"
        ? source ? s.message ?? t("update.ui.starting")
        : // no percent yet means the transfer hasn't reported in — don't imply 0
          s.percent == null
          ? t("update.ui.startingDownload")
          : `${Math.round(s.percent)}%`
        : preparing
          ? t("update.ui.macPreparing")
          : s.status === "downloaded"
            ? handoff
              ? t("update.ui.copyInstallCommand")
              : s.signingChanged
                ? t("update.ui.signingChanged")
                : t("update.ui.restartToFinish")
            : installing
              ? handoff
                ? t("update.ui.copyingCommand")
                : s.message || t("update.ui.reopen", { app: brand().name })
              : s.status === "handed-off"
                ? s.terminalOpened
                  ? t("update.ui.commandCopiedOpened")
                  : t("update.ui.commandCopied")
                : s.retryable === false
                  ? t("update.ui.quitAndReopen", { error: friendlyError(s.message?.split(" Quit and reopen ")[0]), app: brand().name })
                  : friendlyError(s.message);

  const failed = s.status === "error";
  const pill = "flex h-[26px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[13px] px-3.5 text-[12.5px] font-semibold";
  const primary = cn(pill, "bg-ink text-app disabled:opacity-50");
  const quiet = cn(pill, "font-medium text-ink/70 hover:text-ink disabled:opacity-50");

  // design: the update pill, top centre over the map; a terminal hand-off
  // shows its command underneath
  return (
    <div role="status" className="animate-pop-in fixed left-1/2 top-[52px] z-50 flex max-w-[calc(100vw-40px)] -translate-x-1/2 flex-col items-center gap-1.5">
      <div className={cn(
        "flex h-9 max-w-full items-center gap-2 rounded-[18px] border bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] py-0 pl-3.5 pr-1.5 shadow-[0_12px_30px_rgba(0,0,0,.4)]",
        failed ? "border-[rgba(255,152,0,.45)]" : "border-ink/[0.14]",
      )}>
        {busy && <Loader2 size={13} className="shrink-0 animate-spin text-ink/60" />}
        <span className={cn("min-w-0 truncate text-[12.5px]", failed ? "text-[#ffb454]" : "text-ink/80")} title={subtitle}>
          <span className="font-semibold">{title}</span> · {subtitle}
        </span>
        {s.status === "downloading" && (
          <span className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-ink/[0.1]">
            <span
              className={cn("block h-full rounded-full bg-ink transition-[width]", s.percent == null && "w-1/4 animate-pulse")}
              style={s.percent == null ? undefined : { width: `${Math.min(100, Math.max(0, s.percent))}%` }}
            />
          </span>
        )}
        {(preparing || installing) && (
          <button disabled className={cn(pill, "bg-ink/[0.08] text-ink/60")}>
            {preparing ? t("update.ui.preparing") : handoff ? t("update.ui.opening") : t("update.ui.restarting")}
          </button>
        )}
        {!busy && s.status === "available" && (
          <button onClick={() => { setPending("download"); void updater.download(); }} disabled={pending !== null} className={primary}>
            {pending === "download" ? <><Loader2 size={12} className="animate-spin" /> {t("update.ui.starting")}</> : <><ArrowDownToLine size={12} /> {source ? t("update.ui.buildUpdate") : t("update.ui.download")}</>}
          </button>
        )}
        {!busy && s.status === "downloaded" && (
          <button onClick={() => { setPending("install"); void updater.install(); }} disabled={pending !== null} className={primary}>
            {pending === "install"
              ? <><Loader2 size={12} className="animate-spin" /> {handoff ? t("update.ui.opening") : t("update.ui.restarting")}</>
              : handoff ? <><PackageOpen size={12} /> {t("update.ui.install")}</> : <><RefreshCw size={12} /> {t("update.ui.restartToUpdate")}</>}
          </button>
        )}
        {!busy && failed && s.retryable !== false && (
          <button onClick={() => { setPending("check"); void updater.check(); }} disabled={pending !== null} className={primary}>
            {pending === "check" ? <><Loader2 size={12} className="animate-spin" /> {t("update.ui.checking")}</> : t("update.ui.tryAgain")}
          </button>
        )}
        {!busy && (
          <button onClick={() => setDismissed(key)} disabled={pending !== null} className={quiet} title={t("update.ui.dismiss")}>
            {/* after a hand-off there is nothing left to postpone */}
            {s.status === "handed-off" || s.retryable === false ? t("update.ui.dismiss") : t("update.ui.later")}
          </button>
        )}
      </div>
      {s.status === "handed-off" && s.command && (
        <code className="block max-w-full overflow-x-auto whitespace-pre rounded-lg border border-ink/[0.1] bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] px-2.5 py-1.5 font-mono text-[11.5px] text-ink/70">
          {s.command}
        </code>
      )}
    </div>
  );
}
