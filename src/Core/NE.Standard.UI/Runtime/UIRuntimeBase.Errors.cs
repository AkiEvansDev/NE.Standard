using System;
using System.Threading;
using System.Threading.Tasks;
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
        catch
        {
            return RuntimeExceptionResult.CommandResult(DefaultRuntimeErrorCommand);
        }
    }
}
