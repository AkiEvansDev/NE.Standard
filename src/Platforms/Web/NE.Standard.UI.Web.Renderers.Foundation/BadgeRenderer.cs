using System;
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
        }, [WebDomOperation.Class(converter: WebDomConverters.BadgeStyleClass)]);

        if (options.ColorProperty is UIProperty colorProperty)
        {
            _ = WebComponentRendererBase.RenderProperty<UIThemeColor?>(context, badgeRoot, colorProperty, static (target, value) =>
            {
                if (value is UIThemeColor color && WebCssValues.ThemeColor(color) is { Length: > 0 } css)
                {
                    _ = target.Style("color", css);
                    _ = target.Class("ui-badge--tinted");
                }
            }, [
                WebDomOperation.Style("color", converter: WebDomConverters.ThemeColorCss),
                WebDomOperation.ToggleClass("ui-badge--tinted", condition: WebValueCondition.HasValue)
            ]);
        }

        // On the badge, not only its text, so an icon with no size of its own inherits the text's height.
        TextAppearanceRenderer.RenderTextAppearance(context, badgeRoot, options.TextTypeProperty);

        _ = badgeRoot.Element("span", icon =>
        {
            _ = icon.Class("ui-badge__icon");
            _ = icon.Class("ui-icon");

            IconValueRenderer.RenderIconAppearance(context, icon, options.IconSizeProperty, options.IconColorProperty);

            _ = WebComponentRendererBase.RenderProperty<string?>(context, icon, options.IconProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute("data-ui-badge-icon");
                    IconValueRenderer.RenderIconValue(target, value);
                }
            }, [
                .. IconValueRenderer.Operations,
                WebDomOperation.ToggleAttribute("data-ui-badge-icon", target: options.ContentStateTarget, condition: WebValueCondition.HasText)
            ]);
        });

        _ = badgeRoot.Element("span", content =>
        {
            _ = content.Class("ui-badge__text");

            TextAppearanceRenderer.RenderTextAppearance(context, content, options.TextTypeProperty);

            _ = WebComponentRendererBase.RenderProperty<string?>(context, content, options.TextProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute("data-ui-badge-text", BadgeTextFit(value));
                    _ = target.Text(value);
                }
            }, [
                WebDomOperation.Text(),
                WebDomOperation.ToggleAttribute("data-ui-badge-text", target: options.ContentStateTarget, condition: WebValueCondition.HasText, converter: WebDomConverters.BadgeTextFit)
            ]);
        });
    }

    // Up to two characters fits a circle without touching its edge; mirrored by `badgeTextFit` in web-dom-converters.ts.
    private static string? BadgeTextFit(string text)
        => text.Trim().Length <= 2 ? "compact" : null;
}
