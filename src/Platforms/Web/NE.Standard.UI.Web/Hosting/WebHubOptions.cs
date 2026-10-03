using System;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures how many calls one page's connection may make to the hub: a token bucket per connection, refilled at
/// <see cref="MaxCallsPerSecond"/> and holding at most <see cref="MaxCallBurst"/>.
/// </summary>
/// <remarks>
/// A connection is one tab. A tab's own traffic is far below the defaults (a value goes when a field is left or a slider let go,
/// one change set at a time); the limit is for a script looping on one socket, which a proxy counting connections never sees.
/// </remarks>
public sealed class WebHubOptions
{
    /// <summary>
    /// Gets or sets how many calls a second one connection may go on making once its burst is spent; zero or <see langword="null"/>
    /// is no such limit.
    /// </summary>
    public int? MaxCallsPerSecond { get; set; } = 100;

    /// <summary>Gets or sets how many calls one connection may make at once, before <see cref="MaxCallsPerSecond"/> holds it back.</summary>
    public int MaxCallBurst { get; set; } = 400;

    /// <summary>Validates the options.</summary>
    public void Validate()
    {
        if (MaxCallsPerSecond < 0)
            throw new InvalidOperationException("Maximum hub calls per second must not be negative.");

        if (MaxCallBurst <= 0)
            throw new InvalidOperationException("Maximum hub call burst must be greater than zero.");
    }
}
