// The Orbit assistant's desktop preferences (macOS, Windows): the two global
// shortcuts with whether the system let Orbit have them, "Pause screen
// access", and, on macOS, the privacy permissions the quick bar and talk mode rely on.
// Windows has no voice engine yet: its talk shortcut is shown off, with why.
import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  acceleratorFromKeyEvent,
  acceleratorLabel,
  orbitShell,
  shellHasVoice,
  shellPlatform,
  type HotkeyId,
  type OrbitShellState,
  type PermissionStatus,
} from "@/lib/orbit-shell";
import { Card, SettingRow, Switch } from "./SettingsPrimitives";

const BUTTON = "rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2.5 py-1 text-[12.5px] text-ink hover:bg-ink/[0.08] disabled:opacity-40";

function ShortcutRow({ id, state, onState }: { id: HotkeyId; state: OrbitShellState; onState: (next: OrbitShellState) => void }) {
  const shell = orbitShell();
  const platform = state.platform ?? shellPlatform();
  const windows = platform === "win32";
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const status = state.hotkeys[id];

  const finish = (accelerator: string | null) => {
    setRecording(false);
    void shell?.suspendHotkeys(false).then(onState);
    if (accelerator === null) return;
    shell?.setHotkey(id, accelerator).then((next) => { setError(""); onState(next); }, (cause: unknown) => {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(message.includes("orbit-shell:duplicate") ? t("orbitShell.settings.duplicate")
        : message.includes("orbit-shell:needs-modifier") ? t(windows ? "orbitShell.settings.needsModifierWindows" : "orbitShell.settings.needsModifier")
          : t("orbitShell.settings.saveFailed"));
    });
  };

  const finishRef = useRef(finish);
  finishRef.current = finish;
  useEffect(() => {
    if (!recording) return;
    const finish = (accelerator: string | null) => finishRef.current(accelerator);
    const onKey = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Escape" && !event.ctrlKey && !event.altKey && !event.metaKey) {
        finish(null);
        return;
      }
      if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) return;
      const accelerator = acceleratorFromKeyEvent(event, platform);
      if (!accelerator) {
        setError(t(windows ? "orbitShell.settings.needsModifierWindows" : "orbitShell.settings.needsModifier"));
        return;
      }
      finish(accelerator);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [recording, platform, windows]);

  const record = () => {
    setError("");
    setRecording(true);
    // The current shortcuts must not fire while the new one is pressed.
    void shell?.suspendHotkeys(true);
    buttonRef.current?.focus();
  };

  const conflict = status.error === "conflict"
    ? t("orbitShell.settings.conflict", { shortcut: acceleratorLabel(status.accelerator, platform) })
    : status.error === "invalid" ? t(windows ? "orbitShell.settings.invalidWindows" : "orbitShell.settings.invalid", { shortcut: acceleratorLabel(status.accelerator, platform) }) : "";

  return (
    <SettingRow
      title={t(id === "quick" ? "orbitShell.settings.quick.title" : "orbitShell.settings.talk.title")}
      subtitle={t(id === "quick" ? "orbitShell.settings.quick.subtitle" : "orbitShell.settings.talk.subtitle")}
      message={(error || conflict) ? <span className="text-[#ff8a96]">{error || conflict}</span> : undefined}
    >
      <div className="flex items-center gap-1.5">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => (recording ? finish(null) : record())}
          onBlur={() => { if (recording) finish(null); }}
          aria-label={t("orbitShell.settings.recordAria", { name: t(id === "quick" ? "orbitShell.settings.quick.title" : "orbitShell.settings.talk.title") })}
          className={cn(
            "min-w-[120px] rounded-lg border px-2.5 py-1 font-mono text-[12.5px]",
            recording ? "border-focus bg-ink/[0.08] text-ink" : "border-ink/[0.1] bg-ink/[0.04] text-ink hover:bg-ink/[0.08]",
            !recording && status.error && "border-[#ff5667]/60",
          )}
        >
          {recording ? t("orbitShell.settings.recording") : status.accelerator ? acceleratorLabel(status.accelerator, platform) : t("orbitShell.settings.none")}
        </button>
        {status.accelerator && !recording && (
          <button type="button" className={BUTTON} onClick={() => finish("")}>{t("orbitShell.settings.clear")}</button>
        )}
      </div>
    </SettingRow>
  );
}

/** Talk mode without a voice engine (Windows): the row stays, off, with why. */
function TalkUnavailableRow() {
  return (
    <SettingRow title={t("orbitShell.settings.talk.title")} subtitle={t("orbitShell.settings.talk.noVoice")}>
      <span className="font-mono text-[12.5px] text-ink/40">{t("orbitShell.settings.none")}</span>
    </SettingRow>
  );
}

const PANES = { screen: "screen", microphone: "mic", accessibility: "accessibility" } as const;

function statusLabel(status: PermissionStatus): string {
  if (status === "granted") return t("orbitShell.settings.status.granted");
  if (status === "denied" || status === "restricted") return t("orbitShell.settings.status.denied");
  if (status === "not-determined") return t("orbitShell.settings.status.notAsked");
  return t("orbitShell.settings.status.unknown");
}

function PermissionRow({ kind, status }: { kind: keyof typeof PANES; status: PermissionStatus }) {
  return (
    <SettingRow title={t(`orbitShell.settings.permission.${kind}`)} subtitle={t(`orbitShell.settings.permission.${kind}Subtitle`)}>
      <div className="flex items-center gap-2">
        <span className={cn("text-[12.5px]", status === "granted" ? "text-ink/70" : status === "denied" ? "text-[#ff8a96]" : "text-ink/50")}>
          {statusLabel(status)}
        </span>
        {status !== "granted" && (
          <button type="button" className={BUTTON} onClick={() => void window.ogb?.permOpenSettings?.(PANES[kind])}>
            {t("orbitShell.openSystemSettings")}
          </button>
        )}
      </div>
    </SettingRow>
  );
}

export function OrbitAssistantSettings() {
  const shell = orbitShell();
  const [state, setState] = useState<OrbitShellState | null>(null);
  useEffect(() => {
    if (!shell) return;
    let live = true;
    void shell.state().then((next) => { if (live) setState(next); }, () => {});
    const off = shell.onState((next) => setState(next));
    // Leaving Settings mid-recording must not leave the shortcuts off.
    return () => { live = false; off(); void shell.suspendHotkeys(false).catch(() => {}); };
  }, [shell]);
  if (!shell || !state) return null;
  const platform = state.platform ?? shellPlatform();
  const voice = state.voice ?? shellHasVoice(platform);
  // Screen Recording, Microphone and Accessibility are macOS privacy switches
  const mac = platform === "darwin";
  return (
    <Card title={t("orbitShell.settings.title")} subtitle={t(voice ? "orbitShell.settings.subtitle" : "orbitShell.settings.subtitleWindows")}>
      <ShortcutRow id="quick" state={state} onState={setState} />
      {voice ? <ShortcutRow id="talk" state={state} onState={setState} /> : <TalkUnavailableRow />}
      <SettingRow title={t("orbitShell.settings.pause.title")} subtitle={t("orbitShell.settings.pause.subtitle")}>
        <Switch
          checked={state.screenPaused}
          aria-label={t("orbitShell.settings.pause.title")}
          onClick={() => void shell.setScreenPaused(!state.screenPaused).then(setState)}
        />
      </SettingRow>
      {mac && (
        <>
          <PermissionRow kind="screen" status={state.permissions.screen} />
          <PermissionRow kind="microphone" status={state.permissions.microphone} />
          <PermissionRow kind="accessibility" status={state.permissions.accessibility} />
        </>
      )}
    </Card>
  );
}
