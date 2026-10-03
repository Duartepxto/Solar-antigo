import XCTest
@testable import CompanionCore

final class ToolPhraseTests: XCTestCase {
    private func tool(_ json: String) throws -> ToolActivity {
        try JSONDecoder().decode(ToolActivity.self, from: Data(json.utf8))
    }

    func testACommandSaysWhatItIsFor() throws {
        let bash = try tool(#"{"name":"Bash","summary":"pnpm test","input":{"command":"pnpm test","description":"Run the unit tests"}}"#)
        XCTAssertEqual(bash.phrase, "Run the unit tests")
        let bare = try tool(#"{"name":"Bash","summary":"pnpm test"}"#)
        XCTAssertEqual(bare.phrase, "Running pnpm test")
    }

    func testFileAndSearchStepsNameWhatTheyTouch() throws {
        XCTAssertEqual(try tool(#"{"name":"Edit","input":{"file_path":"/a/b/ChatView.swift"}}"#).phrase, "Editing ChatView.swift")
        XCTAssertEqual(try tool(#"{"name":"Grep","input":{"pattern":"isSecret"}}"#).phrase, "Searching for isSecret")
        XCTAssertEqual(try tool(#"{"name":"WebFetch","input":{"url":"https://example.com/x"}}"#).phrase, "Reading example.com")
    }

    func testAnOddInputNeverCostsTheMessage() throws {
        let odd = try tool(#"{"name":"mcp__linear__create_issue","spoken":"creating an issue","input":"raw text","summary":42}"#)
        XCTAssertNil(odd.input)
        XCTAssertNil(odd.summary)
        XCTAssertEqual(odd.phrase, "Creating an issue")
    }
}
