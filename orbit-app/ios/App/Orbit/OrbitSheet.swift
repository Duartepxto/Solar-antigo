// A system sheet in Orbit's style: kicker, title, Done, a line saying what
// it is, then its content. Design: phone prototype, screen 02's sheets.
import SwiftUI
import CompanionCore

struct OrbitSystemSheet<Content: View>: View {
    let icon: String
    let kicker: LocalizedStringKey
    let title: String
    var tint: Color = Orbit.ink
    let description: LocalizedStringKey
    @ViewBuilder var content: Content
    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                if orbitClose == nil { OrbitGrabber().frame(maxWidth: .infinity).padding(.top, 8) }
                HStack(spacing: 10) {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundStyle(tint)
                        .frame(width: 22)
                    VStack(alignment: .leading, spacing: 1) {
                        OrbitKicker(kicker)
                        Text(verbatim: title)
                            .font(.system(size: 19, weight: .semibold))
                            .foregroundStyle(Orbit.ink)
                    }
                    Spacer()
                    // on the canvas the link at the top goes back ("‹ Scout");
                    // Done only where the sheet is presented on its own
                    if orbitClose == nil {
                        Button("Done") { dismiss() }
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(Orbit.ink)
                            .padding(.horizontal, 12)
                            .frame(height: 32)
                            .background(Capsule().fill(Orbit.fill08))
                            .accessibilityIdentifier("panel-done")
                    }
                }
                .padding(.top, orbitClose == nil ? 0 : 16)
                Text(description)
                    .font(.system(size: 14))
                    .foregroundStyle(Orbit.ink70)
                    .fixedSize(horizontal: false, vertical: true)
                content
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 34)
        }
        .background((orbitClose == nil ? Orbit.sheet : Color.clear).ignoresSafeArea())
    }
}

/// One key–value row in a system sheet.
struct OrbitSheetRow: View {
    let key: LocalizedStringKey
    let value: String
    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            Text(key).foregroundStyle(Orbit.ink55)
            Spacer()
            Text(verbatim: value).foregroundStyle(Orbit.ink).multilineTextAlignment(.trailing)
        }
        .font(.system(size: 14))
        .padding(.vertical, 12)
        .overlay(alignment: .bottom) { Rectangle().fill(Color.white.opacity(0.07)).frame(height: 1) }
    }
}

func approvalLabel(_ mode: String) -> String {
    switch mode {
    case "full": String(localized: "Full access")
    case "auto": String(localized: "Approve for me")
    case "edits": String(localized: "Auto-accept edits")
    case "custom": String(localized: "Custom")
    default: String(localized: "Ask for approval")
    }
}

extension Bot {
    var currentTaskApprovalMode: String {
        let task = tasks?.first { $0.threadId == threadId }
        return task?.approvalMode ?? task?.autoApprove.map { $0 ? "auto" : "ask" } ?? approvalMode ?? (autoApprove == true ? "auto" : "ask")
    }
}

/// An error worth showing, in the harness's own words; nil for a request
/// that was only cancelled because its sheet closed or was replaced.
func orbitErrorText(_ error: Error) -> String? {
    if error is CancellationError { return nil }
    if let url = error as? URLError, url.code == .cancelled { return nil }
    if (error as NSError).domain == NSURLErrorDomain && (error as NSError).code == NSURLErrorCancelled { return nil }
    return error.localizedDescription
}

/// A list-based system in the column, in Orbit's style: the panel header
/// (icon, kicker, title, what it is), then its sections as plain rows on the
/// canvas — no navigation bar, no large title, no grey grouped cards.
struct OrbitPanelList<Content: View>: View {
    let icon: String
    let kicker: LocalizedStringKey
    let title: String
    var tint: Color = Orbit.ink
    let description: LocalizedStringKey
    @ViewBuilder var content: Content

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 10) {
                        Image(systemName: icon)
                            .font(.system(size: 18, weight: .medium))
                            .foregroundStyle(tint)
                            .frame(width: 22)
                        VStack(alignment: .leading, spacing: 1) {
                            OrbitKicker(kicker)
                            Text(verbatim: title)
                                .font(.system(size: 19, weight: .semibold))
                                .foregroundStyle(Orbit.ink)
                        }
                    }
                    Text(description)
                        .font(.system(size: 14))
                        .foregroundStyle(Orbit.ink70)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.top, 16)
                .listRowInsets(EdgeInsets(top: 0, leading: 18, bottom: 4, trailing: 18))
                .listRowSeparator(.hidden)
                .listRowBackground(Color.clear)
            }
            Group { content }
                .listRowBackground(Color.clear)
                .listRowSeparatorTint(Orbit.hairline)
        }
        .listStyle(.plain)
        .environment(\.defaultMinListRowHeight, 44)
        .scrollContentBackground(.hidden)
        .background(Orbit.canvas.opacity(0.001))
        .listRowBackground(Color.clear)
        .toolbar(.hidden, for: .navigationBar)
        .tint(Orbit.link)
    }
}

/// A section header in an Orbit panel list: the mono kicker.
struct OrbitSectionHeader: View {
    let text: LocalizedStringKey
    init(_ text: LocalizedStringKey) { self.text = text }
    var body: some View {
        OrbitKicker(text)
            .padding(.top, 10)
            .frame(maxWidth: .infinity, alignment: .leading)
            .listRowInsets(EdgeInsets(top: 0, leading: 18, bottom: 0, trailing: 18))
    }
}

/// A labelled field in an Orbit panel: a quiet label, then the field.
struct OrbitField<Field: View>: View {
    let label: LocalizedStringKey
    @ViewBuilder var field: Field
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label).font(.system(size: 12)).foregroundStyle(Orbit.ink50)
            field.font(.system(size: 15)).foregroundStyle(Orbit.ink)
        }
        .padding(.vertical, 4)
    }
}

/// A page inside a panel (a memory file, a skill's SKILL.md, the history):
/// it takes the panel's place with a link back to it at the top, never a
/// pushed screen with a navigation bar.
struct OrbitSubpage<Content: View>: View {
    let back: LocalizedStringKey
    let onBack: () -> Void
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button(action: onBack) {
                HStack(spacing: 3) {
                    Image(systemName: "chevron.left").font(.system(size: 13, weight: .semibold))
                    Text(back).font(.system(size: 14))
                }
                .foregroundStyle(Orbit.ink60)
                .padding(.horizontal, 16)
                .frame(height: 36)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("subpage-back")
            content
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }
        .background(Orbit.canvas.ignoresSafeArea())
        .toolbar(.hidden, for: .navigationBar)
        .inOrbitColumn(close: onBack)
        .transition(.opacity)
    }
}

extension View {
    /// A panel's Cancel and Save, pinned to its foot so a long list never
    /// hides them below the fold.
    func orbitPanelActions<Actions: View>(@ViewBuilder _ actions: () -> Actions) -> some View {
        safeAreaInset(edge: .bottom, spacing: 0) {
            HStack(spacing: 10) { actions() }
                .padding(.horizontal, 18)
                .padding(.top, 14)
                .padding(.bottom, 10)
                .background(LinearGradient(colors: [Orbit.canvas.opacity(0), Orbit.canvas], startPoint: .top, endPoint: .init(x: 0.5, y: 0.3)))
        }
    }
}
