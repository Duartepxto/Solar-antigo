import { useMemo } from "react";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { nextCronRuns, type RoutineCronSchedule } from "../../../shared/routine-schedule";
import type { CronChoice, CronDraft } from "./cron-editor";

const fieldClass = "min-w-0 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]";
const MONTHS = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, index, 1))));
const TIME_ZONES = ["UTC", ...(typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [])];

export function CronRunDates({ runs, timeZone, paused = false }: { runs: number[]; timeZone: string; paused?: boolean }) {
  if (!runs.length) return null;
  const format = new Intl.DateTimeFormat(undefined, { timeZone, weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return <div className="space-y-1 text-[11px] leading-relaxed text-ink/55" aria-label={paused ? "Paused schedule preview" : "Next scheduled runs"}>
    <div className="font-medium">{paused ? "Paused — schedule preview" : "Next runs"} · {timeZone}</div>
    {runs.map((at) => <div key={at}><time dateTime={new Date(at).toISOString()}>{format.format(at)}</time></div>)}
    <div className="pt-1">Clock changes: skipped times shift forward; repeated times run once.</div>
  </div>;
}

export function CronSchedulePreview({ schedule, paused = false }: { schedule: RoutineCronSchedule; paused?: boolean }) {
  const runs = useMemo(() => {
    try { return nextCronRuns(schedule, Date.now(), 3); } catch { return []; }
  }, [schedule]);
  return <CronRunDates runs={runs} timeZone={schedule.timeZone} paused={paused} />;
}

export function CronScheduleFields({ choice, value, onChange, runs, error }: {
  choice: CronChoice; value: CronDraft; onChange: (draft: CronDraft) => void; runs: number[]; error: string;
}) {
  const update = (patch: Partial<CronDraft>) => onChange({ ...value, ...patch });
  return <div className="space-y-3">
    {choice === "cron" ? <label className="block space-y-1.5 text-[11.5px] text-ink/55">
      <span>{t("cron.ui.cronExpression")}</span>
      <input value={value.expression} onChange={(event) => update({ expression: event.target.value })} placeholder="0 9 1 * *" spellCheck={false} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby="routine-cron-help routine-cron-error" className={cn(fieldClass, "w-full font-mono")} />
      <span id="routine-cron-help" className="block text-[11px]">{t("cron.ui.minuteHourDayOfMonthMonth")}</span>
    </label> : <div className="flex flex-wrap items-end gap-2">
      {choice === "yearly" && <label className="space-y-1.5 text-[11.5px] text-ink/55"><span className="block">{t("cron.ui.month")}</span><select value={value.month} onChange={(event) => update({ month: event.target.value })} className={fieldClass}>{MONTHS.map((month, index) => <option key={month} value={String(index + 1)}>{month}</option>)}</select></label>}
      <label className="space-y-1.5 text-[11.5px] text-ink/55"><span className="block">{t("cron.ui.dayOfMonth")}</span><select value={value.day} onChange={(event) => update({ day: event.target.value })} className={fieldClass}>{Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={String(index + 1)}>{index + 1}</option>)}<option value="L">{t("cron.ui.lastDay")}</option></select></label>
      <label className="space-y-1.5 text-[11.5px] text-ink/55"><span className="block">{t("cron.ui.time")}</span><input type="time" step={60} value={value.time} onChange={(event) => update({ time: event.target.value })} className={fieldClass} /></label>
    </div>}
    {choice !== "cron" && Number(value.day) > 28 && <p className="text-[11px] text-ink/55">{t("cron.ui.monthsWithoutThisDateAreSkipped")}</p>}
    <label className="block space-y-1.5 text-[11.5px] text-ink/55"><span>{t("cron.ui.timeZone")}</span><input list="routine-time-zones" value={value.timeZone} onChange={(event) => update({ timeZone: event.target.value })} placeholder={t("cron.ui.americaNewYork")} spellCheck={false} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby="routine-cron-error" className={cn(fieldClass, "block w-full")} /></label>
    <datalist id="routine-time-zones">{TIME_ZONES.map(zone => <option key={zone} value={zone} />)}</datalist>
    {error && <p id="routine-cron-error" role="alert" className="text-[11.5px] text-[#ff8a96]">{error}</p>}
    {!error && <CronRunDates runs={runs} timeZone={value.timeZone.trim()} />}
  </div>;
}
