namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines theme tokens used by the UI runtime.
/// </summary>
public sealed record UITheme
{
    // Required rather than defaulted: a light and a dark palette differ by definition, so there is no
    // single sensible default for either — start from UIThemeDefaults and adjust it with `with`.
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
