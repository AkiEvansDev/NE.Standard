using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Tells the UI client to fetch a staged file.
/// </summary>
public sealed class DownloadFileEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that downloads the file at the given path.
    /// </summary>
    public DownloadFileEffect(string requestPath, string fileName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(requestPath);
        ArgumentException.ThrowIfNullOrWhiteSpace(fileName);

        RequestPath = requestPath;
        FileName = fileName;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.DownloadFile;

    /// <summary>
    /// Gets the path the file is fetched from, relative to the application root. Single-use — the token is dropped when it is read.
    /// </summary>
    public string RequestPath { get; }

    /// <summary>
    /// Gets the name the file is saved as.
    /// </summary>
    public string FileName { get; }
}
