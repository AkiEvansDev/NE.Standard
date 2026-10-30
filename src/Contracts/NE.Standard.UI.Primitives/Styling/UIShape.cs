namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The shape a picture is drawn in — an image standing alone, or an icon that is a picture; a glyph keeps its own whatever the shape.
/// </summary>
public enum UIShape
{
    /// <summary>
    /// The picture's own: an image in the box the layout gives it, its corners as <c>BorderRadius</c> says; an icon's picture as it is,
    /// its corners slightly rounded.
    /// </summary>
    Default = 0,

    /// <summary>
    /// A circle the picture fills, a picture of another proportion cropped to its middle (an image's <c>Fit</c> may say otherwise) — a
    /// person, a team.
    /// </summary>
    Circle = 1
}
