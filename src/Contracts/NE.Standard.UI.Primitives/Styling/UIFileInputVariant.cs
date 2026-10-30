namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What a file input is drawn as.
/// </summary>
public enum UIFileInputVariant
{
    /// <summary>
    /// A single-line field of the chosen file names with a pick button at the end, whose upload handle lands in <c>SelectionId</c>.
    /// </summary>
    Row = 0,

    /// <summary>
    /// A drop area of square tiles — a picture as its thumbnail, any other file as its kind's glyph over its name and size — with a
    /// picking square and a placeholder while empty, whose upload handles land in <c>SelectionIds</c>.
    /// </summary>
    Tiles = 1,

    /// <summary>
    /// A row of square tiles and nothing else — each with its remove and its upload's progress, the whole of it not on the page while
    /// empty — whose chooser is opened from elsewhere (<c>OpenPickerEffect</c>) or fed by a drop target, and whose upload handles land
    /// in <c>SelectionIds</c>.
    /// </summary>
    Shelf = 2
}
