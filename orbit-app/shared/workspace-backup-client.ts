// Exact app-owned browser state that belongs in an encrypted full backup.
// Never include cookies, authentication tokens, connection caches or unknown keys.
export const WORKSPACE_BACKUP_CLIENT_KEYS = [
  "orbit-drafts",
  "orbit-draft-attachments",
  "orbit-draft-send-ids",
  "orbit-draft-channel-modes",
  "orbit-skin",
  "orbit-show-threads",
  "orbit.sidebarDensity",
  "orbit.sidebarCollapsedSections.v1",
  "orbit.sidebarSectionOrder.v1",
  "orbit-analytics-opt-out",
  "orbit.remote-voice.v1",
] as const;

export type WorkspaceBackupClientState = Partial<Record<(typeof WORKSPACE_BACKUP_CLIENT_KEYS)[number], string>>;
