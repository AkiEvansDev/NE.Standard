using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Binding.Addresses;
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

internal abstract partial class UIRuntimeBase : IUIRuntime, IUIRuntimeConnectionUpdater, IUISessionChangeListener
{
    private static partial class Log
    {
        [LoggerMessage(EventId = 1, Level = LogLevel.Warning, Message = "Resolving a runtime {Kind} during '{Operation}' failed; the unresolved value is kept.")]
        public static partial void RuntimeResolutionFailed(ILogger logger, Exception exception, string kind, string operation);

        [LoggerMessage(EventId = 2, Level = LogLevel.Warning, Message = "A background command's run during '{Operation}' ended without delivering its result.")]
        public static partial void DetachedCommandFailed(ILogger logger, Exception exception, string operation);

        [LoggerMessage(EventId = 3, Level = LogLevel.Error, Message = "The controller's exception handler failed during '{Operation}'; the operation is answered with the default error.")]
        public static partial void ExceptionHandlerFailed(ILogger logger, Exception exception, string operation);
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
        catch
        {
            // A logger that throws must not turn a failure already recovered from into a new one.
        }
    }

    private static readonly UICommandResult DefaultRuntimeErrorCommand = UICommandResult.Fail("Runtime error.");

    // What an accepted background command answers before its result is pushed: nothing to apply yet.
    private static readonly UICommandResult AcceptedCommand = UICommandResult.Ok();

    private readonly SemaphoreSlim _stateLock = new(1, 1);

    // A command's turn: an exclusive command, a leave, a back or forward, posted work, and an attach's or a stored session's hooks, one
    // at a time. Taken before the send order and the state lock, never inside them; an exclusive command's body holds it but not the
    // state lock.
    private readonly SemaphoreSlim _exclusiveCommandLock = new(1, 1);
    private readonly SemaphoreSlim _initializeLock = new(1, 1);

    // The background commands under way, by command, held to each one's MaxConcurrent.
    private readonly Lock _runsSync = new();
    private readonly Dictionary<string, int> _runs = new(StringComparer.Ordinal);

    // A runtime that sends what it drains holds this from before a drain to the end of its send; taken before the state lock, never
    // inside it.
    private readonly SemaphoreSlim _sendOrder = new(1, 1);

    private readonly List<RecursiveChange> _changeBuffer = [];

    // The hosts sent their whole list while one round of changes is turned into updates. The list is read once the round's changes
    // are all made, so a later change of the same round to one of them is in it already and, sent as well, would be applied twice.
    private readonly HashSet<UIComponentAddress> _wholeLists = [];
    // Each update numbered as it is queued, so a client instance is sent only what came after its attach snapshot.
    private readonly List<PendingUpdate> _pendingUpdates = [];
    private long _updateSequence;

    private bool _disposed;
    private bool _pendingFullResync;
    private int _fullResyncRequested;
    private int _commandsInFlight;
    [SuppressMessage("Usage", "CA2213:Disposable fields should be disposed", Justification = "Disposing it lets go of one command's hold on this runtime; each holder does that once, and there is nothing else to release.")]
    private readonly CommandRelease _commandRelease;
    private int _disposeRequested;
    private int _disposeClaimed;

    private readonly UIApplication _application;

    // The service scope the controller was built from, disposed after it.
    private IServiceScope? _services;

    protected UIRuntimeBase(UIHandle handle, CompiledView view, IUIController controller, UIClientServices clientServices, UIApplication application)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(view);
        ArgumentNullException.ThrowIfNull(controller);
        ArgumentNullException.ThrowIfNull(application);

        clientServices.Validate();
        handle.Instance.Validate();

        // Both modes hold the sink: a background command pushes its own result whichever way the changes travel.
        Connection = RuntimeConnection.FromClientServices(handle, clientServices);
        AttachInstance(handle);
        _heardLanguage = handle.Session.Language;
        _heardThemeMode = handle.Session.ThemeMode;
        View = view;
        Controller = controller;
        _application = application;
        _commandRelease = new CommandRelease(this);
    }

    /// <summary>Hands this runtime the service scope its controller was built from, to dispose once the controller is.</summary>
    internal void OwnServices(IServiceScope services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _services = services;
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

    /// <summary>
    /// Whether this runtime takes its whole queue on every drain and sends it itself, and so must send in the order it drained;
    /// otherwise the queue waits for the flush, and an answer takes only its caller's copy.
    /// </summary>
    protected virtual bool SendsWhatItDrains => false;

    /// <summary>Whether the controller's changes reach this runtime through a pump of its own rather than its change buffer.</summary>
    protected virtual bool TakesChangesOnPump => false;

    /// <summary>
    /// Queues the controller's changes no drain has taken yet: they are already in the state a snapshot reads, so they must be
    /// numbered before it rather than after.
    /// </summary>
    protected virtual void QueueUntakenControllerChangesNoLock() => DrainControllerChangesNoLock();

    /// <summary>
    /// Disposes the runtime, or — while a command is running for it — marks it to be disposed by the last command to finish.
    /// </summary>
    public ValueTask DisposeAsync()
        => RequestDispose() ? DisposeNowAsync() : ValueTask.CompletedTask;

    /// <summary>
    /// Marks the runtime to go and answers whether the caller disposes it now: no command running, and no one else disposing.
    /// </summary>
    /// <remarks>Both counters go through full fences, so a command entering either sees the request or is seen by it.</remarks>
    private bool RequestDispose()
    {
        _ = Interlocked.Exchange(ref _disposeRequested, 1);

        // After the request, so a subscription racing it is either dropped here or refused by it.
        LeaveBroadcast();

        return Volatile.Read(ref _commandsInFlight) == 0 && TryClaimDispose();
    }

    private bool TryClaimDispose()
        => Interlocked.Exchange(ref _disposeClaimed, 1) == 0;

    private async ValueTask DisposeNowAsync()
    {
        try
        {
            if (IsStarted && !IsStopped)
                await StopAsync().ConfigureAwait(false);

            await DisposeRuntimeResourcesAsync().ConfigureAwait(false);

            DisposeManagedResources();
        }
        finally
        {
            // Whatever the controller's own dispose threw: the scope's services are the page's, and nothing else lets go of them.
            // Asynchronously where it can be: a scope holding a service that is only IAsyncDisposable refuses a synchronous dispose.
            if (_services is IAsyncDisposable services)
                await services.DisposeAsync().ConfigureAwait(false);
            else
                _services?.Dispose();

            _disposed = true;
        }
    }

    private void DisposeManagedResources()
    {
        _stateLock.Dispose();
        _exclusiveCommandLock.Dispose();
        _initializeLock.Dispose();
        _sendOrder.Dispose();
        Controller.Dispose();
    }

    /// <summary>
    /// Best-effort synchronous teardown; skips the <c>Stop</c> step to avoid deadlocking the pump task. Prefer <see cref="DisposeAsync"/>.
    /// </summary>
    public void Dispose()
    {
        if (!RequestDispose())
            return;

        try
        {
            DisposeRuntimeResources();

            DisposeManagedResources();
        }
        finally
        {
            _services?.Dispose();

            _disposed = true;
        }
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

    protected sealed record RuntimeConnection(UIHandle Handle, UIClientServices ClientServices)
    {
        public static RuntimeConnection FromClientServices(UIHandle handle, UIClientServices clientServices)
        {
            ArgumentNullException.ThrowIfNull(handle);

            clientServices.Validate();
            handle.Instance.Validate();

            return new RuntimeConnection(handle, clientServices);
        }
    }
}
