using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Data;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Recursive;
using NE.Standard.UI.Shell.Data;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // What a window is re-read as when the host declares no size of its own, matching ItemsViewComponent's.
    private const int DefaultRuleWindowSize = 50;

    /// <summary>
    /// One client write that a source has to approve, held aside so applying it need not await author code under the state lock.
    /// </summary>
    private readonly record struct PendingSourceWrite(
        UIItemSourceBase Source,
        UIPropertyAddress Address,
        string ItemKey,
        string ItemProperty,
        object? Value,
        RecursivePath Path
    );

    /// <summary>
    /// A windowed host whose rules read controller state, with the paths a change to which invalidates the
    /// window it is holding.
    /// </summary>
    private sealed record WindowedRuleHost(UIComponentId ComponentId, int WindowSize, RecursivePath[] RulePaths);

    // Resolved once: the compiled view is immutable, so which hosts have rules cannot change under a running runtime.
    private List<WindowedRuleHost>? _windowedRuleHosts;

    private HashSet<UIComponentId>? _dirtyItemWindows;

    /// <inheritdoc />
    public async Task<ServerChangeSet> RequestItemWindowAsync(UIItemWindowClientRequest request, CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureStarted();

        ArgumentNullException.ThrowIfNull(request);
        request.Validate();

        try
        {
            UIItemSourceBase source;
            UIItemsQuery query;

            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                source = ResolveItemSourceNoLock(request.ComponentId, request.DynamicParameters);
                query = BuildItemsQueryNoLock(request.ComponentId);
            }
            finally
            {
                _ = _stateLock.Release();
            }

            // Outside the lock on purpose: this reads the author's data and takes as long as that takes.
            await source
                .LoadWindowAsync(new UIItemWindowRequest(request.Anchor, request.Count, request.Mode, query), cancellationToken)
                .ConfigureAwait(false);

            return await FlushCoreAsync(force: true, publish: true, cancellationToken).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            throw;
        }
        catch (Exception exception)
        {
            _ = await HandleRuntimeExceptionAsync(
                exception,
                "RequestItemWindow",
                commandRequest: null,
                clientChangeSet: null,
                cancellationToken
            ).ConfigureAwait(false);

            return await FlushCoreAsync(force: true, publish: true, cancellationToken).ConfigureAwait(false);
        }
    }

    private UIItemSourceBase ResolveItemSourceNoLock(UIComponentId componentId, object?[] dynamicParameters)
    {
        // The collection index, not the property one: an items binding compiles as a ComponentCollection with no property twin.
        if (!View.Bindings.TryGetCollection(componentId, out CompiledUIBinding? binding))
            throw new InvalidOperationException($"Component '{componentId}' does not bind an item collection.");

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(binding, dynamicParameters);

        if (resolution.Source.Kind != CompiledUIBindingSourceKind.Controller || resolution.Path.Count == 0)
            throw new InvalidOperationException($"Component '{componentId}' does not bind a windowed source.");

        PathSegment window = resolution.Path[^1];

        if (window.Kind != PathSegmentKind.Property || !string.Equals(window.Property, UIItemSourceBase.WindowProperty, StringComparison.Ordinal))
            throw new InvalidOperationException($"Component '{componentId}' binds '{resolution.Path}', which does not address a source window.");

        RecursivePath sourcePath = TrimLast(resolution.Path);

        return TryGetControllerValue(sourcePath) as UIItemSourceBase
            ?? throw new InvalidOperationException($"Path '{sourcePath}' does not resolve to an item source.");
    }

    /// <summary>
    /// Resolves the viewer's <c>Query</c> and the host's <c>ItemsView</c> rules into the query the source is asked to answer.
    /// </summary>
    /// <remarks>
    /// Resolved here, not on the client: a windowed host holds only part of the data, so only the source can answer filtering and sorting.
    /// </remarks>
    private UIItemsQuery BuildItemsQueryNoLock(UIComponentId componentId)
    {
        List<UIItemFilterTerm> filters = [];
        List<UIItemSortTerm> sorts = [];

        // The viewer's terms first: a sort chosen by a header outranks the authored one.
        if (ReadItemsQueryNoLock(componentId) is { IsEmpty: false } query)
        {
            filters.AddRange(query.Filters);
            sorts.AddRange(query.Sorts);
        }

        if (View.State.TryGetValue(componentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue)
            && propertyValue is { IsBind: false, Value: CompiledUIItemsView itemsView }
            && !itemsView.IsEmpty)
        {
            for (var i = 0; i < itemsView.Filters.Length; i++)
            {
                CompiledUIItemsFilter filter = itemsView.Filters[i];

                if (!TryResolveRuleNoLock(filter.Source, out var sourceValue))
                    continue;

                filters.Add(new UIItemFilterTerm(filter.ItemProperty, filter.Operator, filter.Source.Source is null ? filter.Value : sourceValue));
            }

            List<CompiledUIItemsSort> active = [];

            for (var i = 0; i < itemsView.Sorts.Length; i++)
            {
                if (TryResolveRuleNoLock(itemsView.Sorts[i].Source, out _))
                    active.Add(itemsView.Sorts[i]);
            }

            // OrderBy rather than List.Sort: only OrderBy is stable, matching the client's Array.sort for equal-priority rules.
            foreach (CompiledUIItemsSort sort in active.OrderBy(static rule => rule.Priority))
                sorts.Add(new UIItemSortTerm(sort.ItemProperty, sort.Direction));
        }

        return filters.Count == 0 && sorts.Count == 0
            ? UIItemsQuery.Empty
            : new UIItemsQuery([.. filters], [.. sorts]);
    }

    /// <summary>
    /// The terms the viewer set on the host: read through its binding when bound, else the authored value — an unbound query changed on
    /// the client never reaches here, so a windowed host binds it.
    /// </summary>
    private UIItemsQuery? ReadItemsQueryNoLock(UIComponentId componentId)
    {
        if (!View.State.TryGetValue(componentId, IItemsComponent.QueryProperty, out CompiledUIPropertyValue? propertyValue))
            return null;

        return propertyValue.IsBind
            ? TryGetRuleSourceValueNoLock(new UIPropertyAddress(componentId, IItemsComponent.QueryProperty)) as UIItemsQuery
            : propertyValue.Value as UIItemsQuery;
    }

    /// <summary>
    /// Whether a rule is active, and the value its source currently holds.
    /// </summary>
    private bool TryResolveRuleNoLock(CompiledUIItemsRuleSource source, out object? sourceValue)
    {
        sourceValue = null;

        if (source.Source is not UIPropertyAddress address)
            return true;

        sourceValue = TryGetRuleSourceValueNoLock(address);

        return UIComparisonEvaluator.Evaluate(sourceValue, source.ActiveOperator, source.ActiveValue);
    }

    /// <summary>
    /// The controller value behind a rule's source component property.
    /// </summary>
    /// <remarks>
    /// Only a bound source can be read; a binding needing runtime parameters is refused since a host's rules belong to the host, not a row.
    /// </remarks>
    private object? TryGetRuleSourceValueNoLock(UIPropertyAddress address)
        => TryGetRuleSourcePathNoLock(address, out RecursivePath? path) ? TryGetControllerValue(path) : null;

    private bool TryGetRuleSourcePathNoLock(UIPropertyAddress address, [NotNullWhen(true)] out RecursivePath? path)
    {
        path = null;

        if (!View.Bindings.TryGetProperty(address, out CompiledUIBinding? binding)
            || CompiledUIBindingParameterResolver.CountSlots(binding.Parameters) > 0)
        {
            return false;
        }

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(binding, []);

        if (resolution.Source.Kind != CompiledUIBindingSourceKind.Controller)
            return false;

        path = resolution.Path;
        return true;
    }

    /// <summary>
    /// Notes every windowed host whose rules read the path that just changed, since what it holds was read under rules no longer valid.
    /// </summary>
    /// <remarks>
    /// Server-side on purpose: a rule can change from a command the client never observes, not only from a visible search box.
    /// </remarks>
    private void MarkChangedItemWindowRulesNoLock(RecursivePath path)
    {
        List<WindowedRuleHost> hosts = GetWindowedRuleHostsNoLock();

        for (var i = 0; i < hosts.Count; i++)
        {
            WindowedRuleHost host = hosts[i];

            for (var j = 0; j < host.RulePaths.Length; j++)
            {
                if (!IsSameOrAncestorPath(path, host.RulePaths[j]))
                    continue;

                _ = (_dirtyItemWindows ??= []).Add(host.ComponentId);
                break;
            }
        }
    }

    private List<WindowedRuleHost> GetWindowedRuleHostsNoLock()
    {
        if (_windowedRuleHosts is not null)
            return _windowedRuleHosts;

        _windowedRuleHosts = [];

        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.All;

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Kind != CompiledUIBindingKind.ComponentCollection || CompiledUIBindingParameterResolver.CountSlots(binding.Parameters) > 0)
                continue;

            UIComponentId componentId = binding.Address.Component.Id;

            if (!IsWindowedSourceBindingNoLock(binding) || TryGetRulePathsNoLock(componentId) is not RecursivePath[] rulePaths)
                continue;

            _windowedRuleHosts.Add(new WindowedRuleHost(componentId, ReadWindowSizeNoLock(componentId), rulePaths));
        }

        return _windowedRuleHosts;
    }

    private bool IsWindowedSourceBindingNoLock(CompiledUIBinding binding)
    {
        CompiledUIBindingResolution resolution = View.Bindings.Resolve(binding, []);

        return resolution.Source.Kind == CompiledUIBindingSourceKind.Controller
            && resolution.Path.Count > 0
            && resolution.Path[^1] is { Kind: PathSegmentKind.Property } window
            && string.Equals(window.Property, UIItemSourceBase.WindowProperty, StringComparison.Ordinal);
    }

    private RecursivePath[]? TryGetRulePathsNoLock(UIComponentId componentId)
    {
        List<RecursivePath> paths = [];

        // The viewer's terms, when bound: a window read under the old ones is stale the moment they change.
        if (TryGetRuleSourcePathNoLock(new UIPropertyAddress(componentId, IItemsComponent.QueryProperty), out RecursivePath? queryPath))
            paths.Add(queryPath);

        if (View.State.TryGetValue(componentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue)
            && propertyValue is { IsBind: false, Value: CompiledUIItemsView itemsView }
            && !itemsView.IsEmpty)
        {
            for (var i = 0; i < itemsView.Filters.Length; i++)
                AppendRulePathNoLock(paths, itemsView.Filters[i].Source);

            for (var i = 0; i < itemsView.Sorts.Length; i++)
                AppendRulePathNoLock(paths, itemsView.Sorts[i].Source);
        }

        return paths.Count == 0 ? null : [.. paths];
    }

    private void AppendRulePathNoLock(List<RecursivePath> paths, CompiledUIItemsRuleSource source)
    {
        if (source.Source is UIPropertyAddress address && TryGetRuleSourcePathNoLock(address, out RecursivePath? path))
            paths.Add(path);
    }

    private int ReadWindowSizeNoLock(UIComponentId componentId)
        => View.State.TryGetValue(componentId, IItemsHostComponent.WindowSizeProperty, out CompiledUIPropertyValue? value) && value.Value is int size && size > 0
            ? size
            : DefaultRuleWindowSize;

    /// <summary>
    /// Whether a change to <paramref name="changed"/> changes what <paramref name="rule"/> reads — the same
    /// path, or one enclosing it, since replacing an object replaces every value inside it.
    /// </summary>
    private static bool IsSameOrAncestorPath(RecursivePath changed, RecursivePath rule)
    {
        if (changed.Count > rule.Count)
            return false;

        ReadOnlySpan<PathSegment> left = changed.AsSpan();
        ReadOnlySpan<PathSegment> right = rule.AsSpan();

        for (var i = 0; i < left.Length; i++)
        {
            if (!left[i].Equals(right[i]))
                return false;
        }

        return true;
    }

    private List<UIComponentId>? DrainDirtyItemWindowsNoLock()
    {
        if (_dirtyItemWindows is not { Count: > 0 })
            return null;

        List<UIComponentId> drained = [.. _dirtyItemWindows];

        _dirtyItemWindows.Clear();

        return drained;
    }

    /// <summary>
    /// Appends what re-reading the invalidated windows produced to a change set about to travel.
    /// </summary>
    private async Task<ServerChangeSet> AppendItemWindowReloadsAsync(ServerChangeSet changes, List<UIComponentId>? staleWindows, CancellationToken cancellationToken)
        => staleWindows is null
            ? changes
            : AppendUpdates(changes, await ReloadItemWindowsAsync(staleWindows, cancellationToken).ConfigureAwait(false));

    /// <summary>
    /// Reads each invalidated window again from the start, since a changed filter makes the previous offset meaningless.
    /// </summary>
    private async Task<ServerChangeSet> ReloadItemWindowsAsync(List<UIComponentId> components, CancellationToken cancellationToken)
    {
        for (var i = 0; i < components.Count; i++)
        {
            UIComponentId componentId = components[i];
            UIItemSourceBase source;
            UIItemsQuery query;
            int count;

            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                source = ResolveItemSourceNoLock(componentId, []);
                query = BuildItemsQueryNoLock(componentId);
                count = ReadWindowSizeNoLock(componentId);
            }
            catch (InvalidOperationException)
            {
                // The host no longer resolves to a source; a rule change is not the place to report that.
                continue;
            }
            finally
            {
                _ = _stateLock.Release();
            }

            try
            {
                await source
                    .LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, count, UIItemWindowMode.Replace, query), cancellationToken)
                    .ConfigureAwait(false);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                _ = await HandleRuntimeExceptionAsync(
                    exception,
                    "ReloadItemWindow",
                    commandRequest: null,
                    clientChangeSet: null,
                    cancellationToken
                ).ConfigureAwait(false);
            }
        }

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            DrainControllerChangesNoLock();

            return DrainPendingUpdatesForRuntimeModeNoLock(force: true);
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    /// <summary>
    /// Recognizes a client write that lands inside a source's realized window, which the source must apply rather than the runtime.
    /// </summary>
    private bool TryResolveSourceWriteNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, [NotNullWhen(true)] out PendingSourceWrite? pending)
    {
        pending = null;

        RecursivePath path = resolution.Path;

        // "<source>.Items["key"].Property" is the shortest shape that can carry a write.
        if (path.Count < 3)
            return false;

        PathSegment property = path[^1];
        PathSegment key = path[^2];
        PathSegment window = path[^3];

        if (property.Kind != PathSegmentKind.Property ||
            key.Kind != PathSegmentKind.Key ||
            window.Kind != PathSegmentKind.Property ||
            !string.Equals(window.Property, UIItemSourceBase.WindowProperty, StringComparison.Ordinal))
        {
            return false;
        }

        if (TryGetControllerValue(TrimLast(TrimLast(TrimLast(path)))) is not UIItemSourceBase source)
            return false;

        pending = new PendingSourceWrite(
            source,
            new UIPropertyAddress(update.Address.Component.Id, update.Address.Property, update.DynamicParameters),
            key.Key,
            property.Property,
            update.Value,
            path
        );

        return true;
    }

    /// <summary>
    /// Hands each held-aside write to its source, pushing back the item's actual value when the source refuses it.
    /// </summary>
    private async Task<ServerChangeSet> ApplySourceWritesAsync(List<PendingSourceWrite> writes, CancellationToken cancellationToken)
    {
        List<ServerUIUpdate>? refusals = null;

        for (var i = 0; i < writes.Count; i++)
        {
            PendingSourceWrite write = writes[i];

            var accepted = await write.Source
                .TryWriteAsync(write.ItemKey, write.ItemProperty, write.Value, cancellationToken)
                .ConfigureAwait(false);

            if (accepted)
                continue;

            await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
            try
            {
                (refusals ??= []).Add(new ServerValueUIUpdate
                {
                    Address = write.Address,
                    Value = TryGetControllerValue(write.Path)
                });
            }
            finally
            {
                _ = _stateLock.Release();
            }
        }

        ServerChangeSet changes = await FlushCoreAsync(force: true, publish: false, cancellationToken).ConfigureAwait(false);

        return refusals is null
            ? changes
            : AppendUpdates(changes, refusals);
    }

    private static RecursivePath TrimLast(RecursivePath path)
        => new(path.AsSpan()[..^1].ToArray(), ownsArray: true);
}
