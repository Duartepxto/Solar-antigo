import XCTest

/// A scripted walk for checking the app by hand against an isolated fixture:
/// reads one step per line from the file named by `ORBIT_DRIVE_SCRIPT`
/// (`TEST_RUNNER_ORBIT_DRIVE_SCRIPT` on the xcodebuild line) and writes
/// screenshots and element dumps to `ORBIT_DRIVE_OUT`. Skipped otherwise.
///
/// Steps: `launch [args…]`, `attach`, `open <url>`, `springboard <label>`,
/// `tap <identifier or label>`, `tapif <…>`, `press <…>`, `at <x> <y>`
/// (normalised), `double <x> <y>`, `type <text>`, `swipe up|down|left|right`,
/// `drag <x0> <y0> <x1> <y1>`, `wait <…>`, `sleep <s>`, `shot <name>`,
/// `dump <name>`.
final class DriverUITests: XCTestCase {
    private var env: [String: String] { ProcessInfo.processInfo.environment }
    private let app = XCUIApplication()

    override func setUpWithError() throws {
        try XCTSkipIf(env["ORBIT_DRIVE_SCRIPT"] == nil, "No drive script")
        continueAfterFailure = true
    }

    private func find(_ key: String) -> XCUIElement {
        let byId = app.descendants(matching: .any).matching(identifier: key).firstMatch
        if byId.exists { return byId }
        return app.descendants(matching: .any).matching(NSPredicate(format: "label == %@", key)).firstMatch
    }

    @MainActor
    func testDrive() throws {
        let script = try String(contentsOfFile: env["ORBIT_DRIVE_SCRIPT"]!, encoding: .utf8)
        let out = URL(fileURLWithPath: env["ORBIT_DRIVE_OUT"] ?? NSTemporaryDirectory())
        try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)
        var log: [String] = []
        for raw in script.split(separator: "\n") {
            let line = raw.trimmingCharacters(in: .whitespaces)
            guard !line.isEmpty, !line.hasPrefix("#") else { continue }
            let parts = line.split(separator: " ", maxSplits: 1).map(String.init)
            let cmd = parts[0], arg = parts.count > 1 ? parts[1] : ""
            var result = "ok"
            switch cmd {
            case "launch":
                app.launchArguments = arg.split(separator: " ").map(String.init)
                app.launchEnvironment["ORBIT_UI_TEST_OWNER_CHECK"] = "passes"
                app.launch()
            case "attach": app.activate()
            case "open": XCUIDevice.shared.system.open(URL(string: arg)!)
            case "springboard":
                let b = XCUIApplication(bundleIdentifier: "com.apple.springboard").buttons[arg]
                if b.waitForExistence(timeout: 4) { b.tap() } else { result = "missing" }
            case "tap", "tapif", "press":
                let e = find(arg)
                if e.waitForExistence(timeout: cmd == "tapif" ? 1.5 : 8) {
                    let screen = app.frame
                    var f = e.frame
                    // bring an element in a sideways row into view
                    var tries = 0
                    while (f.maxX > screen.maxX - 4 || f.minX < 4) && f.width < screen.width && tries < 8 {
                        let y = f.midY / screen.height, left = f.maxX > screen.maxX - 4
                        app.coordinate(withNormalizedOffset: CGVector(dx: left ? 0.75 : 0.25, dy: y))
                            .press(forDuration: 0.05, thenDragTo: app.coordinate(withNormalizedOffset: CGVector(dx: left ? 0.45 : 0.55, dy: y)))
                        f = e.frame; tries += 1
                    }
                    let point = app.coordinate(withNormalizedOffset: .zero).withOffset(CGVector(dx: f.midX, dy: f.midY))
                    if cmd == "press" { point.press(forDuration: 1.2) } else { point.tap() }
                } else { result = "missing" }
            case "double":
                let v = arg.split(separator: " ").compactMap { Double($0) }
                app.coordinate(withNormalizedOffset: CGVector(dx: v[0], dy: v[1])).doubleTap()
            case "at":
                let v = arg.split(separator: " ").compactMap { Double($0) }
                app.coordinate(withNormalizedOffset: CGVector(dx: v[0], dy: v[1])).tap()
            case "drag":
                let v = arg.split(separator: " ").compactMap { Double($0) }
                app.coordinate(withNormalizedOffset: CGVector(dx: v[0], dy: v[1]))
                    .press(forDuration: 0.1, thenDragTo: app.coordinate(withNormalizedOffset: CGVector(dx: v[2], dy: v[3])))
            case "type": app.typeText(arg.replacingOccurrences(of: "\\n", with: "\n"))
            case "swipe":
                switch arg { case "up": app.swipeUp(); case "down": app.swipeDown(); case "left": app.swipeLeft(); default: app.swipeRight() }
            case "wait": if !find(arg).waitForExistence(timeout: 15) { result = "missing" }
            case "sleep": Thread.sleep(forTimeInterval: Double(arg) ?? 1)
            case "shot":
                try? XCUIScreen.main.screenshot().pngRepresentation.write(to: out.appendingPathComponent("\(arg).png"))
            case "dump":
                try? app.debugDescription.write(to: out.appendingPathComponent("\(arg).txt"), atomically: true, encoding: .utf8)
            default: result = "unknown"
            }
            log.append("\(line) -> \(result)")
            try? log.joined(separator: "\n").write(to: out.appendingPathComponent("drive.log"), atomically: true, encoding: .utf8)
        }
        try? log.joined(separator: "\n").write(to: out.appendingPathComponent("drive.log"), atomically: true, encoding: .utf8)
    }
}
