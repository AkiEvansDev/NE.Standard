using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to focus a component.
/// </summary>
public sealed class FocusEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that focuses the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public FocusEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that focuses the given target component.
    /// </summary>
    public FocusEffect(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.Focus;

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledFocusEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledFocusEffect(UIComponentAddress target) : ClientEffect
{
    public override ClientEffectKind Kind => ClientEffectKind.Focus;

    public UIComponentAddress Target { get; } = target;
}
