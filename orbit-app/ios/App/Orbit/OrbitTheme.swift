// Orbit's look on the phone: the tokens the prototype uses, in one place.
//
// Orbit is dark. The prototype's values (design_handoff_orbit, phone) are
// kept as they are so a screen can be checked against it number for number.
import SwiftUI

enum Orbit {
    /// The map and the bot screen behind its sheet.
    static let canvas = Color(hex: "#050506")
    /// A sheet on the canvas: the chat, Waiting on you.
    static let panel = Color(hex: "#111113")
    /// A system in the column: the canvas itself, as on the desktop, where
    /// the column has no surface of its own and the map fades behind it.
    static let sheet = canvas
    /// Menus and popovers: solid, never see-through.
    static let raised = Color(hex: "#1c1c1f")
    /// Search, and screens that are not the map.
    static let screen = Color(hex: "#0c0c0e")

    static let ink = Color(hex: "#fcfcfc")
    static let ink90 = ink.opacity(0.9)
    static let ink80 = ink.opacity(0.8)
    static let ink70 = ink.opacity(0.7)
    static let ink60 = ink.opacity(0.6)
    static let ink55 = ink.opacity(0.55)
    static let ink50 = ink.opacity(0.5)
    static let ink40 = ink.opacity(0.4)

    /// Row-level fills inside a surface.
    static let fill04 = Color.white.opacity(0.04)
    static let fill06 = Color.white.opacity(0.06)
    static let fill08 = Color.white.opacity(0.08)
    static let fill10 = Color.white.opacity(0.10)
    static let hairline = Color.white.opacity(0.08)
    static let border = Color.white.opacity(0.12)
    static let borderStrong = Color.white.opacity(0.16)

    /// Floating pills on the map.
    static let pill = Color(red: 38 / 255, green: 38 / 255, blue: 42 / 255).opacity(0.88)
    /// The composer.
    static let composer = Color(red: 47 / 255, green: 47 / 255, blue: 47 / 255).opacity(0.92)

    static let link = Color(hex: "#7fc0ff")
    static let accent = Color(hex: "#1084fe")
    static let amber = Color(hex: "#ff9800")
    static let amberText = Color(hex: "#ff9a4d")
    static let success = Color(hex: "#38d591")
    static let dangerText = Color(hex: "#ff8a96")
    static let danger = Color(hex: "#ff5667")

    /// Card corners.
    static let cardRadius: CGFloat = 14
    static let sheetRadius: CGFloat = 24

    /// Section kickers: mono, small, letter-spaced.
    static func kicker(_ size: CGFloat = 10) -> Font { .system(size: size, weight: .medium, design: .monospaced) }
}

extension View {
    /// A floating Orbit pill: solid-ish fill, hairline border.
    func orbitPill(height: CGFloat? = nil) -> some View {
        self
            .frame(height: height)
            .background(Capsule().fill(Orbit.pill))
            .overlay(Capsule().strokeBorder(Orbit.hairline))
    }

    /// A sheet on the canvas: rounded top, panel fill, hairline on top.
    func orbitSheetBackground(_ fill: Color = Orbit.panel) -> some View {
        self.background(
            UnevenRoundedRectangle(topLeadingRadius: Orbit.sheetRadius, topTrailingRadius: Orbit.sheetRadius)
                .fill(fill)
                .overlay(
                    UnevenRoundedRectangle(topLeadingRadius: Orbit.sheetRadius, topTrailingRadius: Orbit.sheetRadius)
                        .strokeBorder(Orbit.hairline, lineWidth: 1)
                        .mask(VStack(spacing: 0) { Rectangle().frame(height: 30); Spacer(minLength: 0) })
                )
                .ignoresSafeArea(edges: .bottom)
        )
    }
}

/// The grabber at the top of an Orbit sheet.
struct OrbitGrabber: View {
    var body: some View {
        Capsule().fill(Color.white.opacity(0.2)).frame(width: 36, height: 5)
    }
}

/// A mono, letter-spaced section label.
struct OrbitKicker: View {
    let text: Text
    var size: CGFloat = 10
    init(_ key: LocalizedStringKey, size: CGFloat = 10) { text = Text(key); self.size = size }
    init(verbatim: String, size: CGFloat = 10) { text = Text(verbatim: verbatim); self.size = size }
    var body: some View {
        text.textCase(.uppercase)
            .font(Orbit.kicker(size))
            .tracking(size * 0.1)
            .foregroundStyle(Orbit.ink50)
    }
}

extension View {
    /// A system List or Form on Orbit's sheet colour, rows on its raised one.
    func orbitForm() -> some View {
        self
            .scrollContentBackground(.hidden)
            .background(Orbit.sheet.ignoresSafeArea())
            .tint(Orbit.link)
    }
}

/// The one filled button: white on the dark canvas, like the prototype's
/// send and "Save securely".
struct OrbitPrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundStyle(Color(hex: "#070707"))
            .padding(.horizontal, 20)
            .frame(minHeight: 50)
            .background(Capsule().fill(Orbit.ink.opacity(isEnabled ? (configuration.isPressed ? 0.8 : 1) : 0.35)))
            .contentShape(Capsule())
    }
}
