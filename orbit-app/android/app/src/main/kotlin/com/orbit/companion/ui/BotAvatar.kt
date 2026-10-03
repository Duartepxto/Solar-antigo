package com.orbit.companion.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import com.orbit.companion.core.Bot
import com.orbit.companion.core.Chat

/**
 * An agent's identity: its mascot, in its own colour and body — the port of
 * `ios/App/BotAvatarView.swift`.
 */
@Composable
internal fun BotAvatar(
    bot: Bot,
    size: Dp,
    state: MausState = MausState.IDLE,
    animated: Boolean = true,
    /**
     * Left null where the name is already beside the face — the row would
     * otherwise be read out twice, which is why [MausAvatar] clears its own
     * semantics. Set it where the face stands alone.
     */
    contentDescription: String? = null,
    modifier: Modifier = Modifier,
) {
    val named = if (contentDescription == null) {
        modifier
    } else {
        modifier.semantics { this.contentDescription = contentDescription }
    }
    MausAvatar(
        color = bot.color,
        bodyId = bot.mascotBody,
        size = size,
        state = state,
        animated = animated,
        modifier = named,
    )
}

/** `ChatAvatarView`: a room has no identity of its own, only the blue mascot. */
@Composable
internal fun ChatAvatar(
    chat: Chat,
    size: Dp,
    state: MausState = MausState.IDLE,
    animated: Boolean = true,
    contentDescription: String? = null,
    modifier: Modifier = Modifier,
) {
    when (chat) {
        is Chat.BotChat -> BotAvatar(
            bot = chat.bot,
            size = size,
            state = state,
            animated = animated,
            contentDescription = contentDescription,
            modifier = modifier,
        )
        is Chat.RoomChat -> MausAvatar(
            color = "blue",
            size = size,
            state = state,
            animated = animated,
            modifier = modifier,
        )
    }
}
