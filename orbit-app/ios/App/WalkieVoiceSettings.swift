// Walkie's voice: the ElevenLabs key it speaks with and which voice it uses.
//
// The key is pasted once and kept in this phone's Keychain — never in
// defaults, never sent to the computer. It is checked against ElevenLabs
// before it is saved, so a bad key fails at the paste rather than on the
// first reply.
import CompanionCore
import Security
import SwiftUI
import UIKit

enum WalkieVoicePrefs {
    static let voiceId = "walkie.voiceId"
    static let useAgentVoices = "walkie.useAgentVoices"
}

enum WalkieVoiceKey {
    private static let service = "com.orbit.walkie.elevenlabs"
    private static let account = "api-key"

    private static var identity: [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
    }

    static func read() -> String? {
        var query = identity
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne
        var item: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess,
              let data = item as? Data,
              let key = String(data: data, encoding: .utf8),
              !key.isEmpty else { return nil }
        return key
    }

    @discardableResult
    static func save(_ key: String) -> Bool {
        let data = Data(key.utf8)
        var status = SecItemUpdate(identity as CFDictionary, [kSecValueData as String: data] as CFDictionary)
        if status == errSecItemNotFound {
            var add = identity
            add[kSecValueData as String] = data
            add[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
            status = SecItemAdd(add as CFDictionary, nil)
        }
        return status == errSecSuccess
    }

    static func remove() {
        SecItemDelete(identity as CFDictionary)
    }
}

struct WalkieVoiceSheet: View {
    /// Play a short sample with the current settings.
    let onSample: () -> Void

    @Environment(\.dismiss) private var systemDismiss
    @Environment(\.orbitClose) private var orbitClose
    private var dismiss: OrbitDismiss { OrbitDismiss(system: systemDismiss, close: orbitClose) }
    @AppStorage(WalkieVoicePrefs.voiceId) private var voiceId = ""
    @AppStorage(WalkieVoicePrefs.useAgentVoices) private var useAgentVoices = true
    @State private var keyDraft = ""
    @State private var hasKey = WalkieVoiceKey.read() != nil
    @State private var voices: [ElevenLabs.Voice] = []
    @State private var problem: String?
    @State private var checking = false

    var body: some View {
        OrbitPanelList(icon: "person.wave.2", kicker: "Walkie", title: String(localized: "Voice"),
                       description: "Replies are spoken by ElevenLabs straight from this phone. The key stays in this phone's Keychain.") {
            Section {
                if hasKey {
                    OrbitRow(dot: Orbit.success, title: Text("ElevenLabs key"), value: Text("Saved on this phone"))
                    OrbitPanelButton(title: "Remove key", role: .destructive) {
                        WalkieVoiceKey.remove()
                        hasKey = false
                        voices = []
                    }
                    .listRowSeparator(.hidden)
                } else {
                    SecureField("ElevenLabs API key", text: $keyDraft)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .font(.system(size: 14.5, design: .monospaced))
                        .padding(.horizontal, 12).frame(height: 42)
                        .background(RoundedRectangle(cornerRadius: 10).fill(Orbit.fill06))
                        .listRowSeparator(.hidden)
                    HStack(spacing: 8) {
                        OrbitPanelButton(title: "Paste") {
                            keyDraft = UIPasteboard.general.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
                        }
                        Spacer()
                        OrbitPanelButton(title: "Check and save", busy: checking) { Task { await saveKey() } }
                            .disabled(keyDraft.trimmingCharacters(in: .whitespaces).isEmpty || checking)
                    }
                    .listRowSeparator(.hidden)
                    Text("Get one at elevenlabs.io → Developers → API keys.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                        .listRowSeparator(.hidden)
                }
                if let problem {
                    Label(problem, systemImage: "exclamationmark.triangle")
                        .font(.system(size: 13)).foregroundStyle(Orbit.amberText)
                        .listRowSeparator(.hidden)
                }
            } header: { OrbitSectionHeader("ElevenLabs") }

            if hasKey {
                Section {
                    Toggle(isOn: $useAgentVoices) {
                        Text("Each bot speaks in its own voice").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    }
                    .tint(Orbit.accent)
                    Picker(selection: $voiceId) {
                        Text("George (default)").tag("")
                        ForEach(voices) { voice in
                            Text(voice.detail.map { "\(voice.name) · \($0)" } ?? voice.name).tag(voice.id)
                        }
                    } label: {
                        Text("Voice").font(.system(size: 15)).foregroundStyle(Orbit.ink)
                    }
                    .pickerStyle(.menu)
                    .tint(Orbit.ink60)
                    Text("Bots with an ElevenLabs voice picked on your computer use it when this is on. Everyone else uses the voice above.")
                        .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                        .listRowSeparator(.hidden)
                    OrbitPanelButton(title: "Play a sample", action: onSample)
                        .listRowSeparator(.hidden)
                } header: { OrbitSectionHeader("Who speaks") }
            }

            Section {
                HStack {
                    Spacer()
                    Button("Done") { dismiss() }
                        .buttonStyle(OrbitPrimaryButtonStyle())
                }
                .padding(.vertical, 16)
                .listRowSeparator(.hidden)
            }
        }
        .task { await loadVoices() }
    }

    private func saveKey() async {
        let key = keyDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        checking = true
        defer { checking = false }
        do {
            let list = try await ElevenLabs.voices(key: key)
            guard WalkieVoiceKey.save(key) else {
                problem = String(localized: "Couldn't save the key to this phone's Keychain.")
                return
            }
            voices = list
            keyDraft = ""
            problem = nil
            hasKey = true
        } catch {
            problem = error.localizedDescription
        }
    }

    private func loadVoices() async {
        guard let key = WalkieVoiceKey.read() else { return }
        do {
            voices = try await ElevenLabs.voices(key: key)
        } catch {
            problem = error.localizedDescription
        }
    }
}
