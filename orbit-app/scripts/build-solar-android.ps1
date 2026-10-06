param([switch]$SkipTests)

$ErrorActionPreference = 'Stop'
$solarRepo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$androidTools = Join-Path $solarRepo '.orbit-scratch\android-tools'
$localJdk = Get-ChildItem -LiteralPath (Join-Path $androidTools 'jdk') -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localJdk) { $env:JAVA_HOME = $localJdk.FullName }
if (-not $env:JAVA_HOME -or -not (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    throw 'JDK 17 is required. Configure JAVA_HOME or prepare .orbit-scratch/android-tools/jdk.'
}
$localSdk = Join-Path $androidTools 'sdk'
if (Test-Path -LiteralPath $localSdk) { $env:ANDROID_HOME = $localSdk }
if (-not $env:ANDROID_HOME) { throw 'Configure ANDROID_HOME with an Android SDK containing platform 37.0.' }
$env:ANDROID_USER_HOME = Join-Path $androidTools 'android-user'
$env:GRADLE_USER_HOME = Join-Path $androidTools 'gradle'

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
