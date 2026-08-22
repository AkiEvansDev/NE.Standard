using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides graph lookup access to compiled UI components and component slots.
/// </summary>
public sealed class UIComponentGraph
{
    private readonly record struct ComponentSlotKindKey(UIComponentId ComponentId, UIComponentSlotKind Kind);
    private readonly record struct ComponentSlotExactKey(UIComponentId ComponentId, UIComponentSlotKind Kind, string? Key);

    private static readonly UIComponentSlot[] EmptySlots = [];
    private static readonly UIComponentId[] EmptyChildren = [];

    private readonly FrozenDictionary<UIComponentId, UIComponentNode> _nodes;
    private readonly FrozenDictionary<ComponentSlotKindKey, UIComponentSlot[]> _slotsByKind;
    private readonly FrozenDictionary<ComponentSlotExactKey, UIComponentSlot> _slotsByExactKey;
    private readonly FrozenDictionary<string, UIComponentId> _componentIdsByAuthoringId;
    private readonly UIComponentNode[] _all;

    /// <summary>
    /// Initializes the component graph and validates node and slot references.
    /// </summary>
    public UIComponentGraph(UIComponentNode[] nodes)
    {
        ArgumentNullException.ThrowIfNull(nodes);

        _all = [.. nodes];

        Dictionary<UIComponentId, UIComponentNode> nodeBuilder = new(nodes.Length);
        Dictionary<ComponentSlotKindKey, List<UIComponentSlot>> slotsByKindBuilder = [];
        Dictionary<ComponentSlotExactKey, UIComponentSlot> slotsByExactKeyBuilder = [];
        Dictionary<string, UIComponentId> idsByAuthoringId = new(StringComparer.Ordinal);

        for (var i = 0; i < nodes.Length; i++)
        {
            UIComponentNode node = nodes[i];

            if (node.ComponentId.IsEmpty)
                throw new InvalidOperationException("Component id must not be empty.");

            if (node.ContextId.IsEmpty)
                throw new InvalidOperationException($"Component '{node.ComponentId}' context id must not be empty.");

            ArgumentException.ThrowIfNullOrWhiteSpace(node.TypeKey);

            if (!nodeBuilder.TryAdd(node.ComponentId, node))
                throw new InvalidOperationException($"Component '{node.ComponentId}' is already registered.");

            ArgumentException.ThrowIfNullOrWhiteSpace(node.AuthoringId);

            if (!idsByAuthoringId.TryAdd(node.AuthoringId, node.ComponentId))
                throw new InvalidOperationException($"Authoring component id '{node.AuthoringId}' is already registered.");

            for (var slotIndex = 0; slotIndex < node.Slots.Length; slotIndex++)
            {
                UIComponentSlot slot = node.Slots[slotIndex];

                ValidateSlot(node, slot);

                ComponentSlotKindKey kindKey = new(node.ComponentId, slot.Kind);

                if (!slotsByKindBuilder.TryGetValue(kindKey, out List<UIComponentSlot>? kindSlots))
                {
                    kindSlots = [];
                    slotsByKindBuilder.Add(kindKey, kindSlots);
                }

                kindSlots.Add(slot);

                if (slot.Kind != UIComponentSlotKind.Child)
                {
                    ComponentSlotExactKey exactKey = new(node.ComponentId, slot.Kind, slot.Key);

                    if (!slotsByExactKeyBuilder.TryAdd(exactKey, slot))
                        throw new InvalidOperationException($"Slot '{slot.Kind}' with key '{slot.Key}' is already registered for component '{node.ComponentId}'.");
                }
            }
        }

        Dictionary<ComponentSlotKindKey, UIComponentSlot[]> frozenSlotsByKindSource = new(slotsByKindBuilder.Count);

        foreach (KeyValuePair<ComponentSlotKindKey, List<UIComponentSlot>> pair in slotsByKindBuilder)
            frozenSlotsByKindSource.Add(pair.Key, [.. pair.Value]);

        for (var i = 0; i < nodes.Length; i++)
            ValidateNodeReferences(nodes[i], nodeBuilder);

        _nodes = nodeBuilder.ToFrozenDictionary();
        _slotsByKind = frozenSlotsByKindSource.ToFrozenDictionary();
        _slotsByExactKey = slotsByExactKeyBuilder.ToFrozenDictionary();
        _componentIdsByAuthoringId = idsByAuthoringId.ToFrozenDictionary(StringComparer.Ordinal);
    }

    /// <summary>
    /// Gets all registered component nodes.
    /// </summary>
    public IReadOnlyList<UIComponentNode> All => _all;

    /// <summary>
    /// Gets all slots owned by a component.
    /// </summary>
    public IReadOnlyList<UIComponentSlot> GetSlots(UIComponentId componentId)
        => GetRequired(componentId).Slots;

    /// <summary>
    /// Gets child component ids for a component.
    /// </summary>
    public IReadOnlyList<UIComponentId> GetChildren(UIComponentId componentId)
    {
        UIComponentId[] children = GetRequired(componentId).Children;

        return children.Length == 0 ? EmptyChildren : children;
    }

    /// <summary>
    /// Gets slots of the specified kind owned by a component.
    /// </summary>
    public IReadOnlyList<UIComponentSlot> GetSlots(UIComponentId componentId, UIComponentSlotKind kind)
    {
        if (componentId.IsEmpty)
            throw new ArgumentException("Component id must not be empty.", nameof(componentId));

        return _slotsByKind.TryGetValue(new ComponentSlotKindKey(componentId, kind), out UIComponentSlot[]? slots)
            ? slots
            : EmptySlots;
    }

    /// <summary>
    /// Attempts to get a non-child slot by owner, kind, and optional key.
    /// </summary>
    public bool TryGetSlot(UIComponentId componentId, UIComponentSlotKind kind, [NotNullWhen(true)] out UIComponentSlot? slot, string? key = null)
        => componentId.IsEmpty
            ? throw new ArgumentException("Component id must not be empty.", nameof(componentId))
            : _slotsByExactKey.TryGetValue(new ComponentSlotExactKey(componentId, kind, key), out slot);

    /// <summary>
    /// Gets a non-child slot by owner, kind, and optional key, or throws when it is not registered.
    /// </summary>
    public UIComponentSlot GetRequiredSlot(UIComponentId componentId, UIComponentSlotKind kind, string? key = null)
        => TryGetSlot(componentId, kind, out UIComponentSlot? slot, key)
            ? slot
            : throw new InvalidOperationException($"Slot '{kind}' was not found.");

    /// <summary>
    /// Attempts to get a component node by id.
    /// </summary>
    public bool TryGet(UIComponentId componentId, [NotNullWhen(true)] out UIComponentNode? node)
        => componentId.IsEmpty
            ? throw new ArgumentException("Component id must not be empty.", nameof(componentId))
            : _nodes.TryGetValue(componentId, out node);

    /// <summary>
    /// Gets a component node by id or throws when it is not registered.
    /// </summary>
    public UIComponentNode GetRequired(UIComponentId componentId)
        => TryGet(componentId, out UIComponentNode? node)
            ? node
            : throw new InvalidOperationException($"Component '{componentId}' was not found.");

    /// <summary>
    /// Attempts to get a compiled component id by authoring component id.
    /// </summary>
    public bool TryGetComponentId(string authoringId, out UIComponentId componentId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(authoringId);

        return _componentIdsByAuthoringId.TryGetValue(authoringId, out componentId);
    }

    /// <summary>
    /// Gets a compiled component id by authoring component id or throws when it is not registered.
    /// </summary>
    public UIComponentId GetRequiredComponentId(string authoringId)
        => TryGetComponentId(authoringId, out UIComponentId componentId)
            ? componentId
            : throw new InvalidOperationException($"Component '{authoringId}' was not found.");

    private static void ValidateSlot(UIComponentNode owner, UIComponentSlot slot)
    {
        ArgumentNullException.ThrowIfNull(slot);

        if (slot.OwnerComponentId.IsEmpty)
            throw new InvalidOperationException($"Component '{owner.ComponentId}' has slot with empty owner component id.");

        if (slot.RootComponentId.IsEmpty)
            throw new InvalidOperationException($"Component '{owner.ComponentId}' has slot with empty root component id.");

        if (!slot.OwnerComponentId.Equals(owner.ComponentId))
            throw new InvalidOperationException($"Slot owner '{slot.OwnerComponentId}' does not match component '{owner.ComponentId}'.");
    }

    private static void ValidateNodeReferences(UIComponentNode node, Dictionary<UIComponentId, UIComponentNode> nodes)
    {
        if (node.ParentId is { } parentId)
        {
            if (parentId.IsEmpty)
                throw new InvalidOperationException($"Component '{node.ComponentId}' parent id must not be empty.");

            if (!nodes.ContainsKey(parentId))
                throw new InvalidOperationException($"Component '{node.ComponentId}' parent '{parentId}' was not found.");
        }

        for (var i = 0; i < node.Slots.Length; i++)
        {
            UIComponentSlot slot = node.Slots[i];

            if (!nodes.ContainsKey(slot.RootComponentId))
                throw new InvalidOperationException($"Slot root component '{slot.RootComponentId}' was not found for component '{node.ComponentId}'.");
        }

        for (var i = 0; i < node.Children.Length; i++)
        {
            UIComponentId childId = node.Children[i];

            if (childId.IsEmpty)
                throw new InvalidOperationException($"Component '{node.ComponentId}' has empty child id.");

            if (!nodes.ContainsKey(childId))
                throw new InvalidOperationException($"Component '{node.ComponentId}' child '{childId}' was not found.");
        }
    }
}
