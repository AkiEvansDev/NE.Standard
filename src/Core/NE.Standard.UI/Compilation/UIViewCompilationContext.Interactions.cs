using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Items;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Compilation;

internal sealed partial class UIViewCompilationContext
{
    private CompiledUIInteraction[] BuildInteractions()
    {
        List<CompiledUIInteraction> interactions = [];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            for (var j = 0; j < component.Interactions.Count; j++)
            {
                UIInteraction interaction = component.Interactions[j];

                interactions.Add(BuildInteraction(component, interaction));
            }
        }

        AddShortcutInteractions(interactions);

        return [.. interactions];
    }

    /// <summary>
    /// What the rules reading another component's property give their targets before anything changes, where every such rule on a
    /// target reads a source the view itself sets: the page is drawn as the rules' first run would draw it, so a note under a switch that
    /// is off starts hidden. A target bound to the controller, or ruled by a source the controller holds, is left to the page, which
    /// runs the rules as the bound values arrive.
    /// </summary>
    /// <remarks>
    /// For the first paint only: the compiled state keeps the authored values, which the server's gates read, so a rule the reader
    /// satisfies opens a button the server never thought closed.
    /// </remarks>
    private Dictionary<UIPropertyAddress, object?> BuildFirstPaint()
    {
        Dictionary<UIPropertyAddress, object?> values = [];
        HashSet<UIPropertyAddress> leftToPage = [];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent target = _componentOrder[i];

            for (var j = 0; j < target.Interactions.Count; j++)
            {
                UIInteraction interaction = target.Interactions[j];

                if (interaction.SourceKind != UIInteractionSourceKind.Property || interaction.ActionKind != UIInteractionActionKind.SetProperty
                    || interaction.SourceProperty is not UIProperty sourceProperty || interaction.TargetProperty is not UIProperty targetProperty)
                {
                    continue;
                }

                UIPropertyAddress address = new(GetComponentId(target.Id), targetProperty);

                if (leftToPage.Contains(address))
                    continue;

                if (FindBinding(target, targetProperty) is not null || !TryReadOwnValue(GetComponent(interaction.ComponentId), sourceProperty, out var source))
                {
                    _ = leftToPage.Add(address);
                    _ = values.Remove(address);
                    continue;
                }

                // Later rules on one target win, as they do when the page runs them in order.
                values[address] = UIComparisonEvaluator.Evaluate(Comparable(source), interaction.Operator, Comparable(interaction.Value)) ? interaction.TrueValue : interaction.FalseValue;
            }
        }

        return values;
    }

    /// <summary>The value a component holds of its own — set, else the property's default — and none where the property is bound.</summary>
    private bool TryReadOwnValue(IVisualComponent component, UIProperty property, out object? value)
    {
        value = null;

        if (FindBinding(component, property) is not null || !TryGetPropertyDefinition(component.TypeKey, property, out UIPropertyDefinition? definition))
            return false;

        // An unset two-state value is off: the page reads the box's `checked`, never nothing (value-readers.ts).
        value = definition.Getter(component) ?? definition.DefaultValue ?? (HoldsTwoStates(component) ? false : null);
        return true;
    }

    /// <summary>Whether the component's value is a two-state one, a switch's or a checkbox's.</summary>
    private static bool HoldsTwoStates(IVisualComponent component)
    {
        for (Type? type = component.GetType(); type is not null; type = type.BaseType)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(InputComponentBase<,>))
                return type.GetGenericArguments()[1] == typeof(bool?);
        }

        return false;
    }

    /// <summary>A value as the page's rules read it: a phrase by its key, an author's text by its text (interaction-evaluator.ts).</summary>
    private static object? Comparable(object? value)
        => value is UIPhrase phrase ? phrase.Key : value;

    private CompiledUIInteraction BuildInteraction(IVisualComponent targetComponent, UIInteraction interaction)
    {
        UIPropertyAddress? target = interaction.TargetProperty is UIProperty targetProperty
            ? new UIPropertyAddress(GetComponentId(targetComponent.Id), targetProperty)
            : null;

        // A copy of nothing writes the target's authored value back, as a bound null renders it.
        var falseValue = interaction.ActionKind == UIInteractionActionKind.CopyValue
            ? EnsureCopyable(targetComponent, interaction)
            : interaction.FalseValue;

        return interaction.SourceKind switch
        {
            UIInteractionSourceKind.Property => BuildPropertyInteraction(targetComponent, interaction, target, falseValue),
            UIInteractionSourceKind.Event => BuildEventInteraction(targetComponent, interaction, target),
            _ => throw new InvalidOperationException($"Unsupported interaction source kind '{interaction.SourceKind}'.")
        };
    }

    /// <summary>
    /// Refuses a copy whose target cannot take what its source holds: the page writes the value as it is, with no conversion. Answers
    /// the target's authored value (else its registered default), which the page writes when the source holds nothing.
    /// </summary>
    private object? EnsureCopyable(IVisualComponent targetComponent, UIInteraction interaction)
    {
        if (interaction.SourceProperty is not UIProperty sourceProperty || interaction.TargetProperty is not UIProperty targetProperty)
            throw new InvalidOperationException($"A value-copying interaction on component '{targetComponent.Id}' names no source or target property.");

        IVisualComponent sourceComponent = GetComponent(interaction.ComponentId);
        UIPropertyDefinition source = GetRequiredPropertyDefinition(sourceComponent.TypeKey, sourceProperty);
        UIPropertyDefinition target = GetRequiredPropertyDefinition(targetComponent.TypeKey, targetProperty);

        if (!target.IsBindable)
            throw new InvalidOperationException($"Component '{targetComponent.Id}' copies a value into '{targetProperty.Name}', which does not support binding.");

        Type from = Nullable.GetUnderlyingType(source.ValueType) ?? source.ValueType;
        Type to = Nullable.GetUnderlyingType(target.ValueType) ?? target.ValueType;

        if (!AcceptsCopy(from, to))
            throw new InvalidOperationException($"Component '{targetComponent.Id}' copies '{interaction.ComponentId}.{sourceProperty.Name}' ({from.Name}) into '{targetProperty.Name}' ({to.Name}), which cannot take it.");

        return UIPhrase.AsValue(target.Getter(targetComponent) ?? target.DefaultValue);
    }

    /// <summary>Whether a target property's type takes a source's value as the page holds it; both without their nullability.</summary>
    private static bool AcceptsCopy(Type from, Type to)
    {
        if (to == typeof(object) || to.IsAssignableFrom(from))
            return true;

        // A number lands as the page holds it, unrounded: a whole-number target refuses a fraction rather than show one.
        if (IsNumber(from) && IsNumber(to))
            return IsWholeNumber(from) || !IsWholeNumber(to);

        // The reader's words shown as written on a text property, a title's preview.
        return from == typeof(string) && to == typeof(UIPhrase);
    }

    private static bool IsNumber(Type type)
        => !type.IsEnum && Type.GetTypeCode(type) is >= TypeCode.SByte and <= TypeCode.Decimal;

    private static bool IsWholeNumber(Type type)
        => Type.GetTypeCode(type) is >= TypeCode.SByte and <= TypeCode.UInt64;

    private CompiledUIInteraction BuildPropertyInteraction(IVisualComponent targetComponent, UIInteraction interaction, UIPropertyAddress? target, object? falseValue)
    {
        if (interaction.SourceProperty is null)
            throw new InvalidOperationException("Property interaction source property is required.");

        EnsureSourceHolds(targetComponent, interaction.ComponentId, interaction.SourceProperty.Value);

        return new CompiledUIInteraction
        {
            SourceKind = UIInteractionSourceKind.Property,
            ActionKind = interaction.ActionKind,
            Source = new(
                GetComponentId(interaction.ComponentId),
                interaction.SourceProperty.Value
            ),
            Target = target,
            Effect = ResolveInteractionEffect(interaction),
            Operator = interaction.Operator,
            Value = interaction.Value,
            TrueValue = interaction.TrueValue,
            FalseValue = falseValue
        };
    }

    /// <summary>
    /// Refuses a rule reading a property its source does not have: the page never hears that property change, so the rule never runs
    /// and its target keeps its authored value — a toggle button read for <c>Value</c>, whose state is <c>Pressed</c>.
    /// </summary>
    private void EnsureSourceHolds(IVisualComponent targetComponent, string sourceComponentId, UIProperty sourceProperty)
    {
        IVisualComponent source = GetComponent(sourceComponentId);

        if (!TryGetPropertyDefinition(source.TypeKey, sourceProperty, out _))
            throw new InvalidOperationException($"Component '{targetComponent.Id}' reacts to '{sourceProperty.Name}' of '{source.Id}', which its type '{source.TypeKey}' does not have, so the rule would never run; name a property it declares.");
    }

    private CompiledUIInteraction BuildEventInteraction(IVisualComponent targetComponent, UIInteraction interaction, UIPropertyAddress? target)
    {
        if (interaction.SourceEvent is null)
            throw new InvalidOperationException("Event interaction source event is required.");

        EnsureLifecycleSourceRunsCommand(targetComponent, interaction.ComponentId, interaction.SourceEvent);

        if (interaction.RowKey is null)
            EnsureNoCommandBeside(targetComponent, interaction.ComponentId, interaction.SourceEvent);
        else
            EnsureStandsInARow(targetComponent, interaction.ComponentId, interaction.RowKey);

        return new CompiledUIInteraction
        {
            SourceKind = UIInteractionSourceKind.Event,
            ActionKind = interaction.ActionKind,
            SourceEvent = new CompiledUIEventAddress(
                GetComponentId(interaction.ComponentId),
                interaction.SourceEvent
            ),
            Target = target,
            Effect = ResolveInteractionEffect(interaction),
            Operator = interaction.Operator,
            Value = interaction.Value,
            TrueValue = interaction.TrueValue,
            FalseValue = interaction.FalseValue,
            RowKey = interaction.RowKey
        };
    }

    /// <summary>
    /// Refuses a before- or after- interaction whose source runs no command on that event, as an undeclared command is refused: the
    /// page raises the pair only around a command its source sends, so one asked of an event with none — a host asked for its
    /// template's item event among them — compiles, renders and never fires.
    /// </summary>
    private void EnsureLifecycleSourceRunsCommand(IVisualComponent targetComponent, string sourceComponentId, string sourceEvent)
    {
        if (!IsLocalLifecycleEvent(sourceEvent))
            return;

        var eventName = sourceEvent.StartsWith(EventNames.BeforePrefix, StringComparison.Ordinal) ? sourceEvent[EventNames.BeforePrefix.Length..] : sourceEvent[EventNames.AfterPrefix.Length..];
        IVisualComponent source = GetComponent(sourceComponentId);

        if (FindEventName(source, eventName, StringComparison.Ordinal) is not null)
            return;

        var hint = FindEventName(source, eventName, StringComparison.OrdinalIgnoreCase) is string registered
            ? $"; an event is named exactly as registered, '{registered}'"
            : TemplateRunsCommandOn(source, eventName)
                ? "; an item's event belongs to the template it is drawn from, so ask it there"
                : "; give it a command on that event, or name the component that runs one";

        throw new InvalidOperationException($"Component '{targetComponent.Id}' reacts to '{sourceEvent}' of '{source.Id}', but '{source.Id}' runs no command on '{eventName}'{hint}. A before- or after- interaction fires only around a command its source runs.");
    }

    /// <summary>The name of the component's own event that <paramref name="eventName"/> names, or null.</summary>
    private static string? FindEventName(IVisualComponent component, string eventName, StringComparison comparison)
    {
        for (var i = 0; i < component.Events.Count; i++)
        {
            if (string.Equals(component.Events[i].Name, eventName, comparison))
                return component.Events[i].Name;
        }

        return null;
    }

    /// <summary>Whether a templated host's default template or a variant runs a command on the event: an item's, written on its template.</summary>
    private static bool TemplateRunsCommandOn(IVisualComponent host, string eventName)
    {
        if (host is not ITemplatedComponent templated)
            return false;

        if (templated.Template is IVisualComponent template && FindEventName(template, eventName, StringComparison.Ordinal) is not null)
            return true;

        foreach (IVisualComponent variant in templated.Templates.Values)
        {
            if (FindEventName(variant, eventName, StringComparison.Ordinal) is not null)
                return true;
        }

        return false;
    }

    /// <summary>
    /// Refuses an interaction on an event its source also runs a command on: the page sends the command and raises only its before
    /// and after, so the interaction compiles, renders and never fires.
    /// </summary>
    private void EnsureNoCommandBeside(IVisualComponent targetComponent, string sourceComponentId, string sourceEvent)
    {
        if (IsLocalLifecycleEvent(sourceEvent))
            return;

        IVisualComponent source = GetComponent(sourceComponentId);

        if (FindEventName(source, sourceEvent, StringComparison.Ordinal) is null)
            return;

        throw new InvalidOperationException($"Component '{targetComponent.Id}' reacts to '{sourceEvent}' of '{source.Id}', but '{source.Id}' runs a command on '{sourceEvent}', and the page runs that command instead of the interaction. Write it InteractBefore or InteractAfter(\"{sourceEvent}\", …) to run it just before the command leaves or once it is answered.");
    }

    /// <summary>
    /// Refuses a row's own interaction (<c>OnItemClick(key, effect)</c>) on a component that stands in no row: no press of it carries a
    /// row's key, so it would never fire. One that does takes that key's press from the command beside it.
    /// </summary>
    private void EnsureStandsInARow(IVisualComponent targetComponent, string sourceComponentId, string rowKey)
    {
        for (var id = sourceComponentId; id is not null; id = _parentByComponentId.GetValueOrDefault(id))
        {
            if (_slotByRootComponentId.TryGetValue(id, out UIComponentSlot? slot) && IsItemsTemplateSlot(slot.Kind))
                return;
        }

        throw new InvalidOperationException($"Component '{targetComponent.Id}' runs an effect for the row '{rowKey}' of '{sourceComponentId}', which stands in no row, so no press of it names one; give it to an item template, as OnItemClick(key, effect) does.");
    }

    /// <summary>
    /// Resolves an interaction's effect, turning its authored component id into a compiled address.
    /// </summary>
    private ClientEffect? ResolveInteractionEffect(UIInteraction interaction)
    {
        if (interaction.Effect is not ClientEffect effect)
            return null;

        // Only effects that can run without a round trip are allowed here; see ClientEffect.CanRunInInteraction.
        if (!effect.CanRunInInteraction)
            throw new InvalidOperationException($"Client effect kind '{effect.Kind}' cannot be run by an interaction{RefusedEffectHint(effect)}.");

        ClientEffect resolved = effect.Resolve(this);

        EnsureEffectTarget(effect);

        return resolved;
    }

    /// <summary>What to write instead of an effect an interaction may not run.</summary>
    private static string RefusedEffectHint(ClientEffect effect)
        => effect switch
        {
            ShowEffect or HideEffect or CollapseEffect => "; an interaction writes the target's Visibility itself (InteractOn(…, IVisualComponent.VisibilityProperty, …))",
            ShowNotificationEffect => "; a toast with an action is offered by a command's answer, one without runs here",
            _ => "; return it from a command"
        };

    /// <summary>Refuses an effect aimed at a component of a kind it cannot act on (<see cref="UIEffectTargets"/>).</summary>
    private void EnsureEffectTarget(ClientEffect effect)
    {
        if (effect is not TargetedClientEffect targeted)
            return;

        IVisualComponent target = GetComponent(targeted.Target.Id);

        UIEffectTargets.EnsureFits(effect, target.Id, target.TypeKey);
    }

    /// <summary>
    /// The fields whose validation message targets another component's property, resolved to addresses.
    /// </summary>
    /// <remarks>Refused here, not at render: a dangling name is an authoring mistake better caught at compile time than shown as an empty error box.</remarks>
    private KeyValuePair<UIComponentId, UIPropertyAddress>[] BuildValidationMessageTargets()
    {
        List<KeyValuePair<UIComponentId, UIPropertyAddress>> targets = [];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            if (component is not IInputComponent input || input.ValidationTarget is not UIPropertyReference reference)
                continue;

            IVisualComponent targetComponent = GetComponent(reference.Component.Id);

            _ = GetRequiredPropertyDefinition(targetComponent.TypeKey, reference.Property);

            targets.Add(new KeyValuePair<UIComponentId, UIPropertyAddress>(GetComponentId(component.Id), new UIPropertyAddress(GetComponentId(reference.Component.Id), reference.Property)));
        }

        return [.. targets];
    }

    private CompiledUIValidationRule[] BuildValidations(Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        List<CompiledUIValidationRule> validations = [];

        for (var i = 0; i < _componentOrder.Count; i++)
        {
            IVisualComponent component = _componentOrder[i];

            if (component is not IInputComponent input)
                continue;

            for (var j = 0; j < input.Validations.Count; j++)
            {
                UIValidationRule validation = input.Validations[j];

                validations.Add(new CompiledUIValidationRule
                {
                    Target = new UIPropertyAddress(GetComponentId(component.Id), IInputComponent.ValueProperty),
                    Trigger = validation.Trigger,
                    Operator = validation.Operator,
                    Value = validation.Value,
                    ValueSource = ResolveValidationSource(component, validation, componentContexts),
                    Severity = validation.Severity,
                    Message = validation.Message
                });
            }
        }

        return [.. validations];
    }

    /// <summary>
    /// The field a rule compares with, refused where the page could not find one for each instance of the field: no input, the field
    /// itself, a property other than its value, or a field in another row than the field's own (one in no row is every row's).
    /// </summary>
    private UIPropertyAddress? ResolveValidationSource(IVisualComponent component, UIValidationRule validation, Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        if (validation.ValueSource is not UIPropertyReference reference)
            return null;

        IVisualComponent source = GetComponent(reference.Component.Id);

        if (source is not IInputComponent || ReferenceEquals(source, component) || !reference.Property.Equals(IInputComponent.ValueProperty))
            throw new InvalidOperationException($"Component '{component.Id}' validates against '{reference.Component.Id}.{reference.Property.Name}'; a rule compares with another input's Value.");

        if (!EndsWith(ItemScopesOf(component.Id, componentContexts), ItemScopesOf(source.Id, componentContexts)))
            throw new InvalidOperationException($"Component '{component.Id}' validates against '{source.Id}', which stands in another row; the field compared with stands in the same row, or in none.");

        return new UIPropertyAddress(GetComponentId(source.Id), reference.Property);
    }

    /// <summary>The rows a component stands in, innermost first: the components up its parents that define an item's context.</summary>
    private List<string> ItemScopesOf(string componentId, Dictionary<string, ResolvedComponentContext> componentContexts)
    {
        List<string> scopes = [];

        for (var id = componentId; id is not null; id = _parentByComponentId.GetValueOrDefault(id))
        {
            if (componentContexts.TryGetValue(id, out ResolvedComponentContext context) && context.DefinesParameter)
                scopes.Add(id);
        }

        return scopes;
    }

    /// <summary>Whether <paramref name="outer"/> is the outermost part of <paramref name="scopes"/>, both innermost first.</summary>
    private static bool EndsWith(List<string> scopes, List<string> outer)
    {
        var offset = scopes.Count - outer.Count;

        if (offset < 0)
            return false;

        for (var i = 0; i < outer.Count; i++)
        {
            if (!string.Equals(scopes[offset + i], outer[i], StringComparison.Ordinal))
                return false;
        }

        return true;
    }
}
