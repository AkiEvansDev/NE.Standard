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
    /// Resolves the references client effects carry against this runtime's view, as a command's own answer is resolved.
    /// </summary>
    /// <remarks>
    /// What <see cref="UIContext.SendEffectsAsync"/> does before pushing an effect raised outside a command; a reference that
    /// names nothing is left as it stands rather than throwing.
    /// </remarks>
    IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects);

    /// <summary>
    /// Requests a full client resynchronization on the next runtime flush.
    /// </summary>
    void RequestFullResync();
}
