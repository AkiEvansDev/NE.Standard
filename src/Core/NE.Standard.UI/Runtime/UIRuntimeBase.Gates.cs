using System;
using System.Collections;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    private UIComponentGateIndex Gates => field ??= UIComponentGateIndex.For(View);

    /// <summary>
    /// Refuses a command raised on a component the server knows is disabled, loading or hidden — by a static value or the
    /// controller, itself or an ancestor; a host's row event answers to the row it names as well.
    /// </summary>
    /// <remarks>Refused as an unauthorised command is, so the reader is told the same way; what only the client knows is not read.</remarks>
    private void EnsureEventTargetOpenNoLock(CompiledUIEvent compiledEvent, object?[] dynamicParameters)
    {
        UIComponentGateIndex gates = Gates;

        if (gates.IsEmpty)
            return;

        UIComponentId componentId = compiledEvent.Address.ComponentId;

        // The row's template root stands under the host, so its chain answers for the host too. A row is named by its key, a
        // text; a number past the host's own keys is a value the event carries (a list's row dropped at an index), not a row.
        if (gates.TryGetRows(componentId, out UIRowGates rows) && dynamicParameters.Length >= rows.RowParameterCount && dynamicParameters[rows.RowParameterCount - 1] is string)
            componentId = rows.TemplateRootId;

        if (gates.TryGet(componentId, out UIComponentGates? target) && IsClosedNoLock(target!.Chain, dynamicParameters))
            throw new UnauthorizedAccessException($"Command '{compiledEvent.Command}' was raised on a component that is disabled, loading or hidden.");
    }

    /// <summary>
    /// Whether a client write lands on a component the server knows the reader may not write: closed by itself or an ancestor,
    /// read-only, a value outside its bounds or a day not on offer, or — for a choice of rows — a newly chosen row that may not be
    /// chosen or is disabled.
    /// </summary>
    private bool IsWriteRefusedNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution, ref ClientValueRead? read)
    {
        UIComponentGateIndex gates = Gates;

        // Any component's IsOpen, a package's popup included, not the flyout's alone: a popup's close arrives from an outside click or
        // Escape, which nothing on the client refuses, so it is never answered with a reopening.
        if (gates.IsEmpty || (update.Address.Property == IOpenableComponent.IsOpenProperty && update.Value is false))
            return false;

        UIComponentId componentId = update.Address.Component.Id;
        var dynamicParameters = update.DynamicParameters;

        if (gates.TryGet(componentId, out UIComponentGates? target)
            && (IsClosedNoLock(target!.Chain, dynamicParameters)
                || (target.ReadOnly is { } readOnly && IsClosedNoLock(readOnly, dynamicParameters))
                || (target.Values is { } checks && IsValueRefusedNoLock(checks, update, resolution, ref read))))
        {
            return true;
        }

        return IsChoice(update.Address.Property) && gates.TryGetRows(componentId, out UIRowGates rows) && IsChoiceRefusedNoLock(gates, rows, update, resolution);
    }

    /// <summary>
    /// Whether a value written to an input, or to a period's end, falls outside its <c>Min</c>/<c>Max</c> or on a day it does not offer.
    /// A cleared value, or text that reads as no value, is left to the ordinary path, which keeps the one and refuses the other.
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

        var dynamicParameters = update.DynamicParameters;

        return IsBeyondNoLock(checks.Min, checks.ValueType, value, dynamicParameters, below: true)
            || IsBeyondNoLock(checks.Max, checks.ValueType, value, dynamicParameters, below: false)
            || (checks.MarkedOnly is { } only
                && checks.MarkedDays is { } days
                && value is DateOnly day
                && IsClosedNoLock(only, dynamicParameters)
                && !IsMarkedNoLock(days, day, dynamicParameters));
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

    private static bool IsChoice(UIProperty property)
        => property == ISelectableItemsComponent.SelectedKeyProperty || property == ISelectableItemsComponent.SelectedKeysProperty;

    /// <summary>
    /// Whether a choice takes a row that may not be chosen or is disabled; only a row newly chosen counts, since one chosen before it
    /// closed stays chosen on the client too. Each row is looked up by its key.
    /// </summary>
    private bool IsChoiceRefusedNoLock(UIComponentGateIndex gates, UIRowGates rows, ClientValueUIUpdate update, CompiledUIBindingResolution resolution)
    {
        if (!gates.TryGet(rows.TemplateRootId, out UIComponentGates? row) || update.DynamicParameters.Length != rows.RowParameterCount - 1)
            return false;

        var current = resolution.Source.Kind == CompiledUIBindingSourceKind.Controller ? TryGetControllerValue(resolution.Path) : null;

        foreach (var key in ReadChosenKeys(update.Value))
        {
            if (IsChosen(current, key))
                continue;

            var rowParameters = AppendDynamicParameter(update.DynamicParameters, key);

            if (IsClosedNoLock(row!.Chain, rowParameters) || (row.CanSelect is { } canSelect && IsClosedNoLock(canSelect, rowParameters)))
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

    /// <summary>
    /// Answers a refused write with the value the server holds, so the field the reader changed goes back to it.
    /// </summary>
    private ServerValueUIUpdate AnswerRefusedWriteNoLock(ClientValueUIUpdate update, CompiledUIBindingResolution resolution)
    {
        if (resolution.Source.Kind == CompiledUIBindingSourceKind.Controller)
            return BuildServerValueNoLock(resolution.Binding, resolution.Path, update.DynamicParameters);

        // A static list's row is no value the server holds: the property's fallback answers.
        bool? content = false;

        return BuildServerValueNoLock(resolution.Binding, resolution.Path, update.DynamicParameters, value: null, ref content);
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

        if (gate.Binding is not CompiledUIBinding binding)
            return false;

        RecursivePath path;

        if (gate.FixedPath is RecursivePath fixedPath)
        {
            path = fixedPath;
        }
        else
        {
            if (dynamicParameters.Length < gate.DynamicCount)
                return false;

            // An ancestor reads the outer keys alone, outermost first.
            var parameters = dynamicParameters.Length == gate.DynamicCount ? dynamicParameters : dynamicParameters[..gate.DynamicCount];

            path = View.Bindings.Resolve(binding, parameters).Path;
        }

        if (!Controller.TryGetRecursiveValue(path, out var read))
            return false;

        value = UIBoundValueConverter.Convert(read, binding.TargetValueType);
        return true;
    }
}
