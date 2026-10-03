import Foundation

/// Which language the app draws in when it follows the system. The phone's
/// language is used only once its catalog is nearly complete (95% or more),
/// the rule the desktop follows too: a half-translated screen reads worse
/// than English (PRODUCT.md). LanguagePolicyTests checks `nearlyComplete`
/// against App/Localizable.xcstrings, so it moves when a translation does.
public enum LanguagePolicy {
    public static let threshold = 0.95
    /// Catalog languages at or above the threshold.
    public static let nearlyComplete: Set<String> = []
    public static let fallback = "en"

    /// `stored` is the person's choice ("system", "en", "pt-BR", …);
    /// `offered` the languages the app has; `preferred` the phone's list.
    public static func effectiveCode(stored: String, offered: [String], preferred: [String]) -> String {
        if stored != "system", offered.contains(stored) { return stored }
        for tag in preferred {
            let tagLanguage = tag.split(separator: "-").first.map(String.init) ?? tag
            if let match = offered.first(where: { code in
                nearlyComplete.contains(code) && (tag == code || tag.hasPrefix(code + "-") || tagLanguage == code)
            }) { return match }
        }
        return fallback
    }
}
