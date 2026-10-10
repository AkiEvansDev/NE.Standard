using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Represents a command result together with server-side UI changes produced by the command.
/// </summary>
/// <remarks>A record, so a copy with one part replaced (<c>with</c>) carries every other part, including one added later.</remarks>
public sealed record UICommandExecutionResult
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
    /// Gets whether the server turned the command away before its body ran — busy, not allowed, a closed component — and spent
    /// nothing, rather than running it and failing.
    /// </summary>
    /// <remarks>
    /// What a toast's Undo is pressable again after: a refused run spent nothing. A failed one spent its offer, and so did one its
    /// filters refused once the offer was taken; an action no longer on offer is not refused either — nothing is left to press.
    /// </remarks>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool Refused { get; init; }

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
