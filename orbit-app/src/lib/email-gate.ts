// Whether the first-run email step was answered, so it isn't asked again.
// Local to this computer; nothing is reported anywhere (Orbit has no analytics).
const GATE_KEY = "orbit-email-gate";

export function emailGateDone(): boolean {
  try { return Boolean(localStorage.getItem(GATE_KEY)); } catch { return false; }
}

export function setEmailGateDone(status: "submitted" | "skipped") {
  try { localStorage.setItem(GATE_KEY, status); } catch { /* asked again next time */ }
}
