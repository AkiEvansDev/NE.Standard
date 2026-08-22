using System.Diagnostics;
using System.Globalization;
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
            UIThemeMode.Auto => "auto",
            _ => throw new UnreachableException()
        };

    public static string Alignment(UIAlignment value)
        => value switch
        {
            UIAlignment.Start => "start",
            UIAlignment.Center => "center",
            UIAlignment.End => "end",
            UIAlignment.Stretch => "stretch",
            _ => throw new UnreachableException()
        };

    public static string Overflow(UIOverflow value)
        => value switch
        {
            UIOverflow.Hidden => "hidden",
            UIOverflow.Show => "visible",
            _ => throw new UnreachableException()
        };

    public static string LayoutLength(UILayoutLength value)
        => value.Kind switch
        {
            UILayoutLengthKind.Auto => "auto",
            UILayoutLengthKind.Absolute => Pixels(value.Value),
            _ => throw new UnreachableException()
        };

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

    public static string GridUnit(UIGridUnit unit)
        => unit.Unit switch
        {
            UIGridUnitType.Star => GridUnit(unit.Value),
            UIGridUnitType.Absolute => string.Create(CultureInfo.InvariantCulture, $"{unit.Value}px"),
            UIGridUnitType.Auto => unit.MinValue is double min
                ? string.Create(CultureInfo.InvariantCulture, $"minmax({min}px, auto)")
                : "auto",
            _ => throw new UnreachableException()
        };

    public static string GridUnit(double value)
        => value <= 0
            ? "minmax(0, 1fr)"
            : string.Create(CultureInfo.InvariantCulture, $"minmax(0, {value}fr)");

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
    /// CSS custom property backing a semantic <see cref="UIColorStyle"/> role, for contexts (background,
    /// border-color) that can't use the <c>ui-color--*</c> classes — those only ever set <c>color</c>.
    /// <see cref="UIColorStyle.Default"/>/<see cref="UIColorStyle.Muted"/> have no such property (they
    /// resolve to <c>inherit</c>/<c>color-mix(currentColor)</c>, meaningless for a background/border) and
    /// return <see langword="null"/>.
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
