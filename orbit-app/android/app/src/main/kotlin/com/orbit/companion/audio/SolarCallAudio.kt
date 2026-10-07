package com.orbit.companion.audio

import android.content.Context
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.os.SystemClock
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.orbit.companion.dictation.DictationAudioFocusGate
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.Locale
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/** Memory-only mono PCM. The PC performs transcription; the phone reads replies. */
internal class SolarCallAudio(context: Context) {
    private val appContext = context.applicationContext
    private val recorder = AtomicReference<AudioRecord?>(null)
    private val finishing = AtomicBoolean(false)
    private val interrupted = AtomicBoolean(false)
    private val focus = DictationAudioFocusGate(appContext)
    private val captureGate = Mutex()
    private var speech: TextToSpeech? = null

    fun finishTurn() { finishing.set(true) }

    suspend fun capture(): ByteArray = withContext(Dispatchers.IO) { captureGate.withLock {
        finishing.set(false)
        interrupted.set(false)
        check(focus.request { interrupted.set(true); finishTurn() }) { "Microphone is in use. Try again." }
        val minimum = AudioRecord.getMinBufferSize(16000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        check(minimum > 0) { "This phone cannot record 16 kHz audio." }
        val input = AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, 16000,
            AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, maxOf(minimum, 4096))
        check(input.state == AudioRecord.STATE_INITIALIZED) { input.release(); "Microphone could not start." }
        check(recorder.compareAndSet(null, input)) { input.release(); "Microphone is already recording." }
        try {
            input.startRecording()
            val pcm = ByteArrayOutputStream()
            val buffer = ShortArray(1024)
            val limit = 16000 * 2 * 29
            var spoke = false
            var lastVoice = SystemClock.elapsedRealtime()
            while (!finishing.get() && pcm.size() < limit) {
                currentCoroutineContext().ensureActive()
                val count = input.read(buffer, 0, minOf(buffer.size, (limit - pcm.size()) / 2))
                check(count > 0) { "Microphone recording failed." }
                var power = 0.0
                for (index in 0 until count) {
                    val sample = buffer[index].toInt()
                    pcm.write(sample and 255); pcm.write((sample shr 8) and 255)
                    power += (sample / 32768.0) * (sample / 32768.0)
                }
                val now = SystemClock.elapsedRealtime()
                if (kotlin.math.sqrt(power / count) > .012) { spoke = true; lastVoice = now }
                if (spoke && now - lastVoice >= 850) finishing.set(true)
            }
            currentCoroutineContext().ensureActive()
            check(!interrupted.get()) { "Another app interrupted the microphone. Start the call again." }
            check(pcm.size() > 0) { "No audio recorded. Try again." }
            if (spoke) wav(pcm.toByteArray()) else byteArrayOf()
        } finally {
            if (recorder.compareAndSet(input, null)) {
                runCatching { input.stop() }
                input.release()
            }
            focus.abandon()
        }
    } }

    suspend fun speak(text: String) = withContext(Dispatchers.Main) {
        check(text.isNotBlank()) { "The reply has no text to read aloud." }
        val ready = CompletableDeferred<Int>()
        val engine = TextToSpeech(appContext) { status -> ready.complete(status) }
        speech = engine
        try {
            check(withTimeout(15000) { ready.await() } == TextToSpeech.SUCCESS) { "Phone speech is unavailable." }
            val language = engine.setLanguage(Locale.getDefault())
            check(language != TextToSpeech.LANG_MISSING_DATA && language != TextToSpeech.LANG_NOT_SUPPORTED) {
                "Install a speech voice for your phone's language in Android settings."
            }
            for (chunk in text.chunked(TextToSpeech.getMaxSpeechInputLength() - 1)) withTimeout(180000) {
                suspendCancellableCoroutine<Unit> { pending ->
                    val id = UUID.randomUUID().toString()
                    engine.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                        @Deprecated("Platform callback")
                        override fun onStart(utteranceId: String?) = Unit
                        override fun onDone(utteranceId: String?) {
                            if (utteranceId == id && pending.isActive) pending.resume(Unit)
                        }
                        @Deprecated("Platform callback")
                        override fun onError(utteranceId: String?) {
                            if (utteranceId == id && pending.isActive) pending.resumeWithException(
                                IllegalStateException("Phone speech failed. Start the call again."))
                        }
                    })
                    pending.invokeOnCancellation { engine.stop() }
                    if (engine.speak(chunk, TextToSpeech.QUEUE_FLUSH, null, id)
                        == TextToSpeech.ERROR && pending.isActive) {
                        pending.resumeWithException(IllegalStateException("Phone speech could not start."))
                    }
                }
            }
        } finally {
            if (speech === engine) speech = null
            engine.stop()
            engine.shutdown()
        }
    }

    fun release() {
        finishing.set(true)
        recorder.getAndSet(null)?.let { input -> runCatching { input.stop() }; input.release() }
        speech?.let { it.stop(); it.shutdown() }
        speech = null
        focus.abandon()
    }

    companion object {
        internal fun wav(pcm: ByteArray): ByteArray {
            require(pcm.size <= 928000 && pcm.size % 2 == 0)
            return ByteBuffer.allocate(44 + pcm.size).order(ByteOrder.LITTLE_ENDIAN).apply {
                put("RIFF".toByteArray()); putInt(36 + pcm.size); put("WAVEfmt ".toByteArray())
                putInt(16); putShort(1); putShort(1); putInt(16000); putInt(32000)
                putShort(2); putShort(16); put("data".toByteArray()); putInt(pcm.size); put(pcm)
            }.array()
        }
    }
}
