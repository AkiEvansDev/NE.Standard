using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Data;

/// <summary>
/// The half of an item source that does not depend on the item type, which is what the runtime and the
/// compiled view talk to.
/// </summary>
public abstract partial class UIItemSourceBase : RecursiveObservable
{
    /// <summary>
    /// The property a source keeps its realized window in. The compiler appends it to a bound source's path,
    /// which is why the name lives here rather than being written twice.
    /// </summary>
    public const string WindowProperty = nameof(UIItemSourceBase<>.Items);

    /// <summary>
    /// Gets where the realized window starts, or <see langword="null"/> for a cursor-counting source.
    /// </summary>
    [RecursiveMember]
    public partial int? Offset { get; protected set; }

    /// <summary>
    /// Gets how many items the source holds under the last query, or <see langword="null"/> when unknown.
    /// </summary>
    [RecursiveMember]
    public partial int? TotalCount { get; protected set; }

    /// <summary>
    /// Gets whether the source has items before the realized window.
    /// </summary>
    [RecursiveMember]
    public partial bool HasMoreBefore { get; protected set; }

    /// <summary>
    /// Gets whether the source has items after the realized window.
    /// </summary>
    [RecursiveMember]
    public partial bool HasMoreAfter { get; protected set; }

    /// <summary>
    /// Reads a window and makes it the realized one. Called by the runtime when the client asks.
    /// </summary>
    public abstract Task LoadWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Writes a property of a realized item back, returning whether the source took it.
    /// </summary>
    public abstract Task<bool> TryWriteAsync(string key, string itemProperty, object? value, CancellationToken cancellationToken = default);
}

/// <summary>
/// Base class for a source of items too many to hold at once: the UI asks for one window at a time and the
/// source answers, which is what makes a chat and a data grid the same feature.
/// </summary>
/// <remarks>
/// <para>
/// A source is <em>state on the controller</em>, bound like any other property — not a service registered
/// under a string key. That is what gives it a type, what lets one live per row of another collection, and
/// what makes the realized window travel to the client through the ordinary collection-change path.
/// </para>
/// <para>
/// It raises no events, for the reason <c>UIControllerBase</c> raises none: a subscription outlives its
/// subscriber and leaks. Changing <see cref="Items"/> — appending a message that just arrived, dropping one
/// that was deleted — <em>is</em> the notification, because a recursive collection reports itself.
/// </para>
/// </remarks>
public abstract partial class UIItemSourceBase<TItem> : UIItemSourceBase
    where TItem : RecursiveObservable, IBindableItem
{
    /// <summary>
    /// Gets the realized window — the items the client currently holds, in the order they are shown.
    /// </summary>
    /// <remarks>
    /// Mutating this from outside the source is a bug: the window is what the last request produced, and an
    /// item put here by hand belongs to no request. The <c>Append</c>/<c>Prepend</c>/<c>Remove</c> helpers
    /// below are how a source reacts to its own data changing under it.
    /// </remarks>
    [RecursiveMember(false)]
    public RecursiveCollection<TItem> Items { get; } = [];

    /// <inheritdoc />
    public sealed override async Task LoadWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        UIItemWindow<TItem> window = await GetWindowAsync(request, cancellationToken).ConfigureAwait(false);

        ArgumentNullException.ThrowIfNull(window);
        window.Validate(request);

        if (request.Mode == UIItemWindowMode.Extend && Items.Count > 0)
        {
            ExtendWindow(request, window);
            return;
        }

        // Clear then add: the client is told to reset the host and take the new window, which is exactly what
        // a collection with no overlap means. A source refilling the same items pays for it, and windows do
        // not overlap often enough to be worth diffing.
        Items.Clear();
        Items.AddRange(window.Items);

        Offset = window.Offset;
        TotalCount = window.TotalCount;
        HasMoreBefore = window.HasMoreBefore;
        HasMoreAfter = window.HasMoreAfter;
    }

    /// <summary>
    /// Gets the most items the window may hold before an extending read trims its far side. Four windows deep
    /// by default: enough that scrolling back a page costs nothing, small enough that a long session does not
    /// end up holding the whole source.
    /// </summary>
    protected virtual int MaxWindowSize => 200;

    /// <summary>
    /// Joins a read to the window it extends and trims the other end, keeping what the viewer is looking at
    /// exactly where it is.
    /// </summary>
    private void ExtendWindow(UIItemWindowRequest request, UIItemWindow<TItem> window)
    {
        var before = request.Anchor.Kind is UIItemAnchorKind.Before or UIItemAnchorKind.Start;

        // Anything the window already holds is dropped rather than repeated: two rows under one key would
        // address each other, and a source answering an overlapping read is a fair thing to do.
        List<TItem> fresh = new(window.Items.Count);

        for (var i = 0; i < window.Items.Count; i++)
        {
            if (Find(window.Items[i].Id) is null)
                fresh.Add(window.Items[i]);
        }

        if (fresh.Count > 0)
        {
            if (before)
            {
                for (var i = fresh.Count - 1; i >= 0; i--)
                    Items.Insert(0, fresh[i]);

                if (Offset is int offset)
                    Offset = Math.Max(0, offset - fresh.Count);
            }
            else
            {
                Items.AddRange(fresh);
            }
        }

        TotalCount = window.TotalCount ?? TotalCount;

        if (before)
            HasMoreBefore = window.HasMoreBefore;
        else
            HasMoreAfter = window.HasMoreAfter;

        TrimWindow(before);
    }

    private void TrimWindow(bool fromTheEnd)
    {
        while (Items.Count > MaxWindowSize)
        {
            if (fromTheEnd)
            {
                Items.RemoveAt(Items.Count - 1);
                HasMoreAfter = true;
            }
            else
            {
                Items.RemoveAt(0);
                HasMoreBefore = true;

                // The window starts one item later than it did, and an offset left behind would place the next
                // read wrongly.
                if (Offset is int offset)
                    Offset = offset + 1;
            }
        }
    }

    /// <inheritdoc />
    public sealed override async Task<bool> TryWriteAsync(string key, string itemProperty, object? value, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        TItem? item = Find(key);

        return item is not null && await TryWriteAsync(item, itemProperty, value, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Reads one window of items. The one member a source must implement.
    /// </summary>
    protected abstract Task<UIItemWindow<TItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken);

    /// <summary>
    /// Takes a property write from the client, returning whether it was accepted. Refuses everything by
    /// default: a source that has nowhere to persist a change should not pretend it took one.
    /// </summary>
    protected virtual Task<bool> TryWriteAsync(TItem item, string itemProperty, object? value, CancellationToken cancellationToken)
        => Task.FromResult(false);

    /// <summary>
    /// Gets a realized item by key, or <see langword="null"/> when it is outside the window.
    /// </summary>
    protected TItem? Find(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        for (var i = 0; i < Items.Count; i++)
        {
            if (string.Equals(Items[i].Id, key, StringComparison.Ordinal))
                return Items[i];
        }

        return null;
    }

    /// <summary>
    /// Adds an item at the end of the window — a message that just arrived, for a viewer already at the end.
    /// </summary>
    protected void Append(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        Items.Add(item);
        HasMoreAfter = false;

        if (TotalCount is int total)
            TotalCount = total + 1;

        // The window stays bounded whichever way it grew: a long-lived conversation appends for hours, and
        // without this the source ends up holding everything it ever received — the thing MaxWindowSize
        // exists to prevent.
        TrimWindow(fromTheEnd: false);
    }

    /// <summary>
    /// Adds an item at the start of the window.
    /// </summary>
    protected void Prepend(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        Items.Insert(0, item);

        // The window now starts one item earlier than the source said it did, and an offset that disagrees
        // with the window would place every later request wrongly.
        if (Offset is int offset && offset > 0)
            Offset = offset - 1;

        if (TotalCount is int total)
            TotalCount = total + 1;

        TrimWindow(fromTheEnd: true);
    }

    /// <summary>
    /// Removes an item from the window by key, returning whether it was there.
    /// </summary>
    protected bool Remove(string key)
    {
        TItem? item = Find(key);

        if (item is null)
        {
            // Still one fewer item behind the window, and the scrollbar is drawn from that count.
            if (TotalCount is int missing && missing > 0)
                TotalCount = missing - 1;

            return false;
        }

        _ = Items.Remove(item);

        if (TotalCount is int total && total > 0)
            TotalCount = total - 1;

        return true;
    }

    /// <summary>
    /// Drops the realized window, which is how a source says "what you hold is no longer trustworthy" — the
    /// client asks again from where it is standing.
    /// </summary>
    protected void Invalidate()
    {
        Items.Clear();

        Offset = null;
        TotalCount = null;
        HasMoreBefore = false;
        HasMoreAfter = false;
    }
}
