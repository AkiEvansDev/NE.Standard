using System;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Represents a command request raised from a compiled UI event.
/// </summary>
public sealed class UICommandRequest
{
    /// <summary>
    /// Gets the compiled event id that raised the command.
    /// </summary>
    public required UIEventId EventId { get; init; }

    /// <summary>
    /// Gets dynamic parameters used to materialize command argument bindings.
    /// </summary>
    public object?[] DynamicParameters { get; init; } = [];

    /// <summary>
    /// Gets the id the client gave this request, echoed on a result pushed later; a background command that carries one is
    /// answered at once and pushes its result when it ends.
    /// </summary>
    /// <remarks>Without one a background command is awaited like any other, since nothing could tell its pushed result apart.</remarks>
    public int? RequestId { get; init; }

    /// <summary>
    /// Validates the command request.
    /// </summary>
    public void Validate()
    {
        if (EventId.IsEmpty)
            throw new InvalidOperationException("Event id must not be empty.");

        ArgumentNullException.ThrowIfNull(DynamicParameters);
    }
}
