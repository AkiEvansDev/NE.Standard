using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled binding sources.
/// </summary>
public sealed class UICompiledBindingSourceIndex
{
    private readonly FrozenDictionary<UIBindingSourceId, CompiledUIBindingSource> _sourcesById;
    private readonly FrozenDictionary<UIComponentId, CompiledUIBindingSource> _componentItemsSourcesByComponentId;
    private readonly CompiledUIBindingSource[] _all;

    /// <summary>
    /// Initializes the binding source index and validates source uniqueness.
    /// </summary>
    public UICompiledBindingSourceIndex(CompiledUIBindingSource[] sources)
    {
        ArgumentNullException.ThrowIfNull(sources);

        _all = [.. sources];

        Dictionary<UIBindingSourceId, CompiledUIBindingSource> byId = new(sources.Length);
        Dictionary<UIComponentId, CompiledUIBindingSource> componentItemsByComponentId = [];

        CompiledUIBindingSource? controller = null;

        for (var i = 0; i < sources.Length; i++)
        {
            CompiledUIBindingSource source = sources[i];

            ValidateSource(source);

            if (!byId.TryAdd(source.Id, source))
                throw new InvalidOperationException($"Binding source '{source.Id}' is already registered.");

            switch (source.Kind)
            {
                case CompiledUIBindingSourceKind.Controller:
                    if (controller is not null)
                        throw new InvalidOperationException("Controller binding source is already registered.");

                    controller = source;
                    break;
                case CompiledUIBindingSourceKind.ComponentItems:
                    {
                        UIComponentId componentId = source.ComponentId ?? throw new InvalidOperationException($"Component items source '{source.Id}' must specify component id.");

                        if (!componentItemsByComponentId.TryAdd(componentId, source))
                            throw new InvalidOperationException($"Component items binding source for component '{componentId}' is already registered.");

                        break;
                    }
                default:
                    throw new UnreachableException();
            }
        }

        Controller = controller ?? throw new InvalidOperationException("Controller binding source was not registered.");
        _sourcesById = byId.ToFrozenDictionary();
        _componentItemsSourcesByComponentId = componentItemsByComponentId.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets the controller binding source.
    /// </summary>
    public CompiledUIBindingSource Controller { get; }

    /// <summary>
    /// Gets all registered binding sources.
    /// </summary>
    public IReadOnlyList<CompiledUIBindingSource> All => _all;

    /// <summary>
    /// Attempts to get a binding source by id.
    /// </summary>
    public bool TryGet(UIBindingSourceId sourceId, [NotNullWhen(true)] out CompiledUIBindingSource? source)
        => sourceId.IsEmpty
            ? throw new ArgumentException("Binding source id must not be empty.", nameof(sourceId))
            : _sourcesById.TryGetValue(sourceId, out source);

    /// <summary>
    /// Gets a binding source by id or throws when it is not registered.
    /// </summary>
    public CompiledUIBindingSource GetRequired(UIBindingSourceId sourceId)
        => TryGet(sourceId, out CompiledUIBindingSource? source)
            ? source
            : throw new InvalidOperationException($"Binding source '{sourceId}' was not found.");

    /// <summary>
    /// Attempts to get the component-items binding source for a component.
    /// </summary>
    public bool TryGetComponentItems(UIComponentId componentId, [NotNullWhen(true)] out CompiledUIBindingSource? source)
        => componentId.IsEmpty
            ? throw new ArgumentException("Component id must not be empty.", nameof(componentId))
            : _componentItemsSourcesByComponentId.TryGetValue(componentId, out source);

    /// <summary>
    /// Gets the component-items binding source for a component or throws when it is not registered.
    /// </summary>
    public CompiledUIBindingSource GetRequiredComponentItems(UIComponentId componentId)
        => TryGetComponentItems(componentId, out CompiledUIBindingSource? source)
            ? source
            : throw new InvalidOperationException($"Component items binding source for component '{componentId}' was not found.");

    /// <summary>
    /// Gets a component-scoped binding source of the specified kind.
    /// </summary>
    public CompiledUIBindingSource GetRequiredByComponentId(UIComponentId componentId, CompiledUIBindingSourceKind kind)
        => TryGetByComponentId(componentId, kind, out CompiledUIBindingSource? source)
            ? source
            : throw new InvalidOperationException($"Binding source '{kind}' for component '{componentId}' was not found.");

    /// <summary>
    /// Attempts to get a component-scoped binding source of the specified kind.
    /// </summary>
    public bool TryGetByComponentId(UIComponentId componentId, CompiledUIBindingSourceKind kind, [NotNullWhen(true)] out CompiledUIBindingSource? source)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return kind switch
        {
            CompiledUIBindingSourceKind.ComponentItems => _componentItemsSourcesByComponentId.TryGetValue(componentId, out source),
            CompiledUIBindingSourceKind.Controller => throw new ArgumentOutOfRangeException(nameof(kind), kind, "Controller source is not component-scoped."),
            _ => throw new UnreachableException()
        };
    }

    private static void ValidateSource(CompiledUIBindingSource source)
    {
        ArgumentNullException.ThrowIfNull(source);

        if (source.Id.IsEmpty)
            throw new InvalidOperationException("Binding source id must not be empty.");

        switch (source.Kind)
        {
            case CompiledUIBindingSourceKind.Controller:
                if (source.ComponentId is not null)
                    throw new InvalidOperationException($"Controller source '{source.Id}' must not specify component id.");

                if (source.ItemsProperty is not null)
                    throw new InvalidOperationException($"Controller source '{source.Id}' must not specify items property.");

                break;

            case CompiledUIBindingSourceKind.ComponentItems:
                if (source.ComponentId is null || source.ComponentId.Value.IsEmpty)
                    throw new InvalidOperationException($"Component items source '{source.Id}' must specify component id.");

                ArgumentException.ThrowIfNullOrWhiteSpace(source.ItemsProperty);

                break;

            default:
                throw new UnreachableException();
        }
    }
}
