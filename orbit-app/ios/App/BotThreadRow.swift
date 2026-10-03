import CompanionCore
import SwiftUI

/// The compact thread label shared by the roster and the thread picker.
struct BotThreadRow: View {
    let task: BotTask
    var selected = false
    /// The thread is holding a queued send, from the client's queue state.
    /// The harness reports this out-of-band; the activity string never says
    /// it, so the row derives it here rather than parsing activity.
    var queued = false

    private var runtime: (title: String, icon: String, color: Color)? {
        // Ordered as the desktop orders its row: the person first, then a
        // teammate wait as a quiet clock (never a spinner), then work.
        if task.activity == "waiting-on-you" { return ("Waiting on you", "hand.raised.fill", Orbit.amberText) }
        if task.isWaitingOnTeammate { return ("Waiting on teammate", "clock", Orbit.ink50) }
        if task.isWorking { return ("Working", "arrow.triangle.2.circlepath", Orbit.link) }
        // The queued flag is client state the harness reports out-of-band.
        if task.activity == "queued" || queued { return ("Queued", "clock", Orbit.ink50) }
        return nil
    }

    /// A closed or archived thread with nothing live in it reads quieter,
    /// like the desktop's dimmed row; a live status or unread outranks both.
    private var dimmed: Bool {
        (task.isClosed || task.isArchived) && runtime == nil && task.unread != true
    }

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 5) {
                Text(verbatim: task.displayTitle)
                    .font(.system(size: 15, weight: task.unread == true ? .semibold : .regular))
                    .foregroundStyle(dimmed ? Orbit.ink50 : Orbit.ink)
                    .lineLimit(2)

                if runtime != nil || task.unread == true {
                    HStack(spacing: 10) {
                        if let runtime {
                            Label(runtime.title, systemImage: runtime.icon)
                                .foregroundStyle(runtime.color)
                        }
                        if task.unread == true {
                            Label("Unread", systemImage: "circle.fill")
                                .foregroundStyle(Orbit.link)
                        }
                    }
                    .font(.system(size: 12, weight: .medium))
                }

                HStack(spacing: 5) {
                    if task.listStamp > 0 {
                        Text(ThreadStamp.updated(task.listStamp))
                    }
                    if task.pinned == true {
                        if task.listStamp > 0 { Text("·") }
                        Image(systemName: "pin.fill")
                            .accessibilityLabel("Pinned")
                    }
                    if let byline = task.bylineLabel {
                        if task.listStamp > 0 || task.pinned == true { Text("·") }
                        Text(verbatim: byline)
                    }
                }
                .font(.system(size: 12.5))
                .foregroundStyle(Orbit.ink50)
                .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            if selected {
                Circle().fill(Orbit.success).frame(width: 7, height: 7)
                    .accessibilityHidden(true)
            }
        }
        .padding(.vertical, 3)
        .contentShape(Rectangle())
        .accessibilityElement(children: .combine)
        .accessibilityValue(task.isArchived ? "Archived" : dimmed ? "Closed" : "")
        .accessibilityAddTraits(selected ? .isSelected : [])
    }
}
