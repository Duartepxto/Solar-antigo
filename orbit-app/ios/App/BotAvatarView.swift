import SwiftUI
import CompanionCore

/// A bot's face anywhere on the phone: always its Orbit particle character.
/// The mood comes from what the bot is doing unless a caller pins one.
struct BotAvatarView: View {
    let bot: Bot
    let size: CGFloat
    var mood: OrbitMood? = nil
    var animated = true
    var flash = 0
    @EnvironmentObject private var session: Session

    var body: some View {
        OrbitCharacter(
            color: bot.color,
            mood: mood ?? session.mood(for: bot),
            size: size,
            seed: orbitSeed(bot.id),
            animated: animated,
            big: size >= 80,
            flash: flash
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(verbatim: bot.name))
    }
}

/// A chat's face: the bot's character, or for a room its first two members'
/// characters side by side (a room is not a bot and has no character of its own).
struct ChatAvatarView: View {
    let chat: Chat
    let size: CGFloat
    var mood: OrbitMood? = nil
    var animated = true
    @EnvironmentObject private var session: Session

    var body: some View {
        switch chat {
        case let .bot(bot):
            BotAvatarView(bot: session.state.bot(bot.id) ?? bot, size: size, mood: mood, animated: animated)
        case let .room(room):
            let members = room.memberIds.compactMap { session.state.bot($0) }.prefix(2)
            ZStack {
                if members.isEmpty {
                    OrbitCharacter(color: "blue", mood: .idle, size: size, seed: orbitSeed(room.id), animated: false)
                }
                ForEach(Array(members.enumerated()), id: \.element.id) { index, bot in
                    BotAvatarView(bot: bot, size: size * 0.72, mood: mood, animated: animated)
                        .offset(x: index == 0 ? -size * 0.16 : size * 0.16, y: index == 0 ? -size * 0.1 : size * 0.1)
                }
            }
            .frame(width: size, height: size)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(verbatim: room.name))
        }
    }
}

/// Up to three bots' faces, overlapping — the Waiting pill.
struct FaceStack: View {
    let chats: [Chat]
    var size: CGFloat = 26

    var body: some View {
        HStack(spacing: -size * 0.27) {
            ForEach(Array(chats.prefix(3).enumerated()), id: \.offset) { _, chat in
                ChatAvatarView(chat: chat, size: size)
            }
        }
        .accessibilityHidden(true)
    }
}

/// A person or a computer, not a bot: an initial in a ring, never a character.
struct ProfileAvatar: View {
    let name: String
    var size: CGFloat = 34

    var body: some View {
        Circle()
            .fill(LinearGradient(colors: [Color(hex: "#202228"), Color(hex: "#0b0b0e")], startPoint: .top, endPoint: .bottom))
            .overlay(Circle().strokeBorder(Color.white.opacity(0.5), lineWidth: max(1, size * 0.05)))
            .frame(width: size, height: size)
            .overlay {
                Text(verbatim: initial)
                    .font(.system(size: size * 0.42, weight: .semibold))
                    .foregroundStyle(Color(hex: "#fcfcfc"))
            }
    }

    private var initial: String {
        String(name.trimmingCharacters(in: .whitespaces).prefix(1)).uppercased()
    }
}
