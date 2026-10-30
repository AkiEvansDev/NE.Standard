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
/// Defines the client-facing endpoint used to attach runtimes and process UI updates, whatever carries them to the client.
/// </summary>
/// <remarks>A platform that draws a page on the server before the client attaches uses <see cref="IUIRenderEndpoint"/> too.</remarks>
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
    /// <exception cref="System.InvalidOperationException">Called from inside an <c>InvokeAsync</c> action, which holds a runtime's lock.</exception>
    Task<ServerChangeSet> ProcessChangeSetAsync(UIHandle handle, ClientChangeSet changeSet, CancellationToken cancellationToken = default);

    /// <summary>Processes a client-originated UI event.</summary>
    /// <remarks>
    /// Only an awaited command runs on <paramref name="cancellationToken"/>; a background command answered as accepted lives on its tab's
    /// stay on the runtime, so a dropped connection does not cancel it and the page attaching again from the same window hears its result.
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
    /// <exception cref="System.InvalidOperationException">Called from inside an <c>InvokeAsync</c> action, which holds a runtime's lock.</exception>
    Task<ServerChangeSet> RequestItemWindowAsync(UIHandle handle, UIItemWindowClientRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Flushes a runtime's pending server-originated changes to every page attached to it now, through its send queue as the scheduled
    /// flush does — behind any set already queued — and answers what it drained once that is sent.
    /// </summary>
    /// <exception cref="System.InvalidOperationException">Called from inside an <c>InvokeAsync</c> action, which holds a runtime's lock.</exception>
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
