using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class LinkComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => LinkComponent.ComponentTypeKey;

    protected override string ElementName => "a";

    protected override string ClassName => "ui-link";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<string?>(context, root, LinkComponent.UrlProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeLink(value))
                _ = target.Attribute("href", value);
        }, [WebDomOperation.Attribute("href", converter: WebDomConverters.SafeUrl)]);

        RenderTooltip(context, root);

        // In a child box, not on the anchor: the body writes TitleColor where it is drawn, and `inherit` on the
        // anchor itself would replace the link's own hue with the page's.
        _ = root.Element("span", content =>
        {
            _ = content.Class("ui-link__content");

            TextContentRendererBase.RenderTextBody(context, root, content, new WebTextBodyOptions
            {
                DefaultBadgePlacement = UITextBadgePlacement.Inline
            });
        });
    }
}
