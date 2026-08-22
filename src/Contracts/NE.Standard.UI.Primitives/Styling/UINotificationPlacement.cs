namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Where a view's notifications stack up.
/// </summary>
/// <remarks>
/// Vertical only: a notification is peripheral, and the trailing edge is where the reading eye already ends,
/// so both values sit there. What differs is whether they gather under the page's chrome or over its footer.
/// </remarks>
public enum UINotificationPlacement
{
    /// <summary>Bottom trailing corner.</summary>
    Bottom,

    /// <summary>Top trailing corner.</summary>
    Top
}
