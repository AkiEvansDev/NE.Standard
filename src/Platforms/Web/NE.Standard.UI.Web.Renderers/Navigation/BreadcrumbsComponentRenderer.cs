using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// A trail of steps, each resolved through the step template. The current step is not marked here: which one
/// it is depends on how many steps there are, which a bound collection only knows on the client — see
/// <c>breadcrumbs-engine.ts</c>.
/// </summary>
public sealed class BreadcrumbsComponentRenderer : ItemsCollectionRendererBase
{
    private const string ItemClassName = "ui-breadcrumbs__item";

    public override string ComponentTypeKey => BreadcrumbsComponent.ComponentTypeKey;

    protected override string ElementName => "nav";

    protected override string ClassName => "ui-breadcrumbs";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute("aria-label", "Breadcrumb");

        // A CSS string, because the mark is drawn by a pseudo-element on every step but the first — see
        // BreadcrumbsComponent.Separator for why it is not an element and not bindable.
        _ = ResolveRenderValue(context, BreadcrumbsComponent.SeparatorProperty, out string? separator, out _);
        _ = root.Style("--ui-breadcrumbs-separator", ToCssString(separator ?? BreadcrumbsComponent.DefaultSeparator));

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, BreadcrumbsComponent.SpacingProperty, "--ui-breadcrumbs-spacing");

        RenderTemplates(context, root);

        // Both halves of the wrapper, not just the class: with only a class the server wraps each step in a
        // div and the client does not, and the trail ends up with two shapes — which is exactly what makes
        // `:first-child` mean different things on a static and a bound trail.
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>
    /// The author's mark as a CSS string literal. Escaped rather than trusted: the value ends up inside a
    /// <c>style</c> attribute, where an unescaped quote would close the string and let the rest read as
    /// another declaration.
    /// </summary>
    private static string ToCssString(string value)
        => $"\"{value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal)}\"";

    /// <summary>
    /// Steps live in an inner host, the way every bound collection must — the client resolves a host with
    /// <c>root.querySelector("[data-ui-items-host]")</c>, which searches descendants only.
    /// </summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        _ = root.Element("div", host =>
        {
            _ = host.Class("ui-breadcrumbs__host");
            _ = host.Attribute("data-ui-items-host");

            if (isBound)
                return;

            if (items.Count == 0)
            {
                RenderEmptyPlaceholder(context, host);
                return;
            }

            RenderItemList(context, host, items, ItemClassName);
        });
    }
}
