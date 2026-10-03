namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an input draws the surface around its field.
/// </summary>
public enum UIInputAppearance
{
    /// <summary>
    /// One fill and a line under it: the field reads as the surface one level above the page it sits on, and the line, in the
    /// theme's mark, reads 3:1 against the page.
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
    /// No box until touched: the text sits on whatever is behind it and the focus ring shows it is being edited. Tighter than
    /// the others, for a field in a list row.
    /// </summary>
    Ghost = 3,

    /// <summary>
    /// The fill alone, no line: for a field something else already frames — a card's separators, a node on a canvas — where
    /// the line would only add weight.
    /// </summary>
    Tonal = 4,
}
