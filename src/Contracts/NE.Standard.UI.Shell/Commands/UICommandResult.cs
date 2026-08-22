using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Shell.Commands;

/// <summary>
/// Represents the result of a UI command execution.
/// </summary>
public sealed class UICommandResult
{
    /// <summary>
    /// Creates a command result. A failed result must provide an error message; a successful one must not.
    /// </summary>
    public UICommandResult(bool success = true, IReadOnlyList<ClientEffect>? effects = null, string? error = null)
    {
        if (!success && string.IsNullOrWhiteSpace(error))
            throw new ArgumentException("A failed command result must provide an error message.", nameof(error));

        if (success && !string.IsNullOrWhiteSpace(error))
            throw new ArgumentException("A successful command result cannot provide an error message.", nameof(error));

        Success = success;
        Effects = effects is null || effects.Count == 0
            ? []
            : [.. effects];
        Error = string.IsNullOrWhiteSpace(error) ? null : error;
    }

    /// <summary>
    /// Gets whether the command completed successfully.
    /// </summary>
    public bool Success { get; }

    /// <summary>
    /// Gets client effects requested by the command.
    /// </summary>
    public ClientEffect[] Effects { get; }

    /// <summary>
    /// Gets the command error message when the command failed.
    /// </summary>
    public string? Error { get; }

    /// <summary>
    /// Creates a successful command result, optionally with client effects.
    /// </summary>
    public static UICommandResult Ok(IReadOnlyList<ClientEffect>? effects = null)
        => new(success: true, effects: effects);

    /// <summary>
    /// Creates a failed command result with the given error message.
    /// </summary>
    public static UICommandResult Fail(string error, IReadOnlyList<ClientEffect>? effects = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(error);
        return new(success: false, error: error, effects: effects);
    }

    /// <summary>
    /// Validates the command result.
    /// </summary>
    public void Validate()
    {
        ArgumentNullException.ThrowIfNull(Effects);

        if (!Success && string.IsNullOrWhiteSpace(Error))
            throw new InvalidOperationException("A failed command result must provide an error message.");

        if (Success && !string.IsNullOrWhiteSpace(Error))
            throw new InvalidOperationException("A successful command result cannot provide an error message.");

        for (var i = 0; i < Effects.Length; i++)
            ArgumentNullException.ThrowIfNull(Effects[i]);
    }
}
