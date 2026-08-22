using System;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Abstractions.Data;

/// <summary>
/// One resolved filter term: an item property compared against a value the UI already worked out.
/// </summary>
public readonly record struct UIItemFilterTerm
{
    /// <summary>
    /// Creates a filter term.
    /// </summary>
    public UIItemFilterTerm(string itemProperty, UIComparisonOperator @operator, object? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        ItemProperty = itemProperty;
        Operator = @operator;
        Value = value;
    }

    /// <summary>
    /// Gets the item property the term applies to.
    /// </summary>
    public string ItemProperty { get; }

    /// <summary>
    /// Gets the comparison operator.
    /// </summary>
    public UIComparisonOperator Operator { get; }

    /// <summary>
    /// Gets the value compared against the item property.
    /// </summary>
    public object? Value { get; }
}

/// <summary>
/// One resolved sort term.
/// </summary>
public readonly record struct UIItemSortTerm
{
    /// <summary>
    /// Creates a sort term.
    /// </summary>
    public UIItemSortTerm(string itemProperty, UIItemsSortDirection direction)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        ItemProperty = itemProperty;
        Direction = direction;
    }

    /// <summary>
    /// Gets the item property to sort by.
    /// </summary>
    public string ItemProperty { get; }

    /// <summary>
    /// Gets the sort direction.
    /// </summary>
    public UIItemsSortDirection Direction { get; }
}

/// <summary>
/// The filtering and ordering a window request carries, resolved down to plain terms.
/// </summary>
/// <remarks>
/// A source-backed items host cannot filter or sort on the client: it holds one window and would be deciding
/// on a fraction of the data. So the host's <c>ItemsView</c> is resolved here — a rule bound to a search box
/// arrives as its current value — and answering it is the source's job, which is the only place that can see
/// every item.
/// </remarks>
public sealed class UIItemsQuery
{
    /// <summary>
    /// Gets a query with no terms.
    /// </summary>
    public static UIItemsQuery Empty { get; } = new([], []);

    /// <summary>
    /// Creates a query from filter and sort terms.
    /// </summary>
    public UIItemsQuery(UIItemFilterTerm[] filters, UIItemSortTerm[] sorts)
    {
        ArgumentNullException.ThrowIfNull(filters);
        ArgumentNullException.ThrowIfNull(sorts);

        Filters = filters;
        Sorts = sorts;
    }

    /// <summary>
    /// Gets the filter terms, all of which the source must satisfy together.
    /// </summary>
    public UIItemFilterTerm[] Filters { get; }

    /// <summary>
    /// Gets the sort terms, in the order they are applied.
    /// </summary>
    public UIItemSortTerm[] Sorts { get; }

    /// <summary>
    /// Gets whether the query asks for nothing in particular.
    /// </summary>
    public bool IsEmpty => Filters.Length == 0 && Sorts.Length == 0;
}
