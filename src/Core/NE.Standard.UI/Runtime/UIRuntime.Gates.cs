using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime
{
    // The refusals logged as warnings in the current minute, and when it ends (Environment.TickCount64). Guarded by _stateLock.
    private int _refusalWarnings;
    private long _refusalMinuteEnd;

    private UIComponentGateIndex Gates => field ??= UIComponentGateIndex.For(View);

    /// <summary>
    /// Refuses a command raised on a component the server knows is disabled, loading or hidden — by a static value or the
    /// controller, itself or an ancestor; a host's row event answers to the row it names as well. A row's move, removal or rename
    /// is refused where the row's template or its own item says it may not be dragged, removed or renamed.
    /// </summary>
    /// <remarks>
    /// Refused as an unauthorised command is, so the reader is told the same way; what only the client knows is not read. A drop
    /// (<c>OnDrop</c>) is the command's to judge, as <c>UIDrop</c> says. A row is named by its key, a text: anything else where a
    /// row's key stands is a forged address, which would reach a row by its place past every gate read by key; so is a key no row
    /// holds, on a host whose rows the server holds, and an address with fewer keys than the rows its component stands in. A row
    /// a host draws with another of its templates, by the row's item, is no row of the template the event was raised in.
    /// </remarks>
    private void EnsureEventTargetOpenNoLock(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        UIComponentId componentId = compiledEvent.Address.ComponentId;

        // Short of a row's key, the gates read by key would read no row, and close nothing.
        if (View.Graph.TryGet(componentId, out UIComponentNode? node) && dynamicParameters.Length < node.ContextParameterCount)
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names fewer row keys than the rows its component stands in.");

        if (IsTriggerEventRefused(compiledEvent, node?.ContextParameterCount ?? 0, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a trigger its field does not offer.");

        UIComponentGateIndex gates = Gates;

        if (gates.IsEmpty)
            return;

        // The row's template root stands under the host, so its chain answers for the host too. Past the host's own keys stands a row's
        // key, unless the event reads a value of its own there (a row's index, a drop).
        if (gates.TryGetRows(componentId, out UIRowGates rows)
            && dynamicParameters.Length >= rows.Abilities.RowParameterCount
            && !ReadsEventValueAt(compiledEvent, rows.Abilities.RowParameterCount - 1))
        {
            if (dynamicParameters[rows.Abilities.RowParameterCount - 1] is not string key)
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row by something other than its key.");

            var rowParameters = TakeDynamicParameters(dynamicParameters, rows.Abilities.RowParameterCount);

            if (rows.Abilities.Items is { } items && LookUpRowNoLock(items, rowParameters, key).Missing)
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row its host does not hold.");

            if (rows.TemplateRootId is UIComponentId rootId)
                componentId = rootId;
        }

        RowLookup? ownRow = EnsureRowsHeldNoLock(gates, compiledEvent, dynamicParameters);

        if (gates.TryGet(componentId, out UIComponentGates? target))
        {
            if (ClosingGateNoLock(target!.Chain, dynamicParameters) is not null)
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a component that is disabled, loading or hidden.");

            if (target.ReadOnly is { } readOnly && ClosesOnReadOnly(compiledEvent.Address.EventName) && IsClosedNoLock(readOnly, dynamicParameters))
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a component that is read-only.");
        }

        if (!gates.TryGetRowRoot(compiledEvent.Address.ComponentId, out UIRowAbilities? row) || !IsRowsOwnEvent(compiledEvent.Address.EventName))
            return;

        // A row's own event is the row's whatever its ability: one named by anything but its key is a forged address.
        if (!IsNamedByKey(row!, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row by something other than its key.");

        // The row looked up once: the lookup that found it held answers for its abilities too.
        if (EventAbility(compiledEvent.Address.EventName) is UIComponentGateKind ability
            && (ownRow is { } held
                ? IsRowRefusedNoLock(row!, ability, TakeDynamicParameters(dynamicParameters, row!.RowParameterCount), held)
                : IsRowRefusedNoLock(row!, ability, dynamicParameters)))
        {
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a row whose {ability} is false.");
        }

        if (compiledEvent.Address.EventName == EventNames.ItemMenuEntry && IsTabMenuEntryRefusedNoLock(compiledEvent.Address.ComponentId, row!, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names an entry its tab menu does not offer.");
    }

    /// <summary>
    /// Whether a trigger event (<c>trigger-search</c>, <c>trigger-select</c>, <c>trigger-click</c>) names a prefix its field does not
    /// offer; a call with no event values when the command reads none (a literal overload in a test) is left alone.
    /// </summary>
    private bool IsTriggerEventRefused(CompiledUIEvent compiledEvent, int contextParameterCount, object?[] dynamicParameters)
    {
        if (compiledEvent.Address.EventName is not (EventNames.TriggerSearch or EventNames.TriggerSelect or EventNames.TriggerClick))
            return false;

        if (!View.State.TryGetValue(compiledEvent.Address.ComponentId, ITextEntryInputComponent.TriggersProperty, out CompiledUIPropertyValue? value)
            || value.Value is not IReadOnlyList<UITextTrigger> { Count: > 0 } triggers)
        {
            return true;
        }

        if (dynamicParameters.Length <= contextParameterCount)
            return ReadsEventValueAt(compiledEvent, 0);

        if (dynamicParameters[contextParameterCount] is not string prefix)
            return true;

        for (var i = 0; i < triggers.Count; i++)
        {
            if (string.Equals(triggers[i].Prefix, prefix, StringComparison.Ordinal))
                return false;
        }

        return true;
    }

    /// <summary>
    /// Whether a read-only input refuses the event: any edit, submit, search, trigger or upload of its own; focus, pointer and a
    /// read-only graph's node press or run stop stay open.
    /// </summary>
    private static bool ClosesOnReadOnly(string eventName)
        => eventName is not (EventNames.Focus or EventNames.Blur or EventNames.HoverStart or EventNames.HoverEnd or "graph-node-click" or "graph-run-stop");

    /// <summary>
    /// Refuses an event raised in a row a host no longer holds, or never held: each row the component stands in is looked up by its key
    /// where the server holds its host's rows. Where the host picks a row's template by its item, the row must be one the template the
    /// event stands in draws. Answers the lookup of the component's own row, where it is a row's template root, for its abilities to
    /// read.
    /// </summary>
    private RowLookup? EnsureRowsHeldNoLock(UIComponentGateIndex gates, CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        IReadOnlyList<UIComponentId> scopes = View.Graph.GetItemScopes(compiledEvent.Address.ComponentId);
        RowLookup? own = null;

        for (var i = 0; i < scopes.Count; i++)
        {
            _ = gates.TryGetRowRoot(scopes[i], out UIRowAbilities? row);
            _ = gates.TryGetRowVariant(scopes[i], out UIRowVariant? variant);

            // A variant reads the very rows its root's abilities do, so one lookup answers both.
            if ((row?.Items ?? variant?.Items) is not { } items)
                continue;

            var count = row?.RowParameterCount ?? variant!.RowParameterCount;

            if (dynamicParameters.Length < count || dynamicParameters[count - 1] is not string key)
                continue;

            RowLookup lookup = LookUpRowNoLock(items, TakeDynamicParameters(dynamicParameters, count), key);

            if (lookup.Missing && row?.Items is not null)
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised in a row its host does not hold.");

            if (variant is not null && IsOtherTemplatesRow(variant, lookup.Item))
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row its template does not draw.");

            if (row?.Items is not null && scopes[i] == compiledEvent.Address.ComponentId)
                own = lookup;
        }

        return own;
    }

    /// <summary>
    /// Whether a row's item is drawn by another of its host's templates than <paramref name="variant"/>'s, by its key property as the
    /// renderer picks it; in a menu offering sub-entries, also an entry opening others, or one disabled or hidden, as a tab menu's entry
    /// is judged. A row the server cannot read refuses nothing.
    /// </summary>
    private bool IsOtherTemplatesRow(UIRowVariant variant, object? item)
    {
        if (item is null)
            return false;

        if (!string.Equals(ItemTemplateSelection.ResolveVariant(View.Graph, variant.HostId, variant.KeyProperty, variant.FallbackKey, item), variant.VariantKey, StringComparison.Ordinal))
            return true;

        return variant.OpensSubmenus && item is IMenuItemModel entry && (HasEntries(entry) || IsEntryClosed(entry));
    }

    /// <summary>
    /// Whether a tab menu's entry event names an entry the strip's menu does not offer the application: none of its entries by that key,
    /// one of the strip's own, a rule or a caption, an entry opening others, or one disabled or hidden — itself or the entry it stands
    /// under. The entry's key stands past the tab's.
    /// </summary>
    private bool IsTabMenuEntryRefusedNoLock(UIComponentId tabRootId, UIRowAbilities row, object?[] dynamicParameters)
    {
        // The strip's own entries run on the page, never as the application's event.
        if (dynamicParameters.Length <= row.RowParameterCount || dynamicParameters[row.RowParameterCount] is not string entryKey || entryKey.StartsWith(UITabMenu.Prefix, StringComparison.Ordinal))
            return true;

        // The menu's entries are composed with the strip; a menu bound elsewhere is the author's, whose entries are not read here.
        if (!View.Graph.TryGet(tabRootId, out UIComponentNode? root)
            || root.ParentId is not UIComponentId hostId
            || !View.Graph.TryGetSlot(hostId, UIComponentSlotKind.Region, out UIComponentSlot? slot, RegionNames.TabMenu)
            || !View.State.TryGetValue(slot.RootComponentId, IItemsComponent.ItemsProperty, out CompiledUIPropertyValue? items)
            || items is not { IsBind: false, Value: IEnumerable entries })
        {
            return false;
        }

        return !IsOfferedEntry(entries, entryKey);
    }

    /// <summary>Whether a menu's entries, at any depth, offer the key as one that runs: an open, plain entry under open ones.</summary>
    private static bool IsOfferedEntry(IEnumerable entries, string key)
    {
        foreach (var candidate in entries)
        {
            if (candidate is not IMenuItemModel entry || IsEntryClosed(entry))
                continue;

            var opensOthers = HasEntries(entry);

            if (string.Equals(entry.Id, key, StringComparison.Ordinal))
                return !opensOthers && entry.Kind is not (UIMenuItemKind.Header or UIMenuItemKind.Separator);

            if (opensOthers && IsOfferedEntry(entry.Items, key))
                return true;
        }

        return false;
    }

    /// <summary>Whether a menu's entry is closed by its own item: disabled, or hidden at every width.</summary>
    private static bool IsEntryClosed(IMenuItemModel entry)
        => UIComponentGateIndex.Closes(UIComponentGateKind.Enabled, entry.Enabled) || UIComponentGateIndex.Closes(UIComponentGateKind.Visibility, entry.Visibility);

    private static bool HasEntries(IMenuItemModel entry)
    {
        foreach (IMenuItemModel _ in entry.Items)
            return true;

        return false;
    }

    /// <summary>Whether one of the event's arguments reads the value it carries at <paramref name="position"/> of its keys.</summary>
    private static bool ReadsEventValueAt(CompiledUIEvent compiledEvent, int position)
    {
        for (var i = 0; i < compiledEvent.Arguments.Length; i++)
        {
            CompiledUIActionArgument argument = compiledEvent.Arguments[i];

            if (argument.Kind == CompiledUIActionArgumentKind.EventKey && argument.Value switch { int at => at, long at => at, _ => -1L } == position)
                return true;
        }

        return false;
    }

    /// <summary>Whether an event is a row's own — a move, a removal, a rename, an entry of a tab's menu — rather than a component's in it.</summary>
    private static bool IsRowsOwnEvent(string eventName)
        => eventName is EventNames.ItemMenuEntry || EventAbility(eventName) is not null;

    /// <summary>Whether the keys name the row by its key, a text, where the row's key stands.</summary>
    private static bool IsNamedByKey(UIRowAbilities row, object?[] dynamicParameters)
        => dynamicParameters.Length >= row.RowParameterCount && dynamicParameters[row.RowParameterCount - 1] is string;

    /// <summary>The ability a row's own event needs: a move its <c>CanDrag</c>, a removal its <c>CanRemove</c>, a rename its <c>CanRename</c>.</summary>
    private static UIComponentGateKind? EventAbility(string eventName)
        => eventName switch
        {
            EventNames.Move => UIComponentGateKind.CanDrag,
            EventNames.Remove => UIComponentGateKind.CanRemove,
            EventNames.Rename => UIComponentGateKind.CanRename,
            _ => null
        };

    /// <summary>
    /// Whether the row the keys name may not do what <paramref name="ability"/> asks: its template's ability closes, or its own item
    /// says false; or the row is not named by its key, a text — an index would reach a row by its place, past its item's word — or
    /// names a row its host's rows, read, do not hold. Rows the server cannot read refuse nothing, as a gate it cannot read closes nothing.
    /// </summary>
    /// <remarks>The item is read only for an event or a write that names its row, never on a render or an ordinary value.</remarks>
    private bool IsRowRefusedNoLock(UIRowAbilities row, UIComponentGateKind ability, object?[] dynamicParameters)
    {
        var count = row.RowParameterCount;

        if (dynamicParameters.Length < count || dynamicParameters[count - 1] is not string key)
            return true;

        var rowParameters = TakeDynamicParameters(dynamicParameters, count);

        return IsRowRefusedNoLock(row, ability, rowParameters, row.Items is { } items ? LookUpRowNoLock(items, rowParameters, key) : default);
    }

    /// <summary>
    /// Whether the row <paramref name="lookup"/> found under <paramref name="rowParameters"/> — the row's own keys, its key last — may
    /// not do what <paramref name="ability"/> asks: not held, its template's ability closed, or its own item saying false.
    /// </summary>
    private bool IsRowRefusedNoLock(UIRowAbilities row, UIComponentGateKind ability, object?[] rowParameters, RowLookup lookup)
    {
        if (lookup.Missing)
            return true;

        if (row.For(ability) is { } gate && IsClosedNoLock(gate, rowParameters))
            return true;

        return lookup.Item is IItemAbilitiesModel item && UIComponentGateIndex.Closes(ability, UIRowAbilities.Read(item, ability));
    }

    /// <summary>
    /// What a host's rows hold of one row: <see cref="Item"/>, the row's item where it is held; <see cref="Missing"/> where the rows,
    /// read, hold none of the key. Neither where the collection itself cannot be read, which refuses nothing.
    /// </summary>
    private readonly record struct RowLookup(bool Missing, object? Item);

    /// <summary>
    /// Looks a row up by its key, once for every gate that reads it: a declared row, or the controller's, read under its key first and
    /// the collection read only where that finds nothing, to tell a row not held from rows that cannot be read.
    /// </summary>
    private RowLookup LookUpRowNoLock(UIRowItems items, object?[] rowParameters, string key)
    {
        if (items.Declared is { } declared)
        {
            var row = FindDeclaredRow(declared, key);

            return new RowLookup(row is null, row);
        }

        if (items.Bound is not { } bound || !TryResolveGatePath(bound, rowParameters, out RecursivePath path))
            return default;

        if (TryReadGatePathNoLock(bound, path.AppendKey(key), out var found))
            return new RowLookup(Missing: false, found);

        return new RowLookup(TryReadGatePathNoLock(bound, path, out _), Item: null);
    }

    /// <summary>The controller path a bound gate reads for the row keys given; false for a binding with more keys than the call names.</summary>
    private bool TryResolveGatePath(UIComponentGate gate, object?[] dynamicParameters, out RecursivePath path)
    {
        if (gate.FixedPath is RecursivePath fixedPath)
        {
            path = fixedPath;
            return true;
        }

        if (gate.Binding is not CompiledUIBinding binding || dynamicParameters.Length < gate.DynamicCount)
        {
            path = RecursivePath.Empty;
            return false;
        }

        // An ancestor reads the outer keys alone, outermost first.
        path = View.Bindings.Resolve(binding, TakeDynamicParameters(dynamicParameters, gate.DynamicCount)).Path;
        return true;
    }

    /// <summary>
    /// Whether a client write lands on a component the server knows the reader may not write: closed by itself or an ancestor,
    /// read-only, a value outside its bounds, a day not on offer, a text past its length or one the component's own check refuses;
    /// for a choice of rows, a newly chosen row that may not be chosen or is disabled; a viewer's query naming a term its host does not
    /// offer; or a row's rename or tree move its abilities refuse.
    /// </summary>
    private bool IsWriteRefusedNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        UIComponentGateIndex gates = Gates;
        UIProperty property = update.Address.Property;

        // A tab's order is the server's to write, from a drag's or a pin's place; the page's own write of one is never taken.
        if (property == TabItemComponent.OrderProperty)
            return true;

        if (property == IItemsComponent.QueryProperty && IsQueryWriteRefused(update, resolution, ref read))
            return true;

        // Any component's IsOpen, a package's popup included, not the flyout's alone: a popup's close arrives from an outside click or
        // Escape, which nothing on the client refuses, so it is never answered with a reopening.
        if (gates.IsEmpty || (property == IOpenableComponent.IsOpenProperty && update.Value is false))
            return false;

        UIComponentId componentId = update.Address.Component.Id;
        var dynamicParameters = update.Address.Component.DynamicParameters;

        if (gates.TryGet(componentId, out UIComponentGates? target))
        {
            if (ClosingGateNoLock(target!.Chain, dynamicParameters) is { } closing)
            {
                // Said in the log, unlike a disabled or loading one's: a page writes to a hidden field only by the author's design (a
                // picker opened from elsewhere) or by a forged call, and the field going back to its value says nothing to either.
                if (closing.Kind == UIComponentGateKind.Visibility && View.Graph.TryGet(componentId, out UIComponentNode? node))
                    TryLog((property, node, level: RefusalLevelNoLock()), static (logger, state) => Log.HiddenWriteRefused(logger, state.level, state.property.Name, state.node.TypeKey, state.node.AuthoringId));

                return true;
            }

            if ((target.ReadOnly is { } readOnly && IsClosedNoLock(readOnly, dynamicParameters))
                || (target.Values is { } checks && IsValueRefusedNoLock(checks, update, resolution, ref read))
                || (target.WriteCheck is { } writeCheck && IsCheckRefusedNoLock(writeCheck, update, resolution, ref read)))
            {
                return true;
            }
        }

        if (gates.TryGetRows(componentId, out UIRowGates rows) && IsChoice(property, rows))
            return IsChoiceRefusedNoLock(gates, rows, update, resolution);

        return WriteAbility(property) is UIComponentGateKind ability && gates.TryGetRowRoot(componentId, out UIRowAbilities? row) && IsRowRefusedNoLock(row!, ability, dynamicParameters);
    }

    /// <summary>
    /// Whether the page's write of a host's query names a term the host does not offer, read as the write reads it; a value that is no
    /// query is left to the write, which refuses it.
    /// </summary>
    private bool IsQueryWriteRefused(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        read ??= ReadClientValue(resolution.Binding, update.Value);

        if (read.Value.Normalization == UIFormattedValueNormalization.Rejected)
            return false;

        if (read.Value.Value is null)
            return IsViewerQueryRefusedNoLock(update.Address.Component.Id, UIItemsQuery.Empty);

        return RecursiveValueCoercion.TryCoerce(read.Value.Value, typeof(UIItemsQuery), out var coerced)
            && coerced is UIItemsQuery query
            && IsViewerQueryRefusedNoLock(update.Address.Component.Id, query);
    }

    /// <summary>
    /// The level a refusal the log is told of goes at: a warning while this runtime has written fewer than
    /// <see cref="UISecurityOptions.RefusalWarningsPerMinute"/> this minute, a debug line past it — a forged page in a loop would
    /// otherwise flood the log.
    /// </summary>
    private LogLevel RefusalLevelNoLock()
    {
        var now = Environment.TickCount64;

        if (now >= _refusalMinuteEnd)
        {
            _refusalMinuteEnd = now + 60_000;
            _refusalWarnings = 0;
        }

        if (_refusalWarnings >= _application.Security.RefusalWarningsPerMinute)
            return LogLevel.Debug;

        _refusalWarnings++;

        return LogLevel.Warning;
    }

    /// <summary>
    /// Whether a value written to an input, or to a period's end, falls outside its <c>Min</c>/<c>Max</c>, on a day it does not offer,
    /// past a range slider's other end, off a slider's step, past a text's length or a multi-select's count, or is a negative or
    /// fractional number its input does not allow. A cleared value, or text that reads as no value, is left to the ordinary path, which
    /// keeps the one and refuses the other.
    /// </summary>
    /// <remarks>
    /// The text is read as the write itself reads it — by the input's own format and culture — and the read handed on to the write, so
    /// it is read once; the value is then boxed once in the property's own type, which the bounds already hold.
    /// </remarks>
    private bool IsValueRefusedNoLock(UIValueChecks checks, ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        UIProperty property = update.Address.Property;

        if (property != IInputComponent.ValueProperty && property != IPeriodInputComponent.EndValueProperty)
            return false;

        read ??= ReadClientValue(resolution.Binding, update.Value);

        if (read.Value.Normalization == UIFormattedValueNormalization.Rejected
            || !RecursiveValueCoercion.TryCoerce(read.Value.Value, checks.ValueType, out var value)
            || value is null)
        {
            return false;
        }

        var dynamicParameters = update.Address.Component.DynamicParameters;

        return IsBeyondNoLock(checks.Min, checks.ValueType, value, dynamicParameters, below: true)
            || IsBeyondNoLock(checks.Max, checks.ValueType, value, dynamicParameters, below: false)
            || (checks.MarkedOnly is { } only
                && checks.MarkedDays is { } days
                && DayOf(value) is DateOnly day
                && IsClosedNoLock(only, dynamicParameters)
                && !IsMarkedNoLock(days, day, dynamicParameters))
            || (checks.Ends is { } ends && IsPastOtherEndNoLock(ends, checks.ValueType, property == IPeriodInputComponent.EndValueProperty, value, dynamicParameters))
            || (checks.Step is { } step && IsOffStepNoLock(step, checks.Min, value, dynamicParameters))
            || (checks.MaxLength is { } maxLength && value is string text && IsTooLongNoLock(maxLength, text, resolution, dynamicParameters))
            || (checks.MaxSelected is { } maxSelected && value is IReadOnlyList<string> keys && IsPastMaxSelectedNoLock(maxSelected, keys, resolution, dynamicParameters))
            || (checks.AllowNegative is { } negative && ToNumber(value) < 0 && IsClosedNoLock(negative, dynamicParameters))
            || (checks.AllowDecimals is { } decimals && ToNumber(value) is decimal number && number != decimal.Truncate(number) && IsClosedNoLock(decimals, dynamicParameters))
            || (checks.ShowOpacity is { } opacityGate && value is UIThemeColor translucent && (translucent.Light ?? translucent.Dark)?.Opacity != byte.MaxValue && IsClosedNoLock(opacityGate, dynamicParameters))
            || (checks.ShowPalette is { } paletteGate && value is UIThemeColor paletteColor && (paletteColor.Light ?? paletteColor.Dark) is { Rgb: null } && IsClosedNoLock(paletteGate, dynamicParameters));
    }

    /// <summary>
    /// Whether a value lies past a bound — below <c>Min</c> or above <c>Max</c>; a bound unset, unread or of no kind the value takes
    /// holds nothing. A static bound was brought to the value's type once, with the index; a bound the controller holds is already in it.
    /// </summary>
    private bool IsBeyondNoLock(UIGateValue? bound, Type valueType, object value, object?[] dynamicParameters, bool below)
    {
        if (bound is not { } limit
            || !TryReadGateValueNoLock(limit, dynamicParameters, out var read)
            || !RecursiveValueCoercion.TryCoerce(read, valueType, out var typed)
            || typed is null)
        {
            return false;
        }

        var order = CompareToBound(value, typed);

        return below ? order < 0 : order > 0;
    }

    private bool TryReadGateValueNoLock(UIGateValue value, object?[] dynamicParameters, out object? read)
    {
        if (value.Bound is not { } bound)
        {
            read = value.Static;
            return true;
        }

        return TryReadGateNoLock(bound, dynamicParameters, out read);
    }

    /// <summary>
    /// How a value orders against a bound of its own type; a date-time by instant, whatever offset each carries — the page writes its
    /// value with an offset, and reads a bound at it.
    /// </summary>
    private static int CompareToBound(object value, object bound)
        => value is IComparable comparable ? comparable.CompareTo(bound) : 0;

    /// <summary>
    /// The day a written value falls on: a day input's own, a moment's by the clock it carries, as the page marks it.
    /// </summary>
    private static DateOnly? DayOf(object value)
        => value switch
        {
            DateOnly day => day,
            DateTimeOffset moment => DateOnly.FromDateTime(moment.DateTime),
            DateTime moment => DateOnly.FromDateTime(moment),
            _ => null
        };

    /// <summary>
    /// Whether a day is among the marked ones; a set the server cannot read refuses nothing, as a gate it cannot read closes nothing,
    /// and one the controller left unset offers no day.
    /// </summary>
    private bool IsMarkedNoLock(UIGateValue days, DateOnly day, object?[] dynamicParameters)
    {
        if (!TryReadGateValueNoLock(days, dynamicParameters, out var marked))
            return true;

        return marked is IEnumerable<DateOnly> markedDays && MarkedDaysComponentExtensions.IsMarked(markedDays, day);
    }

    /// <summary>
    /// Whether a period's end written lies past the other as the controller holds it — a start above the end, an end below the start —
    /// or nearer to it than the least distance; another end unset, or one the server cannot read, holds nothing, and an unset or unread
    /// distance lets the ends meet.
    /// </summary>
    private bool IsPastOtherEndNoLock(UIPeriodEnds ends, Type valueType, bool isEnd, object value, object?[] dynamicParameters)
    {
        if ((isEnd ? ends.Start : ends.End) is not { } other
            || !TryReadGateNoLock(other, dynamicParameters, out var read)
            || !RecursiveValueCoercion.TryCoerce(read, valueType, out var held)
            || held is null)
        {
            return false;
        }

        // The distance in the type its ends measure it in: a number for a slider, a span of time for a temporal period.
        var least = ends.MinDistance is { } distance
            && TryReadGateValueNoLock(distance, dynamicParameters, out var set)
            && RecursiveValueCoercion.TryCoerce(set, valueType == typeof(decimal) ? typeof(decimal) : typeof(TimeSpan), out var typed)
                ? typed
                : null;

        return isEnd ? IsNearer(held, value, least) : IsNearer(value, held, least);
    }

    /// <summary>
    /// Whether a period's end lies nearer its start than the least distance, or before it where none is read: a number by its
    /// difference, a day by whole days, a time by the clock between them, a moment by the time between its instants, as its bounds
    /// are compared; ends of no kind a distance is measured in are never nearer.
    /// </summary>
    private static bool IsNearer(object start, object end, object? least)
        => (start, end) switch
        {
            (decimal from, decimal to) => to - from < (least as decimal? ?? 0m),
            (DateOnly from, DateOnly to) => TimeSpan.FromDays(to.DayNumber - from.DayNumber) < (least as TimeSpan? ?? TimeSpan.Zero),
            (TimeOnly from, TimeOnly to) => to.ToTimeSpan() - from.ToTimeSpan() < (least as TimeSpan? ?? TimeSpan.Zero),
            (DateTimeOffset from, DateTimeOffset to) => to - from < (least as TimeSpan? ?? TimeSpan.Zero),
            (DateTime from, DateTime to) => to - from < (least as TimeSpan? ?? TimeSpan.Zero),
            _ => false
        };

    /// <summary>
    /// Whether a slider's value lies between two steps counted from its <c>Min</c> (0 where unread), in decimal arithmetic, so a step
    /// of 0.1 holds 0.3 exactly; a step the controller leaves null is the browser's 1, as an unset one is, and one unread or not above
    /// zero holds nothing.
    /// </summary>
    private bool IsOffStepNoLock(UIGateValue step, UIGateValue? min, object value, object?[] dynamicParameters)
    {
        if (value is not decimal written || ReadStepNoLock(step, dynamicParameters) is not decimal size || size <= 0)
            return false;

        var origin = min is { } bound && ReadDecimalNoLock(bound, dynamicParameters) is decimal lower ? lower : 0m;

        return (written - origin) % size != 0;
    }

    /// <summary>A slider's step as the page steps by it: a null the controller holds is the browser's 1, as an unset step is.</summary>
    private decimal? ReadStepNoLock(UIGateValue step, object?[] dynamicParameters)
    {
        if (!TryReadGateValueNoLock(step, dynamicParameters, out var read))
            return null;

        if (read is null)
            return UIComponentGateIndex.DefaultSliderStep;

        return RecursiveValueCoercion.TryCoerce(read, typeof(decimal), out var typed) && typed is decimal size ? size : null;
    }

    /// <summary>A check's value as a number, or none where it is unset, unread or no number.</summary>
    private decimal? ReadDecimalNoLock(UIGateValue gateValue, object?[] dynamicParameters)
        => TryReadGateValueNoLock(gateValue, dynamicParameters, out var read) && RecursiveValueCoercion.TryCoerce(read, typeof(decimal), out var typed) && typed is decimal number
            ? number
            : null;

    /// <summary>
    /// Whether a text runs past its field's <c>MaxLength</c>, in UTF-16 units as the browser's <c>maxlength</c> counts them — a line
    /// break, <c>\r\n</c> as a form sends it, counted once; a length unset, unread or not a number holds nothing.
    /// </summary>
    private bool IsTooLongNoLock(UIGateValue maxLength, string text, CompiledUIBindingResolution resolution, object?[] dynamicParameters)
    {
        if (ReadDecimalNoLock(maxLength, dynamicParameters) is not decimal limit || text.Length <= limit)
            return false;

        var length = BrowserLength(text);

        if (length <= limit)
            return false;

        // A value the controller set past the length is shortened a character at a time, as the browser lets the reader do.
        return resolution.Source.Kind != CompiledUIBindingSourceKind.Controller || TryGetControllerValue(resolution.Path) is not string held || length > BrowserLength(held);
    }

    /// <summary>A text's length as the browser's <c>maxlength</c> counts it: each <c>\r\n</c> one character, as its value holds a line break.</summary>
    private static int BrowserLength(string text)
    {
        var length = text.Length;
        var at = text.IndexOf("\r\n", StringComparison.Ordinal);

        while (at >= 0)
        {
            length--;
            at = text.IndexOf("\r\n", at + 2, StringComparison.Ordinal);
        }

        return length;
    }

    /// <summary>
    /// Whether a multi-select's keys run past its <c>MaxSelected</c>, counting each distinct key once as the page holds it; a count
    /// unset, unread or not a number holds nothing.
    /// </summary>
    private bool IsPastMaxSelectedNoLock(UIGateValue maxSelected, IReadOnlyList<string> keys, CompiledUIBindingResolution resolution, object?[] dynamicParameters)
    {
        if (ReadDecimalNoLock(maxSelected, dynamicParameters) is not decimal limit || keys.Count <= limit)
            return false;

        var count = new HashSet<string>(keys, StringComparer.Ordinal).Count;

        if (count <= limit)
            return false;

        // A choice the controller set past the count is cut down a key at a time, as a text past its length is shortened.
        return resolution.Source.Kind != CompiledUIBindingSourceKind.Controller || TryGetControllerValue(resolution.Path) is not IEnumerable held || count > CountDistinct(held);
    }

    private static int CountDistinct(IEnumerable keys)
    {
        HashSet<string> distinct = new(StringComparer.Ordinal);

        foreach (var key in keys)
        {
            if (key is string text)
                _ = distinct.Add(text);
        }

        return distinct.Count;
    }

    /// <summary>A written number as a decimal, whatever numeric type its property takes; null for a value that is no number.</summary>
    private static decimal? ToNumber(object value)
        => value is decimal number ? number : RecursiveValueCoercion.TryCoerce(value, typeof(decimal), out var typed) && typed is decimal coerced ? coerced : null;

    /// <summary>
    /// Whether a component's own check refuses the value written to one of its properties, read as the write reads it and brought to
    /// the property's own type; a value of no kind that type takes is refused, and text that reads as no value is left to the
    /// ordinary path, which refuses it.
    /// </summary>
    private bool IsCheckRefusedNoLock(UIClientWriteCheck check, ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        read ??= ReadClientValue(resolution.Binding, update.Value);

        if (read.Value.Normalization == UIFormattedValueNormalization.Rejected)
            return false;

        var value = read.Value.Value;

        // Brought to the component's type, not the controller's: the check judges what the component offers, whatever holds it.
        if (value is not null && resolution.Binding.TargetValueType is Type valueType && !RecursiveValueCoercion.TryCoerce(value, valueType, out value))
            return true;

        return !check.Accepts(update.Address.Property, value);
    }

    /// <summary>Whether a write chooses among a host's rows: its chosen key or keys, or the value of an input choosing among its options.</summary>
    private static bool IsChoice(UIProperty property, UIRowGates rows)
        => property == ISelectedKeyComponent.SelectedKeyProperty
            || property == ISelectableItemsComponent.SelectedKeysProperty
            || (rows.ChoosesByValue && property == IInputComponent.ValueProperty);

    /// <summary>
    /// Whether a choice takes a row that may not be chosen, is disabled, or is not there on a host whose rows the server holds — but a
    /// key typed as free text where the input takes it; only a row newly chosen counts, since one chosen before it closed stays chosen on the
    /// client too. Each row is looked up by its key; a value that is neither a key nor a list of keys is refused.
    /// </summary>
    private bool IsChoiceRefusedNoLock(UIComponentGateIndex gates, UIRowGates rows, ClientValueUIUpdate update, CompiledUIBindingResolution resolution)
    {
        if (update.Address.Component.DynamicParameters.Length != rows.Abilities.RowParameterCount - 1)
            return false;

        if (!TryReadChosenKeys(update.Value, out IReadOnlyList<string> keys))
            return true;

        // Rows wearing a template by the item's kind have no one template whose chain answers for every row.
        UIComponentGates? template = rows.TemplateRootId is UIComponentId rootId && gates.TryGet(rootId, out UIComponentGates? found) ? found : null;
        var current = resolution.Source.Kind == CompiledUIBindingSourceKind.Controller ? TryGetControllerValue(resolution.Path) : null;

        // Many keys look the choice up in a set made once, not each along a long selection; one key, the common write, needs no set.
        HashSet<string>? chosen = keys.Count > 1 ? ToChosenSet(current) : null;

        for (var i = 0; i < keys.Count; i++)
        {
            var key = keys[i];

            if (chosen?.Contains(key) ?? IsChosen(current, key))
                continue;

            var rowParameters = AppendDynamicParameter(update.Address.Component.DynamicParameters, key);
            RowLookup lookup = rows.Abilities.Items is { } items ? LookUpRowNoLock(items, rowParameters, key) : default;

            if (rows.TakesFreeText && lookup.Missing)
                continue;

            if ((template is not null && IsClosedNoLock(template.Chain, rowParameters)) || IsRowRefusedNoLock(rows.Abilities, UIComponentGateKind.CanSelect, rowParameters, lookup))
                return true;
        }

        return false;
    }

    /// <summary>
    /// The keys a choice names: one key, a list of them as the wire carries it, or none when the choice is cleared; false when the
    /// value is neither a key nor a list of keys.
    /// </summary>
    private static bool TryReadChosenKeys(object? value, out IReadOnlyList<string> keys)
    {
        if (value is null)
        {
            keys = [];
            return true;
        }

        if (value is string key)
        {
            keys = key.Length > 0 ? [key] : [];
            return true;
        }

        if (value is IReadOnlyList<string> stringList)
        {
            keys = stringList;
            return true;
        }

        if (value is IEnumerable items)
        {
            List<string> list = [];

            foreach (var item in items)
            {
                if (item is not string itemKey)
                {
                    keys = [];
                    return false;
                }

                if (itemKey.Length > 0)
                    list.Add(itemKey);
            }

            keys = list;
            return true;
        }

        keys = [];
        return false;
    }

    /// <summary>The keys chosen now — one key, or a list of them — as a set; empty where nothing is chosen.</summary>
    private static HashSet<string> ToChosenSet(object? current)
    {
        HashSet<string> chosen = new(StringComparer.Ordinal);

        if (ToChoiceKey(current) is string key)
        {
            _ = chosen.Add(key);
        }
        else if (current is IEnumerable keys)
        {
            foreach (var chosenKey in keys)
            {
                if (ToChoiceKey(chosenKey) is string text)
                    _ = chosen.Add(text);
            }
        }

        return chosen;
    }

    /// <summary>Whether a key is among those chosen now: one key, or a list of them.</summary>
    private static bool IsChosen(object? current, string key)
    {
        if (ToChoiceKey(current) is string chosen)
            return string.Equals(chosen, key, StringComparison.Ordinal);

        if (current is not IEnumerable chosenKeys)
            return false;

        foreach (var chosenKey in chosenKeys)
        {
            if (ToChoiceKey(chosenKey) is string text && string.Equals(text, key, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    /// <summary>A chosen value as the row key it names: a text, or an enum value's name.</summary>
    private static string? ToChoiceKey(object? value)
        => value switch
        {
            string text => text,
            Enum enumValue => enumValue.ToString(),
            _ => null
        };

    /// <summary>The ability a row's own write needs: a rename's title its <c>CanRename</c>, a tree node's new folder its <c>CanDrag</c>.</summary>
    private static UIComponentGateKind? WriteAbility(UIProperty property)
    {
        if (property == IRenamableComponent.RenamedTitleProperty)
            return UIComponentGateKind.CanRename;

        return property == TreeNodeComponent.DropTargetProperty ? UIComponentGateKind.CanDrag : null;
    }

    /// <summary>
    /// Answers a refused write with the value the server holds, so the field the reader changed goes back to it.
    /// </summary>
    private ServerValueUIUpdate AnswerRefusedWriteNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution)
    {
        if (resolution.Source.Kind == CompiledUIBindingSourceKind.Controller)
            return BuildServerValueNoLock(resolution.Binding, resolution.Path, BindingKeys(update, resolution.Binding));

        // A static list's row is no value the server holds: the property's fallback answers.
        bool? content = false;

        return BuildServerValueNoLock(resolution.Binding, resolution.Path, BindingKeys(update, resolution.Binding), value: null, ref content);
    }

    private bool IsClosedNoLock(UIComponentGate[] gates, object?[] dynamicParameters)
        => ClosingGateNoLock(gates, dynamicParameters) is not null;

    /// <summary>The first of the gates that closes the component for the row keys given, or null where none does.</summary>
    private UIComponentGate? ClosingGateNoLock(UIComponentGate[] gates, object?[] dynamicParameters)
    {
        for (var i = 0; i < gates.Length; i++)
        {
            if (IsClosedNoLock(gates[i], dynamicParameters))
                return gates[i];
        }

        return null;
    }

    /// <summary>
    /// Whether one gate closes the component for the row keys given: a static closing value, or the controller's value now. A value
    /// the server cannot read — a row that is not there, a binding with more keys than the call names — closes nothing.
    /// </summary>
    private bool IsClosedNoLock(UIComponentGate gate, object?[] dynamicParameters)
        => gate.Binding is null || (TryReadGateNoLock(gate, dynamicParameters, out var value) && UIComponentGateIndex.Closes(gate.Kind, value));

    /// <summary>
    /// The value a bound gate reads for the row keys given — the controller's, or a declared row's — in the property's own shape; false
    /// for a row that is not there or a binding with more keys than the call names.
    /// </summary>
    private bool TryReadGateNoLock(UIComponentGate gate, object?[] dynamicParameters, out object? value)
    {
        value = null;

        if (gate.Binding is not CompiledUIBinding binding || !TryResolveGatePath(gate, dynamicParameters, out RecursivePath path) || !TryReadGatePathNoLock(gate, path, out var read))
            return false;

        value = UIBoundValueConverter.Convert(read, binding.TargetValueType);
        return true;
    }

    /// <summary>What a gate's path holds: off the rows declared on its host where it reads one of them, else off the controller.</summary>
    private bool TryReadGatePathNoLock(UIComponentGate gate, RecursivePath path, out object? value)
        => gate.Declared is { } declared ? TryReadDeclaredValue(declared, path, out value) : Controller.TryGetRecursiveValue(path, out value);
}
