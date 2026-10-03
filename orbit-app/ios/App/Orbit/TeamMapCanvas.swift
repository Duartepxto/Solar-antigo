// The team map's drawing: the dot grid, team glows and labels, the lines
// between You, Chiefs and members, the characters and their names. Drawn
// once per frame from the map model and a camera; taps are handled by the
// view above it, which lays transparent buttons over the same positions.
import SwiftUI
import CompanionCore

/// Where the map is looking: a world point at the screen centre, and a scale.
struct MapCamera: Equatable {
    var center: CGPoint = .zero
    var scale: Double = 0.3
    /// Where on screen `center` lands; the middle of the screen when nil.
    /// A focused bot sits above its column, not in the middle.
    var anchor: CGPoint?

    func anchorPoint(in size: CGSize) -> CGPoint { anchor ?? CGPoint(x: size.width / 2, y: size.height / 2) }

    func screen(_ p: CGPoint, in size: CGSize) -> CGPoint {
        let a = anchorPoint(in: size)
        return CGPoint(x: (p.x - center.x) * scale + a.x, y: (p.y - center.y) * scale + a.y)
    }

    /// Close enough that nothing on screen would move by half a point.
    func near(_ o: MapCamera) -> Bool {
        guard let a = anchor, let b = o.anchor else { return anchor == nil && o.anchor == nil && center == o.center && scale == o.scale }
        return abs(scale - o.scale) / max(scale, 0.001) < 0.001
            && hypot(center.x - o.center.x, center.y - o.center.y) * scale < 0.5
            && hypot(a.x - b.x, a.y - b.y) < 0.5
    }

    func world(_ p: CGPoint, in size: CGSize) -> CGPoint {
        let a = anchorPoint(in: size)
        return CGPoint(x: (p.x - a.x) / scale + center.x, y: (p.y - a.y) / scale + center.y)
    }

    /// Characters keep a readable size on a phone whatever the zoom.
    var sizeFactor: Double { min(1.6, max(0.85, scale / 0.3)) }

    /// A camera that shows every home and You, clear of the bars above and below.
    static func fit(_ points: [CGPoint], in size: CGSize, insets: EdgeInsets) -> MapCamera {
        let all = points + [OrbitMapModel.you]
        let minX = all.map(\.x).min()! - 110, maxX = all.map(\.x).max()! + 110
        let minY = all.map(\.y).min()! - 130, maxY = all.map(\.y).max()! + 130
        let usableW = max(100, size.width), usableH = max(100, size.height - insets.top - insets.bottom)
        let s = min(0.9, max(0.22, min(usableW / (maxX - minX), usableH / (maxY - minY))))
        // centre the box in the usable band, not the whole screen
        let bandMid = insets.top + usableH / 2
        let cy = (minY + maxY) / 2 - (bandMid - size.height / 2) / s
        return MapCamera(center: CGPoint(x: (minX + maxX) / 2, y: cy), scale: s)
    }
}

/// Characters' animation state, kept across frames without publishing.
final class MapCharacters {
    private var states: [String: OrbitCharState] = [:]
    private var lastMessage: [String: String] = [:]
    var lastT: Double?

    /// Work moving on the map, the desktop's streams (src/orbit/scene.ts
    /// setModel/emit): out from the boss when a bot starts working, green
    /// back when it finishes, amber to You when it starts waiting.
    struct Stream {
        let from: String
        let to: String
        let rgb: OrbitRGB
        let start: Double
        var arrived = false
    }
    private(set) var streams: [Stream] = []
    private var seen: [String: (busy: Bool, waiting: Bool)] = [:]
    private var doneAt: [String: Double] = [:]

    static let white = OrbitRGB(r: 252, g: 252, b: 252)
    static let green = OrbitRGB(hex: "#38d591")
    static let amber = OrbitRGB.amber

    /// Compare each bot with what the map last saw and start streams for
    /// the changes. The first sight of a bot only records it.
    func observe(_ model: OrbitMapModel, t: Double) {
        let chiefOf: [String: String] = Dictionary(uniqueKeysWithValues: model.teams.flatMap { team in
            team.memberIds.compactMap { id in team.chiefId.flatMap { $0 == id ? nil : (id, $0) } }
        })
        for bot in model.bots {
            let now = (busy: bot.busy, waiting: bot.waiting)
            defer { seen[bot.id] = now }
            guard let before = seen[bot.id] else { continue }
            let boss = chiefOf[bot.id] ?? "you"
            if now.busy && !before.busy {
                let rgb = boss == "you" ? Self.white : model.bot(boss).map { OrbitPalette.rgb($0.bot.color) } ?? Self.white
                streams.append(Stream(from: boss, to: bot.id, rgb: rgb, start: t))
                states[boss]?.kick = t
            }
            if !now.busy && before.busy {
                doneAt[bot.id] = t
                streams.append(Stream(from: bot.id, to: boss, rgb: Self.green, start: t))
                states[bot.id]?.kick = t
            }
            if now.waiting && !before.waiting {
                streams.append(Stream(from: bot.id, to: "you", rgb: Self.amber, start: t))
                states[bot.id]?.kick = t
            }
        }
        streams.removeAll { t - $0.start > 4.5 }
    }

    /// A bot that just finished smiles for a moment (the desktop's 1.6 s).
    func justFinished(_ id: String, t: Double) -> Bool {
        guard let at = doneAt[id] else { return false }
        return t - at < 1.6
    }

    /// The desktop's moodOf: short moods over the bot's own, and a long
    /// quiet spell as sleep. Sending just after it sent something, surprised
    /// when something reached it, happy when it just finished.
    func displayMood(_ bot: OrbitMapBot, t: Double) -> OrbitMood {
        let base = bot.mood
        if base == .stalled || base == .pleading || base == .sleepy { return base }
        if let s = states[bot.id] {
            if t - s.kick < 0.9 { return .sending }
            if t - s.flash < 0.8 { return .surprised }
        }
        if justFinished(bot.id, t: t) { return .happy }
        if base == .idle, let quiet = bot.quietSince, Date().timeIntervalSince1970 * 1000 - quiet > OrbitMood.sleepAfterMs { return .sleepy }
        return base
    }

    func markArrived(_ index: Int) { streams[index].arrived = true }

    func state(_ id: String, color: String) -> OrbitCharState {
        if let s = states[id] {
            s.rgb = OrbitPalette.rgb(color)
            return s
        }
        let s = OrbitCharState(rgb: id == "you" ? .pearl : OrbitPalette.rgb(color), seed: orbitSeed(id))
        states[id] = s
        return s
    }

    /// A new message reaching a bot flashes its ring, the way the desktop does.
    func noteMessage(_ id: String, messageId: String?, t: Double) {
        guard let messageId else { return }
        if let old = lastMessage[id], old != messageId { states[id]?.flash = t }
        lastMessage[id] = messageId
    }

    func step(_ t: Double) -> Double {
        defer { lastT = t }
        guard let last = lastT else { return 0 }
        return max(0, min(0.1, t - last))
    }
}

/// What the camera is focused on, and how far into that focus it is: the
/// rest of the map fades back while a bot, a channel or You is open, the
/// focused character grows to its column size, and its systems' lines grow
/// out of it (src/orbit/scene.ts: fT, envA, the systems orbit).
struct CanvasFocus {
    /// a bot id, "you", or "channel:<id>"; nil on the bare map
    var id: String?
    /// 0 on the map, 1 once focused
    var t: Double = 0
    /// the focused character's radius on screen
    var R: Double = 30
    /// where each system's line ends, on screen
    var ring: [CGPoint] = []
    var live: Set<Int> = []
    var warn: Set<Int> = []
    var revealStart: Double = 0
    /// a focused channel and its members stand out (its settings are open);
    /// with its chat open they fade back like everything else
    var highlight = true

    static let none = CanvasFocus()
}

enum TeamMapCanvas {
    static let chiefR = 20.0
    static let memberR = 15.0
    static let youR = 17.0

    static func bob(_ id: String, t: Double, reduced: Bool) -> CGPoint {
        guard !reduced else { return .zero }
        let s = orbitSeed(id)
        return CGPoint(x: sin(t * 0.45 + s) * 6, y: cos(t * 0.37 + s) * 5)
    }

    static func draw(_ ctx: inout GraphicsContext, size: CGSize, model: OrbitMapModel, homes: [String: (point: CGPoint, chief: Bool)], camera c: MapCamera, chars: MapCharacters, t: Double, reduced: Bool, drift: Bool = true, focus: CanvasFocus = .none) {
        let W = size.width, H = size.height
        let envA = 1 - focus.t // the rest of the map fades out fully (no ghosts behind the header or ring)
        // team names and channel labels would read as clutter behind a focused
        // bot: they go all the way out, the characters keep a trace
        let labelA = max(0, 1 - 1.4 * focus.t)
        let focusChannel = focus.highlight ? focus.id.flatMap { $0.hasPrefix("channel:") ? String($0.dropFirst(8)) : nil } : nil
        let dt = reduced ? 0 : chars.step(t)
        chars.observe(model, t: t)
        let S = { (p: CGPoint) in c.screen(p, in: size) }
        let k = c.sizeFactor

        // the dot grid
        let g = 80 * c.scale
        if g > 6 {
            let a = c.anchorPoint(in: size)
            let ox = ((a.x - c.center.x * c.scale).truncatingRemainder(dividingBy: g) + g).truncatingRemainder(dividingBy: g)
            let oy = ((a.y - c.center.y * c.scale).truncatingRemainder(dividingBy: g) + g).truncatingRemainder(dividingBy: g)
            var grid = Path()
            var gx = ox
            while gx < W {
                var gy = oy
                while gy < H { grid.addRect(CGRect(x: gx, y: gy, width: 1.2, height: 1.2)); gy += g }
                gx += g
            }
            ctx.fill(grid, with: .color(.white.opacity(0.05)))
        }

        var pos: [String: CGPoint] = [:]
        for bot in model.bots {
            guard let h = homes[bot.id] else { continue }
            // the bot you opened holds still (its face still moves), so its
            // chat or settings start centred; the rest drift unless drift is off
            let still = focus.id == bot.id ? min(1, focus.t) : 0
            let raw = bob(bot.id, t: t, reduced: reduced || !drift)
            let b = CGPoint(x: raw.x * (1 - still), y: raw.y * (1 - still))
            pos[bot.id] = S(CGPoint(x: h.point.x + b.x, y: h.point.y + b.y))
        }
        let you = S(OrbitMapModel.you)
        var placed: [CGRect] = [CGRect(x: you.x - 16, y: you.y - 16, width: 32, height: 48)]
        let centres = model.teamCentres()
        let ink = Color(hex: "#fcfcfc")

        // teams: glow, label, lines
        ctx.opacity = envA
        for team in model.teams {
            let lead = team.chiefId
            if !team.loose, let centre = centres[team.key] {
                let p = S(centre), rr = 250 * c.scale
                let rgb = OrbitPalette.rgb(team.color)
                ctx.fill(Path(ellipseIn: CGRect(x: p.x - rr, y: p.y - rr, width: rr * 2, height: rr * 2)),
                         with: .radialGradient(Gradient(colors: [rgb.color(0.09), rgb.color(0)]), center: p, startRadius: 0, endRadius: rr))
                let name = ctx.resolve(Text(verbatim: team.name.uppercased()).font(.system(size: 10, weight: .medium, design: .monospaced)).tracking(1).foregroundColor(OrbitPalette.label(team.color)))
                let subText: String
                if let lead, let chief = model.bot(lead) {
                    subText = String(localized: "Chief · \(chief.bot.name)")
                } else {
                    subText = String(localized: "no Chief · reports to you")
                }
                let sub = ctx.resolve(Text(verbatim: subText).font(.system(size: 10.5)).foregroundColor(ink.opacity(0.55)))
                let w = max(name.measure(in: CGSize(width: 400, height: 40)).width, sub.measure(in: CGSize(width: 400, height: 40)).width)
                // clear of every character in the team and of what's placed;
                // beside the Chief toward You reads best, then above, then below
                let members = team.memberIds.compactMap { id in pos[id].map { (id, $0) } }
                let top = members.map(\.1.y).min() ?? p.y, bottom = members.map(\.1.y).max() ?? p.y
                let orbR = chiefR * k + 12
                func clear(_ r: CGRect) -> Bool {
                    r.minX > 6 && r.maxX < W - 6
                        && !placed.contains { $0.intersects(r) }
                        && !pos.values.contains { o in
                            let nx = max(r.minX, min(o.x, r.maxX)), ny = max(r.minY, min(o.y, r.maxY))
                            return hypot(o.x - nx, o.y - ny) < orbR
                        }
                }
                var spots: [(x0: Double, y: Double)] = []
                if let lead, let lp = pos[lead] {
                    let dir: Double = you.x > lp.x ? 1 : -1
                    spots.append((dir > 0 ? lp.x + 30 * k : lp.x - 30 * k - w, lp.y - 3))
                    spots.append((dir > 0 ? lp.x - 30 * k - w : lp.x + 30 * k, lp.y - 3))
                } else if let first = members.first?.1 {
                    // beside the first bot, on the side away from You's line
                    let dir: Double = first.x >= you.x ? 1 : -1
                    spots.append((dir > 0 ? first.x + 30 * k : first.x - 30 * k - w, first.y - 3))
                    spots.append((dir > 0 ? first.x - 30 * k - w : first.x + 30 * k, first.y - 3))
                }
                spots.append((p.x - w / 2, top - orbR - 18))
                spots.append((p.x - w / 2, bottom + orbR + 22))
                let pick = spots.first { clear(CGRect(x: $0.x0, y: $0.y - 14, width: w, height: 30)) } ?? spots.last!
                ctx.opacity = labelA
                ctx.draw(name, at: CGPoint(x: pick.x0, y: pick.y - 6), anchor: .leading)
                ctx.draw(sub, at: CGPoint(x: pick.x0, y: pick.y + 8), anchor: .leading)
                ctx.opacity = envA
                placed.append(CGRect(x: pick.x0, y: pick.y - 14, width: w, height: 30))
            }
            let waitColor = Color(red: 1, green: 152 / 255, blue: 0).opacity(0.6)
            if let lead, let lp = pos[lead] {
                var line = Path(); line.move(to: you); line.addLine(to: lp)
                ctx.stroke(line, with: .color(model.bot(lead)?.waiting == true ? waitColor : ink.opacity(0.14)), lineWidth: 1)
                if model.bot(lead)?.busy == true, !reduced {
                    let u = (t * 0.6 + orbitSeed(lead)).truncatingRemainder(dividingBy: 1)
                    let dot = CGPoint(x: you.x + (lp.x - you.x) * u, y: you.y + (lp.y - you.y) * u)
                    ctx.fill(Path(ellipseIn: CGRect(x: dot.x - 2, y: dot.y - 2, width: 4, height: 4)), with: .color(Color(hex: "#fcfcfc")))
                }
            }
            for id in team.memberIds where id != lead {
                guard let mp = pos[id], let member = model.bot(id) else { continue }
                let from = lead.flatMap { pos[$0] } ?? you
                var line = Path(); line.move(to: from); line.addLine(to: mp)
                let colour: Color = member.waiting ? waitColor : lead != nil ? ink.opacity(0.08) : Color(red: 1, green: 190 / 255, blue: 120 / 255).opacity(team.loose ? 0.1 : 0.15)
                ctx.stroke(line, with: .color(colour), lineWidth: 1)
                // work travelling out to a busy member, from its Chief or from You
                if member.busy, !reduced {
                    let u = (t * 0.6 + orbitSeed(id)).truncatingRemainder(dividingBy: 1)
                    let dot = CGPoint(x: from.x + (mp.x - from.x) * u, y: from.y + (mp.y - from.y) * u)
                    let colour = lead.flatMap { model.bot($0) }.map { OrbitPalette.color($0.bot.color) } ?? Color(hex: "#fcfcfc")
                    ctx.fill(Path(ellipseIn: CGRect(x: dot.x - 2, y: dot.y - 2, width: 4, height: 4)), with: .color(colour))
                }
            }
        }

        // channels, between their members
        for channel in model.channels {
            ctx.opacity = channel.id == focusChannel ? 1 : labelA
            let home = S(model.channelPos(channel, homes: homes))
            let label = ctx.resolve(Text(verbatim: channel.name).font(.system(size: 11, weight: .medium)).foregroundColor(OrbitPalette.label(channel.color)))
            let sz = label.measure(in: CGSize(width: 300, height: 30))
            let base = CGRect(x: home.x - sz.width / 2 - 9, y: home.y - 11, width: sz.width + 18, height: 22)
            // two channels between the same bots would sit on one spot: take
            // the nearest spot, up or down, clear of pills, labels and characters
            func clear(_ r: CGRect) -> Bool {
                !placed.contains(where: { $0.insetBy(dx: -3, dy: -3).intersects(r) })
                    && !(Array(pos.values) + [you]).contains(where: { o in
                        let nx = max(r.minX, min(o.x, r.maxX)), ny = max(r.minY, min(o.y, r.maxY))
                        return hypot(o.x - nx, o.y - ny) < chiefR * k + 8
                    })
            }
            let rect = [0.0, 28, -28, 56, -56, 84, -84].lazy.map { base.offsetBy(dx: 0, dy: $0) }.first(where: clear) ?? base
            let p = CGPoint(x: rect.midX, y: rect.midY)
            ctx.fill(Path(roundedRect: rect, cornerRadius: 11), with: .color(Color(hex: "#1c1c1f")))
            ctx.stroke(Path(roundedRect: rect, cornerRadius: 11), with: .color(OrbitPalette.color(channel.color).opacity(channel.room.unread ? 0.8 : 0.35)), lineWidth: 1)
            ctx.draw(label, at: p, anchor: .center)
            placed.append(rect)
        }

        ctx.opacity = 1

        // the focused bot's systems: lines grow out of it, one after another
        if focus.t > 0.05, !focus.ring.isEmpty, let fid = focus.id {
            let origin: CGPoint? = fid == "you" ? you : pos[fid]
            if let o = origin {
                let rgb = model.bot(fid).map { OrbitPalette.rgb($0.bot.color) } ?? .pearl
                let r0 = focus.R * 1.3 + 10
                for (i, end) in focus.ring.enumerated() {
                    let u = reduced ? 1 : max(0, min(1, (t - focus.revealStart - 0.25 - Double(i) * 0.04) / 0.38))
                    let e = 1 - pow(1 - u, 3)
                    guard e > 0 else { continue }
                    let dx = end.x - o.x, dy = end.y - o.y, L = max(1, hypot(dx, dy))
                    guard L > r0 else { continue }
                    let a = CGPoint(x: o.x + dx / L * r0, y: o.y + dy / L * r0)
                    let b = CGPoint(x: a.x + (end.x - a.x) * e, y: a.y + (end.y - a.y) * e)
                    let on = focus.live.contains(i), warn = focus.warn.contains(i)
                    let colour: Color = warn ? Orbit.amber : on ? rgb.color(1) : ink.opacity(0.12)
                    var line = Path(); line.move(to: a); line.addLine(to: b)
                    ctx.opacity = focus.t
                    ctx.stroke(line, with: .color(colour), style: StrokeStyle(lineWidth: on || warn ? 1.4 : 1, dash: (on || warn) && e >= 1 ? [3, 6] : [], dashPhase: -t * 30))
                    let d = on || warn ? 2.2 : 1.6
                    ctx.fill(Path(ellipseIn: CGRect(x: b.x - d, y: b.y - d, width: d * 2, height: d * 2)), with: .color(on || warn ? colour : ink.opacity(0.35)))
                }
                ctx.opacity = 1
            }
        }

        // You, tinted toward each team
        var tints: [(a: Double, rgb: OrbitRGB, w: Double)] = []
        for team in model.teams {
            let pts = team.memberIds.compactMap { pos[$0] }
            guard !pts.isEmpty else { continue }
            let mx = pts.map(\.x).reduce(0, +) / Double(pts.count), my = pts.map(\.y).reduce(0, +) / Double(pts.count)
            tints.append((atan2(my - you.y, mx - you.x), OrbitPalette.rgb(team.color), 0.16 + min(0.14, Double(pts.count) * 0.035)))
        }
        let youState = chars.state("you", color: "#e8ebf4")
        let youFocused = focus.id == "you"
        ctx.opacity = youFocused ? 1 : envA
        let youRadius = youFocused ? youR * k + (focus.R - youR * k) * focus.t : youR * k
        let yr = OrbitCharacterRenderer.drawYou(&ctx, youState, x: you.x, y: you.y, R: youRadius, t: t, dt: dt, tints: tints, opt: .init(reduced: reduced))
        if !(youFocused && focus.t > 0.3) {
            ctx.draw(Text("You").font(.system(size: 11, weight: .semibold)).foregroundColor(ink), at: CGPoint(x: you.x, y: you.y + yr * 1.12 + 12), anchor: .center)
        }
        ctx.opacity = 1

        // characters
        var drawn: [(id: String, p: CGPoint, R: Double)] = []
        for bot in model.bots {
            guard let p = pos[bot.id], p.x > -60, p.x < W + 60, p.y > -60, p.y < H + 60 else { continue }
            let isFocus = focus.id == bot.id
            let base = ((homes[bot.id]?.chief ?? false) ? chiefR : memberR) * k
            let R = isFocus ? base + (focus.R - base) * focus.t : base
            let inChannel = focusChannel.flatMap { id in model.channels.first { $0.id == id } }?.memberIds.contains(bot.id) ?? false
            let A = isFocus ? 1 : inChannel ? max(envA, 0.9) : envA
            let s = chars.state(bot.id, color: bot.bot.color)
            chars.noteMessage(bot.id, messageId: bot.bot.messages?.last?.id, t: t)
            let mood = chars.displayMood(bot, t: t)
            OrbitCharacterRenderer.draw(&ctx, s, mood: mood, x: p.x, y: p.y, R: R, A: A, t: t, dt: dt, opt: .init(mini: R < 12, reduced: reduced))
            if !isFocus || focus.t < 0.3 { drawn.append((bot.id, p, R)) }
        }

        // streams: particles travelling along the line, flashing the target on arrival
        ctx.opacity = envA
        defer { ctx.opacity = 1 }
        for (index, stream) in chars.streams.enumerated() {
            let a = stream.from == "you" ? you : pos[stream.from]
            let b = stream.to == "you" ? you : pos[stream.to]
            guard let a, let b else { continue }
            let age = t - stream.start
            if reduced {
                if !stream.arrived { chars.markArrived(index); chars.state(stream.to, color: model.bot(stream.to)?.bot.color ?? "#e8ebf4").flash = t }
                continue
            }
            let dx = b.x - a.x, dy = b.y - a.y, len = max(1, hypot(dx, dy))
            let nx = -dy / len, ny = dx / len
            var landed = 0
            var dots = Path()
            for i in 0..<16 {
                let local = (age - Double(i) * 0.07) / 1.3
                if local >= 1 { landed += 1; continue }
                guard local > 0 else { continue }
                let e = 1 - pow(1 - local, 2)
                let wobble = sin(Double(i) * 1.7 + local * 6) * 5 * (1 - local)
                let x = a.x + dx * e + nx * wobble, y = a.y + dy * e + ny * wobble
                let r = 1.6 + (1 - local)
                dots.addEllipse(in: CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2))
            }
            ctx.fill(dots, with: .color(stream.rgb.color(0.9)))
            if !stream.arrived && (landed >= 9 || age > 3.2) {
                chars.markArrived(index)
                chars.state(stream.to, color: model.bot(stream.to)?.bot.color ?? "#e8ebf4").flash = t
            }
        }

        // names, placed clear of each other, characters and team labels
        func hitsOrb(_ r: CGRect, _ me: String) -> Bool {
            drawn.contains { o in
                guard o.id != me else { return false }
                let nx = max(r.minX, min(o.p.x, r.maxX)), ny = max(r.minY, min(o.p.y, r.maxY))
                return hypot(o.p.x - nx, o.p.y - ny) < o.R + 3
            }
        }
        func hitsLabel(_ r: CGRect) -> Bool { placed.contains { $0.intersects(r) } }
        for d in drawn {
            guard let bot = model.bot(d.id) else { continue }
            // a pinned bot's name carries a small pin, as on the desktop map
            let nameText = bot.pinned
                ? Text(Image(systemName: "pin.fill")).font(.system(size: 8, weight: .semibold)) + Text(verbatim: " " + bot.bot.name).font(.system(size: 11, weight: .semibold))
                : Text(verbatim: bot.bot.name).font(.system(size: 11, weight: .semibold))
            let text = ctx.resolve(nameText.foregroundColor(OrbitPalette.label(bot.bot.color)))
            let w = text.measure(in: CGSize(width: 300, height: 30)).width
            let x = d.p.x, y = d.p.y, R = d.R
            var ux = x - you.x, uy = y - you.y
            if let centre = centres[bot.teamKey], !bot.chief { let cp = S(centre); ux = x - cp.x; uy = y - cp.y }
            let L = hypot(ux, uy)
            if L < 1 || bot.chief { ux = 0; uy = 1 } else { ux /= L; uy /= L }
            var cands: [(anchor: UnitPoint, at: CGPoint, rect: CGRect)] = []
            func side(_ dx: Double) {
                if dx > 0 { cands.append((.leading, CGPoint(x: x + R + 6, y: y), CGRect(x: x + R + 6, y: y - 7, width: w, height: 14))) }
                else { cands.append((.trailing, CGPoint(x: x - R - 6, y: y), CGRect(x: x - R - 6 - w, y: y - 7, width: w, height: 14))) }
            }
            func below() { cands.append((.center, CGPoint(x: x, y: y + R + 10), CGRect(x: x - w / 2, y: y + R + 3, width: w, height: 14))) }
            func above() { cands.append((.center, CGPoint(x: x, y: y - R - 10), CGRect(x: x - w / 2, y: y - R - 17, width: w, height: 14))) }
            if abs(ux) > 0.5 { side(ux) } else if uy < 0 { above() } else { below() }
            below(); above(); side(1); side(-1)
            guard let ok = cands.first(where: { $0.rect.minX > 4 && $0.rect.maxX < W - 4 && !hitsOrb($0.rect, d.id) && !hitsLabel($0.rect) }) else { continue }
            placed.append(ok.rect)
            ctx.draw(text, at: ok.at, anchor: ok.anchor)
            if bot.unread && !bot.waiting {
                let dotX = ok.anchor == .trailing ? ok.rect.minX - 6 : ok.rect.maxX + 6
                ctx.fill(Path(ellipseIn: CGRect(x: dotX - 3, y: ok.at.y - 3, width: 6, height: 6)), with: .color(OrbitPalette.color(bot.bot.color)))
            }
        }
    }
}
