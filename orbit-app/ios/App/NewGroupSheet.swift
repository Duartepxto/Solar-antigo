// Make a channel from the phone: a name, and which bots are in it.
//
// The harness names it after the first member if the name is left blank,
// which is what the desktop's dialog does too — one rule, two screens.
import SwiftUI
import CompanionCore

struct NewGroupSheet: View {
    let created: (Room) -> Void
    @EnvironmentObject private var session: Session
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @State private var name = ""
    @State private var members = Set<String>()
    @State private var creating = false

    private var bots: [Bot] { session.state.bots.filter { $0.hidden != true } }

    var body: some View {
        OrbitPanelList(icon: "number", kicker: "New channel", title: name.isEmpty ? String(localized: "New channel") : name,
                       description: "A room where several bots talk with you and each other. Left blank, it's named after the first bot.") {
            Section {
                OrbitField(label: "Name") {
                    TextField("Launch room", text: $name).autocorrectionDisabled()
                }
            }
            Section {
                ForEach(bots) { bot in
                    let on = members.contains(bot.id)
                    Button {
                        if on { members.remove(bot.id) } else { members.insert(bot.id) }
                        Haptics.selection()
                    } label: {
                        HStack(spacing: 12) {
                            BotAvatarView(bot: bot, size: 32, animated: false)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(bot.name).font(.system(size: 15, weight: .medium)).foregroundStyle(OrbitPalette.label(bot.color))
                                if !bot.title.isEmpty {
                                    Text(bot.title).font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                                }
                            }
                            Spacer()
                            Image(systemName: on ? "checkmark.circle.fill" : "circle")
                                .font(.system(size: 20))
                                .foregroundStyle(on ? OrbitPalette.color(bot.color) : Orbit.ink40)
                        }
                        .padding(.vertical, 3)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(on ? .isSelected : [])
                }
            } header: { OrbitSectionHeader("Bots") }


        }
        .orbitPanelActions {
                    OrbitPanelButton(title: "Cancel") { dismiss() }
                    Spacer()
                    Button {
                        creating = true
                        Task {
                            // members in roster order, so the room's name (if
                            // it defaults) follows the first bot you picked
                            let ordered = bots.map(\.id).filter(members.contains)
                            if let room = await session.createRoom(name: name, memberIds: ordered) {
                                Haptics.success()
                                created(room)
                            }
                            creating = false
                        }
                    } label: {
                        Text(members.isEmpty ? "Pick bots" : "Create channel")
                    }
                    .buttonStyle(OrbitPrimaryButtonStyle())
                    .disabled(members.isEmpty || creating)
        }
    }
}
