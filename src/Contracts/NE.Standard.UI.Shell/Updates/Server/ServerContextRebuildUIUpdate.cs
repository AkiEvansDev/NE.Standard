using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Requests the client to rebuild a component context.
/// </summary>
public sealed class ServerContextRebuildUIUpdate : ServerUIUpdate
{
    /// <inheritdoc />
    public override ServerUIUpdateKind Kind => ServerUIUpdateKind.ContextRebuild;

    /// <summary>
    /// Gets the component address whose context should be rebuilt.
    /// </summary>
    public required UIComponentAddress Component { get; init; }

    /// <summary>
    /// Gets the rebuilt context value.
    /// </summary>
    public object? Context { get; init; }
}
