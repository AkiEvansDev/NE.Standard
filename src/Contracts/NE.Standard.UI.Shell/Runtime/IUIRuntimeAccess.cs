using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
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
    /// Queues an action to run on the thread pool as <see cref="InvokeAsync(Func{CancellationToken, Task}, CancellationToken)"/>
    /// runs it, and returns at once; a failure goes to the controller's exception handler.
    /// </summary>
    /// <remarks>
    /// For work one runtime hands another — an event every subscriber reacts to — which must not run inline in the sender's
    /// command. The runtime is kept until the action finishes; one queued after the runtime was asked to go is dropped.
    /// </remarks>
    void Post(Func<CancellationToken, Task> action);

    /// <summary>
    /// Gets whether a page is attached to the runtime now — a connection someone looks at, not a page render reading it.
    /// </summary>
    bool HasViewers { get; }

    /// <summary>
    /// Resolves the references client effects carry against this runtime's view, as a command's own answer is resolved.
    /// </summary>
    /// <remarks>
    /// What <see cref="UIContext.SendEffectsAsync"/> does before pushing an effect raised outside a command; a reference that
    /// names nothing is left as it stands rather than throwing.
    /// </remarks>
    IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects);

    /// <summary>
    /// Sends client effects to every page attached to the runtime — under <c>PerClient</c>, every tab sharing it — but
    /// <paramref name="except"/>, resolved as <see cref="ResolveEffects"/> resolves them.
    /// </summary>
    /// <remarks>
    /// Where <see cref="UIContext.SendEffectsAsync"/> reaches the one connection a command runs for. A send that fails does not
    /// stop the others; the first failure is rethrown once every page has been tried.
    /// </remarks>
    Task SendEffectsToAllAsync(IReadOnlyList<ClientEffect> effects, UIHandle? except = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Requests a full client resynchronization on the next runtime flush.
    /// </summary>
    void RequestFullResync();
}
