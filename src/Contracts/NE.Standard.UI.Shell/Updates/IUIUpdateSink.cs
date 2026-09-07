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
    /// Takes the instances explicitly rather than from <paramref name="handle"/>: a runtime can be shared,
    /// and the change set is the same for all of them.
    /// </remarks>
    Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a command execution result to the one client instance that invoked it.
    /// </summary>
    /// <remarks>
    /// Effects are personal: a focus or a scroll belongs to the connection that asked for it, not to every tab sharing the runtime.
    /// </remarks>
    Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default);
}
