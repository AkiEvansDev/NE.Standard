using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public async Task<UICommandExecutionResult> ProcessEventAsync(UIHandle invoker, UICommandRequest request, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(invoker);
        ArgumentNullException.ThrowIfNull(request);
        request.Validate();

        // The connection that raised the command, held for its whole run: a command's effects are personal —
        // a focus or a scroll belongs to the tab that clicked — and a runtime shared by several tabs would
        // otherwise answer whichever one attached last.
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
                Changes = changes
            }, invoker, cancellationToken).ConfigureAwait(false);
        }

        if (metadata.ConcurrencyMode == UICommandConcurrencyMode.Background)
            return await ProcessEventCoreAsync(invoker, request, compiledEvent, "ProcessBackgroundCommand", cancellationToken).ConfigureAwait(false);

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
                Changes = changes
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
                Changes = changes
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
                Changes = changes
            }, invoker, cancellationToken).ConfigureAwait(false);
        }
    }

    private FrozenDictionary<string, object?> BuildCommandArguments(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
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
                CompiledUIActionArgumentKind.CurrentItemKey => GetCurrentItemKey(dynamicParameters),
                _ => throw new UnreachableException()
            };

            result.Add(argument.Name, value);
        }

        return result.ToFrozenDictionary(StringComparer.Ordinal);
    }

    private static string? GetCurrentItemKey(object?[] dynamicParameters)
        => dynamicParameters.Length == 0 ? null : dynamicParameters[^1] as string;

    private UICommandResult ResolveCommandResult(RuntimeExceptionResult result, Exception exception)
    {
        ArgumentNullException.ThrowIfNull(result);

        result.Validate();

        UICommandResult command = result.Command ?? DefaultRuntimeErrorCommand;

        // The exception is only allowed to shape the message when the controller did not write one itself: a
        // result it returned carries a message meant for this user, and second-guessing it would be wrong.
        // DefaultRuntimeErrorCommand is not such a result — it is this class's own placeholder, and letting its
        // "Runtime error." reach the browser would be exactly the leak the three levels exist to prevent.
        var authored = result.Command is not null && !ReferenceEquals(result.Command, DefaultRuntimeErrorCommand);

        return WithFailureNotification(
            ResolveRuntimeCommandResult(command),
            authored ? null : exception
        );
    }

    /// <summary>
    /// Gives a failed command something the user can see. Without this the client gets a failure it ignores —
    /// both channels only ever apply changes and effects — so the button silently does nothing.
    /// </summary>
    /// <remarks>
    /// Skipped when the result already carries effects: returning its own is how a command takes over the
    /// reporting.
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
    /// Three levels: a message the command wrote is meant for the user, a refusal has its own wording, and any
    /// other exception is generic — its real text can carry a connection string or a file path, so it only
    /// reaches the browser when the application asks for detail.
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
