using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
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
    /// Rejects a splitter on a track it can't own — shared star, an edge, or a track the container never defined — at compile
    /// time, for every breakpoint, and one dividing another axis at another width: the tracks it moves are one axis's.
    /// </summary>
    private static void ValidateGridSplitter(IGridTracksComponent container, IGridSplitterComponent splitter)
    {
        if (splitter.Orientation is UIResponsive<UIOrientation> orientation && !IsOneValue(orientation))
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' divides another axis at another width; a splitter moves one axis's tracks at every width, so give it one orientation.");

        if (splitter.Placement is not UIResponsive<UIGridPlacement> placement)
            return;

        var vertical = (splitter.Orientation?.Base ?? UIOrientation.Vertical) == UIOrientation.Vertical;

        if (!AllOneValue(vertical ? container.Columns : container.Rows))
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' divides the {(vertical ? "columns" : "rows")} of '{container.Id}', which change by width; a splitter moves one set of tracks, so give them one definition at every width.");

        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (placement.Get(tier) is UIGridPlacement tierPlacement)
                ValidateGridSplitterTrack(container, splitter, tierPlacement, vertical);
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

    private static void ValidateGridSplitterTrack(IGridTracksComponent container, IGridSplitterComponent splitter, UIGridPlacement placement, bool vertical)
    {
        IReadOnlyList<UIResponsive<UIGridUnit>> tracks = vertical ? container.Columns : container.Rows;
        var index = vertical ? placement.Column : placement.Row;
        var axis = vertical ? "column" : "row";

        if (index < 1 || index > tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in {axis} {index} of '{container.Id}', which defines {tracks.Count} {axis}s.");

        if (tracks[index - 1].Base.Unit == UIGridUnitType.Star)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in star {axis} {index} of '{container.Id}' and would share the room it divides; give it an Auto or Absolute {axis}.");

        if (index == 1 || index == tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in the {(index == 1 ? "first" : "last")} {axis} of '{container.Id}' and has nothing to move on one side.");
    }
}
