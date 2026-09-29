using System;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Configures how long user sessions live and how the client carries its session id.
/// </summary>
public sealed class UISessionOptions
{
    /// <summary>
    /// Gets or sets how long a session survives without being used.
    /// </summary>
    public TimeSpan IdleTimeout { get; set; } = TimeSpan.FromHours(2);

    /// <summary>
    /// Gets or sets how long a session survives that no client has used yet — issued by a page render, with no tab attached
    /// and nothing written into it (<see cref="UserSessionState.IsUnclaimed"/>).
    /// </summary>
    /// <remarks>
    /// What a crawler or a health check leaves behind: every request without a cookie is a new session. Long enough for a slow
    /// page to attach its tab; a tab that attaches later is given a new session, as after any expiry.
    /// </remarks>
    public TimeSpan UnclaimedIdleTimeout { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets how often expired sessions are swept.
    /// </summary>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets the name the platform uses to carry the session id — the cookie name on the web.
    /// </summary>
    public string ClientKey { get; set; } = "ne.ui.session";

    /// <summary>Gets or sets how long the client keeps the session id, from its last page load.</summary>
    /// <remarks>
    /// <see langword="null"/> ties it to the client's own lifetime, signing the person out when that ends. Set it to how long a stored
    /// session may survive across app restarts.
    /// </remarks>
    public TimeSpan? ClientKeyLifetime { get; set; }

    /// <summary>
    /// Validates session options.
    /// </summary>
    public void Validate()
    {
        if (IdleTimeout <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(IdleTimeout), IdleTimeout, "Session idle timeout must be greater than zero.");

        if (UnclaimedIdleTimeout <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(UnclaimedIdleTimeout), UnclaimedIdleTimeout, "Unclaimed session idle timeout must be greater than zero.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Session cleanup interval must be greater than zero.");

        ArgumentException.ThrowIfNullOrWhiteSpace(ClientKey);

        if (ClientKeyLifetime is { } lifetime && lifetime <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(ClientKeyLifetime), lifetime, "Client key lifetime must be greater than zero.");
    }
}
