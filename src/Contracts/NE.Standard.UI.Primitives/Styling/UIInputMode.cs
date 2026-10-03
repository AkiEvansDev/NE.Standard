using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Which on-screen keyboard a text field asks a phone for, apart from what its value is (<see cref="UITextInputType"/>): digits for a
/// one-time code or a PIN that stays text, its leading zeros kept.
/// </summary>
public enum UIInputMode
{
    /// <summary>
    /// The ordinary keyboard of the reader's language.
    /// </summary>
    Text = 0,

    /// <summary>
    /// Digits alone: a one-time code, a PIN, a card or account number.
    /// </summary>
    Numeric = 1,

    /// <summary>
    /// Digits and the reader's decimal separator: an amount.
    /// </summary>
    [SuppressMessage("Naming", "CA1720:Identifier contains type name", Justification = "The browser's own token for the keyboard, read as the token rather than as the type.")]
    Decimal = 2,

    /// <summary>
    /// A telephone keypad: digits, <c>+</c>, <c>*</c> and <c>#</c>.
    /// </summary>
    Tel = 3,

    /// <summary>
    /// A keyboard with <c>@</c> and <c>.</c> to hand.
    /// </summary>
    Email = 4,

    /// <summary>
    /// A keyboard with <c>/</c> and <c>.</c> to hand.
    /// </summary>
    Url = 5,

    /// <summary>
    /// A keyboard whose Enter key reads as a search.
    /// </summary>
    Search = 6,
}
