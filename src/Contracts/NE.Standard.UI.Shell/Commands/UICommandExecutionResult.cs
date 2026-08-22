using System;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Represents a command result together with server-side UI changes produced by the command.
/// </summary>
public sealed class UICommandExecutionResult
{
    /// <summary>
    /// Gets the command result.
    /// </summary>
    public required UICommandResult Command { get; init; }

    /// <summary>
    /// Gets server-side changes produced by the command.
    /// </summary>
    public required ServerChangeSet Changes { get; init; }

    /// <summary>
    /// Validates the command execution result.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Command);
        ArgumentNullException.ThrowIfNull(Changes);

        Command.Validate();
        Changes.Validate();
    }
}
