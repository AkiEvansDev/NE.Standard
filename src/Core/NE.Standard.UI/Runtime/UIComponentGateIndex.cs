using System;
using System.Collections;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Items;
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
    CanDrag,
    CanRemove,
    CanRename,
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
/// A component's gates: its own and its ancestors' that close it whole, and its own for a write or the value written.
/// </summary>
internal sealed record UIComponentGates(UIComponentGate[] Chain, UIComponentGate? ReadOnly, UIValueChecks? Values);

/// <summary>A value a check reads: the compiled static one, or the controller's through <see cref="Bound"/>.</summary>
internal readonly record struct UIGateValue(object? Static, UIComponentGate? Bound);

/// <summary>
/// What an input's written value — and a period's end — is held to, in the value's own <see cref="ValueType"/>: its <c>Min</c> and
/// <c>Max</c>, a day input's marked days while <see cref="MarkedOnly"/> closes, a range slider's other end (<see cref="Ends"/>), a
/// slider's <see cref="Step"/> counted from its <c>Min</c>, and a text field's <see cref="MaxLength"/>. One unset, or bound to what the
/// server cannot read, holds nothing.
/// </summary>
internal sealed record UIValueChecks(Type ValueType, UIGateValue? Min, UIGateValue? Max, UIComponentGate? MarkedOnly, UIGateValue? MarkedDays, UIPeriodEnds? Ends, UIGateValue? Step, UIGateValue? MaxLength);

/// <summary>
/// A range slider's two ends as the controller holds them, and the least distance between them: a start written past the end, or an
/// end below the start, is refused. An end not bound to the controller holds the other to nothing.
/// </summary>
internal sealed record UIPeriodEnds(UIComponentGate? Start, UIComponentGate? End, UIGateValue? MinDistance);

/// <summary>Where a host's rows are read by key: the controller's collection, or the rows the author declared on the host.</summary>
internal sealed record UIRowItems(UIComponentGate? Bound, IEnumerable? Declared);

/// <summary>One ability a row may refuse: the kind its gate is, the template's key it reads and the item's own word for it.</summary>
internal sealed record UIRowAbility(UIComponentGateKind Kind, UIProperty Property, Func<IItemAbilitiesModel, bool?> Read)
{
    /// <summary>Every ability a row may refuse, each once: the table the template's gates, the item's words and the lookups read.</summary>
    public static readonly UIRowAbility[] All =
    [
        new(UIComponentGateKind.CanSelect, IItemAbilitiesComponent.CanSelectProperty, static item => item.CanSelect),
        new(UIComponentGateKind.CanDrag, IItemAbilitiesComponent.CanDragProperty, static item => item.CanDrag),
        new(UIComponentGateKind.CanRemove, IItemAbilitiesComponent.CanRemoveProperty, static item => item.CanRemove),
        new(UIComponentGateKind.CanRename, IItemAbilitiesComponent.CanRenameProperty, static item => item.CanRename)
    ];

    /// <summary>The ability's place in <see cref="All"/>; -1 for a kind that is no row's ability.</summary>
    public static int IndexOf(UIComponentGateKind kind)
    {
        for (var i = 0; i < All.Length; i++)
        {
            if (All[i].Kind == kind)
                return i;
        }

        return -1;
    }
}

/// <summary>
/// What a row lets the reader do, as the server can read it: its template's gate for each of <see cref="UIRowAbility.All"/>, by place
/// (none where the template closes nothing), and where its own item — an <c>IItemAbilitiesModel</c> — is read by the row's key, the
/// last of <see cref="RowParameterCount"/> keys.
/// </summary>
internal sealed record UIRowAbilities(int RowParameterCount, UIComponentGate?[] Gates, UIRowItems? Items)
{
    public UIComponentGate? For(UIComponentGateKind ability)
    {
        var index = UIRowAbility.IndexOf(ability);

        return index >= 0 && index < Gates.Length ? Gates[index] : null;
    }

    /// <summary>What the row's own item says to <paramref name="ability"/>; null where it says nothing.</summary>
    public static bool? Read(IItemAbilitiesModel item, UIComponentGateKind ability)
    {
        var index = UIRowAbility.IndexOf(ability);

        return index >= 0 ? UIRowAbility.All[index].Read(item) : null;
    }
}

/// <summary>An items host's rows: the template root every row is drawn from, where every row wears one, and what a row allows.</summary>
internal readonly record struct UIRowGates(UIComponentId? TemplateRootId, UIRowAbilities Abilities);

/// <summary>
/// The server's half of what closes a component — <c>Enabled</c>, <c>Loading</c> and <c>Visibility</c> up the ancestors,
/// <c>IsReadOnly</c> of its own, an input's <c>Min</c>/<c>Max</c>, a day input's <c>MarkedDaysOnly</c> and a text field's
/// <c>MaxLength</c> for the value written, and a row's abilities — built once per compiled view.
/// </summary>
/// <remarks>
/// Only what the server can know goes in: a static value, or a binding to the controller. An interaction's state
/// (<c>EnabledWhen</c>, <c>ShownWhen</c>) lives on the client alone. A component nothing closes has no entry, so a view that
/// closes nothing and draws no rows costs one count read per command or value.
/// </remarks>
internal sealed class UIComponentGateIndex
{
    private static readonly ConditionalWeakTable<CompiledView, UIComponentGateIndex> Indexes = [];

    // By name, as the bounds are: a slider's own key, which no contract declares, equals it.
    private static readonly UIProperty StepProperty = new("Step");

    private readonly FrozenDictionary<UIComponentId, UIComponentGates> _components;
    private readonly FrozenDictionary<UIComponentId, UIRowGates> _rows;
    private readonly FrozenDictionary<UIComponentId, UIRowAbilities> _rowRoots;

    private UIComponentGateIndex(CompiledView view)
    {
        Dictionary<UIComponentId, UIComponentGate[]> chains = [];
        Dictionary<UIComponentId, UIComponentGates> components = [];
        Dictionary<UIComponentId, UIRowGates> rows = [];
        Dictionary<UIComponentId, UIRowAbilities> rowRoots = [];

        foreach (UIComponentNode node in view.Graph.All)
        {
            UIComponentGate[] chain = GetChain(view, node, chains);
            UIComponentGate? readOnly = CreateGate(view, node.ComponentId, IInputComponent.IsReadOnlyProperty, UIComponentGateKind.ReadOnly);
            UIValueChecks? values = CreateValueChecks(view, node.ComponentId);

            if (chain.Length > 0 || readOnly is not null || values is not null)
                components.Add(node.ComponentId, new UIComponentGates(chain, readOnly, values));
        }

        foreach (UIComponentNode node in view.Graph.All)
        {
            if (CreateRowGates(view, node, rowRoots) is UIRowGates hostRows)
                rows.Add(node.ComponentId, hostRows);
        }

        _components = components.ToFrozenDictionary();
        _rows = rows.ToFrozenDictionary();
        _rowRoots = rowRoots.ToFrozenDictionary();
    }

    /// <summary>The index of a compiled view, built on first use and shared by every runtime of the view.</summary>
    public static UIComponentGateIndex For(CompiledView view)
        => Indexes.GetValue(view, static view => new UIComponentGateIndex(view));

    /// <summary>Whether nothing in the view can close a component or refuse a row, so a check has nothing to read.</summary>
    public bool IsEmpty => _components.Count == 0 && _rows.Count == 0 && _rowRoots.Count == 0;

    public bool TryGet(UIComponentId componentId, out UIComponentGates? gates)
        => _components.TryGetValue(componentId, out gates);

    public bool TryGetRows(UIComponentId hostId, out UIRowGates rows)
        => _rows.TryGetValue(hostId, out rows);

    /// <summary>The abilities of the row a template root draws, for the root itself: a row's move, removal and rename are raised on it.</summary>
    public bool TryGetRowRoot(UIComponentId rootId, out UIRowAbilities? abilities)
        => _rowRoots.TryGetValue(rootId, out abilities);

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
        => view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, property), out CompiledUIBinding? binding) ? CreateBoundGate(view, binding, kind) : null;

    private static UIComponentGate? CreateBoundGate(CompiledView view, CompiledUIBinding binding, UIComponentGateKind kind)
    {
        if (!view.Sources.TryGet(binding.SourceId, out CompiledUIBindingSource? source) || source.Kind != CompiledUIBindingSourceKind.Controller)
            return null;

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
        UIPeriodEnds? ends = CreatePeriodEnds(view, componentId, valueType);
        UIGateValue? step = CreateStep(view, componentId, valueType);
        UIGateValue? maxLength = CreateGateValue(view, componentId, ITextLengthComponent.MaxLengthProperty, typeof(int), unset: null);

        return min is null && max is null && markedDays is null && ends is null && step is null && maxLength is null
            ? null
            : new UIValueChecks(valueType, min, max, markedOnly, markedDays, ends, step, maxLength);
    }

    /// <summary>
    /// The step a slider's value — one handle or two — lands on, counted from <c>Min</c>; only an input offering a least distance
    /// (the slider family), since a number input's step is a hint the reader may type past.
    /// </summary>
    private static UIGateValue? CreateStep(CompiledView view, UIComponentId componentId, Type valueType)
        => view.State.TryGetValue(componentId, IPeriodInputComponent.MinDistanceProperty, out _)
            ? CreateGateValue(view, componentId, StepProperty, valueType, unset: null)
            : null;

    /// <summary>
    /// A range's two ends, where the input offers a least distance between them (a slider under <c>IsRange</c>), whose ends move one
    /// at a time; a temporal period has none, since choosing one writes its ends in either order.
    /// </summary>
    private static UIPeriodEnds? CreatePeriodEnds(CompiledView view, UIComponentId componentId, Type valueType)
    {
        if (!view.State.TryGetValue(componentId, IPeriodInputComponent.MinDistanceProperty, out _)
            || !view.State.TryGetValue(componentId, IPeriodInputComponent.IsRangeProperty, out CompiledUIPropertyValue? isRange)
            || isRange.IsBind
            || isRange.Value is not true)
        {
            return null;
        }

        UIComponentGate? start = CreateBoundGate(view, componentId, IInputComponent.ValueProperty, UIComponentGateKind.Read);
        UIComponentGate? end = CreateBoundGate(view, componentId, IPeriodInputComponent.EndValueProperty, UIComponentGateKind.Read);

        return start is null && end is null ? null : new UIPeriodEnds(start, end, CreateGateValue(view, componentId, IPeriodInputComponent.MinDistanceProperty, valueType, unset: null));
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
    /// An items host's rows, or none for a component drawing no rows; each template root a row stands in is entered in
    /// <paramref name="rowRoots"/>. A row's abilities are its fixed template's — the one template, or a composite's <c>row</c> — for
    /// every template it stands in; where rows wear a template by the item's kind, each template holds its own.
    /// </summary>
    private static UIRowGates? CreateRowGates(CompiledView view, UIComponentNode host, Dictionary<UIComponentId, UIRowAbilities> rowRoots)
    {
        List<UIComponentNode>? roots = null;
        var variants = false;

        foreach (UIComponentSlot slot in host.Slots)
        {
            if (slot.Kind is not (UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant))
                continue;

            UIComponentNode root = view.Graph.GetRequired(slot.RootComponentId);

            if (root.ContextParameterCount <= host.ContextParameterCount)
                continue;

            (roots ??= []).Add(root);
            variants |= slot.Kind == UIComponentSlotKind.TemplateVariant;
        }

        if (roots is null)
            return null;

        UIComponentNode? fixedRoot = view.Graph.TryGetSlot(host.ComponentId, UIComponentSlotKind.TemplateVariant, out UIComponentSlot? row, TemplateNames.Row)
            ? view.Graph.GetRequired(row.RootComponentId)
            : variants ? null : roots[0];

        UIRowItems? items = CreateRowItems(view, host.ComponentId);
        UIRowAbilities? fixedAbilities = fixedRoot is null ? null : CreateRowAbilities(view, fixedRoot, items);

        foreach (UIComponentNode root in roots)
        {
            UIRowAbilities? abilities = fixedAbilities is null
                ? CreateRowAbilities(view, root, items)
                : fixedAbilities with { RowParameterCount = root.ContextParameterCount };

            if (abilities is not null)
                rowRoots[root.ComponentId] = abilities;
        }

        if (fixedRoot is null && items is null)
            return null;

        return new UIRowGates(fixedRoot?.ComponentId, fixedAbilities ?? new UIRowAbilities((fixedRoot ?? roots[0]).ContextParameterCount, [], items));
    }

    /// <summary>What a row drawn from <paramref name="root"/> allows; none where neither its template nor its item can refuse anything.</summary>
    private static UIRowAbilities? CreateRowAbilities(CompiledView view, UIComponentNode root, UIRowItems? items)
    {
        UIComponentGate?[] gates = new UIComponentGate?[UIRowAbility.All.Length];
        var closesAny = false;

        for (var i = 0; i < gates.Length; i++)
        {
            gates[i] = CreateGate(view, root.ComponentId, UIRowAbility.All[i].Property, UIRowAbility.All[i].Kind);
            closesAny |= gates[i] is not null;
        }

        return !closesAny && items is null ? null : new UIRowAbilities(root.ContextParameterCount, gates, items);
    }

    /// <summary>
    /// Where a host's rows are read by key: its collection bound to the controller, or the rows declared on it; none for a windowed
    /// source, of whose rows the server holds only a window, nor for a collection bound to anything else.
    /// </summary>
    private static UIRowItems? CreateRowItems(CompiledView view, UIComponentId hostId)
    {
        if (view.State.TryGetValue(hostId, IItemsHostComponent.HostModeProperty, out CompiledUIPropertyValue? mode) && mode.Value is UIItemsHostMode.Windowed)
            return null;

        if (view.Bindings.TryGetCollection(hostId, out CompiledUIBinding? binding))
            return CreateBoundGate(view, binding, UIComponentGateKind.Read) is UIComponentGate bound ? new UIRowItems(bound, Declared: null) : null;

        return view.State.TryGetValue(hostId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? items) && !items.IsBind && items.Value is IEnumerable declared
            ? new UIRowItems(Bound: null, declared)
            : null;
    }

    /// <summary>
    /// Whether a property's value closes the component: disabled, loading, hidden at every width, read-only, not to be chosen,
    /// dragged, removed or renamed, or offering only its marked days.
    /// </summary>
    public static bool Closes(UIComponentGateKind kind, object? value)
        => kind switch
        {
            UIComponentGateKind.Enabled => value is false,
            UIComponentGateKind.Loading => value is true,
            UIComponentGateKind.ReadOnly => value is true,
            UIComponentGateKind.CanSelect or UIComponentGateKind.CanDrag or UIComponentGateKind.CanRemove or UIComponentGateKind.CanRename => value is false,
            UIComponentGateKind.MarkedDaysOnly => value is true,
            UIComponentGateKind.Visibility => IsHiddenEverywhere(value),
            _ => false
        };

    /// <summary>Hidden at one width and shown at another is the client's to know; only hidden at every width closes.</summary>
    private static bool IsHiddenEverywhere(object? value)
        => value switch
        {
            UIVisibility visibility => visibility != UIVisibility.Visible,
            UIResponsive<UIVisibility> responsive => IsHiddenAtEveryTier(responsive),
            _ => false
        };

    private static bool IsHiddenAtEveryTier(UIResponsive<UIVisibility> responsive)
    {
        for (UIResponsiveTier tier = UIResponsiveTier.Base; tier <= UIResponsiveTier.Xxl; tier++)
        {
            if (responsive.Get(tier) == UIVisibility.Visible)
                return false;
        }

        return true;
    }
}
