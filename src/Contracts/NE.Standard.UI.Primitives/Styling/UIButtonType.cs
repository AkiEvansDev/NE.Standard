namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines visual variants for button-like components.
/// </summary>
public enum UIButtonType
{
    /// <summary>
    /// The theme's primary brand color variant.
    /// </summary>
    Primary = 0,

    /// <summary>
    /// The theme's secondary accent color variant.
    /// </summary>
    Accent = 1,

    /// <summary>
    /// The danger/error status color variant.
    /// </summary>
    Danger = 2,

    /// <summary>
    /// A bordered variant with a transparent background.
    /// </summary>
    Outline = 3,

    /// <summary>
    /// A borderless, transparent-background variant.
    /// </summary>
    Ghost = 4,

    /// <summary>
    /// A variant styled as an inline text link.
    /// </summary>
    Link = 5,
}
