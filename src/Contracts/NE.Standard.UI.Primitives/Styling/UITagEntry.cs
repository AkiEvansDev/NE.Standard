namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What Enter takes in a multi-select that takes free text, while the reader types and its suggestions stand open.
/// </summary>
public enum UITagEntry
{
    /// <summary>
    /// The text as typed; the arrows pick a suggestion, which Enter then takes.
    /// </summary>
    TypedText = 0,

    /// <summary>
    /// The first suggestion the text names, marked as the reader types; the typed text only where none matches. Escape takes the
    /// mark off first, so Enter takes the text after it.
    /// </summary>
    FirstSuggestion = 1
}
