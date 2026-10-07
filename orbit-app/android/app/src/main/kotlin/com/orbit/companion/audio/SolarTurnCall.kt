package com.orbit.companion.audio

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/** One foreground call, one turn at a time. No reconnect replay or saved audio. */
internal class SolarTurnCall(
    private val scope: CoroutineScope,
    private val capture: suspend () -> ByteArray,
    private val transcribe: suspend (ByteArray) -> String,
    private val reply: suspend (String) -> String,
    private val speak: suspend (String) -> Unit,
    private val release: () -> Unit,
) {
    enum class Phase { IDLE, LISTENING, TRANSCRIBING, WAITING, SPEAKING, ERROR }
    private val mutablePhase = MutableStateFlow(Phase.IDLE)
    val phase = mutablePhase.asStateFlow()
    private val mutableError = MutableStateFlow<String?>(null)
    val error = mutableError.asStateFlow()
    private var job: Job? = null
    private var generation = 0

    fun start() {
        if (job?.isActive == true) return
        val token = ++generation
        mutableError.value = null
        job = scope.launch {
            try {
                while (token == generation) {
                    mutablePhase.value = Phase.LISTENING
                    val audio = capture()
                    currentCoroutineContext().ensureActive()
                    if (audio.isEmpty()) { delay(600); continue }
                    mutablePhase.value = Phase.TRANSCRIBING
                    val text = transcribe(audio).trim()
                    currentCoroutineContext().ensureActive()
                    if (text.isEmpty()) { delay(600); continue }
                    mutablePhase.value = Phase.WAITING
                    val answer = reply(text)
                    currentCoroutineContext().ensureActive()
                    mutablePhase.value = Phase.SPEAKING
                    speak(answer)
                    currentCoroutineContext().ensureActive()
                }
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (failure: Exception) {
                if (token == generation) {
                    mutableError.value = failure.message ?: "The call stopped. Try again."
                    mutablePhase.value = Phase.ERROR
                }
            } finally {
                if (token == generation) release()
            }
        }
    }

    fun stop() {
        generation++
        job?.cancel()
        job = null
        release()
        mutableError.value = null
        mutablePhase.value = Phase.IDLE
    }
}
