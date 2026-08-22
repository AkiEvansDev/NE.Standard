using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Updates;

/// <summary>
/// Sends server-originated updates and command results to a connected UI client.
/// </summary>
public interface IUIUpdateSink
{
    /// <summary>
    /// Sends UI changes to every client instance attached to the runtime.
    /// </summary>
    /// <remarks>
    /// Takes the instances explicitly rather than deriving them from <paramref name="handle"/>, which names
    /// one connection: a runtime can be shared by several (two tabs duplicated from one, a reconnect racing a
    /// disconnect), and a change set describes controller state, which is the same for all of them. A command
    /// result stays targeted — see <see cref="SendCommandResultAsync"/>.
    /// </remarks>
    Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a command execution result to the one client instance that invoked it. Effects are personal —
    /// a focus or a scroll belongs to the connection that asked for it, not to every tab sharing the runtime.
    /// </summary>
    Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default);
}
