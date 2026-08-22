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
    /// Validates session options.
    /// </summary>
    public void Validate()
    {
        if (IdleTimeout <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(IdleTimeout), IdleTimeout, "Session idle timeout must be greater than zero.");

        if (CleanupInterval <= TimeSpan.Zero)
            throw new ArgumentOutOfRangeException(nameof(CleanupInterval), CleanupInterval, "Session cleanup interval must be greater than zero.");

        ArgumentException.ThrowIfNullOrWhiteSpace(ClientKey);
    }
}
