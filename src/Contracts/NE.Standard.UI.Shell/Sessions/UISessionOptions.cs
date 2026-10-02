using System;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>
/// Configures how long user sessions live and how the client carries its session's secret.
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
    /// Gets or sets how far a session's last-seen time may lag behind: a page load or an attach that would change nothing but
    /// that time, moving it by less, writes nothing to the store, and an open tab's traffic touches it at most this often.
    /// </summary>
    /// <remarks>
    /// Spares a store in a database a write per navigation — two per page load — when idle timeouts are minutes to days anyway;
    /// a session may then expire up to this much early. Never more than a tenth of the timeout the session is under, so a short
    /// timeout keeps its precision; <see cref="TimeSpan.Zero"/> writes every time.
    /// </remarks>
    public TimeSpan TouchResolution { get; set; } = TimeSpan.FromMinutes(1);

    /// <summary>
    /// Gets or sets how often expired sessions are swept.
    /// </summary>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets the name the platform uses to carry the session's secret — the cookie name on the web.
    /// </summary>
    public string ClientKey { get; set; } = "ne.ui.session";

    /// <summary>Gets or sets how long the client keeps the session's secret, from its last page load.</summary>
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

        if (TouchResolution < TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(TouchResolution), TouchResolution, "Session touch resolution must be zero or more.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Session cleanup interval must be greater than zero.");

        ArgumentException.ThrowIfNullOrWhiteSpace(ClientKey);

        if (ClientKeyLifetime is { } lifetime && lifetime <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(ClientKeyLifetime), lifetime, "Client key lifetime must be greater than zero.");
    }
}
