namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What a bordered surface is made of.
/// </summary>
public enum UISurfaceStyle
{
    /// <summary>The page's own background inside a border — a surface that reads as part of the page.</summary>
    Background,

    /// <summary>A surface with its own fill (<c>--ui-color-surface</c>), standing off the page.</summary>
    Surface,

    /// <summary>
    /// The surface's own colour mixed into the mode's ground instead of painted over it; takes the colour from <c>Background</c>,
    /// falling back to the theme's primary when none is set.
    /// </summary>
    Tinted
}
