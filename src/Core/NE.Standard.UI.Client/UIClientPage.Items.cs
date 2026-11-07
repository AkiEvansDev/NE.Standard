using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Items;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Text;

namespace NE.Standard.UI.Client;

internal readonly record struct ActiveItemsFilter(string ItemProperty, UIComparisonOperator Operator, object? Value);

internal readonly record struct ActiveItemsSort(string ItemProperty, UIItemsSortDirection Direction);

public sealed partial class UIClientPage
{
    private static readonly ConcurrentDictionary<Type, PropertyInfo[]> SearchablePropertiesCache = [];

    /// <summary>
    /// The rows a host shows after evaluating active <c>ItemsView</c> filters and sorts and any viewer <see cref="UIItemsQuery"/>
    /// on a plain host; a windowed host shows its materialized window rows as received from the server.
    /// </summary>
    private List<UIClientRowEntry> ReadVisibleRowsNoLock(UIComponentAddress host)
    {
        List<UIClientRowEntry> sourceRows = ReadSourceRowsNoLock(host);

        if (sourceRows.Count == 0 || ReadNoLock(host.Id, host.DynamicParameters, IItemsHostComponent.HostModeProperty) is UIItemsHostMode.Windowed)
            return sourceRows;

        CompiledUIItemsView? itemsView = ReadNoLock(host.Id, host.DynamicParameters, IItemsComponent.ItemsViewProperty) as CompiledUIItemsView;
        UIItemsQuery? query = ReadNoLock(host.Id, host.DynamicParameters, IItemsComponent.QueryProperty) as UIItemsQuery;

        if (itemsView is null && query is null)
            return sourceRows;

        List<ActiveItemsFilter> filters = BuildActiveFiltersNoLock(itemsView, query, host.DynamicParameters);
        var searchWords = SplitSearchWords(query?.Search);
        List<ActiveItemsSort> sorts = BuildActiveSortsNoLock(itemsView, query, host.DynamicParameters);

        if (filters.Count == 0 && searchWords.Length == 0 && sorts.Count == 0)
            return sourceRows;

        List<(UIClientRowEntry Row, int Index)> matched = new(sourceRows.Count);

        for (var i = 0; i < sourceRows.Count; i++)
        {
            UIClientRowEntry entry = sourceRows[i];

            if (MatchesFilters(entry.Item, filters) && MatchesSearch(entry.Item, searchWords))
                matched.Add((entry, i));
        }

        if (sorts.Count > 0 && matched.Count > 1)
        {
            CompareInfo compareInfo = ResolveCompareInfo(Language);
            matched.Sort((left, right) => CompareRows(left, right, sorts, compareInfo));
        }

        List<UIClientRowEntry> visible = new(matched.Count);

        for (var i = 0; i < matched.Count; i++)
            visible.Add(matched[i].Row);

        return visible;
    }

    private List<ActiveItemsFilter> BuildActiveFiltersNoLock(CompiledUIItemsView? itemsView, UIItemsQuery? query, object?[] hostKeys)
    {
        List<ActiveItemsFilter> active = [];

        if (itemsView is not null)
        {
            foreach (CompiledUIItemsFilter filter in itemsView.Filters)
            {
                if (!IsRuleActiveNoLock(filter.Source, hostKeys))
                    continue;

                var compareValue = filter.Source.Source is UIPropertyAddress source
                    ? ReadRuleSourceNoLock(source, hostKeys)
                    : filter.Value;

                active.Add(new ActiveItemsFilter(filter.ItemProperty, filter.Operator, compareValue));
            }
        }

        if (query is not null)
        {
            foreach (UIItemFilterTerm term in query.Filters)
                active.Add(new ActiveItemsFilter(term.ItemProperty, term.Operator, term.Value));
        }

        return active;
    }

    private bool IsRuleActiveNoLock(CompiledUIItemsRuleSource ruleSource, object?[] hostKeys)
        => ruleSource.Source is not UIPropertyAddress source || UIComparisonEvaluator.Evaluate(ReadRuleSourceNoLock(source, hostKeys), ruleSource.ActiveOperator, ruleSource.ActiveValue);

    private object? ReadRuleSourceNoLock(UIPropertyAddress source, object?[] hostKeys)
    {
        var depth = Math.Min(hostKeys.Length, View.Graph.GetItemScopes(source.Component.Id).Count);
        return ReadNoLock(source.Component.Id, hostKeys[..depth], source.Property);
    }

    private static string[] SplitSearchWords(string? search)
    {
        if (string.IsNullOrWhiteSpace(search))
            return [];

        return search.Trim().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private List<ActiveItemsSort> BuildActiveSortsNoLock(CompiledUIItemsView? itemsView, UIItemsQuery? query, object?[] hostKeys)
    {
        List<ActiveItemsSort> active = [];

        if (query is not null)
        {
            foreach (UIItemSortTerm term in query.Sorts)
                active.Add(new ActiveItemsSort(term.ItemProperty, term.Direction));
        }

        if (itemsView is null || itemsView.Sorts.Length == 0)
            return active;

        List<(CompiledUIItemsSort Sort, int Index)> authored = [];

        for (var i = 0; i < itemsView.Sorts.Length; i++)
        {
            CompiledUIItemsSort sort = itemsView.Sorts[i];

            if (IsRuleActiveNoLock(sort.Source, hostKeys))
                authored.Add((sort, i));
        }

        authored.Sort(static (left, right) =>
        {
            var priority = left.Sort.Priority.CompareTo(right.Sort.Priority);
            return priority != 0 ? priority : left.Index.CompareTo(right.Index);
        });

        for (var i = 0; i < authored.Count; i++)
            active.Add(new ActiveItemsSort(authored[i].Sort.ItemProperty, authored[i].Sort.Direction));

        return active;
    }

    private static bool MatchesFilters(object? item, List<ActiveItemsFilter> filters)
    {
        if (item is null || filters.Count == 0)
            return true;

        for (var i = 0; i < filters.Count; i++)
        {
            ActiveItemsFilter filter = filters[i];
            _ = ItemContext.TryReadPath(item, filter.ItemProperty, out var value);

            if (!UIComparisonEvaluator.Evaluate(value, filter.Operator, filter.Value))
                return false;
        }

        return true;
    }

    private static bool MatchesSearch(object? item, string[] searchWords)
    {
        if (item is null || searchWords.Length == 0)
            return true;

        for (var i = 0; i < searchWords.Length; i++)
        {
            if (!ValueContainsWord(item, searchWords[i], depth: 0))
                return false;
        }

        return true;
    }

    private static bool ValueContainsWord(object? value, string word, int depth)
    {
        if (value is null || depth > 6)
            return false;

        switch (value)
        {
            case string text:
                return text.Contains(word, StringComparison.OrdinalIgnoreCase);
            case UIPhrase { IsText: true } authorText:
                return authorText.Key.Contains(word, StringComparison.OrdinalIgnoreCase);
            case UIPhrase or bool:
                return false;
            default:
                break;
        }

        if (UIScriptNumber.TryRead(value, out var number))
            return UIScriptNumber.Format(number).Contains(word, StringComparison.OrdinalIgnoreCase);

        if (value is DateTime or DateTimeOffset or DateOnly or TimeOnly)
            return UIScriptText.Of(value).Contains(word, StringComparison.OrdinalIgnoreCase);

        if (value is IDictionary dictionary)
        {
            foreach (var entry in dictionary.Values)
            {
                if (ValueContainsWord(entry, word, depth + 1))
                    return true;
            }

            return false;
        }

        if (value is IEnumerable enumerable)
        {
            foreach (var entry in enumerable)
            {
                if (ValueContainsWord(entry, word, depth + 1))
                    return true;
            }

            return false;
        }

        Type type = value.GetType();

        if (type.IsPrimitive || type.IsEnum)
            return false;

        PropertyInfo[] properties = SearchablePropertiesCache.GetOrAdd(type, static itemType => itemType.GetProperties(BindingFlags.Instance | BindingFlags.Public));

        for (var i = 0; i < properties.Length; i++)
        {
            PropertyInfo property = properties[i];

            if (!property.CanRead || property.GetIndexParameters().Length > 0)
                continue;

            if (ValueContainsWord(property.GetValue(value), word, depth + 1))
                return true;
        }

        return false;
    }

    private static CompareInfo ResolveCompareInfo(string language)
    {
        if (string.IsNullOrWhiteSpace(language))
            return CultureInfo.InvariantCulture.CompareInfo;

        try
        {
            return CultureInfo.GetCultureInfo(language).CompareInfo;
        }
        catch (CultureNotFoundException)
        {
            return CultureInfo.InvariantCulture.CompareInfo;
        }
    }

    private static int CompareRows((UIClientRowEntry Row, int Index) left, (UIClientRowEntry Row, int Index) right, List<ActiveItemsSort> sorts, CompareInfo compareInfo)
    {
        for (var i = 0; i < sorts.Count; i++)
        {
            ActiveItemsSort sort = sorts[i];
            _ = ItemContext.TryReadPath(left.Row.Item, sort.ItemProperty, out var leftValue);
            _ = ItemContext.TryReadPath(right.Row.Item, sort.ItemProperty, out var rightValue);

            var comparison = CompareSortValues(leftValue, rightValue, compareInfo);

            if (comparison != 0)
                return sort.Direction == UIItemsSortDirection.Descending ? -comparison : comparison;
        }

        return left.Index.CompareTo(right.Index);
    }

    private static int CompareSortValues(object? leftRaw, object? rightRaw, CompareInfo compareInfo)
    {
        var left = UIPhrase.AsValue(leftRaw);
        var right = UIPhrase.AsValue(rightRaw);

        if (ReferenceEquals(left, right))
            return 0;

        var leftRank = RankSortValue(left, out var leftNumber, out var leftText);
        var rightRank = RankSortValue(right, out var rightNumber, out var rightText);

        if (leftRank != rightRank)
            return leftRank.CompareTo(rightRank);

        return leftRank switch
        {
            0 => 0,
            1 => leftNumber.CompareTo(rightNumber),
            _ => compareInfo.Compare(leftText, rightText, CompareOptions.StringSort)
        };
    }

    private static int RankSortValue(object? value, out double number, out string text)
    {
        number = 0;
        text = string.Empty;

        if (UIScriptNumber.ReadsAsNull(value))
            return 0;

        if (UIScriptNumber.TryRead(value, out number))
            return 1;

        text = UIScriptText.Of(value);

        if (string.IsNullOrWhiteSpace(text))
            return 0;

        ReadOnlySpan<char> trimmed = text.AsSpan().Trim();

        if (!HasRadixPrefix(trimmed) && double.TryParse(trimmed, NumberStyles.Float, CultureInfo.InvariantCulture, out number) && double.IsFinite(number))
            return 1;

        return 2;
    }

    private static bool HasRadixPrefix(ReadOnlySpan<char> text)
        => text.Length >= 2 && text[0] == '0' && (text[1] is 'x' or 'X' or 'b' or 'B' or 'o' or 'O');
}
