using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    /// <summary>
    /// Rejects a splitter on a track it can't own — shared star, an edge, or a track the container never defined — at compile
    /// time, for every breakpoint.
    /// </summary>
    private static void ValidateGridSplitter(IGridTracksComponent container, IGridSplitterComponent splitter)
    {
        if (splitter.Placement is not UIResponsive<UIGridPlacement> placement)
            return;

        var vertical = (splitter.Orientation ?? UIOrientation.Vertical) == UIOrientation.Vertical;

        ValidateGridSplitterTrack(container, splitter, placement.Base, vertical);

        if (placement.Sm is UIGridPlacement sm)
            ValidateGridSplitterTrack(container, splitter, sm, vertical);

        if (placement.Md is UIGridPlacement md)
            ValidateGridSplitterTrack(container, splitter, md, vertical);

        if (placement.Xl is UIGridPlacement xl)
            ValidateGridSplitterTrack(container, splitter, xl, vertical);

        if (placement.Xxl is UIGridPlacement xxl)
            ValidateGridSplitterTrack(container, splitter, xxl, vertical);
    }

    private static void ValidateGridSplitterTrack(IGridTracksComponent container, IGridSplitterComponent splitter, UIGridPlacement placement, bool vertical)
    {
        IReadOnlyList<UIGridUnit> tracks = vertical ? container.Columns : container.Rows;
        var index = vertical ? placement.Column : placement.Row;
        var axis = vertical ? "column" : "row";

        if (index < 1 || index > tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in {axis} {index} of '{container.Id}', which defines {tracks.Count} {axis}s.");

        if (tracks[index - 1].Unit == UIGridUnitType.Star)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in star {axis} {index} of '{container.Id}' and would share the room it divides; give it an Auto or Absolute {axis}.");

        if (index == 1 || index == tracks.Count)
            throw new InvalidOperationException($"Grid splitter '{splitter.Id}' sits in the {(index == 1 ? "first" : "last")} {axis} of '{container.Id}' and has nothing to move on one side.");
    }
}
