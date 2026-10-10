using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Sessions;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// What a runtime does when code running for one of its connections changed that connection's session.
/// </summary>
internal interface IUISessionChangeListener
{
    /// <summary>
    /// Tells the controller and the connection, in the flow of the code that made the change, and the session's other pages; the
    /// handle is already refreshed, <paramref name="previous"/> is the session it carried before.
    /// </summary>
    Task SessionChangedAsync(UIHandle handle, IUserSessionContext previous, CancellationToken cancellationToken);
}
