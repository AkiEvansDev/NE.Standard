using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal interface IUIRuntimeConnectionUpdater
{
    /// <summary>The attached instances that are a page someone looks at, a page render's own left out.</summary>
    IReadOnlyList<UIHandle> ViewerHandles { get; }

    void UpdateConnection(UIHandle handle, UIClientServices clientServices);

    /// <summary>
    /// Tells the controller a connection attached with its navigation, once the runtime is ready for it; a render's own attach only
    /// tells it the navigation, and only where it built the runtime (<paramref name="created"/>).
    /// </summary>
    Task NotifyAttachedAsync(UIHandle handle, bool created, CancellationToken cancellationToken);

    /// <summary>
    /// Tells the controller what moved in a connection's session since it last heard, as a command runs — what the page's own switch
    /// takes; the handle is already refreshed.
    /// </summary>
    Task NotifySessionChangedAsync(UIHandle handle, CancellationToken cancellationToken);

    /// <summary>Whether the session moved in anything the controller hears since it last heard it.</summary>
    bool HasSessionMoved(IUserSessionContext session);

    /// <summary>
    /// Queues telling the controller what moved in its session since it last heard, as a command runs, for a page of it another
    /// page's switch reached; the handle is already refreshed.
    /// </summary>
    void PostSessionChanged(UIHandle handle);

    void DetachConnection(string instanceId);

    /// <summary>
    /// Reads a window of items for one instance and answers it what that changed; every other attached instance gets it from the
    /// flush.
    /// </summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIHandle requester, UIItemWindowClientRequest request, CancellationToken cancellationToken);
}
