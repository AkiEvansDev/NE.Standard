using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Describes a file selected for upload by the UI client.
/// </summary>
public sealed class UIUploadFile
{
    /// <summary>
    /// Gets the file id issued by the store.
    /// </summary>
    /// <remarks>
    /// Server-issued, never taken from the client: an id the client chooses is one it can make collide with —
    /// or guess at — another client's. See <c>docs/FILES.md</c> §5.
    /// </remarks>
    public required string FileId { get; init; }

    /// <summary>
    /// Gets the uploaded file name.
    /// </summary>
    public required string FileName { get; init; }

    /// <summary>
    /// Gets the uploaded file content type, when provided.
    /// </summary>
    public string? ContentType { get; init; }

    /// <summary>
    /// Gets the uploaded file size in bytes.
    /// </summary>
    public long Size { get; init; }

    /// <summary>
    /// Validates the upload file metadata.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(FileId);
        ArgumentException.ThrowIfNullOrWhiteSpace(FileName);

        if (Size < 0)
            throw new ArgumentOutOfRangeException(nameof(Size), Size, "File size cannot be negative.");
    }
}
