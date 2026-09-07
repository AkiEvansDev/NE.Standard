using System;
using System.Collections.Generic;
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

    public bool TryGetAttached(UIRuntimeKey key, string instanceId, out IUIRuntime? runtime)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);

        lock (_sync)
        {
            if (_entries.TryGetValue(key, out UIRuntimeEntry? entry) &&
                entry.HasInstance(instanceId))
            {
                runtime = entry.Runtime;
                return true;
            }

            runtime = null;
            return false;
        }
    }

    /// <summary>
    /// The one runtime this session has on this address, when it has exactly one.
    /// </summary>
    public bool TryGetSingle(string sessionId, string route, string? identity, out IUIRuntime? runtime)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(sessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(route);

        runtime = null;

        lock (_sync)
        {
            foreach (KeyValuePair<UIRuntimeKey, UIRuntimeEntry> pair in _entries)
            {
                UIRuntimeKey key = pair.Key;

                if (!StringComparer.Ordinal.Equals(key.SessionId, sessionId) ||
                    !StringComparer.Ordinal.Equals(key.Route, route) ||
                    !StringComparer.Ordinal.Equals(key.Identity, identity))
                {
                    continue;
                }

                // A runtime no page ever presented is the render's own provisional one, holding nothing it could not build itself.
                if (!pair.Value.IsAdopted)
                    continue;

                if (runtime is not null)
                {
                    runtime = null;
                    return false;
                }

                runtime = pair.Value.Runtime;
            }

            return runtime is not null;
        }
    }

    public UIRuntimeEntry GetOrAdd(UIRuntimeKey key, string instanceId, Func<IUIRuntime> factory, DateTime utcNow, UIFlushOptions flush, out bool created, out bool attached, out int activeInstances)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(factory);

        flush.Validate();

        lock (_sync)
        {
            created = false;
            attached = false;
            activeInstances = 0;

            if (!_entries.TryGetValue(key, out UIRuntimeEntry? entry))
            {
                entry = new UIRuntimeEntry(factory(), flush);
                _entries.Add(key, entry);

                created = true;
            }

            DetachFromPreviousEntryNoLock(instanceId, key, utcNow);

            attached = entry.Attach(instanceId, utcNow);
            activeInstances = entry.ConnectionCount;
            _instanceKeys[instanceId] = key;

            return entry;
        }
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
            if (!_entries.TryGetValue(from, out UIRuntimeEntry? entry))
                return false;

            _ = _entries.Remove(from);

            if (_entries.ContainsKey(to))
            {
                foreach (var instanceId in entry.InstanceIds)
                    _ = _instanceKeys.Remove(instanceId);

                discarded = entry.Runtime;
                return false;
            }

            _entries.Add(to, entry);

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
            List<UIRuntimeKey>? staleKeys = null;

            foreach (UIRuntimeKey key in _entries.Keys)
            {
                if (key.Equals(keep) || !StringComparer.Ordinal.Equals(key.SessionId, sessionId) || !StringComparer.Ordinal.Equals(key.WindowId, windowId))
                    continue;

                staleKeys ??= [];
                staleKeys.Add(key);
            }

            if (staleKeys is null)
                return [];

            IUIRuntime[] removed = new IUIRuntime[staleKeys.Count];

            for (var i = 0; i < staleKeys.Count; i++)
            {
                _ = _entries.Remove(staleKeys[i], out UIRuntimeEntry? entry);

                foreach (var instanceId in entry!.InstanceIds)
                    _ = _instanceKeys.Remove(instanceId);

                removed[i] = entry.Runtime;
            }

            return removed;
        }
    }

    public bool Remove(UIRuntimeKey key, out IUIRuntime? runtime)
    {
        lock (_sync)
        {
            if (!_entries.Remove(key, out UIRuntimeEntry? entry))
            {
                runtime = null;
                return false;
            }

            foreach (var instanceId in entry.InstanceIds)
                _ = _instanceKeys.Remove(instanceId);

            runtime = entry.Runtime;
            return true;
        }
    }

    public IUIRuntime[] GetRuntimesReadyToFlush(DateTime utcNow)
    {
        lock (_sync)
        {
            if (_entries.Count == 0)
                return [];

            List<IUIRuntime> result = [];

            foreach (UIRuntimeEntry entry in _entries.Values)
            {
                if (!entry.ShouldFlush(utcNow))
                    continue;

                // An idle runtime is left unmarked, so the tick after work arrives picks it up instead of waiting a fresh interval.
                if (!entry.Runtime.HasPendingWork)
                    continue;

                entry.MarkFlushed(utcNow);
                result.Add(entry.Runtime);
            }

            return [.. result];
        }
    }

    public async ValueTask<int> CleanupAsync(DateTime utcNow, TimeSpan retention)
    {
        if (retention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(retention), retention, "Retention cannot be negative.");

        List<IUIRuntime> removed = [];
        List<UIRuntimeKey> removedKeys = [];

        lock (_sync)
        {
            foreach (KeyValuePair<UIRuntimeKey, UIRuntimeEntry> pair in _entries)
            {
                if (!pair.Value.ShouldCleanup(utcNow, retention))
                    continue;

                removedKeys.Add(pair.Key);
                removed.Add(pair.Value.Runtime);

                foreach (var instanceId in pair.Value.InstanceIds)
                    _ = _instanceKeys.Remove(instanceId);
            }

            for (var i = 0; i < removedKeys.Count; i++)
                _ = _entries.Remove(removedKeys[i]);
        }

        for (var i = 0; i < removed.Count; i++)
            await removed[i].DisposeAsync().ConfigureAwait(false);

        return removed.Count;
    }

    public async ValueTask DisposeAsync()
    {
        IUIRuntime[] runtimes = ClearAll();

        for (var i = 0; i < runtimes.Length; i++)
            await runtimes[i].DisposeAsync().ConfigureAwait(false);
    }

    public void Dispose()
    {
        IUIRuntime[] runtimes = ClearAll();

        for (var i = 0; i < runtimes.Length; i++)
            runtimes[i].Dispose();
    }

    private IUIRuntime[] ClearAll()
    {
        lock (_sync)
        {
            IUIRuntime[] runtimes = [.. _entries.Values.Select(static entry => entry.Runtime)];
            _entries.Clear();
            _instanceKeys.Clear();

            return runtimes;
        }
    }
}
