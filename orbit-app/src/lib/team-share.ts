// Share team…: the renderer half of a whole-team export (package format v2).
// The server builds, redacts and validates the document; this side builds
// the request, turns part paths into words, and saves the file. No confirm
// step anywhere. Orbit has no bot pictures, so none are shared.
import { t, tFromServer } from "@/lib/i18n";
import type { LocaleKey } from "@/locales";
import type { PackageDocument, PackageSummary } from "../../shared/package-format";

export type ShareSkipReason =
  | "stdio_server" | "insecure_address"
  | "files_not_shared" | "lead_not_in_group_chat" | "notes_too_large" | "skill_changed";

export interface ShareSkip { part: string; reason: ShareSkipReason | string }

export interface ShareChoices {
  team: string;
  name?: string;
  tagline?: string;
  summary?: string;
  release?: string;
  notes?: string;
  /** "all", or the chosen skill names. */
  skills: "all" | string[];
  includeMemory: boolean;
  dryRun?: boolean;
}

export interface ShareResponse {
  document: PackageDocument;
  filename: string;
  redacted: string[];
  skipped: ShareSkip[];
  summary: PackageSummary;
  choices: { skills: string[] };
}

/** POST /api/teams/export body (package format v2). */
export function shareRequestBody(choices: ShareChoices): Record<string, unknown> {
  const text = (value: string | undefined) => (value?.trim() ? value.trim() : undefined);
  return {
    format: "package",
    version: 2,
    team: choices.team,
    name: text(choices.name),
    tagline: text(choices.tagline),
    summary: text(choices.summary),
    release: text(choices.release),
    notes: text(choices.notes),
    skills: choices.skills,
    includeMemory: choices.includeMemory,
    ...(choices.dryRun ? { dryRun: true } : {}),
  };
}

const FIELD_WORDS: Record<string, LocaleKey> = {
  soul: "teamShare.field.soul",
  seed: "teamShare.field.notes",
  brief: "teamShare.field.brief",
  bulletin: "teamShare.field.bulletin",
  prompt: "teamShare.field.prompt",
  instructions: "teamShare.field.skill",
  mcp: "teamShare.field.address",
  appearance: "teamShare.field.picture",
};

/** "agents[scout].soul" → "Scout · standing instructions"; unknown shapes
 * stay as their path (still readable, never a value). */
export function describePart(part: string, document?: PackageDocument): string {
  const pkg = document?.package;
  const match = /^(agents|rooms|routines|skills|connections|presets|playbooks)\[([^\]]+)\](?:\.([a-zA-Z]+))?/.exec(part);
  if (match) {
    const [, list, key, field] = match;
    const named = list === "agents" ? pkg?.agents.find((agent) => agent.key === key)?.name
      : list === "rooms" ? pkg?.rooms?.find((room) => room.key === key)?.name
      : list === "routines" ? pkg?.routines?.find((routine) => routine.key === key)?.name
      : list === "connections" ? pkg?.connections?.find((connection) => connection.key === key)?.label
      : undefined;
    const who = named ?? key!;
    const words = field
      ? (FIELD_WORDS[field] ? t(FIELD_WORDS[field]) : field)
      : list === "connections" ? t("teamShare.field.connection") : list === "skills" ? t("teamShare.field.skill") : undefined;
    const topic = /\.seed\.memory\["([^"]+)"\]/.exec(part)?.[1];
    return [who, words, topic].filter(Boolean).join(" · ");
  }
  if (part === "team.brief") return t("teamShare.field.brief");
  return part.replace(/^package\./, "");
}

/** A skip line: "Morgan · picture — picture is larger than 64 KB". */
export function describeSkip(skip: ShareSkip, document?: PackageDocument, botNames?: ReadonlyMap<string, string>): string {
  const reason = tFromServer(`teamShare.skip.${skip.reason}`, skip.reason) ?? skip.reason;
  const who = botNames?.get(skip.part) ?? describePart(skip.part, document);
  return `${who} — ${reason}`;
}

/** Save the document as the file other apps read. */
export function saveShareFile(filename: string, document: PackageDocument): void {
  const blob = new Blob([`${JSON.stringify(document, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  try {
    window.document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}
