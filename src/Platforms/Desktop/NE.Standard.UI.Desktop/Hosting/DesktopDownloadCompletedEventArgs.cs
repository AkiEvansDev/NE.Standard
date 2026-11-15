using System;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Reports the outcome of a file download handled by <see cref="DesktopShellControl"/>.</summary>
public sealed class DesktopDownloadCompletedEventArgs(Uri sourceUri, string resultFilePath, bool succeeded) : EventArgs
{
    /// <summary>Gets the source URI of the download.</summary>
    public Uri SourceUri { get; } = sourceUri ?? throw new ArgumentNullException(nameof(sourceUri));

    /// <summary>Gets the local destination path selected for the download.</summary>
    public string ResultFilePath { get; } = resultFilePath ?? throw new ArgumentNullException(nameof(resultFilePath));

    /// <summary>Gets whether the download completed without interruption or cancellation.</summary>
    public bool Succeeded { get; } = succeeded;
}
