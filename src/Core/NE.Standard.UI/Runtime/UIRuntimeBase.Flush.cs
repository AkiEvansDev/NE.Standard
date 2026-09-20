using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public bool HasPendingWork
        => Controller.HasPendingChanges
            || _pendingUpdates.Count > 0
            || _dirtyItemWindows is { Count: > 0 }
            || Volatile.Read(ref _fullResyncRequested) == 1;

    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        return FlushCoreAsync(force: true, publish: true, cancellationToken);
    }

    private async Task<ServerChangeSet> FlushCoreAsync(bool force, bool publish, CancellationToken cancellationToken)
    {
        ServerChangeSet changes = await DrainAsync(action: null, force, cancellationToken).ConfigureAwait(false);

        return publish
            ? await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false)
            : changes;
    }

    /// <summary>
    /// The one drain: an optional action under the state lock, then controller changes, stale windows and pending updates, with
    /// window reloads appended outside the lock. Both flush and invoke go through it.
    /// </summary>
    private async Task<ServerChangeSet> DrainAsync(Func<CancellationToken, Task>? action, bool force, CancellationToken cancellationToken)
    {
        ServerChangeSet changes;
        List<UIComponentId>? staleWindows;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (action is not null)
                await action(cancellationToken).ConfigureAwait(false);

            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
            changes = DrainPendingUpdatesForRuntimeModeNoLock(force);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return await AppendItemWindowReloadsAsync(changes, staleWindows, cancellationToken).ConfigureAwait(false);
    }
}
