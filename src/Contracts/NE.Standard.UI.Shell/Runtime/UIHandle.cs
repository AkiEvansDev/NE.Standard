using System;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Identifies a UI runtime instance together with its user session.
/// </summary>
public sealed class UIHandle
{
    /// <summary>
    /// Creates a handle from a validated UI instance and its user session.
    /// </summary>
    public UIHandle(UIInstance instance, IUserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(instance);
        ArgumentNullException.ThrowIfNull(session);

        instance.Validate();

        Instance = instance;
        _session = session;
    }

    /// <summary>
    /// Gets the UI instance.
    /// </summary>
    public UIInstance Instance { get; }

    /// <summary>
    /// Gets the user session: the one the connection attached with, or what a command running for it last wrote into the store.
    /// </summary>
    public IUserSessionContext Session => _session;

    // Swapped whole by the command that changed the session, so a reader never sees half of two sessions.
    private volatile IUserSessionContext _session;

    /// <summary>
    /// Makes <paramref name="session"/> this connection's session — the one its command just stored.
    /// </summary>
    internal void RefreshSession(IUserSessionContext session)
    {
        ArgumentNullException.ThrowIfNull(session);

        if (!string.Equals(session.SessionId, _session.SessionId, StringComparison.Ordinal))
            throw new InvalidOperationException("A connection's session can be refreshed, not replaced by another.");

        _session = session;
    }
}
