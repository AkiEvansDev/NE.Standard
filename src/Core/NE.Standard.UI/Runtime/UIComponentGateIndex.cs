using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
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
    CanSelect,
    MarkedDaysOnly,

    /// <summary>Not a closing value: one a check reads through the gate's binding — an input's bound, its marked days.</summary>
    Read
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

/// <summary>
/// A component's gates: its own and its ancestors' that close it whole, and its own for a write, a row's choice or the value written.
/// </summary>
internal sealed record UIComponentGates(UIComponentGate[] Chain, UIComponentGate? ReadOnly, UIComponentGate? CanSelect, UIValueChecks? Values);

/// <summary>A value a check reads: the compiled static one, or the controller's through <see cref="Bound"/>.</summary>
internal readonly record struct UIGateValue(object? Static, UIComponentGate? Bound);

/// <summary>
/// What an input's written value — and a period's end — is held to, in the value's own <see cref="ValueType"/>: its <c>Min</c> and
/// <c>Max</c>, and a day input's marked days while <see cref="MarkedOnly"/> closes. One unset, or bound to what the server cannot
/// read, holds nothing.
/// </summary>
internal sealed record UIValueChecks(Type ValueType, UIGateValue? Min, UIGateValue? Max, UIComponentGate? MarkedOnly, UIGateValue? MarkedDays);

/// <summary>An items host's rows: the template root a row is drawn from, and how many keys address one row.</summary>
internal readonly record struct UIRowGates(UIComponentId TemplateRootId, int RowParameterCount);

/// <summary>
/// The server's half of what closes a component — <c>Enabled</c>, <c>Loading</c> and <c>Visibility</c> up the ancestors,
/// <c>IsReadOnly</c> and a row's <c>CanSelect</c> of its own, an input's <c>Min</c>/<c>Max</c> and a day input's <c>MarkedDaysOnly</c>
/// for the value written — built once per compiled view.
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
            UIValueChecks? values = CreateValueChecks(view, node.ComponentId);

            if (chain.Length > 0 || readOnly is not null || canSelect is not null || values is not null)
                components.Add(node.ComponentId, new UIComponentGates(chain, readOnly, canSelect, values));
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

        return CreateBoundGate(view, componentId, property, kind);
    }

    /// <summary>The gate a property bound to the controller makes; none for a binding to anything else, which the server cannot read.</summary>
    private static UIComponentGate? CreateBoundGate(CompiledView view, UIComponentId componentId, UIProperty property, UIComponentGateKind kind)
    {
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

    /// <summary>
    /// What an input's written value is held to, or none: an input with no bound set that offers every day costs a write nothing. A
    /// slider's unset bound is the one the page draws, as its authoring check reads it; a day input's unset marked days offer no day.
    /// </summary>
    private static UIValueChecks? CreateValueChecks(CompiledView view, UIComponentId componentId)
    {
        // Only an input the page writes a value to: a progress bar's bounds hold nothing, nor does a value no binding takes.
        if (!view.State.TryGetValue(componentId, IInputComponent.IsReadOnlyProperty, out _) || WrittenValueType(view, componentId) is not Type valueType)
            return null;

        UIGateValue? min = CreateGateValue(view, componentId, IBoundedInputComponent.MinProperty, valueType, unset: null);
        UIGateValue? max = CreateGateValue(view, componentId, IBoundedInputComponent.MaxProperty, valueType, unset: null);
        UIComponentGate? markedOnly = CreateGate(view, componentId, IMarkedDaysComponent.MarkedDaysOnlyProperty, UIComponentGateKind.MarkedDaysOnly);
        UIGateValue? markedDays = markedOnly is null ? null : CreateGateValue(view, componentId, IMarkedDaysComponent.MarkedDaysProperty, valueType: null, unset: Array.Empty<DateOnly>());

        return min is null && max is null && markedDays is null ? null : new UIValueChecks(valueType, min, max, markedOnly, markedDays);
    }

    /// <summary>The type the page's writes to an input's value — or a period's end, the same type — are read in; none where neither is bound.</summary>
    private static Type? WrittenValueType(CompiledView view, UIComponentId componentId)
    {
        if (!view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, IInputComponent.ValueProperty), out CompiledUIBinding? binding)
            && !view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, IPeriodInputComponent.EndValueProperty), out binding))
        {
            return null;
        }

        return binding.TargetValueType is Type type ? Nullable.GetUnderlyingType(type) ?? type : null;
    }

    /// <summary>
    /// A property a check reads: its static value brought to <paramref name="valueType"/> once, here, or <paramref name="unset"/> for
    /// none; none at all where that is nothing too, where it is of no kind the type takes, or where it is bound to anything but the
    /// controller.
    /// </summary>
    private static UIGateValue? CreateGateValue(CompiledView view, UIComponentId componentId, UIProperty property, Type? valueType, object? unset)
    {
        if (!view.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? value))
            return null;

        if (!value.IsBind)
        {
            if ((value.Value ?? unset) is not { } read)
                return null;

            if (valueType is null)
                return new UIGateValue(read, Bound: null);

            return RecursiveValueCoercion.TryCoerce(read, valueType, out var typed) && typed is not null ? new UIGateValue(typed, Bound: null) : null;
        }

        UIComponentGate? bound = CreateBoundGate(view, componentId, property, UIComponentGateKind.Read);

        return bound is null ? null : new UIGateValue(Static: null, bound);
    }

    /// <summary>
    /// Whether a property's value closes the component: disabled, loading, hidden at every width, read-only, not to be chosen, or
    /// offering only its marked days.
    /// </summary>
    public static bool Closes(UIComponentGateKind kind, object? value)
        => kind switch
        {
            UIComponentGateKind.Enabled => value is false,
            UIComponentGateKind.Loading => value is true,
            UIComponentGateKind.ReadOnly => value is true,
            UIComponentGateKind.CanSelect => value is false,
            UIComponentGateKind.MarkedDaysOnly => value is true,
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
