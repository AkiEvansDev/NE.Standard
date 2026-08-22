using System;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>
/// One tab: a caption and the page it opens, side by side in the markup and pulled apart by the grid the
/// strip lays out.
/// </summary>
/// <remarks>
/// The caption is a button and the close control is a second button beside it rather than inside it — nesting
/// them is invalid markup, and the close target has to be its own hit area anyway.
/// </remarks>
public sealed class TabItemComponentRenderer : WebComponentRendererBase
{
    private const string CloseClass = "ui-tab-item__close";
    private const string LabelClass = "ui-tab-item__label";
    private const string OrderAttribute = "data-ui-tab-order";
    private const string CaptionAttribute = "data-ui-tab-caption";

    public override string ComponentTypeKey => TabItemComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tab-item";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The order rides on the root as an attribute rather than in a hidden field: the drag writes it there
        // and lets the ordinary two-way path carry it, exactly as the strip does with its selected key.
        _ = RenderProperty<double?>(context, root, TabItemComponent.OrderProperty, static (target, value) =>
        {
            if (value is double order)
                _ = target.Attribute(OrderAttribute, order.ToString(System.Globalization.CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(OrderAttribute, target: "root")]);

        _ = RenderProperty<bool?>(context, root, TabItemComponent.ClosableProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Class("ui-tab-item--fixed");
        }, [WebDomOperation.ToggleClass("ui-tab-item--fixed", condition: WebValueCondition.IsFalse)]);

        _ = root.Element("div", caption =>
        {
            _ = caption.Class("ui-tab-item__caption");

            _ = caption.Element("button", label =>
            {
                _ = label.Class(LabelClass + " ui-button ui-button--ghost");
                _ = label.Attribute("type", "button");
                _ = label.Attribute("role", "tab");

                // The caption's own title binding paints the span; this one exists to be *written* back, so it
                // rides as an attribute a rename can set. On the label rather than on the root because a
                // written value is read from its element without being told which property asked — one
                // element, one writable value, and the root's is already the order.
                _ = RenderProperty<string?>(context, label, TabItemComponent.CaptionTextProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute(CaptionAttribute, value);
                }, [WebDomOperation.Attribute(CaptionAttribute, target: "." + LabelClass)]);

                RenderRegion(context, label, RegionNames.Header);
            });

            _ = caption.Element("button", close =>
            {
                _ = close.Class(CloseClass);
                _ = close.Attribute("type", "button");
                _ = close.Attribute("aria-label", "Close");
                _ = close.Attribute("tabindex", "-1");
            });
        });

        _ = root.Element("div", page =>
        {
            _ = page.Class("ui-tab-item__page");
            _ = page.Attribute("role", "tabpanel");

            RenderRegion(context, page, RegionNames.Content);
        });
    }
}
