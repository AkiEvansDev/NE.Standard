namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The shape an icon that is a picture is drawn in; a glyph keeps its own whatever the shape.
/// </summary>
public enum UIIconShape
{
    /// <summary>
    /// The picture as it is, its corners slightly rounded.
    /// </summary>
    Default = 0,

    /// <summary>
    /// The picture cut to a circle and filling it, a picture of another proportion cropped to its middle — a person, a team.
    /// </summary>
    Circle = 1
}
