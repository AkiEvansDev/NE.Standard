namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines text alignment within its layout bounds.
/// </summary>
public enum UITextAlignment
{
    /// <summary>
    /// Aligns text to the leading edge of its container.
    /// </summary>
    Start = 0,

    /// <summary>
    /// Centers text within its container.
    /// </summary>
    Center = 1,

    /// <summary>
    /// Aligns text to the trailing edge of its container.
    /// </summary>
    End = 2,

    /// <summary>
    /// Stretches text so each line fills the width of its container.
    /// </summary>
    Justify = 3,
}
