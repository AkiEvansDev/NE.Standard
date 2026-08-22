namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines preferred flyout placement relative to its anchor.
/// </summary>
public enum UIFlyoutPlacement
{
    /// <summary>
    /// Below the anchor, aligned to its start edge.
    /// </summary>
    BottomStart = 0,

    /// <summary>
    /// Below the anchor, centered on it.
    /// </summary>
    Bottom = 1,

    /// <summary>
    /// Below the anchor, aligned to its end edge.
    /// </summary>
    BottomEnd = 2,

    /// <summary>
    /// Above the anchor, aligned to its start edge.
    /// </summary>
    TopStart = 3,

    /// <summary>
    /// Above the anchor, centered on it.
    /// </summary>
    Top = 4,

    /// <summary>
    /// Above the anchor, aligned to its end edge.
    /// </summary>
    TopEnd = 5,

    /// <summary>
    /// To the left of the anchor, aligned to its start edge.
    /// </summary>
    LeftStart = 6,

    /// <summary>
    /// To the left of the anchor, centered on it.
    /// </summary>
    Left = 7,

    /// <summary>
    /// To the left of the anchor, aligned to its end edge.
    /// </summary>
    LeftEnd = 8,

    /// <summary>
    /// To the right of the anchor, aligned to its start edge.
    /// </summary>
    RightStart = 9,

    /// <summary>
    /// To the right of the anchor, centered on it.
    /// </summary>
    Right = 10,

    /// <summary>
    /// To the right of the anchor, aligned to its end edge.
    /// </summary>
    RightEnd = 11,
}
