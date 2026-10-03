using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// Works out, once per compiled view, what the page reads off each items host's rows: the paths its templates' bindings read off the
/// row's item, its rules, its keys and variants, the abilities and marks every row is read for, and what the host declares it reads.
/// </summary>
/// <remarks>
/// The client's readers are the reference — <c>tryResolveItemTemplateValue</c> for a binding, <c>applyItemParameterAttributes</c>
/// for the key, group and abilities, <c>isContentItem</c>, <c>resolveTemplateKeyValue</c> and the rules' <c>readItemPropertyPath</c>.
/// A host whose readers cannot be known here — a sink, a host whose rules or query are bound, a binding of the whole item — travels whole.
/// </remarks>
internal static class UIItemProjectionBuilder
{
    // A refusal is the false alone: an ability left out reads as allowed (`=== false` on the page).
    private static readonly string[] Abilities =
    [
        nameof(IItemAbilitiesModel.CanSelect),
        nameof(IItemAbilitiesModel.CanDrag),
        nameof(IItemAbilitiesModel.CanRemove),
        nameof(IItemAbilitiesModel.CanRename),
        nameof(IItemAbilitiesModel.CanShowContextMenu)
    ];

    public static UIItemProjectionIndex Build(UIComponentGraph graph, UIComponentStateIndex state, UICompiledBindingIndex bindings, UICompiledBindingTemplateIndex templates)
    {
        Dictionary<UIComponentId, UIComponentId> hostsByRoot = [];

        foreach (UIComponentNode node in graph.All)
        {
            foreach (UIComponentSlot slot in node.Slots)
            {
                if (slot.Kind is UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant or UIComponentSlotKind.GroupTemplate)
                    hostsByRoot[slot.RootComponentId] = node.ComponentId;
            }
        }

        Dictionary<UIComponentId, Reads> reads = [];

        foreach (UIComponentId host in hostsByRoot.Values)
        {
            if (!reads.ContainsKey(host))
                reads[host] = ReadsOfHost(graph, state, host);
        }

        foreach (CompiledUIBinding binding in bindings.All)
        {
            if (binding.Kind == CompiledUIBindingKind.ComponentProperty && binding.Parameters.Length > 0)
                AddBindingRead(graph, hostsByRoot, reads, binding, templates.GetRequired(binding.TemplateId).Template);
        }

        Dictionary<UIComponentId, UIItemProjection> projections = new(reads.Count);

        foreach ((UIComponentId host, Reads hostReads) in reads)
            projections[host] = hostReads.Whole ? UIItemProjection.Whole : hostReads.Root.ToProjection();

        return new UIItemProjectionIndex(projections);
    }

    /// <summary>What the page reads off every row of a host whatever its templates bind.</summary>
    private static Reads ReadsOfHost(UIComponentGraph graph, UIComponentStateIndex state, UIComponentId host)
    {
        Reads reads = new();

        if (IsTrue(state, host, IItemValuesComponent.TakesItemValuesProperty) || IsBound(state, host, IItemsComponent.ItemsViewProperty) || IsBound(state, host, IItemsComponent.QueryProperty))
        {
            reads.Whole = true;
            return reads;
        }

        if (state.TryGetValue(host, IItemsComponent.ItemReadsProperty, out CompiledUIPropertyValue? itemReads) && itemReads.Value is UIItemReads declared)
        {
            if (declared.IsWhole)
            {
                reads.Whole = true;
                return reads;
            }

            foreach (var path in declared.Paths)
                reads.Root.Add(path.Split('.'), Fallback.Raw);
        }

        reads.Root.Add([nameof(IBindableItem.Id)], Fallback.Raw);
        reads.Root.Add([nameof(IBindableGroup.Group)], Fallback.Raw);

        // Read as `=== true`, so a false says what an absent key says.
        reads.Root.Add([nameof(IContentItem.IsContent)], Fallback.Of(false));

        foreach (var ability in Abilities)
            reads.Root.Add([ability], Fallback.Of(true));

        if (state.TryGetValue(host, ITemplatedComponent.TemplateKeyPropertyProperty, out CompiledUIPropertyValue? templateKey))
        {
            if (templateKey.IsBind)
            {
                reads.Whole = true;
                return reads;
            }

            if (templateKey.Value is string { Length: > 0 } keyProperty)
                reads.Root.Add(keyProperty.Split('.'), Fallback.Raw);
        }

        foreach (UIComponentSlot slot in graph.GetRequired(host).Slots)
        {
            if (slot.KeyProperty is { Length: > 0 } slotKey)
                reads.Root.Add(slotKey.Split('.'), Fallback.Raw);
        }

        if (state.TryGetValue(host, IItemsComponent.ItemsViewProperty, out CompiledUIPropertyValue? itemsView) && itemsView.Value is CompiledUIItemsView rules)
        {
            foreach (CompiledUIItemsFilter filter in rules.Filters)
                reads.Root.Add(filter.ItemProperty.Split('.'), Fallback.Raw);

            foreach (CompiledUIItemsSort sort in rules.Sorts)
                reads.Root.Add(sort.ItemProperty.Split('.'), Fallback.Raw);
        }

        if (state.TryGetValue(host, IItemsComponent.QueryProperty, out CompiledUIPropertyValue? query) && query.Value is UIItemsQuery terms)
        {
            foreach (UIItemFilterTerm filter in terms.Filters)
                reads.Root.Add(filter.ItemProperty.Split('.'), Fallback.Raw);

            foreach (UIItemSortTerm sort in terms.Sorts)
                reads.Root.Add(sort.ItemProperty.Split('.'), Fallback.Raw);
        }

        return reads;
    }

    private static bool IsTrue(UIComponentStateIndex state, UIComponentId componentId, UIProperty property)
        => state.TryGetValue(componentId, property, out CompiledUIPropertyValue? value) && !value.IsBind && value.Value is true;

    private static bool IsBound(UIComponentStateIndex state, UIComponentId componentId, UIProperty property)
        => state.TryGetValue(componentId, property, out CompiledUIPropertyValue? value) && value.IsBind;

    /// <summary>
    /// The path a binding reads off an item, as the page walks it: what follows the last row key it names, off the item of the row
    /// that key is; a binding naming no row key reads its whole path off the innermost row around it.
    /// </summary>
    private static void AddBindingRead(UIComponentGraph graph, Dictionary<UIComponentId, UIComponentId> hostsByRoot, Dictionary<UIComponentId, Reads> reads, CompiledUIBinding binding, string template)
    {
        // A scope parameter has no `[]` in the template: the page drops it before matching them.
        var slots = 0;
        var lastDynamic = -1;
        UIComponentId? scope = null;

        foreach (CompiledUIBindingParameter parameter in binding.Parameters)
        {
            if (parameter.Kind == CompiledUIBindingParameterKind.Scope)
                continue;

            if (parameter.Kind == CompiledUIBindingParameterKind.Dynamic)
            {
                lastDynamic = slots;
                scope = parameter.ComponentId;
            }

            slots++;
        }

        UIComponentId? host = scope is { } root && hostsByRoot.TryGetValue(root, out UIComponentId named)
            ? named
            : InnermostHost(graph, hostsByRoot, binding.Address.Component.Id);

        if (host is not { } hostId || !reads.TryGetValue(hostId, out Reads? hostReads) || hostReads.Whole)
            return;

        // Reading the name a row key stands at would read the list, not the row: the walk is rebased there instead.
        if (scope is not null && !hostsByRoot.ContainsKey(scope.Value))
        {
            hostReads.Whole = true;
            return;
        }

        var start = lastDynamic < 0 ? 0 : IndexAfterSlot(template, lastDynamic);
        List<string> path = [];
        var whole = false;
        var i = start;

        while (i < template.Length)
        {
            if (template[i] == '.')
            {
                i++;
                continue;
            }

            // A fixed key walks into a list the page reads as it stands: the list is kept whole.
            if (template[i] == '[')
            {
                whole = true;
                break;
            }

            var segmentStart = i;

            while (i < template.Length && template[i] != '.' && template[i] != '[')
                i++;

            path.Add(template[segmentStart..i]);
        }

        // A binding of the row's item itself reads all of it.
        if (path.Count == 0)
        {
            hostReads.Whole = true;
            return;
        }

        hostReads.Root.Add([.. path], whole ? Fallback.Raw : Fallback.Of(binding.TargetFallbackValue));
    }

    /// <summary>The index just past the <paramref name="slot"/>-th <c>[]</c> of a template.</summary>
    private static int IndexAfterSlot(string template, int slot)
    {
        var seen = -1;

        for (var i = 0; i + 1 < template.Length; i++)
        {
            if (template[i] == '[' && template[i + 1] == ']' && ++seen == slot)
                return i + 2;
        }

        return template.Length;
    }

    /// <summary>The host whose row template the component sits in, nearest first; null outside every row.</summary>
    private static UIComponentId? InnermostHost(UIComponentGraph graph, Dictionary<UIComponentId, UIComponentId> hostsByRoot, UIComponentId componentId)
    {
        for (UIComponentId? current = componentId; current is { } id; current = graph.GetRequired(id).ParentId)
        {
            if (hostsByRoot.TryGetValue(id, out UIComponentId host))
                return host;
        }

        return null;
    }

    /// <summary>What a reader reads an absent property as: a value, or nothing it can be told apart from a value by.</summary>
    private readonly record struct Fallback(bool Known, object? Value)
    {
        public static Fallback Raw => default;

        public static Fallback Of(object? value) => new(true, value);
    }

    private sealed class Reads
    {
        public bool Whole { get; set; }

        public ReadNode Root { get; } = new();
    }

    /// <summary>One property read, and what is read inside it; read whole as soon as any reader reads it as it stands.</summary>
    private sealed class ReadNode
    {
        private Dictionary<string, ReadNode>? _children;
        private bool _readWhole;
        private bool _hasFallback;
        private bool _fallbackConflicts;
        private object? _fallback;

        public void Add(string[] path, Fallback fallback)
            => Add(path, 0, fallback);

        private void Add(string[] path, int at, Fallback fallback)
        {
            _children ??= new(StringComparer.Ordinal);

            if (!_children.TryGetValue(path[at], out ReadNode? child))
            {
                child = new ReadNode();
                _children.Add(path[at], child);
            }

            if (at + 1 < path.Length)
            {
                child.Add(path, at + 1, fallback);
                return;
            }

            child._readWhole = true;
            child.MergeFallback(fallback);
        }

        private void MergeFallback(Fallback fallback)
        {
            if (!fallback.Known)
            {
                _fallbackConflicts = true;
                return;
            }

            if (!_hasFallback)
            {
                _hasFallback = true;
                _fallback = fallback.Value;
                return;
            }

            if (!Equals(_fallback, fallback.Value))
                _fallbackConflicts = true;
        }

        public UIItemProjection ToProjection()
        {
            List<UIItemProjectionMember> members = new(_children?.Count ?? 0);

            if (_children is not null)
            {
                foreach ((var name, ReadNode child) in _children)
                    members.Add(child.ToMember(name));
            }

            return new UIItemProjection(members);
        }

        private UIItemProjectionMember ToMember(string name)
        {
            // A value is left out only where every reader reads it as it stands and reads the same thing from an absent key.
            var hasFallback = _readWhole && _children is null && _hasFallback && !_fallbackConflicts && _fallback is not null;

            return new UIItemProjectionMember
            {
                Name = name,
                Inner = _readWhole || _children is null ? null : ToProjection(),
                HasFallback = hasFallback,
                Fallback = hasFallback ? _fallback : null
            };
        }
    }
}
