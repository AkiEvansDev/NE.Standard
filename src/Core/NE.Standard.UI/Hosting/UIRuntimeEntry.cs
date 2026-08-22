using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Hosting;

internal sealed class UIRuntimeEntry
{
    private readonly HashSet<string> _connectionIds = new(StringComparer.Ordinal);
    private readonly TaskCompletionSource _initialization = new(TaskCreationOptions.RunContinuationsAsynchronously);

    public UIRuntimeEntry(IUIRuntime runtime, UIFlushOptions flush)
    {
        ArgumentNullException.ThrowIfNull(runtime);

        flush.Validate();

        Runtime = runtime;
        Flush = flush;
    }

    public IUIRuntime Runtime { get; }
    public UIFlushOptions Flush { get; }

    /// <summary>
    /// Completes once the creating attach has initialized and started the runtime. Created with the entry,
    /// inside the store's lock, so a concurrent attach that finds the entry already present has something to
    /// await instead of using a runtime that has not been started yet.
    /// </summary>
    public Task Initialization => _initialization.Task;

    public void MarkInitialized()
        => _initialization.TrySetResult();

    public void MarkInitializationFailed(Exception error)
        => _initialization.TrySetException(error);

    public int ConnectionCount => _connectionIds.Count;
    public string[] InstanceIds => [.. _connectionIds];
    public DateTime LastSeenAtUtc { get; private set; }
    public DateTime LastFlushedAtUtc { get; private set; }
    public DateTime? DisconnectedAtUtc { get; private set; }

    public bool IsConnected => _connectionIds.Count > 0;

    public bool HasInstance(string connectionId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionId);

        return _connectionIds.Contains(connectionId);
    }

    public bool Attach(string connectionId, DateTime utcNow)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionId);

        var added = _connectionIds.Add(connectionId);

        LastSeenAtUtc = utcNow;
        DisconnectedAtUtc = null;

        if (LastFlushedAtUtc == default)
            LastFlushedAtUtc = utcNow;

        return added;
    }

    public void MarkFlushed(DateTime utcNow)
    {
        LastFlushedAtUtc = utcNow;
        LastSeenAtUtc = utcNow;
    }

    public bool Detach(string connectionId, DateTime utcNow)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionId);

        if (!_connectionIds.Remove(connectionId))
            return false;

        LastSeenAtUtc = utcNow;

        if (_connectionIds.Count == 0)
            DisconnectedAtUtc = utcNow;

        return true;
    }

    // Deliberately not gated on IsConnected: a disconnected runtime whose controller keeps working still has
    // to have its pending updates drained, or they accumulate untouched until the retention window expires.
    public bool ShouldFlush(DateTime utcNow)
        => Flush.IsScheduled && LastFlushedAtUtc + Flush.Interval <= utcNow;

    public bool ShouldCleanup(DateTime utcNow, TimeSpan retention)
        => DisconnectedAtUtc is DateTime disconnectedAt && disconnectedAt + retention <= utcNow;
}
