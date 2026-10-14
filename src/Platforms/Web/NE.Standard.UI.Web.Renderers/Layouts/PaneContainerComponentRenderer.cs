using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// A container that draws a place per pane, at the cells the pane was added at, and each pane in the place its layout gives it, under
/// a grip; <c>pane-container-engine.ts</c> carries a pane to another place and the one standing there back to its own.
/// </summary>
public sealed class PaneContainerComponentRenderer : WebComponentRendererBase
{
    public const string PlaceClassName = "ui-pane-container__place";
    public const string PaneClassName = "ui-pane-container__pane";
    public const string GripClassName = "ui-pane-container__grip";

    public override string ComponentTypeKey => PaneContainerComponent.ComponentTypeKey;

    protected override string ClassName => "ui-container";

    protected override void RenderComponent(WebRenderContext context, IHtmlElementBuilder root)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(root);

        _ = root.Class("ui-pane-container");

        ContainerStyleRenderer.RenderContainerStyle(context, root);
        ContainerComponentRenderer.RenderTracks(context, root, ContainerComponent.ColumnsProperty, ContainerComponentRenderer.ColumnsVariable, WebAttributes.ColumnLimits);
        ContainerComponentRenderer.RenderTracks(context, root, ContainerComponent.RowsProperty, ContainerComponentRenderer.RowsVariable, WebAttributes.RowLimits);
        ContainerComponentRenderer.RenderSpacing(context, root);

        // Bound, the layout comes back through the value engine, which reads it off the root; the value as the controller wrote it,
        // since a push writes it so and the engine resolves it as the places below were.
        _ = root.Attribute(WebAttributes.ValueKind, WebValueKinds.PaneLayout);
        _ = RenderProperty<string?>(context, root, PaneContainerComponent.LayoutProperty, static (target, value) =>
        {
            if (value is not null)
                _ = target.Attribute(WebAttributes.PaneLayout, value);
        }, [WebDomOperation.Attribute(WebAttributes.PaneLayout)]);

        _ = ResolveRenderValue(context, PaneContainerComponent.PlacesProperty, out IReadOnlyList<UIPanePlace>? places, out _);
        _ = ResolveRenderValue(context, PaneContainerComponent.LayoutProperty, out string? layout, out _);

        if (places is { Count: > 0 })
        {
            var panes = UIPaneLayout.Resolve(places, layout);

            for (var i = 0; i < places.Count; i++)
                RenderPlace(context, root, places[i], panes[i]);
        }

        RenderChildren(context, root);
    }

    /// <summary>A place at its cells, and in it the pane the layout puts there, its grip first so it leads the pane's tab order.</summary>
    private static void RenderPlace(WebRenderContext context, IHtmlElementBuilder root, UIPanePlace place, string pane)
        => _ = root.Element("div", slot =>
        {
            _ = slot.Class(PlaceClassName);
            _ = slot.Attribute(WebAttributes.PanePlace, place.Name);
            WebResponsiveCss.WriteTiers(slot, place.Placement, WebResponsiveCss.PlacementColumnVariable, static cell => cell.Column.ToString(CultureInfo.InvariantCulture));
            WebResponsiveCss.WriteTiers(slot, place.Placement, WebResponsiveCss.PlacementRowVariable, static cell => cell.Row.ToString(CultureInfo.InvariantCulture));
            WebResponsiveCss.WriteTiers(slot, place.Placement, WebResponsiveCss.PlacementColumnSpanVariable, static cell => cell.ColumnSpan.ToString(CultureInfo.InvariantCulture));
            WebResponsiveCss.WriteTiers(slot, place.Placement, WebResponsiveCss.PlacementRowSpanVariable, static cell => cell.RowSpan.ToString(CultureInfo.InvariantCulture));

            _ = slot.Element("div", element =>
            {
                _ = element.Class(PaneClassName);
                _ = element.Attribute(WebAttributes.Pane, pane);

                _ = element.Element("button", grip =>
                {
                    _ = grip.Class(GripClassName);
                    _ = grip.Attribute("type", "button");
                    // Pressed while the keyboard holds the pane up (pane-container-engine.ts), which also names it after the pane's title.
                    _ = grip.Attribute("aria-pressed", "false");
                    WebWords.Write(context, grip, "aria-label", UIStrings.PaneMove);
                });

                RenderRegion(context, element, pane);
            });
        });
}
