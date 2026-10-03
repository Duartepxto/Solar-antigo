// A bot's systems: Approvals, Browser, Memory, Skills and Usage, in the
// prototype's style (kicker, title, Done, a line saying what it is, then
// segments, rows and switch lists). They open in the column, in place of the
// chat (OrbitShell). Each reads and writes through the narrow phone routes;
// what stays on the desktop says so.
import SwiftUI
import CompanionCore
import LocalAuthentication

// MARK: - Pieces

/// Face ID, Touch ID or the passcode, asked after a confirmation for
/// anything destructive or that raises what a bot may do. A phone with none
/// of them set up keeps the explicit confirmation alone.
enum OwnerCheck {
    static func passes(reason: String) async -> Bool {
        #if DEBUG
        // UI tests on a simulator can't answer the passcode sheet. Debug
        // builds only; the explicit confirmation before this still runs.
        if ProcessInfo.processInfo.arguments.contains("-ui-test-owner-check-passes")
            || ProcessInfo.processInfo.environment["ORBIT_UI_TEST_OWNER_CHECK"] == "passes" { return true }
        #endif
        let context = LAContext()
        var policyError: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &policyError) else { return true }
        return (try? await context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason)) ?? false
    }
}

/// One option in a sheet's segmented grid.
struct OrbitSegment: View {
    let icon: String?
    let label: Text
    let on: Bool
    var disabled = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                if let icon { Image(systemName: icon).font(.system(size: 16, weight: .medium)) }
                label.font(.system(size: 12, weight: .medium)).lineLimit(1).minimumScaleFactor(0.8)
            }
            .foregroundStyle(on ? Orbit.ink : Orbit.ink60)
            .frame(maxWidth: .infinity)
            .padding(.top, 12)
            .padding(.bottom, 10)
            .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(on ? Orbit.fill10 : .clear))
            .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(on ? Color.white.opacity(0.25) : Orbit.hairline))
            .opacity(disabled ? 0.4 : 1)
            .contentShape(RoundedRectangle(cornerRadius: Orbit.cardRadius))
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .accessibilityAddTraits(on ? .isSelected : [])
    }
}

/// A list row with a coloured dot, a name, a quiet meta line, and a switch
/// or a chevron — the prototype's sheet list.
struct OrbitSheetListRow<Trailing: View>: View {
    let name: String
    var meta: String = ""
    var dot: Color = Orbit.ink.opacity(0.2)
    @ViewBuilder var trailing: Trailing

    var body: some View {
        // The dot sits on the name's line, the text takes what the switch
        // leaves and grows downward, and the row grows with it: a long
        // description never runs under the switch or the divider.
        HStack(alignment: .center, spacing: 10) {
            HStack(alignment: .firstTextBaseline, spacing: 10) {
                Circle().fill(dot).frame(width: 7, height: 7).alignmentGuide(.firstTextBaseline) { $0[.bottom] - 1 }
                VStack(alignment: .leading, spacing: 3) {
                    Text(verbatim: name).font(.system(size: 14.5)).foregroundStyle(Orbit.ink).lineLimit(1).truncationMode(.middle)
                    if !meta.isEmpty {
                        Text(verbatim: meta).font(.system(size: 12.5)).foregroundStyle(Orbit.ink50).lineLimit(3)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .layoutPriority(1)
            trailing.fixedSize()
        }
        .padding(.vertical, 11)
        .frame(minHeight: 50)
        .overlay(alignment: .bottom) { Rectangle().fill(Color.white.opacity(0.07)).frame(height: 1) }
        .contentShape(Rectangle())
    }
}

/// An error in place, with the harness's own words.
struct OrbitSheetError: View {
    let message: String
    var body: some View {
        Label { Text(verbatim: message) } icon: { Image(systemName: "exclamationmark.triangle.fill") }
            .font(.system(size: 13))
            .foregroundStyle(Orbit.dangerText)
            .fixedSize(horizontal: false, vertical: true)
            .accessibilityIdentifier("sheet-error")
    }
}

private func formatTokens(_ n: Int) -> String {
    if n >= 1_000_000 { return String(format: "%.1fM", Double(n) / 1_000_000) }
    if n >= 1_000 { return "\(Int((Double(n) / 1_000).rounded()))k" }
    return "\(n)"
}

// MARK: - Approvals

/// The bot's approval level, changed from the phone. Full access asks twice:
/// a confirmation that says what it means, then Face ID or the passcode.
/// The server grants it only through the paired-phone channel.
struct ApprovalLevelSheet: View {
    let bot: Bot
    @EnvironmentObject private var session: Session
    @State private var driverKind: String?
    @State private var loaded = false
    @State private var pending: String?
    @State private var confirmingFull = false
    @State private var confirmingLocalAuto = false
    @State private var confirmingCustom = false
    @State private var saving = false
    @State private var error: String?

    private var live: Bot { session.state.bot(bot.id)?.projected(forThread: bot.threadId) ?? bot }
    private var mode: String { live.currentTaskApprovalMode }

    private static let meta: [String: (label: LocalizedStringKey, icon: String, note: LocalizedStringKey)] = [
        "ask": ("Ask", "hand.raised", "Asks before commands and file changes."),
        "edits": ("Edits", "square.and.pencil", "Edits files on its own and asks about everything else."),
        "auto": ("Auto", "sparkles", "The provider's reviewer approves routine actions and asks you about the rest."),
        "full": ("Full", "bolt", "No approval prompts. Questions and missing sign-ins still reach you."),
        "custom": ("Custom", "slider.horizontal.3", "Uses the permissions in Codex's config.toml on your computer."),
    ]

    private var levels: [String] {
        var out = loaded ? ApprovalLevels.supported(driverKind: driverKind) : ["ask", "auto"]
        if !out.contains(mode) { out.append(mode) }
        return out
    }

    var body: some View {
        OrbitSystemSheet(icon: "checkmark.shield", kicker: "Approvals", title: approvalLabel(mode), tint: OrbitPalette.label(bot.color),
                         description: "The engine's own permission mode. It applies to new threads, routines and delegated work.") {
            OrbitKicker("Approval level")
            HStack(spacing: 6) {
                ForEach(levels, id: \.self) { level in
                    let info = Self.meta[level] ?? Self.meta["ask"]!
                    OrbitSegment(icon: info.icon, label: Text(info.label), on: level == mode,
                                 disabled: saving) { choose(level) }
                        .accessibilityIdentifier("approval-\(level)")
                }
            }
            Text(Self.meta[mode]?.note ?? "")
                .font(.system(size: 13))
                .foregroundStyle(Orbit.ink80)
                .fixedSize(horizontal: false, vertical: true)
            if live.busy == true {
                Text("While \(bot.name) is working only a drop to Ask is possible; that also stops the turn.")
                    .font(.system(size: 12.5))
                    .foregroundStyle(Orbit.ink55)
            }
            if saving { ProgressView().tint(Orbit.ink50) }
            if let error { OrbitSheetError(message: error) }
            if let rules = live.alwaysAllow, !rules.isEmpty {
                OrbitKicker("Always allowed")
                VStack(spacing: 0) {
                    ForEach(rules, id: \.self) { rule in
                        OrbitSheetListRow(name: rule) { EmptyView() }
                    }
                }
            }
        }
        .task {
            driverKind = await session.driverKind(for: bot)
            loaded = true
        }
        .orbitConfirm(Text("Give \(bot.name) full access?"), isPresented: $confirmingFull, confirm: "Give full access", message: Text("\(bot.name) will run commands and change files without asking you first, on every new thread and on this one. Questions and missing sign-ins still reach you."), onCancel: { pending = nil }) { Task { await grantFull() } }
        .orbitConfirm(Text("Use Codex's own permissions for \(bot.name)?"), isPresented: $confirmingCustom, confirm: "Use Custom", message: Text("\(bot.name) will follow the approval and sandbox settings in ~/.codex/config.toml on your computer, which can let it act without asking."), onCancel: { pending = nil }) {
                Task {
                    guard await OwnerCheck.passes(reason: String(localized: "Confirm Custom approval for \(bot.name)")) else { pending = nil; return }
                    await send("custom", confirmCustom: true)
                }
            }
        .orbitConfirm(Text("Let \(bot.name) approve its own actions on this computer?"), isPresented: $confirmingLocalAuto, confirm: "Turn on Auto", message: Text("This bot works on your computer itself, signed in as you. Auto lets the provider's reviewer approve routine actions there without asking."), onCancel: { pending = nil }) { Task { await send("auto", acknowledgeLocalAuto: true) } }
    }

    private func choose(_ level: String) {
        guard level != mode, !saving else { return }
        error = nil
        pending = level
        Haptics.selection()
        if level == "full" { confirmingFull = true; return }
        if level == "custom" { confirmingCustom = true; return }
        if level == "auto" && live.computer == "local" { confirmingLocalAuto = true; return }
        Task { await send(level) }
    }

    private func grantFull() async {
        guard await OwnerCheck.passes(reason: String(localized: "Confirm full access for \(bot.name)")) else { pending = nil; return }
        await send("full", confirmFullAccess: true)
    }

    private func send(_ level: String, confirmFullAccess: Bool = false, confirmCustom: Bool = false, acknowledgeLocalAuto: Bool = false) async {
        saving = true
        defer { saving = false; pending = nil }
        do {
            try await session.setApprovalLevel(
                ApprovalLevelPatch(mode: level, threadId: bot.threadId, confirmFullAccess: confirmFullAccess, confirmCustom: confirmCustom, acknowledgeLocalAuto: acknowledgeLocalAuto),
                for: bot
            )
            Haptics.success()
        } catch {
            self.error = error.localizedDescription
        }
    }
}

// MARK: - Browser

struct BrowserSettingSheet: View {
    let bot: Bot
    @EnvironmentObject private var session: Session
    @State private var profiles: [BrowserProfileSummary] = []
    @State private var saving = false
    @State private var error: String?

    private var live: Bot { session.state.bot(bot.id) ?? bot }
    private var computerOff: Bool { ["none", "off"].contains(live.computer ?? "") }
    private var enabled: Bool { live.browser != false && !computerOff }

    var body: some View {
        OrbitSystemSheet(icon: "macwindow", kicker: "Browser",
                         title: enabled ? String(localized: "Own browser, own logins") : String(localized: "Browser off"),
                         tint: OrbitPalette.label(bot.color),
                         description: "A browser profile just for this bot, so logins survive restarts.") {
            OrbitKicker("Browser")
            OrbitSheetListRow(name: String(localized: "Built-in browser"),
                              meta: computerOff ? String(localized: "computer is off") : "",
                              dot: enabled ? Orbit.success : Orbit.ink.opacity(0.2)) {
                Toggle("", isOn: Binding(get: { enabled }, set: { value in update(BrowserSettingPatch(enabled: value)) }))
                    .labelsHidden()
                    .tint(Orbit.accent)
                    .disabled(saving || computerOff)
                    .accessibilityLabel("Built-in browser")
                    .accessibilityIdentifier("browser-toggle")
            }
            if enabled {
                OrbitKicker("Signed in as")
                VStack(spacing: 0) {
                    profileRow(id: nil, name: String(localized: "Its own browser"), meta: String(localized: "logins stay with this bot"))
                    ForEach(profiles) { profile in profileRow(id: profile.id, name: profile.name, meta: String(localized: "shared browser session")) }
                    profileRow(id: "guest", name: String(localized: "Guest"), meta: String(localized: "forgets everything when it closes"))
                }
                Text("Browser sessions are added and signed in on the desktop app.")
                    .font(.system(size: 12.5))
                    .foregroundStyle(Orbit.ink55)
            }
            if saving { ProgressView().tint(Orbit.ink50) }
            if let error { OrbitSheetError(message: error) }
        }
        .task { profiles = await session.configStatus()?.browserProfiles ?? [] }
    }

    private func profileRow(id: String?, name: String, meta: String) -> some View {
        let on = live.browserProfile == id || (id == nil && (live.browserProfile ?? "").isEmpty)
        return Button { if !on { update(BrowserSettingPatch(profile: .some(id))) } } label: {
            OrbitSheetListRow(name: name, meta: meta, dot: on ? Orbit.accent : Orbit.ink.opacity(0.2)) {
                if on { Image(systemName: "checkmark").font(.system(size: 13, weight: .semibold)).foregroundStyle(Orbit.link) }
            }
        }
        .buttonStyle(.plain)
        .disabled(saving)
    }

    private func update(_ patch: BrowserSettingPatch) {
        error = nil
        saving = true
        Task {
            defer { saving = false }
            do { try await session.setBrowser(patch, for: bot) } catch { self.error = orbitErrorText(error) }
        }
    }
}

// MARK: - Usage

struct BotUsageSheet: View {
    let bot: Bot
    @EnvironmentObject private var session: Session

    var body: some View {
        let usage = (session.state.bot(bot.id) ?? bot).usageTotals
        OrbitSystemSheet(icon: "dollarsign.circle", kicker: "Usage",
                         title: usage.turns == 1 ? String(localized: "1 turn") : String(localized: "\(usage.turns) turns"), tint: OrbitPalette.label(bot.color),
                         description: usage.costUsd != nil ? "What this bot has spent, as reported by its engine." : "This engine doesn't report a price; tokens are counted.") {
            VStack(spacing: 0) {
                OrbitSheetRow(key: "Turns", value: "\(usage.turns)")
                OrbitSheetRow(key: "Tokens", value: formatTokens(usage.tokens))
                OrbitSheetRow(key: "Read again from context", value: formatTokens(usage.cachedInput))
                OrbitSheetRow(key: "Cost", value: usage.costUsd.map { String(format: "$%.2f", $0) } ?? "—")
                OrbitSheetRow(key: "Threads", value: "\(usage.threads)")
            }
        }
    }
}

// MARK: - Skills

struct BotSkillsSheet: View {
    let bot: Bot
    @EnvironmentObject private var session: Session
    @State private var listing: SkillsListing?
    @State private var reviewing: SkillSummary?
    @State private var busy: String?
    @State private var error: String?
    @State private var removing: SkillSummary?
    @State private var source = ""
    @State private var previews: [SkillPreview]?
    @State private var fetching = false

    var body: some View {
        NavigationStack {
            OrbitSystemSheet(icon: "book", kicker: "Skills", title: String(localized: "Skills"), tint: OrbitPalette.label(bot.color),
                             description: "Instructions this bot can load when a task calls for them. Turning one on shows its whole SKILL.md first.") {
                if let listing {
                    OrbitKicker("Skills")
                    if listing.skills.isEmpty {
                        Text("No skills yet.").font(.system(size: 14)).foregroundStyle(Orbit.ink50)
                    }
                    VStack(spacing: 0) {
                        ForEach(listing.skills) { skill in
                            OrbitSheetListRow(name: skill.name, meta: skill.description,
                                              dot: skill.enabled ? Orbit.success : Orbit.ink.opacity(0.2)) {
                                Toggle("", isOn: Binding(get: { skill.enabled }, set: { on in
                                    if on { reviewing = skill } else { Task { await set(skill, false) } }
                                }))
                                .labelsHidden()
                                .tint(Orbit.accent)
                                .disabled(busy != nil)
                                .accessibilityLabel(Text(verbatim: skill.name))
                            }
                            .contextMenu {
                                Button(role: .destructive) { removing = skill } label: { Label("Remove skill", systemImage: "trash") }
                            }
                            .accessibilityAction(named: Text("Remove skill")) { removing = skill }
                            .accessibilityIdentifier("skill-row-\(skill.name)")
                        }
                    }
                    if let staged = listing.staged, !staged.isEmpty {
                        OrbitKicker("Proposed by the bot")
                        VStack(spacing: 0) {
                            ForEach(staged) { item in
                                OrbitSheetListRow(name: item.name, meta: item.gist ?? "") { EmptyView() }
                            }
                        }
                        Text("Each proposal waits as a card in Waiting on you and in the chat, with its whole SKILL.md to read before you allow it.")
                            .font(.system(size: 12.5)).foregroundStyle(Orbit.ink55)
                    }
                    OrbitKicker("Add from GitHub")
                    HStack(spacing: 8) {
                        TextField(text: $source) { Text("owner/repo or a GitHub URL").foregroundStyle(Orbit.ink40) }
                            .font(.system(size: 14))
                            .foregroundStyle(Orbit.ink)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                            .padding(.horizontal, 12)
                            .frame(height: 38)
                            .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                            .accessibilityIdentifier("skill-source")
                        Button(fetching ? "…" : String(localized: "Preview")) { Task { await preview() } }
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(Orbit.ink)
                            .padding(.horizontal, 14)
                            .frame(height: 38)
                            .background(Capsule().strokeBorder(Orbit.borderStrong))
                            .disabled(source.trimmingCharacters(in: .whitespaces).isEmpty || fetching)
                            .accessibilityIdentifier("skill-preview")
                    }
                    Text("Nothing is installed until you read it. Press and hold a skill to remove it.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink55)
                } else if error == nil {
                    ProgressView().tint(Orbit.ink50)
                }
                if let error { OrbitSheetError(message: error) }
            }
            .toolbar(.hidden, for: .navigationBar)
            .overlay {
                if let skill = reviewing {
                    OrbitSubpage(back: "Skills", onBack: { reviewing = nil }) {
                        SkillReviewView(bot: bot, skill: skill) { Task { await set(skill, true) } }
                    }
                } else if let found = previews {
                    OrbitSubpage(back: "Skills", onBack: { previews = nil }) {
                        SkillImportReviewView(bot: bot, previews: found) {
                            previews = nil
                            source = ""
                            Task { await load() }
                        }
                    }
                }
            }
            .animation(.easeOut(duration: 0.18), value: reviewing?.name)
        }
        .task { await load() }
        .orbitConfirm(Text("Remove \(removing?.name ?? "")?"), isPresented: Binding(get: { removing != nil }, set: { if !$0 { removing = nil } }), confirm: "Remove", message: Text("Its files are deleted from \(bot.name)'s workspace."), onCancel: { removing = nil }) { if let skill = removing { Task { await remove(skill) } } }
    }

    private func preview() async {
        fetching = true
        error = nil
        defer { fetching = false }
        do {
            let found = try await session.previewSkills(source: source.trimmingCharacters(in: .whitespaces))
            if found.isEmpty { error = String(localized: "No SKILL.md found there.") } else { previews = found }
        } catch { self.error = orbitErrorText(error) }
    }

    private func remove(_ skill: SkillSummary) async {
        removing = nil
        guard await OwnerCheck.passes(reason: String(localized: "Remove \(skill.name) from \(bot.name)")) else { return }
        do {
            try await session.removeSkill(skill.name, for: bot)
            Haptics.success()
            await load()
        } catch { self.error = orbitErrorText(error) }
    }

    private func load() async {
        do { listing = try await session.skills(for: bot) } catch { self.error = orbitErrorText(error) }
    }

    private func set(_ skill: SkillSummary, _ enabled: Bool) async {
        busy = skill.name
        error = nil
        defer { busy = nil }
        do {
            try await session.setSkill(skill.name, enabled: enabled, for: bot)
            reviewing = nil
            await load()
        } catch { self.error = orbitErrorText(error) }
    }
}

/// The whole SKILL.md, read before it is turned on — the desktop's rule.
private struct SkillReviewView: View {
    let bot: Bot
    let skill: SkillSummary
    let enable: () -> Void
    @EnvironmentObject private var session: Session
    @State private var text: String?
    @State private var error: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            OrbitKicker("Review SKILL.md")
            Text(verbatim: skill.name).font(.system(size: 19, weight: .semibold)).foregroundStyle(Orbit.ink)
            if let warnings = skill.warnings, !warnings.isEmpty {
                ForEach(warnings, id: \.self) { OrbitSheetError(message: $0) }
            }
            ScrollView {
                Text(verbatim: text ?? "")
                    .font(.system(size: 12.5, design: .monospaced))
                    .foregroundStyle(Orbit.ink80)
                    .textSelection(.enabled)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
            }
            .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.fill04))
            if let error { OrbitSheetError(message: error) }
            Button("Turn on", action: enable)
                .buttonStyle(OrbitPrimaryButtonStyle())
                .frame(maxWidth: .infinity)
                .disabled(text == nil)
                .accessibilityIdentifier("skill-enable")
        }
        .padding(18)
        .background(Orbit.sheet.ignoresSafeArea())
        .task {
            do { text = try await session.skillText(skill.name, for: bot) } catch { self.error = orbitErrorText(error) }
        }
    }
}

// MARK: - Memory

struct BotMemorySheet: View {
    let bot: Bot
    @EnvironmentObject private var session: Session
    @State private var overview: MemoryOverview?
    @State private var editing: String?
    @State private var newTopic = ""
    @State private var error: String?
    @State private var deleting: MemoryFileInfo?
    @State private var showingHistory = false

    var body: some View {
        NavigationStack {
            OrbitSystemSheet(icon: "brain", kicker: "Memory", title: MemoryOverview.indexPath, tint: OrbitPalette.label(bot.color),
                             description: memoryDescription) {
                if let overview {
                    VStack(spacing: 0) {
                        OrbitSheetRow(key: "Loads each turn", value: String(localized: "\(overview.index.loadedLines) of \(overview.index.maxLines) lines"))
                        OrbitSheetRow(key: "Topics", value: String(localized: "\(overview.topics.count) files"))
                    }
                    OrbitKicker("Files")
                    VStack(spacing: 0) {
                        fileRow(MemoryOverview.indexPath, name: MemoryOverview.indexPath, meta: String(localized: "loads each turn"))
                        ForEach(overview.topics) { topic in
                            fileRow(topic.path, name: topic.name.replacingOccurrences(of: ".md", with: ""), meta: RelativeStamp.list(topic.modifiedAt))
                                .contextMenu {
                                    Button(role: .destructive) { deleting = topic } label: { Label("Delete topic", systemImage: "trash") }
                                }
                                .swipeActions { Button(role: .destructive) { deleting = topic } label: { Label("Delete", systemImage: "trash") } }
                                .accessibilityAction(named: Text("Delete topic")) { deleting = topic }
                        }
                    }
                    HStack(spacing: 8) {
                        TextField(text: $newTopic) { Text("New topic").foregroundStyle(Orbit.ink40) }
                            .font(.system(size: 14))
                            .foregroundStyle(Orbit.ink)
                            .padding(.horizontal, 12)
                            .frame(height: 38)
                            .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                            .submitLabel(.done)
                            .onSubmit(addTopic)
                        Button("Add", action: addTopic)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(Orbit.ink)
                            .padding(.horizontal, 14)
                            .frame(height: 38)
                            .background(Capsule().strokeBorder(Orbit.borderStrong))
                            .disabled(Self.topicFileName(newTopic) == nil)
                    }
                    if !overview.logs.isEmpty {
                        OrbitKicker("Log · read only")
                        VStack(spacing: 0) {
                            ForEach(overview.logs) { log in
                                fileRow(log.path, name: log.name.replacingOccurrences(of: ".md", with: ""), meta: RelativeStamp.list(log.modifiedAt))
                            }
                        }
                    }
                    Button { showingHistory = true } label: {
                        OrbitSheetListRow(name: String(localized: "History"), meta: String(localized: "every change, and undo")) {
                            Image(systemName: "chevron.right").font(.system(size: 12, weight: .semibold)).foregroundStyle(Orbit.ink40)
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("memory-history")
                    Text("Press and hold a topic to delete it.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink55)
                } else if error == nil {
                    ProgressView().tint(Orbit.ink50)
                }
                if let error { OrbitSheetError(message: error) }
            }
            .toolbar(.hidden, for: .navigationBar)
            .overlay {
                if let path = editing {
                    OrbitSubpage(back: "Memory", onBack: { editing = nil }) {
                        MemoryEditorView(bot: bot, path: path, readOnly: path.hasPrefix("memory/log/")) { Task { await load() } }
                    }
                } else if showingHistory {
                    OrbitSubpage(back: "Memory", onBack: { showingHistory = false }) {
                        MemoryHistoryView(bot: bot) { Task { await load() } }
                    }
                }
            }
            .animation(.easeOut(duration: 0.18), value: editing)
            .animation(.easeOut(duration: 0.18), value: showingHistory)
        }
        .task { await load() }
        .orbitConfirm(Text("Delete \(deleting?.name ?? "")?"), isPresented: Binding(get: { deleting != nil }, set: { if !$0 { deleting = nil } }), confirm: "Delete", message: Text("\(bot.name) stops loading this topic. The change is kept in History, where it can be undone."), onCancel: { deleting = nil }) {
                guard let topic = deleting else { return }
                Task { await delete(topic) }
            }
    }

    private func delete(_ topic: MemoryFileInfo) async {
        deleting = nil
        guard await OwnerCheck.passes(reason: String(localized: "Delete \(topic.name) from \(bot.name)'s memory")) else { return }
        do {
            try await session.deleteMemoryFile(topic.path, for: bot)
            Haptics.success()
            await load()
        } catch { self.error = orbitErrorText(error) }
    }

    private var memoryDescription: LocalizedStringKey {
        if let overview { return "Plain markdown in the bot's own workspace. The first \(overview.index.maxLines) lines load each turn." }
        return "Plain markdown in the bot's own workspace."
    }

    private func fileRow(_ path: String, name: String, meta: String) -> some View {
        Button { editing = path } label: {
            OrbitSheetListRow(name: name, meta: meta) {
                Image(systemName: "chevron.right").font(.system(size: 12, weight: .semibold)).foregroundStyle(Orbit.ink40)
            }
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier("memory-\(path)")
    }

    private func load() async {
        do { overview = try await session.memory(for: bot) } catch { self.error = orbitErrorText(error) }
    }

    private func addTopic() {
        guard let name = Self.topicFileName(newTopic) else { return }
        newTopic = ""
        editing = "memory/\(name)"
    }

    /// The desktop's topicFileName (src/lib/memory.ts).
    static func topicFileName(_ input: String) -> String? {
        var stem = input.trimmingCharacters(in: .whitespaces)
        if stem.lowercased().hasSuffix(".md") { stem = String(stem.dropLast(3)) }
        stem = stem.replacingOccurrences(of: #"[^\w .-]+"#, with: "-", options: .regularExpression)
        stem = stem.replacingOccurrences(of: #"^[^\w]+"#, with: "", options: .regularExpression)
            .trimmingCharacters(in: .whitespaces)
        return stem.isEmpty ? nil : "\(stem).md"
    }
}

/// One memory file, edited in place. Saves carry the hash the phone read,
/// so a change the bot made meanwhile comes back as a choice, not a loss.
private struct MemoryEditorView: View {
    let bot: Bot
    let path: String
    let readOnly: Bool
    let saved: () -> Void
    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @State private var text = ""
    @State private var hash: String?
    @State private var original = ""
    @State private var loaded = false
    @State private var saving = false
    @State private var conflict: (current: String, hash: String)?
    @State private var error: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                VStack(alignment: .leading, spacing: 1) {
                    OrbitKicker(readOnly ? "Memory log" : "Memory")
                    Text(verbatim: path).font(.system(size: 16, weight: .semibold)).foregroundStyle(Orbit.ink).lineLimit(1)
                }
                Spacer()
                if !readOnly {
                    Button(saving ? "Saving…" : "Save") { Task { await save(expected: hash) } }
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Color(hex: "#070707"))
                        .padding(.horizontal, 14)
                        .frame(height: 32)
                        .background(Capsule().fill(Orbit.ink.opacity(text != original && !saving ? 1 : 0.35)))
                        .disabled(text == original || saving || !loaded)
                        .accessibilityIdentifier("memory-save")
                }
            }
            if let conflict {
                VStack(alignment: .leading, spacing: 8) {
                    Text("The bot changed this file after you opened it.")
                        .font(.system(size: 13.5)).foregroundStyle(Orbit.ink)
                    HStack(spacing: 8) {
                        Button("Load theirs") {
                            text = conflict.current; original = conflict.current; hash = conflict.hash; self.conflict = nil
                        }
                        Button("Keep mine and save") { Task { await save(expected: conflict.hash) } }
                    }
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Orbit.link)
                }
                .padding(12)
                .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.amber.opacity(0.06)))
                .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(Orbit.amber.opacity(0.27)))
            }
            if let error { OrbitSheetError(message: error) }
            TextEditor(text: $text)
                .font(.system(size: 13.5, design: .monospaced))
                .foregroundStyle(Orbit.ink90)
                .scrollContentBackground(.hidden)
                .padding(8)
                .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.fill04))
                .disabled(readOnly || !loaded)
                .accessibilityIdentifier("memory-editor")
        }
        .padding(18)
        .background(Orbit.sheet.ignoresSafeArea())
        .task {
            do {
                let doc = try await session.memoryFile(path, for: bot)
                let starter = path.hasPrefix("memory/") && !doc.exists && !readOnly
                    ? "# \((path as NSString).lastPathComponent.replacingOccurrences(of: ".md", with: ""))\n\n" : doc.text
                text = starter
                original = doc.exists ? doc.text : ""
                hash = doc.exists ? doc.hash : nil
                loaded = true
            } catch { self.error = orbitErrorText(error) }
        }
    }

    private func save(expected: String?) async {
        saving = true
        error = nil
        defer { saving = false }
        do {
            switch try await session.saveMemoryFile(path, text: text, expectedHash: expected, for: bot) {
            case let .saved(doc):
                original = doc.text
                hash = doc.hash
                conflict = nil
                Haptics.success()
                saved()
            case let .conflict(current, currentHash):
                conflict = (current, currentHash)
            }
        } catch { self.error = orbitErrorText(error) }
    }
}


/// Every change to the bot's memory, newest first, with undo — the desktop's
/// History. Undo asks for Face ID or the passcode; an undo is itself a
/// change that can be undone.
private struct MemoryHistoryView: View {
    let bot: Bot
    let changed: () -> Void
    @EnvironmentObject private var session: Session
    @State private var rows: [MemoryJournalRow]?
    @State private var reverting: MemoryJournalRow?
    @State private var error: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                OrbitKicker("Memory")
                Text("History").font(.system(size: 19, weight: .semibold)).foregroundStyle(Orbit.ink)
                if let error { OrbitSheetError(message: error) }
                if let rows {
                    if rows.isEmpty {
                        Text("No changes yet.").font(.system(size: 14)).foregroundStyle(Orbit.ink50)
                    }
                    VStack(spacing: 0) {
                        ForEach(rows) { row in
                            OrbitSheetListRow(name: "\(kindLabel(row.kind)) \(row.path)", meta: meta(row), dot: row.actor == "bot" ? OrbitPalette.color(bot.color) : Orbit.link) {
                                if row.canRevert == true {
                                    Button("Undo") { reverting = row }
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundStyle(Orbit.ink)
                                        .padding(.horizontal, 12)
                                        .frame(height: 30)
                                        .background(Capsule().strokeBorder(Orbit.borderStrong))
                                        .accessibilityIdentifier("memory-undo-\(row.id)")
                                }
                            }
                        }
                    }
                } else if error == nil {
                    ProgressView().tint(Orbit.ink50)
                }
            }
            .padding(18)
        }
        .background(Orbit.sheet.ignoresSafeArea())
        .task { await load() }
        .orbitConfirm(Text("Undo this change?"), isPresented: Binding(get: { reverting != nil }, set: { if !$0 { reverting = nil } }), confirm: "Undo", message: Text("\(reverting?.path ?? "") goes back to how it was before this change."), onCancel: { reverting = nil }) { if let row = reverting { Task { await revert(row) } } }
    }

    private func kindLabel(_ kind: String) -> String {
        switch kind {
        case "created": String(localized: "Created")
        case "deleted": String(localized: "Deleted")
        default: String(localized: "Edited")
        }
    }

    private func meta(_ row: MemoryJournalRow) -> String {
        let who = row.actor == "bot" ? bot.name : row.actor == "import" ? String(localized: "Import") : String(localized: "You")
        var parts = [who, RelativeStamp.list(row.at)]
        if let added = row.added, let removed = row.removed { parts.append("+\(added) −\(removed)") }
        if row.canRevert != true, let reason = row.revertUnavailableReason { parts.append(reason) }
        return parts.joined(separator: " · ")
    }

    private func load() async {
        do { rows = try await session.memoryJournal(for: bot) } catch { self.error = orbitErrorText(error) }
    }

    private func revert(_ row: MemoryJournalRow) async {
        reverting = nil
        guard await OwnerCheck.passes(reason: String(localized: "Undo a change to \(bot.name)'s memory")) else { return }
        do {
            try await session.revertMemoryChange(row, for: bot)
            Haptics.success()
            changed()
            await load()
        } catch { self.error = orbitErrorText(error) }
    }
}


/// What an import would install, read before anything lands: each SKILL.md
/// in full with the scan's warnings. Install writes exactly this text,
/// turned off; turning it on is the usual review.
private struct SkillImportReviewView: View {
    let bot: Bot
    let previews: [SkillPreview]
    let done: () -> Void
    @EnvironmentObject private var session: Session
    @State private var installed = Set<String>()
    @State private var error: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                OrbitKicker("Review before installing")
                Text("\(previews.count) skills found").font(.system(size: 19, weight: .semibold)).foregroundStyle(Orbit.ink)
                    .accessibilityIdentifier("skill-import-review")
                if let error { OrbitSheetError(message: error) }
                ForEach(previews) { preview in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(verbatim: preview.name).font(.system(size: 15, weight: .semibold)).foregroundStyle(Orbit.ink)
                            Spacer()
                            Button(installed.contains(preview.name) ? String(localized: "Installed") : String(localized: "Install")) {
                                Task { await install(preview) }
                            }
                            .buttonStyle(OrbitPrimaryButtonStyle())
                            .controlSize(.small)
                            .disabled(installed.contains(preview.name))
                            .accessibilityIdentifier("skill-install-\(preview.name)")
                        }
                        Text(verbatim: preview.description).font(.system(size: 13)).foregroundStyle(Orbit.ink70)
                        ForEach(preview.warnings, id: \.self) { OrbitSheetError(message: $0) }
                        Text(verbatim: preview.text)
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundStyle(Orbit.ink80)
                            .textSelection(.enabled)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(10)
                            .background(RoundedRectangle(cornerRadius: 10).fill(Orbit.fill04))
                    }
                    .padding(12)
                    .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(Orbit.hairline))
                }
                Button("Done", action: done)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Orbit.link)
                    .frame(maxWidth: .infinity)
            }
            .padding(18)
        }
        .background(Orbit.sheet.ignoresSafeArea())
    }

    private func install(_ preview: SkillPreview) async {
        error = nil
        do {
            try await session.installSkill(preview, for: bot)
            installed.insert(preview.name)
            Haptics.success()
        } catch { self.error = orbitErrorText(error) }
    }
}
