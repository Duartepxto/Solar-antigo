// The screens before the map (welcome, pairing, notifications, unpaired):
// You on the empty canvas with a line or two under it and one white pill,
// the desktop's welcome as a phone screen. No title bars, no cards.
import SwiftUI
import CompanionCore

/// The canvas's dot grid, still.
struct OrbitDotGrid: View {
    var body: some View {
        Canvas { ctx, size in
            let g: CGFloat = 26
            var path = Path()
            var x = (size.width.truncatingRemainder(dividingBy: g)) / 2
            while x < size.width {
                var y = (size.height.truncatingRemainder(dividingBy: g)) / 2
                while y < size.height { path.addRect(CGRect(x: x, y: y, width: 1.2, height: 1.2)); y += g }
                x += g
            }
            ctx.fill(path, with: .color(.white.opacity(0.05)))
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

struct OrbitStage<Content: View, Actions: View>: View {
    var mood: OrbitMood = .happy
    /// the corner link ("‹ Not now"), when there's a way out
    var back: (label: LocalizedStringKey, action: () -> Void)? = nil
    var kicker: LocalizedStringKey? = nil
    let title: Text
    var detail: Text? = nil
    /// a symbol drawn in place of You, for a screen about something else
    var symbol: String? = nil
    var symbolTint: Color = Orbit.ink
    @ViewBuilder var content: Content
    @ViewBuilder var actions: Actions

    var body: some View {
        ZStack {
            Orbit.canvas.ignoresSafeArea()
            OrbitDotGrid().ignoresSafeArea()
            ScrollView {
                VStack(spacing: 0) {
                    Spacer(minLength: back == nil ? 70 : 40)
                    ZStack {
                        Circle()
                            .fill(RadialGradient(colors: [symbolTint.opacity(symbol == nil ? 0.10 : 0.14), .clear], center: .center, startRadius: 0, endRadius: 110))
                            .frame(width: 220, height: 220)
                        if let symbol {
                            Image(systemName: symbol)
                                .font(.system(size: 38, weight: .regular))
                                .foregroundStyle(symbolTint)
                        } else {
                            OrbitCharacter(color: "#e8ebf4", mood: mood, size: 116, big: true, isYou: true)
                        }
                    }
                    .frame(height: 170)
                    .accessibilityHidden(true)

                    VStack(spacing: 8) {
                        if let kicker { OrbitKicker(kicker) }
                        title
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundStyle(Orbit.ink)
                            .multilineTextAlignment(.center)
                        if let detail {
                            detail
                                .font(.system(size: 15))
                                .foregroundStyle(Orbit.ink70)
                                .multilineTextAlignment(.center)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                    .padding(.top, 6)

                    content
                        .padding(.top, 26)
                    Spacer(minLength: 24)
                }
                .padding(.horizontal, 28)
                .frame(maxWidth: 520)
                .frame(maxWidth: .infinity)
            }
            .scrollBounceCompat()
        }
        .overlay(alignment: .topLeading) {
            if let back {
                Button(action: back.action) {
                    HStack(spacing: 3) {
                        Image(systemName: "chevron.left").font(.system(size: 14, weight: .semibold))
                        Text(back.label).font(.system(size: 14.5))
                    }
                    .foregroundStyle(Orbit.ink60)
                    .padding(.horizontal, 16)
                    .frame(height: 40)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("back")
            }
        }
        .safeAreaInset(edge: .bottom, spacing: 0) {
            VStack(spacing: 6) { actions }
                .padding(.horizontal, 24)
                .padding(.top, 12)
                .padding(.bottom, 8)
                .frame(maxWidth: 520)
                .frame(maxWidth: .infinity)
                .background(LinearGradient(colors: [Orbit.canvas.opacity(0), Orbit.canvas], startPoint: .top, endPoint: .init(x: 0.5, y: 0.35)))
        }
    }
}

/// The quiet second choice under a stage's white pill.
struct OrbitQuietButton: View {
    let title: LocalizedStringKey
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 15, weight: .medium))
                .foregroundStyle(Orbit.ink60)
                .frame(maxWidth: .infinity, minHeight: 44)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

/// A row on a stage: a quiet icon, a line and what it means.
struct OrbitStageRow: View {
    let icon: String
    let title: LocalizedStringKey
    let detail: LocalizedStringKey
    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 15, weight: .medium))
                .foregroundStyle(Orbit.ink60)
                .frame(width: 22, height: 22)
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.system(size: 15, weight: .medium)).foregroundStyle(Orbit.ink)
                Text(detail).font(.system(size: 13)).foregroundStyle(Orbit.ink50)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
    }
}

/// Something went wrong, said at the top of the screen and gone on its own,
/// not an alert over everything.
struct OrbitNotice: View {
    let message: String
    let onDismiss: () -> Void
    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "exclamationmark.circle")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(Orbit.dangerText)
                .padding(.top, 1)
            Text(verbatim: message)
                .font(.system(size: 13.5))
                .foregroundStyle(Orbit.ink90)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 4)
            Button(action: onDismiss) {
                Image(systemName: "xmark").font(.system(size: 11, weight: .semibold)).foregroundStyle(Orbit.ink50)
                    .frame(width: 24, height: 24).contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Dismiss")
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 11)
        .background(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).fill(Orbit.raised))
        .overlay(RoundedRectangle(cornerRadius: Orbit.cardRadius, style: .continuous).strokeBorder(Orbit.danger.opacity(0.35)))
        .shadow(color: .black.opacity(0.4), radius: 16, y: 6)
        .padding(.horizontal, 14)
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("action-error")
        .task(id: message) {
            try? await Task.sleep(for: .seconds(6))
            onDismiss()
        }
    }
}
