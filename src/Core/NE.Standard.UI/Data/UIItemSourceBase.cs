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
    public partial int? Offset { get; private protected set; }

    /// <summary>
    /// Gets how many items the source holds under the last query, or <see langword="null"/> when unknown.
    /// </summary>
    [RecursiveMember]
    public partial int? TotalCount { get; private protected set; }

    /// <summary>
    /// Gets whether the source has items before the realized window.
    /// </summary>
    [RecursiveMember]
    public partial bool HasMoreBefore { get; private protected set; }

    /// <summary>
    /// Gets the group of the item just before the realized window, or <see langword="null"/> when there is none or the source does
    /// not say; a grouped host heads the window's first row against it.
    /// </summary>
    [RecursiveMember]
    public partial string? GroupBefore { get; private protected set; }

    /// <summary>
    /// Gets whether the source has items after the realized window.
    /// </summary>
    [RecursiveMember]
    public partial bool HasMoreAfter { get; private protected set; }

    /// <summary>
    /// Gets what the source computed over the last query's items, by property, or <see langword="null"/> for none; a window
    /// with aggregates replaces the old ones, one without leaves them.
    /// </summary>
    [RecursiveMember]
    public partial IReadOnlyDictionary<string, object>? Aggregates { get; protected set; }

    /// <summary>
    /// How many items the last read that replaced the window asked for: what a reload after a changed rule reads again, so a page
    /// size the viewer chose holds.
    /// </summary>
    internal int? ReplacingCount { get; set; }

    /// <summary>
    /// The sources whose read is under way on the current flow, innermost first: what that read awaits — a rule source the author's
    /// read writes through <c>InvokeAsync</c> — must not wait for the read itself to end. Set in an async method, it reverts as it returns.
    /// </summary>
    private static readonly AsyncLocal<SourceRead?> ReadsOnFlow = new();

    private sealed record SourceRead(UIItemSourceBase Source, SourceRead? Outer);

    /// <summary>Whether this source's read is under way on the current flow, so a read of it here would wait for itself.</summary>
    internal bool IsReadOnThisFlow
    {
        get
        {
            for (SourceRead? read = ReadsOnFlow.Value; read is not null; read = read.Outer)
            {
                if (ReferenceEquals(read.Source, this))
                    return true;
            }

            return false;
        }
    }

    /// <summary>Marks the current flow as reading this source, until the async method that marks it returns.</summary>
    private protected void MarkReadOnThisFlow()
        => ReadsOnFlow.Value = new SourceRead(this, ReadsOnFlow.Value);

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

    // Short and synchronous, unlike the load gate, which is held across the author's read: a read's result is applied, and a
    // helper's write (Append, Prepend, Insert, Replace, Move, Remove, Invalidate) from a command, a post or a broadcast writes the
    // window, one at a time. Not the command's turn: a scroll would wait out a long command, and a command that loads a window itself
    // would wait for its own turn.
    private readonly Lock _window = new();

    /// <summary>Gets the realized window — the items the client currently holds, in the order they are shown.</summary>
    /// <remarks>
    /// Mutate only through the helpers (<c>Append</c>, <c>Prepend</c>, <c>Insert</c>, <c>Replace</c>, <c>Move</c>, <c>Remove</c>,
    /// <c>Invalidate</c>), not by writing here directly: they write it under the window's lock and keep its counts and edges true.
    /// </remarks>
    [RecursiveMember(false)]
    public RecursiveCollection<TItem> Items { get; } = [];

    /// <summary>
    /// Reads a window and makes it the realized one, called by the runtime when the client asks; an extend anchored on a row that is
    /// no longer the window's edge reads nothing.
    /// </summary>
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
            // Asked from the client's old window — a sort or a search reloaded it from the start meanwhile — it would join the rows
            // after its anchor's new place to a window that no longer ends there. Not read: the client decides again from the window
            // it now gets.
            if (IsStaleExtend(request))
                return;

            MarkReadOnThisFlow();

            UIItemWindow<TItem> window = await GetWindowAsync(request, cancellationToken).ConfigureAwait(false);

            ArgumentNullException.ThrowIfNull(window);
            window.Validate(request);

            lock (_window)
                ApplyWindow(request, window);

            if (request.Mode != UIItemWindowMode.Extend)
                ReplacingCount = request.Count;
        }
        finally
        {
            _ = _loading.Release();
        }
    }

    /// <summary>
    /// Whether an extend is anchored on a row that is no longer the edge it extends: the window's first for <c>Before</c>, its last for
    /// <c>After</c>. An empty window takes any read whole.
    /// </summary>
    private bool IsStaleExtend(UIItemWindowRequest request)
    {
        if (request.Mode != UIItemWindowMode.Extend || request.Anchor.Kind is not (UIItemAnchorKind.Before or UIItemAnchorKind.After))
            return false;

        lock (_window)
        {
            var count = Items.Count;

            if (count == 0)
                return false;

            TItem edge = Items[request.Anchor.Kind == UIItemAnchorKind.Before ? 0 : count - 1];

            return !string.Equals(edge.Id, request.Anchor.Key, StringComparison.Ordinal);
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

        // Drop items the window already holds rather than repeating them: two rows under one key would collide client-side. Looked up
        // by the window's own index by key, not a scan of it per row read.
        List<TItem> fresh = new(window.Items.Count);

        for (var i = 0; i < window.Items.Count; i++)
        {
            if (!Items.TryGet(window.Items[i].Id, out _))
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

    /// <summary>
    /// Trims the window back to its limit in one removal, from the end or the start, marked a trim: the rows leave the page, not the
    /// source.
    /// </summary>
    private void TrimWindow(bool fromTheEnd)
    {
        var excess = Items.Count - Math.Max(1, MaxWindowSize);

        if (excess <= 0)
            return;

        if (fromTheEnd)
        {
            Items.TrimRange(Items.Count - excess, excess);
            HasMoreAfter = true;
        }
        else
        {
            // The last item trimmed is the one before the window now.
            GroupBefore = Items[excess - 1] is IBindableGroup trimmed ? trimmed.Group : null;

            Items.TrimRange(0, excess);
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

        lock (_window)
        {
            var index = IndexOf(key);

            return index < 0 ? null : Items[index];
        }
    }

    // The window's own index by key and its index of items, not a scan: a write, a removal and an arrival each look a row up.
    private int IndexOf(string key)
        => Items.TryGet(key, out TItem? item) ? Items.IndexOf(item) : -1;

    /// <summary>
    /// Adds an item at the end of the window — a message that just arrived, for a viewer already at the end.
    /// </summary>
    /// <remarks>An item the window already holds under that key — a read that brought it first — is replaced where it stands.</remarks>
    protected void Append(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        lock (_window)
        {
            if (TryReplace(item))
                return;

            Items.Add(item);
            HasMoreAfter = false;

            if (TotalCount is int total)
                TotalCount = total + 1;

            // Trims after growing so a long-lived source never ends up holding everything it ever received.
            TrimWindow(fromTheEnd: false);
        }
    }

    /// <summary>Puts <paramref name="item"/> in the place of the one the window holds under its key, if it holds one; counted already.</summary>
    private bool TryReplace(TItem item)
    {
        var index = IndexOf(item.Id);

        if (index < 0)
            return false;

        Items[index] = item;

        return true;
    }

    /// <summary>
    /// Adds a new item at the start of the window — one the source just took in where the window starts, the mirror of
    /// <see cref="Append"/>: the window still starts at the same place, now on the new item, and the source holds one more.
    /// </summary>
    /// <remarks>An item the window already holds under that key is replaced where it stands.</remarks>
    protected void Prepend(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        lock (_window)
        {
            if (TryReplace(item))
                return;

            Items.Insert(0, item);

            if (TotalCount is int total)
                TotalCount = total + 1;

            TrimWindow(fromTheEnd: true);
        }
    }

    /// <summary>
    /// Adds a new item the source took in at <paramref name="sourceIndex"/>, returning whether the window holds it: one inside the
    /// window, or at its end where the window ends the source, joins it there; one before it moves the window's start on by one; one
    /// after it is only counted.
    /// </summary>
    /// <remarks>
    /// An item the window already holds under that key is replaced where it stands, counted already. One at the window's start joins
    /// the window, as <see cref="Prepend"/>'s does. A cursor-counting source, whose window has no offset to place it against, only
    /// counts it.
    /// </remarks>
    protected bool Insert(TItem item, int sourceIndex)
    {
        ArgumentNullException.ThrowIfNull(item);
        ArgumentOutOfRangeException.ThrowIfNegative(sourceIndex);

        lock (_window)
        {
            if (TryReplace(item))
                return true;

            if (TotalCount is int total)
                TotalCount = total + 1;

            if (Offset is not int offset)
                return false;

            var count = Items.Count;

            // Before the window: everything it holds stands one place later now, and the item before it is still the one it was.
            if (sourceIndex < offset)
            {
                Offset = offset + 1;
                HasMoreBefore = true;
                return false;
            }

            // Past the window's end while more follows it: not the reader's to see until they scroll there.
            if (sourceIndex > offset + count || (sourceIndex == offset + count && HasMoreAfter))
            {
                HasMoreAfter = true;
                return false;
            }

            Items.Insert(sourceIndex - offset, item);

            // At the source's end the reader holds that end, as for an append; anywhere else the far end gives way, as for a prepend.
            TrimWindow(fromTheEnd: sourceIndex - offset < count);
            return true;
        }
    }

    /// <summary>
    /// Puts a new shape of an item the window holds in its place, sent as a change of that one row; false, and nothing changed, for a
    /// key the window does not hold.
    /// </summary>
    /// <remarks>The page draws the row anew, as for any replaced item: an edit, a pin, a reaction lands where the reader has it.</remarks>
    protected bool Replace(TItem item)
    {
        ArgumentNullException.ThrowIfNull(item);

        lock (_window)
            return TryReplace(item);
    }

    /// <summary>
    /// Moves an item within the source from <paramref name="oldSourceIndex"/> to <paramref name="newSourceIndex"/> (where it stands once
    /// moved), returning whether the window holds it after: a row moved inside the window moves there, one leaving the window goes, one
    /// coming into it arrives, and one passing the window's start moves the start along.
    /// </summary>
    /// <remarks>
    /// The item, not only its key: one coming into the window from outside it is drawn from it, and it takes the place of the one the
    /// window held under its key. A cursor-counting source, whose window has no offset to place it against, drops a held row.
    /// </remarks>
    protected bool Move(TItem item, int oldSourceIndex, int newSourceIndex)
    {
        ArgumentNullException.ThrowIfNull(item);
        ArgumentOutOfRangeException.ThrowIfNegative(oldSourceIndex);
        ArgumentOutOfRangeException.ThrowIfNegative(newSourceIndex);

        lock (_window)
        {
            var index = IndexOf(item.Id);

            // Inside the window both ways: one move, so the page keeps the row rather than drawing it anew.
            if (index >= 0 && Offset is int offset && newSourceIndex >= offset && newSourceIndex < offset + Items.Count)
            {
                Items.Move(index, newSourceIndex - offset);
                _ = TryReplace(item);
                return true;
            }

            // Anything else is the item leaving its old place and taking its new one, each with its own bookkeeping.
            _ = Remove(item.Id, oldSourceIndex);
            return Insert(item, newSourceIndex);
        }
    }

    /// <summary>
    /// Removes an item from the window by key, returning whether it was there.
    /// </summary>
    protected bool Remove(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        lock (_window)
        {
            var index = IndexOf(key);

            if (index < 0)
            {
                // Still one fewer item behind the window, and the scrollbar is drawn from that count.
                if (TotalCount is int missing && missing > 0)
                    TotalCount = missing - 1;

                return false;
            }

            Items.RemoveAt(index);

            if (TotalCount is int total && total > 0)
                TotalCount = total - 1;

            return true;
        }
    }

    /// <summary>
    /// Removes an item the source no longer holds, by key and by where it stood in the source, returning whether the window held it.
    /// One before the window moves the window's start back by one, and one just before it or the last after it changes what stands
    /// around the window, which <see cref="Remove(string)"/> cannot tell.
    /// </summary>
    protected bool Remove(string key, int sourceIndex)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentOutOfRangeException.ThrowIfNegative(sourceIndex);

        lock (_window)
        {
            if (Remove(key))
                return true;

            if (Offset is not int offset)
                return false;

            // Before the window: everything it holds stands one place earlier now.
            if (sourceIndex < offset)
            {
                Offset = offset - 1;

                // The item just before the window gone, the one now there is another, whose group the source did not say.
                if (sourceIndex == offset - 1)
                    GroupBefore = null;

                if (offset == 1)
                    HasMoreBefore = false;
            }
            else if (TotalCount is int total && offset + Items.Count >= total)
            {
                // After it: the last item after the window gone, the window ends the source.
                HasMoreAfter = false;
            }

            return false;
        }
    }

    /// <summary>
    /// Drops the realized window, so the client reads it again from the host's own edge — the end of an end-anchored host, the start
    /// of any other. The reader's place is not kept: a row that changed where the reader has it is <see cref="Replace"/>'s.
    /// </summary>
    protected void Invalidate()
    {
        lock (_window)
        {
            Items.Clear();

            Offset = null;
            TotalCount = null;
            HasMoreBefore = false;
            HasMoreAfter = false;
            GroupBefore = null;
        }
    }
}
