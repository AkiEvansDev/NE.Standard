using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A container whose children stand on grid tracks: the column and row definitions a child's placement names.
/// </summary>
public interface IGridTracksComponent : IContainerComponent
{
    /// <summary>
    /// Gets the column definitions, one per grid column, each optionally per breakpoint.
    /// </summary>
    IReadOnlyList<UIResponsive<UIGridUnit>> Columns { get; }

    /// <summary>
    /// Gets the row definitions, in order, each optionally per breakpoint.
    /// </summary>
    IReadOnlyList<UIResponsive<UIGridUnit>> Rows { get; }
}
