using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.Json;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Web.Abstractions.Html;
using NE.Standard.UI.Web.Abstractions.Rendering;
using NE.Standard.UI.Web.Abstractions.Theming;
using NE.Standard.UI.Web.Renderers.Foundation;

namespace NE.Standard.UI.Web.Renderers.Layouts;

/// <summary>
/// A container that draws a place per pane, at the cells the pane was added at, and each pane in the place its layout gives it, under
/// a grip; <c>pane-container-engine.ts</c> carries a pane to another place and the one standing there back to its own. Where a pane
/// keeps its size, the places and the tracks stand as <see cref="UIPaneLayout.Arrange"/> lays them, so the first paint is the moved one.
/// </summary>
public sealed class PaneContainerComponentRenderer : WebComponentRendererBase
{
    public const string PlaceClassName = "ui-pane-container__place";
    public const string PaneClassName = "ui-pane-container__pane";
    public const string GripClassName = "ui-pane-container__grip";

    /// <summary>The tracks in the order panes that keep their sizes lay them in, per tier, under a splitter's own in the stylesheet's chain.</summary>
    public const string PaneColumnsVariable = "--ui-pane-columns";
    public const string PaneRowsVariable = "--ui-pane-rows";

    private static readonly UIResponsiveTier[] Tiers = [UIResponsiveTier.Base, UIResponsiveTier.Sm, UIResponsiveTier.Md, UIResponsiveTier.Xl, UIResponsiveTier.Xxl];

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
            UIGridPlacement[][]? cells = KeepsAnySize(places) ? RenderCarriedTracks(context, root, places, panes) : null;

            for (var i = 0; i < places.Count; i++)
                RenderPlace(context, root, places[i], panes[i], KeepsSize(places, panes[i]), cells?[i]);
        }

        RenderChildren(context, root);
    }

    private static bool KeepsAnySize(IReadOnlyList<UIPanePlace> places)
    {
        foreach (UIPanePlace place in places)
        {
            if (place.KeepsSize)
                return true;
        }

        return false;
    }

    private static bool KeepsSize(IReadOnlyList<UIPanePlace> places, string pane)
    {
        foreach (UIPanePlace place in places)
        {
            if (place.Name == pane)
                return place.KeepsSize;
        }

        return false;
    }

    /// <summary>
    /// The tracks a pane may carry its own along (the axes no splitter sizes), for the engine to lay again after a move, and their order
    /// for the layout drawn now, per tier; answers each place's cells per tier.
    /// </summary>
    private static UIGridPlacement[][] RenderCarriedTracks(WebRenderContext context, IHtmlElementBuilder root, IReadOnlyList<UIPanePlace> places, string[] panes)
    {
        // The base tier's tracks: the panes move between them per tier, so the compiler refuses tracks that change by width here.
        _ = ResolveRenderValue(context, ContainerComponent.ColumnsProperty, out IReadOnlyList<UIResponsive<UIGridUnit>>? columnTracks, out _);
        _ = ResolveRenderValue(context, ContainerComponent.RowsProperty, out IReadOnlyList<UIResponsive<UIGridUnit>>? rowTracks, out _);
        UIGridUnit[]? columns = columnTracks is null ? null : ContainerComponentRenderer.AtTier(columnTracks, UIResponsiveTier.Base);
        UIGridUnit[]? rows = rowTracks is null ? null : ContainerComponentRenderer.AtTier(rowTracks, UIResponsiveTier.Base);

        (var columnsSplit, var rowsSplit) = SplitAxes(context, root);
        var columnsCarry = !columnsSplit && columns is { Length: > 0 };
        var rowsCarry = !rowsSplit && rows is { Length: > 0 };
        UIGridPlacement[][] cells = new UIGridPlacement[places.Count][];
        IReadOnlyList<int>?[] columnOrders = new IReadOnlyList<int>?[Tiers.Length];
        IReadOnlyList<int>?[] rowOrders = new IReadOnlyList<int>?[Tiers.Length];

        for (var i = 0; i < places.Count; i++)
            cells[i] = new UIGridPlacement[Tiers.Length];

        foreach (UIResponsiveTier tier in Tiers)
        {
            UIPaneArrangement arrangement = UIPaneLayout.Arrange(places, panes, tier, columns?.Length ?? 0, rows?.Length ?? 0, columnsCarry, rowsCarry);

            for (var i = 0; i < places.Count; i++)
                cells[i][(int)tier] = arrangement.Cells[i];

            columnOrders[(int)tier] = arrangement.ColumnOrder;
            rowOrders[(int)tier] = arrangement.RowOrder;
        }

        if (columnsCarry)
            RenderTrackOrder(root, columns!, columnOrders, WebAttributes.PaneColumns, PaneColumnsVariable);

        if (rowsCarry)
            RenderTrackOrder(root, rows!, rowOrders, WebAttributes.PaneRows, PaneRowsVariable);

        return cells;
    }

    /// <summary>Whether a splitter of the container sizes its columns, its rows: there the places keep their sizes whatever stands in them.</summary>
    private static (bool Columns, bool Rows) SplitAxes(WebRenderContext context, IHtmlElementBuilder root)
    {
        var columns = false;
        var rows = false;

        foreach (UIComponentId child in context.ViewResolution.View.Graph.GetChildren(context.Node.ComponentId))
        {
            UIComponentNode node = context.ViewResolution.View.Graph.GetRequired(child);

            if (node.TypeKey != GridSplitterComponent.ComponentTypeKey)
                continue;

            _ = ResolveRenderValue(context.ForNode(node, root), IOrientationComponent.OrientationProperty, out UIResponsive<UIOrientation>? orientation, out _);

            if ((orientation?.Base ?? UIOrientation.Vertical) == UIOrientation.Vertical)
                columns = true;
            else
                rows = true;
        }

        return (columns, rows);
    }

    /// <summary>
    /// The authored tracks as CSS for the engine, and, where a tier lays them in another order, every tier's order: a tier left unwritten
    /// would read a narrower one's in the stylesheet's chain.
    /// </summary>
    private static void RenderTrackOrder(IHtmlElementBuilder root, UIGridUnit[] units, IReadOnlyList<int>?[] orders, string attribute, string variable)
    {
        var tracks = new string[units.Length];

        for (var i = 0; i < units.Length; i++)
            tracks[i] = WebCssValues.GridUnit(units[i]);

        _ = root.Attribute(attribute, JsonSerializer.Serialize(tracks));

        if (Array.TrueForAll(orders, static order => order is null))
            return;

        foreach (UIResponsiveTier tier in Tiers)
        {
            IReadOnlyList<int>? order = orders[(int)tier];
            UIGridUnit[] ordered = new UIGridUnit[units.Length];

            for (var i = 0; i < ordered.Length; i++)
                ordered[i] = units[order?[i] ?? i];

            _ = root.Style(WebResponsiveCss.TierName(variable, tier), ContainerComponentRenderer.ToCssGridTemplate(ordered));
        }
    }

    /// <summary>A place at its cells, and in it the pane the layout puts there, its grip first so it leads the pane's tab order.</summary>
    private static void RenderPlace(WebRenderContext context, IHtmlElementBuilder root, UIPanePlace place, string pane, bool keepsSize, UIGridPlacement[]? cells)
        => _ = root.Element("div", slot =>
        {
            _ = slot.Class(PlaceClassName);
            _ = slot.Attribute(WebAttributes.PanePlace, place.Name);

            if (cells is null)
            {
                RenderCells(slot, place.Placement);
            }
            else
            {
                // Every tier, as the engine writes them after a move: the cells this layout lays the place at, and the ones it was added at.
                RenderCells(slot, UIResponsive<UIGridPlacement>.Create(cells[0], cells[1], cells[2], cells[3], cells[4]));
                _ = slot.Attribute(WebAttributes.PaneCells, JsonSerializer.Serialize(AuthoredCells(place.Placement)));
            }

            _ = slot.Element("div", element =>
            {
                _ = element.Class(PaneClassName);
                _ = element.Attribute(WebAttributes.Pane, pane);

                if (keepsSize)
                    _ = element.Attribute(WebAttributes.PaneKeepsSize);

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

    private static void RenderCells(IHtmlElementBuilder slot, UIResponsive<UIGridPlacement> cells)
    {
        WebResponsiveCss.WriteTiers(slot, cells, WebResponsiveCss.PlacementColumnVariable, static cell => cell.Column.ToString(CultureInfo.InvariantCulture));
        WebResponsiveCss.WriteTiers(slot, cells, WebResponsiveCss.PlacementRowVariable, static cell => cell.Row.ToString(CultureInfo.InvariantCulture));
        WebResponsiveCss.WriteTiers(slot, cells, WebResponsiveCss.PlacementColumnSpanVariable, static cell => cell.ColumnSpan.ToString(CultureInfo.InvariantCulture));
        WebResponsiveCss.WriteTiers(slot, cells, WebResponsiveCss.PlacementRowSpanVariable, static cell => cell.RowSpan.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>The cells a place was added at, per tier, as <c>[column, row, columnSpan, rowSpan]</c>, null where a tier sets none.</summary>
    private static int[]?[] AuthoredCells(UIResponsive<UIGridPlacement> placement)
    {
        var tiers = new int[]?[Tiers.Length];

        foreach (UIResponsiveTier tier in Tiers)
        {
            if (placement.Get(tier) is UIGridPlacement cell)
                tiers[(int)tier] = [cell.Column, cell.Row, cell.ColumnSpan, cell.RowSpan];
        }

        return tiers;
    }
}
