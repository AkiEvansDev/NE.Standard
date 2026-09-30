using System;
using System.Collections;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Resolution;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // Any component's IsOpen, a package's popup included, not the flyout's alone: a popup's close arrives from an outside click or
    // Escape, which nothing on the client refuses, so it is never answered with a reopening.
    private static readonly UIProperty PopupOpenProperty = new("IsOpen");

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
    /// read-only, or — for a choice of rows — a newly chosen row that may not be chosen or is disabled.
    /// </summary>
    private bool IsWriteRefusedNoLock(ClientValueUIUpdate update)
    {
        UIComponentGateIndex gates = Gates;

        if (gates.IsEmpty || (update.Address.Property == PopupOpenProperty && update.Value is false))
            return false;

        UIComponentId componentId = update.Address.Component.Id;
        var dynamicParameters = update.DynamicParameters;

        if (gates.TryGet(componentId, out UIComponentGates? target)
            && (IsClosedNoLock(target!.Chain, dynamicParameters) || (target.ReadOnly is { } readOnly && IsClosedNoLock(readOnly, dynamicParameters))))
        {
            return true;
        }

        return IsChoice(update.Address.Property) && gates.TryGetRows(componentId, out UIRowGates rows) && IsChoiceRefusedNoLock(gates, rows, update);
    }

    private static bool IsChoice(UIProperty property)
        => property == ISelectableItemsComponent.SelectedKeyProperty || property == ISelectableItemsComponent.SelectedKeysProperty;

    /// <summary>
    /// Whether a choice takes a row that may not be chosen or is disabled; only a row newly chosen counts, since one chosen before it
    /// closed stays chosen on the client too. Each row is looked up by its key.
    /// </summary>
    private bool IsChoiceRefusedNoLock(UIComponentGateIndex gates, UIRowGates rows, ClientValueUIUpdate update)
    {
        if (!gates.TryGet(rows.TemplateRootId, out UIComponentGates? row) || update.DynamicParameters.Length != rows.RowParameterCount - 1)
            return false;

        CompiledUIBindingResolution resolution = View.Bindings.Resolve(update.Address, update.DynamicParameters);
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
    private ServerValueUIUpdate AnswerRefusedWriteNoLock(ClientValueUIUpdate update)
    {
        CompiledUIBindingResolution resolution = View.Bindings.Resolve(update.Address, update.DynamicParameters);

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
    {
        if (gate.Binding is not CompiledUIBinding binding)
            return true;

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

        return Controller.TryGetRecursiveValue(path, out var value) && UIComponentGateIndex.Closes(gate.Kind, UIBoundValueConverter.Convert(value, binding.TargetValueType));
    }
}
