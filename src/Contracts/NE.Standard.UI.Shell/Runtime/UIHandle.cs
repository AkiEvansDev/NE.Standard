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
        Session = session;
    }

    /// <summary>
    /// Gets the UI instance.
    /// </summary>
    public UIInstance Instance { get; }

    /// <summary>
    /// Gets the user session.
    /// </summary>
    public IUserSessionContext Session { get; }
}
