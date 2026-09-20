using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// The selected tab as one key on the root, not a class per tab, so a click and a server patch drive one fact for one client engine.
/// </summary>
internal static class TabsSelectionRenderer
{
    public static void RenderSelectedKey(WebRenderContext context, IHtmlElementBuilder root, UIProperty selectedKeyProperty)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TabsSelected);
        _ = WebComponentRendererBase.RenderProperty<string?>(context, root, selectedKeyProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute(WebAttributes.TabsSelected, value);
        }, [WebDomOperation.Attribute(WebAttributes.TabsSelected, target: "root")]);
    }
}
