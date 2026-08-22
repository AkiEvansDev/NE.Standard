using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// Describes filtering and sorting rules for an items view.
/// </summary>
public sealed class UIItemsView : IUIResolvableValue
{
    /// <summary>
    /// Creates an items view from the given filters and sort rules.
    /// </summary>
    public UIItemsView(IReadOnlyList<UIItemsFilter>? filters = null, IReadOnlyList<UIItemsSort>? sorts = null)
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
    /// Gets the filters applied to the view.
    /// </summary>
    public UIItemsFilter[] Filters { get; }

    /// <summary>
    /// Gets the sort rules applied to the view.
    /// </summary>
    public UIItemsSort[] Sorts { get; }

    /// <summary>
    /// Gets whether the view has no filters or sort rules.
    /// </summary>
    public bool IsEmpty => Filters.Length == 0 && Sorts.Length == 0;

    /// <inheritdoc />
    public object Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        return resolver.ResolveItemsView(this);
    }
}
