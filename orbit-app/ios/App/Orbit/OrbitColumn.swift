// A focused bot's systems and the pieces they share. A system opens in the
// chat's place with the bot in the corner (from its settings), or in place of
// the chat from inside it (the thread pill, the + menu); Done goes back.
import SwiftUI
import CompanionCore

/// A bot's or a channel's systems (the desktop's BotPanelKey).
enum OrbitPanel: String, Hashable, Identifiable {
    case profile, engine, computer, approvals, browser, apps, skills, memory, routines, voice, usage, settings, threads, channel
    var id: String { rawValue }
}

/// A system's panel: the same view from the bot's settings or from its chat.
struct OrbitPanelView: View {
    let panel: OrbitPanel
    let chat: Chat
    /// a thread picked in the threads panel
    var pickThread: ((String) -> Void)? = nil
    /// the bot or channel was deleted
    let leave: () -> Void
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose

    private func close() { if let orbitClose { orbitClose() } else { systemDismiss() } }

    var body: some View {
        switch (panel, chat) {
        case (.threads, _):
            if chat.supportsTasks { TaskManagerView(chat: chat) { pickThread?($0) } }
        case let (.engine, .bot(bot)): AgentProfileView(bot: bot, part: .engine)
        case let (.voice, .bot(bot)): AgentProfileView(bot: bot, part: .voice)
        case let (.profile, .bot(bot)): AgentProfileView(bot: bot, part: .profile)
        case let (.computer, .bot(bot)): ComputerView(bot: bot)
        case let (.approvals, .bot(bot)): ApprovalLevelSheet(bot: bot)
        case let (.browser, .bot(bot)): BrowserSettingSheet(bot: bot)
        case let (.memory, .bot(bot)): BotMemorySheet(bot: bot)
        case let (.skills, .bot(bot)): BotSkillsSheet(bot: bot)
        case let (.usage, .bot(bot)): BotUsageSheet(bot: bot)
        case let (.settings, .bot(bot)): BotSettingsSheet(bot: bot) { leave() }
        case (.apps, _): NavigationStack { McpServersView() }
        case (.routines, _):
            NavigationStack {
                TasksRoutinesView()
                    .toolbar { ToolbarItem(placement: .topBarLeading) { Button("Done", action: close).accessibilityIdentifier("panel-done") } }
            }
        case let (.channel, .room(room)): ChannelSettingsSheet(room: room) { leave() }
        default: EmptyView()
        }
    }
}

private struct OrbitCloseKey: EnvironmentKey {
    static let defaultValue: (() -> Void)? = nil
}

private struct OrbitLeaveKey: EnvironmentKey {
    static let defaultValue: () -> Void = {}
}

private struct OrbitShowFileKey: EnvironmentKey {
    static let defaultValue: ((FilePreviewItem) -> Void)? = nil
}

extension EnvironmentValues {
    /// Opens a file in the chat's column, where the chat sets it; elsewhere
    /// a file opens on its own.
    var orbitShowFile: ((FilePreviewItem) -> Void)? {
        get { self[OrbitShowFileKey.self] }
        set { self[OrbitShowFileKey.self] = newValue }
    }

    /// Set when a view is shown in place on the canvas (the chat's place, a
    /// panel on the map) rather than presented: its Done or Cancel closes it
    /// there.
    var orbitClose: (() -> Void)? {
        get { self[OrbitCloseKey.self] }
        set { self[OrbitCloseKey.self] = newValue }
    }

    /// Leave the focused bot or channel for the map (it was deleted, or its
    /// thread went away).
    var orbitLeave: () -> Void {
        get { self[OrbitLeaveKey.self] }
        set { self[OrbitLeaveKey.self] = newValue }
    }
}

/// `dismiss()` for a view that can be presented or shown in the column.
struct OrbitDismiss {
    let system: DismissAction
    let close: (() -> Void)?
    func callAsFunction() {
        if let close { close() } else { system() }
    }
}

extension View {
    /// Shown in the column: Done closes it there.
    func inOrbitColumn(close: @escaping () -> Void) -> some View {
        environment(\.orbitClose, close)
    }
}
