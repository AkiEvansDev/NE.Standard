using System;
using System.Collections.Generic;
using System.Globalization;
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

namespace NE.Standard.UI.Client;

/// <summary>A value the page owes the server: one an interaction wrote to a property bound to write back.</summary>
internal sealed record UIClientWrite(UIPropertyAddress Address, object? Value);

/// <summary>What an effect leaves the page to do once the act that brought it is done: a dialog's close to raise, a setting to tell the session, or an in-place navigation.</summary>
internal sealed record UIClientReaction(UIComponentId? DialogClosed = null, ClientEffect? Setting = null, IReadOnlyDictionary<string, object?>? NavigateInPlace = null, bool HasNavigateInPlace = false);

/// <summary>The server's refusal of a field's value, shown until a value it takes replaces it or the controller gives that property again.</summary>
internal sealed record UIClientRefusal(UIPhrase Message, UIValidationSeverity Severity, UIProperty Property);

/// <summary>
/// What the page knows of one field: the rules it fails, whether the reader has been in it, the server's refusal, and the page's own
/// of a value past the field's bounds.
/// </summary>
internal sealed class UIClientField
{
    public HashSet<CompiledUIValidationRule> Failing { get; } = [];

    public bool Touched { get; set; }

    public UIClientRefusal? Refusal { get; set; }

    public UIPhrase? BoundRefusal { get; set; }

    public bool GateRefused { get; set; }
}

public sealed partial class UIClientPage
{
    // The client's own bound on a chain of interactions answering each other.
    private const int MaxInteractionDepth = 8;

    /// <summary>
    /// Writes a value as a reader does: typed in — the field's change rules and the interactions reading it run — judged against its
    /// bounds, committed to the server, or held for its form's submit where its binding says so, then the field's change command,
    /// then its blur rules.
    /// </summary>
    internal async Task<UIClientCommandResult> SetValueAsync(UIComponentId componentId, object?[] rowKeys, UIProperty property, object? value, CancellationToken cancellationToken)
    {
        UIComponentNode node = EnsureActionable(componentId, rowKeys, "write to");

        if (Read(componentId, rowKeys, IInputComponent.IsReadOnlyProperty) is true)
            throw new InvalidOperationException($"'{node.AuthoringId}' is read-only: a reader cannot write to it.");

        EnsureGivable(node, rowKeys, property, value);

        UIPropertyAddress address = new(new UIComponentAddress(componentId, rowKeys), property);
        CompiledUIBinding? binding = BindingOf(componentId, property);
        List<UIClientWrite> writes = [];
        int mark;
        bool outOfBounds;

        lock (_sync)
        {
            mark = _effects.Count;
            FieldNoLock(address.Component).Touched = true;
            _ = _changedValidations.Add(address.Component);

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
            writes.Insert(0, new UIClientWrite(address, value));

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);

        bool refused;

        lock (_sync)
            refused = FieldNoLock(address.Component).Refusal is not null || FieldNoLock(address.Component).GateRefused;

        // An .OnChange command never runs for a value the page or the server refused.
        UIClientCommandResult result = outOfBounds || refused
            ? UIClientCommandResult.Refused($"The {(outOfBounds ? "page" : "server")} refused the value written to '{node.AuthoringId}'.")
            : View.Events.TryGet(new CompiledUIEventAddress(componentId, EventNames.Change), out _)
                ? await DispatchCoreAsync(componentId, rowKeys, EventNames.Change, [], cancellationToken).ConfigureAwait(false)
                : UIClientCommandResult.RanOnPage(EffectsSince(mark));

        // The reader leaves the field.
        lock (_sync)
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Blur, property: null);

        NotifyIfChanged();

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
        UIClientField field = FieldNoLock(component);

        field.BoundRefusal = BoundRefusalNoLock(component);
        _ = _changedValidations.Add(component);

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
        => UIScriptNumber.TryRead(value, out var number) ? number : null;

    /// <summary>Raises an event as a reader's gesture does: refused on a component a reader could not reach.</summary>
    internal Task<UIClientCommandResult> DispatchAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        UIComponentNode node = EnsureActionable(componentId, rowKeys, $"raise '{eventName}' on");

        // A surface or a tile that is not clickable lets its click go by, as the page's suppress mark does.
        if (eventName == EventNames.Click && Read(componentId, rowKeys, IClickableComponent.ClickableProperty) is false)
            throw new InvalidOperationException($"'{node.AuthoringId}' is not clickable: a reader cannot press it.");

        return DispatchCoreAsync(componentId, rowKeys, eventName, eventKeys, cancellationToken);
    }

    /// <summary>
    /// The event's command — behind its form's submit rules, which refuse it while a field is in error, and its held values — or, with
    /// no command, only the interactions it drives.
    /// </summary>
    private async Task<UIClientCommandResult> DispatchCoreAsync(UIComponentId componentId, object?[] rowKeys, string eventName, object?[] eventKeys, CancellationToken cancellationToken)
    {
        UIComponentAddress source = new(componentId, rowKeys);

        // A row's own effect — one menu entry's — runs in place of the command the event carries for every other row.
        if (!View.Events.TryGet(new CompiledUIEventAddress(componentId, eventName), out CompiledUIEvent? compiled) || TakesRowEvent(source, eventName))
        {
            List<UIClientWrite> writes = [];
            int mark;

            lock (_sync)
            {
                mark = _effects.Count;
                RunEventInteractionsNoLock(source, eventName, writes);
            }

            await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
            await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
            NotifyIfChanged();

            return UIClientCommandResult.RanOnPage(EffectsSince(mark));
        }

        if (SubmittedForm(compiled, componentId, rowKeys, eventName) is string formId)
        {
            bool valid;

            lock (_sync)
                valid = RunSubmitValidationNoLock(formId);

            if (!valid)
            {
                NotifyIfChanged();
                return UIClientCommandResult.Refused($"The form '{formId}' has a field in error.");
            }

            if (!await SubmitHeldValuesAsync(formId, cancellationToken).ConfigureAwait(false))
            {
                NotifyIfChanged();
                return UIClientCommandResult.Refused($"The server refused a value submitted in form '{formId}'.");
            }
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

    /// <summary>Evaluates every field of the form up front — top-level fields and materialized row fields alike — so all its failures show; only an error refuses the submit.</summary>
    private bool RunSubmitValidationNoLock(string formId)
    {
        var valid = true;

        foreach (UIComponentNode node in View.Graph.All)
        {
            foreach (UIComponentAddress field in EnumerateFieldAddressesNoLock(node.ComponentId))
            {
                if (!IsInFormNoLock(field, formId))
                    continue;

                if (field.DynamicParameters.Length > 0 && (!IsShownNoLock(field.Id, field.DynamicParameters) || !IsEnabledNoLock(field.Id, field.DynamicParameters)))
                    continue;

                FieldNoLock(field).Touched = true;
                _ = _changedValidations.Add(field);
                EvaluateRulesNoLock(field, UIValidationTrigger.Submit, property: null);

                if (HasErrorNoLock(field))
                    valid = false;
            }
        }

        return valid;
    }

    private IEnumerable<UIComponentAddress> EnumerateFieldAddressesNoLock(UIComponentId componentId)
    {
        IReadOnlyList<UIComponentId> roots = View.Graph.GetItemScopes(componentId);

        if (roots.Count == 0)
        {
            yield return new UIComponentAddress(componentId, []);
            yield break;
        }

        List<object?[]> keySets = [[]];

        for (var depth = 0; depth < roots.Count; depth++)
        {
            UIComponentId hostId = HostOf(roots[depth]);
            List<object?[]> nextSets = [];

            foreach (var parentKeys in keySets)
            {
                foreach (UIClientRowEntry row in ReadVisibleRowsNoLock(new UIComponentAddress(hostId, parentKeys)))
                {
                    object?[] rowKeys = [.. parentKeys, row.Key];
                    UIComponentId scope = RowScopeNoLock(hostId, parentKeys, row.Item);

                    if (IsWithin(componentId, scope, rowKeys, row.Item))
                        nextSets.Add(rowKeys);
                }
            }

            if (nextSets.Count == 0)
                yield break;

            keySets = nextSets;
        }

        foreach (var rowKeys in keySets)
            yield return new UIComponentAddress(componentId, rowKeys);
    }

    private bool IsInFormNoLock(UIComponentAddress component, string formId)
        => string.Equals(ReadNoLock(component.Id, component.DynamicParameters, IInputComponent.FormIdProperty) as string, formId, StringComparison.Ordinal);

    // A controller's bound message gates no submit: its author judged the value and will judge it again.
    private bool HasErrorNoLock(UIComponentAddress component)
    {
        UIClientField field = FieldNoLock(component);

        if (field.BoundRefusal is not null || field.Refusal?.Severity == UIValidationSeverity.Error)
            return true;

        foreach (CompiledUIValidationRule rule in field.Failing)
        {
            if (rule.Severity == UIValidationSeverity.Error)
                return true;
        }

        return false;
    }

    /// <summary>Sends what a form's fields held back for its submit; answers whether the server accepted every submitted value.</summary>
    private async Task<bool> SubmitHeldValuesAsync(string formId, CancellationToken cancellationToken)
    {
        List<UIClientWrite> writes = [];

        lock (_sync)
        {
            foreach (KeyValuePair<UIPropertyAddress, object?> held in _held)
            {
                if (IsInFormNoLock(held.Key.Component, formId))
                    writes.Add(new UIClientWrite(held.Key, held.Value));
            }

            foreach (UIClientWrite write in writes)
            {
                _ = _held.Remove(write.Address);
                _ = _serverValues.Remove(write.Address);
            }
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        lock (_sync)
        {
            for (var i = 0; i < writes.Count; i++)
            {
                UIClientField field = FieldNoLock(writes[i].Address.Component);

                if (field.Refusal is not null || field.GateRefused)
                    return false;
            }
        }

        return true;
    }

    /// <summary>Sends a command and applies its answer, the event's before- and after- interactions around it.</summary>
    private async Task<UIClientCommandResult> SendCommandAsync(UICommandRequest request, UIComponentAddress? source, string? eventName, CancellationToken cancellationToken)
    {
        List<UIClientWrite> writes = [];
        int mark;

        lock (_sync)
        {
            mark = _effects.Count;

            if (source is UIComponentAddress before)
                RunEventInteractionsNoLock(before, EventNames.BeforePrefix + eventName, writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);

        UICommandExecutionResult result = await Transport.ProcessEventAsync(request, cancellationToken).ConfigureAwait(false);

        writes.Clear();

        lock (_sync)
        {
            ApplyNoLock(result.Changes.For(Transport.InstanceId));
            ApplyEffectsNoLock(result.Command.Effects);

            if (source is UIComponentAddress after)
                RunEventInteractionsNoLock(after, EventNames.AfterPrefix + eventName, writes);
        }

        await SendValuesAsync(writes, cancellationToken).ConfigureAwait(false);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
        await RunReactionsAsync(cancellationToken).ConfigureAwait(false);
        NotifyIfChanged();

        return UIClientCommandResult.Answered(result.Command.Success, result.Command.Error, EffectsSince(mark));
    }

    /// <summary>
    /// Runs what effects left for after the act, once the lock is let go: a dialog the viewer closed raises its close on its content —
    /// its <c>OnClose</c> — a language or theme the page switched to is stored in the session, and an in-place back navigation notifies the runtime.
    /// </summary>
    private async Task RunReactionsAsync(CancellationToken cancellationToken)
    {
        while (true)
        {
            UIClientReaction reaction;

            lock (_sync)
            {
                if (_reactions.Count == 0)
                    return;

                reaction = _reactions[0];
                _reactions.RemoveAt(0);
            }

            if (reaction.DialogClosed is UIComponentId root)
            {
                _ = await DispatchCoreAsync(root, [], EventNames.Close, [], cancellationToken).ConfigureAwait(false);
            }
            else if (reaction.Setting is ClientEffect setting)
            {
                await ReportSettingAsync(setting, cancellationToken).ConfigureAwait(false);
            }
            else if (reaction.HasNavigateInPlace && Transport.HasController)
            {
                UICommandExecutionResult navResult = await Transport.NavigateInPlaceAsync(reaction.NavigateInPlace, cancellationToken).ConfigureAwait(false);

                lock (_sync)
                {
                    ApplyNoLock(navResult.Changes.For(Transport.InstanceId));
                    ApplyEffectsNoLock(navResult.Command.Effects);
                }

                await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
            }
        }
    }

    /// <summary>Stores a language, theme or colours the page switched to in its session, and reaches the session's pages with it.</summary>
    private async Task ReportSettingAsync(ClientEffect setting, CancellationToken cancellationToken)
    {
        await Transport.ApplySettingAsync(setting, cancellationToken).ConfigureAwait(false);

        lock (_sync)
            _languageOrThemeChanged = true;

        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Sends values to the server in one change set and applies the answer — a refusal among them.</summary>
    private async Task SendValuesAsync(List<UIClientWrite> writes, CancellationToken cancellationToken)
    {
        if (writes.Count == 0 || !Transport.HasController)
            return;

        ClientUIUpdate[] updates = new ClientUIUpdate[writes.Count];

        for (var i = 0; i < writes.Count; i++)
        {
            UIPropertyAddress address = writes[i].Address;

            updates[i] = new ClientValueUIUpdate { Address = address, Value = writes[i].Value };

            // The value it takes clears a refusal of the one before; a new refusal comes back in the answer.
            lock (_sync)
            {
                UIClientField field = FieldNoLock(address.Component);

                field.Refusal = null;
                field.GateRefused = false;
                _ = _changedValidations.Add(address.Component);
            }
        }

        ServerChangeSet answer = await Transport.ProcessChangeSetAsync(new ClientChangeSet { Updates = updates }, cancellationToken).ConfigureAwait(false);

        Receive(answer);
        MarkRevertedWrites(writes, answer);
        await ResyncIfAskedAsync(cancellationToken).ConfigureAwait(false);
    }

    private void MarkRevertedWrites(List<UIClientWrite> writes, ServerChangeSet answer)
    {
        if (answer.IsEmpty)
            return;

        lock (_sync)
        {
            for (var i = 0; i < writes.Count; i++)
            {
                if (WasWriteReverted(answer, writes[i].Address))
                {
                    FieldNoLock(writes[i].Address.Component).GateRefused = true;
                    _ = _changedValidations.Add(writes[i].Address.Component);
                }
            }
        }
    }

    private static bool WasWriteReverted(ServerChangeSet answer, UIPropertyAddress written)
    {
        for (var i = 0; i < answer.Updates.Length; i++)
        {
            if (answer.Updates[i] is ServerValueUIUpdate reverted
                && reverted.Address.Component.Id == written.Component.Id
                && reverted.Address.Property == written.Property
                && HasRowKeyPrefix(written.Component.DynamicParameters, reverted.Address.Component.DynamicParameters))
            {
                return true;
            }
        }

        return false;
    }

    private static bool HasRowKeyPrefix(object?[] full, object?[] prefix)
    {
        if (prefix.Length > full.Length)
            return false;

        for (var i = 0; i < prefix.Length; i++)
        {
            if (!Equals(full[i], prefix[i]))
                return false;
        }

        return true;
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
    private void WriteValueNoLock(UIPropertyAddress address, object? value, bool local, int depth, List<UIClientWrite> writes)
    {
        _values[address] = value;
        _ = _changedProperties.Add(address);

        if (address.Property == IInputComponent.ValidationProperty)
        {
            FieldNoLock(address.Component).Touched = true;
            _ = _changedValidations.Add(address.Component);
        }
        else
        {
            EvaluateRulesNoLock(address.Component, UIValidationTrigger.Change, address.Property);
        }

        if (address.Property == IInputComponent.ValueProperty)
            EvaluateRulesAgainstNoLock(address.Component);

        if (depth > MaxInteractionDepth)
            return;

        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new UIPropertyAddress(address.Component.Id, address.Property)))
            ApplyInteractionNoLock(interaction, address.Component.DynamicParameters, local, value, depth, writes);
    }

    private void RunEventInteractionsNoLock(UIComponentAddress source, string eventName, List<UIClientWrite> writes)
    {
        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new CompiledUIEventAddress(source.Id, eventName)))
        {
            if (IsRowsOwn(interaction, source.DynamicParameters))
                ApplyInteractionNoLock(interaction, source.DynamicParameters, local: true, sourceValue: true, depth: 0, writes);
        }
    }

    /// <summary>Whether the event, raised in this row, is a row's own interaction's, which the page runs in place of the event's command.</summary>
    private bool TakesRowEvent(UIComponentAddress source, string eventName)
    {
        foreach (CompiledUIInteraction interaction in View.Interactions.GetBySource(new CompiledUIEventAddress(source.Id, eventName)))
        {
            if (interaction.RowKey is not null && IsRowsOwn(interaction, source.DynamicParameters))
                return true;
        }

        return false;
    }

    /// <summary>
    /// Whether an event raised with these keys fires the interaction: any row's for one that names none, else the row it names — any
    /// key in the row's scope chain, so a submenu's key matches its entries too (<c>interaction-engine.ts</c>).
    /// </summary>
    private static bool IsRowsOwn(CompiledUIInteraction interaction, object?[] rowKeys)
        => interaction.RowKey is null
            || Array.Exists(rowKeys, key => key is not null && string.Equals(Convert.ToString(key, CultureInfo.InvariantCulture), interaction.RowKey, StringComparison.Ordinal));

    /// <summary>An interaction as the client runs it: its effect while the condition holds, else the value it writes to its target.</summary>
    private void ApplyInteractionNoLock(CompiledUIInteraction interaction, object?[] rowKeys, bool local, object? sourceValue, int depth, List<UIClientWrite> writes)
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
            writes.Add(new UIClientWrite(address, next));
    }

    private static bool IsBlank(object? value)
        => value is null || (value is string text && string.IsNullOrWhiteSpace(text));

    /// <summary>Evaluates a field's rules of one trigger against the value it holds — those on <paramref name="property"/> alone where given.</summary>
    private void EvaluateRulesNoLock(UIComponentAddress component, UIValidationTrigger trigger, UIProperty? property)
    {
        IReadOnlyList<CompiledUIValidationRule> rules = View.Validations.GetByComponent(component.Id);

        if (rules.Count == 0)
            return;

        UIClientField field = FieldNoLock(component);

        foreach (CompiledUIValidationRule rule in rules)
        {
            if (rule.Trigger == trigger && (property is not UIProperty only || rule.Target.Property == only))
                JudgeNoLock(component, rule, field);
        }
    }

    /// <summary>
    /// Judges one rule against the value a field holds, compared with the rule's value or with the value of the field it names — in
    /// the field's row, else standing in no row — as the page reads it.
    /// </summary>
    private void JudgeNoLock(UIComponentAddress component, CompiledUIValidationRule rule, UIClientField field)
    {
        var value = ReadNoLock(component.Id, component.DynamicParameters, rule.Target.Property);
        var comparand = rule.ValueSource is UIPropertyAddress source
            ? ReadNoLock(source.Component.Id, component.DynamicParameters[..Math.Min(component.DynamicParameters.Length, View.Graph.GetItemScopes(source.Component.Id).Count)], source.Property)
            : rule.Value;

        if (PassesRule(value, rule.Operator, comparand))
            _ = field.Failing.Remove(rule);
        else
            _ = field.Failing.Add(rule);

        _ = _changedValidations.Add(component);
    }

    /// <summary>
    /// Whether a value passes a rule as the page's validation judges it (<c>validation-engine.ts</c>): every rule but
    /// <see cref="UIComparisonOperator.Required"/> passes on an empty value, so an empty field says only that it is required.
    /// </summary>
    private static bool PassesRule(object? value, UIComparisonOperator @operator, object? comparand)
        => (@operator != UIComparisonOperator.Required && IsEmptyValue(value)) || UIComparisonEvaluator.Evaluate(value, @operator, comparand);

    /// <summary>Nothing given: what <see cref="UIComparisonOperator.Required"/> refuses, but a toggle's <see langword="false"/>, which is a value.</summary>
    private static bool IsEmptyValue(object? value)
        => value is not false && !UIComparisonEvaluator.Evaluate(value, UIComparisonOperator.Required, null);

    /// <summary>
    /// Judges again the rules that compare with this field's value — "Password again" as "New password" changes — in the field's own
    /// row, or in each row the page holds a field of where it stands outside them. Every write here is a settled value (typed and left,
    /// given, an interaction's), so a Change and a Blur rule are judged, as the page judges them on a commit; a submit's rules wait.
    /// </summary>
    private void EvaluateRulesAgainstNoLock(UIComponentAddress source)
    {
        foreach (CompiledUIValidationRule rule in View.Validations.All)
        {
            if (rule.Trigger == UIValidationTrigger.Submit || rule.ValueSource is not UIPropertyAddress named || named.Component.Id != source.Id)
                continue;

            UIComponentId target = rule.Target.Component.Id;

            if (View.Graph.GetItemScopes(target).Count == source.DynamicParameters.Length)
            {
                UIComponentAddress field = new(target, source.DynamicParameters);

                JudgeNoLock(field, rule, FieldNoLock(field));
                continue;
            }

            foreach ((UIComponentAddress field, UIClientField state) in _fields)
            {
                if (field.Id == target && field.DynamicParameters.Length > source.DynamicParameters.Length && field.DynamicParameters.AsSpan(0, source.DynamicParameters.Length).SequenceEqual(source.DynamicParameters, EqualityComparer<object?>.Default))
                    JudgeNoLock(field, rule, state);
            }
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
            UIClientField field = FieldNoLock(component);
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
