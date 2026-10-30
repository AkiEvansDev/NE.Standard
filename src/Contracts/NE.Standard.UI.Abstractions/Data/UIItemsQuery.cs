using System;
using System.Text.Json.Serialization;
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
    // Named for the serializer: a struct has a parameterless constructor too, and the wire's query is rebuilt through this one.
    [JsonConstructor]
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
    [JsonConstructor]
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
/// The filtering, free-text search and ordering a window request carries, resolved down to plain terms.
/// </summary>
public sealed class UIItemsQuery
{
    /// <summary>
    /// Gets a query with no terms.
    /// </summary>
    public static UIItemsQuery Empty { get; } = new([], []);

    /// <summary>
    /// Creates a query from filter terms, sort terms and an optional free-text search.
    /// </summary>
    [JsonConstructor]
    public UIItemsQuery(UIItemFilterTerm[] filters, UIItemSortTerm[] sorts, string? search = null)
    {
        ArgumentNullException.ThrowIfNull(filters);
        ArgumentNullException.ThrowIfNull(sorts);

        Filters = filters;
        Sorts = sorts;
        Search = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
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
    /// Gets the viewer's free-text search across the row's columns; <see langword="null"/> when empty.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Search { get; }

    /// <summary>
    /// Gets whether the query asks for nothing in particular.
    /// </summary>
    /// <remarks>Computed, so it stays off the wire.</remarks>
    [JsonIgnore]
    public bool IsEmpty => Filters.Length == 0 && Sorts.Length == 0 && Search is null;
}
