// "Atlas wants to show you market-map.html": when a bot's reply links a file
// it made, the phone offers it under the reply, the way the desktop offers it
// on the canvas (src/orbit/artifacts.ts, ArtifactCard.tsx). View opens it over
// the bot through the message-scoped file route; the preview's Reply comes
// back to the chat with the file named.
import SwiftUI
import CompanionCore

enum ArtifactLinks {
    /// The desktop's kinds: pages, PDFs and images.
    static let extensions: Set<String> = ["html", "htm", "pdf", "png", "jpg", "jpeg", "gif", "webp", "svg"]

    /// Markdown link and image targets in a reply that name a local file of
    /// an offerable kind, in order, without repeats (artifacts.ts offersIn).
    static func files(in text: String) -> [String] {
        let pattern = #"\]\(\s*<([^>]+)>|\]\(\s*([^)\s]+)"#
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return [] }
        var out: [String] = []
        let range = NSRange(text.startIndex..., in: text)
        for match in regex.matches(in: text, range: range) {
            let group = match.range(at: 1).location != NSNotFound ? 1 : 2
            guard let r = Range(match.range(at: group), in: text) else { continue }
            let target = String(text[r]).trimmingCharacters(in: .whitespaces)
            guard case let .desktopFile(path)? = LocalMessageLink.resolve(target) else { continue }
            let ext = (path as NSString).pathExtension.lowercased()
            guard extensions.contains(ext), !out.contains(target) else { continue }
            out.append(target)
        }
        return out
    }

    static func kind(of path: String) -> (label: LocalizedStringKey, icon: String) {
        switch (path as NSString).pathExtension.lowercased() {
        case "html", "htm": ("Page", "globe")
        case "pdf": ("PDF", "doc.richtext")
        default: ("Image", "photo")
        }
    }
}

struct ArtifactOffers: View {
    let message: Message
    let chat: Chat
    let openLink: (URL, Message) -> OpenURLAction.Result

    var body: some View {
        let files = ArtifactLinks.files(in: message.text ?? "")
        if !files.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                ForEach(files, id: \.self) { file in
                    ArtifactOfferCard(file: file, speaker: message.from?.name ?? chat.name, color: message.from?.color ?? chat.color) {
                        guard let url = URL(string: file) ?? URL(string: file.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? "") else { return }
                        _ = openLink(url, message)
                    }
                }
            }
        }
    }
}

private struct ArtifactOfferCard: View {
    let file: String
    let speaker: String
    let color: String
    let view: () -> Void

    var body: some View {
        let name = (file as NSString).lastPathComponent.removingPercentEncoding ?? (file as NSString).lastPathComponent
        let kind = ArtifactLinks.kind(of: file)
        HStack(spacing: 12) {
            Image(systemName: kind.icon)
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(OrbitPalette.label(color))
                .frame(width: 40, height: 40)
                .background(RoundedRectangle(cornerRadius: 10).fill(Orbit.fill06))
            VStack(alignment: .leading, spacing: 2) {
                Text("\(Text(verbatim: speaker).foregroundColor(OrbitPalette.label(color))) wants to show you")
                    .font(.system(size: 12.5))
                    .foregroundStyle(Orbit.ink60)
                Text(verbatim: name)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Orbit.ink)
                    .lineLimit(1)
                    .truncationMode(.middle)
                Text(kind.label)
                    .font(Orbit.kicker(9.5))
                    .tracking(1)
                    .textCase(.uppercase)
                    .foregroundStyle(Orbit.ink40)
            }
            Spacer(minLength: 8)
            Button(action: view) {
                Text("View")
                    .font(.system(size: 13.5, weight: .semibold))
                    .foregroundStyle(Color(hex: "#070707"))
                    .padding(.horizontal, 14)
                    .frame(height: 32)
                    .background(Capsule().fill(Orbit.ink))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text("View \(name)"))
            .accessibilityIdentifier("artifact-view-\(name)")
        }
        .padding(10)
        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Orbit.fill04))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(Orbit.hairline))
        .accessibilityElement(children: .contain)
    }
}
