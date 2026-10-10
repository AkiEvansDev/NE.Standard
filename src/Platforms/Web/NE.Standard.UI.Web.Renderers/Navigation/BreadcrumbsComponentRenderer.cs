using System;
using System.Collections.Generic;
using System.Text;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
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

        WebWords.Write(context, root, "aria-label", UIStrings.BreadcrumbsLabel);

        // An author's own separator is a CSS string on a pseudo-element; with none set the stylesheet draws its chevron.
        _ = ResolveRenderValue(context, BreadcrumbsComponent.SeparatorProperty, out string? separator, out _);

        if (!string.IsNullOrEmpty(separator))
        {
            _ = root.Class("ui-breadcrumbs--text-separator");
            _ = root.Style("--ui-breadcrumbs-separator", WebCssValues.CssString(separator));
        }

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, BreadcrumbsComponent.SpacingProperty, "--ui-breadcrumbs-spacing");

        RenderTemplates(context, root);

        // Both halves of the wrapper, not just the class, or a static and a bound trail end up different shapes.
        RegisterItemsTemplateMetadata(context, itemWrapperElementName: "div", itemWrapperClassName: ItemClassName);
        RegisterItemsFilterSortMetadata(context);

        RenderItems(context, root);
    }

    /// <summary>Renders the steps into an inner host, which is where the client's descendants-only lookup expects them.</summary>
    private static void RenderItems(WebRenderContext context, IHtmlElementBuilder root)
    {
        (IReadOnlyList<object?> items, var isBound) = ResolveItems(context);
        List<(IHtmlElementBuilder Row, UIResponsive<UIVisibility>? Visibility)> steps = [];

        RenderItemsHost(context, root, "ui-breadcrumbs__host", items, isBound, ItemClassName, appendItem: (row, item, _) => steps.Add((row, ReadItemRootValue<UIResponsive<UIVisibility>?>(context, row, item, IVisualComponent.VisibilityProperty))));

        MarkSteps(steps);
    }

    /// <summary>
    /// Writes on each step's wrapper the tiers its step is collapsed in and the tiers no shown step follows it in, where it draws no
    /// separator, walking the trail from its end; breadcrumbs-engine.ts keeps both, and takes a filter's hidden steps out too.
    /// </summary>
    private static void MarkSteps(List<(IHtmlElementBuilder Row, UIResponsive<UIVisibility>? Visibility)> steps)
    {
        Span<bool> shownAfter = stackalloc bool[(int)UIResponsiveTier.Xxl + 1];
        StringBuilder collapsed = new();
        StringBuilder end = new();

        for (var index = steps.Count - 1; index >= 0; index--)
        {
            (IHtmlElementBuilder row, UIResponsive<UIVisibility>? visibility) = steps[index];

            _ = collapsed.Clear();
            _ = end.Clear();

            for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
            {
                var tierCollapsed = visibility?.Resolve(tier) == UIVisibility.Collapsed;

                if (tierCollapsed)
                    AppendTier(collapsed, tier);

                if (!shownAfter[(int)tier])
                    AppendTier(end, tier);

                shownAfter[(int)tier] |= !tierCollapsed;
            }

            if (collapsed.Length > 0)
                _ = row.Attribute(WebAttributes.StepCollapsed, collapsed.ToString());

            if (end.Length > 0)
                _ = row.Attribute(WebAttributes.StepEnd, end.ToString());
        }
    }

    private static void AppendTier(StringBuilder tiers, UIResponsiveTier tier)
        => _ = (tiers.Length == 0 ? tiers : tiers.Append(' ')).Append(WebResponsiveCss.TierWord(tier));
}
