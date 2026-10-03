// Walkie mode: the agents at a glance and one button to talk to them.
//
// The handheld concept, on the phone: agent rows with their state, four
// keys, and a hold-to-talk bar. Tap a row to choose who you are talking to;
// hold the bar and speak, let go to read what was heard, then Send. The
// answer is read back when the turn ends.
import SwiftUI
import CompanionCore

struct WalkieView: View {
    /// Leave Walkie for a chat — the caller owns navigation.
    let onOpen: (Chat) -> Void

    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var walkie = WalkieController()
    @AppStorage("walkie.target") private var targetId = ""
    @AppStorage("walkie.speakReplies") private var speakReplies = true
    @State private var pressing = false
    @State private var showingVoice = false
    @FocusState private var draftFocused: Bool

    private var roster: [WalkieAgent] { session.state.walkieRoster }
    private var target: Bot? { session.state.bots.first { $0.id == targetId && $0.hidden != true } }
    private var targetName: String { target?.name ?? String(localized: "an agent") }
    private var reviewing: Bool { walkie.phase == .review || walkie.phase == .sending }

    var body: some View {
        ZStack {
            Orbit.canvas.ignoresSafeArea()
            OrbitDotGrid().ignoresSafeArea()
            VStack(spacing: 0) {
                header
                stage
                    .frame(maxHeight: .infinity)
                if roster.isEmpty { empty } else { agentStrip }
                keys.padding(.top, 14)
                Group { if reviewing { reviewBar } else { talkBar } }
                    .padding(.top, 14)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 12)
            .frame(maxWidth: CompanionLayout.rosterWidth)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .preferredColorScheme(.dark)
        .animation(.snappy(duration: 0.2), value: reviewing)
        // the voice settings take Walkie's place, no sheet over it
        .overlay {
            if showingVoice {
                WalkieVoiceSheet {
                    Task {
                        let voice = await session.configStatus()?.walkieAgentVoice(target?.voice)
                        walkie.sample(agentVoice: voice)
                    }
                }
                .inOrbitColumn { showingVoice = false }
                .background(Orbit.canvas.ignoresSafeArea())
                .transition(.opacity)
            }
        }
        .animation(.easeOut(duration: 0.18), value: showingVoice)
        .onAppear {
            walkie.speaksReplies = speakReplies
            if target == nil { targetId = roster.first?.bot.id ?? "" }
            #if DEBUG
            // screenshots without the speech permission prompt in front
            if ProcessInfo.processInfo.arguments.contains("-no-speech") { return }
            #endif
            Task { await walkie.prepare() }
        }
        .onValueChange(of: scenePhase) { phase in
            switch phase {
            case .active:
                #if DEBUG
                if ProcessInfo.processInfo.arguments.contains("-no-speech") { return }
                #endif
                Task { await walkie.prepare() }
            case .background: walkie.suspend()
            default: break
            }
        }
        .onValueChange(of: speakReplies) { on in walkie.speaksReplies = on }
        .onReceive(session.$state) { walkie.observe($0) }
        .onDisappear { walkie.shutdown() }
    }

    // MARK: - Header: back, where you are, the voice

    private var header: some View {
        HStack(spacing: 8) {
            Button { dismiss() } label: {
                HStack(spacing: 3) {
                    Image(systemName: "chevron.left").font(.system(size: 14, weight: .semibold))
                    Text("Team map").font(.system(size: 14.5))
                }
                .foregroundStyle(Orbit.ink60)
                .frame(height: 40)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Close Walkie")
            .accessibilityIdentifier("back")
            Spacer()
            HStack(spacing: 6) {
                Circle().fill(session.status == .live ? Orbit.success : Orbit.amber).frame(width: 6, height: 6)
                Text(verbatim: connectionText).font(.system(size: 12)).foregroundStyle(Orbit.ink50).lineLimit(1)
            }
            Spacer()
            Button { showingVoice = true } label: {
                Image(systemName: "person.wave.2")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Orbit.ink80)
                    .frame(width: 34, height: 34)
                    .background(Circle().fill(Orbit.pill))
                    .overlay(Circle().strokeBorder(Orbit.hairline))
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Voice settings")
        }
    }

    // MARK: - The one you're talking to, and what's happening

    private var targetMood: OrbitMood {
        switch walkie.phase {
        case .speaking: .talking
        case .waiting, .sending: .thinking
        case .listening: .focused
        case .transcribing: .thinking
        default: walkie.note == nil ? .idle : .surprised
        }
    }

    private var stage: some View {
        VStack(spacing: 10) {
            Spacer(minLength: 8)
            if let target {
                OrbitCharacter(color: target.color, mood: targetMood, size: 120, seed: orbitSeed(target.id), big: true)
                    .frame(height: 150)
                    .accessibilityHidden(true)
                Text(verbatim: target.name)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(OrbitPalette.label(target.color))
            }
            HStack(spacing: 7) {
                liveIcon.frame(width: 18, height: 16)
                    .foregroundStyle(walkie.phase == .listening ? Orbit.dangerText : Orbit.ink50)
                Text(verbatim: liveTitle)
                    .font(.system(size: 12.5, weight: .medium))
                    .foregroundStyle(Orbit.ink50)
                    .lineLimit(1)
            }
            if reviewing {
                TextField("What to send", text: $walkie.draft, axis: .vertical)
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(Orbit.ink)
                    .multilineTextAlignment(.center)
                    .lineLimit(1...6)
                    .focused($draftFocused)
                    .disabled(walkie.phase == .sending)
                    .padding(.horizontal, 14).padding(.vertical, 10)
                    .background(RoundedRectangle(cornerRadius: Orbit.cardRadius).fill(Orbit.fill06))
                if let note = walkie.note {
                    Text(verbatim: note).font(.system(size: 12.5)).foregroundStyle(Orbit.amberText)
                }
            } else {
                Text(verbatim: liveBody)
                    .font(.system(size: 17, weight: .medium))
                    .foregroundStyle(walkie.note == nil ? Orbit.ink : Orbit.amberText)
                    .multilineTextAlignment(.center)
                    .lineLimit(6)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 8)
        }
        .padding(.horizontal, 8)
    }

    // MARK: - Who to talk to

    private var agentStrip: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 6) {
                ForEach(roster) { agent in
                    Button {
                        Haptics.selection()
                        targetId = agent.bot.id
                    } label: {
                        WalkieAgentRow(agent: agent, selected: agent.bot.id == targetId)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 2)
        }
        .scrollIndicators(.hidden)
        .frame(height: 92)
    }

    private var empty: some View {
        Text("Bots you make on your computer show up here.")
            .font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
            .frame(height: 92)
    }

    private var connectionText: String {
        let name = session.connection?.name ?? String(localized: "your computer")
        switch session.status {
        case .live: return name
        case .connecting: return String(localized: "Connecting to \(name)…")
        default: return String(localized: "\(name) is offline")
        }
    }

    @ViewBuilder
    private var liveIcon: some View {
        switch walkie.phase {
        case .listening: WalkieWave(active: true)
        case .transcribing, .sending, .waiting: ProgressView().controlSize(.small)
        case .review: Image(systemName: "text.bubble.fill")
        case .speaking: Image(systemName: "speaker.wave.2.fill")
        case .idle: Image(systemName: walkie.note == nil ? "waveform" : "exclamationmark.circle.fill")
        }
    }

    private var liveTitle: String {
        switch walkie.phase {
        case .review: return String(localized: "Check it, then send to \(targetName)")
        case .sending: return String(localized: "Sending to \(targetName)")
        default: break
        }
        if walkie.note != nil { return String(localized: "Heads up") }
        switch walkie.phase {
        case .listening: return String(localized: "Listening")
        case .transcribing: return String(localized: "Writing it down…")
        case .waiting: return String(localized: "\(targetName) is working on it")
        case .speaking: return walkie.replyFrom
        default:
            return walkie.reply.isEmpty ? String(localized: "Talking to \(targetName)") : walkie.replyFrom
        }
    }

    private var liveBody: String {
        if let note = walkie.note { return note }
        switch walkie.phase {
        case .listening, .transcribing:
            return walkie.heard.isEmpty ? String(localized: "Go ahead…") : walkie.heard
        case .waiting: return "\u{201C}\(walkie.heard)\u{201D}"
        case .speaking: return Walkie.speakable(walkie.reply, limit: 400)
        default:
            return walkie.reply.isEmpty
                ? String(localized: "Hold the button and talk. You'll see the words before anything is sent.")
                : Walkie.speakable(walkie.reply, limit: 400)
        }
    }

    // MARK: - Keys

    private var keys: some View {
        HStack(spacing: 10) {
            WalkieKey(title: "Replay", systemImage: "arrow.counterclockwise", enabled: !walkie.reply.isEmpty) {
                walkie.replay()
            }
            WalkieKey(title: "Stop", systemImage: "stop.fill", enabled: canStop) {
                Task { await walkie.stop(session: session, target: target) }
            }
            WalkieKey(
                title: speakReplies ? "Voice on" : "Voice off",
                systemImage: speakReplies ? "speaker.wave.2.fill" : "speaker.slash.fill",
                enabled: true
            ) {
                speakReplies.toggle()
            }
            WalkieKey(title: "Open chat", systemImage: "bubble.left.and.text.bubble.right", enabled: target != nil) {
                guard let target else { return }
                walkie.shutdown()
                onOpen(.bot(target))
            }
        }
    }

    private var canStop: Bool { walkie.phase == .speaking || target?.currentTaskBusy == true }

    // MARK: - Talk

    private var talkDisabled: Bool { target == nil || walkie.phase == .transcribing }

    private var talkBar: some View {
        let listening = walkie.phase == .listening
        return ZStack {
            Capsule().fill(listening ? Orbit.danger : Orbit.ink)
            HStack(spacing: 10) {
                if listening {
                    WalkieWave(active: true).frame(width: 30, height: 18)
                    Text("Listening… let go when you're done")
                } else if walkie.phase == .transcribing {
                    ProgressView().tint(Color(hex: "#070707"))
                    Text("Writing it down…")
                } else {
                    Image(systemName: "mic.fill")
                    Text(verbatim: target.map { String(localized: "Hold to talk to \($0.name)") }
                        ?? String(localized: "Pick an agent above"))
                }
            }
            .font(.system(size: 17, weight: .semibold))
            .foregroundStyle(listening ? Color.white : Color(hex: "#070707"))
            .lineLimit(1)
            .minimumScaleFactor(0.8)
            .padding(.horizontal, 20)
        }
        .frame(height: 64)
        .scaleEffect(pressing ? 0.97 : 1)
        .animation(.snappy(duration: 0.12), value: pressing)
        .opacity(talkDisabled ? 0.45 : 1)
        .contentShape(Capsule())
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    guard !pressing, !talkDisabled else { return }
                    pressing = true
                    walkie.pressBegan()
                }
                .onEnded { _ in
                    guard pressing else { return }
                    pressing = false
                    Task { await walkie.pressEnded() }
                }
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(listening ? "Stop listening" : "Talk")
        .accessibilityHint(listening ? "Shows what was heard so you can send it" : "Starts listening. Activate again to stop.")
        .accessibilityAddTraits(.isButton)
        .accessibilityAction {
            if walkie.phase == .listening {
                Task { await walkie.pressEnded() }
            } else if !talkDisabled {
                walkie.pressBegan()
            }
        }
    }

    private var reviewBar: some View {
        let sending = walkie.phase == .sending
        let empty = walkie.draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        return HStack(spacing: 12) {
            Button {
                Haptics.selection()
                draftFocused = false
                walkie.discard()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundStyle(Orbit.ink)
                    .frame(width: 64, height: 64)
                    .background(Circle().fill(Orbit.fill10))
            }
            .buttonStyle(.plain)
            .disabled(sending)
            .accessibilityLabel("Discard")

            Button {
                draftFocused = false
                Task { await walkie.send(session: session, target: target) }
            } label: {
                HStack(spacing: 10) {
                    if sending {
                        ProgressView().tint(Color(hex: "#070707"))
                    } else {
                        Image(systemName: "arrow.up.circle.fill")
                    }
                    Text(verbatim: String(localized: "Send to \(targetName)"))
                }
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(Color(hex: "#070707"))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
                .frame(maxWidth: .infinity)
                .frame(height: 64)
                .background(Capsule().fill(Orbit.ink))
            }
            .buttonStyle(.plain)
            .disabled(sending || empty || target == nil)
            .opacity(empty || target == nil ? 0.45 : 1)
        }
        .transition(.opacity)
    }

}

// MARK: - Pieces

struct WalkieAgentRow: View {
    let agent: WalkieAgent
    let selected: Bool

    var body: some View {
        VStack(spacing: 5) {
            ZStack(alignment: .topTrailing) {
                BotAvatarView(bot: agent.bot, size: 44)
                WalkieStatusMark(status: agent.status).offset(x: 6, y: -4)
            }
            Text(verbatim: agent.bot.name)
                .font(.system(size: 12, weight: selected ? .semibold : .regular))
                .foregroundStyle(selected ? OrbitPalette.label(agent.bot.color) : Orbit.ink60)
                .lineLimit(1)
        }
        .frame(width: 74, height: 86)
        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(selected ? Orbit.fill08 : .clear))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(selected ? Orbit.borderStrong : .clear))
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(verbatim: "\(agent.bot.name), \(agent.line)"))
        .accessibilityAddTraits(selected ? [.isButton, .isSelected] : .isButton)
    }
}

struct WalkieStatusMark: View {
    let status: WalkieAgent.Status
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var turning = false

    var body: some View {
        Group {
            switch status {
            case .needsYou:
                Circle().fill(Orbit.amber).frame(width: 10, height: 10)
            case .working:
                Circle()
                    .trim(from: 0, to: 0.72)
                    .stroke(Orbit.link, style: StrokeStyle(lineWidth: 2.2, lineCap: .round))
                    .frame(width: 14, height: 14)
                    .rotationEffect(.degrees(turning ? 360 : 0))
                    .onAppear {
                        guard !reduceMotion else { return }
                        withAnimation(.linear(duration: 1).repeatForever(autoreverses: false)) { turning = true }
                    }
            case .done:
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 16))
                    .foregroundStyle(Orbit.success)
            case .idle:
                Circle()
                    .strokeBorder(Color.white.opacity(0.6), lineWidth: 1.5)
                    .frame(width: 12, height: 12)
            }
        }
        .frame(width: 20, height: 20)
        .accessibilityLabel(status.label)
    }
}

struct WalkieKey: View {
    let title: LocalizedStringKey
    let systemImage: String
    let enabled: Bool
    let action: () -> Void

    var body: some View {
        Button {
            Haptics.selection()
            action()
        } label: {
            VStack(spacing: 5) {
                Image(systemName: systemImage)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(Orbit.ink)
                    .frame(width: 46, height: 46)
                    .background(Circle().fill(Orbit.fill08))
                    .overlay(Circle().strokeBorder(Orbit.hairline))
                Text(title)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(Orbit.ink50)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .opacity(enabled ? 1 : 0.4)
    }
}

struct WalkieWave: View {
    let active: Bool
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        TimelineView(.animation(minimumInterval: 1.0 / 30, paused: !active || reduceMotion)) { context in
            let t = context.date.timeIntervalSinceReferenceDate
            HStack(spacing: 3) {
                ForEach(0..<5, id: \.self) { bar in
                    Capsule()
                        .frame(width: 3.5, height: max(4, 18 * (0.35 + 0.65 * abs(sin(t * 5 + Double(bar) * 0.8)))))
                }
            }
            .frame(maxHeight: 18)
        }
        .accessibilityHidden(true)
    }
}
