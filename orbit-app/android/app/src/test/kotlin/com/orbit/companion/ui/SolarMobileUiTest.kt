package com.orbit.companion.ui

import android.graphics.Bitmap
import androidx.activity.ComponentActivity
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.unit.dp
import com.orbit.companion.audio.SolarTurnCall
import com.orbit.companion.core.Chat
import com.orbit.companion.core.CompanionState
import java.io.File
import kotlin.test.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34], qualifiers = "w411dp-h914dp-mdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@OptIn(ExperimentalTestApi::class)
class SolarMobileUiTest {
    @get:Rule val compose = createAndroidComposeRule<ComponentActivity>()

    @Test fun `Solar planets open the exact chat and call controls fit the phone`() {
        val original = RosterFixture.fleet()
        val fleet = original.copy(bots = original.bots.take(2).mapIndexed { index, bot ->
            bot.copy(name = if (index == 0) "Jarvis" else "Momo", color = if (index == 0) "yellow" else "blue", hidden = index == 0,
                system = if (index == 0) "orbit" else null,
                section = if (index == 0) null else "Personal", chiefOfStaff = false, busy = false)
        }, groups = emptyList())
        val state = CompanionState().hydrate(fleet)
        var selected: Chat? = null
        var screen by mutableStateOf(false)
        var phase by mutableStateOf(SolarTurnCall.Phase.IDLE)
        var sends = 0
        compose.setContent {
            CompanionTheme {
                Surface(Modifier.fillMaxSize()) {
                    if (!screen) SolarHomeMap(state, 50.dp, onOpen = { selected = it; screen = true },
                        onManage = {}, onCreateThread = {}, onCreateGroup = {})
                    else Column {
                        Text("Jarvis")
                        SolarCallRow(phase, null, "Jarvis", true,
                            onToggle = { phase = if (phase == SolarTurnCall.Phase.IDLE) SolarTurnCall.Phase.LISTENING else SolarTurnCall.Phase.IDLE },
                            onSend = { sends++; phase = SolarTurnCall.Phase.TRANSCRIBING })
                    }
                }
            }
        }
        compose.waitUntil(15000) { compose.onAllNodesWithTag("solar-sphere:sun:ready", useUnmergedTree = true).fetchSemanticsNodes().isNotEmpty() }
        compose.onNodeWithText("Jarvis").assertIsDisplayed()
        compose.onNodeWithText("Momo").assertIsDisplayed()
        capture("home.png")
        compose.onNodeWithText("Jarvis").performClick()
        assertEquals(fleet.bots.first().threadId, selected?.threadId)
        compose.onNodeWithText("Start call").performClick()
        compose.onNodeWithText("End call").assertIsDisplayed()
        compose.onNodeWithText("Send voice turn").performClick()
        assertEquals(1, sends)
        compose.onNodeWithText("Transcribing on your computer…").assertIsDisplayed()
        capture("call.png")
        compose.onNodeWithText("End call").performClick()
        compose.onNodeWithText("Start call").assertIsDisplayed()
    }

    private fun capture(name: String) {
        val path = File(System.getProperty("solar.evidence.dir"), name)
        path.parentFile?.mkdirs()
        // Render the actual native view tree. PixelCopy needs a hardware
        // compositor which a Robolectric Activity does not own.
        compose.runOnIdle {
            val view = compose.activity.window.decorView
            val bitmap = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
            view.draw(android.graphics.Canvas(bitmap))
            path.outputStream().use { check(bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)) }
            bitmap.recycle()
        }
    }
}
