// The composer's chip row, editable.
//
// The four chips the app shipped with are now just the default contents of
// a list you own: rename them, throw out the ones you never tap, add the
// prompt you actually type every day. An Orbit panel: the form opens in the
// list's place, the reset confirms inline.
import SwiftUI
import CompanionCore

struct QuickRepliesEditor: View {
    @AppStorage(PrefKey.quickReplies) private var stored = ""
    @State private var editing: QuickReply?
    @State private var isNew = false
    @State private var confirmingReset = false

    private var replies: [QuickReply] { QuickReply.decode(stored) }

    private func write(_ replies: [QuickReply]) {
        stored = QuickReply.encode(replies)
    }

    var body: some View {
        if let reply = editing {
            QuickReplyForm(reply: reply, isNew: isNew) { saved in
                var next = replies
                if let index = next.firstIndex(where: { $0.id == saved.id }) { next[index] = saved } else { next.append(saved) }
                write(next)
                editing = nil
            } onClose: { editing = nil }
        } else {
            list
        }
    }

    private var list: some View {
        OrbitPanelList(icon: "bolt", kicker: "Chat", title: String(localized: "Quick replies"),
                       description: replies.isEmpty
                           ? "The chips under the composer. The row is hidden while this list is empty."
                           : "The chips under the composer, one tap to send. Tap one to edit it, hold and drag to reorder, swipe to delete.") {
            Section {
                ForEach(replies) { reply in
                    Button {
                        isNew = false
                        editing = reply
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: reply.icon)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(Orbit.ink60)
                                .frame(width: 20)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(reply.title).font(.system(size: 15)).foregroundStyle(Orbit.ink)
                                Text(reply.prompt)
                                    .font(.system(size: 12.5))
                                    .foregroundStyle(Orbit.ink50)
                                    .lineLimit(1)
                            }
                            Spacer()
                        }
                        .padding(.vertical, 4)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                }
                .onDelete { offsets in
                    var next = replies
                    next.remove(atOffsets: offsets)
                    write(next)
                }
                .onMove { from, to in
                    var next = replies
                    next.move(fromOffsets: from, toOffset: to)
                    write(next)
                }
            } header: { OrbitSectionHeader("Chips") }

            Section {
                if confirmingReset {
                    OrbitInlineConfirm(question: Text("Reset quick replies?"),
                                       detail: Text("This restores the four chips the app came with and discards your own."),
                                       confirm: "Reset") {
                        write(QuickReply.defaults)
                        confirmingReset = false
                    } onCancel: { confirmingReset = false }
                        .listRowSeparator(.hidden)
                } else {
                    HStack(spacing: 8) {
                        OrbitPanelButton(title: "Add a chip") {
                            isNew = true
                            editing = QuickReply(title: "", prompt: "", icon: QuickReply.iconChoices[0])
                        }
                        Spacer()
                        OrbitPanelButton(title: "Reset to defaults", role: .destructive) { confirmingReset = true }
                    }
                    .padding(.top, 8)
                    .listRowSeparator(.hidden)
                }
            }
        }
    }
}

/// Add and edit are the same form; only the title differs.
private struct QuickReplyForm: View {
    @State var reply: QuickReply
    let isNew: Bool
    let onSave: (QuickReply) -> Void
    let onClose: () -> Void

    private var titled: String {
        reply.title.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private var prompted: String {
        reply.prompt.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    var body: some View {
        OrbitPanelList(icon: reply.icon, kicker: "Quick replies",
                       title: titled.isEmpty ? String(localized: "New chip") : titled,
                       description: "A chip under the composer. Tapping it sends the prompt to the bot.") {
            Section {
                OrbitField(label: "Label") {
                    TextField("Run tests", text: $reply.title)
                }
                OrbitField(label: "Prompt") {
                    TextField("Run all automated tests", text: $reply.prompt, axis: .vertical)
                        .lineLimit(2...6)
                }
            } header: { OrbitSectionHeader("Chip") }

            Section {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 10) {
                    ForEach(QuickReply.iconChoices, id: \.self) { icon in
                        let on = reply.icon == icon
                        Button {
                            reply.icon = icon
                            Haptics.selection()
                        } label: {
                            Image(systemName: icon)
                                .font(.system(size: 15, weight: .semibold))
                                .frame(width: 42, height: 38)
                                .foregroundStyle(on ? Color(hex: "#070707") : Orbit.ink60)
                                .background(RoundedRectangle(cornerRadius: 10, style: .continuous).fill(on ? Orbit.ink : Orbit.fill06))
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel(icon)
                        .accessibilityAddTraits(on ? [.isSelected] : [])
                    }
                }
                .padding(.vertical, 6)
                .listRowSeparator(.hidden)
            } header: { OrbitSectionHeader("Icon") }


        }
        .orbitPanelActions {
                    OrbitPanelButton(title: "Cancel", action: onClose)
                    Spacer()
                    Button(isNew ? "Add chip" : "Save") {
                        var saved = reply
                        saved.title = titled
                        saved.prompt = prompted
                        onSave(saved)
                    }
                    .buttonStyle(OrbitPrimaryButtonStyle())
                    .disabled(titled.isEmpty || prompted.isEmpty)
        }
    }
}
