using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Represents a command request raised from a compiled UI event, or from an action the runtime offered the page (a notification's).
/// </summary>
public sealed class UICommandRequest
{
    /// <summary>
    /// Gets the compiled event id that raised the command; empty for an offered action.
    /// </summary>
    public UIEventId EventId { get; init; }

    /// <summary>
    /// Gets the id of the action the runtime offered the page (<c>UINotificationAction</c>), run once, in place of an event.
    /// </summary>
    public string? Action { get; init; }

    /// <summary>
    /// Gets dynamic parameters used to materialize command argument bindings.
    /// </summary>
    [JsonConverter(typeof(UIDynamicParametersJsonConverter))]
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
        if (EventId.IsEmpty == (Action is null))
            throw new InvalidOperationException("A command request names either an event or an offered action.");

        if (Action is not null && string.IsNullOrWhiteSpace(Action))
            throw new InvalidOperationException("Action id must not be blank.");

        ArgumentNullException.ThrowIfNull(DynamicParameters);
    }
}
