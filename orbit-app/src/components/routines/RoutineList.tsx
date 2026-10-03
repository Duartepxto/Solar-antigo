import { FileText, Loader2, Repeat2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { Routine, RoutineRun } from "@/lib/routines";
import { scheduleLabel } from "@/lib/schedule-label";
import { latestRoutineRun, routineDateTime, routineNextLabel, routineRunLabel, routineRunTone, routineScheduleState } from "@/lib/routine-display";
import { OrbitFace } from "@/orbit/OrbitFace";
import type { Bot } from "@/state/store";

/** One row per routine, in the Orbit panels' list style: the bot's face,
 * what runs and when, the next run, and a dot for its state. */
export function RoutineList({ routines, runs, bots, loading, error, onOpen, onLogs }: {
  routines: Routine[];
  runs: RoutineRun[];
  bots?: Bot[];
  loading?: boolean;
  error?: boolean;
  onOpen: (routine: Routine) => void;
  onLogs: (routine: Routine) => void;
}) {
  const sorted = [...routines].sort((a, b) => Number(b.enabled) - Number(a.enabled) || (a.nextRunAt ?? Infinity) - (b.nextRunAt ?? Infinity) || a.name.localeCompare(b.name));
  return <div className="flex flex-col gap-0.5" aria-label={t("routines.list")}>
    {error && <div role="alert" className="rounded-[10px] px-2.5 py-2 text-[12.5px] text-[#ff8a96]">{t("routines.loadError")}</div>}
    {loading && <p role="status" className="flex items-center gap-2 px-2.5 py-2 text-[12.5px] text-ink/55"><Loader2 size={14} className="animate-spin" />{t("routines.loading")}</p>}
    {!loading && !error && sorted.length === 0 && <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-ink/[0.12] px-5 py-8 text-center text-[13px] text-ink/55"><Repeat2 size={18} className="opacity-60" />{t("routines.empty")}</div>}
    {sorted.map((routine) => {
      const latest = latestRoutineRun(routine.id, runs);
      const bot = bots?.find((candidate) => candidate.id === routine.botId);
      const active = routine.enabled && routine.nextRunAt != null;
      const failing = Boolean(routine.failureStreak) || latest?.status === "failed" || latest?.status === "missed";
      const note = latest && (latest.attention || latest.error || latest.output);
      return <article key={routine.id} aria-label={routine.name} className="group flex items-start gap-3 rounded-[10px] px-2.5 py-2 hover:bg-ink/[0.05]">
        <OrbitFace id={routine.botId} size={28} className="mt-0.5" label={bot?.name} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <button type="button" onClick={() => onOpen(routine)} className="min-w-0 text-left">
            <span className="block truncate text-[13.5px] font-medium text-ink/90">{routine.name}</span>
            <span className="block truncate text-[12px] text-ink/50">{bot && `${bot.name} · `}{scheduleLabel(routine.schedule)}</span>
          </button>
          {note && <p className={cn("line-clamp-2 whitespace-pre-wrap text-[12px] leading-[1.45]", latest?.error ? "text-[#ff8a96]" : "text-ink/55")}>{note}</p>}
          {!!routine.failureStreak && <p className="text-[12px] text-[#ff8a96]">{t("routines.failureStreak", { count: routine.failureStreak })}</p>}
          {!!routine.skippedRuns && <p className="text-[12px] text-ink/50">
            {t("routines.skippedRuns", { count: routine.skippedRuns })}
            {routine.lastSkippedAt != null && <> · {t("routines.lastSkipped", { date: routineDateTime(routine.lastSkippedAt) })}</>}
          </p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5 pt-0.5 text-right">
          <span className="flex items-center gap-1.5 text-[12px] text-ink/65">
            <span className="size-[7px] rounded-full" style={{ background: failing ? "#ff5667" : active ? "#38d591" : "color-mix(in srgb, var(--color-ink) 22%, transparent)" }} aria-hidden />
            {routineScheduleState(routine)}
          </span>
          {routineNextLabel(routine) !== routineScheduleState(routine) && <span className="text-[12px] text-ink/55">{routineNextLabel(routine)}</span>}
          {latest
            ? <span className={cn("text-[11.5px]", routineRunTone(latest))}>{t("routines.latestRun", { status: routineRunLabel(latest) })} · {routineDateTime(latest.finishedAt ?? latest.startedAt ?? latest.scheduledFor)}</span>
            : <span className="text-[11.5px] text-ink/40">{t("routines.neverRun")}</span>}
        </div>
        <button type="button" onClick={() => onLogs(routine)} aria-label={t("routines.logsFor", { name: routine.name })} title={t("routines.logs")}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink/50 opacity-0 hover:bg-ink/[0.08] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 touch:opacity-70"><FileText size={13} /></button>
      </article>;
    })}
  </div>;
}
