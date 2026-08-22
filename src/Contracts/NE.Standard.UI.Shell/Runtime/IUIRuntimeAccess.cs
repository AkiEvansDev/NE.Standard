using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Provides synchronized access to a UI runtime.
/// </summary>
public interface IUIRuntimeAccess
{
    /// <summary>
    /// Executes an action on the runtime and returns produced server changes.
    /// </summary>
    Task<ServerChangeSet> InvokeAsync(Action action, CancellationToken cancellationToken = default);

    /// <summary>
    /// Executes an asynchronous action on the runtime and returns produced server changes.
    /// </summary>
    Task<ServerChangeSet> InvokeAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default);

    /// <summary>
    /// Requests a full client resynchronization on the next runtime flush.
    /// </summary>
    void RequestFullResync();
}
