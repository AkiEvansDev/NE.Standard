using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Describes a client-side interaction that updates a target property, or runs a client effect, when another
/// property or an event says so.
/// </summary>
public readonly record struct UIInteraction
{
    /// <summary>
    /// Creates an interaction that updates the target property based on a comparison against a source property.
    /// </summary>
    public UIInteraction(string componentId, UIProperty source, UIProperty target, UIComparisonOperator @operator, object? value, object? trueValue, object? falseValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);

        SourceKind = UIInteractionSourceKind.Property;
        ActionKind = UIInteractionActionKind.SetProperty;

        ComponentId = componentId;
        SourceProperty = source;
        SourceEvent = null;

        TargetProperty = target;

        Operator = @operator;
        Value = value;
        TrueValue = trueValue;
        FalseValue = falseValue;
    }

    /// <summary>
    /// Creates an interaction that updates the target property when a source event fires.
    /// </summary>
    public UIInteraction(string componentId, string sourceEvent, UIProperty target, object? trueValue, object? falseValue = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceEvent);

        SourceKind = UIInteractionSourceKind.Event;
        ActionKind = UIInteractionActionKind.SetProperty;

        ComponentId = componentId;
        SourceProperty = null;
        SourceEvent = sourceEvent;

        TargetProperty = target;

        Operator = UIComparisonOperator.Required;
        Value = null;
        TrueValue = trueValue;
        FalseValue = falseValue;
    }

    /// <summary>
    /// Creates an interaction that runs a client effect based on a comparison against a source property.
    /// </summary>
    public UIInteraction(string componentId, UIProperty source, ClientEffect effect, UIComparisonOperator @operator = UIComparisonOperator.Required, object? value = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);
        ArgumentNullException.ThrowIfNull(effect);

        SourceKind = UIInteractionSourceKind.Property;
        ActionKind = UIInteractionActionKind.Effect;

        ComponentId = componentId;
        SourceProperty = source;
        SourceEvent = null;

        TargetProperty = null;
        Effect = effect;

        Operator = @operator;
        Value = value;
        TrueValue = null;
        FalseValue = null;
    }

    /// <summary>
    /// Creates an interaction that runs a client effect when a source event fires.
    /// </summary>
    public UIInteraction(string componentId, string sourceEvent, ClientEffect effect)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(componentId);
        ArgumentException.ThrowIfNullOrWhiteSpace(sourceEvent);
        ArgumentNullException.ThrowIfNull(effect);

        SourceKind = UIInteractionSourceKind.Event;
        ActionKind = UIInteractionActionKind.Effect;

        ComponentId = componentId;
        SourceProperty = null;
        SourceEvent = sourceEvent;

        TargetProperty = null;
        Effect = effect;

        Operator = UIComparisonOperator.Required;
        Value = null;
        TrueValue = null;
        FalseValue = null;
    }

    /// <summary>
    /// Gets the source kind that triggers the interaction.
    /// </summary>
    public UIInteractionSourceKind SourceKind { get; }

    /// <summary>
    /// Gets what the interaction does when it is triggered.
    /// </summary>
    public UIInteractionActionKind ActionKind { get; }

    /// <summary>
    /// Gets the source component id.
    /// </summary>
    public string ComponentId { get; }

    /// <summary>
    /// Gets the source property for property-driven interactions.
    /// </summary>
    public UIProperty? SourceProperty { get; }

    /// <summary>
    /// Gets the source event name for event-driven interactions.
    /// </summary>
    public string? SourceEvent { get; }

    /// <summary>
    /// Gets the target property updated by a property-assigning interaction.
    /// </summary>
    public UIProperty? TargetProperty { get; }

    /// <summary>
    /// Gets the client effect run by an effect interaction.
    /// </summary>
    public ClientEffect? Effect { get; }

    /// <summary>
    /// Gets the comparison operator used for property-driven interactions.
    /// </summary>
    public UIComparisonOperator Operator { get; }

    /// <summary>
    /// Gets the comparison value used for property-driven interactions.
    /// </summary>
    public object? Value { get; }

    /// <summary>
    /// Gets the value applied when the interaction condition is satisfied.
    /// </summary>
    public object? TrueValue { get; }

    /// <summary>
    /// Gets the value applied when the interaction condition is not satisfied.
    /// </summary>
    public object? FalseValue { get; }
}
