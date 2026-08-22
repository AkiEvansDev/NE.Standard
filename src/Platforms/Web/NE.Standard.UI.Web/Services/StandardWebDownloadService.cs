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
using NE.Standard.UI.Web.Hosting;

namespace NE.Standard.UI.Web.Services;

/// <summary>
/// Stages the content and tells the browser to fetch it.
/// </summary>
/// <remarks>
/// The bytes never travel over the connection: they go to <see cref="IUIFileStore"/> and the client receives a
/// <see cref="DownloadFileEffect"/> pointing at a single-use path. See <c>docs/FILES.md</c>.
/// <para>
/// There is no <c>IProgress</c> here on purpose. Once the effect is pushed, the browser does the downloading
/// and the server cannot see it — a progress callback could only report bytes staged, which every caller would
/// read as bytes delivered.
/// </para>
/// </remarks>
public sealed class StandardWebDownloadService : IUIDownloadService
{
    private readonly IUIFileStore _store;
    private readonly IUIUpdateSink _updates;

    public StandardWebDownloadService(IUIFileStore store, IUIUpdateSink updates)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(updates);

        _store = store;
        _updates = updates;
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

            // Pushed through the command-result channel like the dialog service does: the client's effect
            // dispatcher already listens there, and a download can be raised outside any command.
            UICommandExecutionResult result = new()
            {
                Command = UICommandResult.Ok([new DownloadFileEffect($"{WebFileEndpoints.Prefix}/{token}", fileName)]),
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
