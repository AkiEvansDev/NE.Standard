namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines semantic color roles used by UI components.
/// </summary>
public enum UIColorStyle
{
    /// <summary>
    /// No explicit color override; inherits the ambient color.
    /// </summary>
    Default = 0,

    /// <summary>
    /// The theme's primary brand color.
    /// </summary>
    Primary = 1,

    /// <summary>
    /// The theme's secondary accent color.
    /// </summary>
    Accent = 2,

    /// <summary>
    /// The page/surface background color.
    /// </summary>
    Background = 3,

    /// <summary>
    /// A raised surface's background color (e.g. a card).
    /// </summary>
    Surface = 4,

    /// <summary>
    /// A color intended to sit on top of <see cref="Primary"/>.
    /// </summary>
    OnPrimary = 5,

    /// <summary>
    /// A color intended to sit on top of <see cref="Accent"/>.
    /// </summary>
    OnAccent = 6,

    /// <summary>
    /// A color intended to sit on top of <see cref="Background"/>.
    /// </summary>
    OnBackground = 7,

    /// <summary>
    /// A color intended to sit on top of <see cref="Surface"/>.
    /// </summary>
    OnSurface = 8,

    /// <summary>
    /// The informational status color.
    /// </summary>
    Info = 9,

    /// <summary>
    /// The warning status color.
    /// </summary>
    Warning = 10,

    /// <summary>
    /// The success status color.
    /// </summary>
    Success = 11,

    /// <summary>
    /// The danger/error status color.
    /// </summary>
    Danger = 12,

    /// <summary>
    /// A color intended to sit on top of <see cref="Info"/>.
    /// </summary>
    OnInfo = 13,

    /// <summary>
    /// A color intended to sit on top of <see cref="Warning"/>.
    /// </summary>
    OnWarning = 14,

    /// <summary>
    /// A color intended to sit on top of <see cref="Success"/>.
    /// </summary>
    OnSuccess = 15,

    /// <summary>
    /// A color intended to sit on top of <see cref="Danger"/>.
    /// </summary>
    OnDanger = 16,

    /// <summary>
    /// A dimmed variant of the ambient color, for secondary/de-emphasized text.
    /// </summary>
    Muted = 17,

    /// <summary>
    /// The color indicating a selected item or state.
    /// </summary>
    Selected = 18,

    /// <summary>
    /// The color of the focus indicator ring around focused elements.
    /// </summary>
    FocusRing = 19,

    /// <summary>
    /// The default border color.
    /// </summary>
    Border = 20,

    /// <summary>
    /// The color used for drop shadows.
    /// </summary>
    Shadow = 21,

    /// <summary>
    /// The color used for modal/scrim overlay backgrounds.
    /// </summary>
    Overlay = 22,
}
