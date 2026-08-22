using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Reports that the server refused a value the client sent, so the input can show why.
/// </summary>
/// <remarks>
/// Deliberately not a <see cref="ServerValueUIUpdate"/> carrying an extra field: that type means "this
/// property's value is now X" and is emitted by the ordinary diff pipeline, which has no business knowing
/// about validation. A refusal is also the one case where the value must *not* be patched — the client is
/// still showing what the user typed, and rolling it back would erase it.
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
    public UIColorStyle Severity { get; init; } = UIColorStyle.Danger;
}
