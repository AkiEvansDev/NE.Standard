using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled UI event handler.
/// </summary>
public sealed class CompiledUIEvent
{
    /// <summary>
    /// Gets the compiled event id.
    /// </summary>
    public required UIEventId Id { get; init; }

    /// <summary>
    /// Gets the component event address.
    /// </summary>
    public required CompiledUIEventAddress Address { get; init; }

    /// <summary>
    /// Gets the command invoked by the event.
    /// </summary>
    public required string Command { get; init; }

    /// <summary>
    /// Gets the compiled command arguments.
    /// </summary>
    public CompiledUIActionArgument[] Arguments { get; init; } = [];
}
