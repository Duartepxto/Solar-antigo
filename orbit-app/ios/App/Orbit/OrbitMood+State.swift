// A character's mood, read from what the bot is actually doing — the
// desktop's moodFor (src/orbit/model.ts), from the phone's copy of the fleet.
import Foundation
import CompanionCore

extension CompanionState {
    /// Every thread a bot owns: its current one and its tasks.
    func threadIds(of bot: Bot) -> Set<String> {
        var ids: Set<String> = [bot.threadId]
        for task in bot.tasks ?? [] { ids.insert(task.threadId) }
        return ids
    }

    /// A bot is waiting when one of its threads holds a pending approval or
    /// question, or the server says it is waiting on you.
    func isWaiting(_ bot: Bot) -> Bool {
        let ids = threadIds(of: bot)
        if pendingApprovals.contains(where: { ids.contains($0.threadId) }) { return true }
        return (bot.tasks ?? []).contains { $0.activity == "waiting-on-you" }
    }

    func isBusy(_ bot: Bot) -> Bool {
        if bot.busy == true { return true }
        return (bot.visibleTasks).contains { $0.isWorking }
    }

    /// The tool the running turn is using, if the transcript shows one.
    func runningTool(_ bot: Bot) -> String? {
        guard isBusy(bot) else { return nil }
        for message in visibleTranscript(forThread: bot.threadId).reversed() {
            if message.role == .user { return nil }
            if message.kind == .activity, let tool = message.tool { return tool.ok == nil ? tool.name : nil }
        }
        return nil
    }

    func mood(for bot: Bot, connected: Bool, now: Date = Date()) -> OrbitMood {
        if !connected { return .sleepy }
        if (bot.tasks ?? []).contains(where: { $0.activity == "dead" || $0.activity == "no-signal" }) { return .stalled }
        if isWaiting(bot) { return .pleading }
        if isBusy(bot) { return runningTool(bot) != nil ? .focused : .thinking }
        if let quiet = quietSince(bot), now.timeIntervalSince1970 * 1000 - quiet > OrbitMood.sleepAfterMs { return .sleepy }
        return .idle
    }

    /// When an idle bot with nothing unread last did anything (epoch ms), or
    /// nil when it has something going on. The desktop's `quietSince`.
    func quietSince(_ bot: Bot) -> Double? {
        guard !bot.unread, !isBusy(bot), !isWaiting(bot) else { return nil }
        var at = bot.messages?.last?.at ?? 0
        for task in bot.tasks ?? [] { at = max(at, task.listStamp) }
        return at > 0 ? at : nil
    }

    func mood(for chat: Chat, connected: Bool) -> OrbitMood {
        switch chat {
        case let .bot(bot): return mood(for: self.bot(bot.id) ?? bot, connected: connected)
        case let .room(room):
            if !connected { return .sleepy }
            if pendingApprovals.contains(where: { $0.threadId == room.threadId }) { return .pleading }
            return room.busyBotId != nil ? .thinking : .idle
        }
    }
}
