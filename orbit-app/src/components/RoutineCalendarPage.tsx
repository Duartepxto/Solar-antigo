import { cloudRunner } from "@/lib/remote-desktop";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cloud,
  ExternalLink,
  FileText,
  Laptop,
  List,
  Loader2,
  Paperclip,
  Pause,
  Play,
  Plus,
  Repeat2,
  Search,
  Target,
  Trash2,
  UserRoundPlus,
  UsersRound,
  Video,
  Webhook,
  X,
} from "lucide-react";

import { OrbitFace } from "@/orbit/OrbitFace";
import { useBotEditor } from "./bot-settings/BotEditorContext";
import { pathForFile } from "@/components/ComposerAttachments";
import { CalendarSidebar } from "@/components/routines/CalendarSidebar";
import { RoutineList } from "@/components/routines/RoutineList";
import { RoutineLogs } from "@/components/routines/RoutineLogs";
import { ResultsDestination } from "@/components/routines/ResultsDestination";
import { CronScheduleFields, CronSchedulePreview } from "@/components/routines/CronScheduleFields";
import { cronChoiceFor, cronDraftFor, cronEditorValue, isCronChoice, type CronChoice } from "@/components/routines/cron-editor";
import { routineRunLabel } from "@/lib/routine-display";
import { t, tCount } from "@/lib/i18n";
import type { LocaleKey } from "@/locales";
import { useDesktopCapabilities } from "@/components/DesktopCapabilities";
import { WebhooksPanel } from "@/components/WebhooksPanel";
import type { CalendarCall, CalendarCallAttachment, CalendarCallInput } from "@/lib/calendar-calls";
import { cn } from "@/lib/cn";
import {
  imageAttachmentFromFile,
  intakeFiles,
  type Attachment,
} from "@/lib/composer-attachments";
import { MAUS_COLORS } from "@/lib/mascot";
import {
  addDays,
  atLocalTime,
  CALENDAR_SLOT_MINUTES,
  calendarRangeLabel,
  formatGmtOffset,
  fromLocalDateAndTime,
  intervalAnchorForSave,
  nextIntervalForSave,
  packCalendarCollisions,
  projectedRoutineItems,
  scheduleAt,
  slotAt,
  startOfDay,
  startOfWeek,
  toLocalDateInput,
  toLocalTimeInput,
  type RoutineCalendarItem,
} from "@/lib/routine-calendar";
import { DAY_NAMES, durationLabel, intervalLabel, niceDate, niceTime, scheduleLabel } from "@/lib/schedule-label";
import { Switch } from "./SettingsPrimitives";
import { LocalComputerAutoWarning } from "./LocalComputerAutoWarning";
import { approvalModeOptionsFor } from "./ApprovalModeSelector";
import { approvalModeFor } from "../../shared/approval-mode";
import {
  isRoutineProblemRun,
  type Routine,
  type RoutineContextAttachment,
  type RoutineInput,
  type RoutineRunOn,
  type RoutineRun,
  type RoutineRunStatusFilter,
  type RoutineSchedule,
  type RoutineScheduleInput,
  type RoutineTarget,
} from "@/lib/routines";
import { api, openNotificationTarget, useStore, type Bot, type Group } from "@/state/store";

const HOUR_HEIGHT = 64;
const DAY_CHIP_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const INTERVAL_PRESETS = [5, 10, 15, 30, 60];
const EVENT_DURATION_OPTIONS = Array.from({ length: 240 / CALENDAR_SLOT_MINUTES }, (_, index) => (index + 1) * CALENDAR_SLOT_MINUTES);
const BOT_DRAG_TYPE = "application/x-orbit-bot";
const EVENT_DRAG_TYPE = "application/x-orbit-calendar-event";

type EventKind = "routine" | "call";
type CalendarRecurrenceChoice = "none" | "daily" | "weekdays" | "weekly" | "custom";
type RecurrenceChoice = CalendarRecurrenceChoice | "interval" | CronChoice;
type IntervalDayChoice = "every-day" | "weekdays" | "custom";
type IntervalWindowChoice = "all-day" | "custom";
type IntervalEndChoice = "never" | "on-date";

type CallOccurrence = {
  id: string;
  at: number;
  durationMinutes: number;
  call: CalendarCall;
};

type CalendarEventItem =
  | ({ kind: "routine" } & RoutineCalendarItem)
  | ({ kind: "call" } & CallOccurrence);

type EventSeed = {
  kind: EventKind;
  at: number;
  durationMinutes: number;
  botIds: string[];
  name?: string;
  description?: string;
  resultsThreadId?: string | null;
  anchor?: { x: number; y: number };
  routine?: Routine;
  call?: CalendarCall;
};

function activeRoomMembers(group: Group | undefined, bots: Bot[]): Bot[] {
  if (!group) return [];
  return group.memberIds.flatMap((id) => {
    const bot = bots.find((candidate) => candidate.id === id);
    return bot && !bot.hidden ? [bot] : [];
  });
}

function roomCanRunGoal(group: Group): boolean {
  if (group.dm) return false;
  const hasSetupMarker =
    Object.prototype.hasOwnProperty.call(group, "setupCompletedAt") ||
    Object.prototype.hasOwnProperty.call(group, "setupSkippedAt");
  return !hasSetupMarker ||
    group.setupCompletedAt != null ||
    group.setupSkippedAt != null ||
    (group.messages?.length ?? 0) > 0;
}

function preferredRoomLead(group: Group | undefined, bots: Bot[], preferredId?: string): Bot | undefined {
  const members = activeRoomMembers(group, bots);
  const explicitLeadId = group?.defaultResponder.kind === "member" ? group.defaultResponder.botId : undefined;
  return members.find((bot) => bot.id === preferredId)
    ?? members.find((bot) => bot.id === explicitLeadId)
    ?? members.find((bot) => bot.chiefOfStaff)
    ?? members[0];
}

function nextHour(): number {
  const date = new Date(Date.now() + 60 * 60_000);
  date.setMinutes(0, 0, 0);
  return date.getTime();
}

function sameDays(left: readonly number[] | undefined, right: readonly number[]): boolean {
  return Boolean(left && left.length === right.length && left.every((day, index) => day === right[index]));
}

function intervalDayChoice(schedule: RoutineSchedule | CalendarCall["schedule"]): IntervalDayChoice {
  if (schedule.type !== "interval" || !schedule.weekdays || schedule.weekdays.length === 7) return "every-day";
  return sameDays(schedule.weekdays, WEEKDAYS) ? "weekdays" : "custom";
}

function endOfLocalDate(dateInput: string): number {
  const date = new Date(`${dateInput}T00:00`);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}
function recurrenceFor(schedule: RoutineSchedule | CalendarCall["schedule"], at: number): RecurrenceChoice {
  if (schedule.type === "once") return "none";
  if (schedule.type === "interval") return "interval";
  if (schedule.type === "cron") return cronChoiceFor(schedule);
  if (schedule.weekdays.length === 7) return "daily";
  if (schedule.weekdays.join(",") === "1,2,3,4,5") return "weekdays";
  if (schedule.weekdays.length === 1 && schedule.weekdays[0] === new Date(at).getDay()) return "weekly";
  return "custom";
}

function makeCalendarSchedule(choice: CalendarRecurrenceChoice, at: number, weekdays: number[]): CalendarCall["schedule"] {
  if (choice === "none") return { type: "once", at };
  const selected = choice === "daily"
    ? ALL_DAYS
    : choice === "weekdays"
      ? WEEKDAYS
      : choice === "weekly"
        ? [new Date(at).getDay()]
        : weekdays;
  return { type: "daily", time: toLocalTimeInput(at), weekdays: [...selected].sort() };
}

function makeRoutineSchedule(
  choice: Exclude<RecurrenceChoice, CronChoice>,
  at: number,
  weekdays: number[],
  everyMinutes: number,
  interval: {
    anchorAt: number;
    weekdays: number[] | null;
    window: { start: string; end: string } | null;
    endsAt: number | null;
  },
): RoutineScheduleInput {
  if (choice === "interval") return { type: "interval", everyMinutes, ...interval };
  return makeCalendarSchedule(choice, at, weekdays);
}

function projectCalls(calls: CalendarCall[], from: number, to: number): CallOccurrence[] {
  const items: CallOccurrence[] = [];
  for (const call of calls) {
    if (call.schedule.type === "once") {
      if (call.schedule.at >= from && call.schedule.at < to) {
        items.push({ id: `call-${call.id}-${call.schedule.at}`, at: call.schedule.at, durationMinutes: call.durationMinutes, call });
      }
      continue;
    }
    for (let day = startOfDay(from); day < to; day = addDays(day, 1)) {
      if (!call.schedule.weekdays.includes(new Date(day).getDay())) continue;
      const at = atLocalTime(day, call.schedule.time);
      if (at >= from && at < to && at >= call.createdAt) {
        items.push({ id: `call-${call.id}-${at}`, at, durationMinutes: call.durationMinutes, call });
      }
    }
  }
  return items.sort((left, right) => left.at - right.at);
}


function AttachmentChips({
  attachments,
  onRemove,
}: {
  attachments: Array<RoutineContextAttachment | CalendarCallAttachment>;
  onRemove?: (id: string) => void;
}) {
  if (!attachments.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex max-w-[260px] items-center gap-2 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2.5 py-2 text-[12px] text-ink">
          <FileText size={14} className="shrink-0 text-ink" />
          <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
          {onRemove && <button type="button" onClick={() => onRemove(attachment.id)} className="rounded p-0.5 text-ink/55 hover:bg-ink/[0.06] hover:text-ink" aria-label={`Remove ${attachment.name}`}><X size={12} /></button>}
        </div>
      ))}
    </div>
  );
}

function BotPicker({
  bots,
  selected,
  multiple,
  locked,
  onChange,
}: {
  bots: Bot[];
  selected: string[];
  multiple: boolean;
  locked?: boolean;
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = bots.filter((bot) => `${bot.name} ${bot.title}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="rounded-xl border border-ink/[0.1] bg-ink/[0.04] p-2">
      {!locked && bots.length > 5 && (
        <label className="mb-2 flex items-center gap-2 rounded-lg bg-panel px-2.5 py-2 text-ink/55">
          <Search size={14} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("calendar.ui.findABot")} className="min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-ink/40" />
        </label>
      )}
      <div className="grid max-h-48 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
        {filtered.map((bot) => {
          const active = selected.includes(bot.id);
          return (
            <button
              key={bot.id}
              type="button"
              disabled={locked}
              onClick={() => onChange(multiple ? (active ? selected.filter((id) => id !== bot.id) : [...selected, bot.id]) : [bot.id])}
              className={cn("flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left transition", active ? "bg-ink/[0.08] ring-1 ring-ink/30" : "hover:bg-ink/[0.06]", locked && "cursor-default")}
            >
              <OrbitFace id={bot.id} size={32} label={bot.name} />
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{bot.name}</span>
              {active && <CheckCircle2 size={14} className="shrink-0 text-ink" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toContextAttachments(attachments: Attachment[]): Array<RoutineContextAttachment | CalendarCallAttachment> {
  return attachments.flatMap((attachment) => attachment.kind === "paste" ? [] : [{
    id: attachment.id,
    kind: attachment.kind,
    name: attachment.name,
    path: attachment.path,
    size: attachment.size,
  }]);
}

function EventEditor({
  seed,
  bots,
  lockedBotId,
  defaultRunOn,
  routinesOnly = false,
  onClose,
  onSavedCall,
}: {
  seed: EventSeed;
  bots: Bot[];
  lockedBotId?: string;
  defaultRunOn?: RoutineRunOn;
  routinesOnly?: boolean;
  onClose: () => void;
  onSavedCall: (call: CalendarCall) => void;
}) {
  const { state, dispatch } = useStore();
  const inColumn = Boolean(columnSlot());
  const existingRoutine = seed.routine;
  const { request: editorRequest } = useBotEditor();
  const existingCall = seed.call;
  const [kind, setKind] = useState<EventKind>(routinesOnly ? "routine" : seed.kind);
  const [editorOpenedAt] = useState(() => Date.now());
  const [name, setName] = useState(existingRoutine?.name ?? existingCall?.name ?? seed.name ?? "");
  const [description, setDescription] = useState(existingRoutine?.prompt ?? existingCall?.description ?? seed.description ?? "");
  const initialAt = existingRoutine?.schedule.type === "once"
    ? existingRoutine.schedule.at
    : existingRoutine?.schedule.type === "daily"
      ? atLocalTime(seed.at, existingRoutine.schedule.time)
      : existingRoutine?.schedule.type === "interval"
        ? existingRoutine.schedule.anchorAt
      : existingCall?.schedule.type === "once"
        ? existingCall.schedule.at
        : existingCall?.schedule.type === "daily"
          ? atLocalTime(seed.at, existingCall.schedule.time)
          : seed.at;
  const schedule = existingRoutine?.schedule ?? existingCall?.schedule ?? { type: "once" as const, at: initialAt };
  const [date, setDate] = useState(toLocalDateInput(initialAt));
  const [startTime, setStartTime] = useState(toLocalTimeInput(initialAt));
  const [durationMinutes, setDurationMinutes] = useState(existingRoutine?.durationMinutes ?? existingCall?.durationMinutes ?? seed.durationMinutes);
  const [timeoutMinutes, setTimeoutMinutes] = useState<number | null>(
    existingRoutine?.timeoutMinutes ?? null,
  );
  const [intervalTimeoutDefaultApplied, setIntervalTimeoutDefaultApplied] = useState(Boolean(existingRoutine));
  const [overlap, setOverlap] = useState<"skip" | "queue">(existingRoutine?.overlap ?? "skip");
  // "" follows the bot's own default
  const [runsWith, setRunsWith] = useState<"" | "ask" | "edits" | "auto">(existingRoutine?.approvalMode ?? "");
  const [autoWarning, setAutoWarning] = useState(false);
  const [autoAcknowledged, setAutoAcknowledged] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceChoice>(recurrenceFor(schedule, initialAt));
  const [cronDraft, setCronDraft] = useState(() => cronDraftFor(schedule.type === "cron" ? schedule : undefined, initialAt));
  const [cronChanged, setCronChanged] = useState(false);
  const [weekdays, setWeekdays] = useState(schedule.type === "daily" ? schedule.weekdays : [new Date(initialAt).getDay()]);
  const [intervalMinutes, setIntervalMinutes] = useState(schedule.type === "interval" ? schedule.everyMinutes : 15);
  const [intervalDays, setIntervalDays] = useState<IntervalDayChoice>(() => intervalDayChoice(schedule));
  const [intervalWeekdays, setIntervalWeekdays] = useState(() => schedule.type === "interval" && schedule.weekdays?.length
    ? schedule.weekdays
    : [...ALL_DAYS]);
  const [intervalWindow, setIntervalWindow] = useState<IntervalWindowChoice>(schedule.type === "interval" && schedule.window ? "custom" : "all-day");
  const [intervalWindowStart, setIntervalWindowStart] = useState(schedule.type === "interval" ? schedule.window?.start ?? "09:00" : "09:00");
  const [intervalWindowEnd, setIntervalWindowEnd] = useState(schedule.type === "interval" ? schedule.window?.end ?? "17:00" : "17:00");
  const [intervalEnd, setIntervalEnd] = useState<IntervalEndChoice>(schedule.type === "interval" && schedule.endsAt != null ? "on-date" : "never");
  const [intervalEndDate, setIntervalEndDate] = useState(() => schedule.type === "interval" && schedule.endsAt != null
    ? toLocalDateInput(schedule.endsAt)
    : toLocalDateInput(addDays(startOfDay(Math.max(Date.now(), initialAt)), 7)));
  const [botIds, setBotIds] = useState(lockedBotId ? [lockedBotId] : existingRoutine ? [existingRoutine.botId] : existingCall?.botIds ?? seed.botIds);
  const [resultsThreadId, setResultsThreadId] = useState<string | null | undefined>(existingRoutine ? existingRoutine.resultsThreadId : seed.resultsThreadId ?? null);
  const selectBots = (ids: string[]) => {
    if (ids[0] !== botIds[0]) setResultsThreadId(null);
    setBotIds(ids);
  };
  const [routineTarget, setRoutineTarget] = useState<RoutineTarget>(existingRoutine?.target ?? "bot");
  const [groupId, setGroupId] = useState(existingRoutine?.groupId ?? "");
  const [runOn, setRunOn] = useState<RoutineRunOn>(existingRoutine?.runOn ?? defaultRunOn ?? "maus");
  const [attachments, setAttachments] = useState<Array<RoutineContextAttachment | CalendarCallAttachment>>(
    existingRoutine?.target === "room-goal" ? [] : existingRoutine?.attachments ?? existingCall?.attachments ?? [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attachmentNotice, setAttachmentNotice] = useState("");
  const [attachmentPendingCount, setAttachmentPendingCount] = useState(0);
  const attachmentPending = attachmentPendingCount > 0;
  const fileInput = useRef<HTMLInputElement>(null);
  const cloudReady = Boolean(state.config?.box.configured && botIds.length > 0 && botIds.every(id => cloudRunner(state.instances, bots.find(bot => bot.id === id)?.modelSelection.instanceId)?.snapshot.state === "available"));
  const rooms = state.groups.filter(roomCanRunGoal);
  const selectedRoom = rooms.find((group) => group.id === groupId);
  const roomMembers = activeRoomMembers(selectedRoom, state.bots);
  const isRoomGoal = kind === "routine" && routineTarget === "room-goal";
  const at = fromLocalDateAndTime(date, startTime, existingRoutine || existingCall ? initialAt : undefined);
  const endAt = at + durationMinutes * 60_000;
  const selectedBots = botIds.flatMap((id) => bots.find((bot) => bot.id === id) ?? []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const intervalInvalid = recurrence === "interval"
    && (!Number.isInteger(intervalMinutes) || intervalMinutes < 5 || intervalMinutes > 1_440);
  const intervalDaysInvalid = recurrence === "interval" && intervalDays === "custom" && intervalWeekdays.length === 0;
  const intervalWindowMinutes = fromLocalDateAndTime("2000-01-01", intervalWindowEnd)
    - fromLocalDateAndTime("2000-01-01", intervalWindowStart);
  const intervalWindowInvalid = recurrence === "interval"
    && intervalWindow === "custom"
    && (!intervalWindowStart
      || !intervalWindowEnd
      || !Number.isFinite(intervalWindowMinutes)
      || intervalWindowMinutes < intervalMinutes * 60_000);
  const existingIntervalSchedule = existingRoutine?.schedule.type === "interval"
    ? existingRoutine.schedule
    : undefined;
  const intervalEndMinimumAt = nextIntervalForSave(
    editorOpenedAt,
    Math.max(5, intervalMinutes || 5),
    existingIntervalSchedule,
  );
  const intervalEndsAt = intervalEnd === "on-date" ? endOfLocalDate(intervalEndDate) : null;
  const intervalEndInvalid = recurrence === "interval"
    && intervalEnd === "on-date"
    && (intervalEndsAt == null || !Number.isSafeInteger(intervalEndsAt) || intervalEndsAt < intervalEndMinimumAt);
  const selectedIntervalWeekdays = intervalDays === "every-day"
    ? undefined
    : intervalDays === "weekdays"
      ? WEEKDAYS
      : intervalWeekdays;
  const selectedIntervalWindow = intervalWindow === "custom"
    ? { start: intervalWindowStart, end: intervalWindowEnd }
    : undefined;
  const cron = isCronChoice(recurrence)
    ? cronEditorValue(recurrence, cronDraft, editorOpenedAt, !cronChanged && schedule.type === "cron" ? schedule : undefined)
    : null;

  const selectRecurrence = (choice: RecurrenceChoice) => {
    if (choice === "interval" && !intervalTimeoutDefaultApplied) {
      setTimeoutMinutes((current) => current ?? 30);
      setIntervalTimeoutDefaultApplied(true);
    }
    if (isCronChoice(choice)) {
      // Switching from a preset to Advanced starts with what the person chose.
      if (choice === "cron" && cron?.schedule) setCronDraft((draft) => ({ ...draft, expression: cron.schedule!.expression }));
      setCronChanged(true);
    }
    setRecurrence(choice);
  };

  const selectIntervalDays = (choice: IntervalDayChoice) => {
    if (choice === "custom" && intervalDays !== "custom") {
      setIntervalWeekdays(intervalDays === "weekdays" ? [...WEEKDAYS] : [...ALL_DAYS]);
    }
    setIntervalDays(choice);
  };

  const selectRoutineTarget = (target: RoutineTarget) => {
    setRoutineTarget(target);
    if (target === "bot") {
      setGroupId("");
      return;
    }
    setRunOn("maus");
    setAttachments([]);
    setAttachmentNotice("");
    const room = selectedRoom ?? rooms[0];
    setGroupId(room?.id ?? "");
    const lead = preferredRoomLead(room, state.bots, botIds[0]);
    selectBots(lead ? [lead.id] : []);
  };

  const selectRoom = (nextGroupId: string) => {
    const room = rooms.find((candidate) => candidate.id === nextGroupId);
    setGroupId(nextGroupId);
    const lead = preferredRoomLead(room, state.bots, botIds[0]);
    selectBots(lead ? [lead.id] : []);
  };

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length || isRoomGoal) return;
    setAttachmentPendingCount((count) => count + 1);
    try {
      const result = await intakeFiles(Array.from(files), {
        allowImages: true,
        getPath: pathForFile,
        uploadImage: imageAttachmentFromFile,
      });
      const added = toContextAttachments(result.attachments);
      if (added.length) {
        setAttachments((current) => [...current, ...added].slice(0, 20));
        if (runOn === "cloud") setRunOn("maus");
      }
      if (result.notice) setAttachmentNotice(result.notice);
    } finally {
      setAttachmentPendingCount((count) => Math.max(0, count - 1));
    }
  };

  const save = async () => {
    if (attachmentPending) return;
    setSaving(true);
    setError("");
    try {
      if (kind === "routine" || routinesOnly) {
        const savedAt = Date.now();
        const intervalAnchorAt = intervalAnchorForSave(savedAt, intervalMinutes, existingIntervalSchedule);
        if (recurrence === "interval" && intervalEndsAt != null && intervalEndsAt < nextIntervalForSave(savedAt, intervalMinutes, existingIntervalSchedule)) {
          throw new Error("Choose an end date after the first run.");
        }
        const nextSchedule = isCronChoice(recurrence) ? cron?.schedule : makeRoutineSchedule(recurrence, at, weekdays, intervalMinutes, {
          anchorAt: intervalAnchorAt,
          weekdays: selectedIntervalWeekdays ? [...selectedIntervalWeekdays].sort() : null,
          window: selectedIntervalWindow ?? null,
          endsAt: intervalEndsAt,
        });
        if (!nextSchedule) throw new Error(cron?.error || "Choose a valid schedule.");
        const input: RoutineInput = {
          name,
          prompt: description,
          target: routineTarget,
          botId: lockedBotId ?? botIds[0] ?? "",
          groupId: routineTarget === "room-goal" ? groupId : null,
          runOn: routineTarget === "room-goal" ? "maus" : runOn,
          enabled: existingRoutine ? undefined : true,
          schedule: nextSchedule,
          durationMinutes,
          timeoutMinutes,
          overlap,
          ...(routineTarget === "bot" ? { approvalMode: runsWith || null, ...(autoAcknowledged ? { acknowledgeLocalAuto: true } : {}) } : {}),
          attachments: routineTarget === "room-goal" ? [] : attachments as RoutineContextAttachment[],
          ...(routineTarget === "bot" ? { resultsThreadId } : {}),
        };
        const response = await editorRequest(existingRoutine ? `/api/routines/${existingRoutine.id}` : "/api/routines", {
          method: existingRoutine ? "PATCH" : "POST",
          body: JSON.stringify(input),
        });
        dispatch({ type: "routinePatched", routine: response.routine });
      } else {
        if (recurrence === "interval" || isCronChoice(recurrence)) throw new Error("Choose a supported call schedule.");
        const nextSchedule = makeCalendarSchedule(recurrence, at, weekdays);
        const input: CalendarCallInput = {
          name,
          description,
          botIds,
          schedule: nextSchedule,
          durationMinutes,
          attachments: attachments as CalendarCallAttachment[],
        };
        const response = await api(existingCall ? `/api/calendar-calls/${existingCall.id}` : "/api/calendar-calls", {
          method: existingCall ? "PATCH" : "POST",
          body: JSON.stringify(input),
        });
        onSavedCall(response.call);
      }
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  };

  const valid = Boolean(
    name.trim()
    && (kind === "call" || description.trim())
    && (!lockedBotId || botIds[0] === lockedBotId)
    && (kind === "call"
      ? botIds.length > 0
      : routineTarget === "room-goal"
        ? groupId && botIds[0] && roomMembers.some((bot) => bot.id === botIds[0])
        : botIds.length > 0)
    && !intervalInvalid
    && !intervalDaysInvalid
    && !intervalWindowInvalid
    && !intervalEndInvalid
    && !cron?.error,
  );
  const canSwitchKind = !routinesOnly && !existingRoutine && !existingCall && !lockedBotId;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => !element.hasAttribute("hidden"));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = focusable();
      if (!controls.length) return event.preventDefault();
      const first = controls[0]!;
      const last = controls[controls.length - 1]!;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, []);

  return (
    <Layer onClose={onClose} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm">
      <div ref={dialogRef} role="dialog" aria-modal={!inColumn} aria-label={existingRoutine || existingCall ? "Edit calendar event" : "Create calendar event"} tabIndex={-1} className={inColumn ? "flex flex-col outline-none" : "max-h-full w-full max-w-[760px] overflow-y-auto rounded-[14px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)]"}>
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/[0.1] bg-panel/95 px-5 py-3.5 backdrop-blur">
          <div className="text-[15px] font-semibold text-ink">{existingRoutine || existingCall ? "Edit event" : "New event"}</div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/55 hover:bg-ink/[0.06] hover:text-ink" aria-label={t("calendar.ui.close")}><X size={18} /></button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-8">
          {canSwitchKind && (
            <div className="ml-10 inline-flex rounded-lg bg-ink/[0.04] p-1">
              <button type="button" onClick={() => { setKind("routine"); setBotIds((ids) => ids.slice(0, 1)); }} className={cn("rounded-md px-4 py-1.5 text-[12.5px] font-medium", kind === "routine" ? "bg-ink/[0.06] text-ink shadow" : "text-ink/55")}>{t("calendar.ui.routine")}</button>
              <button type="button" onClick={() => { setKind("call"); if (recurrence === "interval" || isCronChoice(recurrence)) setRecurrence("none"); }} className={cn("rounded-md px-4 py-1.5 text-[12.5px] font-medium", kind === "call" ? "bg-ink/[0.06] text-ink shadow" : "text-ink/55")}>{t("calendar.ui.call")}</button>
            </div>
          )}

          {kind === "routine" && !lockedBotId && (
            <div className="ml-10">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink/55">{t("calendar.ui.routineType")}</div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => selectRoutineTarget("bot")}
                  className={cn("flex items-start gap-3 rounded-xl border p-3 text-left transition", routineTarget === "bot" ? "border-ink/30 bg-ink/[0.08]" : "border-ink/[0.1] bg-ink/[0.04] hover:bg-ink/[0.06]")}
                >
                  <UserRoundPlus size={17} className={cn("mt-0.5 shrink-0", routineTarget === "bot" ? "text-ink" : "text-ink/55")} />
                  <span><span className="block text-[12.5px] font-medium text-ink">{t("calendar.ui.botTask")}</span><span className="mt-1 block text-[11px] leading-relaxed text-ink/55">{t("calendar.ui.oneBotOwnsAndCompletesEach")}</span></span>
                </button>
                <button
                  type="button"
                  onClick={() => selectRoutineTarget("room-goal")}
                  className={cn("flex items-start gap-3 rounded-xl border p-3 text-left transition", routineTarget === "room-goal" ? "border-ink/30 bg-ink/[0.08]" : "border-ink/[0.1] bg-ink/[0.04] hover:bg-ink/[0.06]")}
                >
                  <Target size={17} className={cn("mt-0.5 shrink-0", routineTarget === "room-goal" ? "text-ink" : "text-ink/55")} />
                  <span><span className="block text-[12.5px] font-medium text-ink">{t("calendar.ui.teamGoal")}</span><span className="mt-1 block text-[11px] leading-relaxed text-ink/55">{t("calendar.ui.aLeadCoordinatesTheGroupUntil")}</span></span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <span className="mt-3 size-4 shrink-0 rounded bg-ink" />
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={kind === "routine" ? "Add title" : "Add call title"} className="min-w-0 flex-1 border-b border-ink/[0.1] bg-transparent px-1 pb-2 text-[22px] font-medium text-ink outline-none placeholder:text-ink/40 focus:border-ink/40" />
          </div>

          <div className="flex items-start gap-4">
            <Clock3 size={18} className="mt-2.5 shrink-0 text-ink/55" />
            <div className="min-w-0 flex-1 space-y-3">
              {recurrence !== "interval" && !isCronChoice(recurrence) && (
                <div className="flex flex-wrap items-center gap-2">
                  {kind === "routine" && recurrence === "none" && <span className="text-[12px] font-medium text-ink/55">{t("calendar.ui.starts")}</span>}
                  {kind === "routine" && recurrence === "weekly" && <span className="text-[12px] font-medium text-ink/55">{t("calendar.ui.on")}</span>}
                  {(kind === "call" || recurrence === "none" || recurrence === "weekly") && <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]" />}
                  <input type="time" step={CALENDAR_SLOT_MINUTES * 60} value={startTime} onChange={(event) => setStartTime(event.target.value)} className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]" />
                  {kind === "call" && <>
                    <span className="text-[12px] text-ink/55">to</span>
                    <span className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] text-ink">{niceTime(endAt)}</span>
                    <select aria-label={t("calendar.ui.callDuration")} value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/40">
                      {EVENT_DURATION_OPTIONS.map((minutes) => <option key={minutes} value={minutes}>{durationLabel(minutes)}</option>)}
                    </select>
                  </>}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Repeat2 size={14} className="text-ink/55" />
                <select aria-label={t("calendar.ui.repeat")} value={recurrence} onChange={(event) => selectRecurrence(event.target.value as RecurrenceChoice)} className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40">
                  <option value="none">{t("calendar.ui.doesNotRepeat")}</option>
                  {kind === "routine" && <option value="interval">{t("calendar.ui.everyXMinutes")}</option>}
                  <option value="daily">{t("calendar.ui.daily")}</option>
                  <option value="weekdays">Every weekday (Monday to Friday)</option>
                  <option value="weekly">Weekly on {DAY_NAMES[new Date(at).getDay()]}</option>
                  <option value="custom">{t("calendar.ui.selectedWeekdays")}</option>
                  {kind === "routine" && <><option value="monthly">{t("calendar.ui.monthly")}</option><option value="yearly">{t("calendar.ui.yearly")}</option><option value="cron">Custom cron (advanced)</option></>}
                </select>
              </div>
              {kind === "routine" && (
                <p className="text-[11px] leading-relaxed text-ink/55">
                  Runs while Orbit is open on this computer — it cannot wake a sleeping Mac. A run missed by less than 12 hours still happens when the app is back; for 24/7, run Orbit on a VPS.
                </p>
              )}
              {isCronChoice(recurrence) && kind === "routine" && cron && <CronScheduleFields choice={recurrence} value={cronDraft} onChange={(draft) => { setCronDraft(draft); setCronChanged(true); }} runs={cron.runs} error={cron.error} />}
              {recurrence === "custom" && (
                <div className="flex flex-wrap gap-1.5">
                  {DAY_NAMES.map((label, day) => <button key={label} type="button" onClick={() => setWeekdays((current) => current.includes(day) ? (current.length === 1 ? current : current.filter((value) => value !== day)) : [...current, day].sort())} className={cn("size-8 rounded-full text-[10px] font-semibold", weekdays.includes(day) ? "bg-ink text-app" : "bg-ink/[0.04] text-ink/55 hover:bg-ink/[0.06] hover:text-ink")}>{label[0]}</button>)}
                </div>
              )}
              {recurrence === "interval" && kind === "routine" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink">
                    <span className="font-medium">{t("calendar.ui.runsEvery")}</span>
                    <select
                      value={INTERVAL_PRESETS.includes(intervalMinutes) ? String(intervalMinutes) : "custom"}
                      onChange={(event) => setIntervalMinutes(event.target.value === "custom" ? 0 : Number(event.target.value))}
                      aria-label={t("calendar.ui.howOftenThisRoutineRuns")}
                      className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] tabular-nums text-ink outline-none focus:border-ink/40"
                    >
                      {INTERVAL_PRESETS.map((minutes) => <option key={minutes} value={minutes}>{minutes}</option>)}
                      <option value="custom">{t("calendar.ui.custom")}</option>
                    </select>
                    {!INTERVAL_PRESETS.includes(intervalMinutes) && (
                      <input
                        type="number"
                        min={5}
                        max={1_440}
                        step={1}
                        value={intervalMinutes || ""}
                        onChange={(event) => setIntervalMinutes(Number(event.target.value))}
                        aria-label={t("calendar.ui.customIntervalInMinutes")}
                        aria-invalid={intervalInvalid}
                        aria-describedby={intervalInvalid ? "routine-interval-error" : "routine-interval-help"}
                        autoFocus
                        className={cn("w-20 rounded-lg border bg-ink/[0.04] px-3 py-2 text-[12.5px] tabular-nums text-ink outline-none focus:border-ink/40", intervalInvalid ? "border-[#ff5667]/40" : "border-ink/[0.1]")}
                      />
                    )}
                    <span>minutes</span>
                  </div>

                  <div className="grid items-center gap-2 text-[12.5px] text-ink sm:flex sm:flex-wrap">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <span className="font-medium">{t("calendar.ui.on")}</span>
                      <select
                        value={intervalDays}
                        onChange={(event) => selectIntervalDays(event.target.value as IntervalDayChoice)}
                        aria-label={t("calendar.ui.daysThisIntervalRuns")}
                        aria-invalid={intervalDaysInvalid}
                        aria-describedby={intervalDaysInvalid ? "routine-interval-days-error" : undefined}
                        className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40"
                      >
                        <option value="every-day">{t("calendar.ui.everyDay")}</option>
                        <option value="weekdays">{t("calendar.ui.weekdays")}</option>
                        <option value="custom">{t("calendar.ui.custom")}</option>
                      </select>
                    </span>
                    <span aria-hidden="true" className="hidden text-ink/55 sm:inline">·</span>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <span className="font-medium">{t("calendar.ui.during")}</span>
                      <select
                        value={intervalWindow}
                        onChange={(event) => setIntervalWindow(event.target.value as IntervalWindowChoice)}
                        aria-label={t("calendar.ui.hoursThisIntervalRuns")}
                        aria-invalid={intervalWindowInvalid}
                        aria-describedby={intervalWindowInvalid ? "routine-interval-window-error" : undefined}
                        className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40"
                      >
                        <option value="all-day">{t("calendar.ui.allDay")}</option>
                        <option value="custom">{t("calendar.ui.customHours")}</option>
                      </select>
                    </span>
                    <span aria-hidden="true" className="hidden text-ink/55 sm:inline">·</span>
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      <span className="font-medium">{t("calendar.ui.ends")}</span>
                      <select
                        value={intervalEnd}
                        onChange={(event) => setIntervalEnd(event.target.value as IntervalEndChoice)}
                        aria-label={t("calendar.ui.whenThisIntervalEnds")}
                        aria-invalid={intervalEndInvalid}
                        aria-describedby={intervalEndInvalid ? "routine-interval-end-error" : undefined}
                        className="rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40"
                      >
                        <option value="never">{t("calendar.ui.never")}</option>
                        <option value="on-date">{t("calendar.ui.onADate")}</option>
                      </select>
                    </span>
                  </div>

                  {intervalDays === "custom" && (
                    <div>
                      <div className="mb-2 text-[11px] font-medium text-ink/55">{t("calendar.ui.chooseTheDays")}</div>
                      <div
                        role="group"
                        aria-label={t("calendar.ui.customIntervalDays")}
                        aria-invalid={intervalDaysInvalid}
                        aria-describedby={intervalDaysInvalid ? "routine-interval-days-error" : undefined}
                        className="flex flex-wrap gap-1.5"
                      >
                        {DAY_NAMES.map((label, day) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setIntervalWeekdays((current) => current.includes(day)
                              ? current.filter((value) => value !== day)
                              : [...current, day].sort())}
                            aria-label={`${label}, ${intervalWeekdays.includes(day) ? "selected" : "not selected"}`}
                            aria-pressed={intervalWeekdays.includes(day)}
                            className={cn("size-8 rounded-full text-[10px] font-semibold", intervalWeekdays.includes(day) ? "bg-ink text-app" : "bg-ink/[0.04] text-ink/55 hover:bg-ink/[0.06] hover:text-ink")}
                          >
                            {DAY_CHIP_LABELS[day]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {intervalWindow === "custom" && (
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-ink">
                      <span className="font-medium text-ink/55">{t("calendar.ui.runBetween")}</span>
                      <input aria-label={t("calendar.ui.intervalWindowStart")} aria-invalid={intervalWindowInvalid} aria-describedby={intervalWindowInvalid ? "routine-interval-window-error" : undefined} type="time" step={CALENDAR_SLOT_MINUTES * 60} value={intervalWindowStart} onChange={(event) => setIntervalWindowStart(event.target.value)} className={cn("rounded-lg border bg-ink/[0.04] px-3 py-2 text-[13px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]", intervalWindowInvalid ? "border-[#ff5667]/40" : "border-ink/[0.1]")} />
                      <span className="text-ink/55">and</span>
                      <input aria-label={t("calendar.ui.intervalWindowEnd")} aria-invalid={intervalWindowInvalid} aria-describedby={intervalWindowInvalid ? "routine-interval-window-error" : undefined} type="time" step={CALENDAR_SLOT_MINUTES * 60} value={intervalWindowEnd} onChange={(event) => setIntervalWindowEnd(event.target.value)} className={cn("rounded-lg border bg-ink/[0.04] px-3 py-2 text-[13px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]", intervalWindowInvalid ? "border-[#ff5667]/40" : "border-ink/[0.1]")} />
                    </div>
                  )}

                  {intervalEnd === "on-date" && (
                    <label className="flex flex-wrap items-center gap-2 text-[12px] text-ink">
                      <span className="font-medium text-ink/55">{t("calendar.ui.stopSchedulingAfter")}</span>
                      <input aria-label={t("calendar.ui.intervalEndDate")} aria-invalid={intervalEndInvalid} aria-describedby={intervalEndInvalid ? "routine-interval-end-error" : undefined} type="date" min={toLocalDateInput(intervalEndMinimumAt)} value={intervalEndDate} onChange={(event) => setIntervalEndDate(event.target.value)} className={cn("rounded-lg border bg-ink/[0.04] px-3 py-2 text-[13px] text-ink outline-none focus:border-ink/40 [color-scheme:dark]", intervalEndInvalid ? "border-[#ff5667]/40" : "border-ink/[0.1]")} />
                    </label>
                  )}

                  {intervalInvalid && (
                    <div id="routine-interval-error" className="text-[11px] text-[#ff8a96]">{t("calendar.ui.chooseAWholeNumberFrom5")}</div>
                  )}
                  {intervalDaysInvalid && (
                    <div id="routine-interval-days-error" className="text-[11px] text-[#ff8a96]">{t("calendar.ui.chooseAtLeastOneDay")}</div>
                  )}
                  {intervalWindowInvalid && (
                    <div id="routine-interval-window-error" className="text-[11px] text-[#ff8a96]">Choose a same-day window at least {intervalMinutes || 5} minutes long.</div>
                  )}
                  {intervalEndInvalid && (
                    <div id="routine-interval-end-error" className="text-[11px] text-[#ff8a96]">{t("calendar.ui.chooseAnEndDateAfterThe")}</div>
                  )}
                  <div id="routine-interval-help" className="text-[11px] leading-relaxed text-ink/55">{t(overlap === "queue" ? "routines.overlapQueueHelp" : "routines.overlapSkipHelp")}</div>
                </div>
              )}
              {kind === "routine" && routineTarget === "bot" && (() => {
                const owner = state.bots.find((bot) => bot.id === (lockedBotId ?? botIds[0]));
                const driverKind = owner ? state.instances.find((instance) => instance.instanceId === owner.modelSelection.instanceId)?.driverKind ?? "" : "";
                const modes = approvalModeOptionsFor(driverKind).filter((option) => option.mode === "ask" || option.mode === "edits" || option.mode === "auto");
                const ownDefault = owner ? approvalModeFor(owner) : "ask";
                // the same warning as switching the bot itself to Auto on this computer
                const needsWarning = (mode: string) => mode === "auto" && owner?.computer === "local" && ownDefault !== "auto" &&
                  existingRoutine?.approvalMode !== "auto" && !autoAcknowledged;
                return (
                  <div>
                    <label className="flex flex-wrap items-center gap-2 text-[12px] text-ink">
                      <span>{t("routines.runsWith")}</span>
                      <select aria-label={t("routines.runsWith")} value={runsWith}
                        onChange={(event) => {
                          const next = event.target.value as typeof runsWith;
                          if (needsWarning(next)) { setAutoWarning(true); return; }
                          setRunsWith(next);
                        }}
                        className="rounded-lg border border-ink/[0.1] bg-panel px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/40">
                        <option value="">{t("routines.runsWithBot", { name: owner?.name ?? t("routines.theBot"), mode: t(`approvalMode.${ownDefault}.chip` as LocaleKey) })}</option>
                        {modes.map((option) => <option key={option.mode} value={option.mode}>{option.label}</option>)}
                      </select>
                    </label>
                    <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink/55">{t("routines.runsWithHelp")}</p>
                    <LocalComputerAutoWarning
                      open={autoWarning}
                      onCancel={() => setAutoWarning(false)}
                      onConfirm={() => { setAutoWarning(false); setAutoAcknowledged(true); setRunsWith("auto"); }}
                    />
                  </div>
                );
              })()}
              {kind === "routine" && (
                <details className="rounded-xl border border-ink/[0.1] bg-ink/[0.04] px-3 py-2.5">
                  <summary className="cursor-pointer select-none text-[11.5px] font-medium text-ink/55 hover:text-ink">
                    Advanced · {timeoutMinutes == null ? "no run limit" : `${durationLabel(timeoutMinutes)} run limit`}
                  </summary>
                  <div className="mt-3 border-t border-ink/[0.1] pt-3">
                    <label className="flex flex-wrap items-center gap-2 text-[12px] text-ink">
                      <span>{t("calendar.ui.stopIfStillRunningAfter")}</span>
                      <select aria-label={t("calendar.ui.routineSafetyLimit")} value={timeoutMinutes ?? ""} onChange={(event) => setTimeoutMinutes(event.target.value ? Number(event.target.value) : null)} className="rounded-lg border border-ink/[0.1] bg-panel px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/40">
                        <option value="">{t("calendar.ui.noLimit")}</option>
                        {EVENT_DURATION_OPTIONS.map((minutes) => <option key={minutes} value={minutes}>{durationLabel(minutes)}</option>)}
                      </select>
                    </label>
                    <div className="mt-1.5 text-[10.5px] leading-relaxed text-ink/55">{t("calendar.ui.optionalTheClockStartsWhenWork")}</div>
                    {recurrence !== "none" && <div className="mt-3">
                      <label className="flex flex-wrap items-center gap-2 text-[12px] text-ink">
                        <span>{t("routines.overlapLabel")}</span>
                        <select aria-label={t("routines.overlapLabel")} value={overlap} onChange={event => setOverlap(event.target.value === "queue" ? "queue" : "skip")} className="rounded-lg border border-ink/[0.1] bg-panel px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/40">
                          <option value="skip">{t("routines.overlapSkip")}</option>
                          <option value="queue">{t("routines.overlapQueue")}</option>
                        </select>
                      </label>
                      <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink/55">{t(overlap === "queue" ? "routines.overlapQueueHelp" : "routines.overlapSkipHelp")}</p>
                    </div>}
                  </div>
                </details>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            {isRoomGoal ? <UsersRound size={18} className="mt-2.5 shrink-0 text-ink/55" /> : <UserRoundPlus size={18} className="mt-2.5 shrink-0 text-ink/55" />}
            <div className="min-w-0 flex-1">
              {isRoomGoal ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="routine-goal-room" className="mb-2 block text-[12.5px] font-medium text-ink">{t("calendar.ui.chooseAGroup")}</label>
                    {rooms.length > 0 ? (
                      <select id="routine-goal-room" value={groupId} onChange={(event) => selectRoom(event.target.value)} className="w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2.5 text-[12.5px] text-ink outline-none focus:border-ink/40">
                        <option value="">{t("calendar.ui.selectAGroup")}</option>
                        {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                      </select>
                    ) : (
                      <div className="rounded-xl border border-dashed border-ink/[0.1] bg-ink/[0.04] px-3.5 py-3 text-[11.5px] leading-relaxed text-ink/55">{t("calendar.ui.createAGroupFromTheSidebar")}</div>
                    )}
                  </div>
                  {selectedRoom && (
                    <div>
                      <div className="mb-2 text-[12.5px] font-medium text-ink">{t("calendar.ui.chooseTheLead")}</div>
                      {roomMembers.length > 0 ? (
                        <>
                          <BotPicker bots={roomMembers} selected={botIds} multiple={false} onChange={selectBots} />
                          <div className="mt-2 text-[11.5px] text-ink/55">The lead coordinates {selectedRoom.name} and assigns work to its active members.</div>
                        </>
                      ) : (
                        <div className="rounded-xl border border-warning/30 bg-warning/10 px-3.5 py-3 text-[11.5px] text-warning">{t("calendar.ui.thisGroupHasNoActiveMembers")}</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-2 text-[12.5px] font-medium text-ink">{kind === "routine" ? "Assign a bot" : "Add guests"}</div>
                  {bots.length > 0 ? (
                <>
                  <BotPicker bots={bots} selected={botIds} multiple={kind === "call"} locked={Boolean(lockedBotId)} onChange={selectBots} />
                  <div className="mt-2 text-[11.5px] text-ink/55">{kind === "routine" ? "This bot owns each scheduled run." : `${selectedBots.length || "No"} bot${selectedBots.length === 1 ? "" : "s"} invited to the call.`}</div>
                </>
              ) : (
                <button type="button" onClick={() => { dispatch({ type: "toggleNewBot", open: true }); onClose(); }} className="w-full rounded-xl border border-dashed border-ink/30 bg-ink/[0.08] px-4 py-4 text-left hover:bg-ink/[0.08]">
                  <div className="text-[12.5px] font-medium text-ink">{t("calendar.ui.createYourFirstBot")}</div>
                  <div className="mt-1 text-[11.5px] text-ink/55">{t("calendar.ui.aCalendarEventNeedsAtLeast")}</div>
                </button>
                  )}
                </>
              )}
            </div>
          </div>

          {kind === "routine" && !isRoomGoal && <div className="ml-8">
            <ResultsDestination bot={bots.find((bot) => bot.id === botIds[0])} value={resultsThreadId} allowCurrent={Boolean(existingRoutine)} onChange={setResultsThreadId} />
          </div>}
          <div className="flex items-start gap-4">
            <FileText size={18} className="mt-2.5 shrink-0 text-ink/55" />
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} placeholder={isRoomGoal ? "What should the team accomplish?" : kind === "routine" ? "Add instructions for the bot" : "Add description or agenda"} className="min-w-0 flex-1 resize-y rounded-xl border border-ink/[0.1] bg-ink/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-ink outline-none placeholder:text-ink/40 focus:border-ink/40" />
          </div>

          <div className="flex items-start gap-4">
            <Paperclip size={18} className="mt-2.5 shrink-0 text-ink/55" />
            {isRoomGoal ? (
              <div className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-ink/[0.04] px-3.5 py-3">
                <div className="text-[12.5px] font-medium text-ink">{t("calendar.ui.useTheGroupSSharedContext")}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-ink/55">{t("calendar.ui.teamGoalsCannotCarryRoutineAttachments")}</div>
              </div>
            ) : <div className="min-w-0 flex-1 space-y-2">
              <input ref={fileInput} type="file" multiple className="hidden" onChange={(event) => { void pickFiles(event.target.files); event.target.value = ""; }} />
              <button type="button" onClick={() => fileInput.current?.click()} className="rounded-lg border border-ink/[0.1] px-3 py-2 text-[12.5px] font-medium text-ink hover:bg-ink/[0.06]">{t("calendar.ui.addAttachment")}</button>
              <AttachmentChips attachments={attachments} onRemove={(id) => setAttachments((current) => current.filter((attachment) => attachment.id !== id))} />
              <div className="text-[11px] leading-relaxed text-ink/55">
                {kind === "routine"
                  ? "Attachments are passed to each local routine run and excluded from shared team files."
                  : selectedBots.length > 1
                    ? "References will be shared in the group when the event starts."
                    : "References stay with the event and are available when you join the group."}
              </div>
              {attachmentNotice && <div className="text-[11.5px] text-warning">{attachmentNotice}</div>}
            </div>}
          </div>

          {kind === "routine" && (
            <div className="flex items-start gap-4">
              {isRoomGoal ? <Target size={18} className="mt-2.5 shrink-0 text-ink/55" /> : runOn === "cloud" ? <Cloud size={18} className="mt-2.5 shrink-0 text-ink/55" /> : <Laptop size={18} className="mt-2.5 shrink-0 text-ink/55" />}
              <div className="min-w-0 flex-1">
                {isRoomGoal ? (
                  <div className="rounded-xl border border-ink/30 bg-ink/[0.08] p-3">
                    <div className="text-[12.5px] font-medium text-ink">{t("calendar.ui.runsOnThisComputer")}</div>
                    <div className="mt-1 text-[11px] leading-relaxed text-ink/55">{t("calendar.ui.orbitKeepsTheGroupAndIts")}</div>
                  </div>
                ) : <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRunOn("maus")} className={cn("rounded-xl border p-3 text-left", runOn === "maus" ? "border-ink/30 bg-ink/[0.08]" : "border-ink/[0.1] bg-ink/[0.04] hover:bg-ink/[0.06]")}><div className="text-[12.5px] font-medium text-ink">{t("calendar.ui.botSCurrentSetup")}</div><div className="mt-1 text-[11px] text-ink/55">{t("calendar.ui.keepsItsModelAndConfiguredComputer")}</div></button>
                  <button type="button" disabled={!cloudReady || attachments.length > 0} onClick={() => setRunOn("cloud")} className={cn("rounded-xl border p-3 text-left disabled:cursor-not-allowed disabled:opacity-45", runOn === "cloud" ? "border-ink/30 bg-ink/[0.08]" : "border-ink/[0.1] bg-ink/[0.04] hover:bg-ink/[0.06]")}><div className="text-[12.5px] font-medium text-ink">{t("calendar.ui.boatHostedAgent")}</div><div className="mt-1 text-[11px] text-ink/55">{t("calendar.ui.switchesToTheBoatRunnerNot")}</div></button>
                </div>}
              </div>
            </div>
          )}

          {error && <div className="ml-10 flex items-start gap-2 rounded-xl border border-[#ff5667]/40 bg-[#ff5667]/10 px-3 py-2.5 text-[12.5px] text-[#ff8a96]"><CircleAlert size={15} className="mt-0.5 shrink-0" />{error}</div>}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-ink/[0.1] bg-panel/95 px-5 py-3.5 backdrop-blur">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[12.5px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink">{t("calendar.ui.cancel")}</button>
          <button onClick={save} disabled={saving || attachmentPending || !valid} className="flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-[12.5px] font-semibold text-app hover:brightness-110 disabled:opacity-40">{(saving || attachmentPending) && <Loader2 size={14} className="animate-spin" />}{attachmentPending ? "Attaching…" : existingRoutine || existingCall ? "Save" : kind === "call" ? "Schedule call" : isRoomGoal ? "Schedule team goal" : "Schedule routine"}</button>
        </div>
      </div>
    </Layer>
  );
}

function QuickComposer({
  seed,
  bots,
  routinesOnly = false,
  onClose,
  onMore,
  onSavedRoutine,
  onSavedCall,
}: {
  seed: EventSeed;
  bots: Bot[];
  routinesOnly?: boolean;
  onClose: () => void;
  onMore: (seed: EventSeed) => void;
  onSavedRoutine: (routine: Routine) => void;
  onSavedCall: (call: CalendarCall) => void;
}) {
  const { dispatch } = useStore();
  const inColumn = Boolean(columnSlot());
  const [kind, setKind] = useState<EventKind>(routinesOnly ? "routine" : seed.kind);
  const [name, setName] = useState(seed.name ?? "");
  const [description, setDescription] = useState(seed.description ?? "");
  const [botIds, setBotIds] = useState(seed.botIds.length ? seed.botIds : bots[0] ? [bots[0].id] : []);
  const [resultsThreadId, setResultsThreadId] = useState<string | null>(seed.resultsThreadId ?? null);
  const selectBots = (ids: string[]) => {
    if (ids[0] !== botIds[0]) setResultsThreadId(null);
    setBotIds(ids);
  };
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [dialogPosition, setDialogPosition] = useState<{ left: number; top: number } | null>(null);
  const durationMinutes = kind === "routine" ? 30 : seed.durationMinutes;

  useLayoutEffect(() => {
    if (!seed.anchor) {
      setDialogPosition(null);
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    const place = () => {
      const gap = 12;
      const rect = dialog.getBoundingClientRect();
      // on the Orbit canvas the calendar's frame, not the window, holds it
      const frame = dialog.closest("[data-routines-frame]")?.getBoundingClientRect();
      const ox = frame?.left ?? 0, oy = frame?.top ?? 0;
      const W = frame?.width ?? window.innerWidth, H = frame?.height ?? window.innerHeight;
      const ax = seed.anchor!.x - ox, ay = seed.anchor!.y - oy;
      let left = ax + gap;
      let top = ay + gap;
      if (left + rect.width > W - gap) left = ax - rect.width - gap;
      if (top + rect.height > H - gap) top = ay - rect.height - gap;
      setDialogPosition({
        left: Math.max(gap, Math.min(left, W - rect.width - gap)),
        top: Math.max(gap, Math.min(top, H - rect.height - gap)),
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [kind, seed.anchor]);

  const save = async () => {
    setWorking(true);
    setError("");
    try {
      if (kind === "routine" || routinesOnly) {
        const response = await api("/api/routines", {
          method: "POST",
          body: JSON.stringify({
            name,
            prompt: description,
            botId: botIds[0],
            runOn: "maus",
            enabled: true,
            schedule: { type: "once", at: seed.at },
            durationMinutes,
            attachments: [],
            resultsThreadId,
          } satisfies RoutineInput),
        });
        onSavedRoutine(response.routine);
      } else {
        const response = await api("/api/calendar-calls", {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            botIds,
            schedule: { type: "once", at: seed.at },
            durationMinutes,
          } satisfies CalendarCallInput),
        });
        onSavedCall(response.call);
      }
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setWorking(false);
    }
  };

  const valid = Boolean(name.trim() && botIds.length && (kind === "call" || description.trim()));
  return (
    <Layer onClose={onClose} backdrop="contents">
    <div ref={dialogRef} role="dialog" aria-label={t("calendar.ui.quickCreate")} style={inColumn ? undefined : dialogPosition ?? undefined} className={inColumn ? "flex flex-col" : cn("fixed z-50 max-h-[calc(100vh-24px)] w-[min(430px,calc(100vw-24px))] overflow-y-auto rounded-[14px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)]", !dialogPosition && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")}>
      <div className="flex items-center justify-between bg-ink/[0.06] px-4 py-2.5">
        <div className="text-[12px] font-medium text-ink/55">{t("calendar.ui.newCalendarEvent")}</div>
        <button onClick={onClose} className="rounded-full p-1.5 text-ink/55 hover:bg-ink/[0.04] hover:text-ink" aria-label={t("calendar.ui.close")}><X size={16} /></button>
      </div>
      <div className="space-y-3 p-4">
        <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={t("calendar.ui.addTitle")} onKeyDown={(event) => { if (event.key === "Enter" && valid) void save(); }} className="w-full border-b border-ink/[0.1] bg-transparent pb-2 text-[18px] font-medium text-ink outline-none placeholder:text-ink/40 focus:border-ink/40" />
        {!routinesOnly && (
          <div className="flex items-center gap-1 border-b border-ink/[0.1] pb-2">
            <button type="button" onClick={() => { setKind("routine"); setBotIds((ids) => ids.slice(0, 1)); }} className={cn("rounded-lg px-3 py-1.5 text-[12px] font-medium", kind === "routine" ? "bg-ink/[0.08] text-ink" : "text-ink/55 hover:bg-ink/[0.06] hover:text-ink")}>{t("calendar.ui.routine")}</button>
            <button type="button" onClick={() => setKind("call")} className={cn("rounded-lg px-3 py-1.5 text-[12px] font-medium", kind === "call" ? "bg-ink/[0.08] text-ink" : "text-ink/55 hover:bg-ink/[0.06] hover:text-ink")}>{t("calendar.ui.call")}</button>
          </div>
        )}
        <div className="flex items-start gap-3 text-[12.5px] text-ink">
          <Clock3 size={16} className="mt-0.5 shrink-0 text-ink/55" />
          <div><div>{niceDate(seed.at)}</div><div className="mt-0.5 text-ink/55">{niceTime(seed.at)}{kind === "call" ? ` – ${niceTime(seed.at + durationMinutes * 60_000)}` : ""}</div></div>
        </div>
        <div className="flex items-start gap-3">
          <UserRoundPlus size={16} className="mt-2.5 shrink-0 text-ink/55" />
          {bots.length === 0 ? (
            <button type="button" onClick={() => { dispatch({ type: "toggleNewBot", open: true }); onClose(); }} className="min-w-0 flex-1 rounded-xl border border-dashed border-ink/30 bg-ink/[0.08] px-3 py-3 text-left hover:bg-ink/[0.08]">
              <div className="text-[12px] font-medium text-ink">{t("calendar.ui.createYourFirstBot")}</div>
              <div className="mt-0.5 text-[10.5px] text-ink/55">{t("calendar.ui.thenComeBackToScheduleIt")}</div>
            </button>
          ) : kind === "routine" ? (
            <select value={botIds[0] ?? ""} onChange={(event) => selectBots([event.target.value])} className="min-w-0 flex-1 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-ink/40">
              <option value="">{t("calendar.ui.assignABot")}</option>
              {bots.map((bot) => <option key={bot.id} value={bot.id}>{bot.name}</option>)}
            </select>
          ) : (
            <div className="min-w-0 flex-1"><BotPicker bots={bots} selected={botIds} multiple onChange={selectBots} /></div>
          )}
        </div>
        <div className="flex items-start gap-3">
          <FileText size={16} className="mt-2.5 shrink-0 text-ink/55" />
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder={kind === "routine" ? "What should the bot do?" : "Add a description (optional)"} className="min-w-0 flex-1 resize-none rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[12.5px] leading-relaxed text-ink outline-none placeholder:text-ink/40 focus:border-ink/40" />
        </div>
        {kind === "routine" && <ResultsDestination bot={bots.find((bot) => bot.id === botIds[0])} value={resultsThreadId} onChange={(threadId) => setResultsThreadId(threadId ?? null)} />}
        {error && <div className="rounded-lg bg-[#ff5667]/10 px-3 py-2 text-[11.5px] text-[#ff8a96]">{error}</div>}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-ink/[0.1] px-4 py-3">
        <button onClick={() => onMore({ ...seed, kind, botIds, name, description, durationMinutes, resultsThreadId })} title={t("calendar.ui.chooseRepeatingSchedulesAndOtherOptions")} className="rounded-lg px-3 py-2 text-[12px] font-medium text-ink hover:bg-ink/[0.08]">{t("calendar.ui.moreOptions")}</button>
        <button onClick={save} disabled={!valid || working} className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-app hover:brightness-110 disabled:opacity-40">{working && <Loader2 size={13} className="animate-spin" />}Save</button>
      </div>
    </div>
    </Layer>
  );
}

function CalendarEventCard({
  item,
  bots,
  groups,
  compact,
  layout,
  onOpen,
  onResize,
}: {
  item: CalendarEventItem;
  bots: Bot[];
  groups: Group[];
  compact: boolean;
  layout: { column: number; columns: number };
  onOpen: () => void;
  onResize: (minutes: number) => void;
}) {
  const isCall = item.kind === "call";
  const routine = item.kind === "routine" ? item.routine : null;
  const run = item.kind === "routine" ? item.run : null;
  const isRoomGoal = !isCall && (run?.target ?? routine?.target) === "room-goal";
  const room = isRoomGoal
    ? groups.find((candidate) => candidate.id === (run?.groupId ?? routine?.groupId))
    : undefined;
  const ownerIds = isCall ? item.call.botIds : [run?.botId ?? routine?.botId ?? ""];
  const ownerBots = ownerIds.flatMap((id) => bots.find((bot) => bot.id === id) ?? []);
  const primary = ownerBots[0];
  const name = isCall ? item.call.name : run?.routineName ?? routine?.name ?? "Routine";
  const color = isCall ? "#6d7cff" : primary ? MAUS_COLORS[primary.color] : "#666";
  const [previewDuration, setPreviewDuration] = useState(item.durationMinutes);
  useEffect(() => setPreviewDuration(item.durationMinutes), [item.durationMinutes]);
  const status = run?.status;
  const statusLabel = run ? routineRunLabel(run) : undefined;
  const canMove = isCall || Boolean(routine && !run && routine.schedule.type !== "cron");
  const schedule = isCall ? item.call.schedule : routine?.schedule;
  const recurring = Boolean(schedule && schedule.type !== "once");
  const intervalCadence = schedule?.type === "interval" ? intervalLabel(schedule.everyMinutes) : null;

  const beginResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const startY = event.clientY;
    const startDuration = previewDuration;
    let next = startDuration;
    const move = (pointer: PointerEvent) => {
      next = Math.max(CALENDAR_SLOT_MINUTES, Math.min(240, Math.round((startDuration + ((pointer.clientY - startY) / HOUR_HEIGHT) * 60) / CALENDAR_SLOT_MINUTES) * CALENDAR_SLOT_MINUTES));
      setPreviewDuration(next);
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      if (next === item.durationMinutes) return;
      if (recurring && !window.confirm("Resize this entire recurring series?")) {
        setPreviewDuration(item.durationMinutes);
        return;
      }
      onResize(next);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up, { once: true });
  };

  return (
    <button
      data-event-card
      type="button"
      draggable={canMove}
      title={routine?.schedule.type === "cron" ? "Open this routine to edit its repeating schedule and time zone." : undefined}
      onDragStart={(event) => {
        if (!canMove) return event.preventDefault();
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(EVENT_DRAG_TYPE, JSON.stringify({ kind: item.kind, id: isCall ? item.call.id : routine!.id, at: item.at }));
      }}
      onClick={(event) => { event.stopPropagation(); onOpen(); }}
      className={cn("group absolute z-10 overflow-hidden rounded-[8px] border text-left transition hover:z-20 hover:brightness-125 focus:z-20 focus:outline-none focus:ring-2 focus:ring-ink/40", previewDuration < 30 ? "px-1.5 py-0" : "px-2 py-1.5", status === "cancelled" && "opacity-55")}
      style={{
        left: `calc(${(layout.column / layout.columns) * 100}% + 2px)`,
        width: `calc(${100 / layout.columns}% - 4px)`,
        top: `${((new Date(item.at).getHours() * 60 + new Date(item.at).getMinutes()) / 60) * HOUR_HEIGHT}px`,
        height: `${Math.max(16, (previewDuration / 60) * HOUR_HEIGHT)}px`,
        // the bot's colour, quietly: a tint, a hairline, and a bar on the left
        background: `color-mix(in srgb, ${color} 18%, var(--color-panel))`,
        borderColor: status === "failed" || status === "missed" ? "#ff566799" : `color-mix(in srgb, ${color} 34%, transparent)`,
        boxShadow: `inset 2px 0 0 ${color}`,
      }}
    >
      <div className="flex min-w-0 items-start gap-1.5 text-ink">
        {previewDuration >= 30 && (isCall ? <Video size={compact ? 11 : 13} className="mt-0.5 shrink-0 text-ink/70" /> : primary ? <OrbitFace id={primary.id} size={compact ? 18 : 20} label={primary.name} /> : null)}
        <div className="min-w-0 flex-1">
          {/* under 45 minutes there is room for one line: the time rides along */}
          <div className={cn("truncate text-[11.5px] font-medium", previewDuration < 30 ? "leading-none" : "leading-tight")}>{previewDuration < 45 && <span className="mr-1.5 font-mono text-[9.5px] font-normal text-ink/55">{niceTime(item.at)}</span>}{name}</div>
          {previewDuration >= 45 && <div className="mt-0.5 truncate font-mono text-[9.5px] text-ink/55">{niceTime(item.at)} · {intervalCadence ?? (isCall ? `${ownerBots.length} bot${ownerBots.length === 1 ? "" : "s"}` : isRoomGoal ? `Team goal · ${room?.name ?? "Group"}${statusLabel ? ` · ${statusLabel}` : ""}` : statusLabel ?? primary?.name)}</div>}
        </div>
        {previewDuration >= 30 && ownerBots.length > 1 && <span className="rounded-full bg-ink/[0.1] px-1.5 py-0.5 font-mono text-[8.5px] text-ink/70">+{ownerBots.length - 1}</span>}
      </div>
      {isCall && <div onPointerDown={beginResize} className="absolute inset-x-1 bottom-0 h-1.5 cursor-ns-resize rounded-full opacity-0 transition group-hover:opacity-100" aria-label={t("calendar.ui.resizeEvent")}><div className="mx-auto mt-0.5 h-0.5 w-5 rounded-full bg-ink/50" /></div>}
    </button>
  );
}

function CalendarGrid({
  anchor,
  days,
  items,
  bots,
  groups,
  onOpen,
  onCreate,
  onMove,
  onResize,
}: {
  anchor: number;
  days: number;
  items: CalendarEventItem[];
  bots: Bot[];
  groups: Group[];
  onOpen: (item: CalendarEventItem) => void;
  onCreate: (seed: EventSeed) => void;
  onMove: (item: { kind: EventKind; id: string; at: number }, nextAt: number) => void;
  onResize: (item: CalendarEventItem, duration: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{ day: number; start: number; end: number } | null>(null);
  const [dragPreview, setDragPreview] = useState<{ day: number; at: number } | null>(null);
  const today = startOfDay(Date.now());
  const starts = Array.from({ length: days }, (_, index) => addDays(anchor, index));
  const minDayWidth = days === 7 ? 88 : days === 3 ? 180 : 340;
  const gridTemplateColumns = `64px repeat(${days}, minmax(${minDayWidth}px, 1fr))`;
  const minWidth = 64 + days * minDayWidth;

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    // open on the day's work: an hour before the first event in view, or
    // two hours before now when nothing is scheduled
    const first = items.reduce((min, item) => Math.min(min, new Date(item.at).getHours() * 60 + new Date(item.at).getMinutes()), Infinity);
    const hour = Number.isFinite(first) ? Math.max(0, Math.floor(first / 60) - 1) : starts.includes(today) ? Math.max(0, new Date().getHours() - 2) : 7;
    viewport.scrollTo({ top: hour * HOUR_HEIGHT });
  }, [days, anchor]);

  const beginSelection = (event: ReactPointerEvent<HTMLDivElement>, day: number) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("[data-event-card]")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const start = slotAt(day, event.clientY, rect.top, HOUR_HEIGHT);
    let end = start + 30 * 60_000;
    setSelection({ day, start, end });
    const move = (pointer: PointerEvent) => {
      const current = slotAt(day, pointer.clientY, rect.top, HOUR_HEIGHT);
      end = Math.max(start + CALENDAR_SLOT_MINUTES * 60_000, current + CALENDAR_SLOT_MINUTES * 60_000);
      setSelection({ day, start, end });
    };
    const up = (pointer: PointerEvent) => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      setSelection(null);
      onCreate({ kind: "routine", at: start, durationMinutes: Math.max(CALENDAR_SLOT_MINUTES, Math.round((end - start) / 60_000)), botIds: [], anchor: { x: pointer.clientX, y: pointer.clientY } });
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up, { once: true });
  };

  const drop = (event: ReactDragEvent<HTMLDivElement>, day: number) => {
    event.preventDefault();
    setDragPreview(null);
    const rect = event.currentTarget.getBoundingClientRect();
    const at = slotAt(day, event.clientY, rect.top, HOUR_HEIGHT);
    const botId = event.dataTransfer.getData(BOT_DRAG_TYPE);
    if (botId) return onCreate({ kind: "routine", at, durationMinutes: 30, botIds: [botId], anchor: { x: event.clientX, y: event.clientY } });
    const raw = event.dataTransfer.getData(EVENT_DRAG_TYPE);
    if (!raw) return;
    try {
      const item = JSON.parse(raw) as { kind: EventKind; id: string; at: number };
      onMove(item, at);
    } catch {
      // Ignore drags from another application.
    }
  };

  const previewDrop = (event: ReactDragEvent<HTMLDivElement>, day: number) => {
    if (!event.dataTransfer.types.includes(BOT_DRAG_TYPE) && !event.dataTransfer.types.includes(EVENT_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes(EVENT_DRAG_TYPE) ? "move" : "copy";
    const rect = event.currentTarget.getBoundingClientRect();
    const at = slotAt(day, event.clientY, rect.top, HOUR_HEIGHT);
    setDragPreview((current) => current?.day === day && current.at === at ? current : { day, at });
  };

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
      <div className="sticky top-0 z-30 grid backdrop-blur-md" style={{ gridTemplateColumns, minWidth }}>
        <div className="flex items-end justify-end px-2 pb-2.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink/35">{formatGmtOffset(-new Date(anchor).getTimezoneOffset())}</div>
        {starts.map((start) => {
          const date = new Date(start);
          const isToday = start === today;
          return <div key={start} role="columnheader" className="flex flex-col items-center gap-1 px-2 pb-2 pt-1"><div className={cn("font-mono text-[10px] uppercase tracking-[0.1em]", isToday ? "text-ink" : "text-ink/45")}>{DAY_NAMES[date.getDay()]}</div><div className={cn("flex size-7 items-center justify-center rounded-full text-[14px] font-medium tabular-nums", isToday ? "bg-ink text-app" : "text-ink/85")}>{date.getDate()}</div></div>;
        })}
      </div>
      <div role="grid" aria-label={t("calendar.ui.routineAndCallCalendar")} onDragEnd={() => setDragPreview(null)} className="relative grid" style={{ height: HOUR_HEIGHT * 24, gridTemplateColumns, minWidth }}>
        <div className="relative">
          {Array.from({ length: 24 }, (_, hour) => <div key={hour} className="absolute right-2 -translate-y-1/2 font-mono text-[9.5px] tabular-nums text-ink/35" style={{ top: hour * HOUR_HEIGHT }}>{hour === 0 ? "" : new Date(2000, 0, 1, hour).toLocaleTimeString([], { hour: "numeric" })}</div>)}
        </div>
        {starts.map((start) => {
          const now = new Date();
          const nowTop = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT;
          const dayItems = items.filter((item) => startOfDay(item.at) === start);
          const collisionLayouts = packCalendarCollisions(dayItems);
          const selected = selection?.day === start ? selection : null;
          const preview = dragPreview?.day === start ? dragPreview : null;
          return (
            <div key={start} role="gridcell" aria-label={`${niceDate(start)} calendar`} onPointerDown={(event) => beginSelection(event, start)} onDragOver={(event) => previewDrop(event, start)} onDragLeave={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragPreview(null); }} onDrop={(event) => drop(event, start)} className={cn("relative", start === today && "bg-ink/[0.025]")}>
              {Array.from({ length: 24 }, (_, hour) => <div key={hour} className="pointer-events-none absolute inset-x-0 border-t border-ink/[0.05]" style={{ top: hour * HOUR_HEIGHT }} />)}
              {start === today && <div className="pointer-events-none absolute inset-x-0 z-20 flex items-center" style={{ top: nowTop }}><span className="-ml-1 size-2 rounded-full bg-[#ff5667] shadow-[0_0_8px_#ff5667]" /><span className="h-px flex-1 bg-[#ff5667]/80" /></div>}
              {selected && <div className="pointer-events-none absolute inset-x-1 z-10 rounded-[8px] border border-ink/30 bg-ink/[0.1]" style={{ top: ((new Date(selected.start).getHours() * 60 + new Date(selected.start).getMinutes()) / 60) * HOUR_HEIGHT, height: Math.max(16, ((selected.end - selected.start) / 3_600_000) * HOUR_HEIGHT) }} />}
              {preview && <div className="pointer-events-none absolute inset-x-1 z-20 rounded-[8px] border border-ink/40 bg-ink/[0.12]" style={{ top: ((new Date(preview.at).getHours() * 60 + new Date(preview.at).getMinutes()) / 60) * HOUR_HEIGHT, height: HOUR_HEIGHT / 2 }}><div className="px-2 py-1 font-mono text-[9.5px] text-ink/80">{niceTime(preview.at)}</div></div>}
              {dayItems.map((item) => <CalendarEventCard key={item.id} item={item} bots={bots} groups={groups} compact={days === 7} layout={collisionLayouts.get(item.id) ?? { column: 0, columns: 1 }} onOpen={() => onOpen(item)} onResize={(minutes) => onResize(item, minutes)} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EventDetails({
  item,
  bots,
  onClose,
  onEdit,
  onCallChanged,
  onOpenRoom,
}: {
  item: CalendarEventItem;
  bots: Bot[];
  onClose: () => void;
  onEdit: () => void;
  onCallChanged: (id: string | null) => void;
  onOpenRoom: (id: string) => void;
}) {
  const { state, dispatch } = useStore();
  const inColumn = Boolean(columnSlot());
  const [working, setWorking] = useState(false);
  const runNowPending = useRef(false);
  const [starting, setStarting] = useState(false);
  // undefined preserves the selected historical run; null clears it for a new attempt.
  const [submittedRun, setSubmittedRun] = useState<RoutineRun | null | undefined>(undefined);
  const [error, setError] = useState("");
  const isCall = item.kind === "call";
  const routine = item.kind === "routine" ? item.routine : null;
  const run = submittedRun === undefined
    ? item.kind === "routine" ? item.run : null
    : submittedRun && (state.routineRuns.find((candidate) => candidate.id === submittedRun.id) ?? submittedRun);
  const call = item.kind === "call" ? item.call : null;
  const isRoomGoal = !isCall && (run?.target ?? routine?.target) === "room-goal";
  const goalGroupId = isRoomGoal ? run?.groupId ?? routine?.groupId : undefined;
  const goalGroup = state.groups.find((group) => group.id === goalGroupId);
  const executionThreadId = run?.executionThreadId ?? run?.threadId;
  const botIds = call?.botIds ?? [run?.botId ?? routine?.botId ?? ""];
  const invited = botIds.flatMap((id) => bots.find((bot) => bot.id === id) ?? []);
  const primary = invited[0];
  const executionOwner = isRoomGoal ? goalGroup : primary;
  const canOpenExecution = Boolean(executionThreadId && (executionOwner?.threadId === executionThreadId || executionOwner?.tasks?.some((task) => task.threadId === executionThreadId)));
  const report = run ?? routine;
  const resultsThreadId = report?.resultsThreadId ?? report?.sourceThreadId;
  const canOpenResults = resultsThreadId && [...state.bots, ...state.groups].some((owner) => owner.threadId === resultsThreadId || owner.tasks?.some((task) => task.threadId === resultsThreadId));
  const title = call?.name ?? run?.routineName ?? routine?.name ?? "Routine";
  const description = call?.description ?? run?.prompt ?? routine?.prompt ?? "";
  const attachments = call?.attachments ?? run?.attachments ?? routine?.attachments ?? [];
  const roomId = call?.botIds.length === 1 ? primary?.id : undefined;
  const safetyLimit = run ? run.timeoutMinutes : routine?.timeoutMinutes;

  const openRunTask = () => {
    if (!executionThreadId) return;
    if (isRoomGoal && goalGroupId) {
      dispatch({ type: "switchGroupTask", groupId: goalGroupId, threadId: executionThreadId });
      onOpenRoom(goalGroupId);
    } else if (primary) {
      dispatch({ type: "select", id: primary.id });
      dispatch({ type: "switchTask", botId: primary.id, threadId: executionThreadId });
    }
    onClose();
  };

  const invoke = async (path: string, method = "POST", body?: unknown) => {
    setWorking(true);
    setError("");
    try {
      const response = await api(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });
      if (response.routine) dispatch({ type: "routinePatched", routine: response.routine });
      if (response.run) dispatch({ type: "routineRunPatched", run: response.run });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setWorking(false);
    }
  };

  const runRoutineNow = () => {
    if (!routine || working || runNowPending.current) return;
    runNowPending.current = true;
    setStarting(true);
    setSubmittedRun(null);
    setWorking(true);
    setError("");
    // The store flushes pending model and approval-level changes before it
    // starts the run. Keep this button pending through that barrier and the
    // POST so a double-click cannot create two routine runs.
    dispatch({
      type: "runRoutine",
      routineId: routine.id,
      // Prefer subsequent SSE records over this response, which may already be stale.
      onStarted: setSubmittedRun,
      onError: (cause) => setError(cause instanceof Error ? cause.message : String(cause)),
      onSettled: () => {
        runNowPending.current = false;
        setStarting(false);
        setWorking(false);
      },
    });
  };

  const joinRoom = async () => {
    if (!call) return;
    setWorking(true);
    setError("");
    try {
      const { group: created } = await api(`/api/calendar-calls/${call.id}/room`, { method: "POST" });
      dispatch({ type: "groupPatched", group: created });
      onOpenRoom(created.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setWorking(false);
    }
  };

  const deleteEvent = async () => {
    if (!window.confirm(`Delete “${title}”?`)) return;
    if (call) {
      await api(`/api/calendar-calls/${call.id}`, { method: "DELETE" });
      onCallChanged(call.id);
    } else if (routine) {
      dispatch({ type: "deleteRoutine", routineId: routine.id });
    }
    onClose();
  };

  return (
    <Layer onClose={onClose} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px]">
      <div role="dialog" aria-modal={!inColumn} aria-label={t("calendar.ui.calendarEventDetails")} className={inColumn ? "flex flex-col" : "w-full max-w-[520px] overflow-hidden rounded-[14px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)]"}>
        <div className="flex items-start gap-4 border-b border-ink/[0.1] px-5 py-4">
          {/* whose event: the bot's face, or the call's mark */}
          {!isCall && invited[0] ? <OrbitFace id={invited[0].id} size={30} label={invited[0].name} className="mt-0.5" /> : <span className="mt-1 size-4 shrink-0 rounded-full bg-[#6d7cff]" />}
          <div className="min-w-0 flex-1">
            <div className="text-[19px] font-semibold text-ink">{title}</div>
            <div className="mt-1 text-[12.5px] text-ink/55">
              {niceDate(item.at)} · {niceTime(item.at)}{isCall ? ` – ${niceTime(item.at + item.durationMinutes * 60_000)}` : ""}
            </div>
            {(routine || call) && <div className="mt-1 text-[11.5px] text-ink/55">{scheduleLabel((routine ?? call)!.schedule)}</div>}
            {routine?.schedule.type === "cron" && <div className="mt-3"><CronSchedulePreview schedule={routine.schedule} paused={!routine.enabled} /></div>}
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-ink/55 hover:bg-ink/[0.06] hover:text-ink" aria-label={t("calendar.ui.close")}><X size={17} /></button>
        </div>

        <div className="max-h-[58vh] space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3">
            {isRoomGoal ? <Target size={17} className="mt-1 shrink-0 text-ink/55" /> : <UserRoundPlus size={17} className="mt-1 shrink-0 text-ink/55" />}
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wider text-ink/55">{isCall ? "Bots invited" : isRoomGoal ? "Lead coordinator" : "Assigned bot"}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {invited.map((bot) => <div key={bot.id} className="flex items-center gap-2 rounded-full border border-ink/[0.1] bg-ink/[0.04] py-1 pl-1 pr-2.5"><OrbitFace id={bot.id} size={26} label={bot.name} /><span className="text-[11.5px] text-ink">{bot.name}</span></div>)}
              </div>
            </div>
          </div>
          {isRoomGoal && (
            <div className="flex items-start gap-3">
              <UsersRound size={17} className="mt-1 shrink-0 text-ink/55" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink/55">{t("calendar.ui.teamGoalGroup")}</div>
                <div className="mt-1 text-[12.5px] text-ink">{goalGroup?.name ?? "Group unavailable"}</div>
              </div>
            </div>
          )}
          {description && <div className="flex items-start gap-3"><FileText size={17} className="mt-1 shrink-0 text-ink/55" /><div className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-ink">{description}</div></div>}
          {attachments.length > 0 && <div className="flex items-start gap-3"><Paperclip size={17} className="mt-1 shrink-0 text-ink/55" /><div className="min-w-0 flex-1 space-y-2"><AttachmentChips attachments={attachments} />{call && <div className="text-[11px] leading-relaxed text-ink/55">{call.botIds.length > 1 ? "These references will be shared in the group when the event starts." : "These references stay with the event and are available when you join the group."}</div>}</div></div>}
          {!isCall && <div className="flex items-start gap-3"><Clock3 size={17} className="mt-1 shrink-0 text-ink/55" /><div><div className="text-[11px] font-medium uppercase tracking-wider text-ink/55">{t("calendar.ui.runLimit")}</div><div className="mt-1 text-[12.5px] text-ink">{safetyLimit == null ? "No time limit" : `Stops if still running after ${durationLabel(safetyLimit)}`}</div></div></div>}
          {run && <div role="status" aria-live="polite" className="rounded-xl border border-ink/[0.1] bg-ink/[0.04] p-3"><div className="flex items-center gap-2 text-[12px] font-medium text-ink">{run.status === "running" && <Loader2 size={13} className="animate-spin text-ink" />}{routineRunLabel(run)}</div>{run.output && <div className="mt-2 whitespace-pre-wrap text-[11.5px] leading-relaxed text-ink/55">{run.output}</div>}{run.error && <div className="mt-2 text-[11.5px] text-[#ff8a96]">{run.error}</div>}</div>}
          {run?.attention && <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 text-warning"><CircleAlert size={15} className="mt-0.5 shrink-0" /><div className="min-w-0 whitespace-pre-wrap text-[11.5px] leading-relaxed">{run.attention}</div></div>}
          {run?.status === "waiting" && !run.attention && <div className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 text-[11.5px] text-warning">{t("calendar.ui.thisRunIsWaitingOpenIts")}</div>}
          {error && <div role="alert" className="rounded-lg bg-[#ff5667]/10 px-3 py-2 text-[11.5px] text-[#ff8a96]">{error}</div>}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-ink/[0.1] px-4 py-3">
          {roomId && <button onClick={() => onOpenRoom(roomId)} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[12px] font-semibold text-app hover:brightness-110"><ExternalLink size={13} />{t("calendar.ui.joinGroup")}</button>}
          {call && call.botIds.length > 1 && <button onClick={joinRoom} disabled={working} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[12px] font-semibold text-app hover:brightness-110 disabled:opacity-50"><ExternalLink size={13} />{t("calendar.ui.joinGroup")}</button>}
          {isRoomGoal && goalGroup && !executionThreadId && <button onClick={() => { onOpenRoom(goalGroup.id); onClose(); }} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[12px] font-semibold text-app hover:brightness-110"><ExternalLink size={13} />{t("calendar.ui.openGroup")}</button>}
          {routine && <button onClick={runRoutineNow} disabled={working} className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[12px] font-semibold text-app hover:brightness-110 disabled:opacity-50">{starting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}{starting ? "Starting…" : "Run now"}</button>}
          {canOpenExecution && <button onClick={openRunTask} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"><ExternalLink size={13} />{isRoomGoal ? "Open group thread" : "Open thread"}</button>}
          {canOpenResults && resultsThreadId && <button type="button" onClick={() => { openNotificationTarget(dispatch, { botId: botIds[0], threadId: resultsThreadId }, state); onClose(); }} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"><ExternalLink size={13} />{t("routines.results.open")}</button>}
          {routine && <button type="button" onClick={() => { dispatch({ type: "showRoutines", section: "logs", routineId: routine.id, botId: routine.botId }); onClose(); }} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink"><FileText size={13} />{t("routines.logs")}</button>}
          {run && ["queued", "running", "waiting"].includes(run.status) && <button onClick={() => void invoke(`/api/routine-runs/${run.id}/cancel`)} disabled={working} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-40"><X size={13} />{t("calendar.ui.cancelRun")}</button>}
          <div className="ml-auto flex items-center gap-1">
            {(routine || call) && <button onClick={onEdit} className="rounded-lg px-3 py-2 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink">{t("calendar.ui.edit")}</button>}
            {routine && <button disabled={working} onClick={() => void invoke(`/api/routines/${routine.id}`, "PATCH", { enabled: !routine.enabled })} className="rounded-lg p-2 text-ink/55 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-40" title={routine.enabled ? "Pause routine" : "Resume routine"}>{routine.enabled ? <Pause size={15} /> : <Play size={15} />}</button>}
            {(routine || call) && <button onClick={() => void deleteEvent()} className="rounded-lg p-2 text-ink/55 hover:bg-[#ff5667]/10 hover:text-[#ff8a96]" title={t("calendar.ui.delete")}><Trash2 size={15} /></button>}
          </div>
        </div>
      </div>
    </Layer>
  );
}

function PausedList({
  routines,
  bots,
  groups,
  onClose,
  onEdit,
  onOpenRoom,
}: {
  routines: Routine[];
  bots: Bot[];
  groups: Group[];
  onClose: () => void;
  onEdit: (routine: Routine) => void;
  onOpenRoom: (id: string) => void;
}) {
  const { dispatch } = useStore();
  return (
    <Layer onClose={onClose} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div role="dialog" aria-modal={!columnSlot()} aria-label={t("calendar.ui.pausedRoutines")} className={columnSlot() ? "flex flex-col" : "w-full max-w-[520px] rounded-[14px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)]"}>
        <div className="flex items-center justify-between border-b border-ink/[0.1] px-5 py-4"><div><div className="text-[16px] font-semibold text-ink">{t("calendar.ui.pausedRoutines")}</div><div className="mt-0.5 text-[11.5px] text-ink/55">History is kept; no new tasks will run.</div></div><button onClick={onClose} className="rounded-full p-2 text-ink/55 hover:bg-ink/[0.06]"><X size={17} /></button></div>
        <div className="max-h-[55vh] space-y-1 overflow-y-auto p-3">
          {routines.map((routine) => {
            const bot = bots.find((candidate) => candidate.id === routine.botId);
            const room = routine.target === "room-goal"
              ? groups.find((candidate) => candidate.id === routine.groupId)
              : undefined;
            return (
              <div key={routine.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-ink/[0.06]">
                {room ? <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.08] text-ink"><UsersRound size={17} /></span> : bot && <OrbitFace id={bot.id} size={36} label={bot.name} />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-ink">{routine.name}</div>
                  <div className="mt-0.5 truncate text-[10.5px] text-ink/55">{room ? `Team goal · ${room.name} · ` : ""}{scheduleLabel(routine.schedule)}</div>
                </div>
                {room && <button onClick={() => { onOpenRoom(room.id); onClose(); }} className="rounded-lg px-2 py-1.5 text-[11px] text-ink/55 hover:bg-ink/[0.04]">{t("calendar.ui.group")}</button>}
                <button onClick={() => dispatch({ type: "updateRoutine", routineId: routine.id, patch: { enabled: true } })} className="rounded-lg bg-ink/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-ink">{t("calendar.ui.resume")}</button>
                <button onClick={() => onEdit(routine)} className="rounded-lg px-2 py-1.5 text-[11px] text-ink/55 hover:bg-ink/[0.04]">{t("calendar.ui.edit")}</button>
              </div>
            );
          })}
        </div>
      </div>
    </Layer>
  );
}

export function RoutineEditor({
  routine,
  bots,
  lockedBotId,
  defaultRunOn,
  onClose,
}: {
  routine?: Routine;
  bots: Bot[];
  lockedBotId?: string;
  defaultRunOn?: RoutineRunOn;
  onClose: () => void;
}) {
  const at = routine?.schedule.type === "once"
    ? routine.schedule.at
    : routine?.schedule.type === "daily"
      ? atLocalTime(Date.now(), routine.schedule.time)
      : routine?.schedule.type === "interval"
        ? routine.schedule.anchorAt
      : routine?.schedule.type === "cron"
        ? routine.nextRunAt ?? nextHour()
      : nextHour();
  return <EventEditor seed={{ kind: "routine", at, durationMinutes: routine?.durationMinutes ?? 30, botIds: lockedBotId ? [lockedBotId] : routine ? [routine.botId] : [], routine }} bots={bots} lockedBotId={lockedBotId} defaultRunOn={defaultRunOn} onClose={onClose} onSavedCall={() => {}} />;
}

/** The calendar, webhooks and run logs. On the Orbit canvas it is `embedded`
 * beside the You column: no Back button (you leave by clicking the canvas)
 * and none of the window chrome a full-window page needs. */
export function RoutinesPage({ onBack, onOpenRoom, embedded = false }: { onBack?: () => void; onOpenRoom: (id: string) => void; embedded?: boolean }) {
  const { state, dispatch } = useStore();
  const { capabilities } = useDesktopCapabilities();
  const routinesOnly = window.ogb?.remoteClient?.active === true;
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const newMenuRef = useRef<HTMLDetailsElement>(null);
  const [section, setSection] = useState<"calendar" | "logs" | "webhooks">(state.routinesFocus?.section === "logs" ? "logs" : state.routinesFocus?.section === "webhooks" ? "webhooks" : "calendar");
  const [scheduleView, setScheduleView] = useState<"calendar" | "list">(state.routinesFocus?.view ?? "calendar");
  const [viewDays, setViewDays] = useState<1 | 3 | 7>(7);
  const frameRef = useRef<HTMLElement>(null);
  // A week needs room for seven readable days; a narrower frame opens on
  // three, and the range control still offers the week.
  useLayoutEffect(() => {
    const width = frameRef.current?.clientWidth ?? 0;
    if (width && width < 64 + 7 * 118) setViewDays(3);
  }, []);
  const [anchor, setAnchor] = useState(() => startOfDay(Date.now()));
  const [botFilter, setBotFilter] = useState(state.routinesFocus?.botId ?? "all");
  const [routineFilter, setRoutineFilter] = useState<string | undefined>(state.routinesFocus?.routineId);
  const [statusFilter, setStatusFilter] = useState<RoutineRunStatusFilter>(state.routinesFocus?.runStatus ?? "all");
  const [calls, setCalls] = useState<CalendarCall[]>([]);
  const [quick, setQuick] = useState<EventSeed | null>(null);
  const [editor, setEditor] = useState<EventSeed | null>(null);
  const [selected, setSelected] = useState<CalendarEventItem | null>(null);
  const [pausedOpen, setPausedOpen] = useState(false);
  const [webhookCreateRequest, setWebhookCreateRequest] = useState(0);
  const [error, setError] = useState("");
  const visibleBots = state.bots.filter((bot) => !bot.hidden);
  const rangeStart = viewDays === 7 ? startOfWeek(anchor) : startOfDay(anchor);
  const rangeEnd = addDays(rangeStart, viewDays);

  useEffect(() => {
    const focus = state.routinesFocus;
    setSection(focus?.section === "logs" ? "logs" : focus?.section === "webhooks" ? "webhooks" : "calendar");
    setScheduleView(focus?.view ?? "calendar");
    setBotFilter(focus?.botId ?? "all");
    setRoutineFilter(focus?.routineId);
    setStatusFilter(focus?.runStatus ?? "all");
  }, [state.routinesFocus]);

  const loadCalls = useCallback(async () => {
    try {
      const response = await api("/api/calendar-calls");
      setCalls(response.calls ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }, []);
  useEffect(() => {
    if (!routinesOnly) void loadCalls();
  }, [loadCalls, routinesOnly]);
  useEffect(() => { backButtonRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const closeNewMenu = (event: PointerEvent) => {
      const menu = newMenuRef.current;
      if (menu?.open && !menu.contains(event.target as Node)) menu.removeAttribute("open");
    };
    document.addEventListener("pointerdown", closeNewMenu);
    return () => document.removeEventListener("pointerdown", closeNewMenu);
  }, []);

  const items = useMemo<CalendarEventItem[]>(() => {
    const routineItems = projectedRoutineItems(state.routines, state.routineRuns, rangeStart, rangeEnd).map((item) => ({ ...item, kind: "routine" as const }));
    const callItems = projectCalls(calls, rangeStart, rangeEnd).map((item) => ({ ...item, kind: "call" as const }));
    return [...routineItems, ...callItems]
      .filter((item) => botFilter === "all" || (item.kind === "call" ? item.call.botIds.includes(botFilter) : (item.routine?.botId ?? item.run?.botId) === botFilter))
      .sort((left, right) => left.at - right.at);
  }, [state.routines, state.routineRuns, calls, rangeStart, rangeEnd, botFilter]);

  const liveSelected = selected?.kind === "call"
    ? (() => { const call = calls.find((candidate) => candidate.id === selected.call.id); return call ? { ...selected, call } : null; })()
    : selected?.kind === "routine"
      ? {
          ...selected,
          routine: selected.routine ? state.routines.find((routine) => routine.id === selected.routine?.id) ?? null : null,
          run: selected.run ? state.routineRuns.find((run) => run.id === selected.run?.id) ?? selected.run : null,
        }
      : null;
  const paused = state.routines.filter((routine) => !routine.enabled && (routine.schedule.type !== "once" || routine.schedule.at > Date.now()));
  const running = state.routineRuns.filter((run) => ["queued", "running", "waiting"].includes(run.status)).length;
  const unseenFailures = state.routineRuns.filter((run) => isRoutineProblemRun(run) && !run.seenAt).length;
  const filteredRoutines = state.routines.filter((routine) => botFilter === "all" || routine.botId === botFilter);
  const filteredRuns = state.routineRuns.filter((run) => botFilter === "all" || run.botId === botFilter);
  const openRoutine = (routine: Routine) => setSelected({ kind: "routine", id: routine.id, at: routine.nextRunAt ?? (routine.schedule.type === "once" ? routine.schedule.at : routine.schedule.type === "interval" ? routine.schedule.anchorAt : routine.schedule.type === "cron" ? nextHour() : atLocalTime(Date.now(), routine.schedule.time)), durationMinutes: routine.durationMinutes, routine, run: null });
  const openLogs = (routine: Routine) => { setRoutineFilter(routine.id); setSection("logs"); };
  const openRun = (run: RoutineRun) => {
    setSelected({ kind: "routine", id: run.id, at: run.scheduledFor, durationMinutes: run.durationMinutes ?? 30, routine: state.routines.find((routine) => routine.id === run.routineId) ?? null, run });
    if (["failed", "missed"].includes(run.status) && !run.seenAt) dispatch({ type: "markRoutineRunSeen", runId: run.id });
  };
  const macInset = !embedded && capabilities.windowChrome === "mac-inset";
  const windowDragStyle = macInset
    ? ({ WebkitAppRegion: "drag" } as CSSProperties)
    : undefined;
  const windowNoDragStyle = macInset
    ? ({ WebkitAppRegion: "no-drag" } as CSSProperties)
    : undefined;

  const setView = (days: 1 | 3 | 7) => {
    setViewDays(days);
    setAnchor((current) => startOfDay(current));
  };
  const goToday = useCallback(() => setAnchor(startOfDay(Date.now())), []);
  const handleWebhookCreateHandled = useCallback(() => setWebhookCreateRequest(0), []);
  const openCreate = useCallback((seed?: Partial<EventSeed>) => {
    setSelected(null);
    setQuick({ kind: "routine", at: nextHour(), durationMinutes: 30, botIds: [], ...seed });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable=true]")) return;
      if (event.key === "Escape") { newMenuRef.current?.removeAttribute("open"); setQuick(null); setEditor(null); setSelected(null); return; }
      if (section !== "calendar" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "c") { event.preventDefault(); openCreate(); }
      if (event.key.toLowerCase() === "t") goToday();
      if (event.key === "1") setView(1);
      if (event.key === "3") setView(3);
      if (event.key.toLowerCase() === "w") setView(7);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, openCreate, goToday, anchor]);

  const upsertCall = (call: CalendarCall) => setCalls((current) => current.some((candidate) => candidate.id === call.id) ? current.map((candidate) => candidate.id === call.id ? call : candidate) : [call, ...current]);
  const moveEvent = async (dragged: { kind: EventKind; id: string; at: number }, nextAt: number) => {
    if (nextAt === dragged.at) return;
    try {
      if (dragged.kind === "routine") {
        const routine = state.routines.find((candidate) => candidate.id === dragged.id);
        if (!routine) return;
        if (routine.schedule.type === "cron") throw new Error("Open this routine to edit its repeating schedule and time zone.");
        if (routine.schedule.type !== "once" && !window.confirm("Move this entire recurring series?")) return;
        const response = await api(`/api/routines/${routine.id}`, { method: "PATCH", body: JSON.stringify({ schedule: scheduleAt(routine.schedule, dragged.at, nextAt) }) });
        dispatch({ type: "routinePatched", routine: response.routine });
      } else {
        const call = calls.find((candidate) => candidate.id === dragged.id);
        if (!call) return;
        if (call.schedule.type === "daily" && !window.confirm("Move this entire recurring series?")) return;
        const response = await api(`/api/calendar-calls/${call.id}`, { method: "PATCH", body: JSON.stringify({ schedule: scheduleAt(call.schedule, dragged.at, nextAt) }) });
        upsertCall(response.call);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  const resizeEvent = async (item: CalendarEventItem, durationMinutes: number) => {
    try {
      if (item.kind === "routine" && item.routine) {
        const response = await api(`/api/routines/${item.routine.id}`, { method: "PATCH", body: JSON.stringify({ durationMinutes }) });
        dispatch({ type: "routinePatched", routine: response.routine });
      } else if (item.kind === "call") {
        const response = await api(`/api/calendar-calls/${item.call.id}`, { method: "PATCH", body: JSON.stringify({ durationMinutes }) });
        upsertCall(response.call);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  const toolbar = section === "webhooks" ? null : <>
        {section === "calendar" && <div className="flex items-center rounded-[15px] bg-ink/[0.05] p-0.5" aria-label={t("calendar.ui.scheduleView")}>
          {([["list", List, t("calendar.view.list")], ["calendar", CalendarDays, t("calendar.view.calendar")]] as const).map(([key, Icon, label]) => (
            <button key={key} type="button" aria-pressed={scheduleView === key} onClick={() => setScheduleView(key)}
              className={cn("flex h-[26px] items-center gap-1.5 rounded-[13px] px-2.5 text-[12px] font-medium", scheduleView === key ? "bg-ink/[0.12] text-ink" : "text-ink/55 hover:text-ink")}><Icon size={13} aria-hidden />{label}</button>
          ))}
        </div>}
        {section === "calendar" && scheduleView === "calendar" && <>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setAnchor((current) => addDays(current, -viewDays))} className="flex size-7 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.08] hover:text-ink" aria-label={t("calendar.ui.previousDates")}><ChevronLeft size={15} /></button>
            <button onClick={goToday} className="h-7 rounded-[14px] px-2.5 text-[12px] font-medium text-ink/80 hover:bg-ink/[0.08] hover:text-ink">{t("calendar.today")}</button>
            <button onClick={() => setAnchor((current) => addDays(current, viewDays))} className="flex size-7 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.08] hover:text-ink" aria-label={t("calendar.ui.nextDates")}><ChevronRight size={15} /></button>
          </div>
        </>}
        <span className="flex-1" />
        {running > 0 && <span className="hidden items-center gap-1.5 text-[12px] text-ink/60 sm:flex"><span className="size-1.5 rounded-full bg-[#38d591] shadow-[0_0_6px_#38d591]" />{t("calendar.running", { count: running })}</span>}
        {unseenFailures > 0 && <button type="button" onClick={() => dispatch({ type: "showRoutines", section: "logs", runStatus: "problems" })} className="hidden items-center gap-1.5 text-[12px] text-[#ff8a96] hover:underline sm:flex" title={t("calendar.ui.openProblemRunLogs")} aria-label={t("calendar.ui.openProblemRunLogs")}><CircleAlert size={12} />{unseenFailures}</button>}
        {paused.length > 0 && <button onClick={() => setPausedOpen(true)} aria-label={t("calendar.ui.viewPausedRoutines")} className="hidden h-7 items-center gap-1.5 rounded-[14px] px-2.5 text-[12px] text-ink/60 hover:bg-ink/[0.08] hover:text-ink sm:flex"><Pause size={12} />{t("calendar.paused", { count: paused.length })}</button>}
        <PillSelect label="Filter schedule by bot" value={botFilter} onChange={(value) => { setBotFilter(value); setRoutineFilter(undefined); }}
          options={[{ value: "all", label: t("calendar.allBots") }, ...visibleBots.map((bot) => ({ value: bot.id, label: bot.name }))]} />
        {section === "calendar" && scheduleView === "calendar" && <PillSelect label="Schedule range" value={String(viewDays)} onChange={(value) => setView(Number(value) as 1 | 3 | 7)}
          options={[{ value: "1", label: t("calendar.range.day") }, { value: "3", label: t("calendar.range.three") }, { value: "7", label: t("calendar.range.week") }]} />}
        {error && <button onClick={() => setError("")} className="flex w-full items-center gap-1.5 text-left text-[12px] text-[#ff8a96]"><CircleAlert size={12} />{error}<X size={12} /></button>}
        {section === "calendar" && scheduleView === "calendar" && state.routinesLoadState === "error" && <p role="alert" className="w-full text-[12px] text-[#ff8a96]">{t("routines.loadError")}</p>}
        {section === "calendar" && scheduleView === "calendar" && state.routinesLoadState === "loading" && state.routines.length === 0 && <p role="status" className="w-full text-[12px] text-ink/55">{t("routines.loading")}</p>}
  </>;

  return (
    // embedded, the frame is the containing block of the calendar's own
    // layers (editor, details, quick create): they cover the calendar, not the app
    <main ref={frameRef} data-routines-frame={embedded || undefined} className={cn("flex h-full min-w-0 flex-1 flex-col gap-3 animate-workspace-in", embedded ? "routines-frame" : "bg-app")}>
      {/* The card's header, as an artifact on the canvas carries one: what
          this is and what is coming, the three views, and New. */}
      <header className={cn("flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2", embedded ? "min-h-[52px] pb-3 pl-[74px]" : macInset ? "pl-[86px] pr-4 pt-3" : "px-4 pt-3")} style={windowDragStyle}>
        {onBack && !embedded && <button type="button" ref={backButtonRef} onClick={onBack} aria-label={t("calendar.ui.back")} title={t("calendar.ui.back")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink/70 hover:bg-ink/[0.08]" style={windowNoDragStyle}><ArrowLeft size={16} /></button>}
        <div data-tour="automations-page" className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/80">{t("calendar.title")}{section === "calendar" && scheduleView === "calendar" && <span className="text-ink/45"> · {calendarRangeLabel(rangeStart, viewDays)}</span>}</h1>
          <span className="truncate text-[12.5px] text-ink/50">{calendarContext(state.routines, running)}</span>
        </div>
        {embedded ? toolbar : <nav aria-label={t("calendar.ui.automationType")} className="flex items-center gap-1" style={windowNoDragStyle}>
          {([
            ["calendar", routinesOnly ? t("calendar.tab.routines") : t("calendar.tab.schedule"), null, 0],
            ["logs", t("routines.logs"), FileText, unseenFailures],
            ...(!routinesOnly ? [["webhooks", t("calendar.tab.webhooks"), Webhook, state.webhooks.length] as const] : []),
          ] as const).map(([key, label, Icon, count]) => (
            <button key={key} type="button" aria-pressed={section === key}
              onClick={() => { setSection(key); if (key === "logs") setRoutineFilter(undefined); }}
              className={cn("flex h-[30px] items-center gap-1.5 rounded-[15px] border px-3 text-[12.5px] font-medium", section === key ? "border-ink/[0.22] bg-ink/[0.08] text-ink" : "border-transparent text-ink/60 hover:bg-ink/[0.05] hover:text-ink")}>
              {Icon && <Icon size={13} aria-hidden />}{label}
              {count > 0 && <span className={cn("rounded-full px-1.5 font-mono text-[10px]", key === "logs" ? "bg-[#ff5667]/15 text-[#ff8a96]" : "bg-ink/[0.1] text-ink/70")}>{count}</span>}
            </button>
          ))}
        </nav>}
        {!(embedded && toolbar) && <span className="flex-1" />}
        {unseenFailures > 0 && <button type="button" onClick={() => dispatch({ type: "markAllRoutineRunsSeen" })} title={t("routines.markAllSeen")} aria-label={t("routines.markAllSeen")}
          className="flex h-[30px] items-center gap-1.5 rounded-[15px] border border-ink/[0.14] px-3 text-[12.5px] text-ink/80 hover:bg-ink/[0.06]" style={windowNoDragStyle}><CheckCheck size={13} />{t("routines.markAllSeen")}</button>}
        <details ref={newMenuRef} className="group relative" style={windowNoDragStyle}>
          <summary role="button" aria-label={t("calendar.ui.createAnAutomation")}
            className="flex h-[30px] cursor-pointer list-none items-center gap-1.5 rounded-[15px] bg-ink px-3.5 text-[12.5px] font-semibold text-app focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40">
            <Plus size={14} aria-hidden="true" />{t("calendar.new")}
          </summary>
          <div role="group" aria-label={t("calendar.ui.newAutomation")} className="absolute right-0 top-full z-40 mt-1.5 flex w-[290px] flex-col gap-0.5 rounded-[14px] border border-ink/[0.12] bg-panel p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.55)] animate-pop-in">
            {([
              ["Create a scheduled task", Clock3, t("calendar.new.task"), t("calendar.new.taskSub"), () => { setSection("calendar"); openCreate({ kind: "routine" }); }, false, true],
              ["Create a scheduled call", Video, t("calendar.new.call"), t("calendar.new.callSub"), () => { setSection("calendar"); openCreate({ kind: "call" }); }, false, !routinesOnly],
              ["Create a webhook", Webhook, t("calendar.new.webhook"), t("calendar.new.webhookSub"), () => { setSection("webhooks"); setWebhookCreateRequest((request) => request + 1); }, visibleBots.length === 0, !routinesOnly],
            ] as const).filter((row) => row[6]).map(([aria, Icon, title, sub, run, disabled]) => (
              <button key={aria} type="button" aria-label={aria} disabled={disabled} onClick={() => { newMenuRef.current?.removeAttribute("open"); run(); }}
                className="flex w-full items-start gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-ink/[0.05] disabled:cursor-not-allowed disabled:opacity-40">
                <Icon size={16} className="mt-0.5 shrink-0 text-ink/70" aria-hidden="true" />
                <span className="flex flex-col gap-0.5"><span className="text-[13px] font-medium text-ink">{title}</span><span className="text-[11.5px] leading-[1.45] text-ink/50">{sub}</span></span>
              </button>
            ))}
          </div>
        </details>
      </header>

      {/* The card itself */}
      <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", !embedded && "border-t border-ink/[0.07]")}>
      {!embedded && section !== "webhooks" && <div className="flex shrink-0 flex-wrap items-center gap-2 pb-2" style={windowNoDragStyle}>
        {toolbar}
      </div>}
      <RoutineWakeBar />

      {section === "webhooks" ? <WebhooksPanel bots={visibleBots} createRequest={webhookCreateRequest} onCreateHandled={handleWebhookCreateHandled} /> : section === "logs" ? (
        <div className="min-h-0 flex-1 overflow-y-auto"><RoutineLogs runs={filteredRuns} bots={state.bots} loading={state.routinesLoadState === "loading" && filteredRuns.length === 0} error={state.routinesLoadState === "error"} routineId={routineFilter} status={statusFilter} onStatusChange={setStatusFilter} onClearRoutine={() => setRoutineFilter(undefined)} onOpen={openRun} /></div>
      ) : scheduleView === "list" ? (
        <div className="min-h-0 flex-1 overflow-y-auto"><div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-3 py-4">
          <section className="flex flex-col gap-1.5">
            <span className="px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50">{t("calendar.routinesLabel")}</span>
            <RoutineList routines={filteredRoutines} runs={state.routineRuns} bots={state.bots} loading={state.routinesLoadState === "loading" && filteredRoutines.length === 0} error={state.routinesLoadState === "error"} onOpen={openRoutine} onLogs={openLogs} />
          </section>
          {!routinesOnly && calls.some((call) => botFilter === "all" || call.botIds.includes(botFilter)) && <section className="flex flex-col gap-1.5" aria-label={t("calendar.ui.scheduledCalls")}>
            <span className="px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/50">{t("calendar.callsLabel")}</span>
            {calls.filter((call) => botFilter === "all" || call.botIds.includes(botFilter)).map((call) => <button key={call.id} type="button" onClick={() => setSelected({ kind: "call", id: call.id, at: call.schedule.type === "once" ? call.schedule.at : atLocalTime(Date.now(), call.schedule.time), durationMinutes: call.durationMinutes, call })}
              className="flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left hover:bg-ink/[0.05]">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.07]"><Video size={14} className="text-ink/70" /></span>
              <span className="flex min-w-0 flex-col gap-0.5"><span className="truncate text-[13.5px] font-medium text-ink/90">{call.name}</span><span className="truncate text-[12px] text-ink/50">{scheduleLabel(call.schedule)}</span></span>
            </button>)}
          </section>}
        </div></div>
      ) : (
        <div className={cn("flex min-h-0 flex-1", embedded && "flex-col")}>
          {!embedded && <div className="hidden shrink-0 lg:block"><CalendarSidebar bots={visibleBots} anchor={anchor} onSelectDate={(at) => setAnchor(startOfDay(at))} /></div>}
          <CalendarGrid anchor={rangeStart} days={viewDays} items={items} bots={state.bots} groups={state.groups} onOpen={(item) => { setSelected(item); if (item.kind === "routine" && item.run && ["failed", "missed"].includes(item.run.status) && !item.run.seenAt) dispatch({ type: "markRoutineRunSeen", runId: item.run.id }); }} onCreate={openCreate} onMove={(item, at) => void moveEvent(item, at)} onResize={(item, duration) => void resizeEvent(item, duration)} />
        </div>
      )}

      </div>

      {quick && <>{!columnSlot() && <div className="fixed inset-0 z-40 bg-black/25" onMouseDown={() => setQuick(null)} />}<QuickComposer seed={quick} bots={visibleBots} routinesOnly={routinesOnly} onClose={() => setQuick(null)} onMore={(seed) => { setQuick(null); setEditor(seed); }} onSavedRoutine={(routine) => dispatch({ type: "routinePatched", routine })} onSavedCall={upsertCall} /></>}
      {editor && <EventEditor seed={editor} bots={visibleBots} routinesOnly={routinesOnly} onClose={() => setEditor(null)} onSavedCall={upsertCall} />}
      {liveSelected && <EventDetails key={`${liveSelected.kind}:${liveSelected.id}`} item={liveSelected} bots={state.bots} onClose={() => setSelected(null)} onEdit={() => { const seed: EventSeed = liveSelected.kind === "call" ? { kind: "call", at: liveSelected.at, durationMinutes: liveSelected.call.durationMinutes, botIds: liveSelected.call.botIds, call: liveSelected.call } : { kind: "routine", at: liveSelected.at, durationMinutes: liveSelected.routine?.durationMinutes ?? liveSelected.run?.durationMinutes ?? 30, botIds: [liveSelected.routine?.botId ?? liveSelected.run?.botId ?? ""].filter(Boolean), routine: liveSelected.routine ?? undefined }; setSelected(null); setEditor(seed); }} onCallChanged={(id) => { if (id) setCalls((current) => current.filter((call) => call.id !== id)); else void loadCalls(); }} onOpenRoom={onOpenRoom} />}
      {pausedOpen && <PausedList routines={paused} bots={state.bots} groups={state.groups} onClose={() => setPausedOpen(false)} onEdit={(routine) => { setPausedOpen(false); const at = routine.schedule.type === "once" ? routine.schedule.at : routine.schedule.type === "interval" ? routine.schedule.anchorAt : routine.schedule.type === "cron" ? routine.nextRunAt ?? nextHour() : atLocalTime(Date.now(), routine.schedule.time); setEditor({ kind: "routine", at, durationMinutes: routine.durationMinutes, botIds: [routine.botId], routine }); }} onOpenRoom={onOpenRoom} />}
    </main>
  );
}

/** On the Orbit canvas the calendar's details, editor and quick create open
 * in the right column (the slot OrbitShell provides while the calendar is
 * up); anywhere else they keep their overlay. */
function columnSlot(): HTMLElement | null {
  if (typeof document === "undefined" || typeof document.querySelector !== "function") return null;
  // the calendar's own slot while it is up, otherwise whichever column is on
  // screen (a bot's routines, the remote computer panel)
  return document.querySelector<HTMLElement>("[data-orbit-calendar-column]") ?? document.querySelector<HTMLElement>("[data-orbit-column-layer]");
}
function Layer({ onClose, backdrop, children }: { onClose: () => void; backdrop: string; children: ReactNode }) {
  const slot = columnSlot();
  if (slot) return createPortal(
    <div className="flex h-full flex-col overflow-y-auto bg-[var(--color-app)] animate-panel-in">{children}</div>,
    slot,
  );
  return <div className={backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>{children}</div>;
}

/** "3 routines · next Thu 20:42" beside the title. */
function calendarContext(routines: Routine[], running: number): string {
  const active = routines.filter((routine) => routine.enabled);
  const next = active.map((routine) => routine.nextRunAt).filter((at): at is number => at != null).sort((a, b) => a - b)[0];
  const parts = [tCount("calendar.count", active.length)];
  if (running > 0) parts.push(t("calendar.running", { count: running }));
  else if (next) parts.push(t("calendar.next", { when: `${niceDate(next)} ${niceTime(next)}` }));
  return parts.join(" · ");
}

/** A native select dressed as the toolbar's quiet pill. */
function PillSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <span className="relative flex items-center">
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}
        className="h-7 max-w-[170px] cursor-pointer appearance-none rounded-[14px] border border-ink/[0.14] bg-transparent pl-3 pr-7 text-[12px] text-ink/85 outline-none hover:bg-ink/[0.05] focus:border-ink/30">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2.5 text-ink/50" aria-hidden />
    </span>
  );
}

/** Desktop only: the one lever the app has against a sleeping computer.
 * The scheduler runs inside the local server, so while the Mac sleeps no
 * routine fires; the shell holds a power assertion for the hour before a
 * due routine and while one runs, plugged in only, and this row shows it. */
function RoutineWakeBar() {
  const bridge = typeof window !== "undefined" ? window.ogb?.routines : undefined;
  const [state, setState] = useState<DesktopRoutineWake | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!bridge) return;
    let cancelled = false;
    const load = () => bridge.wakeState().then((next) => { if (!cancelled) setState(next); }).catch(() => {});
    void load();
    const timer = window.setInterval(load, 30_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [bridge]);
  if (!bridge || !state) return null;
  const status = !state.keepAwake
    ? "Off — this computer may sleep through a scheduled routine."
    : state.onBattery
      ? "On battery, so not holding; plug in to keep it awake."
      : state.hold
        ? state.reason === "running" ? "Holding it awake now: a routine is running." : `Holding it awake now: a routine is due at ${state.at ? niceTime(state.at) : "the top of the hour"}.`
        : "Holds it awake for the hour before a routine and while one runs, while plugged in. A closed lid still sleeps.";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/[0.07] px-4 py-2">
      <div className="min-w-0 text-[12px] leading-[1.5] text-ink/55">
        <span className="font-medium text-ink/85">{t("calendar.ui.keepThisComputerAwakeForRoutines")}</span> {status}
      </div>
      <Switch
        checked={state.keepAwake}
        disabled={busy}
        aria-label={t("calendar.ui.keepThisComputerAwakeForScheduled")}
        onClick={() => {
          setBusy(true);
          bridge.keepAwake(!state.keepAwake).then(setState).catch(() => {}).finally(() => setBusy(false));
        }}
        className="shrink-0 disabled:cursor-wait disabled:opacity-50"
      />
    </div>
  );
}
