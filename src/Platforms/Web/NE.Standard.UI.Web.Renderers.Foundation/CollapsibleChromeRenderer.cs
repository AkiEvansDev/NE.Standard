using System;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;

namespace NE.Standard.UI.Web.Renderers.Foundation;

/// <summary>The chrome every collapsible control shares: its class, the edge it folds toward, the collapsed state and the toggle.</summary>
public static class CollapsibleChromeRenderer
{
    /// <summary>The class the shared stylesheet rules and <c>collapsible-engine.ts</c> key on.</summary>
    public const string RootClassName = "ui-collapsible";

    /// <summary>The class on what the fold closes, which the engine slides shut and open.</summary>
    public const string ContentClassName = "ui-collapsible__content";

    private const string ToggleClassName = "ui-collapsible__toggle";
    private const string BarClassName = "ui-collapsible__bar";
    private const string BarContentClassName = "ui-collapsible__bar-content";
    private const string CollapsedAttribute = WebAttributes.Collapsed;
    private const string ToggleAttribute = WebAttributes.CollapseToggle;

    public static void RenderCollapsible(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class(RootClassName);

        // Render-time only: which edge a panel is on is how the page is laid out.
        _ = WebComponentRendererBase.ResolveRenderValue(context, ICollapsibleComponent.SideProperty, out UISide? side, out _);
        _ = root.Class(WebClassNames.Side(side ?? UISide.Left));

        // An attribute rather than a modifier class, so the client's toggle and a bound value write the same spelling.
        _ = WebComponentRendererBase.RenderProperty<bool?>(context, root, ICollapsibleComponent.ExpandedProperty, static (target, value) =>
        {
            if (value == false)
                _ = target.Attribute(CollapsedAttribute);
        }, [WebDomOperation.ToggleAttribute(CollapsedAttribute, condition: WebValueCondition.IsFalse)]);

        _ = WebComponentRendererBase.ResolveRenderValue(context, ICollapsibleComponent.ShowCollapseToggleProperty, out bool? show, out _);

        // With content of its own beside it, the toggle stands in a row with that content; without, it is the root's own child, as ever.
        if (!context.ViewResolution.View.Graph.TryGetSlot(context.Node.ComponentId, UIComponentSlotKind.Region, out _, RegionNames.ToggleContent))
        {
            if (show == true)
                RenderToggle(context, root);

            return;
        }

        _ = root.Element("div", bar =>
        {
            _ = bar.Class(BarClassName);
            _ = bar.Element("div", content =>
            {
                _ = content.Class(BarContentClassName);
                WebComponentRendererBase.RenderRegion(context, content, RegionNames.ToggleContent);
            });

            if (show == true)
                RenderToggle(context, bar);
        });
    }

    /// <summary>Renders the collapse toggle; its burger is drawn in CSS, as a host need install no icon pack.</summary>
    private static void RenderToggle(WebRenderContext context, IHtmlElementBuilder parent)
    {
        _ = WebComponentRendererBase.ResolveRenderValue(context, ICollapsibleComponent.ExpandedProperty, out bool? expanded, out _);

        _ = parent.Element("button", toggle =>
        {
            _ = toggle.Class(ToggleClassName);
            _ = toggle.Attribute("type", "button");
            _ = toggle.Attribute(ToggleAttribute);
            _ = toggle.Attribute("aria-expanded", expanded == false ? "false" : "true");
            // Drawn in CSS, so the button has no text of its own to be read out.
            _ = toggle.Attribute("aria-label", context.Translate(UIStrings.CollapseToggle));
        });
    }
}
