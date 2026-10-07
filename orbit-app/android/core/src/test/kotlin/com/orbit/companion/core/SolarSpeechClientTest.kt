package com.orbit.companion.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlinx.coroutines.runBlocking
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer

class SolarSpeechClientTest {
    @Test fun `voice uses paired authentication and never retries a refused turn`() = runBlocking {
        MockWebServer().use { server ->
            server.start()
            val connection = requireNotNull(Connection.parse(server.url("/").toString()))
            val client = CompanionClient(connection, "fixture-device-token")
            server.enqueue(MockResponse().setHeader("Content-Type", "application/json").setBody("""{"text":"Olá"}"""))
            assertEquals("Olá", client.transcribeSolarVoice("AQIDBA==", "pt"))
            val request = server.takeRequest()
            assertEquals("POST", request.method)
            assertEquals("/api/solar-voice/transcribe", request.path)
            assertEquals("Bearer fixture-device-token", request.getHeader("Authorization"))
            assertEquals("""{"audio":"AQIDBA==","language":"pt"}""", request.body.readUtf8())
            server.enqueue(MockResponse().setResponseCode(429).setBody("""{"error":"Voice recognition is busy"}"""))
            assertFailsWith<APIError> { client.transcribeSolarVoice("AQIDBA==", "pt") }
            assertEquals(2, server.requestCount)
        }
    }
}
