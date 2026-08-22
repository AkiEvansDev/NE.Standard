using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed record WebBadgeRenderOptions
{
    public required UIProperty StyleProperty { get; init; }

    /// <summary>
    /// Optional raw-color override, rendered instead of <see cref="StyleProperty"/> when set. Only
    /// <see cref="BadgeComponentRenderer"/> itself supplies this — ITextBaseComponent-shaped badges (see
    /// <c>TextComponentRenderer</c>, <c>TextInputComponentRenderer</c>) have no such property.
    /// </summary>
    public UIProperty? ColorProperty { get; init; }

    public required UIProperty IconProperty { get; init; }

    public required UIProperty IconColorProperty { get; init; }

    public required UIProperty IconSizeProperty { get; init; }

    public required UIProperty TextProperty { get; init; }

    public required UIProperty TextTypeProperty { get; init; }

    public required UIProperty TooltipProperty { get; init; }

    public string ContentStateTarget { get; init; } = "root";
}

public sealed class BadgeComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => BadgeComponent.ComponentTypeKey;

    protected override string ClassName => "ui-badge";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        RenderBadge(context, root, root,
            new WebBadgeRenderOptions
            {
                StyleProperty = BadgeComponent.StyleProperty,
                ColorProperty = BadgeComponent.ColorProperty,
                IconProperty = BadgeComponent.IconProperty,
                IconColorProperty = BadgeComponent.IconColorProperty,
                IconSizeProperty = BadgeComponent.IconSizeProperty,
                TextProperty = BadgeComponent.TextProperty,
                TextTypeProperty = BadgeComponent.TextTypeProperty,
                TooltipProperty = BadgeComponent.TooltipProperty
            });
    }

    public static void RenderBadge(WebRenderContext context, IHtmlElementBuilder componentRoot, IHtmlElementBuilder badgeRoot, WebBadgeRenderOptions options)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(componentRoot);
        ArgumentNullException.ThrowIfNull(badgeRoot);
        ArgumentNullException.ThrowIfNull(options);

        _ = RenderProperty<string?>(context, badgeRoot, options.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        _ = RenderProperty<UIBadgeType?>(context, badgeRoot, options.StyleProperty, static (target, value) =>
        {
            if (value is UIBadgeType style)
                _ = target.Class(WebClassNames.BadgeStyle(style));
        }, [WebDomOperation.Class(converter: WebDomConverters.BadgeStyleClass)]);

        if (options.ColorProperty is UIProperty colorProperty)
        {
            _ = RenderProperty<UIThemeColor?>(context, badgeRoot, colorProperty, static (target, value) =>
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

        _ = badgeRoot.Element("span", icon =>
        {
            _ = icon.Class("ui-badge__icon");
            _ = icon.Class("ui-icon");

            _ = RenderProperty<UIIconSize?>(context, icon, options.IconSizeProperty, static (target, value) =>
            {
                if (value is UIIconSize iconSize)
                    _ = target.Class(WebClassNames.IconSize(iconSize));
            }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

            ThemeColorRenderer.RenderThemeColor(context, icon, options.IconColorProperty);

            _ = RenderProperty<string?>(context, icon, options.IconProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute("data-ui-badge-icon");
                    _ = target.Class(WebIconClassName.FromIconName(value));
                }
            }, [
                WebDomOperation.Class(converter: WebDomConverters.IconClass),
                WebDomOperation.ToggleAttribute("data-ui-badge-icon", target: options.ContentStateTarget, condition: WebValueCondition.HasText)
            ]);
        });

        _ = badgeRoot.Element("span", content =>
        {
            _ = content.Class("ui-badge__text");

            TextAppearanceRenderer.RenderTextAppearance(context, content, options.TextTypeProperty);

            _ = RenderProperty<string?>(context, content, options.TextProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = badgeRoot.Attribute("data-ui-badge-text");
                    _ = target.Text(value);
                }
            }, [
                WebDomOperation.Text(),
                WebDomOperation.ToggleAttribute("data-ui-badge-text", target: options.ContentStateTarget, condition: WebValueCondition.HasText)
            ]);
        });
    }
}
