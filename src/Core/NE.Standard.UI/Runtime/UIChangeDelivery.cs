using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

/// <summary>
/// Sends a change set to a runtime's attached instances, each as <see cref="IUIRuntime.ChangesFor"/> gives it: without what its
/// snapshot or its own write already holds — each with its runs of inserts on one list merged (<see cref="UICollectionInsertMerge"/>).
/// </summary>
internal static class UIChangeDelivery
{
    /// <summary>
    /// Sends every instance its share; a send that fails stops no other, asks the runtime for a full resync — the instance it missed
    /// is otherwise stale for good — and is thrown once the rest are sent.
    /// </summary>
    public static async Task SendAsync(IUIUpdateSink sink, IUIRuntime runtime, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken)
    {
        List<string>? unaffected = null;
        ExceptionDispatchInfo? failure = null;

        foreach (var instanceId in instanceIds)
        {
            ServerChangeSet own = runtime.ChangesFor(instanceId, changes);

            // Merged only once the watermark has cut it: the merged set carries no queue numbers.
            if (ReferenceEquals(own, changes))
                (unaffected ??= []).Add(instanceId);
            else if (!own.IsEmpty)
                failure = await TrySendAsync(sink, handle, [instanceId], UICollectionInsertMerge.Merge(own), failure, cancellationToken).ConfigureAwait(false);
        }

        if (unaffected is not null)
            failure = await TrySendAsync(sink, handle, unaffected, UICollectionInsertMerge.Merge(changes), failure, cancellationToken).ConfigureAwait(false);

        if (failure is null)
            return;

        // A resync that failed is not asked for again: it would fail the same way, and the pump would spin on it.
        if (!IsFullResync(changes) && !runtime.IsStopped)
            RequestFullResync(runtime);

        failure.Throw();
    }

    /// <summary>Sends one share, answering the first failure of the delivery: <paramref name="failure"/> where one came before, else this one's.</summary>
    private static async Task<ExceptionDispatchInfo?> TrySendAsync(IUIUpdateSink sink, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, ExceptionDispatchInfo? failure, CancellationToken cancellationToken)
    {
        try
        {
            await sink.SendChangesAsync(handle, instanceIds, changes, cancellationToken).ConfigureAwait(false);

            return failure;
        }
        catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
        {
            return failure ?? ExceptionDispatchInfo.Capture(exception);
        }
    }

    private static bool IsFullResync(ServerChangeSet changes)
    {
        foreach (ServerUIUpdate update in changes.Updates)
        {
            if (update is ServerFullResyncUIUpdate)
                return true;
        }

        return false;
    }

    private static void RequestFullResync(IUIRuntime runtime)
    {
        try
        {
            runtime.RequestFullResync();
        }
        catch (ObjectDisposedException)
        {
            // Gone meanwhile: there is no page left to bring back.
        }
    }
}
