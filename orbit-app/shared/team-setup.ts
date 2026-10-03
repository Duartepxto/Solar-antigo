import type { GrantableApprovalMode } from "./approval-mode.ts";
import type { ModelSelection } from "./wire.ts";

export interface TeamSetupFields {
  name?: string;
  title?: string;
  description?: string;
  soul?: string;
  /** Create only: the folder the new bot's tools work in. "" = private workspace. */
  cwd?: string;
  section?: string;
  modelSelection?: ModelSelection;
  /** Only on a create: the level the new bot starts on. Never on an update —
   * changing what an existing bot may already be running with is a different
   * decision from choosing where a new one starts. */
  approvalMode?: GrantableApprovalMode;
  chiefOfStaff?: boolean;
}

export interface TeamSetupOperation {
  action: "create" | "update";
  botId: string;
  threadId?: string;
  fields: TeamSetupFields;
  expectedRevision?: string;
}

export interface TeamSetupResult {
  state: "applied" | "denied" | "cancelled" | "failed";
  bots: Array<{ id: string; name: string; action: "created" | "updated" | "deleted"; section?: string; modelSelection?: ModelSelection; chiefOfStaff?: boolean }>;
  newTeams: string[];
  error?: string;
}

/** The complete, reviewed operation.
 *
 * It accepts one executable permission and one only: the level a bot it
 * creates starts on, capped at the Chief's own level and never wider than
 * Auto. A plan carrying any level above Ask is always shown as a card, even
 * for a Chief with Full Access that would otherwise apply its plans
 * immediately — the person sees a permission before it exists. Nothing here
 * changes an existing bot's permissions. */
export interface TeamSetupRequest {
  version: 1;
  requestId: string;
  botId: string;
  threadId: string;
  reason: string;
  createdAt: number;
  requesterRevision: string;
  operations: TeamSetupOperation[];
  newTeams: string[];
  deletion?: { botId: string; name: string; expectedRevision: string };
  result?: TeamSetupResult;
  resumed?: boolean;
}
