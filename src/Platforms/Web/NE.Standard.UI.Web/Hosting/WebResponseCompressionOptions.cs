using System.IO.Compression;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures the response compression the framework installs in front of its own endpoints.
/// </summary>
public sealed class WebResponseCompressionOptions
{
    /// <summary>
    /// Gets or sets whether the framework installs the compression middleware.
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Gets or sets whether compression also applies over HTTPS; leave off if a secret sits next to attacker-controlled text (BREACH).
    /// </summary>
    public bool EnableForHttps { get; set; } = true;

    /// <summary>
    /// Gets or sets the level both compression providers run at; set to <see cref="CompressionLevel.Optimal"/> since both
    /// default to <see cref="CompressionLevel.Fastest"/>.
    /// </summary>
    public CompressionLevel Level { get; set; } = CompressionLevel.Optimal;
}
