using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
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
    /// Tells a kept runtime a page render is about to paint what moved in its session since it last heard, so the paint is already in
    /// it; one that heard it all is left alone.
    /// </summary>
    Task HearBeforeRenderAsync(IUIRuntime runtime, UIViewResolution resolution, CancellationToken cancellationToken = default);

    /// <summary>Takes the key a sign-in issued while a page render ran the controller's code, for that render's response to hand out.</summary>
    UISessionSecret? TakeRenderKey(UIHandle handle);

    /// <summary>Whether an attach from <paramref name="clientWindowId"/> resolved to the very runtime <paramref name="handle"/> is attached to.</summary>
    bool NamesRuntimeOf(UIHandle handle, UIViewResolution resolution, string clientWindowId);

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

    /// <summary>
    /// Makes what a page reports of itself — on screen or not, its notification permission — its handle's and its runtime's, whose
    /// controller hears what changed.
    /// </summary>
    void ReportClientState(UIHandle handle, UIClientState state);

    /// <summary>
    /// Makes a session the page itself stored — its language, theme or colours switch — its connection's, tells its controller what moved,
    /// and brings the session's other pages to it; no effect is sent back to the page, which switched itself.
    /// </summary>
    Task ApplySessionChangeAsync(UIHandle handle, UserSessionState session, CancellationToken cancellationToken = default);

    /// <summary>
    /// Brings every page open under a session to it as stored, each runtime's controller told what moved — for a session a page with
    /// no runtime of its own stored, which <see cref="ApplySessionChangeAsync"/> has no handle for.
    /// </summary>
    Task ReachSessionAsync(UserSessionState session, CancellationToken cancellationToken = default);
}
