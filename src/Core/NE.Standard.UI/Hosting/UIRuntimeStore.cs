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
    /// Releases an instance from whatever entry it was mapped to before, when it is attaching to a different
    /// key. Without this the old entry keeps the instance in its connection set forever, so
    /// <c>DisconnectedAtUtc</c> is never set, <c>ShouldCleanup</c> never fires, and that runtime leaks for the
    /// lifetime of the process. Unreachable while every navigation is a full page load and therefore a fresh
    /// connection id — client-side navigation is what makes one connection attach to a second route.
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
