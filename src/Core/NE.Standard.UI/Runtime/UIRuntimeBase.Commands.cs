using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
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
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(
                exception,
                "ResolveCommand",
                request,
                clientChangeSet: null,
                cancellationToken
            ).ConfigureAwait(false);

            ServerChangeSet changes = await FlushCoreAsync(force: true, publish: false, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes.For(invoker.Instance.Id)
            }, invoker, cancellationToken).ConfigureAwait(false);
        }

        if (metadata.ConcurrencyMode == UICommandConcurrencyMode.Background)
        {
            _ = Interlocked.Increment(ref _commandsInFlight);
            try
            {
                return await ProcessEventCoreAsync(invoker, request, compiledEvent, "ProcessBackgroundCommand", cancellationToken).ConfigureAwait(false);
            }
            finally
            {
                _ = Interlocked.Decrement(ref _commandsInFlight);
            }
        }

        _ = Interlocked.Increment(ref _commandsInFlight);
        try
        {
            await _exclusiveCommandLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                return await ProcessEventCoreAsync(invoker, request, compiledEvent, "ProcessExclusiveCommand", cancellationToken).ConfigureAwait(false);
            }
            finally
            {
                _ = _exclusiveCommandLock.Release();
            }
        }
        finally
        {
            _ = Interlocked.Decrement(ref _commandsInFlight);
        }
    }

    private async Task<UICommandExecutionResult> ProcessEventCoreAsync(UIHandle invoker, UICommandRequest request, CompiledUIEvent compiledEvent, string operation, CancellationToken cancellationToken)
    {
        IReadOnlyDictionary<string, object?> arguments;

        try
        {
            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
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
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(
                exception,
                "BuildCommandArguments",
                request,
                clientChangeSet: null,
                cancellationToken
            ).ConfigureAwait(false);

            ServerChangeSet changes = await FlushCoreAsync(force: true, publish: false, cancellationToken).ConfigureAwait(false);
            changes = await ProcessCommandChangesAsync(changes, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes.For(invoker.Instance.Id)
            }, invoker, cancellationToken).ConfigureAwait(false);
        }

        try
        {
            UICommandResult commandResult = await Controller
                .ExecuteCommandAsync(compiledEvent.Command, arguments, cancellationToken)
                .ConfigureAwait(false);

            commandResult = WithFailureNotification(ResolveRuntimeCommandResult(commandResult), exception: null);
            commandResult.Validate();

            ServerChangeSet changes = await FlushCoreAsync(force: true, publish: false, cancellationToken).ConfigureAwait(false);
            changes = await ProcessCommandChangesAsync(changes, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = commandResult,
                Changes = changes.For(invoker.Instance.Id)
            }, invoker, cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(
                exception,
                operation,
                request,
                clientChangeSet: null,
                cancellationToken
            ).ConfigureAwait(false);

            ServerChangeSet changes = await FlushCoreAsync(force: true, publish: false, cancellationToken).ConfigureAwait(false);
            changes = await ProcessCommandChangesAsync(changes, cancellationToken).ConfigureAwait(false);

            return await PublishCommandResultAsync(new UICommandExecutionResult
            {
                Command = ResolveCommandResult(error, exception),
                Changes = changes.For(invoker.Instance.Id)
            }, invoker, cancellationToken).ConfigureAwait(false);
        }
    }

    // Read once per argument by the command and dropped: a plain dictionary, not a frozen one whose build would never pay back.
    private IReadOnlyDictionary<string, object?> BuildCommandArguments(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        ArgumentNullException.ThrowIfNull(compiledEvent);
        ArgumentNullException.ThrowIfNull(dynamicParameters);

        if (compiledEvent.Arguments.Length == 0)
            return FrozenDictionary<string, object?>.Empty;

        Dictionary<string, object?> result = new(compiledEvent.Arguments.Length, StringComparer.Ordinal);

        for (var i = 0; i < compiledEvent.Arguments.Length; i++)
        {
            CompiledUIActionArgument argument = compiledEvent.Arguments[i];
            CompiledUIActionArgumentResolution resolution = CompiledUIActionArgumentResolver.Resolve(argument, View.Sources, View.Templates, dynamicParameters);

            var value = resolution.Argument.Kind switch
            {
                CompiledUIActionArgumentKind.Literal => resolution.LiteralValue,
                CompiledUIActionArgumentKind.Binding => Controller.GetRecursiveValue(resolution.Path ?? throw new InvalidOperationException($"Argument '{argument.Name}' was not resolved.")),
                CompiledUIActionArgumentKind.CurrentItemKey => ResolveCurrentItemKey(argument, resolution),
                CompiledUIActionArgumentKind.EventKey => ResolveEventKey(argument, dynamicParameters),
                _ => throw new UnreachableException()
            };

            result.Add(argument.Name, value);
        }

        return result;
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
        var keyIndex = path.Count - 1;

        while (keyIndex >= 0 && path[keyIndex].Kind != PathSegmentKind.Key)
            keyIndex--;

        if (keyIndex < 0)
            throw new InvalidOperationException($"Argument '{argument.Name}' does not address a keyed item.");

        if (resolution.Source?.Kind == CompiledUIBindingSourceKind.Controller && !Controller.TryGetRecursiveValue(path.Take(keyIndex + 1), out _))
            throw new InvalidOperationException($"Argument '{argument.Name}' addresses an item no longer in its collection.");

        return path[keyIndex].Key;
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

    /// <summary>
    /// Gives a failed command something the user can see, since a bare failure is otherwise ignored by both channels.
    /// </summary>
    /// <remarks>
    /// Skipped when the result already carries effects: returning its own is how a command takes over the reporting.
    /// </remarks>
    private UICommandResult WithFailureNotification(UICommandResult result, Exception? exception)
    {
        if (result.Success || result.Effects.Length != 0 || !_application.ErrorHandling.NotifyOnCommandFailure)
            return result;

        var message = _application.Translator.Translate(Handle.Session.Language, ResolveFailureMessage(result, exception));

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
}
