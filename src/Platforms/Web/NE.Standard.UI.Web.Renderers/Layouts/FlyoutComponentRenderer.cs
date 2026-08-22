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
/// Renders as an anchor/content pair. The twelve <c>ui-flyout--&lt;placement&gt;</c> modifier classes only
/// <em>carry</em> <c>FlyoutPlacement</c>; they do not position anything. <c>anchored-popup.ts</c> places the
/// content client-side, and <c>FlyoutInteractionEngine</c> reads the class through a <c>MutationObserver</c>,
/// so a live placement patch re-places an already-open flyout with no server-side work.
/// <c>FlyoutInteractionEngine</c> also owns opening/closing: a click
/// on <c>.ui-flyout__anchor</c> toggles the <c>ui-flyout--open</c> class locally and fires synthetic
/// "toggle"/"open"/"close" DOM events (already registered native event names, see
/// <c>extensions/events.ts</c>'s <c>registerBuiltInEvents</c>) that flow through the ordinary
/// <c>EventPipeline</c> exactly like any other native event — the same "dispatch a real DOM event, let
/// the pipeline pick it up" trick <c>ExpanderComponentRenderer</c>'s native <c>&lt;details&gt;</c> toggle
/// relies on, just synthesized here since a plain <c>div</c>-based flyout has no native equivalent.
/// <see cref="FlyoutComponent{T}.IsOpen"/> is two-way bound: the ordinary <c>RenderProperty</c>/
/// <c>ToggleClass</c> pipeline below still pushes server-driven changes one-way, but a client-initiated
/// toggle *also* syncs the value back through <c>ValueBindingEngine</c>'s <c>data-ui-bind-is-open</c>/
/// "toggle" handling — the same generic path a two-way-bound <c>Value</c> uses on "change", just keyed off
/// this property's own binding attribute since <see cref="FlyoutComponent{T}"/> isn't shaped like an
/// <see cref="Authoring.Components.IInputComponent"/>. The Toggle/Open/Close command events remain
/// independent of that sync (see <c>ValueBindingEngine</c>'s own doc comment) — a component can have both
/// a bound value and a command wired to the same interaction without conflict.
/// </summary>
public sealed class FlyoutComponentRenderer : WebComponentRendererBase
{
    public override string ComponentTypeKey => FlyoutComponent.ComponentTypeKey;

    protected override string ClassName => "ui-flyout";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = RenderProperty<bool?>(context, root, FlyoutComponent.IsOpenProperty, static (target, value) =>
        {
            if (value == true)
                _ = target.Class("ui-flyout--open");
        }, [WebDomOperation.ToggleClass("ui-flyout--open")]);

        _ = RenderProperty<UIFlyoutPlacement?>(context, root, FlyoutComponent.FlyoutPlacementProperty, static (target, value) =>
        {
            if (value is UIFlyoutPlacement placement)
                _ = target.Class(WebClassNames.FlyoutPlacement(placement));
        }, [WebDomOperation.Class(converter: WebDomConverters.FlyoutPlacementClass)]);

        _ = RenderProperty<bool?>(context, root, FlyoutComponent.CloseOnBackdropProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute("data-ui-flyout-no-backdrop-close");
        }, [WebDomOperation.ToggleAttribute("data-ui-flyout-no-backdrop-close", condition: WebValueCondition.IsFalse)]);

        _ = RenderProperty<bool?>(context, root, FlyoutComponent.CloseOnEscapeProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute("data-ui-flyout-no-escape-close");
        }, [WebDomOperation.ToggleAttribute("data-ui-flyout-no-escape-close", condition: WebValueCondition.IsFalse)]);

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

                RenderRegion(context, content, RegionNames.Content);
            });
        }
    }
}
