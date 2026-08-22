using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Services;

/// <summary>
/// Provides file upload access for a connected UI client.
/// </summary>
public interface IUIUploadService
{
    /// <summary>
    /// Gets files selected by the client for a selection id.
    /// </summary>
    Task<UIUploadSelection> GetSelectionAsync(UIHandle handle, string selectionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Opens an uploaded file for reading.
    /// </summary>
    Task<UIUploadedFile> OpenAsync(UIHandle handle, string fileId, IProgress<double>? progress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Opens multiple uploaded files for reading.
    /// </summary>
    Task<UIUploadedFile[]> OpenManyAsync(UIHandle handle, string[] fileIds, IProgress<double>? progress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Copies an uploaded file to a destination stream.
    /// </summary>
    Task<UITransferResult> CopyToAsync(UIHandle handle, string fileId, Stream destination, IProgress<double>? progress = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Copies multiple uploaded files to destination streams created per file.
    /// </summary>
    Task<UITransferResult[]> CopyManyToAsync(UIHandle handle, string[] fileIds, Func<UIUploadFile, Stream> destinationFactory, IProgress<double>? progress = null, CancellationToken cancellationToken = default);
}
