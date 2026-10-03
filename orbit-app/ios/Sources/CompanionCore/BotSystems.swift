// A bot's systems as the phone may see and change them: memory, skills,
// usage, browser and approval level. The wire shapes of the narrow routes in
// companion/src/routes.ts (see there for what a phone may and may not do).
import Foundation

// MARK: - Memory

public struct MemoryCapacity: Codable, Hashable, Sendable {
    public var lines: Int
    public var bytes: Int
    public var maxLines: Int
    public var maxBytes: Int
    public var loadedLines: Int
    public var loadedBytes: Int
    public var truncated: Bool
    public var hash: String
}

public struct MemoryFileInfo: Codable, Hashable, Sendable, Identifiable {
    public var path: String
    public var name: String
    public var bytes: Int
    public var modifiedAt: Double
    public var id: String { path }
}

public struct MemoryOverview: Codable, Hashable, Sendable {
    public var botId: String
    public var workspacePath: String
    public var index: MemoryCapacity
    public var topics: [MemoryFileInfo]
    public var logs: [MemoryFileInfo]

    public static let indexPath = "MEMORY.md"
}

public struct MemoryDoc: Codable, Hashable, Sendable {
    public var path: String
    public var text: String
    public var hash: String
    public var exists: Bool
}

/// Saving is an answer either way: saved, or the bot wrote the file after
/// the phone opened it and here is what it says now.
public enum MemorySaveResult: Sendable {
    case saved(MemoryDoc)
    case conflict(current: String, currentHash: String)
}

struct MemoryConflictBody: Decodable {
    var current: String
    var currentHash: String
}

/// One row of the memory change journal (server memory journal, as the
/// desktop's History shows it).
public struct MemoryJournalRow: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var at: Double
    public var path: String
    public var actor: String
    public var via: String?
    public var threadTitle: String?
    public var kind: String
    public var diff: String?
    public var added: Int?
    public var removed: Int?
    public var canRevert: Bool?
    public var revertUnavailableReason: String?
}

struct MemoryJournalBody: Decodable {
    var entries: [Lossy<MemoryJournalRow>]
}

// MARK: - Skills

public struct SkillSummary: Codable, Hashable, Sendable, Identifiable {
    public var name: String
    public var description: String
    public var enabled: Bool
    public var source: String?
    public var warnings: [String]?
    public var id: String { name }

    private enum CodingKeys: String, CodingKey { case name, description, enabled, source, warnings }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        name = try c.decode(String.self, forKey: .name)
        description = (try? c.decode(String.self, forKey: .description)) ?? ""
        enabled = (try? c.decode(Bool.self, forKey: .enabled)) ?? false
        // `source` is a string or an object on different computers; the
        // phone only shows it, so anything else reads as unknown.
        source = try? c.decode(String.self, forKey: .source)
        warnings = try? c.decode([String].self, forKey: .warnings)
    }
}

public struct StagedSkill: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var name: String
    public var gist: String?
}

public struct SkillsListing: Codable, Sendable {
    public var skills: [SkillSummary]
    public var staged: [StagedSkill]?

    private enum CodingKeys: String, CodingKey { case skills, staged }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        skills = (try c.decodeIfPresent([Lossy<SkillSummary>].self, forKey: .skills) ?? []).compactMap(\.value)
        staged = (try? c.decodeIfPresent([Lossy<StagedSkill>].self, forKey: .staged))??.compactMap(\.value)
    }
}

struct SkillTextBody: Decodable { var text: String }

// MARK: - Usage

/// What a thread has spent, banked once per settled turn (shared/wire.ts
/// TaskUsage). The desktop's Usage panel sums these per bot.
public struct TaskUsage: Codable, Hashable, Sendable {
    public var input: Int
    public var output: Int
    public var cachedInput: Int?
    /// null until any turn reported a cost; most engines never do
    public var costUsd: Double?
    public var turns: Int
}

public struct BotUsageTotals: Hashable, Sendable {
    public var input = 0
    public var output = 0
    public var cachedInput = 0
    public var costUsd: Double?
    public var turns = 0
    public var threads = 0

    public var tokens: Int { input + output }
}

extension Bot {
    /// The desktop's botUsage (src/lib/usage.ts): every thread's usage summed.
    public var usageTotals: BotUsageTotals {
        var total = BotUsageTotals()
        for task in tasks ?? [] {
            guard let usage = task.usage else { continue }
            total.input += usage.input
            total.output += usage.output
            total.cachedInput += usage.cachedInput ?? 0
            total.turns += usage.turns
            total.threads += 1
            if let cost = usage.costUsd { total.costUsd = (total.costUsd ?? 0) + cost }
        }
        return total
    }
}

// MARK: - Browser

public struct BrowserProfileSummary: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var name: String
}

/// PATCH /api/bots/:id/browser. `profile` absent leaves it; `.some(nil)`
/// returns the bot to its own session.
public struct BrowserSettingPatch: Encodable, Sendable {
    public var enabled: Bool?
    public var profile: String??

    public init(enabled: Bool? = nil, profile: String?? = nil) {
        self.enabled = enabled
        self.profile = profile
    }

    private enum CodingKeys: String, CodingKey { case enabled, profile }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encodeIfPresent(enabled, forKey: .enabled)
        if let profile {
            if let value = profile { try c.encode(value, forKey: .profile) } else { try c.encodeNil(forKey: .profile) }
        }
    }
}

// MARK: - Approval level

/// PATCH /api/bots/:id/approval.
public struct ApprovalLevelPatch: Encodable, Sendable {
    public var mode: String
    public var threadId: String?
    public var confirmFullAccess: Bool?
    public var confirmCustom: Bool?
    public var acknowledgeLocalAuto: Bool?

    public init(mode: String, threadId: String?, confirmFullAccess: Bool = false, confirmCustom: Bool = false, acknowledgeLocalAuto: Bool = false) {
        self.mode = mode
        self.threadId = threadId
        self.confirmFullAccess = confirmFullAccess ? true : nil
        self.confirmCustom = confirmCustom ? true : nil
        self.acknowledgeLocalAuto = acknowledgeLocalAuto ? true : nil
    }
}

/// The levels the desktop offers per engine (shared/approval-mode.ts
/// supportsApprovalMode). Custom is Codex's own config.toml policy.
public enum ApprovalLevels {
    public static func supported(driverKind: String?) -> [String] {
        var out = ["ask"]
        if ["claudeAgent", "grokAgent", "antigravityAgent", "qwenAgent", "geminiAgent"].contains(driverKind ?? "") { out.append("edits") }
        out.append("auto")
        if ["codex", "claudeAgent", "antigravityAgent", "cursorAgent", "grokAgent", "opencodeGo", "qwenAgent", "geminiAgent",
            "openai-compat", "grok", "minimax", "mistral"].contains(driverKind ?? "") { out.append("full") }
        if driverKind == "codex" { out.append("custom") }
        return out
    }
}

// MARK: - Skill import

/// A skill fetched and scanned but not installed (POST
/// /api/bot-defaults/skills/preview): what the person reads before it lands.
public struct SkillPreview: Codable, Hashable, Sendable, Identifiable {
    public var name: String
    public var description: String
    public var source: String
    public var text: String
    public var warnings: [String]
    public var id: String { name }
}

struct SkillPreviewBody: Decodable { var skills: [SkillPreview] }

// MARK: - Command allowlist

public struct CommandRule: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var command: String
    public var cwd: String
    public var providerInstanceId: String
}

public struct CommandAllowlist: Codable, Hashable, Sendable {
    public struct Context: Codable, Hashable, Sendable {
        public var providerInstanceId: String
        public var cwd: String?
    }
    public var rules: [CommandRule]
    public var context: Context
    public var supported: Bool
}

// MARK: - Teams

public struct TeamBrief: Codable, Hashable, Sendable {
    public var section: String
    public var label: String?
    public var text: String
    public var maxBytes: Int?
}

// MARK: - Bot settings

/// PATCH /api/bots/:id/settings: the settings panels' fields. Only the ones
/// set are sent; `cwd`/`section` can be sent as null to clear them.
public struct BotSettingsPatch: Encodable, Sendable {
    public var section: String??
    public var chiefOfStaff: Bool?
    public var computer: String??
    public var cwd: String??
    public var approvePeerComms: Bool?
    public var pinned: Bool?
    public var hidden: Bool?
    public var color: String?
    public var acknowledgeLocalAuto: Bool?

    public init() {}

    private enum CodingKeys: String, CodingKey {
        case section, chiefOfStaff, computer, cwd, approvePeerComms, pinned, hidden, color, acknowledgeLocalAuto
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        func nullable(_ value: String??, _ key: CodingKeys) throws {
            guard let value else { return }
            if let inner = value { try c.encode(inner, forKey: key) } else { try c.encodeNil(forKey: key) }
        }
        try nullable(section, .section)
        try nullable(computer, .computer)
        try nullable(cwd, .cwd)
        try c.encodeIfPresent(chiefOfStaff, forKey: .chiefOfStaff)
        try c.encodeIfPresent(approvePeerComms, forKey: .approvePeerComms)
        try c.encodeIfPresent(pinned, forKey: .pinned)
        try c.encodeIfPresent(hidden, forKey: .hidden)
        try c.encodeIfPresent(color, forKey: .color)
        try c.encodeIfPresent(acknowledgeLocalAuto, forKey: .acknowledgeLocalAuto)
    }
}
