using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class BadgeComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => BadgeComponent.ComponentTypeKey;

    protected override string ClassName => "ui-badge";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        BadgeRenderer.RenderBadge(context, root, root,
            new WebBadgeRenderOptions
            {
                StyleProperty = BadgeComponent.StyleProperty,
                ColorProperty = BadgeComponent.ColorProperty,
                IconProperty = BadgeComponent.IconProperty,
                IconColorProperty = BadgeComponent.IconColorProperty,
                IconSizeProperty = BadgeComponent.IconSizeProperty,
                TextProperty = BadgeComponent.TextProperty,
                TextTypeProperty = BadgeComponent.TextTypeProperty,
                TooltipProperty = ITooltipComponent.TooltipProperty,
                TooltipPlacementProperty = ITooltipComponent.TooltipPlacementProperty
            });
    }
}
