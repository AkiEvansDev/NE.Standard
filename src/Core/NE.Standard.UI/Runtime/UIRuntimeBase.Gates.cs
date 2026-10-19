using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
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
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Security;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // The refusals logged as warnings in the current minute, and when it ends (Environment.TickCount64). Guarded by _stateLock.
    private int _refusalWarnings;
    private long _refusalMinuteEnd;

    private UIComponentGateIndex Gates => field ??= UIComponentGateIndex.For(View);

    // The components authored hidden a command's show opened, per page it reached; recorded where an answer or a push is sent.
    private readonly UIShownByCommand _shownByCommand = new();

    /// <summary>
    /// Refuses a command raised on a component the server knows is disabled, loading or hidden — by a static value or the
    /// controller, itself or an ancestor; a host's row event answers to the row it names as well. A row's move, removal or rename
    /// is refused where the row's template or its own item says it may not be dragged, removed or renamed.
    /// </summary>
    /// <remarks>
    /// Refused as an unauthorised command is, so the reader is told the same way; what only the client knows is not read. A drop
    /// (<c>OnDrop</c>) is the command's to judge, as <c>UIDrop</c> says. A row is named by its key, a text: anything else where a
    /// row's key stands is a forged address, which would reach a row by its place past every gate read by key.
    /// </remarks>
    private void EnsureEventTargetOpenNoLock(CompiledUIEvent compiledEvent, object?[] dynamicParameters, string instanceId)
    {
        UIComponentGateIndex gates = Gates;

        if (gates.IsEmpty)
            return;

        UIComponentId componentId = compiledEvent.Address.ComponentId;

        // The row's template root stands under the host, so its chain answers for the host too. Past the host's own keys stands a row's
        // key, unless the event reads a value of its own there (a row's index, a drop).
        if (gates.TryGetRows(componentId, out UIRowGates rows)
            && dynamicParameters.Length >= rows.Abilities.RowParameterCount
            && !ReadsEventValueAt(compiledEvent, rows.Abilities.RowParameterCount - 1))
        {
            if (dynamicParameters[rows.Abilities.RowParameterCount - 1] is not string)
                throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row by something other than its key.");

            if (rows.TemplateRootId is UIComponentId rootId)
                componentId = rootId;
        }

        if (gates.TryGet(componentId, out UIComponentGates? target) && ClosingGateNoLock(target!.Chain, dynamicParameters, instanceId) is not null)
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a component that is disabled, loading or hidden.");

        if (!gates.TryGetRowRoot(compiledEvent.Address.ComponentId, out UIRowAbilities? row) || !IsRowsOwnEvent(compiledEvent.Address.EventName))
            return;

        // A row's own event is the row's whatever its ability: one named by anything but its key is a forged address.
        if (!IsNamedByKey(row!, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' names a row by something other than its key.");

        if (EventAbility(compiledEvent.Address.EventName) is UIComponentGateKind ability && IsRowRefusedNoLock(row!, ability, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a row whose {ability} is false.");
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
        => eventName is EventNames.TabMenuEntry || EventAbility(eventName) is not null;

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
    /// says false; or the row is not named by its key, a text — an index would reach a row by its place, past its item's word. A row
    /// not there refuses nothing, as a gate the server cannot read closes nothing.
    /// </summary>
    /// <remarks>The item is read only here, on a row's own event or write, never on a render or an ordinary value.</remarks>
    private bool IsRowRefusedNoLock(UIRowAbilities row, UIComponentGateKind ability, object?[] dynamicParameters)
    {
        var count = row.RowParameterCount;

        if (dynamicParameters.Length < count || dynamicParameters[count - 1] is not string key)
            return true;

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
    private bool IsWriteRefusedNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, string instanceId, ref ClientValueRead? read)
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

        if (gates.TryGet(componentId, out UIComponentGates? target))
        {
            if (ClosingGateNoLock(target!.Chain, dynamicParameters, instanceId) is { } closing)
            {
                // Said in the log, unlike a disabled or loading one's: a page writes to a hidden field only by the author's design (a
                // picker opened from elsewhere) or by a forged call, and the field going back to its value says nothing to either.
                if (closing.Kind == UIComponentGateKind.Visibility && View.Graph.TryGet(componentId, out UIComponentNode? node))
                    TryLog((property, node, level: RefusalLevelNoLock()), static (logger, state) => Log.HiddenWriteRefused(logger, state.level, state.property.Name, state.node.TypeKey, state.node.AuthoringId));

                return true;
            }

            if ((target.ReadOnly is { } readOnly && IsClosedNoLock(readOnly, dynamicParameters))
                || (target.Values is { } checks && IsValueRefusedNoLock(checks, update, resolution, ref read)))
            {
                return true;
            }
        }

        if (IsChoice(property))
            return gates.TryGetRows(componentId, out UIRowGates rows) && IsChoiceRefusedNoLock(gates, rows, update, resolution);

        return WriteAbility(property) is UIComponentGateKind ability && gates.TryGetRowRoot(componentId, out UIRowAbilities? row) && IsRowRefusedNoLock(row!, ability, dynamicParameters);
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
        IReadOnlyList<string> keys = ReadChosenKeys(update.Value);

        // Many keys look the choice up in a set made once, not each along a long selection; one key, the common write, needs no set.
        HashSet<string>? chosen = keys.Count > 1 ? ToChosenSet(current) : null;

        for (var i = 0; i < keys.Count; i++)
        {
            var key = keys[i];

            if (chosen?.Contains(key) ?? IsChosen(current, key))
                continue;

            var rowParameters = AppendDynamicParameter(update.Address.Component.DynamicParameters, key);

            if ((template is not null && IsClosedNoLock(template.Chain, rowParameters)) || IsRowRefusedNoLock(rows.Abilities, UIComponentGateKind.CanSelect, rowParameters))
                return true;
        }

        return false;
    }

    /// <summary>The keys a choice names: one key, or a list of them as the wire carries it.</summary>
    private static IReadOnlyList<string> ReadChosenKeys(object? value)
    {
        if (value is string key)
            return [key];

        return RecursiveValueCoercion.TryCoerce(value, typeof(IReadOnlyList<string>), out var keys) && keys is IReadOnlyList<string> list ? list : [];
    }

    /// <summary>The keys chosen now — one key, or a list of them — as a set; empty where nothing is chosen.</summary>
    private static HashSet<string> ToChosenSet(object? current)
    {
        HashSet<string> chosen = new(StringComparer.Ordinal);

        if (current is string key)
        {
            _ = chosen.Add(key);
        }
        else if (current is IEnumerable keys)
        {
            foreach (var chosenKey in keys)
            {
                if (chosenKey is string text)
                    _ = chosen.Add(text);
            }
        }

        return chosen;
    }

    /// <summary>Whether a key is among those chosen now: one key, or a list of them.</summary>
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
    /// The first of the gates that closes the component for the page <paramref name="instanceId"/>: a static Hidden a show it received
    /// opened passes, as the page shows that component (<see cref="UIShownByCommand"/>).
    /// </summary>
    private UIComponentGate? ClosingGateNoLock(UIComponentGate[] gates, object?[] dynamicParameters, string instanceId)
    {
        for (var i = 0; i < gates.Length; i++)
        {
            if (IsClosedNoLock(gates[i], dynamicParameters) && !_shownByCommand.Lifts(instanceId, gates[i], dynamicParameters))
                return gates[i];
        }

        return null;
    }

    /// <summary>The components authored hidden that <paramref name="effects"/> sent to <paramref name="page"/> show or hide again there.</summary>
    private void FollowShownByCommand(UIHandle page, IReadOnlyList<ClientEffect> effects)
        => _shownByCommand.Follow(page.Instance.Id, effects, Gates);

    /// <inheritdoc />
    void IUIRuntimeConnectionUpdater.FollowSent(UIHandle page, IReadOnlyList<ClientEffect> effects)
        => FollowShownByCommand(page, effects);

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
