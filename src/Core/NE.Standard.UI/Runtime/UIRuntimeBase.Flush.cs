using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public bool HasPendingWork
        => Controller.HasPendingChanges
            || _pendingUpdates.Count > 0
            || _dirtyItemWindows is { Count: > 0 }
            || Volatile.Read(ref _fullResyncRequested) == 1;

    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        return InSendOrderAsync(() => FlushCoreAsync(DrainTarget.Flush, publish: true, cancellationToken), cancellationToken);
    }

    /// <summary>
    /// Runs a drain and the send of what it took as one turn, where this runtime sends as it drains: sent outside the state lock,
    /// two change sets drained one after the other could otherwise leave in the other order. Never nested — the turn is not
    /// re-entrant — and never taken while the state lock is held.
    /// </summary>
    private async Task<T> InSendOrderAsync<T>(Func<Task<T>> drainAndSend, CancellationToken cancellationToken)
    {
        if (!SendsWhatItDrains)
            return await drainAndSend().ConfigureAwait(false);

        await _sendOrder.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return await drainAndSend().ConfigureAwait(false);
        }
        finally
        {
            _ = _sendOrder.Release();
        }
    }

    private async Task<ServerChangeSet> FlushCoreAsync(DrainTarget target, bool publish, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await DrainAsync(action: null, target, cancellationToken).ConfigureAwait(false);

        return publish
            ? await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false)
            : changes;
    }

    /// <summary>
    /// The one drain: an optional action under the state lock, then controller changes, stale windows and pending updates, with
    /// window reloads appended outside the lock. Both flush and invoke go through it.
    /// </summary>
    private async Task<ServerChangeSet> DrainAsync(Func<CancellationToken, Task>? action, DrainTarget target, CancellationToken cancellationToken)
    {
        ServerChangeSet changes;
        List<UIComponentId>? staleWindows;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (action is not null)
                await action(cancellationToken).ConfigureAwait(false);

            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
            changes = TakePendingUpdatesNoLock(target);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return await AppendItemWindowReloadsAsync(changes, staleWindows, target, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// A caller's answer, in its own turn of the send order: what <see cref="AnswerCoreAsync"/> gives it.
    /// </summary>
    private Task<ServerChangeSet> AnswerAsync(string instanceId, CancellationToken cancellationToken)
        => InSendOrderAsync(() => AnswerCoreAsync(instanceId, cancellationToken), cancellationToken);

    /// <summary>
    /// What one caller's answer carries: its own copy where the runtime batches, the rest left for the flush to send the other
    /// attached instances; nothing where the runtime sends as it drains, since the change set it drains goes to every instance,
    /// the caller's included.
    /// </summary>
    private async Task<ServerChangeSet> AnswerCoreAsync(string instanceId, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await FlushCoreAsync(DrainTarget.Answer(instanceId), publish: true, cancellationToken).ConfigureAwait(false);

        return SendsWhatItDrains ? ServerChangeSet.Empty : changes;
    }
}
