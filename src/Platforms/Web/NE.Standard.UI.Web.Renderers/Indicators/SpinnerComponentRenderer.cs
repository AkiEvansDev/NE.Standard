using System;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Indicators;

public sealed class SpinnerComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => SpinnerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-spinner";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("span", ring =>
        {
            _ = ring.Class("ui-spinner__ring");

            _ = RenderProperty<UIIconSize?>(context, ring, SpinnerComponent.SizeProperty, static (target, value) =>
            {
                if (value is UIIconSize size)
                    _ = target.Class(WebClassNames.IconSize(size));
            }, [WebDomOperation.Class(converter: WebDomConverters.IconSizeClass)]);

            ThemeColorRenderer.RenderThemeColor(context, ring, SpinnerComponent.ColorProperty);
        });

        _ = root.Element("span", label =>
        {
            _ = label.Class("ui-spinner__label");

            _ = RenderProperty<string?>(context, label, SpinnerComponent.LabelProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = root.Attribute("data-ui-spinner-label");
                    _ = target.Text(value);
                }
            }, [
                WebDomOperation.Text(),
                WebDomOperation.ToggleAttribute("data-ui-spinner-label", target: "root", condition: WebValueCondition.HasText)
            ]);
        });
    }
}
