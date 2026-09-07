using System.Collections.Generic;
using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines semantic color variants used by a UI theme mode.
/// </summary>
public sealed record UIColorPalette
{
    // Eight, far apart on the wheel and none the status colours, so a series is never read as a warning.
    private static readonly ColorVariant[] DefaultSeries =
    [
        new(ColorName.QuantumBlue),
        new(ColorName.SolarAmber),
        new(ColorName.AuroraGreen),
        new(ColorName.NebulaRose),
        new(ColorName.NovaPurple),
        new(ColorName.NebulaCyan),
        new(ColorName.BronzeDusk),
        new(ColorName.LunarFern)
    ];

    /// <summary>
    /// The categorical run a chart's series take in turn — <c>--ui-color-series-{n}</c> on the page, cycled by the count.
    /// </summary>
    public IReadOnlyList<ColorVariant> Series { get; init; } = DefaultSeries;

    /// <summary>
    /// The theme's primary brand color.
    /// </summary>
    public ColorVariant Primary { get; init; } = new(ColorName.AstralTeal);

    /// <summary>
    /// The theme's secondary accent color.
    /// </summary>
    public ColorVariant Accent { get; init; } = new(ColorName.NovaPurple);

    /// <summary>
    /// The page/surface background color.
    /// </summary>
    public ColorVariant Background { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 8);

    /// <summary>
    /// A raised surface's background color (e.g. a card).
    /// </summary>
    public ColorVariant Surface { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 7);

    /// <summary>
    /// The color intended to sit on top of <see cref="Primary"/>.
    /// </summary>
    public ColorVariant OnPrimary { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Accent"/>.
    /// </summary>
    public ColorVariant OnAccent { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Background"/>.
    /// </summary>
    public ColorVariant OnBackground { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Surface"/>.
    /// </summary>
    public ColorVariant OnSurface { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 7);

    /// <summary>
    /// The informational status color.
    /// </summary>
    public ColorVariant Info { get; init; } = new(ColorName.QuantumBlue, ColorAdjustment.Tint, 1);

    /// <summary>
    /// The warning status color.
    /// </summary>
    public ColorVariant Warning { get; init; } = new(ColorName.NebulaGold, ColorAdjustment.Tint, 1);

    /// <summary>
    /// The success status color.
    /// </summary>
    public ColorVariant Success { get; init; } = new(ColorName.AuroraGreen, ColorAdjustment.Tint, 1);

    /// <summary>
    /// The danger/error status color.
    /// </summary>
    public ColorVariant Danger { get; init; } = new(ColorName.StellarRed, ColorAdjustment.Tint, 1);

    /// <summary>
    /// The color intended to sit on top of <see cref="Info"/>.
    /// </summary>
    public ColorVariant OnInfo { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Warning"/>.
    /// </summary>
    public ColorVariant OnWarning { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Success"/>.
    /// </summary>
    public ColorVariant OnSuccess { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Danger"/>.
    /// </summary>
    public ColorVariant OnDanger { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 9);

    /// <summary>
    /// <see cref="Primary"/> as ink — the colour a word wears when it is that brand colour.
    /// </summary>
    /// <remarks>
    /// Read against the page rather than against <see cref="OnPrimary"/>: a text, icon, or badge-text role
    /// resolves to the ink, while a background or a fill resolves to <see cref="Primary"/> itself.
    /// </remarks>
    public ColorVariant PrimaryInk { get; init; } = new(ColorName.AstralTeal, ColorAdjustment.Tint, 3);

    /// <summary>
    /// <see cref="Accent"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant AccentInk { get; init; } = new(ColorName.NovaPurple, ColorAdjustment.Tint, 3);

    /// <summary>
    /// <see cref="Info"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant InfoInk { get; init; } = new(ColorName.QuantumBlue, ColorAdjustment.Tint, 3);

    /// <summary>
    /// <see cref="Warning"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant WarningInk { get; init; } = new(ColorName.NebulaGold);

    /// <summary>
    /// <see cref="Success"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant SuccessInk { get; init; } = new(ColorName.AuroraGreen, ColorAdjustment.Tint, 2);

    /// <summary>
    /// <see cref="Danger"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant DangerInk { get; init; } = new(ColorName.StellarRed, ColorAdjustment.Tint, 3);

    /// <summary>
    /// The color used to indicate a selected item or state.
    /// </summary>
    public ColorVariant Selected { get; init; } = new(ColorName.AstralTeal, ColorAdjustment.Tint, 5, 48);

    /// <summary>
    /// The color used for the focus indicator ring around focused elements.
    /// </summary>
    public ColorVariant FocusRing { get; init; } = new(ColorName.AstralTeal, ColorAdjustment.Tint, 2);

    /// <summary>
    /// The default border color.
    /// </summary>
    public ColorVariant Border { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 1);

    /// <summary>
    /// The color used for drop shadows.
    /// </summary>
    public ColorVariant Shadow { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 10);

    /// <summary>
    /// The color used for modal/scrim overlay backgrounds.
    /// </summary>
    public ColorVariant Overlay { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10, 100);

    /// <summary>
    /// Opacity applied to disabled interactive elements, in the 0-255 range.
    /// </summary>
    public byte DisabledOpacity { get; init; } = 145;

    /// <summary>
    /// Validates all color variants in the palette.
    /// </summary>
    public void Validate()
    {
        Primary.Validate();
        Accent.Validate();
        Background.Validate();
        Surface.Validate();

        OnPrimary.Validate();
        OnAccent.Validate();
        OnBackground.Validate();
        OnSurface.Validate();

        Info.Validate();
        Warning.Validate();
        Success.Validate();
        Danger.Validate();

        OnInfo.Validate();
        OnWarning.Validate();
        OnSuccess.Validate();
        OnDanger.Validate();

        PrimaryInk.Validate();
        AccentInk.Validate();
        InfoInk.Validate();
        WarningInk.Validate();
        SuccessInk.Validate();
        DangerInk.Validate();

        Selected.Validate();
        FocusRing.Validate();

        Border.Validate();
        Shadow.Validate();
        Overlay.Validate();

        foreach (ColorVariant color in Series)
            color.Validate();
    }
}
