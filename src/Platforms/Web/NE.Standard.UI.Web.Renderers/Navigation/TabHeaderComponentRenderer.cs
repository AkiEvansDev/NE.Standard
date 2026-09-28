using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One caption in the strip: the button chrome plus the key of the page it selects.</summary>
public sealed class TabHeaderComponentRenderer : ButtonRendererBase
{
    private const string SelectedClassName = "ui-tab-header--selected";

    public override string ComponentTypeKey => TabHeaderComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tab-header";

    // The underline is drawn outside the caption's box; an inline clip would cut it off before any stylesheet rule could say otherwise.
    protected override bool RendersOverflow => false;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-button");
        _ = root.Attribute("role", "tab");

        RenderButtonChrome(context, root);

        // Render-time only — see TabHeaderComponent.TabKey.
        _ = ResolveRenderValue(context, TabHeaderComponent.TabKeyProperty, out string? tabKey, out _);

        if (!string.IsNullOrWhiteSpace(tabKey))
        {
            _ = root.Attribute(WebAttributes.TabKey, tabKey);
            RenderSelected(context, root, tabKey);
        }

        RenderButtonLabel(context, root);
    }

    /// <summary>The selected mark the tabs engine keeps, written for the first paint from the strip's own key.</summary>
    private static void RenderSelected(WebRenderContext context, IHtmlElementBuilder root, string tabKey)
    {
        CompiledView view = context.ViewResolution.View;

        if (context.Node.ParentId is not UIComponentId parentId || !view.Graph.TryGet(parentId, out UIComponentNode? tabs) || tabs.TypeKey != TabsComponent.ComponentTypeKey)
            return;

        WebRenderContext owner = context.ForNode(tabs, root);

        if (TabsComponentRenderer.ResolveSelectedTab(owner, TabsComponentRenderer.ResolveTabKeys(owner)) is not string selected)
            return;

        var own = string.Equals(selected, tabKey, StringComparison.Ordinal);

        if (own)
            _ = root.Class(SelectedClassName);

        _ = root.Attribute("aria-selected", own ? "true" : "false");
    }
}
