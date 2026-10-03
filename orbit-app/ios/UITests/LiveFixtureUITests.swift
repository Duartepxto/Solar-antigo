import XCTest

/// Drives the app against an isolated fixture computer (a disposable harness
/// and companion sidecar started with the fake engine) and saves screenshots.
///
/// Skipped unless the runner is given the fixture: pass
/// `TEST_RUNNER_ORBIT_LIVE_PAIR_URL=orbit://pair?...` (the invite for that
/// fixture) and `TEST_RUNNER_ORBIT_LIVE_SHOTS=/path/to/dir` to xcodebuild.
/// Never point it at a real computer: the tests send messages.
final class LiveFixtureUITests: XCTestCase {
    private var env: [String: String] { ProcessInfo.processInfo.environment }

    override func setUpWithError() throws {
        continueAfterFailure = false
        try XCTSkipIf(env["ORBIT_LIVE_SHOTS"] == nil, "No isolated fixture configured")
    }

    private func shot(_ name: String, _ app: XCUIApplication) {
        let data = XCUIScreen.main.screenshot().pngRepresentation
        if let dir = env["ORBIT_LIVE_SHOTS"] {
            try? FileManager.default.createDirectory(atPath: dir, withIntermediateDirectories: true)
            try? data.write(to: URL(fileURLWithPath: dir).appendingPathComponent("\(name).png"))
        }
        let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    private func tapSpringboard(_ label: String, timeout: TimeInterval = 5) {
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let button = springboard.buttons[label]
        if button.waitForExistence(timeout: timeout) { button.tap() }
    }

    @MainActor
    func test01Pair() throws {
        let raw = try XCTUnwrap(env["ORBIT_LIVE_PAIR_URL"], "no pairing invite")
        let app = XCUIApplication()
        app.launch()
        sleep(2)
        shot("pair-00-launch", app)
        XCUIDevice.shared.system.open(try XCTUnwrap(URL(string: raw)))
        tapSpringboard("Open")
        let connect = app.buttons["Connect"]
        XCTAssertTrue(connect.waitForExistence(timeout: 10))
        shot("pair-01-confirm", app)
        connect.tap()
        sleep(4)
        tapSpringboard("Allow", timeout: 3)
        shot("pair-02-after", app)
        for label in ["Not now", "Not Now", "Continue", "Skip"] where app.buttons[label].exists {
            app.buttons[label].tap()
            sleep(1)
        }
        sleep(2)
        shot("pair-03-home", app)
    }

    /// Open a bot by its accessible name, wherever the home screen shows it.
    private func openBot(_ name: String, in app: XCUIApplication) {
        let target = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'map-bot.' AND label == %@", name)).firstMatch
        XCTAssertTrue(target.waitForExistence(timeout: 10), "no \(name) on the home screen")
        target.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()
        sleep(3)
    }

    @MainActor
    func test02Screens() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(4)
        shot("home", app)
        if app.buttons["map-search"].exists {
            app.buttons["map-search"].tap()
            sleep(1)
            shot("search", app)
            app.textFields["search-field"].typeText("r")
            sleep(1)
            shot("search-typed", app)
            app.buttons["Cancel"].tap()
            sleep(1)
        }
        openBot(env["ORBIT_LIVE_BOT"] ?? "Atlas", in: app)
        shot("bot", app)
        let input = app.descendants(matching: .any).matching(identifier: "message-input").firstMatch
        if input.waitForExistence(timeout: 5) {
            input.tap()
            input.typeText("Summarise what you did today.")
            shot("bot-typing", app)
            app.buttons["Send"].tap()
            sleep(3)
            shot("bot-reply", app)
        }
        if app.buttons["back"].exists { app.buttons["back"].tap(); sleep(1) }
        if app.buttons["map-waiting"].waitForExistence(timeout: 3) {
            app.buttons["map-waiting"].tap()
            sleep(2)
            shot("waiting", app)
            app.swipeDown()
            sleep(2)
        }
        app.buttons["map-settings"].tap()
        sleep(2)
        shot("you-settings", app)
    }

    @MainActor
    func test03Approval() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(4)
        openBot("Probe", in: app)
        shot("approval", app)
        let allow = app.buttons["Allow"].firstMatch
        if allow.waitForExistence(timeout: 5) {
            allow.tap()
            sleep(3)
            shot("approval-answered", app)
        }
        app.buttons["back"].tap()
        sleep(2)
        shot("map-after-approval", app)
    }

    /// Open a chip's sheet, screenshot it, and put it away.
    private func chip(_ id: String, _ shotName: String, in app: XCUIApplication, then: ((XCUIApplication) -> Void)? = nil) {
        let button = app.buttons["chip-\(id)"]
        XCTAssertTrue(button.waitForExistence(timeout: 5), "no \(id) chip")
        // Drag the chip row sideways until the chip is on screen.
        let width = app.frame.width
        var tries = 0
        while (button.frame.maxX > width - 8 || button.frame.minX < 8) && tries < 8 {
            let y = button.frame.midY / app.frame.height
            let leftward = button.frame.maxX > width - 8
            let start = app.coordinate(withNormalizedOffset: CGVector(dx: leftward ? 0.75 : 0.25, dy: y))
            let end = app.coordinate(withNormalizedOffset: CGVector(dx: leftward ? 0.45 : 0.55, dy: y))
            start.press(forDuration: 0.05, thenDragTo: end)
            tries += 1
        }
        button.tap()
        sleep(2)
        shot(shotName, app)
        then?(app)
        let done = app.buttons.matching(identifier: "Done").allElementsBoundByIndex.first { $0.isHittable }
        done?.tap()
        sleep(1)
    }

    @MainActor
    func test04Systems() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(4)
        openBot(env["ORBIT_LIVE_BOT"] ?? "Quill", in: app)
        shot("systems-bot", app)
        chip("approvals", "systems-approvals", in: app) { app in
            app.buttons["approval-auto"].tap()
            sleep(2)
            self.shot("systems-approvals-auto", app)
            app.buttons["approval-full"].tap()
            sleep(1)
            self.shot("systems-approvals-full-confirm", app)
            // Giving it goes on to Face ID / the passcode, which this
            // simulator can't answer; the server refusal is covered by the
            // harness tests. Cancel the confirmation instead.
            XCTAssertTrue(app.buttons["Give full access"].waitForExistence(timeout: 3))
            app.buttons["Cancel"].tap()
            sleep(1)
        }
        chip("browser", "systems-browser", in: app)
        chip("memory", "systems-memory", in: app) { app in
            let index = app.buttons["memory-MEMORY.md"]
            if index.waitForExistence(timeout: 5) {
                index.tap()
                sleep(2)
                let editor = app.textViews["memory-editor"]
                if editor.waitForExistence(timeout: 5) {
                    // tap near the end of the text so the new line goes last
                    editor.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.9)).tap()
                    editor.typeText("\n- Edited from the phone.")
                    app.buttons["memory-save"].tap()
                    sleep(2)
                    self.shot("systems-memory-edited", app)
                }
                app.navigationBars.buttons.firstMatch.tap()
                sleep(1)
            }
        }
        chip("skills", "systems-skills", in: app) { app in
            let off = app.switches["source-check"]
            if off.waitForExistence(timeout: 5) {
                off.tap()
                sleep(2)
                self.shot("systems-skill-review", app)
                let enable = app.buttons["skill-enable"]
                if enable.waitForExistence(timeout: 5) {
                    enable.tap()
                    sleep(2)
                    self.shot("systems-skill-enabled", app)
                }
            }
        }
        chip("usage", "systems-usage", in: app)
    }

    @MainActor
    func test05Artifact() throws {
        let app = XCUIApplication()
        app.launch()
        sleep(4)
        openBot("Quill", in: app)
        let view = app.buttons["artifact-view-market-map.html"]
        XCTAssertTrue(view.waitForExistence(timeout: 10), "no offer for market-map.html")
        shot("artifact-offer", app)
        view.tap()
        sleep(4)
        shot("artifact-open", app)
        let reply = app.buttons["file-reply"]
        if reply.waitForExistence(timeout: 5) {
            reply.tap()
            sleep(2)
            shot("artifact-reply", app)
        }
    }

    /// Send as the desktop would (straight to the harness), with the phone
    /// watching the map: work streams out, then back green when it stops.
    @MainActor
    func test06Trails() async throws {
        let harness = try XCTUnwrap(env["ORBIT_LIVE_HARNESS"], "no harness address")
        let app = XCUIApplication()
        app.launch()
        sleep(5)
        func call(_ method: String, _ path: String, _ body: [String: Any]? = nil) async throws -> [String: Any] {
            var request = URLRequest(url: URL(string: harness + path)!)
            request.httpMethod = method
            request.setValue(harness, forHTTPHeaderField: "origin")
            request.setValue("application/json", forHTTPHeaderField: "content-type")
            if let body { request.httpBody = try JSONSerialization.data(withJSONObject: body) }
            let (data, _) = try await URLSession.shared.data(for: request)
            return (try? JSONSerialization.jsonObject(with: data) as? [String: Any]) ?? [:]
        }
        let bots = (try await call("GET", "/api/bots"))["bots"] as? [[String: Any]] ?? []
        let target = try XCTUnwrap(bots.first { $0["name"] as? String == (env["ORBIT_LIVE_BOT"] ?? "Omiii") })
        let id = target["id"] as! String, thread = target["threadId"] as! String
        _ = try await call("POST", "/api/bots/\(id)/messages", ["threadId": thread, "text": "Protect two focus hours tomorrow."])
        try await Task.sleep(for: .milliseconds(700))
        shot("trail-out", app)
        try await Task.sleep(for: .seconds(3))
        shot("trail-busy", app)
        _ = try await call("POST", "/api/bots/\(id)/interrupt", ["threadId": thread])
        try await Task.sleep(for: .milliseconds(700))
        shot("trail-back", app)
        try await Task.sleep(for: .seconds(1))
        shot("trail-done", app)
    }
}
