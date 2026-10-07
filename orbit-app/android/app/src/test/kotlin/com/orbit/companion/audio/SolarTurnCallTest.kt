package com.orbit.companion.audio

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.test.runCurrent
import kotlinx.coroutines.test.runTest

@OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
class SolarTurnCallTest {
    @Test fun `one turn transcribes sends speaks and only then listens again`() = runTest {
        var recordings = 0
        val spoken = CompletableDeferred<Unit>()
        val events = mutableListOf<String>()
        val call = SolarTurnCall(backgroundScope,
            capture = { recordings++; if (recordings > 1) awaitCancellation(); byteArrayOf(1) },
            transcribe = { events += "transcribe"; "Hello" },
            reply = { events += "send:$it"; "Hi" },
            speak = { events += "speak:$it"; spoken.await() },
            release = {},
        )
        call.start(); runCurrent()
        assertEquals(listOf("transcribe", "send:Hello", "speak:Hi"), events)
        assertEquals(1, recordings)
        assertEquals(SolarTurnCall.Phase.SPEAKING, call.phase.value)
        spoken.complete(Unit); runCurrent()
        assertEquals(2, recordings)
        assertEquals(SolarTurnCall.Phase.LISTENING, call.phase.value)
        call.stop()
    }

    @Test fun `stopping while transcribing cannot send a late command`() = runTest {
        val result = CompletableDeferred<String>()
        var sends = 0
        var releases = 0
        val call = SolarTurnCall(backgroundScope, { byteArrayOf(1) }, { result.await() },
            { sends++; "Reply" }, {}, { releases++ })
        call.start(); runCurrent()
        assertEquals(SolarTurnCall.Phase.TRANSCRIBING, call.phase.value)
        call.stop(); result.complete("Late command"); runCurrent()
        assertEquals(0, sends)
        assertEquals(1, releases)
        assertEquals(SolarTurnCall.Phase.IDLE, call.phase.value)
    }

    @Test fun `a network error stops without replay or automatic microphone restart`() = runTest {
        var recordings = 0
        var sends = 0
        val call = SolarTurnCall(backgroundScope, { recordings++; byteArrayOf(1) }, { "Hello" },
            { sends++; error("Connection lost") }, {}, {})
        call.start(); runCurrent()
        assertEquals(SolarTurnCall.Phase.ERROR, call.phase.value)
        assertEquals("Connection lost", call.error.value)
        assertEquals(1, sends)
        assertEquals(1, recordings)
    }

    @Test fun `silence does not become an assistant command`() = runTest {
        var sends = 0
        val call = SolarTurnCall(backgroundScope, { byteArrayOf(1) }, { " " },
            { sends++; "Reply" }, {}, {})
        call.start(); runCurrent()
        assertEquals(0, sends)
        call.stop()
    }

    @Test fun `PCM container carries bounded complete samples`() {
        val data = SolarCallAudio.wav(byteArrayOf(1, 2, 3, 4))
        assertEquals(48, data.size)
        assertEquals("RIFF", data.take(4).toByteArray().toString(Charsets.US_ASCII))
        assertEquals(16000, java.nio.ByteBuffer.wrap(data).order(java.nio.ByteOrder.LITTLE_ENDIAN).getInt(24))
        assertTrue(data.takeLast(4).toByteArray().contentEquals(byteArrayOf(1, 2, 3, 4)))
    }
}
