using System;
using System.Collections;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private UIComponentGateIndex Gates => field ??= UIComponentGateIndex.For(View);

    /// <summary>
    /// Refuses a command raised on a component the server knows is disabled, loading or hidden — by a static value or the
    /// controller, itself or an ancestor; a host's row event answers to the row it names as well. A row's move, removal or rename
    /// is refused where the row's template or its own item says it may not be dragged, removed or renamed.
    /// </summary>
    /// <remarks>
    /// Refused as an unauthorised command is, so the reader is told the same way; what only the client knows is not read. A drop
    /// (<c>OnDrop</c>) is the command's to judge, as <c>UIDrop</c> says.
    /// </remarks>
    private void EnsureEventTargetOpenNoLock(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        UIComponentGateIndex gates = Gates;

        if (gates.IsEmpty)
            return;

        UIComponentId componentId = compiledEvent.Address.ComponentId;

        // The row's template root stands under the host, so its chain answers for the host too. A row is named by its key, a
        // text; a number past the host's own keys is a value the event carries (a list's row dropped at an index), not a row.
        if (gates.TryGetRows(componentId, out UIRowGates rows)
            && rows.TemplateRootId is UIComponentId rootId
            && dynamicParameters.Length >= rows.Abilities.RowParameterCount
            && dynamicParameters[rows.Abilities.RowParameterCount - 1] is string)
        {
            componentId = rootId;
        }

        if (gates.TryGet(componentId, out UIComponentGates? target) && IsClosedNoLock(target!.Chain, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a component that is disabled, loading or hidden.");

        if (EventAbility(compiledEvent.Address.EventName) is UIComponentGateKind ability
            && gates.TryGetRowRoot(compiledEvent.Address.ComponentId, out UIRowAbilities? row)
            && IsRowRefusedNoLock(row!, ability, dynamicParameters))
        {
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a row whose {ability} is false.");
        }
    }

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
    /// says false. A row not named by a key, or not there, refuses nothing — as a gate the server cannot read closes nothing.
    /// </summary>
    /// <remarks>The item is read only here, on a row's own event or write, never on a render or an ordinary value.</remarks>
    private bool IsRowRefusedNoLock(UIRowAbilities row, UIComponentGateKind ability, object?[] dynamicParameters)
    {
        var count = row.RowParameterCount;

        if (dynamicParameters.Length < count || dynamicParameters[count - 1] is not string key)
            return false;

        var rowParameters = TakeDynamicParameters(dynamicParameters, count);

        if (row.For(ability) is { } gate && IsClosedNoLock(gate, rowParameters))
            return true;

        return row.Items is { } items && ReadRowItemNoLock(items, rowParameters, key) is IItemAbilitiesModel item && UIComponentGateIndex.Closes(ability, UIRowAbilities.Read(item, ability));
    }

    /// <summary>The row's own item by its key: a declared row, or the controller's; null where no such row is held.</summary>
    private object? ReadRowItemNoLock(UIRowItems items, object?[] rowParameters, string key)
    {
        if (items.Declared is { } declared)
        {
            foreach (var row in declared)
            {
                if (row is IBindableItem item && string.Equals(item.Id, key, StringComparison.Ordinal))
                    return row;
            }

            return null;
        }

        return items.Bound is { } bound && TryResolveGatePath(bound, rowParameters, out RecursivePath path) && Controller.TryGetRecursiveValue(path.AppendKey(key), out var found)
            ? found
            : null;
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
    /// read-only, a value outside its bounds, a day not on offer or a text past its length; for a choice of rows, a newly chosen
    /// row that may not be chosen or is disabled; or a row's rename or tree move its abilities refuse.
    /// </summary>
    private bool IsWriteRefusedNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        UIComponentGateIndex gates = Gates;
        UIProperty property = update.Address.Property;

        // A tab's order is the server's to write, from a drag's or a pin's place; the page's own write of one is never taken.
        if (property == TabItemComponent.OrderProperty)
            return true;

        // Any component's IsOpen, a package's popup included, not the flyout's alone: a popup's close arrives from an outside click or
        // Escape, which nothing on the client refuses, so it is never answered with a reopening.
        if (gates.IsEmpty || (property == IOpenableComponent.IsOpenProperty && update.Value is false))
            return false;

        UIComponentId componentId = update.Address.Component.Id;
        var dynamicParameters = update.Address.Component.DynamicParameters;

        if (gates.TryGet(componentId, out UIComponentGates? target)
            && (IsClosedNoLock(target!.Chain, dynamicParameters)
                || (target.ReadOnly is { } readOnly && IsClosedNoLock(readOnly, dynamicParameters))
                || (target.Values is { } checks && IsValueRefusedNoLock(checks, update, resolution, ref read))))
        {
            return true;
        }

        if (IsChoice(property))
            return gates.TryGetRows(componentId, out UIRowGates rows) && IsChoiceRefusedNoLock(gates, rows, update, resolution);

        return WriteAbility(property) is UIComponentGateKind ability && gates.TryGetRowRoot(componentId, out UIRowAbilities? row) && IsRowRefusedNoLock(row!, ability, dynamicParameters);
    }

    /// <summary>
    /// Whether a value written to an input, or to a period's end, falls outside its <c>Min</c>/<c>Max</c>, on a day it does not offer,
    /// past a range slider's other end, or off a slider's step. A cleared value, or text that reads as no value, is left to the ordinary
    /// path, which keeps the one and refuses the other.
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
                && value is DateOnly day
                && IsClosedNoLock(only, dynamicParameters)
                && !IsMarkedNoLock(days, day, dynamicParameters))
            || (checks.Ends is { } ends && IsPastOtherEndNoLock(ends, property == IPeriodInputComponent.EndValueProperty, value, dynamicParameters))
            || (checks.Step is { } step && IsOffStepNoLock(step, checks.Min, value, dynamicParameters))
            || (checks.MaxLength is { } maxLength && value is string text && IsTooLongNoLock(maxLength, text, resolution, dynamicParameters));
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
    /// How a value orders against a bound of its own type; an instant by its clock time, as the page compares it — the wire carries a
    /// date and time without the offset.
    /// </summary>
    private static int CompareToBound(object value, object bound)
    {
        if (value is DateTimeOffset instant && bound is DateTimeOffset limit)
            return instant.DateTime.CompareTo(limit.DateTime);

        return value is IComparable comparable ? comparable.CompareTo(bound) : 0;
    }

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
    /// Whether a range's end written lies past the other as the controller holds it — a start above the end, an end below the start —
    /// or nearer to it than the least distance; another end unset, or one the server cannot read, holds nothing.
    /// </summary>
    private bool IsPastOtherEndNoLock(UIPeriodEnds ends, bool isEnd, object value, object?[] dynamicParameters)
    {
        if ((isEnd ? ends.Start : ends.End) is not { } other
            || value is not decimal written
            || !TryReadGateNoLock(other, dynamicParameters, out var read)
            || !RecursiveValueCoercion.TryCoerce(read, typeof(decimal), out var otherEnd)
            || otherEnd is not decimal held)
        {
            return false;
        }

        var distance = ends.MinDistance is { } least && ReadDecimalNoLock(least, dynamicParameters) is decimal set ? set : 0m;

        return isEnd ? written - held < distance : held - written < distance;
    }

    /// <summary>A check's value as a number, or none where it is unset, unread or no number.</summary>
    private decimal? ReadDecimalNoLock(UIGateValue gateValue, object?[] dynamicParameters)
        => TryReadGateValueNoLock(gateValue, dynamicParameters, out var read) && RecursiveValueCoercion.TryCoerce(read, typeof(decimal), out var typed) && typed is decimal number
            ? number
            : null;

    /// <summary>
    /// Whether a slider's value lies between two steps counted from its <c>Min</c> (0 where unread), in decimal arithmetic, so a step
    /// of 0.1 holds 0.3 exactly; a step unset, unread or not above zero holds nothing.
    /// </summary>
    private bool IsOffStepNoLock(UIGateValue step, UIGateValue? min, object value, object?[] dynamicParameters)
    {
        if (value is not decimal written || ReadDecimalNoLock(step, dynamicParameters) is not decimal size || size <= 0)
            return false;

        var origin = min is { } bound && ReadDecimalNoLock(bound, dynamicParameters) is decimal lower ? lower : 0m;

        return (written - origin) % size != 0;
    }

    /// <summary>
    /// Whether a text runs past its field's <c>MaxLength</c>, in UTF-16 units as the browser's <c>maxlength</c> counts them; a length
    /// unset, unread or not a number holds nothing.
    /// </summary>
    private bool IsTooLongNoLock(UIGateValue maxLength, string text, CompiledUIBindingResolution resolution, object?[] dynamicParameters)
    {
        if (ReadDecimalNoLock(maxLength, dynamicParameters) is not decimal limit || text.Length <= limit)
            return false;

        // A value the controller set past the length is shortened a character at a time, as the browser lets the reader do.
        return resolution.Source.Kind != CompiledUIBindingSourceKind.Controller || TryGetControllerValue(resolution.Path) is not string held || text.Length > held.Length;
    }

    private static bool IsChoice(UIProperty property)
        => property == ISelectableItemsComponent.SelectedKeyProperty || property == ISelectableItemsComponent.SelectedKeysProperty;

    /// <summary>
    /// Whether a choice takes a row that may not be chosen or is disabled; only a row newly chosen counts, since one chosen before it
    /// closed stays chosen on the client too. Each row is looked up by its key.
    /// </summary>
    private bool IsChoiceRefusedNoLock(UIComponentGateIndex gates, UIRowGates rows, ClientValueUIUpdate update, CompiledUIBindingResolution resolution)
    {
        if (update.Address.Component.DynamicParameters.Length != rows.Abilities.RowParameterCount - 1)
            return false;

        // Rows wearing a template by the item's kind have no one template whose chain answers for every row.
        UIComponentGates? template = rows.TemplateRootId is UIComponentId rootId && gates.TryGet(rootId, out UIComponentGates? found) ? found : null;
        var current = resolution.Source.Kind == CompiledUIBindingSourceKind.Controller ? TryGetControllerValue(resolution.Path) : null;

        foreach (var key in ReadChosenKeys(update.Value))
        {
            if (IsChosen(current, key))
                continue;

            var rowParameters = AppendDynamicParameter(update.Address.Component.DynamicParameters, key);

            if ((template is not null && IsClosedNoLock(template.Chain, rowParameters)) || IsRowRefusedNoLock(rows.Abilities, UIComponentGateKind.CanSelect, rowParameters))
                return true;
        }

        return false;
    }

    /// <summary>The keys a choice names: one key, or a list of them as the wire carries it.</summary>
    private static IEnumerable<string> ReadChosenKeys(object? value)
    {
        if (value is string key)
            return [key];

        return RecursiveValueCoercion.TryCoerce(value, typeof(IReadOnlyList<string>), out var keys) && keys is IEnumerable<string> list ? list : [];
    }

    private static bool IsChosen(object? current, string key)
    {
        if (current is string chosen)
            return string.Equals(chosen, key, StringComparison.Ordinal);

        if (current is not IEnumerable chosenKeys)
            return false;

        foreach (var chosenKey in chosenKeys)
        {
            if (chosenKey is string text && string.Equals(text, key, StringComparison.Ordinal))
                return true;
        }

        return false;
    }

    /// <summary>The ability a row's own write needs: a rename's title its <c>CanRename</c>, a tree node's new folder its <c>CanDrag</c>.</summary>
    private static UIComponentGateKind? WriteAbility(UIProperty property)
    {
        // A tree node's RenamedTitle is the same key, by name.
        if (property == TabItemComponent.RenamedTitleProperty)
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
    {
        for (var i = 0; i < gates.Length; i++)
        {
            if (IsClosedNoLock(gates[i], dynamicParameters))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Whether one gate closes the component for the row keys given: a static closing value, or the controller's value now. A value
    /// the server cannot read — a row that is not there, a binding with more keys than the call names — closes nothing.
    /// </summary>
    private bool IsClosedNoLock(UIComponentGate gate, object?[] dynamicParameters)
        => gate.Binding is null || (TryReadGateNoLock(gate, dynamicParameters, out var value) && UIComponentGateIndex.Closes(gate.Kind, value));

    /// <summary>
    /// The controller's value a bound gate reads for the row keys given, in the property's own shape; false for a row that is not there
    /// or a binding with more keys than the call names.
    /// </summary>
    private bool TryReadGateNoLock(UIComponentGate gate, object?[] dynamicParameters, out object? value)
    {
        value = null;

        if (gate.Binding is not CompiledUIBinding binding || !TryResolveGatePath(gate, dynamicParameters, out RecursivePath path) || !Controller.TryGetRecursiveValue(path, out var read))
            return false;

        value = UIBoundValueConverter.Convert(read, binding.TargetValueType);
        return true;
    }
}
