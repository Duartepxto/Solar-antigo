import CompanionCore
import SwiftUI

struct TasksRoutinesView: View {
    @EnvironmentObject private var session: Session
    @State private var routines: [Routine] = []
    @State private var runs: [RoutineRun] = []
    @State private var editor: RoutineEditorTarget?
    @State private var deleting: Routine?
    @State private var loading = true

    var body: some View {
        // the editor opens in place of the list, as the desktop's does
        if let target = editor {
            RoutineEditorView(routine: target.routine, onSaved: { await reload() }, onClose: { editor = nil })
        } else {
            list
        }
    }

    private var list: some View {
        OrbitPanelList(icon: "calendar.badge.clock", kicker: "Routines", title: String(localized: "Routines"),
                       description: "Scheduled work for your bots. Each routine keeps one thread of results, and runs on the computer's clock.") {
            Section {
                OrbitRow(icon: "plus", title: Text("New routine"), tint: Orbit.link) { editor = .new }
                    .listRowSeparator(.hidden)
                    .accessibilityIdentifier("new-routine")
            }

            Section {
                if routines.isEmpty && !loading {
                    Text("Nothing scheduled yet. A routine runs a bot on a schedule: once, on chosen days, or every few minutes.")
                        .font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                        .listRowSeparator(.hidden)
                }
                ForEach(routines) { routine in
                    let canToggle = routine.canToggle()
                    if deleting?.id == routine.id {
                        OrbitInlineConfirm(question: Text("Delete \(routine.name)?"),
                                           detail: Text("Past run receipts remain available."),
                                           confirm: "Delete") {
                            Task {
                                if await session.deleteRoutine(routine) { await reload() }
                                deleting = nil
                            }
                        } onCancel: { deleting = nil }
                            .listRowSeparator(.hidden)
                            .padding(.vertical, 6)
                    } else {
                        RoutineRow(routine: routine, bot: session.state.bot(routine.botId))
                            .contentShape(Rectangle())
                            .onTapGesture { editor = .edit(routine) }
                            .swipeActions(edge: .leading, allowsFullSwipe: true) {
                                if canToggle {
                                    Button(routine.enabled ? "Pause" : "Resume") {
                                        Task { await toggle(routine) }
                                    }
                                    .tint(routine.enabled ? Orbit.amber : Orbit.success)
                                }
                            }
                            .swipeActions(edge: .trailing) {
                                Button("Delete") { deleting = routine }.tint(Orbit.danger)
                                Button("Run now") { Task { await runNow(routine) } }.tint(Orbit.accent)
                            }
                            .contextMenu {
                                Button("Run now", systemImage: "play.fill") { Task { await runNow(routine) } }
                                if canToggle {
                                    Button(routine.enabled ? "Pause" : "Resume", systemImage: routine.enabled ? "pause" : "play") {
                                        Task { await toggle(routine) }
                                    }
                                }
                                Button("Edit", systemImage: "pencil") { editor = .edit(routine) }
                                Button("Delete", systemImage: "trash", role: .destructive) { deleting = routine }
                            }
                    }
                }
            } header: { OrbitSectionHeader("Scheduled") }

            Section {
                if runs.isEmpty && !loading {
                    Text("Every run lands here: done, waiting on you, failed, or started by hand.")
                        .font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                        .listRowSeparator(.hidden)
                }
                ForEach(runs.sorted(by: { $0.scheduledFor > $1.scheduledFor }).prefix(50)) { run in
                    RoutineRunRow(run: run, bot: session.state.bot(run.botId))
                }
            } header: { OrbitSectionHeader("Runs") }

            Section {
                Text("Webhooks are set up on the computer: they open a trigger to the internet and carry a signing secret. Their runs still show above.")
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    .listRowSeparator(.hidden)
            } header: { OrbitSectionHeader("Webhooks") }
        }
        .task { await reload() }
        .refreshable { await reload() }
    }

    private func reload() async {
        loading = true
        let loaded = await session.loadRoutines()
        routines = loaded.routines.sorted { ($0.nextRunAt ?? .greatestFiniteMagnitude) < ($1.nextRunAt ?? .greatestFiniteMagnitude) }
        runs = loaded.runs
        loading = false
    }

    private func toggle(_ routine: Routine) async {
        guard routine.canToggle() else { return }
        _ = await session.setRoutineEnabled(routine, enabled: !routine.enabled)
        await reload()
    }

    private func runNow(_ routine: Routine) async {
        _ = await session.runRoutine(routine)
        await reload()
    }
}

private enum RoutineEditorTarget: Identifiable {
    case new
    case edit(Routine)
    var id: String { routine?.id ?? "new" }
    var routine: Routine? { if case let .edit(value) = self { value } else { nil } }
}

private struct RoutineRow: View {
    let routine: Routine
    let bot: Bot?

    var body: some View {
        let canToggle = routine.canToggle()
        HStack(spacing: 12) {
            if let bot { BotAvatarView(bot: bot, size: 34, mood: routine.enabled ? nil : .sleepy, animated: false) }
            else { Image(systemName: "calendar.badge.exclamationmark").foregroundStyle(Orbit.ink50).frame(width: 34, height: 34) }
            VStack(alignment: .leading, spacing: 3) {
                Text(routine.name).font(.system(size: 15, weight: .medium)).foregroundStyle(Orbit.ink)
                ((bot.map { Text(verbatim: $0.name) } ?? Text("Deleted agent"))
                    + Text(verbatim: " · \(routine.schedule.summary) · ")
                    + Text(LocalizedStringKey(routine.runLocation.label)))
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50).lineLimit(2)
            }
            Spacer()
            if !routine.enabled {
                Text(canToggle ? "Paused" : "Done")
                    .font(.system(size: 12.5)).foregroundStyle(canToggle ? Orbit.amberText : Orbit.ink40)
                    .accessibilityLabel(canToggle ? "Paused" : "Completed")
            }
        }
        .padding(.vertical, 4)
    }
}

private struct RoutineRunRow: View {
    let run: RoutineRun
    let bot: Bot?
    @EnvironmentObject private var session: Session

    var body: some View {
        DisclosureGroup {
            VStack(alignment: .leading, spacing: 8) {
                if let output = run.output, !output.isEmpty { Text(output).foregroundStyle(Orbit.ink80).textSelection(.enabled) }
                if let error = run.error, !error.isEmpty { Text(error).foregroundStyle(Orbit.dangerText).textSelection(.enabled) }
                if run.status == "waiting" { Text("This thread is waiting for your answer.").foregroundStyle(Orbit.amberText) }
                if let threadId = run.threadId,
                   let target = NotificationTarget(botId: run.botId, threadId: threadId) {
                    Button("Open thread", systemImage: "arrow.up.right.square") {
                        Task { await session.openNotification(target) }
                    }
                }
            }
            .font(.system(size: 13.5))
        } label: {
            HStack(spacing: 12) {
                Circle().fill(run.status.tint).frame(width: 7, height: 7).frame(width: 20)
                VStack(alignment: .leading, spacing: 2) {
                    Text(run.routineName).font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    ((bot.map { Text(verbatim: $0.name) } ?? Text("Deleted agent"))
                        + Text(verbatim: " · \(Date(timeIntervalSince1970: run.scheduledFor / 1_000).formatted(date: .abbreviated, time: .shortened))"))
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                }
                Spacer()
                Text(run.status == "waiting" ? "Needs you" : run.status.capitalized)
                    .font(.system(size: 12.5)).foregroundStyle(run.status.tint)
            }
        }
    }
}

private struct RoutineEditorView: View {
    let routine: Routine?
    let onSaved: () async -> Void
    let onClose: () -> Void

    @EnvironmentObject private var session: Session
    @State private var name: String
    @State private var prompt: String
    @State private var botId: String
    @State private var runOn: RoutineRunLocation
    @State private var runAvailability: RoutineRunAvailability?
    @State private var availabilityLoaded: Bool
    @State private var kind: RoutineSchedule.Kind
    @State private var onceAt: Date
    @State private var dailyTime: Date
    @State private var weekdays: Set<Int>
    @State private var intervalAnchor: Date
    @State private var intervalPreset: Int
    @State private var customIntervalMinutes: Int?
    @State private var duration: Int
    @State private var timeoutMinutes: Int?
    @State private var intervalTimeoutDefaultApplied: Bool
    @State private var saving = false

    init(routine: Routine?, onSaved: @escaping () async -> Void, onClose: @escaping () -> Void) {
        self.routine = routine
        self.onSaved = onSaved
        self.onClose = onClose
        _name = State(initialValue: routine?.name ?? "")
        _prompt = State(initialValue: routine?.prompt ?? "")
        _botId = State(initialValue: routine?.botId ?? "")
        _runOn = State(initialValue: routine?.runLocation ?? .maus)
        _runAvailability = State(initialValue: nil)
        _availabilityLoaded = State(initialValue: false)
        _kind = State(initialValue: routine?.schedule.type ?? .daily)
        _onceAt = State(initialValue: routine?.schedule.at.map { Date(timeIntervalSince1970: $0 / 1_000) } ?? Date().addingTimeInterval(3_600))
        let parts = (routine?.schedule.time ?? "09:00").split(separator: ":").compactMap { Int($0) }
        let time = Calendar.current.date(bySettingHour: parts.first ?? 9, minute: parts.count > 1 ? parts[1] : 0, second: 0, of: Date()) ?? Date()
        _dailyTime = State(initialValue: time)
        _weekdays = State(initialValue: Set(routine?.schedule.weekdays ?? [1, 2, 3, 4, 5]))
        _intervalAnchor = State(initialValue: routine?.schedule.anchorAt.map { Date(timeIntervalSince1970: Double($0) / 1_000) } ?? Date().addingTimeInterval(15 * 60))
        let everyMinutes = routine?.schedule.everyMinutes ?? 15
        _intervalPreset = State(initialValue: Self.intervalPresets.contains(everyMinutes) ? everyMinutes : 0)
        _customIntervalMinutes = State(initialValue: everyMinutes)
        let duration = routine?.durationMinutes ?? 30
        _duration = State(initialValue: duration)
        let timeoutMinutes = routine?.timeoutMinutes
        _timeoutMinutes = State(initialValue: timeoutMinutes)
        _intervalTimeoutDefaultApplied = State(initialValue: routine != nil)
    }

    var body: some View {
        OrbitPanelList(icon: "calendar.badge.clock", kicker: "Routines",
                       title: routine == nil ? String(localized: "New routine") : routine!.name,
                       description: "Each run starts fresh and posts its result to the routine's thread, with the bot's own model, tools and apps.") {
            Section {
                OrbitField(label: "Name") {
                    TextField("Morning brief", text: $name)
                }
                OrbitField(label: "Bot") {
                    Picker("Bot", selection: $botId) {
                        Text("Choose a bot").tag("")
                        ForEach(session.state.bots.filter { $0.hidden != true }) { bot in Text(bot.name).tag(bot.id) }
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                    .tint(Orbit.ink)
                    .padding(.leading, -10)
                }
                OrbitField(label: "What should it do?") {
                    TextField("Summarize my inbox and flag anything urgent", text: $prompt, axis: .vertical).lineLimit(3...10)
                }
            } header: { OrbitSectionHeader("Work") }

            Section {
                HStack(spacing: 8) {
                    OrbitSegment(icon: "laptopcomputer", label: Text("This computer"), on: runOn == .maus) { runOn = .maus }
                    OrbitSegment(icon: "cloud", label: Text("Cloud VM"), on: runOn == .cloud, disabled: !cloudSelectable) { runOn = .cloud }
                }
                .padding(.vertical, 4)
                .listRowSeparator(.hidden)
                Group {
                    if !availabilityLoaded {
                        Text("Checking whether the cloud VM is available…")
                    } else if runAvailability == nil {
                        Text("Couldn't check the cloud VM.")
                    } else if runOn == .maus {
                        Text("Runs on the paired computer with the bot's own model and computer setting.")
                    } else if runAvailability?.cloudReady == true {
                        Text("Runs inside the bot's cloud VM, which wakes for each run. Keep Orbit running so it can start the job.")
                    } else {
                        Text("This routine keeps its cloud VM choice, but it can't run until the computer has a Boat API key and a Boat agent.")
                    }
                }
                .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                .listRowSeparator(.hidden)
            } header: { OrbitSectionHeader("Runs on") }

            Section {
                HStack(spacing: 6) {
                    if kind == .unknown {
                        OrbitSegment(icon: nil, label: Text("Newer"), on: true) {}
                    }
                    OrbitSegment(icon: nil, label: Text("Once"), on: kind == .once) { kind = .once }
                    OrbitSegment(icon: nil, label: Text("On days"), on: kind == .daily) { kind = .daily }
                    OrbitSegment(icon: nil, label: Text("Every few min"), on: kind == .interval) { kind = .interval }
                }
                .padding(.vertical, 4)
                .listRowSeparator(.hidden)
                if kind == .once {
                    DatePicker("Run", selection: $onceAt, in: Date()...)
                        .font(.system(size: 15)).foregroundStyle(Orbit.ink)
                } else if kind == .daily {
                    DatePicker("Time", selection: $dailyTime, displayedComponents: .hourAndMinute)
                        .font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    HStack(spacing: 6) {
                        ForEach(0..<7) { day in
                            let on = weekdays.contains(day)
                            Button {
                                if on { weekdays.remove(day) } else { weekdays.insert(day) }
                            } label: {
                                Text(Self.dayLetters[day])
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundStyle(on ? Color(hex: "#070707") : Orbit.ink60)
                                    .frame(maxWidth: .infinity).frame(height: 36)
                                    .background(Circle().fill(on ? Orbit.ink : Orbit.fill06))
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel(Self.dayNames[day])
                            .accessibilityAddTraits(on ? .isSelected : [])
                        }
                    }
                    .padding(.vertical, 4)
                } else if kind == .interval {
                    HStack(spacing: 6) {
                        ForEach(Self.intervalPresets, id: \.self) { minutes in
                            OrbitSegment(icon: nil, label: Text(minutes < 60 ? "\(minutes)m" : "1h"), on: intervalPreset == minutes) { intervalPreset = minutes }
                        }
                        OrbitSegment(icon: nil, label: Text("Other"), on: intervalPreset == 0) { intervalPreset = 0 }
                    }
                    .padding(.vertical, 4)
                    .listRowSeparator(.hidden)
                    .accessibilityLabel("How often this routine runs")
                    .accessibilityValue(intervalFrequencyAccessibilityValue)
                    if intervalPreset == 0 {
                        HStack {
                            Text("Every").foregroundStyle(Orbit.ink)
                            TextField("5–1,440", value: $customIntervalMinutes, format: .number)
                                .keyboardType(.numberPad)
                                .multilineTextAlignment(.trailing)
                                .frame(minWidth: 72)
                                .accessibilityLabel("Custom interval in minutes")
                            Text("minutes").foregroundStyle(Orbit.ink50)
                        }
                        .font(.system(size: 15))
                        if selectedIntervalMinutes == nil {
                            Text("Enter a whole number from 5 to 1,440 minutes.")
                                .font(.system(size: 12.5)).foregroundStyle(Orbit.dangerText)
                        }
                    }
                    DatePicker("Starting", selection: $intervalAnchor)
                        .font(.system(size: 15)).foregroundStyle(Orbit.ink)
                } else {
                    Text("This routine uses a schedule from a newer Orbit. Pick Once, On days or Every few min before saving.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.amberText)
                }
                Text(kind == .interval
                     ? "If the last run is still going, the next one is skipped, not queued."
                     : "Times follow the computer's clock.")
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    .listRowSeparator(.hidden)
            } header: { OrbitSectionHeader("Schedule") }

            Section {
                Picker(selection: $timeoutMinutes) {
                    Text("No limit").tag(nil as Int?)
                    ForEach(Self.timeoutOptions, id: \.self) { minutes in
                        Text(Self.durationLabel(minutes)).tag(Optional(minutes))
                    }
                } label: {
                    Text("Stop a run after").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                }
                .pickerStyle(.menu)
                .tint(Orbit.ink60)
                Text("Counts from when the work starts. It doesn't change how often the routine runs.")
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    .listRowSeparator(.hidden)
            } header: { OrbitSectionHeader("Run limit") }


        }
        .orbitPanelActions {
                    OrbitPanelButton(title: "Cancel", action: onClose)
                    Spacer()
                    Button { Task { await save() } } label: {
                        HStack(spacing: 6) {
                            if saving { ProgressView().controlSize(.small) }
                            Text(routine == nil ? "Create routine" : "Save")
                        }
                    }
                    .buttonStyle(OrbitPrimaryButtonStyle())
                    .disabled(
                        saving || kind == .unknown
                            || name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                            || prompt.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                            || botId.isEmpty
                            || (kind == .daily && weekdays.isEmpty)
                            || (kind == .interval && selectedIntervalMinutes == nil)
                    )
                    .accessibilityIdentifier("routine-save")
        }
        .onAppear { if botId.isEmpty { botId = session.state.bots.first(where: { $0.hidden != true })?.id ?? "" } }
        .onValueChange(of: kind) { nextKind in
            guard nextKind == .interval, !intervalTimeoutDefaultApplied else { return }
            timeoutMinutes = timeoutMinutes ?? 30
            intervalTimeoutDefaultApplied = true
        }
        .task {
            runAvailability = await session.loadRoutineRunAvailability()
            availabilityLoaded = true
        }
    }

    private var cloudSelectable: Bool {
        runAvailability?.canSelect(.cloud, preserving: runOn) ?? (runOn == .cloud)
    }

    private var selectedIntervalMinutes: Int? {
        let minutes = intervalPreset == 0 ? customIntervalMinutes : intervalPreset
        guard let minutes, (5...1_440).contains(minutes) else { return nil }
        return minutes
    }

    private var intervalFrequencyAccessibilityValue: String {
        intervalPreset == 0 ? "Custom interval" : "Every \(intervalPreset) minutes"
    }

    private func save() async {
        guard kind != .unknown else {
            session.actionError = "Choose a supported schedule before saving this routine."
            return
        }
        saving = true
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.timeZone = .current
        formatter.dateFormat = "HH:mm"
        let schedule: RoutineSchedule
        switch kind {
        case .once:
            schedule = .once(at: onceAt)
        case .daily:
            schedule = .daily(time: formatter.string(from: dailyTime), weekdays: weekdays.sorted())
        case .interval:
            guard let minutes = selectedIntervalMinutes else {
                session.actionError = "Choose an interval from 5 to 1,440 minutes."
                saving = false
                return
            }
            let anchor = Calendar.current.date(bySetting: .second, value: 0, of: intervalAnchor)
                ?? intervalAnchor
            schedule = .interval(everyMinutes: minutes, anchorAt: anchor)
        case .unknown:
            saving = false
            return
        }
        let input = RoutineInput(
            name: String(name.trimmingCharacters(in: .whitespacesAndNewlines).prefix(80)),
            prompt: String(prompt.trimmingCharacters(in: .whitespacesAndNewlines).prefix(20_000)),
            botId: botId, runOn: runOn.rawValue, enabled: routine?.enabled,
            schedule: schedule, durationMinutes: duration,
            timeoutMinutes: timeoutMinutes, clearTimeout: timeoutMinutes == nil
        )
        if await session.saveRoutine(input, id: routine?.id) != nil {
            await onSaved()
            onClose()
        }
        saving = false
    }

    private static let dayLetters = ["S", "M", "T", "W", "T", "F", "S"]
    fileprivate static let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    private static let intervalPresets = [5, 10, 15, 30, 60]
    private static let timeoutOptions = stride(from: 5, through: 240, by: 5).map { $0 }

    private static func durationLabel(_ minutes: Int) -> String {
        if minutes < 60 { return "\(minutes) min" }
        if minutes % 60 == 0 { return "\(minutes / 60) hr" }
        return "\(minutes / 60) hr \(minutes % 60) min"
    }
}

private extension RoutineRunLocation {
    var label: String {
        switch self {
        case .maus: "This computer"
        case .cloud: "Cloud VM"
        }
    }
}

private extension RoutineSchedule {
    var summary: String {
        switch type {
        case .once:
            guard let at else { return "One time · date unavailable" }
            return Date(timeIntervalSince1970: at / 1_000).formatted(date: .abbreviated, time: .shortened)
        case .unknown:
            return "Newer schedule"
        case .interval:
            guard let everyMinutes else { return "Interval unavailable" }
            let cadence = "Every \(everyMinutes) min"
            guard let anchorAt else { return cadence }
            let start = Date(timeIntervalSince1970: Double(anchorAt) / 1_000)
                .formatted(date: .abbreviated, time: .shortened)
            return "\(cadence) · starting \(start)"
        case .daily:
            break
        }
        let dayText: String
        let values = weekdays ?? []
        if values.count == 7 { dayText = "Every day" }
        else if values == [1, 2, 3, 4, 5] { dayText = "Weekdays" }
        else { dayText = values.compactMap { (0..<7).contains($0) ? RoutineEditorView.dayNames[$0].prefix(3) : nil }.joined(separator: ", ") }
        return "\(dayText) at \(time ?? "—")"
    }
}

private extension String {
    var symbol: String {
        switch self {
        case "running": "play.circle.fill"
        case "completed": "checkmark.circle.fill"
        case "waiting": "hand.raised.circle.fill"
        case "failed", "missed": "exclamationmark.triangle.fill"
        case "cancelled": "xmark.circle.fill"
        default: "clock.fill"
        }
    }
    var tint: Color {
        switch self {
        case "completed": Orbit.success
        case "waiting": Orbit.amberText
        case "failed", "missed": Orbit.dangerText
        default: Orbit.ink40
        }
    }
}
