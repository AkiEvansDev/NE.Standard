using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A container whose children stand on grid tracks: the column and row definitions a child's placement names.
/// </summary>
public interface IGridTracksComponent : IContainerComponent
{
    /// <summary>
    /// Gets the column definitions, one per grid column.
    /// </summary>
    IReadOnlyList<UIGridUnit> Columns { get; }

    /// <summary>
    /// Gets the row definitions, in order.
    /// </summary>
    IReadOnlyList<UIGridUnit> Rows { get; }
}
