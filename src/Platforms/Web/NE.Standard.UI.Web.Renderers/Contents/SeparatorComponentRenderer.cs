using System;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class SeparatorComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => SeparatorComponent.ComponentTypeKey;

    protected override string ClassName => "ui-separator";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<UIOrientation?>(context, root, SeparatorComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)]);

        // The rule is an inner __line, not a border on the root, so a label can interrupt it rather than float over it.
        _ = root.Element("span", line =>
        {
            _ = line.Class("ui-separator__line");

            ThemeColorRenderer.RenderThemeColor(context, line, SeparatorComponent.ColorProperty);

            // Always emitted, empty or not: a live Label patch is then a text write and an attribute toggle,
            // never an element add or remove.
            IHtmlElementBuilder? label = null;

            _ = line.Element("span", span =>
            {
                _ = span.Class("ui-separator__label");
                label = span;
            });

            _ = RenderProperty<string?>(context, line, SeparatorComponent.LabelProperty, (target, value) =>
            {
                var labelText = value ?? string.Empty;

                if (!string.IsNullOrWhiteSpace(labelText))
                    _ = target.Attribute("data-ui-separator-label");

                _ = label!.Text(labelText);
            }, [
                WebDomOperation.Text(target: ".ui-separator__label"),
                WebDomOperation.ToggleAttribute("data-ui-separator-label", condition: WebValueCondition.HasText)
            ]);
        });
    }
}
