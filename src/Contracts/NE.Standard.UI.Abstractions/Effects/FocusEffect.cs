using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to focus a component.
/// </summary>
public sealed class FocusEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect aimed at the given target component.
    /// </summary>
    public FocusEffect(UIComponentReference target)
        : base(target)
    { }

    /// <summary>
    /// Creates an effect that focuses the component identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public FocusEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that focuses <paramref name="targetComponent"/>.
    /// </summary>
    public FocusEffect(IBindableComponent targetComponent, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters))
    { }

    [JsonConstructor]
    internal FocusEffect(UIComponentAddress? resolvedTarget)
        : base(resolvedTarget)
    { }

    private FocusEffect(UIComponentAddress resolvedTarget, UIComponentReference target)
        : base(resolvedTarget, target)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.Focus;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return ResolvedTarget is not null ? this : new FocusEffect(resolver.ResolveComponent(Target), Target);
    }
}
