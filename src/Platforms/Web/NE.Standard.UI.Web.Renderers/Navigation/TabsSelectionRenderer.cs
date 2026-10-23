using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// The selected tab as one key on the root, not a class per tab, so a click and a server patch drive one fact for one client engine.
/// </summary>
internal static class TabsSelectionRenderer
{
    private static readonly WebDomOperation[] SelectedKeyOperations = [WebDomOperation.Attribute(WebAttributes.TabsSelected, target: "root")];

    public static void RenderSelectedKey(WebRenderContext context, IHtmlElementBuilder root)
        => WebComponentRendererBase.RenderSelectedKey(context, root, WebValueKinds.TabsSelected, WebAttributes.TabsSelected, SelectedKeyOperations);
}
