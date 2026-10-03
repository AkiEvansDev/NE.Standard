using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Testing;

/// <summary>What one act on a page came to: whether it reached the server, how the command answered, and the effects it brought.</summary>
public sealed class UITestCommandResult
{
    private UITestCommandResult(bool sent, bool succeeded, string? error, IReadOnlyList<ClientEffect> effects)
    {
        Sent = sent;
        Succeeded = succeeded;
        Error = error;
        Effects = effects;
    }

    /// <summary>Gets whether a command reached the server; an event with no command, or one the page refused, sends none.</summary>
    public bool Sent { get; }

    /// <summary>Gets whether the command succeeded, or the page ran the event without one; false where the page or the server refused it.</summary>
    public bool Succeeded { get; }

    /// <summary>Gets why it failed: the command's error, or the page's own refusal.</summary>
    public string? Error { get; }

    /// <summary>Gets the effects the page received while it ran, pushed ones included.</summary>
    public IReadOnlyList<ClientEffect> Effects { get; }

    internal static UITestCommandResult Answered(bool succeeded, string? error, IReadOnlyList<ClientEffect> effects)
        => new(sent: true, succeeded, error, effects);

    internal static UITestCommandResult RanOnPage(IReadOnlyList<ClientEffect> effects)
        => new(sent: false, succeeded: true, error: null, effects);

    internal static UITestCommandResult Refused(string reason)
        => new(sent: false, succeeded: false, reason, []);
}
