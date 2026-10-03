import AVFAudio
import CompanionCore
import SwiftUI

/// The paired-safe subset of bot settings. Shared provider keys remain on the
/// computer; the phone sees only the model catalog, configured/not-configured
/// status, and renderer-neutral profile operations.
/// Which of a bot's systems this panel shows: each opens only its own part,
/// as on the desktop.
enum ProfilePart { case engine, voice, profile }

struct AgentProfileView: View {
    let bot: Bot
    var part: ProfilePart = .profile

    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @State private var name: String
    @State private var showingOverview = false
    @State private var title: String
    @State private var description: String
    @State private var notifications: Bool
    @State private var voice: String
    @State private var speakReplies: Bool
    @State private var voices: [Voice] = []
    @State private var config: ConfigStatus?
    @State private var engine: VoiceProvider = .elevenlabs
    @State private var hostIsMac = false
    @State private var chatterboxURL = ""
    @State private var chatterboxModel = ""
    @State private var switchingEngine = false
    @State private var savingServer = false
    @State private var serverProblem: String?
    @State private var instances: [Instance] = []
    @State private var modelsLoaded = false
    @State private var selectedInstanceID: String
    @State private var selectedModelID: String
    @State private var selectedEffort: String?
    @State private var savedModel: ModelSelection
    @State private var busy = false
    @State private var player: AVAudioPlayer?
    @State private var baseline: ProfileFormSnapshot

    init(bot: Bot, part: ProfilePart = .profile) {
        self.bot = bot
        self.part = part
        _name = State(initialValue: bot.name)
        _title = State(initialValue: bot.title)
        _description = State(initialValue: bot.description)
        _notifications = State(initialValue: bot.notifications)
        _voice = State(initialValue: bot.voice ?? "")
        _speakReplies = State(initialValue: bot.speakReplies == true)
        _selectedInstanceID = State(initialValue: bot.currentTaskModelSelection.instanceId)
        _selectedModelID = State(initialValue: bot.currentTaskModelSelection.model)
        _selectedEffort = State(initialValue: bot.currentTaskModelSelection.effort)
        _savedModel = State(initialValue: bot.currentTaskModelSelection)
        _baseline = State(initialValue: ProfileFormSnapshot(bot: bot))
    }

    private var current: Bot { session.state.bot(bot.id)?.projected(forThread: bot.threadId) ?? bot }
    private var voiceConfigured: Bool { config?.isTTSConfigured == true }
    private var hasWorkspaceDefaultVoice: Bool { config?.hasWorkspaceDefaultVoice == true }
    private var selectedVoiceCanSpeak: Bool { config?.canSpeak(agentVoice: voice) == true }
    private var selectedInstance: Instance? {
        instances.first { $0.instanceId == selectedInstanceID }
    }
    private var availableInstances: [Instance] { instances.filter(\.snapshot.isAvailable) }
    private var instanceChoices: [Instance] {
        guard let currentInstance = instances.first(where: { $0.instanceId == savedModel.instanceId }),
              !currentInstance.snapshot.isAvailable
        else { return availableInstances }
        return [currentInstance] + availableInstances
    }
    private var selectedModelChoices: [ModelChoice] {
        guard let instance = selectedInstance else {
            return selectedModelID.isEmpty ? [] : [ModelChoice(id: selectedModelID, label: selectedModelID)]
        }
        var seen = Set<String>()
        var choices: [ModelChoice] = []
        let defaultOption = instance.models.options.first { $0.id == instance.models.default }
        if !instance.models.default.isEmpty {
            seen.insert(instance.models.default)
            choices.append(ModelChoice(
                id: instance.models.default,
                label: defaultOption?.label ?? instance.models.default
            ))
        }
        for option in instance.models.options where seen.insert(option.id).inserted {
            choices.append(ModelChoice(id: option.id, label: option.label))
        }
        if !selectedModelID.isEmpty, seen.insert(selectedModelID).inserted {
            choices.append(ModelChoice(id: selectedModelID, label: selectedModelID))
        }
        return choices
    }
    private var effortLevels: [String] {
        var seen = Set<String>()
        return (selectedInstance?.capabilities?.effortLevels ?? []).filter {
            !$0.isEmpty && seen.insert($0).inserted
        }
    }
    private var modelDraft: ModelSelection {
        ModelSelection(instanceId: selectedInstanceID, model: selectedModelID, effort: selectedEffort)
    }
    private var canApplyModel: Bool {
        guard modelsLoaded, current.busy != true,
              let selectedInstance, selectedInstance.snapshot.isAvailable
        else { return false }
        let modelIsOffered = selectedModelID == selectedInstance.models.default
            || selectedInstance.models.options.contains { $0.id == selectedModelID }
        let effortIsOffered = selectedEffort.map(effortLevels.contains) ?? true
        return modelIsOffered && effortIsOffered && modelDraft != savedModel
    }
    /// Which engine's words to use. An unloaded status is ElevenLabs for the
    /// same reason a missing `provider` is: that is the server's own fallback,
    /// and the copy that shipped.
    private var panelIcon: String {
        switch part { case .engine: "cpu"; case .voice: "waveform"; case .profile: "person.text.rectangle" }
    }
    private var panelKicker: LocalizedStringKey {
        switch part { case .engine: "Engine"; case .voice: "Voice"; case .profile: "Profile" }
    }
    private var panelTitle: String {
        switch part {
        case .engine:
            let model = current.currentTaskModelSelection.model
            return model.isEmpty ? String(localized: "Default model") : model
        case .voice: return current.speakReplies == true ? String(localized: "Reads replies aloud") : String(localized: "Silent")
        case .profile: return current.name
        }
    }
    private var panelDescription: LocalizedStringKey {
        switch part {
        case .engine: "The agent CLI and model this bot runs on, and how hard it thinks."
        case .voice: "The voice this bot speaks with, on calls and when it reads its replies."
        case .profile: "Who this bot is: its name, its role, and what it does."
        }
    }

    private var usesSystemVoices: Bool { config?.voiceProvider == .system }
    private var usesChatterbox: Bool { config?.voiceProvider == .chatterbox }
    private var usesFishAudio: Bool { config?.voiceProvider == .fish }

    var body: some View {
        profileBody
            .overlay {
                if showingOverview {
                    OrbitSubpage(back: "Profile", onBack: { showingOverview = false }) { BotOverviewView(bot: current) }
                }
            }
            .animation(.easeOut(duration: 0.18), value: showingOverview)
    }

    private var profileBody: some View {
        NavigationStack {
            OrbitPanelList(icon: panelIcon, kicker: panelKicker, title: panelTitle, tint: OrbitPalette.label(bot.color), description: panelDescription) {
                // Changing the model needs the admin scope
                // on a server; a chat-only phone is not shown either.
                if part == .engine && !session.canAdminister {
                    Text("Changing the model needs an admin session on this computer.")
                        .font(.system(size: 13.5)).foregroundStyle(Orbit.ink55)
                }
                if part == .engine && session.canAdminister {
                    Section {
                        if !modelsLoaded {
                            HStack {
                                Text("Loading models")
                                Spacer()
                                ProgressView()
                            }
                        } else if instanceChoices.isEmpty {
                            Label("No model providers are available", systemImage: "exclamationmark.triangle")
                                .foregroundStyle(Orbit.ink50)
                        } else {
                            Picker("Provider", selection: $selectedInstanceID) {
                                if !instances.contains(where: { $0.instanceId == selectedInstanceID }) {
                                    Text("Current provider (unavailable)")
                                        .tag(selectedInstanceID)
                                        .disabled(true)
                                }
                                ForEach(instanceChoices) { instance in
                                    Text(instanceLabel(instance))
                                        .tag(instance.instanceId)
                                        .disabled(!instance.snapshot.isAvailable)
                                }
                            }
                            .onValueChange(of: selectedInstanceID) { instanceID in
                                selectDefaults(for: instanceID)
                            }

                            Picker("Model", selection: $selectedModelID) {
                                ForEach(selectedModelChoices) { option in
                                    Text(option.label).tag(option.id)
                                }
                            }
                            .disabled(selectedInstance?.snapshot.isAvailable != true)

                            if !effortLevels.isEmpty {
                                Picker("Reasoning effort", selection: $selectedEffort) {
                                    Text("Default").tag(String?.none)
                                    ForEach(effortLevels, id: \.self) { level in
                                        Text(effortLabel(level)).tag(Optional(level))
                                    }
                                }
                            }

                            if current.busy == true {
                                Label("Stop this bot before changing its model.", systemImage: "hourglass")
                                    .font(.footnote)
                                    .foregroundStyle(Orbit.ink50)
                            } else if selectedInstance?.snapshot.isAvailable != true {
                                Label("Choose an available provider to change this bot's model.", systemImage: "info.circle")
                                    .font(.footnote)
                                    .foregroundStyle(Orbit.ink50)
                            }

                            Button("Apply model", systemImage: "checkmark") {
                                Task { await saveModel() }
                            }
                            .disabled(busy || !canApplyModel)
                        }
                    } header: {
                        OrbitSectionHeader("Model")
                    } footer: {
                        Text("Provider accounts and API keys stay on your computer. Default sends no reasoning level and lets the provider decide.")
                            .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    }
                }

                // No character here: the bot's own is on the canvas above
                // (one character per bot, never a second copy).
                if part == .profile {
                Section {
                    OrbitRow(icon: "list.bullet.rectangle", title: Text("What this bot does"), value: Text("Open")) { showingOverview = true }
                }
                Section {
                    OrbitField(label: "Name") {
                        TextField("Name", text: $name).textInputAutocapitalization(.words)
                    }
                    OrbitField(label: "Role") {
                        TextField("Title", text: $title)
                    }
                    OrbitField(label: "What it does") {
                        TextField("What this agent does", text: $description, axis: .vertical).lineLimit(3...8)
                    }
                    Toggle(isOn: $notifications) {
                        Text("Notifications from this bot").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    }
                    .tint(Orbit.accent)
                } header: { OrbitSectionHeader("Identity") }
                }

                if part == .voice {
                Section {
                    Picker("Voice engine", selection: $engine) {
                        Text("ElevenLabs").tag(VoiceProvider.elevenlabs)
                        Text("Fish Audio").tag(VoiceProvider.fish)
                        Text("Built-in Mac voices")
                            .tag(VoiceProvider.system)
                            .disabled(!hostIsMac)
                        Text("Chatterbox (local)").tag(VoiceProvider.chatterbox)
                    }
                    .disabled(switchingEngine)

                    if usesChatterbox {
                        TextField(
                            "Chatterbox server address",
                            text: $chatterboxURL,
                            prompt: Text("http://127.0.0.1:4123")
                        )
                        .keyboardType(.URL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        TextField(
                            "Chatterbox model",
                            text: $chatterboxModel,
                            prompt: Text("chatterbox-turbo")
                        )
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        Button {
                            Task { await saveChatterboxServer() }
                        } label: {
                            HStack {
                                Text("Save server")
                                if savingServer { Spacer(); ProgressView() }
                            }
                        }
                        .disabled(savingServer || chatterboxURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        if let serverProblem {
                            Label(serverProblem, systemImage: "exclamationmark.triangle")
                                .foregroundStyle(Orbit.amberText)
                        }
                    }

                    if voiceConfigured {
                        Picker("Voice", selection: $voice) {
                            if hasWorkspaceDefaultVoice {
                                Text("Workspace default").tag("")
                            } else {
                                Text("Choose an agent voice").tag("").disabled(true)
                            }
                            if !voice.isEmpty, !voices.contains(where: { $0.id == voice }) {
                                Text("Current agent voice").tag(voice)
                            }
                            ForEach(voices) { option in
                                VStack(alignment: .leading) {
                                    Text(option.label)
                                    if let detail = option.description { Text(detail) }
                                }
                                .tag(option.id)
                            }
                        }
                        Toggle(isOn: $speakReplies) {
                            Text("Speak replies").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                        }
                        .tint(Orbit.accent)
                        .disabled(!selectedVoiceCanSpeak)
                        Button("Preview voice", systemImage: "speaker.wave.2") {
                            Task { await previewVoice() }
                        }
                        .disabled(busy || !selectedVoiceCanSpeak)

                        if !hasWorkspaceDefaultVoice, voice.isEmpty {
                            Label("Pick a voice for this agent before enabling speech.", systemImage: "info.circle")
                                .font(.footnote)
                                .foregroundStyle(Orbit.ink50)
                        }
                    } else if usesSystemVoices {
                        Label("Built-in Mac voices are unavailable", systemImage: "speaker.slash")
                            .foregroundStyle(Orbit.ink50)
                    } else if !usesChatterbox {
                        Label(
                            usesFishAudio ? "Fish Audio is not configured" : "ElevenLabs is not configured",
                            systemImage: "speaker.slash"
                        )
                            .foregroundStyle(Orbit.ink50)
                    }
                } header: {
                    OrbitSectionHeader("Voice")
                } footer: {
                    Group {
                    if !voiceConfigured {
                        // Under the built-in engine "not configured" is not a
                        // missing credential — there is none — so the remedy
                        // cannot be a key. `providerConfigured` in
                        // `server/tts/index.ts` is reporting that this
                        // computer has no built-in voices to speak with.
                        if usesSystemVoices {
                            Text("Built-in Mac voices need no key, and this computer has none available. Switch the voice engine above to ElevenLabs to keep using voice.")
                        } else if usesChatterbox {
                            Text("Any OpenAI-compatible server running Chatterbox works, no key needed. Save its address and model id above.")
                        } else if usesFishAudio {
                            Text("Add the shared Fish Audio key in Orbit on your computer. The key is never returned to iOS.")
                        } else {
                            Text("Add the shared ElevenLabs key in this agent's profile on the computer. The key is never returned to iOS.")
                        }
                    } else if !hasWorkspaceDefaultVoice {
                        if usesSystemVoices {
                            Text("No workspace default voice is selected. Choose an agent-specific voice above; synthesis still uses the built-in Mac voices on your computer.")
                        } else if usesChatterbox {
                            Text("No workspace default voice is selected. Choose an agent-specific voice above; synthesis still uses the Chatterbox server on your computer.")
                        } else if usesFishAudio {
                            Text("No workspace default voice is selected. Choose an agent-specific voice above; synthesis still uses the shared Fish Audio key on your computer.")
                        } else {
                            Text("No workspace default voice is selected. Choose an agent-specific voice above; synthesis still uses the shared ElevenLabs key on your computer.")
                        }
                    } else {
                        Text("The voice choice belongs to this agent. Workspace default uses the shared voice selected on your computer.")
                    }
                    }
                    .font(.system(size: 12.5))
                    .foregroundStyle(Orbit.ink50)
                }

                }

                if part != .engine {
                    Section {
                        Button(part == .voice ? "Save voice" : "Save profile") { Task { await save() } }
                            .buttonStyle(OrbitPrimaryButtonStyle())
                            .frame(maxWidth: .infinity)
                            .disabled(busy || name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                            .listRowSeparator(.hidden)
                            .padding(.top, 8)
                    }
                }
            }
            .overlay { if busy { ProgressView().controlSize(.large) } }
            .task {
                async let status = session.configStatus()
                async let options = session.voiceOptions()
                async let catalog = loadModelCatalog()
                async let environment = session.serverEnvironment()
                let (loadedConfig, loadedVoices, loadedInstances) = await (status, options, catalog)
                config = loadedConfig
                engine = loadedConfig?.voiceProvider ?? .elevenlabs
                chatterboxURL = loadedConfig?.tts?.baseUrl ?? ""
                chatterboxModel = loadedConfig?.tts?.model ?? ""
                hostIsMac = (await environment)?.platform == "darwin"
                voices = loadedVoices
                instances = loadedInstances
                modelsLoaded = true
                if let loadedConfig, !loadedConfig.canSpeak(agentVoice: voice) {
                    speakReplies = false
                }
            }
            .onValueChange(of: engine) { selected in
                Task { await switchEngine(to: selected) }
            }
        }
    }

    /// Switch the workspace's voice engine. The engine is a setting, not a
    /// secret, so it rides the ordinary config write; the voice list reloads
    /// because every engine offers different voices. A failed switch snaps
    /// the picker back to whatever the server still reports.
    private func switchEngine(to selected: VoiceProvider) async {
        guard selected != (config?.voiceProvider ?? .elevenlabs) else { return }
        switchingEngine = true
        defer { switchingEngine = false }
        if let status = await session.setVoiceProvider(selected) {
            let reset = AgentProfileVoiceState(
                voice: voice,
                speakReplies: speakReplies,
                baselineVoice: baseline.voice
            ).afterProviderSwitch(to: status)
            voice = reset.voice
            speakReplies = reset.speakReplies
            baseline.voice = reset.baselineVoice
            config = status
            engine = status.voiceProvider
            // Do not render the previous provider's catalog while the new
            // one loads. Its identifiers are invalid under this provider.
            voices = []
            voices = await session.voiceOptions()
        } else {
            engine = config?.voiceProvider ?? .elevenlabs
        }
    }

    private func saveChatterboxServer() async {
        let address = chatterboxURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard address.hasPrefix("http://") || address.hasPrefix("https://") else {
            serverProblem = String(localized: "The server address must start with http:// or https://.")
            return
        }
        serverProblem = nil
        savingServer = true
        defer { savingServer = false }
        // Both fields commit together: an address without its model id (or
        // the reverse) is half a setting, exactly as on the desktop.
        if let status = await session.saveChatterboxServer(
            baseURL: address,
            model: chatterboxModel.trimmingCharacters(in: .whitespacesAndNewlines)
        ) {
            config = status
            voices = await session.voiceOptions()
        }
    }

    private func profilePatch() -> BotProfilePatch {
        let savedSpeakReplies = config.map { $0.canSpeak(agentVoice: voice) && speakReplies } ?? speakReplies
        return BotProfilePatch(
            // The shared server contract owns the 100/200/4000 limits. Do not
            // silently apply narrower iOS-only limits to a user's profile.
            name: name == baseline.name ? nil : name.trimmingCharacters(in: .whitespacesAndNewlines),
            title: title == baseline.title ? nil : title.trimmingCharacters(in: .whitespacesAndNewlines),
            description: description == baseline.description
                ? nil : description.trimmingCharacters(in: .whitespacesAndNewlines),
            notifications: notifications == baseline.notifications ? nil : notifications,
            // Empty is the server's explicit "use workspace default" value;
            // nil would mean the voice field is not part of this patch.
            voice: voice == baseline.voice ? nil : voice,
            speakReplies: savedSpeakReplies == baseline.speakReplies ? nil : savedSpeakReplies
        )
    }

    private func save() async {
        busy = true
        if let updated = await session.updateProfile(profilePatch(), for: current) {
            synchronizeForm(with: updated)
        }
        busy = false
    }

    /// The provider list is admin-only on a server: asking without the
    /// scope would only put a 403 on screen for a picker that is not shown.
    private func loadModelCatalog() async -> [Instance] {
        session.canAdminister ? await session.modelInstances() : []
    }

    private func saveModel() async {
        guard canApplyModel else { return }
        busy = true
        defer { busy = false }
        if let updated = await session.updateModel(modelDraft, for: current) {
            let model = updated.projected(forThread: bot.threadId)?.currentTaskModelSelection ?? modelDraft
            selectedInstanceID = model.instanceId
            selectedModelID = model.model
            selectedEffort = model.effort
            savedModel = model
        }
    }

    private func selectDefaults(for instanceID: String) {
        guard let instance = instances.first(where: { $0.instanceId == instanceID }) else { return }
        if instanceID == savedModel.instanceId {
            selectedModelID = savedModel.model
            let supported = instance.capabilities?.effortLevels ?? []
            selectedEffort = savedModel.effort.flatMap { supported.contains($0) ? $0 : nil }
        } else {
            selectedModelID = instance.models.default
            selectedEffort = nil
        }
    }

    private func instanceLabel(_ instance: Instance) -> String {
        let base = instance.displayName?.trimmingCharacters(in: .whitespacesAndNewlines)
        let name = base.flatMap { $0.isEmpty ? nil : $0 } ?? instance.instanceId
        return instance.snapshot.isAvailable ? name : "\(name) (Unavailable)"
    }

    private func effortLabel(_ effort: String) -> String {
        switch effort.lowercased() {
        case "xhigh": "X-High"
        default: effort.capitalized
        }
    }

    private func previewVoice() async {
        guard selectedVoiceCanSpeak else {
            session.actionError = "Pick an agent voice or configure a workspace default on your computer first."
            return
        }
        busy = true
        defer { busy = false }
        guard let data = await session.previewVoice(voice, for: current) else { return }
        do {
            let audioSession = AVAudioSession.sharedInstance()
            try audioSession.setCategory(.playback, mode: .spokenAudio)
            try audioSession.setActive(true)

            let nextPlayer = try AVAudioPlayer(data: data)
            guard nextPlayer.prepareToPlay(), nextPlayer.play() else {
                try? audioSession.setActive(false, options: .notifyOthersOnDeactivation)
                player = nil
                session.actionError = "The generated audio could not be played."
                return
            }
            player = nextPlayer
        } catch {
            player = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
            session.actionError = "The generated audio could not be played."
        }
    }

    private func synchronizeForm(with bot: Bot) {
        name = bot.name
        title = bot.title
        description = bot.description
        notifications = bot.notifications
        voice = bot.voice ?? ""
        speakReplies = bot.speakReplies == true
        baseline = ProfileFormSnapshot(bot: bot)
    }
}

private struct ModelChoice: Identifiable {
    let id: String
    let label: String
}

private struct ProfileFormSnapshot {
    var name: String
    var title: String
    var description: String
    var notifications: Bool
    var voice: String
    var speakReplies: Bool

    init(bot: Bot) {
        name = bot.name
        title = bot.title
        description = bot.description
        notifications = bot.notifications
        voice = bot.voice ?? ""
        speakReplies = bot.speakReplies == true
    }
}
