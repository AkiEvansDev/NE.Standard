using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    public async Task<ServerChangeSet> BuildInitialChangeSetAsync(IReadOnlyCollection<UIBindingId> bindingIds, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(bindingIds);

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return BuildInitialChangeSetNoLock(bindingIds);
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    /// <summary>
    /// Builds a synthetic insert changeset for every bound items collection, so items render through the same path as later live updates.
    /// </summary>
    public async Task<IReadOnlyList<ServerCollectionChangeUIUpdate>> BuildInitialCollectionChangesAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return BuildInitialCollectionChangesNoLock();
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    /// <inheritdoc />
    public Task<ServerChangeSet> BuildAttachChangesAsync(string instanceId, IReadOnlyCollection<UIBindingId> bindingIds, CancellationToken cancellationToken = default)
        => BuildAttachChangesAsync(instanceId, bindingIds, since: null, cancellationToken);

    /// <inheritdoc />
    public async Task<ServerChangeSet> BuildAttachChangesAsync(string instanceId, IReadOnlyCollection<UIBindingId> bindingIds, long? since, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentException.ThrowIfNullOrWhiteSpace(instanceId);
        ArgumentNullException.ThrowIfNull(bindingIds);

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            // One hold for the snapshot and the mark: an update queued before it is in the snapshot and never sent to the instance,
            // one queued after it is sent, and is newer than the snapshot.
            QueueUntakenControllerChangesNoLock();

            // The page whose render this runtime answered holds that render, and is sent only what moved past it.
            if (TakeChangesPastRenderNoLock(instanceId, since) is { } pastRender)
            {
                MarkSnapshot(instanceId, _updateSequence);

                return pastRender;
            }

            ServerChangeSet values = BuildInitialChangeSetNoLock(bindingIds);
            List<ServerCollectionChangeUIUpdate> collections = BuildInitialCollectionChangesNoLock();

            MarkSnapshot(instanceId, _updateSequence);

            return new ServerChangeSet { Updates = [.. values.Updates, .. collections] };
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    /// <summary>The bindings' values as they stand, built through the queue with what was already queued set aside and put back.</summary>
    private ServerChangeSet BuildInitialChangeSetNoLock(IReadOnlyCollection<UIBindingId> bindingIds)
    {
        List<PendingUpdate> pendingUpdates = [.. _pendingUpdates];
        var pendingFullResync = _pendingFullResync;

        // Set aside too: the snapshot walks the live change path, which would mark every window whose rules read a snapshot
        // path as stale, and reload it from the start after every render and attach though nothing changed.
        HashSet<UIComponentId>? dirtyItemWindows = _dirtyItemWindows;
        _dirtyItemWindows = null;

        ClearPendingUpdatesNoLock();

        try
        {
            HashSet<RecursivePath> paths = [];

            foreach (UIBindingId bindingId in bindingIds)
            {
                if (bindingId.IsEmpty)
                    throw new ArgumentException("Binding id must not be empty.", nameof(bindingIds));

                CompiledUIBinding binding = View.Bindings.GetRequired(bindingId);

                if (binding.Mode == UIBindingMode.OneWayToSource)
                    continue;

                RecursivePath? sourcePath = TryGetInitialControllerPath(binding);

                if (sourcePath is null)
                    continue;

                _ = paths.Add(NormalizeInitialPath(sourcePath));
            }

            foreach (RecursivePath path in paths)
                AppendSetUpdatesNoLock(path);

            // Only while it holds some: a page starts holding none, and an attach sets it back to none before it applies this.
            if (HoldsUnsavedWork)
                AddPendingUpdateNoLock(PageState());

            // A snapshot is an answer, not a queued change: no instance filters it, and no drain takes it (the finally empties it).
            return new ServerChangeSet { Updates = CopyPendingUpdatesNoLock().Updates };
        }
        finally
        {
            ClearPendingUpdatesNoLock();

            _pendingUpdates.AddRange(pendingUpdates);
            NoteQueuedValueAddressesNoLock(pendingUpdates);
            _pendingFullResync = pendingFullResync;
            _dirtyItemWindows = dirtyItemWindows;
        }
    }

    private List<ServerCollectionChangeUIUpdate> BuildInitialCollectionChangesNoLock()
    {
        List<ServerCollectionChangeUIUpdate> updates = [];

        for (var i = 0; i < View.Bindings.All.Count; i++)
        {
            CompiledUIBinding binding = View.Bindings.All[i];

            if (binding.Kind != CompiledUIBindingKind.ComponentCollection || binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            AppendInitialCollectionChanges(binding, updates);
        }

        return updates;
    }

    private void AppendInitialCollectionChanges(CompiledUIBinding binding, List<ServerCollectionChangeUIUpdate> updates)
    {
        CompiledUIBindingSource source = View.Sources.GetRequired(binding.SourceId);

        // A statically-iterated (ComponentItems) source is already rendered whole by the platform from the compiled view, so it needs no initial synthetic sync.
        if (source.Kind != CompiledUIBindingSourceKind.Controller)
            return;

        CompiledUIBindingTemplate template = View.Templates.GetRequired(binding.TemplateId);

        foreach ((RecursivePath path, var dynamicParameters) in EnumerateMaterializedCollectionPaths(template.Parsed, binding.Parameters))
        {
            UIComponentAddress component = new(binding.Address.Component.Id, dynamicParameters);

            if (!IsStampedFor(component))
                continue;

            // Reset first and unconditionally: a reattach replays this verbatim while the host still holds the previous items.
            updates.Add(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Reset,
                Component = component,
                Items = []
            });

            if (!TryBuildCollectionItems(path, binding, out ServerCollectionItemChange[] items) || items.Length == 0)
                continue;

            updates.Add(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Insert,
                Component = component,
                Items = items
            });
        }
    }

    /// <summary>The items of a bound collection as its host is sent them, each kept to what the host reads off it.</summary>
    private bool TryBuildCollectionItems(RecursivePath path, CompiledUIBinding binding, out ServerCollectionItemChange[] items)
    {
        items = [];

        if (TryGetControllerValue(path) is not IEnumerable enumerable || enumerable is string)
            return false;

        List<ServerCollectionItemChange> result = [];
        UIItemProjection projection = View.ItemProjections.For(binding.Address.Component.Id);
        var index = 0;

        foreach (var item in enumerable)
        {
            result.Add(new ServerCollectionItemChange
            {
                Index = index,
                Key = TryGetItemKey(item),
                Item = item,
                Projection = projection
            });

            index++;
        }

        items = [.. result];
        return true;
    }

    /// <summary>
    /// Enumerates every (path, dynamicParameters) instance a collection template resolves to, recursing at each Dynamic parameter segment.
    /// </summary>
    private IEnumerable<(RecursivePath Path, object?[] DynamicParameters)> EnumerateMaterializedCollectionPaths(RecursivePathTemplate template, CompiledUIBindingParameter[] parameters)
    {
        EnsureParametersMatch(template, parameters);

        return EnumerateMaterializedCollectionPaths(template, parameters, 0, RecursivePath.Empty, []);
    }

    private IEnumerable<(RecursivePath Path, object?[] DynamicParameters)> EnumerateMaterializedCollectionPaths(RecursivePathTemplate template, CompiledUIBindingParameter[] parameters, int partIndex, RecursivePath currentPath, object?[] dynamicParameters)
    {
        for (; partIndex < template.Parts.Length; partIndex++)
        {
            RecursivePathTemplatePart part = template.Parts[partIndex];

            if (!part.IsParameter)
            {
                currentPath = currentPath.Append(part.Segment);
                continue;
            }

            CompiledUIBindingParameter parameter = parameters[part.ParameterIndex];

            if (parameter.Kind != CompiledUIBindingParameterKind.Dynamic)
            {
                currentPath = currentPath.Append(PathSegment.ForParameter(parameter.Value));
                continue;
            }

            if (TryGetControllerValue(currentPath) is not IEnumerable enumerable || enumerable is string)
                yield break;

            var index = 0;

            foreach (var item in enumerable)
            {
                var key = TryGetItemKey(item) ?? throw MissingItemKeyException();
                RecursivePath itemPath = currentPath.AppendIndex(index);
                var nextDynamicParameters = AppendDynamicParameter(dynamicParameters, key);

                foreach ((RecursivePath Path, object?[] DynamicParameters) result in EnumerateMaterializedCollectionPaths(template, parameters, partIndex + 1, itemPath, nextDynamicParameters))
                    yield return result;

                index++;
            }

            yield break;
        }

        yield return (currentPath, dynamicParameters);
    }

    /// <summary>A controller binding fills each of its template's slots with one parameter, in order.</summary>
    private static void EnsureParametersMatch(RecursivePathTemplate template, CompiledUIBindingParameter[] parameters)
    {
        if (template.ParameterCount != parameters.Length)
            throw new InvalidOperationException($"Path template '{template}' has {template.ParameterCount} parameters, but binding has {parameters.Length}.");
    }

    private RecursivePath? TryGetInitialControllerPath(CompiledUIBinding binding)
    {
        ArgumentNullException.ThrowIfNull(binding);

        CompiledUIBindingSource source = View.Sources.GetRequired(binding.SourceId);

        return source.Kind switch
        {
            CompiledUIBindingSourceKind.Controller => TryMaterializeInitialControllerPath(binding),
            CompiledUIBindingSourceKind.ComponentItems => TryGetInitialComponentItemsControllerPath(source),
            _ => throw new UnreachableException()
        };
    }

    private RecursivePath TryMaterializeInitialControllerPath(CompiledUIBinding binding)
    {
        CompiledUIBindingTemplate template = View.Templates.GetRequired(binding.TemplateId);

        return MaterializeInitialPathPrefix(template.Parsed, binding.Parameters);
    }

    /// <summary>The template's segments up to its first dynamic parameter: the part a path has before any row is named.</summary>
    private static RecursivePath MaterializeInitialPathPrefix(RecursivePathTemplate template, CompiledUIBindingParameter[] parameters)
    {
        EnsureParametersMatch(template, parameters);

        ReadOnlySpan<RecursivePathTemplatePart> parts = template.Parts;

        if (parts.Length == 0)
            return RecursivePath.Empty;

        List<PathSegment> segments = new(parts.Length);

        foreach (RecursivePathTemplatePart part in parts)
        {
            if (!part.IsParameter)
            {
                segments.Add(part.Segment);
                continue;
            }

            CompiledUIBindingParameter parameter = parameters[part.ParameterIndex];

            if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
                break;

            segments.Add(PathSegment.ForParameter(parameter.Value));
        }

        return new RecursivePath(segments);
    }

    private RecursivePath? TryGetInitialComponentItemsControllerPath(CompiledUIBindingSource source)
    {
        ArgumentNullException.ThrowIfNull(source);

        if (source.ComponentId is null)
            throw new InvalidOperationException($"Component items source '{source.Id}' must specify component id.");

        // A ComponentItems source has no matching ComponentCollection binding; its bindings are already resolved in the platform's render.
        if (!View.Bindings.TryGetCollection(source.ComponentId.Value, out CompiledUIBinding? collectionBinding))
            return null;

        return collectionBinding.Mode == UIBindingMode.OneWayToSource
            ? null
            : TryGetInitialControllerPath(collectionBinding);
    }

    private static RecursivePath NormalizeInitialPath(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        for (var i = 0; i < path.Count; i++)
        {
            PathSegment segment = path[i];

            if (segment.Kind is PathSegmentKind.Index or PathSegmentKind.Key)
                return path.Take(i);
        }

        return path;
    }
}
