namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines text wrapping behavior.
/// </summary>
public enum UITextWrapMode
{
    /// <summary>
    /// Text is kept on a single line, overflowing its container if needed.
    /// </summary>
    NoWrap = 0,

    /// <summary>
    /// Text wraps onto multiple lines as needed to fit its container.
    /// </summary>
    Wrap = 1,

    /// <summary>
    /// Text wraps onto multiple lines, truncating with an ellipsis when it exceeds the available space.
    /// </summary>
    WrapEllipsis = 2,
}
