using System;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// Renders as a native <c>&lt;details&gt;</c>/<c>&lt;summary&gt;</c> pair rather than a custom
/// div+JS accordion: the browser already provides expand/collapse-on-click, keyboard support and a
/// native, non-bubbling <c>toggle</c> event for free, and the client's <c>EventCatalog</c> already
/// registers <c>toggle</c>/<c>expand</c>/<c>collapse</c> as native DOM events (see
/// <c>registerBuiltInEvents</c>) — this renderer is what makes that registration meaningful. Two-way
/// binding for <see cref="ExpanderComponent{T}.Expanded"/> reuses the same generic
/// <c>data-ui-bind-*</c>/<c>ValueBindingEngine</c> path every other two-way property uses, keyed off this
/// property's own <c>data-ui-bind-expanded</c> attribute (see <c>RenderProperty</c>'s generic binding-attr
/// naming) rather than the <c>data-ui-bind-value</c> literal a <c>Value</c> property gets; the engine
/// bridges the native <c>toggle</c> event into that path since <c>&lt;details&gt;</c> has no native
/// <c>change</c> event.
/// </summary>
public sealed class ExpanderComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => ExpanderComponent.ComponentTypeKey;

    protected override string ElementName => "details";
    protected override string ClassName => "ui-expander";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        ResponsiveRenderer.ApplyResponsiveThickness(context, root, ExpanderComponent.PaddingProperty, "--ui-padding");

        _ = RenderProperty<UIThemeColor?>(context, root, ExpanderComponent.BackgroundProperty, static (target, value) =>
        {
            if (value is UIThemeColor background && WebCssValues.ThemeColor(background) is { Length: > 0 } css)
                _ = target.Style("background", css);
        }, [WebDomOperation.Style("background", converter: WebDomConverters.ThemeColorCss)]);

        BorderStyleRenderer.RenderBorderStyle(context, root);

        _ = RenderProperty<bool?>(context, root, ExpanderComponent.ExpandedProperty, static (target, value) =>
        {
            if (value != false)
                _ = target.Attribute("open");
        }, [WebDomOperation.ToggleAttribute("open", condition: WebValueCondition.IsTrue)]);

        _ = root.Element("summary", header =>
        {
            _ = header.Class("ui-expander__header");

            RenderRegion(context, header, RegionNames.Header);
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
