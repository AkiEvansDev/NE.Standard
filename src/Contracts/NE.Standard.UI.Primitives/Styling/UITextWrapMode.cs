namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines text wrapping behavior. A wrapping paragraph is clamped by <c>MaxLines</c>, with an ellipsis on the last line it keeps.
/// </summary>
public enum UITextWrapMode
{
    /// <summary>
    /// Text is kept on a single line, ending in an ellipsis where its container is too narrow.
    /// </summary>
    NoWrap = 0,

    /// <summary>
    /// Text wraps onto multiple lines as needed to fit its container.
    /// </summary>
    Wrap = 1,
}
