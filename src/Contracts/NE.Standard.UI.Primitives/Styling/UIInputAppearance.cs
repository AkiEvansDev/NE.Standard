namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an input draws the surface around its field.
/// </summary>
public enum UIInputAppearance
{
    /// <summary>
    /// The elevated field ground with a subtle border at rest and a full-perimeter focus contour: the default input appearance.
    /// </summary>
    Filled = 0,

    /// <summary>
    /// No fill, and a border all the way round.
    /// </summary>
    Outline = 1,

    /// <summary>
    /// No fill, and a single rule under the text — what an edit-in-place or dense node field wants.
    /// </summary>
    Underline = 2,

    /// <summary>
    /// No box at rest: looks like plain text, reveals a hover wash on pointer hover, keeps the hover wash while focused, and steps
    /// text brightness up when hovered while focused.
    /// </summary>
    Ghost = 3,
}
