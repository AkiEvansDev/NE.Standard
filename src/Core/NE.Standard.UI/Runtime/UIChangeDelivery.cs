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
/// snapshot or its own write already holds — each with its runs of inserts and of removes on one list merged
/// (<see cref="UICollectionInsertMerge"/>, <see cref="UICollectionRemoveMerge"/>).
/// </summary>
internal static class UIChangeDelivery
{
    /// <inheritdoc cref="SendAsync(IUIUpdateSink, IUIRuntime, UIHandle, IReadOnlyCollection{string}, ServerChangeSet, TimeSpan, CancellationToken)"/>
    public static Task SendAsync(IUIUpdateSink sink, IUIRuntime runtime, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken)
        => SendAsync(sink, runtime, handle, instanceIds, changes, Timeout.InfiniteTimeSpan, cancellationToken);

    /// <summary>
    /// Sends every instance its share, all at once, each given up past <paramref name="timeout"/>; a send that fails or is given up
    /// stops no other, asks the runtime for a full resync — the instance it missed is otherwise stale for good — and is thrown once the
    /// rest are sent.
    /// </summary>
    /// <remarks>
    /// At once rather than one after another, so one stalled socket holds the others' share no longer than the timeout; the caller
    /// waits for the whole delivery before the next set, which keeps each instance's sets in order. A web send given up aborts that
    /// one connection, whose page attaches again.
    /// </remarks>
    public static async Task SendAsync(IUIUpdateSink sink, IUIRuntime runtime, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, TimeSpan timeout, CancellationToken cancellationToken)
    {
        List<string>? unaffected = null;
        List<Task>? sends = null;

        using CancellationTokenSource? limit = timeout == Timeout.InfiniteTimeSpan ? null : CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        limit?.CancelAfter(timeout);

        CancellationToken sendToken = limit?.Token ?? cancellationToken;

        foreach (var instanceId in instanceIds)
        {
            ServerChangeSet own = runtime.ChangesFor(instanceId, changes);

            // Merged only once the watermark has cut it: the merged set carries no queue numbers.
            if (ReferenceEquals(own, changes))
                (unaffected ??= []).Add(instanceId);
            else if (!own.IsEmpty)
                (sends ??= []).Add(StartSend(sink, handle, [instanceId], MergeRuns(own), sendToken));
        }

        if (unaffected is not null)
            (sends ??= []).Add(StartSend(sink, handle, unaffected, MergeRuns(changes), sendToken));

        if (sends is null)
            return;

        ExceptionDispatchInfo? failure = null;

        for (var i = 0; i < sends.Count; i++)
        {
            try
            {
                failure = await TryAwaitAsync(sends[i], failure, cancellationToken).ConfigureAwait(false);
            }
            catch (OperationCanceledException)
            {
                // Stopping: the others are observed rather than awaited, since a send may never come back from a stop.
                for (var j = i + 1; j < sends.Count; j++)
                    Observe(sends[j]);

                throw;
            }
        }

        if (failure is null)
            return;

        // A resync that failed is not asked for again: it would fail the same way, and the pump would spin on it.
        if (!IsFullResync(changes) && !runtime.IsStopped)
            RequestFullResync(runtime);

        failure.Throw();
    }

    /// <summary>One instance's share with its runs of inserts and of removes on one list merged, each into one.</summary>
    public static ServerChangeSet MergeRuns(ServerChangeSet changes)
        => UICollectionRemoveMerge.Merge(UICollectionInsertMerge.Merge(changes));

    /// <summary>Starts one share's send; a sink that throws before its first await answers a faulted send, as one that throws after.</summary>
    private static Task StartSend(IUIUpdateSink sink, UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken)
    {
        try
        {
            return sink.SendChangesAsync(handle, instanceIds, changes, cancellationToken);
        }
        catch (Exception exception)
        {
            return Task.FromException(exception);
        }
    }

    /// <summary>
    /// Waits for one share's send, answering the first failure of the delivery: <paramref name="failure"/> where one came before, else
    /// this one's — a send given up past its timeout among them; only the delivery's own cancellation is thrown.
    /// </summary>
    private static async Task<ExceptionDispatchInfo?> TryAwaitAsync(Task send, ExceptionDispatchInfo? failure, CancellationToken cancellationToken)
    {
        try
        {
            await send.ConfigureAwait(false);

            return failure;
        }
        catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
        {
            return failure ?? ExceptionDispatchInfo.Capture(exception);
        }
    }

    /// <summary>Reads a send's failure once it ends, so a fault nobody waits for is not reported unobserved.</summary>
    private static void Observe(Task send)
        => _ = send.ContinueWith(static ended => _ = ended.Exception, CancellationToken.None, TaskContinuationOptions.OnlyOnFaulted | TaskContinuationOptions.ExecuteSynchronously, TaskScheduler.Default);

    /// <summary>Whether the set carries a full resync; the dispatcher's queue never joins one.</summary>
    internal static bool IsFullResync(ServerChangeSet changes)
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
