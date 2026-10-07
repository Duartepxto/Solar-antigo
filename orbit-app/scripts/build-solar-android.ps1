param([switch]$SkipTests, [string]$SigningKeyPath)

$ErrorActionPreference = 'Stop'
$solarRepo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$androidTools = Join-Path $solarRepo '.orbit-scratch\android-tools'
$localJdk = Get-ChildItem -LiteralPath (Join-Path $androidTools 'jdk') -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localJdk) { $env:JAVA_HOME = $localJdk.FullName }
if (-not $env:JAVA_HOME) {
    $studioJdk = Join-Path $env:ProgramFiles 'Android\Android Studio\jbr'
    if (Test-Path -LiteralPath (Join-Path $studioJdk 'bin\java.exe')) { $env:JAVA_HOME = $studioJdk }
}
if (-not $env:JAVA_HOME -or -not (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    throw 'JDK 17 or newer is required. Configure JAVA_HOME or install Android Studio.'
}
$localSdk = Join-Path $androidTools 'sdk'
if (Test-Path -LiteralPath $localSdk) { $env:ANDROID_HOME = $localSdk }
if (-not $env:ANDROID_HOME) {
    $studioSdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
    if (Test-Path -LiteralPath $studioSdk) { $env:ANDROID_HOME = $studioSdk }
}
if (-not $env:ANDROID_HOME) { throw 'Configure ANDROID_HOME with an Android SDK containing platform 37.0.' }
if ($SigningKeyPath) {
    $env:SOLAR_ANDROID_PREVIEW_KEYSTORE = (Resolve-Path -LiteralPath $SigningKeyPath).Path
} elseif (-not $env:SOLAR_ANDROID_PREVIEW_KEYSTORE) {
    foreach ($previewKey in @((Join-Path $androidTools 'android-user\debug.keystore'), (Join-Path $env:USERPROFILE '.android\debug.keystore'))) {
        if (Test-Path -LiteralPath $previewKey) { $env:SOLAR_ANDROID_PREVIEW_KEYSTORE = $previewKey; break }
    }
}
if (Test-Path -LiteralPath (Join-Path $androidTools 'android-user')) { $env:ANDROID_USER_HOME = Join-Path $androidTools 'android-user' }
if (Test-Path -LiteralPath (Join-Path $androidTools 'gradle')) { $env:GRADLE_USER_HOME = Join-Path $androidTools 'gradle' }

Push-Location (Join-Path $solarRepo 'android')
try {
    $tasks = @(':app:assemblePreview')
    if (-not $SkipTests) { $tasks = @(':core:test', ':app:testDebugUnitTest') + $tasks }
    & '.\gradlew.bat' --no-daemon @tasks
    if ($LASTEXITCODE -ne 0) { throw "Android build failed with exit code $LASTEXITCODE" }
    $outputDir = Join-Path $solarRepo 'release-solar\android'
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    $outputApk = Join-Path $outputDir 'Solar-Android-preview.apk'
    Copy-Item -LiteralPath 'app\build\outputs\apk\preview\app-preview.apk' -Destination $outputApk -Force
    Write-Output "Solar Android APK: $outputApk"
} finally {
    Pop-Location
}
