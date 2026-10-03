// Build the native recognizer as a real app bundle. macOS privacy enforcement
// does not accept a purpose string embedded in a loose command-line binary on
// current releases; TCC reads the Info.plist belonging to the executable's
// bundle and terminates the process before Swift can recover when it is absent.
import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const electronDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.dirname(electronDir);
const resourcesDir = path.join(electronDir, "resources");

export const speechHelperBundle = path.join(resourcesDir, "Orbit Speech.app");
export const speechHelperBinary = path.join(speechHelperBundle, "Contents", "MacOS", "speech-helper");
export const parakeetBinary = path.join(speechHelperBundle, "Contents", "MacOS", "orbit-parakeet");
const parakeetPackage = path.join(resourcesDir, "orbit-parakeet");

/** Orbit's multilingual recognizer (Parakeet v3 through FluidAudio): a
 * Swift package, Apple silicon only. Optional by design: without network
 * for the package, or with a Swift older than 6, the build carries on and
 * Orbit uses Apple's recognizer. `--disable-keychain` keeps SwiftPM from
 * asking for a GitHub login it doesn't need (every dependency is public). */
function buildParakeet() {
  rmSync(parakeetBinary, { force: true });
  if (process.env.ORBIT_SKIP_PARAKEET === "1" || process.arch !== "arm64") return;
  const scratch = path.join(parakeetPackage, ".build");
  try {
    execFileSync(
      "swift",
      ["build", "-c", "release", "--arch", "arm64", "--disable-keychain", "--package-path", parakeetPackage, "--scratch-path", scratch],
      { stdio: "inherit", timeout: 20 * 60_000 },
    );
    copyFileSync(path.join(scratch, "release", "orbit-parakeet"), parakeetBinary);
    chmodSync(parakeetBinary, 0o755);
  } catch (error) {
    rmSync(parakeetBinary, { force: true });
    console.warn(`[speech] Parakeet recognizer not built, Apple's is used instead: ${error?.message ?? error}`);
  }
}

export function buildSpeechHelper({ parakeet = true } = {}) {
  const contents = path.join(speechHelperBundle, "Contents");
  mkdirSync(path.join(contents, "MacOS"), { recursive: true });
  copyFileSync(path.join(resourcesDir, "speech-helper-Info.plist"), path.join(contents, "Info.plist"));
  // macOS shows the helper in Privacy & Security (microphone, speech): with
  // Orbit's icon, not a blank app
  mkdirSync(path.join(contents, "Resources"), { recursive: true });
  copyFileSync(path.join(projectDir, "build", "icon.icns"), path.join(contents, "Resources", "AppIcon.icns"));
  // The mac app ships for arm64 and x64, and the helper rides inside both
  // bundles, so it must be universal — bare `swiftc` builds host-arch only,
  // which inside an Intel app is a dictation helper that cannot launch.
  // macos12 matches the app's LSMinimumSystemVersion; the Speech/AVFoundation
  // APIs used here are all older than that.
  const slices = ["arm64", "x86_64"].map((arch) => {
    const slice = `${speechHelperBinary}-${arch}`;
    execFileSync(
      "swiftc",
      ["-O", "-target", `${arch}-apple-macos12`, path.join(resourcesDir, "speech-helper.swift"), "-o", slice],
      { stdio: "inherit", timeout: 120_000 },
    );
    return slice;
  });
  execFileSync("lipo", ["-create", ...slices, "-output", speechHelperBinary], {
    stdio: "inherit",
    timeout: 60_000,
  });
  for (const slice of slices) rmSync(slice, { force: true });
  const archs = execFileSync("lipo", ["-archs", speechHelperBinary], { timeout: 60_000 }).toString();
  if (!archs.includes("arm64") || !archs.includes("x86_64")) {
    throw new Error(`speech helper is not universal: ${archs.trim()}`);
  }
  // before signing, so the bundle's seal covers it
  if (parakeet) buildParakeet();
  // Give development builds a stable identity and the same audio entitlement
  // as the release. electron-builder replaces this ad-hoc signature when it
  // signs the containing distribution.
  execFileSync(
    "codesign",
    [
      "--force",
      "--deep",
      "--sign",
      "-",
      "--options",
      "runtime",
      "--entitlements",
      path.join(projectDir, "build", "entitlements.mac.plist"),
      speechHelperBundle,
    ],
    { stdio: "inherit", timeout: 30_000 },
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildSpeechHelper();
}
