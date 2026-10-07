using System;
using System.Threading;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Identifies a UI runtime instance together with its user session.
/// </summary>
public sealed class UIHandle
{
    /// <summary>
    /// Creates a handle from a validated UI instance, its user session and what is known about its connection.
    /// </summary>
    public UIHandle(UIInstance instance, IUserSessionContext session, UIConnectionInfo? connection = null)
    {
        ArgumentNullException.ThrowIfNull(instance);
        ArgumentNullException.ThrowIfNull(session);

        instance.Validate();

        Instance = instance;
        Connection = connection ?? UIConnectionInfo.Unknown;
        _session = session;
        _clientState = instance.ClientState;
    }

    /// <summary>
    /// Gets the UI instance.
    /// </summary>
    public UIInstance Instance { get; }

    /// <summary>Gets what the platform knows about the connection: its address, its client, where it was served from.</summary>
    public UIConnectionInfo Connection { get; }

    /// <summary>
    /// Gets the user session: the one the connection attached with, or what a command running for it last wrote into the store.
    /// </summary>
    public IUserSessionContext Session => _session;

    // Swapped whole by the command that changed the session, so a reader never sees half of two sessions.
    private volatile IUserSessionContext _session;

    /// <summary>Gets what the connection's page last reported of itself: whether it is on screen, what the browser lets it show.</summary>
    public UIClientState ClientState => Volatile.Read(ref _clientState);

    // Swapped whole as the page reports, so a reader never sees half of two reports.
    private UIClientState _clientState;

    /// <summary>Makes <paramref name="state"/> what this connection's page reports, and answers what it reported before.</summary>
    internal UIClientState RefreshClientState(UIClientState state)
    {
        ArgumentNullException.ThrowIfNull(state);

        return Interlocked.Exchange(ref _clientState, state);
    }

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
