using System;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Writes an author's mistake to the page's console — what the runtime sends in Development beside the error in its log, as when a
/// command's effect names nothing on the page and is dropped.
/// </summary>
public sealed class DevelopmentReportEffect : ClientEffect
{
    /// <summary>
    /// Creates a report of <paramref name="message"/>.
    /// </summary>
    [JsonConstructor]
    public DevelopmentReportEffect(string message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        Message = message;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.DevelopmentReport;

    /// <summary>
    /// Gets what went wrong, in the words the server's log has.
    /// </summary>
    public string Message { get; }
}
