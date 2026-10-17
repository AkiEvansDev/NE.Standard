using System;
using System.Globalization;
using Microsoft.Extensions.Configuration;

namespace NE.Standard.UI.Web.Hosting;

/// <summary>
/// Configures how many calls one page's connection may make to the hub: a token bucket per connection, refilled at
/// <see cref="MaxCallsPerSecond"/> and holding at most <see cref="MaxCallBurst"/>; and, in Development, a slow link to try the
/// page over (<see cref="SimulatedLatency"/>).
/// </summary>
/// <remarks>
/// A connection is one tab. A tab's own traffic is far below the defaults (a value goes when a field is left or a slider let go,
/// one change set at a time); the limit is for a script looping on one socket, which a proxy counting connections never sees.
/// </remarks>
public sealed class WebHubOptions
{
    /// <summary>
    /// The configuration key <see cref="SimulatedLatency"/> is read from, so a launch profile or the command line sets it: a time span
    /// (<c>00:00:00.8</c>) or a whole number of milliseconds (<c>800</c>).
    /// </summary>
    public const string SimulatedLatencyKey = "NE:Hub:SimulatedLatency";

    /// <summary>
    /// Gets or sets how many calls a second one connection may go on making once its burst is spent; zero or <see langword="null"/>
    /// is no such limit.
    /// </summary>
    public int? MaxCallsPerSecond { get; set; } = 100;

    /// <summary>Gets or sets how many calls one connection may make at once, before <see cref="MaxCallsPerSecond"/> holds it back.</summary>
    public int MaxCallBurst { get; set; } = 400;

    /// <summary>
    /// Gets or sets how long the server waits before it handles each call a page makes — a command, a change set of values, a read
    /// of rows — so the page can be tried as over a slow link; <see langword="null"/> (the default) is no wait. Development only:
    /// set anywhere else, it is ignored with a warning. Read from <see cref="SimulatedLatencyKey"/> too.
    /// </summary>
    /// <remarks>
    /// One connection's calls run one at a time, so calls sent together wait one after another, where a real link would carry them
    /// side by side: a burst reads slower than it would.
    /// </remarks>
    public TimeSpan? SimulatedLatency { get; set; }

    /// <summary>Validates the options.</summary>
    public void Validate()
    {
        if (MaxCallsPerSecond < 0)
            throw new InvalidOperationException("Maximum hub calls per second must not be negative.");

        if (MaxCallBurst <= 0)
            throw new InvalidOperationException("Maximum hub call burst must be greater than zero.");

        if (SimulatedLatency < TimeSpan.Zero)
            throw new InvalidOperationException("Simulated hub latency must not be negative.");
    }

    /// <summary>Takes <see cref="SimulatedLatency"/> from <see cref="SimulatedLatencyKey"/> where the configuration names one.</summary>
    internal void ReadConfiguration(IConfiguration? configuration)
    {
        var text = configuration?[SimulatedLatencyKey];

        if (string.IsNullOrWhiteSpace(text))
            return;

        // A bare number is milliseconds: read as a time span, "800" would be eight hundred days.
        if (int.TryParse(text, NumberStyles.None, CultureInfo.InvariantCulture, out var milliseconds))
            SimulatedLatency = TimeSpan.FromMilliseconds(milliseconds);
        else if (TimeSpan.TryParse(text, CultureInfo.InvariantCulture, out TimeSpan latency))
            SimulatedLatency = latency;
        else
            throw new InvalidOperationException($"Configuration '{SimulatedLatencyKey}' is '{text}'; give a time span (00:00:00.8) or milliseconds (800).");
    }
}
