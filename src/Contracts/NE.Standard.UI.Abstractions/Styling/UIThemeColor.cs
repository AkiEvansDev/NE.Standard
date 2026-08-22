using NE.Colors;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Abstractions.Styling;

/// <summary>
/// Represents a themed color: either a semantic <see cref="UIColorStyle"/> role (tracks the live
/// theme via a CSS custom property) or an explicit <see cref="Light"/>/<see cref="Dark"/> override.
/// When both are set, the explicit override always wins.
/// </summary>
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
