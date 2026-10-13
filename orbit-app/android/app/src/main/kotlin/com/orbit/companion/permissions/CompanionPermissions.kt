package com.orbit.companion.permissions

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.RouteInfo
import android.os.Build
import androidx.core.content.ContextCompat
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.orbit.companion.core.Connection
import java.net.InetAddress
import java.util.Locale

/** Platform permissions used by local discovery and composer dictation. */
class CompanionPermissions(
    private val sdkInt: Int = Build.VERSION.SDK_INT,
    private val granted: (String) -> Boolean,
    private val vpnRoute: (InetAddress) -> Boolean = { false },
) {
    constructor(
        context: Context,
        sdkInt: Int = Build.VERSION.SDK_INT,
    ) : this(
        sdkInt = sdkInt,
        granted = { permission ->
            ContextCompat.checkSelfPermission(context.applicationContext, permission) ==
                PackageManager.PERMISSION_GRANTED
        },
        vpnRoute = { address ->
            val networks = context.applicationContext.getSystemService(ConnectivityManager::class.java)
            val active = networks?.activeNetwork
            if (networks?.getNetworkCapabilities(active)?.hasTransport(NetworkCapabilities.TRANSPORT_VPN) == true) {
                // A running VPN may tunnel Tailscale IPs but bypass the home LAN.
                // Check its most specific route, including explicit throw routes.
                networks.getLinkProperties(active)?.routes
                    ?.filter { it.matches(address) }
                    ?.maxByOrNull { it.destination.prefixLength }
                    ?.type == RouteInfo.RTN_UNICAST
            } else false
        },
    )

    data class Snapshot(val missingDiscovery: List<String>) {
        val discoveryNeedsRequest: Boolean get() = missingDiscovery.isNotEmpty()
    }

    private val _snapshot = MutableStateFlow(read())
    val snapshot: StateFlow<Snapshot> = _snapshot.asStateFlow()

    fun refresh(): Snapshot {
        val next = read()
        _snapshot.value = next
        return next
    }

    /**
     * What a local browse needs. Called when someone opens the list of nearby
     * computers, never on the way to the QR scanner, which needs none of it.
     */
    fun discoveryPermissions(): Array<String> = refresh().missingDiscovery.toTypedArray()

    /** A QR avoids discovery, but a direct LAN connection still needs API 37's grant.
     * Called only on confirmation. Never resolve arbitrary DNS to classify a route. */
    fun localPairingPermissions(connection: Connection): Array<String> {
        if (sdkInt < LOCAL_NETWORK_SDK || granted(PERMISSION_ACCESS_LOCAL_NETWORK)) return emptyArray()
        val host = (connection.baseUrl?.host ?: connection.host)
            .lowercase(Locale.ROOT).removeSurrounding("[", "]").trimEnd('.')
        if (host == "localhost" || host.endsWith(".ts.net")) return emptyArray()
        // .local discovery/resolution itself uses the LAN, even with a VPN enabled.
        if (host.endsWith(".local")) return arrayOf(PERMISSION_ACCESS_LOCAL_NETWORK)
        val literal = host.substringBefore('%')
        if (':' !in literal && !literal.matches(Regex("[0-9]+(?:\\.[0-9]+){3}"))) return emptyArray()
        val address = runCatching { InetAddress.getByName(literal) }.getOrNull() ?: return emptyArray()
        if (address.isLoopbackAddress || address.isAnyLocalAddress) return emptyArray()
        if (vpnRoute(address)) return emptyArray()
        val bytes = address.address
        val cgnat = bytes.size == 4 && (bytes[0].toInt() and 0xff) == 100 &&
            (bytes[1].toInt() and 0xff) in 64..127
        val ipv6Local = bytes.size == 16 && (bytes[0].toInt() and 0xfe) == 0xfc
        return if (address.isSiteLocalAddress || address.isLinkLocalAddress || cgnat || ipv6Local) {
            arrayOf(PERMISSION_ACCESS_LOCAL_NETWORK)
        } else emptyArray()
    }

    /** Composer mic — checked at the button, never at cold start. */
    fun recordAudioGranted(): Boolean = granted(Manifest.permission.RECORD_AUDIO)

    private fun read(): Snapshot {
        val missingDiscovery = buildList {
            if (sdkInt >= 33 && !granted(Manifest.permission.NEARBY_WIFI_DEVICES)) {
                add(Manifest.permission.NEARBY_WIFI_DEVICES)
            }
            if (sdkInt >= LOCAL_NETWORK_SDK && !granted(PERMISSION_ACCESS_LOCAL_NETWORK)) {
                add(PERMISSION_ACCESS_LOCAL_NETWORK)
            }
        }
        return Snapshot(missingDiscovery)
    }

    companion object {
        /** Android 17 / API 37 — local-network runtime permission. */
        const val LOCAL_NETWORK_SDK = 37

        /**
         * Literal keeps compiling against older stub jars in unit tests while
         * still matching `Manifest.permission.ACCESS_LOCAL_NETWORK` on device.
         */
        const val PERMISSION_ACCESS_LOCAL_NETWORK = "android.permission.ACCESS_LOCAL_NETWORK"
    }
}
