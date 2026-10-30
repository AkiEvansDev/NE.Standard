using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Contents;

public sealed class SeparatorComponentRenderer : WebComponentRendererBase
{
    // Read by the stylesheet alone, so a named constant here rather than one in WebAttributes, which holds what the client script reads.
    private const string TitleAttribute = "data-ui-separator-title";

    private static readonly WebDomOperation[] TitleOperations =
    [
        WebDomOperation.Text(target: ".ui-separator__title"),
        WebDomOperation.ToggleAttribute(TitleAttribute, condition: WebValueCondition.HasText)
    ];

    public override string ComponentTypeKey => SeparatorComponent.ComponentTypeKey;

    protected override string ClassName => "ui-separator";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        OrientationStyleRenderer.RenderOrientation(context, root, IOrientationComponent.OrientationProperty);

        // The rule is an inner __line, not a border on the root, so a title can interrupt it rather than float over it.
        _ = root.Element("span", line =>
        {
            _ = line.Class("ui-separator__line");

            ThemeColorRenderer.RenderThemeColor(context, line, SeparatorComponent.ColorProperty);

            // Always emitted, empty or not: a live Title patch is then a text write and an attribute toggle,
            // never an element add or remove.
            IHtmlElementBuilder? title = null;

            _ = line.Element("span", span =>
            {
                _ = span.Class("ui-separator__title");
                title = span;
            });

            _ = RenderProperty<string?>(context, line, SeparatorComponent.TitleProperty, (target, value) =>
            {
                var titleText = value ?? string.Empty;

                if (!string.IsNullOrWhiteSpace(titleText))
                {
                    _ = target.Attribute(TitleAttribute);
                    _ = title!.Text(titleText);
                }
            }, TitleOperations);
        });
    }
}
