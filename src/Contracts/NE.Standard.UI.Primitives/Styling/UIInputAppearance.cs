namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an input draws the surface around its field.
/// </summary>
public enum UIInputAppearance
{
    /// <summary>
    /// One fill and no visible edge: the field reads as the surface one level above the page it sits on.
    /// </summary>
    Filled = 0,

    /// <summary>
    /// No fill, and a border all the way round.
    /// </summary>
    Outline = 1,

    /// <summary>
    /// No fill, and a single rule under the text — what an edit-in-place field wants.
    /// </summary>
    Underline = 2,

    /// <summary>
    /// No box until touched: the text sits on whatever is behind it; a hover wash signals it's editable, the focus ring that
    /// it is. Tighter than the others, for a field in a list row.
    /// </summary>
    Ghost = 3,
}
