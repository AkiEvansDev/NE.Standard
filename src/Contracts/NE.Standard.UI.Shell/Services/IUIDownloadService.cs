using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Services;

/// <summary>
/// Provides file download operations for a connected UI client.
/// </summary>
public interface IUIDownloadService
{
    /// <summary>
    /// Sends a stream as a downloadable file.
    /// </summary>
    /// <remarks>
    /// No <c>IProgress</c>: the server stages the content and the browser fetches it, so the server cannot
    /// observe the download at all. A callback here could only report bytes staged, under a name every caller
    /// would read as bytes delivered — see <c>docs/FILES.md</c> §5.
    /// </remarks>
    Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a byte array as a downloadable file.
    /// </summary>
    Task<UITransferResult> DownloadAsync(UIHandle handle, string fileName, string contentType, byte[] content, CancellationToken cancellationToken = default);
}
