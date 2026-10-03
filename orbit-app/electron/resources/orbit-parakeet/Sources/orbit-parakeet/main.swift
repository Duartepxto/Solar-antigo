// orbit-parakeet: on-device dictation with NVIDIA Parakeet v3, which
// detects the spoken language by itself (25 European languages).
//
// The same contract as speech-helper.swift, so electron/speech.mjs drives
// either one: NDJSON on stdout ({"partial": true|false, "text": ...} or
// {"error": ...}), `--endpoint-ms N` ends the turn after N ms of silence
// once you have spoken, and the `--stop-file` / `--finish-file` markers cancel or finalize.
// `--models-dir DIR` is where the model lives; `--prepare` downloads and
// warms it (the first CoreML compile is slow), then exits.
//
// It needs only the microphone, never Speech Recognition, so it runs as a
// plain child of Orbit and macOS asks once, as Orbit.
//
// `--input-device UID` records from that CoreAudio input instead of the
// macOS default; an unknown one (unplugged) falls back to the default. A
// `--file` turn has no microphone and ignores it.
import AVFoundation
import CoreAudio
import FluidAudio
import Foundation
import NaturalLanguage

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

func argument(_ name: String) -> String? {
  let args = CommandLine.arguments
  guard let index = args.firstIndex(of: name), index + 1 < args.count else { return nil }
  return args[index + 1]
}

func debug(_ message: String) {
  FileHandle.standardError.write(Data("[orbit-parakeet] \(message)\n".utf8))
}

// ── The input device (CoreAudio); the same functions as speech-helper.swift ──
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

guard let modelsRoot = argument("--models-dir") else { fail("models-dir-missing") }
// AsrModels keeps the files in a sibling folder named for the model version
let modelsDir = URL(fileURLWithPath: modelsRoot).appendingPathComponent("parakeet")
let endpointMs = min(5_000, max(0, Int(argument("--endpoint-ms") ?? "") ?? 0))
let stopFile = argument("--stop-file")
let finishFile = argument("--finish-file")
let realtime = CommandLine.arguments.contains("--realtime")

// ── --prepare: download and warm the model, reporting progress ─────────────
if CommandLine.arguments.contains("--prepare") {
  Task {
    do {
      _ = try await AsrModels.downloadAndLoad(to: modelsDir, version: .v3) { progress in
        emit(["progress": (progress.fractionCompleted * 100).rounded() / 100])
      }
      emit(["ready": true])
      exit(0)
    } catch {
      fail("prepare-failed: \(error.localizedDescription)")
    }
  }
  RunLoop.main.run()
}

guard AsrModels.modelsExist(at: modelsDir, version: .v3) else { fail("model-missing") }

// ── a dictation turn ───────────────────────────────────────────────────────
// Live text and the end of the turn are ours, not FluidAudio's streaming
// manager's: that one says nothing until it holds 13 s of audio, longer than
// most things people say, so short turns showed no words and never ended.
// Parakeet hears a few seconds in ~50 ms, so the turn so far is simply heard
// again every 0.6 s; and the turn ends on the microphone's own silence.
final class Turn: @unchecked Sendable {
  let engine = AVAudioEngine()
  let lock = NSLock()
  // Conversion to 16 kHz happens here, one buffer after another, in order.
  let converting = DispatchQueue(label: "orbit.parakeet.convert")
  let converter = AudioConverter()
  // The whole turn at 16 kHz.
  var samples: [Float] = []
  var models: AsrModels?
  var asr: AsrManager?
  var finishing = false
  // Voice: louder than this room's own noise, which is learned as it goes.
  var noiseFloor: Float = 0
  var heardVoice = false
  var lastVoice = Date()
  // Live text: what was last shown, and the part of a long turn already
  // settled so each pass hears only its tail.
  var shown = ""
  var settledUpTo = 0
  var settledText = ""
  var live: Task<Void, Never>?

  func feed(_ buffer: AVAudioPCMBuffer, live isLive: Bool = true) {
    converting.async {
      guard let chunk = try? self.converter.resampleBuffer(buffer), !chunk.isEmpty else { return }
      var sum: Float = 0
      for sample in chunk { sum += sample * sample }
      let level = (sum / Float(chunk.count)).squareRoot()
      self.lock.withLock {
        self.samples.append(contentsOf: chunk)
        guard isLive else { return }
        // The floor drops at once to the quietest moment heard (so a turn
        // that starts mid-word corrects itself at the first pause) and rises
        // only slowly, through quiet moments, if the room gets louder.
        if self.noiseFloor == 0 || level < self.noiseFloor { self.noiseFloor = level }
        else if level < self.noiseFloor * 2 { self.noiseFloor = self.noiseFloor * 0.98 + level * 0.02 }
        if level > max(0.004, self.noiseFloor * 3) {
          self.heardVoice = true
          self.lastVoice = Date()
        }
      }
    }
  }

  /// `--file PATH`: the same turn fed from a recording instead of the
  /// microphone, so the pipeline can be checked without anyone speaking.
  /// `--realtime` feeds it at a microphone's pace and lets the endpoint end
  /// the turn, as it would live.
  func startFromFile(_ path: String) {
    loadModel()
    Task {
      guard let file = try? AVAudioFile(forReading: URL(fileURLWithPath: path)) else { fail("file-unreadable") }
      while file.framePosition < file.length {
        guard let buffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: 4096) else { break }
        do { try file.read(into: buffer) } catch { break }
        feed(buffer, live: realtime)
        if realtime {
          try? await Task.sleep(nanoseconds: UInt64(Double(buffer.frameLength) / buffer.format.sampleRate * 1_000_000_000))
        }
      }
      if !realtime { finish() }
    }
  }

  func start() {
    chooseInput(engine)
    let input = engine.inputNode
    let format = input.outputFormat(forBus: 0)
    input.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in
      guard let self, let copy = buffer.copy() as? AVAudioPCMBuffer else { return }
      self.feed(copy)
    }
    do {
      engine.prepare()
      try engine.start()
    } catch { fail("mic-failed") }
    loadModel()
  }

  func loadModel() {
    Task {
      do {
        let models = try await AsrModels.load(from: modelsDir, version: .v3)
        let asr = AsrManager(config: .default)
        try await asr.loadModels(models)
        lock.withLock {
          self.models = models
          self.asr = asr
        }
        let task = Task { await self.showLiveText() }
        lock.withLock { self.live = task }
      } catch {
        fail("model-load-failed")
      }
    }
  }

  func hear(_ audio: ArraySlice<Float>, _ language: Language? = nil) async -> String? {
    guard let asr = lock.withLock({ self.asr }) else { return nil }
    var state = TdtDecoderState.make(decoderLayers: await asr.decoderLayerCount)
    var piece = Array(audio)
    // the model wants at least a second of audio
    if piece.count < 16_000 { piece += [Float](repeating: 0, count: 16_000 - piece.count) }
    return (try? await asr.transcribe(piece, decoderState: &state, language: language))?.text
      .trimmingCharacters(in: .whitespaces)
  }

  /// Every 0.6 s while listening: hear the turn so far and show it. A long
  /// turn settles its older part every 15 s so each pass stays quick.
  func showLiveText() async {
    var heardUpTo = 0
    while !lock.withLock({ finishing }) {
      try? await Task.sleep(nanoseconds: 600_000_000)
      let (count, voice) = lock.withLock { (samples.count, heardVoice) }
      guard voice, count - heardUpTo >= 3_200 else { continue }
      heardUpTo = count
      if count - settledUpTo > 20 * 16_000 {
        let cut = settledUpTo + 15 * 16_000
        let audio = lock.withLock { samples[settledUpTo..<cut] }
        if let text = await hear(audio), !text.isEmpty { settledText = [settledText, text].filter { !$0.isEmpty }.joined(separator: " ") }
        settledUpTo = cut
      }
      let tail = lock.withLock { samples[settledUpTo..<count] }
      guard let text = await hear(tail), !lock.withLock({ finishing }) else { continue }
      let whole = [settledText, text].filter { !$0.isEmpty }.joined(separator: " ")
      if !whole.isEmpty && whole != shown {
        shown = whole
        emit(["partial": true, "text": whole])
      }
    }
  }

  /// The final text, language by language. Parakeet keeps to the language
  /// a stretch of audio started in, so a sentence that switches ("Can you
  /// check the routines, porque acho que falharam, and tell me…") lost the
  /// part in the other language. So: cut the turn at its pauses, hear each
  /// piece to learn its language, then rejoin neighbours in the same
  /// language and hear each run whole, with its language's script as the
  /// hint. A sentence in one language keeps all its context; only a real
  /// switch is split. Empty when there is nothing to transcribe.
  func transcribeByLanguage() async -> String {
    let audio = lock.withLock { samples }
    guard !audio.isEmpty else { return "" }
    func hear(_ range: Range<Int>, _ language: Language?) async -> String? {
      await self.hear(audio[range], language)
    }

    let pieces = speechSegments(audio)
    guard !pieces.isEmpty else { return "" }
    var languages: [Language?] = []
    for range in pieces {
      guard let text = await hear(range, nil) else { return "" }
      languages.append(spokenLanguage(text))
    }
    // a piece too short to tell takes its neighbour's language
    for i in languages.indices where languages[i] == nil {
      languages[i] = languages[..<i].last(where: { $0 != nil }) ?? languages[(i + 1)...].first(where: { $0 != nil }) ?? nil
    }
    var runs: [(Range<Int>, Language?)] = []
    for (range, language) in zip(pieces, languages) {
      if let last = runs.last, last.1 == language {
        runs[runs.count - 1] = (last.0.lowerBound..<range.upperBound, language)
      } else {
        runs.append((range, language))
      }
    }
    var parts: [String] = []
    for (range, language) in runs {
      guard let text = await hear(range, language) else { return "" }
      if !text.isEmpty { parts.append(text) }
    }
    return parts.joined(separator: " ")
  }

  /// Stop listening and say the final text once.
  func finish() {
    let first = lock.withLock { () -> Bool in
      if finishing { return false }
      finishing = true
      return true
    }
    guard first else { return }
    if engine.isRunning {
      engine.inputNode.removeTap(onBus: 0)
      engine.stop()
    }
    Task {
      // every buffer converted, a model still loading loaded, and the live
      // pass done, so the final pass hears all that was said, alone
      self.converting.sync {}
      while self.lock.withLock({ self.asr }) == nil { try? await Task.sleep(nanoseconds: 50_000_000) }
      await self.lock.withLock({ self.live })?.value
      let text = await self.transcribeByLanguage()
      emit(["partial": false, "text": (text.isEmpty ? self.shown : text).trimmingCharacters(in: .whitespaces)])
      exit(0)
    }
  }

  /// Quiet for `endpointMs` after the person has spoken: the turn is over.
  func quietLongEnough() -> Bool {
    guard endpointMs > 0 else { return false }
    return lock.withLock { heardVoice && Date().timeIntervalSince(lastVoice) * 1000 >= Double(endpointMs) }
  }
}

let spokenLanguages: [NLLanguage: Language] = {
  var mine: [NLLanguage: Language] = [:]
  for code in Locale.preferredLanguages {
    let base = String(code.prefix { $0 != "-" && $0 != "_" })
    if let language = Language(rawValue: base) { mine[NLLanguage(rawValue: base)] = language }
  }
  if mine.count >= 2 { return mine }
  return Dictionary(uniqueKeysWithValues: Language.allCases.map { (NLLanguage(rawValue: $0.rawValue), $0) })
}()

/// A piece's language from its words; nil when it is too short to tell.
func spokenLanguage(_ text: String) -> Language? {
  guard text.split(separator: " ").count >= 3 else { return nil }
  let recognizer = NLLanguageRecognizer()
  recognizer.languageConstraints = Array(spokenLanguages.keys)
  recognizer.processString(text)
  return recognizer.dominantLanguage.flatMap { spokenLanguages[$0] }
}

/// Where to cut a turn: at pauses of a quarter second or more, into pieces
/// no longer than 12 s (a long run with no pause is cut at its quietest
/// moment). Quiet is judged against the turn's own noise floor, so a noisy
/// room doesn't read as one long sentence.
func speechSegments(_ audio: [Float]) -> [Range<Int>] {
  let frame = 480  // 30 ms at 16 kHz
  let count = audio.count / frame
  guard count > 0 else { return [] }
  var energy = [Float](repeating: 0, count: count)
  for i in 0..<count {
    var sum: Float = 0
    for j in (i * frame)..<((i + 1) * frame) { sum += audio[j] * audio[j] }
    energy[i] = (sum / Float(frame)).squareRoot()
  }
  let floor = energy.sorted()[count / 5]
  let threshold = max(floor * 3, 0.006)
  let minPause = 8     // 240 ms
  let maxFrames = 400  // 12 s
  let minFrames = 20   // 0.6 s: shorter pieces join their neighbour

  var cuts: [Int] = [0]
  var quietRun = 0
  for i in 0..<count {
    if energy[i] < threshold { quietRun += 1 } else {
      if quietRun >= minPause, i - quietRun / 2 - cuts.last! >= minFrames { cuts.append(i - quietRun / 2) }
      quietRun = 0
    }
    if i - cuts.last! >= maxFrames {
      let from = cuts.last! + maxFrames / 2
      let quietest = (from...i).min { energy[$0] < energy[$1] } ?? i
      cuts.append(quietest)
    }
  }
  cuts.append(count)
  var ranges: [Range<Int>] = []
  for (start, end) in zip(cuts, cuts.dropFirst()) where end > start {
    let piece = (start * frame)..<min(audio.count, end * frame)
    // a stretch with no speech at all adds nothing
    if energy[start..<end].contains(where: { $0 >= threshold }) { ranges.append(piece) }
  }
  return ranges
}

let turn = Turn()

if let file = argument("--file") {
  turn.startFromFile(file)
} else {
  AVCaptureDevice.requestAccess(for: .audio) { granted in
    guard granted else { fail("mic-denied") }
    DispatchQueue.main.async { turn.start() }
  }
}


// The markers and the endpoint, checked ten times a second.
let timer = DispatchSource.makeTimerSource(queue: .global(qos: .userInitiated))
timer.schedule(deadline: .now() + .milliseconds(100), repeating: .milliseconds(100))
timer.setEventHandler {
  let files = FileManager.default
  if let stopFile, files.fileExists(atPath: stopFile) { exit(0) }
  if let finishFile, files.fileExists(atPath: finishFile) { turn.finish() }
  if turn.quietLongEnough() { turn.finish() }
}
timer.resume()

RunLoop.main.run()
