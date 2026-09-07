using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Limits and lifetimes for file transfer.
/// </summary>
public sealed class UIFileOptions
{
    /// <summary>
    /// Gets or sets the largest single file accepted, in bytes.
    /// </summary>
    /// <remarks>
    /// Enforced at the endpoint while the part streams, not after buffering it; distinct from <c>FileInputComponent.MaxFileSize</c>,
    /// which is picker chrome a client can ignore.
    /// </remarks>
    public long MaxFileSize { get; set; } = 32 * 1024 * 1024;

    /// <summary>
    /// Gets or sets how many files one selection may carry.
    /// </summary>
    public int MaxFilesPerSelection { get; set; } = 16;

    /// <summary>
    /// Gets or sets how long an uploaded selection is kept before the sweep removes it.
    /// </summary>
    public TimeSpan UploadRetention { get; set; } = TimeSpan.FromHours(1);

    /// <summary>
    /// Gets or sets how long a staged download waits to be fetched.
    /// </summary>
    /// <remarks>
    /// Short on purpose: the client fetches it immediately, so anything left here was never collected.
    /// </remarks>
    public TimeSpan DownloadRetention { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets how often staged content is swept.
    /// </summary>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets where the default file-system store keeps content. Null uses a folder under the system
    /// temp directory.
    /// </summary>
    public string? StorageRoot { get; set; }

    /// <summary>
    /// Validates the options.
    /// </summary>
    public void Validate()
    {
        if (MaxFileSize <= 0)
            throw new InvalidOperationException("Maximum file size must be greater than zero.");

        if (MaxFilesPerSelection <= 0)
            throw new InvalidOperationException("Maximum files per selection must be greater than zero.");

        if (UploadRetention <= TimeSpan.Zero || DownloadRetention <= TimeSpan.Zero)
            throw new InvalidOperationException("File retention must be greater than zero.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new InvalidOperationException("File cleanup interval must be greater than zero.");
    }
}
