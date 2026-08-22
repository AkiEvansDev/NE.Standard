using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Recursive;

namespace NE.Standard.UI.Abstractions.Data;

/// <summary>
/// Defines what a read does to the window already realized.
/// </summary>
public enum UIItemWindowMode
{
    /// <summary>
    /// The window becomes the items that were read — a jump into the middle of a grid.
    /// </summary>
    Replace = 0,

    /// <summary>
    /// The items that were read join the window on the side they were read from, and the far side is trimmed
    /// once the window outgrows its limit — reading further up a chat, where what is already on screen has to
    /// stay where it is.
    /// </summary>
    Extend = 1
}

/// <summary>
/// Describes a window of items the client asks a source for.
/// </summary>
public sealed class UIItemWindowRequest
{
    /// <summary>
    /// Creates a window request.
    /// </summary>
    public UIItemWindowRequest(UIItemAnchor anchor, int count, UIItemWindowMode mode = UIItemWindowMode.Replace, UIItemsQuery? query = null)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(count);

        Anchor = anchor;
        Count = count;
        Mode = mode;
        Query = query ?? UIItemsQuery.Empty;
    }

    /// <summary>
    /// Gets what the read does to the window already realized.
    /// </summary>
    public UIItemWindowMode Mode { get; }

    /// <summary>
    /// Gets what the window is positioned against.
    /// </summary>
    public UIItemAnchor Anchor { get; }

    /// <summary>
    /// Gets how many items are wanted.
    /// </summary>
    public int Count { get; }

    /// <summary>
    /// Gets the filtering and ordering the window is read under.
    /// </summary>
    public UIItemsQuery Query { get; }
}

/// <summary>
/// A window of items answering a <see cref="UIItemWindowRequest"/>.
/// </summary>
public sealed class UIItemWindow<TItem>
    where TItem : RecursiveObservable, IBindableItem
{
    /// <summary>
    /// Creates a window from the items it holds.
    /// </summary>
    public UIItemWindow(IReadOnlyList<TItem> items)
    {
        ArgumentNullException.ThrowIfNull(items);

        for (var i = 0; i < items.Count; i++)
        {
            if (items[i] is null)
                throw new ArgumentException("A window must not contain null items.", nameof(items));
        }

        Items = items;
    }

    /// <summary>
    /// Gets the items, in the order they are shown.
    /// </summary>
    public IReadOnlyList<TItem> Items { get; }

    /// <summary>
    /// Gets where the window starts, or <see langword="null"/> when the source counts in cursors rather than
    /// in positions — a chat, where a prepend would shift every offset below it.
    /// </summary>
    public int? Offset { get; init; }

    /// <summary>
    /// Gets how many items the source holds under the request's query, or <see langword="null"/> when that is
    /// unknown. A scrollbar is proportional only when it is known; otherwise the client can say no more than
    /// "there is more".
    /// </summary>
    public int? TotalCount { get; init; }

    /// <summary>
    /// Gets whether the source has items before this window.
    /// </summary>
    public bool HasMoreBefore { get; init; }

    /// <summary>
    /// Gets whether the source has items after this window.
    /// </summary>
    public bool HasMoreAfter { get; init; }

    /// <summary>
    /// Validates the window against the request it answers.
    /// </summary>
    public void Validate(UIItemWindowRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (Offset is < 0)
            throw new InvalidOperationException("Window offset cannot be negative.");

        if (TotalCount is < 0)
            throw new InvalidOperationException("Window total count cannot be negative.");

        if (Items.Count > request.Count)
            throw new InvalidOperationException($"A window of {Items.Count} items answers a request for {request.Count}.");

        if (TotalCount is int total && Offset is int offset && offset + Items.Count > total)
            throw new InvalidOperationException($"A window at offset {offset} holding {Items.Count} items does not fit a total of {total}.");

        HashSet<string> keys = new(Items.Count, StringComparer.Ordinal);

        for (var i = 0; i < Items.Count; i++)
        {
            // The whole addressing model rests on this: a row is found by its item's id, on the server and in
            // the DOM alike. Two items sharing one would silently patch each other.
            if (!keys.Add(Items[i].Id))
                throw new InvalidOperationException($"A window carries item id '{Items[i].Id}' more than once.");
        }
    }
}
