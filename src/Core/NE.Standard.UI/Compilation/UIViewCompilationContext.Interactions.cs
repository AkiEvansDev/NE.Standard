using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Interaction;

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

        return interaction.SourceKind switch
        {
            UIInteractionSourceKind.Property => BuildPropertyInteraction(interaction, target),
            UIInteractionSourceKind.Event => BuildEventInteraction(interaction, target),
            _ => throw new InvalidOperationException($"Unsupported interaction source kind '{interaction.SourceKind}'.")
        };
    }

    private CompiledUIInteraction BuildPropertyInteraction(UIInteraction interaction, UIPropertyAddress? target)
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
            FalseValue = interaction.FalseValue
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
    /// Resolves an interaction's effect the way a command's effect is resolved, only at compile time: the
    /// authored component id becomes a compiled address the client can find in the DOM.
    /// </summary>
    private ClientEffect? ResolveInteractionEffect(UIInteraction interaction)
    {
        if (interaction.Effect is not ClientEffect effect)
            return null;

        // Narrow on purpose. These three are pure client gestures with nothing behind them on the server; the
        // rest of the vocabulary (navigate, dialogs, notifications, downloads) reaches something a round trip
        // set up, and letting an interaction fire one would be a command in all but name.
        if (effect.Kind is not (ClientEffectKind.Focus or ClientEffectKind.ScrollTo or ClientEffectKind.Scroll))
            throw new InvalidOperationException($"Client effect kind '{effect.Kind}' cannot be run by an interaction.");

        return effect.Resolve(this);
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
