import CompanionCore
import SwiftUI

/// A read-only summary of one bot: who it is, what it does, what it can
/// reach, what it won't do, and its recent activity. No settings and no
/// transcript live here — this mirrors the paired-safe `BotOverview` payload
/// exactly. Shell copied from `ConnectedAppsView`.
struct BotOverviewView: View {
    let bot: Bot

    @EnvironmentObject private var session: Session
    @State private var overview: BotOverview?
    @State private var loading = false
    @State private var failed = false

    var body: some View {
        OrbitPanelList(icon: "list.bullet.rectangle", kicker: "Overview", title: String(localized: "What \(bot.name) does"),
                       tint: OrbitPalette.label(bot.color),
                       description: "Who it is, what it does, what it can reach and what it won't. Read only.") {
            if let overview {
                Section {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(overview.who.name).font(.system(size: 16, weight: .semibold)).foregroundStyle(Orbit.ink)
                        if !overview.who.title.isEmpty { Text(overview.who.title).font(.system(size: 14)).foregroundStyle(Orbit.ink70) }
                        if !overview.who.blurb.isEmpty { Text(overview.who.blurb).font(.system(size: 14)).foregroundStyle(Orbit.ink80) }
                        if !overview.who.soulLead.isEmpty {
                            Text(overview.who.soulLead).font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                        }
                    }
                    .padding(.vertical, 4)
                    .listRowSeparator(.hidden)
                } header: { OrbitSectionHeader("Who") }

                lines("Does", overview.does, icon: "calendar.badge.clock", empty: "Nothing scheduled or learned yet.")
                lines("Can reach", overview.reaches, icon: "network", empty: nil)
                if let grants = overview.grants {
                    Section {
                        if grants.isEmpty {
                            // The record exists but grants nothing: stronger
                            // than "no apps connected", and worth its own line.
                            Text("No tools granted on any connected app.")
                                .font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                                .listRowSeparator(.hidden)
                        } else {
                            ForEach(grants, id: \.slug) { grant in
                                HStack {
                                    Text(grant.slug).font(.system(size: 14.5)).foregroundStyle(Orbit.ink)
                                    Spacer()
                                    Text(toolsLabel(grant)).font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                                }
                            }
                        }
                    } header: { OrbitSectionHeader("App tools") }
                }

                lines("Won't", overview.wont, icon: "hand.raised", empty: nil)

                Section {
                    if overview.recent.isEmpty {
                        Text("No changes recorded yet.").font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                            .listRowSeparator(.hidden)
                    } else {
                        ForEach(Array(overview.recent.enumerated()), id: \.offset) { _, change in
                            VStack(alignment: .leading, spacing: 2) {
                                Text(change.summary).font(.system(size: 14.5)).foregroundStyle(Orbit.ink)
                                Text(Date(timeIntervalSince1970: change.at / 1_000).formatted(date: .abbreviated, time: .shortened))
                                    .font(.system(size: 12)).foregroundStyle(Orbit.ink50)
                            }
                        }
                    }
                } header: { OrbitSectionHeader("Recent changes") }
            } else if failed {
                Text("Couldn't load this from your computer. Pull down to try again.")
                    .font(.system(size: 13.5)).foregroundStyle(Orbit.ink50)
                    .listRowSeparator(.hidden)
            }
        }
        .overlay { if loading && overview == nil { ProgressView().tint(Orbit.ink50) } }
        .task(id: session.connection?.id) {
            overview = nil
            failed = false
            await load()
        }
        .refreshable { await load() }
    }

    @ViewBuilder
    private func lines(_ header: LocalizedStringKey, _ items: [String], icon: String, empty: LocalizedStringKey?) -> some View {
        if !items.isEmpty || empty != nil {
            Section {
                if items.isEmpty, let empty {
                    Text(empty).font(.system(size: 13.5)).foregroundStyle(Orbit.ink50).listRowSeparator(.hidden)
                }
                ForEach(Array(items.enumerated()), id: \.offset) { _, line in
                    HStack(alignment: .firstTextBaseline, spacing: 10) {
                        Image(systemName: icon).font(.system(size: 12)).foregroundStyle(Orbit.ink50).frame(width: 18)
                        Text(line).font(.system(size: 14.5)).foregroundStyle(Orbit.ink)
                    }
                }
            } header: { OrbitSectionHeader(header) }
        }
    }

    private func load() async {
        let connectionID = session.connection?.id
        loading = true
        defer {
            if !Task.isCancelled, session.connection?.id == connectionID { loading = false }
        }
        let loaded = await session.botOverview(for: bot)
        guard !Task.isCancelled, session.connection?.id == connectionID else { return }
        if let loaded {
            overview = loaded
            failed = false
        } else {
            failed = true
        }
    }

    /// The same three summaries the desktop grant editor shows: every tool,
    /// an exact list, or none. Read-only here — grants are assigned on the
    /// computer, never from a paired phone.
    private func toolsLabel(_ grant: BotOverviewGrant) -> String {
        switch grant.level {
        case .all: "All tools"
        case .partial: grant.toolCount == 1 ? "1 tool" : "\(grant.toolCount) tools"
        case .none: "No tools"
        }
    }
}
