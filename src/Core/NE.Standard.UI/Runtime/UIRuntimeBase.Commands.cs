using System;
using System.Collections;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public bool HasCommandsInFlight => Volatile.Read(ref _commandsInFlight) != 0;

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UIHandle invoker, UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(invoker);
        ArgumentNullException.ThrowIfNull(request);
        request.Validate();

        // Counted from the start, so a runtime taken away meanwhile (an eviction, a PerPage tab moving on) waits for it: the
        // last command out disposes it.
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        return await ProcessEventInFlightAsync(invoker, request, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Counts a call as a command, holding the runtime until the answer is disposed.</summary>
    private CommandRelease HoldAsCommand()
        => HoldAsCommand(out _);

    /// <summary>Counts a call as a command; <paramref name="alone"/> says whether nothing else held the runtime already.</summary>
    private CommandRelease HoldAsCommand(out bool alone)
    {
        alone = Interlocked.Increment(ref _commandsInFlight) == 1;

        return _commandRelease;
    }

    /// <summary>Lets go of one command's hold when disposed.</summary>
    /// <remarks>
    /// One per runtime, so the hold every value write and command takes allocates nothing. A class behind the framework's
    /// <c>ConfigureAwait</c> rather than a struct awaited through its own <c>DisposeAsync</c>: CA2007 flags every <c>await using</c>
    /// on anything but <see cref="ConfiguredAsyncDisposable"/>.
    /// </remarks>
    private sealed class CommandRelease(UIRuntimeBase runtime) : IAsyncDisposable
    {
        public ValueTask DisposeAsync()
            => runtime.LeaveCommandAsync();
    }

    /// <summary>
    /// Refuses a call a runtime asked to go no longer takes; the ones already running keep it until they finish.
    /// </summary>
    /// <remarks>Read after the call is counted, so either the call sees the request or the request sees the call.</remarks>
    private void ThrowIfAskedToGo()
        => ObjectDisposedException.ThrowIf(Volatile.Read(ref _disposeRequested) != 0, this);

    private async Task<UICommandExecutionResult> ProcessEventInFlightAsync(UIHandle invoker, UICommandRequest request, CancellationToken cancellationToken)
    {
        // Held for the whole run: a command's effects (focus, scroll) belong to the tab that raised it, not whichever attached last.
        using IDisposable invocation = BeginInvocation(invoker);

        CompiledUIEvent compiledEvent;
        IUICommandMetadata metadata;

        try
        {
            compiledEvent = View.Events.GetRequired(request.EventId);
            metadata = Controller.GetCommandMetadata(compiledEvent.Command);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, "ResolveCommand", request, clientChangeSet: null, cancellationToken).ConfigureAwait(false);

            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes
            }, invoker, cancellationToken).ConfigureAwait(false);
        }

        if (metadata.ConcurrencyMode == UICommandConcurrencyMode.Background)
            return await ProcessEventCoreAsync(invoker, request, compiledEvent, "ProcessBackgroundCommand", detach: request.RequestId is not null, cancellationToken).ConfigureAwait(false);

        await _exclusiveCommandLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return await ProcessEventCoreAsync(invoker, request, compiledEvent, "ProcessExclusiveCommand", detach: false, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            _ = _exclusiveCommandLock.Release();
        }
    }

    private async Task<UICommandExecutionResult> ProcessEventCoreAsync(UIHandle invoker, UICommandRequest request, CompiledUIEvent compiledEvent, string operation, bool detach, CancellationToken cancellationToken)
    {
        IReadOnlyDictionary<string, object?> arguments;
        var step = "EnsureEventTarget";

        try
        {
            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                EnsureEventTargetOpenNoLock(compiledEvent, request.DynamicParameters);

                step = "BuildCommandArguments";
                arguments = BuildCommandArguments(compiledEvent, request.DynamicParameters);
            }
            finally
            {
                _ = _stateLock.Release();
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, step, request, clientChangeSet: null, cancellationToken).ConfigureAwait(false);

            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes
            }, invoker, cancellationToken).ConfigureAwait(false);
        }

        if (detach)
            return Detach(invoker, request, compiledEvent, arguments, operation, cancellationToken);

        UICommandExecutionResult result = await ExecuteCommandAsync(invoker, request, compiledEvent, arguments, operation, cancellationToken).ConfigureAwait(false);

        return await PublishCommandResultAsync(result, invoker, cancellationToken).ConfigureAwait(false);
    }

    // Read once per argument by the command and dropped: a plain dictionary, not a frozen one whose build would never pay back.
    private IReadOnlyDictionary<string, object?> BuildCommandArguments(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(compiledEvent);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        if (compiledEvent.Arguments.Length == 0)
            return FrozenDictionary<string, object?>.Empty;

        Dictionary<string, object?> result = new(compiledEvent.Arguments.Length, StringComparer.Ordinal);
        List<UIComponentId> scopes = EventScopes(compiledEvent);

        for (var i = 0; i < compiledEvent.Arguments.Length; i++)
        {
            CompiledUIActionArgument argument = compiledEvent.Arguments[i];
            CompiledUIActionArgumentResolution resolution = CompiledUIActionArgumentResolver.Resolve(argument, View.Sources, View.Templates, dynamicParameters, scopes);

            var value = resolution.Argument.Kind switch
            {
                CompiledUIActionArgumentKind.Literal => resolution.LiteralValue,
                CompiledUIActionArgumentKind.Binding => ResolveBindingValue(argument, resolution),
                CompiledUIActionArgumentKind.CurrentItemKey => ResolveCurrentItemKey(argument, resolution),
                CompiledUIActionArgumentKind.GroupKey => ResolveGroupKey(argument, resolution),
                CompiledUIActionArgumentKind.EventKey => ResolveEventKey(argument, dynamicParameters),
                _ => throw new UnreachableException()
            };

            result.Add(argument.Name, value);
        }

        return result;
    }

    /// <summary>The item scopes the event's component stands in, outermost first: which scope each key of the event's chain belongs to.</summary>
    private List<UIComponentId> EventScopes(CompiledUIEvent compiledEvent)
    {
        List<UIComponentId> scopes = [];

        for (UIComponentNode? node = View.Graph.TryGet(compiledEvent.Address.ComponentId, out UIComponentNode? own) ? own : null; node is not null; node = node.ParentId is UIComponentId parent && View.Graph.TryGet(parent, out UIComponentNode? above) ? above : null)
        {
            if (node.DefinesContextParameter)
                scopes.Add(node.ComponentId);
        }

        scopes.Reverse();

        return scopes;
    }

    /// <summary>A bound argument's value: off the controller, or off the component for a row of a static items view.</summary>
    private object? ResolveBindingValue(CompiledUIActionArgument argument, CompiledUIActionArgumentResolution resolution)
    {
        RecursivePath path = resolution.Path ?? throw new InvalidOperationException($"Argument '{argument.Name}' was not resolved.");

        return resolution.Source is { Kind: CompiledUIBindingSourceKind.ComponentItems } source
            ? ReadComponentItemsValue(argument, source, path)
            : Controller.GetRecursiveValue(path);
    }

    /// <summary>The row of a static items view the path's key names, then the rest of the path on it; the rows live on the component, not the controller.</summary>
    private object? ReadComponentItemsValue(CompiledUIActionArgument argument, CompiledUIBindingSource source, RecursivePath path)
    {
        if (source.ComponentId is UIComponentId componentId
            && path.Count > 0
            && path[0].Kind == PathSegmentKind.Key
            && View.State.TryGetValue(componentId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? items)
            && !items.IsBind
            && items.Value is IEnumerable rows)
        {
            foreach (var row in rows)
            {
                if (row is not IBindableItem item || !string.Equals(item.Id, path[0].Key, StringComparison.Ordinal))
                    continue;

                if (path.Count == 1)
                    return row;

                if (row is RecursiveObservable observable && observable.TryGetRecursiveValue(path.Skip(1), out var value))
                    return value;

                break;
            }
        }

        throw new InvalidOperationException($"Argument '{argument.Name}' addresses no row its items view holds.");
    }

    /// <summary>
    /// Resolves a current-item key against the collection its compiled item scope addresses, refusing a key
    /// the collection no longer holds.
    /// </summary>
    /// <remarks>
    /// The item is the innermost keyed segment — e.g. an action button in a key-value row's <c>Action</c> slot resolves to the
    /// row's key, not the slot's.
    /// </remarks>
    private string ResolveCurrentItemKey(CompiledUIActionArgument argument, CompiledUIActionArgumentResolution resolution)
    {
        RecursivePath path = resolution.Path ?? throw new InvalidOperationException($"Argument '{argument.Name}' was not resolved.");
        var keyIndex = FindItemKeyIndex(argument, path);

        if (resolution.Source?.Kind == CompiledUIBindingSourceKind.Controller && !Controller.TryGetRecursiveValue(path.Take(keyIndex + 1), out _))
            throw new InvalidOperationException($"Argument '{argument.Name}' addresses an item no longer in its collection.");

        return path[keyIndex].Key;
    }

    /// <summary>The place of the item's key in the argument's path: its innermost keyed segment.</summary>
    private static int FindItemKeyIndex(CompiledUIActionArgument argument, RecursivePath path)
    {
        var keyIndex = path.Count - 1;

        while (keyIndex >= 0 && path[keyIndex].Kind != PathSegmentKind.Key)
            keyIndex--;

        return keyIndex >= 0 ? keyIndex : throw new InvalidOperationException($"Argument '{argument.Name}' does not address a keyed item.");
    }

    /// <summary>
    /// The group of the item a current-item key would name: in a group header, the item the header is drawn from, so the group it
    /// heads; <see langword="null"/> for an item in no group.
    /// </summary>
    private string? ResolveGroupKey(CompiledUIActionArgument argument, CompiledUIActionArgumentResolution resolution)
    {
        RecursivePath path = resolution.Path ?? throw new InvalidOperationException($"Argument '{argument.Name}' was not resolved.");
        RecursivePath itemPath = path.Take(FindItemKeyIndex(argument, path) + 1);

        var item = resolution.Source is { Kind: CompiledUIBindingSourceKind.ComponentItems } source
            ? ReadComponentItemsValue(argument, source, itemPath)
            : Controller.TryGetRecursiveValue(itemPath, out var found) ? found : throw new InvalidOperationException($"Argument '{argument.Name}' addresses an item no longer in its collection.");

        return item is IBindableGroup grouped
            ? grouped.Group
            : throw new InvalidOperationException($"Argument '{argument.Name}' addresses an item of a type that is not '{nameof(IBindableGroup)}', which has no group.");
    }

    /// <summary>
    /// Reads one key of the chain the event itself named, by its place in it; the argument is empty where the event named fewer.
    /// </summary>
    /// <remarks>
    /// A component's own event may carry keys no item scope addresses — a chart point's series, a node's two ends — so its
    /// place in the chain is all there is to resolve by.
    /// </remarks>
    private static object? ResolveEventKey(CompiledUIActionArgument argument, object?[] dynamicParameters)
    {
        var at = argument.Value switch
        {
            int index => index,
            long index => (int)index,
            _ => -1
        };

        return at >= 0 && at < dynamicParameters.Length ? dynamicParameters[at] : null;
    }

    /// <summary>
    /// Starts a background command without waiting for it and answers that it was accepted; the run pushes its own result.
    /// </summary>
    /// <remarks>
    /// A connection runs one hub call at a time, so a command awaited on the invoke would hold back every value, window and
    /// command of its tab until it ends — a Cancel button included. The run starts here, in the invoke's flow, so the command
    /// reads the state its tab pressed it on before its first await, as an awaited one does. It keeps the invoke's token, which
    /// the hub ties to the connection: a closed connection cancels it, and a runtime asked to go waits for it.
    /// </remarks>
    private UICommandExecutionResult Detach(UIHandle invoker, UICommandRequest request, CompiledUIEvent compiledEvent, IReadOnlyDictionary<string, object?> arguments, string operation, CancellationToken cancellationToken)
    {
        // The run holds the runtime as a command of its own, taken before the invoke lets go of its hold.
        _ = Interlocked.Increment(ref _commandsInFlight);

        return new UICommandExecutionResult
        {
            Command = AcceptedCommand,
            Changes = ServerChangeSet.Empty,
            Accepted = true,
            Completion = RunDetachedAsync(invoker, request, compiledEvent, arguments, operation, cancellationToken)
        };
    }

    /// <summary>
    /// Runs an accepted command to its end and pushes its result to the tab that raised it, answering whether it succeeded;
    /// never faults, so nothing it throws goes unobserved.
    /// </summary>
    private async Task<bool> RunDetachedAsync(UIHandle invoker, UICommandRequest request, CompiledUIEvent compiledEvent, IReadOnlyDictionary<string, object?> arguments, string operation, CancellationToken cancellationToken)
    {
        var succeeded = false;
        var pushed = false;

        try
        {
            using IDisposable invocation = BeginInvocation(invoker);

            UICommandExecutionResult result = await ExecuteCommandAsync(invoker, request, compiledEvent, arguments, operation, cancellationToken).ConfigureAwait(false);
            succeeded = result.Command.Success;

            await PushCommandResultAsync(invoker, new UICommandExecutionResult
            {
                Command = result.Command,
                Changes = result.Changes,
                RequestId = request.RequestId
            }, cancellationToken).ConfigureAwait(false);

            pushed = true;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // The connection closed under it: there is no one left to answer.
        }
        catch (Exception exception)
        {
            TryLogDetachedCommandFailure(operation, exception);

            if (!pushed)
                await TryPushDetachedFailureAsync(invoker, request, operation, exception, cancellationToken).ConfigureAwait(false);
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

        return succeeded;
    }

    /// <summary>
    /// Runs the command and gathers what it changed for the invoker; a failure goes through the controller's exception handler
    /// and comes back as a failed result.
    /// </summary>
    private async Task<UICommandExecutionResult> ExecuteCommandAsync(UIHandle invoker, UICommandRequest request, CompiledUIEvent compiledEvent, IReadOnlyDictionary<string, object?> arguments, string operation, CancellationToken cancellationToken)
    {
        try
        {
            UICommandResult commandResult = await Controller
                .ExecuteCommandAsync(compiledEvent.Command, arguments, cancellationToken)
                .ConfigureAwait(false);

            commandResult = WithFailureNotification(ResolveRuntimeCommandResult(commandResult), exception: null);
            commandResult.Validate();

            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);

            return new UICommandExecutionResult
            {
                Command = commandResult,
                Changes = changes
            };
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, operation, request, clientChangeSet: null, cancellationToken).ConfigureAwait(false);

            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellationToken).ConfigureAwait(false);

            return new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes
            };
        }
    }

    /// <summary>Sends a command's result to the tab that raised it, through the sink every pushed result takes.</summary>
    /// <remarks>The invoking handle, not the connection snapshot: a command's effects belong to the tab that raised it.</remarks>
    protected Task PushCommandResultAsync(UIHandle invoker, UICommandExecutionResult result, CancellationToken cancellationToken)
        => Connection.ClientServices.Updates.SendCommandResultAsync(invoker, result, cancellationToken);

    private void TryLogDetachedCommandFailure(string operation, Exception exception)
    {
        try
        {
            if (Controller is IUIContextController contextController)
                Log.DetachedCommandFailed(contextController.Context.Logger, exception, operation);
        }
        catch
        {
            // A logger that throws must not turn a failure already recovered from into a new one.
        }
    }

    /// <summary>
    /// Answers a tab whose accepted command failed past its own result — a throwing exception handler, a result the sink
    /// refused — since the tab otherwise waits on it, and holds its button, until the connection drops.
    /// </summary>
    private async Task TryPushDetachedFailureAsync(UIHandle invoker, UICommandRequest request, string operation, Exception exception, CancellationToken cancellationToken)
    {
        try
        {
            await PushCommandResultAsync(invoker, new UICommandExecutionResult
            {
                Command = WithFailureNotification(DefaultRuntimeErrorCommand, exception),
                Changes = ServerChangeSet.Empty,
                RequestId = request.RequestId
            }, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception pushFailure)
        {
            TryLogDetachedCommandFailure(operation, pushFailure);
        }
    }

    private UICommandResult ResolveCommandResult(RuntimeExceptionResult result, Exception exception)
    {
        ArgumentNullException.ThrowIfNull(result);

        result.Validate();

        UICommandResult command = result.Command ?? DefaultRuntimeErrorCommand;

        // The exception only shapes the message when the controller wrote none; DefaultRuntimeErrorCommand is a placeholder, not authored.
        var authored = result.Command is not null && !ReferenceEquals(result.Command, DefaultRuntimeErrorCommand);

        return WithFailureNotification(
            ResolveRuntimeCommandResult(command),
            authored ? null : exception
        );
    }

    /// <summary>Gives a failed command something the user can see, since a bare failure is otherwise ignored by both channels.</summary>
    /// <remarks>Skipped when the result already carries effects: returning its own is how a command takes over the reporting.</remarks>
    private UICommandResult WithFailureNotification(UICommandResult result, Exception? exception)
    {
        if (result.Success || result.Effects.Length != 0 || !_application.ErrorHandling.NotifyOnCommandFailure)
            return result;

        // The page translates it as any notification's words, by the plain rule, and again at a switch while it is open.
        var message = ResolveFailureMessage(result, exception);

        return string.IsNullOrWhiteSpace(message)
            ? result
            : UICommandResult.Fail(result.Error ?? message, [new ShowNotificationEffect(message, UIColorStyle.Danger)]);
    }

    /// <summary>
    /// Resolves a failed command's message: an authored message, a refusal's own wording, or raw exception text if opted into detail.
    /// </summary>
    private string? ResolveFailureMessage(UICommandResult result, Exception? exception)
    {
        if (exception is null)
            return result.Error;

        if (exception is UnauthorizedAccessException)
            return _application.ErrorHandling.CommandRefusedMessage;

        return _application.ErrorHandling.IncludeExceptionDetail
            ? exception.Message
            : _application.ErrorHandling.CommandFailedMessage;
    }

    /// <summary>
    /// Lets go of one command's hold on the runtime; the last one out disposes a runtime asked to go meanwhile.
    /// </summary>
    private async ValueTask LeaveCommandAsync()
    {
        if (Interlocked.Decrement(ref _commandsInFlight) == 0 && Volatile.Read(ref _disposeRequested) != 0 && TryClaimDispose())
            await DisposeNowAsync().ConfigureAwait(false);
    }
}
