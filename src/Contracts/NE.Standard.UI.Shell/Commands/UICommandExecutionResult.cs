using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
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
    /// Gets whether the command was only accepted: it runs on, and its result is pushed later carrying <see cref="RequestId"/>.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Accepted { get; init; }

    /// <summary>
    /// Gets the id of the request a pushed result ends; null on an invoke's own answer and on a result nobody asked for.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? RequestId { get; init; }

    /// <summary>
    /// Gets the run an accepted command goes on with, answering whether it succeeded; never faults. Not serialized.
    /// </summary>
    internal Task<bool>? Completion { get; init; }

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
