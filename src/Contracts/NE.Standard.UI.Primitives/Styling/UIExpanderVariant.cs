namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// How an expander is drawn.
/// </summary>
public enum UIExpanderVariant
{
    /// <summary>A bordered card: the header a padded band, a rule under it over the content.</summary>
    Card = 0,

    /// <summary>
    /// A quiet fold: the header a line of muted words with the chevron right after them, no frame, fill, padding or rule, and the
    /// content flush under it.
    /// </summary>
    Quiet = 1,
}
