using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Testing;

/// <summary>A value the page owes the server: one an interaction wrote to a property bound to write back.</summary>
internal sealed record UITestWrite(UIPropertyAddress Address, object? Value);

/// <summary>The server's refusal of a field's value, shown until a value it takes replaces it.</summary>
internal sealed record UITestRefusal(UIPhrase Message, UIValidationSeverity Severity);

/// <summary>What the page knows of one field: the rules it fails, whether the reader has been in it, and the server's refusal.</summary>
internal sealed class UITestField
{
    public HashSet<CompiledUIValidationRule> Failing { get; } = [];

    public bool Touched { get; set; }

    public UITestRefusal? Refusal { get; set; }
}

public sealed partial class UITestPage
{
    // The client's own bound on a chain of interactions answering each other.
    private const int MaxInteractionDepth = 8;

    /// <summary>
    /// Writes a value as a reader does: typed in — the field's change rules and the interactions reading it run — committed to the
    /// server, or held for its form's submit where its binding says so, then the field's change command, then its blur rules.
    /// </summary>
    internal async Task<UITestCommandResult> SetValueAsync(UIComponentId componentId, object?[] rowKeys, UIProperty property, object? value, CancellationToken cancellationToken)
    {
        UIComponentNode node = EnsureActionable(componentId, rowKeys, "write to");

        if (Read(componentId, rowKeys, IInputComponent.IsReadOnlyProperty) is true)
            throw new InvalidOperationException($"'{node.AuthoringId}' is read-only: a reader cannot write to it.");

        UIPropertyAddress address = new(new UIComponentAddress(componentId, rowKeys), property);
        CompiledUIBinding? binding = BindingOf(componentId, property);
        List<UITestWrite> writes = [];
        int mark;

        lock (_sync)
        {
            mark = _effects.Count;
            FieldNoLock(address.Component).Touched = true;
            WriteValueNoLock(address, value, local: true, depth: 0, writes);

            if (binding is { Mode: UIBindingMode.OnSubmit })
                _held[address] = value;
        }

        if (binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            writes.Insert(0, new UITestWrite(address, value));

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        bool refused;

        lock (_sync)
            refused = FieldNoLock(address.Component).Refusal is not null;

        // An .OnChange command never runs for a value the server refused.
        UITestCommandResult result = refused
            ? UITestCommandResult.Refused($"The server refused the value written to '{node.AuthoringId}'.")
            : View.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Change), out _)
                ? await DispatchCoreAsync(componentId, rowKeys, EventNames.Change, [], cancellationToken).ConfigureAwait(false)
                : UITestCommandResult.RanOnPage(EffectsSince(mark));

        // The reader leaves the field.
        lock (_sync)
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Blur, property: null);

        return result;
    }

    /// <summary>The component, where a reader could act on it: shown, and neither disabled nor loading.</summary>
    private UIComponentNode EnsureActionable(UIComponentId componentId, object?[] rowKeys, string act)
    {
        UIComponentNode node = View.Graph.GetRequired(componentId);

        if (!IsShown(componentId, rowKeys))
            throw new InvalidOperationException($"'{node.AuthoringId}' is not shown: a reader cannot {act} it.");

        if (!IsEnabled(componentId, rowKeys))
            throw new InvalidOperationException($"'{node.AuthoringId}' is disabled or loading: a reader cannot {act} it.");

        return node;
    }

    /// <summary>Raises an event as a reader's gesture does: refused on a component a reader could not reach.</summary>
    internal Task<UITestCommandResult> DispatchAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        _ = EnsureActionable(componentId, rowKeys, $"raise '{eventName}' on");

        return DispatchCoreAsync(componentId, rowKeys, eventName, eventKeys, cancellationToken);
    }

    /// <summary>
    /// The event's command — behind its form's submit rules, which refuse it while a field is in error, and its held values — or, with
    /// no command, only the interactions it drives.
    /// </summary>
    private async Task<UITestCommandResult> DispatchCoreAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        UIComponentAddress source = new(componentId, rowKeys);

        if (!View.Events.TryGet(new CompiledUIEventAddress(componentId, eventName), out CompiledUIEvent? compiled))
        {
            List<UITestWrite> writes = [];
            int mark;

            lock (_sync)
            {
                mark = _effects.Count;
                RunEventInteractionsNoLock(source, eventName, writes);
            }

            await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

            return UITestCommandResult.RanOnPage(EffectsSince(mark));
        }

        if (eventName == EventNames.Click && Read(componentId, rowKeys, ButtonComponent.SubmitFormIdProperty) is string { Length: > 0 } formId)
        {
            bool valid;

            lock (_sync)
                valid = RunSubmitValidationNoLock(formId);

            if (!valid)
                return UITestCommandResult.Refused($"The form '{formId}' has a field in error.");

            await SubmitHeldValuesAsync(formId, cancellationToken).ConfigureAwait(false);
        }

        UICommandRequest request = new() { EventId = compiled.Id, DynamicParameters = [.. rowKeys, .. eventKeys] };

        return await SendCommandAsync(request, source, eventName, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Evaluates every field of the form up front, so all its failures show; only an error refuses the submit.</summary>
    private bool RunSubmitValidationNoLock(string formId)
    {
        var valid = true;

        foreach (UIComponentNode node in View.Graph.All)
        {
            // A field in a list's rows is left out: which rows a submit reaches is the page's DOM, not modelled here.
            if (RowRoots(node.ComponentId).Count != 0 || !string.Equals(ReadNoLock(node.ComponentId, [], IInputComponent.FormIdProperty) as string, formId, StringComparison.Ordinal))
                continue;

            UIComponentAddress field = new(node.ComponentId, []);

            FieldNoLock(field).Touched = true;
            EvaluateRulesNoLock(field, UIValidationTrigger.Submit, property: null);

            if (HasErrorNoLock(field))
                valid = false;
        }

        return valid;
    }

    // A controller's bound message gates no submit: its author judged the value and will judge it again.
    private bool HasErrorNoLock(UIComponentAddress component)
    {
        UITestField field = FieldNoLock(component);

        if (field.Refusal?.Severity == UIValidationSeverity.Error)
            return true;

        foreach (CompiledUIValidationRule rule in field.Failing)
        {
            if (rule.Severity == UIValidationSeverity.Error)
                return true;
        }

        return false;
    }

    /// <summary>Sends what a form's fields held back for its submit.</summary>
    private Task SubmitHeldValuesAsync(string formId, CancellationToken cancellationToken)
    {
        List<UITestWrite> writes = [];

        lock (_sync)
        {
            foreach (KeyValuePair<UIPropertyAddress, object?> held in _held)
            {
                if (string.Equals(ReadNoLock(held.Key.Component.Id, held.Key.Component.DynamicParameters, IInputComponent.FormIdProperty) as string, formId, StringComparison.Ordinal))
                    writes.Add(new UITestWrite(held.Key, held.Value));
            }

            foreach (UITestWrite write in writes)
                _ = _held.Remove(write.Address);
        }

        return SendValuesAsync(writes, cancellationToken);
    }

    /// <summary>Sends a command and applies its answer, the event's before- and after- interactions around it.</summary>
    private async Task<UITestCommandResult> SendCommandAsync(UICommandRequest request, UIComponentAddress? source, string? eventName, CancellationToken cancellationToken)
    {
        List<UITestWrite> writes = [];
        int mark;

        lock (_sync)
        {
            mark = _effects.Count;

            if (source is UIComponentAddress before)
                RunEventInteractionsNoLock(before, $"before-{eventName}", writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        UICommandExecutionResult result = await _app.Host.ProcessEventAsync(_resolution.Handle, request, cancellationToken).ConfigureAwait(false);

        writes.Clear();

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(_instanceId));
            ApplyEffectsNoLock(result.Command.Effects);

            if (source is UIComponentAddress after)
                RunEventInteractionsNoLock(after, $"after-{eventName}", writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);

        return UITestCommandResult.Answered(result.Command.Success, result.Command.Error, EffectsSince(mark));
    }

    /// <summary>Sends values to the server in one change set and applies the answer — a refusal among them.</summary>
    private async Task SendValuesAsync(List<UITestWrite> writes, CancellationToken cancellationToken)
    {
        if (writes.Count == 0 || _resolution.Runtime is null)
            return;

        ClientUIUpdate[] updates = new ClientUIUpdate[writes.Count];

        for (var i = 0; i < writes.Count; i++)
        {
            UIPropertyAddress address = writes[i].Address;

            updates[i] = new ClientValueUIUpdate
            {
                Address = new UIPropertyAddress(address.Component.Id, address.Property),
                DynamicParameters = address.Component.DynamicParameters,
                Value = writes[i].Value
            };

            // The value it takes clears a refusal of the one before; a new refusal comes back in the answer.
            lock (_sync)
                FieldNoLock(address.Component).Refusal = null;
        }

        ServerChangeSet answer = await _app.Host.ProcessChangeSetAsync(_resolution.Handle, new ClientChangeSet { Updates = updates }, cancellationToken).ConfigureAwait(false);

        Receive(answer);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    private List<ClientEffect> EffectsSince(int mark)
    {
        lock (_sync)
            return _effects.GetRange(mark, _effects.Count - mark);
    }


    /// <summary>
    /// Holds a value at an address — sent, typed, or an interaction's — and runs what reads it: the field's change rules and the
    /// interactions whose source it is; a value an interaction wrote locally to a property bound to write back is owed to the server.
    /// </summary>
    private void WriteValueNoLock(UIPropertyAddress address, object? value, bool local, int depth, List<UITestWrite> writes)
    {
        _values[address] = value;

        if (address.Property == IInputComponent.ValidationProperty)
            FieldNoLock(address.Component).Touched = true;
        else
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Change, address.Property);

        if (depth > MaxInteractionDepth)
            return;

        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new UIPropertyAddress(address.Component.Id, address.Property)))
            ApplyInteractionNoLock(interaction, address.Component.DynamicParameters, local, value, depth, writes);
    }

    private void RunEventInteractionsNoLock(UIComponentAddress source, string eventName, List<UITestWrite> writes)
    {
        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new CompiledUIEventAddress(source.Id, eventName)))
            ApplyInteractionNoLock(interaction, source.DynamicParameters, local: true, sourceValue: true, depth: 0, writes);
    }

    /// <summary>An interaction as the client runs it: its effect while the condition holds, else the value it writes to its target.</summary>
    private void ApplyInteractionNoLock(CompiledUIInteraction interaction, object?[] rowKeys, bool local, object? sourceValue, int depth, List<UITestWrite> writes)
    {
        var matches = UIComparisonEvaluator.Evaluate(sourceValue, interaction.Operator, interaction.Value);

        if (interaction.ActionKind == UIInteractionActionKind.Effect)
        {
            if (matches && interaction.Effect is { } effect)
                ApplyEffectsNoLock([effect]);

            return;
        }

        if (interaction.Target is not UIPropertyAddress target)
            return;

        var next = interaction.ActionKind == UIInteractionActionKind.CopyValue
            ? IsBlank(sourceValue) ? interaction.FalseValue : sourceValue
            : matches ? interaction.TrueValue : interaction.FalseValue;
        var keys = rowKeys[..Math.Min(rowKeys.Length, RowRoots(target.Component.Id).Count)];
        UIPropertyAddress address = new(new UIComponentAddress(target.Component.Id, keys), target.Property);

        WriteValueNoLock(address, next, local, depth + 1, writes);

        // Only what the page wrote itself: an interaction answering a server change must not echo it back.
        if (local && BindingOf(target.Component.Id, target.Property) is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            writes.Add(new UITestWrite(address, next));
    }

    private static bool IsBlank(object? value)
        => value is null || (value is string text && string.IsNullOrWhiteSpace(text));

    /// <summary>Evaluates a field's rules of one trigger against the value it holds — those on <paramref name="property"/> alone where given.</summary>
    private void EvaluateRulesNoLock(UIComponentAddress component, UIValidationTrigger trigger, UIProperty? property)
    {
        IReadOnlyList<CompiledUIValidationRule> rules = View.Validations.GetByComponent(component.Id);

        if (rules.Count == 0)
            return;

        UITestField field = FieldNoLock(component);

        foreach (CompiledUIValidationRule rule in rules)
        {
            if (rule.Trigger != trigger || (property is UIProperty only && rule.Target.Property != only))
                continue;

            var value = ReadNoLock(component.Id, component.DynamicParameters, rule.Target.Property);

            if (UIComparisonEvaluator.Evaluate(value, rule.Operator, rule.Value))
                _ = field.Failing.Remove(rule);
            else
                _ = field.Failing.Add(rule);
        }
    }

    /// <summary>
    /// The strongest message a field shows: the server's refusal, the controller's bound message, or a failing rule's once the reader
    /// has been in the field — the graver first, the first of equals.
    /// </summary>
    internal (UIPhrase Message, UIValidationSeverity Severity)? Message(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
        {
            UIComponentAddress component = new(componentId, rowKeys);
            UITestField field = FieldNoLock(component);
            (UIPhrase Message, UIValidationSeverity Severity)? strongest = null;

            if (field.Refusal is { } refusal)
                strongest = (refusal.Message, refusal.Severity);

            if (ReadNoLock(componentId, rowKeys, IInputComponent.ValidationProperty) is UIValidationMessage bound && Graver(bound.Severity, strongest))
                strongest = (bound.Message, bound.Severity);

            if (!field.Touched)
                return strongest;

            foreach (CompiledUIValidationRule rule in View.Validations.GetByComponent(componentId))
            {
                if (field.Failing.Contains(rule) && Graver(rule.Severity, strongest))
                    strongest = (rule.Message, rule.Severity);
            }

            return strongest;
        }
    }

    private static bool Graver(UIValidationSeverity severity, (UIPhrase Message, UIValidationSeverity Severity)? than)
        => than is null || severity < than.Value.Severity;
}
