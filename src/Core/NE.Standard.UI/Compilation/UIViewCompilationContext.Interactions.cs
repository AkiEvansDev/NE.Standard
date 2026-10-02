using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
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

        return [.. interactions];
    }

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
            UIInteractionSourceKind.Property => BuildPropertyInteraction(interaction, target, falseValue),
            UIInteractionSourceKind.Event => BuildEventInteraction(interaction, target),
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

    private CompiledUIInteraction BuildPropertyInteraction(UIInteraction interaction, UIPropertyAddress? target, object? falseValue)
    {
        if (interaction.SourceProperty is null)
            throw new InvalidOperationException("Property interaction source property is required.");

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

    private CompiledUIInteraction BuildEventInteraction(UIInteraction interaction, UIPropertyAddress? target)
    {
        if (interaction.SourceEvent is null)
            throw new InvalidOperationException("Event interaction source event is required.");

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
            FalseValue = interaction.FalseValue
        };
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
            throw new InvalidOperationException($"Client effect kind '{effect.Kind}' cannot be run by an interaction.");

        return effect.Resolve(this);
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

    private CompiledUIValidationRule[] BuildValidations()
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
                    Severity = validation.Severity,
                    Message = validation.Message
                });
            }
        }

        return [.. validations];
    }
}
