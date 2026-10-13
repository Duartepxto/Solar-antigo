package com.orbit.companion.permissions

import android.Manifest
import com.orbit.companion.core.Connection
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class CompanionPermissionsTest {
    @Test
    fun api37DirectLanPairingRequestsOnlyLocalNetworkAndOnlyWhileMissing() {
        var allowed = false
        val permissions = CompanionPermissions(sdkInt = 37, granted = { allowed })
        val connection = requireNotNull(Connection.parse("192.168.1.42:8810"))
        assertEquals(listOf(CompanionPermissions.PERMISSION_ACCESS_LOCAL_NETWORK), permissions.localPairingPermissions(connection).toList())
        allowed = true
        assertTrue(permissions.localPairingPermissions(connection).isEmpty())
        assertTrue(CompanionPermissions(sdkInt = 36, granted = { false }).localPairingPermissions(connection).isEmpty())
    }

    @Test
    fun remoteTailnetAndLoopbackPairingNeverRequestLanAccess() {
        val permissions = CompanionPermissions(sdkInt = 37, granted = { false })
        for (address in listOf("https://solar.example", "https://8.8.8.8", "pc.tail1234.ts.net:8810", "127.0.0.1:8810", "[::1]:8810")) {
            assertTrue(permissions.localPairingPermissions(requireNotNull(Connection.parse(address))).isEmpty(), address)
        }
    }

    @Test
    fun localLiteralAndBonjourRoutesNeedTheGrantRegardlessOfHttps() {
        val permissions = CompanionPermissions(sdkInt = 37, granted = { false })
        for (address in listOf("10.0.0.5", "172.16.0.5", "https://192.168.1.42", "169.254.1.2", "100.64.1.2", "[fe80::1%25wlan0]:8810", "[fd00::42]:8810", "pc.local:8810")) {
            assertEquals(listOf(CompanionPermissions.PERMISSION_ACCESS_LOCAL_NETWORK), permissions.localPairingPermissions(requireNotNull(Connection.parse(address))).toList(), address)
        }
    }

    @Test
    fun onlyVpnRoutedConnectionsAreExcludedAndLanBypassStillNeedsTheGrant() {
        val permissions = CompanionPermissions(sdkInt = 37, granted = { false }, vpnRoute = { it.hostAddress == "100.64.1.2" })
        assertTrue(permissions.localPairingPermissions(requireNotNull(Connection.parse("100.64.1.2:8810"))).isEmpty())
        assertEquals(listOf(CompanionPermissions.PERMISSION_ACCESS_LOCAL_NETWORK), permissions.localPairingPermissions(requireNotNull(Connection.parse("192.168.1.42:8810"))).toList())
        assertEquals(listOf(CompanionPermissions.PERMISSION_ACCESS_LOCAL_NETWORK), permissions.localPairingPermissions(requireNotNull(Connection.parse("pc.local:8810"))).toList())
    }

    @Test
    fun api37RequestsOnlyWhatLocalDiscoveryNeeds() {
        val granted = mutableSetOf<String>()
        val permissions = CompanionPermissions(
            sdkInt = 37,
            granted = { it in granted },
        )
        assertEquals(
            listOf(
                Manifest.permission.NEARBY_WIFI_DEVICES,
                CompanionPermissions.PERMISSION_ACCESS_LOCAL_NETWORK,
            ),
            permissions.discoveryPermissions().toList(),
        )
        assertFalse(
            permissions.discoveryPermissions().contains(Manifest.permission.POST_NOTIFICATIONS),
            "opening the list of nearby computers must not ask for notifications",
        )
        assertTrue(permissions.snapshot.value.discoveryNeedsRequest)
    }

    @Test
    fun api32NeedsNoRuntimeCompanionPermissions() {
        val permissions = CompanionPermissions(
            sdkInt = 32,
            granted = { false },
        )
        assertTrue(permissions.discoveryPermissions().isEmpty())
    }

    @Test
    fun refreshUpdatesObservableDiscoveryStateFromPlatformGrants() {
        val granted = mutableSetOf<String>()
        val permissions = CompanionPermissions(
            sdkInt = 33,
            granted = { it in granted },
        )
        assertTrue(permissions.snapshot.value.discoveryNeedsRequest)
        granted += Manifest.permission.NEARBY_WIFI_DEVICES
        val snap = permissions.refresh()
        assertFalse(snap.discoveryNeedsRequest)
    }

    @Test
    fun recordAudioIsNeverPartOfTheStartupPrompt() {
        var recordAudioGranted = false
        val permissions = CompanionPermissions(
            sdkInt = 37,
            granted = { it == Manifest.permission.RECORD_AUDIO && recordAudioGranted },
        )
        assertFalse(permissions.recordAudioGranted())
        assertFalse(
            permissions.discoveryPermissions().contains(Manifest.permission.RECORD_AUDIO),
            "RECORD_AUDIO must only be asked from the mic button",
        )
        recordAudioGranted = true
        assertTrue(permissions.recordAudioGranted())
    }
}
