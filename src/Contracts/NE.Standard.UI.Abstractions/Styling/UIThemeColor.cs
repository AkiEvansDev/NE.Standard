using System;
using System.Globalization;
using NE.Colors;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a themed color: either a semantic <see cref="UIColorStyle"/> role, or an explicit
/// <see cref="Light"/>/<see cref="Dark"/> override, which always wins when both are set.
/// </summary>
/// <param name="Style">The semantic role the palette resolves the colour from.</param>
/// <param name="Light">An explicit colour for the light theme, which wins over the style.</param>
/// <param name="Dark">An explicit colour for the dark theme, which wins over the style.</param>
public readonly record struct UIThemeColor(UIColorStyle? Style, ColorVariant? Light, ColorVariant? Dark)
{
    /// <summary>
    /// Creates a theme color tracking the given semantic <see cref="UIColorStyle"/> role live.
    /// </summary>
    public static UIThemeColor FromStyle(UIColorStyle style)
        => new(style, null, null);

    /// <summary>
    /// Creates a theme color from a fixed color variant, used identically in both light and dark mode.
    /// </summary>
    public static UIThemeColor FromColorVariant(ColorName name, ColorAdjustment adjustment = ColorAdjustment.None, int factor = 0, byte opacity = 255)
        => FromColorVariant(new ColorVariant(name, adjustment, factor, opacity));

    /// <summary>
    /// Creates a theme color from a fixed color variant, used identically in both light and dark mode.
    /// </summary>
    public static UIThemeColor FromColorVariant(ColorVariant color)
        => new(null, color, color);

    /// <summary>
    /// Creates a theme color from explicit light and dark overrides.
    /// </summary>
    public static UIThemeColor Create(ColorVariant? light, ColorVariant? dark)
        => new(null, light, dark);

    /// <summary>
    /// Presets mirroring each <see cref="UIColorStyle"/> role, theme-aware via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Default => FromStyle(UIColorStyle.Default);

    /// <summary>
    /// The theme's primary brand color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Primary => FromStyle(UIColorStyle.Primary);

    /// <summary>
    /// The theme's secondary accent color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Accent => FromStyle(UIColorStyle.Accent);

    /// <summary>
    /// The page/surface background color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Background => FromStyle(UIColorStyle.Background);

    /// <summary>
    /// A raised surface's background color (e.g. a card), tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Surface => FromStyle(UIColorStyle.Surface);

    /// <summary>
    /// A color intended to sit on top of <see cref="Primary"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnPrimary => FromStyle(UIColorStyle.OnPrimary);

    /// <summary>
    /// A color intended to sit on top of <see cref="Accent"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnAccent => FromStyle(UIColorStyle.OnAccent);

    /// <summary>
    /// A color intended to sit on top of <see cref="Background"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnBackground => FromStyle(UIColorStyle.OnBackground);

    /// <summary>
    /// A color intended to sit on top of <see cref="Surface"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnSurface => FromStyle(UIColorStyle.OnSurface);

    /// <summary>
    /// The informational status color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Info => FromStyle(UIColorStyle.Info);

    /// <summary>
    /// The warning status color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Warning => FromStyle(UIColorStyle.Warning);

    /// <summary>
    /// The success status color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Success => FromStyle(UIColorStyle.Success);

    /// <summary>
    /// The danger/error status color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Danger => FromStyle(UIColorStyle.Danger);

    /// <summary>
    /// A color intended to sit on top of <see cref="Info"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnInfo => FromStyle(UIColorStyle.OnInfo);

    /// <summary>
    /// A color intended to sit on top of <see cref="Warning"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnWarning => FromStyle(UIColorStyle.OnWarning);

    /// <summary>
    /// A color intended to sit on top of <see cref="Success"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnSuccess => FromStyle(UIColorStyle.OnSuccess);

    /// <summary>
    /// A color intended to sit on top of <see cref="Danger"/>, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor OnDanger => FromStyle(UIColorStyle.OnDanger);

    /// <summary>
    /// A dimmed variant of the ambient color, for secondary/de-emphasized text, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Muted => FromStyle(UIColorStyle.Muted);

    /// <summary>
    /// The chrome token indicating a selected item or state, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Selected => FromStyle(UIColorStyle.Selected);

    /// <summary>
    /// The focus indicator ring color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor FocusRing => FromStyle(UIColorStyle.FocusRing);

    /// <summary>
    /// The default border color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Border => FromStyle(UIColorStyle.Border);

    /// <summary>
    /// The drop shadow color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Shadow => FromStyle(UIColorStyle.Shadow);

    /// <summary>
    /// The modal/scrim overlay color, tracked live via <see cref="FromStyle"/>.
    /// </summary>
    public static UIThemeColor Overlay => FromStyle(UIColorStyle.Overlay);

    /// <summary>
    /// Reads the canonical wire form a client sends back: <c>@Role</c> for a semantic role, <c>#RRGGBBAA</c>
    /// for an explicit colour, or <c>Name/Adjustment/factor/opacity</c> for a palette variant.
    /// </summary>
    /// <remarks>
    /// The format a two-way binding sends back, coerced by the generated setter via <c>RecursiveValueCoercion</c>.
    /// </remarks>
    public static bool TryParse(string? text, out UIThemeColor color)
    {
        color = default;

        if (string.IsNullOrWhiteSpace(text))
            return false;

        var trimmed = text.Trim();

        if (trimmed[0] == '@')
        {
            if (!Enum.TryParse(trimmed.AsSpan(1), ignoreCase: false, out UIColorStyle style))
                return false;

            color = FromStyle(style);
            return true;
        }

        if (trimmed[0] == '#')
        {
            if (!ColorVariant.TryParseHex(trimmed, out ColorVariant explicitColor))
                return false;

            color = FromColorVariant(explicitColor);
            return true;
        }

        return TryParseVariant(trimmed, out color);
    }

    private static bool TryParseVariant(string text, out UIThemeColor color)
    {
        color = default;

        var parts = text.Split('/');

        if (!Enum.TryParse(parts[0], ignoreCase: false, out ColorName name))
            return false;

        ColorAdjustment adjustment = ColorAdjustment.None;
        var factor = 0;
        byte opacity = 255;

        if (parts.Length > 1 && !Enum.TryParse(parts[1], ignoreCase: false, out adjustment))
            return false;

        if (parts.Length > 2 && !int.TryParse(parts[2], NumberStyles.Integer, CultureInfo.InvariantCulture, out factor))
            return false;

        if (parts.Length > 3 && !byte.TryParse(parts[3], NumberStyles.Integer, CultureInfo.InvariantCulture, out opacity))
            return false;

        if (factor is < ColorVariant.MinFactor or > ColorVariant.MaxFactor)
            return false;

        color = FromColorVariant(new ColorVariant(name, adjustment, factor, opacity));
        return true;
    }

    /// <summary>The canonical wire form — what <see cref="TryParse"/> reads.</summary>
    public string ToCanonical()
    {
        if (Style is UIColorStyle style)
            return $"@{style}";

        ColorVariant? variant = Light ?? Dark;

        if (variant is null)
            return string.Empty;

        ColorVariant value = variant.Value;

        return value.Rgb is not null
            ? value.ToHex()
            : string.Create(CultureInfo.InvariantCulture, $"{value.Name}/{value.Adjustment}/{value.Factor}/{value.Opacity}");
    }

    public override string ToString()
    {
        if (Light is not null || Dark is not null)
        {
            var lightHex = (Light ?? Dark)!.Value.ToHex();
            var darkHex = (Dark ?? Light)!.Value.ToHex();

            return lightHex == darkHex ? lightHex : $"light-dark({lightHex}, {darkHex})";
        }

        return Style?.ToString() ?? "(none)";
    }
}
