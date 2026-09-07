using System;
using System.Globalization;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Navigation;

/// <summary>One tab: a caption and the page it opens, with the close control a sibling button rather than a nested one.</summary>
public sealed class TabItemComponentRenderer : WebComponentRendererBase
{
    private const string CloseClass = "ui-tab-item__close";
    private const string LabelClass = "ui-tab-item__label";

    public override string ComponentTypeKey => TabItemComponent.ComponentTypeKey;

    protected override string ClassName => "ui-tab-item";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        // The order rides on the root as an attribute, so a drag writes it there and the ordinary two-way path carries it.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.TabOrder);
        _ = RenderProperty<double?>(context, root, TabItemComponent.OrderProperty, static (target, value) =>
        {
            if (value is double order)
                _ = target.Attribute(WebAttributes.TabOrder, order.ToString(CultureInfo.InvariantCulture));
        }, [WebDomOperation.Attribute(WebAttributes.TabOrder, target: "root")]);

        // The tab is its own row: the marks the strip reads — no close for an unremovable tab, no drag for an undraggable one — are its.
        ItemAbilitiesRenderer.RenderItemAbilities(context, root);

        _ = root.Element("div", caption =>
        {
            _ = caption.Class("ui-tab-item__caption");

            _ = caption.Element("button", label =>
            {
                _ = label.Class(LabelClass + " ui-button ui-button--ghost");
                _ = label.Attribute("type", "button");
                _ = label.Attribute("role", "tab");

                // On the label, not the root: one element carries one writable value, and the root's is already the order.
                _ = label.Attribute(WebAttributes.ValueKind, WebValueKinds.TabCaption);
                _ = RenderProperty<string?>(context, label, TabItemComponent.RenamedTitleProperty, static (target, value) =>
                {
                    if (!string.IsNullOrWhiteSpace(value))
                        _ = target.Attribute(WebAttributes.TabCaption, value);
                }, [WebDomOperation.Attribute(WebAttributes.TabCaption, target: "." + LabelClass)]);

                RenderRegion(context, label, RegionNames.Header);
            });

            _ = caption.Element("button", close =>
            {
                _ = close.Class(CloseClass);
                _ = close.Attribute("type", "button");
                _ = close.Attribute("aria-label", context.Translate(UIStrings.TabClose));
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
