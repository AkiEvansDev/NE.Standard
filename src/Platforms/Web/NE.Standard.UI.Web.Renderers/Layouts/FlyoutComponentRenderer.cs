using System;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// Renders a flyout as an anchor/content pair; the placement class only carries the value, and
/// <c>anchored-popup.ts</c> positions and <c>FlyoutInteractionEngine</c> opens it client-side.
/// </summary>
public sealed class FlyoutComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => FlyoutComponent.ComponentTypeKey;

    protected override string ClassName => "ui-flyout";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.FlyoutOpen);
        _ = RenderProperty<bool?>(context, root, FlyoutComponent.IsOpenProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-flyout--open");
        }, [WebDomOperation.ToggleClass("ui-flyout--open")]);

        _ = RenderProperty<UIPopupPlacement?>(context, root, FlyoutComponent.FlyoutPlacementProperty, static (target, value) =>
        {
            if (value is UIPopupPlacement placement)
                _ = target.Class(WebClassNames.FlyoutPlacement(placement));
        }, [WebDomOperation.Class(converter: WebDomConverters.FlyoutPlacementClass)]);

        _ = RenderProperty<bool?>(context, root, FlyoutComponent.CloseOnBackdropProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(WebAttributes.FlyoutNoBackdropClose);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.FlyoutNoBackdropClose, condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, FlyoutComponent.CloseOnEscapeProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(WebAttributes.FlyoutNoEscapeClose);
        }, [WebDomOperation.ToggleAttribute(WebAttributes.FlyoutNoEscapeClose, condition: WebValueCondition.IsFalse)]);

        if (HasRegion(context, RegionNames.Anchor))
        {
            _ = root.Element("div", anchor =>
            {
                _ = anchor.Class("ui-flyout__anchor");

                RenderRegion(context, anchor, RegionNames.Anchor);
            });
        }

        if (HasRegion(context, RegionNames.Content))
        {
            _ = root.Element("div", content =>
            {
                _ = content.Class("ui-flyout__content");
                _ = content.Attribute("role", "dialog");

                // Focusable without being a tab stop, so an opened flyout has somewhere to put focus.
                _ = content.Attribute("tabindex", "-1");

                RenderRegion(context, content, RegionNames.Content);
            });
        }
    }
}
