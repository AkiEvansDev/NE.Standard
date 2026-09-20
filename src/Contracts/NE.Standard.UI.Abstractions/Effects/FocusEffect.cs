using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to focus a component.
/// </summary>
public sealed class FocusEffect(UIComponentReference target) : TargetedClientEffect(target)
{
    /// <summary>
    /// Creates an effect that focuses the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public FocusEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Focus;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledFocusEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledFocusEffect(UIComponentAddress target) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.Focus;

    /// <inheritdoc />
    public override bool CanRunInInteraction => true;
}
