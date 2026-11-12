using System;
using System.Collections;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compilation;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;
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
    AllowNegative,
    AllowDecimals,
    ShowOpacity,
    ShowPalette,
    HostDraggable,
    HostRenamable,
    TabPin,
    ShowClearButton,

    /// <summary>Not a closing value: one a check reads through the gate's binding — an input's bound, its marked days.</summary>
    Read
}

/// <summary>
/// One property the server can read that closes a component to the reader: a static value that already closes it
/// (<see cref="Binding"/> null), or a controller binding read when a command or a value arrives.
/// </summary>
/// <remarks>
/// <see cref="FixedPath"/> is the bound path where the binding takes no row keys, the same for every read;
/// <see cref="DynamicCount"/> is how many of the target's row keys, outermost first, the binding reads. <see cref="Declared"/> holds the
/// rows declared on a host where the binding reads one of them (a <c>ComponentItems</c> source) rather than the controller.
/// </remarks>
internal sealed record UIComponentGate(UIComponentGateKind Kind, CompiledUIBinding? Binding, RecursivePath? FixedPath, int DynamicCount, IEnumerable? Declared = null);

/// <summary>
/// What a standalone text component's own inline rename answers to: its <c>Renamable</c> switch, any interaction running
/// <see cref="RenameItemEffect"/> directly on the text component, and which commit steps (<c>RenamedTitle</c> write and/or <c>rename</c>
/// command) it carries.
/// </summary>
internal sealed record UITextRenameGate(UIComponentId ComponentId, UIComponentGate? Renamable, bool HasUnscopedInteraction, FrozenSet<UIComponentAddress>? ScopedInteractions, byte Steps);

/// <summary>
/// A component's gates: its own and its ancestors' that close it whole, its own for a write or the value written, the check it
/// holds the page's writes to its own properties to (<see cref="IClientWriteCheckComponent"/>), and a standalone text's own rename gate.
/// </summary>
internal sealed record UIComponentGates(UIComponentGate[] Chain, UIComponentGate? ReadOnly, UIValueChecks? Values, UIClientWriteCheck? WriteCheck, UITextRenameGate? TextRename = null);

/// <summary>A value a check reads: the compiled static one, or the controller's through <see cref="Bound"/>.</summary>
internal readonly record struct UIGateValue(object? Static, UIComponentGate? Bound);

/// <summary>
/// What an input's written value — and a period's end — is held to, in the value's own <see cref="ValueType"/>: its <c>Min</c> and
/// <c>Max</c>, a day input's marked days while <see cref="MarkedOnly"/> closes, a period's other end (<see cref="Ends"/>), a
/// slider's <see cref="Step"/> counted from its <c>Min</c>, a text field's <see cref="MaxLength"/>, a multi-select's
/// <see cref="MaxSelected"/> distinct keys, and a number's sign and fraction while <see cref="AllowNegative"/> or
/// <see cref="AllowDecimals"/> closes. One unset, or bound to what the server cannot read, holds nothing.
/// </summary>
internal sealed record UIValueChecks(Type ValueType, UIGateValue? Min, UIGateValue? Max, UIComponentGate? MarkedOnly, UIGateValue? MarkedDays, UIPeriodEnds? Ends, UIGateValue? Step, UIGateValue? MaxLength, UIGateValue? MaxSelected, UIComponentGate? AllowNegative, UIComponentGate? AllowDecimals, UIComponentGate? ShowOpacity = null, UIComponentGate? ShowPalette = null, UIGateValue? IsRange = null);

/// <summary>
/// A period's two ends as the controller holds them, and the least distance between them — a number for a slider, a
/// <see cref="TimeSpan"/> for a temporal input or a calendar: a start written past the end, or an end below the start, is refused, and
/// so is one nearer the other than the distance. An end not bound to the controller holds the other to nothing.
/// </summary>
internal sealed record UIPeriodEnds(UIComponentGate? Start, UIComponentGate? End, UIGateValue? MinDistance);

/// <summary>Where a host's rows are read by key: the controller's collection, or the rows the author declared on the host.</summary>
internal sealed record UIRowItems(UIComponentGate? Bound, IEnumerable? Declared);

/// <summary>
/// What an items host itself switches off for every row (<c>Draggable</c>, <c>Removable</c>, <c>Renamable</c>), and what reopens a
/// closed <c>Renamable</c> — a tab strip's bound <c>TabMenuEntries</c> offering <see cref="UITabMenuEntries.Rename"/>, or an interaction
/// running <see cref="RenameItemEffect"/> on one of the host's items.
/// </summary>
internal sealed record UIHostRowGates(UIComponentId HostId, UIComponentGate? Draggable, UIComponentGate? Removable, UIComponentGate? Renamable, UIComponentGate? TabMenuEntries, FrozenSet<string>? InteractionKeys, FrozenSet<(UIComponentAddress Host, string Key)>? ScopedInteractionKeys, UIComponentGate? TabPin = null);

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
/// What a row lets the reader do, as the server can read it: its host's switches, its template's gate for each of
/// <see cref="UIRowAbility.All"/>, by place (none where the template closes nothing), and where its own item — an
/// <c>IItemAbilitiesModel</c> — is read by the row's key, the last of <see cref="RowParameterCount"/> keys.
/// </summary>
internal sealed record UIRowAbilities(int RowParameterCount, UIComponentGate?[] Gates, UIRowItems? Items, UIHostRowGates? Host = null, byte RenameSteps = 0)
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

/// <summary>
/// A row template a host picks by the row's own item (<c>TemplateKeyProperty</c> or a composite slot's <c>KeyProperty</c>): the variant it
/// stands for, none for the default template, read off the row's item by its key where the host's rows are read. In a menu, a disabled or
/// hidden entry is closed, an entry opening sub-entries is no plain entry, and a submenu slot requires an open parent entry holding sub-entries.
/// </summary>
internal sealed record UIRowVariant(UIComponentId HostId, string KeyProperty, string? FallbackKey, string? VariantKey, int RowParameterCount, UIRowItems Items, bool OpensSubmenus, string? CompositeBaseKey = null, bool IsMenu = false, bool IsSubmenuSlot = false);

/// <summary>
/// An items host's rows: the template root every row is drawn from, where every row wears one, and what a row allows; for an input
/// drawing its options, that its <c>Value</c> is a choice of rows, whether it picks one option and offers a clear button, and whether the
/// reader may type keys no option holds; for a selectable host, the <see cref="SelectionMode"/> that decides which selection property is open.
/// </summary>
internal readonly record struct UIRowGates(UIComponentId? TemplateRootId, UIRowAbilities Abilities, bool ChoosesByValue, bool TakesFreeText, bool IsSingleValueInput = false, UIComponentGate? ClearGate = null, UIGateValue? SelectionMode = null);

/// <summary>
/// The server's half of what closes a component — <c>Enabled</c>, <c>Loading</c> and <c>Visibility</c> up the ancestors,
/// <c>IsReadOnly</c> of its own, an input's <c>Min</c>/<c>Max</c>, a day input's <c>MarkedDaysOnly</c>, a text field's
/// <c>MaxLength</c>, a multi-select's <c>MaxSelected</c> and a number's <c>AllowNegative</c>/<c>AllowDecimals</c> for the value
/// written, a component's own check of the writes to its properties, and a row's abilities — built once per compiled view.
/// </summary>
/// <remarks>
/// Only what the server can know goes in: a static value, or a binding to the controller. An interaction's state
/// (<c>EnabledWhen</c>, <c>ShownWhen</c>, a panel revealed on hover) lives on the client alone, so a property an interaction writes is
/// no static gate: its authored value is only where the page starts. A component nothing closes has no entry, so a view that closes
/// nothing and draws no rows costs one count read per command or value.
/// </remarks>
internal sealed class UIComponentGateIndex
{
    private static readonly ConditionalWeakTable<CompiledView, UIComponentGateIndex> Indexes = [];

    // By name, as the bounds are: a slider's own key, which no contract declares, equals it.
    private static readonly UIProperty StepProperty = new("Step");

    /// <summary>The step a range input with no <c>step</c> lands on in the browser, which the gate holds a slider to as well.</summary>
    public const decimal DefaultSliderStep = 1m;

    public const byte RenameWriteStep = 1;
    public const byte RenameCommandStep = 2;

    private readonly FrozenDictionary<UIComponentId, UIComponentGates> _components;
    private readonly FrozenDictionary<UIComponentId, UIRowGates> _rows;
    private readonly FrozenDictionary<UIComponentId, UIRowAbilities> _rowRoots;
    private readonly FrozenDictionary<UIComponentId, UIRowVariant> _rowVariants;

    private UIComponentGateIndex(CompiledView view)
    {
        Dictionary<UIComponentId, UIComponentGate[]> chains = [];
        Dictionary<UIComponentId, UIComponentGates> components = [];
        Dictionary<UIComponentId, UIRowGates> rows = [];
        Dictionary<UIComponentId, UIRowAbilities> rowRoots = [];
        Dictionary<UIComponentId, UIRowVariant> rowVariants = [];

        foreach (UIComponentNode node in view.Graph.All)
        {
            if (CreateRowGates(view, node, rowRoots, rowVariants) is UIRowGates hostRows)
                rows.Add(node.ComponentId, hostRows);
        }

        foreach (UIComponentNode node in view.Graph.All)
        {
            UIComponentGate[] chain = GetChain(view, node, chains);
            UIComponentGate? readOnly = CreateGate(view, node.ComponentId, IInputComponent.IsReadOnlyProperty, UIComponentGateKind.ReadOnly);
            UIValueChecks? values = CreateValueChecks(view, node.ComponentId);
            UIClientWriteCheck? writeCheck = ReadWriteCheck(view, node.ComponentId);
            UITextRenameGate? textRename = CreateTextRenameGate(view, node, rowRoots);

            if (chain.Length > 0 || readOnly is not null || values is not null || writeCheck is not null || textRename is not null)
                components.Add(node.ComponentId, new UIComponentGates(chain, readOnly, values, writeCheck, textRename));
        }

        _components = components.ToFrozenDictionary();
        _rows = rows.ToFrozenDictionary();
        _rowRoots = rowRoots.ToFrozenDictionary();
        _rowVariants = rowVariants.ToFrozenDictionary();
    }

    /// <summary>The index of a compiled view, built on first use and shared by every runtime of the view.</summary>
    public static UIComponentGateIndex For(CompiledView view)
        => Indexes.GetValue(view, static view => new UIComponentGateIndex(view));

    /// <summary>Whether nothing in the view can close a component or refuse a row, so a check has nothing to read.</summary>
    public bool IsEmpty => _components.Count == 0 && _rows.Count == 0 && _rowRoots.Count == 0 && _rowVariants.Count == 0;

    public bool TryGet(UIComponentId componentId, out UIComponentGates? gates)
        => _components.TryGetValue(componentId, out gates);

    public bool TryGetRows(UIComponentId hostId, out UIRowGates rows)
        => _rows.TryGetValue(hostId, out rows);

    /// <summary>The abilities of the row a template root draws, for the root itself: a row's move, removal and rename are raised on it.</summary>
    public bool TryGetRowRoot(UIComponentId rootId, out UIRowAbilities? abilities)
        => _rowRoots.TryGetValue(rootId, out abilities);

    /// <summary>The variant a template root stands for, where its host picks a row's template by the row's item.</summary>
    public bool TryGetRowVariant(UIComponentId rootId, out UIRowVariant? variant)
        => _rowVariants.TryGetValue(rootId, out variant);

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
            return Closes(kind, value.Value) && !IsInteractionTarget(view, componentId, property) ? new UIComponentGate(kind, Binding: null, FixedPath: null, DynamicCount: 0) : null;

        return CreateBoundGate(view, componentId, property, kind);
    }

    /// <summary>
    /// Whether an interaction writes the property: the page may open what the author closed (a panel shown on hover, a field enabled by a
    /// switch), which the server never hears, so the authored value holds nothing it could refuse by.
    /// </summary>
    public static bool IsInteractionTarget(CompiledView view, UIComponentId componentId, UIProperty property)
        => view.Interactions.GetByTarget(new UIPropertyAddress(componentId, property)).Count > 0;

    /// <summary>
    /// The gate a property bound to the controller, or to a row the author declared on a host, makes; none for a binding to anything
    /// else, which the server cannot read.
    /// </summary>
    private static UIComponentGate? CreateBoundGate(CompiledView view, UIComponentId componentId, UIProperty property, UIComponentGateKind kind)
        => view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, property), out CompiledUIBinding? binding) ? CreateBoundGate(view, binding, kind) : null;

    private static UIComponentGate? CreateBoundGate(CompiledView view, CompiledUIBinding binding, UIComponentGateKind kind)
    {
        if (!view.Sources.TryGet(binding.SourceId, out CompiledUIBindingSource? source))
            return null;

        // A declared row is read off its host's rows by its key, as a command's argument reads one.
        IEnumerable? declared = null;

        if (source.Kind == CompiledUIBindingSourceKind.ComponentItems)
        {
            if (source.ComponentId is not UIComponentId hostId || DeclaredRows(view, hostId) is not { } rows)
                return null;

            declared = rows;
        }
        else if (source.Kind != CompiledUIBindingSourceKind.Controller)
        {
            return null;
        }

        var dynamicCount = CompiledUIBindingParameterResolver.CountDynamic(binding.Parameters);
        RecursivePath? fixedPath = dynamicCount == 0 ? view.Bindings.Resolve(binding, []).Path : null;

        return new UIComponentGate(kind, binding, fixedPath, dynamicCount, declared);
    }

    /// <summary>The rows the author declared on a host, its static <c>Items</c>; none where they are bound.</summary>
    private static IEnumerable? DeclaredRows(CompiledView view, UIComponentId hostId)
        => view.State.TryGetValue(hostId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? items) && !items.IsBind && items.Value is IEnumerable declared
            ? declared
            : null;

    /// <summary>
    /// What an input's written value is held to, or none: an input with no bound set that offers every day costs a write nothing. A
    /// slider's unset bound is the one the page draws, as its authoring check reads it; a day input's unset marked days offer no day.
    /// </summary>
    private static UIValueChecks? CreateValueChecks(CompiledView view, UIComponentId componentId)
    {
        // Only an input the page writes a value to: a progress bar's bounds hold nothing, nor does a value no binding takes.
        if (!view.State.TryGetValue(componentId, IInputComponent.IsReadOnlyProperty, out _) || WrittenValueType(view, componentId) is not Type valueType)
            return null;

        var isSlider = valueType == typeof(decimal) && view.State.TryGetValue(componentId, IPeriodInputComponent.MinDistanceProperty, out _);
        UIGateValue? min = CreateGateValue(view, componentId, IBoundedInputComponent.MinProperty, valueType, unset: isSlider ? IOrderedRangeComponent.DefaultMin : null);
        UIGateValue? max = CreateGateValue(view, componentId, IBoundedInputComponent.MaxProperty, valueType, unset: isSlider ? IOrderedRangeComponent.DefaultMax : null);
        UIComponentGate? markedOnly = CreateGate(view, componentId, IMarkedDaysComponent.MarkedDaysOnlyProperty, UIComponentGateKind.MarkedDaysOnly);
        UIGateValue? markedDays = markedOnly is null ? null : CreateGateValue(view, componentId, IMarkedDaysComponent.MarkedDaysProperty, valueType: null, unset: Array.Empty<DateOnly>());
        UIPeriodEnds? ends = CreatePeriodEnds(view, componentId, valueType);
        UIGateValue? isRange = view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, IPeriodInputComponent.EndValueProperty), out _) || ends is not null
            ? CreateGateValue(view, componentId, IPeriodInputComponent.IsRangeProperty, typeof(bool), unset: false)
            : null;

        if (isRange is { Bound: null, Static: true })
            isRange = null;

        UIGateValue? step = CreateStep(view, componentId, valueType);
        UIGateValue? maxLength = CreateGateValue(view, componentId, ITextLengthComponent.MaxLengthProperty, typeof(int), unset: null);
        UIGateValue? maxSelected = CreateGateValue(view, componentId, MultiSelectComponent.MaxSelectedProperty, typeof(int), unset: null);
        UIComponentGate? allowNegative = CreateGate(view, componentId, NumberInputComponent.AllowNegativeProperty, UIComponentGateKind.AllowNegative);
        UIComponentGate? allowDecimals = CreateGate(view, componentId, NumberInputComponent.AllowDecimalsProperty, UIComponentGateKind.AllowDecimals);
        UIComponentGate? showOpacity = CreateGate(view, componentId, ColorInputComponent.ShowOpacityProperty, UIComponentGateKind.ShowOpacity);
        UIComponentGate? showPalette = CreateGate(view, componentId, ColorInputComponent.ShowPaletteProperty, UIComponentGateKind.ShowPalette);

        return min is null && max is null && markedDays is null && ends is null && isRange is null && step is null && maxLength is null && maxSelected is null && allowNegative is null && allowDecimals is null && showOpacity is null && showPalette is null
            ? null
            : new UIValueChecks(valueType, min, max, markedOnly, markedDays, ends, step, maxLength, maxSelected, allowNegative, allowDecimals, showOpacity, showPalette, isRange);
    }

    /// <summary>
    /// The step a slider's value — one handle or two — lands on, counted from <c>Min</c>; only a number offering a least distance
    /// (the slider family), since a number input's step is a hint the reader may type past. Unset, it is the 1 the browser steps by
    /// (<see cref="DefaultSliderStep"/>).
    /// </summary>
    private static UIGateValue? CreateStep(CompiledView view, UIComponentId componentId, Type valueType)
    {
        if (valueType != typeof(decimal) || !view.State.TryGetValue(componentId, IPeriodInputComponent.MinDistanceProperty, out _))
            return null;

        return view.State.TryGetValue(componentId, StepProperty, out _)
            ? CreateGateValue(view, componentId, StepProperty, valueType, unset: DefaultSliderStep)
            : new UIGateValue(DefaultSliderStep, Bound: null);
    }

    /// <summary>
    /// A period's two ends, where the input offers a least distance between them (a slider, a temporal input or a calendar under
    /// <c>IsRange</c>). A slider's are held in order with no distance set, as its handles move one at a time; a temporal period's only
    /// where a distance is set, since without one its page swaps ends typed the wrong way round, writing them in either order.
    /// </summary>
    private static UIPeriodEnds? CreatePeriodEnds(CompiledView view, UIComponentId componentId, Type valueType)
    {
        if (!view.State.TryGetValue(componentId, IPeriodInputComponent.MinDistanceProperty, out _)
            || !view.State.TryGetValue(componentId, IPeriodInputComponent.IsRangeProperty, out CompiledUIPropertyValue? isRange)
            || (!isRange.IsBind && isRange.Value is not true))
        {
            return null;
        }

        var number = valueType == typeof(decimal);
        UIGateValue? distance = CreateGateValue(view, componentId, IPeriodInputComponent.MinDistanceProperty, number ? valueType : typeof(TimeSpan), unset: null);

        if (distance is null && !number)
            return null;

        UIComponentGate? start = CreateBoundGate(view, componentId, IInputComponent.ValueProperty, UIComponentGateKind.Read);
        UIComponentGate? end = CreateBoundGate(view, componentId, IPeriodInputComponent.EndValueProperty, UIComponentGateKind.Read);

        return start is null && end is null ? null : new UIPeriodEnds(start, end, distance);
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
            if ((value.Value ?? unset) is not { } read || IsInteractionTarget(view, componentId, property))
                return null;

            if (valueType is null)
                return new UIGateValue(read, Bound: null);

            return RecursiveValueCoercion.TryCoerce(read, valueType, out var typed) && typed is not null ? new UIGateValue(typed, Bound: null) : null;
        }

        UIComponentGate? bound = CreateBoundGate(view, componentId, property, UIComponentGateKind.Read);

        if (bound is null)
            return null;

        var fallback = unset;

        if (fallback is not null && valueType is not null && (!RecursiveValueCoercion.TryCoerce(fallback, valueType, out fallback) || fallback is null))
            fallback = null;

        return new UIGateValue(fallback, bound);
    }

    /// <summary>The check a component holds the page's writes to its own properties to; none for one that holds them to nothing.</summary>
    private static UIClientWriteCheck? ReadWriteCheck(CompiledView view, UIComponentId componentId)
        => view.State.TryGetValue(componentId, IClientWriteCheckComponent.ClientWriteCheckProperty, out CompiledUIPropertyValue? value) && value is { IsBind: false, Value: UIClientWriteCheck check }
            ? check
            : null;

    /// <summary>
    /// A standalone text component's own inline-rename gate; none when it neither binds <see cref="IRenamableComponent.RenamedTitle"/>
    /// nor raises <c>rename</c>, when it is the template root of an <c>IItemRenameComponent</c> host (whose own <c>Renamable</c> gates
    /// it), or when its <c>Renamable</c> is statically open.
    /// </summary>
    private static UITextRenameGate? CreateTextRenameGate(CompiledView view, UIComponentNode node, Dictionary<UIComponentId, UIRowAbilities> rowRoots)
    {
        if (!UIEffectTargets.TakesInlineRename(node.TypeKey))
            return null;

        if (rowRoots.ContainsKey(node.ComponentId) && node.ParentId is UIComponentId hostId && view.State.TryGetValue(hostId, IItemsHostAbilitiesComponent.RenamableProperty, out _))
            return null;

        var steps = ReadRenameSteps(view, node.ComponentId);

        if (steps == 0)
            return null;

        UIComponentGate? renamable = CreateGate(view, node.ComponentId, IRenamableItemsComponent.RenamableProperty, UIComponentGateKind.HostRenamable);

        if (renamable is null)
            return null;

        var hasUnscopedInteraction = false;
        HashSet<UIComponentAddress>? scopedInteractions = null;
        IReadOnlyList<CompiledUIInteraction> interactions = view.Interactions.All;

        for (var i = 0; i < interactions.Count; i++)
        {
            if (interactions[i].Effect is not RenameItemEffect { ResolvedTarget: { } target } rename
                || target.Id != node.ComponentId
                || rename.Key is { Length: > 0 })
            {
                continue;
            }

            if (target.DynamicParameters.Length == 0)
                hasUnscopedInteraction = true;
            else
                _ = (scopedInteractions ??= []).Add(target);
        }

        return new UITextRenameGate(node.ComponentId, renamable, hasUnscopedInteraction, scopedInteractions?.ToFrozenSet(), steps);
    }

    private static byte ReadRenameSteps(CompiledView view, UIComponentId componentId)
    {
        byte steps = 0;

        if (view.Bindings.TryGetProperty(new UIPropertyAddress(componentId, IRenamableComponent.RenamedTitleProperty), out CompiledUIBinding? binding)
            && binding.Mode is UIBindingMode.TwoWay or UIBindingMode.OneWayToSource or UIBindingMode.OnSubmit)
        {
            steps |= RenameWriteStep;
        }

        if (view.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Rename), out _))
            steps |= RenameCommandStep;

        return steps;
    }

    /// <summary>
    /// An items host's rows, or none for a component drawing no rows; each template root a row stands in is entered in
    /// <paramref name="rowRoots"/>, and in <paramref name="rowVariants"/> where the host picks it by the row's item. A row's abilities are its fixed template's — the one template, or a composite's <c>row</c> — for
    /// every template it stands in; where rows wear a template by the item's kind, each template holds its own.
    /// </summary>
    private static UIRowGates? CreateRowGates(CompiledView view, UIComponentNode host, Dictionary<UIComponentId, UIRowAbilities> rowRoots, Dictionary<UIComponentId, UIRowVariant> rowVariants)
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
        UIHostRowGates? hostGates = CreateHostRowGates(view, host.ComponentId);
        var fixedRenameSteps = fixedRoot is null ? (byte)0 : ReadRenameSteps(view, fixedRoot.ComponentId);
        UIRowAbilities? fixedAbilities = fixedRoot is null ? null : CreateRowAbilities(view, fixedRoot, items, hostGates, fixedRenameSteps);

        foreach (UIComponentNode root in roots)
        {
            var renameSteps = (byte)(fixedRenameSteps | ReadRenameSteps(view, root.ComponentId));
            UIRowAbilities? abilities = fixedAbilities is null
                ? CreateRowAbilities(view, root, items, hostGates, renameSteps)
                : fixedAbilities with { RowParameterCount = root.ContextParameterCount, RenameSteps = renameSteps };

            if (abilities is not null)
                rowRoots[root.ComponentId] = abilities;
        }

        if (items is not null)
            AddRowVariants(view, host, items, includeHostVariants: fixedRoot is null, rowVariants);

        // An input drawing rows draws its options: what it writes to its value is a choice of them.
        var choosesByValue = view.State.TryGetValue(host.ComponentId, IInputComponent.IsReadOnlyProperty, out _);
        var choosesByKey = view.State.TryGetValue(host.ComponentId, ISelectedKeyComponent.SelectedKeyProperty, out _);
        UIGateValue? selectionMode = CreateGateValue(view, host.ComponentId, ISelectableItemsComponent.SelectionModeProperty, typeof(UISelectionMode), unset: UISelectionMode.None);

        if (fixedRoot is null && items is null && hostGates is null && !choosesByValue && !choosesByKey && selectionMode is null)
            return null;

        var takesFreeText = view.State.TryGetValue(host.ComponentId, MultiSelectComponent.AllowFreeTextProperty, out CompiledUIPropertyValue? freeText) && freeText is { IsBind: false, Value: true };
        var isSingleValueInput = choosesByValue && !view.State.TryGetValue(host.ComponentId, MultiSelectComponent.MaxSelectedProperty, out _);
        UIComponentGate? clearGate = !isSingleValueInput
            ? null
            : view.State.TryGetValue(host.ComponentId, IClearableInputComponent.ShowClearButtonProperty, out _)
                ? CreateGate(view, host.ComponentId, IClearableInputComponent.ShowClearButtonProperty, UIComponentGateKind.ShowClearButton)
                : new UIComponentGate(UIComponentGateKind.ShowClearButton, Binding: null, FixedPath: null, DynamicCount: 0);

        return new UIRowGates(fixedRoot?.ComponentId, fixedAbilities ?? new UIRowAbilities((fixedRoot ?? roots[0]).ContextParameterCount, [], items, hostGates), choosesByValue, takesFreeText, isSingleValueInput, clearGate, selectionMode);
    }

    /// <summary>
    /// Where a host's rows are read by key: its collection bound to the controller or to a declared row, or the rows declared on it;
    /// none for a windowed source, of whose rows the server holds only a window, nor for a collection bound to anything else.
    /// </summary>
    private static UIRowItems? CreateRowItems(CompiledView view, UIComponentId hostId)
    {
        if (view.State.TryGetValue(hostId, IItemsHostComponent.HostModeProperty, out CompiledUIPropertyValue? mode) && mode.Value is UIItemsHostMode.Windowed)
            return null;

        if (view.Bindings.TryGetCollection(hostId, out CompiledUIBinding? binding))
            return CreateBoundGate(view, binding, UIComponentGateKind.Read) is UIComponentGate bound ? new UIRowItems(bound, Declared: null) : null;

        return DeclaredRows(view, hostId) is { } declared ? new UIRowItems(Bound: null, declared) : null;
    }

    /// <summary>
    /// What the host itself closes for every row (<c>Draggable</c>, <c>Removable</c>, <c>Renamable</c>); a tab menu offering
    /// <see cref="UITabMenuEntries.Rename"/> or an interaction running <see cref="RenameItemEffect"/> lifts <c>Renamable</c> where
    /// it reaches, while item-level <c>CanRename</c> still answers per row.
    /// </summary>
    private static UIHostRowGates? CreateHostRowGates(CompiledView view, UIComponentId hostId)
    {
        UIComponentGate? draggable = CreateGate(view, hostId, IDraggableItemsComponent.DraggableProperty, UIComponentGateKind.HostDraggable);
        UIComponentGate? removable = CreateGate(view, hostId, IItemsHostAbilitiesComponent.RemovableProperty, UIComponentGateKind.CanRemove);
        UIComponentGate? renamable = CreateGate(view, hostId, IItemsHostAbilitiesComponent.RenamableProperty, UIComponentGateKind.HostRenamable);
        UIComponentGate? tabPin = CreateGate(view, hostId, TabsViewComponent.TabMenuEntriesProperty, UIComponentGateKind.TabPin);
        UIComponentGate? tabMenuEntries = null;

        if (renamable is not null && view.State.TryGetValue(hostId, TabsViewComponent.TabMenuEntriesProperty, out CompiledUIPropertyValue? entriesValue))
        {
            if (!entriesValue.IsBind)
            {
                if (IsInteractionTarget(view, hostId, TabsViewComponent.TabMenuEntriesProperty)
                    || (entriesValue.Value is UITabMenuEntries staticEntries && staticEntries.HasFlag(UITabMenuEntries.Rename)))
                {
                    renamable = null;
                }
            }
            else if (CreateBoundGate(view, hostId, TabsViewComponent.TabMenuEntriesProperty, UIComponentGateKind.Read) is UIComponentGate boundEntries)
            {
                tabMenuEntries = boundEntries;
            }
            else
            {
                renamable = null;
            }
        }

        if (draggable is null && removable is null && renamable is null && tabPin is null)
            return null;

        HashSet<string>? interactionKeys = null;
        HashSet<(UIComponentAddress Host, string Key)>? scopedInteractionKeys = null;

        if (renamable is not null)
        {
            IReadOnlyList<CompiledUIInteraction> interactions = view.Interactions.All;

            for (var i = 0; i < interactions.Count; i++)
            {
                if (interactions[i].Effect is not RenameItemEffect { ResolvedTarget: { } target, Key: { Length: > 0 } key }
                    || target.Id != hostId)
                {
                    continue;
                }

                if (target.DynamicParameters.Length == 0)
                    _ = (interactionKeys ??= [with(StringComparer.Ordinal)]).Add(key);
                else
                    _ = (scopedInteractionKeys ??= []).Add((target, key));
            }
        }

        return new UIHostRowGates(hostId, draggable, removable, renamable, tabMenuEntries, interactionKeys?.ToFrozenSet(StringComparer.Ordinal), scopedInteractionKeys?.ToFrozenSet(), tabPin);
    }

    /// <summary>What a row drawn from <paramref name="root"/> allows; none where neither its host, its template nor its item can refuse anything.</summary>
    private static UIRowAbilities? CreateRowAbilities(CompiledView view, UIComponentNode root, UIRowItems? items, UIHostRowGates? hostGates, byte renameSteps)
    {
        UIComponentGate?[] gates = new UIComponentGate?[UIRowAbility.All.Length];
        var closesAny = false;

        for (var i = 0; i < gates.Length; i++)
        {
            gates[i] = CreateGate(view, root.ComponentId, UIRowAbility.All[i].Property, UIRowAbility.All[i].Kind);
            closesAny |= gates[i] is not null;
        }

        return !closesAny && items is null && hostGates is null ? null : new UIRowAbilities(root.ContextParameterCount, gates, items, hostGates, renameSteps);
    }

    /// <summary>
    /// Enters the template roots of a host picking a row's template by its item — either a composite slot's typed variants or the host's own
    /// <c>TemplateKeyProperty</c> variants — plus a menu's submenu slot so events inside nested submenus check their parent entry.
    /// </summary>
    private static void AddRowVariants(CompiledView view, UIComponentNode host, UIRowItems items, bool includeHostVariants, Dictionary<UIComponentId, UIRowVariant> rowVariants)
    {
        var keyProperty = includeHostVariants ? StaticText(view, host.ComponentId, ITemplatedComponent.TemplateKeyPropertyProperty) : null;
        var fallbackKey = keyProperty is null ? null : StaticText(view, host.ComponentId, ITemplatedComponent.FallbackTemplateKeyProperty);
        var isMenu = keyProperty is not null && view.State.TryGetValue(host.ComponentId, MenuComponent.NestedProperty, out _);
        var opensSubmenus = keyProperty is not null && view.Graph.TryGetSlot(host.ComponentId, UIComponentSlotKind.TemplateVariant, out _, MenuComponent.SubmenuTemplateKey);

        foreach (UIComponentSlot slot in host.Slots)
        {
            if (slot.Kind is not (UIComponentSlotKind.Template or UIComponentSlotKind.TemplateVariant))
                continue;

            UIComponentNode root = view.Graph.GetRequired(slot.RootComponentId);

            if (root.ContextParameterCount <= host.ContextParameterCount)
                continue;

            if (slot.Kind == UIComponentSlotKind.TemplateVariant && slot.KeyProperty is { Length: > 0 } slotKeyProperty && slot.Key is { Length: > 0 } slotKey)
            {
                var colon = slotKey.IndexOf(':', StringComparison.Ordinal);
                var baseKey = colon < 0 ? slotKey : slotKey[..colon];

                rowVariants[root.ComponentId] = new UIRowVariant(host.ComponentId, slotKeyProperty, FallbackKey: null, slotKey, root.ContextParameterCount, items, OpensSubmenus: false, CompositeBaseKey: baseKey);
                continue;
            }

            if (keyProperty is null)
                continue;

            if (slot.Key == MenuComponent.SubmenuTemplateKey)
            {
                if (isMenu)
                    rowVariants[root.ComponentId] = new UIRowVariant(host.ComponentId, keyProperty, fallbackKey, MenuComponent.SubmenuTemplateKey, root.ContextParameterCount, items, OpensSubmenus: true, IsMenu: true, IsSubmenuSlot: true);

                continue;
            }

            var variantKey = slot.Kind == UIComponentSlotKind.TemplateVariant ? slot.Key : null;

            rowVariants[root.ComponentId] = new UIRowVariant(host.ComponentId, keyProperty, fallbackKey, variantKey, root.ContextParameterCount, items, opensSubmenus, IsMenu: isMenu);
        }
    }

    /// <summary>A property's static, non-blank text; none where it is bound, unset or of no text.</summary>
    private static string? StaticText(CompiledView view, UIComponentId componentId, UIProperty property)
        => view.State.TryGetValue(componentId, property, out CompiledUIPropertyValue? value) && value is { IsBind: false, Value: string { Length: > 0 } text } && !string.IsNullOrWhiteSpace(text)
            ? text
            : null;

    /// <summary>
    /// Whether a property's value closes the component: disabled, loading, hidden at every width, read-only, not to be chosen,
    /// dragged, removed or renamed, offering only its marked days, taking no negative or fractional number, or offering no clear button.
    /// </summary>
    public static bool Closes(UIComponentGateKind kind, object? value)
        => kind switch
        {
            UIComponentGateKind.Enabled => value is false,
            UIComponentGateKind.Loading => value is true,
            UIComponentGateKind.ReadOnly => value is true,
            UIComponentGateKind.CanSelect or UIComponentGateKind.CanDrag or UIComponentGateKind.CanRemove or UIComponentGateKind.CanRename => value is false,
            UIComponentGateKind.MarkedDaysOnly => value is true,
            UIComponentGateKind.AllowNegative or UIComponentGateKind.AllowDecimals or UIComponentGateKind.ShowOpacity or UIComponentGateKind.ShowPalette => value is false,
            UIComponentGateKind.HostDraggable or UIComponentGateKind.HostRenamable or UIComponentGateKind.ShowClearButton => value is not true,
            UIComponentGateKind.TabPin => value is not UITabMenuEntries entries || !entries.HasFlag(UITabMenuEntries.Pin),
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
