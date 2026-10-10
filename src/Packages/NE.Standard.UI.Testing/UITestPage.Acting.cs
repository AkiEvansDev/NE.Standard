using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Text;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Localization;
using NE.Standard.UI.Shell.Updates.Client;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Testing;

/// <summary>A value the page owes the server: one an interaction wrote to a property bound to write back.</summary>
internal sealed record UITestWrite(UIPropertyAddress Address, object? Value);

/// <summary>The server's refusal of a field's value, shown until a value it takes replaces it or the controller gives that property again.</summary>
internal sealed record UITestRefusal(UIPhrase Message, UIValidationSeverity Severity, UIProperty Property);

/// <summary>
/// What the page knows of one field: the rules it fails, whether the reader has been in it, the server's refusal, and the page's own
/// of a value past the field's bounds.
/// </summary>
internal sealed class UITestField
{
    public HashSet<CompiledUIValidationRule> Failing { get; } = [];

    public bool Touched { get; set; }

    public UITestRefusal? Refusal { get; set; }

    public UIPhrase? BoundRefusal { get; set; }
}

public sealed partial class UITestPage
{
    // The client's own bound on a chain of interactions answering each other.
    private const int MaxInteractionDepth = 8;

    /// <summary>
    /// Writes a value as a reader does: typed in — the field's change rules and the interactions reading it run — judged against its
    /// bounds, committed to the server, or held for its form's submit where its binding says so, then the field's change command,
    /// then its blur rules.
    /// </summary>
    internal async Task<UITestCommandResult> SetValueAsync(UIComponentId componentId, object?[] rowKeys, UIProperty property, object? value, CancellationToken cancellationToken)
    {
        UIComponentNode node = EnsureActionable(componentId, rowKeys, "write to");

        if (Read(componentId, rowKeys, IInputComponent.IsReadOnlyProperty) is true)
            throw new InvalidOperationException($"'{node.AuthoringId}' is read-only: a reader cannot write to it.");

        EnsureGivable(node, rowKeys, property, value);

        UIPropertyAddress address = new(new UIComponentAddress(componentId, rowKeys), property);
        CompiledUIBinding? binding = BindingOf(componentId, property);
        List<UITestWrite> writes = [];
        int mark;
        bool outOfBounds;

        lock (_sync)
        {
            mark = _effects.Count;
            FieldNoLock(address.Component).Touched = true;

            // From the first edit on, the server's value waits aside for a discard to put back; a push meanwhile lands there.
            if (binding is { Mode: UIBindingMode.OnSubmit } && !_held.ContainsKey(address))
                _serverValues[address] = ReadNoLock(componentId, rowKeys, property);

            WriteValueNoLock(address, value, local: true, depth: 0, writes);
            outOfBounds = JudgeBoundsNoLock(address.Component);

            if (binding is { Mode: UIBindingMode.OnSubmit })
                _held[address] = value;
        }

        // A value past the bounds stays the reader's and is never sent: the controller keeps the last one it took.
        if (!outOfBounds && binding is { Mode: UIBindingMode.TwoWay or UIBindingMode.OneWayToSource })
            writes.Insert(0, new UITestWrite(address, value));

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        bool refused;

        lock (_sync)
            refused = FieldNoLock(address.Component).Refusal is not null;

        // An .OnChange command never runs for a value the page or the server refused.
        UITestCommandResult result = outOfBounds || refused
            ? UITestCommandResult.Refused($"The {(outOfBounds ? "page" : "server")} refused the value written to '{node.AuthoringId}'.")
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

    /// <summary>
    /// Refuses a value no reader could give the field: a slider's or a calendar's past its bounds, which it never moves to, and a
    /// number its field strips as it is typed — a negative where it takes none, a fraction where it takes whole numbers.
    /// </summary>
    private void EnsureGivable(UIComponentNode node, object?[] rowKeys, UIProperty property, object? value)
    {
        if (node.TypeKey == NumberInputComponent.ComponentTypeKey && AsNumber(value) is double number)
        {
            if (number < 0 && Read(node.ComponentId, rowKeys, NumberInputComponent.AllowNegativeProperty) is false)
                throw new InvalidOperationException($"'{node.AuthoringId}' takes no negative number: a reader cannot type {UIScriptNumber.Format(number)}.");

            if (number != Math.Truncate(number) && Read(node.ComponentId, rowKeys, NumberInputComponent.AllowDecimalsProperty) is false)
                throw new InvalidOperationException($"'{node.AuthoringId}' takes whole numbers: a reader cannot type {UIScriptNumber.Format(number)}.");

            return;
        }

        if ((node.TypeKey != SliderComponent.ComponentTypeKey && node.TypeKey != CalendarComponent.ComponentTypeKey) || !IsValueProperty(property))
            return;

        if (Order(value, Read(node.ComponentId, rowKeys, IBoundedInputComponent.MinProperty)) < 0 || Order(value, Read(node.ComponentId, rowKeys, IBoundedInputComponent.MaxProperty)) > 0)
            throw new InvalidOperationException($"'{node.AuthoringId}' moves only between its Min and Max: a reader cannot give it {value}.");
    }

    /// <summary>
    /// Judges a field's value against its <c>Min</c> and <c>Max</c> as the page does — a number field's, a temporal control's, both
    /// ends of a period — and keeps the words on the field; answers whether it is refused. A refusal of the server's spoke of a value
    /// since replaced.
    /// </summary>
    private bool JudgeBoundsNoLock(UIComponentAddress component)
    {
        UITestField field = FieldNoLock(component);

        field.BoundRefusal = BoundRefusalNoLock(component);

        if (field.BoundRefusal is null)
            return false;

        field.Refusal = null;
        return true;
    }

    /// <summary>The words a value past the bounds is refused in, the bound named; null inside them, or for a field the page does not judge so.</summary>
    private UIPhrase? BoundRefusalNoLock(UIComponentAddress component)
    {
        var keys = component.DynamicParameters;
        var min = ReadNoLock(component.Id, keys, IBoundedInputComponent.MinProperty);
        var max = ReadNoLock(component.Id, keys, IBoundedInputComponent.MaxProperty);
        var moment = IsMoment(min ?? max);

        // A slider never stands past them, and a field the reader cannot change shows its value as it is.
        if ((min is null && max is null) || (!moment && View.Graph.GetRequired(component.Id).TypeKey != NumberInputComponent.ComponentTypeKey) || ReadNoLock(component.Id, keys, IInputComponent.IsReadOnlyProperty) is true)
            return null;

        UIProperty[] ends = ReadNoLock(component.Id, keys, IPeriodInputComponent.IsRangeProperty) is true ? [IInputComponent.ValueProperty, IPeriodInputComponent.EndValueProperty] : [IInputComponent.ValueProperty];

        foreach (UIProperty end in ends)
        {
            var value = ReadNoLock(component.Id, keys, end);

            if (Order(value, min) < 0)
                return UIPhrase.Of(moment ? UIStrings.ValueNotBefore : UIStrings.ValueAtLeast, ("min", min));

            if (Order(value, max) > 0)
                return UIPhrase.Of(moment ? UIStrings.ValueNotAfter : UIStrings.ValueAtMost, ("max", max));
        }

        return null;
    }

    private static bool IsMoment(object? value)
        => value is DateOnly or TimeOnly or DateTime or DateTimeOffset;

    private static bool IsValueProperty(UIProperty property)
        => property == IInputComponent.ValueProperty || property == IPeriodInputComponent.EndValueProperty;

    /// <summary>A value's order against a bound: as numbers, or as moments of one type; null where the two do not compare, or either is none.</summary>
    private static int? Order(object? value, object? bound)
    {
        if (value is null || bound is null)
            return null;

        if (AsNumber(value) is double number && AsNumber(bound) is double limit)
            return number.CompareTo(limit);

        return value.GetType() == bound.GetType() && value is IComparable comparable ? comparable.CompareTo(bound) : null;
    }

    // As the page reads a number, a double whatever type the controller holds; null for no number, NaN or an infinity.
    private static double? AsNumber(object? value)
        => UIScriptNumber.TryRead(value, out var number) && double.IsFinite(number) ? number : null;

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

        if (SubmittedForm(compiled, componentId, rowKeys, eventName) is string formId)
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

    /// <summary>The form an event submits: a submit button's on its click, or the field's own where its event submits it (a code field's save).</summary>
    private string? SubmittedForm(CompiledUIEvent compiled, UIComponentId componentId, object?[] rowKeys, string eventName)
    {
        if (eventName == EventNames.Click && Read(componentId, rowKeys, ButtonComponent.SubmitFormIdProperty) is string { Length: > 0 } button)
            return button;

        return compiled.SubmitsForm && Read(componentId, rowKeys, IInputComponent.FormIdProperty) is string { Length: > 0 } field ? field : null;
    }

    /// <summary>Evaluates every field of the form up front, so all its failures show; only an error refuses the submit.</summary>
    private bool RunSubmitValidationNoLock(string formId)
    {
        var valid = true;

        foreach (UIComponentNode node in View.Graph.All)
        {
            UIComponentAddress field = new(node.ComponentId, []);

            // A field in a list's rows is left out: which rows a submit reaches is the page's DOM, not modelled here.
            if (View.Graph.GetItemScopes(node.ComponentId).Count != 0 || !IsInFormNoLock(field, formId))
                continue;

            FieldNoLock(field).Touched = true;
            EvaluateRulesNoLock(field, UIValidationTrigger.Submit, property: null);

            if (HasErrorNoLock(field))
                valid = false;
        }

        return valid;
    }

    private bool IsInFormNoLock(UIComponentAddress component, string formId)
        => string.Equals(ReadNoLock(component.Id, component.DynamicParameters, IInputComponent.FormIdProperty) as string, formId, StringComparison.Ordinal);

    // A controller's bound message gates no submit: its author judged the value and will judge it again.
    private bool HasErrorNoLock(UIComponentAddress component)
    {
        UITestField field = FieldNoLock(component);

        if (field.BoundRefusal is not null || field.Refusal?.Severity == UIValidationSeverity.Error)
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
                if (IsInFormNoLock(held.Key.Component, formId))
                    writes.Add(new UITestWrite(held.Key, held.Value));
            }

            foreach (UITestWrite write in writes)
            {
                _ = _held.Remove(write.Address);
                _ = _serverValues.Remove(write.Address);
            }
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

            updates[i] = new ClientValueUIUpdate { Address = address, Value = writes[i].Value };

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
        var keys = rowKeys[..Math.Min(rowKeys.Length, View.Graph.GetItemScopes(target.Component.Id).Count)];
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
    /// The strongest message a field shows: the page's refusal of a value past its bounds, the server's refusal, the controller's bound
    /// message, or a failing rule's once the reader has been in the field — the graver first, the first of equals.
    /// </summary>
    internal (UIPhrase Message, UIValidationSeverity Severity)? Message(UIComponentId componentId, object?[] rowKeys)
    {
        lock (_sync)
        {
            UIComponentAddress component = new(componentId, rowKeys);
            UITestField field = FieldNoLock(component);
            (UIPhrase Message, UIValidationSeverity Severity)? strongest = null;

            if (field.BoundRefusal is { } outOfBounds)
                strongest = (outOfBounds, UIValidationSeverity.Error);

            if (field.Refusal is { } refusal && Graver(refusal.Severity, strongest))
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
