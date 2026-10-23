using System;
using System.Collections.Generic;
using System.Threading;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private readonly Lock _pageStaysSync = new();

    // Each tab's stay on this runtime, by its window: the token its background commands keep. Created at a tab's first background
    // command; ended when the tab goes to another runtime, when it has been away past the retention, or when the runtime goes.
    private Dictionary<string, CancellationTokenSource>? _pageStays;

    // When each window holding a stay last had no page attached here; none while one is. Read by the store's sweep, so a closed tab's
    // work under a runtime other tabs keep (PerClient) ends at the retention, as the whole runtime's would.
    private Dictionary<string, DateTime>? _pageStaysLeftAt;

    /// <summary>
    /// The token a background command a tab raised keeps: it outlives the tab's connection — a page attaching again from the same
    /// window keeps its work — and ends only with the tab's stay on this runtime.
    /// </summary>
    private CancellationToken PageStay(string windowId)
    {
        lock (_pageStaysSync)
        {
            // Asked to go already: the work it would start is cancelled from its start.
            if (Volatile.Read(ref _disposeRequested) != 0)
                return new CancellationToken(canceled: true);

            _pageStays ??= new Dictionary<string, CancellationTokenSource>(StringComparer.Ordinal);

            if (!_pageStays.TryGetValue(windowId, out CancellationTokenSource? stay))
            {
                stay = new CancellationTokenSource();
                _pageStays.Add(windowId, stay);
            }

            return stay.Token;
        }
    }

    /// <summary>
    /// Whether any tab keeps a stay here, read without the lock for the attach that ends a window's stays elsewhere: a stay raised
    /// meanwhile is one that attach could not have ended either.
    /// </summary>
    internal bool HoldsPageStays
        => Volatile.Read(ref _pageStays) is { Count: > 0 };

    /// <summary>A page of the window attached here: its stay is no longer counted as left.</summary>
    private void MarkPageStayPresent(string windowId)
    {
        lock (_pageStaysSync)
            _ = _pageStaysLeftAt?.Remove(windowId);
    }

    /// <summary>The window's last page here detached: where it holds a stay, the stay counts as left from now.</summary>
    private void MarkPageStayLeft(string windowId, DateTime utcNow)
    {
        lock (_pageStaysSync)
        {
            if (_pageStays is null || !_pageStays.ContainsKey(windowId))
                return;

            (_pageStaysLeftAt ??= new Dictionary<string, DateTime>(StringComparer.Ordinal))[windowId] = utcNow;
        }
    }

    /// <summary>Ends a tab's stay on this runtime — it went to another — cancelling the background commands it raised here.</summary>
    internal void EndPageStay(string windowId)
    {
        CancellationTokenSource? stay;

        lock (_pageStaysSync)
        {
            if (_pageStays is null || !_pageStays.Remove(windowId, out stay))
                return;

            _ = _pageStaysLeftAt?.Remove(windowId);
        }

        CancelStay(stay);
    }

    /// <summary>Ends every tab's stay — the runtime goes — cancelling every background command it runs.</summary>
    internal void EndPageStays()
        => CancelStays(TakePageStays());

    /// <summary>
    /// Takes every tab's stay out — the runtime's retention ran out — for the caller to cancel (<see cref="CancelStays"/>) once out
    /// of its lock; null for none.
    /// </summary>
    /// <remarks>Taken under the store's lock, so a page attaching again is either seen by the sweep or finds its stay ended.</remarks>
    internal CancellationTokenSource[]? TakePageStays()
    {
        lock (_pageStaysSync)
        {
            if (_pageStays is null || _pageStays.Count == 0)
                return null;

            CancellationTokenSource[] stays = [.. _pageStays.Values];

            _pageStays.Clear();
            _pageStaysLeftAt?.Clear();

            return stays;
        }
    }

    /// <summary>
    /// Takes out the stays of the windows no page of which has been attached here for <paramref name="retention"/>, for the caller
    /// to cancel (<see cref="CancelStays"/>); null for none.
    /// </summary>
    /// <remarks>
    /// The window's mark is lifted as its page attaches to the runtime, a moment after the store attached it: a page coming back
    /// within that moment at the very end of its retention counts as come back too late.
    /// </remarks>
    internal CancellationTokenSource[]? TakeLeftPageStays(DateTime utcNow, TimeSpan retention)
    {
        lock (_pageStaysSync)
        {
            if (_pageStaysLeftAt is null || _pageStaysLeftAt.Count == 0)
                return null;

            List<string>? gone = null;

            foreach (KeyValuePair<string, DateTime> left in _pageStaysLeftAt)
            {
                if (left.Value + retention <= utcNow)
                    (gone ??= []).Add(left.Key);
            }

            if (gone is null)
                return null;

            CancellationTokenSource[] stays = new CancellationTokenSource[gone.Count];

            for (var i = 0; i < gone.Count; i++)
            {
                _ = _pageStaysLeftAt.Remove(gone[i]);
                // Every window marked left holds a stay: a mark is set only beside one and goes with it.
                _ = _pageStays!.Remove(gone[i], out CancellationTokenSource? stay);
                stays[i] = stay!;
            }

            return stays;
        }
    }

    /// <summary>Cancels stays taken out under a lock, now that it is let go: a cancelled command's continuations may run here.</summary>
    internal static void CancelStays(CancellationTokenSource[]? stays)
    {
        if (stays is null)
            return;

        for (var i = 0; i < stays.Length; i++)
            CancelStay(stays[i]);
    }

    /// <summary>Cancelled, then let go: a command still finishing reads only whether it was cancelled, which a disposed source still answers.</summary>
    private static void CancelStay(CancellationTokenSource stay)
    {
        try
        {
            stay.Cancel();
        }
        finally
        {
            stay.Dispose();
        }
    }
}
