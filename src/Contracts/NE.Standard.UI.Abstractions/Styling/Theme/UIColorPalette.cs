using System.Collections.Generic;
using NE.Colors;

namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>
/// Defines semantic color variants used by a UI theme mode; a palette built with <c>new()</c> is the standard dark one.
/// </summary>
public sealed record UIColorPalette
{
    // WCAG's floor for words: an on-colour and an ink derived from a colour clear it.
    private const double ReadableRatio = 4.5;

    // Eight, far apart on the wheel; the Info and Success hues are among them, the warning and danger ones are not.
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

    // The dark grounds are neutral greys a small step apart, the page near black; a card stands off by its edge more than its fill.

    /// <summary>
    /// The page/surface background color.
    /// </summary>
    public ColorVariant Background { get; init; } = ColorVariant.FromRgb(19, 19, 19);

    /// <summary>
    /// A raised surface's background color (e.g. a card).
    /// </summary>
    public ColorVariant Surface { get; init; } = ColorVariant.FromRgb(25, 25, 25);

    /// <summary>
    /// The color intended to sit on top of <see cref="Primary"/>.
    /// </summary>
    public ColorVariant OnPrimary { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10);

    /// <summary>
    /// The color intended to sit on top of <see cref="Accent"/>.
    /// </summary>
    public ColorVariant OnAccent { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10);

    // One ink on both grounds, a touch warm: the surface's was a dimmer grey, which read soft on a near-black ground.

    /// <summary>
    /// The color intended to sit on top of <see cref="Background"/>.
    /// </summary>
    public ColorVariant OnBackground { get; init; } = ColorVariant.FromRgb(240, 240, 236);

    /// <summary>
    /// The color intended to sit on top of <see cref="Surface"/>.
    /// </summary>
    public ColorVariant OnSurface { get; init; } = ColorVariant.FromRgb(240, 240, 236);

    /// <summary>
    /// The informational status color.
    /// </summary>
    public ColorVariant Info { get; init; } = new(ColorName.QuantumBlue);

    /// <summary>
    /// The warning status color.
    /// </summary>
    public ColorVariant Warning { get; init; } = new(ColorName.NebulaGold);

    /// <summary>
    /// The success status color.
    /// </summary>
    public ColorVariant Success { get; init; } = new(ColorName.AuroraGreen);

    /// <summary>
    /// The danger/error status color.
    /// </summary>
    public ColorVariant Danger { get; init; } = new(ColorName.StellarRed);

    /// <summary>
    /// The color intended to sit on top of <see cref="Info"/>.
    /// </summary>
    public ColorVariant OnInfo { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10);

    /// <summary>
    /// The color intended to sit on top of <see cref="Warning"/>.
    /// </summary>
    public ColorVariant OnWarning { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 9);

    /// <summary>
    /// The color intended to sit on top of <see cref="Success"/>.
    /// </summary>
    public ColorVariant OnSuccess { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10);

    /// <summary>
    /// The color intended to sit on top of <see cref="Danger"/>.
    /// </summary>
    public ColorVariant OnDanger { get; init; } = new(ColorName.IronFog, ColorAdjustment.Tint, 10);

    // A status ink is lifted until it clears 4.5:1 on its own 16 % tinted badge over the page and over a card. The brand inks clear
    // the page (Primary stays at Tint 2 since it's nearly always marked current some other way); a tinted brand badge lifts its own words.
    /// <summary><see cref="Primary"/> as ink: the colour text, icons and badge-text take when using that brand colour.</summary>
    /// <remarks>Read against the page rather than <see cref="OnPrimary"/>; backgrounds and fills use <see cref="Primary"/> itself.</remarks>
    public ColorVariant PrimaryInk { get; init; } = new(ColorName.AstralTeal, ColorAdjustment.Tint, 2);

    /// <summary>
    /// <see cref="Accent"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant AccentInk { get; init; } = new(ColorName.NovaPurple, ColorAdjustment.Tint, 3);

    /// <summary>
    /// <see cref="Info"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant InfoInk { get; init; } = new(ColorName.QuantumBlue, ColorAdjustment.Tint, 4);

    /// <summary>
    /// <see cref="Warning"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant WarningInk { get; init; } = new(ColorName.NebulaGold);

    /// <summary>
    /// <see cref="Success"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant SuccessInk { get; init; } = new(ColorName.AuroraGreen, ColorAdjustment.Tint, 4);

    /// <summary>
    /// <see cref="Danger"/> as ink — see <see cref="PrimaryInk"/>.
    /// </summary>
    public ColorVariant DangerInk { get; init; } = new(ColorName.StellarRed, ColorAdjustment.Tint, 4);

    /// <summary>
    /// The color used to indicate a selected item or state.
    /// </summary>
    public ColorVariant Selected { get; init; } = new(ColorName.NovaPurple, ColorAdjustment.Tint, 3, 55);

    /// <summary>
    /// The color used for the focus indicator ring around focused elements.
    /// </summary>
    public ColorVariant FocusRing { get; init; } = new(ColorName.NovaPurple);

    /// <summary>
    /// The default border color.
    /// </summary>
    public ColorVariant Border { get; init; } = ColorVariant.FromRgb(255, 255, 255, ColorAdjustment.None, 0, 26);

    /// <summary>
    /// The color used for drop shadows.
    /// </summary>
    public ColorVariant Shadow { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 120);

    /// <summary>
    /// The color used for modal/scrim overlay backgrounds.
    /// </summary>
    public ColorVariant Overlay { get; init; } = new(ColorName.IronFog, ColorAdjustment.Shade, 10, 160);

    /// <summary>
    /// Opacity applied to disabled interactive elements, in the 0-255 range.
    /// </summary>
    public byte DisabledOpacity { get; init; } = 145;

    /// <summary>
    /// The palette with another <see cref="Primary"/>, and the colours that stand on it, write in it or share its hue following it.
    /// </summary>
    /// <remarks>
    /// The palette's own primary gives the palette back as it is. Otherwise <see cref="OnPrimary"/> stays where it reads 4.5:1 on the
    /// new colour, else it is whichever of <see cref="Background"/> and <see cref="OnBackground"/> reads better there, moved on toward
    /// white or black until it reads; <see cref="PrimaryInk"/> is the colour moved toward the page's text by the fewest tenths that read 4.5:1 on
    /// <see cref="Background"/>; <see cref="Selected"/> and <see cref="FocusRing"/>, where drawn from the old primary's hue, keep their
    /// adjustment, factor and opacity over the new one. The one rule a person's colours on the session and an application's palette
    /// both take.
    /// </remarks>
    public UIColorPalette WithPrimary(ColorVariant primary)
    {
        primary.Validate();

        if (primary.Equals(Primary))
            return this;

        return this with
        {
            Primary = primary,
            OnPrimary = ReadableOn(primary, OnPrimary),
            PrimaryInk = InkOnPage(primary),
            Selected = Follow(Selected, Primary, primary),
            FocusRing = Follow(FocusRing, Primary, primary)
        };
    }

    /// <summary>
    /// The palette with another <see cref="Accent"/>, the colours that stand on it, write in it or share its hue following it as
    /// <see cref="WithPrimary"/> has them follow the primary.
    /// </summary>
    public UIColorPalette WithAccent(ColorVariant accent)
    {
        accent.Validate();

        if (accent.Equals(Accent))
            return this;

        return this with
        {
            Accent = accent,
            OnAccent = ReadableOn(accent, OnAccent),
            AccentInk = InkOnPage(accent),
            Selected = Follow(Selected, Accent, accent),
            FocusRing = Follow(FocusRing, Accent, accent)
        };
    }

    /// <summary>
    /// The palette's own on-colour where it reads on the ground, else the better of the page's two ends, moved on toward white or
    /// black by the fewest tenths that read where it does not yet (a mid-tone ground).
    /// </summary>
    private ColorVariant ReadableOn(ColorVariant ground, ColorVariant current)
    {
        if (UIColorContrast.Ratio(current, ground) >= ReadableRatio)
            return current;

        // The page's ground and its text are the palette's one light and one dark, whichever theme it is.
        ColorVariant end = UIColorContrast.Ratio(Background, ground) >= UIColorContrast.Ratio(OnBackground, ground) ? Background : OnBackground;

        return FirstReadable(end, UIColorContrast.IsLight(end) ? ColorAdjustment.Tint : ColorAdjustment.Shade, ground);
    }

    /// <summary>
    /// <paramref name="color"/>, or moved by <paramref name="adjustment"/> by the fewest tenths that read 4.5:1 on
    /// <paramref name="ground"/>; all the way (white or black) where none does, which reads on any colour the move leads away from.
    /// </summary>
    private static ColorVariant FirstReadable(ColorVariant color, ColorAdjustment adjustment, ColorVariant ground)
    {
        for (var factor = 0; factor < ColorVariant.MaxFactor; factor++)
        {
            ColorVariant step = factor == 0 ? color : Adjusted(color, adjustment, factor, color.Opacity);

            if (UIColorContrast.Ratio(step, ground) >= ReadableRatio)
                return step;
        }

        return Adjusted(color, adjustment, ColorVariant.MaxFactor, color.Opacity);
    }

    /// <summary>The colour as words on the page: moved toward the page's text a tenth at a time until it reads there.</summary>
    private ColorVariant InkOnPage(ColorVariant color)
        => FirstReadable(color, UIColorContrast.IsLight(Background) ? ColorAdjustment.Shade : ColorAdjustment.Tint, Background);

    /// <summary>A colour with an adjustment of its own: by name where it is a plain named one, else from what it draws.</summary>
    private static ColorVariant Adjusted(ColorVariant color, ColorAdjustment adjustment, int factor, byte opacity)
    {
        if (color.Rgb is null && color.Adjustment == ColorAdjustment.None)
            return new ColorVariant(color.Name, adjustment, factor, opacity);

        System.Drawing.Color drawn = color.ToColor();

        return ColorVariant.FromRgb(drawn.R, drawn.G, drawn.B, adjustment, factor, opacity);
    }

    /// <summary>A colour drawn from <paramref name="from"/>'s hue drawn the same way from <paramref name="to"/>; any other kept.</summary>
    private static ColorVariant Follow(ColorVariant token, ColorVariant from, ColorVariant to)
        => token.Name == from.Name && token.Rgb == from.Rgb ? Adjusted(to, token.Adjustment, token.Factor, token.Opacity) : token;

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
