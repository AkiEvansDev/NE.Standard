using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>Renders an expander as a native <c>&lt;details&gt;</c>/<c>&lt;summary&gt;</c> pair.</summary>
public sealed class ExpanderComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => ExpanderComponent.ComponentTypeKey;

    protected override string ElementName => "details";
    protected override string ClassName => "ui-expander";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        SurfaceChromeRenderer.RenderChrome(context, root);

        // The compiled default is true, so a plain expander opens; a bound null is closed both here and on the client's toggle.
        RenderFlagAttribute(context, root, ExpanderComponent.ExpandedProperty, "open");

        _ = root.Element("summary", header =>
        {
            _ = header.Class("ui-expander__header");

            // A wrapper the region sits in, not the region itself, so laying out this column leaves the text body's grid alone.
            _ = header.Element("div", text =>
            {
                _ = text.Class("ui-expander__header-text");

                RenderRegion(context, text, RegionNames.Header);
            });

            _ = header.Element("span", chevron =>
            {
                _ = chevron.Class("ui-expander__chevron");

                _ = RenderProperty<bool?>(context, chevron, ExpanderComponent.ShowChevronProperty, static (target, value) =>
                {
                    if (value == false)
                        _ = target.Class("ui-hidden");
                }, [WebDomOperation.ToggleClass("ui-hidden", condition: WebValueCondition.IsFalse)]);
            });
        });

        if (HasRegion(context, RegionNames.Content))
        {
            _ = root.Element("div", content =>
            {
                _ = content.Class("ui-expander__content");

                RenderRegion(context, content, RegionNames.Content);
            });
        }
    }
}
