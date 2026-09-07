using System;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One caption in the strip: the button chrome plus the key of the page it selects.</summary>
public sealed class TabHeaderComponentRenderer : ButtonRendererBase
{
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
            _ = root.Attribute(WebAttributes.TabKey, tabKey);

        RenderButtonLabel(context, root);
    }
}
