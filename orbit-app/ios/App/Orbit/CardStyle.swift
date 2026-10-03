import CompanionCore

/// One definition of "the refusal", shared by every place a card's options
/// are drawn as buttons, so the tints cannot drift apart.
enum CardStyle {
    static func isRefusal(_ option: String) -> Bool {
        OptionCard.isRefusal(option)
    }
}
