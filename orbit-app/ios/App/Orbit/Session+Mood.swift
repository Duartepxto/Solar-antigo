// The character mood for the live session: the fleet's moods, with the
// connection the session is actually on.
import CompanionCore

extension Session {
    var isLive: Bool { status == .live }

    func mood(for bot: Bot) -> OrbitMood { state.mood(for: bot, connected: status == .live || status == .connecting) }
    func mood(for chat: Chat) -> OrbitMood { state.mood(for: chat, connected: status == .live || status == .connecting) }
}
