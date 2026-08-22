using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Application;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase : IUIRuntime, IUIRuntimeConnectionUpdater
{
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
    /// Best-effort teardown, and deliberately so: it skips the <c>Stop</c> step <see cref="DisposeAsync"/>
    /// runs, because the only way to run it here would be to block on the pump task — a synchronous wait on
    /// work that takes the same locks, which is a deadlock waiting for the right timing. The pump handles
    /// <see cref="ObjectDisposedException"/> cleanly, so a runtime disposed this way stops on its next turn.
    /// <b>Prefer <see cref="DisposeAsync"/>.</b>
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
