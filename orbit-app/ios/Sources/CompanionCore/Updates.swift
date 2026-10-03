// What the Updates pill shows: only the chats doing something.
//
// Three kinds, in the order a person cares about them — a bot that has
// stopped and needs an answer, a bot mid-turn, and a bot that finished with
// something you have not read. A bot that is idle and read is not an update
// and never appears here; that is what the roster below is for.
//
// The computation lives in Core rather than the app target so the Updates
// sheet, the Live Activity, and home-screen widgets all consume one
// definition of "what needs you" and can never disagree; ChatUpdate is
// Codable so the same value can serialize into a widget snapshot.
import Foundation

public struct ChatUpdate: Identifiable, Hashable, Codable {
    public enum Kind: Int, Comparable, Codable, Sendable {
        case needsYou = 0, working, toReview
        public static func < (a: Kind, b: Kind) -> Bool { a.rawValue < b.rawValue }
    }

    public let chat: Chat
    public let kind: Kind
    /// One line under the name — the question, what it is doing, or what it said.
    public let line: String
    /// The card to answer, when `kind == .needsYou`.
    public let card: OptionCard?
    /// What a working bot is doing right now, for the Live Activity.
    public var progress: LiveProgress? = nil

    public var id: String { chat.conversationID }

    /// The options a compact surface may offer as one-tap answers: a live
    /// ask with a real card, minus SKILL.md requests, which must be read in
    /// the chat before they enable anything. The Updates sheet's pills and
    /// the widgets' buttons share this one rule, so they can never disagree
    /// about what is answerable.
    public var answerOptions: [String] {
        Self.answerOptions(kind: kind, card: card)
    }

    /// The rule behind `answerOptions`, in the form a snapshot row can also
    /// reach: it sees the kind and the card, nothing else.
    public static func answerOptions(kind: Kind, card: OptionCard?) -> [String] {
        guard kind == .needsYou, let card, card.isPending, card.skillRequest == nil else { return [] }
        return card.options
    }
}

extension CompanionState {
    public var updates: [ChatUpdate] {
        var out: [ChatUpdate] = []
        var seen = Set<String>()

        // Newest approval first, one per chat: the pill headlines the most
        // recent thing that stopped, and the sheet lists the rest.
        for pending in pendingApprovals {
            guard let chat = chat(forThread: pending.threadId), seen.insert(chat.conversationID).inserted else { continue }
            let card = pending.message.card
            out.append(ChatUpdate(chat: chat, kind: .needsYou, line: card?.subtitle ?? card?.title ?? "", card: card))
        }

        for bot in bots where bot.hidden != true {
            for task in bot.attentionOrderedTasks(queuedThreadIds: queuedThreadIds) {
                guard let projected = bot.projected(forThread: task.threadId) else { continue }
                let chat = Chat.bot(projected)
                guard seen.insert(chat.conversationID).inserted else { continue }
                if task.activity == "waiting-on-you" {
                    out.append(ChatUpdate(chat: chat, kind: .needsYou, line: "Waiting on you", card: nil))
                } else if let held = pendingQueued[task.threadId], !held.isEmpty {
                    out.append(ChatUpdate(chat: chat, kind: .working, line: queuedLine(for: held), card: nil))
                } else if projected.busy == true {
                    out.append(ChatUpdate(chat: chat, kind: .working, line: workingLine(threadId: task.threadId), card: nil,
                                          progress: liveProgress(threadId: task.threadId)))
                } else if projected.unread {
                    out.append(ChatUpdate(chat: chat, kind: .toReview, line: lastLine(threadId: task.threadId), card: nil))
                }
            }
        }
        for room in rooms {
            let chat = Chat.room(room)
            guard !seen.contains(chat.conversationID) else { continue }
            if let held = pendingQueued[room.threadId], !held.isEmpty {
                seen.insert(chat.conversationID)
                out.append(ChatUpdate(chat: chat, kind: .working, line: queuedLine(for: held), card: nil))
            } else if room.busyBotId != nil {
                seen.insert(chat.conversationID)
                out.append(ChatUpdate(chat: chat, kind: .working, line: workingLine(threadId: room.threadId), card: nil,
                                      progress: liveProgress(threadId: room.threadId)))
            } else if room.unread {
                seen.insert(chat.conversationID)
                out.append(ChatUpdate(chat: chat, kind: .toReview, line: lastLine(threadId: room.threadId), card: nil))
            }
        }
        return out.sorted { $0.kind < $1.kind }
    }

    public func chat(forThread threadId: String) -> Chat? {
        if let bot = bot(forThread: threadId) { return .bot(bot) }
        if let room = room(forThread: threadId) { return .room(room) }
        return nil
    }

    /// One line for a thread's held sends. Only a capacity hold waits for a
    /// free slot; a hold behind the running turn is simply queued, and the
    /// pill must not promise a slot it is not waiting for.
    private func queuedLine(for held: [QueuedSend]) -> String {
        if held.count == 1 {
            return held[0].reason == "capacity"
                ? "Queued — waiting for an available slot"
                : "Queued"
        }
        return "\(held.count) messages queued"
    }

    private func workingLine(threadId: String) -> String {
        if let live = streaming[threadId], !live.isEmpty {
            return String(live.suffix(120)).replacingOccurrences(of: "\n", with: " ")
        }
        if let last = visibleTranscript(forThread: threadId).last, last.kind == .activity, let tool = last.tool {
            return tool.phrase ?? tool.name
        }
        return "Working…"
    }

    private func lastLine(threadId: String) -> String {
        guard let last = visibleTranscript(forThread: threadId).last(where: { $0.kind != .digest }) else { return "" }
        switch last.kind {
        case .text, .unknown: return last.text ?? ""
        case .options: return last.card?.title ?? ""
        case .secret: return last.secret?.label ?? last.text ?? "Credential required"
        case .activity: return last.tool.map { $0.phrase ?? $0.name } ?? ""
        case .screen: return "Screenshot"
        case .digest: return ""
        case .compaction: return last.compaction?.chipText ?? last.text ?? ""
        }
    }

    /// This turn so far: the last thing the bot said, the step it is on and
    /// how many it has taken. The turn starts after your last message.
    public func liveProgress(threadId: String) -> LiveProgress {
        let transcript = visibleTranscript(forThread: threadId)
        let start = transcript.lastIndex { $0.role == .user }.map { $0 + 1 } ?? 0
        let turn = transcript[start...]
        let tools = turn.filter { $0.kind == .activity && $0.tool != nil }
        let said = turn.last { $0.role == .bot && $0.kind == .text && !($0.text ?? "").isEmpty }?.text
            .map { Self.firstSentence($0) }
        let current = tools.last
        return LiveProgress(
            said: said,
            step: current?.tool.map { $0.phrase ?? $0.name },
            icon: current?.tool.map { Self.icon(for: $0.name) } ?? "sparkles",
            steps: tools.count,
            stepSince: current.map { Date(timeIntervalSince1970: $0.at / 1_000) }
        )
    }

    private static func firstSentence(_ text: String) -> String {
        let plain = text.replacingOccurrences(of: #"[*_`#>]"#, with: "", options: .regularExpression)
            .replacingOccurrences(of: "\n", with: " ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        if let end = plain.range(of: #"[.!?](\s|$)"#, options: .regularExpression) {
            return String(plain[..<end.upperBound]).trimmingCharacters(in: .whitespaces)
        }
        return String(plain.prefix(140))
    }

    private static func icon(for tool: String) -> String {
        switch tool.lowercased().replacingOccurrences(of: #"^mcp__[^_]+__"#, with: "", options: .regularExpression) {
        case "bash", "shell", "terminal", "run_command", "execute", "computer_exec", "exec_command": return "terminal"
        case "read", "read_file", "view": return "doc.text"
        case "write", "create_file", "edit", "multiedit", "str_replace", "apply_patch": return "pencil"
        case "grep", "search", "glob", "find": return "magnifyingglass"
        case "webfetch", "fetch", "web_fetch", "websearch", "web_search": return "globe"
        default: return "wrench.and.screwdriver"
        }
    }
}

public struct LiveProgress: Hashable, Codable, Sendable {
    public var said: String?
    public var step: String?
    public var icon: String
    public var steps: Int
    public var stepSince: Date?
}
