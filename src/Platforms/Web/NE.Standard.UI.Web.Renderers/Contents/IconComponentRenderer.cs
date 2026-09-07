using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class IconComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => IconComponent.ComponentTypeKey;

    protected override string ElementName => "span";

    protected override string ClassName => "ui-icon";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        RenderTooltip(context, root);

        IconValueRenderer.RenderIconAppearance(context, root, IconComponent.SizeProperty, IconComponent.ColorProperty);

        _ = RenderProperty<string?>(context, root, IconComponent.IconProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute(WebAttributes.Icon);
                IconValueRenderer.RenderIconValue(target, value);
            }
        }, [
            .. IconValueRenderer.Operations,
            WebDomOperation.ToggleAttribute(WebAttributes.Icon, condition: WebValueCondition.HasText)
        ]);
    }
}
