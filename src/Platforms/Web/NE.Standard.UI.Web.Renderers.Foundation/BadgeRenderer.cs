using System;
using System.Collections.Concurrent;
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

    public required UIProperty IconProperty { get; init; }

    public required UIProperty IconColorProperty { get; init; }

    public required UIProperty IconSizeProperty { get; init; }

    public required UIProperty TextProperty { get; init; }

    public required UIProperty TextTypeProperty { get; init; }

    public required UIProperty TooltipProperty { get; init; }

    public required UIProperty TooltipPlacementProperty { get; init; }

    public string ContentStateTarget { get; init; } = "root";
}

/// <summary>Renders a badge — its style or raw colour, icon and text — into an element, whichever component owns it.</summary>
public static class BadgeRenderer
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string IconShownAttribute = "data-ui-badge-icon";
    private const string TintVariable = "--ui-badge-tint";

    private static readonly WebDomOperation[] StyleOperations = [WebDomOperation.Class(converter: WebDomConverters.BadgeStyleClass)];

    // Tinted by a colour: the words in its ink, the ground mixed from the raw colour in --ui-badge-tint.
    private static readonly WebDomOperation[] ColorOperations =
    [
        WebDomOperation.Style("color", converter: WebDomConverters.ThemeInkCss),
        WebDomOperation.Style(TintVariable, converter: WebDomConverters.ThemeColorCss),
        WebDomOperation.ToggleClass("ui-badge--tinted", condition: WebValueCondition.HasValue)
    ];

    // The content-state marks land on the badge's own element, which differs by host: per target, built once.
    private static readonly ConcurrentDictionary<string, BadgeStateOperations> StateOperations = new(StringComparer.Ordinal);

    public static void RenderBadge(WebRenderContext context, IHtmlElementBuilder componentRoot, IHtmlElementBuilder badgeRoot, WebBadgeRenderOptions options)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(componentRoot);
        ArgumentNullException.ThrowIfNull(badgeRoot);
        ArgumentNullException.ThrowIfNull(options);

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
                    // A semantic colour spent on words is its ink: the raw warning on its own 16 % ground is about 1.1:1.
                    _ = target.Style("color", WebCssValues.ThemeInk(color));
                    _ = target.Style(TintVariable, css);
                    _ = target.Class("ui-badge--tinted");
                }
            }, ColorOperations);
        }

        // On the badge, not only its text, so an icon with no size of its own inherits the text's height.
        TextAppearanceRenderer.RenderTextAppearance(context, badgeRoot, options.TextTypeProperty);

        BadgeStateOperations state = StateOperations.GetOrAdd(options.ContentStateTarget, static target => new BadgeStateOperations(target));

        _ = badgeRoot.Element("span", icon =>
        {
            _ = icon.Class("ui-badge__icon");
            _ = icon.Class("ui-icon");

            IconValueRenderer.RenderIconAppearance(context, icon, options.IconSizeProperty, options.IconColorProperty);

            _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, options.IconProperty, (target, value) =>
            {
                if (IconValueRenderer.Draws(value))
                {
                    _ = badgeRoot.Attribute(IconShownAttribute);
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
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute(WebAttributes.BadgeText, BadgeTextFit(value));
                    _ = target.Text(value);
                }
            }, state.Text);
        });
    }

    /// <summary>
    /// A bare count badge with no component behind it, whose figure a package's own script writes and hides; <paramref name="configure"/>
    /// adds the package's own class or mark.
    /// </summary>
    public static void RenderCountBadge(IHtmlElementBuilder parent, UIBadgeType style, string? count = null, Action<IHtmlElementBuilder>? configure = null)
    {
        ArgumentNullException.ThrowIfNull(parent);

        _ = parent.Element("span", badge =>
        {
            _ = badge.Class("ui-badge");
            _ = badge.Class(WebClassNames.BadgeStyle(style));

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

    private sealed class BadgeStateOperations(string target)
    {
        public WebDomOperation[] Icon { get; } = [.. IconValueRenderer.Operations, WebDomOperation.ToggleAttribute(IconShownAttribute, target: target, condition: WebValueCondition.DrawsIcon)];

        public WebDomOperation[] Text { get; } =
        [
            WebDomOperation.Text(),
            WebDomOperation.ToggleAttribute(WebAttributes.BadgeText, target: target, condition: WebValueCondition.HasText, converter: WebDomConverters.BadgeTextFit)
        ];
    }

    // Up to two characters fits a circle without touching its edge; mirrored by `badgeTextFit` in web-dom-converters.ts.
    private static string? BadgeTextFit(string text)
        => text.Trim().Length <= 2 ? "compact" : null;
}
