using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    protected async Task<ServerChangeSet> PublishExternalControllerChangesAsync(RecursiveChange[] changes, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();

        ArgumentNullException.ThrowIfNull(changes);

        if (changes.Length == 0 && Interlocked.CompareExchange(ref _fullResyncRequested, 0, 0) == 0)
            return ServerChangeSet.Empty;

        ServerChangeSet changeSet;

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (!IsStarted || IsStopped)
                return ServerChangeSet.Empty;

            if (Interlocked.Exchange(ref _fullResyncRequested, 0) == 1)
            {
                AppendFullResyncNoLock();
            }
            else
            {
                for (var i = 0; i < changes.Length; i++)
                {
                    ArgumentNullException.ThrowIfNull(changes[i]);
                    AppendControllerChangeNoLock(changes[i]);
                }
            }

            changeSet = DrainPendingUpdatesForRuntimeModeNoLock(force: false);
        }
        finally
        {
            _ = _stateLock.Release();
        }

        return await PublishChangesAsync(changeSet, cancellationToken).ConfigureAwait(false);
    }

    private void AppendControllerChangeNoLock(RecursiveChange change)
    {
        ArgumentNullException.ThrowIfNull(change);

        switch (change.Kind)
        {
            case RecursiveChangeKind.Set:
                AppendSetUpdatesNoLock(change.Path);
                break;

            case RecursiveChangeKind.Reset:
                AppendContextRebuildUpdatesNoLock(change.Path);
                AppendCollectionResetUpdateNoLock(change);
                break;

            case RecursiveChangeKind.Replace:
                AppendCollectionItemContextRebuildUpdatesNoLock(change);
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Replace);
                break;

            case RecursiveChangeKind.Add:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Insert);
                break;

            case RecursiveChangeKind.Remove:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Remove);
                break;

            case RecursiveChangeKind.Move:
                AppendCollectionUpdateNoLock(change, CollectionUpdateAction.Move);
                break;

            default:
                throw new UnreachableException();
        }
    }

    private void DrainControllerChangesNoLock()
    {
        _changeBuffer.Clear();

        _ = Controller.DrainChanges(_changeBuffer);

        AppendControllerChangesNoLock();

        _changeBuffer.Clear();
    }

    private void AppendControllerChangesNoLock()
    {
        if (Interlocked.Exchange(ref _fullResyncRequested, 0) == 1)
        {
            AppendFullResyncNoLock();
            return;
        }

        if (_pendingFullResync || _changeBuffer.Count == 0)
            return;

        RecursiveChange[] changes = CompactControllerChangesNoLock();

        for (var i = 0; i < changes.Length; i++)
            AppendControllerChangeNoLock(changes[i]);
    }

    private RecursiveChange[] CompactControllerChangesNoLock()
    {
        if (_changeBuffer.Count <= 1)
            return [.. _changeBuffer];

        List<RecursiveChange> result = new(_changeBuffer.Count);

        for (var i = 0; i < _changeBuffer.Count; i++)
        {
            RecursiveChange change = _changeBuffer[i];

            ArgumentNullException.ThrowIfNull(change);

            RecursivePath path = change.Path;

            switch (change.Kind)
            {
                case RecursiveChangeKind.Set:
                    RemovePreviousChangesCoveredByPath(result, path);
                    result.Add(change);
                    break;

                case RecursiveChangeKind.Reset:
                    RemovePreviousChangesCoveredByPath(result, path);
                    result.Add(change);
                    break;

                case RecursiveChangeKind.Add:
                case RecursiveChangeKind.Remove:
                case RecursiveChangeKind.Replace:
                case RecursiveChangeKind.Move:
                    result.Add(change);
                    break;

                default:
                    throw new UnreachableException();
            }
        }

        return [.. result];
    }

    /// <summary>
    /// Drops every earlier change the new one supersedes — the same path, or anything under it.
    /// </summary>
    /// <remarks>
    /// Compared segment by segment rather than through <c>Path.ToString()</c>: this runs on the flush path
    /// for every change against every change kept so far, and rendering each path to a string made that
    /// quadratic in allocations as well as in comparisons.
    /// </remarks>
    private static void RemovePreviousChangesCoveredByPath(List<RecursiveChange> changes, RecursivePath path)
    {
        for (var i = changes.Count - 1; i >= 0; i--)
        {
            if (IsSameOrDescendantPath(path, changes[i].Path))
                changes.RemoveAt(i);
        }
    }

    private static bool IsSameOrDescendantPath(RecursivePath ancestor, RecursivePath candidate)
    {
        if (candidate.Count < ancestor.Count)
            return false;

        for (var i = 0; i < ancestor.Count; i++)
        {
            if (!ancestor[i].Equals(candidate[i]))
                return false;
        }

        return true;
    }

    private void DiscardControllerChangesNoLock()
    {
        _changeBuffer.Clear();

        _ = Controller.DrainChanges(_changeBuffer);

        _changeBuffer.Clear();
    }
}
