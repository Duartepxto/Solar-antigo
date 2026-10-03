// The host computer gate's per-call consent: a tools/call that would attach
// to the person's logged-in browser is held until the harness says the
// person allowed it (server/browser-profile-consent.ts). Every other call
// passes untouched.
import { existingProfileCall } from "./browser-profile-target.ts";
import type { ControlClient } from "./control-client.ts";

export function browserProfileConsentCheck(
  client: Pick<ControlClient, "requestBrowserProfile">,
): (frame: { params?: unknown }) => Promise<string | null> {
  return async (frame) => {
    const params = frame.params && typeof frame.params === "object" ? frame.params as Record<string, unknown> : {};
    const target = existingProfileCall(params.name, params.arguments);
    if (!target) return null;
    const answer = await client.requestBrowserProfile(target);
    return answer.allowed ? null : answer.message ?? "This call was NOT performed: the person has not allowed it.";
  };
}
