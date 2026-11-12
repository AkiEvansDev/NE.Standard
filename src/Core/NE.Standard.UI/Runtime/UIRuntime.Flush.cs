using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    /// <inheritdoc />
    public bool HasPendingWork
        => Controller.HasPendingChanges
            || _pendingUpdateCount > 0
            || _dirtyItemWindows is { Count: > 0 }
            || Volatile.Read(ref _fullResyncRequested) == 1;

    private async Task<ServerChangeSet> FlushAsync(DrainTarget target, CancellationToken cancellationToken)
    {
        ThrowIfDisposed();
        EnsureStarted();

        // Held as a command holds it: a window reload awaits the author's data, which a runtime disposed meanwhile would take away.
        // One asked to go has nobody left to send to, and is no failure of the scheduled pass.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);

        if (Volatile.Read(ref _disposeRequested) != 0)
            return ServerChangeSet.Empty;

        return await DrainAsync(action: null, target, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public async Task<bool> FlushToDispatcherAsync(CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await FlushAsync(DrainTarget.Dispatched, cancellationToken).ConfigureAwait(false);

        return !changes.IsEmpty && AttachedInstanceIds.Count > 0;
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> FlushAndSendAsync(CancellationToken cancellationToken)
    {
        DrainSends sends = new();
        ServerChangeSet changes = await FlushAsync(DrainTarget.DispatchedAwaited(sends), cancellationToken).ConfigureAwait(false);

        // Outside the hold: the send waits its turn behind whatever an earlier flush queued.
        if (sends.Sent is { } sent)
            await sent.WaitAsync(cancellationToken).ConfigureAwait(false);

        return changes;
    }

    /// <summary>
    /// The one drain, which flush, invoke and every answer go through: a turn that takes what is pending — an optional action under
    /// the state lock first — for its target; then the windows it found stale re-read outside every turn, and what the reads wrote
    /// taken in a turn of its own.
    /// </summary>
    private async Task<ServerChangeSet> DrainAsync(Func<CancellationToken, Task>? action, DrainTarget target, CancellationToken cancellationToken)
    {
        (ServerChangeSet changes, List<UIComponentId>? staleWindows) = await DrainTurnAsync(action, target, cancellationToken).ConfigureAwait(false);

        return await AppendItemWindowReloadsAsync(changes, staleWindows, target, cancellationToken).ConfigureAwait(false);
    }

    private async Task<(ServerChangeSet Changes, List<UIComponentId>? StaleWindows)> DrainTurnAsync(Func<CancellationToken, Task>? action, DrainTarget target, CancellationToken cancellationToken)
    {
        ServerChangeSet changes;
        List<UIComponentId>? staleWindows;

        ThrowIfInsideAction("A flush or a push of effects");

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (action is not null)
                await RunHoldingStateLockAsync(action, cancellationToken).ConfigureAwait(false);

            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
            changes = TakePendingUpdatesNoLock(target);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return (changes, staleWindows);
    }

    /// <summary>
    /// Refuses a call that waits for a runtime's state lock from inside an action of any runtime: on its own runtime it would wait on
    /// itself, and on another — whose own action, started elsewhere, may wait for this one — on each other, for good.
    /// </summary>
    /// <remarks>
    /// Any runtime's, not only the one called: no hold is ever taken inside another, so the flow's latest hold is the only one to ask.
    /// </remarks>
    internal static void ThrowIfInsideAction(string call)
    {
        if (HeldStateLock.Value is { Released: false })
            throw new InvalidOperationException($"{call} was called from inside an InvokeAsync action, which holds its runtime's state lock until it returns; write the state directly, call it once the action has returned, or Post the work to the other runtime.");
    }

    /// <summary>Runs an action under the state lock with its flow marked (<see cref="HeldStateLock"/>).</summary>
    private static async Task RunHoldingStateLockAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken)
    {
        // Set in this method, so it reverts as it returns; released by hand for work the action started that outlives it.
        StateLockHold hold = new();
        HeldStateLock.Value = hold;

        try
        {
            await action(cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            hold.Released = true;
        }
    }

    /// <summary>The state-lock hold an action runs in, on the action's flow, so a call back in is refused rather than left waiting.</summary>
    private static readonly AsyncLocal<StateLockHold?> HeldStateLock = new();

    private sealed class StateLockHold
    {
        public bool Released { get; set; }
    }

    /// <summary>
    /// What one caller's answer carries: nothing, as a rule. Its copy went to the dispatcher for it alone, behind every set drained
    /// before it and ahead of every set drained after, and the answer goes once that copy is sent, so the answer's effects act on the
    /// page its changes made. The copy comes back only where the dispatcher took none.
    /// </summary>
    private async Task<ServerChangeSet> AnswerAsync(string instanceId, CancellationToken cancellationToken)
    {
        DrainSends sends = new();
        ServerChangeSet changes = await DrainAsync(action: null, DrainTarget.Answer(instanceId, sends), cancellationToken).ConfigureAwait(false);

        if (sends.Sent is { } sent)
            await sent.WaitAsync(cancellationToken).ConfigureAwait(false);

        return UIChangeDelivery.MergeRuns(changes);
    }
}
