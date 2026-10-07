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
    /// Gets or sets how many bytes of values one session may have staged at once, counting those still arriving; a value
    /// that would cross it is refused while it arrives. Each value counts a fixed kilobyte beyond its JSON.
    /// </summary>
    public long MaxStagedBytesPerSession { get; set; } = 64 * 1024 * 1024;

    /// <summary>
    /// Gets or sets how many bytes of values every session together may have staged at once, counting those still arriving;
    /// zero or <see langword="null"/> is no such limit.
    /// </summary>
    /// <remarks>
    /// A session costs a visitor one page load, so the per-session limit alone bounds nothing: a value that would cross this one is
    /// answered <c>503</c>, since it is the server that is full, not the request that is too large.
    /// </remarks>
    public long? MaxStagedBytesTotal { get; set; } = 512L * 1024 * 1024;

    /// <summary>
    /// Gets or sets how many bytes of the server's own large values one session may have staged for its tabs at once; a value
    /// that would cross it travels inline in its message instead.
    /// </summary>
    /// <remarks>
    /// Apart from the client's allowance, so a page's own values never crowd out what the reader sends. Inline is the fallback, not a
    /// refusal: the client takes a value of any size off the hub, at the cost of holding the connection while it arrives.
    /// </remarks>
    public long MaxOutgoingStagedBytesPerSession { get; set; } = 32 * 1024 * 1024;

    /// <summary>
    /// Gets or sets how many bytes of the server's own large values every session together may have staged at once; zero or
    /// <see langword="null"/> is no such limit. A value that would cross it travels inline.
    /// </summary>
    public long? MaxOutgoingStagedBytesTotal { get; set; } = 256L * 1024 * 1024;

    /// <summary>
    /// Gets or sets how long a staged value waits for the hub update that names it.
    /// </summary>
    /// <remarks>
    /// Short on purpose: the client sends the update as soon as the upload answers, so anything left here was never used.
    /// </remarks>
    public TimeSpan StagingRetention { get; set; } = TimeSpan.FromMinutes(2);

    /// <summary>Validates the options.</summary>
    public void Validate()
    {
        if (MaxValueSize <= 0)
            throw new InvalidOperationException("Maximum value size must be greater than zero.");

        if (MaxStagedBytesPerSession <= 0)
            throw new InvalidOperationException("Maximum staged bytes per session must be greater than zero.");

        if (MaxStagedBytesTotal < 0)
            throw new InvalidOperationException("Maximum staged bytes in total must not be negative.");

        if (MaxOutgoingStagedBytesPerSession <= 0)
            throw new InvalidOperationException("Maximum outgoing staged bytes per session must be greater than zero.");

        if (MaxOutgoingStagedBytesTotal < 0)
            throw new InvalidOperationException("Maximum outgoing staged bytes in total must not be negative.");

        if (StagingRetention <= TimeSpan.Zero)
            throw new InvalidOperationException("Staging retention must be greater than zero.");
    }
}
