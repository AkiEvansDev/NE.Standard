namespace NE.Standard.UI.Primitives.Items;

/// <summary>
/// What a pager shows of the pages (<c>PagerComponent.Mode</c>); on a phone it is compact whatever it says.
/// </summary>
public enum UIPagerMode
{
    /// <summary>
    /// First, previous, the pages by number — the ends and the ones around the current page, an ellipsis for the rest — next and last.
    /// </summary>
    Full = 0,

    /// <summary>
    /// The rows the page holds out of the source's count ("21–40 of 812"), between previous and next.
    /// </summary>
    Compact = 1,
}
