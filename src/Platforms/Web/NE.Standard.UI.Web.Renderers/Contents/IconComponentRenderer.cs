using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
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

        _ = RenderProperty<string?>(context, root, IconComponent.TooltipProperty, static (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("title", value);
        }, [WebDomOperation.Attribute("title")]);

        _ = RenderProperty<UIIconSize?>(context, root, IconComponent.SizeProperty, static (target, value) =>
        {
            if (value is UIIconSize size)
                _ = target.Class(WebClassNames.IconSize(size));
        }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

        ThemeColorRenderer.RenderThemeColor(context, root, IconComponent.ColorProperty);

        _ = RenderProperty<string?>(context, root, IconComponent.IconProperty, (target, value) =>
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                _ = root.Attribute("data-ui-icon");
                _ = target.Class(WebIconClassName.FromIconName(value));
            }
        }, [
            WebDomOperation.Class(converter: WebDomConverters.IconClass),
            WebDomOperation.ToggleAttribute("data-ui-icon", condition: WebValueCondition.HasText)
        ]);
    }
}
