// Native macOS speech-to-text helper. Streams NDJSON lines to stdout:
//   {"partial":true,"text":"…"}   while recognizing
//   {"partial":false,"text":"…"}  final result, then exit 0
//   {"error":"…"}                 then exit 1
// Runs until the final result or a per-session stop marker. Launched by
// electron/speech.mjs as this background app bundle so macOS can resolve the
// microphone and speech purpose strings in its Info.plist.
//
// `--endpoint-ms N` ends the audio stream after N milliseconds without a
// transcript change. SFSpeechRecognizer does not finalize a buffer-backed
// request on silence by itself; it only produces `isFinal` after endAudio().
// Composer dictation omits this flag and keeps its existing press-to-stop
// behavior, while call mode opts into silence endpointing.
//
// `--input-device UID` records from that CoreAudio input instead of the
// macOS default (an unknown UID, e.g. an unplugged mic, falls back to the
// default). `--list-inputs` prints the inputs and exits; `--meter` prints the
// input's level ({"level": 0…1}) ten times a second until the stop marker,
// for Settings' level bar.
import AVFoundation
import AppKit
import CoreAudio
import Foundation
import Speech

func emit(_ obj: [String: Any]) {
  if let data = try? JSONSerialization.data(withJSONObject: obj),
    let line = String(data: data, encoding: .utf8)
  {
    print(line)
    fflush(stdout)
  }
}

func fail(_ message: String) -> Never {
  emit(["error": message])
  exit(1)
}

func debug(_ message: String) {
  FileHandle.standardError.write(Data("[speech-helper] \(message)\n".utf8))
}

func argument(_ name: String) -> String? {
  let args = CommandLine.arguments
  guard let index = args.firstIndex(of: name), index + 1 < args.count else { return nil }
  return args[index + 1]
}

// ── Input devices (CoreAudio). orbit-parakeet has the same few functions. ──
func audioProperty(
  _ selector: AudioObjectPropertySelector, scope: AudioObjectPropertyScope = kAudioObjectPropertyScopeGlobal
) -> AudioObjectPropertyAddress {
  AudioObjectPropertyAddress(mSelector: selector, mScope: scope, mElement: kAudioObjectPropertyElementMain)
}

func audioString(_ device: AudioDeviceID, _ selector: AudioObjectPropertySelector) -> String? {
  var address = audioProperty(selector)
  var value: Unmanaged<CFString>?
  var size = UInt32(MemoryLayout<Unmanaged<CFString>?>.size)
  guard AudioObjectGetPropertyData(device, &address, 0, nil, &size, &value) == noErr, let value else { return nil }
  return value.takeRetainedValue() as String
}

func inputChannels(_ device: AudioDeviceID) -> Int {
  var address = audioProperty(kAudioDevicePropertyStreamConfiguration, scope: kAudioObjectPropertyScopeInput)
  var size: UInt32 = 0
  guard AudioObjectGetPropertyDataSize(device, &address, 0, nil, &size) == noErr, size > 0 else { return 0 }
  let raw = UnsafeMutableRawPointer.allocate(byteCount: Int(size), alignment: MemoryLayout<AudioBufferList>.alignment)
  defer { raw.deallocate() }
  guard AudioObjectGetPropertyData(device, &address, 0, nil, &size, raw) == noErr else { return 0 }
  let buffers = UnsafeMutableAudioBufferListPointer(raw.assumingMemoryBound(to: AudioBufferList.self))
  return buffers.reduce(0) { $0 + Int($1.mNumberChannels) }
}

func defaultInputDevice() -> AudioDeviceID? {
  var address = audioProperty(kAudioHardwarePropertyDefaultInputDevice)
  var device = AudioDeviceID(0)
  var size = UInt32(MemoryLayout<AudioDeviceID>.size)
  let system = AudioObjectID(kAudioObjectSystemObject)
  guard AudioObjectGetPropertyData(system, &address, 0, nil, &size, &device) == noErr, device != 0 else { return nil }
  return device
}

/// Every device that can record, in CoreAudio's order.
func inputDevices() -> [AudioDeviceID] {
  var address = audioProperty(kAudioHardwarePropertyDevices)
  var size: UInt32 = 0
  let system = AudioObjectID(kAudioObjectSystemObject)
  guard AudioObjectGetPropertyDataSize(system, &address, 0, nil, &size) == noErr else { return [] }
  var devices = [AudioDeviceID](repeating: 0, count: Int(size) / MemoryLayout<AudioDeviceID>.size)
  guard AudioObjectGetPropertyData(system, &address, 0, nil, &size, &devices) == noErr else { return [] }
  return devices.filter { inputChannels($0) > 0 }
}

/// Point the engine's input at `--input-device`, before anything reads its
/// format or taps it. Unknown (unplugged) or refused: the macOS default,
/// quietly, with a line on stderr.
func chooseInput(_ engine: AVAudioEngine) {
  guard let uid = argument("--input-device"), !uid.isEmpty else { return }
  guard var device = inputDevices().first(where: { audioString($0, kAudioDevicePropertyDeviceUID) == uid }) else {
    debug("input device \(uid) not found; using the default input")
    return
  }
  guard let unit = engine.inputNode.audioUnit else {
    debug("no input audio unit; using the default input")
    return
  }
  let status = AudioUnitSetProperty(
    unit, kAudioOutputUnitProperty_CurrentDevice, kAudioUnitScope_Global, 0, &device,
    UInt32(MemoryLayout<AudioDeviceID>.size))
  if status != noErr { debug("input device \(uid) refused (\(status)); using the default input") }
}

// `--list-inputs`: the inputs Settings offers, then exit. Reading the device
// list needs no permission, so it runs as a plain child of the app.
if CommandLine.arguments.contains("--list-inputs") {
  let fallback = defaultInputDevice()
  let inputs: [[String: Any]] = inputDevices().compactMap { device in
    guard let uid = audioString(device, kAudioDevicePropertyDeviceUID) else { return nil }
    let name = audioString(device, kAudioObjectPropertyName) ?? uid
    return ["uid": uid, "name": name, "isDefault": device == fallback]
  }
  emit(["inputs": inputs])
  exit(0)
}

// `--screens`: each display's notch, for talk mode's island, then exit.
// Electron has no notch API; AppKit reports the camera housing as the part
// of the top edge between the two auxiliary areas beside it. Needs no
// permission, so it runs as a plain child of the app.
if CommandLine.arguments.contains("--screens") {
  var screens: [[String: Any]] = []
  for screen in NSScreen.screens {
    let id = (screen.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value ?? 0
    var entry: [String: Any] = ["id": id, "width": screen.frame.width, "height": screen.frame.height]
    if #available(macOS 12.0, *), screen.safeAreaInsets.top > 0,
      let left = screen.auxiliaryTopLeftArea, let right = screen.auxiliaryTopRightArea
    {
      entry["notch"] = [
        "x": left.maxX - screen.frame.minX,
        "width": right.minX - left.maxX,
        "height": screen.safeAreaInsets.top,
      ]
    }
    screens.append(entry)
  }
  emit(["screens": screens])
  exit(0)
}

let endpointMs: Int = {
  guard let value = argument("--endpoint-ms").flatMap({ Int($0) }) else { return 0 }
  return min(5_000, max(250, value))
}()

let stopFile = argument("--stop-file")
let finishFile = argument("--finish-file")

// LaunchServices gives the helper the bundle identity TCC needs, but it also
// means the parent cannot terminate it by killing the `open -W` process. A
// per-session stop marker keeps intentional mute/hang-up deterministic.
var stopTimer: DispatchSourceTimer?
if let stopFile {
  let timer = DispatchSource.makeTimerSource(queue: .global(qos: .userInitiated))
  timer.schedule(deadline: .now() + .milliseconds(100), repeating: .milliseconds(100))
  timer.setEventHandler {
    if FileManager.default.fileExists(atPath: stopFile) { exit(0) }
  }
  stopTimer = timer
  timer.resume()
}

// Push-to-talk release must finalize recognition rather than cancel it. The
// handler is installed once the audio engine exists; the timer keeps polling
// if an unusually fast key release beats authorization/setup.
var finishHandler: (() -> Void)?
var finishTimer: DispatchSourceTimer?
if let finishFile {
  let timer = DispatchSource.makeTimerSource(queue: .global(qos: .userInitiated))
  timer.schedule(deadline: .now() + .milliseconds(50), repeating: .milliseconds(50))
  timer.setEventHandler {
    guard FileManager.default.fileExists(atPath: finishFile), let finish = finishHandler else { return }
    timer.cancel()
    finish()
  }
  finishTimer = timer
  timer.resume()
}

// `--meter`: the input's loudness, ten times a second, until the stop
// marker (the timer above) or until `--parent-pid` is gone. Needs only the
// microphone. Each line is the loudest moment of its tenth on a 60 dB scale.
var meterTick: DispatchSourceTimer?
if CommandLine.arguments.contains("--meter") {
  let parent = argument("--parent-pid").flatMap { pid_t($0) }
  let lock = NSLock()
  var peak: Float = 0
  let engine = AVAudioEngine()
  AVCaptureDevice.requestAccess(for: .audio) { granted in
    guard granted else { fail("mic-denied") }
    DispatchQueue.main.async {
      chooseInput(engine)
      let node = engine.inputNode
      node.installTap(onBus: 0, bufferSize: 1024, format: node.outputFormat(forBus: 0)) { buffer, _ in
        guard let channel = buffer.floatChannelData?[0], buffer.frameLength > 0 else { return }
        var sum: Float = 0
        for i in 0..<Int(buffer.frameLength) { sum += channel[i] * channel[i] }
        let rms = (sum / Float(buffer.frameLength)).squareRoot()
        lock.lock()
        peak = max(peak, rms)
        lock.unlock()
      }
      do {
        engine.prepare()
        try engine.start()
      } catch { fail("mic-failed") }
      let tick = DispatchSource.makeTimerSource(queue: .main)
      tick.schedule(deadline: .now() + .milliseconds(100), repeating: .milliseconds(100))
      tick.setEventHandler {
        if let parent, kill(parent, 0) != 0 { exit(0) }
        lock.lock()
        let rms = peak
        peak = 0
        lock.unlock()
        let db = 20 * log10(max(rms, 0.000_001))
        let level = min(1, max(0, (db + 60) / 60))
        emit(["level": (Double(level) * 100).rounded() / 100])
      }
      tick.resume()
      meterTick = tick
    }
  }
  RunLoop.main.run()
}

/// SFSpeechRecognizer can keep revising/re-emitting a partial transcript
/// after the user stops talking. Only a changed transcript resets the timer.
final class SilenceEndpointer {
  private let queue = DispatchQueue(label: "com.orbit.speech.endpoint")
  private let gap: TimeInterval
  private let finish: () -> Void
  private var timer: DispatchSourceTimer?
  private var lastText = ""
  private var lastChange = DispatchTime.now()
  private var finished = false

  init(gapMs: Int, finish: @escaping () -> Void) {
    gap = Double(gapMs) / 1_000
    self.finish = finish
  }

  func start() {
    let source = DispatchSource.makeTimerSource(queue: queue)
    source.schedule(deadline: .now() + .milliseconds(100), repeating: .milliseconds(100))
    source.setEventHandler { [weak self] in self?.tick() }
    timer = source
    source.resume()
  }

  func saw(_ text: String) {
    queue.async {
      guard !self.finished, !text.isEmpty, text != self.lastText else { return }
      self.lastText = text
      self.lastChange = .now()
    }
  }

  private func tick() {
    // Never terminate an empty turn: a call may be quiet for as long as the
    // user needs before they begin speaking.
    guard !finished, !lastText.isEmpty else { return }
    let silentFor = Double(DispatchTime.now().uptimeNanoseconds - lastChange.uptimeNanoseconds) / 1_000_000_000
    guard silentFor >= gap else { return }
    finished = true
    timer?.cancel()
    timer = nil
    finish()
  }
}

SFSpeechRecognizer.requestAuthorization { status in
  guard status == .authorized else { fail("speech-not-authorized") }
  // Recognize in the user's language: a hardcoded en-US recognizer
  // transcribes everyone else into nonsense. First preference that has an
  // available recognizer wins, with en-US as the last resort.
  let candidates =
    Locale.preferredLanguages.map { Locale(identifier: $0) }
    + [Locale.current, Locale(identifier: "en-US")]
  guard
    let recognizer = candidates.lazy.compactMap({ SFSpeechRecognizer(locale: $0) })
      .first(where: { $0.isAvailable })
  else { fail("recognizer-unavailable") }

  let request = SFSpeechAudioBufferRecognitionRequest()
  request.shouldReportPartialResults = true
  if recognizer.supportsOnDeviceRecognition {
    request.requiresOnDeviceRecognition = true
  }

  let engine = AVAudioEngine()
  chooseInput(engine)
  let node = engine.inputNode
  var audioFinished = false
  let finishAudio = {
    DispatchQueue.main.async {
      guard !audioFinished else { return }
      audioFinished = true
      engine.stop()
      node.removeTap(onBus: 0)
      request.endAudio()
    }
  }
  finishHandler = finishAudio
  var endpointer: SilenceEndpointer?
  if endpointMs > 0 {
    endpointer = SilenceEndpointer(gapMs: endpointMs) {
      // Stop capture before ending the request: appending another audio
      // buffer after endAudio() can make the recognition task fail instead
      // of delivering its final transcript.
      finishAudio()
    }
    endpointer?.start()
  }
  node.installTap(onBus: 0, bufferSize: 1024, format: node.outputFormat(forBus: 0)) { buffer, _ in
    request.append(buffer)
  }
  do {
    engine.prepare()
    try engine.start()
  } catch { fail("mic-failed") }

  recognizer.recognitionTask(with: request) { result, error in
    if let result = result {
      let text = result.bestTranscription.formattedString
      endpointer?.saw(text)
      emit(["partial": !result.isFinal, "text": text])
      if result.isFinal { exit(0) }
    }
    if error != nil { fail("recognition-error") }
  }
}

RunLoop.main.run()
