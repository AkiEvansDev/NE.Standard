using System.Collections.Frozen;
using System.Collections.Generic;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Shared grouping helpers for the compiled indexes that bucket entries by one or more keys before freezing.
/// </summary>
internal static class GroupingIndex
{
    /// <summary>
    /// Appends a value to the list registered for a key, creating the list on first use.
    /// </summary>
    public static void Add<TKey, TValue>(Dictionary<TKey, List<TValue>> map, TKey key, TValue value)
        where TKey : notnull
    {
        if (!map.TryGetValue(key, out List<TValue>? list))
        {
            list = [];
            map.Add(key, list);
        }

        list.Add(value);
    }

    /// <summary>
    /// Freezes a grouping dictionary into arrays for fast, immutable lookup.
    /// </summary>
    public static FrozenDictionary<TKey, TValue[]> Freeze<TKey, TValue>(Dictionary<TKey, List<TValue>> source)
        where TKey : notnull
    {
        Dictionary<TKey, TValue[]> result = new(source.Count);

        foreach (KeyValuePair<TKey, List<TValue>> pair in source)
            result.Add(pair.Key, [.. pair.Value]);

        return result.ToFrozenDictionary();
    }
}
