// Waiting on you: every approval, question and key request, one card each,
// answerable right here. Design: phone prototype, screen 03.
//
// The cards are the chat's own cards (CardView, QuestionCardView,
// CredentialRequestCardView), so an answer here is the same answer as in the
// chat — same options, same always-allow rule, same encrypted key path.
import SwiftUI
import CompanionCore

struct WaitingView: View {
    let open: (Chat) -> Void
    @EnvironmentObject private var session: Session
    @Environment(\.orbitClose) private var orbitClose
    @Environment(\.dismiss) private var systemDismiss

    private struct Entry: Identifiable {
        let id: String
        let chat: Chat
        let message: Message?
        let line: String
    }

    private var entries: [Entry] {
        var out: [Entry] = []
        var seen = Set<String>()
        for pending in session.state.pendingApprovals {
            guard let chat = session.state.chat(forThread: pending.threadId) else { continue }
            let key = "\(pending.threadId):\(pending.message.id)"
            guard seen.insert(key).inserted else { continue }
            out.append(Entry(id: key, chat: chat, message: pending.message, line: ""))
        }
        // A thread the computer says is waiting, with no card on the phone yet
        for update in session.state.updates where update.kind == .needsYou && update.card == nil {
            guard !out.contains(where: { $0.chat.threadId == update.chat.threadId }) else { continue }
            out.append(Entry(id: "wait:\(update.chat.conversationID)", chat: update.chat, message: nil, line: update.line))
        }
        return out
    }

    /// Everything else a bot has for you: working now, or finished and unread
    /// (upstream's Updates list; the pill on the map opens this).
    private var others: [ChatUpdate] { session.state.updates.filter { $0.kind != .needsYou } }

    var body: some View {
        let entries = entries
        let working = others.filter { $0.kind == .working }
        let toReview = others.filter { $0.kind == .toReview }
        VStack(spacing: 0) {
            if orbitClose == nil { OrbitGrabber().padding(.top, 8) }
            HStack(spacing: 10) {
                Image(systemName: entries.isEmpty ? "bell" : "hand.raised")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(entries.isEmpty ? Orbit.ink : Orbit.amberText)
                    .frame(width: 22)
                VStack(alignment: .leading, spacing: 1) {
                    OrbitKicker(verbatim: summary(waiting: entries.count, working: working.count, toReview: toReview.count))
                    Text(entries.isEmpty ? "Updates" : "Waiting on you")
                        .font(.system(size: 19, weight: .semibold))
                        .foregroundStyle(Orbit.ink)
                }
                Spacer()
            }
            .padding(.horizontal, 18)
            .padding(.top, 14)
            .padding(.bottom, 10)

            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    if entries.isEmpty && others.isEmpty {
                        Text("Nothing new from your bots.")
                            .font(.system(size: 14))
                            .foregroundStyle(Orbit.ink50)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 30)
                    }
                    ForEach(entries) { entry in
                        card(entry)
                            .padding(.vertical, 14)
                            .overlay(alignment: .bottom) { Rectangle().fill(Orbit.hairline).frame(height: 1) }
                            .transition(.asymmetric(insertion: .opacity.combined(with: .move(edge: .bottom)),
                                                    removal: .opacity.combined(with: .move(edge: .trailing))))
                    }
                    updateSection("Working", working)
                    updateSection("To review", toReview)
                }
                .padding(.horizontal, 18)
                .padding(.bottom, 30)
                .animation(.easeInOut(duration: 0.3), value: entries.map(\.id))
            }
        }
        // no card: the map fades out behind it, as behind the column
        .background(Color.clear)
        // the last answer puts it away, a moment after the card collapses,
        // unless there is still something else to look at
        .onValueChange(of: entries.isEmpty && others.isEmpty) { empty in
            guard empty else { return }
            Task { try? await Task.sleep(for: .milliseconds(700)); OrbitDismiss(system: systemDismiss, close: orbitClose)() }
        }
    }

    private func summary(waiting: Int, working: Int, toReview: Int) -> String {
        let parts = [
            waiting > 0 ? String(localized: "\(waiting) waiting") : nil,
            working > 0 ? String(localized: "\(working) working") : nil,
            toReview > 0 ? String(localized: "\(toReview) to review") : nil,
        ].compactMap { $0 }
        return parts.isEmpty ? String(localized: "All clear") : parts.joined(separator: " · ")
    }

    @ViewBuilder
    private func updateSection(_ title: LocalizedStringKey, _ items: [ChatUpdate]) -> some View {
        if !items.isEmpty {
            OrbitKicker(title).padding(.top, 22).padding(.bottom, 4)
            ForEach(items) { item in
                Button { open(item.chat) } label: {
                    HStack(spacing: 12) {
                        ChatAvatarView(chat: item.chat, size: 32)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(verbatim: item.chat.name)
                                .font(.system(size: 14.5, weight: .semibold))
                                .foregroundStyle(OrbitPalette.label(item.chat.color))
                            Text(verbatim: item.line.isEmpty ? item.chat.threadTitle : item.line)
                                .font(.system(size: 12.5))
                                .foregroundStyle(Orbit.ink60)
                                .lineLimit(2)
                        }
                        Spacer(minLength: 0)
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Orbit.ink40)
                    }
                    .padding(.vertical, 10)
                    .contentShape(Rectangle())
                    .overlay(alignment: .bottom) { Rectangle().fill(Orbit.hairline).frame(height: 1) }
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("update-\(item.chat.threadId)")
            }
        }
    }

    @ViewBuilder
    private func card(_ entry: Entry) -> some View {
        let isQuestion = entry.message?.kind == .options && entry.message?.card?.questions.isEmpty == false
        VStack(alignment: .leading, spacing: 10) {
            Button { open(entry.chat) } label: {
                HStack(spacing: 10) {
                    ChatAvatarView(chat: entry.chat, size: 34)
                    VStack(alignment: .leading, spacing: 1) {
                        Text(verbatim: entry.chat.name)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(OrbitPalette.label(entry.chat.color))
                        Text(verbatim: entry.chat.threadTitle)
                            .font(.system(size: 12))
                            .foregroundStyle(Orbit.ink50)
                            .lineLimit(1)
                    }
                    Spacer(minLength: 0)
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Orbit.ink40)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text("Open \(entry.chat.name)"))

            if let message = entry.message {
                switch message.kind {
                case .options where isQuestion:
                    QuestionCardView(chat: entry.chat, message: message)
                case .options:
                    CardView(chat: entry.chat, message: message, embedded: true)
                case .secret:
                    if let secret = message.secret {
                        CredentialRequestCardView(chat: entry.chat, message: message, secret: secret)
                    }
                default:
                    EmptyView()
                }
            } else {
                Text(verbatim: entry.line.isEmpty ? String(localized: "Waiting on you") : entry.line)
                    .font(.system(size: 13.5))
                    .foregroundStyle(Orbit.ink80)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("waiting-\(entry.chat.threadId)")
    }
}

private extension View {
    /// Orbit's panel fill and radius on the sheet are iOS 16.4; below that
    /// the sheet keeps the system's own chrome.
    @ViewBuilder
    func orbitSheetChrome() -> some View {
        if #available(iOS 16.4, *) {
            presentationBackground(Orbit.panel)
                .presentationCornerRadius(Orbit.sheetRadius)
        } else {
            self
        }
    }
}
