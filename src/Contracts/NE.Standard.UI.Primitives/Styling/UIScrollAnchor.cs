namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a scrollable container reacts when its content grows.
/// </summary>
public enum UIScrollAnchor
{
    /// <summary>
    /// The container keeps its scroll position, which is the platform's own behavior.
    /// </summary>
    None = 0,

    /// <summary>The container follows content appended at the end while the viewer is already at the end.</summary>
    /// <remarks>
    /// A windowed host whose window stops short of its source's end is not at the end: it opens with the window's last row at
    /// the bottom edge and is left where it is until the viewer scrolls down to the newest item.
    /// </remarks>
    End = 1
}
