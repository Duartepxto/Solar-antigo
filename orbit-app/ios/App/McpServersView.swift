import CompanionCore
import SwiftUI

/// The computer's MCP servers, read from the phone.
///
/// Finding and adding servers happens on the computer (Plugins → Explore):
/// a server there runs a command or signs in through a browser that returns
/// to the computer itself, neither of which the phone can finish. Which bots
/// use which servers is each bot's own Apps setting.
struct McpServersView: View {
    @EnvironmentObject private var session: Session
    @State private var servers: [McpServerSummary]?
    @State private var failed = false

    var body: some View {
        OrbitPanelList(icon: "powerplug", kicker: "Apps", title: String(localized: "MCP servers"),
                       description: "Tools your bots can use. Find and add them in Orbit on your computer, under Plugins → Explore.") {
            Section {
                if let servers {
                    if servers.isEmpty {
                        Text("No MCP servers yet. Add one from Plugins → Explore on your computer.")
                            .font(.system(size: 14)).foregroundStyle(Orbit.ink50)
                    }
                    ForEach(servers) { server in
                        OrbitRow(dot: server.enabled ? Orbit.success : Orbit.ink40,
                                 title: Text(verbatim: server.name),
                                 subtitle: Text(verbatim: server.detail),
                                 value: Text(status(server)))
                    }
                } else if failed {
                    Text("Couldn't read the servers from your computer.")
                        .font(.system(size: 14)).foregroundStyle(Orbit.amberText)
                } else {
                    ProgressView().frame(maxWidth: .infinity)
                }
            }
        }
        .task { await load() }
        .refreshable { await load() }
    }

    private func status(_ server: McpServerSummary) -> LocalizedStringKey {
        if !server.enabled { return "Off" }
        if server.auth == "oauth", server.signedIn != true { return "Sign in on computer" }
        return "On"
    }

    private func load() async {
        if let fresh = await session.loadMcpServers() {
            servers = fresh.sorted { $0.name < $1.name }
            failed = false
        } else {
            failed = servers == nil
        }
    }
}
