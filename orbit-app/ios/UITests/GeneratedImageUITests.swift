import XCTest

final class GeneratedImageUITests: XCTestCase {
    @MainActor
    func testAgentImageLoadsAndOpensFullScreen() {
        let app = XCUIApplication()
        app.terminate()
        app.launchArguments = ["-store-preview", "-threads-preview", "-images-preview",
            "-AppleLanguages", "(en)", "-AppleLocale", "en_US",
            "-companion.onboarding.welcomeSeen", "YES",
            "-companion.onboarding.notificationsSeen", "YES"]
        app.launch()
        XCTAssertTrue(app.buttons["map-search"].waitForExistence(timeout: 10))
        app.buttons["map-search"].tap()
        let searchField = app.textFields["search-field"]
        XCTAssertTrue(searchField.waitForExistence(timeout: 5))
        searchField.typeText("Gmail")
        let gmailRow = app.buttons["search-thread.preview-gmail"]
        XCTAssertTrue(gmailRow.waitForExistence(timeout: 5))
        gmailRow.tap()
        let image = app.buttons["Image: screenshot.png"]
        let appeared = image.waitForExistence(timeout: 5)
        record("Agent image in transcript", app)
        XCTAssertTrue(appeared)
        guard appeared else { return }
        let loaded = NSPredicate(format: "enabled == true AND value == %@", "Loaded")
        expectation(for: loaded, evaluatedWith: image)
        waitForExpectations(timeout: 10)
        image.tap()
        XCTAssertTrue(app.buttons["file-close"].waitForExistence(timeout: 10))
        XCTAssertTrue(app.otherElements["Image canvas"].waitForExistence(timeout: 10))
        record("Agent image full screen", app)
        app.buttons["file-close"].tap()
        XCTAssertTrue(image.waitForExistence(timeout: 5))
    }

    @MainActor
    private func record(_ name: String, _ app: XCUIApplication) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
