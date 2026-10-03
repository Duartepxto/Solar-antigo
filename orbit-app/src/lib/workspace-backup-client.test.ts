import { describe, expect, it } from "vitest";
import { applyWorkspaceClientState, collectWorkspaceClientState } from "./workspace-backup-client";

function memory(values: Record<string, string>) {
  const entries = new Map(Object.entries(values));
  return { entries, getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => { entries.set(key, value); }, removeItem: (key: string) => { entries.delete(key); } };
}

describe("full-backup browser state", () => {
  it("exports exact app drafts/preferences, never saved webhook credentials or auth/cache keys", () => {
    const storage = memory({ "orbit-drafts": "draft", "orbit-webhook-credentials": "private URL", "orbit-skin": "daylight", "auth-token": "secret", "orbit-connected-apps": "cached accounts", "orbit-email-gate": "identity", "orbit-pending-workspace-restore": "old" });
    expect(collectWorkspaceClientState(storage)).toEqual({ "orbit-drafts": "draft", "orbit-skin": "daylight" });
  });

  it("replaces only allowlisted keys and clears old drafts absent from the backup", () => {
    const storage = memory({ "orbit-drafts": "old", "orbit-draft-attachments": "old attachment", "auth-token": "keep", "orbit-webhook-credentials": "destination URL" });
    applyWorkspaceClientState({ "orbit-drafts": "restored", "orbit-show-threads": "false" }, storage);
    expect(Object.fromEntries(storage.entries)).toEqual({ "orbit-drafts": "restored", "orbit-show-threads": "false", "auth-token": "keep", "orbit-webhook-credentials": "destination URL" });
  });

  it.each([null, [], { "auth-token": "injected" }, { "orbit-webhook-credentials": "source URL" }, { "orbit-drafts": 1 }])("rejects invalid client state before clearing anything (%j)", (value) => {
    const storage = memory({ "orbit-drafts": "old", "auth-token": "keep" });
    expect(() => applyWorkspaceClientState(value, storage)).toThrow("Invalid backup browser state");
    expect(Object.fromEntries(storage.entries)).toEqual({ "orbit-drafts": "old", "auth-token": "keep" });
  });

  it("rolls browser state back if restored values exceed storage quota", () => {
    const storage = memory({ "orbit-drafts": "old", "orbit-skin": "daylight", "auth-token": "keep" });
    const original = storage.setItem;
    storage.setItem = (key, value) => { if (value === "too large") throw new Error("quota"); original(key, value); };
    expect(() => applyWorkspaceClientState({ "orbit-drafts": "too large" }, storage)).toThrow("quota");
    expect(Object.fromEntries(storage.entries)).toEqual({ "orbit-drafts": "old", "orbit-skin": "daylight", "auth-token": "keep" });
  });
});
