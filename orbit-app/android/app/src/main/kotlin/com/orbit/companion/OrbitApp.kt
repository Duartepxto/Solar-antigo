package com.orbit.companion

import android.app.Application
import androidx.lifecycle.ProcessLifecycleOwner
import com.orbit.companion.audio.VoicePreviewPlayer
import com.orbit.companion.audio.VoiceNotePlayer
import com.orbit.companion.core.Session
import com.orbit.companion.discovery.NsdDiscovery
import com.orbit.companion.lifecycle.AlwaysOnConnectionService
import com.orbit.companion.lifecycle.AlwaysOnConnectionState
import com.orbit.companion.lifecycle.ServiceProcessAnchor
import com.orbit.companion.lifecycle.SessionLingerController
import com.orbit.companion.lifecycle.installSessionLinger
import com.orbit.companion.notifications.LocalNotificationPoster
import com.orbit.companion.permissions.CompanionPermissions
import com.orbit.companion.sharing.ShareInbox
import com.orbit.companion.storage.AlwaysOnPreferences
import com.orbit.companion.storage.DataStoreConnectionStore
import com.orbit.companion.storage.OnboardingPreferences
import com.orbit.companion.storage.KeystoreTokenStore
import com.orbit.companion.ui.FilePreviews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/**
 * Application entry: owns the long-lived [Session] and wires
 * [ProcessLifecycleOwner] the way iOS `scenePhase` drives connect and linger.
 */
class OrbitApp : Application() {
    private val appJob = SupervisorJob()
    val appScope = CoroutineScope(appJob + Dispatchers.Main.immediate)

    lateinit var session: Session
        private set
    lateinit var notifications: LocalNotificationPoster
        private set
    lateinit var discovery: NsdDiscovery
        private set
    lateinit var permissions: CompanionPermissions
        private set

    /**
     * One instance for the whole process: [Session] writes the first-pair
     * education marker into it as part of committing a pairing, and the root
     * router reads it to decide whether that step is due.
     */
    lateinit var onboarding: OnboardingPreferences
        private set
    lateinit var voicePreview: VoicePreviewPlayer
        private set
    lateinit var voiceNotes: VoiceNotePlayer
        private set
    lateinit var linger: SessionLingerController
        private set
    lateinit var shareInbox: ShareInbox
        private set
    lateinit var alwaysOn: AlwaysOnPreferences
        private set

    override fun onCreate() {
        super.onCreate()
        shareInbox = ShareInbox()
        ShareInbox.cleanStale(cacheDir)
        // Launch stays non-blocking. The preview store awaits the shared
        // completion barrier on its own IO coroutine before writing anything.
        FilePreviews.startStaleCleanup(this, appScope)
        notifications = LocalNotificationPoster(this)
        discovery = NsdDiscovery(this)
        permissions = CompanionPermissions(this)
        onboarding = OnboardingPreferences(this)
        session = Session(
            scope = appScope,
            connectionStore = DataStoreConnectionStore(this),
            tokenStore = KeystoreTokenStore(this),
            onboardingStore = onboarding,
            deviceNameProvider = {
                // User-visible device name; Settings.Global.DEVICE_NAME on API 25+.
                android.provider.Settings.Global.getString(contentResolver, "device_name")
                    ?.takeIf { it.isNotBlank() }
                    ?: android.os.Build.MODEL
            },
            notificationSink = notifications,
        )
        voicePreview = VoicePreviewPlayer(this)
        voiceNotes = VoiceNotePlayer(this)

        // Foreground reconnects; background lingers. Cutting the stream at
        // onStop would drop a turn that completes seconds after Home — the
        // notification is produced by this stream and nothing else.
        // `session.linger()` on iOS (`ios/App/CompanionApp.swift:26`).
        linger = installSessionLinger(
            lifecycle = ProcessLifecycleOwner.get().lifecycle,
            session = session,
            scope = appScope,
            anchor = ServiceProcessAnchor(this),
            alwaysOn = { AlwaysOnConnectionState.active },
        )

        alwaysOn = AlwaysOnPreferences(this)
        // Covers the case where the process was relaunched (not booted) while
        // the setting was on — e.g. the OS killed the whole app under memory
        // pressure and the user (or a notification tap) reopened it. A device
        // reboot is covered separately by AlwaysOnBootReceiver, which can run
        // before anything ever constructs this Application's Activity.
        if (alwaysOn.enabled.value) {
            AlwaysOnConnectionService.start(this)
        }
    }
}
