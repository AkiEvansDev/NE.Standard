using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Runtime.ExceptionServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public Task<ServerChangeSet> InvokeAsync(Action action, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(action);

        return InvokeAsync(
            _ =>
            {
                action();
                return Task.CompletedTask;
            },
            cancellationToken
        );
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> InvokeAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(action);

        // Held as a command holds it. Where something holds it already — the command this is called from — it goes on even once
        // the runtime is asked to go, since the runtime stays until that holder ends anyway.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand(out var alone).ConfigureAwait(false);

        if (alone)
            ThrowIfAskedToGo();

        return await InSendOrderAsync(async () =>
        {
            ServerChangeSet changes = await DrainAsync(action, DrainTarget.Leave, cancellationToken).ConfigureAwait(false);

            return await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false);
        }, cancellationToken).ConfigureAwait(false);
    }

    private readonly Queue<(string Operation, Func<CancellationToken, Task> Action)> _posted = new();
    private bool _drainingPosted;

    /// <inheritdoc />
    public void Post(Func<CancellationToken, Task> action)
    {
        ArgumentNullException.ThrowIfNull(action);

        PostCore("Post", action);
    }

    /// <summary>Queues work to run on the thread pool as <see cref="InvokeAsync(Func{CancellationToken, Task}, CancellationToken)"/> runs it, in the order it was posted.</summary>
    /// <remarks>
    /// Counted as a command from the moment it is queued, so a runtime asked to go waits for the work rather than disposing under
    /// it; work still queued when the runtime is asked to go is dropped. One drain runs at a time, so a message posted and then
    /// deleted arrives in that order.
    /// </remarks>
    private void PostCore(string operation, Func<CancellationToken, Task> action)
    {
        _ = Interlocked.Increment(ref _commandsInFlight);

        lock (_posted)
        {
            _posted.Enqueue((operation, action));

            if (_drainingPosted)
                return;

            _drainingPosted = true;
        }

        _ = Task.Run(DrainPostedAsync);
    }

    private async Task DrainPostedAsync()
    {
        while (true)
        {
            (string Operation, Func<CancellationToken, Task> Action) next;

            lock (_posted)
            {
                if (!_posted.TryDequeue(out next))
                {
                    _drainingPosted = false;
                    return;
                }
            }

            await RunPostedAsync(next.Operation, next.Action).ConfigureAwait(false);
        }
    }

    /// <summary>Runs queued work and lets go of its hold; never faults, since nothing awaits it: a failure goes to the controller.</summary>
    private async Task RunPostedAsync(string operation, Func<CancellationToken, Task> action)
    {
        try
        {
            if (Volatile.Read(ref _disposeRequested) == 0)
                _ = await InvokeAsync(action, CancellationToken.None).ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            try
            {
                _ = await HandleRuntimeExceptionAsync(exception, operation, commandRequest: null, clientChangeSet: null, CancellationToken.None).ConfigureAwait(false);
            }
            catch (Exception handlerException)
            {
                TryLogDetachedCommandFailure(operation, handlerException);
            }
        }
        finally
        {
            try
            {
                await LeaveCommandAsync().ConfigureAwait(false);
            }
            catch (Exception exception)
            {
                TryLogDetachedCommandFailure(operation, exception);
            }
        }
    }

    /// <inheritdoc />
    public async Task SendEffectsToAllAsync(IReadOnlyList<ClientEffect> effects, UIHandle? except = null, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(effects);

        if (effects.Count == 0)
            return;

        // The command-result channel with no command behind it, as SendEffectsAsync takes to its one connection.
        UICommandResult command = UICommandResult.Ok(ResolveEffects(effects));
        UICommandExecutionResult result = new()
        {
            Command = command,
            Changes = WithPageStateAhead(ServerChangeSet.Empty, command)
        };

        IUIUpdateSink updates = Connection.ClientServices.Updates;
        ExceptionDispatchInfo? failure = null;

        foreach (UIHandle viewer in ViewerHandles)
        {
            if (except is not null && StringComparer.Ordinal.Equals(viewer.Instance.Id, except.Instance.Id))
                continue;

            try
            {
                await updates.SendCommandResultAsync(viewer, result, cancellationToken).ConfigureAwait(false);
            }
            catch (Exception exception) when (exception is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
            {
                // One tab whose connection is gone must not keep the effect from the rest.
                failure ??= ExceptionDispatchInfo.Capture(exception);
            }
        }

        failure?.Throw();
    }

    /// <inheritdoc />
    public IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(effects);

        if (effects.Count == 0)
            return effects;

        ClientEffect[] resolved = new ClientEffect[effects.Count];

        for (var i = 0; i < resolved.Length; i++)
            resolved[i] = ResolveRuntimeEffect(effects[i]);

        return resolved;
    }

    /// <inheritdoc />
    void IUIRuntimeAccess.RequestFullResync()
    {
        ThrowIfDisposed();
        _ = Interlocked.Exchange(ref _fullResyncRequested, 1);
        OnFullResyncRequested();
    }

    /// <summary>Called once a full resync is asked for; a runtime that pushes on its own wakes here, a polled one waits for its flush.</summary>
    protected virtual void OnFullResyncRequested() { }
}
