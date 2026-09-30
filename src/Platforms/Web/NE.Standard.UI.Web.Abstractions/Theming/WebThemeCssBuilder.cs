using System;
using System.Globalization;
using System.Text;
using NE.Colors;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Abstractions.Theming;

/// <summary>Writes a theme as the page's custom properties.</summary>
public static class WebThemeCssBuilder
{
    // How much of its own ink a tinted badge's words keep, the rest the text colour: the least that reads 4.5:1 on every default
    // palette's tint over the page, a card and a raised card (WebThemeInkContrastTests).
    private const string BrandInkOnTintShare = "56%";
    private const string StatusInkOnTintShare = "80%";

    /// <summary>The theme's custom properties as the page's stylesheet: <c>:root</c> and each <c>data-ui-theme</c> palette.</summary>
    public static string Build(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        theme.Validate();

        StringBuilder builder = new();

        AppendTheme(builder, ":root", palette: null, theme.Typography, theme.Shape, includeSemantic: true);

        // Only on :root: the variable's fallback is 0, so whether it exists is the whole switch; a differing subtree sets it itself.
        if (theme.FocusRing)
            _ = builder.AppendLine(":root { --ui-focus-ring-width: 2px; }");

        // The two text colours a *colour* is judged against, not the page; emitted once at root, independent of the live theme.
        AppendOnColorVariables(builder, theme);

        // Re-emitted for every [data-ui-theme] element, not only :root: an overriding subtree must re-resolve them against its own palette.
        AppendTheme(builder, $"[{WebAttributes.Theme}]", palette: null, typography: null, shape: null, includeSemantic: true);

        AppendTheme(builder, $"[{WebAttributes.Theme}=\"light\"]", theme.Light, typography: null, shape: null, includeSemantic: false);
        AppendTheme(builder, $"[{WebAttributes.Theme}=\"dark\"]", theme.Dark, typography: null, shape: null, includeSemantic: false);

        AppendMediaTheme(builder, "(prefers-color-scheme: light)", $"[{WebAttributes.Theme}=\"auto\"]", theme.Light);
        AppendMediaTheme(builder, "(prefers-color-scheme: dark)", $"[{WebAttributes.Theme}=\"auto\"]", theme.Dark);

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

    private static void AppendOnColorVariables(StringBuilder builder, UITheme theme)
    {
        _ = builder.AppendLine(":root {");

        Append(builder, "color-on-light", theme.Light.OnSurface);
        Append(builder, "color-on-dark", theme.Dark.OnSurface);

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

        // The same six colours as words; a text/icon/badge property takes the ink, a fill takes the base.
        Append(builder, "color-primary-ink", palette.PrimaryInk);
        Append(builder, "color-accent-ink", palette.AccentInk);
        Append(builder, "color-info-ink", palette.InfoInk);
        Append(builder, "color-warning-ink", palette.WarningInk);
        Append(builder, "color-success-ink", palette.SuccessInk);
        Append(builder, "color-danger-ink", palette.DangerInk);

        Append(builder, "color-selected", palette.Selected);
        Append(builder, "color-focus-ring", palette.FocusRing);

        Append(builder, "color-border", palette.Border);
        Append(builder, "color-shadow", palette.Shadow);
        Append(builder, "color-overlay", palette.Overlay);

        // The series run, one variable per position, and the count a package cycles by.
        for (var i = 0; i < palette.Series.Count; i++)
            Append(builder, $"color-series-{i + 1}", palette.Series[i]);

        Append(builder, "color-series-count", palette.Series.Count.ToString(CultureInfo.InvariantCulture));

        Append(builder, "disabled-opacity", WebCssValues.Opacity(palette.DisabledOpacity));
    }

    private static void AppendTypographyVariables(StringBuilder builder, UITypography typography)
    {
        Append(builder, "font-family", WebCssValues.FontFamily(typography.FontFamily));

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
        Append(builder, "radius-row", shape.RowRadius);
        Append(builder, "radius-notification", shape.NotificationRadius);
    }

    private static void AppendSemanticVariables(StringBuilder builder)
    {
        // The one absolute level: what a panel lifted off the page is made of. The same step lifts a popup off a raised panel or a
        // dialog (`.ui-popup-ground-lifted` in mixins/lift.less); the two keep one number.
        Append(builder, "surface-raised", "color-mix(in srgb, var(--ui-color-surface) 92%, var(--ui-color-on-surface) 8%)");
        // The wash a control with no fill shows when pointed at, pressed, or chosen; translucent since it may sit on the page or a surface.
        Append(builder, "wash-hover", "color-mix(in srgb, var(--ui-color-on-surface) 10%, transparent)");
        Append(builder, "wash-active", "color-mix(in srgb, var(--ui-color-on-surface) 16%, transparent)");
        Append(builder, "wash-selected", "color-mix(in srgb, var(--ui-color-primary) 16%, transparent)");
        // Fainter than a selection: the entry a chosen descendant is folded under, which points at the selection rather than being it.
        Append(builder, "wash-descendant", "color-mix(in srgb, var(--ui-color-primary) 8%, transparent)");
        // The other half of a selectable strip: the mark under a tab; stronger than a wash since a thin line needs more than 10% to read.
        Append(builder, "mark-hover", "color-mix(in srgb, var(--ui-color-on-surface) 24%, transparent)");
        Append(builder, "border-subtle", "color-mix(in srgb, var(--ui-color-border) 75%, transparent)");
        Append(builder, "text-muted", "color-mix(in srgb, var(--ui-color-on-surface) 68%, transparent)");
        // An ink on a ground tinted with its own colour (a tinted badge), pulled toward the text colour until it reads 4.5:1 there
        // over the page, a card and a raised card; the page's inks themselves are left as they are. Resolved here, so a badge may
        // put it in the ink's place. A brand ink is its raw fill, lighter in the dark theme, so it moves further than a status ink,
        // which the palette already shades for its tint.
        AppendInkOnTint(builder, "primary", BrandInkOnTintShare);
        AppendInkOnTint(builder, "accent", BrandInkOnTintShare);
        AppendInkOnTint(builder, "info", StatusInkOnTintShare);
        AppendInkOnTint(builder, "warning", StatusInkOnTintShare);
        AppendInkOnTint(builder, "success", StatusInkOnTintShare);
        AppendInkOnTint(builder, "danger", StatusInkOnTintShare);
        // A whole device pixel at the common density; a declared 1.5px draws as 1px there, throwing off any layout sized
        // against the declared value.
        Append(builder, "border-width", "1px");
    }

    private static void AppendInkOnTint(StringBuilder builder, string role, string share)
        => Append(builder, $"color-{role}-ink-on-tint", $"color-mix(in srgb, var(--ui-color-{role}-ink) {share}, var(--ui-color-on-surface))");

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
