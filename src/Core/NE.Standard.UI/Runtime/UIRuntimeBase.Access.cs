using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
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

        ServerChangeSet changes;
        List<UIComponentId>? staleWindows;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            await action(cancellationToken).ConfigureAwait(false);

            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
            changes = DrainPendingUpdatesForRuntimeModeNoLock(force: false);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        changes = await AppendItemWindowReloadsAsync(changes, staleWindows, cancellationToken).ConfigureAwait(false);

        return await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false);
    }

    /// <inheritdoc />
    void IUIRuntimeAccess.RequestFullResync()
    {
        ThrowIfDisposed();
        _ = Interlocked.Exchange(ref _fullResyncRequested, 1);
    }
}
