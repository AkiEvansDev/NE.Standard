using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to hide a component.
/// </summary>
public sealed class HideEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that hides the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public HideEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that hides the given target component.
    /// </summary>
    public HideEffect(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.Hide;

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledHideEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledHideEffect(UIComponentAddress target) : ClientEffect
{
    public override ClientEffectKind Kind => ClientEffectKind.Hide;

    public UIComponentAddress Target { get; } = target;
}
