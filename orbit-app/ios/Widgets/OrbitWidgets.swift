// The widget extension: the bot's Live Activity, in the Dynamic Island and
// on the lock screen, and the home-screen widgets that render the updates
// snapshot. The face is the bot's Orbit character, one still frame for its
// mood — the system renders a snapshot, so it cannot move here, but it
// changes with every update.
import ActivityKit
import SwiftUI
import WidgetKit

@main
struct OrbitWidgets: WidgetBundle {
    var body: some Widget {
        BotActivityWidget()
        NeedsYouWidget()
        UpdatesDigestWidget()
        WorkingMonitorWidget()
        if #available(iOS 17.0, *) {
            BotWidget()
        }
    }
}

struct BotActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BotActivityAttributes.self) { context in
            LockScreenView(context: context)
                .activityBackgroundTint(.black)
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    OrbitingFace(context: context, size: 56)
                        .padding(.leading, 2)
                }
                DynamicIslandExpandedRegion(.center) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(context.state.headline)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.white)
                            .lineLimit(1)
                        Text(context.state.line)
                            .font(.system(size: 13))
                            .foregroundStyle(.white.opacity(0.75))
                            .lineLimit(2)
                    }
                    .padding(.top, 2)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    ElapsedClock(since: context.state.since)
                        .padding(.top, 4)
                        .padding(.trailing, 4)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    if let threadId = context.state.approvalThreadId, let requestId = context.state.requestId {
                        AnswerButtons(context: context, threadId: threadId, requestId: requestId)
                            .padding(.top, 4)
                    } else {
                        StepRow(state: context.state, tint: OrbitPalette.color(context.attributes.color))
                            .padding(.top, 2)
                    }
                }
            } compactLeading: {
                OrbitCharacter(color: context.attributes.color, mood: OrbitMood(rawValue: context.state.face) ?? .idle, size: 24, animated: false)
            } compactTrailing: {
                compactTrailing(context)
            } minimal: {
                OrbitCharacter(color: context.attributes.color, mood: OrbitMood(rawValue: context.state.face) ?? .idle, size: 22, animated: false)
            }
            .keylineTint(OrbitPalette.color(context.attributes.color))
        }
    }

    @ViewBuilder
    private func compactTrailing(_ context: ActivityViewContext<BotActivityAttributes>) -> some View {
        switch context.state.kind {
        case "needsYou":
            Image(systemName: "hand.raised.fill")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(OrbitPalette.color(context.attributes.color))
        case "working":
            // the step's own symbol, swapped as the bot moves between tools
            Image(systemName: context.state.stepIcon ?? "sparkles")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(OrbitPalette.color(context.attributes.color))
                .modifier(SymbolSwap())
                .id(context.state.stepIcon)
        default:
            Circle().fill(OrbitPalette.color(context.attributes.color)).frame(width: 8, height: 8)
        }
    }
}

private struct LockScreenView: View {
    let context: ActivityViewContext<BotActivityAttributes>

    var body: some View {
        let tint = OrbitPalette.color(context.attributes.color)
        HStack(alignment: .top, spacing: 12) {
            OrbitingFace(context: context, size: 52)
            VStack(alignment: .leading, spacing: 5) {
                HStack(alignment: .firstTextBaseline, spacing: 6) {
                    if context.state.kind == "needsYou" {
                        Image(systemName: "hand.raised.fill")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(Color(hex: "#ff9800"))
                    }
                    Text(context.state.headline)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(.white)
                        .lineLimit(1)
                    Spacer(minLength: 4)
                    ElapsedClock(since: context.state.since)
                }
                Text(context.state.line)
                    .font(.system(size: 13.5))
                    .foregroundStyle(.white.opacity(0.8))
                    .lineLimit(2)
                    .contentTransition(.opacity)
                if let threadId = context.state.approvalThreadId, let requestId = context.state.requestId {
                    AnswerButtons(context: context, threadId: threadId, requestId: requestId)
                        .padding(.top, 4)
                } else {
                    StepRow(state: context.state, tint: tint)
                }
            }
        }
        .padding(14)
    }
}

/// The clock iOS keeps ticking on its own: time since the bot started this.
private struct ElapsedClock: View {
    let since: Date
    var body: some View {
        Text(timerInterval: since...since.addingTimeInterval(86_400), countsDown: false)
            .font(.system(size: 12, weight: .medium).monospacedDigit())
            .foregroundStyle(.white.opacity(0.5))
            .multilineTextAlignment(.trailing)
            .frame(maxWidth: 56, alignment: .trailing)
    }
}

/// The step the bot is on, in words, with how many it has taken. Each new
/// step slides in from below, so a glance tells you it is moving.
private struct StepRow: View {
    let state: BotActivityAttributes.ContentState
    let tint: Color

    var body: some View {
        if let step = state.step, !step.isEmpty, step != state.line {
            HStack(spacing: 6) {
                Image(systemName: state.stepIcon ?? "sparkles")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(tint)
                    .frame(width: 14)
                Text(step)
                    .font(.system(size: 12.5, weight: .medium))
                    .foregroundStyle(.white.opacity(0.65))
                    .lineLimit(1)
                Spacer(minLength: 4)
                if let steps = state.steps, steps > 1 {
                    Text("step \(steps)")
                        .font(.system(size: 11.5, weight: .medium).monospacedDigit())
                        .foregroundStyle(.white.opacity(0.4))
                        .contentTransition(.numericText())
                }
            }
            .id(step)
            .transition(.push(from: .bottom))
        }
    }
}

/// The card's options, as pills — exactly the options the card offered.
private struct AnswerButtons: View {
    let context: ActivityViewContext<BotActivityAttributes>
    let threadId: String
    let requestId: String

    var body: some View {
        // Answering from the activity itself is an interactive-widget feature,
        // and those arrived in iOS 17. Below that the buttons would be dead
        // pills, so say where the answer lives instead of pretending.
        if #available(iOS 17.0, *) {
            buttons
        } else {
            Text("Open Orbit to answer")
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(.white.opacity(0.7))
        }
    }

    @available(iOS 17.0, *)
    private var buttons: some View {
        HStack(spacing: 8) {
            ForEach(context.state.options, id: \.self) { option in
                Button(intent: AnswerApprovalIntent(
                    threadId: threadId,
                    requestId: requestId,
                    choice: option,
                    isPermission: context.state.isPermission
                )) {
                    Text(option)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 34)
                        .background(
                            Capsule().fill(
                                option.caseInsensitiveCompare("Deny") == .orderedSame
                                    ? Color.white.opacity(0.16)
                                    : OrbitPalette.color(context.attributes.color)
                            )
                        )
                }
                .buttonStyle(.plain)
            }
        }
    }
}

/// The face with comets around it and a rainbow ring filling up behind it.
/// The system renders a snapshot, so the comets are a frame — a different
/// one each update — and the ring is a timer-driven `ProgressView`, which is
/// the one kind of motion iOS keeps animating in a Live Activity on its own.
private struct OrbitingFace: View {
    let context: ActivityViewContext<BotActivityAttributes>
    let size: CGFloat

    var body: some View {
        ZStack {
            // restarts with every step, so the ring moves as the work does
            let start = context.state.stepSince ?? context.state.since
            ProgressView(timerInterval: start...start.addingTimeInterval(30), countsDown: false) { EmptyView() } currentValueLabel: { EmptyView() }
                .progressViewStyle(.circular)
                .tint(context.state.kind == "needsYou" ? Color(hex: "#ff9800") : OrbitPalette.color(context.attributes.color))
                .frame(width: size + 4, height: size + 4)
            OrbitCharacter(color: context.attributes.color, mood: OrbitMood(rawValue: context.state.face) ?? .idle, size: size, animated: false)
        }
    }
}

/// iOS 17 swaps one symbol for the next; iOS 16 just changes it.
private struct SymbolSwap: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 17.0, *) {
            content.contentTransition(.symbolEffect(.replace))
        } else {
            content
        }
    }
}
