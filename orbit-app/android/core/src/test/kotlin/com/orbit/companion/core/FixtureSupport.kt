package com.orbit.companion.core

import kotlinx.serialization.decodeFromString

internal fun fixtureBytes(name: String): ByteArray =
    checkNotNull(object {}.javaClass.classLoader.getResourceAsStream("$name.json")) {
        "missing fixture $name.json — run scripts/capture-companion-fixtures.mjs"
    }.use { it.readBytes() }

internal fun fixtureText(name: String): String = fixtureBytes(name).toString(Charsets.UTF_8)

internal inline fun <reified T> decodeFixture(name: String): T =
    CompanionJson.decodeFromString(fixtureText(name))


/**
 * One bot as a paired profile route returns it. It still carries the retired
 * portrait fields an older computer sends, which decoding must simply ignore.
 */
internal fun profileBotJson(): String =
    """{"id":"profile-bot","threadId":"profile-thread","name":"Scout","title":"Researcher",""" +
        """"description":"Finds evidence.","notifications":true,"color":"green","unread":false,""" +
        """"modelSelection":{"instanceId":"claude","model":"claude-sonnet"},"createdAt":1,""" +
        """"voice":"voice-1","speakReplies":true,""" +
        """"avatarUrl":"/api/attachments/123e4567-e89b-12d3-a456-426614174000.webp","avatarCrop":"rounded"}"""
