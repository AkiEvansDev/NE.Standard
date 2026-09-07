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
    /// Gets or sets how often expired sessions are swept.
    /// </summary>
    public TimeSpan CleanupInterval { get; set; } = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Gets or sets the name the platform uses to carry the session id — the cookie name on the web.
    /// </summary>
    public string ClientKey { get; set; } = "ne.ui.session";

    /// <summary>
    /// Gets or sets how long the client keeps the session id, counted from its last page load; <see langword="null"/>
    /// keeps it only for the client's own lifetime, so a signed-in person is signed out once that ends. An
    /// application that keeps sessions across its own restarts sets this to what it is willing to have a stored
    /// session survive.
    /// </summary>
    public TimeSpan? ClientKeyLifetime { get; set; }

    /// <summary>
    /// Validates session options.
    /// </summary>
    public void Validate()
    {
        if (IdleTimeout <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(IdleTimeout), IdleTimeout, "Session idle timeout must be greater than zero.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Session cleanup interval must be greater than zero.");

        ArgumentException.ThrowIfNullOrWhiteSpace(ClientKey);

        if (ClientKeyLifetime is { } lifetime && lifetime <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(ClientKeyLifetime), lifetime, "Client key lifetime must be greater than zero.");
    }
}
