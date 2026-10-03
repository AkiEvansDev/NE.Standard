using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Represents a server-originated component property value update.
/// </summary>
public sealed class ServerValueUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.Value;

    /// <summary>
    /// Gets the updated property address.
    /// </summary>
    public required UIPropertyAddress Address { get; init; }

    /// <summary>
    /// Gets the updated value; left out on the wire when it is null, which the page reads as null.
    /// </summary>
    /// <remarks>
    /// Written whole otherwise, nulls inside it included: a package's operation reads a component's value as it is handed it (a
    /// graph's document, a chart's window), where an item is read through the page's one rule for a property it does not carry.
    /// </remarks>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Value { get; init; }

    /// <summary>
    /// Gets whether the value is words read off an item that says they are content (<c>IContentItem</c>): the page shows them as
    /// written rather than looking them up. Sent only when true.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Content { get; init; }

    /// <summary>
    /// Gets the token a value too large to travel inline was staged under, fetched by the client in its place; null when
    /// <see cref="Value"/> carries it.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ValueToken { get; init; }

    /// <summary>
    /// Gets the client instance that already holds this value because it just wrote it, and is not sent the update; null when
    /// every instance is.
    /// </summary>
    [JsonIgnore]
    public string? ExceptInstanceId { get; init; }
}
