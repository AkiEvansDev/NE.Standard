using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Shell.Hosting;

/// <summary>
/// Defines the client-facing endpoint used to attach runtimes and process UI updates.
/// </summary>
public interface IUIClientEndpoint
{
    /// <summary>
    /// Attaches a runtime for a resolved view and client tab.
    /// </summary>
    Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, string clientTabId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Attaches a runtime for a resolved view and client tab.
    /// </summary>
    Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, UIInstance instance, CancellationToken cancellationToken = default);

    /// <summary>
    /// Detaches a runtime connection by transport instance id.
    /// </summary>
    bool DetachRuntime(string instanceId);

    /// <summary>
    /// Detaches a runtime from the client endpoint.
    /// </summary>
    bool DetachRuntime(UIHandle handle);

    /// <summary>
    /// Processes client-originated value changes.
    /// </summary>
    Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default);

    /// <summary>
    /// Processes a client-originated UI event.
    /// </summary>
    Task<UICommandExecutionResult> ProcessEventAsync(UIHandle handle, UICommandRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reads a window of items for a windowed host.
    /// </summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Flushes pending server-originated changes for a runtime.
    /// </summary>
    Task<ServerChangeSet> FlushAsync(UIHandle handle, CancellationToken cancellationToken = default);
}
