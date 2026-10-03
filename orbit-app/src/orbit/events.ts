/** Asks Orbit to fly to a bot and show its view: `detail: { botId }`. The
 * guided tour uses it, since its steps point at controls in the bot view. */
export const ORBIT_FOCUS_EVENT = "orbit:focus-bot";

/** Hides a bot from the map (not an archive): `detail: { botId }`. A
 * per-user layout preference, like dragged positions (spec §5.1). */
export const ORBIT_HIDE_EVENT = "orbit:hide-bot";

/** Asks Orbit to open a place that is not a bot (the ⌘K palette's settings
 * and actions): `detail: OrbitNavTarget`. */
export const ORBIT_NAV_EVENT = "orbit:navigate";

export type OrbitNavTarget =
  | { to: "you"; panel?: string }
  | { to: "bot"; id: string; panel?: string }
  | { to: "team"; key: string }
  | { to: "new" }
  | { to: "library" }
  | { to: "about" }
  | { to: "archived" }
  | { to: "newTeam" }
  | { to: "fit" };

export function orbitNavigate(target: OrbitNavTarget) {
  window.dispatchEvent(new CustomEvent<OrbitNavTarget>(ORBIT_NAV_EVENT, { detail: target }));
}

/** A call's phase, so the bot on the canvas is the one on the line: it
 * talks while it speaks, attends while it listens, thinks while it works.
 * `detail: { botId, phase }`; phase null when the call ends. */
export const ORBIT_CALL_EVENT = "orbit:call-phase";
export type CallPhase = "listening" | "sending" | "working" | "speaking";

export function announceCallPhase(botId: string, phase: CallPhase | null) {
  window.dispatchEvent(new CustomEvent<{ botId: string; phase: CallPhase | null }>(ORBIT_CALL_EVENT, { detail: { botId, phase } }));
}

export function onCallPhase(handler: (botId: string, phase: CallPhase | null) => void): () => void {
  const listener = (event: Event) => {
    const { botId, phase } = (event as CustomEvent<{ botId: string; phase: CallPhase | null }>).detail;
    handler(botId, phase);
  };
  window.addEventListener(ORBIT_CALL_EVENT, listener);
  return () => window.removeEventListener(ORBIT_CALL_EVENT, listener);
}

/** Your words are coming in on a call: You talks on the canvas. */
export const ORBIT_YOU_TALK_EVENT = "orbit:you-talk";
export function announceYouTalking() { window.dispatchEvent(new Event(ORBIT_YOU_TALK_EVENT)); }
export function onYouTalking(handler: () => void): () => void {
  window.addEventListener(ORBIT_YOU_TALK_EVENT, handler);
  return () => window.removeEventListener(ORBIT_YOU_TALK_EVENT, handler);
}

/** A confirmation toast from anywhere in the chrome, optionally with Undo. */
export const ORBIT_TOAST_EVENT = "orbit:toast";

export function orbitToast(text: string, undo?: () => void) {
  window.dispatchEvent(new CustomEvent<{ text: string; undo?: () => void }>(ORBIT_TOAST_EVENT, { detail: { text, undo } }));
}

/** A modal layer is on screen (a dialog, a confirmation, a native <dialog>):
 * Esc belongs to it, not to Orbit's "back one level". */
export function modalLayerOpen(): boolean {
  const layers = document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"], [role="alertdialog"], dialog[open]');
  return [...layers].some((layer) => layer.getClientRects().length > 0);
}

/** The Computer panel (in the bot's column) opening the full-window Local VM
 * workspace, which the app shell owns: `detail: { botId }`. */
const OPEN_VM_WORKSPACE_EVENT = "orbit:open-vm-workspace";

export function requestVmWorkspace(botId: string) {
  window.dispatchEvent(new CustomEvent<{ botId: string }>(OPEN_VM_WORKSPACE_EVENT, { detail: { botId } }));
}

export function onOpenVmWorkspace(handler: (botId: string) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<{ botId: string }>).detail.botId);
  window.addEventListener(OPEN_VM_WORKSPACE_EVENT, listener);
  return () => window.removeEventListener(OPEN_VM_WORKSPACE_EVENT, listener);
}
