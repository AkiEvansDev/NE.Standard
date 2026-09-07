using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Shell.Updates.Server;
using NE.Standard.UI.Web.Abstractions.Rendering;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// The attach's own change set, read as a lookup so the render can paint it instead of the client applying it a connection later.
/// </summary>
internal sealed class WebRenderValues : IWebRenderValues
{
    private readonly Dictionary<UIPropertyAddress, object?> _values = [];
    private readonly Dictionary<UIComponentAddress, IReadOnlyList<object?>> _items = [];

    private WebRenderValues()
    {
    }

    public static WebRenderValues? Create(ServerChangeSet changes)
    {
        ArgumentNullException.ThrowIfNull(changes);

        if (changes.IsEmpty)
            return null;

        WebRenderValues values = new();

        // In order: a bound collection arrives as a reset followed by its items; the reset alone renders the empty template.
        for (var i = 0; i < changes.Updates.Length; i++)
        {
            switch (changes.Updates[i])
            {
                case ServerValueUIUpdate value:
                    values._values[value.Address] = value.Value;
                    break;

                case ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Reset } reset:
                    values._items[reset.Component] = [];
                    break;

                case ServerCollectionChangeUIUpdate { Action: CollectionUpdateAction.Insert } insert:
                    values._items[insert.Component] = ReadItems(insert);
                    break;

                default:
                    break;
            }
        }

        return values;
    }

    private static object?[] ReadItems(ServerCollectionChangeUIUpdate insert)
    {
        var items = new object?[insert.Items.Length];

        for (var i = 0; i < insert.Items.Length; i++)
            items[i] = insert.Items[i].Item;

        return items;
    }

    public bool TryGetValue(UIPropertyAddress address, out object? value)
        => _values.TryGetValue(address, out value);

    public bool TryGetItems(UIComponentAddress component, out IReadOnlyList<object?> items)
    {
        if (_items.TryGetValue(component, out IReadOnlyList<object?>? stored))
        {
            items = stored;
            return true;
        }

        items = [];
        return false;
    }
}
