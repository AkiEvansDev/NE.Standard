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
    /// One client write that a source has to approve, held aside while the change set is applied under the
    /// state lock — reading and writing a source is the author's code, and awaiting it there would hold the
    /// lock across it.
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

    // Resolved once: the compiled view is immutable, so which hosts have rules and what those rules read
    // cannot change under a running runtime.
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

            // Outside the lock on purpose: this reads the author's data and takes as long as that takes. What
            // it changes — the window collection, the counts — travels out as the ordinary changes they are.
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
        // The collection index, not the property one: an items binding is compiled as a ComponentCollection and
        // deliberately has no property twin — see BuildState.
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
    /// Resolves the host's <c>ItemsView</c> rules into the query the source is asked to answer.
    /// </summary>
    /// <remarks>
    /// Every other items host applies its rules in the browser, on items it holds whole. A windowed one holds
    /// fifty rows of a hundred thousand, so filtering there would hide four rows and call it a filtered list.
    /// The rules are therefore resolved here — a filter bound to a search box arrives as that box's current
    /// value — and answering them is the source's job, since it is the only thing that can see every item.
    /// A rule whose source reads as inactive contributes no term, which is what makes an empty search box mean
    /// "everything" rather than "matches the empty string".
    /// </remarks>
    private UIItemsQuery BuildItemsQueryNoLock(UIComponentId componentId)
    {
        if (!View.State.TryGetValue(componentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue)
            || propertyValue is not { IsBind: false, Value: CompiledUIItemsView itemsView }
            || itemsView.IsEmpty)
        {
            return UIItemsQuery.Empty;
        }

        List<UIItemFilterTerm> filters = [];

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

        // Lower priority first, and declaration order within one priority. OrderBy rather than List.Sort
        // because only OrderBy is stable, and the client's Array.sort is — two rules of equal priority must
        // not come out in one order here and the other there.
        UIItemSortTerm[] sorts = new UIItemSortTerm[active.Count];
        var index = 0;

        foreach (CompiledUIItemsSort sort in active.OrderBy(static rule => rule.Priority))
            sorts[index++] = new UIItemSortTerm(sort.ItemProperty, sort.Direction);

        return filters.Count == 0 && sorts.Length == 0
            ? UIItemsQuery.Empty
            : new UIItemsQuery([.. filters], sorts);
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
    /// Only a bound source can be read — an unbound one lives entirely in the browser — which is why the
    /// compiler refuses one on a windowed host. A binding that needs runtime parameters is refused here
    /// instead: it addresses one row's copy of a component, and a host's rules belong to the host.
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
    /// Notes every windowed host whose rules read the path that just changed: what it is holding was read
    /// under the old rules and answers a question nobody is asking any more.
    /// </summary>
    /// <remarks>
    /// Server-side on purpose. The client can see that a search box changed, but not what the rules make of
    /// it, and a page that filters from a command — a preset button, a saved view — changes nothing the
    /// browser could have noticed at all.
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
        if (!View.State.TryGetValue(componentId, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? propertyValue)
            || propertyValue is not { IsBind: false, Value: CompiledUIItemsView itemsView }
            || itemsView.IsEmpty)
        {
            return null;
        }

        List<RecursivePath> paths = [];

        for (var i = 0; i < itemsView.Filters.Length; i++)
            AppendRulePathNoLock(paths, itemsView.Filters[i].Source);

        for (var i = 0; i < itemsView.Sorts.Length; i++)
            AppendRulePathNoLock(paths, itemsView.Sorts[i].Source);

        return paths.Count == 0 ? null : [.. paths];
    }

    private void AppendRulePathNoLock(List<RecursivePath> paths, CompiledUIItemsRuleSource source)
    {
        if (source.Source is UIPropertyAddress address && TryGetRuleSourcePathNoLock(address, out RecursivePath? path))
            paths.Add(path);
    }

    private int ReadWindowSizeNoLock(UIComponentId componentId)
        => View.State.TryGetValue(componentId, ISourceItemsComponent.WindowSizeProperty, out CompiledUIPropertyValue? value) && value.Value is int size && size > 0
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
    /// Appends what re-reading the invalidated windows produced to a change set about to travel. Every path
    /// that turns controller changes into updates calls this, because a rule can change on any of them: a
    /// client edit, a command, a background push.
    /// </summary>
    private async Task<ServerChangeSet> AppendItemWindowReloadsAsync(ServerChangeSet changes, List<UIComponentId>? staleWindows, CancellationToken cancellationToken)
        => staleWindows is null
            ? changes
            : AppendUpdates(changes, await ReloadItemWindowsAsync(staleWindows, cancellationToken).ConfigureAwait(false));

    /// <summary>
    /// Reads each invalidated window again, from the start: a filter that changed makes the offset the window
    /// was holding meaningless — it counted rows that no longer qualify.
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
                // The host no longer resolves to a source — nothing to re-read, and a rule change is not the
                // place to report it.
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
    /// Recognizes a client write that lands inside a source's realized window, which the source has to take
    /// rather than the runtime writing straight into the item it happens to hold.
    /// </summary>
    private bool TryResolveSourceWriteNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, [NotNullWhen(true)] out PendingSourceWrite? pending)
    {
        pending = null;

        RecursivePath path = resolution.Path;

        // "<source>.Items["key"].Property" — the shortest shape that can carry a write, and the source itself
        // is whatever the path holds three segments from the end.
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
    /// Hands each held-aside write to its source and answers a refusal by pushing the value the item actually
    /// holds — nothing changed, so nothing would otherwise travel and the field would keep showing the value
    /// that was turned down.
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
