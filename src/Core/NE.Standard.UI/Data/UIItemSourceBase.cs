using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
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
    /// The property a source keeps its realized window in.
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
    /// Gets the group of the item just before the realized window, or <see langword="null"/> when there is none or the source does
    /// not say; a grouped host heads the window's first row against it.
    /// </summary>
    [RecursiveMember]
    public partial string? GroupBefore { get; protected set; }

    /// <summary>
    /// Gets whether the source has items after the realized window.
    /// </summary>
    [RecursiveMember]
    public partial bool HasMoreAfter { get; protected set; }

    /// <summary>
    /// Gets what the source computed over the last query's items, by property, or <see langword="null"/> for none; a window
    /// with aggregates replaces the old ones, one without leaves them.
    /// </summary>
    [RecursiveMember]
    public partial IReadOnlyDictionary<string, object>? Aggregates { get; protected set; }

    /// <summary>
    /// Reads a window and makes it the realized one. Called by the runtime when the client asks.
    /// </summary>
    public abstract Task LoadWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Writes a property of a realized item back, returning whether the source took it.
    /// </summary>
    public abstract Task<bool> TryWriteAsync(string key, string itemProperty, object? value, CancellationToken cancellationToken = default);
}

/// <summary>Base class for a source of items too many to hold at once, windowed one page at a time.</summary>
/// <remarks>Raises no events; changing <see cref="Items"/> directly is the change notification.</remarks>
[SuppressMessage("Design", "CA1001:Types that own disposable fields should be disposable", Justification = "The load gate is only ever awaited, never asked for its wait handle, so it holds nothing to dispose.")]
public abstract partial class UIItemSourceBase<TItem> : UIItemSourceBase
    where TItem : RecursiveObservable, IBindableItem
{
    // One read at a time: a scroll, a reload after a rule changed and a command's own read can overlap, and each rewrites the
    // window and its offset.
    private readonly SemaphoreSlim _loading = new(1, 1);

    /// <summary>Gets the realized window — the items the client currently holds, in the order they are shown.</summary>
    /// <remarks>Mutate only through the <c>Append</c>/<c>Prepend</c>/<c>Remove</c> helpers, not by writing here directly.</remarks>
    [RecursiveMember(false)]
    public RecursiveCollection<TItem> Items { get; } = [];

    /// <inheritdoc />
    /// <remarks>Reads of one source take turns, each applied before the next begins, whoever asked for them.</remarks>
    public sealed override async Task LoadWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        // The count comes from the client: a source is asked for no more than its window may hold, whatever a request carries.
        var limit = Math.Max(1, MaxWindowSize);

        if (request.Count > limit)
            request = new UIItemWindowRequest(request.Anchor, limit, request.Mode, request.Query);

        await _loading.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            UIItemWindow<TItem> window = await GetWindowAsync(request, cancellationToken).ConfigureAwait(false);

            ArgumentNullException.ThrowIfNull(window);
            window.Validate(request);

            ApplyWindow(request, window);
        }
        finally
        {
            _ = _loading.Release();
        }
    }

    private void ApplyWindow(UIItemWindowRequest request, UIItemWindow<TItem> window)
    {
        if (window.Aggregates is not null)
            Aggregates = window.Aggregates;

        if (request.Mode == UIItemWindowMode.Extend && Items.Count > 0)
        {
            ExtendWindow(request, window);
            return;
        }

        // Clear then add: a non-extending read is treated as a fresh window rather than diffed against the old one. It holds
        // no more than the clamped count, which is within the limit.
        Items.Clear();
        Items.AddRange(window.Items);

        Offset = window.Offset;
        TotalCount = window.TotalCount;
        HasMoreBefore = window.HasMoreBefore;
        HasMoreAfter = window.HasMoreAfter;
        GroupBefore = window.GroupBefore;
    }

    /// <summary>
    /// Gets the most items the window may hold: a read asks for no more, and an extending read trims its far side back to it.
    /// </summary>
    protected virtual int MaxWindowSize => 200;

    /// <summary>
    /// Joins a read to the window it extends and trims the other end, keeping what the viewer is looking at
    /// exactly where it is.
    /// </summary>
    private void ExtendWindow(UIItemWindowRequest request, UIItemWindow<TItem> window)
    {
        var before = request.Anchor.Kind is UIItemAnchorKind.Before or UIItemAnchorKind.Start;

        // Drop items the window already holds rather than repeating them: two rows under one key would collide client-side.
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
                Items.InsertRange(0, fresh);

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
        {
            HasMoreBefore = window.HasMoreBefore;
            GroupBefore = window.GroupBefore;
        }
        else
        {
            HasMoreAfter = window.HasMoreAfter;
        }

        // The far side from the way the viewer travels, and never into the rows just read: the count is within the limit.
        TrimWindow(fromTheEnd: before);
    }

    /// <summary>Trims the window back to its limit in one removal, from the end or the start.</summary>
    private void TrimWindow(bool fromTheEnd)
    {
        var excess = Items.Count - Math.Max(1, MaxWindowSize);

        if (excess <= 0)
            return;

        if (fromTheEnd)
        {
            Items.RemoveRange(Items.Count - excess, excess);
            HasMoreAfter = true;
        }
        else
        {
            // The last item trimmed is the one before the window now.
            GroupBefore = Items[excess - 1] is IBindableGroup trimmed ? trimmed.Group : null;

            Items.RemoveRange(0, excess);
            HasMoreBefore = true;

            // The window starts that many items later; an offset left behind would misplace the next read.
            if (Offset is int offset)
                Offset = offset + excess;
        }
    }

    /// <inheritdoc />
    public sealed override async Task<bool> TryWriteAsync(string key, string itemProperty, object? value, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentException.ThrowIfNullOrWhiteSpace(itemProperty);

        TItem? item;

        // Found between reads, never while one clears the window; the write itself runs outside the gate, since it may read again.
        await _loading.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            item = Find(key);
        }
        finally
        {
            _ = _loading.Release();
        }

        return item is not null && await TryWriteAsync(item, itemProperty, value, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Reads one window of items. The one member a source must implement.
    /// </summary>
    protected abstract Task<UIItemWindow<TItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken);

    /// <summary>
    /// Takes a property write, returning whether it was accepted. Refuses by default: a source with nowhere to persist
    /// shouldn't pretend it did.
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

        // Trims after growing so a long-lived source never ends up holding everything it ever received.
        TrimWindow(fromTheEnd: false);
    }

    /// <summary>
    /// Adds an item at the start of the window.
    /// </summary>
    protected void Prepend(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        Items.Insert(0, item);

        // The window now starts one item earlier; an offset that disagrees with it would misplace later requests.
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
    /// Drops the realized window so the client re-requests it from where it is standing.
    /// </summary>
    protected void Invalidate()
    {
        Items.Clear();

        Offset = null;
        TotalCount = null;
        HasMoreBefore = false;
        HasMoreAfter = false;
        GroupBefore = null;
    }
}
