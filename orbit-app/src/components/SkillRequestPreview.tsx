import { reviewedSkillSha256, type SkillRequestCardData } from "../../shared/skill-request";
import { t } from "@/lib/i18n";

/** Render learned instructions as inert plain text. The approval hash binds
 * this exact preview to the staged file the server will promote. */
export function SkillRequestPreview({ request }: { request: SkillRequestCardData }) {
  const reviewedSha256 = reviewedSkillSha256(request);
  if (!reviewedSha256) {
    return (
      <div className="mt-3 rounded-lg border border-[#ff5667]/30 bg-[#ff5667]/5 p-3 text-[12px] leading-relaxed text-[#ff8a96]">
        {t("skillRequestPreview.ui.thisProposalWasCreatedByAn")}
        {request.action === "update" ? " propose the update again." : " create the skill again."}
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-lg border border-ink/[0.1] bg-ink/[0.03] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink/55">
        <span>
          Review the complete SKILL.md before {request.action === "update" ? "replacing the current version" : "enabling"}
        </span>
        <span className="font-mono" title={`sha256 ${reviewedSha256}`}>
          sha256 {reviewedSha256.slice(0, 8)}
        </span>
      </div>
      <div className="mt-1 break-all text-[11px] text-ink/55">Source: {request.source || "Unknown"}</div>
      <pre
        tabIndex={0}
        aria-label={`Full SKILL.md for ${request.name}`}
        className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-ink"
      >
        {request.preview}
      </pre>
    </div>
  );
}
