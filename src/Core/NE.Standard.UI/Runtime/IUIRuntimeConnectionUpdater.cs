using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal interface IUIRuntimeConnectionUpdater
{
    /// <summary>The attached instances that are a page someone looks at, a page render's own left out.</summary>
    IReadOnlyList<UIHandle> ViewerHandles { get; }

    void UpdateConnection(UIHandle handle, UIClientServices clientServices);

    /// <summary>Tells the controller a connection attached, once the runtime is ready for it; a render's own attach is not one.</summary>
    Task NotifyAttachedAsync(UIHandle handle, CancellationToken cancellationToken);

    /// <summary>
    /// Tells the controller a connection's session moved to another language, as a command runs — what the page's own switch
    /// takes; the handle is already refreshed.
    /// </summary>
    Task NotifyLanguageChangedAsync(UIHandle handle, string previousLanguage, CancellationToken cancellationToken);

    void DetachConnection(string instanceId);

    /// <summary>
    /// Reads a window of items for one instance and answers it what that changed; every other attached instance gets it from the
    /// flush.
    /// </summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIHandle requester, UIItemWindowClientRequest request, CancellationToken cancellationToken);
}
