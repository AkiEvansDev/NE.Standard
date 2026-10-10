using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private const string NavigatedOperation = "Navigated";

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> NavigateInPlaceAsync(UIHandle invoker, UINavigationRequest navigation, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(invoker);
        ArgumentNullException.ThrowIfNull(navigation);
        navigation.Validate();

        // In a command's turn, as a leave is: the hook reads and writes the controller as a command does.
        return await InCommandTurnAsync(invoker, async cancellation =>
        {
            UICommandResult result = await RunNavigatedAsync(navigation, cancellation).ConfigureAwait(false);
            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellation).ConfigureAwait(false);

            // Answered, never pushed: the page applies it as the answer to its own going back.
            return new UICommandExecutionResult
            {
                Command = result,
                Changes = changes
            };
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>The controller's navigation hook; one that fails is reported as a failed command is.</summary>
    private async Task<UICommandResult> RunNavigatedAsync(UINavigationRequest navigation, CancellationToken cancellationToken)
    {
        if (Controller is not IUIControllerLifecycle lifecycle)
            return UICommandResult.Ok();

        try
        {
            await lifecycle.NavigatedAsync(navigation, cancellationToken).ConfigureAwait(false);

            return UICommandResult.Ok();
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, NavigatedOperation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);

            return ResolveCommandResult(error, exception);
        }
    }
}
