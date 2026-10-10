using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private const string LeaveRequestedOperation = "LeaveRequested";

    // The controller's flag as a path, so its change is told apart from the rest as it is queued.
    private static readonly RecursivePath UnsavedWorkPath = RecursivePath.Parse(nameof(UIControllerBase.HoldsUnsavedWork));

    /// <summary>Whether the page holds work its reader has not saved, as its controller says; a controller of another kind never does.</summary>
    private bool HoldsUnsavedWork => Controller is UIControllerBase { HoldsUnsavedWork: true };

    /// <summary>Queues the page's state where the change is the controller's flag: a page-level update, since no component owns it.</summary>
    private void AppendPageStateNoLock(RecursivePath path)
    {
        if (path.Count == 1 && Controller is UIControllerBase && path.Equals(UnsavedWorkPath))
            AddPendingUpdateNoLock(PageState());
    }

    private ServerPageUIUpdate PageState()
        => new() { HoldsUnsavedWork = HoldsUnsavedWork };

    /// <summary>
    /// A command's changes with the page's state last, where its effects navigate: the page decides that navigation by the state the
    /// command left, whichever way the flag's own update travels — a pushing runtime's pump may send it after the answer.
    /// </summary>
    private ServerChangeSet WithPageStateAhead(ServerChangeSet changes, UICommandResult result)
        => Controller is UIControllerBase && Navigates(result.Effects)
            ? AppendUpdates(changes, new ServerChangeSet { Updates = [PageState()] })
            : changes;

    private static bool Navigates(ClientEffect[] effects)
    {
        for (var i = 0; i < effects.Length; i++)
        {
            if (effects[i] is NavigateEffect)
                return true;
        }

        return false;
    }

    /// <inheritdoc />
    public async Task<UICommandExecutionResult> RequestLeaveAsync(UIHandle invoker, string target, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(invoker);

        if (!UIRoutePath.IsLocal(target))
            throw new ArgumentException("A leave names an address of this site.", nameof(target));

        // In a command's turn: the hook reads and writes the controller as a command does, and a Save pressed meanwhile waits for it.
        return await InCommandTurnAsync(invoker, async cancellation =>
        {
            UICommandResult result = await AnswerLeaveAsync(target, cancellation).ConfigureAwait(false);
            ServerChangeSet changes = await AnswerAsync(invoker.Instance.Id, cancellation).ConfigureAwait(false);

            // Answered, never pushed: the page runs these effects as the leave's own, so a navigation among them is not asked about again.
            return new UICommandExecutionResult
            {
                Command = result,
                Changes = changes
            };
        }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Runs a page's call as an exclusive command's body runs — the runtime held, the call's tab marked, in a command's turn and
    /// outside the state lock — refusing it as gone where the runtime was asked to go before the call began.
    /// </summary>
    /// <remarks>
    /// Not refused again once its turn comes: counted before the runtime was asked to go, the call is one already running, which
    /// keeps the runtime until it ends; only posted work, which no page waits for, is dropped there.
    /// </remarks>
    private async Task<T> InCommandTurnAsync<T>(UIHandle invoker, Func<CancellationToken, Task<T>> body, CancellationToken cancellationToken)
    {
        await using ConfiguredAsyncDisposable hold = HoldAsCommand().ConfigureAwait(false);
        ThrowIfAskedToGo();

        using IDisposable invocation = BeginInvocation(invoker);

        await _exclusiveCommandLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return await body(cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            _ = _exclusiveCommandLock.Release();
        }
    }

    /// <summary>
    /// What a leave does: the controller's answer while the page holds unsaved work, else the navigation itself — the page asks behind
    /// every value still on its way, before their flag can reach it, or on a state the server no longer holds.
    /// </summary>
    /// <remarks>A hook that fails is reported as a failed command is, and the framework's own question asks in its place.</remarks>
    private async Task<UICommandResult> AnswerLeaveAsync(string target, CancellationToken cancellationToken)
    {
        if (!HoldsUnsavedWork || Controller is not IUIControllerLifecycle lifecycle)
            return UICommandResult.Ok([new NavigateEffect(target)]);

        try
        {
            UICommandResult answer = await lifecycle.LeaveRequestedAsync(target, cancellationToken).ConfigureAwait(false);
            UICommandResult result = WithFailureNotification(ResolveRuntimeCommandResult(answer), exception: null);

            result.Validate();

            return result;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            RuntimeExceptionResult error = await HandleRuntimeExceptionAsync(exception, LeaveRequestedOperation, commandRequest: null, clientChangeSet: null, cancellationToken).ConfigureAwait(false);
            UICommandResult failed = ResolveCommandResult(error, exception);

            return new UICommandResult(failed.Success, [.. failed.Effects, new ConfirmLeaveEffect(target)], failed.Error);
        }
    }
}
