namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines what a part of the page that tells the reader something is to a screen reader: how its words are read when they change
/// or when it is shown. Unset, nothing: its words are read where the reader reaches them.
/// </summary>
public enum UILiveRegion
{
    /// <summary>
    /// A status (<c>role="status"</c>): read when the reader is free, for what went right or is worth knowing.
    /// </summary>
    Status = 0,

    /// <summary>
    /// An alert (<c>role="alert"</c>): read at once, over what is being read, for what went wrong or needs care now.
    /// </summary>
    Alert = 1,
}
