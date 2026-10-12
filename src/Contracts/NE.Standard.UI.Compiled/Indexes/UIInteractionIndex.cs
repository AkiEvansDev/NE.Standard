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
    private readonly FrozenDictionary<UIPropertyAddress, object?> _firstPaint;
    private readonly CompiledUIInteraction[] _all;

    /// <summary>
    /// Initializes the interaction index and validates interaction definitions; <paramref name="firstPaint"/> holds what a rule gives
    /// its target before anything changes, where its source's value is the view's own.
    /// </summary>
    public UIInteractionIndex(CompiledUIInteraction[] interactions, IReadOnlyDictionary<UIPropertyAddress, object?>? firstPaint = null)
    {
        ArgumentNullException.ThrowIfNull(interactions);

        _all = [.. interactions];
        _firstPaint = firstPaint is null || firstPaint.Count == 0 ? FrozenDictionary<UIPropertyAddress, object?>.Empty : firstPaint.ToFrozenDictionary();

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
                    GroupingIndex.Add(byPropertySource, interaction.Source!.Value, interaction);
                    break;

                case UIInteractionSourceKind.Event:
                    GroupingIndex.Add(byEventSource, interaction.SourceEvent!.Value, interaction);
                    break;

                default:
                    throw new UnreachableException();
            }

            if (interaction.Target is UIPropertyAddress target)
                GroupingIndex.Add(byTarget, target, interaction);

            if (interaction.Source is UIPropertyAddress source)
                GroupingIndex.Add(byComponent, source.Component.Id, interaction);

            if (interaction.SourceEvent is CompiledUIEventAddress sourceEvent)
                GroupingIndex.Add(byComponent, sourceEvent.ComponentId, interaction);
        }

        _byPropertySource = GroupingIndex.Freeze(byPropertySource);
        _byEventSource = GroupingIndex.Freeze(byEventSource);
        _byTarget = GroupingIndex.Freeze(byTarget);
        _byComponent = GroupingIndex.Freeze(byComponent);
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
    /// The value the rules reading another component's property give <paramref name="target"/> as the page is first drawn — a note
    /// under a switch that is off starts hidden — where every source they read holds a value the view itself sets; the page applies
    /// the same rules from then on.
    /// </summary>
    public bool TryGetFirstPaintValue(UIPropertyAddress target, out object? value)
    {
        if (_firstPaint.Count == 0)
        {
            value = null;
            return false;
        }

        return _firstPaint.TryGetValue(target, out value);
    }

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
}
