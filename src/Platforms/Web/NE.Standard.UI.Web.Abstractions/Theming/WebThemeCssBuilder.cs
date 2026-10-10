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

    // ui-badge.less's tint, a raised card's share of the text (surface-raised, below) and the ratio words read at: what a raw
    // colour's ink is bounded against.
    private const double BadgeTintShare = 0.16;
    private const double RaisedShare = 0.08;
    private static readonly string RaisedCss = string.Create(CultureInfo.InvariantCulture, $"color-mix(in srgb, var(--ui-color-surface) {(1 - RaisedShare) * 100:0.##}%, var(--ui-color-on-surface) {RaisedShare * 100:0.##}%)");
    private const double ReadableRatio = 4.5;

    // What UIColorPalette.WithPrimary and WithAccent move: in the application's stylesheet with the rest, and alone in a reader's.
    private static readonly (string Name, Func<UIColorPalette, ColorVariant> Read)[] BrandColors =
    [
        ("color-primary", static palette => palette.Primary),
        ("color-accent", static palette => palette.Accent),
        ("color-on-primary", static palette => palette.OnPrimary),
        ("color-on-accent", static palette => palette.OnAccent),
        ("color-primary-ink", static palette => palette.PrimaryInk),
        ("color-accent-ink", static palette => palette.AccentInk),
        ("color-selected", static palette => palette.Selected),
        ("color-focus-ring", static palette => palette.FocusRing)
    ];

    /// <summary>The theme's custom properties as the page's stylesheet: <c>:root</c> and each <c>data-ui-theme</c> palette.</summary>
    public static string Build(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        theme.Validate();

        StringBuilder builder = new();

        AppendTheme(builder, ":root", palette: null, theme.Typography, theme.Shape, includeSemantic: true, dark: false);

        // Only on :root: the variable's fallback is 0, so whether it exists is the whole switch; a differing subtree sets it itself.
        if (theme.FocusRing)
            _ = builder.AppendLine(":root { --ui-focus-ring-width: 2px; }");

        // The two text colours a *colour* is judged against, not the page; emitted once at root, independent of the live theme.
        AppendOnColorVariables(builder, theme);

        // Once for both modes, so the server's first frame and every package's redraw cycle by one count.
        _ = builder.Append(":root { --ui-color-series-count: ").Append(SeriesCount(theme).ToString(CultureInfo.InvariantCulture)).AppendLine("; }");

        // Re-emitted for every [data-ui-theme] element, not only :root: an overriding subtree must re-resolve them against its own palette.
        AppendTheme(builder, $"[{WebAttributes.Theme}]", palette: null, typography: null, shape: null, includeSemantic: true, dark: false);

        AppendTheme(builder, $"[{WebAttributes.Theme}=\"light\"]", theme.Light, typography: null, shape: null, includeSemantic: false, dark: false);
        AppendTheme(builder, $"[{WebAttributes.Theme}=\"dark\"]", theme.Dark, typography: null, shape: null, includeSemantic: false, dark: true);

        AppendMediaTheme(builder, "(prefers-color-scheme: light)", theme.Light, AppendLightTheme);
        AppendMediaTheme(builder, "(prefers-color-scheme: dark)", theme.Dark, AppendDarkTheme);

        return builder.ToString();
    }

    /// <summary>
    /// The count a series colour cycles by (<c>--ui-color-series-count</c>): the shorter of the two modes' runs, so a series keeps
    /// its colour as the mode changes.
    /// </summary>
    public static int SeriesCount(UITheme theme)
    {
        ArgumentNullException.ThrowIfNull(theme);

        return Math.Max(1, Math.Min(theme.Light.Series.Count, theme.Dark.Series.Count));
    }

    private static void AppendLightTheme(StringBuilder builder, string selector, UIColorPalette palette)
        => AppendTheme(builder, selector, palette, typography: null, shape: null, includeSemantic: false, dark: false);

    private static void AppendDarkTheme(StringBuilder builder, string selector, UIColorPalette palette)
        => AppendTheme(builder, selector, palette, typography: null, shape: null, includeSemantic: false, dark: true);

    private static void AppendTheme(StringBuilder builder, string selector, UIColorPalette? palette, UITypography? typography, UIShape? shape, bool includeSemantic, bool dark)
    {
        _ = builder.Append(selector).AppendLine(" {");

        if (palette is not null)
            AppendColorVariables(builder, palette, dark);

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

    /// <summary>A palette's theme under the <c>auto</c> selector, for the platform preference <paramref name="media"/> names.</summary>
    private static void AppendMediaTheme(StringBuilder builder, string media, UIColorPalette palette, Action<StringBuilder, string, UIColorPalette> appendTheme)
    {
        _ = builder.Append("@media ").Append(media).AppendLine(" {");
        appendTheme(builder, $"[{WebAttributes.Theme}=\"auto\"]", palette);
        _ = builder.AppendLine("}");
    }

    private static void AppendColorVariables(StringBuilder builder, UIColorPalette palette, bool dark)
    {
        // The brand's colours with what stands on, writes in and shares their hue: the ink is the colour as words, a fill the base.
        AppendBrandVariables(builder, palette);

        Append(builder, "color-background", palette.Background);
        Append(builder, "color-surface", palette.Surface);
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

        // The status colours as words; a text/icon/badge property takes the ink, a fill takes the base.
        Append(builder, "color-info-ink", palette.InfoInk);
        Append(builder, "color-warning-ink", palette.WarningInk);
        Append(builder, "color-success-ink", palette.SuccessInk);
        Append(builder, "color-danger-ink", palette.DangerInk);

        Append(builder, "color-border", palette.Border);
        // A control's own edge, a graphic at 3:1 on its ground; `prefers-contrast: more` lifts the border to it (core/preferences.less).
        Append(builder, "color-mark", palette.Mark);
        Append(builder, "color-shadow", palette.Shadow);
        Append(builder, "color-overlay", palette.Overlay);

        // The series run, one variable per position; the count a package cycles by is the theme's, on :root.
        for (var i = 0; i < palette.Series.Count; i++)
            Append(builder, $"color-series-{i + 1}", palette.Series[i]);

        Append(builder, "disabled-opacity", WebCssValues.Opacity(palette.DisabledOpacity));

        // Set on both palettes, or a light subtree under a dark page would inherit the dark one's, resolved there.
        AppendModeVariables(builder, dark);
        AppendRawInkBounds(builder, palette);
    }

    /// <summary>
    /// What differs by mode beyond the palette. On a dark page the washes are neutral — a deep brand colour at a low share over a
    /// near-black ground read dimmer than the pointer's wash — and a chosen entry of a list on the page says "brand" by its mark;
    /// a popup and a tint stand off the near-black page a step further, a tint over the raised ground at a larger share.
    /// </summary>
    private static void AppendModeVariables(StringBuilder builder, bool dark)
    {
        Append(builder, "wash-hover", dark ? "color-mix(in srgb, var(--ui-color-on-surface) 9%, transparent)" : "color-mix(in srgb, var(--ui-color-on-surface) 10%, transparent)");
        Append(builder, "wash-selected", dark ? "color-mix(in srgb, var(--ui-color-on-surface) 14%, transparent)" : "color-mix(in srgb, var(--ui-color-primary) 16%, transparent)");
        // Fainter than a selection: the entry a chosen descendant is folded under, which points at the selection rather than being it.
        // None on a dark page, where a neutral one would read as the pointer's: there the group's short mark says it alone (ui-menu.less).
        Append(builder, "wash-descendant", dark ? "transparent" : "color-mix(in srgb, var(--ui-color-primary) 8%, transparent)");
        // The brand's line on a chosen entry: its ink, which reads on the page whatever the primary. Not lifted on a dark page,
        // where the ink lifted for a tint read as a white line (docs/DECISIONS.md); a mode variable so a theme can set either.
        Append(builder, "mark-selected", "var(--ui-color-primary-ink)");
        Append(builder, "popup-base", dark ? "color-mix(in srgb, var(--ui-color-surface) 96%, var(--ui-color-on-surface) 4%)" : "var(--ui-color-surface)");
        Append(builder, "tint-ground", dark ? "var(--ui-surface-raised)" : "var(--ui-color-background)");
        Append(builder, "tint-share", dark ? "28%" : "20%");
    }

    /// <summary>
    /// How light or dark a raw colour's words may be (<c>.ui-raw-ink()</c>, a badge's): the luminance that reads 4.5:1 over the
    /// deepest tint any colour lays on the page, a card or a raised card of this palette — black's under dark words, white's under
    /// light ones — so it holds for every colour and every palette, an application's own included.
    /// </summary>
    private static void AppendRawInkBounds(StringBuilder builder, UIColorPalette palette)
    {
        ColorVariant raised = UIColorContrast.Composite(palette.OnSurface.ToColor(), RaisedShare, palette.Surface);
        var darkWords = UIColorContrast.Luminance(palette.OnSurface) < UIColorContrast.Luminance(palette.Surface);
        System.Drawing.Color end = darkWords ? System.Drawing.Color.Black : System.Drawing.Color.White;
        var max = 1d;
        var min = 0d;

        foreach (ColorVariant ground in (ReadOnlySpan<ColorVariant>)[palette.Background, palette.Surface, raised])
        {
            var tint = UIColorContrast.Luminance(UIColorContrast.Composite(end, BadgeTintShare, ground));

            if (darkWords)
                max = Math.Min(max, ((tint + 0.05) / ReadableRatio) - 0.05);
            else
                min = Math.Max(min, (ReadableRatio * (tint + 0.05)) - 0.05);
        }

        // Rounded toward the text, so the written number still reads.
        Append(builder, "ink-luminance-max", (Math.Floor(Math.Max(max, 0) * 10000) / 10000).ToString("0.####", CultureInfo.InvariantCulture));
        Append(builder, "ink-luminance-min", (Math.Ceiling(Math.Min(min, 1) * 10000) / 10000).ToString("0.####", CultureInfo.InvariantCulture));
    }

    private static void AppendBrandVariables(StringBuilder builder, UIColorPalette palette)
    {
        foreach ((var name, Func<UIColorPalette, ColorVariant> read) in BrandColors)
            Append(builder, name, read(palette));
    }

    private static void AppendTypographyVariables(StringBuilder builder, UITypography typography)
    {
        Append(builder, "font-family", WebCssValues.FontFamily(typography.FontFamily));

        AppendTextStyle(builder, "display", typography.Display, typography.CapHeight);
        AppendTextStyle(builder, "title", typography.Title, typography.CapHeight);
        AppendTextStyle(builder, "subtitle", typography.Subtitle, typography.CapHeight);
        AppendTextStyle(builder, "body", typography.Body, typography.CapHeight);
        AppendTextStyle(builder, "caption", typography.Caption, typography.CapHeight);
        AppendTextStyle(builder, "overline", typography.Overline, typography.CapHeight);
    }

    private static void AppendTextStyle(StringBuilder builder, string name, UITextStyle style, double capHeight)
    {
        style.Validate();

        Append(builder, $"text-{name}-font-size", WebCssValues.Pixels(WholeCapitalsFontSize(style.FontSize, capHeight)));
        Append(builder, $"text-{name}-line-height", WebCssValues.Pixels(style.LineHeight));
        Append(builder, $"text-{name}-font-weight", style.FontWeight.ToString(CultureInfo.InvariantCulture));

        if (style.LetterSpacing is double letterSpacing)
            Append(builder, $"text-{name}-letter-spacing", WebCssValues.Pixels(letterSpacing));
    }

    /// <summary>
    /// The size nearest the authored one whose capitals stand an even number of whole pixels tall: capitals a fraction of a pixel
    /// tall cannot be centred in a box, and an odd number stands half a pixel off the middle of the even boxes, lines and icons
    /// beside them. Line heights stay as authored.
    /// </summary>
    private static double WholeCapitalsFontSize(double fontSize, double capHeight)
    {
        var capitals = Math.Max(2d, 2d * Math.Round(fontSize * capHeight / 2d, MidpointRounding.AwayFromZero));

        return Math.Round(capitals / capHeight, 3, MidpointRounding.AwayFromZero);
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
        // The one absolute level: what a panel lifted off the page is made of; UIColorPalette's mark reads 3:1 on it by the same share. The same step lifts a popup off a raised panel or a
        // dialog (`.ui-popup-ground-lifted` in mixins/lift.less); the two keep one number.
        Append(builder, "surface-raised", RaisedCss);
        // The wash a control with no fill shows when pressed; translucent since it may sit on the page or a surface. The pointer's
        // and the chosen one's differ by mode (AppendModeVariables).
        Append(builder, "wash-active", "color-mix(in srgb, var(--ui-color-on-surface) 16%, transparent)");
        // The other half of a selectable strip: the mark under a tab; stronger than a wash since a thin line needs more than 10% to read.
        Append(builder, "mark-hover", "color-mix(in srgb, var(--ui-color-on-surface) 24%, transparent)");
        Append(builder, "border-subtle", "color-mix(in srgb, var(--ui-color-border) 75%, transparent)");
        Append(builder, "text-muted", "color-mix(in srgb, var(--ui-color-on-surface) 75%, transparent)");
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

    /// <summary>
    /// A reader's own colours as the stylesheet to follow <see cref="Build"/>'s: the brand variables of each theme they move, derived by
    /// the palette's own rule (<see cref="UIThemeColors.ApplyTo"/>); empty where they move none.
    /// </summary>
    /// <remarks>
    /// Variables only, under the selectors <see cref="Build"/> writes the palettes under, so the application's stylesheet stays one
    /// for every reader; what <see cref="Build"/> mixes from them (a wash, an ink on a tint) follows by itself.
    /// </remarks>
    public static string BuildColors(UITheme theme, UIThemeColors? colors)
    {
        ArgumentNullException.ThrowIfNull(theme);

        if (colors is null || colors.IsEmpty)
            return string.Empty;

        UITheme own = colors.ApplyTo(theme);
        var light = !ReferenceEquals(own.Light, theme.Light);
        var dark = !ReferenceEquals(own.Dark, theme.Dark);

        StringBuilder builder = new();

        if (light)
            AppendBrandTheme(builder, $"[{WebAttributes.Theme}=\"light\"]", own.Light);

        if (dark)
            AppendBrandTheme(builder, $"[{WebAttributes.Theme}=\"dark\"]", own.Dark);

        if (light)
            AppendMediaTheme(builder, "(prefers-color-scheme: light)", own.Light, AppendBrandTheme);

        if (dark)
            AppendMediaTheme(builder, "(prefers-color-scheme: dark)", own.Dark, AppendBrandTheme);

        return builder.ToString();
    }

    private static void AppendBrandTheme(StringBuilder builder, string selector, UIColorPalette palette)
    {
        _ = builder.Append(selector).AppendLine(" {");
        AppendBrandVariables(builder, palette);
        _ = builder.AppendLine("}");
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
