import XCTest
@testable import CompanionCore

final class BotSystemsTests: XCTestCase {
    private func json(_ value: some Encodable) throws -> [String: Any] {
        try JSONSerialization.jsonObject(with: JSONEncoder().encode(value)) as! [String: Any]
    }

    func testBrowserPatchKeepsAbsentAndNullApart() throws {
        XCTAssertEqual(try json(BrowserSettingPatch(enabled: false)) as NSDictionary, ["enabled": false])
        XCTAssertEqual(try json(BrowserSettingPatch(profile: .some("guest"))) as NSDictionary, ["profile": "guest"])
        let reset = try json(BrowserSettingPatch(profile: .some(nil)))
        XCTAssertTrue(reset["profile"] is NSNull)
    }

    func testApprovalPatchSendsConfirmationsOnlyWhenGiven() throws {
        XCTAssertEqual(try json(ApprovalLevelPatch(mode: "auto", threadId: nil)) as NSDictionary, ["mode": "auto"])
        XCTAssertEqual(try json(ApprovalLevelPatch(mode: "full", threadId: "t1", confirmFullAccess: true)) as NSDictionary,
                       ["mode": "full", "threadId": "t1", "confirmFullAccess": true])
    }

    func testLevelsFollowTheDesktopsProviderRules() {
        XCTAssertEqual(ApprovalLevels.supported(driverKind: "claudeAgent"), ["ask", "edits", "auto", "full"])
        XCTAssertEqual(ApprovalLevels.supported(driverKind: "codex"), ["ask", "auto", "full", "custom"])
        XCTAssertEqual(ApprovalLevels.supported(driverKind: nil), ["ask", "auto"])
    }

    func testUsageSumsEveryThreadAndKeepsUnknownCostUnknown() throws {
        let fleet = """
        {"id":"b","threadId":"t1","name":"B","title":"","description":"","notifications":true,"color":"blue","unread":false,
         "modelSelection":{"instanceId":"claude","model":"m"},"createdAt":0,
         "tasks":[{"threadId":"t1","title":"A","createdAt":0,"usage":{"input":10,"output":5,"costUsd":null,"turns":2}},
                  {"threadId":"t2","title":"B","createdAt":0,"usage":{"input":1,"output":1,"cachedInput":4,"costUsd":0.5,"turns":1}},
                  {"threadId":"t3","title":"C","createdAt":0}]}
        """
        let bot = try JSONDecoder().decode(Bot.self, from: Data(fleet.utf8))
        let usage = bot.usageTotals
        XCTAssertEqual(usage.tokens, 17)
        XCTAssertEqual(usage.cachedInput, 4)
        XCTAssertEqual(usage.turns, 3)
        XCTAssertEqual(usage.threads, 2)
        XCTAssertEqual(usage.costUsd, 0.5)
    }

    func testSkillsListingSurvivesOneOddEntry() throws {
        let body = #"{"skills":[{"name":"market-map","description":"Maps","enabled":true,"source":{"repo":"x"}},{"bad":1}],"staged":[]}"#
        let listing = try JSONDecoder().decode(SkillsListing.self, from: Data(body.utf8))
        XCTAssertEqual(listing.skills.map(\.name), ["market-map"])
        XCTAssertNil(listing.skills[0].source)
        XCTAssertTrue(CompanionClient.validSkillName("market-map"))
        XCTAssertFalse(CompanionClient.validSkillName("../config"))
    }
}
