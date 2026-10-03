// Stage the macOS CUA executable and native SDK outside ASAR. The npm SDK
// deliberately does not ship the `cua-driver` CLI, so packaging must fail
// loudly instead of producing an app whose "This computer" option can never
// work. CUA_DRIVER_PATH is the CI/release override; otherwise the same
// version with Brave support (ORBIT_DRIVER below), then an exact-version
// installed binary or the checksummed official release asset is used.
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rm, stat, chmod, writeFile } from "node:fs/promises";
import { existsSync, realpathSync } from "node:fs";
import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { build } from "esbuild";
import { resolveCuaMacArches } from "./cua-mac-arches.mjs";

if (process.platform !== "darwin") throw new Error("prepare-cua is macOS-only");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = promisify(execFile);
const stage = join(root, "dist-native");
const sdkEntry = fileURLToPath(import.meta.resolve("@trycua/cua-driver"));
const sdkRoot = realpathSync(join(dirname(sdkEntry), ".."));
const dependencyRoot = join(sdkRoot, "..", "..");
const sdkPackage = JSON.parse(await readFile(join(sdkRoot, "package.json"), "utf8"));
const expectedVersion = String(sdkPackage.version);
const release = {
  version: "0.28.2",
  file: "cua-driver-rs-0.28.2-darwin-universal-binary.tar.gz",
  sha256: "386db225a3080714a0f9f935525e61efaf46709587ef8b94dd2df81aeb2f6daa",
};
if (expectedVersion !== release.version) {
  throw new Error(
    `CUA SDK ${expectedVersion} has no pinned executable asset in prepare-cua.mjs; update the release checksum first`,
  );
}

// Orbit's build of the same driver version: the official 0.28.2 source plus
// Brave support (its profile folder and brave://inspect setup), so a bot can
// attach to a person's logged-in Brave. Published as a public, MIT release
// on the DragonQLF/cua fork (branch brave-support-0.28.2), checksum-pinned
// like the official asset. If it can't be fetched the official driver is
// used, and logged-in Brave can't attach.
const ORBIT_DRIVER = {
  url: "https://github.com/DragonQLF/cua/releases/download/cua-driver-brave-v0.28.2-r2/cua-driver-rs-0.28.2-brave-darwin-universal-binary.tar.gz",
  file: "cua-driver-rs-0.28.2-brave-darwin-universal-binary.tar.gz",
  sha256: "858c1d6ba60dc0d853f473e236b7975808de5f699a57b0031322aabefaf903c7",
};

async function orbitBinary() {
  const cache = join(root, "node_modules", ".cache", "orbit", `cua-driver-brave-${release.version}`);
  const cachedBinary = join(cache, "cua-driver");
  if ((await binaryVersion(cachedBinary)) === expectedVersion) return cachedBinary;
  console.log(`Downloading CUA Driver ${release.version} with Brave support…`);
  const response = await fetch(ORBIT_DRIVER.url, { headers: { "user-agent": "Orbit-packager" } });
  if (!response.ok) throw new Error(`download: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== ORBIT_DRIVER.sha256) throw new Error(`checksum mismatch: expected ${ORBIT_DRIVER.sha256}, got ${digest}`);
  await rm(cache, { recursive: true, force: true });
  await mkdir(cache, { recursive: true });
  const archive = join(cache, ORBIT_DRIVER.file);
  await writeFile(archive, bytes);
  await run("/usr/bin/tar", ["-xzf", archive, "-C", cache, "cua-driver"]);
  await chmod(cachedBinary, 0o755);
  if ((await binaryVersion(cachedBinary)) !== expectedVersion) throw new Error(`it does not report version ${expectedVersion}`);
  return cachedBinary;
}

async function binaryVersion(candidate) {
  if (!candidate || !existsSync(candidate)) return null;
  try {
    const { stdout } = await run(candidate, ["--version"], { timeout: 5000 });
    return stdout.match(/cua-driver\s+([\d.]+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

async function officialBinary() {
  const cache = join(root, "node_modules", ".cache", "orbit", `cua-driver-${release.version}`);
  const cachedBinary = join(cache, "cua-driver");
  if ((await binaryVersion(cachedBinary)) === expectedVersion) return cachedBinary;

  await rm(cache, { recursive: true, force: true });
  await mkdir(cache, { recursive: true });
  const url = `https://github.com/trycua/cua/releases/download/cua-driver-rs-v${release.version}/${release.file}`;
  console.log(`Downloading CUA Driver ${release.version} from the official release…`);
  const response = await fetch(url, { headers: { "user-agent": "Orbit-packager" } });
  if (!response.ok) throw new Error(`CUA Driver download failed: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== release.sha256) {
    throw new Error(`CUA Driver checksum mismatch: expected ${release.sha256}, got ${digest}`);
  }
  const archive = join(cache, release.file);
  await writeFile(archive, bytes);
  await run("/usr/bin/tar", ["-xzf", archive, "-C", cache, "cua-driver"]);
  await chmod(cachedBinary, 0o755);
  if ((await binaryVersion(cachedBinary)) !== expectedVersion) {
    throw new Error(`downloaded CUA Driver does not report version ${expectedVersion}`);
  }
  return cachedBinary;
}

let binary;
if (process.env.CUA_DRIVER_PATH) {
  const suppliedVersion = await binaryVersion(process.env.CUA_DRIVER_PATH);
  if (suppliedVersion !== expectedVersion) {
    throw new Error(
      `CUA_DRIVER_PATH must point to cua-driver ${expectedVersion}; found ${suppliedVersion ?? "an unreadable binary"}`,
    );
  }
  binary = process.env.CUA_DRIVER_PATH;
} else if ((binary = await orbitBinary().catch((error) => {
  console.warn(`CUA Driver with Brave support is unavailable (${error.message}); using the official driver, so bots can't attach to a logged-in Brave.`);
  return null;
}))) {
  // Orbit's own build of the pinned version
} else {
  // The locally installed app may be a single-arch build; both shipped arches
  // need it, so fall back to the official universal binary rather than fail.
  const installed = "/Applications/CuaDriver.app/Contents/MacOS/cua-driver";
  const installedUniversal = async () => {
    try {
      const { stdout } = await run("/usr/bin/lipo", ["-archs", installed]);
      return stdout.includes("arm64") && stdout.includes("x86_64");
    } catch {
      return false;
    }
  };
  binary =
    (await binaryVersion(installed)) === expectedVersion && (await installedUniversal())
      ? installed
      : await officialBinary();
}
const details = await stat(binary);
if (!details.isFile() || (details.mode & 0o111) === 0) {
  throw new Error(`cua-driver is not an executable file: ${binary}`);
}

// The mac app ships for two architectures, each with its own staging dir that
// electron-builder selects via ${arch} in extraResources. The driver
// executable is the official universal binary (same bytes in both dirs, and
// asserted universal below so a future non-universal pin fails loudly here,
// not on a user's Intel Mac); the SDK's dylib/.node are genuinely per-arch,
// pulled from the two darwin native packages that pnpm installs because of
// supportedArchitectures in package.json.
const MAC_ARCHES = resolveCuaMacArches(process.env);

const { stdout: archList } = await run("/usr/bin/lipo", ["-archs", binary]);
for (const arch of MAC_ARCHES) {
  const lipoName = arch === "x64" ? "x86_64" : arch;
  if (!archList.trim().split(/\s+/).includes(lipoName)) {
    throw new Error(`cua-driver at ${binary} is not universal: has [${archList.trim()}], needs ${lipoName}`);
  }
}

for (const arch of MAC_ARCHES) {
  const archStage = join(stage, arch);
  await rm(archStage, { recursive: true, force: true });
  await mkdir(archStage, { recursive: true });
  await copyFile(binary, join(archStage, "cua-driver"));
  await chmod(join(archStage, "cua-driver"), 0o755);
  // A binary copied out of CuaDriver.app retains a bundle-relative signature
  // whose Info.plist no longer exists at the new path. Give the staged file a
  // valid temporary signature; electron-builder replaces it with the enclosing
  // app's identity during its nested-code signing pass.
  await run("/usr/bin/codesign", ["--force", "--sign", "-", "--options", "runtime", join(archStage, "cua-driver")]);

  const nativeDir = join(archStage, "cua-sdk", "native");
  const nativePackage = join(dependencyRoot, "@trycua", `cua-driver-darwin-${arch}`);
  if (!existsSync(nativePackage)) {
    throw new Error(
      `required CUA darwin-${arch} native package is missing — is pnpm.supportedArchitectures.cpu set in package.json?`,
    );
  }
  await mkdir(nativeDir, { recursive: true });
  await Promise.all([
    copyFile(join(realpathSync(nativePackage), "libcua_driver_sdk.dylib"), join(nativeDir, "libcua_driver_sdk.dylib")),
    copyFile(join(realpathSync(nativePackage), "cua_driver_node_runtime.node"), join(nativeDir, "cua_driver_node_runtime.node")),
  ]);
}

// Bundle the JS side into one ESM file so electron-builder's intentional
// node_modules exclusion cannot drop it. The SDK resolves its native library
// through @ubjs at runtime; redirect those generated lookups to the native
// files staged beside the bundle. The bundle is pure JS — built once, shipped
// in both arch dirs.
const bundle = join(stage, MAC_ARCHES[0], "cua-sdk", "cua-sdk.mjs");
await build({
  stdin: {
    contents: [
      'export { EmbeddedCuaDriverHost } from "@trycua/cua-driver/embedded";',
      'export { requestMacOSPermissions, hasRequiredMacOSPermissions } from "@trycua/cua-driver/electron";',
    ].join("\n"),
    resolveDir: root,
    sourcefile: "orbit-cua-entry.mjs",
    loader: "js",
  },
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  banner: {
    js: 'import { createRequire as __orbitCreateRequire } from "node:module"; const require = __orbitCreateRequire(import.meta.url);',
  },
  outfile: bundle,
  logLevel: "silent",
});
const bundledSource = await readFile(bundle, "utf8");
const resolverPattern = /function resolveLibPath\d*\(opts\) \{/g;
const resolvers = bundledSource.match(resolverPattern) ?? [];
if (resolvers.length !== 1) {
  throw new Error("could not patch the bundled CUA native-library resolver");
}
await writeFile(
  bundle,
  bundledSource.replace(
    resolverPattern,
    `${resolvers[0]}\n      if (process.env.ORBIT_CUA_SDK_LIBRARY) return resolveOverride(opts.crateName, process.env.ORBIT_CUA_SDK_LIBRARY);`,
  ),
);

for (const arch of MAC_ARCHES.slice(1)) {
  await copyFile(bundle, join(stage, arch, "cua-sdk", "cua-sdk.mjs"));
}

console.log(`Staged CUA for ${MAC_ARCHES.join(" + ")} from ${binary}`);
