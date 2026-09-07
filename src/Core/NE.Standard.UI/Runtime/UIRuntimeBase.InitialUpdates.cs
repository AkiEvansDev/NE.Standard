using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
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
            List<ServerUIUpdate> pendingUpdates = [.. _pendingUpdates];
            var pendingFullResync = _pendingFullResync;

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

                return DrainPendingUpdatesNoLock();
            }
            finally
            {
                ClearPendingUpdatesNoLock();

                _pendingUpdates.AddRange(pendingUpdates);
                _pendingFullResync = pendingFullResync;
            }
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
        finally
        {
            _ = _stateLock.Release();
        }
    }

    private void AppendInitialCollectionChanges(CompiledUIBinding binding, List<ServerCollectionChangeUIUpdate> updates)
    {
        CompiledUIBindingSource source = View.Sources.GetRequired(binding.SourceId);

        // A statically-iterated (ComponentItems) source is already rendered whole by the platform from the compiled view, so it needs no initial synthetic sync.
        if (source.Kind != CompiledUIBindingSourceKind.Controller)
            return;

        CompiledUIBindingTemplate template = View.Templates.GetRequired(binding.TemplateId);
        List<TemplateElement> elements = ParseTemplateElements(template.Template, binding.Parameters);

        foreach ((RecursivePath path, var dynamicParameters) in EnumerateMaterializedCollectionPaths(elements))
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

            if (!TryBuildCollectionItems(path, out ServerCollectionItemChange[] items) || items.Length == 0)
                continue;

            updates.Add(new ServerCollectionChangeUIUpdate
            {
                Action = CollectionUpdateAction.Insert,
                Component = component,
                Items = items
            });
        }
    }

    private bool TryBuildCollectionItems(RecursivePath path, out ServerCollectionItemChange[] items)
    {
        items = [];

        if (TryGetControllerValue(path) is not IEnumerable enumerable || enumerable is string)
            return false;

        List<ServerCollectionItemChange> result = [];
        var index = 0;

        foreach (var item in enumerable)
        {
            result.Add(new ServerCollectionItemChange
            {
                Index = index,
                Key = TryGetItemKey(item),
                Item = item
            });

            index++;
        }

        items = [.. result];
        return true;
    }

    /// <summary>
    /// Enumerates every (path, dynamicParameters) instance a collection template resolves to, recursing at each Dynamic parameter segment.
    /// </summary>
    private IEnumerable<(RecursivePath Path, object?[] DynamicParameters)> EnumerateMaterializedCollectionPaths(IReadOnlyList<TemplateElement> elements)
        => EnumerateMaterializedCollectionPaths(elements, 0, RecursivePath.Empty, []);

    private IEnumerable<(RecursivePath Path, object?[] DynamicParameters)> EnumerateMaterializedCollectionPaths(
        IReadOnlyList<TemplateElement> elements,
        int elementIndex,
        RecursivePath currentPath,
        object?[] dynamicParameters)
    {
        for (; elementIndex < elements.Count; elementIndex++)
        {
            TemplateElement element = elements[elementIndex];

            if (element.Kind == TemplateElementKind.Property)
            {
                currentPath = currentPath.AppendProperty(element.PropertyName!);
                continue;
            }

            if (element.Kind == TemplateElementKind.Fixed)
            {
                currentPath = currentPath.Append(element.FixedSegment);
                continue;
            }

            if (TryGetControllerValue(currentPath) is not IEnumerable enumerable || enumerable is string)
                yield break;

            var index = 0;

            foreach (var item in enumerable)
            {
                var parameter = TryGetItemKey(item) ?? throw MissingItemKeyException();
                RecursivePath itemPath = currentPath.AppendIndex(index);
                var nextDynamicParameters = AppendDynamicParameter(dynamicParameters, parameter);

                foreach ((RecursivePath Path, object?[] DynamicParameters) result in EnumerateMaterializedCollectionPaths(elements, elementIndex + 1, itemPath, nextDynamicParameters))
                    yield return result;

                index++;
            }

            yield break;
        }

        yield return (currentPath, dynamicParameters);
    }

    private enum TemplateElementKind
    {
        Property,
        Fixed,
        Dynamic
    }

    private readonly record struct TemplateElement(TemplateElementKind Kind, string? PropertyName, PathSegment FixedSegment);

    private static List<TemplateElement> ParseTemplateElements(string template, CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(template);
        ArgumentNullException.ThrowIfNull(parameters);

        List<TemplateElement> elements = [];

        if (template.Length == 0 || template == ".")
            return elements;

        ReadOnlySpan<char> span = template.AsSpan();
        var i = 0;
        var parameterIndex = 0;
        var expectSegment = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                    throw new FormatException($"Invalid path template '{template}'.");

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                    throw new FormatException($"Invalid parameter segment in path template '{template}'.");

                if (parameterIndex >= parameters.Length)
                    throw new InvalidOperationException($"Path template '{template}' expects more binding parameters.");

                CompiledUIBindingParameter parameter = parameters[parameterIndex++];

                elements.Add(parameter.Kind == CompiledUIBindingParameterKind.Dynamic
                    ? new TemplateElement(TemplateElementKind.Dynamic, null, default)
                    : new TemplateElement(TemplateElementKind.Fixed, null, CreateFixedParameterSegment(parameter)));

                i += 2;
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
                throw new FormatException($"Invalid property segment in path template '{template}'.");

            elements.Add(new TemplateElement(TemplateElementKind.Property, span[start..i].ToString(), default));
            expectSegment = false;
        }

        if (expectSegment)
            throw new FormatException($"Invalid path template '{template}'.");

        if (parameterIndex != parameters.Length)
            throw new InvalidOperationException($"Path template '{template}' has {parameterIndex} parameters, but binding has {parameters.Length}.");

        return elements;
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

        return MaterializeInitialPathPrefix(template.Template, binding.Parameters);
    }

    private static RecursivePath MaterializeInitialPathPrefix(string template, CompiledUIBindingParameter[] parameters)
    {
        ArgumentNullException.ThrowIfNull(template);
        ArgumentNullException.ThrowIfNull(parameters);

        if (template.Length == 0 || template == ".")
            return RecursivePath.Empty;

        List<PathSegment> segments = [];
        ReadOnlySpan<char> span = template.AsSpan();

        var i = 0;
        var parameterIndex = 0;
        var expectSegment = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                    throw new FormatException($"Invalid path template '{template}'.");

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                    throw new FormatException($"Invalid parameter segment in path template '{template}'.");

                if (parameterIndex >= parameters.Length)
                    throw new InvalidOperationException($"Path template '{template}' expects more binding parameters.");

                CompiledUIBindingParameter parameter = parameters[parameterIndex++];

                if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
                    return new RecursivePath(segments);

                segments.Add(CreateFixedParameterSegment(parameter));
                i += 2;
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
                throw new FormatException($"Invalid property segment in path template '{template}'.");

            segments.Add(PathSegment.ForProperty(span[start..i].ToString()));
            expectSegment = false;
        }

        if (expectSegment)
            throw new FormatException($"Invalid path template '{template}'.");

        if (parameterIndex != parameters.Length)
            throw new InvalidOperationException($"Path template '{template}' has {parameterIndex} parameters, but binding has {parameters.Length}.");

        return new RecursivePath(segments);
    }

    private static PathSegment CreateFixedParameterSegment(CompiledUIBindingParameter parameter)
    {
        ArgumentNullException.ThrowIfNull(parameter);

        if (parameter.Kind != CompiledUIBindingParameterKind.Fixed)
            throw new ArgumentException("Binding parameter must be fixed.", nameof(parameter));

        return parameter.Value switch
        {
            int index => PathSegment.AtIndex(index),
            string key => PathSegment.WithKey(key),
            _ => throw new InvalidOperationException("Fixed binding parameter must be int or string.")
        };
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
                return Take(path, i);
        }

        return path;
    }

    private static RecursivePath Take(RecursivePath path, int count)
    {
        ArgumentNullException.ThrowIfNull(path);
        ArgumentOutOfRangeException.ThrowIfNegative(count);

        ArgumentOutOfRangeException.ThrowIfGreaterThan(count, path.Count);

        if (count == 0)
            return RecursivePath.Empty;

        PathSegment[] segments = new PathSegment[count];

        for (var i = 0; i < count; i++)
            segments[i] = path[i];

        return new RecursivePath(segments, ownsArray: true);
    }
}
