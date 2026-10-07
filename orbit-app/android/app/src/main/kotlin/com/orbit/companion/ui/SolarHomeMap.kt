package com.orbit.companion.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.res.stringResource
import com.orbit.companion.R
import androidx.compose.ui.semantics.CustomAccessibilityAction
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.customActions
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.orbit.companion.core.Bot
import com.orbit.companion.core.Chat
import com.orbit.companion.core.CompanionState
import kotlin.random.Random

/** Upright Solar system. Fleet, thread selection and approvals remain server-owned. */
@Composable
internal fun SolarHomeMap(state: CompanionState, bottomInset: Dp, onOpen: (Chat) -> Unit,
    onManage: (Chat) -> Unit, onCreateThread: (Bot) -> Unit, onCreateGroup: () -> Unit) {
    val visible = remember(state.bots) { state.bots.filter { it.hidden != true || it.system == "orbit" } }
    val sun = visible.firstOrNull { solarSkin(it) == "sun" }
    val planets = visible.filter { it.id != sun?.id }
    val locations = remember { mutableStateMapOf<String, Pair<Offset, Float>>() }
    var origin by remember { mutableStateOf(Offset.Zero) }
    val stars = remember { val random = Random(71); List(60) { Offset(random.nextFloat(), random.nextFloat()) } }
    Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).testTag("solar-home-map").onGloballyPositioned { origin = it.positionInRoot() }) {
        Canvas(Modifier.fillMaxSize()) {
            stars.forEachIndexed { index, point -> drawCircle(Color.White.copy(alpha = if (index % 5 == 0) .34f else .13f),
                if (index % 5 == 0) 1.3f else .65f, Offset(point.x * size.width, point.y * size.height)) }
            drawOval(Color(0xFFDDBD89).copy(alpha = .12f), Offset(size.width * .16f, size.height * .09f),
                Size(size.width * .68f, size.height * .82f), style = Stroke(1f))
            val source = sun?.let { locations[it.id] }
            if (source != null) for (planet in planets) {
                val target = locations[planet.id] ?: continue
                val from = source.first - origin; val to = target.first - origin
                val vector = to - from
                val length = vector.getDistance()
                val span = length - source.second - target.second
                if (span <= 0) continue
                val direction = vector / length
                val count = (span / 5.dp.toPx()).toInt().coerceIn(8, 180)
                for (index in 0 until count) {
                    val t = (index + .5f) / count
                    val drift = kotlin.math.sin(index * 2.399f + (planet.id.hashCode() and 255)) * 2.dp.toPx()
                    val point = from + direction * (source.second + t * span) + Offset(-direction.y, direction.x) * drift
                    drawCircle(Color(0xFFDDBD89).copy(alpha = .2f + (index % 4) * .08f),
                        (.45f + (index % 3) * .2f).dp.toPx(), point)
                }
            }
        }
        Column(Modifier.fillMaxWidth().verticalScroll(rememberScrollState())
            .padding(top = 24.dp, bottom = bottomInset + 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            if (sun != null) SolarMapBot(sun, state, 104.dp, onOpen, onManage, onCreateThread) { id, point, radius -> locations[id] = point to radius }
            else {
                SolarCelestial("sun", 104.dp, MausState.IDLE)
                Text(stringResource(R.string.solar_your_system), fontSize = 18.sp, fontWeight = FontWeight.Medium)
            }
            Spacer(Modifier.height(32.dp))
            if (visible.isEmpty()) Text(stringResource(R.string.solar_first_agent), color = MaterialTheme.colorScheme.onSurfaceVariant)
            planets.chunked(2).forEach { pair ->
                Row(Modifier.fillMaxWidth().widthIn(max = 600.dp).padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.Top) {
                    pair.forEach { bot -> SolarMapBot(bot, state, 76.dp, onOpen, onManage, onCreateThread) { id, point, radius -> locations[id] = point to radius } }
                }
                Spacer(Modifier.height(32.dp))
            }
            if (state.rooms.isNotEmpty()) {
                Text(stringResource(R.string.solar_channels), color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                state.rooms.forEach { room -> TextButton(onClick = { onOpen(Chat.RoomChat(room)) }) { Text(room.name) } }
            }
            TextButton(onClick = onCreateGroup) { Text(stringResource(R.string.solar_new_channel)) }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun SolarMapBot(bot: Bot, state: CompanionState, planetSize: Dp, onOpen: (Chat) -> Unit,
    onManage: (Chat) -> Unit, onCreateThread: (Bot) -> Unit, onPosition: (String, Offset, Float) -> Unit) {
    val chat = Chat.BotChat(bot)
    val waiting = state.pendingApprovals.any { it.threadId == bot.threadId }
    val openLabel = stringResource(R.string.solar_open_agent, bot.name)
    val manageLabel = stringResource(R.string.solar_manage_threads)
    val createLabel = stringResource(R.string.solar_new_thread)
    Column(Modifier.widthIn(min = 120.dp, max = 160.dp).combinedClickable(role = Role.Button,
        onClickLabel = openLabel, onLongClickLabel = manageLabel, onClick = { onOpen(chat) },
        onLongClick = { onManage(chat) }).semantics {
            customActions = listOf(CustomAccessibilityAction(createLabel) { onCreateThread(bot); true })
        }.padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        BotAvatar(bot, planetSize, MausState.forChat(chat, state), modifier = Modifier.onGloballyPositioned {
            onPosition(bot.id, it.positionInRoot() + Offset(it.size.width / 2f, it.size.height / 2f), it.size.width * .54f)
        })
        Spacer(Modifier.height(8.dp))
        Text(bot.name, fontSize = 17.sp, fontWeight = FontWeight.Medium, maxLines = 2, overflow = TextOverflow.Ellipsis)
        if (!bot.section.isNullOrBlank()) Text(bot.section.orEmpty(), fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        if (bot.tasks.orEmpty().size > 1) Text(chat.threadTitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant,
            maxLines = 1, overflow = TextOverflow.Ellipsis)
        Text(stringResource(when { waiting -> R.string.solar_needs_attention; bot.busy == true -> R.string.solar_working; bot.unread -> R.string.solar_new_reply; else -> R.string.solar_ready }),
            fontSize = 12.sp, color = if (waiting || bot.unread) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
