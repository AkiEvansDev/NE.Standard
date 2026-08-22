using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Shell.Updates.Client;

/// <summary>
/// Represents a client-originated component property value update.
/// </summary>
public sealed class ClientValueUIUpdate : ClientUIUpdate
{
    /// <inheritdoc />
    public override ClientUIUpdateKind Kind => ClientUIUpdateKind.Value;

    /// <summary>
    /// Gets the updated property address.
    /// </summary>
    public required UIPropertyAddress Address { get; init; }

    /// <summary>
    /// Gets dynamic parameters associated with the update.
    /// </summary>
    public object?[] DynamicParameters { get; init; } = [];

    /// <summary>
    /// Gets the updated value.
    /// </summary>
    public object? Value { get; init; }
}
