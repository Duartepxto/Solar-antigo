// Where the chat's preferences are stored.
//
// `@AppStorage` rather than an observable object on purpose: the settings
// screen writes these and the chat reads them, and AppStorage already keeps
// both in step through UserDefaults. One place for the key strings is the
// only thing a shared type is needed for.
import Foundation
import SwiftUI
import CompanionCore

enum PrefKey {
    static let activityDetail = "companion.prefs.activityDetail"
    static let quickReplies = "companion.prefs.quickReplies"
    static let language = "companion.prefs.language"
    /// characters drift gently on the map (the one you open always holds still)
    static let mapDrift = "companion.prefs.mapDrift"
}
