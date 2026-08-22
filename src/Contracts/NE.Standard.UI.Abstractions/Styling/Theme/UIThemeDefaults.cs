using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Provides standard application theme token sets.
/// </summary>
public static class UIThemeDefaults
{
    /// <summary>
    /// Gets the default application theme with both light and dark palettes.
    /// </summary>
    public static UITheme Default => new()
    {
        Light = LightPalette,
        Dark = DarkPalette,
        Typography = Typography,
        Shape = Shape
    };

    /// <summary>
    /// Gets the standard light color palette.
    /// </summary>
    public static UIColorPalette LightPalette => new()
    {
        Primary = new(ColorName.AstralTeal),
        Accent = new(ColorName.NovaPurple),

        Background = new(ColorName.IronFog, ColorAdjustment.Tint, 9),
        Surface = new(ColorName.IronFog, ColorAdjustment.Tint, 8),

        OnPrimary = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnAccent = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnBackground = new(ColorName.IronFog, ColorAdjustment.Shade, 9),
        OnSurface = new(ColorName.IronFog, ColorAdjustment.Shade, 7),

        Info = new(ColorName.QuantumBlue),
        Warning = new(ColorName.NebulaGold),
        Success = new(ColorName.AuroraGreen),
        Danger = new(ColorName.StellarRed),

        OnInfo = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnWarning = new(ColorName.IronFog, ColorAdjustment.Shade, 9),
        OnSuccess = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnDanger = new(ColorName.IronFog, ColorAdjustment.Tint, 10),

        Selected = new(ColorName.NovaPurple, ColorAdjustment.Tint, 7, 35),
        FocusRing = new(ColorName.NovaPurple),

        Border = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 25),
        Shadow = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 65),
        Overlay = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 95),

        DisabledOpacity = 145
    };

    /// <summary>
    /// Gets the standard dark color palette.
    /// </summary>
    public static UIColorPalette DarkPalette => new()
    {
        Primary = new(ColorName.AstralTeal),
        Accent = new(ColorName.NovaPurple),

        Background = new(ColorName.IronFog, ColorAdjustment.Shade, 8),
        Surface = new(ColorName.IronFog, ColorAdjustment.Shade, 7),

        OnPrimary = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnAccent = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnBackground = new(ColorName.IronFog, ColorAdjustment.Tint, 9),
        OnSurface = new(ColorName.IronFog, ColorAdjustment.Tint, 7),

        Info = new(ColorName.QuantumBlue),
        Warning = new(ColorName.NebulaGold),
        Success = new(ColorName.AuroraGreen),
        Danger = new(ColorName.StellarRed),

        OnInfo = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnWarning = new(ColorName.IronFog, ColorAdjustment.Shade, 9),
        OnSuccess = new(ColorName.IronFog, ColorAdjustment.Tint, 10),
        OnDanger = new(ColorName.IronFog, ColorAdjustment.Tint, 10),

        Selected = new(ColorName.NovaPurple, ColorAdjustment.Tint, 3, 55),
        FocusRing = new(ColorName.NovaPurple),

        Border = new(ColorName.IronFog, ColorAdjustment.Tint, 10, 20),
        Shadow = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 120),
        Overlay = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 160),

        DisabledOpacity = 145
    };

    /// <summary>
    /// Gets the standard typography tokens.
    /// </summary>
    public static UITypography Typography => new();

    /// <summary>
    /// Gets the standard shape tokens.
    /// </summary>
    public static UIShape Shape => new();
}
