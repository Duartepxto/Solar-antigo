// The language the app draws itself in.
//
// English is the source catalog: every key in `Localizable.xcstrings` *is* the
// English literal from the Swift, so a key a translation omits falls back to
// copy that reads correctly rather than to a key name. A partial pack is a
// usable pack, which is the same contract `docs/localization.md` sets for the
// renderer.
//
// Adding a language is one case here and one column in the catalog. Nothing
// else in the app has to know.
import Foundation
import SwiftUI
import CompanionCore

enum AppLanguage: String, CaseIterable, Identifiable {
    /// Whatever the phone is set to, which is also what an app with no
    /// language setting at all would do.
    case system
    case english = "en"
    case portugueseBrazil = "pt-BR"

    var id: String { rawValue }

    var label: LocalizedStringKey {
        switch self {
        case .system: "Follow the system"
        // A language names itself. Someone who cannot read the language the app
        // is currently in still has to be able to find their own in this list,
        // so these two are marked `shouldTranslate: false` in the catalog.
        case .english: "English"
        case .portugueseBrazil: "Português (Brasil)"
        }
    }

    /// The language the app actually draws in (LanguagePolicy): the one
    /// picked, or for "Follow the system" the phone's language once Orbit is
    /// nearly fully translated into it, else English.
    var locale: Locale { Locale(identifier: Self.effectiveCode(rawValue)) }

    static func effectiveCode(_ stored: String) -> String {
        LanguagePolicy.effectiveCode(stored: stored, offered: allCases.filter { $0 != .system }.map(\.rawValue),
                                     preferred: phoneLanguages ?? Locale.preferredLanguages)
    }

    /// SwiftUI's `Text` follows the environment locale, but `String(localized:)`
    /// reads the bundle's preferred localization, which follows the phone.
    /// Point the app's own language list at the effective language so both
    /// agree; strings loaded after this follow it. Called at launch and when
    /// the person picks a language, never while a view is drawn (writing a
    /// default re-renders every view that reads one).
    static func applyToBundle(_ stored: String) {
        captureLanguages()
        UserDefaults.standard.set([effectiveCode(stored)], forKey: "AppleLanguages")
    }

    /// The phone's own languages, read once before the app overrides its
    /// list: with the override in place the system reports it back.
    private static var phoneLanguages: [String]?

    private static func captureLanguages() {
        guard phoneLanguages == nil else { return }
        let defaults = UserDefaults.standard
        defaults.removeObject(forKey: "AppleLanguages")
        phoneLanguages = defaults.stringArray(forKey: "AppleLanguages") ?? Locale.preferredLanguages
    }

    static func resolved(_ stored: String) -> AppLanguage {
        AppLanguage(rawValue: stored) ?? .system
    }
}
