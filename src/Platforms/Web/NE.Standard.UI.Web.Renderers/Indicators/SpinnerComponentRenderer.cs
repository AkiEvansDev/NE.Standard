using System;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Indicators;

public sealed class SpinnerComponentRenderer : WebComponentRendererBase
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string LabelAttribute = "data-ui-spinner-label";

    public override string ComponentTypeKey => SpinnerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-spinner";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Element("span", ring =>
        {
            _ = ring.Class("ui-spinner__ring");

            IconValueRenderer.RenderIconAppearance(context, ring, SpinnerComponent.SizeProperty, SpinnerComponent.ColorProperty);
        });

        _ = root.Element("span", label =>
        {
            _ = label.Class("ui-spinner__label");

            _ = RenderProperty<string?>(context, label, SpinnerComponent.LabelProperty, (target, value) =>
            {
                if (!string.IsNullOrWhiteSpace(value))
                {
                    _ = root.Attribute(LabelAttribute);
                    _ = target.Text(value);
                }
            }, [
                WebDomOperation.Text(),
                WebDomOperation.ToggleAttribute(LabelAttribute, target: "root", condition: WebValueCondition.HasText)
            ]);
        });
    }
}
