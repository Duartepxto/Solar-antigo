// A bot's computer, live.
//
// The harness already screenshots a working bot every few seconds and pushes
// the frame to any client that asked for it. This is that, and nothing more:
// no clicking, no typing, no control. Watching is the useful half on a phone
// — you want to know what it is doing, not to do it yourself on a screen the
// size of a playing card.
//
// Frames are expensive (hundreds of kilobytes of base64 each), so they are
// off unless this view is on screen. `watchScreen` reopens the stream asking
// for them and `stopWatchingScreen` reopens it asking not to; both resume
// from the cursor, so the reconnect costs nothing but a round trip.
import SwiftUI
import CompanionCore
// Unconditional for the same reason as ChatView: `UIImage` is used below
// without a guard, so a conditional import would only change which error a
// non-UIKit build fails with.
import UIKit

struct ComputerView: View {
    let bot: Bot
    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var dismiss
    @State private var confirmingDesktop = false
    @State private var openingDesktop = false
    @State private var desktopURL: URL?
    @State private var desktopError: String?

    private var frame: ScreenFrame? { session.state.screens[bot.id] }

    /// The bot as the stream last described it — `busy` is what tells us
    /// whether more frames are coming or this is the last one.
    private var current: Bot { session.state.bot(bot.id) ?? bot }

    /// The desktop the phone is controlling, in the panel's own place (not a
    /// sheet over the canvas).
    private var controlling: Bool { desktopURL != nil }

    var body: some View {
        if let desktopURL {
            VStack(spacing: 0) {
                HStack {
                    OrbitKicker("Live cloud desktop")
                    Spacer()
                    OrbitPanelButton(title: "Hand back") { self.desktopURL = nil }
                }
                .padding(.horizontal, 18).padding(.vertical, 10)
                CloudDesktopBrowser(url: desktopURL)
            }
            .onDisappear { session.stopWatchingScreen(of: bot.id) }
        } else {
            OrbitSystemSheet(icon: "display", kicker: "Computer", title: computerName, tint: OrbitPalette.label(bot.color),
                             description: "The computer this bot works on. Its screen is captured while it's working.") {
                screen
                HStack(spacing: 7) {
                    Circle().fill(current.busy == true ? Orbit.success : Orbit.ink40).frame(width: 7, height: 7)
                    Text(current.busy == true ? "Live, a few seconds behind" : "Idle: the last picture it took")
                        .font(.system(size: 13)).foregroundStyle(Orbit.ink60)
                }
                // A VPS-backed bot is "cloud" too, but the server refuses to
                // mint an interactive desktop for it. Minting a desktop session
                // is admin-only on a server, too.
                if current.computer == "cloud" && current.cloudBackend != "vps" && session.canAdminister {
                    if confirmingDesktop {
                        OrbitInlineConfirm(question: Text("Open live cloud desktop?"),
                                           detail: Text("This gives this device full control of the cloud computer, including anything signed in inside it."),
                                           confirm: "Open desktop") {
                            confirmingDesktop = false
                            Task { await openDesktop() }
                        } onCancel: { confirmingDesktop = false }
                    } else {
                        Button {
                            confirmingDesktop = true
                        } label: {
                            if openingDesktop { ProgressView().tint(Color(hex: "#070707")) } else { Text("Open live cloud desktop") }
                        }
                        .buttonStyle(OrbitPrimaryButtonStyle())
                        .frame(maxWidth: .infinity)
                        .disabled(openingDesktop)
                        Text("An interactive VNC session. Access must be enabled for this device in the Mac's Phone settings.")
                            .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    }
                    if let desktopError { OrbitSheetError(message: desktopError) }
                }
            }
            .onAppear { session.watchScreen(of: bot.id) }
            .onDisappear { if !controlling { session.stopWatchingScreen(of: bot.id) } }
        }
    }

    private var computerName: String {
        switch current.computer ?? "" {
        case "cloud": current.cloudBackend == "vps" ? String(localized: "Your server") : String(localized: "Cloud desktop")
        case "vm", "local-vm", "box": String(localized: "Local VM")
        case "host", "local", "mac": String(localized: "This computer")
        case "browser": String(localized: "Browser only")
        case "none", "off": String(localized: "No computer")
        default: String(localized: "This computer")
        }
    }

    /// The bot's screen, as a picture in a frame.
    private var screen: some View {
        ZStack {
            RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Color.black)
            if let image = frame.flatMap(\.data).flatMap(UIImage.init(data:)) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .accessibilityLabel("\(current.name)'s computer")
            } else {
                waiting.padding(.vertical, 30)
            }
        }
        .aspectRatio(16 / 10, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(Orbit.hairline))
    }

    private var waiting: some View {
        VStack(spacing: 12) {
            if current.busy == true { ProgressView().tint(.white) }
            else { Image(systemName: "moon.zzz").font(.system(size: 20)).foregroundStyle(Color.white.opacity(0.4)) }
            Text(current.busy == true ? "Waiting for a frame…" : "Nothing to show yet")
                .font(.system(size: 15))
                .foregroundStyle(Color.white.opacity(0.7))
            // An idle bot is not being screenshotted at all, so this would
            // otherwise be an indefinite spinner with no explanation.
            if current.busy != true {
                Text("This bot's computer is only captured while it is working.")
                    .font(.system(size: 13))
                    .foregroundStyle(Color.white.opacity(0.45))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
        }
    }

    @MainActor
    private func openDesktop() async {
        openingDesktop = true
        desktopError = nil
        defer { openingDesktop = false }
        do {
            desktopURL = try await session.cloudDesktop(for: current)
        } catch {
            desktopError = error.localizedDescription
        }
    }
}
