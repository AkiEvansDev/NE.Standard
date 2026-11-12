using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// An effect aimed at one component, resolved to its address before it travels.
/// </summary>
public abstract class TargetedClientEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect aimed at the given target component.
    /// </summary>
    protected TargetedClientEffect(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
    }

    /// <summary>
    /// Creates a resolved effect carrying its compiled component address.
    /// </summary>
    protected TargetedClientEffect(UIComponentAddress? resolvedTarget, UIComponentReference target = default)
    {
        ResolvedTarget = resolvedTarget;
        Target = target;
    }

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    [JsonIgnore]
    public UIComponentReference Target { get; }

    /// <summary>
    /// Gets the resolved component address once compiled or received over the wire.
    /// </summary>
    [JsonInclude]
    [JsonPropertyName("target")]
    public UIComponentAddress? ResolvedTarget { get; }
}
