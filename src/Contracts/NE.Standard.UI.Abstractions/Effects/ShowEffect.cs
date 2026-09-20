using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to show a component.
/// </summary>
public sealed class ShowEffect(UIComponentReference target) : TargetedClientEffect(target)
{
    /// <summary>
    /// Creates an effect that shows the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public ShowEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Show;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledShowEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledShowEffect(UIComponentAddress target) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.Show;
}
