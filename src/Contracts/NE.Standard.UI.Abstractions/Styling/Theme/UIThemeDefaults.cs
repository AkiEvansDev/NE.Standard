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

        // A status ink is shaded until it reads 4.5:1 on its own 16 % tinted badge over the page and over a card; Info clears it
        // as it is, Warning (1.09:1 raw) needs six tenths. The brand inks equal their fill: a tinted brand badge darkens its own words.
        PrimaryInk = new(ColorName.AstralTeal),
        AccentInk = new(ColorName.NovaPurple),
        InfoInk = new(ColorName.QuantumBlue),
        WarningInk = new(ColorName.NebulaGold, ColorAdjustment.Shade, 6),
        SuccessInk = new(ColorName.AuroraGreen, ColorAdjustment.Shade, 2),
        DangerInk = new(ColorName.StellarRed, ColorAdjustment.Shade, 1),

        Selected = new(ColorName.NovaPurple, ColorAdjustment.Tint, 7, 35),
        FocusRing = new(ColorName.NovaPurple),

        Border = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 30),
        Shadow = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 65),
        Overlay = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 95),

        DisabledOpacity = 145
    };

    /// <summary>
    /// Gets the standard dark color palette: the palette's own defaults.
    /// </summary>
    public static UIColorPalette DarkPalette => new();

    /// <summary>
    /// Gets the standard typography tokens.
    /// </summary>
    public static UITypography Typography => new();

    /// <summary>
    /// Gets the standard shape tokens.
    /// </summary>
    public static UIShape Shape => new();
}
