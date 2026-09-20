using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to take a component out of the layout — the room it held closes up; the pair to
/// <see cref="HideEffect"/>, which leaves the room where it is.
/// </summary>
public sealed class CollapseEffect(UIComponentReference target) : TargetedClientEffect(target)
{
    /// <summary>
    /// Creates an effect that collapses the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public CollapseEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Collapse;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledCollapseEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledCollapseEffect(UIComponentAddress target) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.Collapse;
}
