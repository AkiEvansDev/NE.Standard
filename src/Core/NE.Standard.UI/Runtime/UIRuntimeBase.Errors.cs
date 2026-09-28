using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Controllers;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Client;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private async Task<RuntimeExceptionResult> HandleRuntimeExceptionAsync(Exception exception, string operation, UICommandRequest? commandRequest, ClientChangeSet? clientChangeSet, CancellationToken cancellationToken)
    {
        try
        {
            RuntimeExceptionContext context = new()
            {
                Exception = exception,
                Operation = operation,
                CommandRequest = commandRequest,
                ClientChangeSet = clientChangeSet
            };

            context.Validate();

            RuntimeExceptionResult result = await Controller
                .HandleRuntimeExceptionAsync(context, cancellationToken)
                .ConfigureAwait(false);

            ArgumentNullException.ThrowIfNull(result);

            result.Validate();

            if (result.RequestFullResync)
                ((IUIRuntimeAccess)this).RequestFullResync();

            return result;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception handlerException)
        {
            TryLogExceptionHandlerFailure(operation, handlerException);
            return RuntimeExceptionResult.CommandResult(DefaultRuntimeErrorCommand);
        }
    }

    private void TryLogExceptionHandlerFailure(string operation, Exception exception)
    {
        try
        {
            if (Controller is IUIContextController contextController)
                Log.ExceptionHandlerFailed(contextController.Context.Logger, exception, operation);
        }
        catch
        {
            // A logger that throws must not turn a failure already recovered from into a new one.
        }
    }
}
