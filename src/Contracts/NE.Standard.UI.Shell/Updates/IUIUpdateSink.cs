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
    /// <summary>Sends UI changes to every client instance attached to the runtime.</summary>
    /// <remarks>
    /// Takes the instances explicitly rather than from <paramref name="handle"/>: a runtime can be shared,
    /// and the change set is the same for all of them.
    /// <para>
    /// One runtime's pages are sent to at once: calls for disjoint instances of the same runtime may run concurrently, while the next
    /// set for an instance waits until its last call returned. <paramref name="cancellationToken"/> also fires when one call outlasts
    /// <c>UIPersistenceOptions.SendTimeout</c>; a call given up counts as failed and the runtime is asked for a full resync, so a sink
    /// that cannot tell whether its client got part of the set should drop that client's connection rather than leave it half-applied.
    /// </para>
    /// </remarks>
    Task SendChangesAsync(UIHandle handle, IReadOnlyCollection<string> instanceIds, ServerChangeSet changes, CancellationToken cancellationToken = default);

    /// <summary>Sends a command execution result to the one client instance that invoked it.</summary>
    /// <remarks>
    /// Effects are personal: a focus or a scroll belongs to the connection that asked for it, not to every tab sharing the runtime.
    /// </remarks>
    Task SendCommandResultAsync(UIHandle handle, UICommandExecutionResult result, CancellationToken cancellationToken = default);
}
