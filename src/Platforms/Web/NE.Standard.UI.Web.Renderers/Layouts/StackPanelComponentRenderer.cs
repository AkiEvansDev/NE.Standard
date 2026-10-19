using System;
using NE.Standard.UI.Abstractions.Styling;
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

    private const string FieldAlignedClassName = "ui-stack-panel--field-aligned";
    private const string FieldAlignedVariable = "--ui-field-aligned";
    private const string FieldAlignedBoxVariable = "--ui-field-aligned-box";

    private static readonly Func<UIFieldBoxAlignment, string> FieldAlignedFormatter = static boxes => boxes == UIFieldBoxAlignment.None ? "0" : "1";
    private static readonly Func<UIFieldBoxAlignment, string> FieldAlignedBoxFormatter = static boxes => boxes switch
    {
        UIFieldBoxAlignment.Small => "var(--ui-field-box-small)",
        UIFieldBoxAlignment.Medium => "var(--ui-field-box-medium)",
        UIFieldBoxAlignment.Large => "var(--ui-field-box-large)",
        _ => "0px"
    };

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
        if (ReadRenderValue<UIButtonSize?>(context, StackPanelComponent.FirstLineOnControlProperty, null) is UIButtonSize lineOn)
            _ = root.Class(FirstLineOnControlClassName(lineOn));

        // Each tier's caption line (0 or 1) and the box it centres on, read by ui-stack-panel.less on the class that fences them.
        if (ReadRenderValue<UIResponsive<UIFieldBoxAlignment>?>(context, StackPanelComponent.AlignWithFieldBoxesProperty, null) is UIResponsive<UIFieldBoxAlignment> boxes)
        {
            _ = root.Class(FieldAlignedClassName);
            WebResponsiveCss.WriteTiers(root, boxes, FieldAlignedVariable, FieldAlignedFormatter);
            WebResponsiveCss.WriteTiers(root, boxes, FieldAlignedBoxVariable, FieldAlignedBoxFormatter);
        }

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
