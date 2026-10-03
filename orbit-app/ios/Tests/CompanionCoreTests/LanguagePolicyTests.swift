import XCTest
@testable import CompanionCore

final class LanguagePolicyTests: XCTestCase {
    /// `nearlyComplete` is exactly the catalog languages at 95% or more.
    func testNearlyCompleteMatchesTheCatalog() throws {
        let catalog = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
            .appendingPathComponent("App/Localizable.xcstrings")
        let json = try JSONSerialization.jsonObject(with: Data(contentsOf: catalog)) as? [String: Any]
        let strings = try XCTUnwrap(json?["strings"] as? [String: [String: Any]])
        let counted = strings.values.filter { ($0["shouldTranslate"] as? Bool) != false }
        var translated: [String: Int] = [:]
        for entry in counted {
            for (code, value) in (entry["localizations"] as? [String: Any]) ?? [:] {
                let unit = (value as? [String: Any])?["stringUnit"] as? [String: Any]
                if unit?["state"] as? String == "translated" { translated[code, default: 0] += 1 }
            }
        }
        let complete = Set(translated.filter { Double($0.value) / Double(counted.count) >= LanguagePolicy.threshold }.keys)
            .subtracting(["en"])
        XCTAssertEqual(complete, LanguagePolicy.nearlyComplete,
                       "update LanguagePolicy.nearlyComplete: \(translated.mapValues { $0 * 100 / counted.count })")
    }

    func testFollowingThePhoneUsesEnglishUntilATranslationIsNearlyComplete() {
        let offered = ["en", "pt-BR"]
        XCTAssertEqual(LanguagePolicy.effectiveCode(stored: "system", offered: offered, preferred: ["pt-BR", "en-US"]), "en")
        XCTAssertEqual(LanguagePolicy.effectiveCode(stored: "pt-BR", offered: offered, preferred: ["en-US"]), "pt-BR")
        XCTAssertEqual(LanguagePolicy.effectiveCode(stored: "en", offered: offered, preferred: ["pt-BR"]), "en")
        XCTAssertEqual(LanguagePolicy.effectiveCode(stored: "system", offered: offered, preferred: ["ja-JP"]), "en")
    }
}
