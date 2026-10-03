// A bot's settings panel and a channel's, from the phone: everything the
// desktop's panels change that isn't a system sheet of its own. Each write
// goes through the desktop's own handlers (companion/src/routes.ts); deleting
// or raising what a bot may do confirms, then asks for Face ID or the passcode.
import SwiftUI
import CompanionCore

// MARK: - Bot settings

struct BotSettingsSheet: View {
    let bot: Bot
    let deleted: () -> Void
    @EnvironmentObject private var session: Session
    @State private var folder = ""
    @State private var newTeam = ""
    @State private var saving = false
    @State private var error: String?
    @State private var confirmingDelete = false
    @State private var confirmingPeers = false
    @State private var confirmingLocalComputer = false
    @State private var editingTeam = false
    @State private var rules: CommandAllowlist?
    @State private var newCommand = ""
    @State private var confirmingRule = false

    private var live: Bot { session.state.bot(bot.id) ?? bot }
    private var team: String { live.section?.trimmingCharacters(in: .whitespacesAndNewlines) ?? "" }
    private var teams: [String] {
        var names = session.state.sidebarSections.map(\.name)
        if !team.isEmpty && !names.contains(team) { names.append(team) }
        return names
    }

    private static let computers: [(id: String?, label: LocalizedStringKey, icon: String)] = [
        (nil, "Auto", "wand.and.stars"), ("cloud", "Cloud", "cloud"), ("vm", "Local VM", "shippingbox"),
        ("local", "This Mac", "laptopcomputer"), ("browser", "Browser", "macwindow"), ("off", "Off", "circle.slash"),
    ]

    var body: some View {
        NavigationStack {
            OrbitSystemSheet(icon: "gearshape", kicker: "Settings", title: live.name, tint: OrbitPalette.label(bot.color),
                             description: "Where this bot works, its team, and what it may reach. The same settings as the desktop panel.") {
                OrbitKicker("Works on")
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 6), count: 3), spacing: 6) {
                    ForEach(Self.computers, id: \.icon) { option in
                        OrbitSegment(icon: option.icon, label: Text(option.label), on: (live.computer ?? nil) == option.id, disabled: saving) {
                            if option.id == "local" && live.currentTaskApprovalMode == "auto" { confirmingLocalComputer = true; return }
                            apply { $0.computer = .some(option.id) }
                        }
                        .accessibilityIdentifier("computer-\(option.id ?? "auto")")
                    }
                }

                OrbitKicker("Working folder")
                HStack(spacing: 8) {
                    TextField(text: $folder) { Text(verbatim: live.cwdLabel).foregroundStyle(Orbit.ink40) }
                        .font(.system(size: 13, design: .monospaced))
                        .foregroundStyle(Orbit.ink)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding(.horizontal, 12)
                        .frame(height: 38)
                        .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                        .accessibilityIdentifier("settings-folder")
                    Button("Set") { apply { $0.cwd = .some(folder.trimmingCharacters(in: .whitespaces)) }; folder = "" }
                        .font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 14).frame(height: 38)
                        .background(Capsule().strokeBorder(Orbit.borderStrong))
                        .disabled(folder.trimmingCharacters(in: .whitespaces).isEmpty || saving)
                }
                Text("A folder path on your computer. It must already exist there.")
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink55)

                OrbitKicker("Team")
                VStack(spacing: 0) {
                    teamRow(nil, name: String(localized: "No team"), meta: String(localized: "reports to you"))
                    ForEach(teams, id: \.self) { name in teamRow(name, name: name, meta: "") }
                }
                HStack(spacing: 8) {
                    TextField(text: $newTeam) { Text("New team").foregroundStyle(Orbit.ink40) }
                        .font(.system(size: 14)).foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 12).frame(height: 38)
                        .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                    Button("Move") { let name = newTeam.trimmingCharacters(in: .whitespaces); newTeam = ""; apply { $0.section = .some(name) } }
                        .font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 14).frame(height: 38)
                        .background(Capsule().strokeBorder(Orbit.borderStrong))
                        .disabled(newTeam.trimmingCharacters(in: .whitespaces).isEmpty || saving)
                }
                if !team.isEmpty {
                    Button { editingTeam = true } label: {
                        OrbitSheetListRow(name: String(localized: "\(team): name and brief"), meta: String(localized: "rename, delete, or edit what every bot in it reads")) {
                            Image(systemName: "chevron.right").font(.system(size: 12, weight: .semibold)).foregroundStyle(Orbit.ink40)
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("settings-team")
                }

                OrbitKicker("Role and reach")
                VStack(spacing: 0) {
                    toggleRow(String(localized: "Chief of Staff"), meta: String(localized: "coordinates its team"), on: live.chiefOfStaff == true, id: "chief") { value in
                        apply { $0.chiefOfStaff = value }
                    }
                    toggleRow(String(localized: "Message other bots without asking"), meta: "", on: live.approvePeerComms == true, id: "peers") { value in
                        if value { confirmingPeers = true } else { apply { $0.approvePeerComms = false } }
                    }
                    toggleRow(String(localized: "Pinned"), meta: "", on: live.pinned == true, id: "pinned") { value in apply { $0.pinned = value } }
                    toggleRow(String(localized: "Hidden from the map"), meta: "", on: live.hidden == true, id: "hidden") { value in apply { $0.hidden = value } }
                }

                OrbitKicker("Commands it may run without asking")
                if let rules {
                    if !rules.supported {
                        Text("This engine doesn't report exact commands.").font(.system(size: 13)).foregroundStyle(Orbit.ink55)
                    } else {
                        VStack(spacing: 0) {
                            ForEach(rules.rules) { rule in
                                OrbitSheetListRow(name: rule.command, meta: rule.cwd) {
                                    Button { Task { await removeRule(rule) } } label: {
                                        Image(systemName: "minus.circle").foregroundStyle(Orbit.dangerText)
                                    }
                                    .buttonStyle(.plain)
                                    .accessibilityLabel(Text("Remove \(rule.command)"))
                                }
                            }
                        }
                        HStack(spacing: 8) {
                            TextField(text: $newCommand) { Text("An exact command").foregroundStyle(Orbit.ink40) }
                                .font(.system(size: 13, design: .monospaced)).foregroundStyle(Orbit.ink)
                                .textInputAutocapitalization(.never).autocorrectionDisabled()
                                .padding(.horizontal, 12).frame(height: 38)
                                .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                                .accessibilityIdentifier("settings-command")
                            Button("Allow") { confirmingRule = true }
                                .font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink)
                                .padding(.horizontal, 14).frame(height: 38)
                                .background(Capsule().strokeBorder(Orbit.borderStrong))
                                .disabled(newCommand.trimmingCharacters(in: .whitespaces).isEmpty)
                        }
                        if let cwd = rules.context.cwd {
                            Text("In \(cwd)").font(.system(size: 12, design: .monospaced)).foregroundStyle(Orbit.ink50)
                        }
                    }
                } else {
                    ProgressView().tint(Orbit.ink50)
                }

                if saving { ProgressView().tint(Orbit.ink50) }
                if let error { OrbitSheetError(message: error) }

                Button { confirmingDelete = true } label: {
                    Text("Delete \(live.name)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Orbit.dangerText)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(Orbit.danger.opacity(0.4)))
                }
                .buttonStyle(.plain)
                .padding(.top, 8)
                .accessibilityIdentifier("settings-delete")
            }
            .toolbar(.hidden, for: .navigationBar)
            .overlay {
                if editingTeam {
                    OrbitSubpage(back: "Settings", onBack: { editingTeam = false }) { TeamSettingsView(section: team) }
                }
            }
            .animation(.easeOut(duration: 0.18), value: editingTeam)
        }
        .task { rules = try? await session.commandAllowlist(for: bot) }
        .orbitConfirm(Text("Delete \(live.name)?"), isPresented: $confirmingDelete, confirm: "Delete", message: Text("Its turns stop and it leaves the map, with its threads.")) { Task { await deleteBot() } }
        .orbitConfirm(Text("Let \(live.name) message other bots without asking?"), isPresented: $confirmingPeers, confirm: "Allow") {
                Task {
                    guard await OwnerCheck.passes(reason: String(localized: "Let \(live.name) message other bots")) else { return }
                    apply { $0.approvePeerComms = true }
                }
            }
        .orbitConfirm(Text("Work on your computer itself, on Auto?"), isPresented: $confirmingLocalComputer, confirm: "Continue", message: Text("This bot is on Auto: the provider's reviewer approves routine actions on your computer, signed in as you.")) {
                Task {
                    guard await OwnerCheck.passes(reason: String(localized: "Let \(live.name) work on this computer")) else { return }
                    apply { $0.computer = .some("local"); $0.acknowledgeLocalAuto = true }
                }
            }
        .orbitConfirm(Text("Let \(live.name) run this without asking?"), isPresented: $confirmingRule, confirm: "Allow", message: Text(verbatim: newCommand)) { Task { await addRule() } }
    }

    private func teamRow(_ id: String?, name: String, meta: String) -> some View {
        let on = (id ?? "") == team
        return Button { if !on { apply { $0.section = .some(id) } } } label: {
            OrbitSheetListRow(name: name, meta: meta, dot: on ? Orbit.accent : Orbit.ink.opacity(0.2)) {
                if on { Image(systemName: "checkmark").font(.system(size: 13, weight: .semibold)).foregroundStyle(Orbit.link) }
            }
        }
        .buttonStyle(.plain)
        .disabled(saving)
    }

    private func toggleRow(_ name: String, meta: String, on: Bool, id: String, set: @escaping (Bool) -> Void) -> some View {
        OrbitSheetListRow(name: name, meta: meta, dot: on ? Orbit.success : Orbit.ink.opacity(0.2)) {
            Toggle("", isOn: Binding(get: { on }, set: set))
                .labelsHidden().tint(Orbit.accent).disabled(saving)
                .accessibilityLabel(Text(verbatim: name))
                .accessibilityIdentifier("settings-\(id)")
        }
    }

    private func apply(_ change: (inout BotSettingsPatch) -> Void) {
        var patch = BotSettingsPatch()
        change(&patch)
        saving = true
        error = nil
        Task {
            defer { saving = false }
            do { try await session.updateSettings(patch, for: bot) } catch { self.error = orbitErrorText(error) }
        }
    }

    private func addRule() async {
        guard let rules, let cwd = rules.context.cwd else { return }
        guard await OwnerCheck.passes(reason: String(localized: "Let \(live.name) run a command without asking")) else { return }
        do {
            self.rules = try await session.addCommandRule(newCommand.trimmingCharacters(in: .whitespaces), cwd: cwd,
                                                           providerInstanceId: rules.context.providerInstanceId, for: bot)
            newCommand = ""
        } catch { self.error = orbitErrorText(error) }
    }

    private func removeRule(_ rule: CommandRule) async {
        do { rules = try await session.removeCommandRule(rule, for: bot) } catch { self.error = orbitErrorText(error) }
    }

    private func deleteBot() async {
        guard await OwnerCheck.passes(reason: String(localized: "Delete \(live.name)")) else { return }
        do {
            try await session.deleteBot(bot)
            Haptics.success()
            deleted()
        } catch { self.error = orbitErrorText(error) }
    }
}

extension Bot {
    /// The working folder as the settings panel shows it.
    var cwdLabel: String { (cwd?.isEmpty == false ? cwd : nil) ?? String(localized: "its own workspace") }
}

// MARK: - Team

/// A team's name and brief (the desktop's team panel): what every bot in the
/// team reads each turn, a new name, or deleting the team (its bots stay).
struct TeamSettingsView: View {
    let section: String
    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @State private var brief = ""
    @State private var original = ""
    @State private var name = ""
    @State private var error: String?
    @State private var confirmingDelete = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                OrbitKicker("Team")
                Text(verbatim: section).font(.system(size: 19, weight: .semibold)).foregroundStyle(Orbit.ink)
                OrbitKicker("Brief")
                TextEditor(text: $brief)
                    .font(.system(size: 13.5))
                    .foregroundStyle(Orbit.ink90)
                    .scrollContentBackground(.hidden)
                    .frame(minHeight: 140)
                    .padding(8)
                    .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.fill04))
                    .accessibilityIdentifier("team-brief")
                Button("Save brief") { Task { await saveBrief() } }
                    .buttonStyle(OrbitPrimaryButtonStyle())
                    .disabled(brief == original)
                OrbitKicker("Name")
                HStack(spacing: 8) {
                    TextField(text: $name) { Text(verbatim: section).foregroundStyle(Orbit.ink40) }
                        .font(.system(size: 14)).foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 12).frame(height: 38)
                        .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                    Button("Rename") { Task { await rename() } }
                        .font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink)
                        .padding(.horizontal, 14).frame(height: 38)
                        .background(Capsule().strokeBorder(Orbit.borderStrong))
                        .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
                if let error { OrbitSheetError(message: error) }
                Button { confirmingDelete = true } label: {
                    Text("Delete team")
                        .font(.system(size: 14, weight: .semibold)).foregroundStyle(Orbit.dangerText)
                        .frame(maxWidth: .infinity).frame(height: 44)
                        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(Orbit.danger.opacity(0.4)))
                }
                .buttonStyle(.plain)
                .padding(.top, 8)
            }
            .padding(18)
        }
        .background(Orbit.sheet.ignoresSafeArea())
        .task {
            if let loaded = try? await session.teamBrief(section) { brief = loaded.text; original = loaded.text }
        }
        .orbitConfirm(Text("Delete \(section)?"), isPresented: $confirmingDelete, confirm: "Delete", message: Text("Its bots stay, without a team.")) { Task { await deleteTeam() } }
    }

    private func saveBrief() async {
        do { try await session.saveTeamBrief(section, text: brief); original = brief; Haptics.success() } catch { self.error = orbitErrorText(error) }
    }

    private func rename() async {
        do { try await session.renameTeam(section, to: name.trimmingCharacters(in: .whitespaces)); dismiss() } catch { self.error = orbitErrorText(error) }
    }

    private func deleteTeam() async {
        guard await OwnerCheck.passes(reason: String(localized: "Delete the team \(section)")) else { return }
        do { try await session.deleteTeam(section); dismiss() } catch { self.error = orbitErrorText(error) }
    }
}

// MARK: - Channel

struct ChannelSettingsSheet: View {
    let room: Room
    let deleted: () -> Void
    @EnvironmentObject private var session: Session
    @State private var name = ""
    @State private var bulletin = ""
    @State private var error: String?
    @State private var confirmingDelete = false

    private var live: Room { session.state.rooms.first { $0.id == room.id } ?? room }

    var body: some View {
        OrbitSystemSheet(icon: "number", kicker: "Channel", title: live.name, description: "Who is in it, who answers, and its pinned note.") {
            OrbitKicker("Name")
            HStack(spacing: 8) {
                TextField(text: $name) { Text(verbatim: live.name).foregroundStyle(Orbit.ink40) }
                    .font(.system(size: 14)).foregroundStyle(Orbit.ink)
                    .padding(.horizontal, 12).frame(height: 38)
                    .background(RoundedRectangle(cornerRadius: 12).strokeBorder(Orbit.borderStrong))
                Button("Rename") { Task { await update(["name": name.trimmingCharacters(in: .whitespaces)]) } }
                    .font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink)
                    .padding(.horizontal, 14).frame(height: 38)
                    .background(Capsule().strokeBorder(Orbit.borderStrong))
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            OrbitKicker("Members")
            VStack(spacing: 0) {
                ForEach(session.state.bots.filter { $0.hidden != true }) { bot in
                    let member = live.memberIds.contains(bot.id)
                    OrbitSheetListRow(name: bot.name, meta: live.defaultResponder.botId == bot.id ? String(localized: "answers first") : "",
                                      dot: member ? OrbitPalette.color(bot.color) : Orbit.ink.opacity(0.2)) {
                        Toggle("", isOn: Binding(get: { member }, set: { on in
                            var ids = live.memberIds.filter { $0 != bot.id }
                            if on { ids.append(bot.id) }
                            Task { await update(["memberIds": ids]) }
                        }))
                        .labelsHidden().tint(Orbit.accent)
                        .accessibilityLabel(Text(verbatim: bot.name))
                    }
                }
            }
            OrbitKicker("Pinned note")
            TextEditor(text: $bulletin)
                .font(.system(size: 13.5)).foregroundStyle(Orbit.ink90)
                .scrollContentBackground(.hidden)
                .frame(minHeight: 90).padding(8)
                .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.fill04))
            Button("Save note") { Task { await update(["bulletin": bulletin]) } }
                .buttonStyle(OrbitPrimaryButtonStyle())
                .disabled(bulletin == live.bulletin)
            if let error { OrbitSheetError(message: error) }
            Button { confirmingDelete = true } label: {
                Text("Delete channel")
                    .font(.system(size: 14, weight: .semibold)).foregroundStyle(Orbit.dangerText)
                    .frame(maxWidth: .infinity).frame(height: 44)
                    .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).strokeBorder(Orbit.danger.opacity(0.4)))
            }
            .buttonStyle(.plain)
            .padding(.top, 8)
        }
        .onAppear { bulletin = live.bulletin }
        .orbitConfirm(Text("Delete \(live.name)?"), isPresented: $confirmingDelete, confirm: "Delete", message: Text("The channel and its conversation are removed. Its bots stay.")) { Task { await deleteChannel() } }
    }

    private func update(_ fields: [String: Any]) async {
        error = nil
        do { try await session.updateChannel(room, fields: fields); Haptics.selection() } catch { self.error = orbitErrorText(error) }
    }

    private func deleteChannel() async {
        guard await OwnerCheck.passes(reason: String(localized: "Delete the channel \(live.name)")) else { return }
        do { try await session.deleteChannel(room); deleted() } catch { self.error = orbitErrorText(error) }
    }
}
