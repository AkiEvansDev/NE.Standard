using System.Collections.Generic;
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
    /// Attaches a runtime for a resolved view and client window.
    /// </summary>
    Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, string clientWindowId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Attaches a runtime for a resolved view and client window.
    /// </summary>
    Task<RuntimeResolution> AttachRuntimeAsync(UIViewResolution resolution, UIInstance instance, CancellationToken cancellationToken = default);

    /// <summary>The runtime a page render may read its values from, when the host can say which one this load belongs to.</summary>
    /// <remarks>
    /// Null means "render a fresh page": a render knows the session and address, not the window, so this answers only
    /// when unambiguous without it.
    /// </remarks>
    IUIRuntime? TryGetRenderRuntime(UIViewResolution resolution);

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

    /// <summary>Processes a client-originated UI event.</summary>
    /// <remarks>
    /// A background command answered as accepted keeps <paramref name="cancellationToken"/> while it runs on, so a transport
    /// passes one that lives as long as the connection, not the request.
    /// </remarks>
    Task<UICommandExecutionResult> ProcessEventAsync(UIHandle handle, UICommandRequest request, CancellationToken cancellationToken = default);

    /// <summary>Answers a page asking to leave for <paramref name="target"/> while it holds unsaved work.</summary>
    Task<UICommandExecutionResult> RequestLeaveAsync(UIHandle handle, string target, CancellationToken cancellationToken = default);

    /// <summary>
    /// Answers the reader going back or forward to another history entry of the page's own route: its controller hears the entry's
    /// <paramref name="parameters"/> in <c>OnNavigatedAsync</c> on the same runtime, the view filters not run again.
    /// </summary>
    Task<UICommandExecutionResult> NavigateInPlaceAsync(UIHandle handle, IReadOnlyDictionary<string, object?>? parameters, CancellationToken cancellationToken = default);

    /// <summary>
    /// Reads a window of items for a windowed host.
    /// </summary>
    Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Flushes pending server-originated changes for a runtime.
    /// </summary>
    Task<ServerChangeSet> FlushAsync(UIHandle handle, CancellationToken cancellationToken = default);
}
