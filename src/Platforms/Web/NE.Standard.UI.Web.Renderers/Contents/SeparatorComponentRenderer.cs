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

        // The rule is drawn on an inner __line rather than as a border on the root, so a label can sit inside
        // it and interrupt the line instead of floating over it.
        _ = root.Element("span", line =>
        {
            _ = line.Class("ui-separator__line");

            ThemeColorRenderer.RenderThemeColor(context, line, SeparatorComponent.ColorProperty);

            // The label element is always emitted, empty or not, and a presence attribute on the line decides
            // whether the rule is interrupted for it. A live Label patch is then a text write plus an
            // attribute toggle — no DOM operation adds or removes whole elements.
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
