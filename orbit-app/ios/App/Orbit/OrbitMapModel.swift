// What the team map draws, derived from the phone's copy of the fleet. A
// port of the desktop's buildModel / teamCentres / botHomes / looseSpot /
// channelPos (src/orbit/model.ts), so teams sit where they sit on the desktop
// before anyone drags them. Nothing here invents data.
//
// The desktop keeps the owner's drags in its own local storage, which no
// server route exposes, so the phone uses the same layout without them.
import Foundation
import CompanionCore
import CoreGraphics

struct OrbitMapBot: Identifiable, Hashable {
    let id: String
    let bot: Bot
    let teamKey: String
    let chief: Bool
    let mood: OrbitMood
    let busy: Bool
    let waiting: Bool
    let unread: Bool
    /// pinned by the person: a pin before its name
    let pinned: Bool
    /// when it last did anything, while idle with nothing unread (epoch ms)
    var quietSince: Double? = nil
}

struct OrbitMapTeam: Identifiable, Hashable {
    var id: String { key }
    let key: String
    let name: String
    let color: String
    let chiefId: String?
    let memberIds: [String]
    /// bots with no section: drawn loose around You, no glow or label
    let loose: Bool
}

struct OrbitMapChannel: Identifiable, Hashable {
    let id: String
    let room: Room
    let name: String
    let color: String
    let memberIds: [String]
}

struct OrbitMapModel {
    var bots: [OrbitMapBot] = []
    var teams: [OrbitMapTeam] = []
    var channels: [OrbitMapChannel] = []
    /// A phone held upright gets its own layout: teams round You on a tall
    /// ellipse, not the desktop's wide arc, which would leave the map a thin
    /// strip across the middle of the screen. Each device keeps its own layout.
    var portrait = false

    static let you = CGPoint.zero

    init() {}

    init(state: CompanionState, connected: Bool) {
        let visible = state.bots.filter { $0.hidden != true }
        var order: [String] = []
        var byKey: [String: [Bot]] = [:]
        for bot in visible {
            let key = bot.section?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
            if byKey[key] == nil { order.append(key) }
            byKey[key, default: []].append(bot)
        }
        // The loose bots are drawn last, around You.
        if let i = order.firstIndex(of: "") { order.remove(at: i); order.append("") }
        var chiefIds = Set<String>()
        teams = order.map { key in
            let members = byKey[key] ?? []
            let chiefs = members.filter { $0.chiefOfStaff == true }
            let chief = key.isEmpty ? nil : chiefs.first
            let rest = members.filter { $0.id != chief?.id }
            let lead = chief ?? rest.first
            if let chief { chiefIds.insert(chief.id) }
            return OrbitMapTeam(
                key: key,
                name: key.isEmpty ? "General" : key,
                color: lead?.color ?? "blue",
                chiefId: chief?.id,
                memberIds: (chief.map { [$0.id] } ?? []) + rest.map(\.id),
                loose: key.isEmpty
            )
        }
        bots = visible.map { bot in
            OrbitMapBot(
                id: bot.id,
                bot: bot,
                teamKey: bot.section?.trimmingCharacters(in: .whitespacesAndNewlines) ?? "",
                chief: chiefIds.contains(bot.id),
                mood: state.mood(for: bot, connected: connected),
                busy: state.isBusy(bot),
                waiting: state.isWaiting(bot),
                unread: bot.unread,
                pinned: bot.pinned == true,
                quietSince: state.quietSince(bot)
            )
        }
        let ids = Set(visible.map(\.id))
        channels = state.rooms.filter { $0.dm != true }.compactMap { room in
            let members = room.memberIds.filter { ids.contains($0) }
            guard !members.isEmpty else { return nil }
            let lead = room.defaultResponder.kind == "member" ? room.defaultResponder.botId : nil
            let colour = visible.first { $0.id == (lead ?? members[0]) }?.color ?? "purple"
            return OrbitMapChannel(id: room.id, room: room, name: room.name.hasPrefix("#") ? room.name : "#\(room.name)", color: colour, memberIds: members)
        }
    }

    func laidOut(portrait: Bool) -> OrbitMapModel {
        var copy = self
        copy.portrait = portrait
        return copy
    }

    func bot(_ id: String) -> OrbitMapBot? { bots.first { $0.id == id } }

    /// Team centres around You: a few on an arc above, more the whole way round.
    func teamCentres() -> [String: CGPoint] {
        let placed = teams.filter { !$0.loose }
        let n = placed.count
        var out: [String: CGPoint] = [:]
        if portrait {
            // one team above You; more the whole way round, starting at the top
            // (tilted, so two teams don't stack on one line through You)
            let radius = n <= 2 ? 380.0 : max(440, 150 * Double(n) / .pi + 240)
            let tilt = n == 2 ? -0.5 : 0
            for (i, team) in placed.enumerated() {
                let a = -.pi / 2 + tilt + Double(i) / Double(max(n, 1)) * .pi * 2
                out[team.key] = CGPoint(x: cos(a) * radius * (n == 2 ? 0.75 : 0.5), y: sin(a) * radius)
            }
            return out
        }
        let radius = n <= 1 ? 440.0 : max(480, 150 * Double(n) / .pi + 260)
        for (i, team) in placed.enumerated() {
            let a: Double
            if n <= 4 {
                a = -.pi / 2 + (n == 1 ? 0 : (Double(i) / Double(n - 1) - 0.5) * (.pi * (n == 2 ? 0.55 : 0.8)))
            } else {
                a = -.pi / 2 + Double(i) / Double(n) * .pi * 2
            }
            out[team.key] = CGPoint(x: cos(a) * radius, y: sin(a) * radius * 0.85)
        }
        return out
    }

    private static let looseAngles: [Double] = [168, 12, 198, -18, 142, 38, 222, -42, 120, 60]

    static func looseSpot(_ i: Int) -> CGPoint {
        let a = looseAngles[i % looseAngles.count] * .pi / 180
        let r = 230 + Double(i / looseAngles.count) * 100
        return CGPoint(x: cos(a) * r, y: sin(a) * r)
    }

    /// Home of every visible bot. Chiefs at their team's centre, teammates
    /// fanned out on the side away from You.
    func homes() -> [String: (point: CGPoint, chief: Bool)] {
        let centres = teamCentres()
        var pos: [String: (point: CGPoint, chief: Bool)] = [:]
        for team in teams {
            if team.loose {
                for (i, id) in team.memberIds.enumerated() { pos[id] = (Self.looseSpot(i), false) }
                continue
            }
            guard let c = centres[team.key] else { continue }
            let base = atan2(c.y, c.x)
            let others = team.memberIds.filter { $0 != team.chiefId }
            if let chief = team.chiefId { pos[chief] = (c, true) }
            let perRing = 6
            for (i, id) in others.enumerated() {
                let ring = i / perRing
                let inRing = min(perRing, others.count - ring * perRing)
                let k = i % perRing
                let rad = (team.chiefId != nil ? 170.0 : 140.0) + Double(ring) * 90
                let spread = (team.chiefId != nil ? 1.0 : 1.15) * (1 - Double(ring) * 0.25)
                let a = base + (Double(k) - Double(inRing - 1) / 2) * spread * (inRing > 3 ? 0.8 : 1)
                pos[id] = (CGPoint(x: c.x + cos(a) * rad, y: c.y + sin(a) * rad), false)
            }
        }
        return pos
    }

    /// A channel sits between its members, pulled a little toward You.
    func channelPos(_ channel: OrbitMapChannel, homes: [String: (point: CGPoint, chief: Bool)]) -> CGPoint {
        let pts = channel.memberIds.compactMap { homes[$0]?.point }
        guard !pts.isEmpty else { return Self.you }
        let cx = pts.map(\.x).reduce(0, +) / Double(pts.count)
        let cy = pts.map(\.y).reduce(0, +) / Double(pts.count)
        return CGPoint(x: cx * 0.62, y: cy * 0.62)
    }

    /// The Chiefs, then everyone else: who the map's composer can address.
    var addressees: [Bot] {
        let chiefs = bots.filter(\.chief).map(\.bot)
        return chiefs + bots.filter { !$0.chief }.map(\.bot)
    }
}
