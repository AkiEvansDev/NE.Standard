using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    /// <summary>
    /// Rejects a pane container whose tracks change by width: its panes move between its tracks per breakpoint (UIPaneLayout), which
    /// carries one set of them.
    /// </summary>
    private static void ValidatePaneTracks(IVisualComponent component)
    {
        if (component is PaneContainerComponent panes && !(AllOneValue(panes.Columns) && AllOneValue(panes.Rows)))
            throw new InvalidOperationException($"Pane container '{panes.Id}' has tracks that change by width; its panes move between its tracks per breakpoint, so give each track one definition and place the panes per breakpoint instead.");
    }

    private static bool AllOneValue(IReadOnlyList<UIResponsive<UIGridUnit>> tracks)
    {
        for (var i = 0; i < tracks.Count; i++)
        {
            if (!IsOneValue(tracks[i]))
                return false;
        }

        return true;
    }

    /// <summary>
    /// Rejects a splitter on a track it cannot own — a star track, an edge, a span wider than one track, or a track the container
    /// never defined — at compile time, for every visible breakpoint tier against that tier's resolved orientation and tracks.
    /// </summary>
    private static void ValidateGridSplitter(IGridTracksComponent container, IGridSplitterComponent splitter)
    {
        if (splitter.Placement is not UIResponsive<UIGridPlacement> placement)
            return;

        UIResponsive<UIOrientation> orientation = splitter.Orientation ?? UIOrientation.Vertical;
        UIResponsive<UIVisibility>? visibility = splitter.Visibility;

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (visibility is UIResponsive<UIVisibility> tierVisibility && tierVisibility.Resolve(tier) == UIVisibility.Collapsed)
                continue;

            ValidateGridSplitterTrack(container, splitter, tier, placement.Resolve(tier), orientation.Resolve(tier) == UIOrientation.Vertical);
        }
    }

    private static bool IsOneValue<T>(UIResponsive<T> value)
        where T : struct
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Sm; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (!EqualityComparer<T>.Default.Equals(value.Resolve(tier), value.Base))
                return false;
        }

        return true;
    }

    private static void ValidateGridSplitterTrack(IGridTracksComponent container, IGridSplitterComponent splitter, UIResponsiveTier tier, UIGridPlacement placement, bool vertical)
    {
        IReadOnlyList<UIResponsive<UIGridUnit>> tracks = vertical ? container.Columns : container.Rows;
        var index = vertical ? placement.Column : placement.Row;
        var span = vertical ? placement.ColumnSpan : placement.RowSpan;
        var axis = vertical ? "column" : "row";
        var atTier = tier == UIResponsiveTier.Base ? string.Empty : $" at {tier}";

        if (index < 1 || index > tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in {axis} {index} of '{container.Id}'{atTier}, which defines {tracks.Count} {axis}s.");

        if (span != 1)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' spans {span} {axis}s of '{container.Id}'{atTier}; a splitter occupies a single {axis}.");

        if (tracks[index - 1].Resolve(tier).Unit == UIGridUnitType.Star)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in star {axis} {index} of '{container.Id}'{atTier} and would share the room it divides; give it an Auto or Absolute {axis}.");

        if (index == 1 || index == tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in the {(index == 1 ? "first" : "last")} {axis} of '{container.Id}'{atTier} and has nothing to move on one side.");
    }
}
