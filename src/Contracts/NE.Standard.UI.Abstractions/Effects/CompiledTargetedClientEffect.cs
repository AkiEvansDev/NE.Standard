using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// The compiled twin of a <see cref="TargetedClientEffect"/>, carrying the resolved address instead of a reference.
/// </summary>
public abstract class CompiledTargetedClientEffect(UIComponentAddress target) : ClientEffect
{
    /// <summary>
    /// Gets the target component address.
    /// </summary>
    public UIComponentAddress Target { get; } = target;
}
