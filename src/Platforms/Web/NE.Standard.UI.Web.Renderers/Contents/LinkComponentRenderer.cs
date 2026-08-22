using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
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
            if (!string.IsNullOrWhiteSpace(value))
                _ = target.Attribute("href", value);
        }, [WebDomOperation.Attribute("href")]);

        ThemeColorRenderer.RenderThemeColor(context, root, LinkComponent.TextColorProperty);

        _ = root.Element("span", icon =>
        {
            _ = icon.Class("ui-link__icon");
            _ = icon.Class("ui-icon");

            _ = RenderProperty<UIIconSize?>(context, icon, LinkComponent.IconSizeProperty, static (target, value) =>
            {
                if (value is UIIconSize iconSize)
                    _ = target.Class(WebClassNames.IconSize(iconSize));
            }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

            ThemeColorRenderer.RenderThemeColor(context, icon, LinkComponent.IconColorProperty);

            const string iconAttribute = "data-ui-link-icon";

            _ = RenderProperty<string?>(context, icon, LinkComponent.IconProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = root.Attribute(iconAttribute);
                    _ = target.Class(WebIconClassName.FromIconName(value));
                }
            }, [
                WebDomOperation.Class(converter: WebDomConverters.IconClass),
                WebDomOperation.ToggleAttribute(iconAttribute, target: "root", condition: WebValueCondition.HasText)
            ]);
        });

        _ = root.Element("span", text =>
        {
            _ = text.Class("ui-link__text");

            TextAppearanceRenderer.RenderTextAppearance(context, text, LinkComponent.TextTypeProperty);

            const string textAttribute = "data-ui-link-text";

            _ = RenderProperty<string?>(context, text, LinkComponent.TextProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = root.Attribute(textAttribute);
                    _ = target.Text(value);
                }
            }, [
                WebDomOperation.Text(),
                WebDomOperation.ToggleAttribute(textAttribute, target: "root", condition: WebValueCondition.HasText)
            ]);
        });
    }
}
