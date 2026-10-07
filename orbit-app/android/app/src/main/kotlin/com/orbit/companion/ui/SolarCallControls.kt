package com.orbit.companion.ui

import android.util.Base64
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import com.orbit.companion.R
import androidx.compose.ui.unit.dp
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.orbit.companion.audio.SolarCallAudio
import com.orbit.companion.audio.SolarTurnCall
import com.orbit.companion.core.Chat
import com.orbit.companion.core.Message
import com.orbit.companion.core.Session
import com.orbit.companion.core.chat
import com.orbit.companion.core.target
import java.util.Locale
import kotlin.coroutines.resume
import kotlinx.coroutines.delay
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeout

/** Inline foreground controls, on the same thread as the typed conversation. */
@Composable
internal fun SolarCallControls(chat: Chat, blocked: Boolean) {
    val context = LocalContext.current
    val environment = LocalCompanion.current
    val scope = rememberCoroutineScope()
    val lifecycle = LocalLifecycleOwner.current
    val session = environment.session
    val audio = remember(chat.conversationId) { SolarCallAudio(context) }
    val call = remember(chat.conversationId) {
        SolarTurnCall(scope,
            capture = {
                val granted = suspendCancellableCoroutine<Boolean> { pending ->
                    environment.mic.ensure { allowed -> if (pending.isActive) pending.resume(allowed) }
                }
                check(granted) { "Allow microphone access to start a call." }
                check(session.status.value == Session.Status.Live) { "This computer is offline." }
                audio.capture()
            },
            transcribe = { recording -> session.transcribeSolarVoice(
                Base64.encodeToString(recording, Base64.NO_WRAP), Locale.getDefault().language) },
            reply = { text ->
                val connectionId = session.connection.value?.id
                val selected = session.state.value.chat(chat.target)
                    ?: error("This conversation is no longer available.")
                check(!selected.busy) { "The agent is busy. Start the call when it finishes." }
                val previous = session.state.value.visibleTranscript(chat.threadId).map { it.id }.toSet()
                check(session.send(text, emptyList(), selected)) {
                    session.actionError ?: "The message could not be sent. Start the call again."
                }
                withTimeout(600000) {
                    var answer: String? = null
                    while (answer == null) {
                        check(session.connection.value?.id == connectionId && session.status.value == Session.Status.Live) {
                            "The connection was lost. Start the call again when the computer reconnects."
                        }
                        val snapshot = session.state.value
                        val current = snapshot.chat(chat.target) ?: error("This conversation is no longer available.")
                        check(snapshot.pendingApprovals.none { it.threadId == chat.threadId }) {
                            "An approval needs your attention in the conversation. Start the call again afterwards."
                        }
                        if (!current.busy && snapshot.streaming[chat.threadId].isNullOrEmpty()) {
                            answer = snapshot.visibleTranscript(chat.threadId).lastOrNull {
                                it.id !in previous && it.role == Message.Role.BOT && it.kind == Message.Kind.TEXT && !it.text.isNullOrBlank()
                            }?.text
                        }
                        if (answer == null) delay(250)
                    }
                    answer
                }
            },
            speak = { audio.speak(it) },
            release = audio::release,
        )
    }
    val phase by call.phase.collectAsState()
    val error by call.error.collectAsState()
    val connected by session.status.collectAsState()
    val connection by session.connection.collectAsState()
    DisposableEffect(lifecycle, call) {
        val observer = object : DefaultLifecycleObserver {
            override fun onStop(owner: LifecycleOwner) { call.stop() }
        }
        lifecycle.lifecycle.addObserver(observer)
        onDispose { lifecycle.lifecycle.removeObserver(observer); call.stop() }
    }
    // A new PC or a lost stream ends a call; there is no automatic replay.
    DisposableEffect(connection?.id, connected) { onDispose { call.stop() } }
    DisposableEffect(blocked) { if (blocked) call.stop(); onDispose {} }
    SolarCallRow(phase, error, chat.name, !blocked && !chat.busy && connected == Session.Status.Live,
        onToggle = {
            if (phase != SolarTurnCall.Phase.IDLE && phase != SolarTurnCall.Phase.ERROR) call.stop() else {
                environment.dictation.stop()
                environment.voiceNotes.pause()
                call.start()
            }
        }, onSend = audio::finishTurn)
}

@Composable
internal fun SolarCallRow(phase: SolarTurnCall.Phase, error: String?, name: String, enabled: Boolean,
    onToggle: () -> Unit, onSend: () -> Unit) {
    val active = phase != SolarTurnCall.Phase.IDLE && phase != SolarTurnCall.Phase.ERROR
    Column(Modifier.fillMaxWidth().padding(horizontal = 12.dp)) {
        Row {
            TextButton(onClick = onToggle, enabled = active || enabled) {
                Text(stringResource(if (active) R.string.solar_end_call else R.string.solar_start_call))
            }
            if (phase == SolarTurnCall.Phase.LISTENING) {
                TextButton(onClick = onSend) { Text(stringResource(R.string.solar_send_voice)) }
            }
        }
        if (active || error != null) Text(
            error ?: when (phase) {
                SolarTurnCall.Phase.LISTENING -> stringResource(R.string.solar_listening)
                SolarTurnCall.Phase.TRANSCRIBING -> stringResource(R.string.solar_transcribing)
                SolarTurnCall.Phase.WAITING -> stringResource(R.string.solar_waiting, name)
                SolarTurnCall.Phase.SPEAKING -> stringResource(R.string.solar_speaking)
                else -> ""
            }, style = MaterialTheme.typography.bodySmall,
            color = if (error != null) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
