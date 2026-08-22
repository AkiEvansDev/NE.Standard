namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines visual variants for badge-like components.
/// </summary>
public enum UIBadgeType
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
    /// The informational status color variant.
    /// </summary>
    Info = 2,

    /// <summary>
    /// The warning status color variant.
    /// </summary>
    Warning = 3,

    /// <summary>
    /// The success status color variant.
    /// </summary>
    Success = 4,

    /// <summary>
    /// The danger/error status color variant.
    /// </summary>
    Danger = 5,

    /// <summary>
    /// A card-like distinct background variant with no color accent.
    /// </summary>
    Surface = 6,
}
