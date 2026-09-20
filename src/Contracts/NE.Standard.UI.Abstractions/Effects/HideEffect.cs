using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to hide a component while it keeps the room it holds, unlike <see cref="CollapseEffect"/>.
/// </summary>
public sealed class HideEffect(UIComponentReference target) : TargetedClientEffect(target)
{
    /// <summary>
    /// Creates an effect that hides the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public HideEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Hide;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledHideEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledHideEffect(UIComponentAddress target) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.Hide;
}
