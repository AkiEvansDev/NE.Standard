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
    /// <remarks>
    /// Runs under the runtime's lock, which values and a flush take too, but not in a command's turn: called from outside, it runs
    /// beside an exclusive command's body; called from a command, posted work or a lifecycle hook, which all run outside that lock,
    /// it is how that code writes what a value also writes.
    /// </remarks>
    Task<ServerChangeSet> InvokeAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default);

    /// <summary>
    /// Queues an action to run on the thread pool between the runtime's exclusive commands, as a command's body runs, and returns at
    /// once.
    /// </summary>
    /// <remarks>
    /// For work one runtime hands another — an event every subscriber reacts to — which must not run inline in the sender's command.
    /// It waits for an exclusive command under way, so a page may redraw both from posts and inside its own commands; a
    /// <c>Background</c> command, a value and an <see cref="InvokeAsync(Func{CancellationToken, Task}, CancellationToken)"/> from
    /// outside still run beside it, so a write they share goes through <c>InvokeAsync</c>, as in a command. A failure goes to the controller's exception handler. The runtime is kept until the action
    /// finishes; one queued after the runtime was asked to go is dropped.
    /// </remarks>
    void Post(Func<CancellationToken, Task> action);

    /// <summary>
    /// Gets whether a page is attached to the runtime now — a connection someone looks at, not a page render reading it.
    /// </summary>
    bool HasViewers { get; }

    /// <summary>
    /// Gets whether a page attached to the runtime is on screen now, as its page last reported — a hidden tab or a minimised window is
    /// not; where it is not, a system notification reaches the reader and a toast would not.
    /// </summary>
    bool HasVisibleViewers { get; }

    /// <summary>Resolves the references client effects carry against this runtime's view, as a command's own answer is resolved.</summary>
    /// <remarks>
    /// What <see cref="UIContext.SendEffectsAsync"/> does before pushing an effect raised outside a command; a reference that
    /// names nothing is left as it stands rather than throwing.
    /// </remarks>
    IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects);

    /// <summary>Sends client effects to every page attached to the runtime but <paramref name="except"/>.</summary>
    /// <remarks>
    /// Under <c>PerClient</c>, every tab sharing it; the effects are resolved as <see cref="ResolveEffects"/> resolves them. Where
    /// <see cref="UIContext.SendEffectsAsync"/> reaches the one connection a command runs for. A system notification sounds once: one
    /// shown only off screen reaches the pages on screen, or with none on screen one page off screen; one shown always reaches one
    /// page, the first on screen, else one off screen. A send that fails does not stop the others; the first failure is rethrown once
    /// every page has been tried.
    /// </remarks>
    Task SendEffectsToAllAsync(IReadOnlyList<ClientEffect> effects, UIHandle? except = null, CancellationToken cancellationToken = default);

    /// <summary>Sends client effects to the given pages of this runtime, resolved as <see cref="SendEffectsToAllAsync"/> sends them.</summary>
    /// <remarks>
    /// What <see cref="UIContext.SendEffectsAsync"/> sends its one connection through. Every page is sent the effects as they stand,
    /// its system notifications included: which page shows one is the caller's choice. A send that fails does not stop the others;
    /// the first failure is rethrown once every page has been tried.
    /// </remarks>
    Task SendEffectsToAsync(IReadOnlyList<UIHandle> pages, IReadOnlyList<ClientEffect> effects, CancellationToken cancellationToken = default);

    /// <summary>
    /// Requests a full client resynchronization on the next runtime flush.
    /// </summary>
    void RequestFullResync();
}
