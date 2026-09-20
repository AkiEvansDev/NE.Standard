using System;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Defines how long UI runtime instances are retained.
/// </summary>
/// <remarks>
/// All three are keyed so a reload always finds the runtime it left; what differs is what happens when the tab leaves the address.
/// </remarks>
public enum UIRuntimeLifetime
{
    /// <summary>
    /// State belongs to the page: kept across a reload of the same address, dropped the moment the window goes
    /// somewhere else. Coming back is a fresh page.
    /// </summary>
    PerPage = 0,

    /// <summary>
    /// State belongs to the window (a browser tab, a desktop window): kept across a reload and across leaving the address,
    /// so coming back finds the page as it was; another window of the same client gets its own.
    /// </summary>
    PerWindow = 1,

    /// <summary>
    /// State belongs to the client: one runtime per address, shared by every window. Changes fan out to all; a command
    /// still runs for the connection that raised it, per <see cref="UIContext.Handle"/>.
    /// </summary>
    PerClient = 2
}

/// <summary>
/// Configures UI runtime persistence, retention, and scheduler intervals.
/// </summary>
public sealed class UIPersistenceOptions
{
    /// <summary>
    /// Gets or sets how runtime instances are retained.
    /// </summary>
    public UIRuntimeLifetime Lifetime { get; set; } = UIRuntimeLifetime.PerWindow;

    /// <summary>
    /// Gets or sets how long a disconnected runtime is retained.
    /// </summary>
    public TimeSpan DisconnectedRetention { get; set; } = TimeSpan.FromMinutes(10);

    /// <summary>
    /// Gets or sets how long a runtime the page render built is kept for the client that page belongs to.
    /// </summary>
    /// <remarks>
    /// A render nobody ever attaches to (a crawler, a health check, a closed tab) is already dead, so holding it for
    /// <see cref="DisconnectedRetention"/> would waste memory; losing the race only costs a fresh runtime.
    /// </remarks>
    public TimeSpan UnclaimedRenderRetention { get; set; } = TimeSpan.FromSeconds(30);

    /// <summary>
    /// Gets or sets how often pending runtime changes are flushed.
    /// </summary>
    public TimeSpan FlushSchedulerInterval { get; set; } = TimeSpan.FromMilliseconds(50);

    /// <summary>
    /// Gets or sets the maximum number of runtimes flushed concurrently by the scheduled flush task.
    /// </summary>
    public int MaxParallelFlushes { get; set; } = Math.Max(1, Environment.ProcessorCount);

    /// <summary>
    /// Gets or sets how many change sets may wait to reach one runtime's clients before the queue is dropped.
    /// </summary>
    /// <remarks>
    /// A client that stops reading builds a queue behind the flush; past this many, the queue is dropped and the runtime is
    /// asked for a full resync instead.
    /// </remarks>
    public int MaxQueuedChangeSets { get; set; } = 64;

    /// <summary>
    /// Gets or sets how often disconnected runtime cleanup runs.
    /// </summary>
    /// <remarks>
    /// The sweep is what ends a retention, so a runtime lives its retention plus up to one sweep. The host runs this at the
    /// shorter of it and <see cref="UnclaimedRenderRetention"/>, so raising it can't outlive that shorter retention.
    /// </remarks>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromMinutes(1);

    /// <summary>
    /// Validates persistence options.
    /// </summary>
    public void Validate()
    {
        if (DisconnectedRetention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(DisconnectedRetention), DisconnectedRetention, "Disconnected retention cannot be negative.");

        if (UnclaimedRenderRetention < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(UnclaimedRenderRetention), UnclaimedRenderRetention, "Unclaimed render retention cannot be negative.");

        if (FlushSchedulerInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(FlushSchedulerInterval), FlushSchedulerInterval, "Flush scheduler interval must be greater than zero.");

        if (MaxParallelFlushes <= 0)
            throw new ArgumentOutOfRangeException(nameof(MaxParallelFlushes), MaxParallelFlushes, "Max parallel flushes must be greater than zero.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Cleanup interval must be greater than zero.");
    }
}
