using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIDirectRuntime(UIHandle handle, CompiledView view, IUIController controller, UIClientServices clientServices, UIApplication application, UIHost host) : UIRuntimeBase(handle, view, controller, clientServices, application, host)
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Direct UI runtime change publishing failed for '{InstanceId}'.")]
        public static partial void DirectChangePublishingFailed(ILogger logger, Exception exception, string instanceId);
    }

    // What the pump's queue may hold. It grows only while the pump is held up — a send to a client that stopped reading — and
    // past this the page is resynced whole instead, as the dispatcher does for a batch runtime's queue.
    private const int MaxQueuedChanges = 16_384;

    private readonly ConcurrentQueue<RecursiveChange> _directChanges = new();
    private readonly SemaphoreSlim _directSignal = new(0);
    private readonly CancellationTokenSource _directCancellation = new();

    private int _directQueued;
    private int _pumpSignaled;

    private Task? _directPump;

    protected override bool SendsWhatItDrains => true;

    protected override bool TakesChangesOnPump => true;

    // The pump's queue as well: a write it has not reached is in the state already. Woken after, so the other instances are sent it.
    protected override void QueueUntakenControllerChangesNoLock()
    {
        QueueExternalChangesNoLock(DrainDirectChanges());
        SignalPump();
    }

    protected override void OnStartedNoLock()
    {
        Controller.SetChangeNotifier(EnqueueDirectChange);
        _directPump ??= Task.Run(ProcessDirectChangesAsync);
    }

    private void EnqueueDirectChange(RecursiveChange change)
    {
        ArgumentNullException.ThrowIfNull(change);

        if (_directCancellation.IsCancellationRequested)
            return;

        if (Interlocked.Increment(ref _directQueued) > MaxQueuedChanges)
        {
            // Dropped rather than held: the resync reads the whole state, this change included.
            _ = Interlocked.Decrement(ref _directQueued);
            ((IUIRuntimeAccess)this).RequestFullResync();
            return;
        }

        _directChanges.Enqueue(change);
        SignalPump();
    }

    private void SignalPump()
    {
        // One wake covers every change queued before the pump takes the queue; a release per change would wake it once per
        // change, to find the queue empty every time after the first.
        if (Interlocked.Exchange(ref _pumpSignaled, 1) != 0)
            return;

        try
        {
            _ = _directSignal.Release();
        }
        catch (ObjectDisposedException)
        {
            // Released after teardown: the pump is gone and there is nobody left to wake.
        }
    }

    protected override void OnFullResyncRequested()
    {
        if (!_directCancellation.IsCancellationRequested)
            SignalPump();
    }

    private async Task ProcessDirectChangesAsync()
    {
        CancellationToken cancellationToken = _directCancellation.Token;

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await _directSignal.WaitAsync(cancellationToken).ConfigureAwait(false);

                // Lowered before the queue is taken: a change queued from here on raises it again and wakes the pump once more.
                _ = Interlocked.Exchange(ref _pumpSignaled, 0);

                // Taken under the state lock, and on every wake: a resync request or what a snapshot queued can come with no change.
                _ = await PublishExternalControllerChangesAsync(DrainDirectChanges, cancellationToken).ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                return;
            }
            catch (ObjectDisposedException)
            {
                return;
            }
            catch (Exception exception)
            {
                TryLogDirectPublishingFailure(exception);
            }
        }
    }

    private RecursiveChange[] DrainDirectChanges()
    {
        if (_directChanges.IsEmpty)
            return [];

        List<RecursiveChange> changes = [];

        while (_directChanges.TryDequeue(out RecursiveChange? change))
            changes.Add(change);

        _ = Interlocked.Add(ref _directQueued, -changes.Count);

        return [.. changes];
    }

    private void TryLogDirectPublishingFailure(Exception exception)
    {
        try
        {
            if (Controller is IUIContextController contextController)
                Log.DirectChangePublishingFailed(contextController.Context.Logger, exception, Connection.Handle.Instance.Id);
        }
        catch
        {
            // A logger that throws must not turn a failure already recovered from into a new one.
        }
    }

    protected override void OnStoppingNoLock()
    {
        Controller.SetChangeNotifier(null);

        _directCancellation.Cancel();

        SignalPump();
    }

    protected override async Task<ServerChangeSet> PublishChangesAsync(ServerChangeSet changes, CancellationToken cancellationToken)
    {
        if (changes.IsEmpty)
            return changes;

        RuntimeConnection connection = Connection;

        await UIChangeDelivery
            .SendAsync(connection.ClientServices.Updates, this, connection.Handle, AttachedInstanceIds, changes, cancellationToken)
            .ConfigureAwait(false);

        return changes;
    }

    protected override async Task<UICommandExecutionResult> PublishCommandResultAsync(UICommandExecutionResult result, UIHandle invoker, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(result);

        result.Validate();

        ArgumentNullException.ThrowIfNull(invoker);

        await PushCommandResultAsync(invoker, result, cancellationToken).ConfigureAwait(false);

        if (result.Command.Effects.Length == 0)
            return result;

        // Effects are stripped here so the invoke's own return value does not apply them a second time.
        return result with { Command = new UICommandResult(result.Command.Success, effects: null, result.Command.Error) };
    }

    protected override void DisposeRuntimeResources()
    {
        Controller.SetChangeNotifier(null);

        _directCancellation.Cancel();

        SignalPump();

        // Bounded, not awaited: no async alternative here, and disposing under the pump would be worse than a short block —
        // mirrors DisposeRuntimeResourcesAsync's wait.
        if (_directPump is not null)
        {
            try
            {
                _ = _directPump.Wait(TimeSpan.FromSeconds(2));
            }
            catch (AggregateException aggregate) when (aggregate.InnerException is OperationCanceledException) { }
        }

        _directCancellation.Dispose();
        _directSignal.Dispose();
    }

    protected override async ValueTask DisposeRuntimeResourcesAsync()
    {
        Controller.SetChangeNotifier(null);

        await _directCancellation.CancelAsync().ConfigureAwait(false);

        SignalPump();

        if (_directPump is not null)
        {
            try
            {
                await _directPump.ConfigureAwait(false);
            }
            catch (OperationCanceledException) { }
        }

        _directCancellation.Dispose();
        _directSignal.Dispose();
    }
}
