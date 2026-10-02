using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebCssValues
{
    // A custom property's reset: the var() reading it falls back to the page's ink, as under an opaque surface of its own.
    private const string PageGroundOnColor = "initial";

    public static string ThemeName(UIThemeMode mode)
        => mode switch
        {
            UIThemeMode.Light => "light",
            UIThemeMode.Dark => "dark",
            _ => string.Empty
        };

    /// <summary>
    /// The theme the document itself declares; <c>auto</c> means no chosen theme, resolved via <c>prefers-color-scheme</c>.
    /// </summary>
    public static string RootThemeName(UIThemeMode? mode)
        => mode is UIThemeMode value ? ThemeName(value) : "auto";

    /// <summary>
    /// Reads back what <see cref="RootThemeName"/> writes; false for <c>auto</c> and for anything unknown.
    /// </summary>
    public static bool TryReadThemeName(string? name, out UIThemeMode mode)
    {
        switch (name)
        {
            case "light":
                mode = UIThemeMode.Light;
                return true;
            case "dark":
                mode = UIThemeMode.Dark;
                return true;
            default:
                mode = default;
                return false;
        }
    }

    public static string Alignment(UIAlignment value)
        => value switch
        {
            UIAlignment.Start => "start",
            UIAlignment.Center => "center",
            UIAlignment.End => "end",
            UIAlignment.Stretch => "stretch",
            _ => string.Empty
        };

    /// <summary>The <c>background-size</c> a fit stands for.</summary>
    public static string ImageFitSize(UIImageFit value)
        => value switch
        {
            UIImageFit.Fill => "100% 100%",
            UIImageFit.Contain => "contain",
            UIImageFit.Cover => "cover",
            UIImageFit.None => "auto",
            _ => string.Empty
        };

    public static string Overflow(UIOverflow value)
        => value switch
        {
            // `clip`, not `hidden`: `hidden` also makes the element a scroll container, reachable by script-driven scrolling.
            UIOverflow.Hidden => "clip",
            UIOverflow.Show => "visible",
            _ => string.Empty
        };

    public static string LayoutLength(UILayoutLength value)
        => value.Kind switch
        {
            UILayoutLengthKind.Auto => "auto",
            UILayoutLengthKind.Absolute => Pixels(value.Value),
            UILayoutLengthKind.Fill => "100%",
            _ => string.Empty
        };

    /// <summary>
    /// The same length as a responsive custom property's value, empty for <c>Auto</c> so the component's own default still applies.
    /// </summary>
    public static string ResponsiveLayoutLength(UILayoutLength value)
        => value.Kind == UILayoutLengthKind.Auto ? string.Empty : LayoutLength(value);

    /// <summary>
    /// A component's own size along <paramref name="axis"/> as a responsive custom property's value: as <see cref="ResponsiveLayoutLength"/>,
    /// but <c>Fill</c> is the parent's room less the component's margins on that axis (<see cref="FillSize"/>), so a filled box with a
    /// margin fits its parent rather than overflowing it by the margin.
    /// </summary>
    public static string ResponsiveSize(UILayoutLength value, UIOrientation axis)
        => value.Kind == UILayoutLengthKind.Fill ? FillSize(axis) : ResponsiveLayoutLength(value);

    /// <summary>
    /// <c>Fill</c> along an axis: the stylesheet's <c>--ui-fill-width</c> or <c>--ui-fill-height</c>, <c>100%</c> less what the element's
    /// own margin tiers take (<see cref="ThicknessSum"/>); plain <c>100%</c> where the stylesheet computes none.
    /// </summary>
    public static string FillSize(UIOrientation axis)
        => axis == UIOrientation.Horizontal ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";

    /// <summary>The two sides of a thickness along an axis, summed: the room a margin takes out of a <c>Fill</c> size.</summary>
    public static string ThicknessSum(UIThickness value, UIOrientation axis)
        => Pixels(axis == UIOrientation.Horizontal ? value.Left + value.Right : value.Top + value.Bottom);

    public static string Thickness(UIThickness value)
        => string.Create(CultureInfo.InvariantCulture, $"{value.Top}px {value.Right}px {value.Bottom}px {value.Left}px");

    public static string Radius(UICornerRadius radius)
    {
        radius.Validate();

        var topLeft = radius.TopLeft;
        var topRight = radius.TopRight;
        var bottomRight = radius.BottomRight;
        var bottomLeft = radius.BottomLeft;

        if (topLeft == topRight && topLeft == bottomRight && topLeft == bottomLeft)
            return Pixels(topLeft);

        return string.Create(CultureInfo.InvariantCulture, $"{topLeft}px {topRight}px {bottomRight}px {bottomLeft}px");
    }

    /// <summary>
    /// The track's CSS value for the grid layout. A fixed track's bounds and a star's ceiling are not written here — they
    /// go to the splitter's clamp instead.
    /// </summary>
    public static string GridUnit(UIGridUnit unit)
        => unit.Unit switch
        {
            UIGridUnitType.Star => GridUnit(unit.Value, unit.MinValue),
            UIGridUnitType.Absolute => string.Create(CultureInfo.InvariantCulture, $"{unit.Value}px"),
            UIGridUnitType.Auto => unit switch
            {
                { MinValue: double min } => string.Create(CultureInfo.InvariantCulture, $"minmax({min}px, auto)"),
                // A ceiling alone is fit-content(); with a floor it cannot be written, and the splitter's clamp holds it.
                { MaxValue: double max } => string.Create(CultureInfo.InvariantCulture, $"fit-content({max}px)"),
                _ => "auto"
            },
            _ => string.Empty
        };

    public static string GridUnit(double value, double? min = null)
    {
        var floor = min is double pixels && pixels > 0 ? string.Create(CultureInfo.InvariantCulture, $"{pixels}px") : "0";

        return value <= 0
            ? $"minmax({floor}, 1fr)"
            : string.Create(CultureInfo.InvariantCulture, $"minmax({floor}, {value}fr)");
    }

    /// <summary>
    /// A track list's bounds for a splitter's clamp — <c>index:min:max</c> per bounded track, 1-based, blanks for
    /// what is unset — or an empty string when no track carries one.
    /// </summary>
    public static string GridTrackLimits(IReadOnlyList<UIGridUnit> units)
    {
        ArgumentNullException.ThrowIfNull(units);

        StringBuilder? builder = null;

        for (var i = 0; i < units.Count; i++)
        {
            UIGridUnit unit = units[i];

            if (!unit.HasBounds)
                continue;

            builder ??= new StringBuilder();

            if (builder.Length > 0)
                _ = builder.Append(' ');

            _ = builder.Append(CultureInfo.InvariantCulture, $"{i + 1}:{unit.MinValue?.ToString(CultureInfo.InvariantCulture)}:{unit.MaxValue?.ToString(CultureInfo.InvariantCulture)}");
        }

        return builder?.ToString() ?? string.Empty;
    }

    /// <summary>The attribute value an items host carries for its selection mode — the client engine reads it.</summary>
    public static string SelectionMode(UISelectionMode value)
        => value switch
        {
            UISelectionMode.None => "none",
            UISelectionMode.One => "one",
            UISelectionMode.Many => "many",
            _ => string.Empty
        };

    /// <summary>
    /// The mark a chosen item draws, as the <c>box-shadow</c> the stylesheet reads from <c>--ui-selected-mark</c>.
    /// </summary>
    public static string SelectionMark(UISelectionMark value)
        => value switch
        {
            UISelectionMark.None => "none",
            UISelectionMark.Left => "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))",
            UISelectionMark.Right => "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))",
            UISelectionMark.Top => "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))",
            UISelectionMark.Bottom => "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))",
            _ => string.Empty
        };

    /// <summary>The weight a chosen entry's text takes: semibold, or the control's regular weight.</summary>
    public static string SelectionFontWeight(bool bold)
        => bold ? "600" : "400";

    /// <summary>
    /// A font family name as a quoted, escaped CSS string — belt and braces alongside <c>UITypography.Validate</c>, which
    /// already refuses the risky characters.
    /// </summary>
    public static string FontFamily(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        return CssString(value);
    }

    /// <summary>
    /// Any text as a quoted CSS string literal, safe inside a <c>style</c> attribute: a quote and a backslash escaped, and a control
    /// character as a hex escape rather than as itself, since a raw line break ends the string and what follows would be read as
    /// declarations of the element's own.
    /// </summary>
    public static string CssString(string value)
    {
        ArgumentNullException.ThrowIfNull(value);

        StringBuilder css = new(value.Length + 2);

        _ = css.Append('"');

        foreach (var c in value)
        {
            if (c is '"' or '\\')
                _ = css.Append('\\').Append(c);
            else if (char.IsControl(c))
                _ = css.Append(CultureInfo.InvariantCulture, $"\\{(int)c:x} ");
            else
                _ = css.Append(c);
        }

        return css.Append('"').ToString();
    }

    public static string Pixels(double value)
        => string.Create(CultureInfo.InvariantCulture, $"{value}px");

    /// <summary>A background picture's dim as the share its veil mixes in, held to 0–1; empty for a value that is not a number.</summary>
    public static string BackgroundImageDim(double value)
        => double.IsNaN(value) ? string.Empty : Math.Clamp(value, 0, 1).ToString(CultureInfo.InvariantCulture);

    /// <summary>A background picture's blur as a length; empty for none, below zero, or a value that is not finite.</summary>
    public static string BackgroundImageBlur(double value)
        => IsBackgroundImageBlurred(value) ? Pixels(value) : string.Empty;

    /// <summary>Whether a background picture's blur draws anything: a finite length above zero.</summary>
    public static bool IsBackgroundImageBlurred(double value)
        => value > 0 && double.IsFinite(value);

    public static string Opacity(byte value)
        => (value / 255d).ToString("0.###", CultureInfo.InvariantCulture);

    public static string ThemeColor(UIThemeColor value)
    {
        ColorVariant? light = value.Light ?? value.Dark;
        ColorVariant? dark = value.Dark ?? value.Light;

        if (light is not null && dark is not null)
        {
            var lightCss = light.Value.ToHex();
            var darkCss = dark.Value.ToHex();

            return lightCss == darkCss
                ? lightCss
                : $"light-dark({lightCss}, {darkCss})";
        }

        return value.Style is UIColorStyle style && StyleVar(style) is string varName
            ? $"var({varName})"
            : string.Empty;
    }

    /// <summary>
    /// The text colour that reads on a colour of the given lightness, themed even when the colour itself isn't.
    /// </summary>
    public static string OnColorToken(bool isLight)
        => isLight ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";

    /// <summary>A colour spent on words: a semantic role's ink, which reads on the page where the raw role may not; otherwise <see cref="ThemeColor"/>.</summary>
    public static string ThemeInk(UIThemeColor value)
        => value.Light is null && value.Dark is null && value.Style is UIColorStyle style && InkVar(style) is string ink
            ? $"var({ink})"
            : ThemeColor(value);

    /// <summary>
    /// The text colour that reads on a filled ground of this colour: a role's on-colour, a raw colour's on-light or on-dark by its
    /// lightness; <c>initial</c> for the page's own grounds (Background, Surface) and a colour of no opacity, which are no filled ground
    /// and take back the page's ink from one around them; empty for a colour no text is meant to stand on (Muted, the On* roles, Border…).
    /// </summary>
    public static string ThemeOnColor(UIThemeColor value)
    {
        ColorVariant? light = value.Light ?? value.Dark;
        ColorVariant? dark = value.Dark ?? value.Light;

        if (light is not null && dark is not null)
        {
            // A colour of no opacity is no ground at all (UIThemeColor.Transparent): judged over white it would name the light
            // theme's text in the dark one too.
            if (light.Value.Opacity == 0 && dark.Value.Opacity == 0)
                return PageGroundOnColor;

            var lightCss = OnColorToken(light.Value.IsLightOverWhite());
            var darkCss = OnColorToken(dark.Value.IsLightOverWhite());

            return lightCss == darkCss
                ? lightCss
                : $"light-dark({lightCss}, {darkCss})";
        }

        if (value.Style is UIColorStyle.Background or UIColorStyle.Surface)
            return PageGroundOnColor;

        return value.Style is UIColorStyle style && OnStyleVar(style) is string varName
            ? $"var({varName})"
            : string.Empty;
    }

    /// <summary>
    /// CSS custom property backing a semantic <see cref="UIColorStyle"/> role; null for <see cref="UIColorStyle.Default"/>/
    /// <see cref="UIColorStyle.Muted"/>, which have none.
    /// </summary>
    private static string? StyleVar(UIColorStyle style)
        => style switch
        {
            UIColorStyle.Primary => "--ui-color-primary",
            UIColorStyle.Accent => "--ui-color-accent",
            UIColorStyle.Background => "--ui-color-background",
            UIColorStyle.Surface => "--ui-color-surface",
            UIColorStyle.OnPrimary => "--ui-color-on-primary",
            UIColorStyle.OnAccent => "--ui-color-on-accent",
            UIColorStyle.OnBackground => "--ui-color-on-background",
            UIColorStyle.OnSurface => "--ui-color-on-surface",
            UIColorStyle.Info => "--ui-color-info",
            UIColorStyle.Warning => "--ui-color-warning",
            UIColorStyle.Success => "--ui-color-success",
            UIColorStyle.Danger => "--ui-color-danger",
            UIColorStyle.OnInfo => "--ui-color-on-info",
            UIColorStyle.OnWarning => "--ui-color-on-warning",
            UIColorStyle.OnSuccess => "--ui-color-on-success",
            UIColorStyle.OnDanger => "--ui-color-on-danger",
            UIColorStyle.Selected => "--ui-color-selected",
            UIColorStyle.FocusRing => "--ui-color-focus-ring",
            UIColorStyle.Border => "--ui-color-border",
            UIColorStyle.Shadow => "--ui-color-shadow",
            UIColorStyle.Overlay => "--ui-color-overlay",
            _ => null
        };

    // The roles with an ink of their own for words; the rest are grounds, edges or already text colours.
    private static string? InkVar(UIColorStyle style)
        => style switch
        {
            UIColorStyle.Primary => "--ui-color-primary-ink",
            UIColorStyle.Accent => "--ui-color-accent-ink",
            UIColorStyle.Info => "--ui-color-info-ink",
            UIColorStyle.Warning => "--ui-color-warning-ink",
            UIColorStyle.Success => "--ui-color-success-ink",
            UIColorStyle.Danger => "--ui-color-danger-ink",
            _ => null
        };

    private static string? OnStyleVar(UIColorStyle style)
        => style switch
        {
            UIColorStyle.Primary => "--ui-color-on-primary",
            UIColorStyle.Accent => "--ui-color-on-accent",
            UIColorStyle.Info => "--ui-color-on-info",
            UIColorStyle.Warning => "--ui-color-on-warning",
            UIColorStyle.Success => "--ui-color-on-success",
            UIColorStyle.Danger => "--ui-color-on-danger",
            _ => null
        };
}
