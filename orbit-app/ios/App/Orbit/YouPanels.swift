// You's systems, the phone's version of the desktop's You hub: You in the
// middle with these round it; one opens in the column with You in the corner.
// Each is an Orbit panel (kicker, title, a line saying what it is, then rows),
// never a stock iOS settings list. Confirmations are inline, as on the desktop.
import SwiftUI
import CompanionCore
import UIKit

/// One row in a panel, as in the desktop's lists: a dot or icon, a name, a
/// quiet value on the right. The whole row is the button.
struct OrbitRow: View {
    var icon: String? = nil
    var dot: Color? = nil
    let title: Text
    var subtitle: Text? = nil
    var value: Text? = nil
    var tint: Color = Orbit.ink
    var action: (() -> Void)? = nil

    var body: some View {
        let row = HStack(spacing: 12) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Orbit.ink60)
                    .frame(width: 20)
            } else if let dot {
                Circle().fill(dot).frame(width: 7, height: 7).frame(width: 20)
            }
            VStack(alignment: .leading, spacing: 2) {
                title.font(.system(size: 15)).foregroundStyle(tint).lineLimit(1)
                if let subtitle {
                    subtitle.font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            Spacer(minLength: 8)
            if let value {
                value.font(.system(size: 13.5)).foregroundStyle(Orbit.ink50).lineLimit(1)
            }
        }
        .padding(.vertical, 11)
        .contentShape(Rectangle())
        .overlay(alignment: .bottom) { Rectangle().fill(Orbit.hairline).frame(height: 1) }
        if let action {
            Button(action: action) { row }.buttonStyle(.plain)
        } else {
            row
        }
    }
}

/// A plain text button in a panel: the desktop's small secondary pill.
struct OrbitPanelButton: View {
    let title: LocalizedStringKey
    var role: ButtonRole? = nil
    var busy = false
    let action: () -> Void
    var body: some View {
        Button(role: role, action: action) {
            HStack(spacing: 6) {
                if busy { ProgressView().controlSize(.small).tint(Orbit.ink60) }
                Text(title).font(.system(size: 13.5, weight: .medium))
            }
            .foregroundStyle(role == .destructive ? Orbit.dangerText : Orbit.ink)
            .padding(.horizontal, 14)
            .frame(height: 34)
            .background(Capsule().fill(Orbit.fill08))
        }
        .buttonStyle(.plain)
        .disabled(busy)
    }
}

/// An inline confirmation, in place of the row that asked for it.
struct OrbitInlineConfirm: View {
    let question: Text
    var detail: Text? = nil
    let confirm: LocalizedStringKey
    let onConfirm: () -> Void
    let onCancel: () -> Void
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            question.font(.system(size: 14.5, weight: .semibold)).foregroundStyle(Orbit.ink)
            if let detail { detail.font(.system(size: 12.5)).foregroundStyle(Orbit.ink60).fixedSize(horizontal: false, vertical: true) }
            HStack(spacing: 8) {
                Spacer()
                OrbitPanelButton(title: "Cancel", action: onCancel)
                Button(action: onConfirm) {
                    Text(confirm).font(.system(size: 13.5, weight: .semibold)).foregroundStyle(.white)
                        .padding(.horizontal, 14).frame(height: 34)
                        .background(Capsule().fill(Orbit.danger))
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("orbit-confirm")
            }
        }
        .padding(14)
        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Orbit.danger.opacity(0.07)))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(Orbit.danger.opacity(0.35)))
    }
}

/// The systems round You.
enum YouPanel: String, Hashable {
    case computer, notifications, chat, quickReplies, language, routines, apps, hidden
}

struct YouPanelView: View {
    let panel: YouPanel
    /// open another of You's panels (Chat → Quick replies)
    var go: (YouPanel) -> Void = { _ in }

    var body: some View {
        switch panel {
        case .computer: YouComputerPanel()
        case .notifications: YouNotificationsPanel()
        case .chat: YouChatPanel(go: go)
        case .quickReplies: QuickRepliesEditor()
        case .language: YouLanguagePanel()
        case .routines: TasksRoutinesView()
        case .apps: McpServersView()
        case .hidden: YouHiddenBotsPanel()
        }
    }
}

// MARK: - Computer

private struct YouComputerPanel: View {
    @EnvironmentObject private var session: Session
    @State private var removing: Connection?
    @State private var removingCurrent = false
    @State private var editingAddress = false
    @State private var address = ""
    @State private var copied = false
    @State private var refreshing = false

    private var others: [Connection] { session.connections.filter { $0.id != session.connection?.id } }

    var body: some View {
        OrbitSystemSheet(icon: "laptopcomputer", kicker: "Computer", title: session.connection?.name ?? String(localized: "Not connected"),
                         description: "The computer your bots run on. This phone watches and talks to them through it.") {
            if let connection = session.connection {
                OrbitRow(dot: session.status == .live ? Orbit.success : Orbit.ink40, title: Text(verbatim: connection.name),
                         subtitle: statusDetail, value: session.status.settingsText)

                OrbitKicker("Address")
                HStack(spacing: 8) {
                    Text(verbatim: connection.displayAddress)
                        .font(.system(size: 12.5, design: .monospaced))
                        .foregroundStyle(Orbit.ink60)
                        .lineLimit(1).truncationMode(.middle)
                        .textSelection(.enabled)
                    Spacer(minLength: 6)
                    OrbitPanelButton(title: copied ? "Copied" : "Copy") {
                        UIPasteboard.general.string = connection.displayAddress
                        copied = true
                        Task { try? await Task.sleep(for: .seconds(2)); copied = false }
                    }
                }
                if editingAddress {
                    TextField("Computer address", text: $address)
                        .textInputAutocapitalization(.never).autocorrectionDisabled()
                        .font(.system(size: 14, design: .monospaced))
                        .padding(.horizontal, 12).frame(height: 40)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Orbit.fill06))
                    Text("Use the address shown in Phone settings on your computer. Your pairing is kept.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    HStack(spacing: 8) {
                        Spacer()
                        OrbitPanelButton(title: "Cancel") { editingAddress = false }
                        OrbitPanelButton(title: "Save") {
                            if session.updateAddress(address) { editingAddress = false }
                            else { session.actionError = "That address doesn't look right. Copy it from Phone settings and try again." }
                        }
                    }
                } else {
                    HStack(spacing: 8) {
                        OrbitPanelButton(title: "Edit address") { address = connection.displayAddress; editingAddress = true }
                        OrbitPanelButton(title: "Try reconnecting", busy: refreshing) {
                            refreshing = true
                            Task { await session.refresh(); refreshing = false }
                        }
                    }
                }
            }

            if !others.isEmpty {
                OrbitKicker("Other computers")
                VStack(spacing: 0) {
                    ForEach(others) { computer in
                        if removing?.id == computer.id {
                            OrbitInlineConfirm(question: Text("Remove \(computer.name)?"),
                                               detail: Text("This removes the saved connection from this device only."),
                                               confirm: "Remove") {
                                session.forgetConnection(id: computer.id); removing = nil
                            } onCancel: { removing = nil }
                                .padding(.vertical, 6)
                        } else {
                            OrbitRow(dot: Orbit.ink40, title: Text(verbatim: computer.name), value: Text("Use")) {
                                Haptics.selection()
                                session.switchComputer(to: computer.id)
                            }
                            .contextMenu { Button("Remove", role: .destructive) { removing = computer } }
                        }
                    }
                }
            }

            HStack(spacing: 8) {
                OrbitPanelButton(title: "Connect another computer") { Haptics.selection(); session.beginPairing() }
            }
            Text("Each computer is paired separately. Only the selected computer is active at a time.")
                .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)

            if session.connection != nil {
                if removingCurrent {
                    OrbitInlineConfirm(question: Text("Remove this connection?"),
                                       detail: Text("This removes the connection from this device only. It does not revoke this device on your Mac. To remove Mac-side access, open Orbit → Settings → Phone and remove it there."),
                                       confirm: "Remove") {
                        session.signOut(); removingCurrent = false
                    } onCancel: { removingCurrent = false }
                } else {
                    OrbitPanelButton(title: "Remove connection from this device", role: .destructive) { removingCurrent = true }
                }
            }
        }
    }

    private var statusDetail: Text {
        switch session.status {
        case .live: Text("Connected and responding.")
        case .connecting: Text("Trying the saved connection.")
        case let .offline(reason): Text(verbatim: reason)
        case .unauthorized: Text("This device was removed from the computer. Pair it again to reconnect.")
        case .unpaired: Text("This device is not paired with a computer.")
        }
    }
}

// MARK: - Notifications

private struct YouNotificationsPanel: View {
    @EnvironmentObject private var session: Session
    @State private var enabling = false

    private var enabled: Bool {
        switch session.notificationAuthorization {
        case .authorized, .provisional, .ephemeral: true
        default: false
        }
    }

    var body: some View {
        OrbitSystemSheet(icon: "bell", kicker: "Notifications", title: enabled ? String(localized: "On") : String(localized: "Off"),
                         description: "Alerts arrive while Orbit is open or was recently in the background. Closed-app delivery is not available yet.") {
            OrbitRow(dot: enabled ? Orbit.success : Orbit.ink40, title: Text("Notifications"), value: Text(LocalizedStringKey(session.notificationStatusText)))
            if !enabled {
                OrbitPanelButton(title: session.notificationAuthorization == .denied ? "Open iOS Settings" : "Turn on notifications", busy: enabling) {
                    enabling = true
                    Task { await session.enableNotifications(); enabling = false }
                }
            }
        }
        .task { await session.refreshNotificationAuthorization() }
    }
}

// MARK: - Chat

private struct YouChatPanel: View {
    var go: (YouPanel) -> Void
    @AppStorage(PrefKey.activityDetail) private var activityDetail = ActivityDetail.full.rawValue
    @AppStorage(PrefKey.quickReplies) private var storedReplies = ""
    @AppStorage(PrefKey.mapDrift) private var mapDrift = true

    var body: some View {
        OrbitSystemSheet(icon: "bubble.left.and.bubble.right", kicker: "Chat", title: String(localized: "How chats read"),
                         description: "What a chat shows of a bot's work, and the replies one tap away under the composer.") {
            OrbitKicker("Activity")
            HStack(spacing: 6) {
                ForEach(ActivityDetail.allCases, id: \.rawValue) { level in
                    OrbitSegment(icon: nil, label: Text(LocalizedStringKey(level.label)), on: activityDetail == level.rawValue, disabled: false) {
                        activityDetail = level.rawValue
                    }
                }
            }
            Text(LocalizedStringKey(ActivityDetail(rawValue: activityDetail)?.caption ?? ""))
                .font(.system(size: 13)).foregroundStyle(Orbit.ink70)
            OrbitKicker("Quick replies")
            OrbitRow(icon: "bolt", title: Text("Quick replies"), value: Text("\(QuickReply.decode(storedReplies).count)")) { go(.quickReplies) }
            OrbitKicker("Motion")
            Toggle(isOn: $mapDrift) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Characters drift on the map").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    Text("The bot you open always holds still; its face still moves when it talks or thinks.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                }
            }
            .tint(Orbit.accent)
        }
    }
}

// MARK: - Hidden bots

/// Bots hidden from the map, which also leaves them out of Search: without
/// this, a bot hidden from the phone could not be brought back from it.
private struct YouHiddenBotsPanel: View {
    @EnvironmentObject private var session: Session
    @State private var busy: String?
    @State private var error: String?

    private var hidden: [Bot] { session.state.bots.filter { $0.hidden == true } }

    var body: some View {
        OrbitSystemSheet(icon: "eye.slash", kicker: "Hidden bots", title: String(localized: "\(hidden.count) hidden"),
                         description: "Hidden bots keep their chats and routines but stay off the map and out of Search. Show one to bring it back.") {
            if hidden.isEmpty {
                Text("No hidden bots.").font(.system(size: 14)).foregroundStyle(Orbit.ink50)
            }
            VStack(spacing: 0) {
                ForEach(hidden) { bot in
                    HStack(spacing: 12) {
                        BotAvatarView(bot: bot, size: 30, animated: false)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(verbatim: bot.name).font(.system(size: 15, weight: .medium)).foregroundStyle(OrbitPalette.label(bot.color))
                            if !bot.title.isEmpty { Text(verbatim: bot.title).font(.system(size: 12.5)).foregroundStyle(Orbit.ink50) }
                        }
                        Spacer(minLength: 8)
                        OrbitPanelButton(title: "Show on the map", busy: busy == bot.id) { show(bot) }
                    }
                    .padding(.vertical, 10)
                    .overlay(alignment: .bottom) { Rectangle().fill(Orbit.hairline).frame(height: 1) }
                }
            }
            if let error { Text(verbatim: error).font(.system(size: 12.5)).foregroundStyle(Orbit.dangerText) }
        }
    }

    private func show(_ bot: Bot) {
        busy = bot.id
        error = nil
        Task {
            defer { busy = nil }
            var patch = BotSettingsPatch()
            patch.hidden = false
            do { try await session.updateSettings(patch, for: bot) } catch { self.error = orbitErrorText(error) }
        }
    }
}

// MARK: - Language

private struct YouLanguagePanel: View {
    @AppStorage(PrefKey.language) private var language = AppLanguage.system.rawValue
    var body: some View {
        OrbitSystemSheet(icon: "globe", kicker: "Language", title: String(localized: "Language"),
                         description: "Changes the language inside Orbit. Following the system uses your phone's language only once Orbit is nearly fully translated into it, and English until then. A few labels switch the next time Orbit opens.") {
            VStack(spacing: 0) {
                ForEach(AppLanguage.allCases) { option in
                    OrbitRow(dot: option.rawValue == language ? Orbit.success : Orbit.fill10, title: Text(option.label),
                             value: option.rawValue == language ? Text("In use") : nil) {
                        language = option.rawValue
                        AppLanguage.applyToBundle(option.rawValue)
                    }
                }
            }
        }
    }
}

// MARK: - Inline confirmation for a whole panel

/// A panel's confirmation, inline at the foot of the panel rather than an
/// iOS alert over everything: the desktop never opens anything over the
/// canvas, and neither does the phone.
private struct OrbitConfirmModifier: ViewModifier {
    let title: Text
    @Binding var isPresented: Bool
    let confirm: LocalizedStringKey
    let message: Text?
    let onCancel: () -> Void
    let action: () -> Void

    func body(content: Content) -> some View {
        content.safeAreaInset(edge: .bottom, spacing: 0) {
            if isPresented {
                OrbitInlineConfirm(question: title, detail: message, confirm: confirm) {
                    // act first: closing clears what was being confirmed (the
                    // topic, the skill, the row), as an alert's button did
                    action()
                    isPresented = false
                } onCancel: {
                    isPresented = false
                    onCancel()
                }
                .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Orbit.canvas))
                .padding(.horizontal, 14)
                .padding(.bottom, 12)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.easeOut(duration: 0.2), value: isPresented)
    }
}

extension View {
    func orbitConfirm(_ title: Text, isPresented: Binding<Bool>, confirm: LocalizedStringKey, message: Text? = nil,
                      onCancel: @escaping () -> Void = {}, action: @escaping () -> Void) -> some View {
        modifier(OrbitConfirmModifier(title: title, isPresented: isPresented, confirm: confirm, message: message, onCancel: onCancel, action: action))
    }
}

// MARK: - Connection status, as You's Computer says it

extension Session.Status {
    var settingsText: Text {
        switch self {
        case .live: return Text("Connected")
        case .connecting: return Text("Connecting…")
        case .unpaired: return Text("Not paired")
        case .unauthorized: return Text("Needs pairing")
        case .offline: return Text("Offline")
        }
    }
}
