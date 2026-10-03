// The particle-orb character: every place a bot appears on the phone draws
// this one — the map, the bot screen, pills, rows, the Live Activity.
//
// A port of the desktop's src/orbit/characters.ts (drawChar, drawFace,
// drawYou). Same sphere, same moods, same numbers, so a bot looks the same
// on the phone as on the laptop. PRODUCT.md: one character per bot, never
// the old mascot.
import SwiftUI

// MARK: - Colour

struct OrbitRGB: Hashable {
    var r: Double, g: Double, b: Double

    init(r: Double, g: Double, b: Double) { self.r = r; self.g = g; self.b = b }

    init(hex: String) {
        var value: UInt64 = 0
        Scanner(string: hex.replacingOccurrences(of: "#", with: "")).scanHexInt64(&value)
        r = Double((value >> 16) & 0xFF)
        g = Double((value >> 8) & 0xFF)
        b = Double(value & 0xFF)
    }

    static let amber = OrbitRGB(r: 255, g: 152, b: 0)
    static let red = OrbitRGB(r: 255, g: 86, b: 103)
    static let pearl = OrbitRGB(r: 232, g: 235, b: 244)

    func mix(_ o: OrbitRGB, _ k: Double) -> OrbitRGB {
        OrbitRGB(r: r + (o.r - r) * k, g: g + (o.g - g) * k, b: b + (o.b - b) * k)
    }

    /// Toward white by `k` (the desktop's `v + (255 - v) * k`).
    func lifted(_ k: Double) -> OrbitRGB { mix(OrbitRGB(r: 255, g: 255, b: 255), k) }

    func color(_ alpha: Double = 1) -> Color {
        Color(.sRGB, red: r / 255, green: g / 255, blue: b / 255, opacity: max(0, min(1, alpha)))
    }
}

/// The bot colours, the desktop's `MAUS_COLORS` (src/lib/mascot.ts), by the
/// name the server stores.
enum OrbitPalette {
    static let hex: [String: String] = [
        "green": "#009957",
        "blue": "#377FE6",
        "red": "#D94B52",
        "orange": "#E78531",
        "purple": "#8057C8",
        "cyan": "#0EA5C6",
        "pink": "#D84F8B",
        "yellow": "#D8A729",
        "teal": "#01A492",
        "coral": "#E5634E",
    ]

    static func hexString(_ name: String) -> String {
        if name.hasPrefix("#") { return name }
        return hex[name] ?? hex["blue"]!
    }

    static func rgb(_ name: String) -> OrbitRGB { OrbitRGB(hex: hexString(name)) }

    static func color(_ name: String) -> Color { Color(hex: hexString(name)) }

    /// A bot's name on the dark canvas: its colour lifted toward white so it
    /// reads on near-black.
    static func label(_ name: String) -> Color { rgb(name).lifted(0.3).color() }
}

extension Color {
    init(hex: String) {
        let rgb = OrbitRGB(hex: hex)
        self.init(.sRGB, red: rgb.r / 255, green: rgb.g / 255, blue: rgb.b / 255, opacity: 1)
    }
}

// MARK: - Mood

/// What a character's face and motion say. The desktop's `Mood`.
enum OrbitMood: String, CaseIterable, Codable {
    case idle, focused, thinking, pleading, sending, surprised, happy, talking, stalled, sleepy

    /// An idle bot dozes off after this long with nothing new, as the
    /// prototype's characters do (src/orbit/model.ts SLEEP_AFTER_MS).
    static let sleepAfterMs: Double = 30 * 60 * 1000

    /// Moods whose motion carries information; a resting list row can stay still.
    var showsActivity: Bool {
        switch self {
        case .focused, .thinking, .pleading, .talking, .stalled: true
        default: false
        }
    }

    fileprivate var spin: Double {
        switch self {
        case .focused: 1.5
        case .thinking: 1.1
        case .pleading: 0.2
        case .stalled: 0.05
        case .sleepy: 0.12
        default: 0.32
        }
    }
}

// MARK: - Per-character state

/// Animation state one drawn character owns (the desktop's `CharState`).
final class OrbitCharState {
    var rot: Double
    let seed: Double
    var rgb: OrbitRGB
    var gx = 0.0, gy = 0.0
    var blink: Double
    /// time a message last reached it: spin boost and a ring
    var flash = -9.0
    /// time it last sent something: a squash
    var kick = -9.0
    var lastT: Double?

    init(rgb: OrbitRGB, seed: Double, now: Double = 0) {
        self.rgb = rgb
        self.seed = seed
        var g = OrbitRandom(seed: UInt64(abs(seed * 10_000)) + 7)
        rot = g.next() * 6
        blink = now + 1 + g.next() * 3
    }

    /// Seconds since the last draw, capped so a paused view doesn't jump.
    func step(_ t: Double) -> Double {
        defer { lastT = t }
        guard let last = lastT else { return 0 }
        return max(0, min(0.1, t - last))
    }
}

/// A stable seed for a bot, from its id.
func orbitSeed(_ id: String) -> Double {
    var h: UInt64 = 5381
    for byte in id.utf8 { h = (h &* 33) ^ UInt64(byte) }
    return Double(h % 10_000) / 10_000 * 6.283 + 0.3
}

struct OrbitRandom {
    private var state: UInt64
    init(seed: UInt64) { state = seed &+ 0x9E37_79B9_7F4A_7C15 }
    mutating func next() -> Double {
        state = state &* 6_364_136_223_846_793_005 &+ 1_442_695_040_888_963_407
        return Double(state >> 11) / Double(1 << 53)
    }
}

// MARK: - Renderer

struct OrbitDrawOptions {
    var big = false
    /// small faces: fewest points, no ring, no extras
    var mini = false
    var noRing = false
    var quality = 1.0
    var reduced = false
    /// how open the mouth is while talking (0...1)
    var voice: Double?
    /// the halo stops at the edge of the view, so it never shows its square
    var maxHalo: Double?
}

enum OrbitCharacterRenderer {
    /// Fibonacci points on a unit sphere, plus a jitter seed (x, y, z, j).
    private static func sphere(_ n: Int) -> [SIMD4<Double>] {
        var g = OrbitRandom(seed: UInt64(n))
        return (0..<n).map { i in
            let th = acos(1 - 2 * (Double(i) + 0.5) / Double(n))
            let ph = Double(i) * 2.39996
            return SIMD4(sin(th) * cos(ph), cos(th), sin(th) * sin(ph), g.next())
        }
    }

    private static let lod: [[SIMD4<Double>]] = [sphere(56), sphere(100), sphere(180), sphere(420)]
    private static let band: [Double] = (0..<44).map { Double($0) / 44 * .pi * 2 }
    private static let bands = 5

    /// A radial glow: opaque-ish centre fading out, the desktop's sprite.
    static func glow(_ ctx: inout GraphicsContext, rgb: OrbitRGB?, x: Double, y: Double, r: Double, alpha: Double) {
        guard alpha > 0.004, r >= 1 else { return }
        let rect = CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2)
        let stops: [Gradient.Stop]
        if let rgb {
            stops = [.init(color: rgb.color(alpha), location: 0), .init(color: rgb.color(alpha), location: 0.12), .init(color: rgb.color(0), location: 1)]
        } else {
            let core = OrbitRGB(r: 10, g: 10, b: 12)
            stops = [.init(color: core.color(0.78 * alpha), location: 0), .init(color: core.color(0.45 * alpha), location: 0.7), .init(color: core.color(0), location: 1)]
        }
        ctx.fill(Path(ellipseIn: rect), with: .radialGradient(Gradient(stops: stops), center: CGPoint(x: x, y: y), startRadius: 0, endRadius: r))
    }

    /// Draws one character and returns its rendered radius.
    @discardableResult
    static func draw(_ ctx: inout GraphicsContext, _ s: OrbitCharState, mood: OrbitMood, x: Double, y: Double, R: Double, A: Double = 1, t: Double, dt: Double, opt: OrbitDrawOptions = .init()) -> Double {
        let big = opt.big, mini = opt.mini, reduced = opt.reduced
        if !mini && !reduced {
            let boost = t >= s.flash && t - s.flash < 0.9 ? 4 * (1 - (t - s.flash) / 0.9) : 0
            s.rot += (mood.spin + boost) * dt
        } else if !reduced {
            s.rot += mood.spin * dt
        }
        let kick = !reduced && t - s.kick < 0.5 ? 1 - 0.12 * sin((t - s.kick) / 0.5 * .pi) : 1
        let breath = reduced ? 0 : mood == .sleepy ? 0.04 * sin(t * 1.2 + s.seed) : 0.025 * sin(t * 1.6 + s.seed)
        let Rr = R * kick * (1 + breath + (mood == .focused && !reduced ? 0.03 * sin(t * 6 + s.seed) : 0))
        var rgb = s.rgb
        if mood == .pleading { rgb = rgb.mix(.amber, 0.3 + 0.25 * sin(t * 5)) }
        if mood == .stalled { rgb = rgb.mix(.red, 0.75) }
        let hr = min(Rr * (big ? 2.5 : 1.8), opt.maxHalo ?? .infinity)
        glow(&ctx, rgb: s.rgb, x: x, y: y, r: hr, alpha: (big ? 0.22 : 0.16) * A)
        if mood == .pleading { glow(&ctx, rgb: .amber, x: x, y: y, r: hr, alpha: 0.14 * A * (0.5 + 0.5 * sin(t * 5))) }
        if mood == .stalled { glow(&ctx, rgb: .red, x: x, y: y, r: hr, alpha: 0.16 * A) }

        let eq = Rr * opt.quality
        let pts = mini || eq < 12 ? lod[0] : eq < 22 ? lod[1] : eq < 42 ? lod[2] : lod[3]
        let ca = cos(s.rot), sa = sin(s.rot), c2 = cos(0.35), s2 = sin(0.35)
        let szk = min(2.3, max(mini ? 0.55 : 0.7, Rr / 23))
        let fl = t >= s.flash && t - s.flash < 0.6 ? (1 - (t - s.flash) / 0.6) * 0.35 : 0
        let jit = mood == .focused && !reduced, stl = mood == .stalled
        let cols: [OrbitRGB] = (0..<bands).map { rgb.lifted((Double($0) + 0.5) / Double(bands) * 0.5) }

        func pass(front: Bool) {
            var paths = Array(repeating: Path(), count: bands)
            for p in pts {
                let px = p.x * ca + p.z * sa, pz = -p.x * sa + p.z * ca
                let yy = p.y * c2 - pz * s2, zz = p.y * s2 + pz * c2
                if (zz > 0) != front { continue }
                let jr = stl ? (p.w - 0.5) * 0.28 : (jit ? sin(t * 3 + p.w * 20) * 0.03 : 0) + fl * p.w
                let d = (zz + 1) / 2, sz = (0.8 + d * 1.2) * szk
                let bi = min(bands - 1, Int(d * Double(bands)))
                paths[bi].addRect(CGRect(x: x + px * Rr * (1 + jr) - sz / 2, y: y + yy * Rr * (1 + jr) - sz / 2, width: sz, height: sz))
            }
            for bi in 0..<bands {
                let d = (Double(bi) + 0.5) / Double(bands)
                ctx.fill(paths[bi], with: .color(cols[bi].color((0.22 + d * 0.78) * (front ? 0.5 : 1) * A)))
            }
        }
        pass(front: false)
        glow(&ctx, rgb: nil, x: x, y: y, r: Rr * 0.95, alpha: A)
        pass(front: true)
        drawFace(&ctx, s, mood: mood, x: x, y: y, R: Rr, A: A, t: t, voice: opt.voice)

        let ink = OrbitRGB(r: 252, g: 252, b: 252)
        if !mini && (mood == .focused || mood == .thinking) {
            var p = Path()
            for a0 in band {
                let a = a0 + (reduced ? 0 : t * (mood == .thinking ? 1.2 : 2.3))
                let bx = cos(a) * Rr * 1.38, bz = sin(a), by = bz * Rr * 0.3
                let sz = (0.9 + (bz + 1) * 0.6) * szk * 0.75
                p.addRect(CGRect(x: x + bx - sz / 2, y: y + by + Rr * 0.55 - sz / 2, width: sz, height: sz))
            }
            ctx.fill(p, with: .color(rgb.lifted(0.4).color(0.62 * A)))
        }
        if !mini && !opt.noRing && t >= s.flash && t - s.flash < 0.8 {
            let u = (t - s.flash) / 0.8, rr = Rr * (1.1 + u * 1.4)
            ctx.stroke(Path(ellipseIn: CGRect(x: x - rr, y: y - rr, width: rr * 2, height: rr * 2)), with: .color(s.rgb.color((1 - u) * A)), lineWidth: 2)
        }
        if mood == .pleading || mood == .stalled {
            let ph = reduced ? 0.4 : (t * 0.9).truncatingRemainder(dividingBy: 1)
            let rr = Rr * (1.15 + ph * (mini ? 0.25 : 0.8))
            let c = mood == .stalled ? OrbitRGB.red : OrbitRGB.amber
            ctx.stroke(Path(ellipseIn: CGRect(x: x - rr, y: y - rr, width: rr * 2, height: rr * 2)), with: .color(c.color(0.55 * (1 - ph) * A)), lineWidth: mini ? 1 : 1.2)
        }
        if !mini && mood == .sleepy {
            let u = reduced ? 0.3 : (t * 0.4 + s.seed).truncatingRemainder(dividingBy: 1)
            let text = Text(verbatim: "z").font(.system(size: max(8, Rr * 0.35), weight: .semibold)).foregroundColor(ink.color(A * 0.6 * (1 - u)))
            ctx.draw(text, at: CGPoint(x: x + Rr * (0.7 + u * 0.4), y: y - Rr * (0.7 + u * 0.8)), anchor: .bottomLeading)
        }
        if !mini && mood == .thinking {
            for i in 0..<3 {
                let u = reduced ? 0.5 : (t * 1.5 + Double(i) * 0.33).truncatingRemainder(dividingBy: 1)
                let r = max(1.2, Rr * 0.06), cx = x + Rr * (0.55 + Double(i) * 0.28), cy = y - Rr * (1.15 + Double(i) * 0.12)
                ctx.fill(Path(ellipseIn: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2)), with: .color(ink.color(A * (0.3 + 0.7 * sin(u * .pi)))))
            }
        }
        return Rr
    }

    private static func drawFace(_ ctx: inout GraphicsContext, _ s: OrbitCharState, mood: OrbitMood, x: Double, y: Double, R: Double, A: Double, t: Double, voice: Double?) {
        let gx = s.gx * R * 0.12, gy = s.gy * R * 0.09, ex = R * 0.3, ey = -R * 0.06 + gy, w = R * 0.15
        let h = R * 0.24
        let blinking = mood == .idle && t > s.blink - 0.13
        let col = s.rgb.lifted(0.85).color(A)
        let lw = max(1.2, R * 0.075)
        let style = StrokeStyle(lineWidth: lw, lineCap: .round)
        if R > 9 { glow(&ctx, rgb: s.rgb, x: x, y: y + ey, r: R * 0.6, alpha: 0.32 * A) }

        func eye(_ sx: Double, _ hh: Double, _ ww: Double) {
            let hh = max(0.6, hh)
            ctx.fill(Path(ellipseIn: CGRect(x: x + sx + gx - ww, y: y + ey - hh, width: ww * 2, height: hh * 2)), with: .color(col))
        }
        func arcPath(cx: Double, cy: Double, r: Double, from: Double, to: Double) -> Path {
            var p = Path()
            p.addArc(center: CGPoint(x: cx, y: cy), radius: r, startAngle: .radians(from), endAngle: .radians(to), clockwise: false)
            return p
        }
        func happyEye(_ sx: Double) {
            ctx.stroke(arcPath(cx: x + sx + gx, cy: y + ey + R * 0.04, r: w * 1.05, from: .pi * 1.1, to: .pi * 1.9), with: .color(col), style: style)
        }
        enum Mouth { case smile, big, flat, o, wobble, talk, frown }
        func mouth(_ kind: Mouth) {
            let mx = x + gx * 0.8, my = y + R * 0.3 + gy * 0.6
            var p = Path()
            var filled = false
            switch kind {
            case .smile: p = arcPath(cx: mx, cy: my - R * 0.1, r: R * 0.16, from: .pi * 0.2, to: .pi * 0.8)
            case .big: p = arcPath(cx: mx, cy: my - R * 0.14, r: R * 0.22, from: .pi * 0.12, to: .pi * 0.88)
            case .flat: p.move(to: CGPoint(x: mx - R * 0.1, y: my)); p.addLine(to: CGPoint(x: mx + R * 0.1, y: my))
            case .o: p = Path(ellipseIn: CGRect(x: mx - R * 0.07, y: my - R * 0.09, width: R * 0.14, height: R * 0.18)); filled = true
            case .wobble:
                p.move(to: CGPoint(x: mx - R * 0.14, y: my + R * 0.02))
                p.addQuadCurve(to: CGPoint(x: mx, y: my + R * 0.01), control: CGPoint(x: mx - R * 0.07, y: my - R * 0.05))
                p.addQuadCurve(to: CGPoint(x: mx + R * 0.14, y: my - R * 0.01), control: CGPoint(x: mx + R * 0.07, y: my + R * 0.06))
            case .talk:
                let open = R * (0.02 + 0.07 * (voice ?? abs(sin(t * 11))))
                p = Path(ellipseIn: CGRect(x: mx - R * 0.09, y: my - open, width: R * 0.18, height: open * 2)); filled = true
            case .frown: p = arcPath(cx: mx, cy: my + R * 0.12, r: R * 0.14, from: .pi * 1.2, to: .pi * 1.8)
            }
            if filled { ctx.fill(p, with: .color(col)) } else { ctx.stroke(p, with: .color(col), style: style) }
        }

        switch mood {
        case .happy, .sending:
            happyEye(-ex); happyEye(ex); mouth(mood == .happy ? .big : .smile)
        case .focused:
            eye(-ex, h * 0.55, w); eye(ex, h * 0.55, w); mouth(.flat)
        case .thinking:
            eye(-ex, h * 0.8, w * 0.95); eye(ex, h * 0.8, w * 0.95); mouth(.o)
        case .pleading:
            eye(-ex, h * 1.18, w * 1.2); eye(ex, h * 1.18, w * 1.2)
            for sx in [-ex, ex] {
                let r = w * 0.32, cx = x + sx + gx + w * 0.35, cy = y + ey - h * 0.35
                ctx.fill(Path(ellipseIn: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2)), with: .color(OrbitRGB(r: 10, g: 10, b: 12).color(0.85 * A)))
            }
            var brows = Path()
            brows.move(to: CGPoint(x: x - ex - w * 1.2 + gx, y: y + ey - h * 1.55))
            brows.addLine(to: CGPoint(x: x - ex + w * 0.8 + gx, y: y + ey - h * 1.95))
            brows.move(to: CGPoint(x: x + ex + w * 1.2 + gx, y: y + ey - h * 1.55))
            brows.addLine(to: CGPoint(x: x + ex - w * 0.8 + gx, y: y + ey - h * 1.95))
            ctx.stroke(brows, with: .color(col), style: style)
            mouth(.wobble)
        case .surprised:
            eye(-ex, w * 1.25, w * 1.25); eye(ex, w * 1.25, w * 1.25); mouth(.o)
        case .talking:
            eye(-ex, h, w); eye(ex, h, w); mouth(.talk)
        case .stalled:
            var p = Path()
            for sx in [-ex, ex] {
                let cx = x + sx, cy = y + ey, k = w * 0.95
                p.move(to: CGPoint(x: cx - k, y: cy - k)); p.addLine(to: CGPoint(x: cx + k, y: cy + k))
                p.move(to: CGPoint(x: cx + k, y: cy - k)); p.addLine(to: CGPoint(x: cx - k, y: cy + k))
            }
            ctx.stroke(p, with: .color(col), style: style)
            mouth(.frown)
        case .sleepy:
            var p = Path()
            for sx in [-ex, ex] {
                p.move(to: CGPoint(x: x + sx - w, y: y + ey + R * 0.02)); p.addLine(to: CGPoint(x: x + sx + w, y: y + ey + R * 0.02))
            }
            ctx.stroke(p, with: .color(col), style: style)
            mouth(.flat)
        case .idle:
            eye(-ex, blinking ? R * 0.02 : h, w); eye(ex, blinking ? R * 0.02 : h, w); mouth(.smile)
        }
        if t > s.blink {
            var g = OrbitRandom(seed: UInt64(t * 1000))
            s.blink = t + 2.8 + g.next() * 2.7
        }
    }

    /// The You character: a pearl orb whose surface picks up each team's
    /// colour on the side facing that team.
    @discardableResult
    static func drawYou(_ ctx: inout GraphicsContext, _ s: OrbitCharState, x: Double, y: Double, R: Double, A: Double = 1, t: Double, dt: Double, tints: [(a: Double, rgb: OrbitRGB, w: Double)], mood: OrbitMood = .idle, opt: OrbitDrawOptions = .init()) -> Double {
        var o = opt
        o.noRing = false
        let Rr = draw(&ctx, s, mood: mood, x: x, y: y, R: R, A: A, t: t, dt: dt, opt: o)
        ctx.drawLayer { layer in
            layer.blendMode = .plusLighter
            for tn in tints {
                glow(&layer, rgb: tn.rgb, x: x + cos(tn.a) * Rr * 0.62, y: y + sin(tn.a) * Rr * 0.62, r: Rr * 0.95, alpha: tn.w * A)
            }
        }
        return Rr
    }
}

// MARK: - Views

/// A bot's character at any size, alive. The same drawing as the map.
struct OrbitCharacter: View {
    /// The bot's colour: a palette name ("coral") or a hex string.
    let color: String
    var mood: OrbitMood = .idle
    var size: CGFloat = 32
    /// A stable seed (use `orbitSeed(bot.id)`), so its spin and blink are its own.
    var seed: Double = 0.3
    /// false draws one still frame (a widget, a very long list).
    var animated = true
    /// Big faces (a bot's header) get the wider halo and the densest sphere.
    var big = false
    /// 0...1 extra scale, for a pop-in.
    var scale: CGFloat = 1
    /// Draw You rather than a bot.
    var isYou = false
    var tints: [(a: Double, rgb: OrbitRGB, w: Double)] = []
    /// Bump to flash the ring and spin (a message just reached it).
    var flash: Int = 0

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.scenePhase) private var scenePhase
    @State private var holder = OrbitCharHolder()

    var body: some View {
        let live = animated && !reduceMotion && scenePhase == .active
        TimelineView(.animation(minimumInterval: 1.0 / 30.0, paused: !live)) { timeline in
            Canvas { ctx, sz in
                let s = current()
                let t = timeline.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 100_000)
                let dt = live ? s.step(t) : 0
                let side = Double(min(sz.width, sz.height))
                let R = side * (big ? 0.3 : 0.34) * Double(scale)
                let opt = OrbitDrawOptions(big: big, mini: side < 40, reduced: !live, maxHalo: side / 2)
                if isYou {
                    OrbitCharacterRenderer.drawYou(&ctx, s, x: sz.width / 2, y: sz.height / 2, R: R, t: t, dt: dt, tints: tints, mood: mood, opt: opt)
                } else {
                    OrbitCharacterRenderer.draw(&ctx, s, mood: mood, x: sz.width / 2, y: sz.height / 2, R: R, t: t, dt: dt, opt: opt)
                }
            }
        }
        .frame(width: size, height: size)
        .characterChange(of: flash) { _ in
            let s = current()
            s.flash = Date().timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 100_000)
        }
        .characterChange(of: color) { value in current().rgb = OrbitPalette.rgb(isYou ? "#e8ebf4" : value) }
        .accessibilityHidden(true)
    }

    private func current() -> OrbitCharState {
        if let state = holder.state { return state }
        let made = OrbitCharState(rgb: isYou ? .pearl : OrbitPalette.rgb(color), seed: seed)
        holder.state = made
        return made
    }
}

/// Keeps a character's animation state across renders without publishing.
final class OrbitCharHolder {
    var state: OrbitCharState?
}

// The widget extension compiles this file without the app's BackDeployCompat
// shims, so the one onChange it needs is bridged here.
private extension View {
    @ViewBuilder
    func characterChange<V: Equatable>(of value: V, perform action: @escaping (V) -> Void) -> some View {
        if #available(iOS 17.0, *) {
            onChange(of: value) { _, newValue in action(newValue) }
        } else {
            onChange(of: value) { newValue in action(newValue) }
        }
    }
}
