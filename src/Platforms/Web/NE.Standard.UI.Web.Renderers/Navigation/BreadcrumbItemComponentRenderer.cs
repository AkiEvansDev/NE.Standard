using System;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Actions;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One step of a trail: the button chrome on an anchor, so a navigating step has a real URL.</summary>
public sealed class BreadcrumbItemComponentRenderer : ButtonRendererBase
{
    public override string ComponentTypeKey => BreadcrumbItemComponent.ComponentTypeKey;

    protected override string ElementName => "a";

    protected override string ClassName => "ui-breadcrumb";

    protected override bool IsButtonElement => false;

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-button");

        RenderButtonChrome(context, root);

        _ = RenderProperty<string?>(context, root, BreadcrumbItemComponent.UrlProperty, static (target, value) =>
        {
            if (WebUrlSafety.IsSafeLink(value))
                _ = target.Attribute("href", value);
        }, [WebDomOperation.Attribute("href", converter: WebDomConverters.SafeUrl)]);

        RenderButtonLabel(context, root);
    }
}
