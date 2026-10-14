using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class BadgeComponentRenderer : WebComponentRendererBase
{
    private static readonly WebIconShapeSite IconShapeSite = new(BadgeComponent.IconProperty, BadgeComponent.IconShapeProperty, BadgeComponent.IconFallbackProperty, WebAttributes.BadgeIcon);

    public override string ComponentTypeKey => BadgeComponent.ComponentTypeKey;

    protected override string ClassName => "ui-badge";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        BadgeRenderer.RenderBadge(context, root, root,
            new WebBadgeRenderOptions
            {
                StyleProperty = BadgeComponent.TypeProperty,
                ColorProperty = BadgeComponent.ColorProperty,
                FillProperty = BadgeComponent.FillProperty,
                IconProperty = BadgeComponent.IconProperty,
                IconColorProperty = BadgeComponent.IconColorProperty,
                IconSizeProperty = BadgeComponent.IconSizeProperty,
                IconShape = IconShapeSite,
                TextProperty = BadgeComponent.TextProperty,
                TextTypeProperty = BadgeComponent.TextTypeProperty,
                TooltipProperty = ITooltipComponent.TooltipProperty,
                TooltipPlacementProperty = ITooltipComponent.TooltipPlacementProperty
            });
    }
}
