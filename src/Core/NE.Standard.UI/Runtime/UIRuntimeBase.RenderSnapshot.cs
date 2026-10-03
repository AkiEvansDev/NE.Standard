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
    // How many updates may leave the queue between a page's render and its attach before the attach is sent the whole page again.
    private const int MaxUpdatesPastRender = 4096;

    // The render a page's first attach may start from: its page id, the sequence it read, and every update drained since — the
    // flush sends them to whoever is attached, which is not yet that page. Null once that attach has come, or past the bound.
    private string? _renderPageId;
    private long _renderSequence;
    private List<PendingUpdate>? _drainedPastRender;

    /// <inheritdoc />
    public async Task<UIRenderSnapshot> BuildRenderSnapshotAsync(string pageId, IReadOnlyCollection<UIBindingId> bindingIds, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentException.ThrowIfNullOrWhiteSpace(pageId);
        ArgumentNullException.ThrowIfNull(bindingIds);

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            // Queued first, as an attach's snapshot does: a change the render paints is then numbered at or under its sequence, and
            // never sent to the page again.
            QueueUntakenControllerChangesNoLock();

            ServerChangeSet values = BuildInitialChangeSetNoLock(bindingIds);
            List<ServerCollectionChangeUIUpdate> collections = BuildInitialCollectionChangesNoLock();

            _renderPageId = pageId;
            _renderSequence = _updateSequence;
            _drainedPastRender = [];

            return new UIRenderSnapshot { Changes = new ServerChangeSet { Updates = [.. values.Updates, .. collections] }, Sequence = _updateSequence };
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    /// <summary>
    /// What the page this runtime's render was read for is sent at its attach, when it presents that render's sequence: every update
    /// queued past it, drained or still waiting. Null for any other attach, which takes the whole snapshot; asked once either way.
    /// </summary>
    private ServerChangeSet? TakeChangesPastRenderNoLock(string instanceId, long? since)
    {
        List<PendingUpdate>? drained = _drainedPastRender;
        var renderPageId = _renderPageId;
        var renderSequence = _renderSequence;

        ForgetRenderNoLock();

        if (since is null || drained is null || since.Value != renderSequence || _pendingFullResync || !string.Equals(PageIdOf(instanceId), renderPageId, StringComparison.Ordinal))
            return null;

        List<ServerUIUpdate> updates = new(drained.Count + _pendingUpdates.Count + 1);

        AppendPastRender(updates, drained, renderSequence);
        AppendPastRender(updates, _pendingUpdates, renderSequence);

        // The page drops its unsaved-work flag before it applies an attach's answer, as it does for a snapshot.
        if (HoldsUnsavedWork)
            updates.Add(PageState());

        return new ServerChangeSet { Updates = [.. updates] }.For(instanceId);
    }

    private static void AppendPastRender(List<ServerUIUpdate> updates, List<PendingUpdate> queued, long renderSequence)
    {
        for (var i = 0; i < queued.Count; i++)
        {
            if (queued[i].Sequence > renderSequence)
                updates.Add(queued[i].Update);
        }
    }

    private string? PageIdOf(string instanceId)
    {
        lock (_connectionsLock)
            return _attachedHandles.TryGetValue(instanceId, out UIHandle? handle) ? handle.Instance.PageId : null;
    }

    /// <summary>Keeps what a drain takes from the queue while a render waits for its page's attach.</summary>
    private void KeepDrainedPastRenderNoLock()
    {
        if (_drainedPastRender is not { } drained || _pendingUpdates.Count == 0)
            return;

        if (drained.Count + _pendingUpdates.Count > MaxUpdatesPastRender)
        {
            ForgetRenderNoLock();
            return;
        }

        drained.AddRange(_pendingUpdates);
    }

    private void ForgetRenderNoLock()
    {
        _renderPageId = null;
        _drainedPastRender = null;
    }
}
