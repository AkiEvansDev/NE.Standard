using System;
using System.Collections.Generic;

namespace NE.Standard.UI.Compiled.Items;

/// <summary>
/// Represents compiled filtering and sorting rules for an items view.
/// </summary>
public sealed class CompiledUIItemsView
{
    /// <summary>
    /// Creates a compiled items view from its filters and sort rules.
    /// </summary>
    public CompiledUIItemsView(IReadOnlyList<CompiledUIItemsFilter>? filters = null, IReadOnlyList<CompiledUIItemsSort>? sorts = null)
    {
        Filters = filters is null || filters.Count == 0
            ? []
            : [.. filters];

        Sorts = sorts is null || sorts.Count == 0
            ? []
            : [.. sorts];

        for (var i = 0; i < Filters.Length; i++)
            ArgumentNullException.ThrowIfNull(Filters[i]);

        for (var i = 0; i < Sorts.Length; i++)
            ArgumentNullException.ThrowIfNull(Sorts[i]);
    }

    /// <summary>
    /// Gets the compiled filters.
    /// </summary>
    public CompiledUIItemsFilter[] Filters { get; }

    /// <summary>
    /// Gets the compiled sort rules.
    /// </summary>
    public CompiledUIItemsSort[] Sorts { get; }

    /// <summary>
    /// Gets whether the view has no filters or sort rules.
    /// </summary>
    public bool IsEmpty => Filters.Length == 0 && Sorts.Length == 0;
}
