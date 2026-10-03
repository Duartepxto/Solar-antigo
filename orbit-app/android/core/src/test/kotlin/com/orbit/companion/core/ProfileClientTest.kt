package com.orbit.companion.core

import kotlinx.coroutines.runBlocking
import kotlinx.serialization.SerializationException
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import okhttp3.OkHttpClient
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class ProfileClientTest {
    private lateinit var server: MockWebServer
    private lateinit var connection: Connection
    private lateinit var client: CompanionClient

    @BeforeTest
    fun setUp() {
        server = MockWebServer()
        server.start()
        connection = requireNotNull(Connection.parse(server.url("/").toString()))
        client = CompanionClient(connection, "paired-token")
    }

    @AfterTest
    fun tearDown() {
        server.shutdown()
    }

    @Test
    fun profilePatchPreservesServerLimitsWithoutClientTruncation() = runBlocking {
        val name = "n".repeat(100)
        val title = "t".repeat(200)
        val description = "d".repeat(4_000)
        val voice = "v".repeat(200)
        server.enqueue(json(botResponse()))

        client.updateProfile(
            "profile-bot",
            BotProfilePatch(name = name, title = title, description = description, voice = voice),
        )

        val request = server.takeRequest()
        assertEquals("PATCH", request.method)
        assertEquals("/api/bots/profile-bot/profile", request.path)
        val body = CompanionJson.parseToJsonElement(request.body.readUtf8()).jsonObject
        assertEquals(name, body.getValue("name").jsonPrimitive.content)
        assertEquals(title, body.getValue("title").jsonPrimitive.content)
        assertEquals(description, body.getValue("description").jsonPrimitive.content)
        assertEquals(voice, body.getValue("voice").jsonPrimitive.content)
    }

    @Test
    fun profilePatchPreservesAnExplicitEmptyWorkspaceDefaultVoice() {
        val body = CompanionJson.parseToJsonElement(
            CompanionJson.encodeToString(BotProfilePatch(voice = "")),
        ).jsonObject

        assertEquals(setOf("voice"), body.keys)
        assertEquals("", body.getValue("voice").jsonPrimitive.content)
    }

    @Test
    fun profilePatchOmitsUnsetFieldsAndCanSendAnEmptyPayload() = runBlocking {
        server.enqueue(json(botResponse()))
        client.updateProfile("profile-bot", BotProfilePatch())

        val request = server.takeRequest()
        assertEquals("{}", request.body.readUtf8())
        assertEquals("application/json; charset=utf-8", request.getHeader("Content-Type"))
        assertEquals("Bearer paired-token", request.getHeader("Authorization"))
    }

    @Test
    fun profilePatchIsClosedToThePairedSafeSurface() {
        val encoded = CompanionJson.encodeToString(
            BotProfilePatch(
                name = "Scout",
                title = "Researcher",
                description = "Finds evidence.",
                notifications = false,
                voice = "voice-1",
                speakReplies = true,
            ),
        )
        assertEquals(
            setOf(
                "name",
                "title",
                "description",
                "notifications",
                "voice",
                "speakReplies",
            ),
            CompanionJson.parseToJsonElement(encoded).jsonObject.keys,
        )
        assertFailsWith<SerializationException> {
            CompanionJson.decodeFromString<BotProfilePatch>("""{"color":"red"}""")
        }
        // The retired portrait fields are not part of the paired-safe surface.
        assertFailsWith<SerializationException> {
            CompanionJson.decodeFromString<BotProfilePatch>("""{"avatarCrop":"circle"}""")
        }
    }

    @Test
    fun profileClientSendsOnlyFieldsOwnedByTheAction() = runBlocking {
        server.enqueue(json(botResponse()))

        client.updateProfile(
            "profile-bot",
            BotProfilePatch(speakReplies = true),
        )

        val body = CompanionJson.parseToJsonElement(server.takeRequest().body.readUtf8()).jsonObject
        assertEquals(setOf("speakReplies"), body.keys)
        assertEquals("true", body.getValue("speakReplies").jsonPrimitive.content)
    }

    @Test
    fun voiceRoutesReturnOnlyLabelsOrAudioAndBoundThePreviewText() = runBlocking {
        server.enqueue(json(
            """{"voices":[{"id":"voice-1","label":"Warm","description":"Calm"}]}""",
        ))
        server.enqueue(MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", "audio/mpeg")
            .setBody("audio-bytes"))

        val voices = client.voices()
        assertEquals(listOf(Voice("voice-1", "Warm", "Calm")), voices)
        assertContentEquals(
            "audio-bytes".toByteArray(),
            client.previewVoice("x".repeat(501), "voice-1"),
        )

        val listRequest = server.takeRequest()
        assertEquals("GET", listRequest.method)
        assertEquals("/api/tts/voices", listRequest.path)
        val speakRequest = server.takeRequest()
        assertEquals("POST", speakRequest.method)
        assertEquals("/api/tts/speak", speakRequest.path)
        val body = CompanionJson.parseToJsonElement(speakRequest.body.readUtf8()).jsonObject
        assertEquals(setOf("text", "voiceId"), body.keys)
        assertEquals("x".repeat(500), body.getValue("text").jsonPrimitive.content)
        assertEquals("voice-1", body.getValue("voiceId").jsonPrimitive.content)
    }

    @Test
    fun overviewGrantsReachTheProfileSheetThroughTheSameClient() = runBlocking {
        server.enqueue(json(fixtureText("bot-overview-grants")))

        val overview = client.overview("bot-1")

        assertEquals("GET", server.takeRequest().method)
        assertEquals(
            listOf(
                BotOverviewGrant("gmail", BotOverviewGrantLevel.Partial, toolCount = 2),
                BotOverviewGrant("notion", BotOverviewGrantLevel.None, toolCount = 0),
                BotOverviewGrant("slack", BotOverviewGrantLevel.All, toolCount = 0),
            ),
            overview.grants,
        )
    }

    private fun json(body: String, code: Int = 200): MockResponse = MockResponse()
        .setResponseCode(code)
        .setHeader("Content-Type", "application/json")
        .setBody(body)

    private fun botResponse(): String = """{"bot":${profileBotJson()}}"""

}
