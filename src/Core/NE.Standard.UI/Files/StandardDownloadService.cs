using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Files;

/// <summary>
/// Stages the content and tells the client to fetch it.
/// </summary>
public sealed class StandardDownloadService : IUIDownloadService
{
    private readonly IUIFileStore _store;
    private readonly IUIUpdateSink _updates;
    private readonly IUIDownloadAddressProvider _addresses;

    public StandardDownloadService(IUIFileStore store, IUIUpdateSink updates, IUIDownloadAddressProvider addresses)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(updates);
        ArgumentNullException.ThrowIfNull(addresses);

        _store = store;
        _updates = updates;
        _addresses = addresses;
    }

    /// <inheritdoc />
    public async Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
        ArgumentNullException.ThrowIfNull(content);

        handle.Instance.Validate();

        try
        {
            var token = await _store
                .StageDownloadAsync(handle.Session.SessionId, fileName, contentType, content, cancellationToken)
                .ConfigureAwait(false);

            // Pushed through the command-result channel like the dialog service does, since a download can be raised outside any command.
            UICommandExecutionResult result = new()
            {
                Command = UICommandResult.Ok([new DownloadFileEffect(_addresses.AddressOf(token), fileName)]),
                Changes = ServerChangeSet.Empty
            };

            await _updates.SendCommandResultAsync(handle, result, cancellationToken).ConfigureAwait(false);

            return UITransferResult.Ok();
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return UITransferResult.Cancel();
        }
    }

    /// <inheritdoc />
    public async Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, byte[] content, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(content);

        MemoryStream stream = new(content, writable: false);

        await using (stream.ConfigureAwait(false))
            return await DownloadAsync(handle, fileName, contentType, stream, cancellationToken).ConfigureAwait(false);
    }
}
