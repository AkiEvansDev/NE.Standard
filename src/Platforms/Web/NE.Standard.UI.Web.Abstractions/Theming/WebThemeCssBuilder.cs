using System;
using System.Globalization;
using System.Text;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;

namespace NE.Standard.UI.Web.Abstractions.Theming;

public static class WebThemeCssBuilder
{
    public static string Build(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        theme.Validate();

        StringBuilder builder = new();

        AppendTheme(builder, ":root", palette: null, theme.Typography, theme.Shape, includeSemantic: true);

        // The semantic tokens are re-emitted for every [data-ui-theme] element, not only :root, because they
        // are derived from the palette: a subtree that overrides the theme has to re-resolve them against its
        // own light/dark palette rather than inheriting the page's already-resolved values.
        AppendTheme(builder, "[data-ui-theme]", palette: null, typography: null, shape: null, includeSemantic: true);

        AppendTheme(builder, "[data-ui-theme=\"light\"]", theme.Light, typography: null, shape: null, includeSemantic: false);
        AppendTheme(builder, "[data-ui-theme=\"dark\"]", theme.Dark, typography: null, shape: null, includeSemantic: false);

        AppendMediaTheme(builder, "(prefers-color-scheme: light)", "[data-ui-theme=\"auto\"]", theme.Light);
        AppendMediaTheme(builder, "(prefers-color-scheme: dark)", "[data-ui-theme=\"auto\"]", theme.Dark);

        return builder.ToString();
    }

    private static void AppendTheme(StringBuilder builder, string selector, UIColorPalette? palette, UITypography? typography, UIShape? shape, bool includeSemantic)
    {
        _ = builder.Append(selector).AppendLine(" {");

        if (palette is not null)
            AppendColorVariables(builder, palette);

        if (typography is not null)
            AppendTypographyVariables(builder, typography);

        if (shape is not null)
            AppendShapeVariables(builder, shape);

        if (includeSemantic)
            AppendSemanticVariables(builder);

        _ = builder.AppendLine("}");
    }

    private static void AppendMediaTheme(StringBuilder builder, string media, string selector, UIColorPalette palette)
    {
        _ = builder.Append("@media ").Append(media).AppendLine(" {");
        AppendTheme(builder, selector, palette, typography: null, shape: null, includeSemantic: false);
        _ = builder.AppendLine("}");
    }

    private static void AppendColorVariables(StringBuilder builder, UIColorPalette palette)
    {
        Append(builder, "color-primary", palette.Primary);
        Append(builder, "color-accent", palette.Accent);
        Append(builder, "color-background", palette.Background);
        Append(builder, "color-surface", palette.Surface);

        Append(builder, "color-on-primary", palette.OnPrimary);
        Append(builder, "color-on-accent", palette.OnAccent);
        Append(builder, "color-on-background", palette.OnBackground);
        Append(builder, "color-on-surface", palette.OnSurface);

        Append(builder, "color-info", palette.Info);
        Append(builder, "color-warning", palette.Warning);
        Append(builder, "color-success", palette.Success);
        Append(builder, "color-danger", palette.Danger);

        Append(builder, "color-on-info", palette.OnInfo);
        Append(builder, "color-on-warning", palette.OnWarning);
        Append(builder, "color-on-success", palette.OnSuccess);
        Append(builder, "color-on-danger", palette.OnDanger);

        Append(builder, "color-selected", palette.Selected);
        Append(builder, "color-focus-ring", palette.FocusRing);

        Append(builder, "color-border", palette.Border);
        Append(builder, "color-shadow", palette.Shadow);
        Append(builder, "color-overlay", palette.Overlay);

        Append(builder, "disabled-opacity", WebCssValues.Opacity(palette.DisabledOpacity));
    }

    private static void AppendTypographyVariables(StringBuilder builder, UITypography typography)
    {
        Append(builder, "font-family", typography.FontFamily);

        AppendTextStyle(builder, "display", typography.Display);
        AppendTextStyle(builder, "title", typography.Title);
        AppendTextStyle(builder, "subtitle", typography.Subtitle);
        AppendTextStyle(builder, "body", typography.Body);
        AppendTextStyle(builder, "caption", typography.Caption);
        AppendTextStyle(builder, "overline", typography.Overline);
    }

    private static void AppendTextStyle(StringBuilder builder, string name, UITextStyle style)
    {
        style.Validate();

        Append(builder, $"text-{name}-font-size", WebCssValues.Pixels(style.FontSize));
        Append(builder, $"text-{name}-line-height", WebCssValues.Pixels(style.LineHeight));
        Append(builder, $"text-{name}-font-weight", style.FontWeight.ToString(CultureInfo.InvariantCulture));

        if (style.LetterSpacing is double letterSpacing)
            Append(builder, $"text-{name}-letter-spacing", WebCssValues.Pixels(letterSpacing));
    }

    private static void AppendShapeVariables(StringBuilder builder, UIShape shape)
    {
        Append(builder, "radius-card", shape.CardRadius);
        Append(builder, "radius-button", shape.ButtonRadius);
        Append(builder, "radius-input", shape.InputRadius);
    }

    private static void AppendSemanticVariables(StringBuilder builder)
    {
        Append(builder, "surface-raised", "color-mix(in srgb, var(--ui-color-surface) 92%, var(--ui-color-on-surface) 8%)");
        Append(builder, "surface-hover", "color-mix(in srgb, var(--ui-color-surface) 86%, var(--ui-color-on-surface) 14%)");
        Append(builder, "surface-active", "color-mix(in srgb, var(--ui-color-surface) 78%, var(--ui-color-on-surface) 22%)");
        Append(builder, "border-subtle", "color-mix(in srgb, var(--ui-color-border) 75%, transparent)");
        Append(builder, "text-muted", "color-mix(in srgb, var(--ui-color-on-surface) 68%, transparent)");
        Append(builder, "border-width", "1.5px");
    }

    private static void Append(StringBuilder builder, string name, ColorVariant value)
    {
        value.Validate();

        Append(builder, name, value.ToHex());
    }

    private static void Append(StringBuilder builder, string name, UICornerRadius value)
    {
        value.Validate();

        Append(builder, name, WebCssValues.Radius(value));
    }

    private static void Append(StringBuilder builder, string name, string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return;

        _ = builder
            .Append("    --ui-")
            .Append(name)
            .Append(": ")
            .Append(value)
            .AppendLine(";");
    }
}
