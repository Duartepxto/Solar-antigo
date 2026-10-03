// Before the map: welcome, not paired yet, and the notifications prompt.
// Each is an Orbit stage (You on the canvas, a line, one white pill).
import SwiftUI

struct CompanionWelcomeView: View {
    let onConnect: () -> Void
    let onSkip: () -> Void

    var body: some View {
        OrbitStage(kicker: "Orbit", title: Text("Your team, in your pocket"),
                   detail: Text("Talk to your bots, answer them and send new work from this phone. Everything runs on your computer.")) {
            VStack(alignment: .leading, spacing: 18) {
                OrbitStageRow(icon: "bubble.left.and.bubble.right", title: "The same chats",
                              detail: "Pick up the conversations you started on your computer.")
                OrbitStageRow(icon: "hand.raised", title: "Answer when a bot needs you",
                              detail: "Approvals and questions reach you here, away from your desk.")
                OrbitStageRow(icon: "lock.shield", title: "Only your computer",
                              detail: "This phone talks to the one computer you pair it with.")
            }
        } actions: {
            Button(action: onConnect) { Text("Connect my computer").frame(maxWidth: .infinity) }
                .buttonStyle(OrbitPrimaryButtonStyle())
            OrbitQuietButton(title: "Not now", action: onSkip)
        }
    }
}

struct UnpairedHomeView: View {
    let onConnect: () -> Void

    var body: some View {
        OrbitStage(mood: .sleepy, title: Text("Connect when you're ready"),
                   detail: Text("Pair this phone with Orbit on your computer to see your team and talk to it.")) {
            Text("On your computer: Orbit → You → Phone.")
                .font(.system(size: 13))
                .foregroundStyle(Orbit.ink50)
                .multilineTextAlignment(.center)
        } actions: {
            Button(action: onConnect) { Text("Connect computer").frame(maxWidth: .infinity) }
                .buttonStyle(OrbitPrimaryButtonStyle())
        }
    }
}

struct NotificationOnboardingView: View {
    @EnvironmentObject private var session: Session
    @State private var enabling = false
    let onContinue: () -> Void

    var body: some View {
        OrbitStage(kicker: "Notifications", title: Text("Know when a bot needs you"),
                   detail: Text("Alerts arrive while Orbit is open or was recently in the background. They stop once iOS closes the app."),
                   symbol: "bell.badge", symbolTint: Orbit.amberText) {
            VStack(alignment: .leading, spacing: 18) {
                OrbitStageRow(icon: "hand.raised", title: "Approvals waiting for you", detail: "Answer them from the alert or the map.")
                OrbitStageRow(icon: "checkmark.circle", title: "Finished work", detail: "When a bot is done, and anything important.")
            }
        } actions: {
            Button {
                enabling = true
                Task {
                    await session.enableNotifications()
                    enabling = false
                    onContinue()
                }
            } label: {
                HStack(spacing: 8) {
                    if enabling { ProgressView().tint(Color(hex: "#070707")) }
                    Text("Turn on notifications")
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(OrbitPrimaryButtonStyle())
            .disabled(enabling)
            OrbitQuietButton(title: "Not now", action: onContinue)
                .disabled(enabling)
        }
    }
}
