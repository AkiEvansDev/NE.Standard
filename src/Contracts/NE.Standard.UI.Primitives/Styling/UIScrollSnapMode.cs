namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines the strictness with which a scrollable region snaps to item boundaries.
/// </summary>
public enum UIScrollSnapMode
{
    /// <summary>
    /// Scroll snapping is disabled.
    /// </summary>
    Disabled = 0,

    /// <summary>
    /// The scroll position snaps to the nearest boundary only when it comes to rest near one.
    /// </summary>
    Proximity = 1,

    /// <summary>
    /// The scroll position always snaps to a boundary at the end of scrolling.
    /// </summary>
    Mandatory = 2,
}
