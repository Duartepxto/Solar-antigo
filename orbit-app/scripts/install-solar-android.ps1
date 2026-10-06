param([string]$DeviceSerial)

$ErrorActionPreference = 'Stop'
$solarRepo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$adb = Join-Path $solarRepo '.orbit-scratch\android-tools\sdk\platform-tools\adb.exe'
$apk = Join-Path $solarRepo 'release-solar\android\Solar-Android-preview.apk'
if (-not (Test-Path -LiteralPath $adb)) { throw 'Android platform-tools are missing. Prepare the local Android SDK first.' }
if (-not (Test-Path -LiteralPath $apk)) { throw 'Build Solar Android first with scripts/build-solar-android.ps1.' }

$deviceLines = & $adb devices
if ($LASTEXITCODE -ne 0) { throw 'Could not query Android devices.' }
$devices = @($deviceLines | Select-Object -Skip 1 | Where-Object { $_ -match '^\S+\s+device\s*$' } | ForEach-Object { ($_ -split '\s+')[0] })
if ($DeviceSerial) {
    if ($DeviceSerial -notin $devices) { throw 'The selected Android is not connected and authorized.' }
} elseif ($devices.Count -eq 1) {
    $DeviceSerial = $devices[0]
} elseif ($devices.Count -gt 1) {
    throw 'Several Android devices are connected. Specify -DeviceSerial to select the intended phone.'
} else {
    throw 'Connect the Android by USB, enable USB debugging and accept the authorization on the phone.'
}

# -r updates this preview without erasing its saved pairing or conversations.
# A signature conflict is reported; this script never uninstalls another app.
& $adb -s $DeviceSerial install -r $apk
if ($LASTEXITCODE -ne 0) { throw 'Android refused the installation. Existing app data was not erased.' }
& $adb -s $DeviceSerial shell am start -n 'com.solar.companion.preview/com.orbit.companion.MainActivity'
if ($LASTEXITCODE -ne 0) { throw 'Solar installed, but its launch could not be confirmed.' }
Write-Output 'Solar Preview installed and opened. Pair from its QR scanner with the Solar PC.'
