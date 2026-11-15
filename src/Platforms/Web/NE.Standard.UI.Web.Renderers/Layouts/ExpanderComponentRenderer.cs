using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>Renders an expander as a native <c>&lt;details&gt;</c>/<c>&lt;summary&gt;</c> pair.</summary>
public sealed class ExpanderComponentRenderer : WebComponentRendererBase
{
    private const string HeaderLineHeightVariable = "--ui-expander-header-line-height";
    private static readonly WebDomOperation[] VariantOperations = [WebDomOperation.Class(converter: WebDomConverters.ExpanderVariantClass)];

    public override string ComponentTypeKey => ExpanderComponent.ComponentTypeKey;

    protected override string ElementName => "details";
    protected override string ClassName => "ui-expander";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SurfaceChromeRenderer.RenderChrome(context, root);

        UIExpanderVariant? renderedVariant = null;
        _ = RenderProperty<UIExpanderVariant?>(context, root, ExpanderComponent.VariantProperty, (target, value) =>
        {
            renderedVariant = value;

            if (value is UIExpanderVariant variant && WebClassNames.ExpanderVariant(variant) is { Length: > 0 } className)
                _ = target.Class(className);
        }, VariantOperations);

        // The compiled default is true, so a plain expander opens; a bound null is closed both here and on the client's toggle.
        RenderFlagAttribute(context, root, ExpanderComponent.ExpandedProperty, "open");

        var hasAction = HasRegion(context, RegionNames.HeaderAction);

        if (hasAction)
        {
            _ = root.Class("ui-expander--has-action");
            RenderHeaderLineHeight(context, root, renderedVariant);
        }

        _ = root.Element("summary", header =>
        {
            _ = header.Class(WebClassNames.ExpanderHeader);

            // A wrapper the region sits in, not the region itself, so laying out this column leaves the text body's grid alone.
            _ = header.Element("div", text =>
            {
                _ = text.Class("ui-expander__header-text");

                RenderRegion(context, text, RegionNames.Header);
            });

            _ = header.Element("span", chevron =>
            {
                _ = chevron.Class("ui-expander__chevron");

                RenderFlagClass(context, chevron, ExpanderComponent.ShowChevronProperty, WebClassNames.Hidden, WebValueCondition.IsFalse);
            });
        });

        if (hasAction)
        {
            _ = root.Element("div", action =>
            {
                _ = action.Class("ui-expander__header-action");

                RenderRegion(context, action, RegionNames.HeaderAction);
            });
        }

        if (HasRegion(context, RegionNames.Content))
        {
            _ = root.Element("div", content =>
            {
                _ = content.Class("ui-expander__content");

                RenderRegion(context, content, RegionNames.Content);
            });
        }
    }

    private static void RenderHeaderLineHeight(WebRenderContext context, IHtmlElementBuilder root, UIExpanderVariant? variant)
    {
        if (!context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out UIComponentSlot? slot, RegionNames.Header) || slot is null)
            return;

        UIComponentNode headerNode = context.ViewResolution.View.Graph.GetRequired(slot.RootComponentId);
        UITextAppearance? appearance = ReadRenderValue<UITextAppearance?>(context.ForNode(headerNode, root), ITextBaseComponent.TitleTypeProperty, null);

        if (HeaderLineHeightCss(appearance, variant) is { Length: > 0 } lineHeight)
            _ = root.Style(HeaderLineHeightVariable, lineHeight);
    }

    private static string? HeaderLineHeightCss(UITextAppearance? appearance, UIExpanderVariant? variant)
    {
        if (appearance is not UITextAppearance value)
            return null;

        if (value.Size is not null)
            return value.LineHeight is double pixels ? WebCssValues.Pixels(pixels) : null;

        UITextType fallbackRole = variant == UIExpanderVariant.Quiet ? UITextType.Caption : UITextType.Title;
        if (value.Role is not UITextType role || role == fallbackRole)
            return null;

        return role switch
        {
            UITextType.Display => "var(--ui-text-display-line-height)",
            UITextType.Title => "var(--ui-text-title-line-height)",
            UITextType.Subtitle => "var(--ui-text-subtitle-line-height)",
            UITextType.Body => "var(--ui-text-body-line-height)",
            UITextType.Caption => "var(--ui-text-caption-line-height)",
            UITextType.Overline => "var(--ui-text-overline-line-height)",
            _ => null
        };
    }
}
