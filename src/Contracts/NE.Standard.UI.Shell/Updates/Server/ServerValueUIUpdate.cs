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
}
