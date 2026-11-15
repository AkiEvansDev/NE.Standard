using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the full-height modal editor of an expandable multi-line input (<c>TextAreaComponent</c>, <c>CodeInputComponent</c>).
/// </summary>
public sealed class ExpandFieldEffect : TargetedClientEffect
{
    /// <summary>
    /// Creates an effect aimed at the given target component.
    /// </summary>
    public ExpandFieldEffect(UIComponentReference target)
        : base(target)
    { }

    /// <summary>
    /// Creates an effect that opens the modal editor of the input identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public ExpandFieldEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <summary>
    /// Creates an effect that opens the modal editor of <paramref name="targetComponent"/>.
    /// </summary>
    public ExpandFieldEffect(IBindableComponent targetComponent, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponent, dynamicParameters))
    { }

    [JsonConstructor]
    internal ExpandFieldEffect(UIComponentAddress? resolvedTarget)
        : base(resolvedTarget)
    { }

    private ExpandFieldEffect(UIComponentAddress resolvedTarget, UIComponentReference target)
        : base(resolvedTarget, target)
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.ExpandField;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return ResolvedTarget is not null ? this : new ExpandFieldEffect(resolver.ResolveComponent(Target), Target);
    }
}
