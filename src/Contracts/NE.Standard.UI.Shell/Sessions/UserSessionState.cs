using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// A user session as it is stored between requests.
/// </summary>
/// <remarks>
/// The persisted counterpart of <see cref="IUserSessionContext"/>, which is the read-only view handed to
/// routing, authorization and the runtime. Immutable so that a store handing the same instance to two
/// concurrent requests cannot be mutated under either of them — sign a session in by saving a modified copy
/// (<c>session with { IsAuthenticated = true }</c>), not by writing to the one you were given.
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
    /// Gets the preferred theme mode.
    /// </summary>
    public UIThemeMode ThemeMode { get; init; } = UIThemeMode.Auto;

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
    /// Set when the session gains an identity, and acted on by the shell render because that is the only half
    /// of a page load that can write the cookie carrying the id — a new id issued over a live connection would
    /// never reach the browser. See <c>docs/PLAN.md</c> §6 for why rotating at all matters.
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
