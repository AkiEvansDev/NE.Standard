using System;
using System.Collections.Generic;
using System.Globalization;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// A list of names and values that is read rather than operated: an order's summary, a record's facts, what a thing is; and the sums
/// over a total.
/// </summary>
public static class UIDetails
{
    /// <summary>
    /// The rows, with no action column and no edge of their own, for a card or a surface to hold; rows that change are the
    /// controller's, bound with <c>.BindItems(path)</c> and built with <see cref="Row"/>.
    /// </summary>
    /// <remarks>
    /// A row is keyed by its name, the whole phrase: one key with two arguments ("VAT, 21 %" and "VAT, 9 %") is two names, the same
    /// name twice is refused rather than left with duplicate rows.
    /// </remarks>
    public static KeyValueActionComponent List(params (UIPhrase Key, UIPhrase Value)[] rows)
    {
        ArgumentNullException.ThrowIfNull(rows);

        KeyValueActionItem[] items = new KeyValueActionItem[rows.Length];
        HashSet<UIPhrase> names = [];
        HashSet<string> ids = new(StringComparer.Ordinal);

        for (var i = 0; i < rows.Length; i++)
        {
            UIPhrase name = rows[i].Key;

            PresetWords.Require(name, nameof(rows));

            if (!names.Add(name))
                throw new ArgumentException($"'{name.Key}' names two rows; a details list keeps one row to a name.", nameof(rows));

            // The name's key where it is the row's alone; one key naming two rows by their arguments takes its place beside it.
            var id = name.Key;

            for (var place = i; !ids.Add(id); place++)
                id = string.Create(CultureInfo.InvariantCulture, $"{name.Key}#{place}");

            items[i] = Row(id, name, rows[i].Value);
        }

        return new KeyValueActionComponent()
            .SetShowActions(false)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetItems(items);
    }

    /// <summary>One row: the name in the muted ink, the value in the text's own.</summary>
    public static KeyValueActionItem Row(string id, UIPhrase key, UIPhrase? value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);
        PresetWords.Require(key);

        return new KeyValueActionItem
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value }
        };
    }

    /// <summary>
    /// One of the sums over a total — "Subtotal", "VAT, 21%" — the name muted at the start and the amount the controller holds at
    /// <paramref name="valuePath"/> at the far end, as wide as it is; one line at every width, as a receipt's.
    /// </summary>
    public static ContainerComponent Amount(UIPhrase label, string valuePath, UIBindingScope scope = UIBindingScope.Root)
    {
        PresetWords.Require(label);

        return Sum(UIText.Body(label).Muted(), valuePath, scope, strong: false);
    }

    /// <summary>The same with the name the controller holds at <paramref name="labelPath"/> — a rate that changes — as content.</summary>
    public static ContainerComponent BoundAmount(string labelPath, string valuePath, UIBindingScope scope = UIBindingScope.Root)
        => Sum(BoundLabel(labelPath, scope).AsBody().Muted(), valuePath, scope, strong: false);

    /// <summary>The line the sums come to — "Total a month" — the name and the amount both in the subtitle role.</summary>
    public static ContainerComponent Total(UIPhrase label, string valuePath, UIBindingScope scope = UIBindingScope.Root)
    {
        PresetWords.Require(label);

        return Sum(UIText.Subtitle(label), valuePath, scope, strong: true);
    }

    /// <summary>The same with the name the controller holds at <paramref name="labelPath"/>, as content.</summary>
    public static ContainerComponent BoundTotal(string labelPath, string valuePath, UIBindingScope scope = UIBindingScope.Root)
        => Sum(BoundLabel(labelPath, scope).AsSubtitle(), valuePath, scope, strong: true);

    private static TextComponent BoundLabel(string labelPath, UIBindingScope scope)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(labelPath);

        return new TextComponent().BindTitle(labelPath, scope).AsContent(ITextBaseComponent.TitleProperty);
    }

    private static ContainerComponent Sum(TextComponent name, string valuePath, UIBindingScope scope, bool strong)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(valuePath);

        // The amount is the controller's figure, shown as it comes rather than looked up as a phrase.
        TextComponent amount = new TextComponent().BindTitle(valuePath, scope).AsContent(ITextBaseComponent.TitleProperty);

        // Placed rather than equal columns, which stand one under another on a phone: a sum and its name are one line at every width.
        return new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(name.SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 23, 1))
            .AddChild((strong ? amount.AsSubtitle() : amount.AsBody())
                .SetTextAlignment(UITextAlignment.End)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetMargin(UIThickness.All(12, 0, 0, 0))
                .SetPlacement(24, 1, 1, 1)
            );
    }
}
