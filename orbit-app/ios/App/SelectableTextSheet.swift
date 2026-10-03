// A message, plain, with the system's own selection on it.
//
// The bubble itself cannot offer drag-to-select: long-press there already
// opens the reactions menu, and SwiftUI gives that gesture to whichever of
// the two asks last. So "Select text" turns the bubble into the raw text,
// selectable, in place: no sheet over the chat.
import SwiftUI
import UIKit

struct SelectableTextInline: View {
    let text: String
    let onDone: () -> Void
    @State private var copied = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // The raw text, not the rendered markdown: what gets copied
            // should be what the bot actually wrote, backticks and all.
            Text(text)
                .textSelection(.enabled)
                .font(.system(size: 15))
                .foregroundStyle(Orbit.ink)
                .frame(maxWidth: .infinity, alignment: .leading)
                .accessibilityHint("Touch and hold to select part of this message")
            HStack(spacing: 8) {
                Text("Touch and hold to select part of it.")
                    .font(.system(size: 12)).foregroundStyle(Orbit.ink50)
                Spacer(minLength: 6)
                OrbitPanelButton(title: copied ? "Copied" : "Copy all") {
                    UIPasteboard.general.string = text
                    Haptics.selection()
                    withAnimation(.snappy) { copied = true }
                }
                OrbitPanelButton(title: "Done", action: onDone)
            }
        }
        .padding(12)
        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Orbit.fill04))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(Orbit.borderStrong))
    }
}
