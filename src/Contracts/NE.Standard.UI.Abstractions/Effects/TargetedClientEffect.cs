using System;
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
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }
}
