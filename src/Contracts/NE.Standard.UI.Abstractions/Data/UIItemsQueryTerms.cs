using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Data;

/// <summary>
/// What a viewer's query may name on a windowed host past its <c>ItemsView</c>'s own rules: the item properties it may filter by, the
/// operators it may filter with, the item properties it may sort by, and whether free-text search is offered.
/// </summary>
/// <remarks>A regular expression is never a viewer's to send, whatever is named here: the source would run it as the page wrote it.</remarks>
public sealed class UIItemsQueryTerms
{
    private readonly FrozenDictionary<string, FrozenSet<UIComparisonOperator>>? _operatorsByProperty;

    /// <summary>
    /// Creates the terms a host offers its viewer across all filter properties.
    /// </summary>
    public UIItemsQueryTerms(IEnumerable<string> filterProperties, IEnumerable<UIComparisonOperator> operators, IEnumerable<string> sortProperties, bool allowSearch = false)
    {
        ArgumentNullException.ThrowIfNull(filterProperties);
        ArgumentNullException.ThrowIfNull(operators);
        ArgumentNullException.ThrowIfNull(sortProperties);

        FilterProperties = filterProperties.ToFrozenSet(StringComparer.Ordinal);
        Operators = operators.ToFrozenSet();
        SortProperties = sortProperties.ToFrozenSet(StringComparer.Ordinal);
        AllowSearch = allowSearch;
    }

    /// <summary>
    /// Creates the terms a host offers its viewer, with each filter property constrained to its own operators.
    /// </summary>
    public UIItemsQueryTerms(IEnumerable<KeyValuePair<string, IEnumerable<UIComparisonOperator>>> filters, IEnumerable<string> sortProperties, bool allowSearch = false)
    {
        ArgumentNullException.ThrowIfNull(filters);
        ArgumentNullException.ThrowIfNull(sortProperties);

        Dictionary<string, HashSet<UIComparisonOperator>> byProperty = [with(StringComparer.Ordinal)];
        HashSet<UIComparisonOperator> allOperators = [];

        foreach ((var property, IEnumerable<UIComparisonOperator> propertyOperators) in filters)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(property);
            ArgumentNullException.ThrowIfNull(propertyOperators);

            if (!byProperty.TryGetValue(property, out HashSet<UIComparisonOperator>? set))
                byProperty[property] = set = [];

            foreach (UIComparisonOperator @operator in propertyOperators)
            {
                if (set.Add(@operator))
                    _ = allOperators.Add(@operator);
            }
        }

        Dictionary<string, FrozenSet<UIComparisonOperator>> frozen = new(byProperty.Count, StringComparer.Ordinal);

        foreach ((var property, HashSet<UIComparisonOperator> set) in byProperty)
        {
            if (set.Count > 0)
                frozen[property] = set.ToFrozenSet();
        }

        _operatorsByProperty = frozen.ToFrozenDictionary(StringComparer.Ordinal);
        FilterProperties = frozen.Keys.ToFrozenSet(StringComparer.Ordinal);
        Operators = allOperators.ToFrozenSet();
        SortProperties = sortProperties.ToFrozenSet(StringComparer.Ordinal);
        AllowSearch = allowSearch;
    }

    /// <summary>
    /// Gets the item properties a viewer may filter by.
    /// </summary>
    public IReadOnlySet<string> FilterProperties { get; }

    /// <summary>
    /// Gets the operators a viewer may filter with.
    /// </summary>
    public IReadOnlySet<UIComparisonOperator> Operators { get; }

    /// <summary>
    /// Gets the item properties a viewer may sort by.
    /// </summary>
    public IReadOnlySet<string> SortProperties { get; }

    /// <summary>
    /// Gets whether a viewer may send free-text <see cref="UIItemsQuery.Search"/>.
    /// </summary>
    public bool AllowSearch { get; }

    /// <summary>
    /// Gets the operators allowed per filter property when constrained per property, or <see langword="null"/> when all filter properties share <see cref="Operators"/>.
    /// </summary>
    public IReadOnlyDictionary<string, FrozenSet<UIComparisonOperator>>? OperatorsByProperty => _operatorsByProperty;

    /// <summary>
    /// Whether a viewer may send the filter term: a property and an operator offered for it, and no regular expression.
    /// </summary>
    public bool Allows(UIItemFilterTerm term)
    {
        if (term.Operator is UIComparisonOperator.Regex or UIComparisonOperator.RegexEach)
            return false;

        if (_operatorsByProperty is not null)
            return _operatorsByProperty.TryGetValue(term.ItemProperty, out FrozenSet<UIComparisonOperator>? operators) && operators.Contains(term.Operator);

        return FilterProperties.Contains(term.ItemProperty) && Operators.Contains(term.Operator);
    }

    /// <summary>
    /// Whether a viewer may send the sort term: its property is offered.
    /// </summary>
    public bool Allows(UIItemSortTerm term)
        => SortProperties.Contains(term.ItemProperty);
}

/// <summary>
/// A host whose viewer's query may name more than its <c>ItemsView</c> declares — a package's grid offering its filterable and sortable
/// columns — read by the server before it asks a windowed source with the viewer's terms.
/// </summary>
public interface IItemsQueryTermsComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="QueryTerms"/>.
    /// </summary>
    static UIProperty QueryTermsProperty { get; } = new(nameof(QueryTerms));

    /// <summary>
    /// Gets what a viewer's query may name past the host's own rules; <see langword="null"/> for nothing more.
    /// </summary>
    UIItemsQueryTerms? QueryTerms { get; }
}
