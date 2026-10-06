package com.orbit.companion.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class SolarPairingTest {
    private val token = "orbit_pair_" + "a".repeat(43)

    @Test
    fun solarBrowserQrWorksInTheNativeScannerWithoutChangingItsRoute() {
        for (origin in listOf("http://192.168.1.81:8810", "https://solar.example:8443", "http://pc.tail.ts.net:8810")) {
            val invite = assertNotNull(PairingInvite.parse("$origin/solar#token=$token"))
            assertEquals(token, invite.credential)
            assertEquals(origin, invite.connection.activeEndpoint?.url)
            assertEquals(listOf(origin), invite.connection.automaticEndpoints.map { it.url })
        }
    }

    @Test
    fun solarQrRejectsMalformedCredentialsAndUnapprovedPublicCleartextRoutes() {
        for (url in listOf(
            "http://192.168.1.81:8810/solar",
            "http://192.168.1.81:8810/solar?token=$token",
            "http://192.168.1.81:8810/solar#token=bad",
            "http://192.168.1.81:8810/solar#token=$token&token=$token",
            "http://192.168.1.81:8810/solar#token=$token&address=other.example",
            "http://user:password@192.168.1.81:8810/solar#token=$token",
            "http://8.8.8.8:8810/solar#token=$token",
            "http://public.example:8810/solar#token=$token",
        )) assertNull(PairingInvite.parse(url), url)
    }
}
