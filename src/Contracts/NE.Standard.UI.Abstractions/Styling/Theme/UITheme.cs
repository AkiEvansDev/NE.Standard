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
    /// Whether a keyboard focus ring is drawn on everything that takes focus; off by default since it can land oddly over
    /// controls with their own "current" state.
    /// </summary>
    public bool FocusRing { get; init; }

    /// <summary>
    /// Whether a press on a button, action row or menu entry answers with a wash spreading from the pointer; on by default,
    /// ignored by platforms that can't animate and by reduced-motion viewers.
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
