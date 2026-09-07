using System;
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

internal abstract partial class UIRuntimeBase : IUIRuntime, IUIRuntimeConnectionUpdater
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "Resolving a runtime {Kind} during '{Operation}' failed; the unresolved value is kept.")]
        public static partial void RuntimeResolutionFailed(ILogger logger, Exception exception, string kind, string operation);
    }

    /// <summary>
    /// Logs a resolution failure the caller already recovered from, swallowing a logging failure of its own.
    /// </summary>
    private void TryLogRuntimeResolutionFailure(string kind, string operation, Exception exception)
    {
        try
        {
            if (Controller is IUIContextController contextController)
                Log.RuntimeResolutionFailed(contextController.Context.Logger, exception, kind, operation);
        }
        catch { }
    }

    private static readonly UICommandResult DefaultRuntimeErrorCommand = UICommandResult.Fail("Runtime error.");

    private readonly SemaphoreSlim _stateLock = new(1, 1);
    private readonly SemaphoreSlim _exclusiveCommandLock = new(1, 1);
    private readonly SemaphoreSlim _initializeLock = new(1, 1);

    private readonly List<RecursiveChange> _changeBuffer = [];
    private readonly List<ServerUIUpdate> _pendingUpdates = [];

    private bool _disposed;
    private bool _pendingFullResync;
    private int _fullResyncRequested;

    private readonly UIApplication _application;

    protected UIRuntimeBase(UIHandle handle, CompiledView view, IUIController controller, UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(view);
        ArgumentNullException.ThrowIfNull(controller);
        ArgumentNullException.ThrowIfNull(application);

        handle.Instance.Validate();

        Connection = RuntimeConnection.FromHandle(handle);
        AttachInstance(handle.Instance.Id);
        View = view;
        Controller = controller;
        _application = application;
    }

    /// <inheritdoc />
    public bool IsInitialized { get; private set; }

    /// <inheritdoc />
    public bool IsStarted { get; private set; }

    /// <inheritdoc />
    public bool IsStopped { get; private set; }

    /// <inheritdoc />
    public UIHandle Handle => Connection.Handle;

    /// <inheritdoc />
    public CompiledView View { get; }

    /// <inheritdoc />
    public IUIController Controller { get; }

    protected virtual void OnStartedNoLock() { }
    protected virtual void OnStoppingNoLock() { }

    protected virtual Task<ServerChangeSet> PublishChangesAsync(ServerChangeSet changes, CancellationToken cancellationToken) => Task.FromResult(changes);
    protected virtual Task<UICommandExecutionResult> PublishCommandResultAsync(UICommandExecutionResult result, UIHandle invoker, CancellationToken cancellationToken) => Task.FromResult(result);
    protected virtual Task<ServerChangeSet> ProcessCommandChangesAsync(ServerChangeSet changes, CancellationToken cancellationToken) => Task.FromResult(changes);

    protected abstract ServerChangeSet DrainPendingUpdatesForRuntimeModeNoLock(bool force);

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_disposed)
            return;

        if (IsStarted && !IsStopped)
            await StopAsync().ConfigureAwait(false);

        await DisposeRuntimeResourcesAsync().ConfigureAwait(false);

        DisposeManagedResources();

        _disposed = true;
    }

    private void DisposeManagedResources()
    {
        _stateLock.Dispose();
        _exclusiveCommandLock.Dispose();
        _initializeLock.Dispose();
        Controller.Dispose();
    }

    /// <summary>
    /// Best-effort synchronous teardown; skips the <c>Stop</c> step to avoid deadlocking the pump task. Prefer <see cref="DisposeAsync"/>.
    /// </summary>
    public void Dispose()
    {
        if (_disposed)
            return;

        DisposeRuntimeResources();

        DisposeManagedResources();

        _disposed = true;
    }

    protected virtual void DisposeRuntimeResources() { }

    protected virtual ValueTask DisposeRuntimeResourcesAsync()
    {
        DisposeRuntimeResources();
        return ValueTask.CompletedTask;
    }

    protected RuntimeConnection Connection { get; private set; }

    protected void UpdateConnectionSnapshot(RuntimeConnection connection)
    {
        ArgumentNullException.ThrowIfNull(connection);

        connection.Handle.Instance.Validate();

        Connection = connection;
    }

    private void ThrowIfDisposed()
        => ObjectDisposedException.ThrowIf(_disposed, this);

    protected sealed record RuntimeConnection(UIHandle Handle, UIClientServices? ClientServices)
    {
        public static RuntimeConnection FromHandle(UIHandle handle)
        {
            ArgumentNullException.ThrowIfNull(handle);

            handle.Instance.Validate();

            return new RuntimeConnection(handle, null);
        }

        public static RuntimeConnection FromClientServices(UIHandle handle, UIClientServices clientServices)
        {
            ArgumentNullException.ThrowIfNull(handle);

            clientServices.Validate();
            handle.Instance.Validate();

            return new RuntimeConnection(handle, clientServices);
        }
    }
}
