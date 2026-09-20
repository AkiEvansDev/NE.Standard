namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines text wrapping behavior. A wrapping text is clamped by <c>MaxLines</c>, with an ellipsis on the last line it keeps.
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
}
