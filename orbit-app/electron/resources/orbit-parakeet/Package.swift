// swift-tools-version:6.0
// Orbit's on-device speech recognizer: NVIDIA Parakeet v3 through FluidAudio
// (CoreML, Apple Neural Engine). It detects the spoken language by itself
// across 25 European languages. Built by electron/build-speech-helper.mjs;
// Apple silicon on macOS 14+, where FluidAudio runs.
import PackageDescription

let package = Package(
  name: "orbit-parakeet",
  platforms: [.macOS(.v14)],
  dependencies: [
    .package(url: "https://github.com/FluidInference/FluidAudio.git", exact: "0.17.4"),
  ],
  targets: [
    .executableTarget(
      name: "orbit-parakeet",
      dependencies: [.product(name: "FluidAudio", package: "FluidAudio")],
      swiftSettings: [.swiftLanguageMode(.v5)]
    ),
  ]
)
