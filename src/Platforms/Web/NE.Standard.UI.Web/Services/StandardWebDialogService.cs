using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Web.Services;

/// <summary>
/// Opens and closes dialogs by pushing a <see cref="ClientEffect"/> straight to the connection, bypassing the command result.
/// </summary>
public sealed class StandardWebDialogService : IUIDialogService
{
    private readonly IUIUpdateSink _updates;

    public StandardWebDialogService(IUIUpdateSink updates)
    {
        ArgumentNullException.ThrowIfNull(updates);

        _updates = updates;
    }

    public Task<bool> ShowAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default)
        => SendEffectAsync(handle, new OpenDialogEffect(dialogName), cancellationToken);

    public Task<bool> HideAsync(UIHandle handle, string dialogName, CancellationToken cancellationToken = default)
        => SendEffectAsync(handle, new CloseDialogEffect(dialogName), cancellationToken);

    private async Task<bool> SendEffectAsync(UIHandle handle, ClientEffect effect, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentNullException.ThrowIfNull(effect);

        handle.Instance.Validate();

        cancellationToken.ThrowIfCancellationRequested();

        UICommandExecutionResult result = new()
        {
            Command = UICommandResult.Ok([effect]),
            Changes = ServerChangeSet.Empty
        };

        await _updates
            .SendCommandResultAsync(handle, result, cancellationToken)
            .ConfigureAwait(false);

        // "Handled", not "the dialog is now on screen": delivery is one-way, with nothing to await for confirmation.
        return true;
    }
}
