using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// A user session as it is stored between requests.
/// </summary>
/// <remarks>
/// Immutable: sign a session in by saving a modified copy (<c>session with { IsAuthenticated = true }</c>), not by
/// writing to the one you were given.
/// </remarks>
public sealed record UserSessionState
{
    /// <summary>
    /// Gets the session identifier issued by the store.
    /// </summary>
    public required string SessionId { get; init; }

    /// <summary>
    /// Gets the session language.
    /// </summary>
    public required string Language { get; init; }

    /// <summary>
    /// Gets the preferred theme mode, or <see langword="null"/> to follow the platform's own preference.
    /// </summary>
    public UIThemeMode? ThemeMode { get; init; }

    /// <summary>
    /// Gets whether the session is authenticated.
    /// </summary>
    public bool IsAuthenticated { get; init; }

    /// <summary>
    /// Gets the identifier of the signed-in user, when there is one.
    /// </summary>
    public string? UserId { get; init; }

    /// <summary>
    /// Gets roles assigned to the session.
    /// </summary>
    public IReadOnlySet<string> Roles { get; init; } = FrozenSet<string>.Empty;

    /// <summary>
    /// Gets permissions assigned to the session.
    /// </summary>
    public IReadOnlySet<string> Permissions { get; init; } = FrozenSet<string>.Empty;

    /// <summary>
    /// Gets whether the session id must be replaced at the next shell render.
    /// </summary>
    /// <remarks>
    /// Acted on in the <c>UIViewRequestPhase.Open</c> phase, the one request that can hand the client its id.
    /// </remarks>
    public bool PendingIdRotation { get; init; }

    /// <summary>
    /// Gets when the session was created.
    /// </summary>
    public DateTime CreatedAtUtc { get; init; }

    /// <summary>
    /// Gets when the session was last used, which is what the idle timeout measures.
    /// </summary>
    public DateTime LastSeenAtUtc { get; init; }

    /// <summary>
    /// Validates the stored session.
    /// </summary>
    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(SessionId);
        ArgumentException.ThrowIfNullOrWhiteSpace(Language);
        ArgumentNullException.ThrowIfNull(Roles);
        ArgumentNullException.ThrowIfNull(Permissions);
    }
}
