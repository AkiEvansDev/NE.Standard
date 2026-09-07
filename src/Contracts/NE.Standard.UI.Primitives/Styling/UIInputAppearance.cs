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
    /// No box until it is touched: the text sits on whatever is behind it, a wash under the pointer says it can be edited,
    /// the ring says it is. Tighter than the others, for a field that stands in a row of a list.
    /// </summary>
    Ghost = 3,
}
