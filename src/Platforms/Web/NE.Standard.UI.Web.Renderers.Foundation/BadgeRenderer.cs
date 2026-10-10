using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.Text;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The properties a badge is drawn from; a text body's badge and the badge component name different ones.</summary>
public sealed record WebBadgeRenderOptions
{
    public required UIProperty StyleProperty { get; init; }

    /// <summary>Optional raw-color override, rendered instead of <see cref="StyleProperty"/> when set.</summary>
    public UIProperty? ColorProperty { get; init; }

    /// <summary>How the badge spends its colour (<c>UIBadgeFill</c>); unset, a style fills and a colour tints.</summary>
    public UIProperty? FillProperty { get; init; }

    public required UIProperty IconProperty { get; init; }

    public required UIProperty IconColorProperty { get; init; }

    public required UIProperty IconSizeProperty { get; init; }

    /// <summary>The shape a picture icon is drawn in (<c>UIIconShape</c>), where the badge has one — a chip's, not a text's.</summary>
    public UIProperty? IconShapeProperty { get; init; }

    public required UIProperty TextProperty { get; init; }

    public required UIProperty TextTypeProperty { get; init; }

    public required UIProperty TooltipProperty { get; init; }

    public required UIProperty TooltipPlacementProperty { get; init; }

    /// <summary>
    /// What the tooltip's words drive where it is more than the words (<see cref="WebComponentRendererBase.TooltipOperation"/> first) —
    /// a caption badge's name and tab stop; empty for the words alone.
    /// </summary>
    public ReadOnlyMemory<WebDomOperation> TooltipOperations { get; init; }

    public string ContentStateTarget { get; init; } = "root";

    /// <summary>
    /// The element that says the badge shows, for the layout around it: a text body's component root, which wears
    /// <see cref="WebAttributes.TextBadgeIcon"/> and <see cref="WebAttributes.TextBadgeText"/> beside the body's other marks; null for a
    /// badge nothing lays out by.
    /// </summary>
    public string? ShownMarkTarget { get; init; }

    /// <summary>One more operation after the icon's and the text's own, as a text body's other parts run it (<c>WebTextBodyOptions.PartsShownOperation</c>).</summary>
    public WebDomOperation? PartsShownOperation { get; init; }
}

/// <summary>Renders a badge — its style or raw colour, icon and text — into an element, whichever component owns it.</summary>
public static class BadgeRenderer
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string IconShownAttribute = "data-ui-badge-icon";
    private const string ColorVariable = "--ui-badge-color";
    private const string InkVariable = "--ui-badge-ink";
    private const string OnColorVariable = "--ui-badge-on";
    private const string ColoredClassName = "ui-badge--colored";

    private static readonly WebDomOperation[] StyleOperations = [WebDomOperation.Class(converter: WebDomConverters.BadgeStyleClass)];
    private static readonly WebDomOperation[] FillOperations = [WebDomOperation.Class(converter: WebDomConverters.BadgeFillClass)];

    // A colour names the three a style's class names (ui-badge.less): itself, its ink and the words that read on it; the fill picks
    // which of them the badge wears, so a fill changed later needs nothing rewritten here. A raw colour names no ink: the stylesheet
    // shades one from the colour against the theme's grounds.
    private static readonly WebDomOperation[] ColorOperations =
    [
        WebDomOperation.Style(ColorVariable, converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.Style(InkVariable, converter: WebDomConverters.RoleInkCss),
        WebDomOperation.Style(OnColorVariable, converter: WebDomConverters.ThemeOnColorCss),
        WebDomOperation.Class(converter: WebDomConverters.BadgeColoredClass)
    ];

    // The content-state marks land on the badge's own element, which differs by host: per target, built once.
    private static readonly ConcurrentDictionary<(string Target, string? ShownTarget, WebDomOperation? Then), BadgeStateOperations> StateOperations = new();

    public static void RenderBadge(WebRenderContext context, IHtmlElementBuilder componentRoot, IHtmlElementBuilder badgeRoot, WebBadgeRenderOptions options)
        => RenderBadge(context, componentRoot, badgeRoot, options, shownMarkHost: null);

    /// <summary>A badge whose showing <paramref name="shownMarkHost"/> wears: the element <see cref="WebBadgeRenderOptions.ShownMarkTarget"/> names.</summary>
    public static void RenderBadge(WebRenderContext context, IHtmlElementBuilder componentRoot, IHtmlElementBuilder badgeRoot, WebBadgeRenderOptions options, IHtmlElementBuilder? shownMarkHost)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(componentRoot);
        ArgumentNullException.ThrowIfNull(badgeRoot);
        ArgumentNullException.ThrowIfNull(options);

        if ((options.ShownMarkTarget is null) != (shownMarkHost is null))
            throw new ArgumentException("A badge's shown mark needs both its target and the element the first paint writes it on.", nameof(shownMarkHost));

        if (!options.TooltipOperations.IsEmpty)
            WebComponentRendererBase.RenderTooltip(context, badgeRoot, options.TooltipProperty, options.TooltipPlacementProperty, options.TooltipOperations.Span);
        else
            WebComponentRendererBase.RenderTooltip(context, badgeRoot, options.TooltipProperty, options.TooltipPlacementProperty);

        _ = WebComponentRendererBase.RenderProperty<UIBadgeType?>(context, badgeRoot, options.StyleProperty, static (target, value) =>
        {
            if (value is UIBadgeType style)
                _ = target.Class(WebClassNames.BadgeStyle(style));
        }, StyleOperations);

        if (options.ColorProperty is UIProperty colorProperty)
        {
            _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, badgeRoot, colorProperty, static (target, value) =>
            {
                if (value is UIThemeColor color && WebCssValues.ThemeColor(color) is { Length: > 0 } css)
                {
                    _ = target.Style(ColorVariable, css);

                    // A semantic colour spent on words is its ink: the raw warning on its own 16 % ground is about 1.6:1. A raw colour's
                    // is the stylesheet's (.ui-raw-ink()), which holds against whichever theme the badge stands in.
                    if (WebCssValues.RoleInk(color) is { Length: > 0 } ink)
                        _ = target.Style(InkVariable, ink);

                    // A raw colour's by its lightness, so a filled one reads whatever the author picked.
                    if (WebCssValues.ThemeOnColor(color) is { Length: > 0 } onColor)
                        _ = target.Style(OnColorVariable, onColor);

                    _ = target.Class(ColoredClassName);
                }
            }, ColorOperations);
        }

        if (options.FillProperty is UIProperty fillProperty)
        {
            _ = WebComponentRendererBase.RenderProperty<UIBadgeFill?>(context, badgeRoot, fillProperty, static (target, value) =>
            {
                if (value is UIBadgeFill fill)
                    _ = target.Class(WebClassNames.BadgeFill(fill));
            }, FillOperations);
        }

        // On the badge, not only its text, so an icon with no size of its own inherits the text's height.
        TextAppearanceRenderer.RenderTextAppearance(context, badgeRoot, options.TextTypeProperty);

        BadgeStateOperations state = StateOperations.GetOrAdd((options.ContentStateTarget, options.ShownMarkTarget, options.PartsShownOperation), static key => new BadgeStateOperations(key.Target, key.ShownTarget, key.Then));

        _ = badgeRoot.Element("span", icon =>
        {
            _ = icon.Class("ui-badge__icon");
            _ = icon.Class("ui-icon");

            IconValueRenderer.RenderIconAppearance(context, icon, options.IconSizeProperty, options.IconColorProperty);

            if (options.IconShapeProperty is UIProperty shapeProperty)
                IconValueRenderer.RenderIconShape(context, icon, shapeProperty);

            _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, options.IconProperty, (target, value) =>
            {
                if (IconValueRenderer.Draws(value))
                {
                    _ = badgeRoot.Attribute(IconShownAttribute);
                    _ = shownMarkHost?.Attribute(WebAttributes.TextBadgeIcon);
                    IconValueRenderer.RenderIconValue(target, value);
                }
            }, state.Icon);
        });

        _ = badgeRoot.Element("span", content =>
        {
            _ = content.Class("ui-badge__text");

            TextAppearanceRenderer.RenderTextAppearance(context, content, options.TextTypeProperty);

            _ = WebComponentRendererBase.RenderProperty<string?>(context, content, options.TextProperty, (target, value) =>
            {
                if (value is not null)
                    _ = badgeRoot.Attribute(WebAttributes.BadgeSet);

                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute(WebAttributes.BadgeText, BadgeTextFit(value));
                    _ = shownMarkHost?.Attribute(WebAttributes.TextBadgeText);
                    _ = target.Text(value);
                }
            }, state.Text);
        });
    }

    /// <summary>
    /// A bare count badge with no component behind it, whose figure a package's own script writes and hides; <paramref name="configure"/>
    /// adds the package's own class or mark.
    /// </summary>
    public static void RenderCountBadge(IHtmlElementBuilder parent, UIBadgeType style, string? count = null, Action<IHtmlElementBuilder>? configure = null, UIBadgeFill fill = UIBadgeFill.Filled)
    {
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("span", badge =>
        {
            _ = badge.Class("ui-badge");
            _ = badge.Class(WebClassNames.BadgeStyle(style));

            // A style fills by itself, so the default writes no class.
            if (fill != UIBadgeFill.Filled)
                _ = badge.Class(WebClassNames.BadgeFill(fill));

            if (!string.IsNullOrWhiteSpace(count))
                _ = badge.Attribute(WebAttributes.BadgeText, BadgeTextFit(count));

            configure?.Invoke(badge);

            _ = badge.Element("span", text =>
            {
                _ = text.Class("ui-badge__text");

                if (!string.IsNullOrWhiteSpace(count))
                    _ = text.Text(count);
            });
        });
    }

    private sealed class BadgeStateOperations(string target, string? shownTarget, WebDomOperation? then)
    {
        public WebDomOperation[] Icon { get; } =
        [
            .. IconValueRenderer.Operations,
            WebDomOperation.ToggleAttribute(IconShownAttribute, target: target, condition: WebValueCondition.DrawsIcon),
            .. ShownMark(WebAttributes.TextBadgeIcon, shownTarget, WebValueCondition.DrawsIcon),
            .. Then(then)
        ];

        public WebDomOperation[] Text { get; } =
        [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(WebAttributes.BadgeText, target: target, condition: WebValueCondition.HasText, converter: WebDomConverters.BadgeTextFit),
            WebDomOperation.ToggleAttribute(WebAttributes.BadgeSet, target: target, condition: WebValueCondition.HasValue),
            .. ShownMark(WebAttributes.TextBadgeText, shownTarget, WebValueCondition.HasText),
            .. Then(then)
        ];

        // Written empty, as the first paint writes it: a flag, not the badge's words.
        private static WebDomOperation[] ShownMark(string attribute, string? shownTarget, WebValueCondition condition)
            => shownTarget is null ? [] : [WebDomOperation.ToggleAttribute(attribute, target: shownTarget, condition: condition, value: string.Empty)];

        private static WebDomOperation[] Then(WebDomOperation? then)
            => then is null ? [] : [then];
    }

    // Two cells fit a circle without touching its edge: a narrow character is one, an East Asian wide one or an emoji two, so two
    // digits make a circle and two ideographs do not. Mirrored by `toBadgeTextFit` in web-dom-converters.ts, both held to
    // eng/Tests/Shared/badge-fit-corpus.json.
    private static string? BadgeTextFit(string text)
        => CountCells(text.Trim(), CompactCells + 1) is > 0 and <= CompactCells ? "compact" : null;

    private const int CompactCells = 2;

    /// <summary>The cells <paramref name="text"/> takes, counted per character as the reader sees one, stopping at <paramref name="limit"/>.</summary>
    private static int CountCells(string text, int limit)
    {
        // Below the combining marks every character is one cell on its own, so the common badge (a count, a word) needs no segmenting.
        if (!text.AsSpan().ContainsAnyInRange('\u0300', '\uFFFF'))
            return text.Length;

        var cells = 0;

        for (var index = 0; index < text.Length && cells < limit;)
        {
            var length = StringInfo.GetNextTextElementLength(text, index);

            cells += IsWide(text.AsSpan(index, length)) ? 2 : 1;
            index += length;
        }

        return cells;
    }

    /// <summary>Whether a character the reader sees as one is drawn two cells wide: East Asian wide or full-width, or an emoji.</summary>
    private static bool IsWide(ReadOnlySpan<char> character)
    {
        // The emoji presentation selector makes a symbol a picture, whatever its own width.
        if (character.Contains('\uFE0F'))
            return true;

        _ = Rune.DecodeFromUtf16(character, out Rune first, out _);

        for (var i = 0; i < WideRanges.Length; i += 2)
        {
            if (first.Value >= WideRanges[i] && first.Value <= WideRanges[i + 1])
                return true;
        }

        return false;
    }

    // East Asian Wide and Fullwidth (UAX #11) with the emoji drawn as pictures by default, as start/end pairs; the same table as the client's.
    private static readonly int[] WideRanges =
    [
        0x1100, 0x115F, 0x231A, 0x231B, 0x2329, 0x232A, 0x23E9, 0x23EC, 0x23F0, 0x23F0, 0x23F3, 0x23F3,
        0x25FD, 0x25FE, 0x2614, 0x2615, 0x2648, 0x2653, 0x267F, 0x267F, 0x2693, 0x2693, 0x26A1, 0x26A1,
        0x26AA, 0x26AB, 0x26BD, 0x26BE, 0x26C4, 0x26C5, 0x26CE, 0x26CE, 0x26D4, 0x26D4, 0x26EA, 0x26EA,
        0x26F2, 0x26F3, 0x26F5, 0x26F5, 0x26FA, 0x26FA, 0x26FD, 0x26FD, 0x2705, 0x2705, 0x270A, 0x270B,
        0x2728, 0x2728, 0x274C, 0x274C, 0x274E, 0x274E, 0x2753, 0x2755, 0x2757, 0x2757, 0x2795, 0x2797,
        0x27B0, 0x27B0, 0x27BF, 0x27BF, 0x2B1B, 0x2B1C, 0x2B50, 0x2B50, 0x2B55, 0x2B55, 0x2E80, 0x303E,
        0x3041, 0x33FF, 0x3400, 0x4DBF, 0x4E00, 0x9FFF, 0xA000, 0xA4CF, 0xA960, 0xA97F, 0xAC00, 0xD7A3,
        0xF900, 0xFAFF, 0xFE10, 0xFE19, 0xFE30, 0xFE6F, 0xFF00, 0xFF60, 0xFFE0, 0xFFE6, 0x1B000, 0x1B2FF,
        0x1F004, 0x1F004, 0x1F0CF, 0x1F0CF, 0x1F18E, 0x1F18E, 0x1F191, 0x1F19A, 0x1F1E6, 0x1F202, 0x1F210, 0x1F23B,
        0x1F240, 0x1F248, 0x1F250, 0x1F251, 0x1F260, 0x1F265, 0x1F300, 0x1F64F, 0x1F680, 0x1F6FF, 0x1F7E0, 0x1F7EB,
        0x1F90C, 0x1F9FF, 0x1FA70, 0x1FAFF, 0x20000, 0x2FFFD, 0x30000, 0x3FFFD
    ];
}
