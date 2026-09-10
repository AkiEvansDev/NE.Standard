namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines theme tokens used by the UI runtime.
/// </summary>
public sealed record UITheme
{
    // Required rather than defaulted: light and dark differ by definition, so start from UIThemeDefaults and adjust with `with`.
    /// <summary>
    /// The color palette used in light mode.
    /// </summary>
    public required UIColorPalette Light { get; init; }

    /// <summary>
    /// The color palette used in dark mode.
    /// </summary>
    public required UIColorPalette Dark { get; init; }

    /// <summary>
    /// The typography tokens used by text components.
    /// </summary>
    public UITypography Typography { get; init; } = new();

    /// <summary>
    /// The shape tokens used by UI components.
    /// </summary>
    public UIShape Shape { get; init; } = new();

    /// <summary>
    /// Whether a keyboard focus ring is drawn on everything that takes focus. Off by default.
    /// </summary>
    /// <remarks>
    /// Off by default because it can land oddly over controls that already show their own "current" state;
    /// a keyboard-navigated application turns it on for the whole theme.
    /// </remarks>
    public bool FocusRing { get; init; }

    /// <summary>
    /// Whether a press on a button, an action row or a menu entry answers with a wash spreading from the pointer. On by default;
    /// a platform that cannot animate ignores it, and a viewer who asked for reduced motion is left alone either way.
    /// </summary>
    public bool PressRipple { get; init; } = true;

    /// <summary>
    /// Validates all theme token groups.
    /// </summary>
    public void Validate()
    {
        Light.Validate();
        Dark.Validate();
        Typography.Validate();
        Shape.Validate();
    }
}
