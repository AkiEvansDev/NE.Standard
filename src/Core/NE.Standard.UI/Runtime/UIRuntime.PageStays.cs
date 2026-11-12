using System;
using System.Collections.Generic;
using System.Threading;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    private readonly PageStayRegistry _pageStays = new();

    /// <summary>
    /// The token a background command a tab raised keeps: it outlives the tab's connection — a page attaching again from the same
    /// window keeps its work — and ends only with the tab's stay on this runtime.
    /// </summary>
    internal CancellationToken PageStay(string windowId)
        => _connections.GetOrCreatePageStay(this, windowId);

    /// <summary>
    /// Whether any tab keeps a stay here, read without the lock for the attach that ends a window's stays elsewhere: a stay raised
    /// meanwhile is one that attach could not have ended either.
    /// </summary>
    internal bool HoldsPageStays => _pageStays.HoldsAny;

    /// <summary>A page of the window attached here: its stay is no longer counted as left.</summary>
    private void MarkPageStayPresent(string windowId)
        => _pageStays.MarkPresent(windowId);

    /// <summary>The window's last page here detached: where it holds a stay, the stay counts as left from now.</summary>
    private void MarkPageStayLeft(string windowId, DateTime utcNow)
        => _pageStays.MarkLeft(windowId, utcNow);

    /// <summary>Ends a tab's stay on this runtime — it went to another — cancelling the background commands it raised here.</summary>
    internal void EndPageStay(string windowId)
        => _pageStays.End(windowId);

    /// <summary>Ends every tab's stay — the runtime goes — cancelling every background command it runs.</summary>
    internal void EndPageStays()
        => CancelStays(_pageStays.TakeAll(end: true));

    /// <summary>
    /// Takes every tab's stay out — the runtime's retention ran out — for the caller to cancel (<see cref="CancelStays"/>) once out
    /// of its lock; null for none.
    /// </summary>
    /// <remarks>Taken under the store's lock, so a page attaching again is either seen by the sweep or finds its stay ended.</remarks>
    internal CancellationTokenSource[]? TakePageStays()
        => _pageStays.TakeAll();

    /// <summary>
    /// Takes out the stays of the windows no page of which has been attached here for <paramref name="retention"/>, for the caller
    /// to cancel (<see cref="CancelStays"/>); null for none.
    /// </summary>
    /// <remarks>
    /// The window's mark is lifted as its page attaches to the runtime, a moment after the store attached it: a page coming back
    /// within that moment at the very end of its retention counts as come back too late.
    /// </remarks>
    internal CancellationTokenSource[]? TakeLeftPageStays(DateTime utcNow, TimeSpan retention)
        => _pageStays.TakeLeft(utcNow, retention);

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

    /// <summary>
    /// Owns each tab's background-command stay on this runtime and when its last page left, under its own leaf lock.
    /// </summary>
    private sealed class PageStayRegistry
    {
        private readonly Lock _sync = new();
        private Dictionary<string, CancellationTokenSource>? _stays;
        private Dictionary<string, DateTime>? _leftAt;
        private bool _ended;

        public bool HoldsAny => Volatile.Read(ref _stays) is { Count: > 0 };

        public CancellationToken GetOrCreate(string windowId, bool disposeRequested, DateTime? leftAtUtc = null)
        {
            lock (_sync)
            {
                if (_ended || disposeRequested)
                    return new CancellationToken(canceled: true);

                _stays ??= [with(StringComparer.Ordinal)];

                if (!_stays.TryGetValue(windowId, out CancellationTokenSource? stay))
                {
                    stay = new CancellationTokenSource();
                    _stays.Add(windowId, stay);
                }

                if (leftAtUtc is DateTime left)
                    _ = (_leftAt ??= [with(StringComparer.Ordinal)]).TryAdd(windowId, left);

                return stay.Token;
            }
        }

        public void MarkPresent(string windowId)
        {
            lock (_sync)
                _ = _leftAt?.Remove(windowId);
        }

        public void MarkLeft(string windowId, DateTime utcNow)
        {
            lock (_sync)
            {
                if (_stays is null || !_stays.ContainsKey(windowId))
                    return;

                (_leftAt ??= [with(StringComparer.Ordinal)])[windowId] = utcNow;
            }
        }

        public void End(string windowId)
        {
            CancellationTokenSource? stay;

            lock (_sync)
            {
                if (_stays is null || !_stays.Remove(windowId, out stay))
                    return;

                _ = _leftAt?.Remove(windowId);
            }

            CancelStay(stay);
        }

        public CancellationTokenSource[]? TakeAll(bool end = false)
        {
            lock (_sync)
            {
                if (end)
                    _ended = true;

                if (_stays is null || _stays.Count == 0)
                    return null;

                CancellationTokenSource[] stays = [.. _stays.Values];

                _stays.Clear();
                _leftAt?.Clear();

                return stays;
            }
        }

        public CancellationTokenSource[]? TakeLeft(DateTime utcNow, TimeSpan retention)
        {
            lock (_sync)
            {
                if (_leftAt is null || _leftAt.Count == 0)
                    return null;

                List<string>? gone = null;

                foreach (KeyValuePair<string, DateTime> left in _leftAt)
                {
                    if (left.Value + retention <= utcNow)
                        (gone ??= []).Add(left.Key);
                }

                if (gone is null)
                    return null;

                CancellationTokenSource[] stays = new CancellationTokenSource[gone.Count];

                for (var i = 0; i < gone.Count; i++)
                {
                    _ = _leftAt.Remove(gone[i]);
                    // Every window marked left holds a stay: a mark is set only beside one and goes with it.
                    _ = _stays!.Remove(gone[i], out CancellationTokenSource? stay);
                    stays[i] = stay!;
                }

                return stays;
            }
        }
    }
}
