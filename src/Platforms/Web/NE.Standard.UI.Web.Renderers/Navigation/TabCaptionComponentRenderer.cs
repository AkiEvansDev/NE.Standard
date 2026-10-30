using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One caption in the strip: the button chrome plus the key of the page it selects.</summary>
public sealed class TabCaptionComponentRenderer : ButtonRendererBase
{
    private const string SelectedClassName = WebClassNames.TabCaptionSelected;

    public override string ComponentTypeKey => TabCaptionComponent.ComponentTypeKey;

    protected override string ClassName => WebClassNames.TabCaption;

    // The underline is drawn outside the caption's box; an inline clip would cut it off before any stylesheet rule could say otherwise.
    protected override bool RendersOverflow => false;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(WebClassNames.Button);
        _ = root.Attribute("role", "tab");

        RenderButtonChrome(context, root);

        // Render-time only — see TabCaptionComponent.TabKey.
        _ = ResolveRenderValue(context, TabCaptionComponent.TabKeyProperty, out string? tabKey, out _);

        if (!string.IsNullOrWhiteSpace(tabKey))
        {
            _ = root.Attribute(WebAttributes.TabKey, tabKey);
            RenderOwnTab(context, root, tabKey);
        }

        RenderButtonLabel(context, root);
    }

    /// <summary>
    /// The tab's id and the page it controls, which names itself by it (<see cref="TabsComponentRenderer"/>); and the selected mark the
    /// tabs engine keeps, written for the first paint from the strip's own key.
    /// </summary>
    private static void RenderOwnTab(WebRenderContext context, IHtmlElementBuilder root, string tabKey)
    {
        CompiledView view = context.ViewResolution.View;

        if (context.Node.ParentId is not UIComponentId parentId || !view.Graph.TryGet(parentId, out UIComponentNode? tabs) || tabs.TypeKey != TabsComponent.ComponentTypeKey)
            return;

        WebRenderContext owner = context.ForNode(tabs, root);
        List<string> keys = TabsComponentRenderer.ResolveTabKeys(owner);
        var index = keys.IndexOf(tabKey);

        if (index >= 0 && TabsComponentRenderer.TabPartId(owner, TabsComponentRenderer.TabPart, index) is string id)
        {
            _ = root.Attribute("id", id);
            _ = root.Attribute("aria-controls", TabsComponentRenderer.TabPartId(owner, TabsComponentRenderer.PanelPart, index));
        }

        if (TabsComponentRenderer.ResolveSelectedTab(owner, keys) is not string selected)
            return;

        var own = string.Equals(selected, tabKey, StringComparison.Ordinal);

        if (own)
            _ = root.Class(SelectedClassName);

        _ = root.Attribute("aria-selected", own ? "true" : "false");
    }
}
