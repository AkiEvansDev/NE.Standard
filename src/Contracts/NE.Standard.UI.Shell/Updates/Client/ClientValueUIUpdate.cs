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
    /// The property written, addressed by the keys of every row its component stands in, outermost first; the binding reads as many
    /// of the outer ones as it is bound under (none in the Root scope).
    /// </summary>
    public required UIPropertyAddress Address { get; init; }

    /// <summary>
    /// Gets the updated value.
    /// </summary>
    public object? Value { get; init; }
}
