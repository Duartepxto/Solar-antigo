// Native QR scanning for the one action where typing is needless friction.
//
// The scanner only recognizes QR codes and never pairs by itself. A valid
// payload is returned to PairingView, which shows the computer name and
// address for explicit confirmation. That mirrors T3 Code's production rule:
// an attacker-controlled deep link or QR may prefill a target, but it cannot
// silently authorize that target.
import AVFoundation
import SwiftUI
import UIKit
import VisionKit

struct PairingScannerSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase

    /// Return nil to accept and close, or a human-readable validation error
    /// to keep scanning. The one-time credential never lives in this view.
    let validate: (String) -> LocalizedStringKey?

    @State private var cameraAuthorized = AVCaptureDevice.authorizationStatus(for: .video) == .authorized
    @State private var permissionResolved = AVCaptureDevice.authorizationStatus(for: .video) != .notDetermined
    @State private var validationError: LocalizedStringKey?

    var body: some View {
        Group {
                if !permissionResolved {
                    ZStack {
                        Orbit.canvas.ignoresSafeArea()
                        ProgressView().tint(Orbit.ink50)
                    }
                } else if !cameraAuthorized {
                    OrbitStage(back: ("Cancel", { dismiss() }), kicker: "Camera",
                               title: Text("Camera access needed"),
                               detail: Text("Allow the camera to scan the pairing QR code Orbit shows on your computer."),
                               symbol: "camera", symbolTint: Orbit.ink) {
                        EmptyView()
                    } actions: {
                        Button {
                            guard let url = URL(string: UIApplication.openSettingsURLString) else { return }
                            UIApplication.shared.open(url)
                        } label: { Text("Open iOS Settings").frame(maxWidth: .infinity) }
                        .buttonStyle(OrbitPrimaryButtonStyle())
                    }
                } else if !DataScannerViewController.isSupported || !DataScannerViewController.isAvailable {
                    OrbitStage(back: ("Cancel", { dismiss() }), kicker: "Camera",
                               title: Text("Scanner unavailable"),
                               detail: Text("Scan the code with the Camera app, or go back and enter the address and code."),
                               symbol: "qrcode.viewfinder", symbolTint: Orbit.ink) {
                        EmptyView()
                    } actions: {
                        Button { dismiss() } label: { Text("Back").frame(maxWidth: .infinity) }
                            .buttonStyle(OrbitPrimaryButtonStyle())
                    }
                } else {
                    ZStack(alignment: .bottom) {
                        PairingQRScanner { payload in
                            if let error = validate(payload) {
                                validationError = error
                                return false
                            }
                            dismiss()
                            return true
                        }
                        .ignoresSafeArea(edges: .bottom)

                        Text(validationError ?? "Point the camera at the QR code on your computer")
                            .font(.system(size: 14, weight: .medium))
                            .multilineTextAlignment(.center)
                            .foregroundStyle(validationError == nil ? Orbit.ink : Orbit.dangerText)
                            .padding(.horizontal, 18)
                            .padding(.vertical, 12)
                            .background(Capsule().fill(Orbit.canvas.opacity(0.8)))
                            .padding(.bottom, 24)
                    }
                    .overlay(alignment: .topLeading) {
                        Button { dismiss() } label: {
                            HStack(spacing: 3) {
                                Image(systemName: "chevron.left").font(.system(size: 14, weight: .semibold))
                                Text("Cancel").font(.system(size: 14.5))
                            }
                            .foregroundStyle(Orbit.ink)
                            .padding(.horizontal, 14).frame(height: 36)
                            .background(Capsule().fill(Orbit.canvas.opacity(0.7)))
                        }
                        .buttonStyle(.plain)
                        .padding(.leading, 12)
                        .accessibilityIdentifier("back")
                    }
                }
            }
            .task { await resolveCameraPermission() }
            .onValueChange(of: scenePhase) { phase in
                // If access was granted in Settings, recover immediately when
                // the user returns instead of requiring the sheet to reopen.
                if phase == .active {
                    Task { await resolveCameraPermission() }
                }
            }
    }

    private func resolveCameraPermission() async {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            cameraAuthorized = true
            permissionResolved = true
        case .notDetermined:
            cameraAuthorized = await AVCaptureDevice.requestAccess(for: .video)
            permissionResolved = true
        case .denied, .restricted:
            cameraAuthorized = false
            permissionResolved = true
        @unknown default:
            cameraAuthorized = false
            permissionResolved = true
        }
    }
}

private struct PairingQRScanner: UIViewControllerRepresentable {
    let onPayload: (String) -> Bool

    func makeCoordinator() -> Coordinator {
        Coordinator(onPayload: onPayload)
    }

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let controller = DataScannerViewController(
            recognizedDataTypes: [.barcode(symbologies: [.qr])],
            qualityLevel: .balanced,
            recognizesMultipleItems: false,
            isHighFrameRateTrackingEnabled: false,
            isPinchToZoomEnabled: true,
            isGuidanceEnabled: true,
            isHighlightingEnabled: true
        )
        controller.delegate = context.coordinator
        DispatchQueue.main.async {
            try? controller.startScanning()
        }
        return controller
    }

    func updateUIViewController(_ controller: DataScannerViewController, context: Context) {
        context.coordinator.onPayload = onPayload
        if !controller.isScanning {
            try? controller.startScanning()
        }
    }

    static func dismantleUIViewController(_ controller: DataScannerViewController, coordinator: Coordinator) {
        controller.stopScanning()
    }

    final class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var onPayload: (String) -> Bool
        private var locked = false

        init(onPayload: @escaping (String) -> Bool) {
            self.onPayload = onPayload
        }

        func dataScanner(
            _ dataScanner: DataScannerViewController,
            didAdd addedItems: [RecognizedItem],
            allItems: [RecognizedItem]
        ) {
            guard !locked else { return }
            guard let first = addedItems.first,
                  case let .barcode(barcode) = first,
                  let payload = barcode.payloadStringValue
            else { return }

            locked = true
            if !onPayload(payload) {
                // A camera reports the same QR on many consecutive frames.
                // Give the error time to be read before allowing a retry.
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { [weak self] in
                    self?.locked = false
                }
            }
        }
    }
}
