// The open thread's approval level and place, as the chat header's chips
// (design: the approval glyph chip and the works-on chip). Moved out of the
// composer unchanged: the same per-thread writes, busy lock, and the Full
// access and local-computer warnings.
import { useState } from "react";
import { useStore, type Bot } from "@/state/store";
import { useDesktopCapabilities } from "./DesktopCapabilities";
import { approvalModeFor, type ApprovalMode } from "../../shared/approval-mode";
import { useOwnerOrAdmin } from "@/lib/use-owner-or-admin";
import { ApprovalModeSelector } from "./ApprovalModeSelector";
import { CommandAllowlistDialog } from "./CommandAllowlistDialog";
import { FullAccessWarning } from "./FullAccessWarning";
import { LocalComputerAutoWarning } from "./LocalComputerAutoWarning";
import { PlaceChip } from "./PlaceChip";

export function ThreadApprovalChip({ bot }: { bot: Bot }) {
  const { state, dispatch } = useStore();
  const { capabilities } = useDesktopCapabilities();
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const [warning, setWarning] = useState<{ mode: "auto" | "full"; botId: string; threadId: string } | null>(null);
  const ownerOrAdmin = useOwnerOrAdmin();
  const [allowlistTarget, setAllowlistTarget] = useState<{ botId: string; botName: string; threadId: string } | null>(null);
  const engine = state.instances.find((instance) => instance.instanceId === bot.modelSelection.instanceId);
  const trusted = Boolean(!remoteClient && window.ogb?.approvals && capabilities.host.packaged);
  if (!engine || remoteClient) return null;
  const select = (mode: ApprovalMode) => {
    if (bot.busy || mode === approvalModeFor(bot)) return;
    if ((mode === "full" || mode === "custom") && !trusted) return;
    if (mode === "full") { setWarning({ mode, botId: bot.id, threadId: bot.threadId }); return; }
    // Safe Auto still needs its dedicated warning when it can drive the host.
    if (mode === "auto" && bot.computer === "local") { setWarning({ mode: "auto", botId: bot.id, threadId: bot.threadId }); return; }
    dispatch({ type: "updateTask", botId: bot.id, threadId: bot.threadId, patch: { approvalMode: mode } });
  };
  return (
    <>
      <ApprovalModeSelector chip menuDirection="down"
        approvalMode={bot.approvalMode} autoApprove={bot.autoApprove}
        providerName={engine.displayName} driverKind={engine.driverKind}
        onSelect={select} disabled={Boolean(bot.busy)} trustedModesAvailable={trusted}
        onManageCommandAllowlist={ownerOrAdmin === true ? () => setAllowlistTarget({ botId: bot.id, botName: bot.name, threadId: bot.threadId }) : undefined} />
      {allowlistTarget && <CommandAllowlistDialog
        key={`${allowlistTarget.botId}:${allowlistTarget.threadId}`}
        {...allowlistTarget}
        onClose={() => setAllowlistTarget(null)}
      />}
      <FullAccessWarning
        open={warning?.mode === "full"}
        scope="thread"
        onCancel={() => setWarning(null)}
        onConfirm={() => {
          const target = warning;
          setWarning(null);
          if (target?.mode !== "full" || !trusted) return;
          dispatch({ type: "updateTask", botId: target.botId, threadId: target.threadId, patch: { approvalMode: "full", confirmFullAccess: true } });
        }}
      />
      <LocalComputerAutoWarning
        open={warning?.mode === "auto"}
        onCancel={() => setWarning(null)}
        onConfirm={() => {
          if (warning?.mode === "auto") {
            dispatch({ type: "updateTask", botId: warning.botId, threadId: warning.threadId, patch: { approvalMode: "auto", acknowledgeLocalAuto: true } });
          }
          setWarning(null);
        }}
      />
    </>
  );
}

export function ThreadPlaceChip({ bot }: { bot: Bot }) {
  const { dispatch } = useStore();
  if (window.ogb?.remoteClient?.active === true) return null;
  const task = bot.tasks?.find((candidate) => candidate.threadId === bot.threadId);
  return (
    <PlaceChip chip bot={bot} task={task} live={Boolean(bot.busy)} disabled={Boolean(bot.busy)}
      onPin={(surface) => dispatch({ type: "updateTask", botId: bot.id, threadId: bot.threadId, patch: { surface } })} />
  );
}
