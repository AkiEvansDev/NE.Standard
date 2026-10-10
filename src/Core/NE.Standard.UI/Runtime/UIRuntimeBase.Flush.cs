using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
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
    public async Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        // Held as a command holds it: a window reload awaits the author's data, which a runtime disposed meanwhile would take away.
        // One asked to go has nobody left to send to, and is no failure of the scheduled pass.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);

        if (Volatile.Read(ref _disposeRequested) != 0)
            return ServerChangeSet.Empty;

        return await DrainAsync(action: null, DrainTarget.Flush, publish: true, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Runs a drain and the send of what it took as one turn, where this runtime sends as it drains: sent outside the state lock,
    /// two change sets drained one after the other could otherwise leave in the other order. Never nested — the turn is not
    /// re-entrant — never taken while the state lock is held, and never held around a source's read or write, which may await this
    /// runtime as a command may.
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

    /// <summary>
    /// The one drain, which flush, invoke and every answer go through: a turn that takes what is pending — an optional action under
    /// the state lock first — and sends it where <paramref name="publish"/>; then the windows it found stale re-read outside every
    /// turn, and what the reads wrote taken and sent in a turn of its own.
    /// </summary>
    private async Task<ServerChangeSet> DrainAsync(Func<CancellationToken, Task>? action, DrainTarget target, bool publish, CancellationToken cancellationToken)
    {
        (ServerChangeSet changes, List<UIComponentId>? staleWindows) = await InSendOrderAsync(() => DrainTurnAsync(action, target, publish, cancellationToken), cancellationToken).ConfigureAwait(false);

        return await AppendItemWindowReloadsAsync(changes, staleWindows, target, publish, cancellationToken).ConfigureAwait(false);
    }

    private async Task<(ServerChangeSet Changes, List<UIComponentId>? StaleWindows)> DrainTurnAsync(Func<CancellationToken, Task>? action, DrainTarget target, bool publish, CancellationToken cancellationToken)
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

        return (publish ? await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false) : changes, staleWindows);
    }

    /// <summary>
    /// What one caller's answer carries: its own copy where the runtime batches, the rest left for the flush to send the other
    /// attached instances; nothing where the runtime sends as it drains, since the change set it drains goes to every instance,
    /// the caller's included.
    /// </summary>
    private async Task<ServerChangeSet> AnswerAsync(string instanceId, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await DrainAsync(action: null, DrainTarget.Answer(instanceId), publish: true, cancellationToken).ConfigureAwait(false);

        return SendsWhatItDrains ? ServerChangeSet.Empty : changes;
    }
}
