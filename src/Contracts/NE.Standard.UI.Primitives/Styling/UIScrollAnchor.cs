namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how a scrollable container reacts when its content grows.
/// </summary>
public enum UIScrollAnchor
{
    /// <summary>
    /// The container keeps its scroll position, which is the browser's own behavior.
    /// </summary>
    None = 0,

    /// <summary>
    /// The container follows content appended at the end while the viewer is already at the end.
    /// </summary>
    End = 1
}
