// Search or jump: bots, threads, channels, messages, settings and actions,
// the phone's ⌘K. Design: phone prototype, screen 04.
import SwiftUI
import CompanionCore

enum SearchAction: Hashable {
    case newBot, newGroup, newSection, walkie, waiting, settings
}

struct SearchView: View {
    let open: (Chat) -> Void
    let action: (SearchAction) -> Void
    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @State private var query = ""
    @State private var hits: [SearchHit] = []
    @State private var searching = false
    @FocusState private var focused: Bool

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                HStack(spacing: 9) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(Orbit.ink50)
                    TextField(text: $query) {
                        Text("Search bots, threads, settings").foregroundStyle(Orbit.ink40)
                    }
                    .font(.system(size: 15))
                    .foregroundStyle(Orbit.ink)
                    .focused($focused)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .submitLabel(.search)
                    .accessibilityIdentifier("search-field")
                    if !query.isEmpty {
                        Button { query = "" } label: {
                            Image(systemName: "xmark.circle.fill").foregroundStyle(Orbit.ink40)
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Clear")
                    }
                }
                .padding(.horizontal, 14)
                .frame(height: 42)
                .background(Capsule().fill(Orbit.fill08))

                Button("Cancel") { dismiss() }
                    .font(.system(size: 15))
                    .foregroundStyle(Orbit.link)
            }
            .padding(.horizontal, 14)
            .padding(.top, 4)

            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    let groups = results
                    ForEach(groups, id: \.title) { group in
                        OrbitKicker(verbatim: group.title)
                            .padding(.horizontal, 18)
                            .padding(.top, 14)
                            .padding(.bottom, 6)
                        ForEach(group.items) { item in
                            Button { run(item) } label: { SearchRow(item: item) }
                                .buttonStyle(.plain)
                                .padding(.horizontal, 14)
                                .accessibilityIdentifier("search-\(item.id)")
                        }
                    }
                    if searching && hits.isEmpty {
                        ProgressView().tint(Orbit.ink50).frame(maxWidth: .infinity).padding(.top, 20)
                    } else if groups.isEmpty {
                        Text("No results for \u{201C}\(query)\u{201D}.")
                            .font(.system(size: 14))
                            .foregroundStyle(Orbit.ink50)
                            .padding(.horizontal, 18)
                            .padding(.top, 24)
                    }
                }
                .padding(.bottom, 20)
            }
            .scrollDismissesKeyboard(.interactively)
        }
        .background(Orbit.screen.ignoresSafeArea())
        .toolbar(.hidden, for: .navigationBar)
        .onAppear { focused = true }
        .task(id: query) {
            let expected = query.trimmingCharacters(in: .whitespacesAndNewlines)
            guard expected.count >= 2 else { hits = []; searching = false; return }
            searching = true
            defer { if query.trimmingCharacters(in: .whitespacesAndNewlines) == expected { searching = false } }
            try? await Task.sleep(for: .milliseconds(250))
            guard !Task.isCancelled else { return }
            let found = await session.search(expected)
            guard !Task.isCancelled else { return }
            hits = found
        }
    }

    // MARK: - Results

    struct Item: Identifiable {
        enum Kind { case bot(Bot), thread(Chat), channel(Room), hit(SearchHit), action(SearchAction) }
        let id: String
        let label: String
        let meta: String
        let icon: String?
        let kind: Kind
    }

    struct Group { let title: String; let items: [Item] }

    private var q: String { query.trimmingCharacters(in: .whitespacesAndNewlines) }
    private func hit(_ values: String...) -> Bool { q.isEmpty || values.contains { $0.localizedCaseInsensitiveContains(q) } }

    private var results: [Group] {
        let state = session.state
        let bots = state.bots.filter { $0.hidden != true }
        var out: [Group] = []

        let botItems = bots.compactMap { bot -> Item? in
            let team = bot.section?.trimmingCharacters(in: .whitespaces) ?? ""
            let role = bot.chiefOfStaff == true ? String(localized: "Chief") : bot.title
            let meta = [role, team].filter { !$0.isEmpty }.joined(separator: " · ")
            guard hit(bot.name, meta) else { return nil }
            return Item(id: "bot.\(bot.id)", label: bot.name, meta: meta, icon: nil, kind: .bot(bot))
        }
        if !botItems.isEmpty { out.append(Group(title: String(localized: "Bots"), items: botItems)) }

        if !q.isEmpty {
            var threads: [Item] = []
            for bot in bots {
                for task in bot.visibleTasks {
                    let folder = task.projectId.flatMap { id in bot.projects?.first { $0.id == id }?.name } ?? ""
                    guard hit(task.displayTitle, folder), let projected = bot.projected(forThread: task.threadId) else { continue }
                    let meta = [bot.name, folder].filter { !$0.isEmpty }.joined(separator: " · ")
                    threads.append(Item(id: "thread.\(task.threadId)", label: task.displayTitle, meta: meta, icon: "bubble.left", kind: .thread(.bot(projected))))
                }
            }
            if !threads.isEmpty { out.append(Group(title: String(localized: "Threads"), items: Array(threads.prefix(20)))) }
        }

        let channels = state.rooms.filter { $0.dm != true && hit($0.name) }.map { room in
            Item(id: "room.\(room.id)", label: room.name.hasPrefix("#") ? room.name : "#\(room.name)", meta: String(localized: "\(room.memberIds.count) members"), icon: "number", kind: .channel(room))
        }
        if !channels.isEmpty { out.append(Group(title: String(localized: "Channels"), items: channels)) }

        if !hits.isEmpty {
            out.append(Group(title: String(localized: "Messages"), items: hits.prefix(20).map { h in
                Item(id: "hit.\(h.id)", label: h.snippet, meta: h.name, icon: h.role == .user ? "person" : "text.bubble", kind: .hit(h))
            }))
        }

        var actions: [Item] = []
        func add(_ a: SearchAction, _ label: String, _ icon: String) {
            if hit(label) { actions.append(Item(id: "action.\(a)", label: label, meta: "", icon: icon, kind: .action(a))) }
        }
        add(.waiting, String(localized: "Waiting on you"), "hand.raised")
        add(.walkie, String(localized: "Walkie-talkie"), "waveform")
        if session.canAdminister {
            add(.newBot, String(localized: "New bot"), "plus")
            add(.newSection, String(localized: "New team"), "folder.badge.plus")
        }
        add(.newGroup, String(localized: "New channel"), "number")
        add(.settings, String(localized: "Settings"), "gearshape")
        if !actions.isEmpty { out.append(Group(title: String(localized: "Actions"), items: actions)) }
        return out
    }

    private func run(_ item: Item) {
        Haptics.selection()
        switch item.kind {
        case let .bot(bot): open(session.threadSelection.restoringThread(.bot(bot), connectionID: session.connection?.id))
        case let .thread(chat): open(chat)
        case let .channel(room): open(.room(room))
        case let .hit(h): Task { if let chat = await session.open(h) { open(chat) } }
        case let .action(a): action(a)
        }
    }
}

private struct SearchRow: View {
    let item: SearchView.Item

    var body: some View {
        HStack(spacing: 12) {
            if case let .bot(bot) = item.kind {
                BotAvatarView(bot: bot, size: 32)
            } else {
                Image(systemName: item.icon ?? "circle")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Orbit.ink70)
                    .frame(width: 32, height: 32)
                    .background(RoundedRectangle(cornerRadius: 9).fill(Orbit.fill06))
            }
            Text(verbatim: item.label)
                .font(.system(size: 15))
                .foregroundStyle(Orbit.ink)
                .lineLimit(1)
            Spacer(minLength: 8)
            if !item.meta.isEmpty {
                Text(verbatim: item.meta)
                    .font(.system(size: 12.5))
                    .foregroundStyle(Orbit.ink50)
                    .lineLimit(1)
            }
        }
        .padding(4)
        .frame(minHeight: 46)
        .contentShape(Rectangle())
    }
}
