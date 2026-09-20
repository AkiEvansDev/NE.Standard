using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Hosting;

internal sealed class UIRuntimeEntry
{
    private readonly HashSet<string> _connectionIds = new(StringComparer.Ordinal);
    private readonly TaskCompletionSource _initialization = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private long _lastSessionActivityPersistTicksUtc;

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
    /// Completes once the creating attach has initialized and started the runtime.
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

    /// <summary>
    /// Whether a real tab has ever presented this runtime, as opposed to the render that built it.
    /// </summary>
    public bool IsAdopted { get; private set; }

    public void MarkAdopted()
        => IsAdopted = true;

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

    // Deliberately not gated on IsConnected: a disconnected runtime's pending updates still need draining.
    public bool ShouldFlush(DateTime utcNow)
        => Flush.IsScheduled && LastFlushedAtUtc + Flush.Interval <= utcNow;

    /// <summary>
    /// Whether this entry is past its retention window — the short one until a page has presented it. A runtime with a
    /// command in flight is kept regardless, collected on a later sweep once it finishes.
    /// </summary>
    public bool ShouldCleanup(DateTime utcNow, TimeSpan retention, TimeSpan unclaimedRetention)
        => !Runtime.HasCommandsInFlight
        && DisconnectedAtUtc is DateTime disconnectedAt
        && disconnectedAt + (IsAdopted ? retention : unclaimedRetention) <= utcNow;

    /// <summary>
    /// Claims the right to refresh the session's last-seen time now, throttled so hub traffic does not turn into
    /// a session-store write per message.
    /// </summary>
    public bool ShouldPersistSessionActivity(DateTime utcNow, TimeSpan throttle)
    {
        var previousTicks = Interlocked.Read(ref _lastSessionActivityPersistTicksUtc);

        if (utcNow.Ticks - previousTicks < throttle.Ticks)
            return false;

        return Interlocked.CompareExchange(ref _lastSessionActivityPersistTicksUtc, utcNow.Ticks, previousTicks) == previousTicks;
    }
}
