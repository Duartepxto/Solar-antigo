// Pairing: make QR scanning the obvious path, then keep discovery and manual
// entry available without making network plumbing part of onboarding.
import SwiftUI
import CompanionCore
#if canImport(UIKit)
import UIKit
#endif

struct PairingView: View {
    @EnvironmentObject private var session: Session
    @StateObject private var discovery = Discovery()

    @State private var manualAddress = ""
    @State private var code = ""
    @State private var scannedCredential: String?
    /// Stable across Retry. If the Mac committed a device but the response
    /// was lost, repeating this same logical request recovers its token.
    @State private var pairRequestId: String?
    @State private var chosen: Connection?
    @State private var submission = CompanionPairingSubmissionState()
    @State private var failure: String?
    @State private var showingScanner = false
    @State private var showingOtherWays = false
    @State private var showingManualInput = false
    @State private var choiceGeneration = 0

    private let onCancel: () -> Void

    init(onCancel: @escaping () -> Void = {}) {
        self.onCancel = onCancel
    }

    private var pairing: Bool { submission.isInFlight }

    var body: some View {
        Group {
            if let chosen {
                confirmation(for: chosen)
            } else {
                start
            }
        }
        .onAppear { accept(session.pairingInvite) }
        .onDisappear {
            choiceGeneration += 1
            discovery.stop()
        }
        .onValueChange(of: session.pairingInvite) { invite in accept(invite) }
        .onValueChange(of: showingOtherWays) { isShowing in
            if isShowing { discovery.start() } else { discovery.stop() }
        }
        // the camera is the one thing that takes the whole screen
        .fullScreenCover(isPresented: $showingScanner) {
            PairingScannerSheet { payload in
                guard let url = URL(string: payload), let invite = PairingInvite.parse(url) else {
                    return "That isn't an Orbit pairing QR code."
                }
                accept(invite)
                return nil
            }
        }
    }

    // MARK: - Scan, or another way

    private var start: some View {
        OrbitStage(back: submission.allowsNavigation ? ("Not now", onCancel) : nil,
                   kicker: "Connect", title: Text("Pair with your computer"),
                   detail: Text("Scan the QR code Orbit shows on your computer. It picks the best way to connect on its own.")) {
            VStack(alignment: .leading, spacing: 14) {
                Text("On your computer: Orbit → You → Phone → Set up a phone.")
                    .font(.system(size: 13))
                    .foregroundStyle(Orbit.ink50)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .multilineTextAlignment(.center)
                if let failure { errorLine(failure) }
                otherWays.padding(.top, 10)
            }
        } actions: {
            Button {
                Haptics.selection()
                failure = nil
                showingScanner = true
            } label: {
                Label("Scan QR code", systemImage: "qrcode.viewfinder").frame(maxWidth: .infinity)
            }
            .buttonStyle(OrbitPrimaryButtonStyle())
        }
    }

    private var otherWays: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button {
                withAnimation(.easeOut(duration: 0.2)) { showingOtherWays.toggle() }
            } label: {
                HStack {
                    OrbitKicker("Other ways to connect")
                    Spacer()
                    Image(systemName: "chevron.down")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Orbit.ink50)
                        .rotationEffect(.degrees(showingOtherWays ? 180 : 0))
                }
                .frame(height: 36)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .overlay(alignment: .bottom) { Rectangle().fill(Orbit.hairline).frame(height: 1) }

            if showingOtherWays {
                discoveredComputers.padding(.top, 12)
                Button {
                    withAnimation(.easeOut(duration: 0.2)) { showingManualInput.toggle() }
                } label: {
                    OrbitRow(icon: "keyboard", title: Text("Enter address and code"), value: Text(showingManualInput ? "Hide" : ""))
                }
                .buttonStyle(.plain)
                .padding(.top, 6)
                if showingManualInput { manualEntry.padding(.top, 12) }
            }
        }
    }

    @ViewBuilder
    private var discoveredComputers: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 8) {
                Text("Nearby computers").font(.system(size: 13, weight: .medium)).foregroundStyle(Orbit.ink60)
                if discovery.browsing && discovery.found.isEmpty {
                    ProgressView().controlSize(.small).tint(Orbit.ink50)
                        .accessibilityLabel("Looking for computers")
                }
                Spacer()
            }
            .padding(.bottom, 6)
            if let discoveryFailure = discovery.failure {
                Text(discoveryFailure)
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                    .fixedSize(horizontal: false, vertical: true)
            } else if discovery.found.isEmpty {
                Text("Computers ready to pair show up here.")
                    .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
            } else {
                ForEach(discovery.found) { service in
                    OrbitRow(icon: "laptopcomputer", title: Text(verbatim: service.name), value: Text("Pair")) {
                        Haptics.selection()
                        Task { await choose(service) }
                    }
                    .accessibilityHint("Enter the code shown on this computer")
                }
            }
        }
    }

    private var manualEntry: some View {
        VStack(alignment: .leading, spacing: 10) {
            TextField("Computer address", text: $manualAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .keyboardType(.URL)
                .textContentType(.URL)
                .font(.system(size: 14.5, design: .monospaced))
                .foregroundStyle(Orbit.ink)
                .padding(.horizontal, 12).frame(height: 42)
                .background(RoundedRectangle(cornerRadius: 10).fill(Orbit.fill06))
            Text("The address shown under Phone in Orbit on your computer.")
                .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
            HStack {
                Spacer()
                OrbitPanelButton(title: "Continue") {
                    Haptics.selection()
                    failure = nil
                    // The whole link a server printed (https://host/pair#code=…) is
                    // fine here too: it names both the address and the code.
                    if let url = URL(string: manualAddress.trimmingCharacters(in: .whitespacesAndNewlines)),
                       let invite = PairingInvite.parse(url) {
                        accept(invite)
                        return
                    }
                    guard let connection = Self.parse(manualAddress) else {
                        failure = "That address doesn't look right. Copy it from Phone settings and try again."
                        return
                    }
                    choiceGeneration += 1
                    scannedCredential = nil
                    pairRequestId = nil
                    chosen = connection
                }
                .disabled(manualAddress.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
    }

    // MARK: - Is this your computer?

    @ViewBuilder
    private func confirmation(for connection: Connection) -> some View {
        let badge = connectionBadge(for: connection)
        OrbitStage(back: submission.allowsNavigation ? ("Other computers", {
                        Haptics.selection()
                        chosen = nil
                        code = ""
                        scannedCredential = nil
                        pairRequestId = nil
                        failure = nil
                   }) : nil,
                   kicker: LocalizedStringKey(badge.title), title: Text(verbatim: connection.name),
                   detail: Text("Make sure this is the computer you expect before connecting."),
                   symbol: "laptopcomputer", symbolTint: Orbit.success) {
            VStack(alignment: .leading, spacing: 14) {
                VStack(alignment: .leading, spacing: 4) {
                    OrbitKicker("Address")
                    Text(verbatim: connection.pairingConsentOrigin)
                        .font(.system(size: 13, design: .monospaced))
                        .foregroundStyle(Orbit.ink70)
                        .textSelection(.enabled)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .accessibilityElement(children: .combine)

                if scannedCredential != nil {
                    if !connectionIsProtected(connection) {
                        Text("Only continue on a network you trust. A local connection is checked but not encrypted by Orbit.")
                            .font(.system(size: 12.5)).foregroundStyle(Orbit.amberText)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                } else {
                    VStack(alignment: .leading, spacing: 6) {
                        OrbitKicker("Code on your computer")
                        TextField("000000", text: $code)
                            .keyboardType(.asciiCapable)
                            .textInputAutocapitalization(.characters)
                            .autocorrectionDisabled()
                            .textContentType(.oneTimeCode)
                            .font(.system(size: 28, weight: .semibold, design: .monospaced))
                            .foregroundStyle(Orbit.ink)
                            .multilineTextAlignment(.center)
                            .frame(height: 60)
                            .background(RoundedRectangle(cornerRadius: 12).fill(Orbit.fill06))
                            .onValueChange(of: code) { value in
                                // six digits for a computer, ABCD-EFGH-JKLM for a server
                                code = String(value.uppercased().filter { $0.isASCII && ($0.isNumber || $0.isLetter || $0 == "-") }.prefix(14))
                            }
                        if code.count >= 12, !Self.codeLooksComplete(code) {
                            Text("A server's code is 12 letters and digits, never 0, O, 1 or I.")
                                .font(.system(size: 12.5)).foregroundStyle(Orbit.ink50)
                        }
                    }
                }
                if let failure { errorLine(failure) }
            }
        } actions: {
            Button {
                Haptics.selection()
                beginSubmission(connection, credential: scannedCredential ?? code)
            } label: {
                HStack(spacing: 8) {
                    if pairing { ProgressView().tint(Color(hex: "#070707")) }
                    Text(pairing ? "Connecting…" : "Connect")
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(OrbitPrimaryButtonStyle())
            .disabled(pairing || (scannedCredential == nil && !Self.codeLooksComplete(code)))
        }
    }

    private func errorLine(_ message: String) -> some View {
        Label {
            Text(message).fixedSize(horizontal: false, vertical: true)
        } icon: {
            Image(systemName: "exclamationmark.circle")
        }
        .font(.system(size: 13))
        .foregroundStyle(Orbit.dangerText)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }

    @MainActor
    private func choose(_ service: Discovery.Found) async {
        choiceGeneration += 1
        let generation = choiceGeneration
        failure = nil
        pairRequestId = nil
        do {
            let resolved = try await discovery.resolve(service)
            guard generation == choiceGeneration else { return }
            chosen = resolved
        } catch {
            guard generation == choiceGeneration else { return }
            failure = error.localizedDescription
        }
    }

    @MainActor
    private func beginSubmission(_ connection: Connection, credential: String) {
        guard submission.begin() else { return }
        Task { await submit(connection, credential: credential) }
    }

    @MainActor
    private func submit(_ connection: Connection, credential: String) async {
        failure = nil
        var succeeded = false
        defer {
            submission.finish()
            // A deep link received during the commit cannot replace the
            // consent screen. If this request failed, present it only after
            // the in-flight request has fully settled.
            if succeeded {
                session.consumePairingInvite()
                onCancel()
            } else {
                accept(session.pairingInvite)
            }
        }
        let cameFromScanner = scannedCredential != nil
        let requestId = pairRequestId ?? UUID().uuidString
        pairRequestId = requestId
        do {
            try await session.pair(
                with: connection,
                credential: credential,
                deviceName: Self.deviceName(),
                pairRequestId: requestId
            )
            pairRequestId = nil
            succeeded = true
        } catch {
            if cameFromScanner {
                if error is PairingRouteError {
                    failure = error.localizedDescription
                } else {
                    failure = "\(error.localizedDescription) Start pairing again on your computer and rescan the new QR code."
                    chosen = nil
                    scannedCredential = nil
                    pairRequestId = nil
                }
            } else {
                failure = error.localizedDescription
                if !(error is PairingRouteError) {
                    code = ""
                    pairRequestId = nil
                }
            }
        }
    }

    /// A companion's six digits, or a server's twelve characters.
    static func codeLooksComplete(_ code: String) -> Bool {
        (code.count == 6 && code.allSatisfy(\.isNumber)) || PairingInvite.normalizedServerCode(code) != nil
    }

    private func accept(_ invite: PairingInvite?) {
        guard submission.allowsNavigation, let invite else { return }
        choiceGeneration += 1
        chosen = invite.connection
        scannedCredential = invite.credential
        pairRequestId = UUID().uuidString
        code = ""
        failure = nil
        session.consumePairingInvite()
    }

    private func connectionIsProtected(_ connection: Connection) -> Bool {
        connection.activeEndpoint?.protectsCredentials
            ?? connection.automaticEndpoints.first?.protectsCredentials
            ?? false
    }

    private func connectionBadge(for connection: Connection) -> (title: String, systemImage: String) {
        let kind = connection.activeEndpoint?.kind ?? connection.automaticEndpoints.first?.kind
        if kind == .hosted {
            return ("HTTPS connection", "lock.shield.fill")
        }
        if kind == .tailnet {
            return ("Tailscale connection", "lock.shield.fill")
        }
        return ("Trusted local connection", "checkmark.shield.fill")
    }

    static func deviceName() -> String {
        #if canImport(UIKit)
        return UIDevice.current.name
        #else
        return "Companion"
        #endif
    }

    static func parse(_ text: String) -> Connection? {
        Connection.parse(text)
    }
}
