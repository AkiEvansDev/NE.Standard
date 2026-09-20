using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public Task<ServerChangeSet> InvokeAsync(Action action, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(action);

        return InvokeAsync(
            _ =>
            {
                action();
                return Task.CompletedTask;
            },
            cancellationToken
        );
    }

    /// <inheritdoc />
    public async Task<ServerChangeSet> InvokeAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(action);

        ServerChangeSet changes = await DrainAsync(action, force: false, cancellationToken).ConfigureAwait(false);

        return await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    public IReadOnlyList<ClientEffect> ResolveEffects(IReadOnlyList<ClientEffect> effects)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(effects);

        if (effects.Count == 0)
            return effects;

        ClientEffect[] resolved = new ClientEffect[effects.Count];

        for (var i = 0; i < resolved.Length; i++)
            resolved[i] = ResolveRuntimeEffect(effects[i]);

        return resolved;
    }

    /// <inheritdoc />
    void IUIRuntimeAccess.RequestFullResync()
    {
        ThrowIfDisposed();
        _ = Interlocked.Exchange(ref _fullResyncRequested, 1);
        OnFullResyncRequested();
    }

    /// <summary>Called once a full resync is asked for; a runtime that pushes on its own wakes here, a polled one waits for its flush.</summary>
    protected virtual void OnFullResyncRequested() { }
}
