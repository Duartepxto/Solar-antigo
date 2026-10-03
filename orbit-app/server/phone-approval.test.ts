// The phone's approval-level rules. The route applies these to a real bot;
// the e2e tests (phone-settings-api, admin-activity) prove the wiring.
import { describe, expect, it } from "vitest";

import { checkPhoneApprovalChange, type PhoneApprovalContext } from "./phone-approval.ts";

const ctx = (over: Partial<PhoneApprovalContext> = {}): PhoneApprovalContext => ({
  bot: { approvalMode: "ask", computer: "cloud" },
  botBusy: false,
  threadBusy: false,
  botDriver: "claudeAgent",
  verifiedPhone: true,
  ...over,
});

describe("allowed values", () => {
  it("takes the desktop's levels, nothing else and no other field", () => {
    for (const mode of ["ask", "edits", "auto"]) {
      expect(checkPhoneApprovalChange({ mode }, ctx())).toMatchObject({ ok: true, mode });
    }
    expect(checkPhoneApprovalChange({ mode: "yolo" }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "auto", alwaysAllow: ["Bash"] }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "auto", computer: "local" }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange([], ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "auto", threadId: "../x" }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "full", confirmFullAccess: "yes" }, ctx())).toMatchObject({ ok: false, status: 400 });
  });

  it("offers a level only where the provider has it", () => {
    expect(checkPhoneApprovalChange({ mode: "edits" }, ctx({ botDriver: "codex" }))).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "full", confirmFullAccess: true }, ctx({ botDriver: "unknownAgent" }))).toMatchObject({ ok: false, status: 400 });
    // the open thread's engine counts too
    expect(checkPhoneApprovalChange({ mode: "edits", threadId: "t1" },
      ctx({ thread: { approvalMode: "ask", threadId: "t1" }, threadDriver: "codex" }))).toMatchObject({ ok: false, status: 400 });
  });
});

describe("Full access", () => {
  it("needs the paired-phone channel and an explicit confirmation", () => {
    expect(checkPhoneApprovalChange({ mode: "full", confirmFullAccess: true }, ctx())).toMatchObject({ ok: true, mode: "full" });
    expect(checkPhoneApprovalChange({ mode: "full" }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "full", confirmFullAccess: false }, ctx())).toMatchObject({ ok: false, status: 400 });
    // plain loopback HTTP — a bot with a shell — never gets it
    expect(checkPhoneApprovalChange({ mode: "full", confirmFullAccess: true }, ctx({ verifiedPhone: false }))).toMatchObject({ ok: false, status: 403 });
  });

  it("takes Custom like Full: Codex only, the paired-phone channel and a confirmation", () => {
    expect(checkPhoneApprovalChange({ mode: "custom", confirmCustom: true }, ctx({ botDriver: "codex" }))).toMatchObject({ ok: true, mode: "custom" });
    expect(checkPhoneApprovalChange({ mode: "custom" }, ctx({ botDriver: "codex" }))).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "custom", confirmCustom: true }, ctx({ botDriver: "claudeAgent" }))).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "custom", confirmCustom: true }, ctx({ botDriver: "codex", verifiedPhone: false }))).toMatchObject({ ok: false, status: 403 });
    // leaving Custom: to Ask always, elsewhere only through the paired-phone channel
    expect(checkPhoneApprovalChange({ mode: "ask" }, ctx({ bot: { approvalMode: "custom" }, botDriver: "codex", verifiedPhone: false }))).toMatchObject({ ok: true, mode: "ask" });
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ bot: { approvalMode: "custom" }, botDriver: "codex", verifiedPhone: false }))).toMatchObject({ ok: false, status: 403 });
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ bot: { approvalMode: "custom" }, botDriver: "codex" }))).toMatchObject({ ok: true, mode: "auto" });
  });
});

describe("refusals", () => {
  it("won't change a working bot or thread, except the emergency drop to Ask", () => {
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ botBusy: true }))).toMatchObject({ ok: false, status: 409 });
    expect(checkPhoneApprovalChange({ mode: "auto", threadId: "t1" },
      ctx({ thread: { approvalMode: "ask", threadId: "t1" }, threadBusy: true }))).toMatchObject({ ok: false, status: 409 });
    // the same level while working is a no-op, not a refusal
    expect(checkPhoneApprovalChange({ mode: "ask" }, ctx({ botBusy: true }))).toMatchObject({ ok: true });
    expect(checkPhoneApprovalChange({ mode: "ask" }, ctx({ bot: { approvalMode: "full" }, botBusy: true })))
      .toMatchObject({ ok: true, mode: "ask", emergency: true });
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ bot: { approvalMode: "full" }, botBusy: true }))).toMatchObject({ ok: false, status: 409 });
  });

  it("waits for an elevated change still in flight", () => {
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ bot: { approvalMode: "full", approvalGrant: { phase: "prepared" } } })))
      .toMatchObject({ ok: false, status: 409 });
  });

  it("asks for the local-Auto warning, as the desktop does", () => {
    const local = ctx({ bot: { approvalMode: "ask", computer: "local" } });
    expect(checkPhoneApprovalChange({ mode: "auto" }, local)).toMatchObject({ ok: false, status: 400 });
    expect(checkPhoneApprovalChange({ mode: "auto", acknowledgeLocalAuto: true }, local)).toMatchObject({ ok: true, mode: "auto" });
    // already granted: nothing new to acknowledge
    expect(checkPhoneApprovalChange({ mode: "auto" }, ctx({ bot: { approvalMode: "auto", computer: "local" } }))).toMatchObject({ ok: true });
  });
});
