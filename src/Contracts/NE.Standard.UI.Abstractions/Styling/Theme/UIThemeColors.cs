using System;
using System.Text.Json.Serialization;
using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// One reader's own brand colours over the application's palette: the primary and the accent, each for the light and the dark
/// theme; one left unset is the application's.
/// </summary>
/// <remarks>
/// Kept on the session beside its theme mode and applied by <c>SetThemeColorsEffect</c>. What stands on them, writes in them or shares
/// their hue follows by the palette's own rule (<see cref="UIColorPalette.WithPrimary"/>, <see cref="UIColorPalette.WithAccent"/>).
/// Travels and is stored as JSON, each colour in the text <see cref="UIThemeColor.TryParse"/> reads.
/// </remarks>
[JsonConverter(typeof(UIThemeColorsJsonConverter))]
public sealed record UIThemeColors
{
    /// <summary>Gets the primary colour in the light theme, or none for the application's.</summary>
    public ColorVariant? LightPrimary { get; init; }

    /// <summary>Gets the accent colour in the light theme, or none for the application's.</summary>
    public ColorVariant? LightAccent { get; init; }

    /// <summary>Gets the primary colour in the dark theme, or none for the application's.</summary>
    public ColorVariant? DarkPrimary { get; init; }

    /// <summary>Gets the accent colour in the dark theme, or none for the application's.</summary>
    public ColorVariant? DarkAccent { get; init; }

    /// <summary>Gets whether no colour is set, so the application's palette stands as it is.</summary>
    public bool IsEmpty => LightPrimary is null && LightAccent is null && DarkPrimary is null && DarkAccent is null;

    /// <summary>The same primary, and accent, in both themes.</summary>
    public static UIThemeColors Create(ColorVariant? primary, ColorVariant? accent = null)
        => new()
        {
            LightPrimary = primary,
            LightAccent = accent,
            DarkPrimary = primary,
            DarkAccent = accent
        };

    /// <summary>The theme with these colours over each of its palettes.</summary>
    public UITheme ApplyTo(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        Validate();

        return theme with
        {
            Light = Apply(theme.Light, LightPrimary, LightAccent),
            Dark = Apply(theme.Dark, DarkPrimary, DarkAccent)
        };
    }

    private static UIColorPalette Apply(UIColorPalette palette, ColorVariant? primary, ColorVariant? accent)
    {
        if (primary is ColorVariant newPrimary)
            palette = palette.WithPrimary(newPrimary);

        if (accent is ColorVariant newAccent)
            palette = palette.WithAccent(newAccent);

        return palette;
    }

    /// <summary>
    /// Validates every colour that is set.
    /// </summary>
    public void Validate()
    {
        LightPrimary?.Validate();
        LightAccent?.Validate();
        DarkPrimary?.Validate();
        DarkAccent?.Validate();
    }
}
