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
    /// Gets the updated value.
    /// </summary>
    public object? Value { get; init; }

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
