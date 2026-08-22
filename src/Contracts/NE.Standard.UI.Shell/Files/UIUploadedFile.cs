using System;
using System.IO;
using System.Threading.Tasks;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Represents an opened uploaded file and its readable content stream.
/// </summary>
public sealed class UIUploadedFile : IAsyncDisposable, IDisposable
{
    /// <summary>
    /// Gets the uploaded file metadata.
    /// </summary>
    public required UIUploadFile Metadata { get; init; }

    /// <summary>
    /// Gets the readable uploaded file content stream.
    /// </summary>
    public required Stream Content { get; init; }

    /// <inheritdoc />
    public ValueTask DisposeAsync()
        => Content.DisposeAsync();

    /// <inheritdoc />
    public void Dispose()
        => Content.Dispose();
}
