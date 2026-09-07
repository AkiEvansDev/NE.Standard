namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Where a text body's leading icon sits against the text beside it.
/// </summary>
public enum UITextIconAlignment
{
    /// <summary>
    /// On the title's own line, with the description flowing underneath it — the icon marks the title.
    /// </summary>
    Title = 0,

    /// <summary>
    /// Centred against title and description together — the icon stands for the whole block, as in a list
    /// row or a card header.
    /// </summary>
    Content = 1,
}
