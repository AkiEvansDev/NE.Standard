using System.Collections.Frozen;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Runtime;

/// <summary>What a gate closes on: the property it reads and the value that closes it.</summary>
internal enum UIComponentGateKind
{
    Enabled,
    Loading,
    Visibility,
    ReadOnly,
    CanSelect
}

/// <summary>
/// One property the server can read that closes a component to the reader: a static value that already closes it
/// (<see cref="Binding"/> null), or a controller binding read when a command or a value arrives.
/// </summary>
/// <remarks>
/// <see cref="FixedPath"/> is the bound path where the binding takes no row keys, the same for every read;
/// <see cref="DynamicCount"/> is how many of the target's row keys, outermost first, the binding reads.
/// </remarks>
internal sealed record UIComponentGate(UIComponentGateKind Kind, CompiledUIBinding? Binding, RecursivePath? FixedPath, int DynamicCount);

/// <summary>A component's gates: its own and its ancestors' that close it whole, and its own for a write or a row's choice.</summary>
internal sealed record UIComponentGates(UIComponentGate[] Chain, UIComponentGate? ReadOnly, UIComponentGate? CanSelect);

/// <summary>An items host's rows: the template root a row is drawn from, and how many keys address one row.</summary>
internal readonly record struct UIRowGates(UIComponentId TemplateRootId, int RowParameterCount);

/// <summary>
/// The server's half of what closes a component — <c>Enabled</c>, <c>Loading</c> and <c>Visibility</c> up the ancestors,
/// <c>IsReadOnly</c> and a row's <c>CanSelect</c> of its own — built once per compiled view.
/// </summary>
/// <remarks>
/// Only what the server can know goes in: a static value, or a binding to the controller. An interaction's state
/// (<c>EnabledWhen</c>, <c>ShownWhen</c>) lives on the client alone. A component nothing closes has no entry, so a view that
/// closes nothing costs one count read per command or value.
/// </remarks>
internal sealed class UIComponentGateIndex
{
    private static readonly ConditionalWeakTable<CompiledView, UIComponentGateIndex> Indexes = [];

    private readonly FrozenDictionary<UIComponentId, UIComponentGates> _components;
    private readonly FrozenDictionary<UIComponentId, UIRowGates> _rows;

    private UIComponentGateIndex(CompiledView view)
    {
        Dictionary<UIComponentId, UIComponentGate[]> chains = [];
        Dictionary<UIComponentId, UIComponentGates> components = [];
        Dictionary<UIComponentId, UIRowGates> rows = [];

        foreach (UIComponentNode node in view.Graph.All)
        {
            UIComponentGate[] chain = GetChain(view, node, chains);
            UIComponentGate? readOnly = CreateGate(view, node.ComponentId, IInputComponent.IsReadOnlyProperty, UIComponentGateKind.ReadOnly);
            UIComponentGate? canSelect = CreateGate(view, node.ComponentId, IItemAbilitiesComponent.CanSelectProperty, UIComponentGateKind.CanSelect);

            if (chain.Length > 0 || readOnly is not null || canSelect is not null)
                components.Add(node.ComponentId, new UIComponentGates(chain, readOnly, canSelect));
        }

        foreach (UIComponentNode node in view.Graph.All)
        {
            // A host whose rows wear one of several templates by the item's kind is left out: which one a row wears is the item's.
            if (view.Graph.GetSlots(node.ComponentId, UIComponentSlotKind.TemplateVariant).Count > 0
                || !view.Graph.TryGetSlot(node.ComponentId, UIComponentSlotKind.Template, out UIComponentSlot? template)
                || !components.ContainsKey(template.RootComponentId))
            {
                continue;
            }

            UIComponentNode root = view.Graph.GetRequired(template.RootComponentId);

            if (root.ContextParameterCount > node.ContextParameterCount)
                rows.Add(node.ComponentId, new UIRowGates(root.ComponentId, root.ContextParameterCount));
        }

        _components = components.ToFrozenDictionary();
        _rows = rows.ToFrozenDictionary();
    }

    /// <summary>The index of a compiled view, built on first use and shared by every runtime of the view.</summary>
    public static UIComponentGateIndex For(CompiledView view)
        => Indexes.GetValue(view, static view => new UIComponentGateIndex(view));

    /// <summary>Whether nothing in the view can close a component, so a check has nothing to read.</summary>
    public bool IsEmpty => _components.Count == 0;

    public bool TryGet(UIComponentId componentId, out UIComponentGates? gates)
        => _components.TryGetValue(componentId, out gates);

    public bool TryGetRows(UIComponentId hostId, out UIRowGates rows)
        => _rows.TryGetValue(hostId, out rows);

    /// <summary>The component's own closing gates followed by its parent's chain, each chain built once.</summary>
    private static UIComponentGate[] GetChain(CompiledView view, UIComponentNode node, Dictionary<UIComponentId, UIComponentGate[]> chains)
    {
        if (chains.TryGetValue(node.ComponentId, out UIComponentGate[]? known))
            return known;

        List<UIComponentGate> chain = [];

        AddGate(chain, CreateGate(view, node.ComponentId, IVisualComponent.EnabledProperty, UIComponentGateKind.Enabled));
        AddGate(chain, CreateGate(view, node.ComponentId, IVisualComponent.LoadingProperty, UIComponentGateKind.Loading));
        AddGate(chain, CreateGate(view, node.ComponentId, IVisualComponent.VisibilityProperty, UIComponentGateKind.Visibility));

        if (node.ParentId is UIComponentId parentId && view.Graph.TryGet(parentId, out UIComponentNode? parent))
            chain.AddRange(GetChain(view, parent, chains));

        UIComponentGate[] built = chain.Count == 0 ? [] : [.. chain];

        chains.Add(node.ComponentId, built);

        return built;
    }

    private static void AddGate(List<UIComponentGate> chain, UIComponentGate? gate)
    {
        if (gate is not null)
            chain.Add(gate);
    }

    /// <summary>
    /// The gate a property makes: a static value that closes the component, or a controller binding; none for a static value that
    /// leaves it open, or a binding to anything but the controller.
    /// </summary>
    private static UIComponentGate? CreateGate(CompiledView view, UIComponentId componentId, UIProperty property, UIComponentGateKind kind)
    {
        if (!view.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? value))
            return null;

        if (!value.IsBind)
            return Closes(kind, value.Value) ? new UIComponentGate(kind, Binding: null, FixedPath: null, DynamicCount: 0) : null;

        if (!view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, property), out CompiledUIBinding? binding)
            || !view.Sources.TryGet(binding.SourceId, out CompiledUIBindingSource? source)
            || source.Kind != CompiledUIBindingSourceKind.Controller)
        {
            return null;
        }

        var dynamicCount = CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters);
        RecursivePath? fixedPath = dynamicCount == 0 ? view.Bindings.Resolve(binding, []).Path : null;

        return new UIComponentGate(kind, binding, fixedPath, dynamicCount);
    }

    /// <summary>Whether a property's value closes the component: disabled, loading, hidden at every width, read-only, not to be chosen.</summary>
    public static bool Closes(UIComponentGateKind kind, object? value)
        => kind switch
        {
            UIComponentGateKind.Enabled => value is false,
            UIComponentGateKind.Loading => value is true,
            UIComponentGateKind.ReadOnly => value is true,
            UIComponentGateKind.CanSelect => value is false,
            UIComponentGateKind.Visibility => IsHiddenEverywhere(value),
            _ => false
        };

    /// <summary>Hidden at one width and shown at another is the client's to know; only hidden at every width closes.</summary>
    private static bool IsHiddenEverywhere(object? value)
        => value switch
        {
            UIVisibility visibility => visibility != UIVisibility.Visible,
            UIResponsive<UIVisibility> responsive => IsHidden(responsive.Base)
                && IsHidden(responsive.Sm)
                && IsHidden(responsive.Md)
                && IsHidden(responsive.Xl)
                && IsHidden(responsive.Xxl),
            _ => false
        };

    private static bool IsHidden(UIVisibility? visibility)
        => visibility is null or not UIVisibility.Visible;
}
