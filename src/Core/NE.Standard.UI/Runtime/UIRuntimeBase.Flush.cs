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
    public Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
        => FlushAsync(DrainTarget.Flush, cancellationToken);

    private async Task<ServerChangeSet> FlushAsync(DrainTarget target, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        EnsureStarted();

        // Held as a command holds it: a window reload awaits the author's data, which a runtime disposed meanwhile would take away.
        // One asked to go has nobody left to send to, and is no failure of the scheduled pass.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);

        if (Volatile.Read(ref _disposeRequested) != 0)
            return ServerChangeSet.Empty;

        return await DrainAsync(action: null, target, publish: true, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<bool> FlushToDispatcherAsync(CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await FlushAsync(DrainTarget.Dispatched, cancellationToken).ConfigureAwait(false);

        return !changes.IsEmpty && AttachedInstanceIds.Count > 0;
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
    /// What one caller's answer carries: nothing. Where the runtime sends as it drains, the caller's share went out with every
    /// instance's; where it batches, its copy went to the dispatcher for it alone, behind every set drained before it and ahead of every
    /// set drained after, and the answer goes once that copy is sent, so the answer's effects act on the page its changes made. The copy
    /// comes back only where the dispatcher took none.
    /// </summary>
    private async Task<ServerChangeSet> AnswerAsync(string instanceId, CancellationToken cancellationToken)
    {
        if (SendsWhatItDrains)
        {
            // Taken whole and sent to every instance, whoever asked.
            _ = await DrainAsync(action: null, DrainTarget.Leave, publish: true, cancellationToken).ConfigureAwait(false);

            return ServerChangeSet.Empty;
        }

        AnswerSends sends = new();
        ServerChangeSet changes = await DrainAsync(action: null, DrainTarget.Answer(instanceId, sends), publish: true, cancellationToken).ConfigureAwait(false);

        if (sends.Sent is { } sent)
            await sent.WaitAsync(cancellationToken).ConfigureAwait(false);

        return UIChangeDelivery.MergeRuns(changes);
    }
}
