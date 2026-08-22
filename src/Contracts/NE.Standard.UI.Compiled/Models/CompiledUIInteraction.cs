using System;
using System.Diagnostics;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Compiled.Models;

/// <summary>
/// Represents a compiled interaction that updates a target property, or runs a client effect, from a property
/// or event source.
/// </summary>
public sealed class CompiledUIInteraction
{
    /// <summary>
    /// Gets the source kind that triggers the interaction.
    /// </summary>
    public required UIInteractionSourceKind SourceKind { get; init; }

    /// <summary>
    /// Gets what the interaction does when it is triggered.
    /// </summary>
    public required UIInteractionActionKind ActionKind { get; init; }

    /// <summary>
    /// Gets the source property address for property-driven interactions.
    /// </summary>
    public UIPropertyAddress? Source { get; init; }

    /// <summary>
    /// Gets the source event address for event-driven interactions.
    /// </summary>
    public CompiledUIEventAddress? SourceEvent { get; init; }

    /// <summary>
    /// Gets the target property address updated by a property-assigning interaction.
    /// </summary>
    public UIPropertyAddress? Target { get; init; }

    /// <summary>
    /// Gets the resolved client effect run by an effect interaction.
    /// </summary>
    public ClientEffect? Effect { get; init; }

    /// <summary>
    /// Gets the comparison operator used by the interaction.
    /// </summary>
    public required UIComparisonOperator Operator { get; init; }

    /// <summary>
    /// Gets the comparison value used by the interaction.
    /// </summary>
    public object? Value { get; init; }

    /// <summary>
    /// Gets the value applied when the interaction condition is satisfied.
    /// </summary>
    public object? TrueValue { get; init; }

    /// <summary>
    /// Gets the value applied when the interaction condition is not satisfied.
    /// </summary>
    public object? FalseValue { get; init; }

    /// <summary>
    /// Validates source, target and action consistency for the interaction.
    /// </summary>
    public void Validate()
    {
        switch (SourceKind)
        {
            case UIInteractionSourceKind.Property:
                if (Source is null)
                    throw new InvalidOperationException("Property interaction source is required.");

                if (Source.Value.Component.Id.IsEmpty)
                    throw new InvalidOperationException("Interaction source component id is invalid.");

                if (SourceEvent is not null)
                    throw new InvalidOperationException("Property interaction must not specify event source.");

                break;

            case UIInteractionSourceKind.Event:
                if (SourceEvent is null)
                    throw new InvalidOperationException("Event interaction source is required.");

                if (SourceEvent.Value.ComponentId.IsEmpty)
                    throw new InvalidOperationException("Interaction source event component id is invalid.");

                ArgumentException.ThrowIfNullOrWhiteSpace(SourceEvent.Value.EventName);

                if (Source is not null)
                    throw new InvalidOperationException("Event interaction must not specify property source.");

                break;

            default:
                throw new UnreachableException();
        }

        switch (ActionKind)
        {
            case UIInteractionActionKind.SetProperty:
                if (Target is null)
                    throw new InvalidOperationException("Property-assigning interaction target is required.");

                if (Target.Value.Component.Id.IsEmpty)
                    throw new InvalidOperationException("Interaction target component id is invalid.");

                if (Effect is not null)
                    throw new InvalidOperationException("Property-assigning interaction must not specify an effect.");

                break;

            case UIInteractionActionKind.Effect:
                if (Effect is null)
                    throw new InvalidOperationException("Effect interaction effect is required.");

                if (Target is not null)
                    throw new InvalidOperationException("Effect interaction must not specify a target property.");

                break;

            default:
                throw new UnreachableException();
        }
    }
}
