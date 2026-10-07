// The renderer side of the Orbit assistant's desktop shell (macOS, Windows): the bridge types
// (electron/preload.cjs, `orbitShell`) and the hotkey recorder's pure
// helpers, shared by Settings and the shell surfaces.

/** "island": Solar's Alt+J island, registered only in the Solar build. */
export type HotkeyId = "quick" | "talk" | "island";

export interface HotkeyStatus {
  accelerator: string;
  registered: boolean;
  /** "conflict": another app holds it; "invalid": Electron refused it */
  error: "conflict" | "invalid" | null;
  suspended: boolean;
}

export type PermissionStatus = "granted" | "denied" | "not-determined" | "restricted" | "unknown";

export interface OrbitShellState {
  supported: boolean;
  /** The computer's platform ("darwin" | "win32"); older mains leave it out. */
  platform?: string;
  /** Talk mode has a voice engine (native macOS or local Whisper on Windows). */
  voice?: boolean;
  hotkeys: Record<HotkeyId, HotkeyStatus>;
  screenPaused: boolean;
  permissions: { screen: PermissionStatus; microphone: PermissionStatus; accessibility: PermissionStatus };
}

export interface ShellCapture {
  ok: true;
  image: Uint8Array;
  mime: string;
  width: number;
  height: number;
  scaleFactor: number;
  displayId: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export type ShellCaptureResult = ShellCapture | { ok: false; reason: "paused" | "denied" | "failed" };

/** A page an agent shared (src/orbit/artifacts.ts's ArtifactOffer, as wire). */
export interface ShellPage {
  key: string;
  botId: string;
  threadId: string;
  messageId: string;
  href: string;
  file: string;
  kind: string;
}

export interface OverlayMessage {
  border?: boolean;
  point?: { x: number; y: number; label: string; from: { x: number; y: number } | null };
}

export interface OrbitShellBridge {
  state(): Promise<OrbitShellState>;
  setHotkey(id: HotkeyId, accelerator: string): Promise<OrbitShellState>;
  suspendHotkeys(on: boolean): Promise<OrbitShellState>;
  setScreenPaused(paused: boolean): Promise<OrbitShellState>;
  onState(cb: (state: OrbitShellState) => void): () => void;
  onOpenThread(cb: (target: { botId: string; threadId: string }) => void): () => void;
  /** Main page (Solar): a page an agent shared, opened from the island. */
  onOpenPage?(cb: (page: ShellPage) => void): () => void;
  /** Island page (Solar): the pill opened into its panel (true) or closed. */
  islandOpen?(open: boolean): Promise<void>;
  islandHide?(): Promise<void>;
  /** Island page (Solar): bring the app forward on a shared page. */
  openPage?(page: ShellPage): Promise<void>;
  /** Island page (Solar): Alt+J brought the island up. */
  onIslandShown?(cb: () => void): () => void;
  capture(): Promise<ShellCaptureResult>;
  quickResize(height: number): Promise<void>;
  quickHide(): Promise<void>;
  openThread(target: { botId: string; threadId: string } | null): Promise<void>;
  openSettings(): Promise<void>;
  talkState(phase: string): Promise<void>;
  talkInteractive(on: boolean): Promise<void>;
  /** Talk page: the island's size now (window coordinates, the rect that
   * takes a click before its 6-pt margin). */
  islandLook?(look: { width: number; height: number }): Promise<void>;
  /** Talk page: while talk is on screen main watches the pointer and says
   * when it comes over the island (its rect grown by 6 pt) or leaves it;
   * macOS forwards no mouse moves to a click-through panel over the notch
   * or the menu bar. */
  onIslandHover?(cb: (over: boolean) => void): () => void;
  talkDismiss(): Promise<void>;
  /** The character was clicked while resting: summon a new turn, as the hotkey would. */
  talkSummon(): Promise<void>;
  screenHeld(displayId: string | null, held: boolean): Promise<void>;
  point(target: { x: number; y: number; label: string }): Promise<boolean>;
  overlayIdle(): Promise<void>;
  onQuickShown(cb: (info: { screenPaused: boolean }) => void): () => void;
  /** The capture arrives on its own, after the island is already
   * listening (onTalkCapture); `capture` is null then. */
  onTalkSummon(cb: (info: { id?: number; capture: ShellCaptureResult | null; display: { id: string; bounds: ShellCapture["bounds"]; topInset?: number; notch?: { width: number; height: number } | null } }) => void): () => void;
  onTalkCapture(cb: (message: { id: number; capture: ShellCaptureResult }) => void): () => void;
  onTalkToggle(cb: () => void): () => void;
  onOverlay(cb: (message: OverlayMessage) => void): () => void;
  /** Shell pages: this window was shown (true) or hidden (false). Called at
   * once with the last known value, if main has sent one. */
  onVisibility(cb: (visible: boolean) => void): () => void;
}

export function orbitShell(): OrbitShellBridge | undefined {
  return typeof window === "undefined" ? undefined : window.ogb?.orbitShell;
}

/** The desktop platform the shell runs on; macOS where it can't be told
 * (a browser tab, tests). */
export function shellPlatform(): string {
  return (typeof window === "undefined" ? undefined : window.ogb?.platform) ?? "darwin";
}

/** Talk mode uses the shared speech bridge for its platform. */
export function shellHasVoice(platform: string = shellPlatform()): boolean {
  return platform === "darwin" || platform === "win32";
}

interface KeyLike {
  key: string;
  code: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

const CODE_KEYS: Record<string, string> = {
  Space: "Space", Tab: "Tab", Backspace: "Backspace", Delete: "Delete", Insert: "Insert",
  Enter: "Return", NumpadEnter: "Return", ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right",
  Home: "Home", End: "End", PageUp: "PageUp", PageDown: "PageDown",
  Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\", Semicolon: ";",
  Quote: "'", Comma: ",", Period: ".", Slash: "/", Backquote: "`",
};

/**
 * The accelerator a key press spells, from its physical key (`code`): with
 * Option held, macOS turns `key` into a symbol ("Option+S" reads "ß").
 * null while only modifiers are down, or when no Control/Option/Command is
 * held — a global shortcut without one would swallow ordinary typing. On
 * Windows the Windows key is Windows' own (and Electron's "Command" means
 * nothing there): a combination with it is refused.
 */
export function acceleratorFromKeyEvent(event: KeyLike, platform: string = shellPlatform()): string | null {
  let key: string | null = null;
  const letter = /^Key([A-Z])$/.exec(event.code);
  const digit = /^Digit([0-9])$/.exec(event.code);
  const fn = /^F([1-9]|1\d|2[0-4])$/.exec(event.code);
  if (letter) key = letter[1]!;
  else if (digit) key = digit[1]!;
  else if (fn) key = event.code;
  else key = CODE_KEYS[event.code] ?? null;
  if (!key) return null;
  if (!event.ctrlKey && !event.altKey && !event.metaKey) return null;
  if (event.metaKey && platform !== "darwin") return null;
  return [
    event.ctrlKey && "Control",
    event.altKey && "Alt",
    event.shiftKey && "Shift",
    event.metaKey && "Command",
    key,
  ].filter(Boolean).join("+");
}

const SYMBOLS: Record<string, string> = {
  Control: "⌃", Alt: "⌥", Shift: "⇧", Command: "⌘",
  Space: "Space", Return: "↩", Tab: "⇥", Backspace: "⌫", Delete: "⌦",
  Up: "↑", Down: "↓", Left: "←", Right: "→", Escape: "⎋",
};

const WINDOWS_NAMES: Record<string, string> = {
  Control: "Ctrl", Command: "Win", Return: "Enter", Escape: "Esc", Delete: "Del", Insert: "Ins",
  Up: "↑", Down: "↓", Left: "←", Right: "→", PageUp: "PgUp", PageDown: "PgDn",
};

/** "Control+Alt+Space" → "⌃⌥ Space", the way macOS menus show shortcuts;
 * "Ctrl+Alt+Space" on Windows, the way its menus do. */
export function acceleratorLabel(accelerator: string, platform: string = shellPlatform()): string {
  if (!accelerator) return "";
  if (platform !== "darwin") return accelerator.split("+").map((part) => WINDOWS_NAMES[part] ?? part).join("+");
  const parts = accelerator.split("+");
  const key = parts.pop() ?? "";
  const mods = parts.map((part) => SYMBOLS[part] ?? part).join("");
  const shown = SYMBOLS[key] ?? key;
  return shown.length > 1 ? `${mods} ${shown}` : `${mods}${shown}`;
}
