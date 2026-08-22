namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines whether a container clips content that overflows its bounds.
/// </summary>
public enum UIOverflow
{
    /// <summary>
    /// Content that overflows the container's bounds is clipped.
    /// </summary>
    Hidden = 0,

    /// <summary>
    /// Content that overflows the container's bounds remains visible.
    /// </summary>
    Show = 1,
}
