using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Hosting;

internal sealed class UIRuntimeStore : IDisposable, IAsyncDisposable
{
    private readonly Lock _sync = new();
    private readonly Dictionary<UIRuntimeKey, UIRuntimeEntry> _entries = [];
    private readonly Dictionary<string, UIRuntimeKey> _instanceKeys = new(StringComparer.Ordinal);
    // Each session's keys, kept beside the entries so the cap and every per-session lookup read one session, not the whole store.
    private readonly Dictionary<string, List<UIRuntimeKey>> _sessionKeys = new(StringComparer.Ordinal);
    // Reused by the flush pass so an empty interval allocates nothing; guarded by its own lock rather than the scheduler's
    // one-at-a-time promise, since a second caller (e.g. a benchmark) could read a list mid-clear.
    private readonly Lock _flushSync = new();
    private readonly List<UIRuntimeEntry> _flushCandidates = [];
    private readonly List<UIRuntimeEntry> _flushReady = [];

    /// <summary>How many runtimes the store holds, for the runtime count the host's meter observes.</summary>
    public int Count
    {
        get
        {
            lock (_sync)
                return _entries.Count;
        }
    }

    /// <summary>How many connections are attached to a runtime of the store: the open pages, for the host's meter.</summary>
    public int AttachedCount
    {
        get
        {
            lock (_sync)
                return _instanceKeys.Count;
        }
    }

    public bool TryGet(UIRuntimeKey key, out IUIRuntime? runtime)
    {
        lock (_sync)
        {
            if (_entries.TryGetValue(key, out UIRuntimeEntry? entry))
            {
                runtime = entry.Runtime;
                return true;
            }

            runtime = null;
            return false;
        }
    }

    /// <summary>
    /// The entry <paramref name="instanceId"/> is attached to — its runtime, and the per-entry session-activity throttle.
    /// </summary>
    public bool TryGetAttachedEntry(UIRuntimeKey key, string instanceId, out UIRuntimeEntry? entry)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        lock (_sync)
        {
            if (_entries.TryGetValue(key, out UIRuntimeEntry? found) && found.HasInstance(instanceId))
            {
                entry = found;
                return true;
            }

            entry = null;
            return false;
        }
    }

    /// <summary>
    /// The runtime for a key once its creating attach has started it — what a page render may read; one still initializing
    /// is answered as absent.
    /// </summary>
    public bool TryGetStarted(UIRuntimeKey key, out IUIRuntime? runtime)
    {
        lock (_sync)
        {
            if (_entries.TryGetValue(key, out UIRuntimeEntry? entry) && entry.Initialization.IsCompletedSuccessfully)
            {
                runtime = entry.Runtime;
                return true;
            }

            runtime = null;
            return false;
        }
    }

    /// <summary>
    /// The one runtime this session has on this address, when it has exactly one and its creating attach has started it.
    /// </summary>
    public bool TryGetSingle(string sessionId, string route, string? identity, out IUIRuntime? runtime)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(route);

        runtime = null;

        lock (_sync)
        {
            if (!_sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys))
                return false;

            UIRuntimeEntry? single = null;

            for (var i = 0; i < keys.Count; i++)
            {
                UIRuntimeKey key = keys[i];

                if (!StringComparer.Ordinal.Equals(key.Route, route) || !StringComparer.Ordinal.Equals(key.Identity, identity))
                    continue;

                UIRuntimeEntry entry = _entries[key];

                // A runtime no page ever presented is the render's own provisional one, holding nothing it could not build itself.
                if (!entry.IsAdopted)
                    continue;

                if (single is not null)
                    return false;

                single = entry;
            }

            // Counted while it initializes, but not read: its state is not the page's yet.
            if (single is null || !single.Initialization.IsCompletedSuccessfully)
                return false;

            runtime = single.Runtime;
            return true;
        }
    }

    /// <summary>The entry for a key, created when there is none, within the session's limits and the process's.</summary>
    /// <remarks>
    /// Past a limit the session gives up its longest-idle runtime nobody uses (<paramref name="evicted"/>) — an unclaimed one for a page
    /// render's (<paramref name="adopted"/> false) — and is refused when every one is in use; past <paramref name="maxTotal"/> (zero is
    /// none) the process gives up its longest-disconnected runtime, whatever session holds it, and refuses likewise. The factory runs the application's
    /// controller constructor, so it runs outside the lock every attach, render lookup, flush and cleanup waits on; a runtime the second
    /// look finds no place for is <paramref name="unused"/>. The caller disposes both asynchronously: a scope holding a service that is
    /// only <see cref="IAsyncDisposable"/> refuses a synchronous dispose.
    /// </remarks>
    public UIRuntimeEntry? GetOrAdd(UIRuntimeKey key, string instanceId, Func<IUIRuntime> factory, DateTime utcNow, UIFlushOptions flush, int maxPerSession, int maxUnclaimedPerSession, int maxTotal, bool adopted, out bool created, out bool attached, out int activeInstances, out IUIRuntime? evicted, out IUIRuntime? unused)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(factory);
        ArgumentOutOfRangeException.ThrowIfLessThan(maxPerSession, 1);
        ArgumentOutOfRangeException.ThrowIfLessThan(maxUnclaimedPerSession, 1);
        ArgumentOutOfRangeException.ThrowIfNegative(maxTotal);

        flush.Validate();

        created = false;
        evicted = null;
        unused = null;

        lock (_sync)
        {
            if (_entries.TryGetValue(key, out UIRuntimeEntry? existing))
            {
                AttachNoLock(existing, key, instanceId, utcNow, adopted, out attached, out activeInstances);
                return existing;
            }

            // Refused before anything is built when nothing could make room.
            if (IsFullNoLock(key.SessionId, maxPerSession) && !TryFindEvictableNoLock(key.SessionId, unclaimedOnly: false, out _))
                throw SessionFull(maxPerSession);

            // Answered with nothing rather than thrown: the caller tells the process's refusal from a session's and reports it.
            if (IsProcessFullNoLock(maxTotal) && !TryFindLongestDisconnectedNoLock(out _))
            {
                attached = false;
                activeInstances = 0;
                return null;
            }
        }

        IUIRuntime runtime = factory();
        UIRuntimeEntry? entry;

        attached = false;
        activeInstances = 0;

        lock (_sync)
        {
            if (!_entries.TryGetValue(key, out entry))
            {
                // A render's runtime makes room from its own kind first: a client that never attaches (a crawler, a prefetch)
                // would otherwise fill the session's whole cap with runtimes nobody will claim. One still rendering is kept.
                if (!adopted && CountUnclaimedNoLock(key.SessionId) >= maxUnclaimedPerSession)
                    _ = TryEvictIdlestNoLock(key.SessionId, unclaimedOnly: true, out evicted);

                var sessionRoom = !IsFullNoLock(key.SessionId, maxPerSession) || (evicted is null && TryEvictIdlestNoLock(key.SessionId, unclaimedOnly: false, out evicted));

                // A session that gave one up made the process's room too: the count never passes the limit, so one is all it takes.
                if (sessionRoom && (evicted is not null || !IsProcessFullNoLock(maxTotal) || TryEvictLongestDisconnectedNoLock(out evicted)))
                {
                    entry = new UIRuntimeEntry(runtime, flush);
                    AddEntryNoLock(key, entry);
                    created = true;
                }
            }

            if (entry is not null)
                AttachNoLock(entry, key, instanceId, utcNow, adopted, out attached, out activeInstances);
        }

        if (!created)
            unused = runtime;

        return entry;
    }

    private void AttachNoLock(UIRuntimeEntry entry, UIRuntimeKey key, string instanceId, DateTime utcNow, bool adopted, out bool attached, out int activeInstances)
    {
        DetachFromPreviousEntryNoLock(instanceId, key, utcNow);

        // A real tab presenting it: it stops being a render's provisional entry, see UIRuntimeEntry.IsAdopted.
        if (adopted)
            entry.MarkAdopted();

        attached = entry.Attach(instanceId, utcNow);
        activeInstances = entry.ConnectionCount;
        _instanceKeys[instanceId] = key;
    }

    /// <summary>
    /// Releases an instance from whatever entry it was mapped to before, when it is attaching to a different key.
    /// </summary>
    private void DetachFromPreviousEntryNoLock(string instanceId, UIRuntimeKey key, DateTime utcNow)
    {
        if (!_instanceKeys.TryGetValue(instanceId, out UIRuntimeKey previousKey) || previousKey.Equals(key))
            return;

        if (_entries.TryGetValue(previousKey, out UIRuntimeEntry? previousEntry))
            _ = previousEntry.Detach(instanceId, utcNow);
    }

    private bool IsFullNoLock(string sessionId, int maxPerSession)
        => _sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys) && keys.Count >= maxPerSession;

    private int CountUnclaimedNoLock(string sessionId)
    {
        if (!_sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys))
            return 0;

        var unclaimed = 0;

        for (var i = 0; i < keys.Count; i++)
        {
            if (!_entries[keys[i]].IsAdopted)
                unclaimed++;
        }

        return unclaimed;
    }

    /// <summary>
    /// The session's longest-idle runtime that may be taken away (no tab attached, and no command running whose work would
    /// be lost with it), among its unclaimed ones only when <paramref name="unclaimedOnly"/>.
    /// </summary>
    private bool TryFindEvictableNoLock(string sessionId, bool unclaimedOnly, out UIRuntimeKey key)
    {
        UIRuntimeKey? idlest = null;
        DateTime idlestSeen = DateTime.MaxValue;

        if (_sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys))
        {
            for (var i = 0; i < keys.Count; i++)
            {
                UIRuntimeEntry entry = _entries[keys[i]];

                if (entry.IsConnected || entry.Runtime.HasCommandsInFlight || entry.LastSeenAtUtc >= idlestSeen || (unclaimedOnly && entry.IsAdopted))
                    continue;

                idlest = keys[i];
                idlestSeen = entry.LastSeenAtUtc;
            }
        }

        key = idlest.GetValueOrDefault();

        return idlest.HasValue;
    }

    /// <summary>The refusal of a session that holds as many runtimes as it may.</summary>
    public static InvalidOperationException SessionFull(int maxPerSession)
        => new($"This session already holds {maxPerSession} open pages, the most one session may hold (UIPersistenceOptions.MaxRuntimesPerSession).");

    /// <summary>Whether the process holds as many runtimes as it may; zero is no limit.</summary>
    public bool IsProcessFull(int maxTotal)
    {
        lock (_sync)
            return IsProcessFullNoLock(maxTotal);
    }

    private bool IsProcessFullNoLock(int maxTotal)
        => maxTotal > 0 && _entries.Count >= maxTotal;

    /// <summary>
    /// The process's runtime that has been without a page longest, of any session, that may be taken away (no tab attached, no command
    /// running).
    /// </summary>
    /// <remarks>
    /// By the time its last tab left, not by its last-seen time, which a flush of a disconnected runtime moves on. Walks the whole store,
    /// but only for a runtime being built at the limit.
    /// </remarks>
    private bool TryFindLongestDisconnectedNoLock(out UIRuntimeKey key)
    {
        UIRuntimeKey? oldest = null;
        DateTime oldestAt = DateTime.MaxValue;

        foreach (KeyValuePair<UIRuntimeKey, UIRuntimeEntry> pair in _entries)
        {
            if (pair.Value.DisconnectedAtUtc is not DateTime disconnectedAt || disconnectedAt >= oldestAt || pair.Value.Runtime.HasCommandsInFlight)
                continue;

            oldest = pair.Key;
            oldestAt = disconnectedAt;
        }

        key = oldest.GetValueOrDefault();

        return oldest.HasValue;
    }

    /// <summary>The refusal of a new runtime when the process holds as many as it may and none can be given up.</summary>
    public static InvalidOperationException ProcessFull(int maxTotal)
        => new($"The server already holds {maxTotal} pages, each with a tab connected or a command running, the most it may hold (UIPersistenceOptions.MaxRuntimesTotal).");

    private bool TryEvictLongestDisconnectedNoLock([NotNullWhen(true)] out IUIRuntime? evicted)
    {
        evicted = null;

        if (!TryFindLongestDisconnectedNoLock(out UIRuntimeKey key) || !RemoveEntryNoLock(key, out UIRuntimeEntry? entry))
            return false;

        evicted = entry.Runtime;

        return true;
    }

    private bool TryEvictIdlestNoLock(string sessionId, bool unclaimedOnly, [NotNullWhen(true)] out IUIRuntime? evicted)
    {
        evicted = null;

        if (!TryFindEvictableNoLock(sessionId, unclaimedOnly, out UIRuntimeKey key) || !RemoveEntryNoLock(key, out UIRuntimeEntry? entry))
            return false;

        evicted = entry.Runtime;

        return true;
    }

    /// <summary>Takes an entry away with its instances' mappings, keeping the session's index.</summary>
    private bool RemoveEntryNoLock(UIRuntimeKey key, [NotNullWhen(true)] out UIRuntimeEntry? entry)
    {
        if (!_entries.Remove(key, out entry))
            return false;

        foreach (var instanceId in entry.InstanceIds)
            _ = _instanceKeys.Remove(instanceId);

        List<UIRuntimeKey> keys = _sessionKeys[key.SessionId];
        _ = keys.Remove(key);

        if (keys.Count == 0)
            _ = _sessionKeys.Remove(key.SessionId);

        return true;
    }

    private void AddEntryNoLock(UIRuntimeKey key, UIRuntimeEntry entry)
    {
        _entries.Add(key, entry);

        if (!_sessionKeys.TryGetValue(key.SessionId, out List<UIRuntimeKey>? keys))
        {
            keys = [];
            _sessionKeys.Add(key.SessionId, keys);
        }

        keys.Add(key);
    }

    public bool Detach(string instanceId, DateTime utcNow, out IUIRuntime? runtime, out int activeInstances)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        lock (_sync)
        {
            activeInstances = 0;

            if (!_instanceKeys.TryGetValue(instanceId, out UIRuntimeKey key))
            {
                runtime = null;
                return false;
            }

            if (!_entries.TryGetValue(key, out UIRuntimeEntry? entry))
            {
                _ = _instanceKeys.Remove(instanceId);
                runtime = null;
                return false;
            }

            runtime = entry.Runtime;

            if (!entry.Detach(instanceId, utcNow))
                return false;

            activeInstances = entry.ConnectionCount;
            _ = _instanceKeys.Remove(instanceId);

            return true;
        }
    }

    public bool Detach(UIRuntimeKey key, string instanceId, DateTime utcNow, out IUIRuntime? runtime, out int activeInstances)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        lock (_sync)
        {
            activeInstances = 0;

            if (!_entries.TryGetValue(key, out UIRuntimeEntry? entry))
            {
                runtime = null;
                return false;
            }

            runtime = entry.Runtime;

            if (!entry.Detach(instanceId, utcNow))
                return false;

            activeInstances = entry.ConnectionCount;
            _ = _instanceKeys.Remove(instanceId);

            return true;
        }
    }

    /// <summary>
    /// Moves a runtime the page render prepared onto the key its client turned out to need, and answers
    /// whether it survived the move.
    /// </summary>
    /// <remarks>
    /// When the target key already has a runtime, the prepared one is returned via <paramref name="discarded"/> for the caller to dispose.
    /// </remarks>
    public bool Rekey(UIRuntimeKey from, UIRuntimeKey to, out IUIRuntime? discarded)
    {
        discarded = null;

        if (from.Equals(to))
            return false;

        lock (_sync)
        {
            if (!RemoveEntryNoLock(from, out UIRuntimeEntry? entry))
                return false;

            if (_entries.ContainsKey(to))
            {
                discarded = entry.Runtime;
                return false;
            }

            AddEntryNoLock(to, entry);

            foreach (var instanceId in entry.InstanceIds)
                _instanceKeys[instanceId] = to;

            return true;
        }
    }

    /// <summary>
    /// Takes away every runtime this tab holds on an address other than the one it is on, and answers them
    /// for disposal.
    /// </summary>
    public IUIRuntime[] RemoveWindowEntriesExcept(string sessionId, string windowId, UIRuntimeKey keep)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(windowId);

        lock (_sync)
        {
            if (!_sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys))
                return [];

            List<UIRuntimeKey>? staleKeys = null;

            for (var i = 0; i < keys.Count; i++)
            {
                UIRuntimeKey key = keys[i];

                if (key.Equals(keep) || !StringComparer.Ordinal.Equals(key.WindowId, windowId))
                    continue;

                staleKeys ??= [];
                staleKeys.Add(key);
            }

            if (staleKeys is null)
                return [];

            IUIRuntime[] removed = new IUIRuntime[staleKeys.Count];

            for (var i = 0; i < staleKeys.Count; i++)
            {
                _ = RemoveEntryNoLock(staleKeys[i], out UIRuntimeEntry? entry);

                removed[i] = entry!.Runtime;
            }

            return removed;
        }
    }

    /// <summary>The keys of every runtime a session holds, read off the session's own index.</summary>
    public UIRuntimeKey[] GetSessionKeys(string sessionId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        lock (_sync)
            return _sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys) ? [.. keys] : [];
    }

    /// <summary>
    /// Takes away every runtime a session holds but <paramref name="keep"/>, and answers them for the caller to end.
    /// </summary>
    public IUIRuntime[] RemoveSession(string sessionId, UIRuntimeKey? keep)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);

        lock (_sync)
        {
            if (!_sessionKeys.TryGetValue(sessionId, out List<UIRuntimeKey>? keys))
                return [];

            UIRuntimeKey[] ended = [.. keys];
            List<IUIRuntime> removed = new(ended.Length);

            for (var i = 0; i < ended.Length; i++)
            {
                if (ended[i].Equals(keep) || !RemoveEntryNoLock(ended[i], out UIRuntimeEntry? entry))
                    continue;

                removed.Add(entry.Runtime);
            }

            return [.. removed];
        }
    }

    public bool Remove(UIRuntimeKey key, out IUIRuntime? runtime)
    {
        lock (_sync)
        {
            if (!RemoveEntryNoLock(key, out UIRuntimeEntry? entry))
            {
                runtime = null;
                return false;
            }

            runtime = entry.Runtime;
            return true;
        }
    }

    /// <summary>The runtimes with something to send, marked as flushed so the next interval skips them.</summary>
    /// <remarks>
    /// Checking a runtime's work reads its controller — application code — so this runs outside the store's lock, or a slow
    /// controller would stall every attach. Candidates are copied into a store-owned buffer, so an empty interval allocates nothing.
    /// </remarks>
    public IUIRuntime[] GetRuntimesReadyToFlush(DateTime utcNow)
    {
        lock (_flushSync)
            return SelectRuntimesReadyToFlush(utcNow);
    }

    private IUIRuntime[] SelectRuntimesReadyToFlush(DateTime utcNow)
    {
        lock (_sync)
        {
            _flushCandidates.Clear();

            foreach (UIRuntimeEntry entry in _entries.Values)
            {
                // One its creating attach has not started yet has nothing to send and refuses a flush; left unmarked, it is
                // picked up the tick after it starts.
                if (entry.ShouldFlush(utcNow) && entry.Runtime.IsStarted)
                    _flushCandidates.Add(entry);
            }
        }

        if (_flushCandidates.Count == 0)
            return [];

        _flushReady.Clear();

        for (var i = 0; i < _flushCandidates.Count; i++)
        {
            // An idle runtime is left unmarked, so the tick after work arrives picks it up instead of waiting a fresh interval.
            if (_flushCandidates[i].Runtime.HasPendingWork)
                _flushReady.Add(_flushCandidates[i]);
        }

        if (_flushReady.Count == 0)
            return [];

        IUIRuntime[] result = new IUIRuntime[_flushReady.Count];

        lock (_sync)
        {
            for (var i = 0; i < _flushReady.Count; i++)
            {
                _flushReady[i].MarkFlushed(utcNow);
                result[i] = _flushReady[i].Runtime;
            }
        }

        return result;
    }

    public async ValueTask<int> CleanupAsync(DateTime utcNow, TimeSpan retention, TimeSpan unclaimedRetention)
    {
        if (retention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(retention), retention, "Retention cannot be negative.");

        if (unclaimedRetention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(unclaimedRetention), unclaimedRetention, "Unclaimed retention cannot be negative.");

        List<IUIRuntime> removed = [];
        List<UIRuntimeKey> removedKeys = [];

        lock (_sync)
        {
            foreach (KeyValuePair<UIRuntimeKey, UIRuntimeEntry> pair in _entries)
            {
                if (!pair.Value.ShouldCleanup(utcNow, retention, unclaimedRetention))
                    continue;

                removedKeys.Add(pair.Key);
                removed.Add(pair.Value.Runtime);
            }

            for (var i = 0; i < removedKeys.Count; i++)
                _ = RemoveEntryNoLock(removedKeys[i], out _);
        }

        await DisposeAllAsync(removed).ConfigureAwait(false);

        return removed.Count;
    }

    /// <summary>Disposes every runtime even when one throws, then throws what failed.</summary>
    /// <remarks>A runtime's dispose runs application code; one that throws must not leave the rest holding their scopes and pumps.</remarks>
    private static async ValueTask DisposeAllAsync(IReadOnlyList<IUIRuntime> runtimes)
    {
        List<Exception>? failures = null;

        for (var i = 0; i < runtimes.Count; i++)
        {
            try
            {
                await runtimes[i].DisposeAsync().ConfigureAwait(false);
            }
            catch (Exception exception)
            {
                (failures ??= []).Add(exception);
            }
        }

        if (failures is not null)
            throw new AggregateException("Disposing one or more UI runtimes failed.", failures);
    }

    public ValueTask DisposeAsync()
        => DisposeAllAsync(ClearAll());

    public void Dispose()
    {
        IUIRuntime[] runtimes = ClearAll();
        List<Exception>? failures = null;

        for (var i = 0; i < runtimes.Length; i++)
        {
            try
            {
                runtimes[i].Dispose();
            }
            catch (Exception exception)
            {
                (failures ??= []).Add(exception);
            }
        }

        if (failures is not null)
            throw new AggregateException("Disposing one or more UI runtimes failed.", failures);
    }

    private IUIRuntime[] ClearAll()
    {
        lock (_sync)
        {
            IUIRuntime[] runtimes = [.. _entries.Values.Select(static entry => entry.Runtime)];
            _entries.Clear();
            _instanceKeys.Clear();
            _sessionKeys.Clear();

            return runtimes;
        }
    }
}
