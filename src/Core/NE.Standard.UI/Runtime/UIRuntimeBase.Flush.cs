using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public Task<ServerChangeSet> FlushAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        return FlushCoreAsync(force: true, publish: true, cancellationToken);
    }

    private async Task<ServerChangeSet> FlushCoreAsync(bool force, bool publish, CancellationToken cancellationToken)
    {
        ServerChangeSet changes;
        List<UIComponentId>? staleWindows;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            DrainControllerChangesNoLock();

            staleWindows = DrainDirtyItemWindowsNoLock();
            changes = DrainPendingUpdatesForRuntimeModeNoLock(force);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        changes = await AppendItemWindowReloadsAsync(changes, staleWindows, cancellationToken).ConfigureAwait(false);

        return publish
            ? await PublishChangesAsync(changes, cancellationToken).ConfigureAwait(false)
            : changes;
    }
}
