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

internal sealed partial class UIDirectRuntime : UIRuntimeBase
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Error, Message = "Direct UI runtime change publishing failed for '{InstanceId}'.")]
        public static partial void DirectChangePublishingFailed(ILogger logger, Exception exception, string instanceId);
    }

    private readonly ConcurrentQueue<RecursiveChange> _directChanges = new();
    private readonly SemaphoreSlim _directSignal = new(0);
    private readonly CancellationTokenSource _directCancellation = new();

    private Task? _directPump;

    public UIDirectRuntime(UIHandle handle, CompiledView view, IUIController controller, UIClientServices clientServices, UIApplication application)
        : base(handle, view, controller, application)
    {
        clientServices.Validate();

        UpdateConnectionSnapshot(RuntimeConnection.FromClientServices(handle, clientServices));
    }

    protected override ServerChangeSet DrainPendingUpdatesForRuntimeModeNoLock(bool force)
        => DrainPendingUpdatesNoLock();

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

        _directChanges.Enqueue(change);

        try
        {
            _ = _directSignal.Release();
        }
        catch (ObjectDisposedException) { }
    }

    private async Task ProcessDirectChangesAsync()
    {
        CancellationToken cancellationToken = _directCancellation.Token;

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await _directSignal.WaitAsync(cancellationToken).ConfigureAwait(false);

                RecursiveChange[] changes = DrainDirectChanges();

                if (changes.Length == 0)
                    continue;

                _ = await PublishExternalControllerChangesAsync(changes, cancellationToken).ConfigureAwait(false);
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

        return [.. changes];
    }

    private void TryLogDirectPublishingFailure(Exception exception)
    {
        try
        {
            if (Controller is IUIContextController contextController)
                Log.DirectChangePublishingFailed(contextController.Context.Logger, exception, Connection.Handle.Instance.Id);
        }
        catch { }
    }

    protected override void OnStoppingNoLock()
    {
        Controller.SetChangeNotifier(null);

        _directCancellation.Cancel();

        try
        {
            _ = _directSignal.Release();
        }
        catch (ObjectDisposedException) { }
    }

    protected override async Task<ServerChangeSet> PublishChangesAsync(ServerChangeSet changes, CancellationToken cancellationToken)
    {
        if (changes.IsEmpty)
            return changes;

        RuntimeConnection connection = Connection;
        UIClientServices clientServices = connection.ClientServices
            ?? throw new InvalidOperationException("Direct runtime client services are not attached.");

        await clientServices.Updates
            .SendChangesAsync(connection.Handle, AttachedInstanceIds, changes, cancellationToken)
            .ConfigureAwait(false);

        return changes;
    }

    protected override async Task<UICommandExecutionResult> PublishCommandResultAsync(UICommandExecutionResult result, UIHandle invoker, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(result);

        result.Validate();

        ArgumentNullException.ThrowIfNull(invoker);

        UIClientServices clientServices = Connection.ClientServices
            ?? throw new InvalidOperationException("Direct runtime client services are not attached.");

        // The invoking handle, not the connection snapshot: a runtime shared by several tabs holds whichever
        // one attached last, and a command's effects belong to the tab that raised it.
        await clientServices.Updates
            .SendCommandResultAsync(invoker, result, cancellationToken)
            .ConfigureAwait(false);

        if (result.Command.Effects.Length == 0)
            return result;

        // A client-invoked command receives the push above *and* the invoke's own return value, so the effects
        // are stripped from the returned copy or they would be applied twice. Mirrors what
        // ProcessCommandChangesAsync already does with the change set. Success/Error stay intact — neither is
        // applied to the DOM.
        return new UICommandExecutionResult
        {
            Command = new UICommandResult(result.Command.Success, effects: null, result.Command.Error),
            Changes = result.Changes
        };
    }

    protected override async Task<ServerChangeSet> ProcessCommandChangesAsync(ServerChangeSet changes, CancellationToken cancellationToken)
    {
        if (changes.IsEmpty)
            return ServerChangeSet.Empty;

        RuntimeConnection connection = Connection;
        UIClientServices clientServices = connection.ClientServices
            ?? throw new InvalidOperationException("Direct runtime client services are not attached.");

        await clientServices.Updates
            .SendChangesAsync(connection.Handle, AttachedInstanceIds, changes, cancellationToken)
            .ConfigureAwait(false);

        return ServerChangeSet.Empty;
    }

    public override void UpdateConnection(UIHandle handle, UIClientServices clientServices)
    {
        clientServices.Validate();

        base.UpdateConnection(handle, clientServices);
    }

    protected override void DisposeRuntimeResources()
    {
        Controller.SetChangeNotifier(null);

        _directCancellation.Cancel();

        try
        {
            _ = _directSignal.Release();
        }
        catch { }

        _directCancellation.Dispose();
        _directSignal.Dispose();
    }

    protected override async ValueTask DisposeRuntimeResourcesAsync()
    {
        Controller.SetChangeNotifier(null);

        await _directCancellation.CancelAsync().ConfigureAwait(false);

        try
        {
            _ = _directSignal.Release();
        }
        catch (ObjectDisposedException) { }

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
