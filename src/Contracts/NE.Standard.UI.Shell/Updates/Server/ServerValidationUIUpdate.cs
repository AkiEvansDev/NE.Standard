using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Reports that the server refused a value the client sent, so the input can show why.
/// </summary>
/// <remarks>
/// Deliberately not a <see cref="ServerValueUIUpdate"/>: a refusal must not patch the value while the client shows what the user typed.
/// </remarks>
public sealed class ServerValidationUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.Validation;

    /// <summary>
    /// Gets the address of the property whose value was refused.
    /// </summary>
    public required UIPropertyAddress Address { get; init; }

    /// <summary>
    /// Gets the message to display, or <see langword="null"/> to clear a previously reported one.
    /// </summary>
    public string? Message { get; init; }

    /// <summary>
    /// Gets the severity the message is displayed with.
    /// </summary>
    public UIValidationSeverity Severity { get; init; } = UIValidationSeverity.Error;
}
