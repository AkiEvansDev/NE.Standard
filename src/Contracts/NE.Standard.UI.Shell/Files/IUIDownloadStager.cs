using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Stages a file for a page to fetch: the platform's part of <see cref="UIContext.Downloads"/>, which sends the effect this answers
/// through the runtime, as every effect raised outside a command is sent.
/// </summary>
public interface IUIDownloadStager
{
    /// <summary>
    /// Stages <paramref name="content"/> for the page <paramref name="handle"/> names and answers the effect that has the page fetch it;
    /// null where the platform delivered the file itself — an in-process one writing it straight into a save dialog.
    /// </summary>
    /// <remarks>
    /// No <c>IProgress</c>: the server stages the content and the client fetches it, so the server cannot observe the download itself.
    /// </remarks>
    Task<ClientEffect?> StageAsync(UIHandle handle, string fileName, string contentType, Stream content, CancellationToken cancellationToken = default);
}
