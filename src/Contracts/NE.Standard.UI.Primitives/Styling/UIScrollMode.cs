namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines scroll behavior for scrollable UI regions.
/// </summary>
public enum UIScrollMode
{
    /// <summary>
    /// Scrolling is disabled; overflowing content is not reachable by scrolling.
    /// </summary>
    Disabled = 0,

    /// <summary>
    /// Scrolling is enabled only when content overflows the available space.
    /// </summary>
    Auto = 1,

    /// <summary>
    /// Scrolling is always enabled, regardless of whether content overflows.
    /// </summary>
    Always = 2,
}
