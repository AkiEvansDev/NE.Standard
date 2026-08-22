using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled UI interactions by source and target.
/// </summary>
public sealed class UIInteractionIndex
{
    private static readonly CompiledUIInteraction[] Empty = [];

    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIInteraction[]> _byPropertySource;
    private readonly FrozenDictionary<CompiledUIEventAddress, CompiledUIInteraction[]> _byEventSource;
    private readonly FrozenDictionary<UIPropertyAddress, CompiledUIInteraction[]> _byTarget;
    private readonly FrozenDictionary<UIComponentId, CompiledUIInteraction[]> _byComponent;
    private readonly CompiledUIInteraction[] _all;

    /// <summary>
    /// Initializes the interaction index and validates interaction definitions.
    /// </summary>
    public UIInteractionIndex(CompiledUIInteraction[] interactions)
    {
        ArgumentNullException.ThrowIfNull(interactions);

        _all = [.. interactions];

        Dictionary<UIPropertyAddress, List<CompiledUIInteraction>> byPropertySource = [];
        Dictionary<CompiledUIEventAddress, List<CompiledUIInteraction>> byEventSource = [];
        Dictionary<UIPropertyAddress, List<CompiledUIInteraction>> byTarget = [];
        Dictionary<UIComponentId, List<CompiledUIInteraction>> byComponent = [];

        for (var i = 0; i < interactions.Length; i++)
        {
            CompiledUIInteraction interaction = interactions[i];

            interaction.Validate();

            switch (interaction.SourceKind)
            {
                case UIInteractionSourceKind.Property:
                    Add(byPropertySource, interaction.Source!.Value, interaction);
                    break;

                case UIInteractionSourceKind.Event:
                    Add(byEventSource, interaction.SourceEvent!.Value, interaction);
                    break;

                default:
                    throw new UnreachableException();
            }

            if (interaction.Target is UIPropertyAddress target)
                Add(byTarget, target, interaction);

            if (interaction.Source is UIPropertyAddress source)
                Add(byComponent, source.Component.Id, interaction);

            if (interaction.SourceEvent is CompiledUIEventAddress sourceEvent)
                Add(byComponent, sourceEvent.ComponentId, interaction);
        }

        _byPropertySource = Freeze(byPropertySource);
        _byEventSource = Freeze(byEventSource);
        _byTarget = Freeze(byTarget);
        _byComponent = Freeze(byComponent);
    }

    /// <summary>
    /// Gets all registered interactions.
    /// </summary>
    public IReadOnlyList<CompiledUIInteraction> All => _all;

    /// <summary>
    /// Gets interactions triggered by a property source.
    /// </summary>
    public IReadOnlyList<CompiledUIInteraction> GetBySource(UIPropertyAddress source)
        => _byPropertySource.TryGetValue(source, out CompiledUIInteraction[]? interactions)
            ? interactions
            : Empty;

    /// <summary>
    /// Gets interactions triggered by an event source.
    /// </summary>
    public IReadOnlyList<CompiledUIInteraction> GetBySource(CompiledUIEventAddress source)
        => _byEventSource.TryGetValue(source, out CompiledUIInteraction[]? interactions)
            ? interactions
            : Empty;

    /// <summary>
    /// Gets interactions that update the specified target property.
    /// </summary>
    public IReadOnlyList<CompiledUIInteraction> GetByTarget(UIPropertyAddress target)
        => _byTarget.TryGetValue(target, out CompiledUIInteraction[]? interactions)
            ? interactions
            : Empty;

    /// <summary>
    /// Gets interactions triggered by the specified source component.
    /// </summary>
    public IReadOnlyList<CompiledUIInteraction> GetByComponent(UIComponentId componentId)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return _byComponent.TryGetValue(componentId, out CompiledUIInteraction[]? interactions)
            ? interactions
            : Empty;
    }

    private static void Add<TKey>(Dictionary<TKey, List<CompiledUIInteraction>> map, TKey key, CompiledUIInteraction interaction)
        where TKey : notnull
    {
        if (!map.TryGetValue(key, out List<CompiledUIInteraction>? list))
        {
            list = [];
            map.Add(key, list);
        }

        if (!list.Contains(interaction))
            list.Add(interaction);
    }

    private static FrozenDictionary<TKey, CompiledUIInteraction[]> Freeze<TKey>(Dictionary<TKey, List<CompiledUIInteraction>> source)
        where TKey : notnull
    {
        Dictionary<TKey, CompiledUIInteraction[]> result = new(source.Count);

        foreach (KeyValuePair<TKey, List<CompiledUIInteraction>> pair in source)
            result.Add(pair.Key, [.. pair.Value]);

        return result.ToFrozenDictionary();
    }
}
