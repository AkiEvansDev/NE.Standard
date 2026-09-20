using System;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures how a value too large for the hub reaches the server beside it (<c>docs/VALUES.md</c> §2).
/// </summary>
public sealed class WebValueOptions
{
    /// <summary>
    /// Gets or sets the largest value accepted, in bytes of its JSON; refused while it arrives, not after it is buffered.
    /// </summary>
    public long MaxValueSize { get; set; } = 16 * 1024 * 1024;

    /// <summary>
    /// Gets or sets how long a staged value waits for the hub update that names it.
    /// </summary>
    /// <remarks>
    /// Short on purpose: the client sends the update as soon as the upload answers, so anything left here was never used.
    /// </remarks>
    public TimeSpan StagingRetention { get; set; } = TimeSpan.FromMinutes(2);
}
