namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines where a trailing badge sits against the text beside it.
/// </summary>
public enum UITextBadgeAlignment
{
    /// <summary>
    /// On the title's own line, at its far end — the badge marks the title.
    /// </summary>
    Title = 0,

    /// <summary>
    /// Centred against title and description together — the badge stands for the whole block.
    /// </summary>
    Content = 1,
}
