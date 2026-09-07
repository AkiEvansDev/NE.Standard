using System;
using System.Collections.Generic;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;
using NE.Standard.UI.Web.Renderers.Items;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>A trail of steps resolved through the step template; the current step is marked client-side.</summary>
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

        _ = root.Attribute("aria-label", context.Translate(UIStrings.BreadcrumbsLabel));

        // An author's own separator is a CSS string on a pseudo-element; with none set the stylesheet draws its chevron.
        _ = ResolveRenderValue(context, BreadcrumbsComponent.SeparatorProperty, out string? separator, out _);

        if (!string.IsNullOrEmpty(separator))
        {
            _ = root.Class("ui-breadcrumbs--text-separator");
            _ = root.Style("--ui-breadcrumbs-separator", ToCssString(separator));
        }

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, BreadcrumbsComponent.SpacingProperty, "--ui-breadcrumbs-spacing");

        RenderTemplates(context, root);

        // Both halves of the wrapper, not just the class, or a static and a bound trail end up different shapes.
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>The author's mark as an escaped CSS string literal, since it ends up inside a <c>style</c> attribute.</summary>
    private static string ToCssString(string value)
        => $"\"{value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal)}\"";

    /// <summary>Renders the steps into an inner host, which is where the client's descendants-only lookup expects them.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);

        RenderItemsHost(context, root, "ui-breadcrumbs__host", items, isBound, ItemClassName);
    }
}
