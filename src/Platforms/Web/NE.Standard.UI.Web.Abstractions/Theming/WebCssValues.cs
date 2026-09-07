using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Text;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebCssValues
{
    public static string ThemeName(UIThemeMode mode)
        => mode switch
        {
            UIThemeMode.Light => "light",
            UIThemeMode.Dark => "dark",
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
        };

    // `clip`, not `hidden`: `hidden` also makes the element a scroll container, reachable by script-driven scrolling.
    /// <summary>The <c>background-size</c> a fit stands for.</summary>
    public static string ImageFitSize(UIImageFit value)
        => value switch
        {
            UIImageFit.Fill => "100% 100%",
            UIImageFit.Contain => "contain",
            UIImageFit.Cover => "cover",
            UIImageFit.None => "auto",
            _ => throw new UnreachableException()
        };

    public static string Overflow(UIOverflow value)
        => value switch
        {
            UIOverflow.Hidden => "clip",
            UIOverflow.Show => "visible",
            _ => throw new UnreachableException()
        };

    public static string LayoutLength(UILayoutLength value)
        => value.Kind switch
        {
            UILayoutLengthKind.Auto => "auto",
            UILayoutLengthKind.Absolute => Pixels(value.Value),
            UILayoutLengthKind.Fill => "100%",
            _ => throw new UnreachableException()
        };

    /// <summary>
    /// The same length as a responsive custom property's value, empty for <c>Auto</c> so the component's own default still applies.
    /// </summary>
    public static string ResponsiveLayoutLength(UILayoutLength value)
        => value.Kind == UILayoutLengthKind.Auto ? string.Empty : LayoutLength(value);

    public static string Thickness(UIThickness value)
        => string.Create(
            CultureInfo.InvariantCulture,
            $"{value.Top}px {value.Right}px {value.Bottom}px {value.Left}px"
        );

    public static string Radius(UICornerRadius radius)
    {
        radius.Validate();

        var topLeft = radius.TopLeft;
        var topRight = radius.TopRight;
        var bottomRight = radius.BottomRight;
        var bottomLeft = radius.BottomLeft;

        if (topLeft == topRight && topLeft == bottomRight && topLeft == bottomLeft)
            return Pixels(topLeft);

        return string.Create(
            CultureInfo.InvariantCulture,
            $"{topLeft}px {topRight}px {bottomRight}px {bottomLeft}px"
        );
    }

    /// <summary>
    /// The track as the layout can hold it: a star's floor and a content track's floor or ceiling reach the
    /// stylesheet; a fixed track's bounds and a star's ceiling are a splitter's clamp, carried on the container.
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
            _ => throw new UnreachableException()
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
            _ => throw new UnreachableException()
        };

    /// <summary>
    /// The mark a chosen item draws, as the <c>box-shadow</c> the stylesheet reads from <c>--ui-selected-mark</c>.
    /// </summary>
    public static string SelectionMark(UISelectionMark value)
        => value switch
        {
            UISelectionMark.None => "none",
            UISelectionMark.Left => "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))",
            UISelectionMark.Right => "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))",
            UISelectionMark.Top => "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))",
            UISelectionMark.Bottom => "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))",
            _ => throw new UnreachableException()
        };

    /// <summary>The weight a chosen entry's text takes: semibold, or the control's regular weight.</summary>
    public static string SelectionFontWeight(bool bold)
        => bold ? "600" : "400";

    /// <summary>
    /// A font family name as a quoted CSS string, escaped so nothing in it can end the declaration early —
    /// belt and braces alongside <c>UITypography.Validate</c>, which already refuses the characters that could.
    /// </summary>
    public static string FontFamily(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        StringBuilder builder = new("\"");

        foreach (var c in value)
        {
            if (c is '"' or '\\')
                _ = builder.Append('\\');

            _ = builder.Append(c);
        }

        return builder.Append('"').ToString();
    }

    public static string Pixels(double value)
        => string.Create(CultureInfo.InvariantCulture, $"{value}px");

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
}
