using System;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to show a component.
/// </summary>
public sealed class ShowEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that shows the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public ShowEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that shows the given target component.
    /// </summary>
    public ShowEffect(UIComponentReference target)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(target.Id);
        Target = target;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.Show;

    /// <summary>
    /// Gets the target component reference.
    /// </summary>
    public UIComponentReference Target { get; }

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledShowEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledShowEffect(UIComponentAddress target) : ClientEffect
{
    public override ClientEffectKind Kind => ClientEffectKind.Show;

    public UIComponentAddress Target { get; } = target;
}
