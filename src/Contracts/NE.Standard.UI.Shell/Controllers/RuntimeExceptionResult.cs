using System;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Shell.Controllers;

/// <summary>
/// Describes how the runtime should continue after an exception is handled.
/// </summary>
public sealed class RuntimeExceptionResult
{
    /// <summary>
    /// Gets the command result to return to the client, when applicable.
    /// </summary>
    public UICommandResult? Command { get; init; }

    /// <summary>
    /// Gets whether the runtime should request a full client resynchronization.
    /// </summary>
    public bool RequestFullResync { get; init; }

    /// <summary>
    /// Gets an empty exception result.
    /// </summary>
    public static RuntimeExceptionResult Empty { get; } = new()
    {
        Command = null,
        RequestFullResync = false
    };

    /// <summary>
    /// Creates an exception result with a command result.
    /// </summary>
    public static RuntimeExceptionResult CommandResult(UICommandResult command)
    {
        ArgumentNullException.ThrowIfNull(command);

        return new RuntimeExceptionResult
        {
            Command = command,
            RequestFullResync = false
        };
    }

    /// <summary>
    /// Creates an exception result that requests a full client resynchronization.
    /// </summary>
    public static RuntimeExceptionResult FullResync(UICommandResult? command = null)
        => new()
        {
            Command = command,
            RequestFullResync = true
        };

    /// <summary>
    /// Validates the exception result.
    /// </summary>
    public void Validate()
        => Command?.Validate();
}
