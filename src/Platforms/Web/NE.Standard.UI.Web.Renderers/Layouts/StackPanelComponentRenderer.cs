using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

public sealed class StackPanelComponentRenderer : WebComponentRendererBase
{
    // Render-time only, its tiers fitted on the client as a size's are: the panel has no size of its own on the attribute.
    private static readonly TierClassFamily<UIButtonSize> LineOnFamily = new(WebAttributes.TierSize, FirstLineOnControlClassName);

    public override string ComponentTypeKey => StackPanelComponent.ComponentTypeKey;

    protected override string ClassName => "ui-stack-panel";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ContainerStyleRenderer.RenderContainerStyle(context, root);

        OrientationStyleRenderer.RenderOrientation(context, root, IOrientationComponent.OrientationProperty);

        ResponsiveRenderer.ApplyResponsiveSpacing(context, root, ISpacingComponent.SpacingProperty, "--ui-stack-panel-spacing");

        RenderFlagClass(context, root, StackPanelComponent.WrapProperty, "ui-stack-panel--wrap");

        // A first child standing in a field's caption row (ui-stack-panel.less): a label over a control, level with the boxes beside it.
        RenderFlagClass(context, root, StackPanelComponent.FirstChildAsCaptionProperty, "ui-stack-panel--caption-first");

        // The edge an icon button at its end hangs past (ui-button.less).
        var glyphEdge = ReadRenderValue<UIAlignment?>(context, StackPanelComponent.GlyphEdgeProperty, null) switch
        {
            UIAlignment.Start => "ui-stack-panel--glyph-start",
            UIAlignment.End => "ui-stack-panel--glyph-end",
            _ => null
        };

        if (glyphEdge is not null)
            _ = root.Class(glyphEdge);

        // The button size whose middle the first child's first line stands on (ui-stack-panel.less).
        TierClassRenderer.Write(root, ReadRenderValue<UIResponsive<UIButtonSize>?>(context, StackPanelComponent.FirstLineOnControlProperty, null), LineOnFamily);

        RenderChildren(context, root);
    }

    private static string FirstLineOnControlClassName(UIButtonSize size)
        => size switch
        {
            UIButtonSize.Small => "ui-stack-panel--line-on-small",
            UIButtonSize.Large => "ui-stack-panel--line-on-large",
            _ => "ui-stack-panel--line-on-medium"
        };
}
