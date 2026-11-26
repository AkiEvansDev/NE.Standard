namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// The shape an image, picture icon, button or surface is drawn in; a glyph icon keeps its own whatever the shape.
/// </summary>
public enum UIShape
{
    /// <summary>
    /// The component's own box and <c>BorderRadius</c>; an icon's picture as it is, its corners slightly rounded.
    /// </summary>
    Default = 0,

    /// <summary>
    /// A square box with a true circular edge (<c>50%</c> round), cropping an image of another proportion to its middle unless
    /// <c>Fit</c> says otherwise — an avatar, a round action button, or a circular surface.
    /// </summary>
    Circle = 1
}
