import XCTest

/// A person's first walk through the app, against an isolated fixture computer
/// (never a real one): welcome, pairing, the map, a bot and every system round
/// it (each opens in the column, in place of the chat), a chat,
/// Waiting on you, Search and settings. Each step saves a screenshot and a
/// line in steps.txt, and keeps going when one fails so the whole walk is
/// reported. Skipped unless the runner is given the fixture through
/// `TEST_RUNNER_ORBIT_LIVE_*` (see LiveFixtureUITests).
final class WalkthroughUITests: XCTestCase {
    private var env: [String: String] { ProcessInfo.processInfo.environment }
    private var dir: URL!
    private var log: [String] = []
    private var step = 0
    private let app = XCUIApplication()

    override func setUpWithError() throws {
        try XCTSkipIf(env["ORBIT_LIVE_SHOTS"] == nil, "No isolated fixture configured")
        continueAfterFailure = true
        dir = URL(fileURLWithPath: env["ORBIT_LIVE_SHOTS"]!)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    }

    override func tearDown() {
        if let dir { try? log.joined(separator: "\n").write(to: dir.appendingPathComponent("steps.txt"), atomically: true, encoding: .utf8) }
    }

    /// One step: run it, screenshot, record pass or what went wrong.
    private func walk(_ name: String, pause: UInt32 = 2, _ body: () throws -> Void) {
        step += 1
        let label = String(format: "%02d-%@", step, name)
        var outcome = "pass"
        do { try body() } catch { outcome = "FAIL: \(error)" }
        sleep(pause)
        let shot = XCUIScreen.main.screenshot()
        try? shot.pngRepresentation.write(to: dir.appendingPathComponent("\(label).png"))
        let attachment = XCTAttachment(screenshot: shot)
        attachment.name = label
        attachment.lifetime = .keepAlways
        add(attachment)
        log.append("\(label): \(outcome)")
        if outcome != "pass" { XCTFail("\(label) \(outcome)") }
    }

    private struct Missing: Error, CustomStringConvertible { let description: String }

    @discardableResult
    private func need(_ element: XCUIElement, _ what: String, timeout: TimeInterval = 8) throws -> XCUIElement {
        guard element.waitForExistence(timeout: timeout) else { throw Missing(description: "no \(what)") }
        return element
    }

    private func tap(_ element: XCUIElement, _ what: String, timeout: TimeInterval = 8) throws {
        try need(element, what, timeout: timeout)
        element.tap()
    }

    private func done() {
        // a system in the column has no Done: the link at the top names
        // where it goes back to ("‹ Quill"), as on the desktop
        if app.buttons["back"].exists && app.buttons["back"].isHittable {
            app.buttons["back"].tap()
        } else if app.buttons["focus-chat"].exists {
            app.buttons["focus-chat"].tap()
        }
        sleep(1)
    }

    private func springboardTap(_ label: String, timeout: TimeInterval = 4) {
        let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
        let button = springboard.buttons[label]
        if button.waitForExistence(timeout: timeout) { button.tap() }
    }

    /// Double-tap an empty spot: the map fits everyone again.
    private func refitMap() {
        app.coordinate(withNormalizedOffset: CGVector(dx: 0.1, dy: 0.25)).doubleTap()
        sleep(1)
    }

    private func openBot(_ name: String) throws {
        refitMap()
        let target = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'map-bot.' AND label == %@", name)).firstMatch
        try need(target, "\(name) on the map", timeout: 10)
        // map characters are drawn, and taps land on the map itself
        target.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5)).tap()
        sleep(2)
    }

    private func backToMap() {
        for _ in 0..<3 where app.buttons["back"].exists {
            // a sheet up at full height covers the link: pull it down first
            if !app.buttons["back"].isHittable {
                app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.08))
                    .press(forDuration: 0.05, thenDragTo: app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.98)))
                sleep(1)
            }
            app.buttons["back"].tap()
            sleep(1)
        }
    }

    /// The focused bot's chat (it opens on it; from its settings, "Chat").
    private func openChat() throws {
        if app.buttons["focus-chat"].exists { app.buttons["focus-chat"].tap(); sleep(1) }
        try need(app.buttons["thread-switcher"], "the chat")
    }

    /// The bot in the middle with its systems round it.
    private func openSettings() throws {
        if !app.buttons["focus-character"].exists {
            try tap(app.buttons["focus-settings"], "Settings")
            sleep(1)
        }
    }

    private func chip(_ id: String) throws {
        try openSettings()
        try tap(app.buttons["chip-\(id)"], "\(id) system")
        sleep(1)
    }

    @MainActor
    func testWalkthrough() throws {
        let invite = try XCTUnwrap(env["ORBIT_LIVE_PAIR_URL"], "no pairing invite")
        app.launchArguments = ["-ui-test-owner-check-passes"]
        app.launchEnvironment["ORBIT_UI_TEST_OWNER_CHECK"] = "passes"

        // ── welcome and pairing ──────────────────────────────────────────
        app.terminate()
        app.launch()
        let resumed = env["ORBIT_LIVE_RESUME"] != nil && app.buttons["map-search"].waitForExistence(timeout: 6)
        if !resumed {
        // a simulator paired to an earlier fixture opens on "This phone was
        // removed": its way back is Pair again, straight to pairing
        let recovering = app.buttons["Pair again"].waitForExistence(timeout: 4)
        walk("welcome") {
            if recovering { try tap(app.buttons["Pair again"], "Pair again") }
            else { try need(app.buttons["Connect my computer"], "welcome") }
        }
        walk("connect-screen") {
            if recovering { try need(app.buttons["Scan QR code"], "the pairing screen") }
            else { try tap(app.buttons["Connect my computer"], "Connect my computer") }
        }
        walk("pair-confirm") {
            XCUIDevice.shared.system.open(URL(string: invite)!)
            springboardTap("Open")
            try need(app.buttons["Connect"], "pairing confirmation", timeout: 10)
        }
        walk("paired", pause: 4) {
            app.buttons["Connect"].tap()
            sleep(3)
            springboardTap("Allow", timeout: 3)
            for label in ["Not now", "Not Now", "Continue", "Skip"] where app.buttons[label].exists { app.buttons[label].tap(); sleep(1) }
            try need(app.buttons["map-search"], "the team map", timeout: 15)
        }
        } else { log.append("01-04 welcome and pairing: skipped, already paired") ; step = 4 }

        // ── the map ─────────────────────────────────────────────────────
        walk("map-pan") {
            // a drag that starts on You must pan, not open You
            let you = try need(app.buttons["map-you"], "You on the map")
            you.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5))
                .press(forDuration: 0.1, thenDragTo: app.coordinate(withNormalizedOffset: CGVector(dx: 0.75, dy: 0.55)))
            if app.buttons["back"].exists { throw Missing(description: "the drag flew to You instead of panning") }
        }
        walk("map-zoom") {
            app.pinch(withScale: 1.5, velocity: 1)
            if app.buttons["back"].exists { throw Missing(description: "the pinch flew to You") }
        }
        walk("map-zoom-out") { app.pinch(withScale: 0.6, velocity: -1) }
        walk("map-waiting-pill") { try tap(app.buttons["map-waiting"], "the waiting pill") }
        walk("waiting-on-you") { try need(app.staticTexts["Waiting on you"], "Waiting on you") }
        walk("waiting-answer-approval", pause: 3) {
            try tap(app.buttons["Allow"].firstMatch, "Allow on the approval")
        }
        walk("waiting-after") { if app.staticTexts["Waiting on you"].exists { app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.15)).tap() } }
        walk("map-composer", pause: 3) {
            let field = try need(app.textFields["map-composer"].firstMatch.exists ? app.textFields["map-composer"] : app.textViews["map-composer"], "the map composer")
            field.tap()
            field.typeText("Plan the week for the team.")
            try tap(app.buttons["map-send"], "Send")
        }
        walk("map-composer-opened-chief") { try need(app.buttons["thread-switcher"], "the Chief's chat") }
        backToMap()

        // ── a bot and every chip ─────────────────────────────────────────
        walk("bot-quill") { try openBot("Quill") }
        walk("chip-engine") { try chip("engine") }
        walk("engine-panel") { done() }
        walk("chip-computer") { try chip("computer") }
        walk("computer-stage") { try tap(app.buttons["back"], "back from the computer") }
        walk("chip-approvals") { try chip("approvals") }
        walk("approvals-auto") { try tap(app.buttons["approval-auto"], "Auto") }
        // Full access asks for the device passcode after its confirmation; a
        // simulator with a passcode set stops there, so it runs only when asked
        if env["ORBIT_LIVE_FULL_ACCESS"] != nil {
            walk("approvals-full-confirm") { try tap(app.buttons["approval-full"], "Full") }
            walk("approvals-full-sent", pause: 3) { try tap(app.buttons["orbit-confirm"], "Give full access") }
        }
        walk("approvals-ask") { try tap(app.buttons["approval-ask"], "Ask"); done() }
        walk("chip-browser") { try chip("browser") }
        walk("browser-off") { try tap(app.switches["browser-toggle"], "browser toggle") }
        walk("browser-on") { try tap(app.switches["browser-toggle"], "browser toggle"); done() }
        walk("chip-memory") { try chip("memory") }
        walk("memory-edit") {
            try tap(app.buttons["memory-MEMORY.md"], "MEMORY.md")
            let editor = try need(app.textViews["memory-editor"], "the memory editor")
            editor.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.9)).tap()
            editor.typeText("\n- Walkthrough note.")
            try tap(app.buttons["memory-save"], "Save")
        }
        walk("memory-new-topic") {
            if app.buttons["subpage-back"].exists { app.buttons["subpage-back"].tap() }
            sleep(1)
            let topic = try need(app.textFields["New topic"], "new topic field")
            topic.tap()
            topic.typeText("walkthrough\n")
            let editor = try need(app.textViews["memory-editor"], "the topic editor")
            editor.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.9)).tap()
            editor.typeText("- Made on the phone.")
            try tap(app.buttons["memory-save"], "Save")
            if app.buttons["subpage-back"].exists { app.buttons["subpage-back"].tap() }
        }
        walk("memory-delete-topic", pause: 3) {
            let row = try need(app.buttons["memory-memory/walkthrough.md"], "the new topic")
            row.press(forDuration: 1.2)
            try tap(app.buttons["Delete topic"], "Delete topic")
            try tap(app.buttons["orbit-confirm"], "confirm delete")
        }
        walk("memory-history") { try tap(app.buttons["memory-history"], "History") }
        walk("memory-undo", pause: 3) {
            let undo = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'memory-undo-'")).firstMatch
            try tap(undo, "Undo")
            try tap(app.buttons["orbit-confirm"], "confirm undo")
        }
        walk("memory-close") { if app.buttons["subpage-back"].exists { app.buttons["subpage-back"].tap() }; sleep(1); done() }
        walk("chip-skills") { try chip("skills") }
        walk("skills-review") { try tap(app.switches["source-check"], "source-check switch") }
        walk("skills-enabled") { try tap(app.buttons["skill-enable"], "Turn on") }
        walk("skills-off") { try tap(app.switches["source-check"], "source-check switch") }
        walk("skills-remove", pause: 3) {
            let row = try need(app.otherElements["skill-row-weekly-brief"].exists ? app.otherElements["skill-row-weekly-brief"] : app.staticTexts["weekly-brief"], "weekly-brief")
            row.press(forDuration: 1.2)
            try tap(app.buttons["Remove skill"], "Remove skill")
            try tap(app.buttons["orbit-confirm"], "confirm remove")
        }
        walk("skills-import-preview", pause: 6) {
            let field = try need(app.textFields["skill-source"], "GitHub source field")
            field.tap()
            field.typeText(env["ORBIT_LIVE_SKILL_SOURCE"] ?? "anthropics/skills")
            try tap(app.buttons["skill-preview"], "Preview")
            try need(app.staticTexts["skill-import-review"], "the import review", timeout: 20)
        }
        walk("skills-import-install", pause: 3) {
            let install = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'skill-install-'")).firstMatch
            try tap(install, "Install")
            app.buttons["Done"].firstMatch.tap()
        }
        walk("skills-after") { done() }
        walk("chip-usage") { try chip("usage") }
        walk("usage-close") { done() }
        walk("chip-routines") { try chip("routines") }
        walk("routines-close") { try tap(app.buttons["back"], "back") }
        walk("chip-voice") { try chip("voice") }
        walk("voice-close") { done() }
        walk("chip-apps") { try chip("apps") }
        walk("apps-close") { try tap(app.buttons["back"], "back") }
        walk("character-settings") { try openSettings(); try tap(app.buttons["focus-character"], "the character") }
        walk("settings-computer") { try tap(app.buttons["computer-browser"], "Browser computer") }
        walk("settings-chief") { try tap(app.switches["settings-chief"], "Chief toggle") }
        walk("settings-chief-off") { try tap(app.switches["settings-chief"], "Chief toggle") }
        walk("settings-team") { try tap(app.buttons["settings-team"], "team settings") }
        walk("team-brief") {
            let brief = try need(app.textViews["team-brief"], "team brief")
            brief.tap()
            brief.typeText("Keep answers short.")
            try tap(app.buttons["Save brief"], "Save brief")
            if app.buttons["subpage-back"].exists { app.buttons["subpage-back"].tap() }
        }
        walk("settings-close") { done() }

        // ── a chat ───────────────────────────────────────────────────────
        walk("chat-send", pause: 4) {
            try openChat()
            let input = try need(app.descendants(matching: .any).matching(identifier: "message-input").firstMatch, "the composer")
            input.tap()
            input.typeText("What changed today?")
            try tap(app.buttons["chat-send"], "Send")
        }
        walk("chat-reply", pause: 3) { try need(app.staticTexts.matching(NSPredicate(format: "label CONTAINS 'reply to' OR label CONTAINS 'is ready'")).firstMatch, "a reply", timeout: 15) }
        walk("artifact-offer") { try need(app.buttons.matching(identifier: "artifact-view-market-map.html").firstMatch, "the file offer", timeout: 10) }
        walk("artifact-view", pause: 4) { try tap(app.buttons.matching(identifier: "artifact-view-market-map.html").firstMatch, "View") }
        walk("artifact-reply") { try tap(app.buttons["file-reply"], "Reply") }
        walk("thread-picker") { try tap(app.buttons["thread-switcher"], "the thread pill") }
        walk("thread-new", pause: 3) {
            try tap(app.buttons["new-thread"], "New thread")
        }
        walk("thread-new-open") { try need(app.buttons["thread-switcher"], "the new thread's chat") }
        walk("attach-plus") {
            try tap(app.buttons["composer-more"], "the + button")
        }
        walk("attach-photos", pause: 3) { try tap(app.buttons["plus-photos"], "Photo Library") }
        walk("attach-pick", pause: 3) {
            let image = app.images.firstMatch
            try tap(image, "a photo")
            if app.buttons["Add"].exists { app.buttons["Add"].tap() }
        }
        walk("attach-send", pause: 4) { try tap(app.buttons["chat-send"], "Send") }
        backToMap()

        // ── a question from a Codex bot, answered in the chat ────────────
        walk("bot-patch") { try openBot("Patch"); try openChat() }
        walk("question-card") { try need(app.otherElements.matching(NSPredicate(format: "identifier BEGINSWITH 'question-'")).firstMatch.exists ? app.otherElements.matching(NSPredicate(format: "identifier BEGINSWITH 'question-'")).firstMatch : app.staticTexts.matching(NSPredicate(format: "label CONTAINS '?'")).firstMatch, "a question", timeout: 15) }
        walk("patch-custom", pause: 3) {
            try chip("approvals")
            try tap(app.buttons["approval-custom"], "Custom")
            try tap(app.buttons["Use Custom"], "Use Custom")
        }
        walk("patch-custom-close") { done() }
        backToMap()

        // ── Probe: the chat's own approval card ──────────────────────────
        walk("bot-probe") { try openBot("Probe"); try openChat() }
        backToMap()

        // ── channels, search, settings ───────────────────────────────────
        walk("search") { try tap(app.buttons["map-search"], "Search") }
        walk("search-typed") {
            let field = try need(app.textFields["search-field"], "search field")
            field.typeText("ma")
        }
        walk("search-open-thread", pause: 3) {
            let row = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'search-thread.'")).firstMatch
            try tap(row, "a thread result")
        }
        backToMap()
        walk("search-actions") {
            try tap(app.buttons["map-search"], "Search")
            try need(app.buttons["search-action.newGroup"], "New channel action")
        }
        walk("new-channel") { try tap(app.buttons["search-action.newGroup"], "New channel") }
        walk("new-channel-close") { try tap(app.buttons["Cancel"], "Cancel") }
        walk("you-settings") { backToMap(); try tap(app.buttons["map-settings"], "You and settings") }
        walk("you-settings-scroll") { app.swipeUp() }
        backToMap()
        walk("end") { try need(app.buttons["map-search"], "the map") }
    }
}
