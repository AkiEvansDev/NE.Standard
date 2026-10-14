using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Files;

/// <summary>
/// Stages the content in the file store and answers the effect that has the page fetch it from the address the platform serves it at.
/// </summary>
public sealed class StandardDownloadStager : IUIDownloadStager
{
    private readonly IUIFileStore _store;
    private readonly IUIDownloadAddressProvider _addresses;

    /// <summary>Creates the stager over the store it stages into and the addresses a download is served at.</summary>
    public StandardDownloadStager(IUIFileStore store, IUIDownloadAddressProvider addresses)
    {
        ArgumentNullException.ThrowIfNull(store);
        ArgumentNullException.ThrowIfNull(addresses);

        _store = store;
        _addresses = addresses;
    }

    /// <inheritdoc />
    public async Task<ClientEffect?> StageAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(handle);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);
        ArgumentException.ThrowIfNullOrWhiteSpace(contentType);
        ArgumentNullException.ThrowIfNull(content);

        var token = await _store
            .StageDownloadAsync(handle.Session.SessionId, fileName, contentType, content, cancellationToken)
            .ConfigureAwait(false);

        return new DownloadFileEffect(_addresses.AddressOf(token), fileName);
    }
}
