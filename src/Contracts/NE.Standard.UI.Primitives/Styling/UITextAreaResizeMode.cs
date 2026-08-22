namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines resize behavior for multiline text input components.
/// </summary>
public enum UITextAreaResizeMode
{
    /// <summary>
    /// The text area cannot be resized by the user.
    /// </summary>
    None = 0,

    /// <summary>
    /// The text area can be resized vertically only.
    /// </summary>
    Vertical = 1,

    /// <summary>
    /// The text area can be resized horizontally only.
    /// </summary>
    Horizontal = 2,

    /// <summary>
    /// The text area can be resized both horizontally and vertically.
    /// </summary>
    Both = 3,
}
