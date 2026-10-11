namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What a bordered surface is made of.
/// </summary>
public enum UISurfaceStyle
{
    /// <summary>The page's own background inside a border — a surface that reads as part of the page.</summary>
    Background,

    /// <summary>A panel lifted off the page it sits on, with its own fill and shadow.</summary>
    Raised,

    /// <summary>
    /// The surface's own colour mixed into the page instead of painted over it; takes the colour from <c>Background</c>,
    /// falling back to the theme's primary when none is set.
    /// </summary>
    Tinted,

    /// <summary>
    /// The raised panel's fill lying on the page, with no shadow — the ground an action row stands on, for a clickable row of content
    /// of its own; a dialog keeps its shadow, so Flat draws there as <see cref="Raised"/>.
    /// </summary>
    Flat
}
