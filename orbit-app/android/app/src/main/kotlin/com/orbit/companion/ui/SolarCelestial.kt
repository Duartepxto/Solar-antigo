package com.orbit.companion.ui

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import com.orbit.companion.core.Bot
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.PI
import kotlin.math.asin
import kotlin.math.atan2
import kotlin.math.sqrt

/** Same Solar sun/planet language on the map, chat and selectors. */
internal fun solarSkin(bot: Bot): String = when {
    bot.system == "orbit" -> "sun"
    Regex("^jarvis(?:\\s|$)", RegexOption.IGNORE_CASE).containsMatchIn(bot.name) -> "sun"
    bot.chiefOfStaff == true -> "sun"
    bot.color in setOf("red", "coral", "orange") -> "mars"
    bot.color == "yellow" -> "saturn"
    bot.color in setOf("green", "teal", "cyan") -> "earth_daymap"
    else -> "moon"
}

private val spheres = android.util.LruCache<String, Bitmap>(8)

private fun sphere(texture: Bitmap, sun: Boolean): Bitmap {
    val edge = 192
    val pixels = IntArray(edge * edge)
    for (y in 0 until edge) for (x in 0 until edge) {
        val nx = (x + .5 - edge / 2) / (edge / 2)
        val ny = (y + .5 - edge / 2) / (edge / 2)
        val radius = nx * nx + ny * ny
        if (radius >= 1) continue
        val nz = sqrt(1 - radius)
        val longitude = atan2(nx, nz) / (2 * PI) + .5
        val latitude = asin(ny) / PI + .5
        val pixel = texture.getPixel((longitude * texture.width).toInt().coerceIn(0, texture.width - 1),
            (latitude * texture.height).toInt().coerceIn(0, texture.height - 1))
        val light = if (sun) .9 + .1 * nz else (.24 + .9 * (-nx * .5 - ny * .35 + nz * .78).coerceAtLeast(0.0)).coerceAtMost(1.0)
        val red = (((pixel shr 16) and 255) * light).toInt()
        val green = (((pixel shr 8) and 255) * light).toInt()
        val blue = ((pixel and 255) * light).toInt()
        pixels[y * edge + x] = (255 shl 24) or (red shl 16) or (green shl 8) or blue
    }
    return Bitmap.createBitmap(pixels, edge, edge, Bitmap.Config.ARGB_8888)
}

@Composable
internal fun SolarCelestial(skin: String, size: Dp, state: MausState, modifier: Modifier = Modifier) {
    val context = LocalContext.current.applicationContext
    val image by produceState<ImageBitmap?>(initialValue = spheres.get(skin)?.asImageBitmap(), key1 = skin) {
        value = withContext(Dispatchers.IO) {
            val bitmap = spheres.get(skin) ?: context.assets.open("solar/2k_$skin.jpg").use { stream ->
                val source = BitmapFactory.decodeStream(stream, null, BitmapFactory.Options().apply { inSampleSize = 4 })
                    ?: error("Solar texture is unreadable")
                sphere(source, skin == "sun").also { source.recycle(); spheres.put(skin, it) }
            }
            bitmap.asImageBitmap()
        }
    }
    val active = state in setOf(MausState.THINKING, MausState.WORKING, MausState.SEARCHING, MausState.LISTENING)
    val accent = MaterialTheme.colorScheme.primary
    Box(modifier.size(size).clearAndSetSemantics { testTag = "solar-sphere:$skin:${if (image == null) "loading" else "ready"}" }) {
        Canvas(Modifier.matchParentSize()) {
            val radius = this.size.minDimension * .44f
            val origin = center
            if (skin == "saturn") drawOval(Color(0xFFB8A282).copy(alpha = .55f),
                topLeft = Offset(0f, this.size.height * .38f), size = androidx.compose.ui.geometry.Size(this.size.width, this.size.height * .25f), style = Stroke(this.size.minDimension * .07f))
            val loaded = image
            if (loaded != null) drawImage(loaded, dstOffset = androidx.compose.ui.unit.IntOffset((origin.x - radius).toInt(), (origin.y - radius).toInt()),
                dstSize = IntSize((radius * 2).toInt(), (radius * 2).toInt()))
            else drawCircle(Brush.radialGradient(listOf(accent, Color(0xFF242A34)), center = origin - Offset(radius * .4f, radius * .4f), radius = radius * 1.8f), radius, origin)
            // Carved Solar eyes and a quiet smile, rather than a second mascot.
            for (side in listOf(-1, 1)) {
                val eye = Offset(origin.x + side * radius * .22f - radius * .065f, origin.y - radius * .13f)
                drawOval(Color(0xFF080B10).copy(alpha = .85f), eye, androidx.compose.ui.geometry.Size(radius * .13f, radius * .18f))
                drawCircle(Color.White.copy(alpha = .55f), radius * .019f, eye + Offset(radius * .05f, radius * .05f))
            }
            drawArc(Color(0xFF080B10).copy(alpha = .8f), 0f, 180f, false,
                Offset(origin.x - radius * .12f, origin.y + radius * .12f), androidx.compose.ui.geometry.Size(radius * .24f, radius * .12f),
                style = Stroke((radius * .023f).coerceAtLeast(1f)))
            if (active) drawCircle(accent.copy(alpha = .8f), this.size.minDimension * .49f, style = Stroke(1.5f))
        }
    }
}
