namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines the kind of layout length value.
/// </summary>
public enum UILayoutLengthKind
{
    /// <summary>
    /// The length is determined automatically based on content.
    /// </summary>
    Auto = 0,

    /// <summary>
    /// The length is a fixed value expressed in device-independent units.
    /// </summary>
    Absolute = 1,

    /// <summary>
    /// The whole of what the parent gives: a page that fills the viewport, a pane that fills its track.
    /// </summary>
    Fill = 2,
}
