namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines how an input draws the surface around its field.
/// </summary>
public enum UIInputAppearance
{
    /// <summary>
    /// The field sits in a filled, bordered box.
    /// </summary>
    Filled = 0,

    /// <summary>
    /// The field is drawn as a single rule under the text, with no box — what an edit-in-place field wants.
    /// </summary>
    Underline = 1,
}
