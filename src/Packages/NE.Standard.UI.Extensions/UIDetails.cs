using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Models;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A list of names and values that is read rather than operated: an order's summary, a record's facts, what a thing is.
/// </summary>
public static class UIDetails
{
    /// <summary>The rows, with no action column and no edge of their own, for a card or a surface to hold.</summary>
    /// <remarks>A row is keyed by its name; a list that repeats one is refused rather than left with duplicate rows.</remarks>
    public static KeyValueActionComponent List(params (string Key, string Value)[] rows)
    {
        ArgumentNullException.ThrowIfNull(rows);

        KeyValueActionItem[] items = new KeyValueActionItem[rows.Length];
        HashSet<string> keys = new(StringComparer.Ordinal);

        for (var i = 0; i < rows.Length; i++)
        {
            if (!keys.Add(rows[i].Key))
                throw new ArgumentException($"The key '{rows[i].Key}' names two rows; a details list keys its rows by name.", nameof(rows));

            items[i] = Row(rows[i].Key, rows[i].Key, rows[i].Value);
        }

        return new KeyValueActionComponent()
            .SetShowActions(false)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetItems(items);
    }

    /// <summary>One row: the name in the muted ink, the value in the text's own.</summary>
    public static KeyValueActionItem Row(string id, string key, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        return new KeyValueActionItem
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value }
        };
    }
}
