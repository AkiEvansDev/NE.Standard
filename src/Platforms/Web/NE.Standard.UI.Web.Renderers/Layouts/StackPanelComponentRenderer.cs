using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class StackPanelComponentRenderer : WebComponentRendererBase
{
    private static readonly WebDomOperation[] OrientationOperations = [WebDomOperation.Class(converter: WebDomConverters.OrientationClass)];

    public override string ComponentTypeKey => StackPanelComponent.ComponentTypeKey;

    protected override string ClassName => "ui-stack-panel";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        _ = RenderProperty<UIOrientation?>(context, root, IOrientationComponent.OrientationProperty, static (target, value) =>
        {
            if (value is UIOrientation orientation)
                _ = target.Class(WebClassNames.Orientation(orientation));
        }, OrientationOperations);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ISpacingComponent.SpacingProperty, "--ui-stack-panel-spacing");

        RenderFlagClass(context, root, StackPanelComponent.WrapProperty, "ui-stack-panel--wrap");

        RenderChildren(context, root);
    }
}
