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

        return await DrainAsync(action, DrainTarget.Leave, publish: true, cancellationToken).ConfigureAwait(false);
    }

    private readonly Queue<(string Operation, Func<CancellationToken, Task> Action)> _posted = new();
    private bool _drainingPosted;
    // Completed once the drain running when it was asked for runs dry: what a test waits on to see posted work's effect.
    private TaskCompletionSource? _postedDrained;

    /// <inheritdoc />
    public void Post(Func<CancellationToken, Task> action)
    {
        ArgumentNullException.ThrowIfNull(action);

        PostCore("Post", action);
    }

    /// <summary>
    /// Queues work to run on the thread pool in a command's turn, as a command's body runs, in the order it was posted.
    /// </summary>
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
        while (TakePosted(out (string Operation, Func<CancellationToken, Task> Action) next))
            await RunPostedAsync(next.Operation, next.Action).ConfigureAwait(false);
    }

    /// <summary>Takes the next posted work; with none left, ends the drain and lets go of whoever waits for it to run dry.</summary>
    private bool TakePosted(out (string Operation, Func<CancellationToken, Task> Action) next)
    {
        TaskCompletionSource? drained;

        lock (_posted)
        {
            if (_posted.TryDequeue(out next))
                return true;

            _drainingPosted = false;
            drained = _postedDrained;
            _postedDrained = null;
        }

        drained?.SetResult();

        return false;
    }

    /// <summary>Completes once the work posted so far has run — at once where none is queued; a test's way to see what it did.</summary>
    internal Task WhenPostedRanAsync()
    {
        lock (_posted)
        {
            if (!_drainingPosted)
                return Task.CompletedTask;

            _postedDrained ??= new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);

            return _postedDrained.Task;
        }
    }

    /// <summary>
    /// Runs queued work between exclusive commands and lets go of its hold; never faults, since nothing awaits it: a failure goes to
    /// the controller.
    /// </summary>
    private async Task RunPostedAsync(string operation, Func<CancellationToken, Task> action)
    {
        var inTurn = false;

        try
        {
            // Read before the wait: the hold is counted already, so a runtime not yet asked to go stays until this work leaves, while one
            // asked to go may have disposed its lock — a failed initialization disposes at once.
            if (Volatile.Read(ref _disposeRequested) != 0)
                return;

            // A command's body holds no state lock, so without its turn a posted redraw would write the controller beside the command's own.
            await _exclusiveCommandLock.WaitAsync().ConfigureAwait(false);
            inTurn = true;

            if (Volatile.Read(ref _disposeRequested) == 0)
                await RunInTurnAsync(action, CancellationToken.None).ConfigureAwait(false);
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
            // Released before the hold: the last hold out may dispose the runtime, and its lock with it.
            if (inTurn)
                _ = _exclusiveCommandLock.Release();

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

    /// <summary>
    /// Runs work that holds a command's turn as a command's body runs — outside the state lock — then drains and publishes what it
    /// wrote, as <see cref="InvokeAsync(Func{CancellationToken, Task}, CancellationToken)"/> would.
    /// </summary>
    /// <remarks>
    /// Outside the lock so the work may await <c>InvokeAsync</c> on its own runtime, as a command may: under it, that call waited for
    /// the lock its own caller held, and the runtime with every flush behind it stopped for good.
    /// </remarks>
    private async Task RunInTurnAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken)
    {
        await action(cancellationToken).ConfigureAwait(false);

        _ = await DrainAsync(action: null, DrainTarget.Leave, publish: true, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public Task SendEffectsToAllAsync(IReadOnlyList<ClientEffect> effects, UIHandle? except = null, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(effects);

        if (effects.Count == 0)
            return Task.CompletedTask;

        UICommandExecutionResult result = OutsideCommand(effects);
        IReadOnlyList<UIHandle> viewers = ViewerHandles;
        UIHandle? hiddenShower = PickSystemNotificationPage(viewers, except, UINotificationWhen.WhenHidden);
        UIHandle? alwaysShower = PickSystemNotificationPage(viewers, except, UINotificationWhen.Always);

        return SendEachAsync(viewers, viewer => IsSame(viewer, except) ? null : ForPage(result, viewer, hiddenShower, alwaysShower), cancellationToken);
    }

    /// <summary>
    /// Effects raised outside a command, resolved, on the command-result channel with no command behind it — the one way every send
    /// outside a command builds what it sends.
    /// </summary>
    private UICommandExecutionResult OutsideCommand(IReadOnlyList<ClientEffect> effects)
    {
        UICommandResult command = UICommandResult.Ok(ResolveEffects(effects));

        return new UICommandExecutionResult
        {
            Command = command,
            Changes = WithPageStateAhead(ServerChangeSet.Empty, command)
        };
    }

    /// <summary>
    /// The one page of a reader's that shows a system notification as the system's, so it sounds once rather than once a page: for
    /// one shown <see cref="UINotificationWhen.Always"/> the first on screen, else the first off screen; for one shown only off
    /// screen none while any page is on screen — the reader is told there — else the first off screen.
    /// </summary>
    /// <remarks>Shared by a send to a runtime's pages and a send to a session's, which pass every page of the session.</remarks>
    internal static UIHandle? PickSystemNotificationPage(IReadOnlyList<UIHandle> pages, UIHandle? except, UINotificationWhen when)
    {
        UIHandle? offScreen = null;

        for (var i = 0; i < pages.Count; i++)
        {
            UIHandle page = pages[i];

            if (page.ClientState.IsVisible)
            {
                if (when == UINotificationWhen.WhenHidden)
                    return null;

                if (!IsSame(page, except))
                    return page;
            }
            else if (offScreen is null && !IsSame(page, except))
            {
                offScreen = page;
            }
        }

        return offScreen;
    }

    private static bool IsSame(UIHandle page, UIHandle? other)
        => other is not null && StringComparer.Ordinal.Equals(page.Instance.Id, other.Instance.Id);

    /// <summary>The result as one page is sent it: without the system notifications it does not show; null where nothing is left.</summary>
    private static UICommandExecutionResult? ForPage(UICommandExecutionResult result, UIHandle page, UIHandle? hiddenShower, UIHandle? alwaysShower)
    {
        ClientEffect[] effects = result.Command.Effects;
        List<ClientEffect>? kept = null;

        for (var i = 0; i < effects.Length; i++)
        {
            if (effects[i] is ShowSystemNotificationEffect notification && !GetsSystemNotification(page, notification.When, notification.When == UINotificationWhen.Always ? alwaysShower : hiddenShower))
                kept ??= [.. effects.AsSpan(0, i)];
            else
                kept?.Add(effects[i]);
        }

        if (kept is null)
            return result;

        return kept.Count == 0 ? null : result with { Command = UICommandResult.Ok(kept) };
    }

    /// <summary>
    /// Whether a page is sent a system notification: the page <see cref="PickSystemNotificationPage"/> picked, and for one shown only
    /// off screen every page on screen too, which shows its fallback.
    /// </summary>
    internal static bool GetsSystemNotification(UIHandle page, UINotificationWhen when, UIHandle? picked)
        => ReferenceEquals(page, picked) || (when == UINotificationWhen.WhenHidden && page.ClientState.IsVisible);

    /// <summary>Sends each page what <paramref name="resultFor"/> picks for it, none where it picks nothing; one failed send stops no other.</summary>
    private async Task SendEachAsync(IReadOnlyList<UIHandle> pages, Func<UIHandle, UICommandExecutionResult?> resultFor, CancellationToken cancellationToken)
    {
        IUIUpdateSink updates = Connection.ClientServices.Updates;
        ExceptionDispatchInfo? failure = null;

        for (var i = 0; i < pages.Count; i++)
        {
            UIHandle page = pages[i];
            UICommandExecutionResult? sent = resultFor(page);

            if (sent is null)
                continue;

            try
            {
                await updates.SendCommandResultAsync(page, sent, cancellationToken).ConfigureAwait(false);
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
    public Task SendEffectsToAsync(IReadOnlyList<UIHandle> pages, IReadOnlyList<ClientEffect> effects, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        ArgumentNullException.ThrowIfNull(pages);
        ArgumentNullException.ThrowIfNull(effects);

        if (effects.Count == 0)
            return Task.CompletedTask;

        UICommandExecutionResult result = OutsideCommand(effects);

        return SendEachAsync(pages, _ => result, cancellationToken);
    }

    /// <inheritdoc />
    public IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(effects);

        return ResolveRuntimeEffects(effects) ?? effects;
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
